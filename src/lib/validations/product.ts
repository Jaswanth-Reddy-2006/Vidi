import { z } from "zod";

export const createProductSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters").max(255),
  slug: z.string().min(3).max(280),
  description: z.string().min(10, "Description must be at least 10 characters"),
  shortDescription: z.string().max(500).optional(),
  fabric: z.string().max(100).optional(),
  weaveType: z.string().max(100).optional(),
  origin: z.string().max(100).optional(),
  occasion: z.array(z.string()).default([]),
  basePrice: z.coerce.number().positive("Price must be positive"),
  salePrice: z.coerce.number().positive("Sale price must be positive").optional(),
  sku: z.string().min(3).max(50),
  stockQuantity: z.coerce.number().int().nonnegative().default(0),
  lowStockThreshold: z.coerce.number().int().nonnegative().default(5),
  isActive: z.boolean().default(true),
  isFeatured: z.boolean().default(false),
  isNewArrival: z.boolean().default(false),
  weight: z.coerce.number().positive().optional(),
  length: z.coerce.number().positive().optional(),
  careInstructions: z.string().optional(),
  tags: z.array(z.string()).default([]),
  metaTitle: z.string().max(70).optional(),
  metaDescription: z.string().max(160).optional(),
  categoryId: z.string().cuid("Invalid category ID"),
});

export const updateProductSchema = createProductSchema.partial();

export const productFilterSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().default(12),
  category: z.string().optional(),
  minPrice: z.coerce.number().nonnegative().optional(),
  maxPrice: z.coerce.number().nonnegative().optional(),
  fabric: z.string().optional(),
  sort: z.enum(["newest", "price_asc", "price_desc", "popularity", "rating", "sale"]).optional(),
  search: z.string().optional(),
});
