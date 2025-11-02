#!/bin/bash

# Clean and Rebuild Android Project for react-native-screens fix

echo "🧹 Cleaning Android build cache..."

# Clean gradle cache
cd android
./gradlew clean

# Remove build directories
rm -rf app/build
rm -rf build
rm -rf .gradle

# Clean node_modules cache (optional but recommended)
cd ..
echo "📦 Cleaning node_modules cache..."
rm -rf node_modules/react-native-screens/android/build

echo "✅ Clean complete!"
echo ""
echo "Next steps:"
echo "1. Run: cd android && ./gradlew build"
echo "2. Or rebuild from Android Studio"
echo "3. Or run: npm run android"

