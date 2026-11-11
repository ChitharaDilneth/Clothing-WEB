import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Sparkles, Shield, Heart, Award } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
      <div className="text-center max-w-2xl mx-auto mb-12">
        <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">
          OUR STORY
        </span>
        <h1 className="text-3xl sm:text-5xl font-black uppercase tracking-wider text-black mt-1">
          TBH — THE BRAND HUB
        </h1>
        <p className="text-xs sm:text-sm text-neutral-600 mt-3 leading-relaxed">
          Sri Lanka’s premier lifestyle destination connecting conscious coastal aesthetics, artisanal footwear, and cutting-edge fashion technology.
        </p>
      </div>

      <div className="space-y-12">
        <div className="relative aspect-16/9 rounded-3xl overflow-hidden shadow-sm">
          <Image
            src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80"
            alt="Sri Lanka Coastline"
            fill
            className="object-cover"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-xs text-neutral-700 leading-relaxed">
          <div className="border border-neutral-200 rounded-2xl p-6 bg-neutral-50/50">
            <Sparkles className="w-6 h-6 text-black mb-3" />
            <h3 className="font-bold text-black uppercase tracking-wider text-sm">
              Artisanal Heritage
            </h3>
            <p className="mt-2 text-neutral-600">
              From our signature Waves coastal flip-flops and Ansel handcrafted loafers to eco-friendly beach ponchos, every product embodies authentic Sri Lankan craftsmanship.
            </p>
          </div>

          <div className="border border-neutral-200 rounded-2xl p-6 bg-neutral-50/50">
            <Shield className="w-6 h-6 text-black mb-3" />
            <h3 className="font-bold text-black uppercase tracking-wider text-sm">
              Sustainable Ethos
            </h3>
            <p className="mt-2 text-neutral-600">
              Crafted from eco-friendly materials, organic cotton, recycled rubber, and bamboo blends designed to endure island weather while honoring our oceans.
            </p>
          </div>

          <div className="border border-neutral-200 rounded-2xl p-6 bg-neutral-50/50">
            <Award className="w-6 h-6 text-black mb-3" />
            <h3 className="font-bold text-black uppercase tracking-wider text-sm">
              NeuralFit™ Fitting
            </h3>
            <p className="mt-2 text-neutral-600">
              Pioneering Sri Lanka’s first virtual drape and sizing intelligence studio so every shopper enjoys guaranteed fit accuracy before dispatch.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
