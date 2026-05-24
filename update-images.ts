import { prisma } from './src/lib/prisma';

const localImages = [
  "/products/product-1.png",
  "/products/product-2.png",
  "/products/product-3.png",
  "/products/product-4.png",
];

async function main() {
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
  console.log(`Successfully updated ${updatedCount} product images to local paths!`);
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
