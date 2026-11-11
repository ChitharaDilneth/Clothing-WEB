"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { UserRole } from "@/types";
import { toast } from "sonner";

interface UserProfile {
  userId: string;
  email: string;
  name: string;
  role: UserRole;
}

interface AuthContextType {
  user: UserProfile | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string, phone?: string) => Promise<boolean>;
  logout: () => Promise<void>;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadUser() {
      try {
        const res = await fetch("/api/auth/me");
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
    }
    loadUser();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (res.ok && data.user) {
        setUser(data.user);
        toast.success(`Welcome back, ${data.user.name}!`);
        return true;
      } else {
        toast.error(data.message || "Invalid email or password");
        return false;
      }
    } catch {
      toast.error("Failed to connect to authentication server");
      return false;
    }
  };

  const register = async (name: string, email: string, password: string, phone?: string): Promise<boolean> => {
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

  const logout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      setUser(null);
      toast.info("Logged out successfully");
      window.location.href = "/";
    } catch {
      setUser(null);
    }
  };

  const isAdmin = Boolean(
    user && (user.role === "superadmin" || user.role === "admin" || user.role === "product_manager")
  );

  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, logout, isAdmin }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
}
