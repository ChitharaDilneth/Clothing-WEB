"use client";

import React, { useEffect, useState, useMemo } from "react";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { SlidersHorizontal, X, RotateCcw, ChevronDown } from "lucide-react";
import ProductCard from "@/components/ProductCard";
import { IProduct, IBrand } from "@/types";

export default function CategoryPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();

  const slug = (params?.slug as string) || "all";
  const categoryTitle = slug === "all" ? "ALL PRODUCTS" : slug.toUpperCase();

  const [products, setProducts] = useState<IProduct[]>([]);
  const [brands, setBrands] = useState<IBrand[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);

  // Filters state
  const [selectedBrand, setSelectedBrand] = useState<string>(searchParams.get("brand") || "all");
  const [sortOption, setSortOption] = useState<string>("featured");
  const [priceRange, setPriceRange] = useState<number>(10000);
  const [searchQuery, setSearchQuery] = useState<string>(searchParams.get("search") || "");

  useEffect(() => {
    async function loadData() {
      setIsLoading(true);
      try {
        const queryParams = new URLSearchParams();
        if (slug !== "all") queryParams.set("category", slug);
        if (selectedBrand !== "all") queryParams.set("brand", selectedBrand);
        if (searchQuery) queryParams.set("search", searchQuery);

        const [prodRes, brandRes] = await Promise.all([
          fetch(`/api/products?${queryParams.toString()}`),
          fetch("/api/brands"),
        ]);

        const prodData = await prodRes.json();
        const brandData = await brandRes.json();

        setProducts(prodData.products || []);
        setBrands(brandData || []);
      } catch (err) {
        console.error("Failed to load category products:", err);
      } finally {
        setIsLoading(false);
      }
    }

    loadData();
  }, [slug, selectedBrand, searchQuery]);

  const filteredProducts = useMemo(() => {
    let result = products.filter((p) => p.price <= priceRange);

    if (sortOption === "price-asc") {
      result = [...result].sort((a, b) => a.price - b.price);
    } else if (sortOption === "price-desc") {
      result = [...result].sort((a, b) => b.price - a.price);
    } else if (sortOption === "name-asc") {
      result = [...result].sort((a, b) => a.name.localeCompare(b.name));
    }
    return result;
  }, [products, priceRange, sortOption]);

  const resetFilters = () => {
    setSelectedBrand("all");
    setSortOption("featured");
    setPriceRange(10000);
    setSearchQuery("");
  };

  // 3 Category Hero Banner Cards (shown for WOMEN category as in Screenshot 2)
  const isWomenCategory = slug.toLowerCase() === "women";

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
      {/* Category Heading */}
      <div className="mb-6">
        <h1 className="text-3xl sm:text-5xl font-black uppercase tracking-wider text-black">
          {categoryTitle}
        </h1>
      </div>

      {/* 3 Top Category Hero Banners (Screenshot 2) */}
      {isWomenCategory && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 mb-10">
          {/* Card 1: Formal Footwear */}
          <div className="relative aspect-16/10 rounded-2xl overflow-hidden shadow-xs group">
            <Image
              src="https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=600&q=80"
              alt="Formal Footwear Collection"
              fill
              className="object-cover group-hover:scale-104 transition-transform duration-500 brightness-90"
            />
            <div className="absolute inset-0 bg-black/25 flex items-end p-6">
              <span className="text-white text-base sm:text-lg font-black uppercase tracking-wider leading-tight drop-shadow-md">
                FORMAL<br />FOOTWEAR
              </span>
            </div>
          </div>

          {/* Card 2: Beach Sandals & Shop Now */}
          <div className="relative aspect-16/10 rounded-2xl overflow-hidden shadow-xs group">
            <Image
              src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80"
              alt="Beach Sandals Collection"
              fill
              className="object-cover group-hover:scale-104 transition-transform duration-500 brightness-95"
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="bg-white text-black text-xs font-black uppercase tracking-wider px-5 py-2.5 rounded-full shadow-md flex items-center gap-1.5 hover:bg-neutral-100 transition-colors">
                SHOP NOW →
              </span>
            </div>
          </div>

          {/* Card 3: Clothing */}
          <div className="relative aspect-16/10 rounded-2xl overflow-hidden shadow-xs group">
            <Image
              src="https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=600&q=80"
              alt="Women Clothing Collection"
              fill
              className="object-cover group-hover:scale-104 transition-transform duration-500 brightness-90"
            />
            <div className="absolute inset-0 bg-black/25 flex items-end p-6">
              <span className="text-white text-base sm:text-lg font-black uppercase tracking-wider leading-tight drop-shadow-md">
                CLOTHING
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Filter Header Bar */}
      <div className="flex items-center justify-between py-3.5 border-y border-neutral-200 mb-8">
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-black hover:text-neutral-600 transition-colors"
        >
          <SlidersHorizontal className="w-4 h-4" />
          <span>{showFilters ? "Hide Filters" : "Show Filters"}</span>
        </button>

        <div className="flex items-center gap-4 text-xs font-bold text-neutral-800">
          <span>{filteredProducts.length} Products</span>

          <div className="hidden sm:flex items-center gap-1.5 pl-4 border-l border-neutral-200">
            <span className="text-neutral-400 font-normal">Sort:</span>
            <select
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
              className="bg-transparent font-bold text-xs focus:outline-hidden cursor-pointer"
            >
              <option value="featured">Featured</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="name-asc">Alphabetical</option>
            </select>
          </div>
        </div>
      </div>

      {/* Collapsible Filter Panel */}
      {showFilters && (
        <div className="mb-8 p-6 bg-neutral-50 rounded-2xl border border-neutral-200 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 text-xs transition-all">
          {/* Brand Filter */}
          <div>
            <label className="font-extrabold uppercase tracking-wider text-black block mb-2">
              Brand
            </label>
            <select
              value={selectedBrand}
              onChange={(e) => setSelectedBrand(e.target.value)}
              className="w-full bg-white border border-neutral-300 rounded-lg p-2 font-medium focus:outline-hidden focus:border-black"
            >
              <option value="all">All Brands</option>
              {brands.map((b) => (
                <option key={b.slug} value={b.name}>
                  {b.name}
                </option>
              ))}
            </select>
          </div>

          {/* Max Price Filter Slider */}
          <div>
            <div className="flex justify-between font-extrabold uppercase tracking-wider text-black mb-2">
              <span>Max Price</span>
              <span className="text-neutral-600">Rs. {priceRange.toLocaleString()}</span>
            </div>
            <input
              type="range"
              min="1000"
              max="10000"
              step="500"
              value={priceRange}
              onChange={(e) => setPriceRange(Number(e.target.value))}
              className="w-full accent-black cursor-pointer"
            />
          </div>

          {/* Quick Category Switcher */}
          <div>
            <label className="font-extrabold uppercase tracking-wider text-black block mb-2">
              Category
            </label>
            <div className="flex flex-wrap gap-1.5">
              {["women", "men", "bags", "clothing", "health"].map((cat) => (
                <Link
                  key={cat}
                  href={`/category/${cat}`}
                  className={`px-2.5 py-1 rounded-md text-[11px] font-bold uppercase ${
                    slug.toLowerCase() === cat
                      ? "bg-black text-white"
                      : "bg-white border border-neutral-300 text-neutral-700 hover:border-black"
                  }`}
                >
                  {cat}
                </Link>
              ))}
            </div>
          </div>

          {/* Reset Filters */}
          <div className="flex items-end">
            <button
              onClick={resetFilters}
              className="w-full flex items-center justify-center gap-1.5 bg-neutral-200 hover:bg-neutral-300 text-black font-bold uppercase tracking-wider py-2 rounded-lg transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Filters</span>
            </button>
          </div>
        </div>
      )}

      {/* Main 4-Column Responsive Grid */}
      {isLoading ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 py-12">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <div key={i} className="animate-pulse space-y-3">
              <div className="aspect-square bg-neutral-200 rounded-3xl" />
              <div className="h-4 bg-neutral-200 rounded w-3/4" />
              <div className="h-4 bg-neutral-200 rounded w-1/2" />
            </div>
          ))}
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="py-20 text-center text-neutral-500">
          <p className="text-base font-bold text-black">No products matched your criteria</p>
          <p className="text-xs text-neutral-400 mt-1">Try broadening your price range or brand filters.</p>
          <button
            onClick={resetFilters}
            className="mt-5 px-6 py-2 bg-black text-white text-xs font-bold rounded-full hover:bg-neutral-800"
          >
            Clear Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 sm:gap-x-6 gap-y-10">
          {filteredProducts.map((product) => (
            <ProductCard key={product._id || product.slug} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
