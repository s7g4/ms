"use client";

import { useState, Suspense } from "react";
import { Barcode, ScanLine, Search, PackageCheck } from "lucide-react";
import { useSearchParams } from "next/navigation";

function ScanAndPackContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams?.get("order") || "";
  const [barcode, setBarcode] = useState("");
  const [scannedItems, setScannedItems] = useState<string[]>([]);
  
  const handleScan = (e: React.FormEvent) => {
    e.preventDefault();
    if (!barcode.trim()) return;
    
    // Placeholder logic for barcode scanning
    setScannedItems(prev => [...prev, barcode]);
    setBarcode("");
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 bg-accent-purple/10 text-accent-purple rounded-xl flex items-center justify-center border border-accent-purple/20">
          <Barcode size={20} />
        </div>
        <div>
          <h1 className="text-2xl font-bold font-jakarta">Scan & Pack</h1>
          <p className="text-sm text-text-muted">Use a barcode scanner or manual entry to verify items before packing.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Left Side: Scanner Input */}
        <div className="space-y-6">
          <div className="glass-card p-6 rounded-3xl text-center border-dashed border-2 border-purple-500/30">
            <ScanLine size={48} className="text-purple-400 mx-auto mb-4 animate-pulse" />
            <h2 className="text-xl font-bold mb-2">Ready to Scan</h2>
            <p className="text-text-muted text-sm mb-6">Scanner is active. Scan a product barcode or enter it manually below.</p>
            
            <form onSubmit={handleScan} className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                <input
                  type="text"
                  value={barcode}
                  onChange={(e) => setBarcode(e.target.value)}
                  placeholder="Scan or type barcode..."
                  className="w-full bg-black/20 border border-purple-500/20 rounded-xl pl-9 pr-4 py-3 text-sm focus:border-purple-500 focus:outline-none"
                  autoFocus
                />
              </div>
              <button type="submit" className="px-6 py-3 bg-purple-500 hover:bg-purple-600 text-white font-bold rounded-xl transition-colors">
                Enter
              </button>
            </form>
          </div>

          <div className="glass-card p-6 rounded-3xl bg-blue-500/5 border border-blue-500/20">
            <h3 className="font-bold text-lg mb-4 text-blue-400">Current Order Context</h3>
            {orderId ? (
              <div className="space-y-2">
                <p className="text-sm"><span className="text-text-muted">Order ID:</span> <span className="font-mono">{orderId}</span></p>
                <p className="text-sm"><span className="text-text-muted">Expected Items:</span> 3</p>
                <p className="text-sm text-yellow-400">Gift Message: "Happy Birthday! Love, Mom"</p>
              </div>
            ) : (
              <p className="text-sm text-text-muted">No specific order selected. Scan an order manifest barcode to begin.</p>
            )}
          </div>
        </div>

        {/* Right Side: Packing List */}
        <div className="glass-card p-6 rounded-3xl h-[600px] flex flex-col">
          <h3 className="font-bold text-lg mb-4 flex items-center justify-between">
            <span>Verified Items</span>
            <span className="text-sm font-normal text-text-muted">{scannedItems.length} scanned</span>
          </h3>
          
          <div className="flex-1 overflow-y-auto space-y-2">
            {scannedItems.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-text-muted">
                <PackageCheck size={32} className="mb-2 opacity-50" />
                <p className="text-sm">No items scanned yet.</p>
              </div>
            ) : (
              scannedItems.map((item, index) => (
                <div key={index} className="p-3 bg-green-500/10 border border-green-500/20 rounded-xl flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-green-500/20 text-green-400 flex items-center justify-center">
                    <PackageCheck size={16} />
                  </div>
                  <div>
                    <p className="font-mono text-sm">{item}</p>
                    <p className="text-xs text-green-400">Verified</p>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="pt-4 border-t border-white/5 mt-auto">
            <button 
              disabled={scannedItems.length === 0}
              className="w-full py-4 bg-green-500 hover:bg-green-600 disabled:bg-white/5 disabled:text-text-muted text-white font-bold rounded-xl transition-colors flex items-center justify-center gap-2"
            >
              <PackageCheck size={20} />
              Mark as Packed & Print Label
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ScanAndPackPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-text-muted">Loading scanner module...</div>}>
      <ScanAndPackContent />
    </Suspense>
  );
}
