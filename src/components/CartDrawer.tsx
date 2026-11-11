"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight } from "lucide-react";
import { useCart } from "@/context/CartContext";

export default function CartDrawer() {
  const {
    cart,
    isCartOpen,
    setIsCartOpen,
    updateQuantity,
    removeFromCart,
    subtotal,
    shippingFee,
    freeShippingRemaining,
    discount,
    couponCode,
    total,
  } = useCart();

  if (!isCartOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 transition-opacity backdrop-blur-xs"
        onClick={() => setIsCartOpen(false)}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col">
          {/* Drawer Header */}
          <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-black" />
              <h2 className="text-sm font-bold uppercase tracking-wider text-black">
                Shopping Cart ({cart.reduce((sum, item) => sum + item.quantity, 0)})
              </h2>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="p-1 rounded-full text-gray-400 hover:text-black hover:bg-gray-100 transition-colors"
              aria-label="Close cart"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Shipping Progress Indicator */}
          <div className="bg-neutral-50 px-6 py-3 border-b border-gray-100 text-xs">
            {freeShippingRemaining === 0 ? (
              <p className="text-emerald-700 font-bold flex items-center gap-1.5">
                <span>🎉</span> You unlocked FREE Islandwide Shipping!
              </p>
            ) : (
              <div>
                <p className="text-gray-700 mb-1.5 font-medium">
                  Add <strong className="text-black">Rs. {freeShippingRemaining.toLocaleString()}</strong> more for FREE shipping!
                </p>
                <div className="w-full bg-gray-200 rounded-full h-1.5 overflow-hidden">
                  <div
                    className="bg-black h-1.5 rounded-full transition-all duration-300"
                    style={{
                      width: `${Math.min(100, Math.round(((8500 - freeShippingRemaining) / 8500) * 100))}%`,
                    }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto px-6 py-4 divide-y divide-gray-100">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-12 text-gray-400">
                <ShoppingBag className="w-12 h-12 stroke-[1.2] mb-3 text-gray-300" />
                <p className="text-sm font-semibold text-gray-700">Your cart is empty</p>
                <p className="text-xs text-gray-400 mt-1 max-w-[200px]">
                  Explore our curated collections and add your favorite items.
                </p>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="mt-6 px-6 py-2 bg-black text-white text-xs font-bold rounded-full hover:bg-neutral-800 transition-colors"
                >
                  START SHOPPING
                </button>
              </div>
            ) : (
              cart.map((item) => (
                <div key={`${item.productId}-${item.selectedColor}-${item.selectedSize}`} className="py-4 flex gap-4">
                  {/* Thumbnail */}
                  <div className="w-20 h-24 rounded-lg bg-gray-100 overflow-hidden relative shrink-0">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-cover"
                      sizes="80px"
                    />
                  </div>

                  {/* Details */}
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <Link
                          href={`/product/${item.slug}`}
                          onClick={() => setIsCartOpen(false)}
                          className="text-xs font-bold text-gray-900 hover:underline line-clamp-1"
                        >
                          {item.name}
                        </Link>
                        <button
                          onClick={() => removeFromCart(item.productId, item.selectedColor, item.selectedSize)}
                          className="text-gray-400 hover:text-red-500 transition-colors"
                          aria-label="Remove item"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="text-[11px] text-gray-500 mt-0.5 space-x-2">
                        {item.selectedColor && <span>Color: {item.selectedColor}</span>}
                        {item.selectedSize && <span>Size: {item.selectedSize}</span>}
                      </div>

                      {item.customization && (
                        <div className="mt-1 text-[10px] text-amber-700 bg-amber-50 rounded px-1.5 py-0.5 inline-block">
                          Custom Waves Artwork Included
                        </div>
                      )}
                    </div>

                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center border border-gray-200 rounded-full">
                        <button
                          onClick={() =>
                            updateQuantity(item.productId, item.quantity - 1, item.selectedColor, item.selectedSize)
                          }
                          className="p-1 hover:text-black text-gray-500 transition-colors"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-6 text-center text-xs font-bold text-gray-900">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            updateQuantity(item.productId, item.quantity + 1, item.selectedColor, item.selectedSize)
                          }
                          className="p-1 hover:text-black text-gray-500 transition-colors"
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <div className="text-xs font-bold text-black">
                        Rs. {(item.price * item.quantity).toLocaleString()}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Drawer Footer */}
          {cart.length > 0 && (
            <div className="border-t border-gray-100 px-6 py-5 bg-white space-y-3">
              <div className="space-y-1.5 text-xs text-gray-600">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-semibold text-black">Rs. {subtotal.toLocaleString()}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-emerald-600 font-medium">
                    <span>Discount ({couponCode})</span>
                    <span>- Rs. {discount.toLocaleString()}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Islandwide Shipping</span>
                  <span className="font-semibold text-black">
                    {shippingFee === 0 ? "FREE" : `Rs. ${shippingFee.toLocaleString()}`}
                  </span>
                </div>
                <div className="border-t border-gray-100 pt-2 flex justify-between text-sm font-bold text-black">
                  <span>Estimated Total</span>
                  <span>Rs. {total.toLocaleString()}</span>
                </div>
              </div>

              <div className="pt-2 flex flex-col gap-2">
                <Link
                  href="/checkout"
                  onClick={() => setIsCartOpen(false)}
                  className="w-full bg-black text-white py-3 rounded-full text-xs font-bold uppercase tracking-wider text-center hover:bg-neutral-800 transition-colors flex items-center justify-center gap-2 shadow-sm"
                >
                  <span>PROCEED TO CHECKOUT</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <Link
                  href="/cart"
                  onClick={() => setIsCartOpen(false)}
                  className="w-full bg-gray-50 text-gray-800 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider text-center hover:bg-gray-100 transition-colors"
                >
                  VIEW FULL SHOPPING BAG
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
