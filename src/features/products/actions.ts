"use server";

import { getProducts, GetProductsParams } from "./services/product-service";

export async function fetchProductsAction(params: GetProductsParams) {
  const result = await getProducts(params);
  
  // Ensure Prisma Decimal objects are serialized into primitives for Client Components
  const serializedProducts = result.products.map(product => ({
    ...product,
    basePrice: Number(product.basePrice),
    salePrice: product.salePrice ? Number(product.salePrice) : null,
  }));

  return {
    ...result,
    products: serializedProducts,
  };
}
