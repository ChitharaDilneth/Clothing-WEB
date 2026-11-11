import React from "react";

export default function PrivacyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
      <h1 className="text-3xl font-black uppercase tracking-wider text-black mb-6">
        Privacy Policy
      </h1>
      <div className="space-y-4 text-xs text-neutral-700 leading-relaxed border border-neutral-200 rounded-3xl p-8 bg-white">
        <p>
          At TBH — The Brand Hub, we respect your privacy and are committed to protecting your personal data.
        </p>
        <h2 className="text-sm font-black uppercase text-black pt-2">Data Collection</h2>
        <p>
          We only collect personal information necessary for processing orders, fulfilling deliveries across Sri Lanka, and providing size recommendation accuracy through our NeuralFit™ studio.
        </p>
        <h2 className="text-sm font-black uppercase text-black pt-2">Selfie &amp; Measurement Security</h2>
        <p>
          Photographs and body measurement data submitted in the Virtual Try-On studio are processed purely in real-time memory to compute garment tension. We do not permanently store or sell biometric photographs.
        </p>
        <h2 className="text-sm font-black uppercase text-black pt-2">Security</h2>
        <p>
          All transactions are encrypted with 256-bit SSL protocols. Credit card details are processed directly through certified bank gateways and are never stored on our servers.
        </p>
      </div>
    </div>
  );
}
