import Link from "next/link";
import { LayoutDashboard, Package, Users, Settings, LogOut, Tags } from "lucide-react";

export const dynamic = "force-dynamic";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const LINKS = [
    { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { name: "Orders", href: "/admin/orders", icon: Package },
    { name: "Products", href: "/admin/products", icon: Tags },
    { name: "Customers", href: "/admin/customers", icon: Users },
    { name: "Settings", href: "/admin/settings", icon: Settings },
  ];

  return (
    <div className="flex h-screen bg-[#0d0118] text-text-primary overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 border-r border-purple-500/20 bg-black/20 backdrop-blur-xl flex flex-col">
        <div className="h-16 flex items-center px-6 border-b border-purple-500/20">
          <Link href="/" className="font-bold text-lg flex items-center gap-2">
            ✨ <span className="gradient-text font-grotesk">MysteryAdmin</span>
          </Link>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {LINKS.map(l => (
            <Link key={l.name} href={l.href} className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-text-muted hover:text-white hover:bg-white/5 transition-colors">
              <l.icon size={18} />
              {l.name}
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-purple-500/20">
          <button className="flex w-full items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-red-400 hover:bg-red-400/10 transition-colors">
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Area */}
      <main className="flex-1 overflow-y-auto">
        <header className="h-16 border-b border-purple-500/20 flex items-center px-8 bg-black/10 backdrop-blur-sm sticky top-0 z-10">
          <h2 className="font-semibold">Admin Panel</h2>
        </header>
        <div className="p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
