"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Lock, User, ArrowRight, Shield } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import SiteLogo from "@/components/SiteLogo";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();

  const [usernameOrEmail, setUsernameOrEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!usernameOrEmail.trim() || !password) return;

    setIsSubmitting(true);
    const success = await login(usernameOrEmail.trim(), password);
    setIsSubmitting(false);

    if (success) {
      const lower = usernameOrEmail.toLowerCase();
      if (lower === "admin" || lower.includes("admin")) {
        router.push("/admin");
      } else {
        router.push("/account");
      }
    }
  };

  const fillAdminCredentials = () => {
    setUsernameOrEmail("admin");
    setPassword("admin123456");
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16 sm:py-20">
      <div className="text-center mb-8">
        <div className="flex justify-center mb-4">
          <SiteLogo />
        </div>
        <h1 className="text-2xl font-black uppercase tracking-wider text-black">
          Welcome Back
        </h1>
        <p className="text-xs text-neutral-500 mt-1">
          Sign in to access your orders, saved addresses and exclusive perks.
        </p>
      </div>

      <div className="border border-neutral-200 rounded-3xl p-6 sm:p-8 bg-white shadow-xs">
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="font-bold text-neutral-800 block mb-1">
              Username or Email Address
            </label>
            <div className="relative flex items-center">
              <User className="w-4 h-4 text-neutral-400 absolute left-3" />
              <input
                type="text"
                required
                value={usernameOrEmail}
                onChange={(e) => setUsernameOrEmail(e.target.value)}
                placeholder="e.g. admin or name@example.com"
                className="w-full border border-neutral-300 rounded-xl pl-9 pr-3 py-2.5 focus:outline-hidden focus:border-black font-medium"
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="font-bold text-neutral-800">Password</label>
              <Link href="#" className="text-[11px] text-neutral-500 hover:text-black">
                Forgot password?
              </Link>
            </div>
            <div className="relative flex items-center">
              <Lock className="w-4 h-4 text-neutral-400 absolute left-3" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full border border-neutral-300 rounded-xl pl-9 pr-3 py-2.5 focus:outline-hidden focus:border-black font-medium"
              />
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-black text-white py-3.5 rounded-full text-xs font-black uppercase tracking-wider hover:bg-neutral-800 transition-colors shadow-sm disabled:opacity-50 cursor-pointer"
            >
              {isSubmitting ? "SIGNING IN..." : "SIGN IN"}
            </button>
          </div>
        </form>

        {/* Demo Fast Login Helper */}
        <div className="mt-6 pt-4 border-t border-neutral-100 bg-neutral-50 rounded-xl p-3 text-[11px] text-neutral-600 flex items-center justify-between">
          <div>
            <span className="font-bold block text-neutral-900">Admin Quick Access</span>
            <span>admin / admin123456</span>
          </div>
          <button
            type="button"
            onClick={fillAdminCredentials}
            className="text-[10px] font-bold bg-neutral-200 hover:bg-neutral-300 px-2.5 py-1 rounded-md text-black transition-colors cursor-pointer"
          >
            Auto Fill
          </button>
        </div>

        {/* Executive Admin Link */}
        <div className="mt-4 pt-3 border-t border-neutral-100 text-center">
          <Link
            href="/admin/login"
            className="text-[11px] font-bold text-neutral-600 hover:text-black inline-flex items-center gap-1"
          >
            <Shield className="w-3.5 h-3.5 text-neutral-700" />
            <span>Dedicated Executive Admin Console →</span>
          </Link>
        </div>

        <div className="text-center mt-6 pt-4 border-t border-neutral-100">
          <p className="text-neutral-500">
            Don&apos;t have an account?{" "}
            <Link href="/auth/register" className="font-bold text-black hover:underline">
              Register now
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
