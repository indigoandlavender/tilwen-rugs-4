"use client";

import { useState } from "react";
import dynamic from "next/dynamic";

// Dynamic import to avoid SSR issues with canvas
const RugVisualizer = dynamic(() => import("@/components/RugVisualizer"), {
  ssr: false,
});

interface VisualizeButtonProps {
  rugImage: string;
  rugName: string;
}

export default function VisualizeButton({ rugImage, rugName }: VisualizeButtonProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="w-full flex items-center justify-center gap-2 py-3 border border-charcoal/20 text-[11px] uppercase tracking-[0.15em] text-charcoal hover:bg-charcoal hover:text-cream transition-colors"
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.2">
          <rect x="1" y="3" width="14" height="10" rx="1" />
          <path d="M4 13v1M12 13v1M1 8h14" strokeOpacity="0.5" />
        </svg>
        Visualize in Your Space
      </button>

      {isOpen && (
        <RugVisualizer
          rugImage={rugImage}
          rugName={rugName}
          onClose={() => setIsOpen(false)}
        />
      )}
    </>
  );
}
