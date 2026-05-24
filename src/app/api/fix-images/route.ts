import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

const localImages = [
  "/products/product-1.png",
  "/products/product-2.png",
  "/products/product-3.png",
  "/products/product-4.png",
];

export async function GET() {
  try {
    const images = await prisma.productImage.findMany();
    let updatedCount = 0;
    for (const img of images) {
      const randomImage = localImages[Math.floor(Math.random() * localImages.length)];
      await prisma.productImage.update({
        where: { id: img.id },
        data: { url: randomImage }
      });
      updatedCount++;
    }
    return NextResponse.json({ success: true, updatedCount });
  } catch (e: any) {
    return NextResponse.json({ success: false, error: e.message });
  }
}
