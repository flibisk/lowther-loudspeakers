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
const clientTsPath = path.join(nodeModulesPrismaClientDir, 'client.ts');
if (!fs.existsSync(clientTsPath)) {
  console.error('Prisma client.ts not found. Prisma generate may not have completed.');
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

// Break circular dependency by removing this file from cache BEFORE requiring @prisma/client
// This way, when @prisma/client tries to require '.prisma/client/default', we're not in cache
// So it will create a fresh require, which we can then complete
const cachedThis = require.cache[thisFileId];
delete require.cache[thisFileId];

try {
  // Now require @prisma/client - it won't find us in cache, breaking the cycle
  const prismaClient = require('@prisma/client');
  module.exports = prismaClient;
} catch (e) {
  // If that fails, try to get from cache if available
  const cachedPrisma = require.cache[prismaClientId];
  if (cachedPrisma && cachedPrisma.exports) {
    module.exports = cachedPrisma.exports;
  } else {
    // Last resort: export empty object
    console.error('Failed to load @prisma/client:', e.message);
    module.exports = {};
  }
} finally {
  // Restore cache
  if (cachedThis) {
    require.cache[thisFileId] = cachedThis;
  }
}
`;

fs.writeFileSync(defaultJsPath, defaultJsContent);
console.log('Created node_modules/.prisma/client/default.js');
