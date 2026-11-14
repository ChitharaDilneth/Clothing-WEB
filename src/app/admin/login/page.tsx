"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Lock, User, ArrowRight, ShieldCheck, Eye, EyeOff, Sparkles } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import SiteLogo from "@/components/SiteLogo";

export default function AdminLoginPage() {
  const router = useRouter();
  const { login } = useAuth();

  const [usernameOrEmail, setUsernameOrEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!usernameOrEmail.trim() || !password) return;

    setIsSubmitting(true);
    const success = await login(usernameOrEmail.trim(), password);
    setIsSubmitting(false);

    if (success) {
      router.push("/admin");
    }
  };

  const fillAdminCredentials = () => {
    setUsernameOrEmail("admin");
    setPassword("admin123456");
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-neutral-100 flex flex-col justify-center items-center px-4 py-12 antialiased selection:bg-neutral-800">
      {/* Background glow effect */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-neutral-800/20 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
        {/* Brand Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <SiteLogo variant="light" />
          </div>
          <div className="inline-flex items-center gap-1.5 bg-neutral-900 border border-neutral-800 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest text-neutral-300 mb-3">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>EXECUTIVE ADMIN PORTAL</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
            Admin Sign In
          </h1>
          <p className="text-xs text-neutral-400 mt-1.5">
            Authenticate with your administrator credentials to access the store management console.
          </p>
        </div>

        {/* Login Box */}
        <div className="bg-neutral-950/80 border border-neutral-800/90 rounded-3xl p-6 sm:p-8 backdrop-blur-xl shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            {/* Username or Email Input */}
            <div>
              <label className="font-extrabold uppercase tracking-wider text-neutral-300 block mb-1.5 text-[11px]">
                Username or Admin Email
              </label>
              <div className="relative flex items-center">
                <User className="w-4 h-4 text-neutral-500 absolute left-3.5" />
                <input
                  type="text"
                  required
                  value={usernameOrEmail}
                  onChange={(e) => setUsernameOrEmail(e.target.value)}
                  placeholder="e.g. admin or admin@thebrandhub.lk"
                  className="w-full bg-neutral-900/90 text-white placeholder-neutral-500 border border-neutral-800 rounded-xl pl-10 pr-3 py-3 focus:outline-hidden focus:border-white transition-colors font-medium text-xs sm:text-sm"
                />
              </div>
            </div>

            {/* Password Input */}
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="font-extrabold uppercase tracking-wider text-neutral-300 text-[11px]">
                  Password
                </label>
              </div>
              <div className="relative flex items-center">
                <Lock className="w-4 h-4 text-neutral-500 absolute left-3.5" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full bg-neutral-900/90 text-white placeholder-neutral-500 border border-neutral-800 rounded-xl pl-10 pr-10 py-3 focus:outline-hidden focus:border-white transition-colors font-medium text-xs sm:text-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 text-neutral-500 hover:text-white p-1 transition-colors"
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Sign In Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-white text-black hover:bg-neutral-200 py-3.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all shadow-md flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
              >
                <span>{isSubmitting ? "AUTHENTICATING..." : "SIGN IN TO ADMIN"}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>

          {/* Quick Demo Helper */}
          <div className="mt-6 pt-5 border-t border-neutral-850">
            <div className="bg-neutral-900/60 border border-neutral-800 rounded-2xl p-3.5 flex flex-col sm:flex-row items-center justify-between gap-2.5">
              <div className="text-[11px] text-neutral-400 text-center sm:text-left">
                <span className="font-bold text-neutral-200 block">Default Admin Credentials</span>
                <span>Username: <strong className="text-white">admin</strong> | Pass: <strong className="text-white">admin123456</strong></span>
              </div>
              <button
                type="button"
                onClick={fillAdminCredentials}
                className="text-[10px] font-black uppercase tracking-wider bg-white/10 hover:bg-white/20 text-white px-3 py-1.5 rounded-lg border border-white/10 transition-colors whitespace-nowrap cursor-pointer flex items-center gap-1"
              >
                <Sparkles className="w-3 h-3 text-amber-400" />
                <span>Auto Fill</span>
              </button>
            </div>
          </div>
        </div>

        {/* Back Link */}
        <div className="text-center mt-6">
          <Link
            href="/"
            className="text-xs text-neutral-500 hover:text-white transition-colors font-medium inline-flex items-center gap-1.5"
          >
            <span>← Back to Storefront Home</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

