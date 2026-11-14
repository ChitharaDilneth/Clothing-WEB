"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Store,
  Plus,
  Search,
  Edit3,
  Trash2,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  X,
  Sparkles,
  Phone,
  Mail,
  Sliders,
  Layers,
} from "lucide-react";
import { IBrand, IProduct } from "@/types";
import { toast } from "sonner";

export default function AdminBrandsPage() {
  const [brands, setBrands] = useState<IBrand[]>([]);
  const [products, setProducts] = useState<IProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBrand, setEditingBrand] = useState<IBrand | null>(null);

  // Form Fields
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [tagline, setTagline] = useState("");
  const [banner, setBanner] = useState("");
  const [logo, setLogo] = useState("");
  const [description, setDescription] = useState("");
  const [story, setStory] = useState("");
  const [phone, setPhone] = useState("+94 76 347 3075");
  const [email, setEmail] = useState("");
  const [managerUsername, setManagerUsername] = useState("");
  const [managerPassword, setManagerPassword] = useState("");
  const [sortOrder, setSortOrder] = useState<number>(0);
  const [isActive, setIsActive] = useState(true);
  const [featured, setFeatured] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch data
  const loadData = async () => {
    setLoading(true);
    try {
      const [brandsRes, prodRes] = await Promise.all([
        fetch("/api/brands"),
        fetch("/api/products?limit=1000"),
      ]);
      const brandsData = await brandsRes.json();
      const prodData = await prodRes.json();

      setBrands(Array.isArray(brandsData) ? brandsData : []);
      setProducts(prodData.products || []);
    } catch (err) {
      console.error("Failed to load brands:", err);
      toast.error("Failed to fetch brand stores");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const openCreateModal = () => {
    setEditingBrand(null);
    setName("");
    setSlug("");
    setTagline("");
    setBanner("");
    setLogo("");
    setDescription("");
    setStory("");
    setPhone("+94 76 347 3075");
    setEmail("");
    setManagerUsername("");
    setManagerPassword("");
    setSortOrder(brands.length + 1);
    setIsActive(true);
    setFeatured(false);
    setIsModalOpen(true);
  };

  const openEditModal = (b: IBrand) => {
    setEditingBrand(b);
    setName(b.name);
    setSlug(b.slug);
    setTagline(b.tagline || "");
    setBanner(b.banner || "");
    setLogo(b.logo || "");
    setDescription(b.description || "");
    setStory(b.story || "");
    setPhone(b.phone || "+94 76 347 3075");
    setEmail(b.email || "");
    setManagerUsername(b.managerUsername || b.slug);
    setManagerPassword("");
    setSortOrder(b.sortOrder ?? brands.indexOf(b) + 1);
    setIsActive(b.isActive !== false);
    setFeatured(Boolean(b.featured));
    setIsModalOpen(true);
  };

  const handleNameChange = (val: string) => {
    setName(val);
    if (!editingBrand) {
      setSlug(
        val
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/(^-|-$)/g, "")
      );
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !slug.trim()) {
      toast.error("Brand name and slug are required");
      return;
    }

    setIsSubmitting(true);
    try {
      const brandPayload: Partial<IBrand> & { managerPassword?: string } = {
        name: name.trim(),
        slug: slug.trim().toLowerCase(),
        tagline: tagline.trim(),
        banner: banner.trim(),
        logo: logo.trim(),
        description: description.trim(),
        story: story.trim(),
        phone: phone.trim(),
        email: email.trim(),
        managerUsername: managerUsername.trim().toLowerCase() || slug.trim().toLowerCase(),
        ...(managerPassword.trim() ? { managerPassword: managerPassword.trim() } : {}),
        sortOrder: Number(sortOrder),
        isActive,
        featured,
      };

      if (editingBrand) {
        const res = await fetch(`/api/brands/${editingBrand._id || editingBrand.slug}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(brandPayload),
        });
        if (res.ok) {
          toast.success(`Updated ${name} Brand Store!`);
          setIsModalOpen(false);
          loadData();
        } else {
          toast.error("Failed to update brand");
        }
      } else {
        const res = await fetch("/api/brands", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(brandPayload),
        });
        if (res.ok) {
          toast.success(`Brand store ${name} registered successfully!`);
          setIsModalOpen(false);
          loadData();
        } else {
          toast.error("Failed to create brand");
        }
      }
    } catch {
      toast.error("Network error while saving brand");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (idOrSlug: string, brandName: string) => {
    if (!confirm(`Are you sure you want to delete the ${brandName} brand store?`)) return;
    try {
      const res = await fetch(`/api/brands/${idOrSlug}`, { method: "DELETE" });
      if (res.ok) {
        toast.success(`Deleted ${brandName}`);
        loadData();
      } else {
        toast.error("Failed to delete brand");
      }
    } catch {
      toast.error("Error deleting brand");
    }
  };

  // Filtered brands
  const filteredBrands = brands.filter(
    (b) =>
      b.name.toLowerCase().includes(search.toLowerCase()) ||
      b.slug.toLowerCase().includes(search.toLowerCase()) ||
      b.tagline?.toLowerCase().includes(search.toLowerCase())
  );

  // Products count map
  const productCountMap = React.useMemo(() => {
    const map: Record<string, number> = {};
    products.forEach((p) => {
      const b = (p.brand || "").toLowerCase();
      map[b] = (map[b] || 0) + 1;
    });
    return map;
  }, [products]);

  return (
    <div className="space-y-8 antialiased">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black uppercase tracking-wider text-neutral-900 flex items-center gap-2.5">
            <Store className="w-6 h-6 text-neutral-900" />
            <span>Brand Partner Flagship Stores</span>
          </h1>
          <p className="text-xs text-neutral-500 mt-1 font-medium">
            Manage partner brand storefronts, dedicated URLs, covers, stories, and vendor permissions.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="bg-black text-white hover:bg-neutral-800 px-5 py-2.5 rounded-2xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-sm transition-colors cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Brand Store</span>
        </button>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white border border-neutral-200/80 rounded-3xl p-5 shadow-[0_2px_16px_rgba(0,0,0,0.03)]">
          <span className="text-[10px] font-black uppercase tracking-widest text-neutral-400 block mb-1">
            Total Brand Partners
          </span>
          <span className="text-3xl font-black text-neutral-900">{brands.length}</span>
          <span className="text-[11px] text-emerald-600 font-bold block mt-1">
            {brands.filter((b) => b.isActive).length} Active Storefronts
          </span>
        </div>

        <div className="bg-white border border-neutral-200/80 rounded-3xl p-5 shadow-[0_2px_16px_rgba(0,0,0,0.03)]">
          <span className="text-[10px] font-black uppercase tracking-widest text-neutral-400 block mb-1">
            Total Multi-Vendor Catalog
          </span>
          <span className="text-3xl font-black text-neutral-900">{products.length}</span>
          <span className="text-[11px] text-neutral-500 block mt-1">
            Distributed across official brands
          </span>
        </div>

        <div className="bg-white border border-neutral-200/80 rounded-3xl p-5 shadow-[0_2px_16px_rgba(0,0,0,0.03)]">
          <span className="text-[10px] font-black uppercase tracking-widest text-neutral-400 block mb-1">
            Customer Entrypoint
          </span>
          <span className="text-xs font-bold text-neutral-900 block mt-2">
            Homepage &quot;SHOP BY BRANDS&quot;
          </span>
          <span className="text-[11px] text-[#ff5b33] font-bold block mt-0.5">
            Directly routed to /brand/[slug]
          </span>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white border border-neutral-200/80 rounded-3xl p-4 flex items-center justify-between gap-4 shadow-[0_2px_16px_rgba(0,0,0,0.03)]">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search brand name, slug or description..."
            className="w-full bg-neutral-50 text-neutral-900 placeholder-neutral-400 border border-neutral-200 rounded-2xl pl-10 pr-3 py-2 text-xs focus:outline-hidden focus:border-black font-medium"
          />
        </div>

        <span className="text-xs text-neutral-500 font-bold">
          Showing {filteredBrands.length} of {brands.length} Brands
        </span>
      </div>

      {/* Brands Grid */}
      {loading ? (
        <div className="bg-white border border-neutral-200/80 rounded-3xl p-12 text-center text-neutral-400 text-xs shadow-xs">
          Loading brand partners...
        </div>
      ) : filteredBrands.length === 0 ? (
        <div className="bg-white border border-neutral-200/80 rounded-3xl p-12 text-center shadow-xs">
          <Store className="w-10 h-10 text-neutral-400 mx-auto mb-3" />
          <p className="text-xs text-neutral-500">No brand stores found matching your query.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredBrands.map((b) => {
            const count = productCountMap[b.name.toLowerCase()] || 0;
            return (
              <div
                key={b.slug}
                className="bg-white border border-neutral-200/80 rounded-3xl overflow-hidden flex flex-col justify-between hover:border-neutral-400 transition-all shadow-[0_2px_16px_rgba(0,0,0,0.03)] group"
              >
                <div>
                  {/* Banner Header */}
                  <div className="relative h-28 w-full bg-neutral-100 overflow-hidden">
                    {b.banner ? (
                      <Image
                        src={b.banner}
                        alt={b.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                        sizes="(max-width: 768px) 100vw, 33vw"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-r from-neutral-200 to-neutral-100" />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                    {/* Status Pill */}
                    <div className="absolute top-3 right-3 flex items-center gap-1.5">
                      <span
                        className={`text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full ${b.isActive
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                            : "bg-red-50 text-red-700 border border-red-200"
                          }`}
                      >
                        {b.isActive ? "Active" : "Disabled"}
                      </span>
                    </div>

                    {/* Brand Name Emblem */}
                    <div className="absolute bottom-2 left-4">
                      <span
                        className={`text-xl tracking-wider ${b.slug === "waves"
                            ? "font-serif italic text-white font-bold"
                            : "font-black uppercase text-white"
                          }`}
                      >
                        {b.name}
                      </span>
                    </div>
                  </div>

                  {/* Brand Content */}
                  <div className="p-4 space-y-2.5">
                    <div className="flex items-center justify-between text-[11px] text-neutral-500 font-mono">
                      <span>URL: /brand/{b.slug}</span>
                      <span className="text-neutral-900 font-bold">{count} Products</span>
                    </div>

                    {b.tagline && (
                      <p className="text-xs font-bold text-neutral-900 line-clamp-1">
                        {b.tagline}
                      </p>
                    )}

                    <p className="text-[11px] text-neutral-500 line-clamp-2 leading-relaxed">
                      {b.description || "No description configured yet."}
                    </p>

                    {/* Brand Manager Login Pill */}
                    <div className="pt-1 flex items-center justify-between text-[10px] bg-neutral-950/80 px-2.5 py-1.5 rounded-lg border border-neutral-800">
                      <span className="text-neutral-400 flex items-center gap-1">
                        <ShieldCheck className="w-3 h-3 text-emerald-400" />
                        <span>Manager Login:</span>
                      </span>
                      <span className="font-mono font-bold text-amber-400">
                        @{b.managerUsername || b.slug}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Footer Actions */}
                <div className="p-4 pt-3 border-t border-neutral-100 bg-neutral-50/60 flex items-center justify-between gap-2">
                  <Link
                    href={`/brand/${b.slug}`}
                    target="_blank"
                    className="text-[11px] font-bold text-neutral-900 hover:text-black flex items-center gap-1 transition-colors"
                  >
                    <span>View Storefront</span>
                    <ExternalLink className="w-3 h-3" />
                  </Link>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => openEditModal(b)}
                      className="p-1.5 rounded-xl bg-white border border-neutral-200 hover:bg-neutral-100 text-neutral-700 transition-colors cursor-pointer shadow-xs"
                      title="Edit Brand Store"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={() => handleDelete(b._id || b.slug, b.name)}
                      className="p-1.5 rounded-xl bg-white border border-neutral-200 hover:bg-red-50 text-neutral-700 hover:text-red-600 transition-colors cursor-pointer shadow-xs"
                      title="Delete Brand"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* CREATE / EDIT BRAND MODAL */}
      {isModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6"
        >
          <div className="bg-white border border-neutral-200 rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 sm:p-8 shadow-2xl space-y-6 text-neutral-900">
            <div className="flex items-center justify-between pb-4 border-b border-neutral-100">
              <div>
                <h3 className="text-base font-black uppercase tracking-wider text-neutral-900 flex items-center gap-2">
                  <Store className="w-4 h-4 text-black" />
                  <span>{editingBrand ? `Edit ${name} Brand Store` : "Create New Brand Store"}</span>
                </h3>
                <p className="text-xs text-neutral-500 mt-0.5">
                  Configure brand storefront details, custom banner, and marketing copy.
                </p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="w-8 h-8 rounded-full bg-neutral-100 hover:bg-neutral-200 text-neutral-600 flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-bold text-neutral-700 block mb-1">
                    Brand Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => handleNameChange(e.target.value)}
                    placeholder="e.g. WAVES"
                    className="w-full bg-neutral-50 border border-neutral-200 rounded-2xl px-3 py-2.5 text-neutral-900 font-bold focus:outline-hidden focus:border-black"
                  />
                </div>

                <div>
                  <label className="font-bold text-neutral-700 block mb-1">
                    URL Slug * (/brand/[slug])
                  </label>
                  <input
                    type="text"
                    required
                    value={slug}
                    onChange={(e) => setSlug(e.target.value.toLowerCase())}
                    placeholder="e.g. waves"
                    className="w-full bg-neutral-50 border border-neutral-200 rounded-2xl px-3 py-2.5 text-neutral-900 font-mono focus:outline-hidden focus:border-black"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-neutral-700 block mb-1">
                  Tagline / Catchphrase
                </label>
                <input
                  type="text"
                  value={tagline}
                  onChange={(e) => setTagline(e.target.value)}
                  placeholder="e.g. Sri Lanka's Premier Flip-Flops & Beachwear"
                  className="w-full bg-neutral-50 border border-neutral-200 rounded-2xl px-3 py-2.5 text-neutral-900 font-medium focus:outline-hidden focus:border-black"
                />
              </div>

              <div>
                <label className="font-bold text-neutral-700 block mb-1">
                  Cover Banner Image URL
                </label>
                <input
                  type="url"
                  value={banner}
                  onChange={(e) => setBanner(e.target.value)}
                  placeholder="https://images.unsplash.com/photo-..."
                  className="w-full bg-neutral-50 border border-neutral-200 rounded-2xl px-3 py-2.5 text-neutral-900 font-mono focus:outline-hidden focus:border-black text-[11px]"
                />
              </div>

              <div>
                <label className="font-bold text-neutral-700 block mb-1">
                  Short Description
                </label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Brief overview of the brand..."
                  className="w-full bg-neutral-50 border border-neutral-200 rounded-2xl p-3 text-neutral-900 focus:outline-hidden focus:border-black"
                />
              </div>

              <div>
                <label className="font-bold text-neutral-700 block mb-1">
                  Brand Heritage / Full Story
                </label>
                <textarea
                  rows={3}
                  value={story}
                  onChange={(e) => setStory(e.target.value)}
                  placeholder="Tell the story of how this brand was founded, sustainability philosophy, craftsmanship..."
                  className="w-full bg-neutral-50 border border-neutral-200 rounded-2xl p-3 text-neutral-900 focus:outline-hidden focus:border-black"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-bold text-neutral-700 block mb-1">
                    Brand Concierge Phone
                  </label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+94 76 347 3075"
                    className="w-full bg-neutral-50 border border-neutral-200 rounded-2xl px-3 py-2.5 text-neutral-900 focus:outline-hidden focus:border-black"
                  />
                </div>

                <div>
                  <label className="font-bold text-neutral-700 block mb-1">
                    Contact Email
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="partner@thebrandhub.lk"
                    className="w-full bg-neutral-50 border border-neutral-200 rounded-2xl px-3 py-2.5 text-neutral-900 focus:outline-hidden focus:border-black"
                  />
                </div>
              </div>

              {/* Brand Manager Login Credentials Configuration */}
              <div className="bg-neutral-900/90 border border-neutral-800 rounded-2xl p-4 space-y-3">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-amber-400" />
                  <span className="font-extrabold text-white text-xs uppercase tracking-wider">
                    Brand Partner Login Credentials
                  </span>
                </div>
                <p className="text-[11px] text-neutral-400 leading-relaxed">
                  Assign a dedicated username and password to this brand partner. They can log in at <code>/admin/login</code> to independently manage their own brand&apos;s catalog, stock, and storefront.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <div>
                    <label className="font-extrabold uppercase tracking-wider text-neutral-300 block mb-1 text-[10px]">
                      Brand Manager Username *
                    </label>
                    <input
                      type="text"
                      value={managerUsername}
                      onChange={(e) => setManagerUsername(e.target.value.toLowerCase())}
                      placeholder="e.g. waves or ansel"
                      className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-white font-mono text-xs focus:outline-hidden focus:border-white"
                    />
                  </div>
                  <div>
                    <label className="font-extrabold uppercase tracking-wider text-neutral-300 block mb-1 text-[10px]">
                      {editingBrand ? "Change Password (optional)" : "Brand Login Password *"}
                    </label>
                    <input
                      type="password"
                      value={managerPassword}
                      onChange={(e) => setManagerPassword(e.target.value)}
                      placeholder={editingBrand ? "Leave blank to keep existing" : "••••••••••••"}
                      className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-white font-mono text-xs focus:outline-hidden focus:border-white"
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-6 pt-2">
                <label className="flex items-center gap-2 cursor-pointer text-neutral-800 font-bold">
                  <input
                    type="checkbox"
                    checked={isActive}
                    onChange={(e) => setIsActive(e.target.checked)}
                    className="w-4 h-4 rounded-sm accent-black"
                  />
                  <span>Active &amp; Visible on Storefront</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer text-neutral-800 font-bold">
                  <input
                    type="checkbox"
                    checked={featured}
                    onChange={(e) => setFeatured(e.target.checked)}
                    className="w-4 h-4 rounded-sm accent-black"
                  />
                  <span>Featured Partner</span>
                </label>
              </div>

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-neutral-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 rounded-2xl border border-neutral-200 text-neutral-700 hover:bg-neutral-100 font-bold uppercase tracking-wider cursor-pointer transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-black text-white hover:bg-neutral-800 px-6 py-2.5 rounded-2xl font-bold uppercase tracking-wider cursor-pointer transition-colors disabled:opacity-50 shadow-xs"
                >
                  {isSubmitting ? "Saving..." : editingBrand ? "Update Brand Store" : "Create Storefront"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
