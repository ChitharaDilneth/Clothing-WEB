"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ShieldCheck, Truck, CreditCard, Lock, ArrowLeft } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";

const SRI_LANKA_DISTRICTS = [
  "Colombo",
  "Gampaha",
  "Kalutara",
  "Kandy",
  "Matale",
  "Nuwara Eliya",
  "Galle",
  "Matara",
  "Hambantota",
  "Jaffna",
  "Kilinochchi",
  "Mannar",
  "Vavuniya",
  "Mullaitivu",
  "Batticaloa",
  "Ampara",
  "Trincomalee",
  "Kurunegala",
  "Puttalam",
  "Anuradhapura",
  "Polonnaruwa",
  "Badulla",
  "Monaragala",
  "Ratnapura",
  "Kegalle",
];

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, subtotal, shippingFee, discount, couponCode, total, clearCart } = useCart();
  const { user } = useAuth();

  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [phone, setPhone] = useState("+94 ");
  const [street, setStreet] = useState("");
  const [city, setCity] = useState("Colombo");
  const [district, setDistrict] = useState("Colombo");
  const [postalCode, setPostalCode] = useState("");
  const [deliveryInstructions, setDeliveryInstructions] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<"cod" | "card" | "koko" | "mintpay">("cod");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (cart.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center">
        <h2 className="text-xl font-black uppercase text-black">Your Cart is Empty</h2>
        <p className="text-xs text-neutral-500 mt-2">Add items to your cart before proceeding to checkout.</p>
        <Link
          href="/category/women"
          className="mt-6 inline-block bg-black text-white text-xs font-black uppercase tracking-wider py-3 px-6 rounded-full hover:bg-neutral-800"
        >
          Browse Products
        </Link>
      </div>
    );
  }

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim() || !phone.trim() || !street.trim() || !city.trim()) {
      toast.error("Please fill in all required delivery details.");
      return;
    }

    setIsSubmitting(true);
    try {
      const orderPayload = {
        customer: {
          userId: user?.userId,
          name: name.trim(),
          email: email.trim(),
          phone: phone.trim(),
        },
        shippingAddress: {
          street: street.trim(),
          city: city.trim(),
          district,
          postalCode: postalCode.trim(),
          deliveryInstructions: deliveryInstructions.trim(),
        },
        items: cart.map((i) => ({
          productId: i.productId,
          name: i.name,
          sku: i.sku,
          price: i.price,
          quantity: i.quantity,
          image: i.image,
          selectedColor: i.selectedColor,
          selectedSize: i.selectedSize,
          customization: i.customization,
        })),
        subtotal,
        discount,
        couponCode: couponCode || undefined,
        shippingFee,
        total,
        paymentMethod,
        paymentStatus: paymentMethod === "card" ? "paid" : "pending",
      };

      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderPayload),
      });

      const orderData = await res.json();
      if (res.ok && orderData.orderNumber) {
        clearCart();
        toast.success(`Order #${orderData.orderNumber} placed successfully!`);
        router.push(`/order-success/${orderData.orderNumber}`);
      } else {
        toast.error(orderData.message || "Failed to process order");
      }
    } catch {
      toast.error("Network error placing order. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <div className="mb-6">
        <Link
          href="/cart"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-neutral-500 hover:text-black mb-2"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Shopping Bag</span>
        </Link>
        <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-wider text-black">
          SECURE CHECKOUT
        </h1>
      </div>

      <form onSubmit={handleSubmitOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        {/* Customer & Shipping Info */}
        <div className="lg:col-span-7 space-y-6">
          {/* 1. Contact Information */}
          <div className="border border-neutral-200 rounded-2xl p-6 bg-white shadow-xs">
            <h2 className="text-xs font-black uppercase tracking-wider text-black mb-4">
              1. Contact Information
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="font-bold text-neutral-700 block mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Kasun Jayawardena"
                  className="w-full border border-neutral-300 rounded-lg p-2.5 focus:outline-hidden focus:border-black font-medium"
                />
              </div>

              <div>
                <label className="font-bold text-neutral-700 block mb-1">Phone Number (WhatsApp) *</label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+94 77 123 4567"
                  className="w-full border border-neutral-300 rounded-lg p-2.5 focus:outline-hidden focus:border-black font-medium"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="font-bold text-neutral-700 block mb-1">Email Address (For Tracking Receipt)</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. kasun@example.com"
                  className="w-full border border-neutral-300 rounded-lg p-2.5 focus:outline-hidden focus:border-black font-medium"
                />
              </div>
            </div>
          </div>

          {/* 2. Delivery Address in Sri Lanka */}
          <div className="border border-neutral-200 rounded-2xl p-6 bg-white shadow-xs">
            <h2 className="text-xs font-black uppercase tracking-wider text-black mb-4">
              2. Sri Lanka Delivery Address
            </h2>
            <div className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-neutral-700 block mb-1">Street Address / House No *</label>
                <input
                  type="text"
                  required
                  value={street}
                  onChange={(e) => setStreet(e.target.value)}
                  placeholder="e.g. 45 Havelock Road, Apt 3B"
                  className="w-full border border-neutral-300 rounded-lg p-2.5 focus:outline-hidden focus:border-black font-medium"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="font-bold text-neutral-700 block mb-1">City *</label>
                  <input
                    type="text"
                    required
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="e.g. Colombo 05"
                    className="w-full border border-neutral-300 rounded-lg p-2.5 focus:outline-hidden focus:border-black font-medium"
                  />
                </div>

                <div>
                  <label className="font-bold text-neutral-700 block mb-1">District *</label>
                  <select
                    value={district}
                    onChange={(e) => setDistrict(e.target.value)}
                    className="w-full border border-neutral-300 rounded-lg p-2.5 focus:outline-hidden focus:border-black font-medium bg-white cursor-pointer"
                  >
                    {SRI_LANKA_DISTRICTS.map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="font-bold text-neutral-700 block mb-1">Postal Code</label>
                  <input
                    type="text"
                    value={postalCode}
                    onChange={(e) => setPostalCode(e.target.value)}
                    placeholder="e.g. 00500"
                    className="w-full border border-neutral-300 rounded-lg p-2.5 focus:outline-hidden focus:border-black font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-neutral-700 block mb-1">Delivery Instructions (Optional)</label>
                <textarea
                  rows={2}
                  value={deliveryInstructions}
                  onChange={(e) => setDeliveryInstructions(e.target.value)}
                  placeholder="e.g. Near the landmark, call before arriving..."
                  className="w-full border border-neutral-300 rounded-lg p-2.5 focus:outline-hidden focus:border-black font-medium resize-none"
                />
              </div>
            </div>
          </div>

          {/* 3. Payment Method */}
          <div className="border border-neutral-200 rounded-2xl p-6 bg-white shadow-xs">
            <h2 className="text-xs font-black uppercase tracking-wider text-black mb-4">
              3. Payment Method
            </h2>

            <div className="space-y-3 text-xs">
              {/* Cash On Delivery */}
              <label
                className={`flex items-start gap-3 p-4 rounded-xl border cursor-pointer transition-all ${
                  paymentMethod === "cod"
                    ? "border-black bg-neutral-50 ring-1 ring-black"
                    : "border-neutral-200 hover:border-neutral-300"
                }`}
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  checked={paymentMethod === "cod"}
                  onChange={() => setPaymentMethod("cod")}
                  className="mt-0.5 accent-black"
                />
                <div className="flex-1">
                  <span className="font-black text-black uppercase tracking-wide block">
                    Cash On Delivery (Island Wide)
                  </span>
                  <span className="text-[11px] text-neutral-500">
                    Pay with cash directly to the courier upon doorstep receipt.
                  </span>
                </div>
                <Truck className="w-5 h-5 text-neutral-700 shrink-0" />
              </label>

              {/* Credit / Debit Card */}
              <label
                className={`flex items-start gap-3 p-4 rounded-xl border cursor-pointer transition-all ${
                  paymentMethod === "card"
                    ? "border-black bg-neutral-50 ring-1 ring-black"
                    : "border-neutral-200 hover:border-neutral-300"
                }`}
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  checked={paymentMethod === "card"}
                  onChange={() => setPaymentMethod("card")}
                  className="mt-0.5 accent-black"
                />
                <div className="flex-1">
                  <span className="font-black text-black uppercase tracking-wide block">
                    Online Card Payment (Visa / Mastercard)
                  </span>
                  <span className="text-[11px] text-neutral-500">
                    Encrypted 256-bit bank payment gateway with instant confirmation.
                  </span>
                </div>
                <CreditCard className="w-5 h-5 text-neutral-700 shrink-0" />
              </label>

              {/* KOKO Split Payments */}
              <label
                className={`flex items-start gap-3 p-4 rounded-xl border cursor-pointer transition-all ${
                  paymentMethod === "koko"
                    ? "border-black bg-neutral-50 ring-1 ring-black"
                    : "border-neutral-200 hover:border-neutral-300"
                }`}
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  checked={paymentMethod === "koko"}
                  onChange={() => setPaymentMethod("koko")}
                  className="mt-0.5 accent-black"
                />
                <div className="flex-1">
                  <span className="font-black text-[#e11d48] uppercase tracking-wide block">
                    KOKO — 3 Interest-Free Installments
                  </span>
                  <span className="text-[11px] text-neutral-500">
                    Pay 1/3rd today (Rs. {(total / 3).toFixed(2)}) and remaining over 60 days.
                  </span>
                </div>
              </label>

              {/* Mintpay Split */}
              <label
                className={`flex items-start gap-3 p-4 rounded-xl border cursor-pointer transition-all ${
                  paymentMethod === "mintpay"
                    ? "border-black bg-neutral-50 ring-1 ring-black"
                    : "border-neutral-200 hover:border-neutral-300"
                }`}
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  checked={paymentMethod === "mintpay"}
                  onChange={() => setPaymentMethod("mintpay")}
                  className="mt-0.5 accent-black"
                />
                <div className="flex-1">
                  <span className="font-black text-[#0284c7] uppercase tracking-wide block">
                    Mintpay — Buy Now Pay Later
                  </span>
                  <span className="text-[11px] text-neutral-500">
                    Split into 3 monthly installments with debit or credit card.
                  </span>
                </div>
              </label>
            </div>
          </div>
        </div>

        {/* Right Column: Order Summary Review */}
        <div className="lg:col-span-5 space-y-6">
          <div className="border border-neutral-200 rounded-2xl p-6 bg-neutral-50 shadow-xs space-y-4 text-xs">
            <h2 className="font-black uppercase tracking-wider text-black text-sm pb-2 border-b border-neutral-200">
              Order Review ({cart.length} {cart.length === 1 ? "Item" : "Items"})
            </h2>

            {/* Items list */}
            <div className="divide-y divide-neutral-200 max-h-60 overflow-y-auto pr-1">
              {cart.map((item) => (
                <div
                  key={`${item.productId}-${item.selectedColor}-${item.selectedSize}`}
                  className="py-3 flex items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-14 rounded-lg bg-neutral-200 relative overflow-hidden shrink-0">
                      <Image src={item.image} alt={item.name} fill className="object-cover" sizes="48px" />
                    </div>
                    <div>
                      <p className="font-bold text-black line-clamp-1">{item.name}</p>
                      <p className="text-[10px] text-neutral-500">
                        Qty: {item.quantity} {item.selectedSize && `• ${item.selectedSize}`}
                      </p>
                    </div>
                  </div>
                  <span className="font-black text-black">
                    Rs. {(item.price * item.quantity).toLocaleString()}
                  </span>
                </div>
              ))}
            </div>

            {/* Calculation */}
            <div className="border-t border-neutral-200 pt-3 space-y-1.5 text-neutral-600">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-bold text-black">Rs. {subtotal.toLocaleString()}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-emerald-600 font-semibold">
                  <span>Discount ({couponCode})</span>
                  <span>- Rs. {discount.toLocaleString()}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Shipping</span>
                <span className="font-bold text-black">
                  {shippingFee === 0 ? "FREE" : `Rs. ${shippingFee.toLocaleString()}`}
                </span>
              </div>
              <div className="border-t border-neutral-200 pt-2 flex justify-between text-sm font-black text-black">
                <span>Total Due</span>
                <span>Rs. {total.toLocaleString()}</span>
              </div>
            </div>

            {/* Place Order Button */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-black text-white py-4 px-6 rounded-full text-xs font-black uppercase tracking-wider text-center hover:bg-neutral-800 transition-colors shadow-sm disabled:opacity-50 flex items-center justify-center gap-2"
              >
                <Lock className="w-4 h-4" />
                <span>{isSubmitting ? "PROCESSING ORDER..." : `PLACE ORDER — RS. ${total.toLocaleString()}`}</span>
              </button>
            </div>

            <div className="text-[10px] text-neutral-500 text-center flex items-center justify-center gap-1.5 pt-2">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>100% Encrypted &amp; Secure Checkout</span>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
