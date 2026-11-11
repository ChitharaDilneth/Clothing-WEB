import mongoose, { Schema, Document, Model } from "mongoose";
import { IReview } from "@/types";

export interface IReviewDocument extends Omit<IReview, "_id">, Document {}

const ReviewSchema = new Schema<IReviewDocument>(
  {
    productId: { type: String, required: true, index: true },
    productName: { type: String },
    userName: { type: String, required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, required: true },
    userLocation: { type: String },
    matchScore: { type: String },
    isVerifiedPurchase: { type: Boolean, default: false },
    isApproved: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const ReviewModel: Model<IReviewDocument> =
  mongoose.models.Review || mongoose.model<IReviewDocument>("Review", ReviewSchema);
