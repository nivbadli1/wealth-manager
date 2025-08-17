#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🚀 Wealth Management System - Deployment Setup');
console.log('===============================================\n');

// Check if .env exists
const envPath = path.join(process.cwd(), '.env');
const envExamplePath = path.join(process.cwd(), 'env.example');

if (!fs.existsSync(envPath)) {
  console.log('⚠️  No .env file found. Creating from template...');
  
  if (fs.existsSync(envExamplePath)) {
    fs.copyFileSync(envExamplePath, envPath);
    console.log('✅ Created .env file from env.example');
    console.log('📝 Please edit .env file with your actual values\n');
  } else {
    console.log('❌ env.example not found');
  }
} else {
  console.log('✅ .env file exists\n');
}

// Check package.json for required dependencies
const packagePath = path.join(process.cwd(), 'package.json');
if (fs.existsSync(packagePath)) {
  const pkg = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
  
  console.log('📦 Checking dependencies...');
  const requiredDeps = ['@prisma/client', 'pg', 'next'];
  const missingDeps = requiredDeps.filter(dep => !pkg.dependencies[dep]);
  
  if (missingDeps.length === 0) {
    console.log('✅ All required dependencies present\n');
  } else {
    console.log('❌ Missing dependencies:', missingDeps.join(', '));
    console.log('Run: npm install\n');
  }
}

console.log('🎯 Next Steps:');
console.log('1. Update .env file with your database URL');
console.log('2. Run: npm install');
console.log('3. Run: npx prisma generate');
console.log('4. Run: npx prisma db push');
console.log('5. Choose deployment platform (Vercel recommended)');
console.log('6. Follow DEPLOYMENT.md guide\n');

console.log('📚 Read DEPLOYMENT.md for detailed instructions');
console.log('🌐 Your app will be live and accessible worldwide!');
