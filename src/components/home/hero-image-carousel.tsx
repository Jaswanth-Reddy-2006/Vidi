"use client";

import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { useEffect, useState, useCallback } from "react";
import { SafeImage } from "@/components/ui/safe-image";
import heroBg1 from "../../../public/hero-bg.png";
import heroBg2 from "../../../public/hero-bg-2.png";
import heroBg3 from "../../../public/hero-bg-3.png";

const HERO_IMAGES = [heroBg1, heroBg2, heroBg3];

export function HeroImageCarousel() {
  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: true },
    [Autoplay({ delay: 4000, stopOnInteraction: false })]
  );
  
  const [mounted, setMounted] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);

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

  if (!mounted) return <div className="absolute inset-0 bg-maroon-50 animate-pulse" />;

  const scrollSnaps = emblaApi?.scrollSnapList() || [];

  return (
    <div className="absolute inset-0 overflow-hidden" ref={emblaRef}>
      <div className="flex h-full">
        {HERO_IMAGES.map((src, index) => (
          <div key={index} className="flex-[0_0_100%] relative h-full min-w-0">
            <SafeImage 
              src={src} 
              alt={`Premium Saree Collection ${index + 1}`}
              fill 
              className="object-cover object-left md:object-center"
              unoptimized={true}
              fallbackSrc={`https://placehold.co/1200x800/970747/FFFFFF/png?text=Premium+Sarees+${index + 1}`}
            />
          </div>
        ))}
      </div>

      {/* Dots */}
      {scrollSnaps.length > 0 && (
        <div className="absolute bottom-6 left-0 right-0 flex justify-center items-center gap-2 z-10">
          {scrollSnaps.map((_, index) => (
            <button
              key={index}
              onClick={() => scrollTo(index)}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                index === selectedIndex ? "bg-white w-6" : "bg-white/50 hover:bg-white/80"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
