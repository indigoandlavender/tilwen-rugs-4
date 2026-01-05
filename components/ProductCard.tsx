import Image from "next/image";
import Link from "next/link";
import { ShopifyProduct, formatPrice } from "@/lib/shopify";

interface ProductCardProps {
  product: ShopifyProduct;
  featured?: boolean;
}

export default function ProductCard({ product, featured = false }: ProductCardProps) {
  // Try featuredImage first, then fall back to first image in images array
  const image = product.featuredImage || product.images?.edges?.[0]?.node || null;
  const price = formatPrice(product.priceRange.minVariantPrice);

  // Extract size from tags
  const sizeTag = product.tags.find((tag) =>
    /^\d+[x×]\d+$|^\d+'?\s*x\s*\d+'?$/i.test(tag)
  );

  // Extract tribe/type from tags
  const tribeTag = product.tags.find((tag) =>
    /beni|azilal|boujaad|boucherouite|taznakht|mrirt|kilim/i.test(tag)
  );

  return (
    <Link 
      href={`/rugs/${product.handle}`} 
      className={`group block ${featured ? 'col-span-2 row-span-2' : ''}`}
    >
      {/* Image Container */}
      <div className={`relative bg-sand overflow-hidden ${featured ? 'aspect-[3/4]' : 'aspect-[4/5]'}`}>
        {image ? (
          <Image
            src={image.url}
            alt={image.altText || product.title}
            fill
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
            sizes={featured 
              ? "(max-width: 768px) 100vw, 66vw" 
              : "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            }
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-stone text-xs uppercase tracking-widest">No image</span>
          </div>
        )}

        {/* Sold overlay */}
        {!product.availableForSale && (
          <div className="absolute inset-0 bg-cream/80 flex items-center justify-center">
            <span className="text-xs uppercase tracking-[0.2em] text-charcoal/60">Sold</span>
          </div>
        )}
      </div>

      {/* Caption — gallery style */}
      <div className="mt-4 space-y-1">
        {/* Type/Tribe as small label */}
        {tribeTag && (
          <p className="text-[10px] tracking-[0.1em] text-stone">
            {tribeTag.charAt(0).toUpperCase() + tribeTag.slice(1).toLowerCase()}
          </p>
        )}
        
        {/* Title */}
        <h3 className="font-serif text-base leading-snug">
          {product.title}
        </h3>
        
        {/* Price and size as inline caption */}
        <p className="text-[11px] tracking-wide text-stone">
          {price}
          {sizeTag && <span className="ml-3">{sizeTag}</span>}
        </p>
      </div>
    </Link>
  );
}
