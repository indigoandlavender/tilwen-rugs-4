import { getAvailableProducts } from "@/lib/shopify";
import ProductCarousel from "@/components/ProductCarousel";
import MoroccoStoriesMap from "@/components/MoroccoStoriesMap";
import Link from "next/link";

export const revalidate = 60;

export default async function Home() {
  const products = await getAvailableProducts();

  return (
    <div>
      {/* Editorial Hero — full bleed, minimal */}
      <section className="relative h-[70vh] min-h-[500px] flex items-end bg-sand">
        {/* Could add a hero image here later */}
        <div className="absolute inset-0 bg-gradient-to-t from-cream/90 via-cream/20 to-transparent" />
        
        <div className="relative z-10 px-6 md:px-12 pb-16 md:pb-20 max-w-4xl">
          <p className="text-[10px] uppercase tracking-[0.2em] text-stone mb-4">
            The Collection
          </p>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-serif leading-[1.1] mb-6">
            Moroccan rugs<br />
            <span className="text-stone">with soul</span>
          </h1>
          <p className="text-charcoal max-w-md text-sm leading-relaxed">
            Vintage and contemporary pieces from the Atlas Mountains and beyond. 
            Each one handpicked. Each one singular.
          </p>
        </div>
      </section>

      {/* Product Carousel */}
      <ProductCarousel products={products} />

      {/* Morocco Stories Map */}
      <MoroccoStoriesMap />

      {/* Bottom CTA */}
      <section className="px-6 md:px-12 py-20 md:py-32">
        <div className="max-w-[1400px] mx-auto flex flex-col md:flex-row md:items-end md:justify-between gap-8">
          <div>
            <p className="text-[10px] uppercase tracking-[0.2em] text-stone mb-3">
              Looking for something specific?
            </p>
            <h3 className="font-serif text-2xl md:text-3xl max-w-md">
              Tell us what you're searching for
            </h3>
          </div>
          <Link 
            href="/contact"
            className="inline-flex items-center gap-3 text-xs uppercase tracking-[0.15em] border-b border-charcoal pb-1 hover:border-charcoal/40 transition-colors"
          >
            Get in touch
            <span className="text-lg">→</span>
          </Link>
        </div>
      </section>
    </div>
  );
}
