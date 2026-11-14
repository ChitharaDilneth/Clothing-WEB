"use client";

import React, { useEffect, useState, useMemo } from "react";
import Image from "next/image";
import {
  Sparkles,
  Check,
  X,
  ExternalLink,
  Search,
  ClipboardList,
  CheckCircle2,
  Clock,
  RefreshCw,
  Eye,
  MoreVertical,
  ChevronLeft,
  ChevronRight,
  Filter,
  List,
  Grid,
  Palette,
  Package,
} from "lucide-react";
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

// Color dot hex resolver
const getColorHex = (colorName: string) => {
  const c = colorName.trim().toLowerCase();
  if (c.includes("navy")) return "#1e3a8a";
  if (c.includes("white")) return "#ffffff";
  if (c.includes("black")) return "#000000";
  if (c.includes("grey") || c.includes("gray") || c.includes("ash")) return "#6b7280";
  if (c.includes("olive") || c.includes("green")) return "#3f6212";
  if (c.includes("red") || c.includes("burgundy")) return "#dc2626";
  if (c.includes("beige") || c.includes("tan")) return "#d4b895";
  if (c.includes("blue")) return "#2563eb";
  if (c.includes("yellow") || c.includes("amber")) return "#f59e0b";
  if (c.includes("orange")) return "#ea580c";
  return "#333333";
};

// Status badge styling helper
const getCustomStatusBadge = (status?: string) => {
  const s = (status || "pending_review").toLowerCase();
  if (s === "approved") {
    return {
      bg: "bg-emerald-50 text-emerald-700 border-emerald-200",
      icon: <Check className="w-3 h-3 text-emerald-600" />,
      label: "Approved",
    };
  }
  if (s === "in_production") {
    return {
      bg: "bg-orange-50 text-orange-700 border-orange-200",
      icon: <RefreshCw className="w-3 h-3 text-orange-600 animate-spin" />,
      label: "In Production",
    };
  }
  if (s === "rejected") {
    return {
      bg: "bg-rose-50 text-rose-700 border-rose-200",
      icon: <X className="w-3 h-3 text-rose-600" />,
      label: "Rejected",
    };
  }
  return {
    bg: "bg-sky-50 text-sky-700 border-sky-200",
    icon: <Clock className="w-3 h-3 text-sky-600" />,
    label: "In Review",
  };
};

export default function AdminCustomOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [search, setSearch] = useState("");
  const [dateRange, setDateRange] = useState("all");
  const [productFilter, setProductFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [viewMode, setViewMode] = useState<"table" | "grid">("table");

  // Selection & Pagination
  const [selectedOrderIds, setSelectedOrderIds] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;

  // Selected Order for Details / Status Modal
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

  const loadData = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/custom-orders");
      const data = await res.json();
      setOrders(data || []);
    } catch (e) {
      console.error(e);
      toast.error("Failed to load custom requests");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Filtered orders list
  const filteredOrders = useMemo(() => {
    return orders.filter((o) => {
      const ref = o.orderNumber || "";
      const cust = o.customerName || "";
      const prod = o.baseProductName || "";
      const text = o.customText || "";

      const matchesSearch =
        !search ||
        ref.toLowerCase().includes(search.toLowerCase()) ||
        cust.toLowerCase().includes(search.toLowerCase()) ||
        prod.toLowerCase().includes(search.toLowerCase()) ||
        text.toLowerCase().includes(search.toLowerCase());

      const matchesProduct =
        productFilter === "all" ||
        prod.toLowerCase().includes(productFilter.toLowerCase());

      const matchesStatus =
        statusFilter === "all" ||
        (o.status || "").toLowerCase() === statusFilter.toLowerCase();

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

      return matchesSearch && matchesProduct && matchesStatus && matchesDate;
    });
  }, [orders, search, productFilter, statusFilter, dateRange]);

  // Unique product options for dropdown
  const uniqueProducts = useMemo(() => {
    const set = new Set<string>();
    orders.forEach((o) => {
      if (o.baseProductName) set.add(o.baseProductName);
    });
    return Array.from(set);
  }, [orders]);

  // Stats calculation
  const totalRequests = orders.length;
  const approvedCount = orders.filter(
    (o) => (o.status || "").toLowerCase() === "approved"
  ).length;
  const inReviewCount = orders.filter(
    (o) =>
      (o.status || "").toLowerCase() === "pending_review" ||
      (o.status || "").toLowerCase() === "pending" ||
      (o.status || "").toLowerCase() === "in_review"
  ).length;
  const inProductionCount = orders.filter(
    (o) => (o.status || "").toLowerCase() === "in_production"
  ).length;
  const rejectedCount = orders.filter(
    (o) => (o.status || "").toLowerCase() === "rejected"
  ).length;

  // Pagination logic
  const totalPages = Math.max(1, Math.ceil(filteredOrders.length / pageSize));
  const paginatedOrders = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredOrders.slice(start, start + pageSize);
  }, [filteredOrders, currentPage, pageSize]);

  // Bulk selection
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

  // Status Change Handler
  const handleUpdateStatus = async (orderNumber: string, nextStatus: string) => {
    setIsUpdatingStatus(true);
    const toastId = toast.loading(`Updating ${orderNumber} to ${nextStatus}...`);
    try {
      const res = await fetch("/api/custom-orders", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderNumber, status: nextStatus }),
      });

      if (res.ok) {
        toast.success(`Request status updated to ${nextStatus}!`, { id: toastId });
        setOrders((prev) =>
          prev.map((o) =>
            o.orderNumber === orderNumber ? { ...o, status: nextStatus } : o
          )
        );
        if (selectedOrder && selectedOrder.orderNumber === orderNumber) {
          setSelectedOrder((prev: any) => ({ ...prev, status: nextStatus }));
        }
      } else {
        toast.error("Failed to update status", { id: toastId });
      }
    } catch {
      toast.error("Network error while updating status", { id: toastId });
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Main Container Card matching Product & Order Management */}
      <div className="bg-white border border-neutral-200/90 rounded-[28px] sm:rounded-[36px] p-6 sm:p-8 shadow-xs space-y-6">
        {/* 1. Top Header (Strictly NO (1) in title) */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white border border-neutral-200 shadow-2xs flex items-center justify-center text-neutral-900 shrink-0">
              <Sparkles className="w-5 h-5 text-neutral-800" />
            </div>
            <div className="border-l-3 border-amber-500 pl-3">
              <h1 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-neutral-900">
                Make Your Own Waves Requests
              </h1>
              <p className="text-xs text-neutral-500 mt-0.5 font-medium">
                Review customized sandal monograms, artwork uploads, and artisan production requests.
              </p>
            </div>
          </div>
        </div>

        {/* 2. 5 Stats / KPI Bento Cards (Row of 5 matching target design) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
          {/* Card 1: Total Requests */}
          <div className="bg-gradient-to-r from-amber-50/40 via-white to-white border border-neutral-200/90 rounded-2xl p-4 flex items-center justify-between gap-2 shadow-2xs hover:shadow-xs transition-shadow overflow-hidden">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-600 shrink-0">
                <ClipboardList className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[11px] font-semibold text-neutral-500 block">Total Requests</span>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-2xl font-black text-neutral-900 leading-none">
                    {totalRequests}
                  </span>
                </div>
              </div>
            </div>
            <StatWave color="#f59e0b" />
          </div>

          {/* Card 2: Approved */}
          <div className="bg-gradient-to-r from-emerald-50/40 via-white to-white border border-neutral-200/90 rounded-2xl p-4 flex items-center justify-between gap-2 shadow-2xs hover:shadow-xs transition-shadow overflow-hidden">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 shrink-0">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[11px] font-semibold text-neutral-500 block">Approved</span>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-2xl font-black text-neutral-900 leading-none">
                    {approvedCount}
                  </span>
                </div>
              </div>
            </div>
            <StatWave color="#10b981" />
          </div>

          {/* Card 3: In Review */}
          <div className="bg-gradient-to-r from-sky-50/40 via-white to-white border border-neutral-200/90 rounded-2xl p-4 flex items-center justify-between gap-2 shadow-2xs hover:shadow-xs transition-shadow overflow-hidden">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-sky-50 border border-sky-100 flex items-center justify-center text-sky-600 shrink-0">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[11px] font-semibold text-neutral-500 block">In Review</span>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-2xl font-black text-neutral-900 leading-none">
                    {inReviewCount}
                  </span>
                </div>
              </div>
            </div>
            <StatWave color="#0284c7" />
          </div>

          {/* Card 4: In Production */}
          <div className="bg-gradient-to-r from-orange-50/40 via-white to-white border border-neutral-200/90 rounded-2xl p-4 flex items-center justify-between gap-2 shadow-2xs hover:shadow-xs transition-shadow overflow-hidden">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-orange-50 border border-orange-100 flex items-center justify-center text-orange-500 shrink-0">
                <RefreshCw className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[11px] font-semibold text-neutral-500 block">In Production</span>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-2xl font-black text-neutral-900 leading-none">
                    {inProductionCount}
                  </span>
                </div>
              </div>
            </div>
            <StatWave color="#ea580c" />
          </div>

          {/* Card 5: Rejected */}
          <div className="bg-gradient-to-r from-rose-50/40 via-white to-white border border-neutral-200/90 rounded-2xl p-4 flex items-center justify-between gap-2 shadow-2xs hover:shadow-xs transition-shadow overflow-hidden">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-500 shrink-0">
                <X className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[11px] font-semibold text-neutral-500 block">Rejected</span>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-2xl font-black text-neutral-900 leading-none">
                    {rejectedCount}
                  </span>
                </div>
              </div>
            </div>
            <StatWave color="#ef4444" />
          </div>
        </div>

        {/* 3. Toolbar: Search Input, Dropdowns & View Toggle (Pill style) */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 text-xs">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-neutral-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by Ref #, Customer, or Product..."
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

            {/* Product Filter */}
            <select
              value={productFilter}
              onChange={(e) => {
                setProductFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="bg-white border border-neutral-200 rounded-full px-3.5 py-2 text-xs text-neutral-800 focus:outline-hidden focus:border-black cursor-pointer font-medium shadow-2xs"
            >
              <option value="all">📦 Product: All</option>
              {uniqueProducts.map((p) => (
                <option key={p} value={p}>
                  📦 {p}
                </option>
              ))}
            </select>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="bg-white border border-neutral-200 rounded-full px-3.5 py-2 text-xs text-neutral-800 focus:outline-hidden focus:border-black cursor-pointer font-medium shadow-2xs"
            >
              <option value="all">🏷️ Status: All</option>
              <option value="approved">🏷️ Approved</option>
              <option value="pending_review">🏷️ In Review</option>
              <option value="in_production">🏷️ In Production</option>
              <option value="rejected">🏷️ Rejected</option>
            </select>

            {/* View Mode Toggle */}
            <div className="flex items-center bg-white border border-neutral-200 rounded-full p-1 shadow-2xs">
              <button
                type="button"
                onClick={() => setViewMode("table")}
                title="Table View"
                className={`p-1.5 rounded-full transition-colors cursor-pointer ${
                  viewMode === "table" ? "bg-black text-white" : "text-neutral-400 hover:text-black"
                }`}
              >
                <List className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => setViewMode("grid")}
                title="Grid View"
                className={`p-1.5 rounded-full transition-colors cursor-pointer ${
                  viewMode === "grid" ? "bg-black text-white" : "text-neutral-400 hover:text-black"
                }`}
              >
                <Grid className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* 4. Requests Table (Matching target design) */}
        {loading ? (
          <div className="p-16 text-center text-neutral-500">
            <div className="w-8 h-8 border-2 border-black border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <p className="text-xs">Loading custom requests...</p>
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="p-16 text-center text-neutral-500 space-y-3">
            <Sparkles className="w-12 h-12 text-neutral-300 mx-auto" />
            <h3 className="text-base font-bold text-neutral-900">No custom requests found</h3>
            <p className="text-xs max-w-sm mx-auto text-neutral-500">
              No customization requests match your search or filter. Try clearing filters.
            </p>
            <button
              type="button"
              onClick={() => {
                setSearch("");
                setDateRange("all");
                setProductFilter("all");
                setStatusFilter("all");
              }}
              className="px-4 py-2 bg-black hover:bg-neutral-800 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
            >
              Clear Filters
            </button>
          </div>
        ) : viewMode === "grid" ? (
          /* ================= GRID VIEW ================= */
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {paginatedOrders.map((o) => {
                const id = o.orderNumber || o._id || "";
                const badge = getCustomStatusBadge(o.status);
                const colors = (o.color || "Navy / White").split("/").map((c: string) => c.trim());

                return (
                  <div
                    key={id}
                    className="bg-white border border-neutral-200/90 rounded-2xl p-5 hover:shadow-md transition-all space-y-3.5"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono font-bold text-xs text-neutral-900 bg-neutral-100 px-2.5 py-1 rounded-lg">
                        {o.orderNumber}
                      </span>
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold inline-flex items-center gap-1 border ${badge.bg}`}
                      >
                        {badge.icon}
                        <span>{badge.label}</span>
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-neutral-100 overflow-hidden relative shrink-0 border border-neutral-200/80">
                        <img
                          src={
                            o.productImage ||
                            "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=150&q=80"
                          }
                          alt={o.baseProductName}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <strong className="text-xs font-bold text-neutral-900 block truncate max-w-[200px]">
                          {o.baseProductName}
                        </strong>
                        <span className="text-[11px] text-neutral-500 font-medium">
                          {o.customerName} ({o.customerPhone})
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-xs pt-1 border-t border-neutral-100">
                      <div className="flex items-center gap-1.5">
                        {colors.map((c: string, idx: number) => (
                          <span
                            key={idx}
                            style={{ backgroundColor: getColorHex(c) }}
                            className="w-3 h-3 rounded-full border border-neutral-300 inline-block shadow-2xs"
                            title={c}
                          />
                        ))}
                        <span className="text-[11px] text-neutral-600 font-medium ml-1">
                          Size {o.size}
                        </span>
                      </div>
                      <span className="font-bold text-xs text-neutral-900 font-mono">
                        Rs. {(o.price || 4350).toLocaleString()}
                      </span>
                    </div>

                    {o.customText && (
                      <div className="bg-neutral-50 border border-neutral-200/80 rounded-xl px-3 py-1.5 text-center">
                        <span className="font-mono text-xs font-bold text-neutral-900 tracking-wider">
                          &ldquo;{o.customText}&rdquo;
                        </span>
                      </div>
                    )}

                    <div className="pt-2 flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setSelectedOrder(o)}
                        className="flex-1 py-1.5 bg-black hover:bg-neutral-800 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>View Details</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Pagination Controls */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-neutral-100 text-xs">
              <span className="text-neutral-500 font-medium">
                Showing {filteredOrders.length === 0 ? 0 : (currentPage - 1) * pageSize + 1} –{" "}
                {Math.min(currentPage * pageSize, filteredOrders.length)} of {filteredOrders.length} requests
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
        ) : (
          /* ================= TABLE VIEW (Matching Image 1) ================= */
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
                    <th className="py-3 px-3">Ref #</th>
                    <th className="py-3 px-3">Customer</th>
                    <th className="py-3 px-3">Base Product</th>
                    <th className="py-3 px-3">Color &amp; Size</th>
                    <th className="py-3 px-3">Custom Artwork / Text</th>
                    <th className="py-3 px-3">Price</th>
                    <th className="py-3 px-3">Status</th>
                    <th className="py-3 px-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100 font-medium">
                  {paginatedOrders.map((o) => {
                    const id = o.orderNumber || o._id || "";
                    const isSelected = selectedOrderIds.includes(id);
                    const badge = getCustomStatusBadge(o.status);
                    const colors = (o.color || "Navy / White").split("/").map((c: string) => c.trim());

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

                        {/* Ref # */}
                        <td className="py-3 px-3">
                          <span className="font-bold text-xs text-neutral-900 font-mono block">
                            {o.orderNumber}
                          </span>
                        </td>

                        {/* Customer */}
                        <td className="py-3 px-3">
                          <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-800 font-bold text-xs flex items-center justify-center shrink-0">
                              {getInitials(o.customerName)}
                            </div>
                            <div>
                              <strong className="text-xs font-bold text-neutral-900 block leading-tight">
                                {o.customerName}
                              </strong>
                              <span className="text-[11px] text-neutral-500 font-medium block mt-0.5">
                                {o.customerPhone || "+94 77 881 9901"}
                              </span>
                            </div>
                          </div>
                        </td>

                        {/* Base Product */}
                        <td className="py-3 px-3">
                          <div className="flex items-center gap-2.5">
                            <div className="w-10 h-10 rounded-xl bg-neutral-100 overflow-hidden relative shrink-0 border border-neutral-200/80">
                              <img
                                src={
                                  o.productImage ||
                                  "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=150&q=80"
                                }
                                alt={o.baseProductName}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <span className="text-xs font-semibold text-neutral-900 block leading-tight max-w-[170px]">
                              {o.baseProductName}
                            </span>
                          </div>
                        </td>

                        {/* Color & Size */}
                        <td className="py-3 px-3">
                          <div className="flex items-center gap-2">
                            <div className="flex items-center -space-x-1 shrink-0">
                              {colors.map((c: string, idx: number) => (
                                <span
                                  key={idx}
                                  style={{ backgroundColor: getColorHex(c) }}
                                  className="w-3.5 h-3.5 rounded-full border border-neutral-300 inline-block shadow-2xs"
                                  title={c}
                                />
                              ))}
                            </div>
                            <span className="text-xs text-neutral-700 font-medium">
                              {o.color} • Size {o.size}
                            </span>
                          </div>
                        </td>

                        {/* Custom Artwork / Text */}
                        <td className="py-3 px-3">
                          <div className="flex items-center gap-2">
                            {o.customText ? (
                              <span className="bg-neutral-100 text-neutral-900 font-bold text-xs px-3 py-1.5 rounded-xl border border-neutral-200/80 inline-block font-mono tracking-wider">
                                &ldquo;{o.customText}&rdquo;
                              </span>
                            ) : (
                              <span className="text-neutral-400 text-xs italic">No monogram</span>
                            )}
                            {o.artworkUrl && (
                              <a
                                href={o.artworkUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="p-1 rounded-lg text-neutral-400 hover:text-black hover:bg-neutral-100"
                                title="View Custom Graphic"
                              >
                                <ExternalLink className="w-3.5 h-3.5" />
                              </a>
                            )}
                          </div>
                        </td>

                        {/* Price */}
                        <td className="py-3 px-3">
                          <span className="font-bold text-xs text-neutral-900 font-mono">
                            Rs. {(o.price || 4350).toLocaleString()}
                          </span>
                        </td>

                        {/* Status */}
                        <td className="py-3 px-3">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-semibold inline-flex items-center gap-1 border ${badge.bg}`}
                          >
                            {badge.icon}
                            <span>{badge.label}</span>
                          </span>
                        </td>

                        {/* Actions */}
                        <td className="py-3 px-3 text-right">
                          <div className="flex items-center justify-end gap-1">
                            <button
                              type="button"
                              onClick={() => setSelectedOrder(o)}
                              className="p-1.5 rounded-lg text-neutral-500 hover:text-black hover:bg-neutral-100 transition-colors cursor-pointer"
                              title="View Custom Order"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <button
                              type="button"
                              onClick={() => setSelectedOrder(o)}
                              className="p-1.5 rounded-lg text-neutral-400 hover:text-black transition-colors cursor-pointer"
                              title="Status Actions"
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
                {Math.min(currentPage * pageSize, filteredOrders.length)} of {filteredOrders.length} requests
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

      {/* ================= MODAL: CUSTOM ORDER DETAIL & STATUS UPDATE ================= */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="bg-white border border-neutral-200 rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl text-neutral-900 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
              <div>
                <h3 className="text-base font-black uppercase tracking-wider text-neutral-900">
                  Custom Request: {selectedOrder.orderNumber}
                </h3>
                <span className="text-[11px] text-neutral-500">
                  Customer: {selectedOrder.customerName} ({selectedOrder.customerPhone})
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

            {/* Product & Customization Details */}
            <div className="bg-neutral-50 border border-neutral-200/80 rounded-2xl p-4 space-y-2.5 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-neutral-500 font-medium">Base Footwear:</span>
                <span className="font-bold text-neutral-900">{selectedOrder.baseProductName}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-neutral-500 font-medium">Color &amp; Size:</span>
                <span className="font-bold text-neutral-900">
                  {selectedOrder.color} • Size {selectedOrder.size}
                </span>
              </div>
              {selectedOrder.customText && (
                <div className="flex items-center justify-between">
                  <span className="text-neutral-500 font-medium">Monogram Text:</span>
                  <span className="font-mono font-black text-neutral-900 bg-white px-2 py-0.5 rounded border border-neutral-200">
                    &ldquo;{selectedOrder.customText}&rdquo;
                  </span>
                </div>
              )}
              {selectedOrder.customerEmail && (
                <div className="flex items-center justify-between">
                  <span className="text-neutral-500 font-medium">Email Address:</span>
                  <span className="font-medium text-neutral-800">{selectedOrder.customerEmail}</span>
                </div>
              )}
              <div className="flex items-center justify-between pt-2 border-t border-neutral-200/60">
                <span className="text-neutral-500 font-medium">Order Value:</span>
                <span className="font-mono font-bold text-sm text-neutral-900">
                  Rs. {(selectedOrder.price || 4350).toLocaleString()}
                </span>
              </div>
            </div>

            {/* Quick Status Change Actions */}
            <div>
              <span className="text-xs font-bold text-neutral-700 block mb-2">
                Update Production Status:
              </span>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  disabled={isUpdatingStatus}
                  onClick={() => handleUpdateStatus(selectedOrder.orderNumber, "approved")}
                  className="py-2.5 px-3 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
                >
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Approve Request</span>
                </button>
                <button
                  type="button"
                  disabled={isUpdatingStatus}
                  onClick={() => handleUpdateStatus(selectedOrder.orderNumber, "in_production")}
                  className="py-2.5 px-3 rounded-xl bg-orange-50 hover:bg-orange-100 text-orange-800 border border-orange-200 font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
                >
                  <RefreshCw className="w-3.5 h-3.5 text-orange-600" />
                  <span>In Production</span>
                </button>
                <button
                  type="button"
                  disabled={isUpdatingStatus}
                  onClick={() => handleUpdateStatus(selectedOrder.orderNumber, "pending_review")}
                  className="py-2.5 px-3 rounded-xl bg-sky-50 hover:bg-sky-100 text-sky-800 border border-sky-200 font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
                >
                  <Clock className="w-3.5 h-3.5 text-sky-600" />
                  <span>Keep In Review</span>
                </button>
                <button
                  type="button"
                  disabled={isUpdatingStatus}
                  onClick={() => handleUpdateStatus(selectedOrder.orderNumber, "rejected")}
                  className="py-2.5 px-3 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-800 border border-rose-200 font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
                >
                  <X className="w-3.5 h-3.5 text-rose-600" />
                  <span>Reject Request</span>
                </button>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="button"
                onClick={() => setSelectedOrder(null)}
                className="w-full py-2.5 rounded-2xl bg-neutral-100 hover:bg-neutral-200 text-neutral-800 font-bold text-xs transition-colors cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
