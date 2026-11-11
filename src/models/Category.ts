import mongoose, { Schema, Document, Model } from "mongoose";
import { ICategory } from "@/types";

export interface ICategoryDocument extends Omit<ICategory, "_id">, Document {}

const CategorySchema = new Schema<ICategoryDocument>(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    description: { type: String },
    image: { type: String },
    heroBanner: { type: String },
    parentCategory: { type: String },
    sortOrder: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const CategoryModel: Model<ICategoryDocument> =
  mongoose.models.Category || mongoose.model<ICategoryDocument>("Category", CategorySchema);
