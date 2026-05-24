"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function createProduct(data: any) {
  try {
    const { images, ...productData } = data;
    
    // Convert string prices to numbers
    const payload = {
      ...productData,
      basePrice: Number(productData.basePrice),
      salePrice: productData.salePrice ? Number(productData.salePrice) : null,
      stockQuantity: Number(productData.stockQuantity),
      images: {
        create: images.map((img: any, i: number) => ({
          url: img.url,
          publicId: `upload_${Date.now()}_${i}`,
          isPrimary: i === 0,
        })),
      },
    };

    const product = await prisma.product.create({
      data: payload,
    });

    revalidatePath("/admin/products");
    revalidatePath("/products");
    return { success: true, product };
  } catch (error: any) {
    console.error("Error creating product:", error);
    return { success: false, error: error.message };
  }
}

export async function updateProduct(id: string, data: any) {
  try {
    const { images, ...productData } = data;
    
    // First, update the base product details
    const payload = {
      ...productData,
      basePrice: Number(productData.basePrice),
      salePrice: productData.salePrice ? Number(productData.salePrice) : null,
      stockQuantity: Number(productData.stockQuantity),
    };

    const product = await prisma.product.update({
      where: { id },
      data: payload,
    });

    // If images were provided, delete old and create new ones
    if (images && images.length > 0) {
      await prisma.productImage.deleteMany({ where: { productId: id } });
      await prisma.productImage.createMany({
        data: images.map((img: any, i: number) => ({
          productId: id,
          url: img.url,
          publicId: `upload_${Date.now()}_${i}`,
          isPrimary: i === 0,
        })),
      });
    }

    revalidatePath("/admin/products");
    revalidatePath("/products");
    revalidatePath(`/products/${product.slug}`);
    return { success: true, product };
  } catch (error: any) {
    console.error("Error updating product:", error);
    return { success: false, error: error.message };
  }
}
