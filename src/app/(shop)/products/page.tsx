import { getProducts } from "@/features/products/services/product-service";
import { ProductGridClient } from "@/features/products/components/product-grid-client";

export const metadata = {
  title: "Shop Premium Sarees | Vidi",
  description: "Browse our collection of premium handcrafted sarees.",
};

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  
  const page = typeof params.page === "string" ? parseInt(params.page) : 1;
  const category = typeof params.category === "string" ? params.category : undefined;
  const sort = typeof params.sort === "string" ? params.sort : "newest";

  const { products, metadata: pagination } = await getProducts({
    page,
    category,
    sort,
    limit: 12,
  });

  const { prisma } = await import("@/lib/prisma");
  const categoriesList = await prisma.category.findMany({ where: { isActive: true }, orderBy: { sortOrder: "asc" } });

  // Serialize Prisma Decimal objects for Client Components
  const serializedProducts = products.map(product => ({
    ...product,
    basePrice: Number(product.basePrice),
    salePrice: product.salePrice ? Number(product.salePrice) : null,
  }));

  return (
    <div className="container mx-auto px-4 md:px-6 py-8">
      <div className="flex flex-col md:flex-row items-baseline justify-between border-b border-gray-200 dark:border-gray-800 pb-6 mb-8">
        <h1 className="text-3xl font-heading font-bold text-maroon-900 dark:text-maroon-100">
          {category ? `${category.charAt(0).toUpperCase() + category.slice(1)} Sarees` : "All Products"}
        </h1>
        <div className="flex items-center mt-4 md:mt-0 text-sm text-gray-500">
          Showing {pagination.total > 0 ? 1 : 0}-{Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} results
        </div>
      </div>

      {/* 
        Using a key based on search params forces React to unmount and remount this 
        Client Component when filters change, perfectly resetting its internal 'products' state to initialProducts.
      */}
      <ProductGridClient
        key={JSON.stringify(params)}
        initialProducts={serializedProducts}
        pagination={pagination}
        categories={categoriesList}
        currentCategory={category}
        currentSort={sort}
      />
    </div>
  );
}
