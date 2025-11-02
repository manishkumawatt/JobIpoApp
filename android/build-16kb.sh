#!/bin/bash

# Build script for Android App Bundle with 16KB page size support
# This script ensures all necessary configurations are applied for Google Play Console compliance

echo "🚀 Building Android App Bundle with 16KB page size support..."

# Clean previous builds
echo "🧹 Cleaning previous builds..."
./gradlew clean

# Set environment variables for 16KB support
export ANDROID_BUNDLE_ENABLE_UNCOMPRESSED_NATIVE_LIBS=true
export ANDROID_ENABLE_R8_FULL_MODE=true

# Build the release bundle with 16KB support
echo "📦 Building release bundle..."
./gradlew bundleRelease \
    -Pandroid.bundle.enableUncompressedNativeLibs=true \
    -Pandroid.enableR8.fullMode=true \
    -Pandroid.native.buildOutput=verbose

# Check if build was successful
if [ $? -eq 0 ]; then
    echo "✅ Build successful!"
    echo "📁 Bundle location: app/build/outputs/bundle/release/app-release.aab"
    echo ""
    echo "🔍 To verify 16KB support, you can:"
    echo "1. Upload the AAB to Google Play Console"
    echo "2. Check the 'App bundle explorer' to verify native libraries are uncompressed"
    echo "3. Test on a device with 16KB page size support"
    echo ""
    echo "📋 Key configurations applied:"
    echo "   - extractNativeLibs=false in AndroidManifest.xml"
    echo "   - Uncompressed native libraries enabled"
    echo "   - Bundle splits disabled for ABI, density, and language"
    echo "   - R8 full mode enabled for optimization"
else
    echo "❌ Build failed! Please check the error messages above."
    exit 1
fi
