"use client";

import React from "react";
import Link from "next/link";

export default function AnnouncementBar() {
  return (
    <div className="bg-black text-white text-[11px] sm:text-xs font-medium tracking-wide py-1.5 px-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex-1 text-center font-medium">
          Free Shipping For Orders Above Rs. 8500/=
        </div>
        <div className="hidden sm:flex items-center space-x-6 text-[11px] uppercase tracking-wider font-semibold">
          <Link href="/shipping" className="hover:text-gray-300 transition-colors">
            SHIPPING
          </Link>
          <span className="text-gray-600">|</span>
          <Link href="/auth/register" className="hover:text-gray-300 transition-colors">
            JOIN US
          </Link>
        </div>
      </div>
    </div>
  );
}
