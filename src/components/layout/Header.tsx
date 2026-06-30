"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShoppingBag,
  Heart,
  Search,
  Menu,
  X,
  User,
  Package,
  LogOut,
  Sparkles,
  ChevronDown,
} from "lucide-react";
import { useCart } from "@/store/cart";
import { useWishlist } from "@/store/wishlist";
import { useSession, signOut } from "@/lib/auth-client";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/mystery-scoops", label: "Mystery Scoops" },
  { href: "/collections", label: "Collections" },
  { href: "/about", label: "About" },
];

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [allBoxes, setAllBoxes] = useState<any[]>([]);
  const pathname = usePathname();
  const { data: session } = useSession();
  const { openCart, itemCount } = useCart();
  const { count: wishlistCount } = useWishlist();
  const cartCount = itemCount();
  const wlCount = wishlistCount();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => {
    if (searchOpen && allBoxes.length === 0) {
      fetch("/api/products?type=box")
        .then((res) => res.json())
        .then((data) => {
          if (data.success && data.data) {
            setAllBoxes(data.data);
          }
        })
        .catch(() => {});
    }
  }, [searchOpen, allBoxes]);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return (
    <>
      <motion.header
        initial={{ y: -80 }}
        animate={{ y: 0 }}
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-300 backdrop-blur-md",
          scrolled
            ? "bg-bg-primary/95 border-b border-border shadow-sm"
            : "bg-bg-primary/70 border-b border-border/10"
        )}
      >
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <motion.div
              whileHover={{ rotate: 20 }}
              className="text-accent-pink"
            >
              <Sparkles className="w-5 h-5 fill-accent-pink/20" />
            </motion.div>
            <span className="font-bold text-xl gradient-text font-grotesk tracking-tight">
              Stack Your Scoops
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "relative px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200",
                  pathname === link.href
                    ? "text-accent-pink"
                    : "text-text-muted hover:text-text-primary"
                )}
              >
                {pathname === link.href && (
                  <motion.div
                    layoutId="nav-active"
                    className="absolute inset-0 bg-purple-500/10 rounded-lg border border-purple-500/20"
                  />
                )}
                <span className="relative">{link.label}</span>
              </Link>
            ))}
          </nav>

          {/* Right actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setSearchOpen(true)}
              className="hidden sm:inline-flex p-2 rounded-lg text-text-muted hover:text-text-primary hover:bg-white/5 transition-all focus-ring"
              aria-label="Search"
            >
              <Search size={20} />
            </button>

            <Link
              href="/wishlist"
              aria-label={`Wishlist, ${wlCount} items`}
              className="hidden sm:inline-flex relative p-2 rounded-lg text-text-muted hover:text-accent-pink hover:bg-white/5 transition-all"
            >
              <Heart size={20} />
              <span className="sr-only">Wishlist</span>
              {wlCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-accent-pink text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {wlCount}
                </span>
              )}
            </Link>

            <button
              onClick={openCart}
              className="relative p-2 rounded-lg text-text-muted hover:text-accent-purple hover:bg-white/5 transition-all"
              aria-label="Cart"
            >
              <ShoppingBag size={20} />
              {cartCount > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-1 -right-1 w-4 h-4 bg-accent-purple text-white text-[10px] font-bold rounded-full flex items-center justify-center"
                >
                  {cartCount}
                </motion.span>
              )}
            </button>

            {session ? (
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg glass border border-purple-500/20 text-sm font-medium text-text-primary hover:border-purple-400/40 transition-all"
                >
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-accent-purple to-accent-pink flex items-center justify-center text-xs font-bold text-white">
                    {session.user?.name?.[0]?.toUpperCase() ?? "U"}
                  </div>
                  <ChevronDown size={14} className={cn("transition-transform", userMenuOpen && "rotate-180")} />
                </button>

                <AnimatePresence>
                  {userMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.95 }}
                      className="absolute right-0 mt-2 w-48 glass-card rounded-xl overflow-hidden"
                    >
                      <Link href="/profile" onClick={() => setUserMenuOpen(false)} className="flex items-center gap-3 px-4 py-3 text-sm text-text-primary hover:bg-white/5 transition-all">
                        <User size={16} className="text-accent-purple" /> Profile
                      </Link>
                      <Link href="/profile/orders" onClick={() => setUserMenuOpen(false)} className="flex items-center gap-3 px-4 py-3 text-sm text-text-primary hover:bg-white/5 transition-all">
                        <Package size={16} className="text-accent-teal" /> My Orders
                      </Link>
                      {(session.user as { role?: string })?.role === "ADMIN" && (
                        <Link href="/admin" onClick={() => setUserMenuOpen(false)} className="flex items-center gap-3 px-4 py-3 text-sm text-accent-pink hover:bg-white/5 transition-all">
                          <Sparkles size={16} /> Admin
                        </Link>
                      )}
                      <div className="h-px bg-purple-500/20 mx-3" />
                      <button
                        onClick={() => { signOut(); setUserMenuOpen(false); }}
                        className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-400 hover:bg-white/5 transition-all"
                      >
                        <LogOut size={16} /> Sign Out
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <Link
                href="/login"
                className="btn-primary text-sm px-4 py-2 rounded-lg whitespace-nowrap"
              >
                Sign In
              </Link>
            )}

            {/* Mobile menu button */}
            <button
              className="md:hidden p-2 rounded-lg text-text-muted hover:text-text-primary"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="md:hidden glass border-t border-purple-500/20 overflow-hidden"
            >
              <nav className="flex flex-col p-4 gap-1">
                {NAV_LINKS.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className={cn(
                      "px-4 py-3 rounded-lg text-sm font-medium transition-all",
                      pathname === link.href
                        ? "bg-purple-500/10 text-accent-pink border border-purple-500/20"
                        : "text-text-muted hover:text-text-primary hover:bg-white/5"
                    )}
                  >
                    {link.label}
                  </Link>
                ))}

                {/* Mobile Search & Wishlist */}
                <div className="h-px bg-purple-500/10 my-2" />
                <button
                  onClick={() => { setMobileOpen(false); setSearchOpen(true); }}
                  className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-text-muted hover:text-text-primary hover:bg-white/5 w-full text-left"
                >
                  <Search size={16} /> Search Mystery Scoops
                </button>
                <Link
                  href="/wishlist"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-text-muted hover:text-accent-pink hover:bg-white/5"
                >
                  <Heart size={16} className="text-accent-pink" /> Wishlist ({wlCount})
                </Link>
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>

      {/* Command-K Search Overlay */}
      <AnimatePresence>
        {searchOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSearchOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60]"
            />
            {/* Search Dialog */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -20 }}
              className="fixed top-[15%] left-1/2 -translate-x-1/2 w-[90%] max-w-lg glass-card z-[60] p-6 shadow-2xl bg-[oklch(0.985_0.012_30_/_0.95)] border border-[oklch(0.4_0.1_350_/_0.15)] flex flex-col"
            >
              <div className="flex items-center gap-3 border-b border-[oklch(0.4_0.1_350_/_0.1)] pb-4 mb-4">
                <Search className="text-text-muted shrink-0" size={20} />
                <input
                  type="text"
                  placeholder="Search mystery scoops... (e.g. Kawaii)"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-transparent text-sm outline-none text-text-primary placeholder-text-muted"
                  autoFocus
                />
                <button
                  onClick={() => setSearchOpen(false)}
                  className="text-xs font-semibold px-2 py-1 bg-bg-secondary border border-[oklch(0.4_0.1_350_/_0.1)] rounded-md text-text-muted hover:text-text-primary transition-colors focus-ring"
                >
                  ESC
                </button>
              </div>

              {/* Results */}
              <div className="max-h-64 overflow-y-auto space-y-2">
                {searchQuery.trim() === "" ? (
                  <p className="text-xs text-text-muted text-center py-4">Type to start searching... (or press <strong>Ctrl+K</strong>)</p>
                ) : (
                  (() => {
                    const filtered = allBoxes.filter((box) =>
                      box.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                      (box.tagline && box.tagline.toLowerCase().includes(searchQuery.toLowerCase()))
                    );

                    if (filtered.length === 0) {
                      return <p className="text-xs text-text-muted text-center py-4">No mystery scoops found.</p>;
                    }

                    return filtered.map((box) => (
                      <Link
                        key={box.id}
                        href={`/mystery-scoops/${box.slug}`}
                        onClick={() => {
                          setSearchOpen(false);
                          setSearchQuery("");
                        }}
                        className="flex items-center gap-3 p-3 rounded-xl hover:bg-bg-secondary border border-transparent hover:border-[oklch(0.4_0.1_350_/_0.08)] transition-all group"
                      >
                        <div
                          className="w-10 h-10 rounded-lg flex items-center justify-center text-xl shrink-0"
                          style={{ background: `linear-gradient(135deg, ${box.gradientFrom}33, ${box.gradientTo}33)` }}
                        >
                          🎁
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-sm text-text-primary group-hover:text-accent-pink transition-colors truncate">
                            {box.name}
                          </p>
                          {box.tagline && (
                            <p className="text-xs text-text-muted truncate">{box.tagline}</p>
                          )}
                        </div>
                        <span className="text-sm font-bold gradient-text">
                          ₹{box.price.toLocaleString("en-IN")}
                        </span>
                      </Link>
                    ));
                  })()
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
