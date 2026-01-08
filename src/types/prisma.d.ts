// Type declaration for Prisma Client
// This helps TypeScript resolve @prisma/client when using custom output path
declare module '@prisma/client' {
  import type { PrismaClient as _PrismaClient } from '../../node_modules/.prisma/client/client';
  
  export const PrismaClient: {
    new (options?: any): _PrismaClient;
  };
  
  export type PrismaClient = _PrismaClient;
  
  export * from '../../node_modules/.prisma/client/enums';
  export * from '../../node_modules/.prisma/client/models';
}
