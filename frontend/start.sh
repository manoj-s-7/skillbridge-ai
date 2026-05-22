#!/bin/bash
# SkillBridge AI — Start Frontend
set -e

cd "$(dirname "$0")"

echo "🚀 Starting SkillBridge AI Frontend..."

# Check node
if ! command -v node &> /dev/null; then
    echo "❌ Node.js not found. Please install Node.js 18+"
    exit 1
fi

# Install deps if needed
if [ ! -d "node_modules" ]; then
    echo "📦 Installing npm packages..."
    npm install
fi

echo ""
echo "✅ Starting frontend on http://localhost:3000"
echo ""
npm run dev
