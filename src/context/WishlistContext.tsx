"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { IProduct } from "@/types";
import { toast } from "sonner";

interface WishlistContextType {
  wishlist: IProduct[];
  addToWishlist: (product: IProduct) => void;
  removeFromWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
  toggleWishlist: (product: IProduct) => void;
  wishlistCount: number;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const [wishlist, setWishlist] = useState<IProduct[]>([]);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    try {
      const saved = localStorage.getItem("tbh_wishlist");
      if (saved) {
        setWishlist(JSON.parse(saved));
      }
    } catch (e) {
      console.error("Failed to load wishlist", e);
    }
  }, []);

  useEffect(() => {
    if (!isMounted) return;
    try {
      localStorage.setItem("tbh_wishlist", JSON.stringify(wishlist));
    } catch (e) {
      console.error("Failed to save wishlist", e);
    }
  }, [wishlist, isMounted]);

  const isInWishlist = (productId: string) => {
    return wishlist.some((item) => item._id === productId || item.slug === productId);
  };

  const addToWishlist = (product: IProduct) => {
    if (!isInWishlist(product._id || product.slug)) {
      setWishlist((prev) => [...prev, product]);
      toast.success(`Saved ${product.name} to wishlist`);
    }
  };

  const removeFromWishlist = (productId: string) => {
    setWishlist((prev) => prev.filter((item) => item._id !== productId && item.slug !== productId));
    toast.info("Removed from wishlist");
  };

  const toggleWishlist = (product: IProduct) => {
    const id = product._id || product.slug;
    if (isInWishlist(id)) {
      removeFromWishlist(id);
    } else {
      addToWishlist(product);
    }
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        addToWishlist,
        removeFromWishlist,
        isInWishlist,
        toggleWishlist,
        wishlistCount: wishlist.length,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (!context) throw new Error("useWishlist must be used within WishlistProvider");
  return context;
}
