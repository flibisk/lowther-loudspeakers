// Script to create .prisma/client/default.js after Prisma generates the client
// This file is required by @prisma/client/default.js

const fs = require('fs');
const path = require('path');

const prismaClientDir = path.join(__dirname, '..', '.prisma', 'client');
const defaultJsPath = path.join(prismaClientDir, 'default.js');

// Wait a bit for Prisma to finish writing files
setTimeout(() => {
  // Check if the directory exists and has Prisma-generated files
  if (!fs.existsSync(prismaClientDir)) {
    console.log('Prisma client directory does not exist yet. Run prisma generate first.');
    process.exit(0);
  }

  // Check if client.ts exists (indicates Prisma has generated the client)
  const clientTsPath = path.join(prismaClientDir, 'client.ts');
  if (!fs.existsSync(clientTsPath)) {
    console.log('Prisma client.ts not found. Prisma generate may not have completed.');
    process.exit(0);
  }

  // Create default.js that re-exports from @prisma/client
  const defaultJsContent = `// This file is auto-generated. Do not edit manually.
// It provides a CommonJS entry point for @prisma/client/default.js
module.exports = require('@prisma/client');
`;

  fs.writeFileSync(defaultJsPath, defaultJsContent);
  console.log('Created .prisma/client/default.js');
}, 100);
