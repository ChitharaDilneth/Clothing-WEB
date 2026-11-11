"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Sparkles, Upload, RotateCcw, ShoppingBag, Send, Check } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { toast } from "sonner";

interface BaseProduct {
  id: string;
  name: string;
  category: string;
  basePrice: number;
  image: string;
  availableColors: { name: string; hex: string }[];
  availableSizes: string[];
}

const BASE_PRODUCTS: BaseProduct[] = [
  {
    id: "waves-two-colour-mens-sandal",
    name: "Waves Two-Colour Coastal Sandal",
    category: "Men",
    basePrice: 3850,
    image: "https://images.unsplash.com/photo-1560769629-975ec94e6a86?auto=format&fit=crop&w=800&q=80",
    availableColors: [
      { name: "Navy / White", hex: "#1e3a8a" },
      { name: "Teal / Olive", hex: "#0d9488" },
      { name: "Sunset Orange", hex: "#f97316" },
      { name: "Coast Slate", hex: "#475569" },
    ],
    availableSizes: ["40", "41", "42", "43", "44"],
  },
  {
    id: "waves-black-mens-sandal",
    name: "Waves Black Coastal Sandal",
    category: "Men",
    basePrice: 3850,
    image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=800&q=80",
    availableColors: [
      { name: "All Black", hex: "#111827" },
      { name: "Matte Charcoal", hex: "#374151" },
    ],
    availableSizes: ["40", "41", "42", "43", "44", "45"],
  },
  {
    id: "waves-poncho-ash-flower",
    name: "Waves Coastal Beach Poncho",
    category: "Women",
    basePrice: 2950,
    image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=800&q=80",
    availableColors: [
      { name: "Ash Grey", hex: "#9ca3af" },
      { name: "Natural Ecru", hex: "#e7e5e4" },
      { name: "Ocean Slate", hex: "#475569" },
    ],
    availableSizes: ["Free Size"],
  },
  {
    id: "waves-adjustable-waist-bag",
    name: "Waves Waterproof Beach Bag",
    category: "Bags",
    basePrice: 3250,
    image: "https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=800&q=80",
    availableColors: [
      { name: "Sky Cyan", hex: "#38bdf8" },
      { name: "Neon Pink", hex: "#ec4899" },
      { name: "Sunset Orange", hex: "#f97316" },
    ],
    availableSizes: ["Standard"],
  },
];

export default function CustomizerPage() {
  const { addToCart } = useCart();

  const [selectedProduct, setSelectedProduct] = useState<BaseProduct>(BASE_PRODUCTS[0]);
  const [selectedColor, setSelectedColor] = useState<string>(BASE_PRODUCTS[0].availableColors[0].name);
  const [selectedSize, setSelectedSize] = useState<string>(BASE_PRODUCTS[0].availableSizes[0]);
  const [customText, setCustomText] = useState("CEYLON WAVES");
  const [textColor, setTextColor] = useState("#ffffff");
  const [textFont, setTextFont] = useState("font-sans font-black");
  const [artworkUrl, setArtworkUrl] = useState<string | null>(null);
  const [artworkScale, setArtworkScale] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Custom Order Inquiry Modal
  const [modalOpen, setModalOpen] = useState(false);
  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");

  const customizationFee = 500;
  const totalPrice = selectedProduct.basePrice + customizationFee;

  const handleProductChange = (prod: BaseProduct) => {
    setSelectedProduct(prod);
    setSelectedColor(prod.availableColors[0].name);
    setSelectedSize(prod.availableSizes[0]);
  };

  const handleArtworkUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      toast.loading("Uploading artwork...", { id: "art-upload" });
      const res = await fetch("/api/uploads", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (res.ok && data.url) {
        setArtworkUrl(data.url);
        toast.success("Custom artwork placed on preview!", { id: "art-upload" });
      } else {
        toast.error("Upload failed", { id: "art-upload" });
      }
    } catch {
      toast.error("Network error during artwork upload", { id: "art-upload" });
    }
  };

  const handleAddToCart = () => {
    addToCart({
      productId: selectedProduct.id,
      name: `Custom ${selectedProduct.name}`,
      slug: selectedProduct.id,
      sku: `CUST-${selectedProduct.id.slice(0, 6).toUpperCase()}`,
      price: totalPrice,
      image: selectedProduct.image,
      brand: "WAVES",
      selectedColor,
      selectedSize,
      customization: {
        baseProductId: selectedProduct.id,
        baseProductName: selectedProduct.name,
        color: selectedColor,
        size: selectedSize,
        customText,
        textColor,
        textFont,
        artworkUrl: artworkUrl || undefined,
        extraCost: customizationFee,
      },
      quantity: 1,
    });
  };

  const handleSubmitCustomOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName || !customerPhone) {
      toast.error("Please provide your name and phone number");
      return;
    }
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/custom-orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          baseProductId: selectedProduct.id,
          baseProductName: selectedProduct.name,
          color: selectedColor,
          size: selectedSize,
          customText,
          textColor,
          textFont,
          artworkUrl,
          customerName,
          customerEmail,
          customerPhone,
          price: totalPrice,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        toast.success(`Custom order #${data.orderNumber} submitted! We will contact you.`);
        setModalOpen(false);
      } else {
        toast.error(data.message || "Failed to submit custom request");
      }
    } catch {
      toast.error("Error submitting custom order");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Header */}
      <div className="mb-8">
        <div className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-600 bg-amber-50 px-3 py-1 rounded-full uppercase tracking-wider mb-2">
          <Sparkles className="w-3.5 h-3.5" />
          Make Your Own Waves
        </div>
        <h1 className="text-3xl sm:text-4xl font-black uppercase tracking-wider text-black">
          CUSTOM PRODUCT DESIGNER
        </h1>
        <p className="text-xs sm:text-sm text-neutral-600 mt-1 max-w-2xl leading-relaxed">
          Personalize your authentic coastal essentials. Select your base silhouette, choose vibrant hues, position artwork or initials, and order your bespoke Sri Lankan handcrafted piece.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        {/* Left Column: Live Visual Canvas Preview */}
        <div className="lg:col-span-7 space-y-4">
          <div className="relative aspect-4/3 sm:aspect-square bg-[#f4f4f4] rounded-3xl overflow-hidden p-8 flex items-center justify-center border border-neutral-200 shadow-xs">
            {/* Base Product Graphic */}
            <div className="relative w-full h-full flex items-center justify-center">
              <Image
                src={selectedProduct.image}
                alt={selectedProduct.name}
                fill
                priority
                className="object-contain drop-shadow-md"
                sizes="(max-width: 1024px) 100vw, 60vw"
              />

              {/* Overlaid Custom Artwork if uploaded */}
              {artworkUrl && (
                <div
                  className="absolute pointer-events-none transition-transform"
                  style={{ transform: `scale(${artworkScale})` }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={artworkUrl} alt="Custom Monogram" className="w-24 h-24 object-contain drop-shadow-md" />
                </div>
              )}

              {/* Overlaid Custom Text Monogram */}
              {customText && (
                <div className="absolute bottom-1/3 bg-black/60 backdrop-blur-xs px-3 py-1 rounded-md text-center shadow-lg border border-white/20">
                  <span
                    className={`text-xs uppercase tracking-widest drop-shadow ${textFont}`}
                    style={{ color: textColor }}
                  >
                    {customText}
                  </span>
                </div>
              )}
            </div>

            {/* Customizer Badge */}
            <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-xs text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border border-neutral-200">
              Live Custom Preview
            </div>
          </div>

          {/* Scale & Controls if artwork is uploaded */}
          {artworkUrl && (
            <div className="bg-neutral-50 p-4 rounded-xl border border-neutral-200 flex items-center justify-between text-xs font-bold">
              <span>Artwork Scale</span>
              <input
                type="range"
                min="0.5"
                max="2"
                step="0.1"
                value={artworkScale}
                onChange={(e) => setArtworkScale(Number(e.target.value))}
                className="accent-black w-1/2 cursor-pointer"
              />
              <button
                onClick={() => setArtworkUrl(null)}
                className="text-red-500 hover:underline text-[11px]"
              >
                Remove
              </button>
            </div>
          )}
        </div>

        {/* Right Column: Customization Controls */}
        <div className="lg:col-span-5 space-y-6">
          {/* 1. Base Product Picker */}
          <div className="border border-neutral-200 rounded-2xl p-5 bg-white shadow-xs">
            <h3 className="text-xs font-black uppercase tracking-wider text-black mb-3">
              1. Select Base Product
            </h3>
            <div className="grid grid-cols-2 gap-3">
              {BASE_PRODUCTS.map((prod) => (
                <button
                  key={prod.id}
                  onClick={() => handleProductChange(prod)}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    selectedProduct.id === prod.id
                      ? "border-black bg-neutral-50 shadow-xs ring-1 ring-black"
                      : "border-neutral-200 hover:border-neutral-400"
                  }`}
                >
                  <span className="text-[10px] text-neutral-400 uppercase font-bold block">{prod.category}</span>
                  <span className="text-xs font-bold text-black block truncate">{prod.name}</span>
                  <span className="text-xs font-black text-neutral-800 mt-1 block">
                    Rs. {prod.basePrice.toLocaleString()}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* 2. Color & Size Picker */}
          <div className="border border-neutral-200 rounded-2xl p-5 bg-white shadow-xs space-y-4">
            <h3 className="text-xs font-black uppercase tracking-wider text-black">
              2. Color &amp; Size
            </h3>

            {/* Colors */}
            <div>
              <label className="text-[11px] font-bold uppercase tracking-wider text-neutral-600 block mb-2">
                Color: <strong className="text-black">{selectedColor}</strong>
              </label>
              <div className="flex items-center gap-2">
                {selectedProduct.availableColors.map((c) => (
                  <button
                    key={c.name}
                    onClick={() => setSelectedColor(c.name)}
                    className={`w-7 h-7 rounded-full border-2 transition-all p-0.5 ${
                      selectedColor === c.name ? "border-black scale-110" : "border-transparent"
                    }`}
                  >
                    <span className="w-full h-full rounded-full block" style={{ backgroundColor: c.hex }} />
                  </button>
                ))}
              </div>
            </div>

            {/* Sizes */}
            <div>
              <label className="text-[11px] font-bold uppercase tracking-wider text-neutral-600 block mb-2">
                Size: <strong className="text-black">{selectedSize}</strong>
              </label>
              <div className="flex flex-wrap gap-2">
                {selectedProduct.availableSizes.map((s) => (
                  <button
                    key={s}
                    onClick={() => setSelectedSize(s)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      selectedSize === s
                        ? "bg-black text-white"
                        : "bg-neutral-100 text-neutral-700 hover:bg-neutral-200"
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* 3. Text Monogram & Artwork Upload */}
          <div className="border border-neutral-200 rounded-2xl p-5 bg-white shadow-xs space-y-4">
            <h3 className="text-xs font-black uppercase tracking-wider text-black">
              3. Text &amp; Artwork
            </h3>

            {/* Custom Text */}
            <div>
              <label className="text-[11px] font-bold uppercase tracking-wider text-neutral-600 block mb-1">
                Monogram or Custom Text
              </label>
              <input
                type="text"
                maxLength={20}
                value={customText}
                onChange={(e) => setCustomText(e.target.value.toUpperCase())}
                placeholder="E.G. CEYLON WAVES"
                className="w-full border border-neutral-300 rounded-lg p-2 text-xs uppercase font-bold focus:outline-hidden focus:border-black"
              />
            </div>

            {/* Text Color */}
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-neutral-700">Text Color</span>
              <div className="flex gap-1.5">
                {["#ffffff", "#000000", "#f59e0b", "#06b6d4", "#ec4899"].map((hex) => (
                  <button
                    key={hex}
                    onClick={() => setTextColor(hex)}
                    className={`w-6 h-6 rounded-full border ${textColor === hex ? "ring-2 ring-black" : ""}`}
                    style={{ backgroundColor: hex }}
                  />
                ))}
              </div>
            </div>

            {/* Upload File */}
            <div className="pt-2">
              <label className="border-2 border-dashed border-neutral-300 rounded-xl p-4 flex flex-col items-center justify-center text-center cursor-pointer hover:border-black transition-colors bg-neutral-50/50">
                <Upload className="w-5 h-5 text-neutral-400 mb-1" />
                <span className="text-xs font-bold text-black uppercase">Upload Artwork or Logo</span>
                <span className="text-[10px] text-neutral-500 mt-0.5">PNG, JPG or SVG (Max 8MB)</span>
                <input type="file" accept="image/*" onChange={handleArtworkUpload} className="hidden" />
              </label>
            </div>
          </div>

          {/* Pricing & Add to Cart / Order Inquiry */}
          <div className="border border-neutral-200 rounded-2xl p-5 bg-neutral-50 space-y-3">
            <div className="flex justify-between text-xs text-neutral-600">
              <span>Base Product Price</span>
              <span className="font-semibold text-black">Rs. {selectedProduct.basePrice.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-xs text-neutral-600">
              <span>Handcrafted Customization Fee</span>
              <span className="font-semibold text-black">Rs. {customizationFee.toLocaleString()}</span>
            </div>
            <div className="border-t border-neutral-200 pt-2 flex justify-between text-sm font-black text-black">
              <span>Total Customized Price</span>
              <span>Rs. {totalPrice.toLocaleString()}</span>
            </div>

            <div className="pt-3 space-y-2">
              <button
                onClick={handleAddToCart}
                className="w-full bg-black text-white py-3.5 px-6 rounded-full text-xs font-black uppercase tracking-wider hover:bg-neutral-800 transition-colors shadow-sm flex items-center justify-center gap-2"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>ADD CUSTOMIZED PIECE TO CART</span>
              </button>

              <button
                onClick={() => setModalOpen(true)}
                className="w-full border border-neutral-300 bg-white text-black py-2.5 px-6 rounded-full text-xs font-extrabold uppercase tracking-wider hover:border-black transition-colors"
              >
                SUBMIT CUSTOM ORDER INQUIRY
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Custom Order Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl relative">
            <h3 className="text-lg font-black uppercase tracking-wider text-black">
              Custom Waves Order Request
            </h3>
            <p className="text-xs text-neutral-500 mt-1">
              Our master artisan will review your design specifications and confirm delivery timelines.
            </p>

            <form onSubmit={handleSubmitCustomOrder} className="mt-5 space-y-3 text-xs">
              <div>
                <label className="font-bold text-neutral-700 block mb-1">Your Full Name *</label>
                <input
                  type="text"
                  required
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="e.g. Ruwan Silva"
                  className="w-full border border-neutral-300 rounded-lg p-2.5 focus:outline-hidden focus:border-black"
                />
              </div>

              <div>
                <label className="font-bold text-neutral-700 block mb-1">WhatsApp / Phone Number *</label>
                <input
                  type="tel"
                  required
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  placeholder="e.g. +94 77 123 4567"
                  className="w-full border border-neutral-300 rounded-lg p-2.5 focus:outline-hidden focus:border-black"
                />
              </div>

              <div>
                <label className="font-bold text-neutral-700 block mb-1">Email Address</label>
                <input
                  type="email"
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  placeholder="e.g. ruwan@example.com"
                  className="w-full border border-neutral-300 rounded-lg p-2.5 focus:outline-hidden focus:border-black"
                />
              </div>

              <div className="p-3 bg-neutral-50 rounded-xl text-neutral-600 text-[11px] space-y-1">
                <p>
                  <strong>Product:</strong> {selectedProduct.name} ({selectedColor}, {selectedSize})
                </p>
                {customText && (
                  <p>
                    <strong>Monogram:</strong> &ldquo;{customText}&rdquo;
                  </p>
                )}
                <p>
                  <strong>Estimated Total:</strong> Rs. {totalPrice.toLocaleString()} (Cash On Delivery Available)
                </p>
              </div>

              <div className="pt-3 flex gap-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="flex-1 py-2.5 rounded-full border border-neutral-300 text-neutral-700 font-bold uppercase tracking-wider hover:bg-neutral-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 py-2.5 rounded-full bg-black text-white font-black uppercase tracking-wider hover:bg-neutral-800 disabled:opacity-50"
                >
                  {isSubmitting ? "Submitting..." : "Confirm Request"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
