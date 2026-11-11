"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  Heart,
  Truck,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  Share2,
  Wand2,
} from "lucide-react";
import ProductCard from "@/components/ProductCard";
import { IProduct } from "@/types";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { toast } from "sonner";

export default function ProductDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const slug = (params?.slug as string) || "";

  const [product, setProduct] = useState<IProduct | null>(null);
  const [similarProducts, setSimilarProducts] = useState<IProduct[]>([]);
  const [selectedColor, setSelectedColor] = useState<string>("");
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [quantity, setQuantity] = useState<number>(1);
  const [activeTab, setActiveTab] = useState<"desc" | "add_info">("desc");
  const [selectedImage, setSelectedImage] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);

  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();

  useEffect(() => {
    async function loadProduct() {
      setIsLoading(true);
      try {
        const res = await fetch(`/api/products/${slug}`);
        if (!res.ok) {
          router.push("/category/all");
          return;
        }
        const data: IProduct = await res.json();
        setProduct(data);
        if (data.colors?.[0]) setSelectedColor(data.colors[0].name);
        if (data.sizes?.[0]) setSelectedSize(data.sizes[0]);
        if (data.images?.[0]?.url) setSelectedImage(data.images[0].url);

        // Fetch similar products
        const simRes = await fetch(`/api/products?limit=4`);
        const simData = await simRes.json();
        setSimilarProducts(
          (simData.products || []).filter((p: IProduct) => p.slug !== slug).slice(0, 4)
        );
      } catch (err) {
        console.error("Failed to load product details:", err);
      } finally {
        setIsLoading(false);
      }
    }

    if (slug) loadProduct();
  }, [slug, router]);

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 animate-pulse space-y-8">
        <div className="h-4 bg-neutral-200 rounded w-1/3" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="aspect-square bg-neutral-200 rounded-3xl" />
          <div className="space-y-4">
            <div className="h-8 bg-neutral-200 rounded w-2/3" />
            <div className="h-6 bg-neutral-200 rounded w-1/4" />
            <div className="h-24 bg-neutral-200 rounded w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) return null;

  const installmentAmount = (product.price / 3).toFixed(2);
  const inWishlist = isInWishlist(product._id || product.slug);

  const handleAddToCart = () => {
    addToCart({
      productId: product._id || product.slug,
      name: product.name,
      slug: product.slug,
      sku: product.sku,
      price: product.price,
      originalPrice: product.originalPrice,
      image: product.images?.[0]?.url || "",
      brand: product.brand,
      selectedColor,
      selectedSize,
      quantity,
    });
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: product.name,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success("Product link copied to clipboard!");
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      {/* Breadcrumbs (Screenshot 1: HOME > WOMEN > WOMEN CLOTHING > WAVES PONCHO ASH - FLOWER) */}
      <nav className="text-[11px] font-bold uppercase tracking-wider text-neutral-500 mb-6 flex items-center gap-2 flex-wrap">
        <Link href="/" className="hover:text-black transition-colors">
          HOME
        </Link>
        <span>&gt;</span>
        <Link href={`/category/${product.category.toLowerCase()}`} className="hover:text-black transition-colors">
          {product.category}
        </Link>
        {product.subcategory && (
          <>
            <span>&gt;</span>
            <Link
              href={`/category/${product.category.toLowerCase()}?subcategory=${encodeURIComponent(product.subcategory)}`}
              className="hover:text-black transition-colors"
            >
              {product.subcategory}
            </Link>
          </>
        )}
        <span>&gt;</span>
        <span className="text-black font-extrabold">{product.name}</span>
      </nav>

      {/* Main Grid: Gallery on left, Details on right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        {/* Left: Product Gallery - 2x2 grid if multiple images, exactly as in Screenshot 1 */}
        <div className="lg:col-span-7">
          {product.images && product.images.length >= 4 ? (
            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              {product.images.slice(0, 4).map((img, idx) => (
                <div
                  key={idx}
                  onClick={() => setSelectedImage(img.url)}
                  className="relative aspect-3/4 rounded-2xl sm:rounded-3xl overflow-hidden bg-neutral-100 shadow-xs cursor-pointer group"
                >
                  <Image
                    src={img.url}
                    alt={img.alt || `${product.name} view ${idx + 1}`}
                    fill
                    priority={idx === 0}
                    className="object-cover group-hover:scale-104 transition-transform duration-500"
                    sizes="(max-width: 1024px) 50vw, 30vw"
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              <div className="relative aspect-4/5 rounded-3xl overflow-hidden bg-neutral-100 shadow-sm">
                <Image
                  src={selectedImage || product.images?.[0]?.url || ""}
                  alt={product.name}
                  fill
                  priority
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 55vw"
                />
              </div>

              {product.images && product.images.length > 1 && (
                <div className="flex gap-3 overflow-x-auto pb-2">
                  {product.images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedImage(img.url)}
                      className={`relative w-20 h-24 rounded-xl overflow-hidden bg-neutral-100 shrink-0 border-2 transition-all ${
                        selectedImage === img.url ? "border-black" : "border-transparent"
                      }`}
                    >
                      <Image src={img.url} alt="" fill className="object-cover" sizes="80px" />
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right: Product Information */}
        <div className="lg:col-span-5 space-y-5">
          {/* Brand script & Stock Badge */}
          <div className="flex items-center justify-between">
            <span
              className={`text-2xl font-serif italic font-bold tracking-tight ${
                product.brand.toLowerCase() === "waves"
                  ? "text-orange-600 lowercase"
                  : "text-black uppercase font-sans font-black"
              }`}
            >
              {product.brand}
            </span>

            {/* In stock green pill badge */}
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              {product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}
            </span>
          </div>

          {/* Product Title */}
          <h1 className="text-2xl sm:text-3xl font-black text-black uppercase tracking-wide">
            {product.name}
          </h1>

          {/* SKU and Secondary Stock Indicator */}
          <div className="flex items-center justify-between text-xs text-neutral-500 font-medium">
            <span>
              SKU : <strong className="text-black uppercase">{product.sku}</strong>
            </span>
            <span className="inline-flex items-center gap-1 text-[11px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
              ● {product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}
            </span>
          </div>

          {/* Price */}
          <div className="pt-1">
            <div className="text-2xl sm:text-3xl font-black text-black">
              Rs {product.price.toLocaleString("en-LK", { minimumFractionDigits: 2 })}
            </div>

            {/* Installments Breakdown: KOKO & MINTPAY */}
            <div className="mt-2 space-y-1 text-xs text-neutral-600 font-medium">
              <div className="flex items-center gap-1.5">
                <span>or 3 X </span>
                <strong className="text-black font-extrabold">Rs{installmentAmount}</strong>
                <span> with </span>
                <span className="font-extrabold text-[#e11d48] tracking-tight">KOKO</span>
                <span className="text-[10px] text-neutral-400">ⓘ</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span>or 3 X </span>
                <strong className="text-black font-extrabold">Rs{installmentAmount}</strong>
                <span> with </span>
                <span className="font-bold text-[#0284c7] tracking-tight">mintpay</span>
              </div>
            </div>
          </div>

          {/* Payment Badges (VISA, Mastercard, Discover, Amex) */}
          <div className="flex items-center gap-2 pt-1">
            <span className="px-2.5 py-1 rounded bg-neutral-100 text-[10px] font-black text-blue-800 border border-neutral-200 tracking-wider">
              VISA
            </span>
            <span className="px-2.5 py-1 rounded bg-neutral-100 text-[10px] font-black text-amber-700 border border-neutral-200 tracking-wider">
              Mastercard
            </span>
            <span className="px-2.5 py-1 rounded bg-neutral-100 text-[10px] font-black text-orange-600 border border-neutral-200 tracking-wider">
              DISCOVER
            </span>
            <span className="px-2.5 py-1 rounded bg-neutral-100 text-[10px] font-black text-blue-600 border border-neutral-200 tracking-wider">
              AMERICAN EXPRESS
            </span>
          </div>

          {/* Category Links & Brand */}
          <div className="pt-2 text-xs text-neutral-500 space-y-1">
            <p>
              <strong className="text-black font-bold">Categories: </strong>
              <span className="text-neutral-700">
                {product.category}, {product.brand}, {product.subcategory || "Apparel"}
              </span>
            </p>
            <p>
              <strong className="text-black font-bold">Brand: </strong>
              <span className="text-neutral-700">{product.brand}</span>
            </p>
          </div>

          {/* Color & Size Variant Selectors if available */}
          {product.colors && product.colors.length > 0 && (
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-black block mb-2">
                Color: <span className="font-normal text-neutral-600">{selectedColor}</span>
              </label>
              <div className="flex items-center space-x-2">
                {product.colors.map((c) => (
                  <button
                    key={c.name}
                    onClick={() => setSelectedColor(c.name)}
                    className={`w-7 h-7 rounded-full border-2 transition-all p-0.5 ${
                      selectedColor === c.name ? "border-black scale-110" : "border-transparent"
                    }`}
                    title={c.name}
                  >
                    <span className="w-full h-full rounded-full block" style={{ backgroundColor: c.hex }} />
                  </button>
                ))}
              </div>
            </div>
          )}

          {product.sizes && product.sizes.length > 1 && (
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-black block mb-2">
                Size: <span className="font-normal text-neutral-600">{selectedSize}</span>
              </label>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((s) => (
                  <button
                    key={s}
                    onClick={() => setSelectedSize(s)}
                    className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      selectedSize === s
                        ? "bg-black text-white"
                        : "bg-neutral-100 text-neutral-800 hover:bg-neutral-200"
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Virtual Try-On Callout if eligible */}
          {product.isVirtualTryOn && (
            <Link
              href={`/virtual-try-on?product=${product.slug}`}
              className="inline-flex items-center gap-2 text-xs font-bold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 rounded-xl px-4 py-2.5 transition-colors w-full"
            >
              <Wand2 className="w-4 h-4 text-emerald-600" />
              <span>Preview this garment on AI NeuralFit™ Studio</span>
            </Link>
          )}

          {/* Action Row: Big Black Add to Cart Pill + Wishlist + Share */}
          <div className="pt-3 flex items-center gap-3">
            <button
              onClick={handleAddToCart}
              disabled={product.stock <= 0}
              className={`flex-1 py-3.5 px-8 rounded-full text-xs font-black uppercase tracking-wider text-center transition-all shadow-sm ${
                product.stock > 0
                  ? "bg-black text-white hover:bg-neutral-800 active:scale-98"
                  : "bg-neutral-300 text-neutral-500 cursor-not-allowed"
              }`}
            >
              {product.stock > 0 ? "Add to cart" : "Out of stock"}
            </button>

            <button
              onClick={() => toggleWishlist(product)}
              className={`w-12 h-12 rounded-full border border-neutral-300 flex items-center justify-center transition-colors ${
                inWishlist ? "bg-red-50 text-red-500 border-red-200" : "hover:border-black text-neutral-700"
              }`}
              aria-label="Wishlist"
            >
              <Heart className={`w-5 h-5 ${inWishlist ? "fill-red-500" : ""}`} />
            </button>

            <button
              onClick={handleShare}
              className="w-12 h-12 rounded-full border border-neutral-300 hover:border-black flex items-center justify-center transition-colors text-neutral-700"
              aria-label="Share"
            >
              <Share2 className="w-5 h-5" />
            </button>
          </div>

          {/* Tabs: DESCRIPTION & ADDITIONAL INFORMATION */}
          <div className="pt-6 border-t border-neutral-200">
            <div className="flex border-b border-neutral-200 text-xs font-extrabold uppercase tracking-wider space-x-6">
              <button
                onClick={() => setActiveTab("desc")}
                className={`pb-2.5 transition-colors relative ${
                  activeTab === "desc" ? "text-black border-b-2 border-black" : "text-neutral-400 hover:text-black"
                }`}
              >
                DESCRIPTION
              </button>
              <button
                onClick={() => setActiveTab("add_info")}
                className={`pb-2.5 transition-colors relative ${
                  activeTab === "add_info" ? "text-black border-b-2 border-black" : "text-neutral-400 hover:text-black"
                }`}
              >
                ADDITIONAL INFORMATION
              </button>
            </div>

            <div className="pt-4 text-xs text-neutral-600 leading-relaxed">
              {activeTab === "desc" ? (
                <div className="space-y-3 whitespace-pre-line font-normal">
                  {product.description}
                </div>
              ) : (
                <div className="space-y-2">
                  <p>
                    <strong className="text-black">Material: </strong> Ceylon organic cotton blend
                  </p>
                  <p>
                    <strong className="text-black">Dimensions & Fit: </strong> Free Size relaxed silhouette
                  </p>
                  <p>
                    <strong className="text-black">Origin: </strong> 100% Handcrafted in Sri Lanka
                  </p>
                  <p>
                    <strong className="text-black">Care: </strong> Gentle cold machine or hand wash
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Highlights Card (Island Wide Cash On Delivery, 100% Secure Checkout, 100% Genuine Brands) */}
          <div className="p-5 rounded-2xl bg-[#f7f7f7] border border-neutral-200/80 space-y-3 text-xs font-bold text-neutral-900">
            <div className="flex items-center gap-3">
              <Truck className="w-4 h-4 text-neutral-700 shrink-0" />
              <span>Island Wide Cash On Delivery</span>
            </div>
            <div className="flex items-center gap-3">
              <ShieldCheck className="w-4 h-4 text-neutral-700 shrink-0" />
              <span>100% Secure Checkout</span>
            </div>
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-4 h-4 text-neutral-700 shrink-0" />
              <span>100% Genuine Brands</span>
            </div>
          </div>
        </div>
      </div>

      {/* VIEW SIMILAR PRODUCTS (Screenshot 1 bottom section) */}
      <section className="mt-20 pt-10 border-t border-neutral-200">
        <h2 className="text-base sm:text-lg font-black uppercase tracking-wider text-black mb-6">
          VIEW SIMILAR PRODUCTS
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          {similarProducts.map((p) => (
            <ProductCard key={p._id || p.slug} product={p} />
          ))}
        </div>
      </section>
    </div>
  );
}
