"use client";

import React, { useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Sparkles,
  CheckCircle2,
  Shield,
  UploadCloud,
  ArrowRight,
  ZoomIn,
  Columns2,
  Download,
  Share2,
  Heart,
  ShoppingCart,
  Shirt,
  Zap,
  Lock,
  X,
  RotateCcw,
  Camera,
  Layers,
  MessageCircle,
  Check,
} from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { toast } from "sonner";

// Preset products to try on (Primary is Floral Puff Sleeve Dress as in reference screenshot)
interface TryOnProduct {
  _id: string;
  name: string;
  slug: string;
  sku: string;
  price: number;
  currency: string;
  brand: string;
  thumbnails: string[];
  colors: { name: string; hex: string }[];
  sizes: string[];
}

const PRODUCTS: TryOnProduct[] = [
  {
    _id: "prod_floral_dress",
    name: "Floral Puff Sleeve Dress",
    slug: "floral-puff-sleeve-dress",
    sku: "TBH-DRS-041",
    price: 6990,
    currency: "LKR",
    brand: "TBH APPAREL",
    thumbnails: [
      "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?auto=format&fit=crop&w=800&q=80",
    ],
    colors: [
      { name: "Lilac Lavender", hex: "#b497e8" },
      { name: "Blush Pink", hex: "#f4b6c2" },
      { name: "Crisp White", hex: "#f8f9fa" },
    ],
    sizes: ["S", "M", "L", "XL", "XXL"],
  },
  {
    _id: "prod_waves_poncho",
    name: "Waves Poncho Ash – Flower",
    slug: "waves-poncho-ash-flower",
    sku: "H070002051",
    price: 2950,
    currency: "LKR",
    brand: "WAVES",
    thumbnails: [
      "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&w=900&q=80",
    ],
    colors: [
      { name: "Floral Ash", hex: "#9ca3af" },
      { name: "Sandstone", hex: "#d6c7b2" },
      { name: "Ocean Slate", hex: "#475569" },
    ],
    sizes: ["Free Size", "S", "M", "L"],
  },
];

// Preset model poses (Before = ungarmented / neutral pose, After = AI draped result)
const PRESET_MODELS = [
  {
    id: "model-1",
    name: "Model 1",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80",
    beforeImage: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=900&q=80",
    afterImage: "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: "model-2",
    name: "Model 2",
    avatar: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=300&q=80",
    beforeImage: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=900&q=80",
    afterImage: "https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: "model-3",
    name: "Model 3",
    avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=300&q=80",
    beforeImage: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=900&q=80",
    afterImage: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=900&q=80",
  },
];

const COMMUNITY_STORIES = [
  {
    name: "Ananya K.",
    location: "Colombo 07",
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=500&q=80",
    quote: "The virtual drape matched the actual dress fit completely! Loved the fabric breathability in tropical heat.",
    item: "WORE: FLORAL PUFF SLEEVE DRESS (M)",
    match: "Match: 99%",
  },
  {
    name: "Dilini S.",
    location: "Kandy",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=500&q=80",
    quote: "Saved me from guessing sizes or having to return clothes via courier. The AI recommendations are spot on.",
    item: "WORE: WAVES FREE SIZE PONCHO",
    match: "Match: 97%",
  },
  {
    name: "Shanali R.",
    location: "Negombo",
    image: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=500&q=80",
    quote: "Tried out the puff sleeve preview and ordered size S. Delivery to Negombo was super quick.",
    item: "WORE: FLORAL PUFF SLEEVE DRESS (S)",
    match: "Match: 98%",
  },
  {
    name: "Ravindu R.",
    location: "Galle",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=500&q=80",
    quote: "AI sizing calibrated accurately for broad shoulders. Perfect beach lifestyle fit.",
    item: "WORE: BREAKWATER OVERSIZED TEE (L)",
    match: "Match: 96%",
  },
];

export default function VirtualTryOnPage() {
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Active product & selection states
  const [activeProductIndex, setActiveProductIndex] = useState(0);
  const currentProduct = PRODUCTS[activeProductIndex];
  const [selectedThumbnailIndex, setSelectedThumbnailIndex] = useState(0);
  const [selectedColor, setSelectedColor] = useState(currentProduct.colors[0].name);
  const [selectedSize, setSelectedSize] = useState(currentProduct.sizes[1] || currentProduct.sizes[0]);

  // Model & Try-On states
  const [selectedModelId, setSelectedModelId] = useState(PRESET_MODELS[0].id);
  const [customPhoto, setCustomPhoto] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"before" | "after">("after");
  const [isGenerating, setIsGenerating] = useState(false);
  const [stepCompleted, setStepCompleted] = useState<number>(2); // 1 = product, 2 = photo, 3 = result ready

  // Modals
  const [isZoomOpen, setIsZoomOpen] = useState(false);
  const [isCompareOpen, setIsCompareOpen] = useState(false);

  // Active model definition
  const currentPresetModel = PRESET_MODELS.find((m) => m.id === selectedModelId) || PRESET_MODELS[0];
  const activeBeforeImage = customPhoto || currentPresetModel.beforeImage;
  const activeAfterImage = customPhoto ? customPhoto : currentPresetModel.afterImage;

  // Handle custom photo upload
  const handleCustomPhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setCustomPhoto(reader.result as string);
        setSelectedModelId("custom");
        setViewMode("before");
        toast.success("Photo uploaded! Click 'Try It On Virtually' to drape the garment.");
      };
      reader.readAsDataURL(file);
    }
  };

  // Trigger AI Virtual Try-On action
  const handleTryOnVirtually = () => {
    setIsGenerating(true);
    toast.info("TBH NeuralFit Engine simulating drape & tension points...");

    setTimeout(() => {
      setIsGenerating(false);
      setViewMode("after");
      setStepCompleted(3);
      toast.success("Virtual Try-On generated successfully!");
    }, 1200);
  };

  // Add to cart with AI recommended tag
  const handleAddToCart = () => {
    addToCart({
      productId: currentProduct._id,
      name: currentProduct.name,
      slug: currentProduct.slug,
      sku: currentProduct.sku,
      price: currentProduct.price,
      image: currentProduct.thumbnails[0],
      brand: currentProduct.brand,
      selectedColor,
      selectedSize: `${selectedSize} (AI Fitted)`,
      quantity: 1,
    });
  };

  // Download try-on image
  const handleDownload = () => {
    const imageUrl = viewMode === "after" ? activeAfterImage : activeBeforeImage;
    const link = document.createElement("a");
    link.href = imageUrl;
    link.download = `tbh-virtual-tryon-${currentProduct.slug}.jpg`;
    link.target = "_blank";
    link.rel = "noreferrer";
    link.click();
    toast.success("Try-On preview saved to device!");
  };

  // Share try-on result
  const handleShare = () => {
    if (navigator.share) {
      navigator
        .share({
          title: `TBH AI Virtual Try-On - ${currentProduct.name}`,
          text: `Check out how the ${currentProduct.name} looks on me using TBH NeuralFit!`,
          url: window.location.href,
        })
        .catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success("Link copied to clipboard!");
    }
  };

  const isLiked = isInWishlist(currentProduct._id);

  return (
    <div className="min-h-screen bg-[#fcfcfd] text-neutral-900 pb-16">
      {/* Top Header / Breadcrumbs Bar */}
      <div className="border-b border-neutral-200/80 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            {/* Breadcrumb */}
            <nav className="text-[11px] font-bold uppercase tracking-wider text-neutral-500 flex items-center gap-2">
              <Link href="/" className="hover:text-black transition-colors">
                HOME
              </Link>
              <span>/</span>
              <span className="text-black font-extrabold">AI FIT-ON & STYLIST STUDIO</span>
            </nav>

            {/* Badges matching TBH Theme */}
            <div className="flex items-center gap-2.5 text-[11px] font-extrabold uppercase tracking-wider shrink-0">
              <span className="bg-neutral-100 text-neutral-900 px-3 py-1 rounded-full border border-neutral-200 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                98.4% FIT ACCURACY
              </span>
              <span className="bg-neutral-100 text-neutral-900 px-3 py-1 rounded-full border border-neutral-200 flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5 text-black" />
                ISLAND WIDE COD READY
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-10">
        {/* 3-Card Grid Matching Reference Image Design */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          
          {/* ======================================================== */}
          {/* COLUMN 1 (LEFT): Product Card                            */}
          {/* ======================================================== */}
          <div className="lg:col-span-3 bg-white border border-neutral-200/90 rounded-3xl p-5 shadow-xs flex flex-col justify-between">
            <div>
              {/* Product Visual Area: Vertical Thumbnails + Main View */}
              <div className="flex gap-3">
                {/* Vertical Thumbnails Column */}
                <div className="flex flex-col gap-2 shrink-0">
                  {currentProduct.thumbnails.map((thumb, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedThumbnailIndex(index)}
                      className={`relative w-12 h-14 rounded-xl overflow-hidden border-2 transition-all cursor-pointer ${
                        selectedThumbnailIndex === index
                          ? "border-black ring-2 ring-black/10 scale-102"
                          : "border-neutral-200 hover:border-neutral-400 opacity-75 hover:opacity-100"
                      }`}
                      aria-label={`Select product image view ${index + 1}`}
                    >
                      <Image
                        src={thumb}
                        alt={`${currentProduct.name} view ${index + 1}`}
                        fill
                        className="object-cover"
                        sizes="48px"
                      />
                    </button>
                  ))}
                </div>

                {/* Main Product Showcase Image */}
                <div className="relative flex-1 aspect-3/4 rounded-2xl overflow-hidden bg-neutral-100 border border-neutral-200/80">
                  <Image
                    src={currentProduct.thumbnails[selectedThumbnailIndex]}
                    alt={currentProduct.name}
                    fill
                    priority
                    className="object-cover transition-transform duration-300 hover:scale-105"
                    sizes="(max-width: 1024px) 70vw, 25vw"
                  />
                  {/* Subtle Badge */}
                  <span className="absolute top-2.5 right-2.5 bg-black/75 backdrop-blur-xs text-white text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full">
                    {currentProduct.brand}
                  </span>
                </div>
              </div>

              {/* Product Info */}
              <div className="mt-5 space-y-4">
                <div>
                  <h2 className="text-base font-extrabold text-neutral-900 leading-snug">
                    {currentProduct.name}
                  </h2>
                  <p className="text-sm font-black text-neutral-900 mt-1">
                    {currentProduct.currency} {currentProduct.price.toLocaleString()}
                  </p>
                </div>

                {/* Color Swatches */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-neutral-700">Color:</span>
                    <span className="text-[11px] font-medium text-neutral-500">{selectedColor}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {currentProduct.colors.map((color) => (
                      <button
                        key={color.name}
                        onClick={() => setSelectedColor(color.name)}
                        className={`w-7 h-7 rounded-full border-2 transition-all p-0.5 ${
                          selectedColor === color.name
                            ? "border-black scale-110 ring-2 ring-black/15"
                            : "border-neutral-300 hover:border-neutral-500"
                        }`}
                        title={color.name}
                        aria-label={`Select color ${color.name}`}
                      >
                        <span
                          className="w-full h-full rounded-full block border border-black/10"
                          style={{ backgroundColor: color.hex }}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Size Chips */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-neutral-700">Size:</span>
                    <span className="text-[11px] font-medium text-neutral-500">{selectedSize}</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {currentProduct.sizes.map((size) => (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={`px-3 py-1.5 text-xs font-bold rounded-lg border transition-all ${
                          selectedSize === size
                            ? "bg-black text-white border-black shadow-xs"
                            : "bg-white text-neutral-700 border-neutral-200 hover:border-neutral-400"
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Product Action Buttons */}
            <div className="pt-6 space-y-2.5">
              {/* Primary Try-On Button */}
              <button
                onClick={handleTryOnVirtually}
                disabled={isGenerating}
                className="w-full bg-black text-white hover:bg-neutral-800 disabled:opacity-60 py-3.5 px-4 rounded-xl text-xs font-black uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-xs group cursor-pointer"
              >
                <Shirt className="w-4 h-4 text-white group-hover:scale-110 transition-transform" />
                <span>Try It On Virtually</span>
                <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
              </button>

              {/* Add to Cart & Wishlist Row */}
              <div className="flex items-center gap-2">
                <button
                  onClick={handleAddToCart}
                  className="flex-1 bg-neutral-100 hover:bg-neutral-200 text-neutral-900 border border-neutral-200/90 py-2.5 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <ShoppingCart className="w-3.5 h-3.5" />
                  <span>Add to Cart</span>
                </button>

                <button
                  onClick={() => toggleWishlist(currentProduct as any)}
                  className={`w-10 h-10 rounded-xl border flex items-center justify-center transition-all cursor-pointer ${
                    isLiked
                      ? "bg-red-50 border-red-200 text-red-500"
                      : "bg-white border-neutral-200 hover:border-neutral-400 text-neutral-700 hover:text-black"
                  }`}
                  aria-label="Save to Wishlist"
                  title="Save to Wishlist"
                >
                  <Heart className={`w-4 h-4 ${isLiked ? "fill-red-500" : ""}`} />
                </button>
              </div>

              {/* Alternate Item Switcher Pill (Quick preview switch) */}
              <div className="pt-1 flex items-center justify-between text-[10px] text-neutral-400 font-bold uppercase tracking-wider">
                <span>Switch Garment:</span>
                <button
                  onClick={() => {
                    const next = (activeProductIndex + 1) % PRODUCTS.length;
                    setActiveProductIndex(next);
                    setSelectedThumbnailIndex(0);
                    setSelectedColor(PRODUCTS[next].colors[0].name);
                    setSelectedSize(PRODUCTS[next].sizes[0]);
                  }}
                  className="text-neutral-900 hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <span>{PRODUCTS[(activeProductIndex + 1) % PRODUCTS.length].name}</span>
                  <ArrowRight className="w-2.5 h-2.5" />
                </button>
              </div>
            </div>
          </div>

          {/* ======================================================== */}
          {/* COLUMN 2 (CENTER): Main Virtual Try-On Studio Workspace  */}
          {/* ======================================================== */}
          <div className="lg:col-span-6 bg-white border border-neutral-200/90 rounded-3xl p-6 sm:p-7 shadow-xs flex flex-col justify-between">
            {/* Header + Subtitle */}
            <div>
              <div className="flex items-start justify-between gap-4 pb-4 border-b border-neutral-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-neutral-900 text-white flex items-center justify-center shadow-xs">
                    <Camera className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h1 className="text-lg font-black text-neutral-950 tracking-tight">
                      Virtual Try-On
                    </h1>
                    <p className="text-xs text-neutral-500 font-medium">
                      See how it looks on you with AI
                    </p>
                  </div>
                </div>

                <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-extrabold uppercase tracking-wider bg-amber-500/10 text-amber-700 border border-amber-500/20 px-2.5 py-1 rounded-full">
                  <Sparkles className="w-3 h-3 text-amber-500" />
                  TBH NeuralFit™ V2.4
                </span>
              </div>

              {/* 3-Step Stepper Bar */}
              <div className="py-4 flex items-center justify-between max-w-md mx-auto text-xs font-semibold text-neutral-600">
                {/* Step 1 */}
                <div className="flex items-center gap-1.5 text-neutral-900 font-bold">
                  <div className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[10px] font-black">
                    <Check className="w-3 h-3 stroke-[3]" />
                  </div>
                  <span className="text-[11px] sm:text-xs">Select Product</span>
                </div>

                <div className="h-0.5 flex-1 mx-3 bg-neutral-200" />

                {/* Step 2 */}
                <div className="flex items-center gap-1.5 text-neutral-900 font-bold">
                  <div className="w-5 h-5 rounded-full bg-black text-white flex items-center justify-center text-[10px] font-black">
                    2
                  </div>
                  <span className="text-[11px] sm:text-xs">Upload Photo</span>
                </div>

                <div className="h-0.5 flex-1 mx-3 bg-neutral-200" />

                {/* Step 3 */}
                <div
                  className={`flex items-center gap-1.5 font-bold transition-colors ${
                    stepCompleted >= 3 ? "text-neutral-900" : "text-neutral-400"
                  }`}
                >
                  <div
                    className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black ${
                      stepCompleted >= 3
                        ? "bg-emerald-600 text-white"
                        : "bg-neutral-200 text-neutral-600"
                    }`}
                  >
                    {stepCompleted >= 3 ? <Check className="w-3 h-3 stroke-[3]" /> : "3"}
                  </div>
                  <span className="text-[11px] sm:text-xs">See Result</span>
                </div>
              </div>

              {/* Interactive Try-On Arena: Upload Box -> Arrow -> Result Image + Toolbar */}
              <div className="mt-2 grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                
                {/* Left Upload / Model Selection Box */}
                <div className="md:col-span-5 flex flex-col gap-3">
                  {/* Dashed Upload Card */}
                  <div className="border-2 border-dashed border-neutral-300 hover:border-black rounded-2xl p-5 text-center bg-neutral-50/60 hover:bg-neutral-50 transition-all flex flex-col items-center justify-center min-h-[190px] relative group">
                    <div className="w-12 h-12 rounded-full bg-white shadow-xs border border-neutral-200 flex items-center justify-center text-neutral-900 mb-2.5 group-hover:scale-105 transition-transform">
                      <UploadCloud className="w-6 h-6 stroke-[1.8]" />
                    </div>

                    <h3 className="text-xs font-black text-neutral-900">Upload Your Photo</h3>
                    <p className="text-[11px] text-neutral-500 mt-0.5 mb-3">
                      Use a clear, full-body photo
                    </p>

                    <label className="cursor-pointer bg-black text-white hover:bg-neutral-800 text-[11px] font-extrabold uppercase tracking-wider py-2 px-4 rounded-xl shadow-xs transition-colors inline-flex items-center gap-1.5">
                      <Shirt className="w-3 h-3" />
                      <span>Choose Photo</span>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleCustomPhotoUpload}
                        className="hidden"
                      />
                    </label>

                    {customPhoto && (
                      <span className="mt-2 text-[10px] text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                        Custom photo active ✓
                      </span>
                    )}
                  </div>

                  {/* Preset Model Avatars Row (with green checkmark on active) */}
                  <div className="flex items-center justify-between gap-2 pt-1">
                    {PRESET_MODELS.map((model) => {
                      const isSelected = selectedModelId === model.id && !customPhoto;
                      return (
                        <button
                          key={model.id}
                          onClick={() => {
                            setSelectedModelId(model.id);
                            setCustomPhoto(null);
                            setViewMode("after");
                          }}
                          className={`relative flex-1 aspect-3/4 rounded-xl overflow-hidden border-2 transition-all cursor-pointer ${
                            isSelected
                              ? "border-black ring-2 ring-black/15 scale-102"
                              : "border-neutral-200 hover:border-neutral-400 opacity-80 hover:opacity-100"
                          }`}
                          aria-label={`Select ${model.name}`}
                        >
                          <Image
                            src={model.avatar}
                            alt={model.name}
                            fill
                            className="object-cover"
                            sizes="80px"
                          />
                          {/* Green checkmark circle on selected model */}
                          {isSelected && (
                            <div className="absolute bottom-1 right-1 w-4 h-4 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-xs">
                              <Check className="w-2.5 h-2.5 stroke-[3]" />
                            </div>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Middle Arrow Divider */}
                <div className="md:col-span-1 hidden md:flex items-center justify-center text-neutral-400">
                  <div className="w-7 h-7 rounded-full bg-neutral-100 border border-neutral-200 flex items-center justify-center text-neutral-600">
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </div>

                {/* Right Try-On Result Viewport with Toolbar */}
                <div className="md:col-span-6 flex gap-2.5 items-center">
                  {/* Viewport Frame */}
                  <div className="relative flex-1 aspect-3/4 rounded-2xl overflow-hidden bg-neutral-900 border border-neutral-200/90 shadow-sm">
                    {/* Model Image (Before or After) */}
                    <Image
                      src={viewMode === "after" ? activeAfterImage : activeBeforeImage}
                      alt="Virtual Try-On Result Preview"
                      fill
                      priority
                      className={`object-cover transition-opacity duration-300 ${
                        isGenerating ? "opacity-30 blur-xs" : "opacity-100"
                      }`}
                      sizes="(max-width: 1024px) 100vw, 35vw"
                    />

                    {/* AI Scan Animation Overlay during generation */}
                    {isGenerating && (
                      <div className="absolute inset-0 flex flex-col items-center justify-center p-4 z-20">
                        <div className="w-full h-1 bg-gradient-to-r from-transparent via-amber-400 to-transparent absolute top-0 animate-[scan_1.2s_ease-in-out_infinite]" />
                        <div className="bg-black/85 backdrop-blur-md rounded-2xl p-4 border border-white/20 text-center text-white">
                          <Sparkles className="w-6 h-6 text-amber-400 mx-auto animate-spin" />
                          <p className="text-xs font-bold mt-2">Draping Garment with AI...</p>
                          <p className="text-[10px] text-neutral-400 mt-0.5">Calibrating anatomical fit</p>
                        </div>
                      </div>
                    )}

                    {/* AI Try-On Result Badge at top right */}
                    <div className="absolute top-3 right-3 z-10">
                      <span className="bg-neutral-950/80 backdrop-blur-md text-white text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full border border-white/20 flex items-center gap-1 shadow-md">
                        <span>AI Try-On Result</span>
                        <Sparkles className="w-3 h-3 text-amber-400" />
                      </span>
                    </div>

                    {/* Bottom Pill: Before | After Toggle */}
                    <div className="absolute bottom-3 inset-x-0 flex justify-center z-10">
                      <div className="bg-white/95 backdrop-blur-md p-1 rounded-full shadow-lg border border-neutral-200/80 flex items-center">
                        <button
                          onClick={() => setViewMode("before")}
                          className={`px-3 py-1 text-xs font-bold rounded-full transition-all cursor-pointer ${
                            viewMode === "before"
                              ? "bg-black text-white shadow-xs"
                              : "text-neutral-600 hover:text-black"
                          }`}
                        >
                          Before
                        </button>
                        <button
                          onClick={() => setViewMode("after")}
                          className={`px-3 py-1 text-xs font-bold rounded-full transition-all cursor-pointer ${
                            viewMode === "after"
                              ? "bg-black text-white shadow-xs"
                              : "text-neutral-600 hover:text-black"
                          }`}
                        >
                          After
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Vertical Action Toolbar: Zoom, Compare, Download, Share */}
                  <div className="flex flex-col gap-2 shrink-0 py-1">
                    <button
                      onClick={() => setIsZoomOpen(true)}
                      className="flex flex-col items-center gap-0.5 p-2 rounded-xl text-neutral-700 hover:text-black hover:bg-neutral-100 border border-neutral-200/80 bg-white transition-all shadow-xs cursor-pointer"
                      title="Zoom full image"
                    >
                      <ZoomIn className="w-4 h-4" />
                      <span className="text-[9px] font-bold">Zoom</span>
                    </button>

                    <button
                      onClick={() => setIsCompareOpen(true)}
                      className="flex flex-col items-center gap-0.5 p-2 rounded-xl text-neutral-700 hover:text-black hover:bg-neutral-100 border border-neutral-200/80 bg-white transition-all shadow-xs cursor-pointer"
                      title="Compare Before & After"
                    >
                      <Columns2 className="w-4 h-4" />
                      <span className="text-[9px] font-bold">Compare</span>
                    </button>

                    <button
                      onClick={handleDownload}
                      className="flex flex-col items-center gap-0.5 p-2 rounded-xl text-neutral-700 hover:text-black hover:bg-neutral-100 border border-neutral-200/80 bg-white transition-all shadow-xs cursor-pointer"
                      title="Download Try-On photo"
                    >
                      <Download className="w-4 h-4" />
                      <span className="text-[9px] font-bold">Download</span>
                    </button>

                    <button
                      onClick={handleShare}
                      className="flex flex-col items-center gap-0.5 p-2 rounded-xl text-neutral-700 hover:text-black hover:bg-neutral-100 border border-neutral-200/80 bg-white transition-all shadow-xs cursor-pointer"
                      title="Share Try-On"
                    >
                      <Share2 className="w-4 h-4" />
                      <span className="text-[9px] font-bold">Share</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Tip / Guarantee Bar */}
            <div className="mt-4 pt-3 border-t border-neutral-100 flex items-center justify-between text-[11px] text-neutral-500">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                Drape calibrated to Sri Lankan silhouette dimensions
              </span>
              <button
                onClick={() => {
                  setCustomPhoto(null);
                  setSelectedModelId(PRESET_MODELS[0].id);
                  setViewMode("after");
                  toast.info("Reset to default model view");
                }}
                className="text-neutral-500 hover:text-black font-bold uppercase tracking-wider flex items-center gap-1 cursor-pointer"
              >
                <RotateCcw className="w-3 h-3" />
                Reset
              </button>
            </div>
          </div>

          {/* ======================================================== */}
          {/* COLUMN 3 (RIGHT): Features & Value Props Card            */}
          {/* ======================================================== */}
          <div className="lg:col-span-3 bg-white border border-neutral-200/90 rounded-3xl p-6 shadow-xs flex flex-col justify-between relative overflow-hidden">
            {/* Top AI Badge & Heading */}
            <div className="space-y-4">
              <div className="w-10 h-10 rounded-2xl bg-neutral-100 text-neutral-900 border border-neutral-200 flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-amber-500" />
              </div>

              <div>
                <h2 className="text-lg font-black text-neutral-950 tracking-tight leading-tight">
                  AI-Powered Virtual Try-On
                </h2>
                <p className="text-xs text-neutral-500 font-medium mt-1 leading-relaxed">
                  Try on clothes online before you buy using TBH NeuralFit™ &amp; AI VTON.
                </p>
              </div>

              {/* 3 Feature Boxes */}
              <div className="space-y-2.5 pt-2">
                {/* Feature 1: Realistic Fit */}
                <div className="p-3 rounded-2xl bg-neutral-50/70 border border-neutral-200/70 flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-white border border-neutral-200/90 flex items-center justify-center text-neutral-900 shrink-0 shadow-2xs">
                    <Shirt className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-neutral-900">Realistic Fit</h4>
                    <p className="text-[11px] text-neutral-500 mt-0.5">
                      See how the dress looks on your body.
                    </p>
                  </div>
                </div>

                {/* Feature 2: Fast & Easy */}
                <div className="p-3 rounded-2xl bg-neutral-50/70 border border-neutral-200/70 flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-white border border-neutral-200/90 flex items-center justify-center text-neutral-900 shrink-0 shadow-2xs">
                    <Zap className="w-4 h-4 text-amber-500" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-neutral-900">Fast &amp; Easy</h4>
                    <p className="text-[11px] text-neutral-500 mt-0.5">
                      Get your result in seconds.
                    </p>
                  </div>
                </div>

                {/* Feature 3: Private & Secure */}
                <div className="p-3 rounded-2xl bg-neutral-50/70 border border-neutral-200/70 flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-white border border-neutral-200/90 flex items-center justify-center text-neutral-900 shrink-0 shadow-2xs">
                    <Lock className="w-4 h-4 text-emerald-600" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-neutral-900">Private &amp; Secure</h4>
                    <p className="text-[11px] text-neutral-500 mt-0.5">
                      Your photo is not stored.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Graphic & Hanger Illustration (Matches the graphic in screenshot) */}
            <div className="mt-8 pt-4 border-t border-neutral-100 flex items-center justify-between">
              {/* WhatsApp Concierge styling pill */}
              <a
                href={`https://wa.me/94763473075?text=${encodeURIComponent(
                  `Hi TBH! I am trying on the ${currentProduct.name} in size ${selectedSize} and would like fit assistance.`
                )}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 text-[11px] font-extrabold uppercase tracking-wider text-emerald-700 hover:text-emerald-800"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>Fit Concierge (+94 76 347 3075)</span>
              </a>

              {/* Decorative Hanger / Sparkle SVG Outline */}
              <div className="text-neutral-300 opacity-60">
                <svg
                  width="44"
                  height="44"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M12 2a3 3 0 0 0-3 3c0 .8.3 1.5.8 2.1L2 14v2h20v-2l-7.8-6.9A3 3 0 0 0 15 5a3 3 0 0 0-3-3z" />
                  <path d="M12 16v6" />
                  <circle cx="19" cy="6" r="1" />
                  <circle cx="5" cy="8" r="0.8" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* ======================================================== */}
        {/* SUPPORTING SECTION 1: Intelligent Fitting Engine         */}
        {/* ======================================================== */}
        <section className="mt-16 pt-12 border-t border-neutral-200 text-center">
          <div className="inline-flex items-center gap-2 bg-neutral-100 text-neutral-900 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>HOW IT WORKS</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-neutral-950">
            INTELLIGENT FITTING ENGINE
          </h3>
          <p className="text-xs text-neutral-500 mt-1 max-w-xl mx-auto leading-relaxed">
            Calibrated using 3D structural scanning and garment tensile metrics to remove guesswork and sizing discrepancies.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10 text-left">
            <div className="border border-neutral-200/90 rounded-2xl p-6 bg-white shadow-2xs">
              <span className="text-xs font-black text-neutral-400 block mb-2">01</span>
              <h4 className="text-sm font-black text-neutral-900 uppercase tracking-wider">
                Select or Upload
              </h4>
              <p className="text-xs text-neutral-600 mt-2 leading-relaxed">
                Choose from our biometric models or upload a front selfie. Biometric scaling calibrates to your frame without storing personal imagery.
              </p>
              <span className="text-[11px] font-extrabold text-neutral-900 uppercase tracking-wider block mt-4">
                INSTANT CALIBRATION →
              </span>
            </div>

            <div className="border border-neutral-200/90 rounded-2xl p-6 bg-white shadow-2xs">
              <span className="text-xs font-black text-neutral-400 block mb-2">02</span>
              <h4 className="text-sm font-black text-neutral-900 uppercase tracking-wider">
                Neural Fabric Drape
              </h4>
              <p className="text-xs text-neutral-600 mt-2 leading-relaxed">
                Our neural physics engine simulates fabric stretch, sleeve drape, and neckline contouring to reveal accurate fit before ordering.
              </p>
              <span className="text-[11px] font-extrabold text-neutral-900 uppercase tracking-wider block mt-4">
                REALISTIC PREVIEW →
              </span>
            </div>

            <div className="border border-neutral-200/90 rounded-2xl p-6 bg-white shadow-2xs">
              <span className="text-xs font-black text-neutral-400 block mb-2">03</span>
              <h4 className="text-sm font-black text-neutral-900 uppercase tracking-wider">
                Guaranteed Fit
              </h4>
              <p className="text-xs text-neutral-600 mt-2 leading-relaxed">
                Receive garment fits backed by our 7-day hassle-free Colombo exchange policy and islandwide doorstep cash on delivery logistics.
              </p>
              <span className="text-[11px] font-extrabold text-neutral-900 uppercase tracking-wider block mt-4">
                RISK-FREE SHOPPING →
              </span>
            </div>
          </div>
        </section>

        {/* ======================================================== */}
        {/* SUPPORTING SECTION 2: Sri Lanka Community Reviews        */}
        {/* ======================================================== */}
        <section className="mt-16 pt-12 border-t border-neutral-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-8">
            <div>
              <h3 className="text-lg sm:text-xl font-black uppercase tracking-wider text-neutral-950">
                SRI LANKA COMMUNITY
              </h3>
              <p className="text-xs text-neutral-500">Real Shoppers, Precision Fits</p>
            </div>
            <Link
              href="/category/all"
              className="text-xs font-bold uppercase tracking-wider text-neutral-700 hover:text-black"
            >
              BROWSE STORE CATALOG →
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {COMMUNITY_STORIES.map((story) => (
              <div key={story.name} className="flex flex-col">
                <div className="relative aspect-3/4 rounded-2xl overflow-hidden bg-neutral-100 mb-3 shadow-2xs">
                  <Image
                    src={story.image}
                    alt={story.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 50vw, 25vw"
                  />
                  <div className="absolute top-3 left-3 bg-black/70 backdrop-blur-xs text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                    {story.match}
                  </div>
                </div>
                <div className="flex text-amber-400 text-xs mb-1">★★★★★</div>
                <h5 className="text-xs font-black text-neutral-950 uppercase">
                  {story.name} — {story.location}
                </h5>
                <p className="text-xs text-neutral-600 mt-1 line-clamp-3 italic leading-relaxed">
                  &ldquo;{story.quote}&rdquo;
                </p>
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-neutral-400 mt-2 block">
                  {story.item}
                </span>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* ======================================================== */}
      {/* ZOOM LIGHTBOX MODAL                                      */}
      {/* ======================================================== */}
      {isZoomOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 sm:p-8 animate-in fade-in duration-200"
          onClick={() => setIsZoomOpen(false)}
        >
          <div
            className="relative max-w-2xl w-full aspect-3/4 max-h-[85vh] rounded-3xl overflow-hidden bg-neutral-950 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={viewMode === "after" ? activeAfterImage : activeBeforeImage}
              alt="Zoomed Virtual Try-On Result"
              fill
              className="object-contain"
              sizes="800px"
            />
            {/* Close Button */}
            <button
              onClick={() => setIsZoomOpen(false)}
              className="absolute top-4 right-4 w-9 h-9 rounded-full bg-black/60 text-white hover:bg-black flex items-center justify-center transition-colors cursor-pointer"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
            {/* Bottom Caption */}
            <div className="absolute bottom-4 inset-x-4 bg-black/60 backdrop-blur-md text-white px-4 py-2 rounded-xl text-center text-xs font-bold">
              {currentProduct.name} — {viewMode === "after" ? "AI Draped Drape Preview" : "Base Silhouette Photo"}
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* COMPARE SIDE-BY-SIDE MODAL                               */}
      {/* ======================================================== */}
      {isCompareOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 sm:p-8 animate-in fade-in duration-200"
          onClick={() => setIsCompareOpen(false)}
        >
          <div
            className="relative max-w-4xl w-full bg-white rounded-3xl overflow-hidden p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-4 border-b border-neutral-100 mb-6">
              <div>
                <h3 className="text-base font-black text-neutral-900">
                  Side-by-Side Drape Comparison
                </h3>
                <p className="text-xs text-neutral-500">
                  Compare base model silhouette vs AI fitted garment drape
                </p>
              </div>
              <button
                onClick={() => setIsCompareOpen(false)}
                className="w-8 h-8 rounded-full bg-neutral-100 hover:bg-neutral-200 text-neutral-700 flex items-center justify-center transition-colors cursor-pointer"
                aria-label="Close compare modal"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {/* Before Column */}
              <div className="flex flex-col items-center">
                <span className="text-xs font-extrabold uppercase tracking-wider text-neutral-500 mb-2">
                  Before (Original Frame)
                </span>
                <div className="relative w-full aspect-3/4 rounded-2xl overflow-hidden bg-neutral-100 border border-neutral-200">
                  <Image
                    src={activeBeforeImage}
                    alt="Original Photo"
                    fill
                    className="object-cover"
                    sizes="400px"
                  />
                </div>
              </div>

              {/* After Column */}
              <div className="flex flex-col items-center">
                <span className="text-xs font-extrabold uppercase tracking-wider text-neutral-900 flex items-center gap-1 mb-2">
                  <span>After (AI Fitted)</span>
                  <Sparkles className="w-3 h-3 text-amber-500" />
                </span>
                <div className="relative w-full aspect-3/4 rounded-2xl overflow-hidden bg-neutral-100 border-2 border-black">
                  <Image
                    src={activeAfterImage}
                    alt="Fitted Garment Photo"
                    fill
                    className="object-cover"
                    sizes="400px"
                  />
                  <span className="absolute top-3 right-3 bg-black/80 backdrop-blur-xs text-white text-[10px] font-bold px-2.5 py-1 rounded-full">
                    98.4% Drape Match
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
