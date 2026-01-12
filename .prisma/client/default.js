// This file is auto-generated. Do not edit manually.
// It provides a CommonJS entry point for @prisma/client/default.js
// We use a function to delay the require and avoid circular dependency
const getPrismaClient = () => {
  // Clear the require cache to avoid circular dependency issues
  const cacheKey = require.resolve('@prisma/client');
  delete require.cache[cacheKey];
  return require('@prisma/client');
};

module.exports = getPrismaClient();
