"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  RotateCcw,
  Sparkles,
  CheckCircle,
  Shield,
  Upload,
  ArrowRight,
  ZoomIn,
  Compass,
  Layers,
  Heart,
  Eye,
  MessageCircle,
} from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { toast } from "sonner";

export default function VirtualTryOnPage() {
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();

  // Model & View states
  const [modelType, setModelType] = useState<"female" | "male" | "curvy" | "custom">("female");
  const [activeCategory, setActiveCategory] = useState("tops");
  const [selectedBodyShape, setSelectedBodyShape] = useState<"hourglass" | "petite" | "athletic" | "pear">("petite");
  const [heightCm, setHeightCm] = useState(165);
  const [weightKg, setWeightKg] = useState(58);
  const [bustIn, setBustIn] = useState(36);
  const [shoeSize, setShoeSize] = useState("6 UK (EU 39 / US 8)");
  const [customPhoto, setCustomPhoto] = useState<string | null>(null);
  const [isRotating, setIsRotating] = useState(false);
  const [selectedColor, setSelectedColor] = useState("Floral Ash");

  const product = {
    _id: "prod_1",
    name: "Waves Poncho Ash – Flower",
    slug: "waves-poncho-ash-flower",
    sku: "H070002051",
    price: 2950,
    brand: "WAVES",
    image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=900&q=80",
    colors: [
      { name: "Floral Ash", hex: "#9ca3af" },
      { name: "Sandstone", hex: "#d6c7b2" },
      { name: "Ocean Slate", hex: "#475569" },
    ],
  };

  const communityStories = [
    {
      name: "Ananya K.",
      location: "Colombo 07",
      image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=500&q=80",
      quote: "The poncho drape matched the AI simulation completely! Loved the fabric breathability in tropical heat.",
      item: "WORE: FREE SIZE PONCHO",
      match: "Match: 99%",
    },
    {
      name: "Dilini S.",
      location: "Kandy",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=500&q=80",
      quote: "Normally my wide feet make online shoe shopping risky, but Ansel fit true to spec. Super lightweight.",
      item: "WORE: ANSEL NB1018",
      match: "Match: 95%",
    },
    {
      name: "Shanali R.",
      location: "Negombo",
      image: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=500&q=80",
      quote: "Saved me from having to return clothes via courier. The size recommendations are spot on.",
      item: "WORE: FLORAL LADIES SHORTS M",
      match: "Match: 98%",
    },
    {
      name: "Ravindu R.",
      location: "Galle",
      image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=500&q=80",
      quote: "Tried out the sandal strap height tool and bought the 42. Excellent beach grip.",
      item: "WORE: WAVES TWO COLOUR SANDAL",
      match: "Match: 97%",
    },
  ];

  const handleCustomPhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setCustomPhoto(reader.result as string);
        setModelType("custom");
        toast.success("Selfie uploaded! Anatomical drape calibrated.");
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddRecommendedToCart = () => {
    addToCart({
      productId: product._id,
      name: product.name,
      slug: product.slug,
      sku: product.sku,
      price: product.price,
      image: product.image,
      brand: product.brand,
      selectedColor,
      selectedSize: "Free Size (AI Recommended)",
      quantity: 1,
    });
  };

  const handleReset = () => {
    setHeightCm(165);
    setWeightKg(58);
    setBustIn(36);
    setSelectedBodyShape("petite");
    setCustomPhoto(null);
    setModelType("female");
    toast.info("Fit measurements reset to baseline.");
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
      {/* Breadcrumbs */}
      <nav className="text-[11px] font-bold uppercase tracking-wider text-neutral-500 mb-4 flex items-center gap-2">
        <Link href="/" className="hover:text-black transition-colors">
          HOME
        </Link>
        <span>/</span>
        <span className="text-black font-extrabold">AI FIT-ON & STYLIST STUDIO</span>
      </nav>

      {/* Engine Badge & Subtitle */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-neutral-200">
        <div>
          <div className="inline-flex items-center gap-2 text-xs font-black tracking-widest uppercase text-black">
            <span>&lt; TBH NEURALFIT™ ENGINE V2.4</span>
          </div>
          <p className="text-xs text-neutral-600 mt-1 max-w-2xl leading-relaxed">
            AI Visual Fit-On & Stylist Studio. Experience smart anatomical drape previews, precision 3D shoe mapping, and personalized size accuracy before purchasing. Designed for the Sri Lankan silhouette.
          </p>
        </div>

        <div className="flex items-center gap-3 text-[11px] font-extrabold uppercase tracking-wider shrink-0">
          <span className="bg-neutral-100 text-neutral-900 px-3 py-1.5 rounded-full border border-neutral-200 flex items-center gap-1.5">
            <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
            98.4% FIT ACCURACY
          </span>
          <span className="bg-neutral-100 text-neutral-900 px-3 py-1.5 rounded-full border border-neutral-200 flex items-center gap-1.5">
            <Shield className="w-3.5 h-3.5 text-blue-600" />
            ISLAND WIDE COD READY
          </span>
        </div>
      </div>

      {/* Studio Nav Tabs */}
      <div className="flex items-center space-x-2 sm:space-x-4 overflow-x-auto py-4 border-b border-neutral-200 text-xs font-bold uppercase tracking-wider scrollbar-none">
        {[
          { id: "tops", label: "TRY ON TOPS & PONCHOS" },
          { id: "footwear", label: "FOOTWEAR 3D SIZING" },
          { id: "shorts", label: "SHORTS & BOTTOMS" },
          { id: "matcher", label: "SMART OUTFIT MATCHER" },
          { id: "koko", label: "KOKO SPLIT CALCULATOR" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveCategory(tab.id)}
            className={`px-4 py-2 rounded-full whitespace-nowrap transition-colors ${
              activeCategory === tab.id
                ? "bg-black text-white"
                : "bg-neutral-100 text-neutral-700 hover:bg-neutral-200"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Main Studio 2-Column Interface */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 mt-8 items-start">
        {/* Left Column: Interactive Visual Model Studio */}
        <div className="lg:col-span-7 space-y-4">
          {/* Model selection tabs */}
          <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setModelType("female")}
                className={`px-3 py-1.5 rounded-lg transition-colors ${
                  modelType === "female" ? "bg-black text-white" : "bg-neutral-100 text-neutral-700"
                }`}
              >
                FEMALE MODEL (27°)
              </button>
              <button
                onClick={() => setModelType("male")}
                className={`px-3 py-1.5 rounded-lg transition-colors ${
                  modelType === "male" ? "bg-black text-white" : "bg-neutral-100 text-neutral-700"
                }`}
              >
                MALE MODEL
              </button>
              <button
                onClick={() => setModelType("curvy")}
                className={`px-3 py-1.5 rounded-lg transition-colors ${
                  modelType === "curvy" ? "bg-black text-white" : "bg-neutral-100 text-neutral-700"
                }`}
              >
                CURVY CUSTOM
              </button>
            </div>

            <label className="cursor-pointer text-blue-600 hover:text-blue-800 flex items-center gap-1 font-bold">
              <Upload className="w-3.5 h-3.5" />
              <span>+ UPLOAD SELFIE</span>
              <input type="file" accept="image/*" onChange={handleCustomPhotoUpload} className="hidden" />
            </label>
          </div>

          {/* Live Model Viewport Card */}
          <div
            className={`relative aspect-4/5 rounded-3xl overflow-hidden bg-neutral-900 shadow-xl transition-all ${
              isRotating ? "rotate-1 scale-102" : ""
            }`}
          >
            <Image
              src={
                customPhoto ||
                (modelType === "female"
                  ? "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=900&q=80"
                  : modelType === "male"
                  ? "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=900&q=80"
                  : "https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=900&q=80")
              }
              alt="NeuralFit Model Drape View"
              fill
              priority
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 60vw"
            />

            {/* AI Overlay Markers */}
            <div className="absolute top-4 right-4 flex flex-col gap-2 z-10">
              <span className="bg-black/60 backdrop-blur-md text-emerald-400 text-[10px] font-bold px-2.5 py-1 rounded-full border border-emerald-500/30">
                ● 98.4% MATCH
              </span>
              <button
                onClick={() => toggleWishlist(product as any)}
                className="bg-white/90 backdrop-blur-xs text-neutral-800 text-[10px] font-bold px-2.5 py-1 rounded-full shadow-sm hover:bg-white flex items-center gap-1"
              >
                <Heart className="w-3 h-3" />
                Save to Wishlist
              </button>
              <Link
                href={`/product/${product.slug}`}
                className="bg-white/90 backdrop-blur-xs text-neutral-800 text-[10px] font-bold px-2.5 py-1 rounded-full shadow-sm hover:bg-white flex items-center gap-1"
              >
                <Eye className="w-3 h-3" />
                View Details
              </Link>
            </div>

            {/* Anatomical Marker Overlay */}
            <div className="absolute top-1/3 left-1/4 bg-black/70 backdrop-blur-xs text-white text-[10px] font-semibold px-2.5 py-1 rounded-md border border-white/20 flex items-center gap-1.5 shadow-lg">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
              <span>Bust [36&quot;] Drape Tolerance: Optimal</span>
            </div>

            {/* Bottom Interactive Controls */}
            <div className="absolute bottom-4 inset-x-4 bg-black/60 backdrop-blur-md rounded-2xl px-4 py-2 flex items-center justify-between text-[11px] font-bold text-white">
              <button
                onClick={() => {
                  setIsRotating(!isRotating);
                  toast.info(isRotating ? "360 rotation stopped" : "360 anatomical turntable active");
                }}
                className="flex items-center gap-1.5 hover:text-emerald-400 transition-colors"
              >
                <Compass className="w-3.5 h-3.5" />
                <span>360° Rotate</span>
              </button>
              <button
                onClick={() => toast.info("Zooming on fabric tension points")}
                className="flex items-center gap-1.5 hover:text-emerald-400 transition-colors"
              >
                <ZoomIn className="w-3.5 h-3.5" />
                <span>Zoom Detail</span>
              </button>
              <button
                onClick={() => toast.info("Layering simulation breakdown active")}
                className="flex items-center gap-1.5 hover:text-emerald-400 transition-colors"
              >
                <Layers className="w-3.5 h-3.5" />
                <span>Layer Breakdown</span>
              </button>
            </div>
          </div>

          {/* 3 Metric Cards Under Viewport */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-xs">
            <div className="bg-neutral-50 border border-neutral-200 rounded-xl p-3">
              <span className="text-[10px] uppercase font-bold text-neutral-400 block">MOVEMENT STRETCH</span>
              <strong className="text-black font-extrabold mt-0.5 block">100% Breathable</strong>
              <span className="text-[11px] text-neutral-500">Soft Ceylon Cotton Viscose</span>
            </div>

            <div className="bg-neutral-50 border border-neutral-200 rounded-xl p-3">
              <span className="text-[10px] uppercase font-bold text-neutral-400 block">THERMAL RATING</span>
              <strong className="text-black font-extrabold mt-0.5 block">Tropical Cool</strong>
              <span className="text-[11px] text-neutral-500">Ideal for Sri Lanka Heat</span>
            </div>

            <div className="bg-neutral-50 border border-neutral-200 rounded-xl p-3">
              <span className="text-[10px] uppercase font-bold text-neutral-400 block">RETURN PROBABILITY</span>
              <strong className="text-emerald-700 font-extrabold mt-0.5 block">&lt; 8.4%</strong>
              <span className="text-[11px] text-neutral-500">High Precision Fit</span>
            </div>
          </div>
        </div>

        {/* Right Column: Your Fit Measurements & Active Try-On Product */}
        <div className="lg:col-span-5 space-y-6">
          {/* Section 1: Your Fit Measurements */}
          <div className="border border-neutral-200 rounded-2xl p-6 bg-white shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-neutral-100">
              <h2 className="text-xs font-black uppercase tracking-wider text-black flex items-center gap-1.5">
                <span>1</span>
                <span>Your Fit Measurements</span>
              </h2>
              <button
                onClick={handleReset}
                className="text-[11px] font-bold text-neutral-400 hover:text-black uppercase tracking-wider flex items-center gap-1"
              >
                <RotateCcw className="w-3 h-3" />
                RESET VALUES
              </button>
            </div>

            {/* Sliders / Inputs */}
            <div className="grid grid-cols-2 gap-4 text-xs">
              <div>
                <label className="font-extrabold uppercase tracking-wider text-neutral-800 block mb-1">
                  Height (cm / ft)
                </label>
                <div className="flex items-center border border-neutral-300 rounded-lg px-3 py-2 bg-neutral-50">
                  <input
                    type="number"
                    value={heightCm}
                    onChange={(e) => setHeightCm(Number(e.target.value))}
                    className="w-full bg-transparent font-bold focus:outline-hidden"
                  />
                  <span className="text-[11px] text-neutral-400 font-semibold shrink-0">165 cm (5&apos;5&quot;)</span>
                </div>
              </div>

              <div>
                <label className="font-extrabold uppercase tracking-wider text-neutral-800 block mb-1">
                  Weight (kg)
                </label>
                <div className="flex items-center border border-neutral-300 rounded-lg px-3 py-2 bg-neutral-50">
                  <input
                    type="number"
                    value={weightKg}
                    onChange={(e) => setWeightKg(Number(e.target.value))}
                    className="w-full bg-transparent font-bold focus:outline-hidden"
                  />
                  <span className="text-[11px] text-neutral-400 font-semibold shrink-0">kg</span>
                </div>
              </div>

              <div>
                <label className="font-extrabold uppercase tracking-wider text-neutral-800 block mb-1">
                  Bust / Chest (in)
                </label>
                <div className="flex items-center border border-neutral-300 rounded-lg px-3 py-2 bg-neutral-50">
                  <input
                    type="number"
                    value={bustIn}
                    onChange={(e) => setBustIn(Number(e.target.value))}
                    className="w-full bg-transparent font-bold focus:outline-hidden"
                  />
                  <span className="text-[11px] text-neutral-400 font-semibold shrink-0">in</span>
                </div>
              </div>

              <div>
                <label className="font-extrabold uppercase tracking-wider text-neutral-800 block mb-1">
                  Shoe Size
                </label>
                <select
                  value={shoeSize}
                  onChange={(e) => setShoeSize(e.target.value)}
                  className="w-full border border-neutral-300 rounded-lg px-2.5 py-2 bg-neutral-50 font-bold focus:outline-hidden cursor-pointer"
                >
                  <option value="5 UK">5 UK (EU 38)</option>
                  <option value="6 UK (EU 39 / US 8)">6 UK (EU 39 / US 8)</option>
                  <option value="7 UK (EU 40)">7 UK (EU 40)</option>
                  <option value="8 UK (EU 41)">8 UK (EU 41)</option>
                  <option value="9 UK (EU 42)">9 UK (EU 42)</option>
                </select>
              </div>
            </div>

            {/* Body Shape Profile Pills */}
            <div className="pt-2">
              <label className="text-[11px] font-extrabold uppercase tracking-wider text-neutral-700 block mb-2">
                Body Shape Profile
              </label>
              <div className="grid grid-cols-4 gap-2 text-center text-xs font-bold uppercase tracking-wider">
                {[
                  { id: "hourglass", label: "HOURGLASS" },
                  { id: "petite", label: "PETITE" },
                  { id: "athletic", label: "ATHLETIC" },
                  { id: "pear", label: "PEAR" },
                ].map((shape) => (
                  <button
                    key={shape.id}
                    onClick={() => setSelectedBodyShape(shape.id as any)}
                    className={`py-2 px-1 rounded-lg border transition-all ${
                      selectedBodyShape === shape.id
                        ? "bg-black text-white border-black"
                        : "bg-white text-neutral-700 border-neutral-200 hover:border-black"
                    }`}
                  >
                    {shape.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Section 2: Active Try-On Selection */}
          <div className="border border-neutral-200 rounded-2xl p-6 bg-white shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-neutral-100">
              <h2 className="text-xs font-black uppercase tracking-wider text-black flex items-center gap-1.5">
                <span>2</span>
                <span>Active Try-On Selection</span>
              </h2>
              <span className="text-[11px] font-extrabold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                IN STOCK
              </span>
            </div>

            {/* Product Card Row */}
            <div className="flex gap-4 items-center">
              <div className="w-16 h-20 rounded-xl overflow-hidden bg-neutral-100 relative shrink-0">
                <Image src={product.image} alt={product.name} fill className="object-cover" sizes="64px" />
              </div>
              <div className="flex-1 text-xs">
                <span className="text-[10px] font-bold tracking-widest text-neutral-400 uppercase">
                  WAVES APPAREL CO.
                </span>
                <h4 className="font-bold text-black text-sm">{product.name}</h4>
                <div className="mt-1 flex items-baseline gap-2">
                  <span className="font-black text-black">Rs. {product.price.toLocaleString()}</span>
                  <span className="text-[11px] text-neutral-500 font-medium">or 3 X Rs 983.33 with Koko</span>
                </div>
              </div>
            </div>

            {/* TBH Fit Confidence 96% Indicator */}
            <div className="flex items-center gap-3 bg-neutral-50 rounded-xl p-3 border border-neutral-200">
              <div className="w-11 h-11 rounded-full bg-black text-white flex items-center justify-center font-black text-xs shrink-0">
                96%
              </div>
              <div className="text-xs">
                <strong className="text-black font-extrabold block">TBH FIT CONFIDENCE: HIGH</strong>
                <span className="text-[11px] text-neutral-600">
                  Zero returns reported for this Sri Lankan silhouette &amp; size combo.
                </span>
              </div>
            </div>

            {/* Select Fabric Hue */}
            <div>
              <label className="text-[11px] font-extrabold uppercase tracking-wider text-neutral-700 block mb-2">
                Select Fabric Hue: <span className="font-normal text-neutral-500">{selectedColor}</span>
              </label>
              <div className="flex items-center gap-2">
                {product.colors.map((c) => (
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

            {/* Big Action Buttons */}
            <div className="pt-2 space-y-2.5">
              <button
                onClick={handleAddRecommendedToCart}
                className="w-full bg-black text-white py-3.5 px-6 rounded-full text-xs font-black uppercase tracking-wider text-center hover:bg-neutral-800 transition-colors shadow-sm flex items-center justify-center gap-2"
              >
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>ADD RECOMMENDED FIT TO CART — RS. {product.price.toLocaleString()}</span>
              </button>

              <a
                href={`https://wa.me/94763473075?text=${encodeURIComponent(
                  `Hi TBH! I am looking at the ${product.name} on the NeuralFit Studio and would like styling assistance.`
                )}`}
                target="_blank"
                rel="noreferrer"
                className="w-full bg-neutral-100 hover:bg-neutral-200 text-neutral-900 py-3 px-6 rounded-full text-xs font-extrabold uppercase tracking-wider text-center transition-colors flex items-center justify-center gap-2"
              >
                <MessageCircle className="w-4 h-4 text-emerald-600" />
                <span>ORDER VIA WHATSAPP CONCIERGE (+94 76 347 3075)</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* 3-Step Intelligent Fitting Engine Explanation */}
      <section className="mt-20 pt-12 border-t border-neutral-200 text-center">
        <h3 className="text-base sm:text-lg font-black uppercase tracking-wider text-black">
          INTELLIGENT FITTING ENGINE
        </h3>
        <p className="text-xs text-neutral-500 mt-1 max-w-xl mx-auto">
          Calibrated using 3D structural scanning and garment tensile metrics to remove guesswork and sizing discrepancies.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-10 text-left">
          <div className="border border-neutral-200 rounded-2xl p-6 bg-neutral-50/50">
            <span className="text-xs font-extrabold text-neutral-400 block mb-2">01</span>
            <h4 className="text-sm font-bold text-black uppercase tracking-wider">Input or Snap</h4>
            <p className="text-xs text-neutral-600 mt-2 leading-relaxed">
              Enter your key body measurements or upload a front-mirror selfie. Our Sri Lankan biometric models instantly calibrate to your frame without storing sensitive imagery.
            </p>
            <span className="text-[11px] font-extrabold text-black uppercase tracking-wider block mt-4">
              INSTANT CALIBRATION →
            </span>
          </div>

          <div className="border border-neutral-200 rounded-2xl p-6 bg-neutral-50/50">
            <span className="text-xs font-extrabold text-neutral-400 block mb-2">02</span>
            <h4 className="text-sm font-bold text-black uppercase tracking-wider">Neural Fabric Drape</h4>
            <p className="text-xs text-neutral-600 mt-2 leading-relaxed">
              Our neural physics engine simulates fabric weight, stretch resistance, and shoe arch curvature to reveal tension points before you place your order.
            </p>
            <span className="text-[11px] font-extrabold text-black uppercase tracking-wider block mt-4">
              360° REALISM →
            </span>
          </div>

          <div className="border border-neutral-200 rounded-2xl p-6 bg-neutral-50/50">
            <span className="text-xs font-extrabold text-neutral-400 block mb-2">03</span>
            <h4 className="text-sm font-bold text-black uppercase tracking-wider">Guaranteed Fit</h4>
            <p className="text-xs text-neutral-600 mt-2 leading-relaxed">
              Receive verified garment matches backed by our 7-day hassle-free Colombo exchange policy and islandwide Sri Lankan doorstep logistics.
            </p>
            <span className="text-[11px] font-extrabold text-black uppercase tracking-wider block mt-4">
              RISK-FREE SHOPPING →
            </span>
          </div>
        </div>
      </section>

      {/* SRI LANKA COMMUNITY Reviews Grid (Screenshot 4) */}
      <section className="mt-20 pt-12 border-t border-neutral-200">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h3 className="text-base sm:text-lg font-black uppercase tracking-wider text-black">
              SRI LANKA COMMUNITY
            </h3>
            <p className="text-xs text-neutral-500">Real Shoppers, Precision Fits</p>
          </div>
          <Link
            href="/reviews"
            className="text-xs font-bold uppercase tracking-wider text-neutral-700 hover:text-black"
          >
            VIEW ALL 1,420+ FIT STORIES →
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {communityStories.map((story) => (
            <div key={story.name} className="flex flex-col">
              <div className="relative aspect-3/4 rounded-2xl overflow-hidden bg-neutral-100 mb-3 shadow-xs">
                <Image src={story.image} alt={story.name} fill className="object-cover" sizes="25vw" />
                <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-xs text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                  {story.match}
                </div>
              </div>
              <div className="flex text-amber-400 text-xs mb-1">★★★★★</div>
              <h5 className="text-xs font-black text-black uppercase">
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
    </div>
  );
}
