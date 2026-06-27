export interface ShiprocketItem {
  name: string;
  sku: string;
  units: number;
  selling_price: number;
}

export interface BookShipmentParams {
  orderId: string;
  orderDate: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  pincode: string;
  items: ShiprocketItem[];
  totalValue: number;
}

export interface BookShipmentResult {
  success: boolean;
  awbNumber?: string;
  shipmentId?: string;
  trackingUrl?: string;
  error?: string;
}

/**
 * Books a shipment on Shiprocket API (or falls back to mock in dev/sandbox mode)
 */
export async function bookShipment(params: BookShipmentParams): Promise<BookShipmentResult> {
  const email = process.env.SHIPROCKET_EMAIL;
  const password = process.env.SHIPROCKET_PASSWORD;

  if (!email || !password || email === "xxxx") {
    // If credentials are not configured, fall back to mock sandbox tracking generation
    const mockAwb = `SR${Math.floor(10000000000 + Math.random() * 90000000000)}`;
    const mockShipmentId = `SHP${Math.floor(10000000 + Math.random() * 90000000)}`;
    
    return {
      success: true,
      awbNumber: mockAwb,
      shipmentId: mockShipmentId,
      trackingUrl: `https://shiprocket.co/tracking/${mockAwb}`,
    };
  }

  try {
    // 1. Authenticate with Shiprocket
    const authRes = await fetch("https://apiv2.shiprocket.in/v1/external/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (!authRes.ok) {
      throw new Error("Shiprocket authentication failed");
    }

    const { token } = await authRes.json();

    // 2. Submit order details to book shipment
    const orderPayload = {
      order_id: params.orderId,
      order_date: params.orderDate,
      pickup_location: "Primary Warehouse", // Default pickup address
      billing_customer_name: params.customerName,
      billing_last_name: "",
      billing_address: params.addressLine1,
      billing_address_2: params.addressLine2 || "",
      billing_city: params.city,
      billing_pincode: params.pincode,
      billing_state: params.state,
      billing_country: "India",
      billing_email: params.customerEmail,
      billing_phone: params.customerPhone,
      shipping_is_billing: true,
      order_items: params.items.map((item) => ({
        name: item.name,
        sku: item.sku || "MYSTERY-BOX",
        units: item.units,
        selling_price: item.selling_price,
      })),
      payment_method: "Prepaid",
      sub_total: params.totalValue,
      length: 15, // standard box dims in cm
      width: 15,
      height: 15,
      weight: 0.5, // standard box weight in kg
    };

    const bookingRes = await fetch("https://apiv2.shiprocket.in/v1/external/shipments/create/adhoc", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(orderPayload),
    });

    if (!bookingRes.ok) {
      const errorData = await bookingRes.json();
      throw new Error(errorData.message || "Failed to create shipment on Shiprocket");
    }

    const bookingData = await bookingRes.json();

    return {
      success: true,
      awbNumber: bookingData.awb_code,
      shipmentId: bookingData.shipment_id?.toString(),
      trackingUrl: `https://shiprocket.co/tracking/${bookingData.awb_code}`,
    };
  } catch (err: any) {
    console.error("[Shiprocket API Error]:", err.message);
    return {
      success: false,
      error: err.message || "Unknown shipping booking failure",
    };
  }
}
