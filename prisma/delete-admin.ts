import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  await prisma.user.deleteMany({
    where: { email: 'admin@vidi.store' }
  });
  console.log("Deleted old admin user. Ready to recreate!");
}

main().catch(console.error).finally(() => prisma.$disconnect());
