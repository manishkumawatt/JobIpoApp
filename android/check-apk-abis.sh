#!/bin/bash

# Script to check if APK contains native libraries for all ABIs
# Usage: ./check-apk-abis.sh [path-to-apk]

APK_FILE="${1:-app/build/outputs/apk/debug/app-debug.apk}"

if [ ! -f "$APK_FILE" ]; then
    echo "❌ APK file not found: $APK_FILE"
    echo "Usage: ./check-apk-abis.sh [path-to-apk]"
    exit 1
fi

echo "🔍 Checking APK for native libraries: $APK_FILE"
echo ""

# Create temp directory
TEMP_DIR=$(mktemp -d)
cd "$TEMP_DIR"

# Extract APK
echo "📦 Extracting APK..."
unzip -q "$OLDPWD/$APK_FILE" -d extracted_apk 2>/dev/null

# Check for lib directory
if [ ! -d "extracted_apk/lib" ]; then
    echo "❌ No 'lib' directory found in APK!"
    echo "   This means no native libraries are included."
    exit 1
fi

echo "✅ Found lib directory"
echo ""

# Check each ABI
REQUIRED_ABIS=("armeabi-v7a" "arm64-v8a" "x86" "x86_64")
ALL_PRESENT=true

for abi in "${REQUIRED_ABIS[@]}"; do
    if [ -d "extracted_apk/lib/$abi" ]; then
        SO_COUNT=$(find "extracted_apk/lib/$abi" -name "*.so" | wc -l | tr -d ' ')
        if [ "$SO_COUNT" -gt 0 ]; then
            # Check specifically for libc++_shared.so
            if [ -f "extracted_apk/lib/$abi/libc++_shared.so" ]; then
                echo "✅ $abi: $SO_COUNT libraries found (libc++_shared.so ✓)"
            else
                echo "⚠️  $abi: $SO_COUNT libraries found (libc++_shared.so ✗ MISSING)"
                ALL_PRESENT=false
            fi
        else
            echo "❌ $abi: Directory exists but no .so files found!"
            ALL_PRESENT=false
        fi
    else
        echo "❌ $abi: Directory NOT FOUND"
        ALL_PRESENT=false
    fi
done

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
if [ "$ALL_PRESENT" = true ]; then
    echo "✅ All required ABIs are present in the APK"
else
    echo "❌ Some ABIs are missing! This will cause SoLoader errors."
    echo ""
    echo "To fix:"
    echo "1. Clean build: cd android && ./gradlew clean"
    echo "2. Rebuild: cd android && ./gradlew assembleDebug"
    echo "3. Ensure ndk.abiFilters includes all architectures"
fi

# Cleanup
cd "$OLDPWD"
rm -rf "$TEMP_DIR"

