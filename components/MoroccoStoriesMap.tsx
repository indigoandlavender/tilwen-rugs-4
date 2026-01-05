"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

// Story marker data structure
interface StoryMarker {
  id: string;
  title: string;
  subtitle: string;
  region: string;
  coordinates: [number, number]; // [lng, lat]
  slug: string;
}

interface MoroccoStoriesMapProps {
  stories?: StoryMarker[];
}

// House of Weaves Moroccan stories with coordinates
const MOROCCO_STORIES: StoryMarker[] = [
  {
    id: "baraka",
    title: "Baraka",
    subtitle: "The blessing woven into every knot",
    region: "High Atlas",
    coordinates: [-7.9898, 31.6295], // Marrakech (Musée Berbère)
    slug: "baraka-berber-carpets",
  },
  {
    id: "boucherouite",
    title: "Boucherouite",
    subtitle: "Recycled rags become art",
    region: "Middle Atlas",
    coordinates: [-5.5500, 33.4500], // Khenifra region
    slug: "boucherouite",
  },
  {
    id: "beni-ourain",
    title: "The White Giants",
    subtitle: "Beni Ourain rugs and the modernists",
    region: "High Atlas",
    coordinates: [-4.8000, 33.5500], // Beni Ourain territory
    slug: "the-white-giants",
  },
  {
    id: "handira",
    title: "The Bride's Armor",
    subtitle: "Wedding blankets that protect",
    region: "High Atlas",
    coordinates: [-6.0000, 32.2000], // Atlas Mountains
    slug: "the-brides-armor",
  },
  {
    id: "three-arts",
    title: "The Three Arts",
    subtitle: "Embroidery, weaving, and knotting",
    region: "Anti-Atlas",
    coordinates: [-7.2167, 30.5167], // Taznakht
    slug: "the-three-arts",
  },
  {
    id: "kharita",
    title: "The Map Weavers",
    subtitle: "Landscapes encoded in kilims",
    region: "Anti-Atlas",
    coordinates: [-7.1500, 30.4500], // Taznakht area
    slug: "the-map-weavers",
  },
];

// Additional weaving regions (no story yet)
const WEAVING_REGIONS: StoryMarker[] = [
  {
    id: "boujad",
    title: "Boujad",
    subtitle: "Bold colors from the plains",
    region: "Tadla-Azilal",
    coordinates: [-6.8167, 32.7500],
    slug: "",
  },
  {
    id: "azilal",
    title: "Azilal",
    subtitle: "Abstract geometry from the mountains",
    region: "High Atlas",
    coordinates: [-6.5700, 31.9600],
    slug: "",
  },
  {
    id: "beni-mrirt",
    title: "Beni M'Rirt",
    subtitle: "The softest pile",
    region: "Middle Atlas",
    coordinates: [-5.6000, 33.0000],
    slug: "",
  },
  {
    id: "chichaoua",
    title: "Chichaoua",
    subtitle: "Amber and earth tones",
    region: "Haouz Plains",
    coordinates: [-8.7500, 31.5333],
    slug: "",
  },
];

export default function MoroccoStoriesMap({ stories }: MoroccoStoriesMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<any>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [selectedMarker, setSelectedMarker] = useState<StoryMarker | null>(null);

  // Combine stories (with links) and regions (without)
  const allMarkers = [...MOROCCO_STORIES, ...WEAVING_REGIONS];

  useEffect(() => {
    if (!mapContainer.current || map.current) return;

    const mapboxToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;
    
    if (!mapboxToken) {
      console.error("Mapbox token not configured");
      return;
    }

    // Add mapbox CSS to head
    const link = document.createElement("link");
    link.href = "https://api.mapbox.com/mapbox-gl-js/v3.3.0/mapbox-gl.css";
    link.rel = "stylesheet";
    document.head.appendChild(link);

    // Dynamically import mapbox-gl to avoid SSR issues
    import("mapbox-gl").then((mapboxgl) => {
      mapboxgl.default.accessToken = mapboxToken;

      map.current = new mapboxgl.default.Map({
        container: mapContainer.current!,
        style: "mapbox://styles/mapbox/light-v11",
        center: [-6.5, 31.8], // Center on Morocco
        zoom: 5.8,
        attributionControl: false,
      });

      map.current.on("load", () => {
        setMapLoaded(true);

        // Add story markers (with links - darker)
        MOROCCO_STORIES.forEach((marker) => {
          const el = document.createElement("div");
          el.style.width = "12px";
          el.style.height = "12px";
          el.style.backgroundColor = "#1a1a1a";
          el.style.borderRadius = "50%";
          el.style.cursor = "pointer";
          el.style.transition = "transform 0.2s";
          el.addEventListener("mouseenter", () => {
            el.style.transform = "scale(1.5)";
          });
          el.addEventListener("mouseleave", () => {
            el.style.transform = "scale(1)";
          });

          new mapboxgl.default.Marker({
            element: el,
            anchor: "center",
          })
            .setLngLat(marker.coordinates)
            .addTo(map.current);

          el.addEventListener("click", () => {
            setSelectedMarker(marker);
            map.current.flyTo({
              center: marker.coordinates,
              zoom: 7.5,
              duration: 1000,
            });
          });
        });

        // Add region markers (no links - lighter)
        WEAVING_REGIONS.forEach((marker) => {
          const el = document.createElement("div");
          el.style.width = "10px";
          el.style.height = "10px";
          el.style.backgroundColor = "#8a8a8a";
          el.style.borderRadius = "50%";
          el.style.cursor = "pointer";
          el.style.transition = "transform 0.2s";
          el.addEventListener("mouseenter", () => {
            el.style.transform = "scale(1.5)";
          });
          el.addEventListener("mouseleave", () => {
            el.style.transform = "scale(1)";
          });

          new mapboxgl.default.Marker({
            element: el,
            anchor: "center",
          })
            .setLngLat(marker.coordinates)
            .addTo(map.current);

          el.addEventListener("click", () => {
            setSelectedMarker(marker);
            map.current.flyTo({
              center: marker.coordinates,
              zoom: 7.5,
              duration: 1000,
            });
          });
        });

        // Add navigation controls
        map.current.addControl(
          new mapboxgl.default.NavigationControl({ showCompass: false }),
          "top-right"
        );
      });
    });

    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
      // Note: We don't remove the CSS link as it may cause flickering on re-mount
    };
  }, []);

  return (
    <section className="py-20 md:py-32 bg-sand/30">
      <div className="px-6 md:px-12 max-w-[1400px] mx-auto">
        {/* Header */}
        <div className="flex items-end justify-between mb-12 md:mb-16">
          <div>
            <p className="text-[10px] uppercase tracking-[0.2em] text-stone mb-2">
              Origins
            </p>
            <h2 className="font-serif text-2xl md:text-3xl">
              Where the rugs are born
            </h2>
          </div>
          <Link
            href="https://houseofweaves.love"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden md:inline-flex items-center gap-3 text-xs uppercase tracking-[0.15em] text-stone hover:text-charcoal transition-colors"
          >
            Stories at House of Weaves
            <span className="text-lg">↗</span>
          </Link>
        </div>

        {/* Map Container */}
        <div className="relative">
          <div
            ref={mapContainer}
            className="w-full h-[400px] md:h-[500px] bg-sand/50"
          />

          {/* Selected Marker Info */}
          {selectedMarker && (
            <div className="absolute bottom-6 left-6 right-6 md:left-auto md:right-6 md:w-80 bg-cream p-6 shadow-lg">
              <button
                onClick={() => {
                  setSelectedMarker(null);
                  map.current?.flyTo({
                    center: [-6.5, 31.8],
                    zoom: 5.8,
                    duration: 1000,
                  });
                }}
                className="absolute top-4 right-4 text-stone hover:text-charcoal"
                aria-label="Close"
              >
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <line x1="2" y1="2" x2="12" y2="12" />
                  <line x1="12" y1="2" x2="2" y2="12" />
                </svg>
              </button>
              <p className="text-[10px] uppercase tracking-[0.2em] text-stone mb-2">
                {selectedMarker.region}
              </p>
              <h3 className="font-serif text-xl mb-2">{selectedMarker.title}</h3>
              <p className="text-sm text-stone mb-4">{selectedMarker.subtitle}</p>
              {selectedMarker.slug ? (
                <Link
                  href={`https://houseofweaves.love/stories/${selectedMarker.slug}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.15em] border-b border-charcoal pb-1 hover:border-charcoal/40 transition-colors"
                >
                  Read the story
                  <span>↗</span>
                </Link>
              ) : (
                <p className="text-xs text-stone/60 italic">Story coming soon</p>
              )}
            </div>
          )}

          {/* No token fallback */}
          {!process.env.NEXT_PUBLIC_MAPBOX_TOKEN && (
            <div className="absolute inset-0 flex items-center justify-center bg-sand/80">
              <p className="text-stone text-sm">Map requires configuration</p>
            </div>
          )}
        </div>

        {/* Mobile link */}
        <div className="mt-8 md:hidden text-center">
          <Link
            href="https://houseofweaves.love"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.15em] text-stone"
          >
            Stories at House of Weaves
            <span>↗</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
