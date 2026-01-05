"use client";

import { useState, useMemo } from "react";
import { ShopifyProduct } from "@/lib/shopify";
import ProductCard from "@/components/ProductCard";
import { 
  COLOR_MAP,
  SIZE_CATEGORIES,
  extractColorsFromTags, 
  extractTypeFromTags, 
  extractSizeCategory 
} from "@/components/ColorFilter";

interface ShopGridProps {
  products: ShopifyProduct[];
}

const PRODUCTS_PER_PAGE = 12;

export default function ShopGrid({ products }: ShopGridProps) {
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [showTypeDropdown, setShowTypeDropdown] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  // Calculate price range from products
  const priceRange = useMemo(() => {
    if (products.length === 0) return { min: 0, max: 10000 };
    const prices = products.map((p) => parseFloat(p.priceRange.minVariantPrice.amount));
    const min = Math.floor(Math.min(...prices) / 100) * 100;
    const max = Math.ceil(Math.max(...prices) / 100) * 100;
    return { min, max };
  }, [products]);

  const [priceMin, setPriceMin] = useState(priceRange.min);
  const [priceMax, setPriceMax] = useState(priceRange.max);

  // Extract available options from products
  const availableColors = useMemo(() => {
    const colorSet = new Set<string>();
    for (const product of products) {
      const colors = extractColorsFromTags(product.tags);
      colors.forEach((c) => colorSet.add(c));
    }
    // Sort colors
    const order = ["ivory", "cream", "white", "black", "charcoal", "brown", "camel", "tan", "terracotta", "rust", "orange", "red", "pink", "blue", "indigo", "green", "olive", "yellow", "gold", "gray", "grey", "multi", "multicolor"];
    return Array.from(colorSet).sort((a, b) => {
      const aIdx = order.indexOf(a.toLowerCase());
      const bIdx = order.indexOf(b.toLowerCase());
      if (aIdx === -1 && bIdx === -1) return a.localeCompare(b);
      if (aIdx === -1) return 1;
      if (bIdx === -1) return -1;
      return aIdx - bIdx;
    });
  }, [products]);

  const availableTypes = useMemo(() => {
    const typeSet = new Set<string>();
    for (const product of products) {
      const type = extractTypeFromTags(product.tags);
      if (type) typeSet.add(type);
    }
    return Array.from(typeSet);
  }, [products]);

  const availableSizes = useMemo(() => {
    const sizeSet = new Set<string>();
    for (const product of products) {
      const size = extractSizeCategory(product.tags);
      if (size) sizeSet.add(size);
    }
    // Sort by category order
    return Array.from(sizeSet).sort((a, b) => {
      const aIdx = SIZE_CATEGORIES.findIndex((s) => s.id === a);
      const bIdx = SIZE_CATEGORIES.findIndex((s) => s.id === b);
      return aIdx - bIdx;
    });
  }, [products]);

  // Filter products
  const filteredProducts = useMemo(() => {
    let result = products;
    
    if (selectedColors.length > 0) {
      result = result.filter((product) => {
        const productColors = extractColorsFromTags(product.tags);
        return selectedColors.some((selected) => productColors.includes(selected));
      });
    }
    
    if (selectedTypes.length > 0) {
      result = result.filter((product) => {
        const productType = extractTypeFromTags(product.tags);
        return productType && selectedTypes.includes(productType);
      });
    }
    
    if (selectedSizes.length > 0) {
      result = result.filter((product) => {
        const productSize = extractSizeCategory(product.tags);
        return productSize && selectedSizes.includes(productSize);
      });
    }

    // Filter by price
    result = result.filter((product) => {
      const price = parseFloat(product.priceRange.minVariantPrice.amount);
      return price >= priceMin && price <= priceMax;
    });
    
    return result;
  }, [products, selectedColors, selectedTypes, selectedSizes, priceMin, priceMax]);

  // Pagination
  const totalPages = Math.ceil(filteredProducts.length / PRODUCTS_PER_PAGE);
  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * PRODUCTS_PER_PAGE;
    return filteredProducts.slice(start, start + PRODUCTS_PER_PAGE);
  }, [filteredProducts, currentPage]);

  // Reset to page 1 when filters change
  const handleColorToggle = (color: string) => {
    setSelectedColors((prev) =>
      prev.includes(color) ? prev.filter((c) => c !== color) : [...prev, color]
    );
    setCurrentPage(1);
  };

  const handleTypeToggle = (type: string) => {
    setSelectedTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
    setCurrentPage(1);
  };

  const handleSizeToggle = (size: string) => {
    setSelectedSizes((prev) =>
      prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size]
    );
    setCurrentPage(1);
  };

  const handlePriceMinChange = (value: number) => {
    setPriceMin(Math.min(value, priceMax - 100));
    setCurrentPage(1);
  };

  const handlePriceMaxChange = (value: number) => {
    setPriceMax(Math.max(value, priceMin + 100));
    setCurrentPage(1);
  };

  const handleClearAll = () => {
    setSelectedColors([]);
    setSelectedTypes([]);
    setSelectedSizes([]);
    setPriceMin(priceRange.min);
    setPriceMax(priceRange.max);
    setCurrentPage(1);
  };

  const hasPriceFilter = priceMin > priceRange.min || priceMax < priceRange.max;
  const hasFilters = selectedColors.length > 0 || selectedTypes.length > 0 || selectedSizes.length > 0 || hasPriceFilter;

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
      {/* Filter Bar */}
      <div className="space-y-6 mb-12">
        
        {/* Row 1: Color swatches */}
        {availableColors.length > 0 && (
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-[10px] uppercase tracking-[0.15em] text-stone mr-2">Color</span>
            {availableColors.map((color) => {
              const colorData = COLOR_MAP[color.toLowerCase()];
              if (!colorData) return null;

              const isSelected = selectedColors.includes(color.toLowerCase());
              const isMulti = colorData.hex === "multi";

              return (
                <button
                  key={color}
                  onClick={() => handleColorToggle(color.toLowerCase())}
                  className={`w-6 h-6 rounded-full border-2 transition-all ${
                    isSelected
                      ? "border-charcoal scale-110"
                      : "border-transparent hover:border-charcoal/30"
                  } ${isMulti ? "bg-gradient-to-br from-terracotta via-blue to-olive" : ""}`}
                  style={isMulti ? {} : { backgroundColor: colorData.hex }}
                  title={colorData.label}
                />
              );
            })}
          </div>
        )}

        {/* Row 2: Size pills */}
        {availableSizes.length > 0 && (
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[10px] uppercase tracking-[0.15em] text-stone mr-2">Size</span>
            {availableSizes.map((sizeId) => {
              const sizeData = SIZE_CATEGORIES.find((s) => s.id === sizeId);
              if (!sizeData) return null;

              const isSelected = selectedSizes.includes(sizeId);

              return (
                <button
                  key={sizeId}
                  onClick={() => handleSizeToggle(sizeId)}
                  className={`px-3 py-1 text-[10px] uppercase tracking-[0.1em] transition-all ${
                    isSelected
                      ? "bg-charcoal text-cream"
                      : "bg-transparent text-charcoal border-b border-charcoal/20 hover:border-charcoal"
                  }`}
                >
                  {sizeData.label}
                </button>
              );
            })}
          </div>
        )}

        {/* Row 3: Price Slider */}
        <div className="flex flex-wrap items-center gap-4">
          <span className="text-[10px] uppercase tracking-[0.15em] text-stone">Price</span>
          <div className="flex items-center gap-4 flex-1 max-w-md">
            <span className="text-[11px] text-charcoal min-w-[70px]">${priceMin.toLocaleString()}</span>
            
            {/* Dual Range Slider Container */}
            <div className="relative flex-1 h-10 flex items-center select-none">
              {/* Track background */}
              <div className="absolute left-2 right-2 h-[2px] bg-charcoal/20" />
              
              {/* Active track */}
              <div 
                className="absolute h-[2px] bg-charcoal"
                style={{
                  left: `calc(8px + ${((priceMin - priceRange.min) / (priceRange.max - priceRange.min)) * (100 - 16/100)}%)`,
                  width: `${((priceMax - priceMin) / (priceRange.max - priceRange.min)) * 100}%`,
                }}
              />
              
              {/* Min slider */}
              <input
                type="range"
                min={priceRange.min}
                max={priceRange.max}
                step={100}
                value={priceMin}
                onChange={(e) => handlePriceMinChange(parseInt(e.target.value))}
                className="absolute w-full h-10 appearance-none bg-transparent cursor-pointer
                  [&::-webkit-slider-thumb]:appearance-none 
                  [&::-webkit-slider-thumb]:w-5 
                  [&::-webkit-slider-thumb]:h-5 
                  [&::-webkit-slider-thumb]:rounded-full 
                  [&::-webkit-slider-thumb]:bg-white
                  [&::-webkit-slider-thumb]:border-2 
                  [&::-webkit-slider-thumb]:border-stone
                  [&::-webkit-slider-thumb]:shadow-md
                  [&::-webkit-slider-thumb]:cursor-grab
                  [&::-webkit-slider-thumb]:active:cursor-grabbing
                  [&::-webkit-slider-thumb]:hover:border-charcoal
                  [&::-webkit-slider-thumb]:transition-colors
                  [&::-moz-range-thumb]:appearance-none 
                  [&::-moz-range-thumb]:w-5 
                  [&::-moz-range-thumb]:h-5 
                  [&::-moz-range-thumb]:rounded-full 
                  [&::-moz-range-thumb]:bg-white
                  [&::-moz-range-thumb]:border-2 
                  [&::-moz-range-thumb]:border-stone
                  [&::-moz-range-thumb]:shadow-md
                  [&::-moz-range-thumb]:cursor-grab
                  [&::-moz-range-track]:appearance-none
                  [&::-moz-range-track]:bg-transparent
                  [&::-webkit-slider-runnable-track]:appearance-none
                  [&::-webkit-slider-runnable-track]:bg-transparent"
                style={{ zIndex: 3 }}
              />
              
              {/* Max slider */}
              <input
                type="range"
                min={priceRange.min}
                max={priceRange.max}
                step={100}
                value={priceMax}
                onChange={(e) => handlePriceMaxChange(parseInt(e.target.value))}
                className="absolute w-full h-10 appearance-none bg-transparent cursor-pointer
                  [&::-webkit-slider-thumb]:appearance-none 
                  [&::-webkit-slider-thumb]:w-5 
                  [&::-webkit-slider-thumb]:h-5 
                  [&::-webkit-slider-thumb]:rounded-full 
                  [&::-webkit-slider-thumb]:bg-white
                  [&::-webkit-slider-thumb]:border-2 
                  [&::-webkit-slider-thumb]:border-stone
                  [&::-webkit-slider-thumb]:shadow-md
                  [&::-webkit-slider-thumb]:cursor-grab
                  [&::-webkit-slider-thumb]:active:cursor-grabbing
                  [&::-webkit-slider-thumb]:hover:border-charcoal
                  [&::-webkit-slider-thumb]:transition-colors
                  [&::-moz-range-thumb]:appearance-none 
                  [&::-moz-range-thumb]:w-5 
                  [&::-moz-range-thumb]:h-5 
                  [&::-moz-range-thumb]:rounded-full 
                  [&::-moz-range-thumb]:bg-white
                  [&::-moz-range-thumb]:border-2 
                  [&::-moz-range-thumb]:border-stone
                  [&::-moz-range-thumb]:shadow-md
                  [&::-moz-range-thumb]:cursor-grab
                  [&::-moz-range-track]:appearance-none
                  [&::-moz-range-track]:bg-transparent
                  [&::-webkit-slider-runnable-track]:appearance-none
                  [&::-webkit-slider-runnable-track]:bg-transparent"
                style={{ zIndex: 4 }}
              />
            </div>
            
            <span className="text-[11px] text-charcoal min-w-[70px] text-right">${priceMax.toLocaleString()}</span>
          </div>
        </div>

        {/* Row 4: Type dropdown + Clear */}
        <div className="flex flex-wrap items-center gap-4">
          {/* Type dropdown */}
          {availableTypes.length > 0 && (
            <div className="relative">
              <button
                onClick={() => setShowTypeDropdown(!showTypeDropdown)}
                className={`flex items-center gap-2 text-[10px] uppercase tracking-[0.15em] transition-colors ${
                  selectedTypes.length > 0 ? "text-charcoal" : "text-stone hover:text-charcoal"
                }`}
              >
                <span>Type</span>
                {selectedTypes.length > 0 && (
                  <span className="w-4 h-4 rounded-full bg-charcoal text-cream text-[9px] flex items-center justify-center">
                    {selectedTypes.length}
                  </span>
                )}
                <span className={`transition-transform ${showTypeDropdown ? "rotate-180" : ""}`}>↓</span>
              </button>

              {showTypeDropdown && (
                <>
                  <div 
                    className="fixed inset-0 z-10" 
                    onClick={() => setShowTypeDropdown(false)} 
                  />
                  <div className="absolute top-full left-0 mt-2 z-20 bg-cream border border-charcoal/10 shadow-lg min-w-[180px]">
                    {availableTypes.map((type) => {
                      const isSelected = selectedTypes.includes(type.toLowerCase());
                      const displayName = type.charAt(0).toUpperCase() + type.slice(1);

                      return (
                        <button
                          key={type}
                          onClick={() => handleTypeToggle(type.toLowerCase())}
                          className={`w-full px-4 py-2 text-left text-[11px] uppercase tracking-[0.1em] transition-colors ${
                            isSelected
                              ? "bg-charcoal text-cream"
                              : "text-charcoal hover:bg-charcoal/5"
                          }`}
                        >
                          {displayName}
                        </button>
                      );
                    })}
                  </div>
                </>
              )}
            </div>
          )}

          {/* Clear all */}
          {hasFilters && (
            <button
              onClick={handleClearAll}
              className="text-[10px] uppercase tracking-[0.15em] text-stone hover:text-charcoal transition-colors border-b border-stone/30 hover:border-charcoal"
            >
              Clear all
            </button>
          )}

          {/* Results count */}
          {hasFilters && (
            <span className="text-[10px] uppercase tracking-[0.15em] text-stone ml-auto">
              {filteredProducts.length} {filteredProducts.length === 1 ? "rug" : "rugs"}
            </span>
          )}
        </div>
      </div>

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

      {/* Product Grid — uniform 4 columns */}
      {paginatedProducts.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 md:gap-x-6 gap-y-10 md:gap-y-16">
          {paginatedProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-16 flex items-center justify-center gap-2">
          {/* Previous */}
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className={`px-3 py-2 text-[11px] uppercase tracking-[0.1em] transition-colors ${
              currentPage === 1
                ? "text-stone/40 cursor-not-allowed"
                : "text-stone hover:text-charcoal"
            }`}
          >
            ←
          </button>

          {/* Page numbers */}
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={`w-8 h-8 text-[11px] transition-colors ${
                page === currentPage
                  ? "bg-charcoal text-cream"
                  : "text-stone hover:text-charcoal"
              }`}
            >
              {page}
            </button>
          ))}

          {/* Next */}
          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className={`px-3 py-2 text-[11px] uppercase tracking-[0.1em] transition-colors ${
              currentPage === totalPages
                ? "text-stone/40 cursor-not-allowed"
                : "text-stone hover:text-charcoal"
            }`}
          >
            →
          </button>
        </div>
      )}
    </div>
  );
}
