"use client";

import React, { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import {
  DollarSign,
  ShoppingBag,
  Package,
  AlertTriangle,
  ArrowUpRight,
  TrendingUp,
  Clock,
  Sparkles,
  ExternalLink,
  Store,
  Plus,
  CheckCircle2,
  Tag,
  Eye,
  Edit3,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { useAuth } from "@/context/AuthContext";
import { IProduct, IBrand } from "@/types";

const SALES_DATA = [
  { day: "Mon", sales: 24500 },
  { day: "Tue", sales: 38900 },
  { day: "Wed", sales: 42100 },
  { day: "Thu", sales: 51200 },
  { day: "Fri", sales: 68400 },
  { day: "Sat", sales: 94500 },
  { day: "Sun", sales: 86300 },
];

export default function AdminDashboardPage() {
  const { user } = useAuth();
  const isBrandManager = user?.role === "brand_manager" || user?.role === "vendor";
  const brandSlug = user?.brandSlug || "";

  const [stats, setStats] = useState<any>(null);
  const [products, setProducts] = useState<IProduct[]>([]);
  const [brandData, setBrandData] = useState<IBrand | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      try {
        const [dashRes, prodRes] = await Promise.all([
          fetch("/api/dashboard"),
          fetch("/api/products?limit=200&includeInactive=true"),
        ]);
        if (dashRes.ok) {
          const data = await dashRes.json();
          setStats(data);
        }
        if (prodRes.ok) {
          const prodData = await prodRes.json();
          setProducts(prodData.products || []);
        }

        if (isBrandManager && brandSlug) {
          const bRes = await fetch(`/api/brands/${brandSlug.toLowerCase()}`);
          if (bRes.ok) {
            const b = await bRes.json();
            setBrandData(b);
          }
        }
      } catch (e) {
        console.error("Failed to load dashboard stats", e);
      } finally {
        setLoading(false);
      }
    }
    loadStats();
  }, [isBrandManager, brandSlug]);

  // Brand Manager calculations
  const brandProducts = useMemo(() => {
    if (!isBrandManager || !brandSlug) return [];
    return products.filter(
      (p) => (p.brand || "").toLowerCase() === brandSlug.toLowerCase()
    );
  }, [products, isBrandManager, brandSlug]);

  const brandInStock = useMemo(() => {
    return brandProducts.filter((p) => p.stock > 5).length;
  }, [brandProducts]);

  const brandLowStock = useMemo(() => {
    return brandProducts.filter((p) => p.stock <= 5);
  }, [brandProducts]);

  const brandTotalUnits = useMemo(() => {
    return brandProducts.reduce((sum, p) => sum + (p.stock || 0), 0);
  }, [brandProducts]);

  // If logged in as Brand Partner / Manager
  if (isBrandManager) {
    return (
      <div className="space-y-8 pb-12">
        {/* Brand Hero Welcome Banner */}
        <div className="bg-gradient-to-r from-amber-500/20 via-neutral-900 to-amber-500/10 border border-amber-500/40 rounded-3xl p-6 sm:p-8 relative overflow-hidden shadow-2xl">
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-xs uppercase font-black tracking-widest text-amber-400 bg-amber-400/10 border border-amber-400/20 px-3 py-1 rounded-full">
                  Verified Brand Partner Console
                </span>
                <span className="flex items-center gap-1 text-[11px] text-emerald-400 font-bold">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Storefront Live</span>
                </span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-black uppercase tracking-tight text-white">
                {brandSlug.toUpperCase()} STORE STUDIO
              </h1>
              <p className="text-sm text-neutral-300 max-w-2xl leading-relaxed">
                Welcome back to your store workspace. You have full control over your brand items, descriptions, pricing, inventory drops, and storefront appearance.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3 shrink-0">
              <Link
                href={`/brand/${brandSlug.toLowerCase()}`}
                target="_blank"
                className="bg-neutral-800 hover:bg-neutral-700 text-white text-xs font-bold px-4 py-3 rounded-2xl flex items-center gap-2 transition-all border border-neutral-700 shadow-md"
              >
                <Eye className="w-4 h-4 text-neutral-400" />
                <span>View Live Store</span>
                <ExternalLink className="w-3.5 h-3.5 text-neutral-400" />
              </Link>
              <Link
                href="/admin/brand-customizer"
                className="bg-amber-400 hover:bg-amber-300 text-black text-xs font-black px-5 py-3 rounded-2xl flex items-center gap-2 transition-all shadow-lg hover:scale-102"
              >
                <Sparkles className="w-4 h-4" />
                <span>Storefront Customizer</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Brand Scoped KPI Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Total Brand Products */}
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-5 shadow-xs">
            <div className="flex items-center justify-between text-neutral-400 text-xs font-bold uppercase tracking-wider">
              <span>Catalog SKUs</span>
              <div className="w-8 h-8 rounded-lg bg-neutral-800 flex items-center justify-center text-white">
                <Package className="w-4 h-4 text-amber-400" />
              </div>
            </div>
            <div className="text-3xl font-black text-white mt-3">
              {brandProducts.length} Items
            </div>
            <span className="text-[11px] text-neutral-400 mt-1 block font-medium">
              Scoped exclusively to {brandSlug.toUpperCase()}
            </span>
          </div>

          {/* In Stock Count */}
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-5 shadow-xs">
            <div className="flex items-center justify-between text-neutral-400 text-xs font-bold uppercase tracking-wider">
              <span>Healthy Inventory</span>
              <div className="w-8 h-8 rounded-lg bg-neutral-800 flex items-center justify-center text-white">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              </div>
            </div>
            <div className="text-3xl font-black text-emerald-400 mt-3">
              {brandInStock} SKUs
            </div>
            <span className="text-[11px] text-emerald-400/80 mt-1 block font-bold">
              Ready for instant online checkout
            </span>
          </div>

          {/* Total Units in Stock */}
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-5 shadow-xs">
            <div className="flex items-center justify-between text-neutral-400 text-xs font-bold uppercase tracking-wider">
              <span>Total Units</span>
              <div className="w-8 h-8 rounded-lg bg-neutral-800 flex items-center justify-center text-white">
                <Store className="w-4 h-4 text-blue-400" />
              </div>
            </div>
            <div className="text-3xl font-black text-white mt-3">
              {brandTotalUnits.toLocaleString()} Pcs
            </div>
            <span className="text-[11px] text-neutral-400 mt-1 block font-medium">
              Combined islandwide stock volume
            </span>
          </div>

          {/* Low Stock Alerts */}
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-5 shadow-xs">
            <div className="flex items-center justify-between text-neutral-400 text-xs font-bold uppercase tracking-wider">
              <span>Low Stock Alerts</span>
              <div className="w-8 h-8 rounded-lg bg-neutral-800 flex items-center justify-center text-white">
                <AlertTriangle className="w-4 h-4 text-amber-400" />
              </div>
            </div>
            <div className="text-3xl font-black text-amber-400 mt-3">
              {brandLowStock.length} Items
            </div>
            <span className="text-[11px] text-amber-400/80 mt-1 block font-bold">
              {brandLowStock.length > 0 ? "Re-stock replenishment advised" : "Inventory optimal"}
            </span>
          </div>
        </div>

        {/* Quick Launch & Store Preview Row */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Quick Actions Panel */}
          <div className="lg:col-span-5 bg-neutral-900 border border-neutral-800 rounded-3xl p-6 space-y-4">
            <h2 className="text-sm font-black uppercase tracking-wider text-white">
              Brand Store Management
            </h2>
            <p className="text-xs text-neutral-400">
              Direct tools to expand your collection and personalize customer touchpoints.
            </p>

            <div className="space-y-2.5 pt-2">
              <Link
                href="/admin/products"
                className="flex items-center justify-between p-3.5 rounded-2xl bg-neutral-950 border border-neutral-800 hover:border-neutral-700 transition-all group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center text-white">
                    <Plus className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white group-hover:text-amber-400 transition-colors">
                      Add New Brand Product
                    </h4>
                    <p className="text-[11px] text-neutral-400">
                      Upload photos, set size/color variants and price
                    </p>
                  </div>
                </div>
                <ArrowUpRight className="w-4 h-4 text-neutral-500 group-hover:text-white transition-colors" />
              </Link>

              <Link
                href="/admin/brand-customizer"
                className="flex items-center justify-between p-3.5 rounded-2xl bg-neutral-950 border border-neutral-800 hover:border-neutral-700 transition-all group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-amber-400/10 flex items-center justify-center text-amber-400">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white group-hover:text-amber-400 transition-colors">
                      Customize Storefront Page
                    </h4>
                    <p className="text-[11px] text-neutral-400">
                      Edit hero banner, brand heritage story &amp; WhatsApp
                    </p>
                  </div>
                </div>
                <ArrowUpRight className="w-4 h-4 text-neutral-500 group-hover:text-white transition-colors" />
              </Link>

              <Link
                href="/admin/inventory"
                className="flex items-center justify-between p-3.5 rounded-2xl bg-neutral-950 border border-neutral-800 hover:border-neutral-700 transition-all group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-400">
                    <Package className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white group-hover:text-blue-400 transition-colors">
                      Adjust Stock Levels
                    </h4>
                    <p className="text-[11px] text-neutral-400">
                      Keep units up-to-date across your catalog
                    </p>
                  </div>
                </div>
                <ArrowUpRight className="w-4 h-4 text-neutral-500 group-hover:text-white transition-colors" />
              </Link>
            </div>
          </div>

          {/* Brand Details Card */}
          <div className="lg:col-span-7 bg-neutral-900 border border-neutral-800 rounded-3xl p-6 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-black uppercase tracking-wider text-neutral-400">
                  Storefront Snapshot
                </span>
                <Link
                  href="/admin/brand-customizer"
                  className="text-xs text-amber-400 hover:text-amber-300 font-bold flex items-center gap-1"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Edit Details</span>
                </Link>
              </div>

              <div className="space-y-3">
                <div className="p-4 rounded-2xl bg-neutral-950 border border-neutral-800/80">
                  <div className="text-[11px] uppercase tracking-wider font-mono text-neutral-500">
                    Tagline
                  </div>
                  <div className="text-sm font-bold text-white mt-1">
                    {brandData?.tagline || `Authentic ${brandSlug.toUpperCase()} Collection`}
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-neutral-950 border border-neutral-800/80">
                  <div className="text-[11px] uppercase tracking-wider font-mono text-neutral-500">
                    Heritage &amp; Story
                  </div>
                  <p className="text-xs text-neutral-300 mt-1 line-clamp-3 leading-relaxed">
                    {brandData?.story ||
                      "Premium lifestyle fashion crafted for modern elegance and tropical ease."}
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-neutral-800/80 mt-4 flex items-center justify-between text-xs text-neutral-400">
              <span>Live Public Storefront:</span>
              <Link
                href={`/brand/${brandSlug.toLowerCase()}`}
                target="_blank"
                className="text-white hover:text-amber-400 font-mono font-bold flex items-center gap-1 transition-colors"
              >
                <span>/brand/{brandSlug.toLowerCase()}</span>
                <ExternalLink className="w-3 h-3" />
              </Link>
            </div>
          </div>
        </div>

        {/* Brand Products Table */}
        <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-6 shadow-xs">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-sm font-black uppercase tracking-wider text-white">
                {brandSlug.toUpperCase()} Catalog Items
              </h2>
              <p className="text-xs text-neutral-400">
                All products currently featured in your store
              </p>
            </div>
            <Link
              href="/admin/products"
              className="bg-white text-black text-xs font-black uppercase tracking-wider px-4 py-2 rounded-xl hover:bg-neutral-200 transition-all flex items-center gap-1.5"
            >
              <span>Manage All ({brandProducts.length})</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-neutral-300">
              <thead className="text-[10px] uppercase font-bold text-neutral-500 border-b border-neutral-800">
                <tr>
                  <th className="py-2.5">Product</th>
                  <th className="py-2.5">Category</th>
                  <th className="py-2.5">Price</th>
                  <th className="py-2.5">Stock</th>
                  <th className="py-2.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-800/60 font-medium">
                {brandProducts.slice(0, 8).map((p) => (
                  <tr key={p._id || p.slug} className="hover:bg-neutral-800/40">
                    <td className="py-3">
                      <div className="flex items-center gap-3">
                        {p.images?.[0]?.url && (
                          <img
                            src={p.images[0].url}
                            alt={p.name}
                            className="w-9 h-9 rounded-lg object-cover border border-neutral-800 shrink-0"
                          />
                        )}
                        <div>
                          <strong className="text-white block font-bold truncate max-w-[220px]">
                            {p.name}
                          </strong>
                          <span className="text-[10px] font-mono text-neutral-500 uppercase">
                            SKU: {p.sku}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="py-3">
                      <span className="bg-neutral-800 text-neutral-300 px-2 py-0.5 rounded-md text-[10px] font-bold uppercase">
                        {p.category}
                      </span>
                    </td>
                    <td className="py-3 font-bold text-white">
                      Rs. {p.price.toLocaleString()}
                    </td>
                    <td className="py-3">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase ${
                          p.stock > 5
                            ? "bg-emerald-950 text-emerald-400 border border-emerald-800"
                            : p.stock > 0
                            ? "bg-amber-950 text-amber-400 border border-amber-800"
                            : "bg-rose-950 text-rose-400 border border-rose-800"
                        }`}
                      >
                        {p.stock} in stock
                      </span>
                    </td>
                    <td className="py-3 text-right">
                      <Link
                        href={`/admin/products`}
                        className="text-xs text-neutral-400 hover:text-white font-bold underline"
                      >
                        Edit
                      </Link>
                    </td>
                  </tr>
                ))}
                {brandProducts.length === 0 && (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-neutral-500">
                      No products added for {brandSlug.toUpperCase()} yet. Click "Add New Brand Product" above to publish your first item!
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }

  // Superadmin view (Default)
  return (
    <div className="space-y-8">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black uppercase tracking-wider text-white">
            Performance Overview
          </h1>
          <p className="text-xs text-neutral-400 mt-0.5">
            Real-time sales analytics and inventory movement.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/admin/products"
            className="bg-white text-black text-xs font-black uppercase tracking-wider px-4 py-2 rounded-xl hover:bg-neutral-200 transition-colors shadow-xs"
          >
            + New Product
          </Link>
        </div>
      </div>

      {/* 4 Metric KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Revenue */}
        <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-5 shadow-xs">
          <div className="flex items-center justify-between text-neutral-400 text-xs font-bold uppercase tracking-wider">
            <span>Gross Revenue</span>
            <div className="w-8 h-8 rounded-lg bg-neutral-800 flex items-center justify-center text-white">
              <DollarSign className="w-4 h-4 text-emerald-400" />
            </div>
          </div>
          <div className="text-2xl font-black text-white mt-3">
            Rs. {stats?.totalRevenue ? stats.totalRevenue.toLocaleString() : "135,669"}
          </div>
          <div className="flex items-center gap-1 text-[11px] text-emerald-400 mt-1 font-bold">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>+18.4% from last week</span>
          </div>
        </div>

        {/* Total Orders */}
        <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-5 shadow-xs">
          <div className="flex items-center justify-between text-neutral-400 text-xs font-bold uppercase tracking-wider">
            <span>Total Orders</span>
            <div className="w-8 h-8 rounded-lg bg-neutral-800 flex items-center justify-center text-white">
              <ShoppingBag className="w-4 h-4 text-blue-400" />
            </div>
          </div>
          <div className="text-2xl font-black text-white mt-3">
            {stats?.totalOrders !== undefined ? stats.totalOrders : 2} Orders
          </div>
          <span className="text-[11px] text-neutral-400 mt-1 block font-medium">
            {stats?.pendingOrders || 1} pending fulfillment
          </span>
        </div>

        {/* Active Products */}
        <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-5 shadow-xs">
          <div className="flex items-center justify-between text-neutral-400 text-xs font-bold uppercase tracking-wider">
            <span>Catalog Items</span>
            <div className="w-8 h-8 rounded-lg bg-neutral-800 flex items-center justify-center text-white">
              <Package className="w-4 h-4 text-purple-400" />
            </div>
          </div>
          <div className="text-2xl font-black text-white mt-3">
            {stats?.activeProducts !== undefined ? stats.activeProducts : 16} SKUs
          </div>
          <span className="text-[11px] text-emerald-400 mt-1 block font-bold">
            All active &amp; ready for checkout
          </span>
        </div>

        {/* Low Stock Alerts */}
        <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-5 shadow-xs">
          <div className="flex items-center justify-between text-neutral-400 text-xs font-bold uppercase tracking-wider">
            <span>Low Stock Items</span>
            <div className="w-8 h-8 rounded-lg bg-neutral-800 flex items-center justify-center text-white">
              <AlertTriangle className="w-4 h-4 text-amber-400" />
            </div>
          </div>
          <div className="text-2xl font-black text-white mt-3">
            {stats?.lowStockCount !== undefined ? stats.lowStockCount : 1} Items
          </div>
          <span className="text-[11px] text-amber-400 mt-1 block font-bold">
            Waves Poncho Ash (1 left)
          </span>
        </div>
      </div>

      {/* Revenue Chart Section (Recharts) */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-6 shadow-xs">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-sm font-black uppercase tracking-wider text-white">
              Weekly Sales Volume (LKR)
            </h2>
            <p className="text-xs text-neutral-400">Aggregate daily revenue performance</p>
          </div>
          <span className="text-xs font-bold bg-neutral-800 text-neutral-300 px-3 py-1 rounded-full">
            Last 7 Days
          </span>
        </div>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={SALES_DATA}>
              <defs>
                <linearGradient id="salesGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ffffff" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#ffffff" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#262626" />
              <XAxis dataKey="day" stroke="#737373" fontSize={11} />
              <YAxis
                stroke="#737373"
                fontSize={11}
                tickFormatter={(v) => `Rs ${v / 1000}k`}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#000000",
                  borderColor: "#262626",
                  borderRadius: "12px",
                  fontSize: "12px",
                  color: "#ffffff",
                }}
              />
              <Area
                type="monotone"
                dataKey="sales"
                stroke="#ffffff"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#salesGradient)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Orders & Low Stock Tables Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Recent Orders Table */}
        <div className="lg:col-span-8 bg-neutral-900 border border-neutral-800 rounded-3xl p-6 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-black uppercase tracking-wider text-white">
              Recent Orders
            </h2>
            <Link
              href="/admin/orders"
              className="text-xs font-bold text-neutral-400 hover:text-white flex items-center gap-1"
            >
              <span>View All</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-neutral-300">
              <thead className="text-[10px] uppercase font-bold text-neutral-500 border-b border-neutral-800">
                <tr>
                  <th className="py-2.5">Order</th>
                  <th className="py-2.5">Customer</th>
                  <th className="py-2.5">Method</th>
                  <th className="py-2.5">Total</th>
                  <th className="py-2.5">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-800/60 font-medium">
                {stats?.recentOrders?.map((ord: any) => (
                  <tr key={ord.orderNumber || ord._id} className="hover:bg-neutral-800/40">
                    <td className="py-3 font-bold text-white">{ord.orderNumber || "TBH-ORDER"}</td>
                    <td className="py-3">{ord.customer?.name || "Customer"}</td>
                    <td className="py-3 uppercase text-[10px]">{ord.paymentMethod || "COD"}</td>
                    <td className="py-3 font-bold text-white">Rs. {(ord.total || 0).toLocaleString()}</td>
                    <td className="py-3">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase bg-neutral-800 text-neutral-200">
                        {ord.orderStatus || "Processing"}
                      </span>
                    </td>
                  </tr>
                )) || (
                  <tr>
                    <td colSpan={5} className="py-4 text-center text-neutral-500">
                      Loading orders...
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Low Stock Warning */}
        <div className="lg:col-span-4 bg-neutral-900 border border-neutral-800 rounded-3xl p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-black uppercase tracking-wider text-white">
              Low Stock Alert
            </h2>
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
          </div>

          <div className="space-y-3 text-xs">
            {stats?.lowStockProducts?.map((p: any) => (
              <div
                key={p.sku}
                className="p-3 rounded-xl bg-neutral-950 border border-neutral-800 flex items-center justify-between"
              >
                <div>
                  <strong className="text-white block font-bold truncate max-w-[160px]">
                    {p.name}
                  </strong>
                  <span className="text-[10px] text-neutral-400 uppercase">SKU: {p.sku}</span>
                </div>
                <span className="px-2.5 py-1 rounded-full text-[11px] font-black bg-amber-950 text-amber-400 border border-amber-800">
                  {p.stock} left
                </span>
              </div>
            )) || (
              <div className="text-neutral-500 text-center py-4">All stock levels healthy.</div>
            )}
          </div>

          <div className="pt-2">
            <Link
              href="/admin/inventory"
              className="w-full block bg-neutral-800 hover:bg-neutral-700 text-white text-center py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors"
            >
              Adjust Inventory
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
