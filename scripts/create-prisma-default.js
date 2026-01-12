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

// Create default.js that exports what @prisma/client/default.js expects
// @prisma/client/default.js does: module.exports = { ...require('.prisma/client/default') }
// So we need to export an object with PrismaClient and other exports
// We'll require @prisma/client but break the circular dependency by checking if we're already loading
const defaultJsContent = `// This file is auto-generated. Do not edit manually.
// It provides a CommonJS entry point for @prisma/client/default.js

// Check if we're in a circular require situation
const isCircular = require.cache[require.resolve('@prisma/client')] !== undefined;

if (isCircular) {
  // If circular, we need to export what @prisma/client would export
  // But we can't require it, so we'll export an empty object and let webpack handle it
  module.exports = {};
} else {
  // Normal case: require @prisma/client and export it
  // Temporarily remove this file from cache to break circular dependency
  const defaultCacheKey = require.resolve('.prisma/client/default');
  const cachedDefault = require.cache[defaultCacheKey];
  delete require.cache[defaultCacheKey];
  
  try {
    module.exports = require('@prisma/client');
  } finally {
    // Restore cache
    if (cachedDefault) {
      require.cache[defaultCacheKey] = cachedDefault;
    }
  }
}
`;

fs.writeFileSync(defaultJsPath, defaultJsContent);
console.log('Created node_modules/.prisma/client/default.js');
