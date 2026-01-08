declare module '.prisma/client/default' {
  export * from '../../node_modules/.prisma/client/client';
  export * from '../../node_modules/.prisma/client/enums';
  export * from '../../node_modules/.prisma/client/models';
}

declare module '@prisma/client' {
  export * from '.prisma/client/default';
}
