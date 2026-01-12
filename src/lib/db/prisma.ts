// @ts-ignore - TypeScript path alias resolves this
import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
    // For prisma-client-js, we need to specify the database connection
    // The DATABASE_URL environment variable will be used automatically
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
