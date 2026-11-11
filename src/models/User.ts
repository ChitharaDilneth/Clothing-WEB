import mongoose, { Schema, Document, Model } from "mongoose";
import { IUser } from "@/types";

export interface IUserDocument extends Omit<IUser, "_id">, Document {}

const UserSchema = new Schema<IUserDocument>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
    role: {
      type: String,
      enum: ["superadmin", "admin", "product_manager", "order_manager", "customer"],
      default: "customer",
    },
    phone: { type: String },
    addresses: [
      {
        street: { type: String },
        city: { type: String },
        district: { type: String },
        postalCode: { type: String },
        isDefault: { type: Boolean, default: false },
      },
    ],
  },
  { timestamps: true }
);

export const UserModel: Model<IUserDocument> =
  mongoose.models.User || mongoose.model<IUserDocument>("User", UserSchema);
