"use client";

import { ReactNode, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Menu, X, LogOut, Search } from "lucide-react";
import { useSession, signOut } from "@/lib/auth-client";
import { motion, AnimatePresence } from "framer-motion";

export interface NavItem {
  name: string;
  href: string;
  icon: ReactNode;
}

interface DashboardShellProps {
  children: ReactNode;
  navItems: NavItem[];
  title: string;
}

export function DashboardShell({ children, navItems, title }: DashboardShellProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();
  const { data: session } = useSession();

  return (
    <div className="min-h-screen bg-bg-primary text-text-primary flex">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-64 border-r border-border/10 bg-bg-card/50 backdrop-blur-xl">
        <div className="h-16 flex items-center px-6 border-b border-border/10">
          <Link href="/" className="font-jakarta font-bold text-lg text-accent-purple tracking-tight">
            Stack Your Scoops
          </Link>
        </div>

        <div className="px-4 py-4 text-xs font-semibold text-text-muted uppercase tracking-wider">
          {title}
        </div>

        <nav className="flex-1 px-3 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = pathname === item.href || (pathname.startsWith(item.href) && item.href !== "/admin");
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all group relative",
                  isActive
                    ? "text-accent-pink bg-purple-500/10 border border-purple-500/20"
                    : "text-text-muted hover:text-text-primary hover:bg-white/5"
                )}
              >
                {isActive && (
                  <motion.div
                    layoutId="sidebar-active"
                    className="absolute inset-0 rounded-lg bg-purple-500/5 -z-10"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
                <span className={cn("transition-colors", isActive ? "text-accent-pink" : "text-text-muted group-hover:text-text-primary")}>
                  {item.icon}
                </span>
                {item.name}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-border/10">
          <button
            onClick={() => signOut()}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-text-muted hover:text-red-400 hover:bg-red-500/10 transition-all w-full"
          >
            <LogOut size={18} />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-h-0 overflow-hidden">
        {/* Header */}
        <header className="h-16 border-b border-border/10 bg-bg-card/50 backdrop-blur-xl flex items-center justify-between px-4 md:px-8 z-10">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setMobileOpen(true)}
              className="md:hidden p-2 -ml-2 text-text-muted hover:text-text-primary transition-colors rounded-md hover:bg-white/5"
            >
              <Menu size={20} />
            </button>
            <div className="hidden md:flex items-center gap-2 text-sm text-text-muted">
              {/* Optional Breadcrumbs could go here */}
              <span className="font-semibold text-text-primary capitalize">{title} / {pathname.split('/').pop()}</span>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <button className="p-2 text-text-muted hover:text-text-primary transition-colors rounded-full hover:bg-white/5">
              <Search size={18} />
            </button>
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-accent-purple to-accent-pink flex items-center justify-center text-xs font-bold text-white shadow-lg">
              {session?.user?.name?.[0]?.toUpperCase() || "A"}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8">
          <div className="max-w-7xl mx-auto space-y-8">
            {children}
          </div>
        </div>
      </main>

      {/* Mobile Nav Overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
            />
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", bounce: 0, duration: 0.3 }}
              className="fixed top-0 bottom-0 left-0 w-64 bg-bg-card border-r border-border/10 z-50 flex flex-col md:hidden"
            >
              <div className="h-16 flex items-center justify-between px-6 border-b border-border/10">
                <Link href="/" className="font-jakarta font-bold text-lg text-accent-purple">
                  Stack Your Scoops
                </Link>
                <button onClick={() => setMobileOpen(false)} className="p-2 text-text-muted">
                  <X size={20} />
                </button>
              </div>

              <div className="px-4 py-4 text-xs font-semibold text-text-muted uppercase tracking-wider">
                {title}
              </div>

              <nav className="flex-1 px-3 space-y-1 overflow-y-auto">
                {navItems.map((item) => {
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setMobileOpen(false)}
                      className={cn(
                        "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all",
                        isActive
                          ? "text-accent-pink bg-purple-500/10 border border-purple-500/20"
                          : "text-text-muted hover:bg-white/5"
                      )}
                    >
                      <span className={isActive ? "text-accent-pink" : "text-text-muted"}>
                        {item.icon}
                      </span>
                      {item.name}
                    </Link>
                  );
                })}
              </nav>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
