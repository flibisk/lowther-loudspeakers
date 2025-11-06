#!/usr/bin/env tsx
/**
 * SEO Audit Script for Lowther Loudspeakers
 * 
 * Scans all pages and images to identify missing SEO metadata
 * Run with: npm run seo-audit
 * 
 * Checks:
 * - Pages without proper metadata (title, description)
 * - Images without alt text
 * - Missing JSON-LD structured data
 * - Opportunities for improvement
 */

import fs from 'fs';
import path from 'path';
import { generateAltText, generateMetaFromPath } from '../src/lib/seo';

interface AuditResult {
  type: 'page' | 'image';
  path: string;
  issues: string[];
  suggestions?: string[];
}

const results: AuditResult[] = [];

// ANSI color codes for terminal output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

/**
 * Recursively scan directory for files
 */
function scanDirectory(dir: string, extensions: string[]): string[] {
  const files: string[] = [];
  
  try {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      
      // Skip node_modules, .next, etc.
      if (entry.name.startsWith('.') || entry.name === 'node_modules' || entry.name === '.next') {
        continue;
      }
      
      if (entry.isDirectory()) {
        files.push(...scanDirectory(fullPath, extensions));
      } else if (extensions.some(ext => entry.name.endsWith(ext))) {
        files.push(fullPath);
      }
    }
  } catch (error) {
    console.error(`Error scanning ${dir}:`, error);
  }
  
  return files;
}

/**
 * Audit a Next.js page file
 */
function auditPage(filePath: string) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const issues: string[] = [];
  const suggestions: string[] = [];
  
  // Check for metadata export
  const hasMetadata = content.includes('export const metadata') || content.includes('export async function generateMetadata');
  if (!hasMetadata) {
    issues.push('Missing metadata export');
    
    // Try to generate suggestions
    const relativePath = filePath.replace(process.cwd(), '');
    const urlPath = relativePath
      .replace('/src/app', '')
      .replace('/page.tsx', '')
      .replace('/page.ts', '');
    
    const { title, description } = generateMetaFromPath(urlPath);
    suggestions.push(`Title: "${title}"`);
    suggestions.push(`Description: "${description}"`);
  }
  
  // Check for Open Graph image
  const hasOGImage = content.includes('ogImage') || content.includes('image:');
  if (hasMetadata && !hasOGImage) {
    issues.push('Missing Open Graph image in metadata');
    suggestions.push('Add OG image: Check /public/images/og/ for placeholder');
  }
  
  // Check if OG image file exists
  const ogImageMatch = content.match(/ogImage:\s*["']([^"']+)["']/);
  if (ogImageMatch) {
    const ogImagePath = path.join(process.cwd(), 'public', ogImageMatch[1]);
    if (!fs.existsSync(ogImagePath)) {
      // Check if placeholder exists
      const placeholderPath = ogImagePath.replace(/\.(jpg|png|webp|avif)$/, '.placeholder');
      if (fs.existsSync(placeholderPath)) {
        suggestions.push('Replace OG placeholder with actual image (1200x630px)');
      } else {
        issues.push(`OG image file not found: ${ogImageMatch[1]}`);
      }
    }
  }
  
  // Check for generateSEOMetadata usage
  const usesHelper = content.includes('generateSEOMetadata');
  if (!usesHelper && hasMetadata) {
    suggestions.push('Consider using generateSEOMetadata helper for consistency');
  }
  
  // Check for structured data
  const hasStructuredData = content.includes('generateStructuredData') || content.includes('application/ld+json');
  if (!hasStructuredData) {
    suggestions.push('Consider adding JSON-LD structured data');
  }
  
  // Check for images without alt text
  const imageRegex = /<Image[^>]+src=["']([^"']+)["'][^>]*>/g;
  const altRegex = /alt=["']([^"']*)["']/;
  
  let match;
  while ((match = imageRegex.exec(content)) !== null) {
    const imageTag = match[0];
    const altMatch = imageTag.match(altRegex);
    
    if (!altMatch || !altMatch[1]) {
      const srcMatch = imageTag.match(/src=["']([^"']+)["']/);
      if (srcMatch) {
        issues.push(`Image missing alt text: ${srcMatch[1]}`);
        const suggestedAlt = generateAltText(srcMatch[1]);
        suggestions.push(`Suggested alt: "${suggestedAlt}"`);
      }
    }
  }
  
  if (issues.length > 0 || suggestions.length > 0) {
    results.push({
      type: 'page',
      path: filePath.replace(process.cwd(), ''),
      issues,
      suggestions,
    });
  }
}

/**
 * Audit an image file
 */
function auditImage(filePath: string) {
  // Check if image is referenced in any page
  const imagePath = filePath.replace(process.cwd(), '').replace('/public', '');
  const suggestions: string[] = [];
  
  // Generate suggested alt text
  const suggestedAlt = generateAltText(path.basename(filePath));
  suggestions.push(`Suggested alt text: "${suggestedAlt}"`);
  
  // Don't add to results by default - only if we find it's used without alt
  // This keeps the audit focused on actual issues
}

/**
 * Print audit results
 */
function printResults() {
  console.log(`\n${colors.bright}${colors.cyan}═══════════════════════════════════════════${colors.reset}`);
  console.log(`${colors.bright}${colors.cyan}   Lowther Loudspeakers SEO Audit Report   ${colors.reset}`);
  console.log(`${colors.bright}${colors.cyan}═══════════════════════════════════════════${colors.reset}\n`);
  
  if (results.length === 0) {
    console.log(`${colors.green}✓ No critical SEO issues found!${colors.reset}\n`);
    return;
  }
  
  const pageResults = results.filter(r => r.type === 'page');
  const imageResults = results.filter(r => r.type === 'image');
  
  console.log(`${colors.bright}Summary:${colors.reset}`);
  console.log(`  Pages with issues: ${colors.yellow}${pageResults.length}${colors.reset}`);
  console.log(`  Images with issues: ${colors.yellow}${imageResults.length}${colors.reset}\n`);
  
  // Print page issues
  if (pageResults.length > 0) {
    console.log(`${colors.bright}${colors.blue}📄 Page Issues:${colors.reset}\n`);
    
    for (const result of pageResults) {
      console.log(`${colors.bright}${result.path}${colors.reset}`);
      
      if (result.issues.length > 0) {
        console.log(`  ${colors.red}Issues:${colors.reset}`);
        for (const issue of result.issues) {
          console.log(`    ${colors.red}✗${colors.reset} ${issue}`);
        }
      }
      
      if (result.suggestions && result.suggestions.length > 0) {
        console.log(`  ${colors.cyan}Suggestions:${colors.reset}`);
        for (const suggestion of result.suggestions) {
          console.log(`    ${colors.cyan}→${colors.reset} ${suggestion}`);
        }
      }
      
      console.log('');
    }
  }
  
  // Print image issues
  if (imageResults.length > 0) {
    console.log(`${colors.bright}${colors.blue}🖼️  Image Issues:${colors.reset}\n`);
    
    for (const result of imageResults) {
      console.log(`${colors.bright}${result.path}${colors.reset}`);
      
      if (result.issues.length > 0) {
        console.log(`  ${colors.red}Issues:${colors.reset}`);
        for (const issue of result.issues) {
          console.log(`    ${colors.red}✗${colors.reset} ${issue}`);
        }
      }
      
      if (result.suggestions && result.suggestions.length > 0) {
        console.log(`  ${colors.cyan}Suggestions:${colors.reset}`);
        for (const suggestion of result.suggestions) {
          console.log(`    ${colors.cyan}→${colors.reset} ${suggestion}`);
        }
      }
      
      console.log('');
    }
  }
  
  console.log(`${colors.cyan}═══════════════════════════════════════════${colors.reset}\n`);
  console.log(`${colors.bright}Next Steps:${colors.reset}`);
  console.log(`  1. Add missing metadata using generateSEOMetadata()`);
  console.log(`  2. Add alt text to images using generateAltText()`);
  console.log(`  3. Add JSON-LD structured data where appropriate`);
  console.log(`  4. Re-run this audit with: ${colors.green}npm run seo-audit${colors.reset}\n`);
}

/**
 * Main audit function
 */
async function runAudit() {
  console.log(`${colors.bright}Starting SEO audit...${colors.reset}\n`);
  
  const appDir = path.join(process.cwd(), 'src', 'app');
  const publicDir = path.join(process.cwd(), 'public');
  
  // Scan pages
  console.log(`${colors.cyan}Scanning pages...${colors.reset}`);
  const pages = scanDirectory(appDir, ['.tsx', '.ts']);
  const pageFiles = pages.filter(p => p.endsWith('page.tsx') || p.endsWith('page.ts'));
  
  for (const page of pageFiles) {
    auditPage(page);
  }
  
  console.log(`  Found ${pageFiles.length} pages\n`);
  
  // Scan images
  console.log(`${colors.cyan}Scanning images...${colors.reset}`);
  const images = scanDirectory(publicDir, ['.jpg', '.jpeg', '.png', '.webp', '.avif', '.gif']);
  console.log(`  Found ${images.length} images\n`);
  
  // Print results
  printResults();
}

// Run the audit
runAudit().catch(console.error);





