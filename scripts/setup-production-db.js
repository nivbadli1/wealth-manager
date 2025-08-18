#!/usr/bin/env node

/**
 * Production Database Setup Script
 * Run this after setting up your DATABASE_URL in Vercel
 */

const { execSync } = require('child_process');

console.log('🚀 Setting up production database...');

try {
  // Push the schema to production database
  console.log('📋 Pushing Prisma schema...');
  execSync('npx prisma db push', { stdio: 'inherit' });
  
  // Generate Prisma client
  console.log('🔧 Generating Prisma client...');
  execSync('npx prisma generate', { stdio: 'inherit' });
  
  console.log('✅ Production database setup complete!');
  console.log('');
  console.log('Next steps:');
  console.log('1. Make sure DATABASE_URL is set in Vercel environment variables');
  console.log('2. Redeploy your app or wait for automatic deployment');
  console.log('3. Test your app at https://wealth-manager-beta.vercel.app');
  
} catch (error) {
  console.error('❌ Error setting up database:', error.message);
  console.log('');
  console.log('Make sure:');
  console.log('1. DATABASE_URL environment variable is set');
  console.log('2. Database is accessible and credentials are correct');
  console.log('3. Database allows connections from Vercel IP ranges');
  process.exit(1);
}
