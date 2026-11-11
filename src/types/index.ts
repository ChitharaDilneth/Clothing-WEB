export type UserRole = "superadmin" | "admin" | "product_manager" | "order_manager" | "customer";

export interface IUser {
  _id?: string;
  name: string;
  email: string;
  passwordHash?: string;
  role: UserRole;
  phone?: string;
  addresses?: {
    street: string;
    city: string;
    district: string;
    postalCode?: string;
    isDefault?: boolean;
  }[];
  createdAt?: string | Date;
}

export interface IProductColor {
  name: string;
  hex: string;
  inStock?: boolean;
}

export interface IProductImage {
  url: string;
  publicId?: string;
  alt?: string;
}

export interface IProduct {
  _id?: string;
  name: string;
  slug: string;
  sku: string;
  description: string;
  shortDescription?: string;
  brand: string;
  category: string;
  subcategory?: string;
  productType?: string;
  price: number;
  originalPrice?: number;
  costPrice?: number;
  stock: number;
  images: IProductImage[];
  colors: IProductColor[];
  sizes: string[];
  attributes?: Record<string, string>;
  tags?: string[];
  seoTitle?: string;
  seoDescription?: string;
  isFeatured?: boolean;
  isBestseller?: boolean;
  isNewArrival?: boolean;
  isActive?: boolean;
  isCustomizable?: boolean;
  isVirtualTryOn?: boolean;
  createdAt?: string | Date;
  updatedAt?: string | Date;
}

export interface ICategory {
  _id?: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  heroBanner?: string;
  parentCategory?: string;
  sortOrder?: number;
  isActive: boolean;
}

export interface IBrand {
  _id?: string;
  name: string;
  slug: string;
  logo?: string;
  description?: string;
  sortOrder?: number;
  isActive: boolean;
}

export interface ICustomizationDetails {
  baseProductId: string;
  baseProductName: string;
  color: string;
  size: string;
  customText?: string;
  textColor?: string;
  textFont?: string;
  artworkUrl?: string;
  position?: { x: number; y: number; scale: number; rotation: number };
  extraCost: number;
}

export interface ICartItem {
  productId: string;
  name: string;
  slug: string;
  sku: string;
  price: number;
  originalPrice?: number;
  quantity: number;
  image: string;
  brand: string;
  selectedColor?: string;
  selectedSize?: string;
  customization?: ICustomizationDetails;
}

export interface ICoupon {
  _id?: string;
  code: string;
  discountType: "percentage" | "fixed";
  discountValue: number;
  minOrderValue?: number;
  maxDiscount?: number;
  startDate?: string | Date;
  expiresAt?: string | Date;
  usageLimit?: number;
  usedCount: number;
  isActive: boolean;
}

export type OrderStatus =
  | "pending"
  | "confirmed"
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled"
  | "returned"
  | "refunded";

export type PaymentStatus = "pending" | "paid" | "failed" | "refunded";

export interface IOrderItem {
  productId: string;
  name: string;
  sku: string;
  price: number;
  quantity: number;
  image: string;
  selectedColor?: string;
  selectedSize?: string;
  customization?: ICustomizationDetails;
}

export interface IOrder {
  _id?: string;
  orderNumber: string;
  customer: {
    userId?: string;
    name: string;
    email: string;
    phone: string;
  };
  shippingAddress: {
    street: string;
    city: string;
    district: string;
    postalCode?: string;
    deliveryInstructions?: string;
  };
  items: IOrderItem[];
  subtotal: number;
  discount: number;
  couponCode?: string;
  shippingFee: number;
  total: number;
  paymentMethod: "cod" | "card" | "koko" | "mintpay";
  paymentStatus: PaymentStatus;
  orderStatus: OrderStatus;
  trackingNumber?: string;
  internalNotes?: string;
  createdAt?: string | Date;
  updatedAt?: string | Date;
}

export interface IReview {
  _id?: string;
  productId: string;
  productName?: string;
  userName: string;
  rating: number;
  comment: string;
  userLocation?: string;
  matchScore?: string;
  isVerifiedPurchase: boolean;
  isApproved: boolean;
  createdAt?: string | Date;
}

export interface IBanner {
  _id?: string;
  title: string;
  subtitle?: string;
  ctaText?: string;
  ctaLink?: string;
  imageUrl: string;
  position: "hero" | "promo_waves" | "discount_15" | "category_header";
  isActive: boolean;
  sortOrder?: number;
}

export interface ISiteSettings {
  storeName: string;
  announcementText: string;
  contactPhone: string;
  contactEmail: string;
  whatsappNumber: string;
  address: string;
  freeShippingThreshold: number;
  standardShippingFee: number;
  kokoEnabled: boolean;
  mintpayEnabled: boolean;
  codEnabled: boolean;
}
