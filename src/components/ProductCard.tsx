"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Heart, ShoppingBag, Sparkles, ArrowRight } from "lucide-react";
import { IProduct } from "@/types";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";

interface ProductCardProps {
  product: IProduct;
  className?: string;
}

export default function ProductCard({ product, className = "" }: ProductCardProps) {
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const inWishlist = isInWishlist(product._id || product.slug);
  const [isHovered, setIsHovered] = useState(false);

  const installmentAmount = (product.price / 3).toLocaleString("en-LK", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  const primaryImage =
    product.images?.[0]?.url ||
    "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=800&q=80";
  const secondaryImage = product.images?.[1]?.url;

  const discountPercent =
    product.originalPrice && product.originalPrice > product.price
      ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
      : 0;

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart({
      productId: product._id || product.slug,
      name: product.name,
      slug: product.slug,
      sku: product.sku,
      price: product.price,
      originalPrice: product.originalPrice,
      image: primaryImage,
      brand: product.brand,
      selectedColor: product.colors?.[0]?.name,
      selectedSize: product.sizes?.[0] || "Standard",
      quantity: 1,
    });
  };

  return (
    <div
      className={`group flex flex-col justify-between transition-all duration-300 ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Premium Image Container */}
      <div className="relative w-full aspect-[3/4] bg-[#f5f5f5] rounded-2xl sm:rounded-3xl overflow-hidden shadow-xs group-hover:shadow-lg transition-all duration-500">
        {/* Floating Top Badges */}
        <div className="absolute top-3 left-3 sm:top-3.5 sm:left-3.5 z-10 flex flex-col gap-1.5 items-start pointer-events-none">
          {discountPercent > 0 && (
            <span className="bg-black/90 backdrop-blur-md text-white text-[10px] sm:text-[11px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full shadow-sm">
              -{discountPercent}%
            </span>
          )}

          {product.isVirtualTryOn && (
            <span className="bg-emerald-950/85 backdrop-blur-md text-emerald-300 border border-emerald-700/60 text-[9px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 shadow-xs">
              <Sparkles className="w-2.5 h-2.5" />
              <span>NeuralFit™</span>
            </span>
          )}
        </div>

        {/* Wishlist Button (Frosted Glass) */}
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleWishlist(product);
          }}
          className={`absolute top-3 right-3 sm:top-3.5 sm:right-3.5 z-10 w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center transition-all duration-200 backdrop-blur-md shadow-xs ${
            inWishlist
              ? "bg-red-50 text-red-500 hover:bg-red-100 scale-105"
              : "bg-white/85 text-neutral-600 hover:text-black hover:bg-white hover:scale-110 active:scale-95 border border-black/5"
          }`}
          aria-label="Wishlist"
        >
          <Heart className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${inWishlist ? "fill-red-500 text-red-500" : ""}`} />
        </button>

        {/* Product Images with Cross-Fade on Hover */}
        <Link
          href={`/product/${product.slug}`}
          className="w-full h-full relative block overflow-hidden bg-neutral-100"
        >
          {/* Primary Image */}
          <Image
            src={primaryImage}
            alt={product.name}
            fill
            className={`object-cover object-center transition-all duration-700 ease-out group-hover:scale-108 ${
              secondaryImage ? "group-hover:opacity-0" : ""
            }`}
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            priority={false}
          />

          {/* Secondary Alternate Angle (if available, dissolves smoothly on hover) */}
          {secondaryImage && (
            <Image
              src={secondaryImage}
              alt={`${product.name} Alternate View`}
              fill
              className="object-cover object-center absolute inset-0 opacity-0 group-hover:opacity-100 transition-all duration-700 ease-out group-hover:scale-108"
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            />
          )}

          {/* Subtle Bottom Vignette on Hover */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
        </Link>
      </div>

      {/* Info & Details Section */}
      <div className="pt-3 pb-1 flex-1 flex flex-col justify-between">
        <div>
          {/* Brand & Category micro-label */}
          {product.brand && (
            <span className="text-[10px] uppercase font-bold tracking-widest text-neutral-400 block mb-0.5">
              {product.brand}
            </span>
          )}

          {/* Title and Color Swatches row */}
          <div className="flex items-start justify-between gap-2">
            <Link
              href={`/product/${product.slug}`}
              className="text-xs sm:text-[13px] font-bold text-neutral-900 group-hover:text-black transition-colors line-clamp-1 leading-snug"
            >
              {product.name}
            </Link>

            {/* Refined Color Swatches */}
            {product.colors && product.colors.length > 0 && (
              <div className="flex items-center space-x-1 shrink-0 pt-0.5">
                {product.colors.map((c, i) => (
                  <span
                    key={i}
                    title={c.name}
                    className="w-2.5 h-2.5 rounded-full ring-1 ring-neutral-300 ring-offset-1 transition-transform hover:scale-125"
                    style={{ backgroundColor: c.hex }}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Price row */}
          <div className="mt-1.5 flex items-baseline gap-2">
            <span className="text-xs sm:text-sm font-black text-black tracking-tight">
              Rs {product.price.toLocaleString("en-LK", { minimumFractionDigits: 2 })}
            </span>
            {product.originalPrice && product.originalPrice > product.price && (
              <span className="text-[11px] text-neutral-400 line-through">
                Rs {product.originalPrice.toLocaleString("en-LK", { minimumFractionDigits: 2 })}
              </span>
            )}
          </div>

          {/* Installment breakdown (KOKO & Mintpay) */}
          <div className="mt-1.5 space-y-0.5 text-[9px] sm:text-[10px] text-neutral-500 font-medium leading-tight">
            <div className="flex items-center gap-1">
              <span>or 3 X Rs. {installmentAmount} with</span>
              <span className="font-black text-[#e11d48] tracking-tight">KOKO</span>
              <span className="text-[9px] text-neutral-400">ⓘ</span>
            </div>
            <div className="flex items-center gap-1">
              <span>or 3 X Rs. {installmentAmount} with</span>
              <span className="font-bold text-[#0284c7] tracking-tight">mintpay</span>
            </div>
          </div>
        </div>

        {/* Action Buttons: SELECT OPTIONS / ADD TO CART + Circular Cart Icon */}
        <div className="mt-3.5 flex items-center gap-2">
          <Link
            href={`/product/${product.slug}`}
            className="flex-1 bg-black text-white text-[10px] sm:text-[11px] font-extrabold py-2.5 px-3 rounded-full uppercase tracking-wider text-center hover:bg-neutral-800 active:scale-[0.99] transition-all shadow-xs hover:shadow-md"
          >
            {product.sizes && product.sizes.length > 1 ? "SELECT OPTIONS" : "ADD TO CART"}
          </Link>

          <button
            onClick={handleQuickAdd}
            className="w-8 h-8 sm:w-9 sm:h-9 rounded-full border border-neutral-300 hover:border-black hover:bg-black hover:text-white text-neutral-700 flex items-center justify-center transition-all shrink-0 hover:scale-105 active:scale-95"
            aria-label="Quick add to cart"
            title="Quick add to cart"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
