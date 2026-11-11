import mongoose, { Schema, Document, Model } from "mongoose";
import { ICoupon } from "@/types";

export interface ICouponDocument extends Omit<ICoupon, "_id">, Document {}

const CouponSchema = new Schema<ICouponDocument>(
  {
    code: { type: String, required: true, unique: true, uppercase: true, trim: true },
    discountType: { type: String, enum: ["percentage", "fixed"], required: true },
    discountValue: { type: Number, required: true, min: 0 },
    minOrderValue: { type: Number, default: 0 },
    maxDiscount: { type: Number },
    startDate: { type: Date, default: Date.now },
    expiresAt: { type: Date },
    usageLimit: { type: Number },
    usedCount: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const CouponModel: Model<ICouponDocument> =
  mongoose.models.Coupon || mongoose.model<ICouponDocument>("Coupon", CouponSchema);
