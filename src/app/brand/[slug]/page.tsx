"use client";

import React, { useEffect, useState, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  MessageCircle,
  Truck,
  RotateCcw,
  Search,
  SlidersHorizontal,
  ChevronRight,
  ExternalLink,
  Store,
} from "lucide-react";
import ProductCard from "@/components/ProductCard";
import { IBrand, IProduct } from "@/types";

export default function BrandStorePage() {
  const params = useParams();
  const router = useRouter();
  const slug = (params?.slug as string) || "";

  const [brand, setBrand] = useState<IBrand | null>(null);
  const [allBrands, setAllBrands] = useState<IBrand[]>([]);
  const [products, setProducts] = useState<IProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Filter & Search states
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortOption, setSortOption] = useState<"featured" | "price-asc" | "price-desc" | "name">("featured");

  useEffect(() => {
    async function loadBrandStore() {
      setIsLoading(true);
      try {
        // 1. Fetch brand details & all brands
        const [brandRes, allBrandsRes] = await Promise.all([
          fetch(`/api/brands/${slug}`),
          fetch("/api/brands"),
        ]);

        if (brandRes.ok) {
          const brandData: IBrand = await brandRes.json();
          setBrand(brandData);

          // 2. Fetch products for this brand
          const prodRes = await fetch(`/api/products?brand=${encodeURIComponent(brandData.name)}`);
          if (prodRes.ok) {
            const prodData = await prodRes.json();
            setProducts(prodData.products || []);
          }
        }

        if (allBrandsRes.ok) {
          const allData: IBrand[] = await allBrandsRes.json();
          setAllBrands(allData);
        }
      } catch (err) {
        console.error("Failed to load brand store:", err);
      } finally {
        setIsLoading(false);
      }
    }

    if (slug) {
      loadBrandStore();
    }
  }, [slug]);

  // Available categories for this brand
  const availableCategories = useMemo(() => {
    const set = new Set<string>();
    products.forEach((p) => {
      if (p.category) set.add(p.category);
    });
    return Array.from(set);
  }, [products]);

  // Filtered & sorted products
  const filteredProducts = useMemo(() => {
    let result = products;

    if (selectedCategory !== "all") {
      result = result.filter(
        (p) => p.category?.toLowerCase() === selectedCategory.toLowerCase()
      );
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.description?.toLowerCase().includes(q) ||
          p.sku.toLowerCase().includes(q)
      );
    }

    if (sortOption === "price-asc") {
      result = [...result].sort((a, b) => a.price - b.price);
    } else if (sortOption === "price-desc") {
      result = [...result].sort((a, b) => b.price - a.price);
    } else if (sortOption === "name") {
      result = [...result].sort((a, b) => a.name.localeCompare(b.name));
    }

    return result;
  }, [products, selectedCategory, searchQuery, sortOption]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center p-8">
        <div className="w-10 h-10 border-4 border-black border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-xs uppercase font-extrabold tracking-widest text-neutral-500">
          Loading Official Brand Storefront...
        </p>
      </div>
    );
  }

  if (!brand) {
    return (
      <div className="min-h-[70vh] bg-white flex flex-col items-center justify-center p-8 text-center">
        <Store className="w-12 h-12 text-neutral-400 mb-4" />
        <h1 className="text-xl font-black uppercase tracking-wider text-black">
          Brand Shop Not Found
        </h1>
        <p className="text-xs text-neutral-500 mt-1 max-w-sm">
          We could not locate this brand store. It may have been renamed or relocated.
        </p>
        <Link
          href="/#brands"
          className="mt-6 bg-black text-white px-6 py-3 rounded-full text-xs font-bold uppercase tracking-wider hover:bg-neutral-800 transition-colors"
        >
          Explore All Official Brands
        </Link>
      </div>
    );
  }

  const defaultBanner =
    brand.banner ||
    "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1600&q=80";

  return (
    <div className="min-h-screen bg-[#fafafb] text-neutral-900 pb-20">
      {/* 1. Breadcrumbs */}
      <div className="bg-white border-b border-neutral-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
          <nav className="text-[11px] font-bold uppercase tracking-wider text-neutral-500 flex items-center gap-2">
            <Link href="/" className="hover:text-black transition-colors">
              HOME
            </Link>
            <span>/</span>
            <Link href="/#brands" className="hover:text-black transition-colors">
              BRANDS
            </Link>
            <span>/</span>
            <span className="text-black font-extrabold">{brand.name} OFFICIAL</span>
          </nav>
        </div>
      </div>

      {/* 2. Brand Hero Flagship Banner */}
      <div className="relative bg-neutral-900 text-white overflow-hidden">
        {/* Background Image Banner */}
        <div className="absolute inset-0 z-0">
          <Image
            src={defaultBanner}
            alt={`${brand.name} Flagship Store Banner`}
            fill
            priority
            className="object-cover opacity-35"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-black/30" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-16 sm:py-20 flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div className="max-w-2xl space-y-4">
            {/* Verified Brand Badge */}
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-widest text-white border border-white/20">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>OFFICIAL BRAND FLAGSHIP STORE</span>
            </div>

            {/* Brand Title */}
            <div>
              <h1
                className={`text-4xl sm:text-5xl font-black tracking-tight ${
                  brand.slug === "waves"
                    ? "font-serif italic text-orange-400 lowercase text-5xl sm:text-6xl"
                    : "text-white uppercase"
                }`}
              >
                {brand.name}
              </h1>
              {brand.tagline && (
                <p className="text-sm sm:text-base font-semibold text-neutral-200 mt-2">
                  {brand.tagline}
                </p>
              )}
            </div>

            {/* Description */}
            <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed max-w-xl">
              {brand.description}
            </p>

            {/* Trust Points */}
            <div className="flex flex-wrap items-center gap-4 pt-2 text-[11px] font-bold text-neutral-300">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                100% Authentic Guaranteed
              </span>
              <span className="flex items-center gap-1.5">
                <Truck className="w-3.5 h-3.5 text-white" />
                Islandwide Doorstep COD
              </span>
              <span className="flex items-center gap-1.5">
                <RotateCcw className="w-3.5 h-3.5 text-white" />
                7-Day Colombo Exchange
              </span>
            </div>
          </div>

          {/* Right Brand Actions */}
          <div className="flex flex-col sm:flex-row md:flex-col gap-3 shrink-0">
            <a
              href={`https://wa.me/94763473075?text=${encodeURIComponent(
                `Hi TBH! I am visiting the ${brand.name} Brand Store and would like styling assistance.`
              )}`}
              target="_blank"
              rel="noreferrer"
              className="bg-emerald-600 hover:bg-emerald-500 text-white px-5 py-3 rounded-full text-xs font-black uppercase tracking-wider transition-colors flex items-center justify-center gap-2 shadow-lg"
            >
              <MessageCircle className="w-4 h-4" />
              <span>WhatsApp Brand Concierge</span>
            </a>

            <div className="bg-black/60 backdrop-blur-md border border-white/10 rounded-2xl p-4 text-center">
              <span className="text-2xl font-black text-white block">
                {products.length}
              </span>
              <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">
                Official Catalog Items
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Main Catalog Workspace */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
        {/* Toolbar: Category Chips, Search & Sort */}
        <div className="bg-white border border-neutral-200/90 rounded-2xl p-4 sm:p-5 shadow-xs space-y-4 mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            {/* Category Pills */}
            <div className="flex items-center gap-2 overflow-x-auto scrollbar-none pb-1 md:pb-0">
              <button
                onClick={() => setSelectedCategory("all")}
                className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap cursor-pointer ${
                  selectedCategory === "all"
                    ? "bg-black text-white shadow-xs"
                    : "bg-neutral-100 text-neutral-700 hover:bg-neutral-200"
                }`}
              >
                All Items ({products.length})
              </button>
              {availableCategories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap cursor-pointer ${
                    selectedCategory.toLowerCase() === cat.toLowerCase()
                      ? "bg-black text-white shadow-xs"
                      : "bg-neutral-100 text-neutral-700 hover:bg-neutral-200"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Search & Sort Controls */}
            <div className="flex items-center gap-3">
              {/* Search input */}
              <div className="relative flex-1 sm:w-64">
                <Search className="w-3.5 h-3.5 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={`Search in ${brand.name}...`}
                  className="w-full bg-neutral-50 text-neutral-900 placeholder-neutral-400 border border-neutral-200 rounded-full pl-8 pr-3 py-2 text-xs font-medium focus:outline-hidden focus:border-black"
                />
              </div>

              {/* Sort Selector */}
              <select
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value as any)}
                className="bg-neutral-50 border border-neutral-200 text-neutral-800 rounded-full px-3 py-2 text-xs font-bold focus:outline-hidden cursor-pointer"
              >
                <option value="featured">Sort: Featured</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="name">Name: A to Z</option>
              </select>
            </div>
          </div>
        </div>

        {/* 4. Products Grid */}
        {filteredProducts.length > 0 ? (
          <div>
            <div className="flex items-center justify-between mb-5">
              <span className="text-xs font-black uppercase tracking-wider text-neutral-500">
                Showing {filteredProducts.length} items from {brand.name}
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
              {filteredProducts.map((product) => (
                <ProductCard key={product._id || product.slug} product={product} />
              ))}
            </div>
          </div>
        ) : (
          <div className="bg-white border border-neutral-200 rounded-3xl p-12 text-center my-6">
            <Store className="w-10 h-10 text-neutral-400 mx-auto mb-3" />
            <h3 className="text-sm font-black uppercase tracking-wider text-neutral-900">
              No products found
            </h3>
            <p className="text-xs text-neutral-500 mt-1 max-w-sm mx-auto">
              There are currently no items matching your filter criteria in the {brand.name} catalog.
            </p>
            <button
              onClick={() => {
                setSelectedCategory("all");
                setSearchQuery("");
                setSortOption("featured");
              }}
              className="mt-4 text-xs font-bold text-black underline uppercase tracking-wider cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        )}

        {/* 5. Brand Heritage & Story Section */}
        {brand.story && (
          <section className="mt-16 bg-white border border-neutral-200/90 rounded-3xl p-8 sm:p-10 shadow-xs">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-neutral-400 mb-2">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>BRAND HERITAGE &amp; PHILOSOPHY</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-neutral-950">
                The {brand.name} Story
              </h2>
              <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed mt-3">
                {brand.story}
              </p>
            </div>
          </section>
        )}

        {/* 6. Browse Other Official Brands Row */}
        <section className="mt-16 pt-12 border-t border-neutral-200">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-base sm:text-lg font-black uppercase tracking-wider text-neutral-950">
                EXPLORE MORE BRAND STORES
              </h3>
              <p className="text-xs text-neutral-500">Discover other verified flagship brand partners</p>
            </div>
            <Link
              href="/#brands"
              className="text-xs font-bold uppercase tracking-wider text-neutral-700 hover:text-black"
            >
              VIEW ALL BRANDS →
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-8 gap-3">
            {allBrands
              .filter((b) => b.slug !== brand.slug)
              .map((b) => (
                <Link
                  key={b.slug}
                  href={`/brand/${b.slug}`}
                  className="bg-white border border-neutral-200 rounded-2xl p-4 text-center hover:border-black hover:shadow-sm transition-all flex flex-col items-center justify-center min-h-[90px] group"
                >
                  <span
                    className={`text-xs tracking-wider transition-colors ${
                      b.slug === "waves"
                        ? "font-serif italic text-orange-600 font-bold"
                        : "font-black uppercase text-neutral-800 group-hover:text-black"
                    }`}
                  >
                    {b.name}
                  </span>
                  <span className="text-[9px] uppercase tracking-widest font-bold text-neutral-400 mt-1">
                    Storefront →
                  </span>
                </Link>
              ))}
          </div>
        </section>
      </main>
    </div>
  );
}

