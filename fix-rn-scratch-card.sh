#!/bin/bash

# RN-Scratch-Card Kotlin Fix Script
# This script automatically fixes the Kotlin compilation error in rn-scratch-card

echo "🔧 Applying RN-Scratch-Card Kotlin Fix..."

# Check if the file exists
FILE_PATH="node_modules/rn-scratch-card/android/src/main/java/com/rnscratchcard/RNScratchCard.kt"

if [ ! -f "$FILE_PATH" ]; then
    echo "❌ Error: $FILE_PATH not found!"
    echo "Make sure you're in the React Native project root and rn-scratch-card is installed."
    exit 1
fi

# Create backup
cp "$FILE_PATH" "$FILE_PATH.backup"
echo "📋 Created backup: $FILE_PATH.backup"

# Apply the fix
sed -i '' 's/resource\.copy(resource\.config, true)/resource.copy(resource.config ?: Bitmap.Config.ARGB_8888, true)/g' "$FILE_PATH"

# Verify the fix was applied
if grep -q "resource.config ?: Bitmap.Config.ARGB_8888" "$FILE_PATH"; then
    echo "✅ Fix applied successfully!"
    echo "🔍 Changed line:"
    grep -n "resource.config ?: Bitmap.Config.ARGB_8888" "$FILE_PATH"
else
    echo "❌ Fix failed to apply. Restoring backup..."
    mv "$FILE_PATH.backup" "$FILE_PATH"
    exit 1
fi

echo ""
echo "🚀 Next steps:"
echo "1. Clean your build: cd android && ./gradlew clean"
echo "2. Rebuild: npx react-native run-android"
echo ""
echo "💡 To revert: mv $FILE_PATH.backup $FILE_PATH"
