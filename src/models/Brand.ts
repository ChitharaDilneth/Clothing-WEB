import mongoose, { Schema, Document, Model } from "mongoose";
import { IBrand } from "@/types";

export interface IBrandDocument extends Omit<IBrand, "_id">, Document {}

const BrandSchema = new Schema<IBrandDocument>(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    logo: { type: String },
    banner: { type: String },
    tagline: { type: String },
    description: { type: String },
    story: { type: String },
    phone: { type: String },
    email: { type: String },
    website: { type: String },
    sortOrder: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
    featured: { type: Boolean, default: false },
    managerUsername: { type: String, trim: true, lowercase: true },
  },
  { timestamps: true }
);

export const BrandModel: Model<IBrandDocument> =
  mongoose.models.Brand || mongoose.model<IBrandDocument>("Brand", BrandSchema);
