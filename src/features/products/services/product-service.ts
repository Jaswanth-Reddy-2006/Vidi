import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";

export interface GetProductsParams {
  page?: number;
  limit?: number;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  fabric?: string;
  sort?: string;
  search?: string;
}

export async function getProducts(params: GetProductsParams) {
  const {
    page = 1,
    limit = 12,
    category,
    minPrice,
    maxPrice,
    fabric,
    sort = "newest",
    search,
  } = params;

  const skip = (page - 1) * limit;

  // Build the where clause
  const where: Prisma.ProductWhereInput = {
    isActive: true,
  };

  if (category) {
    where.category = {
      slug: category,
    };
  }

  if (minPrice !== undefined || maxPrice !== undefined) {
    where.basePrice = {};
    if (minPrice !== undefined) where.basePrice.gte = minPrice;
    if (maxPrice !== undefined) where.basePrice.lte = maxPrice;
  }

  if (fabric) {
    where.fabric = fabric;
  }

  if (search) {
    where.OR = [
      { name: { contains: search, mode: "insensitive" } },
      { description: { contains: search, mode: "insensitive" } },
      { tags: { has: search } },
    ];
  }

  // Build the orderBy clause with a deterministic tie-breaker
  let orderBy: Prisma.ProductOrderByWithRelationInput | Prisma.ProductOrderByWithRelationInput[] = [
    { createdAt: "desc" },
    { id: "asc" }
  ];

  switch (sort) {
    case "price-asc":
      orderBy = [{ basePrice: "asc" }, { id: "asc" }];
      break;
    case "price-desc":
      orderBy = [{ basePrice: "desc" }, { id: "asc" }];
      break;
    case "popularity":
      orderBy = [
        { orderItems: { _count: "desc" } },
        { id: "asc" }
      ];
      break;
    case "rating":
      orderBy = [
        { reviews: { _count: "desc" } },
        { id: "asc" }
      ];
      break;
  }

  const [products, total] = await Promise.all([
    prisma.product.findMany({
      where,
      orderBy,
      skip,
      take: limit,
      include: {
        category: true,
        images: {
          where: { isPrimary: true },
          take: 1,
        },
        _count: {
          select: { reviews: true },
        },
      },
    }),
    prisma.product.count({ where }),
  ]);

  return {
    products,
    metadata: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
}

export async function getProductBySlug(slug: string) {
  const product = await prisma.product.findUnique({
    where: { slug, isActive: true },
    include: {
      category: true,
      images: {
        orderBy: { sortOrder: "asc" },
      },
      variants: {
        where: { isActive: true },
      },
      reviews: {
        where: { isApproved: true },
        include: {
          user: {
            select: { name: true, image: true },
          },
        },
        orderBy: { createdAt: "desc" },
        take: 5,
      },
      _count: {
        select: { reviews: { where: { isApproved: true } } },
      },
    },
  });

  return product;
}

export async function getFeaturedProducts(limit = 4) {
  return prisma.product.findMany({
    where: {
      isActive: true,
      isFeatured: true,
    },
    take: limit,
    include: {
      category: true,
      images: {
        where: { isPrimary: true },
        take: 1,
      },
    },
    orderBy: { createdAt: "desc" },
  });
}

export async function getCategories() {
  return prisma.category.findMany({
    where: { isActive: true },
    orderBy: { sortOrder: "asc" },
  });
}
