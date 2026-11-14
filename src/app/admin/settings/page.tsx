"use client";

import React, { useEffect, useState } from "react";
import { Settings, Save, Check } from "lucide-react";
import { ISiteSettings } from "@/types";
import { toast } from "sonner";

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<ISiteSettings>({
    storeName: "TBH — The Brand Hub",
    announcementText: "Free Shipping For Orders Above Rs. 8500/=",
    contactPhone: "+ (94) 76 347 3075",
    contactEmail: "info@thebrandhub.lk",
    whatsappNumber: "+94763473075",
    address: "110, Kumaran Ratnam Road, Colombo 02, Sri Lanka.",
    freeShippingThreshold: 8500,
    standardShippingFee: 450,
    kokoEnabled: true,
    mintpayEnabled: true,
    codEnabled: true,
  });

  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    async function loadSettings() {
      try {
        const res = await fetch("/api/settings");
        if (res.ok) {
          const data = await res.json();
          if (data) setSettings(data);
        }
      } catch (e) {
        console.error(e);
      }
    }
    loadSettings();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const res = await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });
      if (res.ok) {
        toast.success("Site configuration saved!");
      } else {
        toast.error("Failed to save settings");
      }
    } catch {
      toast.error("Network error saving settings");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-black uppercase tracking-wider text-neutral-900">
          Store &amp; Logistics Settings
        </h1>
        <p className="text-xs text-neutral-500 mt-0.5 font-medium">
          Configure global announcement messages, shipping thresholds, and payment integrations.
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* General Store Details */}
        <div className="glass-panel rounded-3xl p-6 sm:p-8 space-y-4 text-xs">
          <h2 className="text-sm font-black uppercase tracking-wider text-neutral-900">
            Brand Profile &amp; Contact
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="font-bold text-neutral-700 block mb-1">Store Name</label>
              <input
                type="text"
                value={settings.storeName}
                onChange={(e) => setSettings({ ...settings, storeName: e.target.value })}
                className="w-full bg-neutral-50 border border-neutral-200 rounded-2xl p-3 text-neutral-900 focus:outline-hidden focus:border-black font-medium"
              />
            </div>

            <div>
              <label className="font-bold text-neutral-700 block mb-1">Contact Phone</label>
              <input
                type="text"
                value={settings.contactPhone}
                onChange={(e) => setSettings({ ...settings, contactPhone: e.target.value })}
                className="w-full bg-neutral-50 border border-neutral-200 rounded-2xl p-3 text-neutral-900 focus:outline-hidden focus:border-black font-medium"
              />
            </div>

            <div>
              <label className="font-bold text-neutral-700 block mb-1">Customer Support Email</label>
              <input
                type="email"
                value={settings.contactEmail}
                onChange={(e) => setSettings({ ...settings, contactEmail: e.target.value })}
                className="w-full bg-neutral-50 border border-neutral-200 rounded-2xl p-3 text-neutral-900 focus:outline-hidden focus:border-black font-medium"
              />
            </div>

            <div>
              <label className="font-bold text-neutral-700 block mb-1">WhatsApp Concierge Phone</label>
              <input
                type="text"
                value={settings.whatsappNumber}
                onChange={(e) => setSettings({ ...settings, whatsappNumber: e.target.value })}
                className="w-full bg-neutral-50 border border-neutral-200 rounded-2xl p-3 text-neutral-900 focus:outline-hidden focus:border-black font-medium"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="font-bold text-neutral-700 block mb-1">Store Address (Colombo)</label>
              <input
                type="text"
                value={settings.address}
                onChange={(e) => setSettings({ ...settings, address: e.target.value })}
                className="w-full bg-neutral-50 border border-neutral-200 rounded-2xl p-3 text-neutral-900 focus:outline-hidden focus:border-black font-medium"
              />
            </div>
          </div>
        </div>

        {/* Announcement Bar & Shipping */}
        <div className="bg-white border border-neutral-200/80 rounded-3xl p-6 sm:p-8 shadow-[0_2px_16px_rgba(0,0,0,0.03)] space-y-4 text-xs">
          <h2 className="text-sm font-black uppercase tracking-wider text-neutral-900">
            Announcement Bar &amp; Islandwide Logistics
          </h2>

          <div>
            <label className="font-bold text-neutral-700 block mb-1">Header Announcement Text</label>
            <input
              type="text"
              value={settings.announcementText}
              onChange={(e) => setSettings({ ...settings, announcementText: e.target.value })}
              className="w-full bg-neutral-50 border border-neutral-200 rounded-2xl p-3 text-neutral-900 focus:outline-hidden focus:border-black font-medium"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="font-bold text-neutral-700 block mb-1">
                Free Shipping Threshold (LKR)
              </label>
              <input
                type="number"
                value={settings.freeShippingThreshold}
                onChange={(e) =>
                  setSettings({ ...settings, freeShippingThreshold: Number(e.target.value) })
                }
                className="w-full bg-neutral-50 border border-neutral-200 rounded-2xl p-3 text-neutral-900 font-bold focus:outline-hidden focus:border-black"
              />
            </div>

            <div>
              <label className="font-bold text-neutral-700 block mb-1">
                Standard Islandwide Shipping Fee (LKR)
              </label>
              <input
                type="number"
                value={settings.standardShippingFee}
                onChange={(e) =>
                  setSettings({ ...settings, standardShippingFee: Number(e.target.value) })
                }
                className="w-full bg-neutral-50 border border-neutral-200 rounded-2xl p-3 text-neutral-900 font-bold focus:outline-hidden focus:border-black"
              />
            </div>
          </div>
        </div>

        {/* Payment Gateways */}
        <div className="bg-white border border-neutral-200/80 rounded-3xl p-6 sm:p-8 shadow-[0_2px_16px_rgba(0,0,0,0.03)] space-y-3 text-xs">
          <h2 className="text-sm font-black uppercase tracking-wider text-neutral-900 mb-2">
            Payment Methods Active on Storefront
          </h2>

          <div className="space-y-3">
            <label className="flex items-center gap-3 p-3 bg-neutral-50 rounded-2xl border border-neutral-200 cursor-pointer">
              <input
                type="checkbox"
                checked={settings.codEnabled}
                onChange={(e) => setSettings({ ...settings, codEnabled: e.target.checked })}
                className="accent-black w-4 h-4 rounded"
              />
              <span className="font-bold text-neutral-900">Cash On Delivery (Island Wide COD)</span>
            </label>

            <label className="flex items-center gap-3 p-3 bg-neutral-50 rounded-2xl border border-neutral-200 cursor-pointer">
              <input
                type="checkbox"
                checked={settings.kokoEnabled}
                onChange={(e) => setSettings({ ...settings, kokoEnabled: e.target.checked })}
                className="accent-black w-4 h-4 rounded"
              />
              <span className="font-bold text-[#e11d48]">KOKO — 3 Interest-Free Installments</span>
            </label>

            <label className="flex items-center gap-3 p-3 bg-neutral-50 rounded-2xl border border-neutral-200 cursor-pointer">
              <input
                type="checkbox"
                checked={settings.mintpayEnabled}
                onChange={(e) => setSettings({ ...settings, mintpayEnabled: e.target.checked })}
                className="accent-black w-4 h-4 rounded"
              />
              <span className="font-bold text-[#0284c7]">Mintpay — Buy Now Pay Later</span>
            </label>
          </div>
        </div>

        {/* Glassmorphic Save Button */}
        <button
          type="submit"
          disabled={isSaving}
          className="glass-btn-dark text-white text-xs font-bold uppercase tracking-wider px-8 py-3.5 rounded-2xl disabled:opacity-50 flex items-center gap-2 cursor-pointer"
        >
          <Save className="w-4 h-4" />
          <span>{isSaving ? "Saving..." : "Save All Settings"}</span>
        </button>
      </form>
    </div>
  );
}
