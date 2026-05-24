import Link from "next/link";
import { SafeImage } from "@/components/ui/safe-image";
import { Button } from "@/components/ui/button";
import { prisma } from "@/lib/prisma";
import { CategoryCarousel } from "@/components/home/category-carousel";
import { HeroImageCarousel } from "@/components/home/hero-image-carousel";
import { ShieldCheck, Truck, RefreshCcw } from "lucide-react";
import { ProductCard } from "@/features/products/components/product-card";

export const revalidate = 3600;

export default async function Home() {
  // Fetch random products for the carousel (My Idea)
  const randomProducts = await prisma.product.findMany({
    where: { isActive: true },
    include: { images: true },
    take: 50,
  });
  
  // Shuffle randomly
  const shuffled = randomProducts.sort(() => 0.5 - Math.random());

  const carouselItems = shuffled.map(p => ({
    id: p.id,
    name: p.name,
    slug: p.slug,
    image: p.images[0]?.url || "https://placehold.co/600x800/800020/FFFFFF/png?text=Saree",
  }));

  // Fetch specific categories for the Shop By Category section
  const categories = await prisma.category.findMany({
    take: 4,
  });

  return (
    <div className="flex flex-col items-center w-full">
      {/* Promo Banner */}
      <div className="w-full bg-maroon-50 text-maroon-900 text-center py-1.5 text-xs font-medium border-b border-maroon-100">
        ✨ Free Shipping on orders above ₹999 | <Link href="/products" className="underline font-bold hover:text-maroon-700">Shop Now</Link>
      </div>

      {/* 1. Hero Section (Boxed Production Ready) */}
      <section className="w-full relative bg-white py-6 md:py-10">
        <div className="max-w-6xl mx-auto rounded-3xl overflow-hidden shadow-2xl border border-maroon-100 mx-4 lg:mx-auto relative min-h-[450px] lg:min-h-[500px] flex items-center">
          
          {/* Background Image Carousel filling the card */}
          <div className="absolute inset-0 z-0">
            <HeroImageCarousel />
          </div>

          {/* Foreground Overlay Content */}
          <div className="relative z-20 w-full flex flex-col md:flex-row">
            
            {/* Left Side (Empty, letting the background image show through) */}
            <div className="hidden md:block w-[45%]"></div>
            
            {/* Text Side (Right) floating over the natural empty space of the image */}
            <div className="w-full md:w-[55%] p-8 md:p-12 lg:p-16 space-y-6 flex flex-col justify-center text-left bg-white/30 backdrop-blur-[2px] md:bg-transparent md:backdrop-blur-none">
              <h1 className="text-[40px] md:text-5xl lg:text-[56px] font-heading font-extrabold leading-[1.05] uppercase tracking-tight drop-shadow-sm">
                <span className="text-[#a88a45]">Weave Your Own</span> <br/>
                <span className="text-maroon-700">
                  Vibrant Story.
                </span>
              </h1>
              
              <p className="text-base md:text-lg text-maroon-900 max-w-lg leading-relaxed font-bold drop-shadow-sm">
                Explore our collection of hand-crafted, high-octane sarees. Modern luxury, timeless art.
              </p>
              
              <div className="flex flex-wrap gap-4 pt-4">
                <Link href="/products" className="inline-block">
                  <Button size="lg" className="bg-[#00a8a8] hover:bg-[#008f8f] text-white rounded-none px-6 md:px-8 h-12 md:h-14 text-sm md:text-base font-bold tracking-widest uppercase transition-colors shadow-md">
                    Explore Collections
                  </Button>
                </Link>
                <Link href="/categories" className="inline-block">
                  <Button size="lg" className="bg-[#ed6c00] hover:bg-[#d66100] text-white rounded-none px-6 md:px-8 h-12 md:h-14 text-sm md:text-base font-bold tracking-widest uppercase transition-colors shadow-md border-none">
                    Browse Materials
                  </Button>
                </Link>
              </div>
            </div>
            
          </div>
        </div>
      </section>

      {/* 2. My Idea (Random Products Carousel) */}
      <section className="w-full py-12 md:py-16 bg-white overflow-hidden">
        <div className="container px-4 md:px-6 mx-auto mb-8 text-center">
          <h2 className="text-2xl md:text-3xl font-heading font-bold text-gray-900">Featured Collection</h2>
          <p className="text-gray-500 mt-2">Discover handpicked styles just for you</p>
        </div>
        <div className="w-full">
          <CategoryCarousel items={carouselItems} />
        </div>
      </section>

      {/* 3. Shop by Category (As in the image) */}
      <section className="w-full py-16 bg-white container px-4 md:px-6 mx-auto">
        <div className="text-center space-y-2 mb-12">
          <h2 className="text-3xl md:text-4xl font-heading font-bold text-maroon-800">Shop by Category</h2>
          <p className="text-maroon-700 font-medium">Explore our rich heritage through diverse styles</p>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 lg:gap-8">
          {[
            { name: 'Silk', image: '/products/product-1.png' },
            { name: 'Cotton', image: '/products/product-2.png' },
            { name: 'Banarasi', image: '/products/product-3.png' },
            { name: 'Chiffon', image: '/products/product-4.png' }
          ].map((cat) => (
            <Link key={cat.name} href={`/categories/${cat.name.toLowerCase()}`} className="group block">
              <div className="aspect-[3/4] relative overflow-hidden bg-gray-100 mb-4 rounded-2xl shadow-sm border border-maroon-50">
                <SafeImage 
                  src={cat.image}
                  alt={`${cat.name} Sarees`}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  fallbackSrc={`https://placehold.co/600x800/E5E7EB/A1A1AA/png?text=${cat.name}`}
                />
              </div>
              <h3 className="font-bold text-lg text-center text-maroon-800 group-hover:text-maroon-600 transition-colors">{cat.name}</h3>
            </Link>
          ))}
        </div>
      </section>

      {/* 4. Newsletter */}
      <section className="w-full py-12 bg-white border-y border-maroon-100">
        <div className="container mx-auto px-4 md:px-6 flex flex-col md:flex-row items-center justify-between max-w-5xl bg-maroon-50 p-8 rounded-xl shadow-sm border border-maroon-100">
          <div className="mb-6 md:mb-0 text-center md:text-left">
            <h3 className="text-xl font-bold text-maroon-800 uppercase tracking-wider mb-2">Stay Updated</h3>
            <p className="text-maroon-700 text-sm">Subscribe for exclusive offers, new arrivals, and style inspiration.</p>
          </div>
          <form className="flex w-full md:w-auto gap-2">
            <input 
              type="email" 
              placeholder="Your email address" 
              required
              className="flex-1 md:w-80 px-4 py-2 bg-white border border-maroon-200 rounded-sm focus:outline-none focus:border-maroon-800 text-sm text-maroon-900 placeholder:text-maroon-300"
            />
            <button type="submit" className="bg-maroon-700 hover:bg-maroon-800 text-white px-6 py-2 font-medium rounded-sm text-sm">
              Subscribe
            </button>
          </form>
        </div>
      </section>

      {/* 5. Our Promise (Decreased size) */}
      <section className="w-full bg-white py-12">
        <div className="container mx-auto px-4 md:px-6 max-w-4xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center divide-y md:divide-y-0 md:divide-x divide-gray-200">
            <div className="flex flex-col items-center pt-6 md:pt-0">
              <ShieldCheck className="w-6 h-6 text-maroon-800 mb-2" />
              <h3 className="text-sm font-bold text-gray-900 uppercase">100% Authentic</h3>
              <p className="text-xs text-gray-500 mt-1 max-w-[200px]">Certified pure handwoven fabrics.</p>
            </div>
            
            <div className="flex flex-col items-center pt-6 md:pt-0">
              <Truck className="w-6 h-6 text-maroon-800 mb-2" />
              <h3 className="text-sm font-bold text-gray-900 uppercase">Express Delivery</h3>
              <p className="text-xs text-gray-500 mt-1 max-w-[200px]">Fast & insured shipping globally.</p>
            </div>
            
            <div className="flex flex-col items-center pt-6 md:pt-0">
              <RefreshCcw className="w-6 h-6 text-maroon-800 mb-2" />
              <h3 className="text-sm font-bold text-gray-900 uppercase">Easy Returns</h3>
              <p className="text-xs text-gray-500 mt-1 max-w-[200px]">7-day hassle-free return policy.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
