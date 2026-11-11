import React from "react";
import Link from "next/link";

interface SiteLogoProps {
  variant?: "dark" | "light";
  className?: string;
}

export default function SiteLogo({ variant = "dark", className = "" }: SiteLogoProps) {
  const isLight = variant === "light";

  return (
    <Link href="/" className={`inline-flex items-center gap-2 group ${className}`}>
      <div className="flex items-baseline">
        <span
          className={`font-black text-2xl sm:text-3xl tracking-tighter leading-none ${
            isLight ? "text-white" : "text-black"
          }`}
        >
          TBH
        </span>
      </div>
      <div
        className={`flex flex-col text-[8px] sm:text-[9px] font-bold tracking-widest leading-none uppercase pl-1.5 border-l ${
          isLight ? "border-gray-600 text-gray-300" : "border-black/30 text-black/80"
        }`}
      >
        <span>THE</span>
        <span>BRAND</span>
        <span>HUB</span>
      </div>
    </Link>
  );
}
