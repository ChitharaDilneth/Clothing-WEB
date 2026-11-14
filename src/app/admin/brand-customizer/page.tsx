"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Palette,
  Store,
  Sparkles,
  ExternalLink,
  Save,
  MessageCircle,
  Phone,
  Mail,
  ShieldCheck,
  CheckCircle2,
  RefreshCw,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { IBrand } from "@/types";
import { toast } from "sonner";

export default function BrandCustomizerPage() {
  const { user } = useAuth();
  const brandSlug = user?.brandSlug || "waves";

  const [brand, setBrand] = useState<IBrand | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // Form Fields
  const [tagline, setTagline] = useState("");
  const [banner, setBanner] = useState("");
  const [description, setDescription] = useState("");
  const [story, setStory] = useState("");
  const [phone, setPhone] = useState("+94 76 347 3075");
  const [email, setEmail] = useState("");

  const loadBrand = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/brands/${brandSlug}`);
      if (res.ok) {
        const data: IBrand = await res.json();
        setBrand(data);
        setTagline(data.tagline || "");
        setBanner(data.banner || "");
        setDescription(data.description || "");
        setStory(data.story || "");
        setPhone(data.phone || "+94 76 347 3075");
        setEmail(data.email || "");
      }
    } catch (err) {
      console.error("Failed to load brand data:", err);
      toast.error("Failed to load brand configuration");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (brandSlug) {
      loadBrand();
    }
  }, [brandSlug]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!brand) return;

    setIsSaving(true);
    try {
      const res = await fetch(`/api/brands/${brand.slug}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tagline,
          banner,
          description,
          story,
          phone,
          email,
        }),
      });

      if (res.ok) {
        toast.success("Brand Storefront customized successfully!");
        loadBrand();
      } else {
        const data = await res.json();
        toast.error(data.message || "Failed to update storefront");
      }
    } catch {
      toast.error("Network error while saving changes");
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-16 text-center text-neutral-400">
        <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p className="text-xs uppercase tracking-widest font-bold">
          Loading Storefront Customizer...
        </p>
      </div>
    );
  }

  if (!brand) {
    return (
      <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-12 text-center text-neutral-400">
        <Store className="w-10 h-10 text-neutral-600 mx-auto mb-3" />
        <p className="text-xs">No brand profile linked to your account.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 antialiased max-w-5xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 bg-neutral-900 border border-neutral-800 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest text-amber-400 mb-2">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>OFFICIAL BRAND STOREFRONT CUSTOMIZER</span>
          </div>
          <h1 className="text-2xl font-black uppercase tracking-wider text-white">
            {brand.name} Storefront Page Settings
          </h1>
          <p className="text-xs text-neutral-400 mt-1">
            Customize how your flagship store looks to customers visiting{" "}
            <code className="text-white font-mono bg-neutral-900 px-1.5 py-0.5 rounded-sm">
              /brand/{brand.slug}
            </code>
            .
          </p>
        </div>

        <Link
          href={`/brand/${brand.slug}`}
          target="_blank"
          className="bg-white text-black hover:bg-neutral-200 px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 shadow-sm transition-colors cursor-pointer"
        >
          <ExternalLink className="w-4 h-4" />
          <span>View Live Storefront</span>
        </Link>
      </div>

      {/* Main Form */}
      <form onSubmit={handleSave} className="space-y-6">
        {/* Live Banner Preview Card */}
        <div className="bg-neutral-900 border border-neutral-800 rounded-3xl overflow-hidden p-6 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black uppercase tracking-wider text-neutral-300">
              Hero Cover Banner Preview
            </span>
            <span className="text-[11px] text-neutral-500 font-mono">
              Aspect Ratio 16:9 or 21:9 recommended
            </span>
          </div>

          <div className="relative h-48 w-full rounded-2xl overflow-hidden bg-neutral-950 border border-neutral-800">
            {banner ? (
              <Image
                src={banner}
                alt="Banner Preview"
                fill
                className="object-cover opacity-70"
                sizes="(max-width: 1024px) 100vw, 70vw"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-xs text-neutral-500">
                No banner image provided
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
            <div className="absolute bottom-4 left-6">
              <span className="text-2xl font-black uppercase text-white tracking-wider block">
                {brand.name}
              </span>
              <span className="text-xs font-semibold text-neutral-200">
                {tagline || "Your brand tagline will appear here"}
              </span>
            </div>
          </div>

          <div>
            <label className="font-extrabold uppercase tracking-wider text-neutral-300 block mb-1 text-[11px]">
              Cover Banner Image URL
            </label>
            <input
              type="url"
              value={banner}
              onChange={(e) => setBanner(e.target.value)}
              placeholder="https://images.unsplash.com/photo-..."
              className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2.5 text-white font-mono text-xs focus:outline-hidden focus:border-white"
            />
          </div>
        </div>

        {/* Brand Information & Story */}
        <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-6 space-y-4">
          <h3 className="text-xs font-black uppercase tracking-wider text-white">
            Brand Identity &amp; Storytelling
          </h3>

          <div>
            <label className="font-extrabold uppercase tracking-wider text-neutral-300 block mb-1 text-[11px]">
              Brand Catchphrase / Tagline
            </label>
            <input
              type="text"
              value={tagline}
              onChange={(e) => setTagline(e.target.value)}
              placeholder="e.g. Sri Lanka's Premier Flip-Flops & Sustainable Beachwear"
              className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2.5 text-white font-medium text-xs focus:outline-hidden focus:border-white"
            />
          </div>

          <div>
            <label className="font-extrabold uppercase tracking-wider text-neutral-300 block mb-1 text-[11px]">
              Short Storefront Description
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="A concise summary of what your brand offers..."
              className="w-full bg-neutral-950 border border-neutral-800 rounded-xl p-3 text-white text-xs focus:outline-hidden focus:border-white"
            />
          </div>

          <div>
            <label className="font-extrabold uppercase tracking-wider text-neutral-300 block mb-1 text-[11px]">
              Brand Heritage &amp; Full Story
            </label>
            <textarea
              rows={4}
              value={story}
              onChange={(e) => setStory(e.target.value)}
              placeholder="Tell customers how your brand was founded, materials used, ethical production, island roots..."
              className="w-full bg-neutral-950 border border-neutral-800 rounded-xl p-3 text-white text-xs leading-relaxed focus:outline-hidden focus:border-white"
            />
          </div>
        </div>

        {/* Customer Support & Concierge */}
        <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-6 space-y-4">
          <h3 className="text-xs font-black uppercase tracking-wider text-white flex items-center gap-2">
            <MessageCircle className="w-4 h-4 text-emerald-400" />
            <span>Store Customer Service &amp; WhatsApp Concierge</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="font-extrabold uppercase tracking-wider text-neutral-300 block mb-1 text-[11px]">
                WhatsApp Direct Number
              </label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+94 76 347 3075"
                className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2.5 text-white text-xs font-medium focus:outline-hidden focus:border-white"
              />
              <span className="text-[10px] text-neutral-500 mt-1 block">
                Customers will be routed to this WhatsApp number when clicking the brand concierge button.
              </span>
            </div>

            <div>
              <label className="font-extrabold uppercase tracking-wider text-neutral-300 block mb-1 text-[11px]">
                Customer Support Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="waves@thebrandhub.lk"
                className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2.5 text-white text-xs font-medium focus:outline-hidden focus:border-white"
              />
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="submit"
            disabled={isSaving}
            className="bg-white text-black hover:bg-neutral-200 px-8 py-3 rounded-xl text-xs font-black uppercase tracking-wider transition-colors flex items-center gap-2 shadow-lg cursor-pointer disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{isSaving ? "Saving Changes..." : "Save Storefront Changes"}</span>
          </button>
        </div>
      </form>
    </div>
  );
}

