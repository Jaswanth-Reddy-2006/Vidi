"use client";

import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import Link from "next/link";
import { useEffect, useState, useCallback } from "react";
import { SafeImage } from "@/components/ui/safe-image";
import { ChevronLeft, ChevronRight } from "lucide-react";

type CarouselItem = {
  id: string;
  name: string;
  slug: string;
  image: string;
};

export function CategoryCarousel({ items }: { items: CarouselItem[] }) {
  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: true, align: "start" },
    [Autoplay({ delay: 3000, stopOnInteraction: false })]
  );
  
  const [mounted, setMounted] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  const scrollTo = useCallback((index: number) => {
    if (emblaApi) emblaApi.scrollTo(index);
  }, [emblaApi]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi, setSelectedIndex]);

  useEffect(() => {
    setMounted(true);
    if (!emblaApi) return;
    onSelect();
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);
  }, [emblaApi, onSelect]);

  if (!mounted) return <div className="h-[300px] w-full animate-pulse bg-gray-100 rounded-xl" />;

  // Generate an array of indices for the dots. Embla gives scrollSnapList.
  const scrollSnaps = emblaApi?.scrollSnapList() || [];

  return (
    <div className="relative w-full max-w-6xl mx-auto px-12 py-4">
      
      {/* Light Arrow Left */}
      <button 
        onClick={scrollPrev}
        className="absolute left-0 top-1/2 -translate-y-1/2 z-10 p-2 text-gray-400 hover:text-maroon-800 transition-colors"
        aria-label="Previous slide"
      >
        <ChevronLeft className="w-8 h-8" strokeWidth={1.5} />
      </button>

      {/* Carousel Track */}
      <div className="overflow-hidden w-full" ref={emblaRef}>
        <div className="flex -ml-4">
          {items.map((item) => (
            <div key={item.id} className="flex-[0_0_100%] sm:flex-[0_0_50%] md:flex-[0_0_33.33%] lg:flex-[0_0_25%] pl-4 min-w-0">
              <Link href={`/products/${item.slug}`} className="group block relative h-[280px] overflow-hidden rounded-xl shadow-sm hover:shadow-md transition-all">
                <SafeImage
                  src={item.image}
                  alt={item.name}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 33vw, 25vw"
                  unoptimized={true}
                  fallbackSrc={`https://placehold.co/600x800/E5E7EB/A1A1AA/png?text=${encodeURIComponent(item.name)}`}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent flex flex-col justify-end p-4">
                  <h3 className="text-lg font-heading font-bold text-white mb-1 leading-tight line-clamp-2">{item.name}</h3>
                  <span className="text-gold-400 text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    View Product
                  </span>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>

      {/* Light Arrow Right */}
      <button 
        onClick={scrollNext}
        className="absolute right-0 top-1/2 -translate-y-1/2 z-10 p-2 text-gray-400 hover:text-maroon-800 transition-colors"
        aria-label="Next slide"
      >
        <ChevronRight className="w-8 h-8" strokeWidth={1.5} />
      </button>

      {/* Dots removed as requested */}
    </div>
  );
}
