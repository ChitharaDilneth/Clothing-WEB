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
        <h1 className="text-2xl font-black uppercase tracking-wider text-neutral-900">
          Promotional Coupons
        </h1>
        <p className="text-xs text-neutral-500 mt-0.5 font-medium">
          Create percentage and fixed LKR discounts for promotional campaigns.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Create Form */}
        <div className="lg:col-span-5 bg-white border border-neutral-200/80 rounded-3xl p-6 shadow-[0_2px_16px_rgba(0,0,0,0.03)]">
          <h2 className="text-sm font-black uppercase tracking-wider text-neutral-900 mb-4">
            Create Discount Code
          </h2>

          <form onSubmit={handleCreateCoupon} className="space-y-4 text-xs">
            <div>
              <label className="font-bold text-neutral-700 block mb-1">Coupon Code *</label>
              <input
                type="text"
                required
                placeholder="e.g. SUMMER25"
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
                className="w-full bg-neutral-50 border border-neutral-200 rounded-2xl p-3 text-neutral-900 font-mono uppercase focus:outline-hidden focus:border-black font-bold"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-bold text-neutral-700 block mb-1">Type</label>
                <select
                  value={discountType}
                  onChange={(e) => setDiscountType(e.target.value as any)}
                  className="w-full bg-neutral-50 border border-neutral-200 rounded-2xl p-3 text-neutral-900 focus:outline-hidden focus:border-black cursor-pointer font-medium"
                >
                  <option value="percentage">Percentage (%)</option>
                  <option value="fixed">Fixed (LKR)</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-neutral-700 block mb-1">Discount Value</label>
                <input
                  type="number"
                  required
                  value={discountValue}
                  onChange={(e) => setDiscountValue(Number(e.target.value))}
                  className="w-full bg-neutral-50 border border-neutral-200 rounded-2xl p-3 text-neutral-900 font-bold focus:outline-hidden focus:border-black"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-bold text-neutral-700 block mb-1">Min Order Value</label>
                <input
                  type="number"
                  value={minOrderValue}
                  onChange={(e) => setMinOrderValue(Number(e.target.value))}
                  className="w-full bg-neutral-50 border border-neutral-200 rounded-2xl p-3 text-neutral-900 focus:outline-hidden focus:border-black"
                />
              </div>

              <div>
                <label className="font-bold text-neutral-700 block mb-1">Max Cap (LKR)</label>
                <input
                  type="number"
                  value={maxDiscount}
                  onChange={(e) => setMaxDiscount(Number(e.target.value))}
                  className="w-full bg-neutral-50 border border-neutral-200 rounded-2xl p-3 text-neutral-900 focus:outline-hidden focus:border-black"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-black hover:bg-neutral-800 text-white font-bold py-3.5 rounded-2xl uppercase tracking-wider text-xs transition-colors shadow-xs cursor-pointer flex items-center justify-center gap-2"
            >
              <Plus className="w-4 h-4" />
              <span>Create Coupon</span>
            </button>
          </form>
        </div>

        {/* Existing Coupons Table */}
        <div className="lg:col-span-7 bg-white border border-neutral-200/80 rounded-3xl p-6 shadow-[0_2px_16px_rgba(0,0,0,0.03)]">
          <h2 className="text-sm font-black uppercase tracking-wider text-neutral-900 mb-4">
            Active Discount Codes ({coupons.length})
          </h2>

          <div className="space-y-3">
            {loading ? (
              <div className="text-xs text-neutral-400 py-6 text-center">Loading coupons...</div>
            ) : coupons.length === 0 ? (
              <div className="text-xs text-neutral-400 py-6 text-center">No active coupons found.</div>
            ) : (
              coupons.map((c) => (
                <div
                  key={c.code}
                  className="p-4 rounded-2xl bg-neutral-50 border border-neutral-200/80 flex items-center justify-between"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <strong className="text-neutral-900 font-mono text-sm tracking-wider font-black">
                        {c.code}
                      </strong>
                      <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-black uppercase px-2 py-0.5 rounded-full">
                        {c.discountType === "percentage" ? `${c.discountValue}% OFF` : `Rs. ${c.discountValue} OFF`}
                      </span>
                    </div>
                    <span className="text-[11px] text-neutral-500 block mt-1">
                      Min spend: Rs. {c.minOrderValue?.toLocaleString()} • Max cap: Rs. {c.maxDiscount?.toLocaleString()}
                    </span>
                  </div>

                  <span className="text-[10px] font-bold text-neutral-400 bg-white border border-neutral-200 px-2.5 py-1 rounded-full">
                    Active
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
