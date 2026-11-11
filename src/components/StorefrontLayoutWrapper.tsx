"use client";

import React from "react";
import { usePathname } from "next/navigation";
import AnnouncementBar from "./AnnouncementBar";
import SiteHeader from "./SiteHeader";
import CategoryNavigation from "./CategoryNavigation";
import SiteFooter from "./SiteFooter";
import CartDrawer from "./CartDrawer";
import WhatsAppButton from "./WhatsAppButton";

export default function StorefrontLayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isAdminRoute = pathname?.startsWith("/admin");

  if (isAdminRoute) {
    return <main className="min-h-screen bg-neutral-900 text-white">{children}</main>;
  }

  return (
    <div className="min-h-screen flex flex-col bg-white text-gray-900">
      <AnnouncementBar />
      <SiteHeader />
      <CategoryNavigation />
      <main className="flex-1">{children}</main>
      <SiteFooter />
      <CartDrawer />
      <WhatsAppButton />
    </div>
  );
}
