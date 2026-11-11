import mongoose, { Schema, Document, Model } from "mongoose";
import { IBanner } from "@/types";

export interface IBannerDocument extends Omit<IBanner, "_id">, Document {}

const BannerSchema = new Schema<IBannerDocument>(
  {
    title: { type: String, required: true },
    subtitle: { type: String },
    ctaText: { type: String },
    ctaLink: { type: String },
    imageUrl: { type: String, required: true },
    position: {
      type: String,
      enum: ["hero", "promo_waves", "discount_15", "category_header"],
      required: true,
    },
    isActive: { type: Boolean, default: true },
    sortOrder: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export const BannerModel: Model<IBannerDocument> =
  mongoose.models.Banner || mongoose.model<IBannerDocument>("Banner", BannerSchema);
