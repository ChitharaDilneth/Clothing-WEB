"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Trash2, Plus, Minus, ArrowRight, ShoppingBag, ShieldCheck, Tag } from "lucide-react";
import { useCart } from "@/context/CartContext";

export default function CartPage() {
  const {
    cart,
    removeFromCart,
    updateQuantity,
    clearCart,
    subtotal,
    shippingFee,
    freeShippingRemaining,
    couponCode,
    discount,
    applyCoupon,
    removeCoupon,
    total,
  } = useCart();

  const [inputCoupon, setInputCoupon] = useState("");
  const [isApplying, setIsApplying] = useState(false);

  const handleApplyCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputCoupon.trim()) return;
    setIsApplying(true);
    await applyCoupon(inputCoupon.trim());
    setIsApplying(false);
    setInputCoupon("");
  };

  const installmentAmount = (total / 3).toFixed(2);

  if (cart.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <div className="w-16 h-16 rounded-full bg-neutral-100 flex items-center justify-center mx-auto mb-4 text-neutral-400">
          <ShoppingBag className="w-8 h-8" />
        </div>
        <h1 className="text-2xl font-black uppercase tracking-wider text-black">
          Your Shopping Cart is Empty
        </h1>
        <p className="text-xs text-neutral-500 mt-2 max-w-sm mx-auto">
          Explore our premier Sri Lankan footwear, beach ponchos, and everyday essentials.
        </p>
        <Link
          href="/category/women"
          className="inline-block mt-6 bg-black text-white text-xs font-black uppercase tracking-wider py-3 px-8 rounded-full hover:bg-neutral-800 transition-colors"
        >
          START SHOPPING
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl sm:text-4xl font-black uppercase tracking-wider text-black">
          Shopping Cart ({cart.reduce((sum, item) => sum + item.quantity, 0)})
        </h1>
        <button
          onClick={clearCart}
          className="text-xs font-bold text-neutral-400 hover:text-red-500 uppercase tracking-wider transition-colors"
        >
          Clear Cart
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        {/* Cart Items Table */}
        <div className="lg:col-span-8 divide-y divide-neutral-200 border-t border-b border-neutral-200">
          {cart.map((item) => (
            <div
              key={`${item.productId}-${item.selectedColor}-${item.selectedSize}`}
              className="py-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
            >
              <div className="flex items-center gap-4">
                <div className="w-20 h-24 rounded-2xl bg-neutral-100 overflow-hidden relative shrink-0">
                  <Image src={item.image} alt={item.name} fill className="object-cover" sizes="80px" />
                </div>
                <div>
                  <span className="text-[10px] font-bold tracking-widest text-neutral-400 uppercase">
                    {item.brand}
                  </span>
                  <Link
                    href={`/product/${item.slug}`}
                    className="text-sm font-bold text-black hover:underline block"
                  >
                    {item.name}
                  </Link>
                  <div className="text-xs text-neutral-500 mt-0.5 space-x-2">
                    {item.selectedColor && <span>Color: {item.selectedColor}</span>}
                    {item.selectedSize && <span>Size: {item.selectedSize}</span>}
                  </div>
                  {item.customization && (
                    <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded mt-1 inline-block">
                      Custom Wave Monogram
                    </span>
                  )}
                  <div className="text-xs font-black text-black mt-1 sm:hidden">
                    Rs. {(item.price * item.quantity).toLocaleString()}
                  </div>
                </div>
              </div>

              {/* Quantity Selector & Line Total */}
              <div className="flex items-center justify-between w-full sm:w-auto sm:gap-8">
                <div className="flex items-center border border-neutral-300 rounded-full px-2 py-1 bg-white">
                  <button
                    onClick={() =>
                      updateQuantity(item.productId, item.quantity - 1, item.selectedColor, item.selectedSize)
                    }
                    className="p-1 text-neutral-500 hover:text-black"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="w-8 text-center text-xs font-bold text-black">{item.quantity}</span>
                  <button
                    onClick={() =>
                      updateQuantity(item.productId, item.quantity + 1, item.selectedColor, item.selectedSize)
                    }
                    className="p-1 text-neutral-500 hover:text-black"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="hidden sm:block text-right">
                  <div className="text-sm font-black text-black">
                    Rs. {(item.price * item.quantity).toLocaleString()}
                  </div>
                  <span className="text-[11px] text-neutral-400">
                    Rs. {item.price.toLocaleString()} each
                  </span>
                </div>

                <button
                  onClick={() => removeFromCart(item.productId, item.selectedColor, item.selectedSize)}
                  className="p-2 text-neutral-400 hover:text-red-500 transition-colors"
                  aria-label="Remove item"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary & Coupon Card */}
        <div className="lg:col-span-4 space-y-6">
          {/* Free shipping meter */}
          <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-200 text-xs">
            {freeShippingRemaining === 0 ? (
              <p className="text-emerald-700 font-bold">
                🎉 Free Islandwide Shipping unlocked on this order!
              </p>
            ) : (
              <div>
                <p className="text-neutral-700 font-medium">
                  Add <strong className="text-black">Rs. {freeShippingRemaining.toLocaleString()}</strong> more to get FREE Islandwide delivery!
                </p>
                <div className="w-full bg-neutral-200 rounded-full h-1.5 mt-2 overflow-hidden">
                  <div
                    className="bg-black h-1.5 rounded-full"
                    style={{
                      width: `${Math.min(100, Math.round(((8500 - freeShippingRemaining) / 8500) * 100))}%`,
                    }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Coupon Code Section */}
          <div className="p-5 rounded-2xl border border-neutral-200 bg-white">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-black mb-2 flex items-center gap-1.5">
              <Tag className="w-3.5 h-3.5" />
              <span>Apply Discount Coupon</span>
            </h3>

            {couponCode ? (
              <div className="flex items-center justify-between bg-emerald-50 border border-emerald-200 rounded-xl px-3 py-2 text-xs text-emerald-800">
                <span>
                  Coupon <strong className="font-black">{couponCode}</strong> applied (-Rs. {discount.toLocaleString()})
                </span>
                <button onClick={removeCoupon} className="text-neutral-400 hover:text-red-500 text-[11px] font-bold">
                  Remove
                </button>
              </div>
            ) : (
              <form onSubmit={handleApplyCoupon} className="flex gap-2">
                <input
                  type="text"
                  placeholder="e.g. TBH15"
                  value={inputCoupon}
                  onChange={(e) => setInputCoupon(e.target.value.toUpperCase())}
                  className="flex-1 border border-neutral-300 rounded-lg px-3 py-2 text-xs uppercase font-bold focus:outline-hidden focus:border-black"
                />
                <button
                  type="submit"
                  disabled={isApplying}
                  className="bg-black text-white text-xs font-black px-4 py-2 rounded-lg uppercase tracking-wider hover:bg-neutral-800 transition-colors"
                >
                  {isApplying ? "..." : "Apply"}
                </button>
              </form>
            )}
          </div>

          {/* Totals Summary */}
          <div className="p-6 rounded-2xl bg-neutral-50 border border-neutral-200 space-y-3 text-xs">
            <h3 className="font-black uppercase tracking-wider text-black text-sm mb-4">
              Order Summary
            </h3>

            <div className="flex justify-between text-neutral-600">
              <span>Subtotal</span>
              <span className="font-bold text-black">Rs. {subtotal.toLocaleString()}</span>
            </div>

            {discount > 0 && (
              <div className="flex justify-between text-emerald-600 font-medium">
                <span>Discount</span>
                <span>- Rs. {discount.toLocaleString()}</span>
              </div>
            )}

            <div className="flex justify-between text-neutral-600">
              <span>Shipping Fee</span>
              <span className="font-bold text-black">
                {shippingFee === 0 ? "FREE" : `Rs. ${shippingFee.toLocaleString()}`}
              </span>
            </div>

            <div className="border-t border-neutral-200 pt-3 flex justify-between text-base font-black text-black">
              <span>Grand Total</span>
              <span>Rs. {total.toLocaleString()}</span>
            </div>

            {/* Installments Breakdown */}
            <div className="pt-2 text-[11px] text-neutral-500 space-y-1">
              <div>or 3 X <strong className="text-black">Rs. {installmentAmount}</strong> with <span className="font-bold text-[#e11d48]">KOKO</span></div>
              <div>or 3 X <strong className="text-black">Rs. {installmentAmount}</strong> with <span className="font-bold text-[#0284c7]">mintpay</span></div>
            </div>

            <div className="pt-4">
              <Link
                href="/checkout"
                className="w-full bg-black text-white py-3.5 px-6 rounded-full text-xs font-black uppercase tracking-wider text-center hover:bg-neutral-800 transition-colors shadow-sm flex items-center justify-center gap-2"
              >
                <span>PROCEED TO CHECKOUT</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
