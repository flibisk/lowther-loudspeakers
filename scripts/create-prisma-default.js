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
// So we need to export the same structure that @prisma/client exports
// We break the circular dependency by temporarily removing ourselves from cache
const defaultJsContent = `// This file is auto-generated. Do not edit manually.
// It provides a CommonJS entry point for @prisma/client/default.js

// Break circular dependency: temporarily remove this file from require cache
const defaultPath = require.resolve('.prisma/client/default');
const cachedDefault = require.cache[defaultPath];
delete require.cache[defaultPath];

try {
  // Now require @prisma/client - it will find us but we're not in cache, so no circular dependency
  const prismaClient = require('@prisma/client');
  module.exports = prismaClient;
} catch (e) {
  // If that fails, try requiring the main @prisma/client entry point
  try {
    const mainClient = require('@prisma/client/index.js');
    module.exports = mainClient;
  } catch (e2) {
    throw new Error('Failed to load Prisma Client: ' + e.message);
  }
} finally {
  // Restore cache
  if (cachedDefault) {
    require.cache[defaultPath] = cachedDefault;
  }
}
`;

fs.writeFileSync(defaultJsPath, defaultJsContent);
console.log('Created node_modules/.prisma/client/default.js');
