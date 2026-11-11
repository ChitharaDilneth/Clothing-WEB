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
        <h1 className="text-2xl font-black uppercase tracking-wider text-white">
          Store &amp; Logistics Settings
        </h1>
        <p className="text-xs text-neutral-400 mt-0.5">
          Configure global announcement messages, shipping thresholds, and payment integrations.
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* General Store Details */}
        <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-6 shadow-xs space-y-4 text-xs">
          <h2 className="text-sm font-black uppercase tracking-wider text-white">
            Brand Profile &amp; Contact
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="font-bold text-neutral-300 block mb-1">Store Name</label>
              <input
                type="text"
                value={settings.storeName}
                onChange={(e) => setSettings({ ...settings, storeName: e.target.value })}
                className="w-full bg-neutral-950 border border-neutral-800 rounded-xl p-2.5 text-white focus:outline-hidden"
              />
            </div>

            <div>
              <label className="font-bold text-neutral-300 block mb-1">Contact Phone</label>
              <input
                type="text"
                value={settings.contactPhone}
                onChange={(e) => setSettings({ ...settings, contactPhone: e.target.value })}
                className="w-full bg-neutral-950 border border-neutral-800 rounded-xl p-2.5 text-white focus:outline-hidden"
              />
            </div>

            <div>
              <label className="font-bold text-neutral-300 block mb-1">Customer Support Email</label>
              <input
                type="email"
                value={settings.contactEmail}
                onChange={(e) => setSettings({ ...settings, contactEmail: e.target.value })}
                className="w-full bg-neutral-950 border border-neutral-800 rounded-xl p-2.5 text-white focus:outline-hidden"
              />
            </div>

            <div>
              <label className="font-bold text-neutral-300 block mb-1">WhatsApp Concierge Phone</label>
              <input
                type="text"
                value={settings.whatsappNumber}
                onChange={(e) => setSettings({ ...settings, whatsappNumber: e.target.value })}
                className="w-full bg-neutral-950 border border-neutral-800 rounded-xl p-2.5 text-white focus:outline-hidden"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="font-bold text-neutral-300 block mb-1">Store Address (Colombo)</label>
              <input
                type="text"
                value={settings.address}
                onChange={(e) => setSettings({ ...settings, address: e.target.value })}
                className="w-full bg-neutral-950 border border-neutral-800 rounded-xl p-2.5 text-white focus:outline-hidden"
              />
            </div>
          </div>
        </div>

        {/* Announcement Bar & Shipping */}
        <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-6 shadow-xs space-y-4 text-xs">
          <h2 className="text-sm font-black uppercase tracking-wider text-white">
            Announcement Bar &amp; Islandwide Logistics
          </h2>

          <div>
            <label className="font-bold text-neutral-300 block mb-1">Header Announcement Text</label>
            <input
              type="text"
              value={settings.announcementText}
              onChange={(e) => setSettings({ ...settings, announcementText: e.target.value })}
              className="w-full bg-neutral-950 border border-neutral-800 rounded-xl p-2.5 text-white focus:outline-hidden"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="font-bold text-neutral-300 block mb-1">
                Free Shipping Threshold (LKR)
              </label>
              <input
                type="number"
                value={settings.freeShippingThreshold}
                onChange={(e) =>
                  setSettings({ ...settings, freeShippingThreshold: Number(e.target.value) })
                }
                className="w-full bg-neutral-950 border border-neutral-800 rounded-xl p-2.5 text-white font-bold focus:outline-hidden"
              />
            </div>

            <div>
              <label className="font-bold text-neutral-300 block mb-1">
                Standard Islandwide Shipping Fee (LKR)
              </label>
              <input
                type="number"
                value={settings.standardShippingFee}
                onChange={(e) =>
                  setSettings({ ...settings, standardShippingFee: Number(e.target.value) })
                }
                className="w-full bg-neutral-950 border border-neutral-800 rounded-xl p-2.5 text-white font-bold focus:outline-hidden"
              />
            </div>
          </div>
        </div>

        {/* Payment Gateways */}
        <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-6 shadow-xs space-y-3 text-xs">
          <h2 className="text-sm font-black uppercase tracking-wider text-white mb-2">
            Payment Methods Active on Storefront
          </h2>

          <div className="space-y-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={settings.codEnabled}
                onChange={(e) => setSettings({ ...settings, codEnabled: e.target.checked })}
                className="accent-white w-4 h-4 rounded"
              />
              <span className="font-bold text-white">Cash On Delivery (Island Wide COD)</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={settings.kokoEnabled}
                onChange={(e) => setSettings({ ...settings, kokoEnabled: e.target.checked })}
                className="accent-[#e11d48] w-4 h-4 rounded"
              />
              <span className="font-bold text-[#e11d48]">KOKO — 3 Interest-Free Installments</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={settings.mintpayEnabled}
                onChange={(e) => setSettings({ ...settings, mintpayEnabled: e.target.checked })}
                className="accent-[#0284c7] w-4 h-4 rounded"
              />
              <span className="font-bold text-[#0284c7]">Mintpay — Buy Now Pay Later</span>
            </label>
          </div>
        </div>

        <button
          type="submit"
          disabled={isSaving}
          className="bg-white text-black text-xs font-black uppercase tracking-wider px-8 py-3 rounded-xl hover:bg-neutral-200 transition-colors shadow-sm disabled:opacity-50 flex items-center gap-2"
        >
          <Save className="w-4 h-4" />
          <span>{isSaving ? "Saving..." : "Save All Settings"}</span>
        </button>
      </form>
    </div>
  );
}
