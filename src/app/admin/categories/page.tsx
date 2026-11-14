"use client";

import React, { useEffect, useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Plus,
  Trash2,
  Layers,
  Check,
  X,
  Upload,
  ChevronDown,
  ChevronUp,
  Package,
  ExternalLink,
  Edit,
  FolderOpen,
  ArrowRight,
} from "lucide-react";
import { ICategory, IBrand, IProduct } from "@/types";
import { toast } from "sonner";

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [brands, setBrands] = useState<IBrand[]>([]);
  const [products, setProducts] = useState<IProduct[]>([]);
  const [loading, setLoading] = useState(true);

  // Expanded category IDs for viewing inside products
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({});

  // Add Category State
  const [newCatName, setNewCatName] = useState("");
  const [newCatDesc, setNewCatDesc] = useState("");
  const [newCatImage, setNewCatImage] = useState("");
  const [isUploadingCat, setIsUploadingCat] = useState(false);

  // Edit Category Modal
  const [editingCategory, setEditingCategory] = useState<ICategory | null>(null);
  const [editCatName, setEditCatName] = useState("");
  const [editCatDesc, setEditCatDesc] = useState("");
  const [editCatImage, setEditCatImage] = useState("");

  // Add Brand State
  const [newBrandName, setNewBrandName] = useState("");
  const [newBrandDesc, setNewBrandDesc] = useState("");

  const loadData = async () => {
    setLoading(true);
    try {
      const [cRes, bRes, pRes] = await Promise.all([
        fetch("/api/categories"),
        fetch("/api/brands"),
        fetch("/api/products?limit=200&includeInactive=true"),
      ]);
      const cData = await cRes.json();
      const bData = await bRes.json();
      const pData = await pRes.json();

      setCategories(cData || []);
      setBrands(bData || []);
      setProducts(pData.products || []);
    } catch (e) {
      console.error(e);
      toast.error("Failed to load taxonomies");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Map products by category
  const productsByCategory = useMemo(() => {
    const map: Record<string, IProduct[]> = {};
    products.forEach((p) => {
      const cat = (p.category || "Uncategorized").toLowerCase();
      if (!map[cat]) map[cat] = [];
      map[cat].push(p);
    });
    return map;
  }, [products]);

  // Map products by brand
  const productsByBrand = useMemo(() => {
    const map: Record<string, IProduct[]> = {};
    products.forEach((p) => {
      const br = (p.brand || "TBH").toLowerCase();
      if (!map[br]) map[br] = [];
      map[br].push(p);
    });
    return map;
  }, [products]);

  const toggleExpand = (catId: string) => {
    setExpandedCategories((prev) => ({ ...prev, [catId]: !prev[catId] }));
  };

  // Upload image to Cloudinary for Category
  const handleCatImageUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    isEdit = false
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    setIsUploadingCat(true);
    const toastId = toast.loading("Uploading category banner to Cloudinary...");

    try {
      const res = await fetch("/api/uploads", { method: "POST", body: formData });
      const data = await res.json();
      if (res.ok && data.url) {
        if (isEdit) {
          setEditCatImage(data.url);
        } else {
          setNewCatImage(data.url);
        }
        toast.success("Image uploaded successfully!", { id: toastId });
      } else {
        toast.error("Upload failed", { id: toastId });
      }
    } catch {
      toast.error("Error uploading image", { id: toastId });
    } finally {
      setIsUploadingCat(false);
      e.target.value = "";
    }
  };

  // Add Category
  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName.trim()) return;

    const toastId = toast.loading("Creating category...");
    try {
      const res = await fetch("/api/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newCatName.trim(),
          description: newCatDesc.trim(),
          image: newCatImage.trim() || undefined,
        }),
      });
      if (res.ok) {
        toast.success("Category added successfully!", { id: toastId });
        setNewCatName("");
        setNewCatDesc("");
        setNewCatImage("");
        loadData();
      } else {
        toast.error("Failed to add category", { id: toastId });
      }
    } catch {
      toast.error("Error creating category", { id: toastId });
    }
  };

  // Open Edit Category
  const openEditCategory = (c: ICategory) => {
    setEditingCategory(c);
    setEditCatName(c.name);
    setEditCatDesc(c.description || "");
    setEditCatImage(c.image || "");
  };

  // Save Edit Category
  const handleSaveEditCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCategory || !editCatName.trim()) return;

    const id = editingCategory._id || editingCategory.slug;
    const toastId = toast.loading("Updating category...");
    try {
      const res = await fetch(`/api/categories/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: editCatName.trim(),
          description: editCatDesc.trim(),
          image: editCatImage.trim() || undefined,
        }),
      });
      if (res.ok) {
        toast.success("Category updated!", { id: toastId });
        setEditingCategory(null);
        loadData();
      } else {
        toast.error("Failed to update category", { id: toastId });
      }
    } catch {
      toast.error("Error saving category", { id: toastId });
    }
  };

  // Delete Category
  const handleDeleteCategory = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to remove category "${name}"?`)) return;
    try {
      const res = await fetch(`/api/categories/${id}`, { method: "DELETE" });
      if (res.ok) {
        toast.success("Category deleted");
        loadData();
      }
    } catch {
      toast.error("Error deleting category");
    }
  };

  // Add Brand
  const handleAddBrand = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBrandName.trim()) return;

    try {
      const res = await fetch("/api/brands", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newBrandName.trim().toUpperCase(),
          description: newBrandDesc.trim(),
        }),
      });
      if (res.ok) {
        toast.success("Brand added!");
        setNewBrandName("");
        setNewBrandDesc("");
        loadData();
      }
    } catch {
      toast.error("Failed to add brand");
    }
  };

  // Delete Brand
  const handleDeleteBrand = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to remove brand "${name}"?`)) return;
    try {
      const res = await fetch(`/api/brands/${id}`, { method: "DELETE" });
      if (res.ok) {
        toast.success("Brand deleted");
        loadData();
      }
    } catch {
      toast.error("Error deleting brand");
    }
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-neutral-200/80 shadow-[0_2px_16px_rgba(0,0,0,0.03)]">
        <div>
          <h1 className="text-2xl font-black uppercase tracking-wider text-neutral-900">
            Category &amp; Taxonomy Management
          </h1>
          <p className="text-xs text-neutral-500 mt-1 font-medium">
            Organize products by category, inspect products inside each category, and manage official brands.
          </p>
        </div>

        <Link
          href="/admin/products"
          className="bg-black text-white hover:bg-neutral-800 px-5 py-2.5 rounded-2xl text-xs font-bold uppercase tracking-wider transition-colors flex items-center gap-2 self-start md:self-auto shadow-xs"
        >
          <Package className="w-4 h-4" />
          <span>All Products ({products.length})</span>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Categories Section (Spans 2 cols) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white border border-neutral-200/80 rounded-3xl p-6 shadow-[0_2px_16px_rgba(0,0,0,0.03)] space-y-6">
            <div className="flex items-center justify-between border-b border-neutral-100 pb-4">
              <div>
                <h2 className="text-base font-black uppercase tracking-wider text-neutral-900 flex items-center gap-2">
                  <FolderOpen className="w-4 h-4 text-black" />
                  <span>Categories ({categories.length})</span>
                </h2>
                <p className="text-xs text-neutral-500 mt-0.5">
                  Click any category below to inspect and manage the products inside it.
                </p>
              </div>
            </div>

            {/* Add Category Form */}
            <form
              onSubmit={handleAddCategory}
              className="space-y-3 bg-neutral-50 p-4 sm:p-5 rounded-2xl border border-neutral-200 text-xs"
            >
              <span className="font-bold text-neutral-900 text-xs uppercase tracking-wider block">
                + Create New Category
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input
                  type="text"
                  required
                  placeholder="Category Name (e.g. Resort Wear)"
                  value={newCatName}
                  onChange={(e) => setNewCatName(e.target.value)}
                  className="w-full bg-white border border-neutral-200 rounded-xl p-2.5 text-neutral-900 focus:outline-hidden focus:border-black font-medium"
                />
                <input
                  type="text"
                  placeholder="Short Description..."
                  value={newCatDesc}
                  onChange={(e) => setNewCatDesc(e.target.value)}
                  className="w-full bg-white border border-neutral-200 rounded-xl p-2.5 text-neutral-900 focus:outline-hidden focus:border-black font-medium"
                />
              </div>

              {/* Cloudinary Image Input for Category */}
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="Optional Banner / Thumbnail URL (or upload to Cloudinary)..."
                  value={newCatImage}
                  onChange={(e) => setNewCatImage(e.target.value)}
                  className="flex-1 bg-white border border-neutral-200 rounded-xl p-2.5 text-neutral-900 text-xs focus:outline-hidden focus:border-black font-medium"
                />
                <label className="bg-neutral-100 hover:bg-neutral-200 text-neutral-800 border border-neutral-200 px-3 py-2.5 rounded-xl cursor-pointer text-xs font-bold flex items-center gap-1.5 shrink-0 transition-colors">
                  <Upload className="w-3.5 h-3.5" />
                  <span>{isUploadingCat ? "Uploading..." : "Upload"}</span>
                  <input
                    type="file"
                    accept="image/*"
                    disabled={isUploadingCat}
                    onChange={(e) => handleCatImageUpload(e, false)}
                    className="hidden"
                  />
                </label>
              </div>

              <button
                type="submit"
                className="w-full bg-black text-white hover:bg-neutral-800 py-2.5 rounded-xl font-bold uppercase tracking-wider transition-colors shadow-xs cursor-pointer"
              >
                Create Category
              </button>
            </form>

            {/* Categories List with Nested Products Accordion */}
            <div className="space-y-3">
              {loading ? (
                <p className="text-center py-8 text-neutral-400 text-xs">Loading categories...</p>
              ) : categories.length === 0 ? (
                <p className="text-center py-8 text-neutral-400 text-xs">No categories created yet.</p>
              ) : (
                categories.map((c) => {
                  const catId = c._id || c.slug;
                  const catProducts = productsByCategory[c.name.toLowerCase()] || [];
                  const isExpanded = Boolean(expandedCategories[catId]);

                  return (
                    <div
                      key={catId}
                      className="bg-neutral-50 border border-neutral-200/90 rounded-2xl overflow-hidden transition-all shadow-xs"
                    >
                      {/* Main Category Header Row */}
                      <div className="p-4 flex items-center justify-between gap-4">
                        <div
                          className="flex items-center gap-3 cursor-pointer flex-1 min-w-0"
                          onClick={() => toggleExpand(catId)}
                        >
                          <div className="w-10 h-10 rounded-xl bg-white overflow-hidden relative shrink-0 border border-neutral-200">
                            {c.image ? (
                              <Image src={c.image} alt={c.name} fill className="object-cover" sizes="40px" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-neutral-400">
                                <Layers className="w-4 h-4" />
                              </div>
                            )}
                          </div>

                          <div className="min-w-0">
                            <div className="flex items-center gap-2">
                              <strong className="text-neutral-900 text-sm font-bold truncate">{c.name}</strong>
                              <span className="bg-white border border-neutral-200 text-neutral-700 text-[10px] font-bold px-2 py-0.5 rounded-full font-mono shadow-xs">
                                {catProducts.length} items
                              </span>
                            </div>
                            <span className="text-[10px] text-neutral-400 font-mono block">
                              /category/{c.slug}
                            </span>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-1.5 shrink-0">
                          <button
                            type="button"
                            onClick={() => toggleExpand(catId)}
                            className="px-2.5 py-1.5 rounded-xl bg-white border border-neutral-200 hover:bg-neutral-100 text-neutral-700 text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer shadow-xs"
                          >
                            <span>{isExpanded ? "Hide Items" : "View Items"}</span>
                            {isExpanded ? (
                              <ChevronUp className="w-3.5 h-3.5" />
                            ) : (
                              <ChevronDown className="w-3.5 h-3.5" />
                            )}
                          </button>

                          <button
                            type="button"
                            onClick={() => openEditCategory(c)}
                            className="p-1.5 rounded-xl bg-white border border-neutral-200 hover:bg-neutral-100 text-neutral-700 cursor-pointer shadow-xs"
                            title="Edit Category"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>

                          <button
                            type="button"
                            onClick={() => handleDeleteCategory(catId, c.name)}
                            className="p-1.5 rounded-xl bg-white border border-neutral-200 hover:bg-red-50 text-neutral-700 hover:text-red-600 cursor-pointer shadow-xs"
                            title="Delete Category"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      {/* Accordion Content: Products Inside This Category */}
                      {isExpanded && (
                        <div className="border-t border-neutral-200 bg-white p-4 space-y-3">
                          <div className="flex items-center justify-between text-xs">
                            <span className="font-bold text-neutral-700 uppercase tracking-wider text-[11px]">
                              Products in &quot;{c.name}&quot; ({catProducts.length})
                            </span>
                            <Link
                              href="/admin/products"
                              className="text-black hover:underline text-[11px] font-bold flex items-center gap-1"
                            >
                              <span>Manage in Products catalog</span>
                              <ArrowRight className="w-3 h-3" />
                            </Link>
                          </div>

                          {catProducts.length === 0 ? (
                            <div className="text-center py-6 bg-neutral-50 rounded-xl border border-neutral-200 text-neutral-400 text-xs">
                              <p>No products currently added to this category.</p>
                              <Link
                                href="/admin/products"
                                className="inline-block mt-2 px-3 py-1.5 rounded-xl bg-black text-white hover:bg-neutral-800 font-bold text-[11px] shadow-xs"
                              >
                                + Add product to {c.name}
                              </Link>
                            </div>
                          ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                              {catProducts.map((p) => (
                                <div
                                  key={p._id || p.sku}
                                  className="bg-neutral-50 p-2.5 rounded-xl border border-neutral-200 flex items-center justify-between gap-3 text-xs"
                                >
                                  <div className="flex items-center gap-2.5 min-w-0">
                                    <div className="w-9 h-11 rounded-lg bg-white overflow-hidden relative shrink-0 border border-neutral-200">
                                      {p.images?.[0]?.url && (
                                        <Image
                                          src={p.images[0].url}
                                          alt={p.name}
                                          fill
                                          className="object-cover"
                                          sizes="36px"
                                        />
                                      )}
                                    </div>
                                    <div className="min-w-0">
                                      <strong className="text-neutral-900 block font-bold truncate">
                                        {p.name}
                                      </strong>
                                      <span className="text-[10px] text-neutral-500">
                                        Rs. {p.price.toLocaleString()} • {p.stock} units
                                      </span>
                                    </div>
                                  </div>

                                  <Link
                                    href={`/product/${p.slug}`}
                                    target="_blank"
                                    className="p-1.5 rounded-lg bg-white border border-neutral-200 hover:bg-neutral-100 text-neutral-600 hover:text-black shrink-0"
                                    title="View Live"
                                  >
                                    <ExternalLink className="w-3.5 h-3.5" />
                                  </Link>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>

        {/* Brands Section (1 col) */}
        <div className="space-y-6">
          <div className="bg-white border border-neutral-200/80 rounded-3xl p-6 shadow-[0_2px_16px_rgba(0,0,0,0.03)] space-y-6">
            <div className="border-b border-neutral-100 pb-4">
              <h2 className="text-base font-black uppercase tracking-wider text-neutral-900">
                Official Brands ({brands.length})
              </h2>
              <p className="text-xs text-neutral-500 mt-0.5">
                Licensed brand identities for storefront tagging.
              </p>
            </div>

            {/* Add Brand Form */}
            <form onSubmit={handleAddBrand} className="space-y-3 bg-neutral-50 p-4 rounded-2xl border border-neutral-200 text-xs">
              <span className="font-bold text-neutral-900 block uppercase tracking-wider">
                + Add New Brand
              </span>
              <input
                type="text"
                required
                placeholder="Brand Name (e.g. BREAKWATER)"
                value={newBrandName}
                onChange={(e) => setNewBrandName(e.target.value.toUpperCase())}
                className="w-full bg-white border border-neutral-200 rounded-xl p-2.5 text-neutral-900 focus:outline-hidden focus:border-black uppercase font-bold"
              />
              <input
                type="text"
                placeholder="Tagline or Description..."
                value={newBrandDesc}
                onChange={(e) => setNewBrandDesc(e.target.value)}
                className="w-full bg-white border border-neutral-200 rounded-xl p-2.5 text-neutral-900 focus:outline-hidden focus:border-black font-medium"
              />
              <button
                type="submit"
                className="w-full bg-black text-white hover:bg-neutral-800 py-2.5 rounded-xl font-bold uppercase tracking-wider transition-colors shadow-xs cursor-pointer"
              >
                Add Brand
              </button>
            </form>

            {/* Brands List */}
            <div className="divide-y divide-neutral-100 max-h-[460px] overflow-y-auto">
              {brands.map((b) => {
                const brandId = b._id || b.slug;
                const brandProducts = productsByBrand[b.name.toLowerCase()] || [];

                return (
                  <div key={brandId} className="py-3 flex items-center justify-between text-xs">
                    <div>
                      <div className="flex items-center gap-2">
                        <strong className="text-neutral-900 block font-bold uppercase">{b.name}</strong>
                        <span className="text-[10px] text-neutral-500 font-mono bg-neutral-100 px-1.5 py-0.2 rounded">
                          {brandProducts.length} items
                        </span>
                      </div>
                      <span className="text-[10px] text-neutral-400 font-mono">Slug: {b.slug}</span>
                    </div>

                    <button
                      onClick={() => handleDeleteBrand(brandId, b.name)}
                      className="p-1.5 rounded-lg text-neutral-400 hover:text-red-500 transition-colors cursor-pointer"
                      title="Delete Brand"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Edit Category Modal */}
      {editingCategory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="bg-white border border-neutral-200 rounded-3xl max-w-md w-full p-6 shadow-2xl text-neutral-900">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
              <h3 className="text-sm font-black uppercase tracking-wider text-neutral-900">
                Edit Category: {editingCategory.name}
              </h3>
              <button
                onClick={() => setEditingCategory(null)}
                className="text-neutral-400 hover:text-black cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveEditCategory} className="mt-4 space-y-3 text-xs">
              <div>
                <label className="font-bold text-neutral-700 block mb-1">Category Name *</label>
                <input
                  type="text"
                  required
                  value={editCatName}
                  onChange={(e) => setEditCatName(e.target.value)}
                  className="w-full bg-neutral-50 border border-neutral-200 rounded-xl p-2.5 text-neutral-900 focus:outline-hidden focus:border-black font-bold"
                />
              </div>

              <div>
                <label className="font-bold text-neutral-700 block mb-1">Description</label>
                <input
                  type="text"
                  value={editCatDesc}
                  onChange={(e) => setEditCatDesc(e.target.value)}
                  className="w-full bg-neutral-50 border border-neutral-200 rounded-xl p-2.5 text-neutral-900 focus:outline-hidden focus:border-black"
                />
              </div>

              <div>
                <label className="font-bold text-neutral-700 block mb-1">Banner / Image URL</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={editCatImage}
                    onChange={(e) => setEditCatImage(e.target.value)}
                    className="flex-1 bg-neutral-50 border border-neutral-200 rounded-xl p-2.5 text-neutral-900 text-xs focus:outline-hidden focus:border-black"
                  />
                  <label className="bg-neutral-100 hover:bg-neutral-200 text-neutral-800 border border-neutral-200 px-3 py-2.5 rounded-xl cursor-pointer text-xs font-bold flex items-center gap-1 shrink-0 transition-colors">
                    <Upload className="w-3.5 h-3.5" />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleCatImageUpload(e, true)}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              <div className="flex gap-2 pt-3 border-t border-neutral-100 mt-4">
                <button
                  type="button"
                  onClick={() => setEditingCategory(null)}
                  className="flex-1 py-2.5 rounded-xl border border-neutral-200 text-neutral-700 font-bold uppercase hover:bg-neutral-100 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-black text-white hover:bg-neutral-800 font-bold uppercase cursor-pointer shadow-xs"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
