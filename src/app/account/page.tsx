"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { User, Package, MapPin, Heart, Shield, LogOut, ExternalLink } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { IOrder } from "@/types";

export default function AccountPage() {
  const router = useRouter();
  const { user, isLoading, logout, isAdmin } = useAuth();
  const [orders, setOrders] = useState<IOrder[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(true);

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/auth/login");
    }
  }, [user, isLoading, router]);

  useEffect(() => {
    async function loadOrders() {
      try {
        const res = await fetch("/api/orders");
        if (res.ok) {
          const data = await res.json();
          // Filter to user orders or display latest customer orders
          setOrders(data || []);
        }
      } catch (err) {
        console.error("Error loading orders:", err);
      } finally {
        setLoadingOrders(false);
      }
    }
    if (user) loadOrders();
  }, [user]);

  if (isLoading || !user) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center text-xs text-neutral-400">
        Loading your account profile...
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Account Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-6 border-b border-neutral-200 gap-4">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">
            CUSTOMER DASHBOARD
          </span>
          <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-wider text-black">
            Welcome, {user.name}
          </h1>
          <p className="text-xs text-neutral-500 mt-0.5">{user.email}</p>
        </div>

        <div className="flex items-center gap-3">
          {isAdmin && (
            <Link
              href="/admin"
              className="bg-black text-white text-xs font-bold uppercase tracking-wider px-4 py-2 rounded-full hover:bg-neutral-800 transition-colors flex items-center gap-1.5 shadow-xs"
            >
              <Shield className="w-3.5 h-3.5" />
              <span>Admin Dashboard</span>
            </Link>
          )}

          <button
            onClick={logout}
            className="border border-neutral-300 hover:border-black text-neutral-700 hover:text-black text-xs font-bold uppercase tracking-wider px-4 py-2 rounded-full transition-colors flex items-center gap-1.5"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-8">
        {/* Left Column: Quick Navigation / Profile Summary */}
        <div className="lg:col-span-4 space-y-4">
          <div className="border border-neutral-200 rounded-2xl p-5 bg-neutral-50/60 shadow-xs space-y-3 text-xs">
            <h2 className="font-black uppercase tracking-wider text-black">
              Profile Summary
            </h2>
            <div className="space-y-1.5 text-neutral-600">
              <p>
                <strong>Full Name:</strong> {user.name}
              </p>
              <p>
                <strong>Account Email:</strong> {user.email}
              </p>
              <p>
                <strong>Account Tier:</strong>{" "}
                <span className="capitalize font-bold text-black">{user.role}</span>
              </p>
            </div>
          </div>

          <div className="border border-neutral-200 rounded-2xl p-5 bg-white shadow-xs space-y-3 text-xs font-bold">
            <Link
              href="/wishlist"
              className="flex items-center justify-between p-2 rounded-lg hover:bg-neutral-50 text-neutral-800 hover:text-black transition-colors"
            >
              <span className="flex items-center gap-2">
                <Heart className="w-4 h-4 text-red-500" />
                <span>My Saved Wishlist</span>
              </span>
              <ExternalLink className="w-3.5 h-3.5 text-neutral-400" />
            </Link>

            <Link
              href="/track-order"
              className="flex items-center justify-between p-2 rounded-lg hover:bg-neutral-50 text-neutral-800 hover:text-black transition-colors"
            >
              <span className="flex items-center gap-2">
                <Package className="w-4 h-4 text-neutral-700" />
                <span>Track a Delivery</span>
              </span>
              <ExternalLink className="w-3.5 h-3.5 text-neutral-400" />
            </Link>
          </div>
        </div>

        {/* Right Column: Order History */}
        <div className="lg:col-span-8">
          <h2 className="text-base font-black uppercase tracking-wider text-black mb-4">
            Recent Purchases &amp; Orders
          </h2>

          {loadingOrders ? (
            <div className="space-y-3">
              {[1, 2].map((i) => (
                <div key={i} className="h-28 bg-neutral-100 rounded-2xl animate-pulse" />
              ))}
            </div>
          ) : orders.length === 0 ? (
            <div className="p-10 border border-neutral-200 rounded-2xl text-center bg-neutral-50 text-neutral-400 text-xs">
              <Package className="w-8 h-8 mx-auto mb-2 text-neutral-300" />
              <p className="font-bold text-neutral-700">No order history yet</p>
              <p className="mt-1">When you make purchases, they will appear here with live tracking.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((o) => (
                <div
                  key={o.orderNumber}
                  className="border border-neutral-200 rounded-2xl p-5 bg-white shadow-xs hover:border-neutral-400 transition-all text-xs space-y-3"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-neutral-100 gap-2">
                    <div>
                      <span className="font-black text-black text-sm">{o.orderNumber}</span>
                      <span className="text-[11px] text-neutral-400 block">
                        Placed on {new Date(o.createdAt || Date.now()).toLocaleDateString("en-LK")}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span
                        className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                          o.orderStatus === "delivered"
                            ? "bg-emerald-100 text-emerald-800"
                            : o.orderStatus === "shipped"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-amber-100 text-amber-800"
                        }`}
                      >
                        {o.orderStatus}
                      </span>

                      <Link
                        href={`/order-success/${o.orderNumber}`}
                        className="border border-neutral-200 hover:border-black px-3 py-1 rounded-full text-[11px] font-bold text-black"
                      >
                        View Receipt
                      </Link>
                    </div>
                  </div>

                  {/* Items summary */}
                  <div className="space-y-1.5">
                    {o.items.map((item, idx) => (
                      <div key={idx} className="flex justify-between text-neutral-700">
                        <span>
                          {item.name} × {item.quantity}{" "}
                          {item.selectedSize && `(${item.selectedSize})`}
                        </span>
                        <strong className="text-black">
                          Rs. {(item.price * item.quantity).toLocaleString()}
                        </strong>
                      </div>
                    ))}
                  </div>

                  <div className="flex justify-between items-center pt-2 border-t border-neutral-100 text-neutral-500">
                    <span>
                      Tracking: <strong>{o.trackingNumber || "Pending"}</strong>
                    </span>
                    <span className="text-sm font-black text-black">
                      Total: Rs. {o.total.toLocaleString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
