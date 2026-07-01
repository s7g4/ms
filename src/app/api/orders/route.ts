import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { generateBoxAllocation } from "@/lib/mystery-engine";
import { createRazorpayOrder } from "@/lib/payments/razorpay";
import { createPaymentIntent } from "@/lib/payments/stripe";
import { sendEmail } from "@/lib/email";
import { OrderConfirmation } from "@/lib/email/templates";

export async function POST(req: Request) {
  try {
    const reqHeaders = await headers();
    const session = await auth.api.getSession({
      headers: reqHeaders,
    });

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const {
      addressId,
      newAddress,
      items,
      paymentProvider, // "RAZORPAY" | "STRIPE" | "COD"
      couponCode,
      notes,
    } = await req.json();

    if (!items || !Array.isArray(items) || items.length === 0 || !paymentProvider) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // 1. Validate Address
    let finalAddressId = addressId;
    if (newAddress) {
      const createdAddress = await prisma.address.create({
        data: {
          userId: session.user.id,
          name: newAddress.name,
          phone: newAddress.phone,
          line1: newAddress.line1,
          line2: newAddress.line2,
          city: newAddress.city,
          state: newAddress.state,
          pincode: newAddress.pincode,
          country: newAddress.country || "India",
          isDefault: newAddress.isDefault || false,
        },
      });
      finalAddressId = createdAddress.id;
    }

    if (!finalAddressId) {
      return NextResponse.json({ error: "Shipping address is required" }, { status: 400 });
    }

    const addressRecord = await prisma.address.findUnique({
      where: { id: finalAddressId },
    });

    if (!addressRecord || addressRecord.userId !== session.user.id) {
      return NextResponse.json({ error: "Invalid shipping address" }, { status: 400 });
    }

    // 2. Calculate Pricing
    let subtotal = 0;
    const validatedItems: {
      mysteryBoxId: string;
      name: string;
      price: number;
      quantity: number;
      selectedVariant: string | null;
      unwantedNote: string | null;
      wantedNote: string | null;
      box: NonNullable<Awaited<ReturnType<typeof prisma.mysteryBox.findUnique>>>;
    }[] = [];

    for (const item of items) {
      const box = await prisma.mysteryBox.findUnique({
        where: { id: item.mysteryBoxId, isActive: true },
      });

      if (!box) {
        return NextResponse.json({ error: `Mystery box with ID ${item.mysteryBoxId} not found` }, { status: 400 });
      }

      if (box.stock !== null && box.stock < item.quantity) {
        return NextResponse.json({ error: `Not enough stock for ${box.name}. Only ${box.stock} left!` }, { status: 400 });
      }

      let itemPrice = box.price;
      if (item.selectedVariant) {
        const variants = (box.variants as any[]) || [];
        const variant = variants.find((v: any) => v.name === item.selectedVariant);
        if (variant) {
          itemPrice = variant.price;
        } else {
          return NextResponse.json({ error: `Variant "${item.selectedVariant}" not found for ${box.name}` }, { status: 400 });
        }
      }

      subtotal += itemPrice * item.quantity;
      validatedItems.push({
        mysteryBoxId: box.id,
        name: box.name,
        price: itemPrice,
        quantity: item.quantity,
        selectedVariant: item.selectedVariant || null,
        unwantedNote: item.unwantedNote || null,
        wantedNote: item.wantedNote || null,
        box,
      });
    }

    // 3. Apply Coupon
    let discount = 0;
    let isFreeShipping = false;
    let appliedCoupon = null;

    if (couponCode) {
      const coupon = await prisma.coupon.findUnique({
        where: { code: couponCode.toUpperCase(), isActive: true },
      });

      if (coupon) {
        const meetsMinOrder = !coupon.minOrder || subtotal >= coupon.minOrder;
        const withinUsageLimit = coupon.usageLimit === null || coupon.usedCount < coupon.usageLimit;
        const notExpired = !coupon.expiresAt || new Date(coupon.expiresAt) > new Date();

        if (meetsMinOrder && withinUsageLimit && notExpired) {
          appliedCoupon = coupon;
          if (coupon.type === "PERCENT") {
            discount = subtotal * (coupon.value / 100);
            if (coupon.maxDiscount !== null && discount > coupon.maxDiscount) {
              discount = coupon.maxDiscount;
            }
          } else if (coupon.type === "FIXED") {
            discount = coupon.value;
            if (discount > subtotal) {
              discount = subtotal;
            }
          } else if (coupon.type === "FREE_SHIPPING") {
            isFreeShipping = true;
          }
        }
      }
    }

    // 4. Shipping costs
    let shipping = subtotal >= 499 || isFreeShipping ? 0 : 59;
    
    // Add COD handling fee
    if (paymentProvider === "COD") {
      shipping += 50; 
    }

    const total = subtotal - discount + shipping;

    // 5. Create Order (in Transaction)
    const order = await prisma.$transaction(async (tx) => {
      // Create initial order record
      const createdOrder = await tx.order.create({
        data: {
          userId: session.user.id,
          addressId: finalAddressId,
          status: paymentProvider === "COD" ? "CONFIRMED" : "PENDING",
          paymentStatus: "PENDING",
          subtotal,
          discount,
          shipping,
          total,
          couponCode: appliedCoupon?.code || null,
          notes,
        },
      });

      // Save order items & decrement stock
      for (const item of validatedItems) {
        await tx.orderItem.create({
          data: {
            orderId: createdOrder.id,
            mysteryBoxId: item.mysteryBoxId,
            quantity: item.quantity,
            price: item.price,
            selectedVariant: item.selectedVariant,
            unwantedNote: item.unwantedNote,
            wantedNote: item.wantedNote,
          },
        });

        if (item.box.stock !== null) {
          await tx.mysteryBox.update({
            where: { id: item.mysteryBoxId },
            data: {
              stock: {
                decrement: item.quantity,
              },
            },
          });
        }
      }

      // If coupon used, increment count and log usage
      if (appliedCoupon) {
        await tx.coupon.update({
          where: { id: appliedCoupon.id },
          data: { usedCount: { increment: 1 } },
        });

        await tx.couponUsage.create({
          data: {
            couponId: appliedCoupon.id,
            userId: session.user.id,
            orderId: createdOrder.id,
          },
        });
      }

      return createdOrder;
    });

    // 6. Handle COD Order Allocations immediately
    if (paymentProvider === "COD") {
      const orderItems = await prisma.orderItem.findMany({
        where: { orderId: order.id },
        include: { mysteryBox: true },
      });

      const confirmedItemsForEmail = [];

      for (const item of orderItems) {
        // Run allocations for each quantity unit separately
        const allocationsList = [];
        for (let q = 0; q < item.quantity; q++) {
          const allocation = await generateBoxAllocation(item.mysteryBoxId, order.id);
          allocationsList.push(allocation.packingSlipData);
        }

        // Save allocations back to order item
        await prisma.orderItem.update({
          where: { id: item.id },
          data: {
            allocations: allocationsList,
          },
        });

        confirmedItemsForEmail.push({
          name: item.mysteryBox.name,
          quantity: item.quantity,
          price: Math.round(item.price * 100), // convert to paise/cents for email template
        });
      }

      // Record COD Payment in PENDING status
      await prisma.payment.create({
        data: {
          orderId: order.id,
          provider: "COD",
          amount: total,
          status: "PENDING",
        },
      });

      // Send confirmation email
      const formattedAddress = `${addressRecord.name}, ${addressRecord.line1}, ${addressRecord.line2 ? addressRecord.line2 + ", " : ""}${addressRecord.city}, ${addressRecord.state} - ${addressRecord.pincode}`;
      const estimatedDelivery = new Date();
      estimatedDelivery.setDate(estimatedDelivery.getDate() + 5);

      sendEmail({
        to: session.user.email,
        subject: `Your Stack Your Scoops Order #${order.id} is Confirmed! 🎉`,
        react: OrderConfirmation({
          customerName: session.user.name,
          orderNumber: order.id,
          orderDate: new Date(order.createdAt).toLocaleDateString(),
          items: confirmedItemsForEmail,
          subtotal: Math.round(subtotal * 100),
          shipping: Math.round(shipping * 100),
          total: Math.round(total * 100),
          shippingAddress: formattedAddress,
          estimatedDelivery: estimatedDelivery.toLocaleDateString(),
        }),
      }).catch((err) => console.error("Failed to send order confirmation email:", err));

      return NextResponse.json({
        success: true,
        orderId: order.id,
        paymentProvider: "COD",
        total,
      });
    }

    // 7. Handle Online Payments session creation
    if (paymentProvider === "RAZORPAY") {
      try {
        const razorpayOrder = await createRazorpayOrder(total, order.id);
        
        // Log transaction
        await prisma.payment.create({
          data: {
            orderId: order.id,
            provider: "RAZORPAY",
            providerOrderId: razorpayOrder.id,
            amount: total,
            status: "PENDING",
          },
        });

        return NextResponse.json({
          success: true,
          orderId: order.id,
          paymentProvider: "RAZORPAY",
          razorpayOrder,
        });
      } catch (err: any) {
        console.error("Razorpay order creation failed:", err);
        return NextResponse.json({ error: "Failed to initialize Razorpay payment session" }, { status: 500 });
      }
    }

    if (paymentProvider === "STRIPE") {
      try {
        const paymentIntent = await createPaymentIntent(total, order.id);

        // Log transaction
        await prisma.payment.create({
          data: {
            orderId: order.id,
            provider: "STRIPE",
            providerPaymentId: paymentIntent.id,
            amount: total,
            status: "PENDING",
          },
        });

        return NextResponse.json({
          success: true,
          orderId: order.id,
          paymentProvider: "STRIPE",
          clientSecret: paymentIntent.client_secret,
        });
      } catch (err: any) {
        console.error("Stripe payment intent failed:", err);
        return NextResponse.json({ error: "Failed to initialize Stripe payment session" }, { status: 500 });
      }
    }

    return NextResponse.json({ error: "Unsupported payment provider" }, { status: 400 });
  } catch (error: any) {
    console.error("[Create Order API Error]:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const id = url.searchParams.get("id");

    const reqHeaders = await headers();
    const session = await auth.api.getSession({
      headers: reqHeaders,
    });

    if (id) {
      const order = await prisma.order.findUnique({
        where: { id },
        include: {
          address: true,
          items: {
            include: { mysteryBox: true },
          },
        },
      });

      if (!order) {
        return NextResponse.json({ success: false, error: "Order not found" }, { status: 404 });
      }

      // Check if user is owner or admin
      const isOwner = session && session.user.id === order.userId;
      const isAdmin = session && (session.user as { role?: string }).role === "ADMIN";

      if (isOwner || isAdmin) {
        // Return full order details
        return NextResponse.json({ success: true, order });
      } else {
        // Return public tracking fields ONLY for guest tracking
        return NextResponse.json({
          success: true,
          order: {
            id: order.id,
            status: order.status,
            createdAt: order.createdAt,
            trackingNumber: order.trackingNumber,
            trackingUrl: order.trackingUrl,
          },
        });
      }
    }

    // If no ID provided, return user's order history
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const orders = await prisma.order.findMany({
      where: { userId: session.user.id },
      include: {
        items: {
          include: { mysteryBox: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ success: true, orders });
  } catch (error: any) {
    console.error("[Get Order API Error]:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
