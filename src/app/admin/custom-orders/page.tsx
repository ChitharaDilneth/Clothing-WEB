"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { Sparkles, Check, X, Phone, Mail } from "lucide-react";
import { toast } from "sonner";

export default function AdminCustomOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/custom-orders");
      const data = await res.json();
      setOrders(data || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black uppercase tracking-wider text-white">
          Make Your Own Waves Requests ({orders.length})
        </h1>
        <p className="text-xs text-neutral-400 mt-0.5">
          Review customized sandal monograms, artwork uploads, and artisan production requests.
        </p>
      </div>

      <div className="bg-neutral-900 border border-neutral-800 rounded-3xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-neutral-300">
            <thead className="bg-black text-[10px] uppercase font-bold text-neutral-400 border-b border-neutral-800">
              <tr>
                <th className="py-3 px-4">Ref #</th>
                <th className="py-3 px-4">Customer</th>
                <th className="py-3 px-4">Base Product</th>
                <th className="py-3 px-4">Color &amp; Size</th>
                <th className="py-3 px-4">Custom Artwork / Text</th>
                <th className="py-3 px-4">Price</th>
                <th className="py-3 px-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-800/80 font-medium">
              {loading ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-neutral-500">
                    Loading custom orders...
                  </td>
                </tr>
              ) : orders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-neutral-500">
                    No custom orders submitted yet.
                  </td>
                </tr>
              ) : (
                orders.map((o) => (
                  <tr key={o._id || o.orderNumber} className="hover:bg-neutral-800/30">
                    <td className="py-3 px-4 font-mono font-bold text-white">{o.orderNumber}</td>
                    <td className="py-3 px-4">
                      <strong className="text-white block font-bold">{o.customerName}</strong>
                      <span className="text-[11px] text-neutral-400">{o.customerPhone}</span>
                    </td>
                    <td className="py-3 px-4 text-white font-medium">{o.baseProductName}</td>
                    <td className="py-3 px-4">
                      {o.color} • Size {o.size}
                    </td>
                    <td className="py-3 px-4">
                      {o.customText && (
                        <span className="bg-neutral-950 px-2 py-0.5 rounded border border-neutral-800 font-bold uppercase text-amber-400 text-[10px] inline-block mr-2">
                          &ldquo;{o.customText}&rdquo;
                        </span>
                      )}
                      {o.artworkUrl && (
                        <a
                          href={o.artworkUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="text-blue-400 underline text-[11px]"
                        >
                          View Graphic
                        </a>
                      )}
                    </td>
                    <td className="py-3 px-4 font-black text-white">
                      Rs. {o.price?.toLocaleString()}
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-emerald-950 text-emerald-400 border border-emerald-800">
                        {o.status}
                      </span>
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
