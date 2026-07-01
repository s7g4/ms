"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import {
  Search,
  LayoutGrid,
  List,
  Plus,
  Edit2,
  Power,
  X,
  Package,
  AlertTriangle,
  TrendingDown,
  CheckCircle2,
  ImagePlus,
  Tag,
  ChevronDown,
} from "lucide-react";
import { formatPrice } from "@/lib/utils";
import axios from "axios";
import { toast } from "sonner";

type Category = "Kawaii" | "Anime" | "Stationery" | "Plush" | "Accessories" | "Gaming";

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: Category;
  stock: number;
  active: boolean;
  gradient: string;
  type: "box" | "product";
}

const CATEGORY_COLORS: Record<Category, string> = {
  Kawaii: "bg-pink-500/20 text-pink-400 border border-pink-500/30",
  Anime: "bg-blue-500/20 text-blue-400 border border-blue-500/30",
  Stationery: "bg-teal-500/20 text-teal-400 border border-teal-500/30",
  Plush: "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30",
  Accessories: "bg-purple-500/20 text-purple-400 border border-purple-500/30",
  Gaming: "bg-orange-500/20 text-orange-400 border border-orange-500/30",
};

const MOCK_PRODUCTS: Product[] = [
  { id: "P001", name: "Kawaii Mystery Box Classic", description: "Curated kawaii items from Japan — stickers, plushies, and more!", price: 799, category: "Kawaii", stock: 82, active: true, gradient: "linear-gradient(135deg, #ff6eb4, #b06cf0)", type: "product" },
  { id: "P002", name: "Anime Essentials Bundle", description: "Must-have anime merch including keychains, pins, and art prints.", price: 599, category: "Anime", stock: 45, active: true, gradient: "linear-gradient(135deg, #00d4aa, #00b4d8)", type: "product" },
  { id: "P003", name: "Stationery Dream Pack", description: "Premium Japanese stationery: washi tape, pens, and notebooks.", price: 399, category: "Stationery", stock: 7, active: true, gradient: "linear-gradient(135deg, #ffd166, #ff6eb4)", type: "product" },
  { id: "P004", name: "Plush Pals Collection", description: "Soft and cuddly mystery plushies — random character surprise!", price: 899, category: "Plush", stock: 0, active: false, gradient: "linear-gradient(135deg, #b06cf0, #00d4aa)", type: "product" },
  { id: "P005", name: "Harajuku Style Kit", description: "Fashion accessories inspired by Tokyo street style.", price: 649, category: "Accessories", stock: 23, active: true, gradient: "linear-gradient(135deg, #ff6eb4, #ffd166)", type: "product" },
  { id: "P006", name: "Pixel Gamer Box", description: "Gaming goodies: enamel pins, artbooks, and limited edition items.", price: 999, category: "Gaming", stock: 3, active: true, gradient: "linear-gradient(135deg, #00b4d8, #b06cf0)", type: "product" },
  { id: "P007", name: "Sakura Season Box", description: "Cherry blossom themed collectibles and lifestyle items.", price: 499, category: "Kawaii", stock: 61, active: true, gradient: "linear-gradient(135deg, #ff9de2, #ff6eb4)", type: "product" },
  { id: "P008", name: "Shōnen Pack", description: "Action anime fan favorites — limited production run.", price: 749, category: "Anime", stock: 8, active: true, gradient: "linear-gradient(135deg, #f59e0b, #ef4444)", type: "product" },
  { id: "P009", name: "Mini Desk Charm Set", description: "Tiny desk decorations: figures, charms, and memo pads.", price: 349, category: "Stationery", stock: 0, active: false, gradient: "linear-gradient(135deg, #6366f1, #00d4aa)", type: "product" },
  { id: "P010", name: "VTuber Merch Mystery", description: "Surprise merch from popular VTuber agencies.", price: 1199, category: "Accessories", stock: 14, active: true, gradient: "linear-gradient(135deg, #b06cf0, #ff6eb4)", type: "product" },
];

const CATEGORIES: Category[] = ["Kawaii", "Anime", "Stationery", "Plush", "Accessories", "Gaming"];

function stockColor(stock: number) {
  if (stock === 0) return "bg-red-500";
  if (stock < 10) return "bg-orange-400";
  if (stock < 50) return "bg-yellow-400";
  return "bg-green-400";
}

function stockWidth(stock: number) {
  return `${Math.min(100, (stock / 100) * 100)}%`;
}

function StockBar({ stock }: { stock: number }) {
  const label = stock === 0 ? "Out of Stock" : stock < 10 ? "Low Stock" : "In Stock";
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-xs">
        <span className={stock === 0 ? "text-red-400" : stock < 10 ? "text-orange-400" : "text-text-muted"}>{label}</span>
        <span className="text-text-muted">{stock} units</span>
      </div>
      <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all ${stockColor(stock)}`}
          style={{ width: stockWidth(stock) }}
        />
      </div>
    </div>
  );
}

interface AddProductForm {
  name: string;
  description: string;
  price: string;
  category: Category | "";
  stock: string;
}

const EMPTY_FORM: AddProductForm = { name: "", description: "", price: "", category: "", stock: "" };

export default function AdminProductsPage() {
  const [view, setView] = useState<"grid" | "table">("grid");
  const [search, setSearch] = useState("");
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [panelOpen, setPanelOpen] = useState(false);
  const [form, setForm] = useState<AddProductForm>(EMPTY_FORM);
  const [editingId, setEditingId] = useState<string | null>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function loadData() {
      try {
        setIsLoading(true);
        const [prodRes, boxRes] = await Promise.all([
          axios.get("/api/products?type=product"),
          axios.get("/api/products?type=box"),
        ]);

        const dbProducts: Product[] = [
          ...boxRes.data.data.map((b: any) => ({
            id: b.id,
            name: b.name,
            description: b.description,
            price: b.price,
            category: "Kawaii" as Category,
            stock: b.stock ?? 0,
            active: b.isActive,
            gradient: `linear-gradient(135deg, ${b.gradientFrom}, ${b.gradientTo})`,
            type: "box" as const,
          })),
          ...prodRes.data.data.map((p: any) => ({
            id: p.id,
            name: p.name,
            description: p.description || "",
            price: p.price,
            category: (p.category?.name || "Kawaii") as Category,
            stock: p.stock ?? 0,
            active: p.isActive,
            gradient: "linear-gradient(135deg, #b7c4a8, #f7d6e0)",
            type: "product" as const,
          })),
        ];

        setProducts(dbProducts);
      } catch (err) {
        toast.error("Failed to load inventory from database.");
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, []);

  const filtered = useMemo(() =>
    products.filter(p =>
      !search ||
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.category.toLowerCase().includes(search.toLowerCase())
    ), [products, search]);

  const stats = {
    total: products.length,
    active: products.filter(p => p.active).length,
    lowStock: products.filter(p => p.stock > 0 && p.stock < 10).length,
    outOfStock: products.filter(p => p.stock === 0).length,
  };

  async function toggleActive(id: string) {
    const target = products.find(p => p.id === id);
    if (!target) return;

    const newActive = !target.active;
    try {
      setProducts(prev => prev.map(p => p.id === id ? { ...p, active: newActive } : p));
      await axios.put("/api/products", {
        id,
        type: target.type,
        isActive: newActive,
      });
      toast.success(`${target.name} listing updated!`);
    } catch {
      toast.error("Failed to update status on server.");
      // Rollback
      setProducts(prev => prev.map(p => p.id === id ? { ...p, active: target.active } : p));
    }
  }

  function handleEdit(p: Product) {
    setEditingId(p.id);
    setForm({ name: p.name, description: p.description, price: String(p.price), category: p.category, stock: String(p.stock) });
    setPanelOpen(true);
    setTimeout(() => panelRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.category) return;

    if (editingId) {
      const target = products.find(p => p.id === editingId);
      if (!target) return;

      const updatedPrice = Number(form.price);
      const updatedStock = Number(form.stock);

      try {
        setProducts(prev => prev.map(p => p.id === editingId ? {
          ...p,
          name: form.name,
          description: form.description,
          price: updatedPrice,
          category: form.category as Category,
          stock: updatedStock,
        } : p));

        await axios.put("/api/products", {
          id: editingId,
          type: target.type,
          price: updatedPrice,
          stock: updatedStock,
        });

        toast.success(`Successfully saved details for ${form.name}!`);
      } catch {
        toast.error("Failed to save changes on server.");
      }
    } else {
      // Creation (Local client mockup fallback)
      const newProduct: Product = {
        id: `P${String(products.length + 1).padStart(3, "0")}`,
        name: form.name, description: form.description,
        price: Number(form.price), category: form.category as Category,
        stock: Number(form.stock), active: true,
        gradient: "linear-gradient(135deg, #b06cf0, #ff6eb4)",
        type: "product",
      };
      setProducts(prev => [newProduct, ...prev]);
      toast.info("Added product to view (Mock creation).");
    }
    setForm(EMPTY_FORM);
    setPanelOpen(false);
    setEditingId(null);
  }

  const inputCls = "input-field text-sm";
  const labelCls = "block text-xs font-medium text-text-muted mb-1.5";

  if (isLoading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center flex-col gap-4">
        <div className="w-10 h-10 border-4 border-accent-pink border-t-transparent rounded-full animate-spin" />
        <p className="text-text-muted font-medium text-sm animate-pulse font-jakarta">Fetching inventory & database records...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-7xl">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold font-jakarta mb-2">Inventory & Products</h1>
          <p className="text-text-muted">Manage your mystery box listings, stock levels, and pricing.</p>
        </div>
        <button
          onClick={() => { setEditingId(null); setForm(EMPTY_FORM); setPanelOpen(true); setTimeout(() => panelRef.current?.scrollIntoView({ behavior: "smooth" }), 100); }}
          className="btn-primary flex items-center gap-2 shrink-0 text-sm"
        >
          <Plus size={16} /> Add Product
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Products", value: stats.total, icon: Package, color: "text-accent-purple", bg: "bg-purple-500/10" },
          { label: "Active Listings", value: stats.active, icon: CheckCircle2, color: "text-green-400", bg: "bg-green-500/10" },
          { label: "Low Stock", value: stats.lowStock, icon: AlertTriangle, color: "text-orange-400", bg: "bg-orange-500/10" },
          { label: "Out of Stock", value: stats.outOfStock, icon: TrendingDown, color: "text-red-400", bg: "bg-red-500/10" },
        ].map(s => (
          <div key={s.label} className="glass p-5 rounded-2xl border border-purple-500/20 flex items-center gap-4">
            <div className={`p-3 rounded-xl ${s.bg} shrink-0`}>
              <s.icon size={20} className={s.color} />
            </div>
            <div>
              <p className="text-text-muted text-xs mb-0.5">{s.label}</p>
              <p className="text-2xl font-bold text-text-primary">{s.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
        <div className="relative flex-1 max-w-sm">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
          <input
            type="text"
            placeholder="Search products…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className={`${inputCls} pl-9`}
          />
        </div>
        <div className="flex items-center gap-1 glass p-1 rounded-xl border border-purple-500/20">
          <button
            onClick={() => setView("grid")}
            className={`p-2 rounded-lg transition-colors ${view === "grid" ? "bg-accent-purple text-white" : "text-text-muted hover:text-text-primary"}`}
          >
            <LayoutGrid size={16} />
          </button>
          <button
            onClick={() => setView("table")}
            className={`p-2 rounded-lg transition-colors ${view === "table" ? "bg-accent-purple text-white" : "text-text-muted hover:text-text-primary"}`}
          >
            <List size={16} />
          </button>
        </div>
      </div>

      {/* Grid View */}
      {view === "grid" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filtered.map(p => (
            <div key={p.id} className={`glass rounded-2xl border border-purple-500/20 overflow-hidden transition-all hover:border-purple-500/40 hover:shadow-lg hover:shadow-purple-500/10 ${!p.active ? "opacity-60" : ""}`}>
              {/* Image Placeholder */}
              <div className="h-36 relative" style={{ background: p.gradient }}>
                <div className="absolute inset-0 flex items-center justify-center">
                  <Package size={40} className="text-white/30" />
                </div>
                {!p.active && (
                  <div className="absolute top-2 right-2 bg-black/60 text-red-400 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">
                    Inactive
                  </div>
                )}
              </div>
              <div className="p-4 space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-semibold text-sm leading-tight line-clamp-2 text-text-primary">{p.name}</h3>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase shrink-0 ${CATEGORY_COLORS[p.category]}`}>
                    {p.category}
                  </span>
                </div>
                <p className="text-xs text-text-muted line-clamp-2">{p.description}</p>
                <p className="font-bold text-accent-purple text-lg">{formatPrice(p.price)}</p>
                <StockBar stock={p.stock} />
                <div className="flex gap-2 pt-1">
                  <button
                    onClick={() => handleEdit(p)}
                    className="flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg bg-white/5 hover:bg-accent-purple/20 hover:text-accent-purple text-text-muted text-xs font-medium transition-colors"
                  >
                    <Edit2 size={12} /> Edit
                  </button>
                  <button
                    onClick={() => toggleActive(p.id)}
                    className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                      p.active
                        ? "bg-white/5 hover:bg-red-500/20 hover:text-red-400 text-text-muted"
                        : "bg-green-500/10 hover:bg-green-500/20 text-green-400"
                    }`}
                  >
                    <Power size={12} /> {p.active ? "Deactivate" : "Activate"}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Table View */}
      {view === "table" && (
        <div className="glass rounded-2xl border border-purple-500/20 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-text-muted uppercase border-b border-purple-500/20 bg-white/[0.02]">
                <tr>
                  {["Product", "Category", "Price", "Stock", "Status", "Actions"].map(h => (
                    <th key={h} className="py-3.5 px-5 font-semibold tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map(p => (
                  <tr key={p.id} className="border-b border-purple-500/10 hover:bg-white/[0.03] transition-colors">
                    <td className="py-4 px-5">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg shrink-0" style={{ background: p.gradient }} />
                        <div>
                          <p className="font-medium text-text-primary">{p.name}</p>
                          <p className="text-xs text-text-muted font-mono">{p.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-5">
                      <span className={`text-[10px] font-bold px-2 py-1 rounded-full uppercase ${CATEGORY_COLORS[p.category]}`}>
                        {p.category}
                      </span>
                    </td>
                    <td className="py-4 px-5 font-semibold text-accent-purple">{formatPrice(p.price)}</td>
                    <td className="py-4 px-5 min-w-[140px]"><StockBar stock={p.stock} /></td>
                    <td className="py-4 px-5">
                      <span className={`text-xs font-semibold ${p.active ? "text-green-400" : "text-red-400"}`}>
                        ● {p.active ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="py-4 px-5">
                      <div className="flex items-center gap-2">
                        <button onClick={() => handleEdit(p)} className="p-1.5 rounded-lg bg-white/5 hover:bg-accent-purple/20 hover:text-accent-purple text-text-muted transition-colors">
                          <Edit2 size={14} />
                        </button>
                        <button onClick={() => toggleActive(p.id)} className={`p-1.5 rounded-lg transition-colors ${p.active ? "bg-white/5 hover:bg-red-500/20 hover:text-red-400 text-text-muted" : "bg-green-500/10 text-green-400"}`}>
                          <Power size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add / Edit Product Panel */}
      {panelOpen && (
        <div ref={panelRef} className="glass rounded-2xl border border-purple-500/30 p-6 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold font-jakarta">{editingId ? "Edit Product" : "Add New Product"}</h2>
            <button onClick={() => { setPanelOpen(false); setEditingId(null); setForm(EMPTY_FORM); }} className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-text-muted transition-colors">
              <X size={16} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="md:col-span-2">
              <label className={labelCls}>Product Name *</label>
              <input required value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} className={inputCls} placeholder="e.g. Kawaii Mystery Box Classic" />
            </div>
            <div className="md:col-span-2">
              <label className={labelCls}>Description</label>
              <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} className={`${inputCls} resize-none`} rows={3} placeholder="Brief product description…" />
            </div>
            <div>
              <label className={labelCls}>Price (INR) *</label>
              <input required type="number" min="0" value={form.price} onChange={e => setForm(f => ({ ...f, price: e.target.value }))} className={inputCls} placeholder="799" />
            </div>
            <div>
              <label className={labelCls}>Category *</label>
              <select required value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value as Category }))} className={`${inputCls} cursor-pointer`}>
                <option value="">Select category…</option>
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className={labelCls}>Stock Units *</label>
              <input required type="number" min="0" value={form.stock} onChange={e => setForm(f => ({ ...f, stock: e.target.value }))} className={inputCls} placeholder="50" />
            </div>
            <div>
              <label className={labelCls}>Product Images</label>
              <div className="border-2 border-dashed border-purple-500/30 rounded-xl p-6 flex flex-col items-center gap-2 cursor-pointer hover:border-purple-500/50 transition-colors">
                <ImagePlus size={24} className="text-text-muted" />
                <p className="text-xs text-text-muted">Click to upload images</p>
              </div>
            </div>
            <div className="md:col-span-2 flex justify-end gap-3">
              <button type="button" onClick={() => { setPanelOpen(false); setEditingId(null); setForm(EMPTY_FORM); }} className="btn-secondary text-sm px-6">
                Cancel
              </button>
              <button type="submit" className="btn-primary text-sm px-6 flex items-center gap-2">
                <Tag size={14} /> {editingId ? "Save Changes" : "Create Product"}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
