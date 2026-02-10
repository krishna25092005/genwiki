#!/usr/bin/env node

/**
 * Production build script with error handling
 */

const { execSync } = require('child_process');

console.log('🏗️  Starting production build...\n');

try {
  // Clear cache first
  console.log('1️⃣  Clearing Next.js cache...');
  try {
    execSync('rd /s /q .next', { stdio: 'inherit', shell: 'cmd.exe' });
  } catch (e) {
    // Directory might not exist, ignore
  }

  console.log('✅ Cache cleared\n');

  // Set production environment
  process.env.NODE_ENV = 'production';

  console.log('2️⃣  Building application...');
  execSync('pnpm build', { 
    stdio: 'inherit',
    env: {
      ...process.env,
      NODE_ENV: 'production',
      NEXT_TELEMETRY_DISABLED: '1'
    }
  });

  console.log('\n✅ Build completed successfully!');
  console.log('\n📦 Your application is ready for deployment.');
  console.log('\nTo test locally run: pnpm start');
  
  process.exit(0);
} catch (error) {
  console.error('\n❌ Build failed!');
  console.error('Error:', error.message);
  console.error('\nTroubleshooting tips:');
  console.error('1. Check that all environment variables are set');
  console.error('2. Ensure dependencies are installed: pnpm install');
  console.error('3. Review the error messages above');
  console.error('4. Try clearing cache: rd /s /q .next && pnpm build');
  
  process.exit(1);
}
