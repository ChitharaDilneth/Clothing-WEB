"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { UserRole } from "@/types";
import { toast } from "sonner";

interface UserProfile {
  userId: string;
  email: string;
  name: string;
  role: UserRole;
  username?: string;
  brandSlug?: string;
}

interface AuthContextType {
  user: UserProfile | null;
  isLoading: boolean;
  login: (usernameOrEmail: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string, phone?: string) => Promise<boolean>;
  logout: (redirectToOrEvent?: string | React.MouseEvent) => Promise<void>;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const loadUser = async () => {
    try {
      const res = await fetch("/api/auth/me", { cache: "no-store" });
      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
      } else {
        setUser(null);
      }
    } catch {
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadUser();
  }, []);

  const login = async (usernameOrEmail: string, password: string): Promise<boolean> => {
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: usernameOrEmail,
          email: usernameOrEmail,
          password,
        }),
      });
      const data = await res.json();
      if (res.ok && data.user) {
        setUser(data.user);
        toast.success(`Welcome back, ${data.user.name}!`);
        return true;
      } else {
        toast.error(data.message || "Invalid username/email or password");
        return false;
      }
    } catch {
      toast.error("Failed to connect to authentication server");
      return false;
    }
  };

  const register = async (
    name: string,
    email: string,
    password: string,
    phone?: string
  ): Promise<boolean> => {
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, phone }),
      });
      const data = await res.json();
      if (res.ok && data.user) {
        setUser(data.user);
        toast.success("Account created successfully!");
        return true;
      } else {
        toast.error(data.message || "Failed to register");
        return false;
      }
    } catch {
      toast.error("Registration error");
      return false;
    }
  };

  const logout = async (redirectToOrEvent?: string | React.MouseEvent) => {
    const redirectTo = typeof redirectToOrEvent === "string" ? redirectToOrEvent : undefined;
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } catch (e) {
      console.error("Logout request failed:", e);
    } finally {
      setUser(null);
      toast.info("Logged out successfully");
      if (redirectTo) {
        window.location.href = redirectTo;
      } else if (typeof window !== "undefined" && window.location.pathname.startsWith("/admin")) {
        window.location.href = "/admin/login";
      } else {
        window.location.href = "/";
      }
    }
  };

  const isAdmin = Boolean(
    user && (user.role === "superadmin" || user.role === "admin" || user.role === "vendor" || user.role === "brand_manager" || user.role === "product_manager" || user.role === "order_manager")
  );

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        login,
        register,
        logout,
        isAdmin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
