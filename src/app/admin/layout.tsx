"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  Layers,
  ShoppingBag,
  Sliders,
  Sparkles,
  Tag,
  Settings,
  Menu,
  X,
  LogOut,
  ExternalLink,
  ShieldCheck,
  Loader2,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import SiteLogo from "@/components/SiteLogo";

const ADMIN_NAV = [
  { name: "Overview", href: "/admin", icon: LayoutDashboard },
  { name: "Products", href: "/admin/products", icon: Package },
  { name: "Categories", href: "/admin/categories", icon: Layers },
  { name: "Orders", href: "/admin/orders", icon: ShoppingBag },
  { name: "Inventory", href: "/admin/inventory", icon: Sliders },
  { name: "Custom Orders", href: "/admin/custom-orders", icon: Sparkles },
  { name: "Coupons", href: "/admin/coupons", icon: Tag },
  { name: "Site Settings", href: "/admin/settings", icon: Settings },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isAdmin, isLoading, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // All React hooks MUST be called unconditionally at the top before any conditional returns
  useEffect(() => {
    if (!isLoading && !isAdmin && pathname !== "/admin/login") {
      router.replace("/admin/login");
    }
  }, [isLoading, isAdmin, pathname, router]);

  // If viewing the admin login page, don't show the admin layout wrapper
  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  // Loading state while verifying admin authentication session
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0d0d0d] text-white flex flex-col items-center justify-center p-4">
        <Loader2 className="w-8 h-8 text-white animate-spin mb-3" />
        <p className="text-xs uppercase tracking-widest font-bold text-neutral-400">
          Verifying Admin Credentials...
        </p>
      </div>
    );
  }

  // Not authorized fallback screen while redirect happens
  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-[#0d0d0d] text-white flex flex-col items-center justify-center p-4">
        <ShieldCheck className="w-10 h-10 text-amber-400 mb-3" />
        <h2 className="text-base font-black uppercase tracking-wider">Access Restricted</h2>
        <p className="text-xs text-neutral-400 mt-1 mb-4">
          Please log in with administrator privileges to access this console.
        </p>
        <Link
          href="/admin/login"
          className="bg-white text-black px-5 py-2.5 rounded-full text-xs font-black uppercase tracking-wider hover:bg-neutral-200 transition-colors"
        >
          Go to Admin Sign In
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0d0d0d] text-neutral-100 flex flex-col md:flex-row antialiased">
      {/* Mobile Admin Header */}
      <div className="md:hidden bg-black border-b border-neutral-800 px-4 py-3 flex items-center justify-between">
        <SiteLogo variant="light" />
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-1.5 rounded-lg bg-neutral-900 text-white cursor-pointer"
          aria-label="Toggle navigation menu"
        >
          {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Admin Sidebar */}
      <aside
        className={`fixed md:static inset-y-0 left-0 z-40 w-64 bg-black border-r border-neutral-800 flex flex-col justify-between transform transition-transform duration-300 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        <div>
          {/* Sidebar Brand Header */}
          <div className="p-6 border-b border-neutral-800 flex items-center justify-between">
            <div>
              <SiteLogo variant="light" />
              <span className="text-[10px] uppercase font-mono tracking-widest text-neutral-400 block mt-1">
                EXECUTIVE DASHBOARD
              </span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 space-y-1">
            {ADMIN_NAV.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                    isActive
                      ? "bg-white text-black font-extrabold shadow-sm"
                      : "text-neutral-400 hover:text-white hover:bg-neutral-900"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-neutral-800 space-y-2">
          <Link
            href="/"
            className="flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-neutral-400 hover:text-white hover:bg-neutral-900 rounded-xl transition-colors"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>View Storefront</span>
          </Link>

          <button
            onClick={() => logout("/admin/login")}
            className="w-full flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-red-400 hover:text-red-300 hover:bg-neutral-900 rounded-xl transition-colors cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Admin Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* Top Bar */}
        <header className="bg-neutral-950 border-b border-neutral-800 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-xs font-black uppercase tracking-wider text-neutral-300">
              TBH Management Portal
            </span>
          </div>

          <div className="flex items-center gap-4 text-xs">
            <span className="text-neutral-400 hidden sm:inline">
              Logged in as: <strong className="text-white">{user?.name || user?.username || "Admin"}</strong>
            </span>
            <span className="bg-emerald-950 text-emerald-400 border border-emerald-800 text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase">
              {user?.role || "SUPERADMIN"}
            </span>

            <button
              onClick={() => logout("/admin/login")}
              className="text-neutral-400 hover:text-white text-xs font-bold uppercase tracking-wider flex items-center gap-1 border border-neutral-800 hover:border-neutral-700 px-2.5 py-1 rounded-lg transition-colors cursor-pointer"
              title="Sign Out of Admin"
            >
              <LogOut className="w-3 h-3 text-red-400" />
              <span>Sign Out</span>
            </button>
          </div>
        </header>

        {/* Content Body */}
        <main className="p-6 sm:p-8 flex-1">{children}</main>
      </div>
    </div>
  );
}
