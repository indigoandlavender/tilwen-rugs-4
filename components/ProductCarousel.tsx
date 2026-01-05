"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import type { ShopifyProduct } from "@/lib/shopify";

interface ProductCarouselProps {
  products: ShopifyProduct[];
}

export default function ProductCarousel({ products }: ProductCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = 400;
      scrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
      setTimeout(checkScroll, 300);
    }
  };

  const formatPrice = (amount: string, currency: string) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(parseFloat(amount));
  };

  // Take first 8 products for carousel
  const carouselProducts = products.slice(0, 8);

  return (
    <section className="py-20 md:py-32">
      <div className="px-6 md:px-12 max-w-[1400px] mx-auto">
        {/* Header */}
        <div className="flex items-end justify-between mb-12 md:mb-16">
          <div>
            <p className="text-[10px] uppercase tracking-[0.2em] text-stone mb-2">
              The Collection
            </p>
            <h2 className="font-serif text-2xl md:text-3xl">
              Selected pieces
            </h2>
          </div>
          <Link
            href="/shop"
            className="hidden md:inline-flex items-center gap-3 text-xs uppercase tracking-[0.15em] border-b border-charcoal pb-1 hover:border-charcoal/40 transition-colors"
          >
            View all
            <span className="text-lg">→</span>
          </Link>
        </div>

        {/* Carousel */}
        <div className="relative">
          {/* Navigation Arrows */}
          {canScrollLeft && (
            <button
              onClick={() => scroll("left")}
              className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 w-10 h-10 bg-cream border border-charcoal/10 flex items-center justify-center hover:bg-sand transition-colors"
              aria-label="Previous"
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5">
                <polyline points="9,2 4,7 9,12" />
              </svg>
            </button>
          )}
          {canScrollRight && (
            <button
              onClick={() => scroll("right")}
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 w-10 h-10 bg-cream border border-charcoal/10 flex items-center justify-center hover:bg-sand transition-colors"
              aria-label="Next"
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5">
                <polyline points="5,2 10,7 5,12" />
              </svg>
            </button>
          )}

          {/* Scrollable Container */}
          <div
            ref={scrollRef}
            onScroll={checkScroll}
            className="flex gap-6 overflow-x-auto scrollbar-hide pb-4"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {carouselProducts.map((product) => {
              const image = product.images.edges[0]?.node;
              const price = product.priceRange.minVariantPrice;

              return (
                <Link
                  key={product.id}
                  href={`/rugs/${product.handle}`}
                  className="flex-shrink-0 w-[280px] md:w-[320px] group"
                >
                  {/* Image */}
                  <div className="relative aspect-[4/5] bg-sand/30 mb-4 overflow-hidden">
                    {image ? (
                      <Image
                        src={image.url}
                        alt={image.altText || product.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                        sizes="320px"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center text-stone/40">
                        No image
                      </div>
                    )}
                    {!product.availableForSale && (
                      <div className="absolute top-4 left-4 bg-charcoal text-cream text-[10px] uppercase tracking-wider px-3 py-1">
                        Sold
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <h3 className="font-serif text-base mb-1 group-hover:underline">
                    {product.title}
                  </h3>
                  <p className="text-sm text-stone">
                    {formatPrice(price.amount, price.currencyCode)}
                  </p>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Mobile View All */}
        <div className="mt-8 md:hidden text-center">
          <Link
            href="/shop"
            className="inline-flex items-center gap-3 text-xs uppercase tracking-[0.15em] border-b border-charcoal pb-1"
          >
            View all rugs
            <span className="text-lg">→</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
