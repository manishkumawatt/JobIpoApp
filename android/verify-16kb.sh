#!/bin/bash

# Verification script for 16KB page size support in Android App Bundle
# This script checks if the AAB file has the necessary configurations

AAB_FILE="app/build/outputs/bundle/release/app-release.aab"

echo "🔍 Verifying 16KB page size support in AAB file..."

# Check if AAB file exists
if [ ! -f "$AAB_FILE" ]; then
    echo "❌ AAB file not found at: $AAB_FILE"
    echo "Please build the AAB first using: ./build-16kb.sh"
    exit 1
fi

echo "📁 Found AAB file: $AAB_FILE"

# Extract and check the AAB contents
echo "🔍 Extracting AAB contents for verification..."

# Create temporary directory
TEMP_DIR=$(mktemp -d)
cd "$TEMP_DIR"

# Extract AAB file (it's essentially a ZIP file)
unzip -q "$OLDPWD/$AAB_FILE" -d extracted_aab

echo "📋 Checking AAB structure..."

# Check for native libraries in the correct location
if [ -d "extracted_aab/lib" ]; then
    echo "✅ Native libraries directory found"
    
    # Check if native libs are uncompressed (they should be .so files)
    SO_COUNT=$(find extracted_aab/lib -name "*.so" | wc -l)
    if [ "$SO_COUNT" -gt 0 ]; then
        echo "✅ Found $SO_COUNT native library files (.so)"
        
        # Check specific architectures
        for arch in "arm64-v8a" "armeabi-v7a" "x86" "x86_64"; do
            if [ -d "extracted_aab/lib/$arch" ]; then
                ARCH_COUNT=$(find "extracted_aab/lib/$arch" -name "*.so" | wc -l)
                echo "   📱 $arch: $ARCH_COUNT libraries"
            fi
        done
    else
        echo "⚠️  No .so files found in native libraries directory"
    fi
else
    echo "❌ Native libraries directory not found - this may indicate an issue"
fi

# Check manifest for extractNativeLibs setting
if [ -f "extracted_aab/manifest/AndroidManifest.xml" ]; then
    echo "📄 Checking AndroidManifest.xml..."
    
    if grep -q "extractNativeLibs.*false" extracted_aab/manifest/AndroidManifest.xml; then
        echo "✅ extractNativeLibs=false found in manifest"
    else
        echo "⚠️  extractNativeLibs=false not found in manifest"
    fi
else
    echo "❌ AndroidManifest.xml not found in AAB"
fi

# Check bundle configuration
if [ -f "extracted_aab/BundleConfig.pb" ]; then
    echo "✅ BundleConfig.pb found (indicates proper bundle configuration)"
else
    echo "⚠️  BundleConfig.pb not found"
fi

# Cleanup
cd "$OLDPWD"
rm -rf "$TEMP_DIR"

echo ""
echo "📊 Verification Summary:"
echo "   - AAB file exists: ✅"
echo "   - Native libraries present: $([ "$SO_COUNT" -gt 0 ] && echo "✅" || echo "❌")"
echo "   - extractNativeLibs=false: $(grep -q "extractNativeLibs.*false" "$AAB_FILE" 2>/dev/null && echo "✅" || echo "⚠️")"
echo ""
echo "🎯 Next steps:"
echo "   1. Upload this AAB to Google Play Console"
echo "   2. Check the 'App bundle explorer' in Play Console"
echo "   3. Verify that native libraries show as uncompressed"
echo "   4. Test on a device with 16KB page size support"
