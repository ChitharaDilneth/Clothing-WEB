"use client";

import React, { useEffect, useState, useMemo } from "react";
import Image from "next/image";
import {
  Search,
  ShoppingBag,
  Package,
  CreditCard,
  Truck,
  CheckCircle2,
  Calendar,
  Download,
  Plus,
  Filter,
  Tag,
  MoreVertical,
  ChevronLeft,
  ChevronRight,
  Check,
  X,
  Loader2,
  Clock,
  Edit3,
} from "lucide-react";
import { IOrder, OrderStatus, PaymentStatus } from "@/types";
import { toast } from "sonner";

// Decorative SVG wave for Stat Cards (matching target design)
function StatWave({ color = "#10b981" }: { color?: string }) {
  return (
    <svg
      className="w-20 sm:w-24 h-10 opacity-70 shrink-0 self-end -mb-1 -mr-1"
      viewBox="0 0 100 40"
      fill="none"
    >
      <path
        d="M0 35 Q 25 15, 50 26 T 100 12 L 100 40 L 0 40 Z"
        fill={color}
        fillOpacity="0.18"
      />
      <path
        d="M0 35 Q 25 15, 50 26 T 100 12"
        stroke={color}
        strokeWidth="2.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

// Customer avatar initials helper
const getInitials = (name?: string) => {
  if (!name) return "CU";
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
};

// Customer avatar background color helper
const getAvatarColor = (name?: string) => {
  const colors = [
    "bg-blue-100 text-blue-700",
    "bg-purple-100 text-purple-700",
    "bg-emerald-100 text-emerald-700",
    "bg-amber-100 text-amber-700",
    "bg-rose-100 text-rose-700",
  ];
  if (!name) return colors[0];
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
};

// Date and time formatter
const formatOrderDate = (dateVal?: string | Date) => {
  if (!dateVal) return { date: "11/14/2026", time: "03:21 PM" };
  const d = new Date(dateVal);
  const dateStr = d.toLocaleDateString("en-US", {
    month: "2-digit",
    day: "2-digit",
    year: "numeric",
  });
  const timeStr = d.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
  return { date: dateStr, time: timeStr };
};

// Fulfillment status badge styling
const getFulfillmentBadge = (status?: string) => {
  const s = (status || "pending").toLowerCase();
  if (s === "processing") {
    return {
      bg: "bg-blue-50 text-blue-700 border-blue-200",
      icon: <Loader2 className="w-3 h-3 animate-spin text-blue-600" />,
      label: "Processing",
    };
  }
  if (s === "confirmed") {
    return {
      bg: "bg-emerald-50 text-emerald-700 border-emerald-200",
      icon: <Check className="w-3 h-3 text-emerald-600" />,
      label: "Confirmed",
    };
  }
  if (s === "delivered") {
    return {
      bg: "bg-emerald-50 text-emerald-700 border-emerald-200",
      icon: <CheckCircle2 className="w-3 h-3 text-emerald-600" />,
      label: "Delivered",
    };
  }
  if (s === "shipped") {
    return {
      bg: "bg-indigo-50 text-indigo-700 border-indigo-200",
      icon: <Truck className="w-3 h-3 text-indigo-600" />,
      label: "Shipped",
    };
  }
  if (s === "cancelled") {
    return {
      bg: "bg-rose-50 text-rose-700 border-rose-200",
      icon: <X className="w-3 h-3 text-rose-600" />,
      label: "Cancelled",
    };
  }
  return {
    bg: "bg-amber-50 text-amber-700 border-amber-200",
    icon: <Clock className="w-3 h-3 text-amber-600" />,
    label: "Pending",
  };
};

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<IOrder[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [search, setSearch] = useState("");
  const [dateRange, setDateRange] = useState("all");
  const [fulfillmentFilter, setFulfillmentFilter] = useState("all");
  const [paymentMethodFilter, setPaymentMethodFilter] = useState("all");
  const [paymentStatusFilter, setPaymentStatusFilter] = useState("all");

  // Selection & Pagination
  const [selectedOrderIds, setSelectedOrderIds] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;

  // Selected Order for Status Update Modal
  const [selectedOrder, setSelectedOrder] = useState<IOrder | null>(null);
  const [newStatus, setNewStatus] = useState<OrderStatus>("processing");
  const [trackingNumber, setTrackingNumber] = useState("");
  const [internalNotes, setInternalNotes] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);

  // Quick Create Order Modal
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [createCustomerName, setCreateCustomerName] = useState("");
  const [createCustomerPhone, setCreateCustomerPhone] = useState("");
  const [createCustomerEmail, setCreateCustomerEmail] = useState("");
  const [createAddress, setCreateAddress] = useState("");
  const [createItemName, setCreateItemName] = useState("");
  const [createItemPrice, setCreateItemPrice] = useState<number>(3400);
  const [createPaymentMethod, setCreatePaymentMethod] = useState("COD");
  const [isCreatingOrder, setIsCreatingOrder] = useState(false);

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

  // Filtered Orders
  const filteredOrders = useMemo(() => {
    return orders.filter((o) => {
      const custName = o.customer?.name || "";
      const custPhone = o.customer?.phone || "";
      const orderNum = o.orderNumber || "";

      const matchesSearch =
        !search ||
        orderNum.toLowerCase().includes(search.toLowerCase()) ||
        custName.toLowerCase().includes(search.toLowerCase()) ||
        custPhone.includes(search);

      const matchesFulfillment =
        fulfillmentFilter === "all" || o.orderStatus === fulfillmentFilter;

      const matchesPaymentMethod =
        paymentMethodFilter === "all" ||
        (o.paymentMethod || "").toLowerCase().includes(paymentMethodFilter.toLowerCase());

      const matchesPaymentStatus =
        paymentStatusFilter === "all" ||
        (o.paymentStatus || "").toLowerCase() === paymentStatusFilter.toLowerCase();

      let matchesDate = true;
      if (dateRange !== "all") {
        const orderTime = new Date(o.createdAt || Date.now()).getTime();
        const now = Date.now();
        if (dateRange === "today") {
          matchesDate = now - orderTime <= 24 * 60 * 60 * 1000;
        } else if (dateRange === "week") {
          matchesDate = now - orderTime <= 7 * 24 * 60 * 60 * 1000;
        } else if (dateRange === "month") {
          matchesDate = now - orderTime <= 30 * 24 * 60 * 60 * 1000;
        }
      }

      return (
        matchesSearch &&
        matchesFulfillment &&
        matchesPaymentMethod &&
        matchesPaymentStatus &&
        matchesDate
      );
    });
  }, [orders, search, fulfillmentFilter, paymentMethodFilter, paymentStatusFilter, dateRange]);

  // Stats calculation
  const totalOrders = orders.length;
  const totalItems = orders.reduce(
    (sum, o) =>
      sum +
      (o.items?.reduce((s, i) => s + (i.quantity || 1), 0) || o.items?.length || 0),
    0
  );
  const totalAmount = orders.reduce((sum, o) => sum + (o.total || 0), 0);
  const processingCount = orders.filter((o) => o.orderStatus === "processing").length;
  const completedCount = orders.filter(
    (o) => o.orderStatus === "delivered" || o.orderStatus === "confirmed"
  ).length;

  // Pagination logic
  const totalPages = Math.max(1, Math.ceil(filteredOrders.length / pageSize));
  const paginatedOrders = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredOrders.slice(start, start + pageSize);
  }, [filteredOrders, currentPage, pageSize]);

  // Selection
  const isAllSelected =
    paginatedOrders.length > 0 &&
    paginatedOrders.every((o) =>
      selectedOrderIds.includes(o.orderNumber || o._id || "")
    );

  const toggleSelectAll = () => {
    if (isAllSelected) {
      const pageIds = paginatedOrders.map((o) => o.orderNumber || o._id || "");
      setSelectedOrderIds((prev) => prev.filter((id) => !pageIds.includes(id)));
    } else {
      const pageIds = paginatedOrders.map((o) => o.orderNumber || o._id || "");
      setSelectedOrderIds((prev) => Array.from(new Set([...prev, ...pageIds])));
    }
  };

  const toggleSelectOrder = (id: string) => {
    setSelectedOrderIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  // Open Status Modal
  const openStatusModal = (ord: IOrder) => {
    setSelectedOrder(ord);
    setNewStatus(ord.orderStatus);
    setTrackingNumber(ord.trackingNumber || "");
    setInternalNotes(ord.internalNotes || "");
  };

  // Update Status
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

  // Export CSV
  const handleExportCSV = () => {
    if (orders.length === 0) {
      toast.error("No orders to export");
      return;
    }
    const headers = [
      "Order Ref",
      "Date",
      "Customer Name",
      "Customer Phone",
      "Items Count",
      "Total Amount",
      "Payment Method",
      "Payment Status",
      "Fulfillment Status",
    ];
    const rows = orders.map((o) => [
      o.orderNumber,
      new Date(o.createdAt || Date.now()).toISOString(),
      `"${o.customer?.name || ""}"`,
      `"${o.customer?.phone || ""}"`,
      o.items?.length || 0,
      o.total || 0,
      o.paymentMethod || "",
      o.paymentStatus || "",
      o.orderStatus || "",
    ]);
    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `tbh_orders_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Orders CSV exported successfully!");
  };

  // Create Order Submit
  const handleCreateOrderSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!createCustomerName.trim() || !createCustomerPhone.trim()) {
      toast.error("Customer name and phone are required");
      return;
    }
    setIsCreatingOrder(true);
    const toastId = toast.loading("Creating order...");
    try {
      const payload = {
        customer: {
          name: createCustomerName.trim(),
          phone: createCustomerPhone.trim(),
          email: createCustomerEmail.trim() || "customer@thebrandhub.lk",
        },
        shippingAddress: {
          addressLine1: createAddress.trim() || "Islandwide Delivery",
          city: "Colombo",
          postalCode: "00100",
          country: "Sri Lanka",
        },
        items: [
          {
            name: createItemName.trim() || "Waves Lifestyle Collection Item",
            price: createItemPrice || 3400,
            quantity: 1,
            sku: `W-GEN-${Math.floor(100 + Math.random() * 900)}`,
            image:
              "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=200&q=80",
          },
        ],
        subtotal: createItemPrice || 3400,
        shippingFee: 0,
        total: createItemPrice || 3400,
        paymentMethod: createPaymentMethod,
        paymentStatus: createPaymentMethod === "Card" ? "paid" : "pending",
        orderStatus: "confirmed",
      };

      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        toast.success("New order created successfully!", { id: toastId });
        setIsCreateOpen(false);
        setCreateCustomerName("");
        setCreateCustomerPhone("");
        setCreateAddress("");
        loadOrders();
      } else {
        toast.error("Failed to create order", { id: toastId });
      }
    } catch {
      toast.error("Network error creating order", { id: toastId });
    } finally {
      setIsCreatingOrder(false);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Main Container Card matching Product Management & Target Design */}
      <div className="bg-white border border-neutral-200/90 rounded-[28px] sm:rounded-[36px] p-6 sm:p-8 shadow-xs space-y-6">
        {/* 1. Top Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2.5">
              <Calendar className="w-6 h-6 text-neutral-900 shrink-0" />
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-neutral-900">
                Order Management
              </h1>
            </div>
            <p className="text-xs text-neutral-500 mt-1 font-medium">
              Review customer purchases, assign courier waybills, and update dispatch status.
            </p>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            <button
              type="button"
              onClick={handleExportCSV}
              className="bg-white hover:bg-neutral-50 text-neutral-800 border border-neutral-200/90 px-4 py-2 rounded-full text-xs font-semibold flex items-center gap-1.5 shadow-2xs transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 text-neutral-600" />
              <span>Export</span>
            </button>
            <button
              type="button"
              onClick={() => setIsCreateOpen(true)}
              className="bg-black hover:bg-neutral-800 text-white px-5 py-2 rounded-full text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Create Order</span>
            </button>
          </div>
        </div>

        {/* 2. 5 Stats / KPI Bento Cards (Row of 5 Cards matching target design) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
          {/* Card 1: Total Orders */}
          <div className="bg-gradient-to-r from-emerald-50/40 via-white to-white border border-neutral-200/90 rounded-2xl p-4 flex items-center justify-between gap-2 shadow-2xs hover:shadow-xs transition-shadow overflow-hidden">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 shrink-0">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[11px] font-semibold text-neutral-500 block">Total Orders</span>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-2xl font-black text-neutral-900 leading-none">
                    {totalOrders}
                  </span>
                  <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 border border-emerald-100 px-1.5 py-0.5 rounded-full">
                    ↑ +100%
                  </span>
                </div>
              </div>
            </div>
            <StatWave color="#10b981" />
          </div>

          {/* Card 2: Total Items */}
          <div className="bg-gradient-to-r from-blue-50/40 via-white to-white border border-neutral-200/90 rounded-2xl p-4 flex items-center justify-between gap-2 shadow-2xs hover:shadow-xs transition-shadow overflow-hidden">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 shrink-0">
                <Package className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[11px] font-semibold text-neutral-500 block">Total Items</span>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-2xl font-black text-neutral-900 leading-none">
                    {totalItems}
                  </span>
                </div>
              </div>
            </div>
            <StatWave color="#3b82f6" />
          </div>

          {/* Card 3: Total Amount */}
          <div className="bg-gradient-to-r from-orange-50/40 via-white to-white border border-neutral-200/90 rounded-2xl p-4 flex items-center justify-between gap-2 shadow-2xs hover:shadow-xs transition-shadow overflow-hidden">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-orange-50 border border-orange-100 flex items-center justify-center text-orange-500 shrink-0">
                <CreditCard className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[11px] font-semibold text-neutral-500 block">Total Amount</span>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-xl sm:text-2xl font-black text-neutral-900 leading-none">
                    Rs. {totalAmount.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
            <StatWave color="#f97316" />
          </div>

          {/* Card 4: Processing */}
          <div className="bg-gradient-to-r from-amber-50/40 via-white to-white border border-neutral-200/90 rounded-2xl p-4 flex items-center justify-between gap-2 shadow-2xs hover:shadow-xs transition-shadow overflow-hidden">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-500 shrink-0">
                <Truck className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[11px] font-semibold text-neutral-500 block">Processing</span>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-2xl font-black text-neutral-900 leading-none">
                    {processingCount}
                  </span>
                </div>
              </div>
            </div>
            <StatWave color="#f59e0b" />
          </div>

          {/* Card 5: Completed */}
          <div className="bg-gradient-to-r from-emerald-50/40 via-white to-white border border-neutral-200/90 rounded-2xl p-4 flex items-center justify-between gap-2 shadow-2xs hover:shadow-xs transition-shadow overflow-hidden">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 shrink-0">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[11px] font-semibold text-neutral-500 block">Completed</span>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-2xl font-black text-neutral-900 leading-none">
                    {completedCount}
                  </span>
                </div>
              </div>
            </div>
            <StatWave color="#10b981" />
          </div>
        </div>

        {/* 3. Toolbar: Search Input & Filter Dropdowns (Rounded-full pills matching target design) */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 text-xs">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-neutral-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by Order #, Customer Name, or Phone..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full bg-white border border-neutral-200 rounded-full pl-11 pr-4 py-2 text-xs text-neutral-900 placeholder-neutral-400 focus:outline-hidden focus:border-black font-medium shadow-2xs"
            />
          </div>

          {/* Filters */}
          <div className="flex items-center gap-2 flex-wrap">
            {/* Date Range */}
            <select
              value={dateRange}
              onChange={(e) => {
                setDateRange(e.target.value);
                setCurrentPage(1);
              }}
              className="bg-white border border-neutral-200 rounded-full px-3.5 py-2 text-xs text-neutral-800 focus:outline-hidden focus:border-black cursor-pointer font-medium shadow-2xs"
            >
              <option value="all">📅 Date Range: All</option>
              <option value="today">📅 Today</option>
              <option value="week">📅 Last 7 Days</option>
              <option value="month">📅 This Month</option>
            </select>

            {/* Fulfillment Status */}
            <select
              value={fulfillmentFilter}
              onChange={(e) => {
                setFulfillmentFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="bg-white border border-neutral-200 rounded-full px-3.5 py-2 text-xs text-neutral-800 focus:outline-hidden focus:border-black cursor-pointer font-medium shadow-2xs"
            >
              <option value="all">🚚 Fulfillment Status: All</option>
              <option value="pending">🚚 Pending</option>
              <option value="confirmed">🚚 Confirmed</option>
              <option value="processing">🚚 Processing</option>
              <option value="shipped">🚚 Shipped</option>
              <option value="delivered">🚚 Delivered</option>
              <option value="cancelled">🚚 Cancelled</option>
            </select>

            {/* Payment Method */}
            <select
              value={paymentMethodFilter}
              onChange={(e) => {
                setPaymentMethodFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="bg-white border border-neutral-200 rounded-full px-3.5 py-2 text-xs text-neutral-800 focus:outline-hidden focus:border-black cursor-pointer font-medium shadow-2xs"
            >
              <option value="all">💳 Payment Method: All</option>
              <option value="COD">💳 COD</option>
              <option value="Card">💳 Online Card</option>
              <option value="Koko">💳 Koko / Mint</option>
            </select>

            {/* All Statuses (Payment Status) */}
            <select
              value={paymentStatusFilter}
              onChange={(e) => {
                setPaymentStatusFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="bg-white border border-neutral-200 rounded-full px-3.5 py-2 text-xs text-neutral-800 focus:outline-hidden focus:border-black cursor-pointer font-medium shadow-2xs"
            >
              <option value="all">🏷️ All Statuses</option>
              <option value="paid">🏷️ Paid</option>
              <option value="pending">🏷️ Pending</option>
              <option value="failed">🏷️ Failed</option>
            </select>

            {/* Filter Reset Button */}
            <button
              type="button"
              onClick={() => {
                setSearch("");
                setDateRange("all");
                setFulfillmentFilter("all");
                setPaymentMethodFilter("all");
                setPaymentStatusFilter("all");
                setCurrentPage(1);
              }}
              className="p-2 rounded-full bg-white border border-neutral-200 text-neutral-500 hover:text-black hover:bg-neutral-50 transition-colors shadow-2xs cursor-pointer"
              title="Reset Filters"
            >
              <Filter className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* 4. Orders Table (Matching target design) */}
        {loading ? (
          <div className="p-16 text-center text-neutral-500">
            <div className="w-8 h-8 border-2 border-black border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <p className="text-xs">Loading TBH orders...</p>
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="p-16 text-center text-neutral-500 space-y-3">
            <ShoppingBag className="w-12 h-12 text-neutral-300 mx-auto" />
            <h3 className="text-base font-bold text-neutral-900">No orders found</h3>
            <p className="text-xs max-w-sm mx-auto text-neutral-500">
              No customer orders matched your search or filter criteria. Try clearing filters or create a new order.
            </p>
            <button
              type="button"
              onClick={() => {
                setSearch("");
                setDateRange("all");
                setFulfillmentFilter("all");
                setPaymentMethodFilter("all");
                setPaymentStatusFilter("all");
              }}
              className="px-4 py-2 bg-black hover:bg-neutral-800 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-neutral-700">
                <thead className="text-[11px] uppercase font-bold text-neutral-500 border-b border-neutral-100">
                  <tr>
                    <th className="py-3 px-3 w-8">
                      <input
                        type="checkbox"
                        checked={isAllSelected}
                        onChange={toggleSelectAll}
                        className="w-4 h-4 rounded-sm border-neutral-300 text-black focus:ring-black cursor-pointer"
                      />
                    </th>
                    <th className="py-3 px-3">Order Ref</th>
                    <th className="py-3 px-3">Date</th>
                    <th className="py-3 px-3">Customer</th>
                    <th className="py-3 px-3">Items</th>
                    <th className="py-3 px-3">Total Amount</th>
                    <th className="py-3 px-3">Payment</th>
                    <th className="py-3 px-3">Fulfillment Status</th>
                    <th className="py-3 px-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100 font-medium">
                  {paginatedOrders.map((o) => {
                    const id = o.orderNumber || o._id || "";
                    const isSelected = selectedOrderIds.includes(id);
                    const { date, time } = formatOrderDate(o.createdAt);
                    const badge = getFulfillmentBadge(o.orderStatus);
                    const isCod = (o.paymentMethod || "").toLowerCase().includes("cod");
                    const itemCount =
                      o.items?.reduce((s, i) => s + (i.quantity || 1), 0) ||
                      o.items?.length ||
                      1;
                    const itemNames = (o.items || [])
                      .map((i) => i.name)
                      .filter(Boolean)
                      .join(", ") || "Waves Lifestyle Item";

                    return (
                      <tr key={id} className="hover:bg-neutral-50/70 transition-colors">
                        {/* Checkbox */}
                        <td className="py-3 px-3">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => toggleSelectOrder(id)}
                            className="w-4 h-4 rounded-sm border-neutral-300 text-black focus:ring-black cursor-pointer"
                          />
                        </td>

                        {/* Order Ref */}
                        <td className="py-3 px-3">
                          <span className="font-bold text-xs text-neutral-900 font-mono block">
                            {o.orderNumber || "TBH-ORDER"}
                          </span>
                        </td>

                        {/* Date */}
                        <td className="py-3 px-3">
                          <div className="text-xs text-neutral-800 font-medium">{date}</div>
                          <div className="text-[10px] text-neutral-400">{time}</div>
                        </td>

                        {/* Customer */}
                        <td className="py-3 px-3">
                          <div className="flex items-center gap-2.5">
                            <div
                              className={`w-8 h-8 rounded-full font-bold text-xs flex items-center justify-center shrink-0 ${getAvatarColor(
                                o.customer?.name
                              )}`}
                            >
                              {getInitials(o.customer?.name)}
                            </div>
                            <div>
                              <strong className="text-xs font-bold text-neutral-900 block leading-tight">
                                {o.customer?.name || "Customer"}
                              </strong>
                              <span className="text-[11px] text-neutral-500 font-medium block mt-0.5">
                                {o.customer?.phone || "+94 77 123 4567"}
                              </span>
                            </div>
                          </div>
                        </td>

                        {/* Items */}
                        <td className="py-3 px-3">
                          <div className="flex items-center gap-2.5">
                            <div className="flex items-center -space-x-1 shrink-0">
                              {(o.items && o.items.length > 0 ? o.items.slice(0, 2) : [1]).map(
                                (item, idx) => (
                                  <img
                                    key={idx}
                                    src={
                                      typeof item === "object" && item.image
                                        ? item.image
                                        : "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=150&q=80"
                                    }
                                    alt="item"
                                    className="w-8 h-8 rounded-lg object-cover border border-neutral-200 bg-neutral-100"
                                  />
                                )
                              )}
                            </div>
                            <div>
                              <span className="text-xs font-bold text-neutral-900 block leading-tight">
                                {itemCount} item{itemCount !== 1 ? "s" : ""}
                              </span>
                              <span className="text-[10px] text-neutral-400 block truncate max-w-[160px]">
                                {itemNames}
                              </span>
                            </div>
                          </div>
                        </td>

                        {/* Total Amount */}
                        <td className="py-3 px-3">
                          <span className="font-bold text-xs text-neutral-900 font-mono">
                            Rs. {(o.total || 0).toLocaleString()}
                          </span>
                        </td>

                        {/* Payment */}
                        <td className="py-3 px-3">
                          <div>
                            <div className="flex items-center gap-1.5 text-xs font-bold text-neutral-900">
                              <span
                                className={`w-2 h-2 rounded-full ${
                                  o.paymentStatus === "paid"
                                    ? "bg-emerald-500"
                                    : "bg-amber-500"
                                }`}
                              />
                              <span>{isCod ? "COD" : o.paymentMethod || "Card"}</span>
                            </div>
                            <span
                              className={`text-[10px] font-bold px-2 py-0.5 rounded-full inline-flex items-center gap-1 mt-1 ${
                                o.paymentStatus === "paid"
                                  ? "bg-emerald-50 text-emerald-700 border border-emerald-200/60"
                                  : "bg-amber-50 text-amber-700 border border-amber-200/60"
                              }`}
                            >
                              <Check className="w-2.5 h-2.5" />
                              <span>{o.paymentStatus === "paid" ? "Paid" : "Pending"}</span>
                            </span>
                          </div>
                        </td>

                        {/* Fulfillment Status */}
                        <td className="py-3 px-3">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-semibold inline-flex items-center gap-1.5 border ${badge.bg}`}
                          >
                            {badge.icon}
                            <span>{badge.label}</span>
                          </span>
                        </td>

                        {/* Actions */}
                        <td className="py-3 px-3 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              type="button"
                              onClick={() => openStatusModal(o)}
                              className="bg-black hover:bg-neutral-800 text-white px-3 py-1.5 rounded-xl text-xs font-semibold inline-flex items-center gap-1.5 cursor-pointer shadow-2xs transition-all"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                              <span>Update</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => openStatusModal(o)}
                              className="p-1.5 text-neutral-400 hover:text-black rounded-lg transition-colors cursor-pointer"
                              title="More Options"
                            >
                              <MoreVertical className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Pagination Footer */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-neutral-100 text-xs">
              <span className="text-neutral-500 font-medium">
                Showing {filteredOrders.length === 0 ? 0 : (currentPage - 1) * pageSize + 1} –{" "}
                {Math.min(currentPage * pageSize, filteredOrders.length)} of {filteredOrders.length} orders
              </span>
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                  className="w-7 h-7 rounded-full flex items-center justify-center text-neutral-500 hover:bg-neutral-100 disabled:opacity-30 disabled:pointer-events-none cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                {Array.from({ length: totalPages }).map((_, idx) => {
                  const page = idx + 1;
                  const isActive = page === currentPage;
                  return (
                    <button
                      key={page}
                      type="button"
                      onClick={() => setCurrentPage(page)}
                      className={`w-7 h-7 rounded-full text-xs font-semibold flex items-center justify-center transition-colors cursor-pointer ${
                        isActive
                          ? "bg-black text-white shadow-xs"
                          : "text-neutral-600 hover:bg-neutral-100"
                      }`}
                    >
                      {page}
                    </button>
                  );
                })}
                <button
                  type="button"
                  onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                  className="w-7 h-7 rounded-full flex items-center justify-center text-neutral-500 hover:bg-neutral-100 disabled:opacity-30 disabled:pointer-events-none cursor-pointer"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ================= MODAL: UPDATE ORDER FULFILLMENT ================= */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="bg-white border border-neutral-200 rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl text-neutral-900">
            <div className="flex items-center justify-between pb-4 border-b border-neutral-100">
              <div>
                <h3 className="text-base font-black uppercase tracking-wider text-neutral-900">
                  Update Order #{selectedOrder.orderNumber}
                </h3>
                <span className="text-[11px] text-neutral-500">
                  Recipient: {selectedOrder.customer?.name || "Customer"} (
                  {selectedOrder.customer?.phone || "N/A"})
                </span>
              </div>
              <button
                type="button"
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
                  placeholder="e.g. Verified via WhatsApp call, packaging customized items..."
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

      {/* ================= MODAL: CREATE ORDER ================= */}
      {isCreateOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="bg-white border border-neutral-200 rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl text-neutral-900">
            <div className="flex items-center justify-between pb-4 border-b border-neutral-100">
              <div>
                <h3 className="text-base font-black uppercase tracking-wider text-neutral-900">
                  Create New Customer Order
                </h3>
                <span className="text-[11px] text-neutral-500">
                  Manually book an offline or direct phone order into the TBH system.
                </span>
              </div>
              <button
                type="button"
                onClick={() => setIsCreateOpen(false)}
                className="text-neutral-400 hover:text-black cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateOrderSubmit} className="mt-5 space-y-3.5 text-xs">
              <div>
                <label className="font-bold text-neutral-700 block mb-1">
                  Customer Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={createCustomerName}
                  onChange={(e) => setCreateCustomerName(e.target.value)}
                  placeholder="e.g. Kasun Jayawardena"
                  className="w-full bg-neutral-50 border border-neutral-200 rounded-xl p-2.5 text-neutral-900 focus:outline-hidden focus:border-black font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-neutral-700 block mb-1">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    required
                    value={createCustomerPhone}
                    onChange={(e) => setCreateCustomerPhone(e.target.value)}
                    placeholder="e.g. +94 77 123 4567"
                    className="w-full bg-neutral-50 border border-neutral-200 rounded-xl p-2.5 text-neutral-900 focus:outline-hidden focus:border-black font-medium"
                  />
                </div>
                <div>
                  <label className="font-bold text-neutral-700 block mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={createCustomerEmail}
                    onChange={(e) => setCreateCustomerEmail(e.target.value)}
                    placeholder="e.g. kasun@example.com"
                    className="w-full bg-neutral-50 border border-neutral-200 rounded-xl p-2.5 text-neutral-900 focus:outline-hidden focus:border-black font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-neutral-700 block mb-1">
                  Delivery Address *
                </label>
                <input
                  type="text"
                  required
                  value={createAddress}
                  onChange={(e) => setCreateAddress(e.target.value)}
                  placeholder="e.g. No. 45, Galle Road, Colombo 03"
                  className="w-full bg-neutral-50 border border-neutral-200 rounded-xl p-2.5 text-neutral-900 focus:outline-hidden focus:border-black font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-neutral-700 block mb-1">
                    Item / Product Name
                  </label>
                  <input
                    type="text"
                    value={createItemName}
                    onChange={(e) => setCreateItemName(e.target.value)}
                    placeholder="e.g. Waves Poncho Ash - Flower"
                    className="w-full bg-neutral-50 border border-neutral-200 rounded-xl p-2.5 text-neutral-900 focus:outline-hidden focus:border-black font-medium"
                  />
                </div>
                <div>
                  <label className="font-bold text-neutral-700 block mb-1">
                    Total Order Value (LKR) *
                  </label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={createItemPrice}
                    onChange={(e) => setCreateItemPrice(Number(e.target.value))}
                    className="w-full bg-neutral-50 border border-neutral-200 rounded-xl p-2.5 text-neutral-900 focus:outline-hidden focus:border-black font-bold font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-neutral-700 block mb-1">
                  Payment Method
                </label>
                <select
                  value={createPaymentMethod}
                  onChange={(e) => setCreatePaymentMethod(e.target.value)}
                  className="w-full bg-neutral-50 border border-neutral-200 rounded-xl p-2.5 text-neutral-900 font-bold focus:outline-hidden focus:border-black cursor-pointer"
                >
                  <option value="COD">Cash on Delivery (COD)</option>
                  <option value="Card">Online Card Payment</option>
                  <option value="Koko">Koko / Mint Installments</option>
                </select>
              </div>

              <div className="pt-4 flex gap-3 border-t border-neutral-100">
                <button
                  type="button"
                  onClick={() => setIsCreateOpen(false)}
                  className="flex-1 py-3 rounded-2xl border border-neutral-200 text-neutral-700 font-bold uppercase hover:bg-neutral-100 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isCreatingOrder}
                  className="flex-1 py-3 rounded-2xl bg-black text-white font-bold uppercase hover:bg-neutral-800 transition-colors disabled:opacity-50 cursor-pointer shadow-xs"
                >
                  {isCreatingOrder ? "Creating..." : "Confirm & Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
