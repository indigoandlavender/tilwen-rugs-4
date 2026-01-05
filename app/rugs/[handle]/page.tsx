import { notFound } from "next/navigation";
import Link from "next/link";
import {
  getProductByHandle,
  getAllProductHandles,
  formatPrice,
} from "@/lib/shopify";
import type { Metadata } from "next";
import BuyButton from "./BuyButton";
import ImageCarousel from "@/components/ImageCarousel";
import ShareTools from "@/components/ShareTools";
import { getStory } from "@/lib/stories";

interface Props {
  params: { handle: string };
}

// Parse specs from description HTML
function parseSpecs(descriptionHtml: string): { label: string; value: string }[] {
  const specs: { label: string; value: string }[] = [];
  
  const patterns = [
    { regex: /Dimensions?:\s*([^<\n]+)/i, label: "Dimensions" },
    { regex: /Pile\s*Height:\s*([^<\n]+)/i, label: "Pile Height" },
    { regex: /Weight:\s*([^<\n]+)/i, label: "Weight" },
    { regex: /Material:\s*([^<\n]+)/i, label: "Material" },
    { regex: /Tribe:\s*([^<\n]+)/i, label: "Tribe" },
    { regex: /Condition:\s*([^<\n]+)/i, label: "Condition" },
    { regex: /Construction\s*details?:\s*([^<\n]+)/i, label: "Construction" },
  ];
  
  for (const { regex, label } of patterns) {
    const match = descriptionHtml.match(regex);
    if (match && match[1]) {
      specs.push({ label, value: match[1].trim() });
    }
  }
  
  return specs;
}

export async function generateStaticParams() {
  const handles = await getAllProductHandles();
  return handles.map((handle) => ({ handle }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const product = await getProductByHandle(params.handle);
  const story = getStory(params.handle);

  if (!product) {
    return {
      title: "Product Not Found",
    };
  }

  const title = story?.poeticTitle || product.title;

  return {
    title,
    description: product.description.slice(0, 160),
    openGraph: {
      title,
      description: product.description.slice(0, 160),
      images: product.featuredImage ? [product.featuredImage.url] : [],
    },
  };
}

export const revalidate = 60;

export default async function ProductPage({ params }: Props) {
  const product = await getProductByHandle(params.handle);

  if (!product) {
    notFound();
  }

  const price = formatPrice(product.priceRange.minVariantPrice);
  const images = product.images.edges.map((edge) => edge.node);
  const firstVariant = product.variants.edges[0]?.node;

  const productUrl = `https://tilwen.com/rugs/${params.handle}`;
  const imageUrl = product.featuredImage?.url || "";
  
  const specs = parseSpecs(product.descriptionHtml || "");
  const story = getStory(params.handle);
  const displayTitle = story?.poeticTitle || product.title;

  return (
    <div className="min-h-screen">
      {/* Back navigation */}
      <div className="px-6 md:px-12 py-6">
        <Link 
          href="/shop"
          className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.15em] text-stone hover:text-charcoal transition-colors"
        >
          <span>←</span>
          Back to shop
        </Link>
      </div>

      {/* Main content */}
      <div className="px-6 md:px-12 pb-20">
        <div className="max-w-[1600px] mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16">
            
            {/* Images */}
            <div className="lg:col-span-8">
              <ImageCarousel images={images} productTitle={displayTitle} />
            </div>

            {/* Info panel */}
            <div className="lg:col-span-4 lg:sticky lg:top-8 lg:self-start">
              <div className="lg:pt-8">
                
                {/* Poetic Title (Main) */}
                <h1 className="font-serif text-2xl md:text-3xl leading-tight mb-4">
                  {displayTitle}
                </h1>

                {/* Price */}
                <div className="mb-2">
                  <span className="text-lg text-charcoal">{price}</span>
                </div>
                
                {/* Shipping note */}
                <p className="text-[12px] text-stone mb-6">
                  Shipping is included in the price.
                </p>

                {/* Share Tools */}
                <div className="mb-8">
                  <ShareTools 
                    title={displayTitle} 
                    url={productUrl}
                    imageUrl={imageUrl}
                  />
                </div>

                {/* Specs */}
                {specs.length > 0 && (
                  <div className="mb-8">
                    {specs.map((spec) => (
                      <div 
                        key={spec.label}
                        className="flex justify-between items-baseline py-3 border-b border-charcoal/10"
                      >
                        <span className="text-[11px] uppercase tracking-[0.1em] text-stone">
                          {spec.label}
                        </span>
                        <span className="text-[13px] text-charcoal text-right max-w-[60%]">
                          {spec.value}
                        </span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Sold status */}
                {!product.availableForSale && (
                  <div className="mb-8 py-4 border border-charcoal/10 text-center">
                    <span className="text-[11px] uppercase tracking-[0.15em] text-stone">
                      This piece has found its home
                    </span>
                  </div>
                )}

                {/* Purchase button */}
                {product.availableForSale && firstVariant && (
                  <div className="mb-8">
                    <BuyButton variantId={firstVariant.id} price={price} />
                  </div>
                )}

                {/* Details */}
                <div className="space-y-0 text-[11px] text-charcoal leading-relaxed">
                  <div className="py-4 border-b border-charcoal/10">
                    <p className="uppercase tracking-[0.1em] text-stone mb-2">Shipping</p>
                    <p>Ships rolled and wrapped within 3–5 business days.</p>
                  </div>
                  
                  <div className="py-4 border-b border-charcoal/10">
                    <p className="uppercase tracking-[0.1em] text-stone mb-2">Returns</p>
                    <p>All sales are final. Please review photos carefully before purchasing.</p>
                  </div>
                  
                  <div className="py-4 border-b border-charcoal/10">
                    <p className="uppercase tracking-[0.1em] text-stone mb-2">Questions</p>
                    <p>
                      Need more details?{" "}
                      <Link href="/contact" className="underline hover:text-charcoal transition-colors">
                        Get in touch
                      </Link>
                    </p>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Story Section */}
      {story && (
        <div className="bg-[#f9f7f4] py-20 px-6 md:px-12">
          <div className="max-w-3xl mx-auto">
            {/* Fixed intro */}
            <p className="text-[11px] uppercase tracking-[0.2em] text-stone mb-10 text-center">
              A piece woven by hand · A memory carried across time
            </p>
            
            {/* Technical Title (bold) + Region (italic) */}
            {story.technicalTitle && (
              <div className="text-center mb-8">
                <p className="text-[15px] font-medium text-charcoal">
                  {story.technicalTitle}
                </p>
                {story.region && (
                  <p className="text-[14px] italic text-charcoal/70 mt-1">
                    {story.region}
                  </p>
                )}
              </div>
            )}
            
            {/* Poem — bordered block, italic */}
            {story.poem && (
              <div className="border-l-2 border-charcoal/20 pl-6 py-4 mb-10 max-w-xl mx-auto">
                {story.poem.split('\\n').map((line, i) => (
                  <p key={i} className="font-serif italic text-lg text-charcoal/80 leading-relaxed">
                    {line}
                  </p>
                ))}
              </div>
            )}
            
            {/* Weaver&apos;s Tale */}
            {story.weaversTale && (
              <div className="max-w-2xl mx-auto mb-12">
                {story.weaversTale.split('\\n').map((para, i) => (
                  <p key={i} className="text-[15px] text-charcoal/90 leading-relaxed mb-4 last:mb-0">
                    {para}
                  </p>
                ))}
              </div>
            )}

            {/* Heritage & Value */}
            <div className="border-t border-charcoal/10 pt-10 text-center">
              <p className="text-[11px] uppercase tracking-[0.15em] text-stone mb-4">
                Heritage & Value
              </p>
              <p className="text-[14px] text-charcoal/80 leading-relaxed max-w-xl mx-auto">
                Handwoven rugs grow in beauty, memory, and value with every passing year.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Care Instructions */}
      <div className="py-16 px-6 md:px-12 border-t border-charcoal/10">
        <div className="max-w-xl mx-auto text-center">
          <p className="text-[11px] uppercase tracking-[0.15em] text-stone mb-6">
            Care Instructions
          </p>
          <ul className="text-[14px] text-charcoal/80 leading-relaxed space-y-3 text-left">
            <li className="flex gap-3">
              <span className="text-stone">·</span>
              <span>Vacuum gently without beater bar.</span>
            </li>
            <li className="flex gap-3">
              <span className="text-stone">·</span>
              <span>Spot clean with cold water and a mild wool detergent.</span>
            </li>
            <li className="flex gap-3">
              <span className="text-stone">·</span>
              <span>Professional cleaning recommended for deeper care.</span>
            </li>
          </ul>
        </div>
      </div>

    </div>
  );
}
