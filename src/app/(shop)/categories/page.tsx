import { prisma } from "@/lib/prisma";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export const metadata = {
  title: "Shop by Category | Vidi",
  description: "Browse our premium saree collections by category.",
};

export default async function CategoriesPage() {
  const categories = await prisma.category.findMany({
    where: { isActive: true },
    orderBy: { sortOrder: "asc" },
  });

  return (
    <div className="container mx-auto px-4 md:px-6 py-12 md:py-16">
      <div className="text-center max-w-3xl mx-auto mb-16">
        <h1 className="text-4xl md:text-5xl font-heading font-bold text-gray-900 dark:text-gray-100 mb-6">
          Explore Our Collections
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400">
          From the rich looms of Kanchipuram to the delicate weaves of Banaras, discover the perfect saree for every occasion.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {categories.map((category) => (
          <Link 
            key={category.id} 
            href={`/categories/${category.slug}`}
            className="group relative h-96 rounded-2xl overflow-hidden block"
          >
            <Image
              src={category.image || "https://images.unsplash.com/photo-1610189014163-54942dcfbba2?q=80&w=800"}
              alt={category.name}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-8">
              <h2 className="text-2xl font-heading font-bold text-white mb-2 transform transition-transform duration-300 group-hover:-translate-y-2">
                {category.name}
              </h2>
              <p className="text-gray-200 line-clamp-2 mb-4 opacity-0 transform translate-y-4 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0">
                {category.description}
              </p>
              <div className="inline-flex items-center text-gold-400 font-medium opacity-0 transform translate-y-4 transition-all duration-300 delay-75 group-hover:opacity-100 group-hover:translate-y-0">
                Shop Collection <ArrowRight className="w-4 h-4 ml-2" />
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
