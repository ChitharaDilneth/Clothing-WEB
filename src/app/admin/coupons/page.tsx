"use client";

import React, { useEffect, useState } from "react";
import { Tag, Plus, Trash2, Check, X } from "lucide-react";
import { ICoupon } from "@/types";
import { toast } from "sonner";

export default function AdminCouponsPage() {
  const [coupons, setCoupons] = useState<ICoupon[]>([]);
  const [loading, setLoading] = useState(true);

  // Form State
  const [code, setCode] = useState("");
  const [discountType, setDiscountType] = useState<"percentage" | "fixed">("percentage");
  const [discountValue, setDiscountValue] = useState<number>(15);
  const [minOrderValue, setMinOrderValue] = useState<number>(5000);
  const [maxDiscount, setMaxDiscount] = useState<number>(1500);

  const loadCoupons = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/coupons");
      const data = await res.json();
      setCoupons(data || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCoupons();
  }, []);

  const handleCreateCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim()) return;

    try {
      const res = await fetch("/api/coupons", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code: code.trim().toUpperCase(),
          discountType,
          discountValue,
          minOrderValue,
          maxDiscount,
        }),
      });
      if (res.ok) {
        toast.success(`Coupon ${code.toUpperCase()} created!`);
        setCode("");
        loadCoupons();
      } else {
        toast.error("Failed to create coupon");
      }
    } catch {
      toast.error("Network error creating coupon");
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-black uppercase tracking-wider text-white">
          Promotional Coupons
        </h1>
        <p className="text-xs text-neutral-400 mt-0.5">
          Create percentage and fixed LKR discounts for promotional campaigns.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Create Form */}
        <div className="lg:col-span-5 bg-neutral-900 border border-neutral-800 rounded-3xl p-6 shadow-xs">
          <h2 className="text-sm font-black uppercase tracking-wider text-white mb-4">
            Create Discount Code
          </h2>

          <form onSubmit={handleCreateCoupon} className="space-y-4 text-xs">
            <div>
              <label className="font-bold text-neutral-300 block mb-1">Coupon Code *</label>
              <input
                type="text"
                required
                placeholder="e.g. SUMMER25"
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
                className="w-full bg-neutral-950 border border-neutral-800 rounded-xl p-2.5 text-white font-mono uppercase focus:outline-hidden"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-bold text-neutral-300 block mb-1">Type</label>
                <select
                  value={discountType}
                  onChange={(e) => setDiscountType(e.target.value as any)}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl p-2.5 text-white focus:outline-hidden cursor-pointer"
                >
                  <option value="percentage">Percentage (%)</option>
                  <option value="fixed">Fixed (LKR)</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-neutral-300 block mb-1">Discount Value</label>
                <input
                  type="number"
                  required
                  value={discountValue}
                  onChange={(e) => setDiscountValue(Number(e.target.value))}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl p-2.5 text-white font-bold focus:outline-hidden"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-bold text-neutral-300 block mb-1">Min Order Value</label>
                <input
                  type="number"
                  value={minOrderValue}
                  onChange={(e) => setMinOrderValue(Number(e.target.value))}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl p-2.5 text-white focus:outline-hidden"
                />
              </div>

              <div>
                <label className="font-bold text-neutral-300 block mb-1">Max Cap (LKR)</label>
                <input
                  type="number"
                  value={maxDiscount}
                  onChange={(e) => setMaxDiscount(Number(e.target.value))}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl p-2.5 text-white focus:outline-hidden"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-white text-black py-3 rounded-xl font-black uppercase tracking-wider hover:bg-neutral-200 transition-colors shadow-xs"
            >
              Publish Coupon
            </button>
          </form>
        </div>

        {/* Existing Coupons List */}
        <div className="lg:col-span-7 bg-neutral-900 border border-neutral-800 rounded-3xl p-6 shadow-xs">
          <h2 className="text-sm font-black uppercase tracking-wider text-white mb-4">
            Active Store Coupons ({coupons.length})
          </h2>

          <div className="divide-y divide-neutral-800 text-xs">
            {coupons.map((c) => (
              <div key={c._id || c.code} className="py-3.5 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-black text-white text-sm bg-neutral-950 px-2.5 py-0.5 rounded-lg border border-neutral-800">
                      {c.code}
                    </span>
                    <span className="text-[10px] text-emerald-400 font-bold bg-emerald-950 px-2 py-0.5 rounded-full border border-emerald-800">
                      Active
                    </span>
                  </div>
                  <div className="text-[11px] text-neutral-400 mt-1">
                    {c.discountType === "percentage" ? `${c.discountValue}% Off` : `Rs. ${c.discountValue} Off`}
                    {c.minOrderValue && ` • Min order Rs. ${c.minOrderValue.toLocaleString()}`}
                  </div>
                </div>

                <div className="text-right">
                  <span className="font-bold text-white text-xs block">{c.usedCount || 0} Redemptions</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
