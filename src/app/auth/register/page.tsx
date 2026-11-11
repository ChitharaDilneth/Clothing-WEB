"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { User, Mail, Lock, Phone } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import SiteLogo from "@/components/SiteLogo";

export default function RegisterPage() {
  const router = useRouter();
  const { register } = useAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    const success = await register(name, email, password, phone);
    setIsSubmitting(false);
    if (success) {
      router.push("/account");
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16 sm:py-20">
      <div className="text-center mb-8">
        <div className="flex justify-center mb-4">
          <SiteLogo />
        </div>
        <h1 className="text-2xl font-black uppercase tracking-wider text-black">
          Join TBH Community
        </h1>
        <p className="text-xs text-neutral-500 mt-1">
          Create your account for personalized style recommendations and express checkout.
        </p>
      </div>

      <div className="border border-neutral-200 rounded-3xl p-6 sm:p-8 bg-white shadow-xs">
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="font-bold text-neutral-800 block mb-1">Full Name</label>
            <div className="relative flex items-center">
              <User className="w-4 h-4 text-neutral-400 absolute left-3" />
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Ruwan Jayawardena"
                className="w-full border border-neutral-300 rounded-xl pl-9 pr-3 py-2.5 focus:outline-hidden focus:border-black font-medium"
              />
            </div>
          </div>

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
            <label className="font-bold text-neutral-800 block mb-1">Phone Number (Optional)</label>
            <div className="relative flex items-center">
              <Phone className="w-4 h-4 text-neutral-400 absolute left-3" />
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+94 77 123 4567"
                className="w-full border border-neutral-300 rounded-xl pl-9 pr-3 py-2.5 focus:outline-hidden focus:border-black font-medium"
              />
            </div>
          </div>

          <div>
            <label className="font-bold text-neutral-800 block mb-1">Password</label>
            <div className="relative flex items-center">
              <Lock className="w-4 h-4 text-neutral-400 absolute left-3" />
              <input
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="At least 6 characters"
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
              {isSubmitting ? "CREATING ACCOUNT..." : "CREATE ACCOUNT"}
            </button>
          </div>
        </form>

        <div className="mt-6 text-center text-xs text-neutral-500">
          Already have an account?{" "}
          <Link href="/auth/login" className="text-black font-bold hover:underline">
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}
