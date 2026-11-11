import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { CartProvider } from "@/context/CartContext";
import { WishlistProvider } from "@/context/WishlistContext";
import StorefrontLayoutWrapper from "@/components/StorefrontLayoutWrapper";
import { Toaster } from "sonner";

export const metadata: Metadata = {
  title: "TBH — The Brand Hub | Premier Fashion & Lifestyle Store Sri Lanka",
  description:
    "Shop premium coastal footwear, beach ponchos, bags, lifestyle clothing and customized Waves flip flops with islandwide delivery across Sri Lanka.",
  keywords: ["TBH", "The Brand Hub", "Sri Lanka Fashion", "Waves Flip Flops", "Ansel Loafers", "Parakeet Bags"],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full antialiased light">
      <body className="min-h-full flex flex-col font-sans bg-white text-gray-900">
        <AuthProvider>
          <CartProvider>
            <WishlistProvider>
              <StorefrontLayoutWrapper>{children}</StorefrontLayoutWrapper>
              <Toaster position="top-right" richColors />
            </WishlistProvider>
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
