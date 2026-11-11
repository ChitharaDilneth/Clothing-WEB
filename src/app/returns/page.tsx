import React from "react";
import Link from "next/link";
import { RotateCcw, CheckCircle, ShieldCheck } from "lucide-react";

export default function ReturnsPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
      <div className="mb-8">
        <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">
          7-DAY GUARANTEE
        </span>
        <h1 className="text-3xl font-black uppercase tracking-wider text-black mt-1">
          Returns &amp; Exchanges Policy
        </h1>
        <p className="text-xs text-neutral-500 mt-1">
          Hassle-free size exchanges and returns across Sri Lanka.
        </p>
      </div>

      <div className="space-y-6 text-xs text-neutral-700 leading-relaxed border border-neutral-200 rounded-3xl p-8 bg-white">
        <h2 className="text-sm font-black uppercase tracking-wider text-black">
          7-Day Size &amp; Fit Exchange
        </h2>
        <p>
          We want you to love your TBH essentials. If the size of your footwear, beach poncho, or apparel item isn’t completely ideal, you may exchange it within 7 days of delivery.
        </p>

        <h2 className="text-sm font-black uppercase tracking-wider text-black pt-4">
          Exchange Eligibility
        </h2>
        <ul className="list-disc pl-5 space-y-1 text-neutral-600">
          <li>Item must be unworn, unwashed, and with all original brand tags attached.</li>
          <li>Footwear must be tried on carpeted or clean indoor surfaces to prevent sole scuffing.</li>
          <li>Customized pieces with personalized monograms or custom artwork are non-refundable unless defective.</li>
        </ul>

        <h2 className="text-sm font-black uppercase tracking-wider text-black pt-4">
          How to Initiate an Exchange
        </h2>
        <p>
          Contact our WhatsApp concierge at{" "}
          <a href="https://wa.me/94763473075" className="text-black font-bold underline">
            +94 76 347 3075
          </a>{" "}
          with your Order Number (e.g. TBH-90214) and the desired replacement size. Our courier will deliver your replacement pair and collect the returned item simultaneously at your doorstep.
        </p>
      </div>
    </div>
  );
}
