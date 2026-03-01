/**
 * Seed Super Admin - Creates one SUPER_ADMIN credential in the database
 * Run: pnpm run seed:super-admin
 */
import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';
import * as dotenv from 'dotenv';

dotenv.config();

const SALT_ROUNDS = 10;

const SUPER_ADMIN = {
  email: 'superadmin@platform.com',
  password: 'SuperAdmin@123!',
  name: 'Super Admin',
};

async function main() {
  const prisma = new PrismaClient();

  try {
    const hashedPassword = await bcrypt.hash(SUPER_ADMIN.password, SALT_ROUNDS);

    const admin = await prisma.superAdmin.upsert({
      where: { email: SUPER_ADMIN.email },
      create: {
        email: SUPER_ADMIN.email,
        password: hashedPassword,
        name: SUPER_ADMIN.name,
      },
      update: {
        password: hashedPassword,
        name: SUPER_ADMIN.name,
      },
    });

    console.log('✅ Super Admin created successfully');
    console.log('   Email:', admin.email);
    console.log('   Name:', admin.name);
    console.log('   ID:', admin.id);
    console.log('\n⚠️  Default password:', SUPER_ADMIN.password);
    console.log('   Change this password after first login.\n');
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((e) => {
  console.error('❌ Error:', e.message);
  process.exit(1);
});
