import React from "react";

export default function TermsPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
      <h1 className="text-3xl font-black uppercase tracking-wider text-black mb-6">
        Terms &amp; Conditions
      </h1>
      <div className="space-y-4 text-xs text-neutral-700 leading-relaxed border border-neutral-200 rounded-3xl p-8 bg-white">
        <p>
          Welcome to TBH — The Brand Hub. By browsing our website and placing orders, you agree to comply with and be bound by the following terms.
        </p>
        <h2 className="text-sm font-black uppercase text-black pt-2">Pricing &amp; Currency</h2>
        <p>
          All product prices are quoted in Sri Lankan Rupees (LKR) and include applicable local taxes. Prices are subject to change without prior notice.
        </p>
        <h2 className="text-sm font-black uppercase text-black pt-2">Orders &amp; Fulfillment</h2>
        <p>
          We reserve the right to verify customer phone numbers prior to dispatching Cash On Delivery (COD) orders to prevent fraudulent dispatches.
        </p>
        <h2 className="text-sm font-black uppercase text-black pt-2">Intellectual Property</h2>
        <p>
          All trademarks, designs, and content featured on this platform are property of TBH — The Brand Hub and licensed brand partners.
        </p>
      </div>
    </div>
  );
}
