"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Search, Package, Truck, CheckCircle2, Clock } from "lucide-react";
import { IOrder } from "@/types";

export default function TrackOrderPage() {
  const [query, setQuery] = useState("");
  const [order, setOrder] = useState<IOrder | null>(null);
  const [searched, setSearched] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setSearched(true);
    try {
      const res = await fetch(`/api/orders/${encodeURIComponent(query.trim())}`);
      if (res.ok) {
        const data = await res.json();
        setOrder(data);
      } else {
        setOrder(null);
      }
    } catch {
      setOrder(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
      <div className="text-center max-w-xl mx-auto mb-10">
        <h1 className="text-2xl sm:text-4xl font-black uppercase tracking-wider text-black">
          Track Your Delivery
        </h1>
        <p className="text-xs sm:text-sm text-neutral-600 mt-2">
          Enter your TBH order reference number (e.g. TBH-90214) to view live fulfillment and islandwide courier status.
        </p>

        <form onSubmit={handleTrack} className="mt-6 flex gap-2">
          <input
            type="text"
            required
            placeholder="e.g. TBH-90214"
            value={query}
            onChange={(e) => setQuery(e.target.value.toUpperCase())}
            className="flex-1 border border-neutral-300 rounded-full px-5 py-3 text-xs uppercase font-bold focus:outline-hidden focus:border-black"
          />
          <button
            type="submit"
            disabled={loading}
            className="bg-black text-white px-7 py-3 rounded-full text-xs font-black uppercase tracking-wider hover:bg-neutral-800 transition-colors shrink-0"
          >
            {loading ? "SEARCHING..." : "TRACK"}
          </button>
        </form>
      </div>

      {searched && (
        <div>
          {order ? (
            <div className="border border-neutral-200 rounded-3xl p-6 sm:p-8 bg-neutral-50 shadow-xs space-y-6">
              <div className="flex flex-col sm:flex-row justify-between pb-4 border-b border-neutral-200 gap-2">
                <div>
                  <span className="text-[10px] uppercase font-bold text-neutral-400">ORDER NO</span>
                  <div className="text-base font-black text-black">{order.orderNumber}</div>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-neutral-400">WAYBILL TRACKING</span>
                  <div className="text-xs font-bold text-neutral-800">{order.trackingNumber || "Assigned Upon Dispatch"}</div>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-neutral-400">CURRENT STATUS</span>
                  <div className="text-xs font-black uppercase px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 inline-block">
                    {order.orderStatus}
                  </div>
                </div>
              </div>

              {/* Items in order */}
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-black block mb-3">
                  Package Contents ({order.items.length})
                </span>
                <div className="space-y-2">
                  {order.items.map((item, idx) => (
                    <div key={idx} className="flex justify-between text-xs py-1 border-b border-neutral-200">
                      <span>{item.name} × {item.quantity}</span>
                      <strong className="text-black">Rs. {(item.price * item.quantity).toLocaleString()}</strong>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-between text-xs text-neutral-600 pt-2 border-t border-neutral-200">
                <span>Delivery To:</span>
                <strong>{order.shippingAddress.street}, {order.shippingAddress.city}</strong>
              </div>
            </div>
          ) : (
            <div className="p-8 border border-neutral-200 rounded-3xl text-center bg-neutral-50">
              <p className="text-xs font-bold text-neutral-700">No order found matching &quot;{query}&quot;</p>
              <p className="text-[11px] text-neutral-400 mt-1">Please check your order number or contact our WhatsApp concierge.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
