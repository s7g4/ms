import * as React from "react";

// ─── Shared Styles ────────────────────────────────────────────────────────────

const body: React.CSSProperties = {
  margin: 0,
  padding: 0,
  fontFamily: "'Inter', 'Helvetica Neue', Helvetica, Arial, sans-serif",
  backgroundColor: "#FAF9F6",
  color: "#2F2228",
};

const container: React.CSSProperties = {
  maxWidth: "600px",
  margin: "0 auto",
  backgroundColor: "#FFFFFF",
  borderRadius: "12px",
  overflow: "hidden",
  border: "1px solid #E5DCD8",
  boxShadow: "0 4px 12px rgba(74, 30, 53, 0.05)",
};

const header: React.CSSProperties = {
  background: "#FDF5F5",
  padding: "32px 32px 24px",
  textAlign: "center" as const,
  borderBottom: "1px solid #E5DCD8",
};

const logoText: React.CSSProperties = {
  fontSize: "24px",
  fontWeight: "700",
  color: "#4A1E35",
  margin: 0,
  letterSpacing: "-0.5px",
};

const tagline: React.CSSProperties = {
  color: "#E05A7A",
  fontSize: "12px",
  margin: "6px 0 0",
  letterSpacing: "1.5px",
  textTransform: "uppercase" as const,
};

const content: React.CSSProperties = {
  padding: "32px",
};

const h1: React.CSSProperties = {
  color: "#4A1E35",
  fontSize: "22px",
  fontWeight: "700",
  margin: "0 0 16px",
};

const p: React.CSSProperties = {
  color: "#2F2228",
  fontSize: "14px",
  lineHeight: "1.6",
  margin: "0 0 16px",
};

const ctaButton: React.CSSProperties = {
  display: "inline-block",
  background: "#E05A7A",
  color: "#FFFFFF",
  textDecoration: "none",
  padding: "12px 28px",
  borderRadius: "8px",
  fontWeight: "600",
  fontSize: "14px",
  margin: "20px 0",
  letterSpacing: "0.2px",
};

const divider: React.CSSProperties = {
  borderTop: "1px solid #E5DCD8",
  margin: "24px 0",
};

const footer: React.CSSProperties = {
  padding: "20px 32px",
  borderTop: "1px solid #E5DCD8",
  textAlign: "center" as const,
  backgroundColor: "#FDF5F5",
};

const footerText: React.CSSProperties = {
  color: "#7D6A73",
  fontSize: "11px",
  margin: "0 0 6px",
  lineHeight: "1.5",
};

const infoBox: React.CSSProperties = {
  background: "#FDF5F5",
  border: "1px solid #E5DCD8",
  borderRadius: "8px",
  padding: "16px",
  margin: "16px 0",
};

const label: React.CSSProperties = {
  color: "#E05A7A",
  fontSize: "11px",
  fontWeight: "600",
  textTransform: "uppercase" as const,
  letterSpacing: "0.8px",
  margin: "0 0 4px",
};

const value: React.CSSProperties = {
  color: "#4A1E35",
  fontSize: "14px",
  fontWeight: "600",
  margin: "0 0 12px",
};

function EmailWrapper({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </head>
      <body style={body}>
        <table width="100%" cellPadding={0} cellSpacing={0} style={{ padding: "40px 20px" }}>
          <tbody>
            <tr>
              <td align="center">
                <table width="600" cellPadding={0} cellSpacing={0} style={container}>
                  <tbody>
                    <tr>
                      <td style={header}>
                        <p style={logoText}>✨ MysteryScoop</p>
                        <p style={tagline}>Unbox the Magic</p>
                      </td>
                    </tr>
                    <tr>
                      <td style={content}>{children}</td>
                    </tr>
                    <tr>
                      <td style={footer}>
                        <p style={footerText}>
                          MysteryScoop · 123 Kawaii Lane · Tokyo, Japan 100-0001
                        </p>
                        <p style={footerText}>
                          You are receiving this email because you have an account with MysteryScoop.
                          <br />
                          <a href="{{unsubscribe_link}}" style={{ color: "#7a5f99" }}>
                            Unsubscribe
                          </a>{" "}
                          ·{" "}
                          <a href="https://mysteryscoop.com/legal/privacy" style={{ color: "#7a5f99" }}>
                            Privacy Policy
                          </a>
                        </p>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </td>
            </tr>
          </tbody>
        </table>
      </body>
    </html>
  );
}

// ─── Order Confirmation ───────────────────────────────────────────────────────

export interface OrderItem {
  name: string;
  quantity: number;
  price: number;
}

export interface OrderConfirmationProps {
  customerName: string;
  orderNumber: string;
  orderDate: string;
  items: OrderItem[];
  subtotal: number;
  shipping: number;
  total: number;
  shippingAddress: string;
  trackingUrl?: string;
  estimatedDelivery: string;
}

export function OrderConfirmation({
  customerName,
  orderNumber,
  orderDate,
  items,
  subtotal,
  shipping,
  total,
  shippingAddress,
  trackingUrl,
  estimatedDelivery,
}: OrderConfirmationProps) {
  return (
    <EmailWrapper>
      <h1 style={h1}>🎉 Order Confirmed!</h1>
      <p style={p}>
        Hey {customerName}! Your mystery box order is confirmed and our team is already
        curating something magical for you. Prepare to be surprised! ✨
      </p>

      <div style={infoBox}>
        <p style={label}>Order Number</p>
        <p style={value}>#{orderNumber}</p>
        <p style={label}>Order Date</p>
        <p style={value}>{orderDate}</p>
        <p style={label}>Estimated Delivery</p>
        <p style={{ ...value, margin: 0 }}>{estimatedDelivery}</p>
      </div>

      {/* Items Table */}
      <table width="100%" cellPadding={0} cellSpacing={0} style={{ margin: "20px 0" }}>
        <thead>
          <tr>
            <td style={{ ...label, paddingBottom: "8px", borderBottom: "1px solid rgba(176, 108, 240, 0.2)" }}>Item</td>
            <td style={{ ...label, paddingBottom: "8px", borderBottom: "1px solid rgba(176, 108, 240, 0.2)", textAlign: "center" }}>Qty</td>
            <td style={{ ...label, paddingBottom: "8px", borderBottom: "1px solid rgba(176, 108, 240, 0.2)", textAlign: "right" }}>Price</td>
          </tr>
        </thead>
        <tbody>
          {items.map((item, idx) => (
            <tr key={idx}>
              <td style={{ ...p, padding: "10px 0", borderBottom: "1px solid rgba(176, 108, 240, 0.1)", margin: 0 }}>{item.name}</td>
              <td style={{ ...p, padding: "10px 0", borderBottom: "1px solid rgba(176, 108, 240, 0.1)", margin: 0, textAlign: "center" }}>{item.quantity}</td>
              <td style={{ ...p, padding: "10px 0", borderBottom: "1px solid rgba(176, 108, 240, 0.1)", margin: 0, textAlign: "right" }}>${(item.price / 100).toFixed(2)}</td>
            </tr>
          ))}
          <tr>
            <td colSpan={2} style={{ ...p, padding: "10px 0", margin: 0 }}>Subtotal</td>
            <td style={{ ...p, padding: "10px 0", margin: 0, textAlign: "right" }}>${(subtotal / 100).toFixed(2)}</td>
          </tr>
          <tr>
            <td colSpan={2} style={{ ...p, padding: "4px 0", margin: 0 }}>Shipping</td>
            <td style={{ ...p, padding: "4px 0", margin: 0, textAlign: "right" }}>{shipping === 0 ? "Free" : `$${(shipping / 100).toFixed(2)}`}</td>
          </tr>
          <tr>
            <td colSpan={2} style={{ color: "#ffffff", fontSize: "16px", fontWeight: "700", padding: "10px 0" }}>Total</td>
            <td style={{ color: "#ff6eb4", fontSize: "16px", fontWeight: "700", padding: "10px 0", textAlign: "right" }}>${(total / 100).toFixed(2)}</td>
          </tr>
        </tbody>
      </table>

      <div style={infoBox}>
        <p style={label}>Shipping To</p>
        <p style={{ ...value, margin: 0 }}>{shippingAddress}</p>
      </div>

      {trackingUrl && (
        <div style={{ textAlign: "center" }}>
          <a href={trackingUrl} style={ctaButton}>
            Track Your Order →
          </a>
        </div>
      )}

      <div style={divider} />
      <p style={p}>
        Questions about your order? Reply to this email or visit our{" "}
        <a href="https://mysteryscoop.com/contact" style={{ color: "#ff6eb4" }}>
          Help Center
        </a>
        .
      </p>
    </EmailWrapper>
  );
}

// ─── Welcome Email ────────────────────────────────────────────────────────────

export interface WelcomeEmailProps {
  name: string;
  email: string;
  referralCode: string;
  referralLink: string;
}

export function WelcomeEmail({ name, email, referralCode, referralLink }: WelcomeEmailProps) {
  return (
    <EmailWrapper>
      <h1 style={h1}>Welcome to MysteryScoop! 🌟</h1>
      <p style={p}>
        Hey {name}! We&apos;re so excited to have you in our kawaii universe. Get ready to
        unbox the most magical mystery boxes you&apos;ve ever seen! ✨🎁
      </p>

      <div style={{ textAlign: "center", margin: "32px 0" }}>
        <a href="https://mysteryscoop.com/boxes" style={ctaButton}>
          Explore Mystery Boxes →
        </a>
      </div>

      <div style={infoBox}>
        <p style={{ ...label, marginBottom: "12px" }}>Your Exclusive Referral Code</p>
        <p style={{ ...value, fontSize: "24px", color: "#ff6eb4", letterSpacing: "4px", margin: "0 0 12px", textAlign: "center" as const }}>
          {referralCode}
        </p>
        <p style={{ ...p, margin: "0 0 12px", textAlign: "center" as const }}>
          Share this code with friends and earn <strong style={{ color: "#00d4aa" }}>500 Stardust points</strong> for every referral!
        </p>
        <div style={{ textAlign: "center" as const }}>
          <a href={referralLink} style={{ color: "#b06cf0", fontSize: "13px", wordBreak: "break-all" as const }}>
            {referralLink}
          </a>
        </div>
      </div>

      <div style={divider} />

      <p style={{ ...p, marginBottom: "8px" }}>
        <strong style={{ color: "#ffffff" }}>🎀 Bronze Tier Member</strong> – You&apos;re starting your journey!
      </p>
      <p style={p}>
        Earn points with every purchase, referral, and review. Level up through Bronze → Silver → Gold → Platinum
        for exclusive benefits and early access to limited boxes.
      </p>

      <p style={p}>
        Your account email: <strong style={{ color: "#ffffff" }}>{email}</strong>
      </p>
    </EmailWrapper>
  );
}

// ─── Shipping Update ──────────────────────────────────────────────────────────

export interface ShippingUpdateProps {
  customerName: string;
  orderNumber: string;
  trackingNumber: string;
  carrier: string;
  trackingUrl: string;
  estimatedDelivery: string;
  shippingAddress: string;
}

export function ShippingUpdate({
  customerName,
  orderNumber,
  trackingNumber,
  carrier,
  trackingUrl,
  estimatedDelivery,
  shippingAddress,
}: ShippingUpdateProps) {
  return (
    <EmailWrapper>
      <h1 style={h1}>Your Box is on the Way! 🚀</h1>
      <p style={p}>
        Great news, {customerName}! Your MysteryScoop order #{orderNumber} has been
        shipped and is making its magical journey to you!
      </p>

      <div style={infoBox}>
        <p style={label}>Carrier</p>
        <p style={value}>{carrier}</p>
        <p style={label}>Tracking Number</p>
        <p style={value}>{trackingNumber}</p>
        <p style={label}>Estimated Delivery</p>
        <p style={value}>{estimatedDelivery}</p>
        <p style={label}>Delivering To</p>
        <p style={{ ...value, margin: 0 }}>{shippingAddress}</p>
      </div>

      <div style={{ textAlign: "center" }}>
        <a href={trackingUrl} style={ctaButton}>
          Track Live →
        </a>
      </div>

      <div style={divider} />
      <p style={p}>
        Couldn&apos;t be more excited for you to open your mystery box! Once it arrives,
        don&apos;t forget to leave a review and share on social with{" "}
        <strong style={{ color: "#ff6eb4" }}>#MysteryScoop</strong> 💜
      </p>
    </EmailWrapper>
  );
}

// ─── Password Reset ───────────────────────────────────────────────────────────

export interface PasswordResetProps {
  name: string;
  resetUrl: string;
  expiresInMinutes?: number;
}

export function PasswordReset({ name, resetUrl, expiresInMinutes = 60 }: PasswordResetProps) {
  return (
    <EmailWrapper>
      <h1 style={h1}>Reset Your Password 🔐</h1>
      <p style={p}>
        Hey {name}, we received a request to reset the password for your MysteryScoop account.
        Click the button below to choose a new password.
      </p>

      <div style={{ textAlign: "center", margin: "32px 0" }}>
        <a href={resetUrl} style={ctaButton}>
          Reset Password →
        </a>
      </div>

      <div style={{ ...infoBox, borderColor: "rgba(255, 110, 180, 0.3)", background: "rgba(255, 110, 180, 0.05)" }}>
        <p style={{ ...p, margin: 0, color: "#ff6eb4" }}>
          ⚠️ This link expires in <strong>{expiresInMinutes} minutes</strong>. If you did not
          request a password reset, you can safely ignore this email — your account is secure.
        </p>
      </div>

      <div style={divider} />
      <p style={{ ...p, fontSize: "13px", color: "#7a5f99" }}>
        If the button above doesn&apos;t work, copy and paste this URL into your browser:
      </p>
      <p style={{ ...p, fontSize: "12px", color: "#7a5f99", wordBreak: "break-all" }}>
        {resetUrl}
      </p>
    </EmailWrapper>
  );
}

// ─── Verify Email ────────────────────────────────────────────────────────────

export interface VerifyEmailProps {
  name: string;
  verificationUrl: string;
}

export function VerifyEmail({ name, verificationUrl }: VerifyEmailProps) {
  return (
    <EmailWrapper>
      <h1 style={h1}>Confirm Your Email Address ✉️</h1>
      <p style={p}>
        Hi {name}, thanks for joining MysteryScoop! To activate your account and access
        our premium mystery boxes, please confirm your email address by clicking the button below.
      </p>
      <div style={{ textAlign: "center", margin: "24px 0" }}>
        <a href={verificationUrl} style={ctaButton}>
          Verify Email →
        </a>
      </div>
      <div style={infoBox}>
        <p style={{ ...p, margin: 0, fontSize: "13px" }}>
          This link will expire in <strong>24 hours</strong>. If you did not sign up for this
          account, you can ignore this email.
        </p>
      </div>
      <div style={divider} />
      <p style={{ ...p, fontSize: "12px", color: "#7D6A73" }}>
        If the button does not work, copy and paste this URL into your browser:
      </p>
      <p style={{ ...p, fontSize: "11px", color: "#7D6A73", wordBreak: "break-all" }}>
        {verificationUrl}
      </p>
    </EmailWrapper>
  );
}

// ─── Payment Received ─────────────────────────────────────────────────────────

export interface PaymentReceivedProps {
  customerName: string;
  orderNumber: string;
  amountPaid: number;
  paymentMethod: string;
  transactionId: string;
}

export function PaymentReceived({
  customerName,
  orderNumber,
  amountPaid,
  paymentMethod,
  transactionId,
}: PaymentReceivedProps) {
  return (
    <EmailWrapper>
      <h1 style={h1}>Payment Received! 💳</h1>
      <p style={p}>
        Hey {customerName}, we received your payment of <strong>₹{(amountPaid / 100).toFixed(2)}</strong> for order #{orderNumber}. Thank you for transacting with us!
      </p>
      <div style={infoBox}>
        <p style={label}>Order ID</p>
        <p style={value}>#{orderNumber}</p>
        <p style={label}>Transaction ID</p>
        <p style={value}>{transactionId}</p>
        <p style={label}>Payment Method</p>
        <p style={value}>{paymentMethod}</p>
        <p style={label}>Amount Paid</p>
        <p style={{ ...value, margin: 0 }}>₹{(amountPaid / 100).toFixed(2)}</p>
      </div>
      <p style={p}>
        Our curators are currently selecting your unique items. You will receive another update as soon as your box ships!
      </p>
    </EmailWrapper>
  );
}

// ─── Delivered Email ──────────────────────────────────────────────────────────

export interface DeliveredProps {
  customerName: string;
  orderNumber: string;
  deliveryDate: string;
  reviewUrl: string;
}

export function Delivered({ customerName, orderNumber, deliveryDate, reviewUrl }: DeliveredProps) {
  return (
    <EmailWrapper>
      <h1 style={h1}>Delivered! 🎁✨</h1>
      <p style={p}>
        Yay, {customerName}! Our tracking shows your MysteryScoop box from order #{orderNumber} has arrived!
      </p>
      <div style={infoBox}>
        <p style={label}>Order Number</p>
        <p style={value}>#{orderNumber}</p>
        <p style={label}>Delivery Confirmed At</p>
        <p style={{ ...value, margin: 0 }}>{deliveryDate}</p>
      </div>
      <p style={p}>
        We hope you love opening your surprise box! Tell us what you think of your items and share your experience with other fans.
      </p>
      <div style={{ textAlign: "center" }}>
        <a href={reviewUrl} style={ctaButton}>
          Write a Review →
        </a>
      </div>
    </EmailWrapper>
  );
}

// ─── Review Request ───────────────────────────────────────────────────────────

export interface ReviewRequestProps {
  customerName: string;
  boxName: string;
  boxSlug: string;
  orderNumber: string;
}

export function ReviewRequest({ customerName, boxName, boxSlug, orderNumber }: ReviewRequestProps) {
  const reviewUrl = `https://mysteryscoop.com/mystery-scoops/${boxSlug}#reviews`;
  return (
    <EmailWrapper>
      <h1 style={h1}>How was your Mystery Box? 🤔✨</h1>
      <p style={p}>
        Hi {customerName}, it has been a week since your MysteryScoop box arrived. We want to hear your feedback!
      </p>
      <p style={p}>
        Would you mind taking a minute to share your thoughts about your <strong>{boxName}</strong>? Your review helps our curation team create even better experiences for future drops.
      </p>
      <div style={{ textAlign: "center", margin: "24px 0" }}>
        <a href={reviewUrl} style={ctaButton}>
          Leave Feedback →
        </a>
      </div>
      <p style={p}>
        You can also upload photos of your favorite surprise items to show off your unboxing to the community!
      </p>
    </EmailWrapper>
  );
}

// ─── Refund Approved ──────────────────────────────────────────────────────────

export interface RefundApprovedProps {
  customerName: string;
  orderNumber: string;
  amountRefunded: number;
  refundMethod: string;
}

export function RefundApproved({
  customerName,
  orderNumber,
  amountRefunded,
  refundMethod,
}: RefundApprovedProps) {
  return (
    <EmailWrapper>
      <h1 style={h1}>Refund Processed Successfully 💸</h1>
      <p style={p}>
        Hi {customerName}, we have approved and processed your refund request for order #{orderNumber}.
      </p>
      <div style={infoBox}>
        <p style={label}>Order Number</p>
        <p style={value}>#{orderNumber}</p>
        <p style={label}>Refund Amount</p>
        <p style={value}>₹{(amountRefunded / 100).toFixed(2)}</p>
        <p style={label}>Refund Type</p>
        <p style={{ ...value, margin: 0 }}>{refundMethod}</p>
      </div>
      <p style={p}>
        Please note that it typically takes <strong>5-7 business days</strong> for the refunded amount to show up in your account, depending on your bank or payment provider.
      </p>
    </EmailWrapper>
  );
}

// ─── Referral Reward ──────────────────────────────────────────────────────────

export interface ReferralRewardProps {
  referrerName: string;
  friendName: string;
  pointsEarned: number;
  totalPoints: number;
}

export function ReferralReward({
  referrerName,
  friendName,
  pointsEarned,
  totalPoints,
}: ReferralRewardProps) {
  return (
    <EmailWrapper>
      <h1 style={h1}>Referral Reward Credited! 🌟🎁</h1>
      <p style={p}>
        Great news, {referrerName}! Your friend <strong>{friendName}</strong> just completed their first purchase at MysteryScoop.
      </p>
      <div style={infoBox}>
        <p style={label}>Reward Earned</p>
        <p style={value}>+{pointsEarned} Stardust Points</p>
        <p style={label}>Your New Balance</p>
        <p style={{ ...value, margin: 0 }}>{totalPoints} Points</p>
      </div>
      <p style={p}>
        You can redeem your points for discount coupons and premium items at checkout. Keep sharing your code and earning rewards!
      </p>
      <div style={{ textAlign: "center" }}>
        <a href="https://mysteryscoop.com/profile" style={ctaButton}>
          View Rewards Profile →
        </a>
      </div>
    </EmailWrapper>
  );
}

