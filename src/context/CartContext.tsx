"use client";

import React, { createContext, useContext, useEffect, useState, useMemo } from "react";
import { ICartItem, ICustomizationDetails } from "@/types";
import { toast } from "sonner";

interface CartContextType {
  cart: ICartItem[];
  addToCart: (item: {
    productId: string;
    name: string;
    slug: string;
    sku: string;
    price: number;
    originalPrice?: number;
    image: string;
    brand: string;
    selectedColor?: string;
    selectedSize?: string;
    customization?: ICustomizationDetails;
    quantity?: number;
  }) => void;
  removeFromCart: (productId: string, selectedColor?: string, selectedSize?: string) => void;
  updateQuantity: (productId: string, quantity: number, selectedColor?: string, selectedSize?: string) => void;
  clearCart: () => void;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  subtotal: number;
  itemCount: number;
  shippingFee: number;
  freeShippingRemaining: number;
  couponCode: string;
  discount: number;
  applyCoupon: (code: string) => Promise<{ success: boolean; message: string }>;
  removeCoupon: () => void;
  total: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const FREE_SHIPPING_THRESHOLD = 8500;
const STANDARD_SHIPPING = 450;

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<ICartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [couponCode, setCouponCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    try {
      const saved = localStorage.getItem("tbh_cart");
      if (saved) {
        setCart(JSON.parse(saved));
      }
      const savedCoupon = localStorage.getItem("tbh_coupon");
      if (savedCoupon) {
        const parsed = JSON.parse(savedCoupon);
        setCouponCode(parsed.code || "");
        setDiscount(parsed.discount || 0);
      }
    } catch (e) {
      console.error("Failed to load cart from storage", e);
    }
  }, []);

  useEffect(() => {
    if (!isMounted) return;
    try {
      localStorage.setItem("tbh_cart", JSON.stringify(cart));
    } catch (e) {
      console.error("Failed to save cart", e);
    }
  }, [cart, isMounted]);

  const addToCart = (item: {
    productId: string;
    name: string;
    slug: string;
    sku: string;
    price: number;
    originalPrice?: number;
    image: string;
    brand: string;
    selectedColor?: string;
    selectedSize?: string;
    customization?: ICustomizationDetails;
    quantity?: number;
  }) => {
    const qty = item.quantity || 1;
    setCart((prev) => {
      const existingIndex = prev.findIndex(
        (i) =>
          i.productId === item.productId &&
          i.selectedColor === item.selectedColor &&
          i.selectedSize === item.selectedSize &&
          !item.customization
      );

      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex].quantity += qty;
        return updated;
      }

      return [
        ...prev,
        {
          productId: item.productId,
          name: item.name,
          slug: item.slug,
          sku: item.sku,
          price: item.price,
          originalPrice: item.originalPrice,
          quantity: qty,
          image: item.image,
          brand: item.brand,
          selectedColor: item.selectedColor,
          selectedSize: item.selectedSize,
          customization: item.customization,
        },
      ];
    });

    toast.success(`Added ${item.name} to cart`);
    setIsCartOpen(true);
  };

  const removeFromCart = (productId: string, selectedColor?: string, selectedSize?: string) => {
    setCart((prev) =>
      prev.filter(
        (i) =>
          !(
            i.productId === productId &&
            i.selectedColor === selectedColor &&
            i.selectedSize === selectedSize
          )
      )
    );
    toast.info("Item removed from cart");
  };

  const updateQuantity = (
    productId: string,
    quantity: number,
    selectedColor?: string,
    selectedSize?: string
  ) => {
    if (quantity <= 0) {
      removeFromCart(productId, selectedColor, selectedSize);
      return;
    }

    setCart((prev) =>
      prev.map((i) => {
        if (
          i.productId === productId &&
          i.selectedColor === selectedColor &&
          i.selectedSize === selectedSize
        ) {
          return { ...i, quantity };
        }
        return i;
      })
    );
  };

  const clearCart = () => {
    setCart([]);
    setCouponCode("");
    setDiscount(0);
    localStorage.removeItem("tbh_cart");
    localStorage.removeItem("tbh_coupon");
  };

  const subtotal = useMemo(() => {
    return cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }, [cart]);

  const itemCount = useMemo(() => {
    return cart.reduce((sum, item) => sum + item.quantity, 0);
  }, [cart]);

  const shippingFee = useMemo(() => {
    if (subtotal === 0) return 0;
    return subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : STANDARD_SHIPPING;
  }, [subtotal]);

  const freeShippingRemaining = useMemo(() => {
    return Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);
  }, [subtotal]);

  const applyCoupon = async (code: string) => {
    if (!code.trim()) {
      return { success: false, message: "Please enter a coupon code." };
    }
    try {
      const res = await fetch("/api/coupons/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code, subtotal }),
      });
      const data = await res.json();
      if (data.valid) {
        setCouponCode(code.toUpperCase());
        setDiscount(data.discount);
        localStorage.setItem(
          "tbh_coupon",
          JSON.stringify({ code: code.toUpperCase(), discount: data.discount })
        );
        toast.success(data.message);
        return { success: true, message: data.message };
      } else {
        toast.error(data.message);
        return { success: false, message: data.message };
      }
    } catch {
      toast.error("Failed to validate coupon");
      return { success: false, message: "Network error validating coupon" };
    }
  };

  const removeCoupon = () => {
    setCouponCode("");
    setDiscount(0);
    localStorage.removeItem("tbh_coupon");
    toast.info("Coupon removed");
  };

  const total = useMemo(() => {
    const afterDiscount = Math.max(0, subtotal - discount);
    return afterDiscount > 0 ? afterDiscount + shippingFee : 0;
  }, [subtotal, discount, shippingFee]);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        isCartOpen,
        setIsCartOpen,
        subtotal,
        itemCount,
        shippingFee,
        freeShippingRemaining,
        couponCode,
        discount,
        applyCoupon,
        removeCoupon,
        total,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within CartProvider");
  return context;
}
