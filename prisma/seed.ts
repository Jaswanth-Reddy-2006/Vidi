import 'dotenv/config';
import { hash } from 'bcrypt';
import { prisma } from '../src/lib/prisma';

async function main() {
  console.log('Start seeding...');

  // 1. Create Admin User
  // Assuming Better Auth uses a specific password hashing, but for a seed we might have to use whatever Better Auth expects.
  // Better Auth handles password hashing internally during signUp, but for raw seed, we'd need to match its expectations.
  // We'll create the user via Prisma directly. Note: You may need to reset password via UI if hash doesn't match Better Auth's default.
  const adminEmail = 'admin@vidi.store';
  const existingAdmin = await prisma.user.findUnique({ where: { email: adminEmail } });

  if (!existingAdmin) {
    const hashedPassword = await hash('Admin@123', 10);
    const adminUser = await prisma.user.create({
      data: {
        name: 'Vidi Admin',
        email: adminEmail,
        role: 'ADMIN',
        emailVerified: true,
        accounts: {
          create: {
            accountId: 'admin-local-1',
            providerId: 'credential',
            password: hashedPassword,
          }
        }
      },
    });
    console.log(`Created admin user: ${adminUser.email}`);
  }

  // 2. Create Categories
  const categories = [
    { name: 'Silk Sarees', slug: 'silk-sarees', description: 'Pure silk sarees from across India.' },
    { name: 'Cotton Sarees', slug: 'cotton-sarees', description: 'Comfortable and elegant cotton sarees.' },
    { name: 'Banarasi Sarees', slug: 'banarasi-sarees', description: 'Rich Banarasi weaves for special occasions.' },
    { name: 'Chiffon Sarees', slug: 'chiffon-sarees', description: 'Lightweight and flowy chiffon sarees.' },
    { name: 'Georgette Sarees', slug: 'georgette-sarees', description: 'Graceful georgette sarees with beautiful drapes.' },
    { name: 'Linen Sarees', slug: 'linen-sarees', description: 'Breathable and stylish linen sarees.' },
    { name: 'Designer Sarees', slug: 'designer-sarees', description: 'Exclusive designer sarees for modern women.' },
    { name: 'Wedding Collection', slug: 'wedding-collection', description: 'Bridal and trousseau collection.' },
  ];

  for (const cat of categories) {
    await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {},
      create: cat,
    });
  }
  console.log('Created categories');

  // 3. Create Coupons
  await prisma.coupon.upsert({
    where: { code: 'WELCOME10' },
    update: {},
    create: {
      code: 'WELCOME10',
      description: '10% off on your first order',
      discountType: 'percentage',
      discountValue: 10,
      minOrderValue: 999,
      maxDiscount: 500,
      validFrom: new Date(),
      validUntil: new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
    },
  });

  await prisma.coupon.upsert({
    where: { code: 'FIRST50' },
    update: {},
    create: {
      code: 'FIRST50',
      description: 'Flat ₹50 off on all orders',
      discountType: 'fixed',
      discountValue: 50,
      minOrderValue: 499,
      validFrom: new Date(),
      validUntil: new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
    },
  });
  console.log('Created coupons');

  // 4. Create Banners
  const banners = [
    {
      title: 'The Wedding Collection',
      subtitle: 'Exquisite bridal sarees for your special day.',
      image: 'https://images.unsplash.com/photo-1583391733958-69273c563630?q=80&w=1920&auto=format&fit=crop',
      link: '/categories/wedding-collection',
      sortOrder: 1,
    },
    {
      title: 'Everyday Elegance',
      subtitle: 'Comfortable cotton and linen sarees for daily wear.',
      image: 'https://images.unsplash.com/photo-1610189014163-54942dcfbba2?q=80&w=1920&auto=format&fit=crop',
      link: '/categories/cotton-sarees',
      sortOrder: 2,
    },
  ];

  for (const banner of banners) {
    const existingBanner = await prisma.banner.findFirst({ where: { title: banner.title } });
    if (!existingBanner) {
      await prisma.banner.create({ data: banner });
    }
  }
  console.log('Created banners');

  // 5. Create Products dynamically for each category
  const allCategories = await prisma.category.findMany();
  
  const sareeImages = [
    'https://images.unsplash.com/photo-1583391733958-69273c563630?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1610189014163-54942dcfbba2?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1595777457583-95e059d581b8?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1583391265517-35bbdad01209?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1615886745199-1a48c6f376f9?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1617261537841-860e65381a17?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1590736704728-f4730bb30770?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1585465922091-a12da9f9392e?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1610189012465-3c1bb0c3639e?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1584483789396-8eb591a27e99?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1550614000-4b95dd247719?q=80&w=800&auto=format&fit=crop',
  ];

  if (allCategories.length > 0) {
    let skuCounter = 1;
    
    for (const category of allCategories) {
      // Generate 10 dummy products for this category
      for (let i = 1; i <= 10; i++) {
        const basePrice = Math.floor(Math.random() * 20000) + 1500; // Between 1500 and 21500
        const isSale = Math.random() > 0.5;
        const salePrice = isSale ? Math.floor(basePrice * 0.8) : null; // 20% discount if on sale
        const stockQuantity = Math.floor(Math.random() * 50) + 5;
        
        const productName = `${category.name.replace(' Sarees', '')} Elegance Saree ${i}`;
        const slug = `${category.slug}-elegance-saree-${i}`;
        const imageUrl = sareeImages[skuCounter % sareeImages.length];
        
        const dummyProduct = {
          name: productName,
          slug: slug,
          description: `A stunning ${category.name.toLowerCase()} perfect for all your special moments. Handcrafted with precision and love.`,
          shortDescription: `Premium ${category.name.toLowerCase()} with intricate detailing.`,
          basePrice: basePrice,
          salePrice: salePrice,
          sku: `VIDI-${category.slug.substring(0, 4).toUpperCase()}-${skuCounter.toString().padStart(4, '0')}`,
          stockQuantity: stockQuantity,
          categoryId: category.id,
          fabric: category.name.replace(' Sarees', ''),
          isFeatured: Math.random() > 0.8,
          isNewArrival: Math.random() > 0.7,
          images: {
            create: [{ 
              url: imageUrl, 
              publicId: `dummy_${skuCounter}`, 
              isPrimary: true 
            }]
          }
        };

        await prisma.product.upsert({
          where: { slug: slug },
          update: {},
          create: dummyProduct,
        });
        
        skuCounter++;
      }
    }
    console.log(`Created 10 dummy products for ${allCategories.length} categories`);
  }

  console.log('Seeding completed!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
