import type { Metadata } from "next";
import Link from "next/link";
import {
  FileText,
  ShoppingCart,
  AlertTriangle,
  Scale,
  UserX,
  Gavel,
  RefreshCw,
  Mail,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Terms of Service | MysteryScoop",
  description:
    "Read the Terms of Service governing your use of MysteryScoop, India's premium mystery box ecommerce platform.",
};

const sections = [
  { id: "acceptance-of-terms", label: "Acceptance of Terms" },
  { id: "eligibility-and-accounts", label: "Eligibility & Accounts" },
  { id: "products-and-orders", label: "Products & Orders" },
  { id: "pricing-gst-and-payments", label: "Pricing, GST & Payments" },
  { id: "prohibited-conduct", label: "Prohibited Conduct" },
  { id: "intellectual-property", label: "Intellectual Property" },
  { id: "limitation-of-liability", label: "Limitation of Liability" },
  { id: "governing-law", label: "Governing Law & Disputes" },
  { id: "changes-to-terms", label: "Changes to Terms" },
  { id: "contact-us", label: "Contact Us" },
];

export default function TermsOfServicePage() {
  return (
    <div className="max-w-3xl mx-auto py-16 px-4">
      {/* Hero */}
      <div className="text-center space-y-4 mb-12">
        <p className="text-accent-purple text-xs font-semibold uppercase tracking-widest">
          Legal
        </p>
        <h1 className="text-4xl md:text-5xl font-extrabold font-jakarta text-text-primary leading-tight">
          Terms of Service
        </h1>
        <p className="text-text-muted text-sm">Last updated: June 2025</p>
      </div>

      {/* Table of Contents */}
      <nav className="glass rounded-2xl p-6 mb-12 border border-accent-purple/20">
        <p className="text-xs font-semibold uppercase tracking-widest text-accent-purple mb-4">
          Table of Contents
        </p>
        <ol className="space-y-2">
          {sections.map((s, i) => (
            <li key={s.id}>
              <Link
                href={`#${s.id}`}
                className="flex items-center gap-3 text-text-muted hover:text-text-primary transition-colors text-sm group"
              >
                <span className="w-6 h-6 rounded-full bg-accent-purple/10 border border-accent-purple/30 flex items-center justify-center text-xs text-accent-purple font-bold shrink-0 group-hover:bg-accent-purple/20 transition-colors">
                  {i + 1}
                </span>
                {s.label}
              </Link>
            </li>
          ))}
        </ol>
      </nav>

      {/* Intro */}
      <div className="glass-card p-6 mb-10 rounded-2xl">
        <p className="text-text-muted leading-relaxed text-sm">
          Please read these Terms of Service ("Terms") carefully before using
          the MysteryScoop platform, operated by{" "}
          <span className="gradient-text font-semibold">
            MysteryScoop Internet Private Limited
          </span>{" "}
          ("Company", "we", "us", or "our"), a company incorporated under the
          Companies Act, 2013. By accessing our website or placing an order, you
          ("User", "Customer", "you") agree to be bound by these Terms and our
          Privacy Policy. If you do not agree, please discontinue use of our
          platform immediately.
        </p>
      </div>

      <div className="space-y-12">
        {/* Section 1 */}
        <section id="acceptance-of-terms">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-accent-purple/10 border border-accent-purple/20 flex items-center justify-center">
              <FileText className="w-5 h-5 text-accent-purple" />
            </div>
            <h2 className="text-2xl font-bold font-jakarta gradient-text">
              Acceptance of Terms
            </h2>
          </div>
          <div className="space-y-4 text-text-muted leading-relaxed text-sm">
            <p>
              By creating an account, subscribing to a mystery box plan,
              purchasing a one-time mystery scoop, or otherwise accessing any
              feature of the MysteryScoop platform, you confirm that you have
              read, understood, and agree to be legally bound by these Terms, as
              well as our Privacy Policy, Refund Policy, and Shipping Policy,
              each of which is incorporated herein by reference.
            </p>
            <p>
              These Terms constitute a binding agreement between you and
              MysteryScoop Internet Private Limited and are governed by the laws
              of India, including but not limited to the Indian Contract Act,
              1872, the Consumer Protection Act, 2019, the Information
              Technology Act, 2000 (and its amendments), and the Central Goods
              and Services Tax Act, 2017. These Terms are subject to change, and
              continued use of the platform following any modification
              constitutes acceptance of the updated Terms.
            </p>
            <p>
              If you are accessing our platform on behalf of a business entity
              (e.g., purchasing mystery boxes for corporate gifting), you
              represent that you have the authority to bind that entity to these
              Terms, and in such case, "you" and "your" will refer to that
              entity. For bulk or corporate orders exceeding ₹50,000, a
              separate commercial agreement may be required — please contact our
              business team at{" "}
              <span className="text-accent-teal">biz@mysteryscoop.in</span>.
            </p>
          </div>
        </section>

        {/* Section 2 */}
        <section id="eligibility-and-accounts">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-accent-pink/10 border border-accent-pink/20 flex items-center justify-center">
              <UserX className="w-5 h-5 text-accent-pink" />
            </div>
            <h2 className="text-2xl font-bold font-jakarta gradient-text">
              Eligibility &amp; Accounts
            </h2>
          </div>
          <div className="space-y-4 text-text-muted leading-relaxed text-sm">
            <p>
              You must be at least 18 years of age to create an account and make
              purchases on MysteryScoop. If you are between 13 and 17 years of
              age, you may use the platform only with the express consent and
              active supervision of a parent or legal guardian who agrees to
              these Terms on your behalf. We do not knowingly collect personal
              data from children under 13 years of age.
            </p>
            <p>
              You are responsible for maintaining the confidentiality of your
              account credentials, including your password or OTP. You agree to
              notify us immediately at{" "}
              <span className="text-accent-teal">
                support@mysteryscoop.in
              </span>{" "}
              if you suspect any unauthorised access to your account. We are not
              liable for any loss or damage arising from your failure to protect
              your account credentials. Each user is permitted one personal
              account. Creating multiple accounts to exploit promotions or
              referral bonuses constitutes a breach of these Terms and may
              result in permanent account termination.
            </p>
            <p>
              We reserve the right to refuse account creation, suspend, or
              terminate accounts at our sole discretion if we determine that a
              user has violated these Terms, provided false information during
              registration, engaged in fraudulent activity, or is attempting to
              misuse our platform. In such cases, any pending orders may be
              cancelled and refunds processed at our discretion, subject to our
              Refund Policy.
            </p>
          </div>
        </section>

        {/* Section 3 */}
        <section id="products-and-orders">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-accent-teal/10 border border-accent-teal/20 flex items-center justify-center">
              <ShoppingCart className="w-5 h-5 text-accent-teal" />
            </div>
            <h2 className="text-2xl font-bold font-jakarta gradient-text">
              Products &amp; Orders
            </h2>
          </div>
          <div className="space-y-4 text-text-muted leading-relaxed text-sm">
            <p>
              MysteryScoop offers curated mystery boxes containing kawaii
              collectibles, anime merchandise, aesthetic stationery, lifestyle
              accessories, and related items. The exact contents of each mystery
              box are determined by our proprietary weighted randomisation
              algorithm, and specific items cannot be guaranteed or requested.
              Product imagery on our platform is representative of the theme and
              category — actual items may differ.
            </p>
            <p>
              By placing an order, you acknowledge and accept the inherent
              element of surprise in mystery box products. MysteryScoop
              guarantees that the aggregate Market Retail Price (MRP) of all
              items in your box will exceed the price you paid. However, you
              accept that individual item preferences may vary, and dissatisfaction
              with specific items (as opposed to damaged, missing, or
              counterfeit items) does not constitute grounds for a refund under
              our Refund Policy.
            </p>
            <p>
              Orders are confirmed upon successful payment. We reserve the right
              to cancel an order if an item goes out of stock after your
              purchase, if we detect suspected fraud, or if there is a
              significant pricing error on our platform. In such cases, you will
              receive a full refund to your original payment method within 5–7
              business days. Once an order has been dispatched with a valid AWB
              (Air Waybill) tracking number, it cannot be cancelled.
            </p>
            <p>
              For subscription plans (monthly, bi-monthly), your box will be
              curated and dispatched within the first 5 working days of each
              cycle. Subscription renewals are automatically charged to your
              saved payment method 2 days before the renewal date. You may pause
              or cancel your subscription at any time from your Account
              Settings, effective from the next billing cycle.
            </p>
          </div>
        </section>

        {/* Section 4 */}
        <section id="pricing-gst-and-payments">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-accent-yellow/10 border border-accent-yellow/20 flex items-center justify-center">
              <Scale className="w-5 h-5 text-accent-yellow" />
            </div>
            <h2 className="text-2xl font-bold font-jakarta gradient-text">
              Pricing, GST &amp; Payments
            </h2>
          </div>
          <div className="space-y-4 text-text-muted leading-relaxed text-sm">
            <p>
              All prices displayed on our platform are in Indian Rupees (INR)
              and are inclusive of applicable Goods and Services Tax (GST).
              MysteryScoop is registered under the Central Goods and Services
              Tax Act, 2017, with GSTIN 29AABCM1234R1ZP. A GST-compliant
              invoice is automatically generated and emailed to you upon
              successful order confirmation.
            </p>
            <p>
              Payments are processed exclusively through our payment gateway
              partner, Razorpay, and we accept UPI (all major apps), credit
              cards, debit cards, net banking (all major Indian banks), and
              popular wallets including Paytm, PhonePe, Amazon Pay, and Freecharge.
              We do not accept cash on delivery (COD) for mystery box orders due
              to their curated and personalised nature. EMI options may be
              available for orders above ₹3,000 subject to your bank's
              eligibility criteria.
            </p>
            <p>
              MysteryScoop reserves the right to modify prices at any time
              without prior notice. However, the price applicable at the time
              you successfully complete your order will be honoured. Promotional
              discounts, coupon codes, and referral credits are subject to their
              individual terms and expiry dates and cannot be combined unless
              explicitly stated.
            </p>
          </div>
        </section>

        {/* Section 5 */}
        <section id="prohibited-conduct">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-accent-pink/10 border border-accent-pink/20 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-accent-pink" />
            </div>
            <h2 className="text-2xl font-bold font-jakarta gradient-text">
              Prohibited Conduct
            </h2>
          </div>
          <div className="space-y-4 text-text-muted leading-relaxed text-sm">
            <p>
              You agree not to engage in any of the following prohibited
              activities while using our platform. Violation of any of these
              prohibitions may result in immediate account suspension or
              termination, cancellation of pending orders, and where applicable,
              legal action.
            </p>
            <ul className="space-y-2 pl-4 border-l-2 border-accent-pink/30">
              <li>Using automated bots, scrapers, or scripts to access our platform, extract product data, or place orders.</li>
              <li>Attempting to reverse-engineer our mystery box algorithm or exploit its outputs for arbitrage.</li>
              <li>Initiating fraudulent chargebacks for orders that were legitimately fulfilled and delivered.</li>
              <li>Creating multiple accounts to abuse new-user promotional offers or referral programmes.</li>
              <li>Posting false, defamatory, or misleading product reviews or community content.</li>
              <li>Reselling mystery box items purchased from MysteryScoop through unofficial channels without our written consent.</li>
              <li>Attempting to access other users' account data, payment information, or order history.</li>
              <li>Using our platform in any way that violates applicable Indian laws, including the IT Act, 2000 and the Consumer Protection Act, 2019.</li>
            </ul>
          </div>
        </section>

        {/* Section 6 */}
        <section id="intellectual-property">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-accent-purple/10 border border-accent-purple/20 flex items-center justify-center">
              <FileText className="w-5 h-5 text-accent-purple" />
            </div>
            <h2 className="text-2xl font-bold font-jakarta gradient-text">
              Intellectual Property
            </h2>
          </div>
          <div className="space-y-4 text-text-muted leading-relaxed text-sm">
            <p>
              All content on the MysteryScoop platform — including our logo, brand
              name, website design, product photography, written descriptions,
              mystery box theme names, the "MysteryScoop" wordmark, and our
              proprietary randomisation algorithm — is the exclusive intellectual
              property of MysteryScoop Internet Private Limited, protected under
              the Copyright Act, 1957, the Trade Marks Act, 1999, and
              applicable Indian intellectual property law.
            </p>
            <p>
              You are granted a limited, non-exclusive, non-transferable,
              revocable licence to access and use our platform for personal,
              non-commercial purposes in accordance with these Terms. This
              licence does not permit you to reproduce, distribute, modify,
              create derivative works from, or publicly display any content from
              our platform without our prior written consent.
            </p>
            <p>
              By posting a review, photo, or unboxing content on our platform,
              you grant MysteryScoop a worldwide, royalty-free, perpetual
              licence to use, reproduce, and display such content in our
              marketing materials (including social media) with attribution.
              You retain copyright in your original content and may request
              removal at any time by contacting our support team.
            </p>
          </div>
        </section>

        {/* Section 7 */}
        <section id="limitation-of-liability">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-accent-teal/10 border border-accent-teal/20 flex items-center justify-center">
              <Scale className="w-5 h-5 text-accent-teal" />
            </div>
            <h2 className="text-2xl font-bold font-jakarta gradient-text">
              Limitation of Liability
            </h2>
          </div>
          <div className="space-y-4 text-text-muted leading-relaxed text-sm">
            <p>
              To the maximum extent permitted by applicable law, MysteryScoop
              and its directors, employees, agents, and partners shall not be
              liable for any indirect, incidental, special, consequential, or
              punitive damages arising out of or related to your use of our
              platform or products, including but not limited to lost profits,
              loss of data, or goodwill.
            </p>
            <p>
              Our total aggregate liability to you for any claim arising under
              these Terms shall not exceed the amount you paid for the specific
              order giving rise to the claim. Nothing in these Terms limits our
              liability for death or personal injury caused by our negligence,
              fraud, or any liability that cannot be excluded or limited under
              the Consumer Protection Act, 2019, or other applicable Indian
              consumer protection law.
            </p>
            <p>
              Our platform is provided "as is" without warranties of any kind,
              express or implied. We do not guarantee uninterrupted or error-free
              access to our services. We are not responsible for delays or
              failures caused by circumstances beyond our reasonable control,
              including but not limited to natural disasters, strikes, network
              outages, or logistics disruptions caused by courier partners.
            </p>
          </div>
        </section>

        {/* Section 8 */}
        <section id="governing-law">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-accent-yellow/10 border border-accent-yellow/20 flex items-center justify-center">
              <Gavel className="w-5 h-5 text-accent-yellow" />
            </div>
            <h2 className="text-2xl font-bold font-jakarta gradient-text">
              Governing Law &amp; Disputes
            </h2>
          </div>
          <div className="space-y-4 text-text-muted leading-relaxed text-sm">
            <p>
              These Terms are governed by and construed in accordance with the
              laws of India. Any dispute, controversy, or claim arising out of
              or relating to these Terms, or the breach, termination, or
              invalidity thereof, shall first be attempted to be resolved through
              good-faith negotiations between the parties.
            </p>
            <p>
              If amicable resolution is not possible within 30 days, the dispute
              shall be submitted to binding arbitration under the Arbitration
              and Conciliation Act, 1996. The arbitration shall be conducted by
              a sole arbitrator mutually agreed upon by the parties, and the seat
              of arbitration shall be Bengaluru, Karnataka. The language of
              arbitration shall be English.
            </p>
            <p>
              For consumer disputes within the meaning of the Consumer Protection
              Act, 2019, you retain the right to approach the relevant District
              Consumer Disputes Redressal Commission or the National Consumer
              Disputes Redressal Commission, regardless of the arbitration clause
              above. The courts of Bengaluru, Karnataka shall have exclusive
              jurisdiction for all other legal proceedings relating to these
              Terms.
            </p>
          </div>
        </section>

        {/* Section 9 */}
        <section id="changes-to-terms">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-accent-purple/10 border border-accent-purple/20 flex items-center justify-center">
              <RefreshCw className="w-5 h-5 text-accent-purple" />
            </div>
            <h2 className="text-2xl font-bold font-jakarta gradient-text">
              Changes to Terms
            </h2>
          </div>
          <div className="space-y-4 text-text-muted leading-relaxed text-sm">
            <p>
              We reserve the right to modify these Terms at any time. When we
              make material changes, we will update the "Last updated" date at
              the top of this page and, where required by applicable law, notify
              registered users via email or an in-platform notification at least
              7 days before the changes take effect.
            </p>
            <p>
              Your continued use of the MysteryScoop platform after any
              modifications to these Terms constitutes your acceptance of the
              revised Terms. If you do not agree to the modified Terms, you must
              discontinue use of our platform and may request account deletion
              per our Privacy Policy. We encourage you to review these Terms
              periodically to stay informed about your rights and obligations.
            </p>
          </div>
        </section>

        {/* Contact Section */}
        <section id="contact-us">
          <div className="glass rounded-2xl p-8 border border-accent-purple/20 text-center space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-accent-purple/10 border border-accent-purple/20 flex items-center justify-center mx-auto">
              <Mail className="w-6 h-6 text-accent-purple" />
            </div>
            <h2 className="text-2xl font-bold font-jakarta gradient-text">
              Contact Us
            </h2>
            <p className="text-text-muted text-sm leading-relaxed max-w-lg mx-auto">
              For any queries regarding these Terms, please reach out to our
              legal team at{" "}
              <span className="text-accent-teal font-semibold">
                legal@mysteryscoop.in
              </span>{" "}
              or visit our Help Centre. Our registered address is MysteryScoop
              Internet Private Limited, Koramangala, Bengaluru, Karnataka —
              560034.
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 mt-2 btn-primary text-sm px-6 py-3 rounded-xl"
            >
              Get in Touch
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
