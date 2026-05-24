"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";

export async function createReview(data: {
  productId: string;
  rating: number;
  title?: string;
  comment: string;
}) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    
    if (!session?.user) {
      return { success: false, error: "You must be logged in to leave a review." };
    }

    // Check if the user actually purchased the product to set isVerified
    const hasPurchased = await prisma.order.findFirst({
      where: {
        userId: session.user.id,
        status: "DELIVERED",
        items: {
          some: { productId: data.productId }
        }
      }
    });

    const review = await prisma.review.create({
      data: {
        userId: session.user.id,
        productId: data.productId,
        rating: data.rating,
        title: data.title || "",
        comment: data.comment,
        isVerified: !!hasPurchased,
        isApproved: true, // Auto-approve for now
      }
    });

    revalidatePath(`/products/[slug]`, "page");
    return { success: true, review };
  } catch (error: any) {
    if (error.code === 'P2002') {
      return { success: false, error: "You have already reviewed this product." };
    }
    console.error("Error creating review:", error);
    return { success: false, error: error.message || "Failed to submit review." };
  }
}
