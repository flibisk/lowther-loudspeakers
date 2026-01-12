// Script to create .prisma/client/default.js after Prisma generates the client
// This file is required by @prisma/client/default.js

const fs = require('fs');
const path = require('path');

// With default output, Prisma generates to node_modules/.prisma/client
// @prisma/client/default.js requires '.prisma/client/default' relative to node_modules/@prisma/client/
// This resolves to node_modules/.prisma/client/default
const nodeModulesPrismaClientDir = path.join(__dirname, '..', 'node_modules', '.prisma', 'client');
const defaultJsPath = path.join(nodeModulesPrismaClientDir, 'default.js');

// Check if Prisma has generated the client
const clientTsPath = path.join(nodeModulesPrismaClientDir, 'index.d.ts');
if (!fs.existsSync(clientTsPath)) {
  console.error('Prisma client not found. Prisma generate may not have completed.');
  process.exit(1);
}

// Create default.js that exports PrismaClient
// CRITICAL INSIGHT: Both @prisma/client/index.js and @prisma/client/default.js require '.prisma/client/default'
// This creates: @prisma/client -> .prisma/client/default -> @prisma/client (circular!)
//
// SOLUTION: Export from @prisma/client but break the cycle by checking cache first
// If @prisma/client is already loaded, use cached exports
// Otherwise, temporarily remove this file from cache, require @prisma/client, restore
const defaultJsContent = `// This file is auto-generated. Do not edit manually.
// It provides a CommonJS entry point for @prisma/client/default.js
// @prisma/client/default.js does: module.exports = { ...require('.prisma/client/default') }

const prismaClientId = require.resolve('@prisma/client');
const thisFileId = require.resolve('.prisma/client/default');

// Strategy: Check if @prisma/client is already loaded in cache
const cachedPrisma = require.cache[prismaClientId];
if (cachedPrisma && cachedPrisma.exports && typeof cachedPrisma.exports.PrismaClient === 'function') {
  // Already loaded and has PrismaClient - use cached version (breaks circular dependency)
  module.exports = cachedPrisma.exports;
} else {
  // Not loaded yet - break circular dependency by removing this file from cache
  const cachedThis = require.cache[thisFileId];
  delete require.cache[thisFileId];
  
  try {
    // Now require @prisma/client - it won't find us in cache, breaking the cycle
    const prismaClient = require('@prisma/client');
    module.exports = prismaClient;
  } catch (e) {
    // Fallback: export empty object (shouldn't happen)
    console.error('Failed to load @prisma/client:', e.message);
    module.exports = {};
  } finally {
    // Restore cache
    if (cachedThis) {
      require.cache[thisFileId] = cachedThis;
    }
  }
}
`;

fs.writeFileSync(defaultJsPath, defaultJsContent);
console.log('Created node_modules/.prisma/client/default.js');
