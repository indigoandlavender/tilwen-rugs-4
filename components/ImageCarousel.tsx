"use client";

import { useState, useCallback } from "react";
import Image from "next/image";

interface CarouselImage {
  url: string;
  altText: string | null;
  width: number;
  height: number;
}

interface ImageCarouselProps {
  images: CarouselImage[];
  productTitle: string;
}

export default function ImageCarousel({ images, productTitle }: ImageCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const goToPrevious = useCallback(() => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  }, [images.length]);

  const goToNext = useCallback(() => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  }, [images.length]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === "ArrowLeft") goToPrevious();
    if (e.key === "ArrowRight") goToNext();
  }, [goToPrevious, goToNext]);

  if (images.length === 0) {
    return (
      <div className="aspect-[4/5] bg-sand flex items-center justify-center">
        <span className="text-stone text-xs uppercase tracking-widest">
          No image available
        </span>
      </div>
    );
  }

  const currentImage = images[currentIndex];

  return (
    <div className="relative" onKeyDown={handleKeyDown} tabIndex={0}>
      {/* Main Image Container */}
      <div className="relative aspect-[4/5] bg-sand overflow-hidden">
        <Image
          src={currentImage.url}
          alt={currentImage.altText || `${productTitle} - Image ${currentIndex + 1}`}
          fill
          className="object-cover"
          priority={currentIndex === 0}
          sizes="(max-width: 1024px) 100vw, 66vw"
        />
      </div>

      {/* Navigation Arrows */}
      {images.length > 1 && (
        <>
          {/* Previous */}
          <button
            onClick={goToPrevious}
            className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center bg-white/90 backdrop-blur-sm rounded-full shadow-sm hover:bg-white transition-all hover:scale-105"
            aria-label="Previous image"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5">
              <polyline points="9,2 4,7 9,12" />
            </svg>
          </button>

          {/* Next */}
          <button
            onClick={goToNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center bg-white/90 backdrop-blur-sm rounded-full shadow-sm hover:bg-white transition-all hover:scale-105"
            aria-label="Next image"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5">
              <polyline points="5,2 10,7 5,12" />
            </svg>
          </button>
        </>
      )}

      {/* Dots indicator */}
      {images.length > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-2 h-2 rounded-full transition-all ${
                index === currentIndex 
                  ? "bg-charcoal" 
                  : "bg-charcoal/30 hover:bg-charcoal/50"
              }`}
              aria-label={`Go to image ${index + 1}`}
            />
          ))}
        </div>
      )}

      {/* Thumbnail strip */}
      {images.length > 1 && (
        <div className="mt-3 flex gap-2 overflow-hidden">
          {images.map((image, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`relative flex-shrink-0 w-16 h-20 overflow-hidden transition-all ${
                index === currentIndex 
                  ? "ring-1 ring-charcoal" 
                  : "opacity-60 hover:opacity-100"
              }`}
            >
              <Image
                src={image.url}
                alt={`Thumbnail ${index + 1}`}
                fill
                className="object-cover"
                sizes="64px"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
