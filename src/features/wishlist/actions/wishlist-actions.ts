"use server";

import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function toggleWishlist(productId: string) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) {
      return { success: false, error: "Unauthorized" };
    }

    const userId = session.user.id;

    // Get or create wishlist
    let wishlist = await prisma.wishlist.findUnique({
      where: { userId },
    });

    if (!wishlist) {
      wishlist = await prisma.wishlist.create({
        data: { userId },
      });
    }

    const existingItem = await prisma.wishlistItem.findUnique({
      where: {
        wishlistId_productId: {
          wishlistId: wishlist.id,
          productId,
        },
      },
    });

    if (existingItem) {
      // Remove from wishlist
      await prisma.wishlistItem.delete({
        where: { id: existingItem.id },
      });
      revalidatePath("/wishlist");
      return { success: true, added: false };
    } else {
      // Add to wishlist
      await prisma.wishlistItem.create({
        data: {
          wishlistId: wishlist.id,
          productId,
        },
      });
      revalidatePath("/wishlist");
      return { success: true, added: true };
    }
  } catch (error) {
    console.error("Error toggling wishlist:", error);
    return { success: false, error: "Failed to update wishlist" };
  }
}

export async function getWishlist() {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) {
      return null;
    }

    const wishlist = await prisma.wishlist.findUnique({
      where: { userId: session.user.id },
      include: {
        items: {
          include: {
            product: {
              include: {
                images: {
                  where: { isPrimary: true },
                  take: 1,
                },
              },
            },
          },
          orderBy: { createdAt: "desc" },
        },
      },
    });

    return wishlist;
  } catch (error) {
    console.error("Error fetching wishlist:", error);
    return null;
  }
}
