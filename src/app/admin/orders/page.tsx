"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { Search, ShoppingBag, Truck, Check, Edit, X, Eye } from "lucide-react";
import { IOrder, OrderStatus } from "@/types";
import { toast } from "sonner";

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<IOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // Selected Order for Status Update Modal
  const [selectedOrder, setSelectedOrder] = useState<IOrder | null>(null);
  const [newStatus, setNewStatus] = useState<OrderStatus>("processing");
  const [trackingNumber, setTrackingNumber] = useState("");
  const [internalNotes, setInternalNotes] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);

  const loadOrders = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/orders");
      const data = await res.json();
      setOrders(data || []);
    } catch (e) {
      console.error("Failed to load orders", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const openStatusModal = (ord: IOrder) => {
    setSelectedOrder(ord);
    setNewStatus(ord.orderStatus);
    setTrackingNumber(ord.trackingNumber || "");
    setInternalNotes(ord.internalNotes || "");
  };

  const handleUpdateStatus = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOrder) return;

    setIsUpdating(true);
    try {
      const res = await fetch(`/api/orders/${selectedOrder.orderNumber}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: newStatus,
          trackingNumber,
          internalNotes,
        }),
      });

      if (res.ok) {
        toast.success(`Order #${selectedOrder.orderNumber} status updated to ${newStatus}`);
        setSelectedOrder(null);
        loadOrders();
      } else {
        toast.error("Failed to update status");
      }
    } catch {
      toast.error("Network error updating order");
    } finally {
      setIsUpdating(false);
    }
  };

  const filteredOrders = orders.filter((o) => {
    const custName = o.customer?.name || "";
    const custPhone = o.customer?.phone || "";
    const orderNum = o.orderNumber || "";

    const matchesSearch =
      orderNum.toLowerCase().includes(search.toLowerCase()) ||
      custName.toLowerCase().includes(search.toLowerCase()) ||
      custPhone.includes(search);
    const matchesStatus = statusFilter === "all" || o.orderStatus === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black uppercase tracking-wider text-white">
            Order Management ({orders.length})
          </h1>
          <p className="text-xs text-neutral-400 mt-0.5">
            Review customer purchases, assign courier waybills, and update dispatch status.
          </p>
        </div>
      </div>

      {/* Search and Status Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1 relative flex items-center">
          <Search className="w-4 h-4 text-neutral-400 absolute left-3" />
          <input
            type="text"
            placeholder="Search by Order #, Customer Name, or Phone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-neutral-900 border border-neutral-800 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-neutral-500 focus:outline-hidden"
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="bg-neutral-900 border border-neutral-800 rounded-xl px-4 py-2 text-xs text-white focus:outline-hidden cursor-pointer"
        >
          <option value="all">All Statuses</option>
          <option value="pending">Pending</option>
          <option value="confirmed">Confirmed</option>
          <option value="processing">Processing</option>
          <option value="shipped">Shipped</option>
          <option value="delivered">Delivered</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      {/* Orders Table */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-3xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-neutral-300">
            <thead className="bg-black text-[10px] uppercase font-bold text-neutral-400 border-b border-neutral-800">
              <tr>
                <th className="py-3 px-4">Order Ref</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Customer</th>
                <th className="py-3 px-4">Items</th>
                <th className="py-3 px-4">Total Amount</th>
                <th className="py-3 px-4">Payment</th>
                <th className="py-3 px-4">Fulfillment Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-800/80 font-medium">
              {loading ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-neutral-500">
                    Loading orders...
                  </td>
                </tr>
              ) : filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-neutral-500">
                    No orders found.
                  </td>
                </tr>
              ) : (
                filteredOrders.map((o) => (
                  <tr key={o.orderNumber} className="hover:bg-neutral-800/30">
                    <td className="py-3 px-4 font-black text-white">{o.orderNumber || "TBH-ORDER"}</td>
                    <td className="py-3 px-4 text-neutral-400">
                      {new Date(o.createdAt || Date.now()).toLocaleDateString("en-LK")}
                    </td>
                    <td className="py-3 px-4">
                      <strong className="text-white block font-bold">{o.customer?.name || "Customer"}</strong>
                      <span className="text-[11px] text-neutral-400">{o.customer?.phone || "N/A"}</span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-semibold">{o.items?.length || 0} items</span>
                      <span className="text-[10px] text-neutral-400 block truncate max-w-[150px]">
                        {(o.items || []).map((i) => i.name).join(", ")}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-black text-white">
                      Rs. {(o.total || 0).toLocaleString()}
                    </td>
                    <td className="py-3 px-4">
                      <span className="uppercase text-[10px] font-bold block">{o.paymentMethod}</span>
                      <span
                        className={`text-[9px] font-bold uppercase ${
                          o.paymentStatus === "paid" ? "text-emerald-400" : "text-amber-400"
                        }`}
                      >
                        ● {o.paymentStatus}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                          o.orderStatus === "delivered"
                            ? "bg-emerald-950 text-emerald-400 border border-emerald-800"
                            : o.orderStatus === "shipped"
                            ? "bg-blue-950 text-blue-400 border border-blue-800"
                            : "bg-neutral-800 text-neutral-200"
                        }`}
                      >
                        {o.orderStatus}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => openStatusModal(o)}
                        className="bg-neutral-800 hover:bg-neutral-700 text-white px-3 py-1.5 rounded-lg text-[11px] font-bold transition-colors"
                      >
                        Update
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: Update Order Fulfillment */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4">
          <div className="bg-neutral-900 border border-neutral-800 rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl text-neutral-200">
            <div className="flex items-center justify-between pb-4 border-b border-neutral-800">
              <div>
                <h3 className="text-base font-black uppercase tracking-wider text-white">
                  Update Order #{selectedOrder.orderNumber}
                </h3>
                <span className="text-[11px] text-neutral-400">
                  Recipient: {selectedOrder.customer?.name || "Customer"} ({selectedOrder.customer?.phone || "N/A"})
                </span>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="text-neutral-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUpdateStatus} className="mt-5 space-y-4 text-xs">
              <div>
                <label className="font-bold text-neutral-300 block mb-1">
                  Fulfillment Status
                </label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value as OrderStatus)}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl p-2.5 text-white font-bold focus:outline-hidden cursor-pointer"
                >
                  <option value="pending">Pending</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="processing">Processing</option>
                  <option value="shipped">Shipped</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled</option>
                  <option value="returned">Returned</option>
                  <option value="refunded">Refunded</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-neutral-300 block mb-1">
                  Courier Tracking / Waybill Number
                </label>
                <input
                  type="text"
                  value={trackingNumber}
                  onChange={(e) => setTrackingNumber(e.target.value)}
                  placeholder="e.g. PRONET-902148"
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl p-2.5 text-white focus:outline-hidden font-mono"
                />
              </div>

              <div>
                <label className="font-bold text-neutral-300 block mb-1">
                  Internal Administrative Notes
                </label>
                <textarea
                  rows={2}
                  value={internalNotes}
                  onChange={(e) => setInternalNotes(e.target.value)}
                  placeholder="e.g. Verified via WhatsApp call, packaging customized flip-flops..."
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl p-2.5 text-white focus:outline-hidden resize-none"
                />
              </div>

              <div className="pt-4 flex gap-3 border-t border-neutral-800">
                <button
                  type="button"
                  onClick={() => setSelectedOrder(null)}
                  className="flex-1 py-3 rounded-xl border border-neutral-800 text-neutral-300 font-bold uppercase hover:bg-neutral-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isUpdating}
                  className="flex-1 py-3 rounded-xl bg-white text-black font-black uppercase hover:bg-neutral-200 transition-colors disabled:opacity-50"
                >
                  {isUpdating ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
