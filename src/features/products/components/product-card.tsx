"use client";

import { SafeImage } from "@/components/ui/safe-image";
import Link from "next/link";
import { Heart, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/utils";

interface ProductCardProps {
  product: {
    id: string;
    name: string;
    slug: string;
    basePrice: any; // Decimal type from Prisma
    salePrice?: any | null;
    images: { url: string; alt?: string | null }[];
    category: { name: string };
  };
}

export function ProductCard({ product }: ProductCardProps) {
  const imageUrl = product.images?.[0]?.url || "https://images.unsplash.com/photo-1583391733958-d150247ec6cb?q=80&w=600&auto=format&fit=crop";
  const price = Number(product.basePrice);
  const salePrice = product.salePrice ? Number(product.salePrice) : undefined;
  
  const discount = salePrice 
    ? Math.round(((price - salePrice) / price) * 100) 
    : 0;

  return (
    <div className="group flex flex-col bg-white dark:bg-gray-900 rounded-2xl overflow-hidden border border-gray-100 dark:border-gray-800 hover:shadow-xl transition-all duration-300">
      <div className="relative aspect-[4/5] overflow-hidden bg-gray-100 dark:bg-gray-800">
        <Link href={`/products/${product.slug}`}>
          <SafeImage
            src={imageUrl}
            alt={product.images?.[0]?.alt || product.name}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-110"
            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
            fallbackSrc={`https://placehold.co/600x800/970747/FFFFFF/png?text=${encodeURIComponent(product.name)}`}
          />
        </Link>
        
        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {discount > 0 && (
            <span className="bg-maroon-600 text-white text-xs font-bold px-2 py-1 rounded-md">
              {discount}% OFF
            </span>
          )}
        </div>

        {/* Quick Actions (Hover) */}
        <div className="absolute right-3 top-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col gap-2">
          <button className="bg-white/90 hover:bg-white dark:bg-gray-900/90 dark:hover:bg-gray-900 p-2 rounded-full shadow-md text-gray-600 hover:text-maroon-600 dark:text-gray-300 dark:hover:text-maroon-400 transition-colors">
            <Heart className="w-4 h-4" />
          </button>
        </div>
        
        {/* Add to Cart (Hover - Desktop) */}
        <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300 hidden md:block">
          <Button className="w-full bg-white/90 hover:bg-maroon-700 hover:text-white text-maroon-900 backdrop-blur-sm border-none shadow-lg">
            <ShoppingBag className="w-4 h-4 mr-2" />
            Quick Add
          </Button>
        </div>
      </div>

      <div className="p-4 flex flex-col flex-1">
        <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">{product.category.name}</div>
        <Link href={`/products/${product.slug}`} className="hover:text-maroon-700 dark:hover:text-maroon-400 transition-colors">
          <h3 className="font-heading font-semibold text-gray-900 dark:text-gray-100 line-clamp-2 mb-2">
            {product.name}
          </h3>
        </Link>
        <div className="mt-auto flex items-center gap-2">
          {salePrice ? (
            <>
              <span className="font-bold text-maroon-700 dark:text-maroon-400 text-lg">
                {formatPrice(salePrice)}
              </span>
              <span className="text-sm text-gray-400 line-through">
                {formatPrice(price)}
              </span>
            </>
          ) : (
            <span className="font-bold text-gray-900 dark:text-gray-100 text-lg">
              {formatPrice(price)}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
