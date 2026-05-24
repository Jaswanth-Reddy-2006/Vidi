"use server";

import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function updateProfile(formData: FormData) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) return { success: false, error: "Unauthorized" };

    const name = formData.get("name") as string;
    const phone = formData.get("phone") as string;

    if (!name || name.trim() === "") {
      return { success: false, error: "Name is required" };
    }

    await prisma.user.update({
      where: { id: session.user.id },
      data: { 
        name, 
        phone: phone || null 
      },
    });

    revalidatePath("/profile");
    return { success: true };
  } catch (error) {
    console.error("Profile update error:", error);
    return { success: false, error: "Failed to update profile" };
  }
}

export async function addAddress(formData: FormData) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) return { success: false, error: "Unauthorized" };

    const label = formData.get("label") as string || "Home";
    const fullName = formData.get("fullName") as string;
    const phone = formData.get("phone") as string;
    const addressLine1 = formData.get("addressLine1") as string;
    const addressLine2 = formData.get("addressLine2") as string;
    const city = formData.get("city") as string;
    const state = formData.get("state") as string;
    const pincode = formData.get("pincode") as string;

    if (!fullName || !phone || !addressLine1 || !city || !state || !pincode) {
      return { success: false, error: "Required fields are missing" };
    }

    // Check if this is the first address, if so make it default
    const addressCount = await prisma.address.count({
      where: { userId: session.user.id }
    });

    await prisma.address.create({
      data: {
        userId: session.user.id,
        label,
        fullName,
        phone,
        addressLine1,
        addressLine2: addressLine2 || null,
        city,
        state,
        pincode,
        isDefault: addressCount === 0,
      }
    });

    revalidatePath("/profile");
    return { success: true };
  } catch (error) {
    console.error("Address creation error:", error);
    return { success: false, error: "Failed to add address" };
  }
}

export async function deleteAddress(addressId: string) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) return { success: false, error: "Unauthorized" };

    await prisma.address.delete({
      where: { 
        id: addressId,
        userId: session.user.id 
      }
    });

    revalidatePath("/profile");
    return { success: true };
  } catch (error) {
    return { success: false, error: "Failed to delete address" };
  }
}

export async function setDefaultAddress(addressId: string) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) return { success: false, error: "Unauthorized" };

    // Use transaction to ensure only one default address
    await prisma.$transaction([
      prisma.address.updateMany({
        where: { userId: session.user.id },
        data: { isDefault: false }
      }),
      prisma.address.update({
        where: { id: addressId, userId: session.user.id },
        data: { isDefault: true }
      })
    ]);

    revalidatePath("/profile");
    return { success: true };
  } catch (error) {
    return { success: false, error: "Failed to set default address" };
  }
}
