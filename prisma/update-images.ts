import { prisma } from '../src/lib/prisma';

const REAL_SAREE_IMAGES = [
  "https://images.unsplash.com/photo-1610189013580-0810db303106?q=80&w=800",
  "https://images.unsplash.com/photo-1583391733958-d150247ec6cb?q=80&w=800",
  "https://images.unsplash.com/photo-1610030469983-98e550d615ef?q=80&w=800",
  "https://images.unsplash.com/photo-1596455607563-ad6193f76b17?q=80&w=800",
  "https://images.unsplash.com/photo-1617317376997-8748e6862c01?q=80&w=800",
  "https://images.unsplash.com/photo-1595777457583-95e059d581b8?q=80&w=800",
  "https://images.unsplash.com/photo-1615247001958-f4bc92fa6a4a?q=80&w=800",
  "https://images.unsplash.com/photo-1595777457583-95e059d581b8?q=80&w=800",
  "https://images.unsplash.com/photo-1610030469446-4f323e1eebbb?q=80&w=800",
  "https://images.unsplash.com/photo-1583391733975-38b4d8ec9d6a?q=80&w=800",
  "https://images.unsplash.com/photo-1623910385966-70e060ebc25d?q=80&w=800",
  "https://images.unsplash.com/photo-1596455607563-ad6193f76b17?q=80&w=800",
];

async function main() {
  console.log('Updating all product images...');
  const products = await prisma.product.findMany();
  
  for (const product of products) {
    // Delete existing images
    await prisma.productImage.deleteMany({
      where: { productId: product.id }
    });

    // Pick a random real image
    const randomImg = REAL_SAREE_IMAGES[Math.floor(Math.random() * REAL_SAREE_IMAGES.length)];

    await prisma.productImage.create({
      data: {
        productId: product.id,
        url: randomImg,
        publicId: `real_${product.id}_${Math.floor(Math.random() * 1000)}`,
        isPrimary: true
      }
    });
  }
  console.log(`Updated images for ${products.length} products!`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
