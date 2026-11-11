"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, Sparkles, Wand2 } from "lucide-react";

const NAV_ITEMS = [
  { name: "WOMEN", href: "/category/women" },
  { name: "MEN", href: "/category/men" },
  { name: "KIDS", href: "/category/kids" },
  { name: "UNISEX", href: "/category/unisex" },
  { name: "HEALTH", href: "/category/health" },
  { name: "CLOTHING", href: "/category/clothing" },
  { name: "BAGS", href: "/category/bags" },
  { name: "SHOP BY BRANDS", href: "/#brands" },
  {
    name: "AI FIT STUDIO",
    href: "/virtual-try-on",
    badge: "3D TRY-ON",
    highlight: "text-emerald-400",
  },
  {
    name: "MAKE YOUR OWN WAVES",
    href: "/customizer",
    highlight: "text-amber-400 font-extrabold tracking-wider",
  },
];

export default function CategoryNavigation() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="bg-black text-white sticky top-[65px] md:top-[73px] z-30 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center justify-between overflow-x-auto scrollbar-none py-2.5">
          <div className="flex items-center space-x-6 xl:space-x-8 text-xs font-bold tracking-widest uppercase">
            {NAV_ITEMS.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`transition-colors whitespace-nowrap py-1 relative flex items-center gap-1.5 ${
                    item.highlight
                      ? item.highlight
                      : isActive
                      ? "text-white font-black border-b-2 border-white pb-0.5"
                      : "text-gray-300 hover:text-white"
                  }`}
                >
                  {item.badge && (
                    <span className="bg-emerald-500/20 text-emerald-400 text-[9px] px-1.5 py-0.5 rounded-full border border-emerald-500/40">
                      {item.badge}
                    </span>
                  )}
                  {item.name}
                </Link>
              );
            })}
          </div>
        </div>

        {/* Mobile Navigation Header */}
        <div className="lg:hidden flex items-center justify-between py-2 text-xs font-bold">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="flex items-center gap-2 text-gray-200 hover:text-white"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            <span className="uppercase tracking-wider">ALL CATEGORIES</span>
          </button>

          <Link
            href="/customizer"
            className="text-amber-400 text-[11px] font-black uppercase tracking-wider flex items-center gap-1"
          >
            <Sparkles className="w-3 h-3 text-amber-400" />
            MAKE YOUR OWN WAVES
          </Link>
        </div>
      </div>

      {/* Mobile Drawer Dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-neutral-950 border-t border-neutral-800 px-4 py-4 space-y-3 text-xs uppercase font-semibold">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              onClick={() => setMobileMenuOpen(false)}
              className={`block py-1.5 transition-colors ${
                item.highlight ? item.highlight : "text-gray-300 hover:text-white"
              }`}
            >
              {item.name}
            </Link>
          ))}
          <div className="pt-3 border-t border-neutral-800 flex flex-col gap-2">
            <Link
              href="/virtual-try-on"
              onClick={() => setMobileMenuOpen(false)}
              className="text-emerald-400 font-bold flex items-center gap-1.5"
            >
              <Wand2 className="w-3.5 h-3.5" />
              TBH NeuralFit™ AI Studio
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
