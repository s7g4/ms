import Stripe from "stripe";

let stripeClient: Stripe | null = null;

export function getStripe() {
  if (!stripeClient && process.env.STRIPE_SECRET_KEY) {
    stripeClient = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: "2026-06-24.dahlia",
    });
  }
  return stripeClient;
}

export async function createPaymentIntent(amount: number, orderId: string) {
  const stripe = getStripe();
  if (!stripe) throw new Error("Stripe not configured");
  return stripe.paymentIntents.create({
    amount: Math.round(amount * 100),
    currency: "inr",
    metadata: { orderId },
  });
}
