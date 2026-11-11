"use client";

import React, { useState } from "react";
import { Phone, Mail, MapPin, Clock, MessageSquare } from "lucide-react";

export default function ContactPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
      <div className="text-center max-w-xl mx-auto mb-12">
        <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">
          WE ARE HERE TO HELP
        </span>
        <h1 className="text-3xl sm:text-4xl font-black uppercase tracking-wider text-black mt-1">
          Contact The Brand Hub
        </h1>
        <p className="text-xs sm:text-sm text-neutral-500 mt-2">
          Reach out to our customer care or WhatsApp styling concierge for immediate assistance.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        {/* Contact Info Cards */}
        <div className="space-y-4">
          <div className="p-6 rounded-2xl border border-neutral-200 bg-neutral-50 flex items-start gap-4">
            <div className="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center shrink-0">
              <Phone className="w-4 h-4" />
            </div>
            <div className="text-xs">
              <h3 className="font-bold uppercase tracking-wider text-black">Telephone Concierge</h3>
              <p className="mt-1 text-neutral-600">
                <a href="tel:+94763473075" className="hover:text-black font-bold">
                  +(94) 76 347 3075
                </a>
              </p>
              <p className="text-[11px] text-neutral-400 mt-0.5">Active Monday – Friday, 8:00am – 5:00pm</p>
            </div>
          </div>

          <div className="p-6 rounded-2xl border border-neutral-200 bg-neutral-50 flex items-start gap-4">
            <div className="w-10 h-10 rounded-full bg-[#25D366] text-white flex items-center justify-center shrink-0">
              <MessageSquare className="w-4 h-4" />
            </div>
            <div className="text-xs">
              <h3 className="font-bold uppercase tracking-wider text-black">WhatsApp Live Concierge</h3>
              <p className="mt-1 text-neutral-600">
                <a
                  href="https://wa.me/94763473075"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-black font-bold"
                >
                  +94 76 347 3075 (Click to Chat)
                </a>
              </p>
              <p className="text-[11px] text-neutral-400 mt-0.5">Typically replies within 5 minutes</p>
            </div>
          </div>

          <div className="p-6 rounded-2xl border border-neutral-200 bg-neutral-50 flex items-start gap-4">
            <div className="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center shrink-0">
              <MapPin className="w-4 h-4" />
            </div>
            <div className="text-xs">
              <h3 className="font-bold uppercase tracking-wider text-black">Colombo Store Location</h3>
              <p className="mt-1 text-neutral-600 font-medium">
                110, Kumaran Ratnam Road, Colombo 02, Sri Lanka.
              </p>
              <p className="text-[11px] text-neutral-400 mt-0.5">Website Active Hours: 24/7</p>
            </div>
          </div>
        </div>

        {/* Quick Message Form */}
        <div className="border border-neutral-200 rounded-3xl p-6 sm:p-8 bg-white shadow-xs">
          <h2 className="text-sm font-black uppercase tracking-wider text-black mb-4">
            Send an Inquiry
          </h2>
          <form className="space-y-4 text-xs" onSubmit={(e) => { e.preventDefault(); alert("Inquiry sent!"); }}>
            <div>
              <label className="font-bold text-neutral-800 block mb-1">Your Name</label>
              <input
                type="text"
                required
                placeholder="e.g. Kasun Silva"
                className="w-full border border-neutral-300 rounded-xl p-2.5 focus:outline-hidden focus:border-black font-medium"
              />
            </div>
            <div>
              <label className="font-bold text-neutral-800 block mb-1">Email Address</label>
              <input
                type="email"
                required
                placeholder="name@example.com"
                className="w-full border border-neutral-300 rounded-xl p-2.5 focus:outline-hidden focus:border-black font-medium"
              />
            </div>
            <div>
              <label className="font-bold text-neutral-800 block mb-1">Message</label>
              <textarea
                rows={4}
                required
                placeholder="How can we assist you with product sizing or orders?"
                className="w-full border border-neutral-300 rounded-xl p-2.5 focus:outline-hidden focus:border-black font-medium resize-none"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-black text-white py-3 rounded-full font-black uppercase tracking-wider hover:bg-neutral-800 transition-colors shadow-xs"
            >
              SEND MESSAGE
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
