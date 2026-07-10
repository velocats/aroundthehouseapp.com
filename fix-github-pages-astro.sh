#!/bin/bash

set -e

echo "🔧 Fixing Astro GitHub Pages setup for aroundthehouseapp.com..."

if [ ! -d ".git" ]; then
  echo "❌ This does not look like a Git repo."
  echo "Make sure you're in:"
  echo "/Users/ecross/Documents/personal/websites/aroundthehouseapp"
  exit 1
fi

if [ ! -f "package.json" ] || [ ! -f "astro.config.mjs" ]; then
  echo "❌ I don't see package.json and astro.config.mjs."
  echo "Make sure you're in the Astro website root:"
  echo "/Users/ecross/Documents/personal/websites/aroundthehouseapp"
  exit 1
fi

echo ""
echo "🧹 Writing .gitignore..."
cat > .gitignore <<'GITIGNORE'
# Dependencies
node_modules/

# Build output
dist/

# Astro
.astro/

# macOS
.DS_Store

# Logs
npm-debug.log*
yarn-debug.log*
yarn-error.log*
pnpm-debug.log*
GITIGNORE

echo ""
echo "🧹 Removing generated folders from Git tracking if already committed..."
git rm -r --cached node_modules .astro dist 2>/dev/null || true

echo ""
echo "🌐 Ensuring public/CNAME exists..."
mkdir -p public
echo "aroundthehouseapp.com" > public/CNAME

echo ""
echo "⚙️ Updating astro.config.mjs..."
cat > astro.config.mjs <<'ASTRO'
import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://aroundthehouseapp.com'
});
ASTRO

echo ""
echo "🚀 Creating GitHub Actions deploy workflow..."
mkdir -p .github/workflows
cat > .github/workflows/deploy.yml <<'WORKFLOW'
name: Deploy Astro site to GitHub Pages

on:
  push:
    branches: [main]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: pages
  cancel-in-progress: false

jobs:
  build:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm

      - name: Install dependencies
        run: npm ci

      - name: Build Astro site
        run: npm run build

      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: ./dist

  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    needs: build
    runs-on: ubuntu-latest

    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
WORKFLOW

echo ""
echo "🧪 Testing local Astro build..."
npm run build

echo ""
echo "📦 Committing changes..."
git add .
git commit -m "Configure Astro GitHub Pages deployment" || echo "ℹ️ Nothing new to commit."

echo ""
echo "🚀 Pushing to GitHub..."
git push

echo ""
echo "✅ Done."
echo ""
echo "Now go to GitHub:"
echo "Repo → Settings → Pages → Build and deployment → Source"
echo ""
echo "Set Source to:"
echo "GitHub Actions"
echo ""
echo "Then go to the Actions tab and wait for:"
echo "Deploy Astro site to GitHub Pages"
echo ""
echo "After it finishes, test:"
echo "https://velocats.github.io/aroundthehouseapp.com/"
echo "https://aroundthehouseapp.com"
