"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Lock, Mail, ArrowRight, Shield } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import SiteLogo from "@/components/SiteLogo";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    const success = await login(email, password);
    setIsSubmitting(false);
    if (success) {
      if (email.toLowerCase().includes("admin")) {
        router.push("/admin");
      } else {
        router.push("/account");
      }
    }
  };

  const fillAdminCredentials = () => {
    setEmail("admin@thebrandhub.lk");
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
            <label className="font-bold text-neutral-800 block mb-1">Email Address</label>
            <div className="relative flex items-center">
              <Mail className="w-4 h-4 text-neutral-400 absolute left-3" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
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
              className="w-full bg-black text-white py-3.5 rounded-full text-xs font-black uppercase tracking-wider hover:bg-neutral-800 transition-colors shadow-sm disabled:opacity-50"
            >
              {isSubmitting ? "SIGNING IN..." : "SIGN IN"}
            </button>
          </div>
        </form>

        {/* Demo Fast Login Helper */}
        <div className="mt-6 pt-4 border-t border-neutral-100 bg-neutral-50 rounded-xl p-3 text-[11px] text-neutral-600 flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <Shield className="w-3.5 h-3.5 text-neutral-700" />
            <span>Admin Demo Account</span>
          </div>
          <button
            type="button"
            onClick={fillAdminCredentials}
            className="text-black font-black uppercase tracking-wider hover:underline"
          >
            Auto-fill
          </button>
        </div>

        <div className="mt-6 text-center text-xs text-neutral-500">
          Don&apos;t have an account yet?{" "}
          <Link href="/auth/register" className="text-black font-bold hover:underline">
            Create an Account
          </Link>
        </div>
      </div>
    </div>
  );
}
