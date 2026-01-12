// Import PrismaClient directly from generated client to avoid circular dependency
// @ts-ignore - Direct import from generated client
import { PrismaClient } from '../../node_modules/.prisma/client/client';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  } as any);

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
