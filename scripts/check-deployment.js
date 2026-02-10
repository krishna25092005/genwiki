#!/usr/bin/env node

/**
 * Pre-deployment check script
 * Validates environment and configuration before deployment
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 Running pre-deployment checks...\n');

let hasErrors = false;
let hasWarnings = false;

// Check 1: Environment variables
console.log('1️⃣  Checking environment variables...');
const requiredEnvVars = [
  'GEMINI_API_KEY',
  'MONGODB_URI',
  'JWT_SECRET',
  'NEXT_PUBLIC_API_URL'
];

const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);

if (missingVars.length > 0) {
  console.log('   ❌ Missing required environment variables:');
  missingVars.forEach(varName => console.log(`      - ${varName}`));
  hasErrors = true;
} else {
  console.log('   ✅ All required environment variables are set');
}

// Check 2: Package.json
console.log('\n2️⃣  Checking package.json...');
try {
  const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  
  if (!packageJson.scripts.build) {
    console.log('   ❌ Missing build script');
    hasErrors = true;
  } else {
    console.log('   ✅ Build script exists');
  }
  
  if (!packageJson.scripts.start) {
    console.log('   ❌ Missing start script');
    hasErrors = true;
  } else {
    console.log('   ✅ Start script exists');
  }
} catch (error) {
  console.log('   ❌ Error reading package.json:', error.message);
  hasErrors = true;
}

// Check 3: Backend configuration
console.log('\n3️⃣  Checking backend configuration...');
const backendPath = path.join(process.cwd(), 'backend');
if (fs.existsSync(backendPath)) {
  const requirementsPath = path.join(backendPath, 'requirements.txt');
  const mainPath = path.join(backendPath, 'main.py');
  
  if (!fs.existsSync(requirementsPath)) {
    console.log('   ⚠️  Missing requirements.txt in backend');
    hasWarnings = true;
  } else {
    console.log('   ✅ requirements.txt found');
  }
  
  if (!fs.existsSync(mainPath)) {
    console.log('   ❌ Missing main.py in backend');
    hasErrors = true;
  } else {
    console.log('   ✅ main.py found');
  }
} else {
  console.log('   ⚠️  Backend directory not found');
  hasWarnings = true;
}

// Check 4: Next.js configuration
console.log('\n4️⃣  Checking Next.js configuration...');
const nextConfigPath = path.join(process.cwd(), 'next.config.mjs');
if (fs.existsSync(nextConfigPath)) {
  console.log('   ✅ next.config.mjs found');
} else {
  console.log('   ⚠️  next.config.mjs not found');
  hasWarnings = true;
}

// Check 5: Deployment configs
console.log('\n5️⃣  Checking deployment configurations...');
const configs = [
  { file: 'vercel.json', name: 'Vercel' },
  { file: 'docker-compose.yml', name: 'Docker' },
  { file: 'backend/Dockerfile', name: 'Backend Docker' }
];

configs.forEach(({ file, name }) => {
  if (fs.existsSync(path.join(process.cwd(), file))) {
    console.log(`   ✅ ${name} config found`);
  } else {
    console.log(`   ⚠️  ${name} config not found (optional)`);
  }
});

// Check 6: Git ignore
console.log('\n6️⃣  Checking .gitignore...');
const gitignorePath = path.join(process.cwd(), '.gitignore');
if (fs.existsSync(gitignorePath)) {
  const gitignore = fs.readFileSync(gitignorePath, 'utf8');
  const requiredEntries = ['.env', 'node_modules', '.next'];
  const missingEntries = requiredEntries.filter(entry => !gitignore.includes(entry));
  
  if (missingEntries.length > 0) {
    console.log('   ⚠️  .gitignore missing important entries:');
    missingEntries.forEach(entry => console.log(`      - ${entry}`));
    hasWarnings = true;
  } else {
    console.log('   ✅ .gitignore properly configured');
  }
} else {
  console.log('   ⚠️  .gitignore not found');
  hasWarnings = true;
}

// Results
console.log('\n' + '='.repeat(50));
if (hasErrors) {
  console.log('❌ Deployment check FAILED');
  console.log('Please fix the errors above before deploying.');
  process.exit(1);
} else if (hasWarnings) {
  console.log('⚠️  Deployment check passed WITH WARNINGS');
  console.log('Consider addressing the warnings above.');
  process.exit(0);
} else {
  console.log('✅ All deployment checks PASSED');
  console.log('Your project is ready to deploy! 🚀');
  process.exit(0);
}
