#!/bin/bash

echo "🚀 Installing Pomodoro Pro - Next-Gen Productivity Timer"
echo "=================================================="

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Node.js version 18+ is required. Current version: $(node -v)"
    exit 1
fi

echo "✅ Node.js $(node -v) detected"

# Install dependencies
echo "📦 Installing dependencies..."
npm install

if [ $? -ne 0 ]; then
    echo "❌ Failed to install dependencies"
    exit 1
fi

echo "✅ Dependencies installed successfully"

# Create placeholder icon files
echo "🎨 Creating placeholder assets..."
mkdir -p public/icons public/sounds

# Create simple placeholder icons (you can replace these with actual icons later)
echo "Creating placeholder icons..."
for size in 72 96 128 144 152 192 384 512; do
    echo "Creating icon-${size}x${size}.png"
    # This creates a simple colored square as placeholder
    convert -size ${size}x${size} xc:"#8B5CF6" public/icons/icon-${size}x${size}.png 2>/dev/null || echo "⚠️  ImageMagick not found, skipping icon generation"
done

# Create placeholder sound files
echo "Creating placeholder sound files..."
touch public/sounds/notification.mp3 public/sounds/complete.mp3

echo "✅ Assets created"

# Build the application
echo "🔨 Building the application..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Build failed"
    exit 1
fi

echo "✅ Build completed successfully"

echo ""
echo "🎉 Installation complete!"
echo ""
echo "To start the development server:"
echo "  npm run dev"
echo ""
echo "To preview the production build:"
echo "  npm run preview"
echo ""
echo "Features included:"
echo "  ✨ PWA support with install prompts"
echo "  🎨 Modern UI with theme switching"
echo "  📱 Mobile-optimized design"
echo "  📊 Advanced analytics"
echo "  ✅ Task management"
echo "  🔔 Smart notifications"
echo "  💾 Offline support"
echo ""
echo "Visit http://localhost:3000 to see your app!"
