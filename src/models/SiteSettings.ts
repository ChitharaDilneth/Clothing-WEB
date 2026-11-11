import mongoose, { Schema, Document, Model } from "mongoose";
import { ISiteSettings } from "@/types";

export interface ISiteSettingsDocument extends Document, ISiteSettings {}

const SiteSettingsSchema = new Schema<ISiteSettingsDocument>(
  {
    storeName: { type: String, default: "TBH — The Brand Hub" },
    announcementText: { type: String, default: "Free Shipping For Orders Above Rs. 8500/=" },
    contactPhone: { type: String, default: "+ (94) 76 347 3075" },
    contactEmail: { type: String, default: "info@thebrandhub.lk" },
    whatsappNumber: { type: String, default: "+94763473075" },
    address: { type: String, default: "110, Kumaran Ratnam Road, Colombo 02, Sri Lanka." },
    freeShippingThreshold: { type: Number, default: 8500 },
    standardShippingFee: { type: Number, default: 450 },
    kokoEnabled: { type: Boolean, default: true },
    mintpayEnabled: { type: Boolean, default: true },
    codEnabled: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const SiteSettingsModel: Model<ISiteSettingsDocument> =
  mongoose.models.SiteSettings || mongoose.model<ISiteSettingsDocument>("SiteSettings", SiteSettingsSchema);
