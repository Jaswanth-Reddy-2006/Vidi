import { notFound } from "next/navigation";
import Image from "next/image";
import { Star, Truck, Shield, RotateCcw } from "lucide-react";
import { getProductBySlug } from "@/features/products/services/product-service";
import { formatPrice } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { PincodeEstimator } from "@/features/products/components/pincode-estimator";
import { ReviewList } from "@/features/reviews/components/review-list";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const product = await getProductBySlug(resolvedParams.slug);
  
  if (!product) return { title: "Product Not Found" };
  
  return {
    title: `${product.metaTitle || product.name} | Vidi`,
    description: product.metaDescription || product.shortDescription || product.description.substring(0, 160),
  };
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const resolvedParams = await params;
  const product = await getProductBySlug(resolvedParams.slug);

  if (!product) {
    notFound();
  }

  const price = Number(product.basePrice);
  const salePrice = product.salePrice ? Number(product.salePrice) : undefined;
  const discount = salePrice ? Math.round(((price - salePrice) / price) * 100) : 0;
  
  const mainImage = product.images?.[0]?.url || "https://images.unsplash.com/photo-1583391733958-d150247ec6cb?q=80&w=1000&auto=format&fit=crop";

  return (
    <div className="container mx-auto px-4 md:px-6 py-8 md:py-12">
      {/* Breadcrumbs could go here */}
      
      <div className="flex flex-col lg:flex-row gap-12 lg:gap-20">
        {/* Image Gallery */}
        <div className="w-full lg:w-[40%] flex flex-col gap-4">
          <div className="relative aspect-[3/4] bg-gray-100 dark:bg-gray-900 rounded-3xl overflow-hidden">
            <Image
              src={mainImage}
              alt={product.name}
              fill
              className="object-cover"
              priority
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
            {discount > 0 && (
              <div className="absolute top-4 left-4 bg-maroon-700 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg">
                {discount}% OFF
              </div>
            )}
          </div>
          <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
            {product.images.map((img, i) => (
              <div key={img.id} className="relative w-24 h-32 shrink-0 rounded-xl overflow-hidden border-2 cursor-pointer transition-all border-transparent hover:border-gold-500">
                <Image src={img.url} alt={img.alt || `Product image ${i+1}`} fill className="object-cover" />
              </div>
            ))}
          </div>
        </div>

        {/* Product Info */}
        <div className="w-full lg:w-[60%] flex flex-col">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-heading font-bold text-gray-900 dark:text-gray-50 mb-2">
            {product.name}
          </h1>
          
          {/* Reviews Summary */}
          <div className="flex items-center gap-4 mb-6">
            <div className="flex text-gold-500">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star key={s} className="w-5 h-5 fill-current" />
              ))}
            </div>
            <span className="text-sm text-gray-500 underline cursor-pointer">
              {product._count.reviews} Reviews
            </span>
            <span className="text-sm text-maroon-700 font-medium bg-maroon-50 px-2 py-0.5 rounded-full">
              {product.category.name}
            </span>
          </div>

          {/* Pricing */}
          <div className="flex items-end gap-4 mb-8">
            {salePrice ? (
              <>
                <span className="text-4xl font-bold text-maroon-800 dark:text-maroon-300">
                  {formatPrice(salePrice)}
                </span>
                <span className="text-xl text-gray-400 line-through mb-1">
                  {formatPrice(price)}
                </span>
                <span className="text-sm font-medium text-green-600 dark:text-green-400 mb-2">
                  (Inclusive of all taxes)
                </span>
              </>
            ) : (
              <span className="text-4xl font-bold text-gray-900 dark:text-gray-100">
                {formatPrice(price)}
              </span>
            )}
          </div>

          <div className="prose prose-sm dark:prose-invert mb-8 text-gray-600 dark:text-gray-400">
            <p>{product.shortDescription || "No description available for this premium product."}</p>
          </div>

          <div className="space-y-6 mb-10">
            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="flex-1 bg-maroon-800 hover:bg-maroon-900 text-white h-14 text-lg rounded-xl">
                Add to Cart
              </Button>
              <Button size="lg" variant="outline" className="flex-1 border-gold-500 text-gold-600 hover:bg-gold-50 dark:hover:bg-gold-950 h-14 text-lg rounded-xl">
                Buy it Now
              </Button>
            </div>
          </div>

          {/* Delivery Estimator */}
          <PincodeEstimator />

          {/* USP Features */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-8 border-y border-gray-200 dark:border-gray-800 mb-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-maroon-50 dark:bg-maroon-950 flex items-center justify-center text-maroon-700">
                <Truck className="w-5 h-5" />
              </div>
              <span className="text-sm font-medium">Free Express Shipping</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-maroon-50 dark:bg-maroon-950 flex items-center justify-center text-maroon-700">
                <Shield className="w-5 h-5" />
              </div>
              <span className="text-sm font-medium">100% Authentic Fabric</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-maroon-50 dark:bg-maroon-950 flex items-center justify-center text-maroon-700">
                <RotateCcw className="w-5 h-5" />
              </div>
              <span className="text-sm font-medium">Easy 7-Day Returns</span>
            </div>
          </div>

          {/* Details Accordion (Placeholder for Shadcn Accordion) */}
          <div className="space-y-4">
            <h3 className="font-heading text-2xl font-semibold mb-4">Product Details</h3>
            <div className="text-sm text-gray-600 dark:text-gray-400 space-y-4">
              <p>{product.description}</p>
              
              <div className="grid grid-cols-2 gap-y-2 mt-6 p-4 bg-gray-50 dark:bg-gray-900 rounded-xl">
                {product.fabric && (
                  <>
                    <span className="font-medium text-gray-900 dark:text-gray-200">Fabric</span>
                    <span>{product.fabric}</span>
                  </>
                )}
                {product.origin && (
                  <>
                    <span className="font-medium text-gray-900 dark:text-gray-200">Origin</span>
                    <span>{product.origin}</span>
                  </>
                )}
                {product.weaveType && (
                  <>
                    <span className="font-medium text-gray-900 dark:text-gray-200">Weave Type</span>
                    <span>{product.weaveType}</span>
                  </>
                )}
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Reviews Section */}
      <div className="mt-20 border-t border-gray-200 dark:border-gray-800 pt-16">
        <ReviewList productId={product.id} />
      </div>
    </div>
  );
}
