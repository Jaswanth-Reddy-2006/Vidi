import { prisma } from "@/lib/prisma";
import { ProductForm } from "@/features/admin/components/product-form";

export const metadata = {
  title: "Create Product | Admin Dashboard",
};

export default async function NewProductPage() {
  const categories = await prisma.category.findMany({
    orderBy: { sortOrder: "asc" },
  });

  return (
    <div className="pb-12">
      <ProductForm categories={categories} />
    </div>
  );
}
