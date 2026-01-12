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

// Create default.js that exports PrismaClient
// The key insight: @prisma/client/default.js does: module.exports = { ...require('.prisma/client/default') }
// So we need to export an object that can be spread
// Since @prisma/client/index.js exports from '.prisma/client/default', we can export from index.js instead
// This breaks the circular dependency: index.js -> default -> index.js (no @prisma/client/default.js in the chain)
const defaultJsContent = `// This file is auto-generated. Do not edit manually.
// It provides a CommonJS entry point for @prisma/client/default.js
// We export from @prisma/client/index.js to avoid circular dependency with @prisma/client/default.js

// Export from index.js instead of the main entry point
// This avoids the circular dependency because index.js doesn't require default.js
const prismaIndex = require('@prisma/client/index.js');
module.exports = prismaIndex;
`;

fs.writeFileSync(defaultJsPath, defaultJsContent);
console.log('Created node_modules/.prisma/client/default.js');
