"use client";

import React from "react";
import Link from "next/link";
import { Heart, ShoppingBag, ArrowRight } from "lucide-react";
import ProductGrid from "@/components/ProductGrid";
import { useWishlist } from "@/context/WishlistContext";

export default function WishlistPage() {
  const { wishlist } = useWishlist();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl sm:text-4xl font-black uppercase tracking-wider text-black">
            My Wishlist ({wishlist.length})
          </h1>
          <p className="text-xs text-neutral-500 mt-1">
            Curated items saved for later or seasonal purchases.
          </p>
        </div>
        <Link
          href="/category/women"
          className="text-xs font-bold uppercase tracking-wider text-black hover:underline flex items-center gap-1"
        >
          <span>Continue Shopping</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {wishlist.length === 0 ? (
        <div className="py-20 text-center text-neutral-400">
          <Heart className="w-12 h-12 stroke-[1.2] mx-auto mb-3 text-neutral-300" />
          <p className="text-sm font-bold text-neutral-800">Your wishlist is currently empty</p>
          <p className="text-xs text-neutral-400 mt-1">Tap the heart icon on any product to save it here.</p>
          <Link
            href="/category/women"
            className="mt-6 inline-block bg-black text-white text-xs font-black uppercase tracking-wider py-3 px-8 rounded-full hover:bg-neutral-800 transition-colors"
          >
            DISCOVER PRODUCTS
          </Link>
        </div>
      ) : (
        <ProductGrid products={wishlist} columns={4} />
      )}
    </div>
  );
}
