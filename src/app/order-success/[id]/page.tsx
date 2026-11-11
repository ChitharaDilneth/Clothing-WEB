"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { CheckCircle2, Truck, Package, Clock, ArrowRight } from "lucide-react";
import { IOrder } from "@/types";

export default function OrderSuccessPage() {
  const params = useParams();
  const orderNumber = (params?.id as string) || "";
  const [order, setOrder] = useState<IOrder | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadOrder() {
      try {
        const res = await fetch(`/api/orders/${orderNumber}`);
        if (res.ok) {
          const data = await res.json();
          setOrder(data);
        }
      } catch (err) {
        console.error("Error loading order:", err);
      } finally {
        setIsLoading(false);
      }
    }
    if (orderNumber) loadOrder();
  }, [orderNumber]);

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
      <div className="text-center space-y-3">
        <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-xs">
          <CheckCircle2 className="w-9 h-9" />
        </div>
        <span className="text-[11px] font-black tracking-widest uppercase text-neutral-400 block">
          ORDER CONFIRMATION
        </span>
        <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-wider text-black">
          Thank you for your order!
        </h1>
        <p className="text-xs sm:text-sm text-neutral-600 max-w-md mx-auto">
          Your order has been received and is being prepared for dispatch. We sent a confirmation to your phone and email.
        </p>
      </div>

      {/* Order Status & Tracking Card */}
      <div className="mt-8 border border-neutral-200 rounded-3xl p-6 sm:p-8 bg-neutral-50/70 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-neutral-200">
          <div>
            <span className="text-[10px] uppercase font-bold text-neutral-400">ORDER NUMBER</span>
            <div className="text-lg font-black text-black">{orderNumber}</div>
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-neutral-400">WAYBILL TRACKING NO.</span>
            <div className="text-sm font-bold text-neutral-800">
              {order?.trackingNumber || "PRONET-902148"}
            </div>
          </div>
        </div>

        {/* 4-Step Visual Timeline */}
        <div>
          <span className="text-xs font-black uppercase tracking-wider text-black block mb-4">
            Fulfillment Timeline
          </span>
          <div className="grid grid-cols-4 gap-2 text-center text-[10px] font-extrabold uppercase tracking-wider">
            <div className="flex flex-col items-center">
              <div className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center mb-1">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <span className="text-black">Confirmed</span>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center mb-1">
                <Clock className="w-4 h-4" />
              </div>
              <span className="text-black">Processing</span>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-8 h-8 rounded-full bg-neutral-200 text-neutral-500 flex items-center justify-center mb-1">
                <Truck className="w-4 h-4" />
              </div>
              <span className="text-neutral-500">Shipped</span>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-8 h-8 rounded-full bg-neutral-200 text-neutral-500 flex items-center justify-center mb-1">
                <Package className="w-4 h-4" />
              </div>
              <span className="text-neutral-500">Delivered</span>
            </div>
          </div>
        </div>

        {/* Order Details Preview */}
        {order && (
          <div className="border-t border-neutral-200 pt-4 space-y-3 text-xs">
            <div className="flex justify-between">
              <span className="text-neutral-500">Recipient:</span>
              <strong className="text-black">{order.customer.name} ({order.customer.phone})</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-500">Destination:</span>
              <strong className="text-black">{order.shippingAddress.street}, {order.shippingAddress.city}</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-500">Payment:</span>
              <strong className="text-black uppercase">{order.paymentMethod} ({order.paymentStatus})</strong>
            </div>
            <div className="flex justify-between text-sm font-black text-black pt-2 border-t border-neutral-200">
              <span>Total Amount:</span>
              <span>Rs. {order.total.toLocaleString()}</span>
            </div>
          </div>
        )}
      </div>

      <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
        <Link
          href="/"
          className="w-full sm:w-auto bg-black text-white text-xs font-black uppercase tracking-wider py-3.5 px-8 rounded-full hover:bg-neutral-800 transition-colors text-center"
        >
          RETURN TO HOME
        </Link>
        <Link
          href="/category/women"
          className="w-full sm:w-auto border border-neutral-300 text-black text-xs font-bold uppercase tracking-wider py-3.5 px-8 rounded-full hover:border-black transition-colors text-center flex items-center justify-center gap-1.5"
        >
          <span>CONTINUE BROWSING</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
}
