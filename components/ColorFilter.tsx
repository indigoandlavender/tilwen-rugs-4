"use client";

import { useState } from "react";

// Moroccan rug color palette
export const COLOR_MAP: Record<string, { hex: string; label: string }> = {
  ivory: { hex: "#F5F3EF", label: "Ivory" },
  cream: { hex: "#F5F3EF", label: "Cream" },
  white: { hex: "#FAFAFA", label: "White" },
  black: { hex: "#1a1a1a", label: "Black" },
  charcoal: { hex: "#3d3d3d", label: "Charcoal" },
  brown: { hex: "#6B4423", label: "Brown" },
  camel: { hex: "#C19A6B", label: "Camel" },
  tan: { hex: "#D2B48C", label: "Tan" },
  terracotta: { hex: "#C4846C", label: "Terracotta" },
  rust: { hex: "#B7410E", label: "Rust" },
  orange: { hex: "#CC5500", label: "Orange" },
  red: { hex: "#8B2500", label: "Red" },
  pink: { hex: "#D4A5A5", label: "Pink" },
  blue: { hex: "#4A6B8A", label: "Blue" },
  indigo: { hex: "#3F5277", label: "Indigo" },
  green: { hex: "#5C6B4A", label: "Green" },
  olive: { hex: "#6B6B4A", label: "Olive" },
  yellow: { hex: "#C9A227", label: "Yellow" },
  gold: { hex: "#B8860B", label: "Gold" },
  gray: { hex: "#808080", label: "Gray" },
  grey: { hex: "#808080", label: "Grey" },
  multi: { hex: "multi", label: "Multi" },
  multicolor: { hex: "multi", label: "Multicolor" },
};

// Rug types/tribes
export const TYPE_LIST = [
  "beni ourain",
  "azilal",
  "boujaad",
  "boucherouite",
  "taznakht",
  "mrirt",
  "kilim",
  "zanafi",
  "handira",
  "vintage",
  "contemporary",
];

// Size categories with approximate dimensions (in feet)
export const SIZE_CATEGORIES: { id: string; label: string; minArea: number; maxArea: number }[] = [
  { id: "3x5", label: "3×5", minArea: 0, maxArea: 20 },
  { id: "4x6", label: "4×6", minArea: 20, maxArea: 30 },
  { id: "5x8", label: "5×8", minArea: 30, maxArea: 48 },
  { id: "6x9", label: "6×9", minArea: 48, maxArea: 63 },
  { id: "8x10", label: "8×10", minArea: 63, maxArea: 90 },
  { id: "9x12", label: "9×12", minArea: 90, maxArea: 120 },
  { id: "10x14", label: "10×14", minArea: 120, maxArea: 168 },
  { id: "12x15", label: "12×15", minArea: 168, maxArea: 999 },
  { id: "other", label: "Other", minArea: -1, maxArea: -1 },
];

interface ProductFilterProps {
  availableColors: string[];
  selectedColors: string[];
  onColorToggle: (color: string) => void;
  availableTypes: string[];
  selectedTypes: string[];
  onTypeToggle: (type: string) => void;
  availableSizes: string[];
  selectedSizes: string[];
  onSizeToggle: (size: string) => void;
  onClearAll: () => void;
}

export default function ColorFilter({
  availableColors,
  selectedColors,
  onColorToggle,
  availableTypes,
  selectedTypes,
  onTypeToggle,
  availableSizes,
  selectedSizes,
  onSizeToggle,
  onClearAll,
}: ProductFilterProps) {
  const [showColors, setShowColors] = useState(false);
  const [showTypes, setShowTypes] = useState(false);
  const [showSizes, setShowSizes] = useState(false);

  const hasFilters = selectedColors.length > 0 || selectedTypes.length > 0 || selectedSizes.length > 0;

  // Sort colors
  const sortedColors = availableColors.sort((a, b) => {
    const order = ["ivory", "cream", "white", "black", "brown", "camel", "terracotta", "red", "blue", "multi"];
    const aIndex = order.indexOf(a.toLowerCase());
    const bIndex = order.indexOf(b.toLowerCase());
    if (aIndex === -1 && bIndex === -1) return a.localeCompare(b);
    if (aIndex === -1) return 1;
    if (bIndex === -1) return -1;
    return aIndex - bIndex;
  });

  // Sort sizes by area
  const sortedSizes = availableSizes.sort((a, b) => {
    const aIdx = SIZE_CATEGORIES.findIndex((s) => s.id === a);
    const bIdx = SIZE_CATEGORIES.findIndex((s) => s.id === b);
    return aIdx - bIdx;
  });

  const closeAll = () => {
    setShowColors(false);
    setShowTypes(false);
    setShowSizes(false);
  };

  return (
    <div className="mb-12 space-y-6">
      {/* Filter row */}
      <div className="flex flex-wrap items-center gap-6">
        {/* Color filter toggle */}
        {availableColors.length > 0 && (
          <button
            onClick={() => {
              setShowColors(!showColors);
              setShowTypes(false);
              setShowSizes(false);
            }}
            className={`flex items-center gap-2 text-[11px] uppercase tracking-[0.15em] transition-colors ${
              showColors || selectedColors.length > 0 ? "text-charcoal" : "text-stone hover:text-charcoal"
            }`}
          >
            <span>Color</span>
            {selectedColors.length > 0 && (
              <span className="w-5 h-5 rounded-full bg-charcoal text-cream text-[10px] flex items-center justify-center">
                {selectedColors.length}
              </span>
            )}
            <span className={`transition-transform ${showColors ? "rotate-180" : ""}`}>↓</span>
          </button>
        )}

        {/* Type filter toggle */}
        {availableTypes.length > 0 && (
          <button
            onClick={() => {
              setShowTypes(!showTypes);
              setShowColors(false);
              setShowSizes(false);
            }}
            className={`flex items-center gap-2 text-[11px] uppercase tracking-[0.15em] transition-colors ${
              showTypes || selectedTypes.length > 0 ? "text-charcoal" : "text-stone hover:text-charcoal"
            }`}
          >
            <span>Type</span>
            {selectedTypes.length > 0 && (
              <span className="w-5 h-5 rounded-full bg-charcoal text-cream text-[10px] flex items-center justify-center">
                {selectedTypes.length}
              </span>
            )}
            <span className={`transition-transform ${showTypes ? "rotate-180" : ""}`}>↓</span>
          </button>
        )}

        {/* Size filter toggle */}
        {availableSizes.length > 0 && (
          <button
            onClick={() => {
              setShowSizes(!showSizes);
              setShowColors(false);
              setShowTypes(false);
            }}
            className={`flex items-center gap-2 text-[11px] uppercase tracking-[0.15em] transition-colors ${
              showSizes || selectedSizes.length > 0 ? "text-charcoal" : "text-stone hover:text-charcoal"
            }`}
          >
            <span>Size</span>
            {selectedSizes.length > 0 && (
              <span className="w-5 h-5 rounded-full bg-charcoal text-cream text-[10px] flex items-center justify-center">
                {selectedSizes.length}
              </span>
            )}
            <span className={`transition-transform ${showSizes ? "rotate-180" : ""}`}>↓</span>
          </button>
        )}

        {/* Clear all */}
        {hasFilters && (
          <button
            onClick={onClearAll}
            className="text-[11px] uppercase tracking-[0.15em] text-stone hover:text-charcoal transition-colors ml-auto"
          >
            Clear all
          </button>
        )}
      </div>

      {/* Color swatches */}
      {showColors && (
        <div className="flex flex-wrap gap-3 pt-4 border-t border-charcoal/10">
          {sortedColors.map((color) => {
            const colorData = COLOR_MAP[color.toLowerCase()];
            if (!colorData) return null;

            const isSelected = selectedColors.includes(color.toLowerCase());
            const isMulti = colorData.hex === "multi";

            return (
              <button
                key={color}
                onClick={() => onColorToggle(color.toLowerCase())}
                className={`group flex items-center gap-2 px-3 py-2 border transition-all ${
                  isSelected
                    ? "border-charcoal bg-charcoal/5"
                    : "border-charcoal/10 hover:border-charcoal/30"
                }`}
                title={colorData.label}
              >
                <span
                  className={`w-4 h-4 rounded-full border border-charcoal/20 ${
                    isMulti ? "bg-gradient-to-br from-terracotta via-blue to-olive" : ""
                  }`}
                  style={isMulti ? {} : { backgroundColor: colorData.hex }}
                />
                <span className="text-[10px] uppercase tracking-[0.1em] text-charcoal">
                  {colorData.label}
                </span>
              </button>
            );
          })}
        </div>
      )}

      {/* Type buttons */}
      {showTypes && (
        <div className="flex flex-wrap gap-3 pt-4 border-t border-charcoal/10">
          {availableTypes.map((type) => {
            const isSelected = selectedTypes.includes(type.toLowerCase());
            const displayName = type.charAt(0).toUpperCase() + type.slice(1);

            return (
              <button
                key={type}
                onClick={() => onTypeToggle(type.toLowerCase())}
                className={`px-4 py-2 border text-[10px] uppercase tracking-[0.1em] transition-all ${
                  isSelected
                    ? "border-charcoal bg-charcoal text-cream"
                    : "border-charcoal/10 text-charcoal hover:border-charcoal/30"
                }`}
              >
                {displayName}
              </button>
            );
          })}
        </div>
      )}

      {/* Size buttons */}
      {showSizes && (
        <div className="flex flex-wrap gap-3 pt-4 border-t border-charcoal/10">
          {sortedSizes.map((sizeId) => {
            const sizeData = SIZE_CATEGORIES.find((s) => s.id === sizeId);
            if (!sizeData) return null;

            const isSelected = selectedSizes.includes(sizeId);

            return (
              <button
                key={sizeId}
                onClick={() => onSizeToggle(sizeId)}
                className={`px-4 py-2 border text-[10px] uppercase tracking-[0.1em] transition-all ${
                  isSelected
                    ? "border-charcoal bg-charcoal text-cream"
                    : "border-charcoal/10 text-charcoal hover:border-charcoal/30"
                }`}
              >
                {sizeData.label}
              </button>
            );
          })}
        </div>
      )}

      {/* Active filters pills (when dropdowns closed) */}
      {!showColors && !showTypes && !showSizes && hasFilters && (
        <div className="flex flex-wrap gap-2">
          {selectedColors.map((color) => {
            const colorData = COLOR_MAP[color];
            if (!colorData) return null;
            const isMulti = colorData.hex === "multi";

            return (
              <span
                key={`color-${color}`}
                className="flex items-center gap-2 px-3 py-1 bg-charcoal/5 border border-charcoal/10"
              >
                <span
                  className={`w-3 h-3 rounded-full border border-charcoal/20 ${
                    isMulti ? "bg-gradient-to-br from-terracotta via-blue to-olive" : ""
                  }`}
                  style={isMulti ? {} : { backgroundColor: colorData.hex }}
                />
                <span className="text-[10px] uppercase tracking-[0.1em]">
                  {colorData.label}
                </span>
                <button
                  onClick={() => onColorToggle(color)}
                  className="text-stone hover:text-charcoal ml-1"
                >
                  ×
                </button>
              </span>
            );
          })}
          {selectedTypes.map((type) => (
            <span
              key={`type-${type}`}
              className="flex items-center gap-2 px-3 py-1 bg-charcoal/5 border border-charcoal/10"
            >
              <span className="text-[10px] uppercase tracking-[0.1em]">
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </span>
              <button
                onClick={() => onTypeToggle(type)}
                className="text-stone hover:text-charcoal ml-1"
              >
                ×
              </button>
            </span>
          ))}
          {selectedSizes.map((sizeId) => {
            const sizeData = SIZE_CATEGORIES.find((s) => s.id === sizeId);
            if (!sizeData) return null;

            return (
              <span
                key={`size-${sizeId}`}
                className="flex items-center gap-2 px-3 py-1 bg-charcoal/5 border border-charcoal/10"
              >
                <span className="text-[10px] uppercase tracking-[0.1em]">
                  {sizeData.label}
                </span>
                <button
                  onClick={() => onSizeToggle(sizeId)}
                  className="text-stone hover:text-charcoal ml-1"
                >
                  ×
                </button>
              </span>
            );
          })}
        </div>
      )}
    </div>
  );
}

// Helper to extract colors from product tags
export function extractColorsFromTags(tags: string[]): string[] {
  const colors: string[] = [];
  
  for (const tag of tags) {
    const lowerTag = tag.toLowerCase().trim();
    
    // Check for "color:xxx" format
    if (lowerTag.startsWith("color:")) {
      const color = lowerTag.replace("color:", "").trim();
      if (COLOR_MAP[color]) {
        colors.push(color);
      }
    }
    // Also check if tag itself is a color name
    else if (COLOR_MAP[lowerTag]) {
      colors.push(lowerTag);
    }
  }
  
  return colors;
}

// Helper to extract type/tribe from product tags
export function extractTypeFromTags(tags: string[]): string | null {
  for (const tag of tags) {
    const lowerTag = tag.toLowerCase().trim();
    
    for (const type of TYPE_LIST) {
      if (lowerTag === type || lowerTag.includes(type)) {
        return type;
      }
    }
  }
  
  return null;
}

// Helper to extract size and categorize it
export function extractSizeCategory(tags: string[]): string | null {
  // Look for size tag like "5x8", "5'x8'", "150x240", etc.
  for (const tag of tags) {
    const lowerTag = tag.toLowerCase().trim();
    
    // Match patterns like "5x8", "5'x8'", "5 x 8"
    const ftMatch = lowerTag.match(/^(\d+)['\s]*[x×]['\s]*(\d+)$/);
    if (ftMatch) {
      const w = parseInt(ftMatch[1]);
      const h = parseInt(ftMatch[2]);
      const area = w * h;
      
      // Find matching category
      for (const cat of SIZE_CATEGORIES) {
        if (cat.id === "other") continue;
        if (area >= cat.minArea && area < cat.maxArea) {
          return cat.id;
        }
      }
      // If no match, it's "other"
      return "other";
    }
    
    // Match cm patterns like "150x240" (convert to feet roughly)
    const cmMatch = lowerTag.match(/^(\d{2,3})[x×](\d{2,3})$/);
    if (cmMatch) {
      const wCm = parseInt(cmMatch[1]);
      const hCm = parseInt(cmMatch[2]);
      // Convert cm to feet (1 foot = 30.48 cm)
      const wFt = wCm / 30.48;
      const hFt = hCm / 30.48;
      const area = wFt * hFt;
      
      for (const cat of SIZE_CATEGORIES) {
        if (cat.id === "other") continue;
        if (area >= cat.minArea && area < cat.maxArea) {
          return cat.id;
        }
      }
      return "other";
    }
  }
  
  return null;
}
