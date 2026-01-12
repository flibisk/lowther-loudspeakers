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

// Create default.js that exports PrismaClient directly
// Instead of requiring @prisma/client (which creates circular dependency),
// we'll create a simple re-export that webpack can resolve statically
// The key: @prisma/client will be resolved by webpack's module resolution, not Node's
const defaultJsContent = `// This file is auto-generated. Do not edit manually.
// It provides a CommonJS entry point for @prisma/client/default.js
// We export from @prisma/client but webpack will handle the resolution

// Use a function to defer the require until webpack processes it
// This allows webpack to resolve @prisma/client properly without circular dependency
(function() {
  try {
    // Webpack will replace this require with the actual module during bundling
    const prisma = require('@prisma/client');
    // Copy all exports to module.exports
    for (const key in prisma) {
      if (prisma.hasOwnProperty(key)) {
        module.exports[key] = prisma[key];
      }
    }
    // Also copy non-enumerable properties like PrismaClient
    Object.getOwnPropertyNames(prisma).forEach(key => {
      if (!module.exports.hasOwnProperty(key)) {
        Object.defineProperty(module.exports, key, Object.getOwnPropertyDescriptor(prisma, key));
      }
    });
  } catch (e) {
    // Fallback: if require fails, export empty object (shouldn't happen in webpack)
    console.error('Failed to load @prisma/client:', e.message);
    module.exports = {};
  }
})();
`;

fs.writeFileSync(defaultJsPath, defaultJsContent);
console.log('Created node_modules/.prisma/client/default.js');
