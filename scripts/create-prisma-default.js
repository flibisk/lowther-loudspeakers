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

// Create default.js that exports PrismaClient properly
// The issue: @prisma/client/default.js spreads our exports, so we need to export an object
// We'll export from @prisma/client but handle the circular dependency carefully
const defaultJsContent = `// This file is auto-generated. Do not edit manually.
// It provides a CommonJS entry point for @prisma/client/default.js
// @prisma/client/default.js does: module.exports = { ...require('.prisma/client/default') }

// We need to export what @prisma/client exports
// Break circular dependency by checking if we're already being required
const moduleId = require.resolve('@prisma/client');
const isCircular = require.cache[moduleId] && require.cache[moduleId].exports && 
                   Object.keys(require.cache[moduleId].exports).length > 0;

if (isCircular) {
  // If circular, export from cache (already loaded)
  module.exports = require.cache[moduleId].exports;
} else {
  // Normal case: require @prisma/client
  // Temporarily remove this file from cache
  const thisPath = require.resolve('.prisma/client/default');
  const cached = require.cache[thisPath];
  delete require.cache[thisPath];
  
  try {
    module.exports = require('@prisma/client');
  } finally {
    if (cached) {
      require.cache[thisPath] = cached;
    }
  }
}
`;

fs.writeFileSync(defaultJsPath, defaultJsContent);
console.log('Created node_modules/.prisma/client/default.js');
