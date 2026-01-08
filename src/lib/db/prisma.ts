// Import directly from generated Prisma Client location
// This works around TypeScript module resolution issues with custom output path
import { PrismaClient } from '../../../node_modules/.prisma/client/client';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  }).$extends({
    // Add any Prisma extensions here if needed
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
