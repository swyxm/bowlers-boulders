#!/bin/bash

# Stable development script that prevents build cache issues
echo "🚀 Starting stable development environment..."

# Kill any existing Next.js processes
pkill -f "next dev" 2>/dev/null || true

# Clean all caches
echo "🧹 Cleaning caches..."
rm -rf .next
rm -rf node_modules/.cache
rm -rf .turbo
rm -rf .swc

# Clear npm cache
npm cache clean --force 2>/dev/null || true

# Start development server with clean state
echo "✅ Starting development server..."
npm run dev
