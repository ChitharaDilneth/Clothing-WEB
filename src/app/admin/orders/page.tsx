"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { Search, ShoppingBag, Truck, Check, Edit, X, Eye, ChevronDown } from "lucide-react";
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
          <h1 className="text-2xl font-black uppercase tracking-wider text-neutral-900">
            Order Management ({orders.length})
          </h1>
          <p className="text-xs text-neutral-500 mt-0.5 font-medium">
            Review customer purchases, assign courier waybills, and update dispatch status.
          </p>
        </div>
      </div>

      {/* Search and Status Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1 relative flex items-center">
          <Search className="w-4 h-4 text-neutral-400 absolute left-3.5" />
          <input
            type="text"
            placeholder="Search by Order #, Customer Name, or Phone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-white border border-neutral-200/90 rounded-2xl pl-10 pr-4 py-2.5 text-xs text-neutral-900 placeholder-neutral-400 focus:outline-hidden focus:border-black shadow-xs font-medium"
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="bg-white border border-neutral-200/90 rounded-2xl px-4 py-2.5 text-xs text-neutral-900 focus:outline-hidden focus:border-black cursor-pointer shadow-xs font-medium"
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
      <div className="glass-panel rounded-3xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-neutral-700">
            <thead className="bg-neutral-50 text-[10px] uppercase font-bold text-neutral-500 border-b border-neutral-200">
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
            <tbody className="divide-y divide-neutral-100 font-medium">
              {loading ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-neutral-400">
                    Loading orders...
                  </td>
                </tr>
              ) : filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-neutral-400">
                    No orders found.
                  </td>
                </tr>
              ) : (
                filteredOrders.map((o) => (
                  <tr key={o.orderNumber} className="hover:bg-neutral-50/70 transition-colors">
                    <td className="py-3 px-4 font-black text-neutral-900">{o.orderNumber || "TBH-ORDER"}</td>
                    <td className="py-3 px-4 text-neutral-500">
                      {new Date(o.createdAt || Date.now()).toLocaleDateString("en-LK")}
                    </td>
                    <td className="py-3 px-4">
                      <strong className="text-neutral-900 block font-bold">{o.customer?.name || "Customer"}</strong>
                      <span className="text-[11px] text-neutral-500">{o.customer?.phone || "N/A"}</span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-semibold text-neutral-800">{o.items?.length || 0} items</span>
                      <span className="text-[10px] text-neutral-400 block truncate max-w-[150px]">
                        {(o.items || []).map((i) => i.name).join(", ")}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-black text-neutral-900">
                      Rs. {(o.total || 0).toLocaleString()}
                    </td>
                    <td className="py-3 px-4">
                      <span className="uppercase text-[10px] font-bold block text-neutral-800">{o.paymentMethod}</span>
                      <span
                        className={`text-[9px] font-bold uppercase ${
                          o.paymentStatus === "paid" ? "text-emerald-600" : "text-amber-600"
                        }`}
                      >
                        ● {o.paymentStatus}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider inline-flex items-center gap-1 ${
                          o.orderStatus === "delivered"
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                            : o.orderStatus === "shipped"
                            ? "bg-blue-50 text-blue-700 border border-blue-200"
                            : "bg-neutral-100 text-neutral-700"
                        }`}
                      >
                        {o.orderStatus}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => openStatusModal(o)}
                        className="bg-black hover:bg-neutral-800 text-white px-3 py-1.5 rounded-xl text-[11px] font-bold transition-colors cursor-pointer shadow-xs"
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="bg-white border border-neutral-200 rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl text-neutral-900">
            <div className="flex items-center justify-between pb-4 border-b border-neutral-100">
              <div>
                <h3 className="text-base font-black uppercase tracking-wider text-neutral-900">
                  Update Order #{selectedOrder.orderNumber}
                </h3>
                <span className="text-[11px] text-neutral-500">
                  Recipient: {selectedOrder.customer?.name || "Customer"} ({selectedOrder.customer?.phone || "N/A"})
                </span>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="text-neutral-400 hover:text-black cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUpdateStatus} className="mt-5 space-y-4 text-xs">
              <div>
                <label className="font-bold text-neutral-700 block mb-1">
                  Fulfillment Status
                </label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value as OrderStatus)}
                  className="w-full bg-neutral-50 border border-neutral-200 rounded-xl p-2.5 text-neutral-900 font-bold focus:outline-hidden focus:border-black cursor-pointer"
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
                <label className="font-bold text-neutral-700 block mb-1">
                  Courier Tracking / Waybill Number
                </label>
                <input
                  type="text"
                  value={trackingNumber}
                  onChange={(e) => setTrackingNumber(e.target.value)}
                  placeholder="e.g. PRONET-902148"
                  className="w-full bg-neutral-50 border border-neutral-200 rounded-xl p-2.5 text-neutral-900 focus:outline-hidden focus:border-black font-mono font-medium"
                />
              </div>

              <div>
                <label className="font-bold text-neutral-700 block mb-1">
                  Internal Administrative Notes
                </label>
                <textarea
                  rows={2}
                  value={internalNotes}
                  onChange={(e) => setInternalNotes(e.target.value)}
                  placeholder="e.g. Verified via WhatsApp call, packaging customized flip-flops..."
                  className="w-full bg-neutral-50 border border-neutral-200 rounded-xl p-2.5 text-neutral-900 focus:outline-hidden focus:border-black resize-none"
                />
              </div>

              <div className="pt-4 flex gap-3 border-t border-neutral-100">
                <button
                  type="button"
                  onClick={() => setSelectedOrder(null)}
                  className="flex-1 py-3 rounded-2xl border border-neutral-200 text-neutral-700 font-bold uppercase hover:bg-neutral-100 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isUpdating}
                  className="flex-1 py-3 rounded-2xl bg-black text-white font-bold uppercase hover:bg-neutral-800 transition-colors disabled:opacity-50 cursor-pointer shadow-xs"
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
