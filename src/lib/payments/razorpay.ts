import Razorpay from "razorpay";
import crypto from "crypto";

let razorpayClient: Razorpay | null = null;

export function getRazorpay() {
  if (!razorpayClient && process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET) {
    razorpayClient = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });
  }
  return razorpayClient;
}

export async function createRazorpayOrder(amount: number, orderId: string) {
  const rz = getRazorpay();
  if (!rz) throw new Error("Razorpay not configured");
  return rz.orders.create({
    amount: Math.round(amount * 100), // paise
    currency: "INR",
    receipt: orderId,
    notes: { orderId },
  });
}

export function verifyRazorpaySignature(
  razorpayOrderId: string,
  razorpayPaymentId: string,
  signature: string
): boolean {
  const body = razorpayOrderId + "|" + razorpayPaymentId;
  const expected = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
    .update(body)
    .digest("hex");
  return expected === signature;
}
