"use client";

import { useState } from "react";

interface BuyButtonProps {
  variantId: string;
  price: string;
}

export default function BuyButton({ variantId, price }: BuyButtonProps) {
  const [loading, setLoading] = useState(false);

  const handleBuy = async () => {
    setLoading(true);

    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ variantId }),
      });

      const data = await response.json();

      if (data.checkoutUrl) {
        window.location.href = data.checkoutUrl;
      } else {
        throw new Error("No checkout URL returned");
      }
    } catch (error) {
      console.error("Checkout error:", error);
      alert("Something went wrong. Please try again.");
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleBuy}
      disabled={loading}
      className="w-full border border-charcoal text-charcoal py-4 text-[11px] uppercase tracking-[0.15em] hover:bg-charcoal hover:text-cream transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed"
    >
      {loading ? "Opening checkout…" : `Acquire — ${price}`}
    </button>
  );
}
