"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { Sparkles, Check, X, Phone, Mail, ExternalLink } from "lucide-react";
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
        <h1 className="text-2xl font-black uppercase tracking-wider text-neutral-900">
          Make Your Own Waves Requests ({orders.length})
        </h1>
        <p className="text-xs text-neutral-500 mt-0.5 font-medium">
          Review customized sandal monograms, artwork uploads, and artisan production requests.
        </p>
      </div>

      <div className="bg-white border border-neutral-200/80 rounded-3xl overflow-hidden shadow-[0_2px_16px_rgba(0,0,0,0.03)]">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-neutral-700">
            <thead className="bg-neutral-50 text-[10px] uppercase font-bold text-neutral-500 border-b border-neutral-200">
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
            <tbody className="divide-y divide-neutral-100 font-medium">
              {loading ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-neutral-400">
                    Loading custom orders...
                  </td>
                </tr>
              ) : orders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-neutral-400">
                    No custom orders submitted yet.
                  </td>
                </tr>
              ) : (
                orders.map((o) => (
                  <tr key={o._id || o.orderNumber} className="hover:bg-neutral-50/70 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-neutral-900">{o.orderNumber}</td>
                    <td className="py-3 px-4">
                      <strong className="text-neutral-900 block font-bold">{o.customerName}</strong>
                      <span className="text-[11px] text-neutral-500">{o.customerPhone}</span>
                    </td>
                    <td className="py-3 px-4 text-neutral-900 font-medium">{o.baseProductName}</td>
                    <td className="py-3 px-4 text-neutral-600">
                      {o.color} • Size {o.size}
                    </td>
                    <td className="py-3 px-4">
                      {o.customText && (
                        <span className="bg-neutral-100 px-2.5 py-1 rounded-lg border border-neutral-200 font-bold uppercase text-neutral-900 text-[10px] inline-block mr-2">
                          &ldquo;{o.customText}&rdquo;
                        </span>
                      )}
                      {o.artworkUrl && (
                        <a
                          href={o.artworkUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="text-black underline font-bold text-[11px] inline-flex items-center gap-1"
                        >
                          <span>View Graphic</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                    </td>
                    <td className="py-3 px-4 font-black text-neutral-900">
                      Rs. {o.price?.toLocaleString()}
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-emerald-50 text-emerald-700 border border-emerald-200">
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
