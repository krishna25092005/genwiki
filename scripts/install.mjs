import { execSync } from 'child_process'

console.log('Installing dependencies with pnpm...')

try {
  execSync('pnpm install --frozen-lockfile=false', { stdio: 'inherit' })
  console.log('Dependencies installed successfully!')
} catch (error) {
  console.error('Failed to install dependencies:', error.message)
  process.exit(1)
}
