"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

// Get or create cart for the current user/guest
export async function getCart() {
  const session = await auth.api.getSession({ headers: await headers() });
  
  if (session?.user) {
    // Authenticated User Cart
    let cart = await prisma.cart.findUnique({
      where: { userId: session.user.id },
      include: {
        items: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                slug: true,
                basePrice: true,
                salePrice: true,
                images: { where: { isPrimary: true }, take: 1 },
              },
            },
          },
          orderBy: { createdAt: "asc" }
        },
      },
    });

    if (!cart) {
      cart = await prisma.cart.create({
        data: { userId: session.user.id },
        include: { items: { include: { product: { select: { id: true, name: true, slug: true, basePrice: true, salePrice: true, images: { where: { isPrimary: true }, take: 1 } } } }, orderBy: { createdAt: "asc" } } },
      });
    }
    return cart;
  }
  
  // Guest Cart handling would go here using cookies for guestId
  return null;
}

export async function getCartItemCount() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) return 0;

  const cart = await prisma.cart.findUnique({
    where: { userId: session.user.id },
    include: { items: { select: { quantity: true } } },
  });

  if (!cart) return 0;

  return cart.items.reduce((total, item) => total + item.quantity, 0);
}

export async function addToCart(productId: string, quantity: number = 1, variantId?: string) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) {
    throw new Error("You must be logged in to add to cart. (Guest cart coming soon)");
  }

  const cart = await prisma.cart.upsert({
    where: { userId: session.user.id },
    create: { userId: session.user.id },
    update: {},
  });

  const existingItem = await prisma.cartItem.findFirst({
    where: {
      cartId: cart.id,
      productId,
      variantId: variantId || null,
    },
  });

  if (existingItem) {
    await prisma.cartItem.update({
      where: { id: existingItem.id },
      data: { quantity: existingItem.quantity + quantity },
    });
  } else {
    await prisma.cartItem.create({
      data: {
        cartId: cart.id,
        productId,
        variantId,
        quantity,
      },
    });
  }

  revalidatePath("/cart");
  revalidatePath("/products");
  return { success: true };
}

export async function updateCartItemQuantity(itemId: string, quantity: number) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) throw new Error("Unauthorized");

  // Verify item belongs to user's cart
  const item = await prisma.cartItem.findUnique({
    where: { id: itemId },
    include: { cart: true },
  });

  if (!item || item.cart.userId !== session.user.id) {
    throw new Error("Item not found");
  }

  if (quantity <= 0) {
    await prisma.cartItem.delete({ where: { id: itemId } });
  } else {
    await prisma.cartItem.update({
      where: { id: itemId },
      data: { quantity },
    });
  }

  revalidatePath("/cart");
  return { success: true };
}

export async function removeFromCart(itemId: string) {
  return updateCartItemQuantity(itemId, 0);
}
