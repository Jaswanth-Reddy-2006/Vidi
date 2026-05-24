import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { ProductCard } from "@/features/products/components/product-card";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const category = await prisma.category.findUnique({
    where: { slug, isActive: true },
  });

  if (!category) return { title: "Category Not Found" };

  return {
    title: `${category.name} | Vidi`,
    description: category.description,
  };
}

export default async function CategoryDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const category = await prisma.category.findUnique({
    where: { slug, isActive: true },
    include: {
      products: {
        where: { isActive: true },
        include: {
          images: {
            where: { isPrimary: true },
            take: 1,
          },
          category: {
            select: { name: true, slug: true }
          }
        },
        orderBy: { createdAt: "desc" }
      }
    }
  });

  if (!category) {
    notFound();
  }

  const serializedProducts = category.products.map(p => ({
    ...p,
    basePrice: Number(p.basePrice),
    salePrice: p.salePrice ? Number(p.salePrice) : null,
  }));

  return (
    <div className="container mx-auto px-4 md:px-6 py-12 md:py-16">
      <div className="text-center max-w-3xl mx-auto mb-16">
        <h1 className="text-4xl md:text-5xl font-heading font-bold text-gray-900 dark:text-gray-100 mb-6">
          {category.name}
        </h1>
        {category.description && (
          <p className="text-lg text-gray-600 dark:text-gray-400">
            {category.description}
          </p>
        )}
      </div>

      {serializedProducts.length === 0 ? (
        <div className="text-center py-24 bg-gray-50 dark:bg-gray-900/50 rounded-2xl border border-dashed border-gray-200 dark:border-gray-800">
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">No products found</h3>
          <p className="text-gray-500 mt-2">We are currently restocking our {category.name}. Check back soon!</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6 lg:gap-8">
          {serializedProducts.map((product) => (
            <ProductCard key={product.id} product={product as any} />
          ))}
        </div>
      )}
    </div>
  );
}
