"use client";

import { useState, useMemo } from "react";
import { ShopifyProduct } from "@/lib/shopify";
import ProductCard from "./ProductCard";
import ColorFilter, { extractColorsFromTags, extractTypeFromTags, extractSizeCategory, SIZE_CATEGORIES } from "./ColorFilter";

interface ProductSectionProps {
  products: ShopifyProduct[];
}

export default function ProductSection({ products }: ProductSectionProps) {
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);

  // Extract all available colors from products
  const availableColors = useMemo(() => {
    const colorSet = new Set<string>();
    
    for (const product of products) {
      const colors = extractColorsFromTags(product.tags);
      colors.forEach((c) => colorSet.add(c));
    }
    
    return Array.from(colorSet);
  }, [products]);

  // Extract all available types from products
  const availableTypes = useMemo(() => {
    const typeSet = new Set<string>();
    
    for (const product of products) {
      const type = extractTypeFromTags(product.tags);
      if (type) typeSet.add(type);
    }
    
    return Array.from(typeSet);
  }, [products]);

  // Extract all available sizes from products
  const availableSizes = useMemo(() => {
    const sizeSet = new Set<string>();
    
    for (const product of products) {
      const size = extractSizeCategory(product.tags);
      if (size) sizeSet.add(size);
    }
    
    return Array.from(sizeSet);
  }, [products]);

  // Filter products by selected colors, types, and sizes
  const filteredProducts = useMemo(() => {
    let result = products;
    
    // Filter by colors (OR logic - match any selected color)
    if (selectedColors.length > 0) {
      result = result.filter((product) => {
        const productColors = extractColorsFromTags(product.tags);
        return selectedColors.some((selected) => productColors.includes(selected));
      });
    }
    
    // Filter by types (OR logic - match any selected type)
    if (selectedTypes.length > 0) {
      result = result.filter((product) => {
        const productType = extractTypeFromTags(product.tags);
        return productType && selectedTypes.includes(productType);
      });
    }
    
    // Filter by sizes (OR logic - match any selected size)
    if (selectedSizes.length > 0) {
      result = result.filter((product) => {
        const productSize = extractSizeCategory(product.tags);
        return productSize && selectedSizes.includes(productSize);
      });
    }
    
    return result;
  }, [products, selectedColors, selectedTypes, selectedSizes]);

  const handleColorToggle = (color: string) => {
    setSelectedColors((prev) =>
      prev.includes(color)
        ? prev.filter((c) => c !== color)
        : [...prev, color]
    );
  };

  const handleTypeToggle = (type: string) => {
    setSelectedTypes((prev) =>
      prev.includes(type)
        ? prev.filter((t) => t !== type)
        : [...prev, type]
    );
  };

  const handleSizeToggle = (size: string) => {
    setSelectedSizes((prev) =>
      prev.includes(size)
        ? prev.filter((s) => s !== size)
        : [...prev, size]
    );
  };

  const handleClearAll = () => {
    setSelectedColors([]);
    setSelectedTypes([]);
    setSelectedSizes([]);
  };

  // Editorial layout pattern
  const getLayoutClass = (index: number): { className: string; featured: boolean } => {
    const pattern = index % 6;
    
    switch (pattern) {
      case 0:
        return { className: "md:col-span-2 md:row-span-2", featured: true };
      case 5:
        return { className: "md:col-span-2 md:row-span-2", featured: true };
      default:
        return { className: "", featured: false };
    }
  };

  const hasFilters = selectedColors.length > 0 || selectedTypes.length > 0 || selectedSizes.length > 0;

  if (products.length === 0) {
    return (
      <div className="text-center py-32">
        <p className="text-stone text-sm uppercase tracking-[0.15em]">
          Collection coming soon
        </p>
      </div>
    );
  }

  return (
    <div>
      {/* Filters */}
      {(availableColors.length > 0 || availableTypes.length > 0 || availableSizes.length > 0) && (
        <ColorFilter
          availableColors={availableColors}
          selectedColors={selectedColors}
          onColorToggle={handleColorToggle}
          availableTypes={availableTypes}
          selectedTypes={selectedTypes}
          onTypeToggle={handleTypeToggle}
          availableSizes={availableSizes}
          selectedSizes={selectedSizes}
          onSizeToggle={handleSizeToggle}
          onClearAll={handleClearAll}
        />
      )}

      {/* Results count */}
      {hasFilters && filteredProducts.length > 0 && (
        <p className="text-[11px] uppercase tracking-[0.15em] text-stone mb-8">
          {filteredProducts.length} {filteredProducts.length === 1 ? "piece" : "pieces"} found
        </p>
      )}

      {/* No results */}
      {filteredProducts.length === 0 && hasFilters && (
        <div className="text-center py-20">
          <p className="text-charcoal text-sm mb-4">No rugs match your selection.</p>
          <button
            onClick={handleClearAll}
            className="text-[11px] uppercase tracking-[0.15em] border-b border-charcoal pb-1 hover:border-charcoal/40 transition-colors"
          >
            Clear filters
          </button>
        </div>
      )}

      {/* Product Grid */}
      {filteredProducts.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-16 md:gap-y-20">
          {filteredProducts.map((product, index) => {
            const layout = getLayoutClass(index);
            return (
              <div key={product.id} className={layout.className}>
                <ProductCard product={product} featured={layout.featured} />
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
