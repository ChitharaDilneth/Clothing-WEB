import mongoose, { Schema, Document, Model } from "mongoose";
import { IProduct } from "@/types";

export interface IProductDocument extends Omit<IProduct, "_id">, Document {}

const ProductColorSchema = new Schema(
  {
    name: { type: String, required: true },
    hex: { type: String, required: true },
    inStock: { type: Boolean, default: true },
  },
  { _id: false }
);

const ProductImageSchema = new Schema(
  {
    url: { type: String, required: true },
    publicId: { type: String },
    alt: { type: String },
  },
  { _id: false }
);

const ProductSchema = new Schema<IProductDocument>(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    sku: { type: String, required: true, unique: true, uppercase: true, trim: true },
    description: { type: String, required: true },
    shortDescription: { type: String },
    brand: { type: String, required: true, index: true },
    category: { type: String, required: true, index: true },
    subcategory: { type: String, index: true },
    productType: { type: String },
    price: { type: Number, required: true, min: 0 },
    originalPrice: { type: Number, min: 0 },
    costPrice: { type: Number, min: 0 },
    stock: { type: Number, required: true, default: 0, min: 0 },
    images: [ProductImageSchema],
    colors: [ProductColorSchema],
    sizes: [{ type: String }],
    attributes: { type: Map, of: String },
    tags: [{ type: String }],
    seoTitle: { type: String },
    seoDescription: { type: String },
    isFeatured: { type: Boolean, default: false },
    isBestseller: { type: Boolean, default: false },
    isNewArrival: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
    isCustomizable: { type: Boolean, default: false },
    isVirtualTryOn: { type: Boolean, default: false },
  },
  { timestamps: true }
);

ProductSchema.index({ name: "text", description: "text", tags: "text", sku: "text" });

export const ProductModel: Model<IProductDocument> =
  mongoose.models.Product || mongoose.model<IProductDocument>("Product", ProductSchema);
