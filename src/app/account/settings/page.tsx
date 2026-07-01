import { prisma } from "@/lib/db";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { Settings, Shield, Mail, Bell } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AccountSettingsPage() {
  const reqHeaders = await headers();
  const session = await auth.api.getSession({
    headers: reqHeaders,
  });

  if (!session) {
    redirect("/login");
  }

  const user = await prisma.user.findUniqueOrThrow({
    where: { id: session.user.id },
  });

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 bg-purple-500/10 text-accent-purple rounded-xl flex items-center justify-center">
          <Settings size={20} />
        </div>
        <div>
          <h1 className="text-2xl font-bold font-jakarta">Account Settings</h1>
          <p className="text-sm text-text-muted">Manage your personal information and preferences.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Profile Information */}
        <div className="glass-card p-6 rounded-2xl space-y-6 border border-white/5">
          <h3 className="font-bold text-lg flex items-center gap-2">
            <UserIcon /> Personal Information
          </h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-text-muted uppercase mb-1">Full Name</label>
              <input 
                type="text" 
                defaultValue={user.name}
                className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-2.5 text-sm focus:border-purple-500/50 outline-none" 
              />
            </div>
            
            <div>
              <label className="block text-xs font-semibold text-text-muted uppercase mb-1">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                <input 
                  type="email" 
                  defaultValue={user.email}
                  disabled
                  className="w-full bg-black/40 border border-white/5 rounded-lg pl-9 pr-4 py-2.5 text-sm text-text-muted opacity-70 cursor-not-allowed" 
                />
              </div>
              <p className="text-[10px] text-text-muted mt-1">Email cannot be changed directly. Contact support if needed.</p>
            </div>

            <button className="btn-primary w-full py-2.5">Save Changes</button>
          </div>
        </div>

        {/* Security */}
        <div className="glass-card p-6 rounded-2xl space-y-6 border border-white/5 h-fit">
          <h3 className="font-bold text-lg flex items-center gap-2">
            <Shield className="w-5 h-5 text-accent-teal" /> Security
          </h3>
          
          <div className="space-y-4">
            <button className="w-full text-left bg-black/20 hover:bg-black/40 border border-white/10 rounded-lg p-4 transition-colors">
              <p className="font-semibold text-sm">Change Password</p>
              <p className="text-xs text-text-muted mt-1">Update your login credentials securely.</p>
            </button>
            
            <button className="w-full flex items-center justify-between bg-black/20 hover:bg-black/40 border border-white/10 rounded-lg p-4 transition-colors">
              <div>
                <p className="font-semibold text-sm">Two-Factor Authentication</p>
                <p className="text-xs text-text-muted mt-1">Add an extra layer of security.</p>
              </div>
              <span className="px-2 py-1 bg-white/5 rounded text-[10px] font-bold text-text-muted border border-white/10">COMING SOON</span>
            </button>
          </div>
        </div>
        
        {/* Notifications */}
        <div className="glass-card p-6 rounded-2xl space-y-6 border border-white/5 md:col-span-2">
          <h3 className="font-bold text-lg flex items-center gap-2">
            <Bell className="w-5 h-5 text-accent-pink" /> Notifications
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <label className="flex items-start gap-3 p-4 bg-black/20 rounded-xl cursor-pointer hover:bg-black/30 transition-colors border border-transparent hover:border-white/5">
              <input type="checkbox" defaultChecked className="mt-1 accent-purple-500" />
              <div>
                <p className="font-semibold text-sm">Order Updates</p>
                <p className="text-xs text-text-muted mt-0.5">Receive emails about tracking and delivery status.</p>
              </div>
            </label>
            
            <label className="flex items-start gap-3 p-4 bg-black/20 rounded-xl cursor-pointer hover:bg-black/30 transition-colors border border-transparent hover:border-white/5">
              <input type="checkbox" defaultChecked className="mt-1 accent-purple-500" />
              <div>
                <p className="font-semibold text-sm">Promotions & Offers</p>
                <p className="text-xs text-text-muted mt-0.5">Get notified about flash sales and new mystery boxes.</p>
              </div>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}

function UserIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-accent-purple">
      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}
