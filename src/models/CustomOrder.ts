import mongoose, { Schema, Document, Model } from "mongoose";

export interface ICustomOrderDocument extends Document {
  orderNumber: string;
  baseProductId: string;
  baseProductName: string;
  color: string;
  size: string;
  customText?: string;
  textColor?: string;
  textFont?: string;
  artworkUrl?: string;
  position?: { x: number; y: number; scale: number; rotation: number };
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  price: number;
  status: "pending_review" | "approved" | "in_production" | "shipped" | "rejected";
  createdAt: Date;
}

const CustomOrderSchema = new Schema<ICustomOrderDocument>(
  {
    orderNumber: { type: String, required: true, unique: true },
    baseProductId: { type: String, required: true },
    baseProductName: { type: String, required: true },
    color: { type: String, required: true },
    size: { type: String, required: true },
    customText: { type: String },
    textColor: { type: String },
    textFont: { type: String },
    artworkUrl: { type: String },
    position: { type: Schema.Types.Mixed },
    customerName: { type: String, required: true },
    customerEmail: { type: String, required: true },
    customerPhone: { type: String, required: true },
    price: { type: Number, required: true },
    status: {
      type: String,
      enum: ["pending_review", "approved", "in_production", "shipped", "rejected"],
      default: "pending_review",
    },
  },
  { timestamps: true }
);

export const CustomOrderModel: Model<ICustomOrderDocument> =
  mongoose.models.CustomOrder || mongoose.model<ICustomOrderDocument>("CustomOrder", CustomOrderSchema);
