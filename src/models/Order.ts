import mongoose, { Schema, Document, Model } from "mongoose";
import { IOrder } from "@/types";

export interface IOrderDocument extends Omit<IOrder, "_id">, Document {}

const OrderItemSchema = new Schema({
  productId: { type: String, required: true },
  name: { type: String, required: true },
  sku: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true, min: 1 },
  image: { type: String, required: true },
  selectedColor: { type: String },
  selectedSize: { type: String },
  customization: { type: Schema.Types.Mixed },
});

const OrderSchema = new Schema<IOrderDocument>(
  {
    orderNumber: { type: String, required: true, unique: true, index: true },
    customer: {
      userId: { type: String },
      name: { type: String, required: true },
      email: { type: String, required: true },
      phone: { type: String, required: true },
    },
    shippingAddress: {
      street: { type: String, required: true },
      city: { type: String, required: true },
      district: { type: String, required: true },
      postalCode: { type: String },
      deliveryInstructions: { type: String },
    },
    items: [OrderItemSchema],
    subtotal: { type: Number, required: true },
    discount: { type: Number, default: 0 },
    couponCode: { type: String },
    shippingFee: { type: Number, default: 0 },
    total: { type: Number, required: true },
    paymentMethod: {
      type: String,
      enum: ["cod", "card", "koko", "mintpay"],
      default: "cod",
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed", "refunded"],
      default: "pending",
    },
    orderStatus: {
      type: String,
      enum: ["pending", "confirmed", "processing", "shipped", "delivered", "cancelled", "returned", "refunded"],
      default: "pending",
    },
    trackingNumber: { type: String },
    internalNotes: { type: String },
  },
  { timestamps: true }
);

export const OrderModel: Model<IOrderDocument> =
  mongoose.models.Order || mongoose.model<IOrderDocument>("Order", OrderSchema);
