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

// Create default.js that exports what @prisma/client expects
// The key insight: @prisma/client/default.js does: module.exports = { ...require('.prisma/client/default') }
// So we need to export an object that can be spread. We'll export @prisma/client's exports
// but break the circular dependency by using a lazy getter pattern
const defaultJsContent = `// This file is auto-generated. Do not edit manually.
// It provides a CommonJS entry point for @prisma/client/default.js
// We break circular dependency by using a getter that loads @prisma/client lazily

// Store the resolved @prisma/client module
let _client = null;

function getClient() {
  if (!_client) {
    // Remove this file from cache to break circular dependency
    const thisPath = require.resolve('.prisma/client/default');
    const cached = require.cache[thisPath];
    delete require.cache[thisPath];
    
    try {
      // Now require @prisma/client - it won't find us in cache, breaking the cycle
      _client = require('@prisma/client');
    } finally {
      // Restore cache
      if (cached) {
        require.cache[thisPath] = cached;
      }
    }
  }
  return _client;
}

// Export a proxy that forwards all property access to @prisma/client
module.exports = new Proxy({}, {
  get(target, prop) {
    return getClient()[prop];
  },
  ownKeys(target) {
    return Reflect.ownKeys(getClient());
  },
  getOwnPropertyDescriptor(target, prop) {
    return Reflect.getOwnPropertyDescriptor(getClient(), prop);
  },
  has(target, prop) {
    return prop in getClient();
  }
});
`;

fs.writeFileSync(defaultJsPath, defaultJsContent);
console.log('Created node_modules/.prisma/client/default.js');
