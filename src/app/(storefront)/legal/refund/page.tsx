import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Refund & Returns Policy | Stack Your Scoops",
  description:
    "Our fair and transparent refund policy for mystery box orders across India. Learn when you're eligible and how to raise a request.",
};

const TOC = [
  { id: "eligibility", label: "Eligibility for Refund" },
  { id: "non-refundable", label: "Non-Refundable Situations" },
  { id: "damaged", label: "Damaged or Defective Items" },
  { id: "process", label: "How to Request a Refund" },
  { id: "timeline", label: "Refund Timeline" },
  { id: "partial", label: "Partial Refunds" },
  { id: "cancellations", label: "Order Cancellations" },
  { id: "contact", label: "Contact Us" },
];

export default function RefundPolicyPage() {
  return (
    <div className="container mx-auto px-4 max-w-3xl py-16 space-y-12">
      {/* Hero */}
      <div className="space-y-3">
        <p className="text-accent-purple text-xs font-semibold uppercase tracking-widest">
          Legal
        </p>
        <h1 className="text-4xl font-extrabold font-jakarta">
          Refund &amp; Returns Policy
        </h1>
        <p className="text-text-muted text-sm">Last updated: June 2025</p>
      </div>

      {/* TOC */}
      <div className="glass border border-purple-500/20 rounded-2xl p-6">
        <p className="text-xs text-text-muted uppercase tracking-widest font-semibold mb-4">
          Table of Contents
        </p>
        <ol className="space-y-2">
          {TOC.map((item, i) => (
            <li key={item.id}>
              <a
                href={`#${item.id}`}
                className="text-sm text-accent-purple hover:underline flex gap-2"
              >
                <span className="text-text-muted">{i + 1}.</span>
                {item.label}
              </a>
            </li>
          ))}
        </ol>
      </div>

      <p className="text-text-muted text-sm leading-relaxed">
        At Stack Your Scoops, we stand behind every box we ship. While the mystery
        nature of our product means we cannot accept returns based on personal
        preference, we have a robust policy to ensure you are always protected
        in cases of genuine issues. Please read this policy carefully before
        placing an order.
      </p>

      <section id="eligibility" className="space-y-4">
        <h2 className="text-2xl font-bold font-jakarta gradient-text">
          1. Eligibility for Refund
        </h2>
        <div className="text-text-muted text-sm leading-relaxed space-y-3">
          <p>
            You are fully eligible for a refund or replacement in the
            following situations:
          </p>
          <ul className="list-disc list-inside space-y-2 ml-2">
            <li>
              You received a <strong className="text-text-primary">damaged or defective item</strong> inside
              your mystery box due to packaging failure or transit damage.
            </li>
            <li>
              The <strong className="text-text-primary">total MRP value</strong> of items in your box is
              demonstrably lower than the price you paid for your tier (our
              Value Guarantee).
            </li>
            <li>
              Your order was{" "}
              <strong className="text-text-primary">lost in transit</strong> and not delivered
              within 15 business days of the estimated delivery date, with no
              valid tracking update.
            </li>
            <li>
              You received <strong className="text-text-primary">incorrect items</strong> that do not
              belong to the theme or category of the mystery box you purchased.
            </li>
            <li>
              You received a <strong className="text-text-primary">duplicate item</strong> that you
              already received in a previous order within the same calendar
              month (subject to our 70% uniqueness guarantee).
            </li>
          </ul>
          <p>
            All refund requests must be initiated within{" "}
            <strong className="text-text-primary">14 days</strong> of the confirmed
            delivery date as recorded by our logistics partner&apos;s tracking system.
          </p>
        </div>
      </section>

      <section id="non-refundable" className="space-y-4">
        <h2 className="text-2xl font-bold font-jakarta gradient-text">
          2. Non-Refundable Situations
        </h2>
        <div className="text-text-muted text-sm leading-relaxed space-y-3">
          <p>
            Refunds will <strong className="text-text-primary">not</strong> be issued in the
            following situations:
          </p>
          <ul className="list-disc list-inside space-y-2 ml-2">
            <li>
              You simply did not like the items in your mystery box (this is
              the nature of a surprise product).
            </li>
            <li>
              You ordered the wrong tier or theme and wish to exchange for a
              different one.
            </li>
            <li>
              The request is made more than 14 days after delivery.
            </li>
            <li>
              Items have been used, assembled, or altered from their original
              condition.
            </li>
            <li>
              Damage was caused after delivery due to improper handling by
              the customer.
            </li>
            <li>
              Store credits and promotional vouchers are non-refundable and
              have no cash value.
            </li>
          </ul>
        </div>
      </section>

      <section id="damaged" className="space-y-4">
        <h2 className="text-2xl font-bold font-jakarta gradient-text">
          3. Damaged or Defective Items
        </h2>
        <div className="text-text-muted text-sm leading-relaxed space-y-3">
          <p>
            If you receive a damaged or defective item, we sincerely apologise.
            Please do the following immediately upon opening your box:
          </p>
          <ol className="list-decimal list-inside space-y-2 ml-2">
            <li>
              Photograph the outer packaging (including any damage to the box
              itself).
            </li>
            <li>
              Photograph each damaged or defective item clearly, showing the
              issue.
            </li>
            <li>
              Do not discard any packaging or items, as we may require them
              for our courier&apos;s insurance claim process.
            </li>
            <li>
              Email{" "}
              <a
                href="mailto:support@stackyourscoops.in"
                className="text-accent-purple hover:underline"
              >
                support@stackyourscoops.in
              </a>{" "}
              with your Order ID and all photographs within 48 hours of
              delivery.
            </li>
          </ol>
          <p>
            Upon verification, we will arrange either a full replacement of
            the damaged item(s) or a full refund of your order value,
            whichever you prefer.
          </p>
        </div>
      </section>

      <section id="process" className="space-y-4">
        <h2 className="text-2xl font-bold font-jakarta gradient-text">
          4. How to Request a Refund
        </h2>
        <div className="text-text-muted text-sm leading-relaxed space-y-3">
          <p>
            To initiate a refund request, please follow these steps:
          </p>
          <ol className="list-decimal list-inside space-y-2 ml-2">
            <li>
              Log in to your Stack Your Scoops account and navigate to{" "}
              <strong className="text-text-primary">My Orders</strong>.
            </li>
            <li>
              Locate the relevant order and click{" "}
              <strong className="text-text-primary">Raise a Ticket</strong>.
            </li>
            <li>
              Select the reason category (Damaged Item, Missing Item, Lost
              Shipment, Value Guarantee Claim, etc.).
            </li>
            <li>
              Upload supporting evidence (photos, screenshots, video if
              required).
            </li>
            <li>
              Submit your ticket. You will receive a confirmation email with
              a ticket reference number within 15 minutes.
            </li>
          </ol>
          <p>
            Alternatively, you can email us directly at{" "}
            <a
              href="mailto:support@stackyourscoops.in"
              className="text-accent-purple hover:underline"
            >
              support@stackyourscoops.in
            </a>{" "}
            with your Order ID, issue description, and supporting media. Our
            team will review and respond within 24 hours on business days.
          </p>
        </div>
      </section>

      <section id="timeline" className="space-y-4">
        <h2 className="text-2xl font-bold font-jakarta gradient-text">
          5. Refund Timeline
        </h2>
        <div className="text-text-muted text-sm leading-relaxed space-y-3">
          <p>
            Once your refund request is approved by our team, the refund will
            be processed within <strong className="text-text-primary">2–3 business days</strong>.
            The time taken for the refunded amount to appear in your account
            depends on your payment method:
          </p>
          <ul className="list-disc list-inside space-y-2 ml-2">
            <li>
              <strong className="text-text-primary">UPI / Wallet (Razorpay)</strong>: Instantly
              or within 1 business day.
            </li>
            <li>
              <strong className="text-text-primary">
                Debit Card / Credit Card
              </strong>
              : 5–7 banking days depending on your bank&apos;s processing time.
            </li>
            <li>
              <strong className="text-text-primary">Net Banking</strong>: 3–5 banking days.
            </li>
            <li>
              <strong className="text-text-primary">Store Credits</strong>: Credited to your
              Stack Your Scoops wallet immediately upon approval.
            </li>
          </ul>
          <p>
            If you paid via Cash on Delivery (COD), refunds are issued as
            Store Credits to your Stack Your Scoops wallet, which can be used for
            future purchases. COD refunds to bank accounts require you to
            provide your bank details via email.
          </p>
        </div>
      </section>

      <section id="partial" className="space-y-4">
        <h2 className="text-2xl font-bold font-jakarta gradient-text">
          6. Partial Refunds
        </h2>
        <p className="text-text-muted text-sm leading-relaxed">
          In certain cases, we may offer a partial refund at our discretion.
          This typically applies when only one or two items in a multi-item
          box are affected by damage or defect, while the rest of the box is
          intact and of acceptable quality. The partial refund amount will be
          calculated based on the MRP of the affected item(s) relative to the
          total box value. We will always clearly communicate the refund
          amount before processing.
        </p>
      </section>

      <section id="cancellations" className="space-y-4">
        <h2 className="text-2xl font-bold font-jakarta gradient-text">
          7. Order Cancellations
        </h2>
        <div className="text-text-muted text-sm leading-relaxed space-y-3">
          <p>
            Orders can be cancelled and fully refunded if the cancellation
            request is made within{" "}
            <strong className="text-text-primary">1 hour</strong> of placement, before
            the order enters the packing queue. After this window, orders
            cannot be cancelled as they are already being prepared for
            dispatch.
          </p>
          <p>
            To cancel, go to{" "}
            <strong className="text-text-primary">My Orders → Cancel Order</strong>{" "}
            or contact our support team immediately at{" "}
            <a
              href="mailto:support@stackyourscoops.in"
              className="text-accent-purple hover:underline"
            >
              support@stackyourscoops.in
            </a>{" "}
            with your Order ID.
          </p>
          <p>
            Stack Your Scoops reserves the right to cancel orders in cases of
            suspected fraud, pricing errors, or stock unavailability. In such
            cases, a full refund will be issued automatically.
          </p>
        </div>
      </section>

      <section id="contact" className="space-y-4">
        <h2 className="text-2xl font-bold font-jakarta gradient-text">
          8. Contact Us
        </h2>
        <p className="text-text-muted text-sm leading-relaxed">
          For any refund or return related queries, please visit our{" "}
          <Link href="/contact" className="text-accent-purple hover:underline">
            Contact page
          </Link>{" "}
          or email{" "}
          <a
            href="mailto:support@stackyourscoops.in"
            className="text-accent-purple hover:underline"
          >
            support@stackyourscoops.in
          </a>
          . Our team operates Monday to Saturday, 10 AM – 6 PM IST, and we
          aim to resolve all refund cases within 48 hours.
        </p>
      </section>
    </div>
  );
}
