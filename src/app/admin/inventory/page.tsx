"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { Sliders, Plus, Minus, Search, AlertTriangle, Check, ShieldCheck } from "lucide-react";
import { IProduct } from "@/types";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";

export default function AdminInventoryPage() {
  const { user } = useAuth();
  const isBrandManager = user?.role === "brand_manager" || user?.role === "vendor";
  const brandSlug = user?.brandSlug || "";

  const [products, setProducts] = useState<IProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const loadData = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/products?limit=100");
      const data = await res.json();
      setProducts(data.products || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleStockAdjustment = async (p: IProduct, delta: number) => {
    const newStock = Math.max(0, p.stock + delta);
    try {
      const id = p._id || p.slug;
      const res = await fetch(`/api/products/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ stock: newStock }),
      });
      if (res.ok) {
        toast.success(`Updated stock for ${p.name} to ${newStock}`);
        setProducts((prev) =>
          prev.map((item) =>
            item._id === p._id || item.slug === p.slug ? { ...item, stock: newStock } : item
          )
        );
      }
    } catch {
      toast.error("Failed to update stock");
    }
  };

  const filtered = products.filter((p) => {
    if (isBrandManager && brandSlug) {
      if ((p.brand || "").toLowerCase() !== brandSlug.toLowerCase()) return false;
    }
    return (
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.sku.toLowerCase().includes(search.toLowerCase())
    );
  });

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-black uppercase tracking-wider text-neutral-900">
            {isBrandManager && brandSlug ? `${brandSlug.toUpperCase()} Inventory Control` : "Inventory Control"}
          </h1>
          {isBrandManager && (
            <span className="bg-amber-100 text-amber-800 text-xs font-bold px-2.5 py-0.5 rounded-full border border-amber-300 uppercase">
              Partner Scoped
            </span>
          )}
        </div>
        <p className="text-xs text-neutral-500 mt-0.5 font-medium">
          {isBrandManager
            ? `Audit, replenish stock counts, and monitor units exclusively for ${brandSlug.toUpperCase()} catalog items.`
            : "Real-time stock audits, replenishment triggers, and low inventory tracking."}
        </p>
      </div>

      <div className="relative flex items-center max-w-md">
        <Search className="w-4 h-4 text-neutral-400 absolute left-3.5" />
        <input
          type="text"
          placeholder="Filter SKU or name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-white border border-neutral-200/90 rounded-2xl pl-10 pr-4 py-2.5 text-xs text-neutral-900 placeholder-neutral-400 focus:outline-hidden focus:border-black font-medium shadow-xs"
        />
      </div>

      <div className="bg-white border border-neutral-200/80 rounded-3xl overflow-hidden shadow-[0_2px_16px_rgba(0,0,0,0.03)]">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-neutral-700">
            <thead className="bg-neutral-50 text-[10px] uppercase font-bold text-neutral-500 border-b border-neutral-200">
              <tr>
                <th className="py-3 px-4">Product</th>
                <th className="py-3 px-4">SKU</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Current Stock</th>
                <th className="py-3 px-4">Threshold Health</th>
                <th className="py-3 px-4 text-right">Adjust Quantity</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 font-medium">
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-neutral-400">
                    Loading inventory...
                  </td>
                </tr>
              ) : (
                filtered.map((p) => (
                  <tr key={p._id || p.sku} className="hover:bg-neutral-50/70 transition-colors">
                    <td className="py-3 px-4 flex items-center gap-3">
                      <div className="w-8 h-10 rounded-xl bg-neutral-100 overflow-hidden relative shrink-0 border border-neutral-200">
                        {p.images?.[0]?.url && (
                          <Image src={p.images[0].url} alt={p.name} fill className="object-cover" sizes="32px" />
                        )}
                      </div>
                      <span className="font-bold text-neutral-900 truncate max-w-[200px]">{p.name}</span>
                    </td>
                    <td className="py-3 px-4 font-mono text-[11px] text-neutral-500">{p.sku}</td>
                    <td className="py-3 px-4 text-neutral-700">{p.category}</td>
                    <td className="py-3 px-4 font-black text-neutral-900 text-sm">{p.stock} units</td>
                    <td className="py-3 px-4">
                      {p.stock === 0 ? (
                        <span className="text-red-700 font-bold bg-red-50 px-2.5 py-0.5 rounded-full border border-red-200 text-[10px] uppercase">
                          Out of Stock
                        </span>
                      ) : p.stock <= 3 ? (
                        <span className="text-amber-700 font-bold bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200 text-[10px] uppercase flex items-center gap-1 w-max">
                          <AlertTriangle className="w-3 h-3" />
                          Low Stock Alert
                        </span>
                      ) : (
                        <span className="text-emerald-700 font-bold bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200 text-[10px] uppercase">
                          Healthy
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-right space-x-2">
                      <button
                        onClick={() => handleStockAdjustment(p, -1)}
                        className="p-1.5 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-neutral-700 transition-colors cursor-pointer"
                        title="Reduce 1"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleStockAdjustment(p, 5)}
                        className="px-2.5 py-1 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-neutral-900 font-bold text-[11px] transition-colors cursor-pointer"
                        title="Restock +5"
                      >
                        +5
                      </button>
                      <button
                        onClick={() => handleStockAdjustment(p, 10)}
                        className="px-3 py-1 rounded-xl bg-black text-white hover:bg-neutral-800 font-bold text-[11px] transition-colors cursor-pointer shadow-xs"
                        title="Restock +10"
                      >
                        +10
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
