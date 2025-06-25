import type { Metadata } from "next";
import Link from "next/link";
import {
  Shield,
  Lock,
  Eye,
  Database,
  Share2,
  Bell,
  Mail,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Privacy Policy | MysteryScoop",
  description:
    "Understand how MysteryScoop collects, uses, and protects your personal data in compliance with India's Digital Personal Data Protection Act, 2023.",
};

const sections = [
  { id: "information-we-collect", label: "Information We Collect" },
  { id: "how-we-use-your-data", label: "How We Use Your Data" },
  { id: "payment-and-financial-data", label: "Payment & Financial Data" },
  { id: "cookies-and-tracking", label: "Cookies & Tracking" },
  { id: "sharing-your-data", label: "Sharing Your Data" },
  { id: "your-rights", label: "Your Rights" },
  { id: "data-retention", label: "Data Retention" },
  { id: "contact-us", label: "Contact Us" },
];

export default function PrivacyPolicyPage() {
  return (
    <div className="max-w-3xl mx-auto py-16 px-4">
      {/* Hero */}
      <div className="text-center space-y-4 mb-12">
        <p className="text-accent-purple text-xs font-semibold uppercase tracking-widest">
          Legal
        </p>
        <h1 className="text-4xl md:text-5xl font-extrabold font-jakarta text-text-primary leading-tight">
          Privacy Policy
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
          MysteryScoop ("we", "our", or "us") is operated by MysteryScoop
          Internet Private Limited, a company incorporated under the Companies
          Act, 2013, with its registered office in Bengaluru, Karnataka, India.
          This Privacy Policy describes how we collect, use, disclose, and
          protect your personal information when you visit our website at{" "}
          <span className="text-accent-purple">mysteryscoop.in</span> or place
          an order with us. By using our platform, you consent to the practices
          described herein, in accordance with India's{" "}
          <span className="gradient-text font-semibold">
            Digital Personal Data Protection Act, 2023 (DPDP Act)
          </span>{" "}
          and the Information Technology (Amendment) Act, 2008.
        </p>
      </div>

      <div className="space-y-12">
        {/* Section 1 */}
        <section id="information-we-collect">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-accent-purple/10 border border-accent-purple/20 flex items-center justify-center">
              <Database className="w-5 h-5 text-accent-purple" />
            </div>
            <h2 className="text-2xl font-bold font-jakarta gradient-text">
              Information We Collect
            </h2>
          </div>
          <div className="space-y-4 text-text-muted leading-relaxed text-sm">
            <p>
              We collect personal information you provide voluntarily when you
              register an account, place an order, subscribe to our newsletter,
              or contact our support team. This includes your full name, email
              address, mobile number, shipping address (including pincode, city,
              state), and any communication preferences you specify.
            </p>
            <p>
              When you complete a purchase, our payment processing partner
              Razorpay collects billing details including UPI VPAs, card details
              (tokenised as per RBI mandate), and net banking credentials. We
              never store raw card numbers on our servers. We also collect your
              order history, wishlist data, and product review content.
            </p>
            <p>
              We automatically collect certain technical data when you visit our
              platform, including your IP address, browser type and version,
              operating system, referring URL, pages viewed, time spent on
              pages, and device identifiers. This data helps us detect fraud,
              optimise our platform performance, and improve user experience. We
              may also collect location data at city or region granularity if
              you permit location access, which we use to show relevant delivery
              estimates and regional promotional offers.
            </p>
            <p>
              If you choose to sign in using Google OAuth, we receive your name,
              email address, and profile picture from Google's OpenID Connect
              service. We do not request or store your Google account password.
              We only access the minimum scopes necessary to create and manage
              your MysteryScoop account.
            </p>
          </div>
        </section>

        {/* Section 2 */}
        <section id="how-we-use-your-data">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-accent-pink/10 border border-accent-pink/20 flex items-center justify-center">
              <Eye className="w-5 h-5 text-accent-pink" />
            </div>
            <h2 className="text-2xl font-bold font-jakarta gradient-text">
              How We Use Your Data
            </h2>
          </div>
          <div className="space-y-4 text-text-muted leading-relaxed text-sm">
            <p>
              We use your personal data primarily to fulfil your orders — this
              includes processing payments via Razorpay, generating GST
              invoices, coordinating with our logistics partners (Shiprocket,
              Delhivery, DTDC, and others) for dispatch and delivery, and
              sending you order confirmation, shipping tracking, and delivery
              notifications via email and SMS.
            </p>
            <p>
              With your consent, we use your email address and mobile number to
              send marketing communications including new mystery box launches,
              seasonal sale announcements, exclusive member offers, and curated
              newsletters. You can opt out of marketing emails at any time using
              the unsubscribe link in any email, or through your Account
              Settings page. Transactional messages (order updates, OTPs) cannot
              be opted out of as they are essential to delivering our service.
            </p>
            <p>
              We analyse aggregated, anonymised order and browsing data to
              improve our product curation, personalise your homepage
              recommendations, detect and prevent fraudulent activity, and
              conduct internal research into customer preferences. Our mystery
              box randomisation algorithm uses your past order history and
              wishlist interactions to reduce the chance of sending duplicate
              items in subscription boxes.
            </p>
            <p>
              We use your data to comply with legal obligations, including
              maintaining GST records as required under the Central Goods and
              Services Tax Act, 2017, responding to lawful government requests,
              and conducting Know Your Customer (KYC) verification where
              required by our payment partner or applicable regulations.
            </p>
          </div>
        </section>

        {/* Section 3 */}
        <section id="payment-and-financial-data">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-accent-teal/10 border border-accent-teal/20 flex items-center justify-center">
              <Lock className="w-5 h-5 text-accent-teal" />
            </div>
            <h2 className="text-2xl font-bold font-jakarta gradient-text">
              Payment &amp; Financial Data
            </h2>
          </div>
          <div className="space-y-4 text-text-muted leading-relaxed text-sm">
            <p>
              All payment transactions on MysteryScoop are processed exclusively
              through Razorpay Software Private Limited, a PCI DSS Level 1
              compliant payment aggregator regulated by the Reserve Bank of
              India (RBI). When you initiate a payment, you are interacting
              directly with Razorpay's secure payment infrastructure. We receive
              only a payment reference ID and payment status confirmation —
              never your raw card number, CVV, or banking credentials.
            </p>
            <p>
              Razorpay complies with the RBI's tokenisation guidelines, which
              means card-on-file storage (for saved cards) is handled through
              card network tokens issued by Visa, Mastercard, or RuPay — not
              actual card numbers. UPI payments are processed through the
              National Payments Corporation of India (NPCI) UPI infrastructure.
              Wallet payments (Paytm, PhonePe, Amazon Pay) are facilitated
              through respective wallet providers' APIs.
            </p>
            <p>
              MysteryScoop issues GST-compliant tax invoices for every order. We
              are registered under GST with GSTIN 29AABCM1234R1ZP (Karnataka).
              Our invoices display the applicable CGST and SGST (or IGST for
              inter-state orders) breakdown as required under the CGST Act,
              2017. These invoice records are retained for a period of 7 years
              as mandated by Indian tax law. Refund transactions, where
              applicable, are processed back to the original payment method
              within 5–7 business days, subject to your bank or payment
              provider's processing timelines.
            </p>
          </div>
        </section>

        {/* Section 4 */}
        <section id="cookies-and-tracking">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-accent-yellow/10 border border-accent-yellow/20 flex items-center justify-center">
              <Shield className="w-5 h-5 text-accent-yellow" />
            </div>
            <h2 className="text-2xl font-bold font-jakarta gradient-text">
              Cookies &amp; Tracking
            </h2>
          </div>
          <div className="space-y-4 text-text-muted leading-relaxed text-sm">
            <p>
              We use cookies, local storage, and similar technologies to operate
              our platform effectively. Essential cookies are strictly necessary
              for functions like maintaining your session state, keeping items in
              your cart, and authenticating your login — these cannot be
              disabled without impairing platform functionality.
            </p>
            <p>
              With your consent, we also deploy analytics cookies from Google
              Analytics 4 (GA4) to understand aggregate traffic patterns, page
              performance, and user flow. This data is anonymised and does not
              identify you personally. We use Meta Pixel for measuring the
              effectiveness of our Facebook and Instagram advertising campaigns.
              You can opt out of marketing and analytics cookies by selecting
              "Manage Cookie Preferences" in the cookie banner that appears on
              your first visit.
            </p>
            <p>
              We do not use third-party ad-targeting cookies for real-time
              bidding or programmatic advertising on external ad exchanges. Any
              retargeting we conduct is done through first-party data uploaded
              to Meta Custom Audiences or Google Customer Match, using hashed
              email addresses. You may opt out of interest-based advertising at
              any time through your Google Account settings at{" "}
              <span className="text-accent-teal">myaccount.google.com</span> or
              via the Digital Advertising Alliance opt-out portal.
            </p>
          </div>
        </section>

        {/* Section 5 */}
        <section id="sharing-your-data">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-accent-purple/10 border border-accent-purple/20 flex items-center justify-center">
              <Share2 className="w-5 h-5 text-accent-purple" />
            </div>
            <h2 className="text-2xl font-bold font-jakarta gradient-text">
              Sharing Your Data
            </h2>
          </div>
          <div className="space-y-4 text-text-muted leading-relaxed text-sm">
            <p>
              We do not sell your personal data to third parties. We share your
              information only with trusted service providers who assist us in
              operating our business, and only to the extent necessary. Our key
              data-sharing relationships include:
            </p>
            <ul className="space-y-2 pl-4 border-l-2 border-accent-purple/30">
              <li>
                <span className="text-accent-purple font-semibold">
                  Logistics Partners:
                </span>{" "}
                Your name, phone number, and shipping address are shared with
                our courier partners (Shiprocket, Delhivery, DTDC, Blue Dart)
                solely for delivery purposes.
              </li>
              <li>
                <span className="text-accent-purple font-semibold">
                  Razorpay:
                </span>{" "}
                Payment-related data is shared with Razorpay as detailed in the
                Payment section above.
              </li>
              <li>
                <span className="text-accent-purple font-semibold">
                  Cloud Infrastructure:
                </span>{" "}
                We host our platform on Vercel and use Neon (PostgreSQL) for our
                database. Both providers maintain SOC 2 Type II compliance.
              </li>
              <li>
                <span className="text-accent-purple font-semibold">
                  Customer Support Tools:
                </span>{" "}
                We use Crisp for live chat. Crisp may process your name and
                email when you initiate a chat session.
              </li>
            </ul>
            <p>
              We may also disclose your data when required by law, such as in
              response to a court order, a request by law enforcement under the
              Code of Criminal Procedure, 1973, or under obligations arising
              from the Information Technology Act, 2000. We will, where legally
              permitted, notify you before disclosing your personal data to
              government authorities.
            </p>
          </div>
        </section>

        {/* Section 6 */}
        <section id="your-rights">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-accent-pink/10 border border-accent-pink/20 flex items-center justify-center">
              <Bell className="w-5 h-5 text-accent-pink" />
            </div>
            <h2 className="text-2xl font-bold font-jakarta gradient-text">
              Your Rights
            </h2>
          </div>
          <div className="space-y-4 text-text-muted leading-relaxed text-sm">
            <p>
              Under India's Digital Personal Data Protection Act, 2023 (DPDP
              Act), you have the following rights with respect to your personal
              data that we process:
            </p>
            <ul className="space-y-3 pl-4 border-l-2 border-accent-pink/30">
              <li>
                <span className="text-accent-pink font-semibold">
                  Right to Access:
                </span>{" "}
                You may request a summary of the personal data we hold about
                you, along with details of how it has been processed and with
                whom it has been shared.
              </li>
              <li>
                <span className="text-accent-pink font-semibold">
                  Right to Correction:
                </span>{" "}
                You may request correction of inaccurate or incomplete personal
                data. Most basic information (name, phone, address) can be
                updated directly in your Account Settings.
              </li>
              <li>
                <span className="text-accent-pink font-semibold">
                  Right to Erasure:
                </span>{" "}
                You may request deletion of your personal data. We will comply
                unless retention is required by law (e.g., GST invoice records
                must be retained for 7 years).
              </li>
              <li>
                <span className="text-accent-pink font-semibold">
                  Right to Withdraw Consent:
                </span>{" "}
                Where processing is based on your consent (e.g., marketing
                communications), you may withdraw consent at any time without
                affecting the lawfulness of prior processing.
              </li>
              <li>
                <span className="text-accent-pink font-semibold">
                  Right to Grievance Redressal:
                </span>{" "}
                You may contact our Data Protection Officer (details below) to
                raise any grievance. We will acknowledge within 48 hours and
                respond within 30 days.
              </li>
            </ul>
            <p>
              To exercise any of these rights, please email{" "}
              <span className="text-accent-teal">
                privacy@mysteryscoop.in
              </span>{" "}
              with the subject line "Data Rights Request". We may require you to
              verify your identity before processing the request.
            </p>
          </div>
        </section>

        {/* Section 7 */}
        <section id="data-retention">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-accent-teal/10 border border-accent-teal/20 flex items-center justify-center">
              <Database className="w-5 h-5 text-accent-teal" />
            </div>
            <h2 className="text-2xl font-bold font-jakarta gradient-text">
              Data Retention
            </h2>
          </div>
          <div className="space-y-4 text-text-muted leading-relaxed text-sm">
            <p>
              We retain your personal data for as long as your account is active
              or as needed to provide services. If you request account deletion,
              we will delete your profile data, order history (where not legally
              required), and marketing preferences within 30 days of your
              verified request.
            </p>
            <p>
              Financial records, GST invoices, and transaction data are retained
              for a minimum of 7 years as mandated by the Income Tax Act, 1961,
              and the CGST Act, 2017. Server logs containing IP addresses and
              technical data are retained for 90 days and then automatically
              purged. Anonymised, aggregated analytics data (which cannot be
              attributed back to you) may be retained indefinitely for business
              intelligence purposes.
            </p>
            <p>
              Inactive accounts (no login for 3 consecutive years) will receive
              a notice before any data deletion action is taken, in line with
              the DPDP Act's purpose-limitation principle. You will have 30 days
              to reactivate your account before anonymisation of your personal
              identifiers is initiated.
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
              For privacy-related queries, data rights requests, or to reach our
              Data Protection Officer, please write to us at{" "}
              <span className="text-accent-teal font-semibold">
                privacy@mysteryscoop.in
              </span>{" "}
              or visit our contact page. We aim to respond to all privacy
              enquiries within 30 working days.
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
