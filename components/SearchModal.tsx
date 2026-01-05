"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";

interface SearchResult {
  handle: string;
  title: string;
  image: string | null;
  price: string;
  currency: string;
}

export default function SearchModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceRef = useRef<NodeJS.Timeout>();

  // Focus input when modal opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
    };
    
    // Handle Cmd/Ctrl + K to open search
    const handleShortcut = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setIsOpen(true);
      }
    };

    document.addEventListener("keydown", handleEscape);
    document.addEventListener("keydown", handleShortcut);
    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.removeEventListener("keydown", handleShortcut);
    };
  }, []);

  // Debounced search
  useEffect(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    if (query.length < 2) {
      setResults([]);
      return;
    }

    setIsLoading(true);
    debounceRef.current = setTimeout(async () => {
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
        const data = await res.json();
        setResults(data.products || []);
      } catch (error) {
        console.error("Search error:", error);
        setResults([]);
      } finally {
        setIsLoading(false);
      }
    }, 300);

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [query]);

  const formatPrice = (amount: string, currency: string) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(parseFloat(amount));
  };

  const handleResultClick = () => {
    setIsOpen(false);
    setQuery("");
    setResults([]);
  };

  return (
    <>
      {/* Search Icon Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="text-charcoal/70 hover:text-charcoal transition-colors p-1"
        aria-label="Search rugs"
      >
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.35-4.35" />
        </svg>
      </button>

      {/* Modal Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-charcoal/40 backdrop-blur-sm z-50"
          onClick={() => setIsOpen(false)}
        >
          {/* Modal Content */}
          <div
            className="fixed top-[15%] left-1/2 -translate-x-1/2 w-full max-w-xl bg-sand rounded-lg shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Search Input */}
            <div className="flex items-center gap-3 px-5 py-4 border-b border-charcoal/10">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-charcoal/40"
              >
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.35-4.35" />
              </svg>
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search rugs..."
                className="flex-1 bg-transparent text-lg outline-none placeholder:text-charcoal/40"
              />
              {query && (
                <button
                  onClick={() => {
                    setQuery("");
                    setResults([]);
                    inputRef.current?.focus();
                  }}
                  className="text-charcoal/40 hover:text-charcoal"
                >
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  >
                    <path d="M18 6L6 18M6 6l12 12" />
                  </svg>
                </button>
              )}
              <kbd className="hidden sm:inline-block px-2 py-1 text-xs text-charcoal/40 bg-charcoal/5 rounded">
                ESC
              </kbd>
            </div>

            {/* Results */}
            <div className="max-h-[60vh] overflow-y-auto">
              {isLoading && (
                <div className="px-5 py-8 text-center text-charcoal/50">
                  Searching...
                </div>
              )}

              {!isLoading && query.length >= 2 && results.length === 0 && (
                <div className="px-5 py-8 text-center text-charcoal/50">
                  No rugs found for "{query}"
                </div>
              )}

              {!isLoading && results.length > 0 && (
                <div className="py-2">
                  {results.map((product) => (
                    <Link
                      key={product.handle}
                      href={`/rug/${product.handle}`}
                      onClick={handleResultClick}
                      className="flex items-center gap-4 px-5 py-3 hover:bg-charcoal/5 transition-colors"
                    >
                      {product.image ? (
                        <div className="w-16 h-16 relative bg-charcoal/5 rounded overflow-hidden flex-shrink-0">
                          <Image
                            src={product.image}
                            alt={product.title}
                            fill
                            className="object-cover"
                            sizes="64px"
                          />
                        </div>
                      ) : (
                        <div className="w-16 h-16 bg-charcoal/5 rounded flex-shrink-0" />
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">
                          {product.title}
                        </p>
                        <p className="text-sm text-charcoal/60">
                          {formatPrice(product.price, product.currency)}
                        </p>
                      </div>
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        className="text-charcoal/30"
                      >
                        <path d="M9 18l6-6-6-6" />
                      </svg>
                    </Link>
                  ))}
                </div>
              )}

              {!isLoading && query.length < 2 && (
                <div className="px-5 py-8 text-center text-charcoal/40 text-sm">
                  Type to search by name, region, or style
                </div>
              )}
            </div>

            {/* Footer hint */}
            <div className="px-5 py-3 border-t border-charcoal/10 text-xs text-charcoal/40 flex items-center justify-between">
              <span>Search by tribe, size, or color</span>
              <span className="hidden sm:inline">
                <kbd className="px-1.5 py-0.5 bg-charcoal/5 rounded">⌘</kbd>
                <span className="mx-1">+</span>
                <kbd className="px-1.5 py-0.5 bg-charcoal/5 rounded">K</kbd>
              </span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
