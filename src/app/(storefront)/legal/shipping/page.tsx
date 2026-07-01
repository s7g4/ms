import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Shipping Policy | Stack Your Scoops",
  description:
    "Everything about how Stack Your Scoops ships your mystery boxes across India — delivery times, carriers, tracking, and more.",
};

const TOC = [
  { id: "coverage", label: "Delivery Coverage" },
  { id: "processing", label: "Order Processing Time" },
  { id: "delivery-time", label: "Delivery Timeframes" },
  { id: "charges", label: "Shipping Charges" },
  { id: "tracking", label: "Tracking Your Order" },
  { id: "failed-delivery", label: "Failed Delivery Attempts" },
  { id: "lost-shipment", label: "Lost Shipments" },
  { id: "contact", label: "Contact Us" },
];

export default function ShippingPolicyPage() {
  return (
    <div className="container mx-auto px-4 max-w-3xl py-16 space-y-12">
      {/* Hero */}
      <div className="space-y-3">
        <p className="text-accent-purple text-xs font-semibold uppercase tracking-widest">
          Legal
        </p>
        <h1 className="text-4xl font-extrabold font-jakarta">
          Shipping Policy
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
        We want your Stack Your Scoops box to reach you as quickly and safely as
        possible. This Shipping Policy outlines how we handle order dispatch,
        delivery timelines, and what to do if something goes wrong in transit.
        By placing an order on our platform, you agree to the terms set out
        below.
      </p>

      <section id="coverage" className="space-y-4">
        <h2 className="text-2xl font-bold font-jakarta gradient-text">
          1. Delivery Coverage
        </h2>
        <div className="text-text-muted text-sm leading-relaxed space-y-3">
          <p>
            Stack Your Scoops currently ships to <strong className="text-text-primary">all serviceable pincodes across India</strong>,
            including metro cities, Tier 2 &amp; Tier 3 cities, and most rural
            areas. During checkout, our system automatically validates your
            pincode against our logistics partner network to confirm
            serviceability.
          </p>
          <p>
            We do <strong className="text-text-primary">not currently ship internationally</strong>.
            We are working to expand our shipping capabilities to South East
            Asia, UAE, USA, and other regions. Subscribe to our newsletter to
            be notified when international shipping launches.
          </p>
          <p>
            Certain remote pincodes in northeastern states (Arunachal Pradesh,
            Nagaland, Mizoram, etc.) and island territories (Lakshadweep,
            Andaman &amp; Nicobar) may experience extended delivery times or
            limited carrier availability. In such cases, we will contact you
            prior to dispatch.
          </p>
        </div>
      </section>

      <section id="processing" className="space-y-4">
        <h2 className="text-2xl font-bold font-jakarta gradient-text">
          2. Order Processing Time
        </h2>
        <div className="text-text-muted text-sm leading-relaxed space-y-3">
          <p>
            All mystery boxes are custom-curated and packed after you place
            your order. Our standard processing time is{" "}
            <strong className="text-text-primary">1–2 business days</strong> from the
            time of confirmed payment. Orders placed before 12 PM IST on a
            business day are typically dispatched the same evening.
          </p>
          <p>
            During peak periods (festival seasons, flash sales, new box
            launches), processing time may extend to{" "}
            <strong className="text-text-primary">3–5 business days</strong>. We will
            prominently communicate any such delays on our website and via
            email notifications.
          </p>
          <p>
            For prepaid orders (online payment), processing begins immediately
            upon payment confirmation. For COD (Cash on Delivery) orders,
            processing begins after address verification, which may take an
            additional 4–6 hours.
          </p>
        </div>
      </section>

      <section id="delivery-time" className="space-y-4">
        <h2 className="text-2xl font-bold font-jakarta gradient-text">
          3. Delivery Timeframes
        </h2>
        <div className="text-text-muted text-sm leading-relaxed space-y-3">
          <p>
            Delivery timeframes after dispatch depend on your location:
          </p>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="border-b border-purple-500/20">
                  <th className="text-left py-3 pr-4 text-text-primary font-semibold">
                    Location Type
                  </th>
                  <th className="text-left py-3 pr-4 text-text-primary font-semibold">
                    Standard Shipping
                  </th>
                  <th className="text-left py-3 text-text-primary font-semibold">
                    Express Shipping
                  </th>
                </tr>
              </thead>
              <tbody className="space-y-2">
                {[
                  ["Metro Cities (Delhi, Mumbai, Bengaluru, Hyderabad, Chennai, Kolkata)", "3–5 days", "1–2 days"],
                  ["Tier 2 Cities (Pune, Jaipur, Lucknow, Surat, etc.)", "4–6 days", "2–3 days"],
                  ["Tier 3 Cities & Towns", "5–8 days", "3–5 days"],
                  ["Remote / Rural Areas", "7–12 days", "Not Available"],
                ].map(([location, standard, express]) => (
                  <tr key={location} className="border-b border-purple-500/10">
                    <td className="py-3 pr-4 text-text-muted">{location}</td>
                    <td className="py-3 pr-4 text-accent-teal font-medium">{standard}</td>
                    <td className="py-3 text-accent-yellow font-medium">{express}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p>
            These are estimated delivery times and are not guaranteed. Delays
            may occur due to natural calamities, public holidays, carrier
            network issues, or high seasonal volume.
          </p>
        </div>
      </section>

      <section id="charges" className="space-y-4">
        <h2 className="text-2xl font-bold font-jakarta gradient-text">
          4. Shipping Charges
        </h2>
        <div className="text-text-muted text-sm leading-relaxed space-y-3">
          <p>
            We offer <strong className="text-text-primary">FREE standard shipping</strong> on
            all prepaid orders above{" "}
            <strong className="text-text-primary">₹499</strong>. For orders below this
            threshold, a flat shipping fee of{" "}
            <strong className="text-text-primary">₹49</strong> applies.
          </p>
          <p>
            <strong className="text-text-primary">Express Shipping</strong> is available
            for select pincodes at an additional charge of{" "}
            <strong className="text-text-primary">₹99</strong>. The availability of
            express shipping at your pincode will be indicated during checkout.
          </p>
          <p>
            <strong className="text-text-primary">COD orders</strong> incur an additional
            handling fee of <strong className="text-text-primary">₹30</strong> regardless
            of order value, due to the higher logistical cost of cash
            collection. All applicable GST on shipping charges is included in
            the displayed price.
          </p>
        </div>
      </section>

      <section id="tracking" className="space-y-4">
        <h2 className="text-2xl font-bold font-jakarta gradient-text">
          5. Tracking Your Order
        </h2>
        <div className="text-text-muted text-sm leading-relaxed space-y-3">
          <p>
            Once your order is dispatched, you will receive an SMS and email
            notification containing your{" "}
            <strong className="text-text-primary">AWB (Air Waybill) tracking number</strong>{" "}
            and the name of the carrier. You can track your shipment in
            real-time through:
          </p>
          <ul className="list-disc list-inside space-y-1.5 ml-2">
            <li>
              The <strong className="text-text-primary">Track Order</strong> page on our
              website using your Order ID or AWB number.
            </li>
            <li>
              Your <strong className="text-text-primary">Profile → My Orders</strong> section
              for a complete timeline view.
            </li>
            <li>
              The carrier&apos;s own website using the provided AWB number
              (Bluedart, Delhivery, XpressBees, or India Post).
            </li>
          </ul>
          <p>
            Tracking updates may take up to 24 hours to appear in the carrier&apos;s
            system after dispatch. If you do not receive a tracking link within
            3 business days of your order being placed, please contact our
            support team.
          </p>
        </div>
      </section>

      <section id="failed-delivery" className="space-y-4">
        <h2 className="text-2xl font-bold font-jakarta gradient-text">
          6. Failed Delivery Attempts
        </h2>
        <div className="text-text-muted text-sm leading-relaxed space-y-3">
          <p>
            Our courier partners will attempt delivery up to{" "}
            <strong className="text-text-primary">3 times</strong> at your registered
            address. Before each attempt, the delivery agent will typically
            call the phone number on your order. Please ensure your phone is
            reachable during expected delivery hours (9 AM – 7 PM).
          </p>
          <p>
            If all delivery attempts fail, the package will be marked as{" "}
            <strong className="text-text-primary">RTO (Return to Origin)</strong> and
            shipped back to our warehouse. In this case, we will notify you
            via email and initiate a refund within 7–10 business days after
            the package is received back by us. Please note that the original
            shipping fee (if applicable) is non-refundable in this scenario.
          </p>
        </div>
      </section>

      <section id="lost-shipment" className="space-y-4">
        <h2 className="text-2xl font-bold font-jakarta gradient-text">
          7. Lost Shipments
        </h2>
        <p className="text-text-muted text-sm leading-relaxed">
          If your tracking shows no update for more than{" "}
          <strong className="text-text-primary">7 business days</strong>, or your order
          has not been delivered within{" "}
          <strong className="text-text-primary">15 business days</strong> of dispatch,
          please raise a lost shipment complaint with us. We will initiate an
          investigation with the carrier within 24 hours. If the shipment is
          confirmed lost, we will either reship your order (subject to stock
          availability) or issue a full refund including any shipping fees
          paid. Stack Your Scoops takes full responsibility for packages lost
          during transit and will never ask you to chase the carrier directly.
        </p>
      </section>

      <section id="contact" className="space-y-4">
        <h2 className="text-2xl font-bold font-jakarta gradient-text">
          8. Contact Us
        </h2>
        <p className="text-text-muted text-sm leading-relaxed">
          For any shipping-related queries, please visit our{" "}
          <Link href="/contact" className="text-accent-purple hover:underline">
            Contact page
          </Link>{" "}
          or email{" "}
          <a
            href="mailto:support@stackyourscoops.in"
            className="text-accent-purple hover:underline"
          >
            support@stackyourscoops.in
          </a>{" "}
          with your Order ID. You can also use the live chat on our website
          for instant help during business hours (Mon–Sat, 10 AM – 6 PM IST).
        </p>
      </section>
    </div>
  );
}
