#!/bin/bash
set -e

echo "Installing dependencies with pnpm..."
pnpm install --frozen-lockfile=false

echo "Dependencies installed successfully!"
