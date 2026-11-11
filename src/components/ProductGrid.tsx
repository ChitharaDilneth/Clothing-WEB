import React from "react";
import ProductCard from "./ProductCard";
import { IProduct } from "@/types";

interface ProductGridProps {
  products: IProduct[];
  columns?: 2 | 3 | 4;
  className?: string;
}

export default function ProductGrid({
  products,
  columns = 4,
  className = "",
}: ProductGridProps) {
  if (!products || products.length === 0) {
    return (
      <div className="py-16 text-center text-gray-500">
        <p className="text-base font-semibold text-gray-800">No products found</p>
        <p className="text-xs text-gray-400 mt-1">Try resetting your filters or search term.</p>
      </div>
    );
  }

  const colClasses = {
    2: "grid-cols-2",
    3: "grid-cols-2 md:grid-cols-3",
    4: "grid-cols-2 md:grid-cols-3 lg:grid-cols-4",
  }[columns];

  return (
    <div className={`grid ${colClasses} gap-x-4 sm:gap-x-6 gap-y-8 sm:gap-y-10 ${className}`}>
      {products.map((product) => (
        <ProductCard key={product._id || product.slug} product={product} />
      ))}
    </div>
  );
}
