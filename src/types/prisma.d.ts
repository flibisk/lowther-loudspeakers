// Type declaration for Prisma Client
// Helps TypeScript resolve @prisma/client when using custom output path

// Declare the .prisma/client/default module that @prisma/client exports from
declare module '.prisma/client/default' {
  export * from '../../node_modules/.prisma/client/client';
  export * from '../../node_modules/.prisma/client/enums';
  export * from '../../node_modules/.prisma/client/models';
}

// Re-export from @prisma/client
declare module '@prisma/client' {
  export * from '.prisma/client/default';
}
