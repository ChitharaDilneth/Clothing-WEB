"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search, Phone, User, Heart, ShoppingBag, Menu, X, Shield } from "lucide-react";
import SiteLogo from "./SiteLogo";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { useAuth } from "@/context/AuthContext";

export default function SiteHeader() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const { itemCount, setIsCartOpen } = useCart();
  const { wishlistCount } = useWishlist();
  const { user, isAdmin, logout } = useAuth();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/category/all?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <header className="w-full bg-white border-b border-gray-100 sticky top-0 z-40 transition-all shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between gap-4 sm:gap-8">
        {/* Brand Logo */}
        <div className="shrink-0">
          <SiteLogo />
        </div>

        {/* Centered Search Bar */}
        <form
          onSubmit={handleSearch}
          className="flex-1 max-w-2xl relative hidden md:block"
        >
          <div className="flex items-center w-full rounded-full border border-gray-200 bg-white hover:border-gray-400 focus-within:border-black transition-colors pl-4 pr-1.5 py-1">
            <input
              type="text"
              placeholder="Search for products"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full text-xs sm:text-sm text-gray-800 placeholder-gray-400 bg-transparent focus:outline-hidden"
            />
            <button
              type="submit"
              className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center hover:bg-neutral-800 transition-colors shrink-0"
              aria-label="Search"
            >
              <Search className="w-4 h-4" />
            </button>
          </div>
        </form>

        {/* Header Right Actions */}
        <div className="flex items-center space-x-3 sm:space-x-5">
          {/* Phone contact button */}
          <a
            href="tel:+94763473075"
            className="hidden lg:flex items-center gap-2 border border-gray-200 rounded-full px-3.5 py-1.5 text-xs font-semibold text-gray-800 hover:border-black transition-colors"
          >
            <div className="w-5 h-5 rounded-full bg-black text-white flex items-center justify-center">
              <Phone className="w-2.5 h-2.5" />
            </div>
            <span>+ (94) 76 347 3075</span>
          </a>

          {/* User Account */}
          <div className="relative">
            <button
              onClick={() => setUserDropdownOpen(!userDropdownOpen)}
              className="p-1.5 rounded-full hover:bg-gray-100 text-gray-700 hover:text-black transition-colors flex items-center"
              aria-label="User Account"
            >
              <User className="w-5 h-5" />
            </button>

            {userDropdownOpen && (
              <div
                className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-xl shadow-lg py-2 z-50 text-xs font-medium"
                onMouseLeave={() => setUserDropdownOpen(false)}
              >
                {user ? (
                  <>
                    <div className="px-4 py-2 border-b border-gray-100 font-semibold text-gray-900 truncate">
                      {user.name}
                      <span className="block text-[10px] text-gray-500 font-normal">{user.email}</span>
                    </div>
                    {isAdmin && (
                      <Link
                        href="/admin"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2 px-4 py-2 hover:bg-gray-50 text-black font-bold"
                      >
                        <Shield className="w-3.5 h-3.5 text-black" />
                        Admin Dashboard
                      </Link>
                    )}
                    <Link
                      href="/account"
                      onClick={() => setUserDropdownOpen(false)}
                      className="block px-4 py-2 hover:bg-gray-50 text-gray-700"
                    >
                      My Account & Orders
                    </Link>
                    <button
                      onClick={() => {
                        setUserDropdownOpen(false);
                        logout();
                      }}
                      className="w-full text-left px-4 py-2 hover:bg-gray-50 text-red-600 border-t border-gray-100"
                    >
                      Sign Out
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      href="/auth/login"
                      onClick={() => setUserDropdownOpen(false)}
                      className="block px-4 py-2 hover:bg-gray-50 text-gray-800 font-semibold"
                    >
                      Customer Login
                    </Link>
                    <Link
                      href="/auth/register"
                      onClick={() => setUserDropdownOpen(false)}
                      className="block px-4 py-2 hover:bg-gray-50 text-gray-600"
                    >
                      Create Account
                    </Link>
                    <div className="border-t border-gray-100 my-1"></div>
                    <Link
                      href="/admin"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-1.5 px-4 py-2 hover:bg-gray-50 text-black font-semibold"
                    >
                      <Shield className="w-3 h-3 text-black" />
                      Admin Login
                    </Link>
                  </>
                )}
              </div>
            )}
          </div>

          {/* Wishlist Icon */}
          <Link
            href="/wishlist"
            className="p-1.5 rounded-full hover:bg-gray-100 text-gray-700 hover:text-black transition-colors relative"
            aria-label="Wishlist"
          >
            <Heart className="w-5 h-5" />
            {wishlistCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-black text-white text-[10px] font-bold flex items-center justify-center">
                {wishlistCount}
              </span>
            )}
          </Link>

          {/* Shopping Cart Icon with badge */}
          <button
            onClick={() => setIsCartOpen(true)}
            className="p-1.5 rounded-full hover:bg-gray-100 text-gray-700 hover:text-black transition-colors relative"
            aria-label="Shopping Cart"
          >
            <ShoppingBag className="w-5 h-5" />
            <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-black text-white text-[10px] font-bold flex items-center justify-center">
              {itemCount}
            </span>
          </button>
        </div>
      </div>

      {/* Mobile Search Bar */}
      <div className="md:hidden px-4 pb-3">
        <form onSubmit={handleSearch} className="flex items-center w-full rounded-full border border-gray-200 bg-white pl-4 pr-1 py-1">
          <input
            type="text"
            placeholder="Search for products"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full text-xs text-gray-800 placeholder-gray-400 bg-transparent focus:outline-hidden"
          />
          <button
            type="submit"
            className="w-7 h-7 rounded-full bg-black text-white flex items-center justify-center shrink-0"
            aria-label="Search"
          >
            <Search className="w-3.5 h-3.5" />
          </button>
        </form>
      </div>
    </header>
  );
}
