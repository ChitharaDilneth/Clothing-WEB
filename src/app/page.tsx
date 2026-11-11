import React from "react";
import Link from "next/link";
import Image from "next/image";
import ProductGrid from "@/components/ProductGrid";
import { getProducts, getBanners, getBrands } from "@/lib/store";
import { ArrowRight, Sparkles } from "lucide-react";

export const revalidate = 0; // Ensure live data updates

export default async function HomePage() {
  const { products } = await getProducts({ limit: 8 });
  const banners = await getBanners();
  const brands = await getBrands();

  const heroBanner = banners.find((b) => b.position === "hero") || {
    title: "HIKKADUWA",
    subtitle: "AUTHENTIC COASTAL FOOTWEAR",
    ctaText: "SHOP NOW ->",
    ctaLink: "/category/women",
    imageUrl: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1600&q=80",
  };

  const newAndNowCards = [
    {
      title: "FOOTWEAR",
      href: "/category/women",
      image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=800&q=80",
    },
    {
      title: "CLOTHING",
      href: "/category/clothing",
      image: "https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?auto=format&fit=crop&w=800&q=80",
    },
    {
      title: "ACCESSORY",
      href: "/category/bags",
      image: "https://images.unsplash.com/photo-1523293182086-7651a899d37f?auto=format&fit=crop&w=800&q=80",
    },
    {
      title: "BESTSELLER",
      href: "/category/women",
      image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=800&q=80",
    },
  ];

  const sortAndShopTiles = [
    {
      title: "WOMEN",
      href: "/category/women",
      image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=800&q=80",
    },
    {
      title: "MEN",
      href: "/category/men",
      image: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=800&q=80",
    },
    {
      title: "KIDS",
      href: "/category/kids",
      image: "https://images.unsplash.com/photo-1503919545889-aef636e10ad4?auto=format&fit=crop&w=800&q=80",
    },
    {
      title: "UNISEX",
      href: "/category/unisex",
      image: "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=800&q=80",
    },
  ];

  return (
    <div className="w-full pb-12">
      {/* 1. HERO BANNER: HIKKADUWA AUTHENTIC COASTAL FOOTWEAR */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 sm:pt-6">
        <div className="relative w-full rounded-2xl sm:rounded-3xl overflow-hidden min-h-[360px] sm:min-h-[460px] flex items-center justify-center text-center shadow-sm">
          {/* Background beach landscape */}
          <Image
            src={heroBanner.imageUrl}
            alt={heroBanner.title}
            fill
            priority
            className="object-cover brightness-95"
          />

          <div className="relative z-10 px-4 py-8 max-w-2xl mx-auto flex flex-col items-center">
            <h1 className="text-3xl sm:text-5xl md:text-6xl font-black uppercase tracking-wider text-black drop-shadow-xs">
              {heroBanner.title}
            </h1>
            <p className="text-xs sm:text-sm font-bold uppercase tracking-widest text-neutral-800 mt-2">
              {heroBanner.subtitle}
            </p>

            {/* 3 Floating Product Cards in Hero */}
            <div className="flex items-center justify-center gap-3 sm:gap-4 my-6">
              <div className="w-16 h-12 sm:w-24 sm:h-16 rounded-lg bg-white/90 backdrop-blur-xs p-1 shadow-md border border-white/80 overflow-hidden transform -rotate-3 hover:rotate-0 transition-transform">
                <Image
                  src="https://images.unsplash.com/photo-1560769629-975ec94e6a86?auto=format&fit=crop&w=300&q=80"
                  alt="Coastal Sandal Left"
                  width={96}
                  height={64}
                  className="w-full h-full object-cover rounded"
                />
              </div>
              <div className="w-18 h-14 sm:w-28 sm:h-18 rounded-lg bg-white/90 backdrop-blur-xs p-1 shadow-lg border border-white/80 overflow-hidden transform scale-110 hover:scale-115 transition-transform z-10">
                <Image
                  src="https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=300&q=80"
                  alt="Coastal Sandal Center"
                  width={112}
                  height={72}
                  className="w-full h-full object-cover rounded"
                />
              </div>
              <div className="w-16 h-12 sm:w-24 sm:h-16 rounded-lg bg-white/90 backdrop-blur-xs p-1 shadow-md border border-white/80 overflow-hidden transform rotate-3 hover:rotate-0 transition-transform">
                <Image
                  src="https://images.unsplash.com/photo-1603808033192-082d6919d3e1?auto=format&fit=crop&w=300&q=80"
                  alt="Coastal Sandal Right"
                  width={96}
                  height={64}
                  className="w-full h-full object-cover rounded"
                />
              </div>
            </div>

            <Link
              href={heroBanner.ctaLink || "/category/women"}
              className="inline-flex items-center gap-2 bg-black text-white text-xs font-black uppercase tracking-wider py-2.5 px-6 rounded-full hover:bg-neutral-800 transition-colors shadow-sm"
            >
              <span>{heroBanner.ctaText || "SHOP NOW"}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </section>

      {/* 2. NEW & NOW SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 sm:pt-16">
        <h2 className="text-base sm:text-lg font-black uppercase tracking-wider text-black mb-5">
          NEW & NOW
        </h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {newAndNowCards.map((card) => (
            <Link
              key={card.title}
              href={card.href}
              className="group relative aspect-3/4 rounded-2xl overflow-hidden shadow-xs block"
            >
              <Image
                src={card.image}
                alt={card.title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
                sizes="(max-width: 640px) 50vw, 25vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
              <div className="absolute bottom-4 inset-x-0 text-center">
                <span className="text-white text-xs sm:text-sm font-black uppercase tracking-widest px-3 py-1 bg-black/40 backdrop-blur-xs rounded-full">
                  {card.title}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 3. CUSTOMIZE YOUR OWN WAVES PROMO BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 sm:pt-16">
        <div className="border border-neutral-200 rounded-2xl sm:rounded-3xl overflow-hidden p-6 sm:p-10 flex flex-col md:flex-row items-center justify-between gap-8 bg-neutral-50/60 shadow-xs">
          <div className="w-full md:w-1/2 aspect-16/10 rounded-xl overflow-hidden relative shadow-sm">
            <Image
              src="https://images.unsplash.com/photo-1519046904884-53103b34b206?auto=format&fit=crop&w=1000&q=80"
              alt="Customize Your Own Waves Sandal Studio"
              fill
              className="object-cover hover:scale-103 transition-transform duration-500"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>

          <div className="w-full md:w-1/2 max-w-md text-left">
            <div className="inline-flex items-center gap-1.5 text-amber-600 bg-amber-50 px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              Interactive Design Studio
            </div>
            <h2 className="text-xl sm:text-2xl font-black uppercase tracking-wider text-black">
              CUSTOMIZE YOUR OWN WAVES
            </h2>
            <p className="text-xs sm:text-sm text-neutral-600 mt-2 leading-relaxed">
              Create your unique pair today and stride through life with a personalized touch. Select base models, apply custom colors, monogram initials or upload artwork.
            </p>
            <div className="mt-6">
              <Link
                href="/customizer"
                className="inline-block bg-black text-white text-xs font-black uppercase tracking-wider py-3 px-7 rounded-full hover:bg-neutral-800 transition-colors shadow-sm"
              >
                CUSTOMIZE NOW
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 4. SORT & SHOP TILES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 sm:pt-16">
        <h2 className="text-base sm:text-lg font-black uppercase tracking-wider text-black mb-5">
          SORT & SHOP
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
          {sortAndShopTiles.map((tile) => (
            <Link
              key={tile.title}
              href={tile.href}
              className="group relative aspect-16/9 rounded-2xl overflow-hidden block shadow-xs"
            >
              <Image
                src={tile.image}
                alt={tile.title}
                fill
                className="object-cover group-hover:scale-104 transition-transform duration-500"
                sizes="(max-width: 640px) 100vw, 50vw"
              />
              <div className="absolute inset-0 bg-black/35 group-hover:bg-black/25 transition-colors flex items-center justify-center">
                <span className="text-white text-xl sm:text-3xl font-black uppercase tracking-widest drop-shadow-md">
                  {tile.title}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 5. SHOP BY BRANDS */}
      <section id="brands" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 sm:pt-16">
        <h2 className="text-base sm:text-lg font-black uppercase tracking-wider text-black mb-5">
          SHOP BY BRANDS
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 sm:gap-4">
          {brands.map((b) => (
            <Link
              key={b.slug}
              href={`/category/all?brand=${b.name}`}
              className="border border-neutral-200 rounded-xl py-6 px-4 flex flex-col items-center justify-center hover:border-black hover:shadow-xs transition-all bg-white text-center group"
            >
              <span
                className={`text-sm sm:text-base tracking-widest ${
                  b.slug === "waves"
                    ? "font-serif italic font-bold text-orange-600 text-lg lowercase"
                    : "font-black uppercase text-neutral-800 group-hover:text-black"
                }`}
              >
                {b.name}
              </span>
              <span className="text-[10px] text-gray-400 mt-1 uppercase font-semibold">
                Explore Collection
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* 6. LIMITED TIME ONLY - 15% OFF PROMOTIONAL BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 sm:pt-16">
        <div className="bg-black text-white rounded-2xl sm:rounded-3xl p-6 sm:p-10 flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden shadow-md">
          <div className="max-w-md z-10">
            <span className="text-[10px] font-bold tracking-widest uppercase text-neutral-400">
              LIMITED TIME ONLY
            </span>
            <h2 className="text-2xl sm:text-4xl font-black uppercase tracking-wide mt-1 text-white">
              Get 15% Off
            </h2>
            <p className="text-xs sm:text-sm text-neutral-300 mt-2 leading-relaxed">
              Unbeatable deals made even more saving. Treat your feet today and shop our best deals across all Sri Lankan collections. Use coupon code <strong className="text-amber-400 font-bold">TBH15</strong> at checkout.
            </p>
            <div className="mt-5">
              <Link
                href="/category/women"
                className="inline-flex items-center gap-1.5 bg-white text-black text-xs font-black uppercase tracking-wider py-2.5 px-6 rounded-full hover:bg-neutral-200 transition-colors"
              >
                <span>SHOP NOW</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          <div className="w-full md:w-1/2 aspect-16/9 rounded-xl overflow-hidden relative shadow-inner">
            <Image
              src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80"
              alt="Footwear 15% discount collection"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>
        </div>
      </section>

      {/* 7. MUST HAVE PRODUCTS GRID */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 sm:pt-16">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-base sm:text-lg font-black uppercase tracking-wider text-black">
            MUST HAVE
          </h2>
          <Link
            href="/category/all"
            className="text-xs font-bold uppercase tracking-wider text-neutral-600 hover:text-black transition-colors"
          >
            VIEW ALL PRODUCTS →
          </Link>
        </div>

        <ProductGrid products={products} columns={4} />

        {/* 8. LOAD MORE PRODUCTS BUTTON */}
        <div className="mt-12 text-center">
          <Link
            href="/category/all"
            className="inline-block border border-neutral-300 hover:border-black text-black text-xs font-extrabold uppercase tracking-widest py-3 px-8 rounded-full transition-colors"
          >
            LOAD MORE PRODUCTS
          </Link>
        </div>
      </section>
    </div>
  );
}
