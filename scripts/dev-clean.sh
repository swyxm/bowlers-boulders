#!/bin/bash

# Clean development environment script
echo "🧹 Cleaning development environment..."

# Remove build artifacts
rm -rf .next
rm -rf node_modules/.cache
rm -rf .turbo

# Clear npm cache
npm cache clean --force

echo "✅ Development environment cleaned!"
echo "🚀 Starting development server..."

# Start dev server
npm run dev
