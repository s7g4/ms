"use client";

import { useState } from "react";
import {
  Store,
  CreditCard,
  Mail,
  Truck,
  Plug,
  Save,
  Eye,
  EyeOff,
  Upload,
  ToggleLeft,
  ToggleRight,
} from "lucide-react";

type Tab = "general" | "payments" | "emails" | "shipping" | "integrations";

const TABS: { id: Tab; label: string; icon: React.ElementType }[] = [
  { id: "general", label: "General", icon: Store },
  { id: "payments", label: "Payments", icon: CreditCard },
  { id: "emails", label: "Emails", icon: Mail },
  { id: "shipping", label: "Shipping", icon: Truck },
  { id: "integrations", label: "Integrations", icon: Plug },
];

function Toggle({
  enabled,
  onChange,
  id,
}: {
  enabled: boolean;
  onChange: () => void;
  id: string;
}) {
  return (
    <button
      id={id}
      onClick={onChange}
      className="flex-shrink-0 transition-colors"
      aria-pressed={enabled}
    >
      {enabled ? (
        <ToggleRight size={32} className="text-accent-purple" />
      ) : (
        <ToggleLeft size={32} className="text-text-muted" />
      )}
    </button>
  );
}

function MaskedInput({
  label,
  id,
  placeholder,
}: {
  label: string;
  id: string;
  placeholder?: string;
}) {
  const [show, setShow] = useState(false);
  return (
    <div>
      <label className="block text-xs font-medium text-text-muted mb-1.5 uppercase tracking-wide">
        {label}
      </label>
      <div className="relative">
        <input
          id={id}
          type={show ? "text" : "password"}
          placeholder={placeholder ?? "••••••••••••••••••••"}
          className="w-full bg-white/5 border border-purple-500/20 rounded-xl px-4 py-2.5 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent-purple/60 pr-10 transition-colors"
        />
        <button
          type="button"
          onClick={() => setShow(!show)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary"
        >
          {show ? <EyeOff size={16} /> : <Eye size={16} />}
        </button>
      </div>
    </div>
  );
}

function TextField({
  label,
  id,
  placeholder,
  type = "text",
  defaultValue,
}: {
  label: string;
  id: string;
  placeholder?: string;
  type?: string;
  defaultValue?: string;
}) {
  return (
    <div>
      <label className="block text-xs font-medium text-text-muted mb-1.5 uppercase tracking-wide">
        {label}
      </label>
      <input
        id={id}
        type={type}
        placeholder={placeholder}
        defaultValue={defaultValue}
        className="w-full bg-white/5 border border-purple-500/20 rounded-xl px-4 py-2.5 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent-purple/60 transition-colors"
      />
    </div>
  );
}

function SectionCard({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="glass border border-purple-500/20 rounded-2xl p-6 space-y-5">
      <h3 className="font-semibold font-jakarta text-base">{title}</h3>
      {children}
    </div>
  );
}

function ToggleRow({
  label,
  description,
  id,
}: {
  label: string;
  description?: string;
  id: string;
}) {
  const [enabled, setEnabled] = useState(true);
  return (
    <div className="flex items-center justify-between gap-4">
      <div>
        <p className="text-sm font-medium">{label}</p>
        {description && (
          <p className="text-xs text-text-muted mt-0.5">{description}</p>
        )}
      </div>
      <Toggle enabled={enabled} onChange={() => setEnabled(!enabled)} id={id} />
    </div>
  );
}

function SaveButton() {
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    await new Promise((r) => setTimeout(r, 1000));
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="pt-4 border-t border-purple-500/10">
      <button
        id="settings-save-btn"
        onClick={handleSave}
        disabled={saving}
        className="flex items-center gap-2 px-6 py-2.5 rounded-xl font-semibold text-white text-sm transition-all disabled:opacity-60"
        style={{ background: "linear-gradient(135deg, #b06cf0, #ff6eb4)" }}
      >
        {saving ? (
          <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
        ) : (
          <Save size={15} />
        )}
        {saved ? "Saved!" : saving ? "Saving..." : "Save Changes"}
      </button>
    </div>
  );
}

export default function AdminSettingsPage() {
  const [activeTab, setActiveTab] = useState<Tab>("general");

  return (
    <div className="space-y-8 max-w-4xl">
      <div>
        <h1 className="text-3xl font-bold font-jakarta mb-1">Settings</h1>
        <p className="text-text-muted">
          Manage your store configuration, integrations, and preferences.
        </p>
      </div>

      {/* Tab Bar */}
      <div className="flex gap-2 border-b border-purple-500/20 overflow-x-auto pb-px">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            id={`settings-tab-${tab.id}`}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
              activeTab === tab.id
                ? "border-accent-purple text-accent-purple"
                : "border-transparent text-text-muted hover:text-text-primary"
            }`}
          >
            <tab.icon size={15} />
            {tab.label}
          </button>
        ))}
      </div>

      {/* General Tab */}
      {activeTab === "general" && (
        <div className="space-y-6">
          <SectionCard title="Store Identity">
            {/* Logo upload */}
            <div>
              <p className="text-xs font-medium text-text-muted mb-1.5 uppercase tracking-wide">
                Store Logo
              </p>
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-2xl">
                  ✨
                </div>
                <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-purple-500/20 text-sm text-text-muted hover:border-accent-purple/40 transition-all">
                  <Upload size={14} /> Upload Logo
                </button>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <TextField label="Store Name" id="setting-store-name" defaultValue="MysteryScoop" />
              <TextField label="GST Number" id="setting-gst" placeholder="22AAAAA0000A1Z5" />
            </div>
          </SectionCard>

          <SectionCard title="Contact Information">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <TextField label="Contact Email" id="setting-email" type="email" defaultValue="support@mysteryscoop.in" />
              <TextField label="Phone Number" id="setting-phone" placeholder="+91 98765 43210" />
            </div>
            <div>
              <label className="block text-xs font-medium text-text-muted mb-1.5 uppercase tracking-wide">
                Office Address
              </label>
              <textarea
                id="setting-address"
                rows={3}
                defaultValue="123, Innovation Park, Koramangala, Bengaluru, Karnataka - 560034"
                className="w-full bg-white/5 border border-purple-500/20 rounded-xl px-4 py-2.5 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent-purple/60 transition-colors resize-none"
              />
            </div>
          </SectionCard>

          <SectionCard title="Locale">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-text-muted mb-1.5 uppercase tracking-wide">
                  Currency
                </label>
                <select
                  id="setting-currency"
                  defaultValue="INR"
                  className="w-full bg-white/5 border border-purple-500/20 rounded-xl px-4 py-2.5 text-sm text-text-primary focus:outline-none focus:border-accent-purple/60 transition-colors"
                >
                  <option value="INR" className="bg-[#1a0533]">INR — Indian Rupee (₹)</option>
                  <option value="USD" className="bg-[#1a0533]">USD — US Dollar ($)</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-text-muted mb-1.5 uppercase tracking-wide">
                  Timezone
                </label>
                <select
                  id="setting-timezone"
                  defaultValue="Asia/Kolkata"
                  className="w-full bg-white/5 border border-purple-500/20 rounded-xl px-4 py-2.5 text-sm text-text-primary focus:outline-none focus:border-accent-purple/60 transition-colors"
                >
                  <option value="Asia/Kolkata" className="bg-[#1a0533]">Asia/Kolkata (IST, UTC+5:30)</option>
                  <option value="UTC" className="bg-[#1a0533]">UTC (GMT+0)</option>
                </select>
              </div>
            </div>
          </SectionCard>
          <SaveButton />
        </div>
      )}

      {/* Payments Tab */}
      {activeTab === "payments" && (
        <div className="space-y-6">
          <SectionCard title="Razorpay">
            <ToggleRow label="Enable Razorpay" description="Accept UPI, Cards, Net Banking, Wallets" id="toggle-razorpay" />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-purple-500/10">
              <MaskedInput label="Razorpay Key ID" id="razorpay-key-id" placeholder="rzp_live_••••••••" />
              <MaskedInput label="Razorpay Key Secret" id="razorpay-key-secret" />
              <MaskedInput label="Webhook Secret" id="razorpay-webhook-secret" />
            </div>
          </SectionCard>

          <SectionCard title="Stripe (International)">
            <ToggleRow label="Enable Stripe" description="Accept international cards and payments" id="toggle-stripe" />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-purple-500/10">
              <MaskedInput label="Stripe Publishable Key" id="stripe-pub-key" placeholder="pk_live_••••••••" />
              <MaskedInput label="Stripe Secret Key" id="stripe-secret-key" placeholder="sk_live_••••••••" />
              <MaskedInput label="Stripe Webhook Secret" id="stripe-webhook-secret" placeholder="whsec_••••••••" />
            </div>
          </SectionCard>

          <SectionCard title="Cash on Delivery (COD)">
            <ToggleRow label="Enable COD" description="Allow customers to pay on delivery" id="toggle-cod" />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-purple-500/10">
              <TextField label="Minimum Order Value for COD (₹)" id="cod-min" defaultValue="199" type="number" />
              <TextField label="Maximum Order Value for COD (₹)" id="cod-max" defaultValue="2000" type="number" />
            </div>
          </SectionCard>
          <SaveButton />
        </div>
      )}

      {/* Emails Tab */}
      {activeTab === "emails" && (
        <div className="space-y-6">
          <SectionCard title="Resend (Recommended)">
            <MaskedInput label="Resend API Key" id="resend-api-key" placeholder="re_••••••••••••••••••••" />
            <TextField label="From Address" id="email-from" defaultValue="noreply@mysteryscoop.in" />
          </SectionCard>

          <SectionCard title="SMTP (Fallback)">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <TextField label="SMTP Host" id="smtp-host" placeholder="smtp.example.com" />
              <TextField label="SMTP Port" id="smtp-port" placeholder="587" defaultValue="587" />
              <TextField label="SMTP Username" id="smtp-user" placeholder="user@example.com" />
              <MaskedInput label="SMTP Password" id="smtp-pass" />
            </div>
          </SectionCard>

          <SectionCard title="Email Notifications">
            <div className="space-y-4">
              <ToggleRow label="Order Confirmation" description="Send email when an order is placed" id="email-toggle-order" />
              <ToggleRow label="Shipping Notification" description="Notify when order is dispatched with tracking link" id="email-toggle-shipping" />
              <ToggleRow label="Delivery Confirmation" description="Notify when order is marked delivered" id="email-toggle-delivery" />
              <ToggleRow label="Referral Reward" description="Notify when user earns a referral bonus" id="email-toggle-referral" />
              <ToggleRow label="Marketing & Promotions" description="Send promotional campaigns and new box announcements" id="email-toggle-marketing" />
            </div>
          </SectionCard>
          <SaveButton />
        </div>
      )}

      {/* Shipping Tab */}
      {activeTab === "shipping" && (
        <div className="space-y-6">
          <SectionCard title="Shipping Rates">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <TextField label="Free Shipping Threshold (₹)" id="ship-free-threshold" defaultValue="499" type="number" />
              <TextField label="Standard Shipping Rate (₹)" id="ship-standard-rate" defaultValue="49" type="number" />
              <TextField label="Express Shipping Rate (₹)" id="ship-express-rate" defaultValue="99" type="number" />
              <TextField label="COD Handling Fee (₹)" id="ship-cod-fee" defaultValue="30" type="number" />
            </div>
          </SectionCard>

          <SectionCard title="Delivery Settings">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <TextField label="Standard Delivery (Days)" id="ship-standard-days" defaultValue="5-8" />
              <TextField label="Express Delivery (Days)" id="ship-express-days" defaultValue="2-3" />
              <TextField label="Processing Time (Business Days)" id="ship-processing" defaultValue="1-2" />
            </div>
          </SectionCard>

          <SectionCard title="Pincode Restrictions">
            <div>
              <label className="block text-xs font-medium text-text-muted mb-1.5 uppercase tracking-wide">
                Blacklisted Pincodes (one per line)
              </label>
              <textarea
                id="ship-blacklist"
                rows={5}
                placeholder={"110001\n400001\n..."}
                className="w-full bg-white/5 border border-purple-500/20 rounded-xl px-4 py-2.5 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent-purple/60 transition-colors resize-none font-mono"
              />
            </div>
          </SectionCard>
          <SaveButton />
        </div>
      )}

      {/* Integrations Tab */}
      {activeTab === "integrations" && (
        <div className="space-y-4">
          {[
            {
              name: "Cloudinary",
              description: "Image & video media storage and CDN",
              icon: "☁️",
              fields: [{ label: "Cloud Name", id: "cloudinary-name" }, { label: "API Key", id: "cloudinary-key" }, { label: "API Secret", id: "cloudinary-secret" }],
              toggleId: "toggle-cloudinary",
            },
            {
              name: "PostHog",
              description: "Product analytics and user behaviour tracking",
              icon: "📊",
              fields: [{ label: "PostHog API Key", id: "posthog-key" }, { label: "Host URL", id: "posthog-host" }],
              toggleId: "toggle-posthog",
            },
            {
              name: "Sentry",
              description: "Error monitoring and performance tracing",
              icon: "🛡️",
              fields: [{ label: "Sentry DSN", id: "sentry-dsn" }],
              toggleId: "toggle-sentry",
            },
            {
              name: "Google Analytics",
              description: "Website traffic and conversion tracking",
              icon: "📈",
              fields: [{ label: "Measurement ID (G-XXXXXXXX)", id: "ga-id" }],
              toggleId: "toggle-ga",
            },
          ].map((integration) => (
            <IntegrationCard key={integration.name} integration={integration} />
          ))}
          <SaveButton />
        </div>
      )}
    </div>
  );
}

interface Integration {
  name: string;
  description: string;
  icon: string;
  fields: Array<{ label: string; id: string }>;
  toggleId: string;
}

function IntegrationCard({ integration }: { integration: Integration }) {
  const [enabled, setEnabled] = useState(false);
  return (
    <div className="glass border border-purple-500/20 rounded-2xl p-6 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-2xl">{integration.icon}</span>
          <div>
            <p className="font-semibold">{integration.name}</p>
            <p className="text-xs text-text-muted">{integration.description}</p>
          </div>
        </div>
        <Toggle
          enabled={enabled}
          onChange={() => setEnabled(!enabled)}
          id={integration.toggleId}
        />
      </div>
      {enabled && (
        <div className="pt-3 border-t border-purple-500/10 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {integration.fields.map((field) => (
            <MaskedInput key={field.id} label={field.label} id={field.id} />
          ))}
        </div>
      )}
    </div>
  );
}
