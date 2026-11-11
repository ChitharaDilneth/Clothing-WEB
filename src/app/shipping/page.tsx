import React from "react";
import Link from "next/link";
import { Truck, ShieldCheck, Clock, MapPin } from "lucide-react";

export default function ShippingPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
      <div className="mb-8">
        <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">
          LOGISTICS &amp; DELIVERY
        </span>
        <h1 className="text-3xl font-black uppercase tracking-wider text-black mt-1">
          Islandwide Shipping Policy
        </h1>
        <p className="text-xs text-neutral-500 mt-1">
          Fast, reliable doorstep delivery throughout all 25 districts of Sri Lanka.
        </p>
      </div>

      <div className="space-y-8 text-xs text-neutral-700 leading-relaxed">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-neutral-50 border border-neutral-200">
            <Truck className="w-6 h-6 text-black mb-3" />
            <h3 className="font-bold text-black uppercase tracking-wider text-sm">
              Free Shipping Over Rs. 8500
            </h3>
            <p className="mt-2 text-neutral-600">
              Orders equal to or exceeding Rs. 8500 qualify for 100% free doorstep delivery across Sri Lanka.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-neutral-50 border border-neutral-200">
            <Clock className="w-6 h-6 text-black mb-3" />
            <h3 className="font-bold text-black uppercase tracking-wider text-sm">
              Fast Dispatch
            </h3>
            <p className="mt-2 text-neutral-600">
              Colombo deliveries within 1–2 business days. Outstation islandwide delivery within 2–4 business days.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-neutral-50 border border-neutral-200">
            <ShieldCheck className="w-6 h-6 text-black mb-3" />
            <h3 className="font-bold text-black uppercase tracking-wider text-sm">
              Cash on Delivery (COD)
            </h3>
            <p className="mt-2 text-neutral-600">
              Pay in cash directly to our partner courier service (Prompt Xpress / Pronto Logistics) at doorstep.
            </p>
          </div>
        </div>

        <div className="border border-neutral-200 rounded-3xl p-8 bg-white space-y-4">
          <h2 className="text-base font-black uppercase tracking-wider text-black">
            Standard Delivery Rates
          </h2>
          <p>
            For orders under Rs. 8500, a flat standard rate of <strong>Rs. 450</strong> is applied automatically during checkout. No hidden courier handling surcharges.
          </p>

          <h2 className="text-base font-black uppercase tracking-wider text-black pt-4">
            Courier Tracking
          </h2>
          <p>
            Once your package is dispatched from our Colombo fulfillment hub, an automated SMS and WhatsApp update will be sent containing your live Waybill tracking number. You can also monitor real-time fulfillment at our{" "}
            <Link href="/track-order" className="text-black font-bold underline">
              Order Tracking portal
            </Link>
            .
          </p>
        </div>
      </div>
    </div>
  );
}
