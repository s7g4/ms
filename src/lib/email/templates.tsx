import * as React from "react";

// ─── Shared Styles ────────────────────────────────────────────────────────────

const body: React.CSSProperties = {
  margin: 0,
  padding: 0,
  fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
  backgroundColor: "#0d0118",
  color: "#e8d5ff",
};

const container: React.CSSProperties = {
  maxWidth: "600px",
  margin: "0 auto",
  backgroundColor: "#1a0533",
  borderRadius: "16px",
  overflow: "hidden",
  border: "1px solid rgba(176, 108, 240, 0.3)",
};

const header: React.CSSProperties = {
  background: "linear-gradient(135deg, #1a0533 0%, #2d0a5e 50%, #0d2240 100%)",
  padding: "40px 40px 32px",
  textAlign: "center" as const,
  borderBottom: "1px solid rgba(176, 108, 240, 0.2)",
};

const logoText: React.CSSProperties = {
  fontSize: "28px",
  fontWeight: "800",
  background: "linear-gradient(135deg, #ff6eb4, #b06cf0)",
  WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent",
  backgroundClip: "text",
  margin: 0,
  letterSpacing: "-0.5px",
};

const tagline: React.CSSProperties = {
  color: "#00d4aa",
  fontSize: "13px",
  margin: "8px 0 0",
  letterSpacing: "2px",
  textTransform: "uppercase" as const,
};

const content: React.CSSProperties = {
  padding: "40px",
};

const h1: React.CSSProperties = {
  color: "#ffffff",
  fontSize: "24px",
  fontWeight: "700",
  margin: "0 0 16px",
};

const p: React.CSSProperties = {
  color: "#c9b3e8",
  fontSize: "15px",
  lineHeight: "1.7",
  margin: "0 0 16px",
};

const ctaButton: React.CSSProperties = {
  display: "inline-block",
  background: "linear-gradient(135deg, #ff6eb4, #b06cf0)",
  color: "#ffffff",
  textDecoration: "none",
  padding: "14px 32px",
  borderRadius: "50px",
  fontWeight: "700",
  fontSize: "15px",
  margin: "24px 0",
  letterSpacing: "0.3px",
};

const divider: React.CSSProperties = {
  borderTop: "1px solid rgba(176, 108, 240, 0.2)",
  margin: "32px 0",
};

const footer: React.CSSProperties = {
  padding: "24px 40px",
  borderTop: "1px solid rgba(176, 108, 240, 0.2)",
  textAlign: "center" as const,
};

const footerText: React.CSSProperties = {
  color: "#7a5f99",
  fontSize: "12px",
  margin: "0 0 8px",
  lineHeight: "1.6",
};

const infoBox: React.CSSProperties = {
  background: "rgba(176, 108, 240, 0.1)",
  border: "1px solid rgba(176, 108, 240, 0.25)",
  borderRadius: "12px",
  padding: "20px",
  margin: "20px 0",
};

const label: React.CSSProperties = {
  color: "#b06cf0",
  fontSize: "11px",
  fontWeight: "700",
  textTransform: "uppercase" as const,
  letterSpacing: "1px",
  margin: "0 0 4px",
};

const value: React.CSSProperties = {
  color: "#ffffff",
  fontSize: "15px",
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
