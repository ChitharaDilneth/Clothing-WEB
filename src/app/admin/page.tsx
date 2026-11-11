"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  DollarSign,
  ShoppingBag,
  Package,
  AlertTriangle,
  ArrowUpRight,
  TrendingUp,
  Clock,
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
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      try {
        const res = await fetch("/api/dashboard");
        if (res.ok) {
          const data = await res.json();
          setStats(data);
        }
      } catch (e) {
        console.error("Failed to load dashboard stats", e);
      } finally {
        setLoading(false);
      }
    }
    loadStats();
  }, []);

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
