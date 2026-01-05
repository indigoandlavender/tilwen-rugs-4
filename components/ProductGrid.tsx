"use client";

import { ShopifyProduct } from "@/lib/shopify";
import ProductCard from "./ProductCard";

interface ProductGridProps {
  products: ShopifyProduct[];
}

export default function ProductGrid({ products }: ProductGridProps) {
  if (products.length === 0) {
    return (
      <div className="text-center py-32">
        <p className="text-stone text-sm uppercase tracking-[0.15em]">
          Collection coming soon
        </p>
      </div>
    );
  }

  // Editorial layout pattern:
  // Row 1: 1 large (2 cols) + 1 regular
  // Row 2: 2 regular
  // Row 3: 1 regular + 1 large (2 cols)
  // Repeat...

  const getLayoutClass = (index: number): { className: string; featured: boolean } => {
    const pattern = index % 6;
    
    switch (pattern) {
      case 0: // First item - featured large
        return { className: "md:col-span-2 md:row-span-2", featured: true };
      case 1: // Second item - regular, sits next to featured
        return { className: "", featured: false };
      case 2: // Third item - regular, below the second
        return { className: "", featured: false };
      case 3: // Fourth - regular
        return { className: "", featured: false };
      case 4: // Fifth - regular
        return { className: "", featured: false };
      case 5: // Sixth - featured large
        return { className: "md:col-span-2 md:row-span-2", featured: true };
      default:
        return { className: "", featured: false };
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-16 md:gap-y-20">
      {products.map((product, index) => {
        const layout = getLayoutClass(index);
        return (
          <div key={product.id} className={layout.className}>
            <ProductCard product={product} featured={layout.featured} />
          </div>
        );
      })}
    </div>
  );
}
