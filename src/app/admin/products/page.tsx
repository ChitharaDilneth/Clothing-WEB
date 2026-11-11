"use client";

import React, { useEffect, useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Plus,
  Search,
  Edit3,
  Trash2,
  X,
  Upload,
  ExternalLink,
  Layers,
  Sparkles,
  Check,
  AlertTriangle,
  ArrowUpDown,
  Filter,
  Grid,
  List,
  FolderTree,
  Eye,
  Star,
  Package,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { IProduct, ICategory, IBrand, IProductImage, IProductColor } from "@/types";
import { toast } from "sonner";

const PRESET_SIZES = ["XS", "S", "M", "L", "XL", "2XL", "Free Size", "UK 6", "UK 7", "UK 8", "UK 9", "UK 10"];
const PRESET_COLORS = [
  { name: "Black", hex: "#000000" },
  { name: "White", hex: "#FFFFFF" },
  { name: "Navy Blue", hex: "#1e3a8a" },
  { name: "Ash Grey", hex: "#6b7280" },
  { name: "Olive Green", hex: "#3f6212" },
  { name: "Beige", hex: "#d4b895" },
  { name: "Burgundy", hex: "#831843" },
];

export default function AdminProductsPage() {
  const [products, setProducts] = useState<IProduct[]>([]);
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [brands, setBrands] = useState<IBrand[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters & Search
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [stockFilter, setStockFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("newest");
  const [viewMode, setViewMode] = useState<"table" | "grouped" | "grid">("table");

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<IProduct | null>(null);
  const [activeTab, setActiveTab] = useState<"basic" | "media" | "pricing" | "variants">("basic");

  // Form State
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [sku, setSku] = useState("");
  const [brand, setBrand] = useState("WAVES");
  const [category, setCategory] = useState("Women");
  const [subcategory, setSubcategory] = useState("");
  const [shortDescription, setShortDescription] = useState("");
  const [description, setDescription] = useState("");

  // Media
  const [images, setImages] = useState<IProductImage[]>([]);
  const [imageUrlInput, setImageUrlInput] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  // Pricing & Stock
  const [price, setPrice] = useState<number>(2950);
  const [originalPrice, setOriginalPrice] = useState<number>(3500);
  const [costPrice, setCostPrice] = useState<number>(1500);
  const [stock, setStock] = useState<number>(15);

  // Variants & Features
  const [selectedSizes, setSelectedSizes] = useState<string[]>(["Free Size"]);
  const [customSizeInput, setCustomSizeInput] = useState("");
  const [colors, setColors] = useState<IProductColor[]>([{ name: "Standard", hex: "#000000", inStock: true }]);
  const [newColorName, setNewColorName] = useState("");
  const [newColorHex, setNewColorHex] = useState("#000000");

  const [isVirtualTryOn, setIsVirtualTryOn] = useState(false);
  const [isFeatured, setIsFeatured] = useState(false);
  const [isBestseller, setIsBestseller] = useState(false);
  const [isNewArrival, setIsNewArrival] = useState(true);
  const [isActive, setIsActive] = useState(true);

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Load Products, Categories & Brands
  const loadAll = async () => {
    setLoading(true);
    try {
      const [prodRes, catRes, brandRes] = await Promise.all([
        fetch("/api/products?limit=200&includeInactive=true"),
        fetch("/api/categories"),
        fetch("/api/brands"),
      ]);
      const prodData = await prodRes.json();
      const catData = await catRes.json();
      const brandData = await brandRes.json();

      setProducts(prodData.products || []);
      setCategories(catData || []);
      setBrands(brandData || []);
    } catch (e) {
      console.error("Failed to load admin catalog:", e);
      toast.error("Failed to load catalog data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAll();
  }, []);

  // Category counts map
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    products.forEach((p) => {
      const cat = p.category || "Uncategorized";
      counts[cat.toLowerCase()] = (counts[cat.toLowerCase()] || 0) + 1;
    });
    return counts;
  }, [products]);

  // Distinct category list from categories API + any found in products
  const categoryTabs = useMemo(() => {
    const set = new Set<string>();
    categories.forEach((c) => set.add(c.name));
    products.forEach((p) => {
      if (p.category) set.add(p.category);
    });
    return Array.from(set);
  }, [categories, products]);

  // Filtered & Sorted Products
  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
        const matchesSearch =
          !search ||
          p.name.toLowerCase().includes(search.toLowerCase()) ||
          p.sku.toLowerCase().includes(search.toLowerCase()) ||
          p.brand.toLowerCase().includes(search.toLowerCase()) ||
          p.category.toLowerCase().includes(search.toLowerCase());

        const matchesCategory =
          selectedCategory === "all" ||
          p.category.toLowerCase() === selectedCategory.toLowerCase();

        const matchesStock =
          stockFilter === "all" ||
          (stockFilter === "in_stock" && p.stock > 5) ||
          (stockFilter === "low_stock" && p.stock > 0 && p.stock <= 5) ||
          (stockFilter === "out_of_stock" && p.stock <= 0);

        return matchesSearch && matchesCategory && matchesStock;
      })
      .sort((a, b) => {
        if (sortBy === "price_asc") return a.price - b.price;
        if (sortBy === "price_desc") return b.price - a.price;
        if (sortBy === "stock_asc") return a.stock - b.stock;
        if (sortBy === "name_asc") return a.name.localeCompare(b.name);
        // Default newest
        return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
      });
  }, [products, search, selectedCategory, stockFilter, sortBy]);

  // Grouped by Category
  const groupedProducts = useMemo(() => {
    const groups: Record<string, IProduct[]> = {};
    filteredProducts.forEach((p) => {
      const cat = p.category || "Uncategorized";
      if (!groups[cat]) groups[cat] = [];
      groups[cat].push(p);
    });
    return groups;
  }, [filteredProducts]);

  // Open Create Modal
  const openCreateModal = (prefillCategory?: string) => {
    setEditingProduct(null);
    setActiveTab("basic");
    setName("");
    setSlug("");
    setSku(`TBH-${Math.floor(10000 + Math.random() * 90000)}`);
    setBrand(brands[0]?.name || "WAVES");
    setCategory(prefillCategory || categories[0]?.name || "Women");
    setSubcategory("");
    setShortDescription("Premium Sri Lankan lifestyle collection piece.");
    setDescription(
      "Crafted with premium tropical materials for all-day comfort. Designed for island adventures, coastal ease, and casual elegance."
    );
    setImages([
      {
        url: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=800&q=80",
        alt: "Main View",
      },
    ]);
    setImageUrlInput("");
    setPrice(2950);
    setOriginalPrice(3500);
    setCostPrice(1400);
    setStock(20);
    setSelectedSizes(["S", "M", "L", "Free Size"]);
    setColors([
      { name: "Black", hex: "#000000", inStock: true },
      { name: "White", hex: "#FFFFFF", inStock: true },
    ]);
    setIsVirtualTryOn(true);
    setIsFeatured(false);
    setIsBestseller(false);
    setIsNewArrival(true);
    setIsActive(true);
    setIsModalOpen(true);
  };

  // Open Edit Modal
  const openEditModal = (p: IProduct) => {
    setEditingProduct(p);
    setActiveTab("basic");
    setName(p.name);
    setSlug(p.slug);
    setSku(p.sku);
    setBrand(p.brand);
    setCategory(p.category);
    setSubcategory(p.subcategory || "");
    setShortDescription(p.shortDescription || "");
    setDescription(p.description);
    setImages(p.images && p.images.length > 0 ? p.images : []);
    setImageUrlInput("");
    setPrice(p.price);
    setOriginalPrice(p.originalPrice || 0);
    setCostPrice(p.costPrice || 0);
    setStock(p.stock);
    setSelectedSizes(p.sizes && p.sizes.length > 0 ? p.sizes : ["Free Size"]);
    setColors(p.colors && p.colors.length > 0 ? p.colors : [{ name: "Standard", hex: "#000000", inStock: true }]);
    setIsVirtualTryOn(Boolean(p.isVirtualTryOn));
    setIsFeatured(Boolean(p.isFeatured));
    setIsBestseller(Boolean(p.isBestseller));
    setIsNewArrival(Boolean(p.isNewArrival));
    setIsActive(p.isActive !== undefined ? p.isActive : true);
    setIsModalOpen(true);
  };

  // Cloudinary Direct Image Upload
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    setIsUploading(true);
    const toastId = toast.loading("Uploading image to Cloudinary...");

    try {
      const res = await fetch("/api/uploads", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (res.ok && data.url) {
        setImages((prev) => [...prev, { url: data.url, alt: name || "Product image" }]);
        toast.success("Image uploaded to Cloudinary!", { id: toastId });
      } else {
        toast.error(data.message || "Upload failed", { id: toastId });
      }
    } catch {
      toast.error("Network error during image upload", { id: toastId });
    } finally {
      setIsUploading(false);
      e.target.value = "";
    }
  };

  const handleAddImageUrl = () => {
    if (!imageUrlInput.trim()) return;
    setImages((prev) => [...prev, { url: imageUrlInput.trim(), alt: name || "Product image" }]);
    setImageUrlInput("");
    toast.success("Image URL added to gallery");
  };

  const handleRemoveImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSetPrimaryImage = (index: number) => {
    if (index === 0) return;
    setImages((prev) => {
      const clone = [...prev];
      const [item] = clone.splice(index, 1);
      clone.unshift(item);
      return clone;
    });
    toast.success("Primary cover image updated");
  };

  // Size toggles
  const toggleSize = (size: string) => {
    setSelectedSizes((prev) =>
      prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size]
    );
  };

  const handleAddCustomSize = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customSizeInput.trim()) return;
    if (!selectedSizes.includes(customSizeInput.trim())) {
      setSelectedSizes((prev) => [...prev, customSizeInput.trim()]);
    }
    setCustomSizeInput("");
  };

  // Color management
  const handleAddColor = () => {
    if (!newColorName.trim()) {
      toast.error("Please enter a color name");
      return;
    }
    setColors((prev) => [...prev, { name: newColorName.trim(), hex: newColorHex, inStock: true }]);
    setNewColorName("");
  };

  const handleRemoveColor = (idx: number) => {
    setColors((prev) => prev.filter((_, i) => i !== idx));
  };

  // Quick Stock Adjustment
  const handleQuickStock = async (product: IProduct, delta: number) => {
    const newStock = Math.max(0, product.stock + delta);
    try {
      const id = product._id || product.slug;
      const res = await fetch(`/api/products/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ stock: newStock }),
      });
      if (res.ok) {
        setProducts((prev) =>
          prev.map((p) => (p._id === product._id || p.slug === product.slug ? { ...p, stock: newStock } : p))
        );
        toast.success(`Stock updated: ${newStock} units`);
      }
    } catch {
      toast.error("Failed to update stock");
    }
  };

  // Toggle Active Status
  const handleToggleActive = async (product: IProduct) => {
    const newStatus = !product.isActive;
    try {
      const id = product._id || product.slug;
      const res = await fetch(`/api/products/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: newStatus }),
      });
      if (res.ok) {
        setProducts((prev) =>
          prev.map((p) => (p._id === product._id || p.slug === product.slug ? { ...p, isActive: newStatus } : p))
        );
        toast.success(newStatus ? "Product published to store" : "Product hidden from store");
      }
    } catch {
      toast.error("Failed to update status");
    }
  };

  // Save Product (Create or Edit)
  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error("Product name is required");
      setActiveTab("basic");
      return;
    }
    if (!price || price <= 0) {
      toast.error("Valid selling price is required");
      setActiveTab("pricing");
      return;
    }

    setIsSubmitting(true);
    const toastId = toast.loading(editingProduct ? "Updating product..." : "Publishing new product...");

    try {
      const payload: Partial<IProduct> = {
        name: name.trim(),
        sku: sku.trim().toUpperCase(),
        brand: brand.trim(),
        category: category.trim(),
        subcategory: subcategory.trim(),
        shortDescription: shortDescription.trim(),
        description: description.trim(),
        images:
          images.length > 0
            ? images
            : [
                {
                  url: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=800&q=80",
                  alt: name,
                },
              ],
        price: Number(price),
        originalPrice: originalPrice ? Number(originalPrice) : undefined,
        costPrice: costPrice ? Number(costPrice) : undefined,
        stock: Number(stock),
        sizes: selectedSizes.length > 0 ? selectedSizes : ["Free Size"],
        colors: colors.length > 0 ? colors : [{ name: "Standard", hex: "#000000", inStock: true }],
        isVirtualTryOn,
        isFeatured,
        isBestseller,
        isNewArrival,
        isActive,
      };

      if (editingProduct) {
        const id = editingProduct._id || editingProduct.slug;
        const res = await fetch(`/api/products/${id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (res.ok) {
          toast.success("Product updated successfully!", { id: toastId });
          setIsModalOpen(false);
          loadAll();
        } else {
          toast.error("Failed to update product", { id: toastId });
        }
      } else {
        const res = await fetch("/api/products", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (res.ok) {
          toast.success("New product published to catalog!", { id: toastId });
          setIsModalOpen(false);
          loadAll();
        } else {
          toast.error("Failed to create product", { id: toastId });
        }
      }
    } catch {
      toast.error("Network error while saving product", { id: toastId });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Delete Product
  const handleDeleteProduct = async (product: IProduct) => {
    if (!confirm(`Are you sure you want to permanently delete "${product.name}"?`)) return;

    const id = product._id || product.slug;
    const toastId = toast.loading("Deleting product...");
    try {
      const res = await fetch(`/api/products/${id}`, { method: "DELETE" });
      if (res.ok) {
        toast.success("Product deleted successfully", { id: toastId });
        loadAll();
      } else {
        toast.error("Failed to delete product", { id: toastId });
      }
    } catch {
      toast.error("Error deleting product", { id: toastId });
    }
  };

  // Calculate discount %
  const discountPercent =
    originalPrice && originalPrice > price
      ? Math.round(((originalPrice - price) / originalPrice) * 100)
      : 0;

  // Calculate profit margin
  const profit = price - (costPrice || 0);
  const profitMargin = price > 0 ? Math.round((profit / price) * 100) : 0;

  return (
    <div className="space-y-6 pb-12">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-neutral-900/60 p-6 rounded-3xl border border-neutral-800">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-black uppercase tracking-wider text-white">
              Product Management
            </h1>
            <span className="bg-white/10 text-white text-xs font-bold px-2.5 py-1 rounded-full border border-neutral-700">
              {products.length} Items Total
            </span>
          </div>
          <p className="text-xs text-neutral-400 mt-1">
            Easily add, edit descriptions, upload Cloudinary images, manage categories, and organize catalog stock.
          </p>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <Link
            href="/admin/categories"
            className="bg-neutral-800 hover:bg-neutral-700 text-neutral-200 px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 border border-neutral-700 transition-colors"
          >
            <Layers className="w-4 h-4" />
            <span>Manage Categories</span>
          </Link>
          <button
            onClick={() => openCreateModal()}
            className="bg-white text-black px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider hover:bg-neutral-200 transition-all flex items-center gap-2 shadow-lg hover:scale-102"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Product</span>
          </button>
        </div>
      </div>

      {/* Category Pills Navigation (User Request: View products category by category) */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-black uppercase tracking-wider text-neutral-400 flex items-center gap-1.5">
            <FolderTree className="w-3.5 h-3.5 text-white" />
            <span>Filter by Category:</span>
          </span>
          <span className="text-[11px] text-neutral-500">
            Showing {filteredProducts.length} of {products.length} items
          </span>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin">
          <button
            onClick={() => setSelectedCategory("all")}
            className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-2 ${
              selectedCategory === "all"
                ? "bg-white text-black shadow-md font-black"
                : "bg-neutral-900 text-neutral-400 hover:text-white hover:bg-neutral-800 border border-neutral-800"
            }`}
          >
            <span>All Categories</span>
            <span
              className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                selectedCategory === "all" ? "bg-black/10 text-black" : "bg-neutral-800 text-neutral-400"
              }`}
            >
              {products.length}
            </span>
          </button>

          {categoryTabs.map((cat) => {
            const count = categoryCounts[cat.toLowerCase()] || 0;
            const isSelected = selectedCategory.toLowerCase() === cat.toLowerCase();
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-2 ${
                  isSelected
                    ? "bg-white text-black shadow-md font-black"
                    : "bg-neutral-900 text-neutral-400 hover:text-white hover:bg-neutral-800 border border-neutral-800"
                }`}
              >
                <span>{cat}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                    isSelected ? "bg-black/10 text-black" : "bg-neutral-800 text-neutral-400"
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Control Bar: Search, Stock Filter, Sort, View Modes */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-3 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 text-xs">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search products by title, SKU, brand, or tag..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-neutral-950 border border-neutral-800 rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-neutral-500 focus:outline-hidden focus:border-neutral-600"
          />
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Stock Filter */}
          <select
            value={stockFilter}
            onChange={(e) => setStockFilter(e.target.value)}
            className="bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-neutral-300 focus:outline-hidden cursor-pointer"
          >
            <option value="all">Stock: All</option>
            <option value="in_stock">In Stock (&gt; 5)</option>
            <option value="low_stock">Low Stock (1-5)</option>
            <option value="out_of_stock">Out of Stock (0)</option>
          </select>

          {/* Sort */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-neutral-300 focus:outline-hidden cursor-pointer"
          >
            <option value="newest">Sort: Newest</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
            <option value="stock_asc">Stock: Low to High</option>
            <option value="name_asc">Name: A to Z</option>
          </select>

          {/* View Mode Toggle */}
          <div className="flex items-center bg-neutral-950 border border-neutral-800 rounded-xl p-0.5">
            <button
              onClick={() => setViewMode("table")}
              title="Table View"
              className={`p-1.5 rounded-lg transition-colors ${
                viewMode === "table" ? "bg-white text-black" : "text-neutral-400 hover:text-white"
              }`}
            >
              <List className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode("grouped")}
              title="Grouped by Category View"
              className={`p-1.5 rounded-lg transition-colors ${
                viewMode === "grouped" ? "bg-white text-black" : "text-neutral-400 hover:text-white"
              }`}
            >
              <FolderTree className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode("grid")}
              title="Grid Card View"
              className={`p-1.5 rounded-lg transition-colors ${
                viewMode === "grid" ? "bg-white text-black" : "text-neutral-400 hover:text-white"
              }`}
            >
              <Grid className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Area based on View Mode */}
      {loading ? (
        <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-16 text-center text-neutral-400">
          <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-xs">Loading TBH catalog products...</p>
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-16 text-center text-neutral-400 space-y-3">
          <Package className="w-12 h-12 text-neutral-600 mx-auto" />
          <h3 className="text-base font-bold text-white">No products found</h3>
          <p className="text-xs max-w-sm mx-auto text-neutral-400">
            No items match your search or category filter. Try clearing filters or create a new product.
          </p>
          <button
            onClick={() => {
              setSearch("");
              setSelectedCategory("all");
              setStockFilter("all");
            }}
            className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-white rounded-xl text-xs font-bold"
          >
            Clear Filters
          </button>
        </div>
      ) : viewMode === "grouped" ? (
        /* ================= GROUPED BY CATEGORY VIEW ================= */
        <div className="space-y-6">
          {Object.entries(groupedProducts).map(([catName, prods]) => (
            <div
              key={catName}
              className="bg-neutral-900 border border-neutral-800 rounded-3xl overflow-hidden shadow-xs"
            >
              {/* Category Section Header */}
              <div className="bg-neutral-950 px-6 py-4 border-b border-neutral-800 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                  <h3 className="text-sm font-black uppercase tracking-wider text-white">
                    {catName}
                  </h3>
                  <span className="text-[11px] font-bold text-neutral-400 bg-neutral-800 px-2 py-0.5 rounded-full">
                    {prods.length} products
                  </span>
                </div>

                <button
                  onClick={() => openCreateModal(catName)}
                  className="text-xs font-bold text-white bg-neutral-800 hover:bg-neutral-700 px-3 py-1.5 rounded-xl flex items-center gap-1.5 transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add to {catName}</span>
                </button>
              </div>

              {/* Products in this category */}
              <div className="divide-y divide-neutral-800/60">
                {prods.map((p) => (
                  <div
                    key={p._id || p.sku}
                    className="p-4 hover:bg-neutral-800/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-colors"
                  >
                    <div className="flex items-center gap-4 min-w-0">
                      <div className="w-12 h-14 rounded-xl bg-neutral-800 overflow-hidden relative shrink-0 border border-neutral-800">
                        {p.images?.[0]?.url && (
                          <Image src={p.images[0].url} alt={p.name} fill className="object-cover" sizes="48px" />
                        )}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <strong className="text-white text-xs font-bold truncate max-w-[280px]">
                            {p.name}
                          </strong>
                          {!p.isActive && (
                            <span className="text-[9px] font-bold bg-neutral-800 text-neutral-400 px-1.5 py-0.2 rounded border border-neutral-700">
                              Hidden
                            </span>
                          )}
                          {p.isVirtualTryOn && (
                            <span className="text-[9px] font-bold text-emerald-400 bg-emerald-950 px-1.5 py-0.2 rounded border border-emerald-800 flex items-center gap-1">
                              <Sparkles className="w-2.5 h-2.5" />
                              NeuralFit
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-3 text-[11px] text-neutral-400 mt-1">
                          <span className="font-mono text-neutral-400">{p.sku}</span>
                          <span>•</span>
                          <span className="uppercase font-bold text-neutral-300">{p.brand}</span>
                          <span>•</span>
                          <span className="text-white font-black">Rs. {p.price.toLocaleString()}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
                      {/* Quick Stock */}
                      <div className="flex items-center gap-1.5 bg-neutral-950 px-2.5 py-1 rounded-xl border border-neutral-800">
                        <button
                          onClick={() => handleQuickStock(p, -1)}
                          className="text-neutral-400 hover:text-white px-1 font-mono font-bold"
                          title="-1 Stock"
                        >
                          -
                        </button>
                        <span
                          className={`text-[11px] font-bold px-2 py-0.5 rounded-md ${
                            p.stock <= 2
                              ? "bg-amber-950 text-amber-400"
                              : "bg-emerald-950 text-emerald-400"
                          }`}
                        >
                          {p.stock} in stock
                        </span>
                        <button
                          onClick={() => handleQuickStock(p, 1)}
                          className="text-neutral-400 hover:text-white px-1 font-mono font-bold"
                          title="+1 Stock"
                        >
                          +
                        </button>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-1">
                        <Link
                          href={`/product/${p.slug}`}
                          target="_blank"
                          className="p-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300"
                          title="View on Storefront"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </Link>
                        <button
                          onClick={() => openEditModal(p)}
                          className="p-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white font-bold flex items-center gap-1 text-xs"
                          title="Edit Product"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                          <span className="hidden md:inline">Edit</span>
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(p)}
                          className="p-2 rounded-xl bg-red-950/50 hover:bg-red-900 text-red-400"
                          title="Delete"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : viewMode === "grid" ? (
        /* ================= GRID CARD VIEW ================= */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredProducts.map((p) => (
            <div
              key={p._id || p.sku}
              className="bg-neutral-900 border border-neutral-800 rounded-3xl overflow-hidden flex flex-col justify-between hover:border-neutral-700 transition-all shadow-xs group"
            >
              <div>
                <div className="aspect-4/5 bg-neutral-800 relative overflow-hidden">
                  {p.images?.[0]?.url && (
                    <Image
                      src={p.images[0].url}
                      alt={p.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                      sizes="(max-width: 768px) 100vw, 300px"
                    />
                  )}
                  {/* Badges */}
                  <div className="absolute top-2.5 left-2.5 flex flex-col gap-1 items-start">
                    <span className="bg-black/80 backdrop-blur-md text-white text-[10px] font-bold px-2 py-0.5 rounded-md uppercase">
                      {p.category}
                    </span>
                    {p.isVirtualTryOn && (
                      <span className="bg-emerald-950/90 text-emerald-400 border border-emerald-800 text-[9px] font-bold px-2 py-0.5 rounded-md">
                        NeuralFit™
                      </span>
                    )}
                  </div>

                  <div className="absolute top-2.5 right-2.5">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full backdrop-blur-md ${
                        p.stock <= 2
                          ? "bg-amber-950/90 text-amber-300 border border-amber-800"
                          : "bg-black/80 text-emerald-400"
                      }`}
                    >
                      {p.stock} units
                    </span>
                  </div>
                </div>

                <div className="p-4 space-y-1.5">
                  <div className="flex items-center justify-between text-[10px] text-neutral-400 uppercase font-mono">
                    <span>{p.brand}</span>
                    <span>{p.sku}</span>
                  </div>
                  <h4 className="text-xs font-bold text-white line-clamp-1">{p.name}</h4>
                  <div className="flex items-center justify-between pt-1">
                    <span className="text-sm font-black text-white">
                      Rs. {p.price.toLocaleString()}
                    </span>
                    {p.originalPrice && p.originalPrice > p.price && (
                      <span className="text-[10px] text-neutral-400 line-through">
                        Rs. {p.originalPrice.toLocaleString()}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="p-4 pt-0 flex items-center gap-2 border-t border-neutral-800/80 mt-3 pt-3">
                <Link
                  href={`/product/${p.slug}`}
                  target="_blank"
                  className="flex-1 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-[11px] font-bold flex items-center justify-center gap-1 transition-colors"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>View</span>
                </Link>
                <button
                  onClick={() => openEditModal(p)}
                  className="flex-1 py-2 rounded-xl bg-white text-black text-[11px] font-black uppercase hover:bg-neutral-200 flex items-center justify-center gap-1 transition-colors"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Edit</span>
                </button>
                <button
                  onClick={() => handleDeleteProduct(p)}
                  className="p-2 rounded-xl bg-neutral-950 hover:bg-red-950 text-neutral-400 hover:text-red-400 transition-colors"
                  title="Delete"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* ================= TABLE VIEW ================= */
        <div className="bg-neutral-900 border border-neutral-800 rounded-3xl overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-neutral-300">
              <thead className="bg-black text-[10px] uppercase font-bold text-neutral-400 border-b border-neutral-800">
                <tr>
                  <th className="py-3.5 px-4">Product</th>
                  <th className="py-3.5 px-4">SKU / Brand</th>
                  <th className="py-3.5 px-4">Category</th>
                  <th className="py-3.5 px-4">Price</th>
                  <th className="py-3.5 px-4">Stock Adjust</th>
                  <th className="py-3.5 px-4">Visibility</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-800/80 font-medium">
                {filteredProducts.map((p) => (
                  <tr key={p._id || p.sku} className="hover:bg-neutral-800/30 transition-colors">
                    {/* Item */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-12 rounded-lg bg-neutral-800 overflow-hidden relative shrink-0 border border-neutral-700">
                          {p.images?.[0]?.url && (
                            <Image src={p.images[0].url} alt={p.name} fill className="object-cover" sizes="40px" />
                          )}
                        </div>
                        <div>
                          <strong className="text-white block font-bold truncate max-w-[220px]">
                            {p.name}
                          </strong>
                          <div className="flex items-center gap-1.5 mt-0.5">
                            {p.isVirtualTryOn && (
                              <span className="text-[9px] font-bold text-emerald-400 bg-emerald-950 px-1.5 py-0.2 rounded border border-emerald-800">
                                NeuralFit
                              </span>
                            )}
                            {p.isFeatured && (
                              <span className="text-[9px] font-bold text-amber-400 bg-amber-950 px-1.5 py-0.2 rounded border border-amber-800">
                                Featured
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* SKU & Brand */}
                    <td className="py-3 px-4">
                      <span className="font-mono text-[11px] uppercase text-neutral-300 block">{p.sku}</span>
                      <span className="text-[10px] text-neutral-500 uppercase font-bold">{p.brand}</span>
                    </td>

                    {/* Category */}
                    <td className="py-3 px-4">
                      <span className="bg-neutral-800 text-white px-2.5 py-1 rounded-lg text-[11px] font-bold inline-block">
                        {p.category}
                      </span>
                      {p.subcategory && (
                        <span className="block text-[10px] text-neutral-500 mt-0.5">
                          {p.subcategory}
                        </span>
                      )}
                    </td>

                    {/* Price */}
                    <td className="py-3 px-4">
                      <div className="font-black text-white">Rs. {p.price.toLocaleString()}</div>
                      {p.originalPrice && p.originalPrice > p.price && (
                        <span className="text-[10px] text-neutral-500 line-through">
                          Rs. {p.originalPrice.toLocaleString()}
                        </span>
                      )}
                    </td>

                    {/* Quick Stock Adjust */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1.5 bg-neutral-950 px-2 py-1 rounded-xl border border-neutral-800 w-fit">
                        <button
                          onClick={() => handleQuickStock(p, -1)}
                          className="text-neutral-400 hover:text-white px-1.5 font-bold"
                          title="Decrease 1"
                        >
                          -
                        </button>
                        <span
                          className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                            p.stock <= 2
                              ? "bg-amber-950 text-amber-400"
                              : "bg-emerald-950 text-emerald-400"
                          }`}
                        >
                          {p.stock}
                        </span>
                        <button
                          onClick={() => handleQuickStock(p, 1)}
                          className="text-neutral-400 hover:text-white px-1.5 font-bold"
                          title="Increase 1"
                        >
                          +
                        </button>
                      </div>
                    </td>

                    {/* Visibility */}
                    <td className="py-3 px-4">
                      <button
                        onClick={() => handleToggleActive(p)}
                        className={`text-[10px] font-bold px-2 py-1 rounded-lg border transition-colors ${
                          p.isActive
                            ? "bg-emerald-950/60 text-emerald-400 border-emerald-800 hover:bg-emerald-900/60"
                            : "bg-neutral-800 text-neutral-400 border-neutral-700 hover:bg-neutral-700"
                        }`}
                      >
                        {p.isActive ? "Published" : "Hidden"}
                      </button>
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-4 text-right space-x-1.5">
                      <Link
                        href={`/product/${p.slug}`}
                        target="_blank"
                        className="p-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 inline-block align-middle"
                        title="View Live Product"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </Link>
                      <button
                        onClick={() => openEditModal(p)}
                        className="p-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-200 inline-block align-middle"
                        title="Edit Product"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteProduct(p)}
                        className="p-1.5 rounded-lg bg-red-950/60 hover:bg-red-900 text-red-400 inline-block align-middle"
                        title="Delete Product"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ================= ADD / EDIT PRODUCT MODAL ================= */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-neutral-900 border border-neutral-800 rounded-3xl max-w-3xl w-full p-6 sm:p-8 shadow-2xl my-8 text-neutral-200">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-neutral-800">
              <div>
                <h2 className="text-lg font-black uppercase tracking-wider text-white">
                  {editingProduct ? `Edit Product: ${editingProduct.name}` : "Create New Product"}
                </h2>
                <p className="text-xs text-neutral-400 mt-0.5">
                  Fill in product details, upload images to Cloudinary, and configure options.
                </p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-neutral-400 hover:text-white p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Navigation Tabs */}
            <div className="flex items-center gap-2 border-b border-neutral-800 mt-4 overflow-x-auto pb-2">
              {[
                { id: "basic", label: "1. Info & Category" },
                { id: "media", label: `2. Cloudinary Images (${images.length})` },
                { id: "pricing", label: "3. Pricing & Stock" },
                { id: "variants", label: "4. Sizes, Colors & AI" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-colors ${
                    activeTab === tab.id
                      ? "bg-white text-black font-black"
                      : "text-neutral-400 hover:text-white hover:bg-neutral-800"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Form */}
            <form onSubmit={handleSaveProduct} className="mt-5 space-y-5 text-xs">
              {/* TAB 1: BASIC INFO & CATEGORIES */}
              {activeTab === "basic" && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="sm:col-span-2">
                      <label className="font-bold text-neutral-300 block mb-1">Product Title *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Waves Poncho Ash – Flower"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full bg-neutral-950 border border-neutral-800 rounded-xl p-2.5 text-white focus:outline-hidden focus:border-white font-medium text-xs"
                      />
                    </div>

                    <div>
                      <label className="font-bold text-neutral-300 block mb-1">SKU Code *</label>
                      <input
                        type="text"
                        required
                        value={sku}
                        onChange={(e) => setSku(e.target.value.toUpperCase())}
                        className="w-full bg-neutral-950 border border-neutral-800 rounded-xl p-2.5 text-white focus:outline-hidden focus:border-white font-mono uppercase text-xs"
                      />
                    </div>

                    <div>
                      <label className="font-bold text-neutral-300 block mb-1">Brand</label>
                      <select
                        value={brand}
                        onChange={(e) => setBrand(e.target.value)}
                        className="w-full bg-neutral-950 border border-neutral-800 rounded-xl p-2.5 text-white focus:outline-hidden cursor-pointer text-xs uppercase"
                      >
                        {brands.map((b) => (
                          <option key={b.name} value={b.name}>
                            {b.name}
                          </option>
                        ))}
                        <option value="TBH">TBH</option>
                        <option value="WAVES">WAVES</option>
                        <option value="ANSEL">ANSEL</option>
                        <option value="PARAKEET">PARAKEET</option>
                        <option value="BREAKWATER">BREAKWATER</option>
                      </select>
                    </div>

                    <div>
                      <label className="font-bold text-neutral-300 block mb-1">Primary Category *</label>
                      <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="w-full bg-neutral-950 border border-neutral-800 rounded-xl p-2.5 text-white focus:outline-hidden cursor-pointer text-xs font-bold"
                      >
                        {categories.map((c) => (
                          <option key={c.name} value={c.name}>
                            {c.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="font-bold text-neutral-300 block mb-1">Subcategory (Optional)</label>
                      <input
                        type="text"
                        placeholder="e.g. Footwear, Loafers, Dresses"
                        value={subcategory}
                        onChange={(e) => setSubcategory(e.target.value)}
                        className="w-full bg-neutral-950 border border-neutral-800 rounded-xl p-2.5 text-white focus:outline-hidden text-xs"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="font-bold text-neutral-300 block mb-1">Short Tagline / Summary</label>
                    <input
                      type="text"
                      placeholder="e.g. Lightweight breathable cotton poncho with floral finish"
                      value={shortDescription}
                      onChange={(e) => setShortDescription(e.target.value)}
                      className="w-full bg-neutral-950 border border-neutral-800 rounded-xl p-2.5 text-white focus:outline-hidden text-xs"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-neutral-300 block mb-1">Full Detailed Description</label>
                    <textarea
                      rows={4}
                      placeholder="Enter fabric composition, fit, care instructions, and brand story..."
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      className="w-full bg-neutral-950 border border-neutral-800 rounded-xl p-2.5 text-white focus:outline-hidden text-xs leading-relaxed"
                    />
                  </div>
                </div>
              )}

              {/* TAB 2: CLOUDINARY IMAGES & GALLERY */}
              {activeTab === "media" && (
                <div className="space-y-4">
                  {/* Upload Box */}
                  <div className="border-2 border-dashed border-neutral-700 hover:border-neutral-500 rounded-2xl p-6 text-center bg-neutral-950/60 transition-colors">
                    <Upload className="w-8 h-8 text-neutral-400 mx-auto mb-2" />
                    <p className="font-bold text-white text-xs mb-1">
                      Upload Product Images to Cloudinary
                    </p>
                    <p className="text-[11px] text-neutral-500 mb-3">
                      High resolution PNG, JPG, or WEBP. Uploads directly to your Cloudinary storage folder.
                    </p>

                    <label className="bg-white hover:bg-neutral-200 text-black px-4 py-2 rounded-xl cursor-pointer text-xs font-black uppercase inline-flex items-center gap-1.5 transition-colors">
                      <Upload className="w-3.5 h-3.5" />
                      <span>{isUploading ? "Uploading..." : "Select Image File"}</span>
                      <input
                        type="file"
                        accept="image/*"
                        disabled={isUploading}
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                    </label>
                  </div>

                  {/* Or Image URL Input */}
                  <div>
                    <label className="font-bold text-neutral-300 block mb-1">Or Add via Image URL</label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="https://images.unsplash.com/..."
                        value={imageUrlInput}
                        onChange={(e) => setImageUrlInput(e.target.value)}
                        className="flex-1 bg-neutral-950 border border-neutral-800 rounded-xl p-2.5 text-white text-xs focus:outline-hidden"
                      />
                      <button
                        type="button"
                        onClick={handleAddImageUrl}
                        className="bg-neutral-800 hover:bg-neutral-700 text-white px-4 py-2 rounded-xl text-xs font-bold"
                      >
                        Add URL
                      </button>
                    </div>
                  </div>

                  {/* Gallery Thumbnails */}
                  <div>
                    <span className="font-bold text-neutral-300 block mb-2">
                      Current Gallery ({images.length} images) — Click star to set Cover Image
                    </span>

                    {images.length === 0 ? (
                      <p className="text-neutral-500 italic text-[11px]">No images uploaded yet.</p>
                    ) : (
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        {images.map((img, idx) => (
                          <div
                            key={idx}
                            className={`group relative rounded-2xl overflow-hidden aspect-3/4 border-2 ${
                              idx === 0 ? "border-white" : "border-neutral-800"
                            } bg-neutral-950`}
                          >
                            <Image src={img.url} alt={`Image ${idx + 1}`} fill className="object-cover" sizes="120px" />

                            {/* Badge */}
                            {idx === 0 && (
                              <span className="absolute top-2 left-2 bg-black/90 text-white text-[9px] font-black uppercase px-2 py-0.5 rounded-md flex items-center gap-1">
                                <Star className="w-2.5 h-2.5 fill-white text-white" />
                                Cover
                              </span>
                            )}

                            {/* Hover Overlay */}
                            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                              {idx !== 0 && (
                                <button
                                  type="button"
                                  onClick={() => handleSetPrimaryImage(idx)}
                                  className="p-1.5 rounded-lg bg-white text-black hover:bg-neutral-200"
                                  title="Make Primary Cover"
                                >
                                  <Star className="w-3.5 h-3.5" />
                                </button>
                              )}
                              <button
                                type="button"
                                onClick={() => handleRemoveImage(idx)}
                                className="p-1.5 rounded-lg bg-red-600 text-white hover:bg-red-700"
                                title="Remove Image"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* TAB 3: PRICING & INVENTORY */}
              {activeTab === "pricing" && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="font-bold text-neutral-300 block mb-1">Selling Price (Rs.) *</label>
                      <input
                        type="number"
                        required
                        value={price}
                        onChange={(e) => setPrice(Number(e.target.value))}
                        className="w-full bg-neutral-950 border border-neutral-800 rounded-xl p-2.5 text-white font-bold text-xs focus:outline-hidden"
                      />
                    </div>

                    <div>
                      <label className="font-bold text-neutral-300 block mb-1">Original MRP (Rs.)</label>
                      <input
                        type="number"
                        value={originalPrice}
                        onChange={(e) => setOriginalPrice(Number(e.target.value))}
                        className="w-full bg-neutral-950 border border-neutral-800 rounded-xl p-2.5 text-white text-xs focus:outline-hidden"
                      />
                      {discountPercent > 0 && (
                        <span className="text-[10px] text-emerald-400 font-bold mt-1 block">
                          Savings: {discountPercent}% OFF to customer
                        </span>
                      )}
                    </div>

                    <div>
                      <label className="font-bold text-neutral-300 block mb-1">Cost Price (Admin Only)</label>
                      <input
                        type="number"
                        value={costPrice}
                        onChange={(e) => setCostPrice(Number(e.target.value))}
                        className="w-full bg-neutral-950 border border-neutral-800 rounded-xl p-2.5 text-white text-xs focus:outline-hidden"
                      />
                      {costPrice > 0 && (
                        <span className="text-[10px] text-neutral-400 font-bold mt-1 block">
                          Profit: Rs. {profit.toLocaleString()} ({profitMargin}%)
                        </span>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="font-bold text-neutral-300 block mb-1">Available Stock Units *</label>
                    <input
                      type="number"
                      required
                      value={stock}
                      onChange={(e) => setStock(Number(e.target.value))}
                      className="w-full bg-neutral-950 border border-neutral-800 rounded-xl p-2.5 text-white font-black text-sm focus:outline-hidden"
                    />
                    <p className="text-[10px] text-neutral-500 mt-1">
                      Items with stock ≤ 5 will trigger low stock warnings automatically.
                    </p>
                  </div>
                </div>
              )}

              {/* TAB 4: SIZES, COLORS & FEATURES */}
              {activeTab === "variants" && (
                <div className="space-y-4">
                  {/* Sizes */}
                  <div>
                    <label className="font-bold text-neutral-300 block mb-2">Available Sizes</label>
                    <div className="flex flex-wrap gap-2 mb-2">
                      {PRESET_SIZES.map((size) => {
                        const isChecked = selectedSizes.includes(size);
                        return (
                          <button
                            key={size}
                            type="button"
                            onClick={() => toggleSize(size)}
                            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
                              isChecked
                                ? "bg-white text-black font-black"
                                : "bg-neutral-950 text-neutral-400 hover:text-white border border-neutral-800"
                            }`}
                          >
                            {size}
                          </button>
                        );
                      })}
                    </div>

                    {/* Add custom size */}
                    <div className="flex gap-2 max-w-xs">
                      <input
                        type="text"
                        placeholder="Add custom size..."
                        value={customSizeInput}
                        onChange={(e) => setCustomSizeInput(e.target.value)}
                        className="flex-1 bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-hidden"
                      />
                      <button
                        type="button"
                        onClick={handleAddCustomSize}
                        className="bg-neutral-800 hover:bg-neutral-700 text-white px-3 py-1.5 rounded-xl font-bold text-xs"
                      >
                        + Add
                      </button>
                    </div>
                  </div>

                  {/* Colors */}
                  <div className="pt-2 border-t border-neutral-800">
                    <label className="font-bold text-neutral-300 block mb-2">Color Swatches</label>
                    <div className="flex flex-wrap gap-2 mb-3">
                      {colors.map((c, i) => (
                        <div
                          key={i}
                          className="flex items-center gap-2 bg-neutral-950 border border-neutral-800 px-3 py-1.5 rounded-xl text-xs"
                        >
                          <span
                            className="w-3.5 h-3.5 rounded-full border border-neutral-700"
                            style={{ backgroundColor: c.hex }}
                          />
                          <span className="text-white font-medium">{c.name}</span>
                          <button
                            type="button"
                            onClick={() => handleRemoveColor(i)}
                            className="text-neutral-500 hover:text-red-400 ml-1"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>

                    <div className="flex items-center gap-2 flex-wrap">
                      <input
                        type="color"
                        value={newColorHex}
                        onChange={(e) => setNewColorHex(e.target.value)}
                        className="w-8 h-8 rounded-lg cursor-pointer bg-transparent border-0"
                      />
                      <input
                        type="text"
                        placeholder="Color Name (e.g. Navy Blue)"
                        value={newColorName}
                        onChange={(e) => setNewColorName(e.target.value)}
                        className="bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-hidden w-44"
                      />
                      <button
                        type="button"
                        onClick={handleAddColor}
                        className="bg-neutral-800 hover:bg-neutral-700 text-white px-3 py-1.5 rounded-xl text-xs font-bold"
                      >
                        + Add Color
                      </button>
                    </div>
                  </div>

                  {/* Toggles */}
                  <div className="pt-4 border-t border-neutral-800 space-y-3">
                    <label className="flex items-center gap-3 cursor-pointer bg-neutral-950 p-3 rounded-2xl border border-neutral-800">
                      <input
                        type="checkbox"
                        checked={isVirtualTryOn}
                        onChange={(e) => setIsVirtualTryOn(e.target.checked)}
                        className="accent-emerald-500 w-4 h-4 rounded"
                      />
                      <div>
                        <span className="font-bold text-white block">Enable NeuralFit™ AI Virtual Try-On</span>
                        <span className="text-[10px] text-neutral-400">
                          Allows shoppers to fit this garment in the interactive 3D virtual studio.
                        </span>
                      </div>
                    </label>

                    <label className="flex items-center gap-3 cursor-pointer bg-neutral-950 p-3 rounded-2xl border border-neutral-800">
                      <input
                        type="checkbox"
                        checked={isFeatured}
                        onChange={(e) => setIsFeatured(e.target.checked)}
                        className="accent-white w-4 h-4 rounded"
                      />
                      <div>
                        <span className="font-bold text-white block">Featured on Homepage</span>
                        <span className="text-[10px] text-neutral-400">
                          Highlights product in the &apos;Must Have&apos; homepage section.
                        </span>
                      </div>
                    </label>

                    <label className="flex items-center gap-3 cursor-pointer bg-neutral-950 p-3 rounded-2xl border border-neutral-800">
                      <input
                        type="checkbox"
                        checked={isActive}
                        onChange={(e) => setIsActive(e.target.checked)}
                        className="accent-emerald-500 w-4 h-4 rounded"
                      />
                      <div>
                        <span className="font-bold text-white block">Visible in Storefront (Published)</span>
                        <span className="text-[10px] text-neutral-400">
                          Uncheck if you want to keep this item as a draft.
                        </span>
                      </div>
                    </label>
                  </div>
                </div>
              )}

              {/* Form Action Buttons */}
              <div className="pt-4 flex items-center justify-between gap-3 border-t border-neutral-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-3 rounded-xl border border-neutral-800 text-neutral-300 font-bold uppercase hover:bg-neutral-800 transition-colors"
                >
                  Cancel
                </button>

                <div className="flex gap-2">
                  {activeTab !== "basic" && (
                    <button
                      type="button"
                      onClick={() => {
                        if (activeTab === "media") setActiveTab("basic");
                        if (activeTab === "pricing") setActiveTab("media");
                        if (activeTab === "variants") setActiveTab("pricing");
                      }}
                      className="px-4 py-3 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white font-bold"
                    >
                      Back
                    </button>
                  )}

                  {activeTab !== "variants" ? (
                    <button
                      type="button"
                      onClick={() => {
                        if (activeTab === "basic") setActiveTab("media");
                        if (activeTab === "media") setActiveTab("pricing");
                        if (activeTab === "pricing") setActiveTab("variants");
                      }}
                      className="px-5 py-3 rounded-xl bg-neutral-700 hover:bg-neutral-600 text-white font-bold"
                    >
                      Next Step →
                    </button>
                  ) : null}

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-6 py-3 rounded-xl bg-white text-black font-black uppercase hover:bg-neutral-200 transition-all disabled:opacity-50 shadow-md"
                  >
                    {isSubmitting ? "Saving..." : editingProduct ? "Save Changes" : "Publish Product"}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
