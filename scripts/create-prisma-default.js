// Script to create .prisma/client/default.js after Prisma generates the client
// This file is required by @prisma/client/default.js

const fs = require('fs');
const path = require('path');

// @prisma/client/default.js looks for .prisma/client/default at project root
const prismaClientDir = path.join(__dirname, '..', '.prisma', 'client');
const defaultJsPath = path.join(prismaClientDir, 'default.js');

// Ensure the directory exists
if (!fs.existsSync(prismaClientDir)) {
  fs.mkdirSync(prismaClientDir, { recursive: true });
}

// Check if the directory exists and has Prisma-generated files
if (!fs.existsSync(prismaClientDir)) {
  console.error('Prisma client directory does not exist yet. Run prisma generate first.');
  process.exit(1);
}

// Check if Prisma has generated the client (in node_modules)
const nodeModulesClientPath = path.join(__dirname, '..', 'node_modules', '.prisma', 'client', 'client.ts');
if (!fs.existsSync(nodeModulesClientPath)) {
  console.error('Prisma client.ts not found in node_modules. Prisma generate may not have completed.');
  process.exit(1);
}

// Create default.js that creates a symlink-like re-export
// This avoids circular dependency by directly requiring the generated client files
const defaultJsContent = `// This file is auto-generated. Do not edit manually.
// It provides a CommonJS entry point for @prisma/client/default.js
// Direct re-export from @prisma/client to avoid circular dependency
try {
  module.exports = require('@prisma/client');
} catch (e) {
  // Fallback: if @prisma/client fails, try requiring the generated client directly
  // This should not happen in normal circumstances
  throw new Error('Failed to load Prisma Client: ' + e.message);
}
`;

fs.writeFileSync(defaultJsPath, defaultJsContent);
console.log('Created .prisma/client/default.js');
