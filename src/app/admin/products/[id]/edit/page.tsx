import { prisma } from "@/lib/prisma";
import { ProductForm } from "@/features/admin/components/product-form";
import { notFound } from "next/navigation";

export const metadata = {
  title: "Edit Product | Admin Dashboard",
};

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  const [product, categories] = await Promise.all([
    prisma.product.findUnique({
      where: { id },
      include: { images: true },
    }),
    prisma.category.findMany({
      orderBy: { sortOrder: "asc" },
    })
  ]);

  if (!product) {
    notFound();
  }

  // Format data for form
  const formattedProduct = {
    ...product,
    basePrice: Number(product.basePrice),
    salePrice: product.salePrice ? Number(product.salePrice) : "",
    images: product.images.length > 0 ? product.images : [{ url: "" }]
  };

  return (
    <div className="pb-12">
      <ProductForm initialData={formattedProduct} categories={categories} />
    </div>
  );
}
