// Script to create .prisma/client/default.js after Prisma generates the client
// This file is required by @prisma/client/default.js

const fs = require('fs');
const path = require('path');

// @prisma/client/default.js requires '.prisma/client/default' relative to node_modules/@prisma/client/
// This resolves to node_modules/.prisma/client/default
const nodeModulesPrismaClientDir = path.join(__dirname, '..', 'node_modules', '.prisma', 'client');
const defaultJsPath = path.join(nodeModulesPrismaClientDir, 'default.js');

// Check if Prisma has generated the client
const clientTsPath = path.join(nodeModulesPrismaClientDir, 'client.ts');
if (!fs.existsSync(clientTsPath)) {
  console.error('Prisma client.ts not found. Prisma generate may not have completed.');
  process.exit(1);
}

// Create default.js that exports PrismaClient without circular dependency
// Instead of requiring @prisma/client (which creates circular dependency),
// we'll export from the generated client files directly
// Webpack will handle the TypeScript imports during bundling
const defaultJsContent = `// This file is auto-generated. Do not edit manually.
// It provides a CommonJS entry point for @prisma/client/default.js
// We export from the generated client files to avoid circular dependency

// Import from the generated client.ts file
// Webpack will resolve this during bundling and handle the TypeScript
const path = require('path');
const fs = require('fs');

// Try to require the compiled client if available, otherwise let webpack handle it
try {
  // For runtime: require the actual @prisma/client (webpack will have resolved it)
  // We use a lazy require to break circular dependency
  let prismaClient;
  const getPrismaClient = () => {
    if (!prismaClient) {
      // Remove this file from cache temporarily
      const thisPath = require.resolve('.prisma/client/default');
      const cached = require.cache[thisPath];
      delete require.cache[thisPath];
      
      try {
        prismaClient = require('@prisma/client');
      } finally {
        if (cached) {
          require.cache[thisPath] = cached;
        }
      }
    }
    return prismaClient;
  };
  
  // Export a proxy that lazily loads PrismaClient
  module.exports = new Proxy({}, {
    get(target, prop) {
      return getPrismaClient()[prop];
    },
    ownKeys(target) {
      return Reflect.ownKeys(getPrismaClient());
    },
    getOwnPropertyDescriptor(target, prop) {
      return Reflect.getOwnPropertyDescriptor(getPrismaClient(), prop);
    }
  });
} catch (e) {
  // Fallback: direct require (shouldn't happen with webpack)
  module.exports = require('@prisma/client');
}
`;

fs.writeFileSync(defaultJsPath, defaultJsContent);
console.log('Created node_modules/.prisma/client/default.js');
