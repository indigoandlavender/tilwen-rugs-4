import { getProducts } from "@/lib/shopify";
import type { Metadata } from "next";
import ShopGrid from "./ShopGrid";

export const metadata: Metadata = {
  title: "Shop",
  description: "Browse our collection of authentic Moroccan rugs. Beni Ourain, Azilal, Boujaad, and more.",
};

export const revalidate = 60;

export default async function ShopPage() {
  const products = await getProducts();

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="px-6 md:px-12 pt-12 pb-8 border-b border-charcoal/10">
        <div className="max-w-[1600px] mx-auto">
          <h1 className="font-serif text-3xl md:text-4xl mb-2">Shop</h1>
          <p className="text-[11px] uppercase tracking-[0.15em] text-stone">
            {products.length} {products.length === 1 ? "rug" : "rugs"}
          </p>
        </div>
      </div>

      {/* Main content */}
      <div className="px-6 md:px-12 py-12">
        <div className="max-w-[1600px] mx-auto">
          <ShopGrid products={products} />
        </div>
      </div>
    </div>
  );
}
