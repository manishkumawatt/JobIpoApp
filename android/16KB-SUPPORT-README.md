# 16KB Memory Page Size Support for Android 15+

This document explains the implementation of 16KB memory page size support for your React Native Android app, which is required by Google Play Console for apps targeting Android 15+.

## Overview

Google Play requires all apps targeting Android 15+ to support 16KB memory page sizes. This requirement goes into effect on November 1, 2025. Apps that don't support 16KB page sizes will not be able to release updates after this date.

## Key Changes Made

### 1. AndroidManifest.xml

- Set `android:extractNativeLibs="false"` to prevent native libraries from being extracted at runtime
- This ensures native libraries remain uncompressed in the APK/AAB

### 2. build.gradle (app level)

- **Bundle Configuration**: Disabled splits for language, density, and ABI to ensure proper 16KB support
- **Packaging**: Configured `jniLibs.useLegacyPackaging = false` for proper native library handling
- **Android Resources**: Added `noCompress 'so'` to prevent compression of native libraries
- **NDK Configuration**: Explicitly defined ABI filters for all supported architectures
- **MultiDex**: Enabled for proper app functionality with 16KB support

### 3. gradle.properties

- **Uncompressed Native Libraries**: `android.bundle.enableUncompressedNativeLibs=true`
- **R8 Full Mode**: `android.enableR8.fullMode=true` for better optimization
- **Native Build Output**: `android.native.buildOutput=verbose` for debugging

### 4. Build Scripts

- **build-16kb.sh**: Automated build script that ensures all 16KB configurations are applied
- **verify-16kb.sh**: Verification script to check if the AAB has proper 16KB support

## How to Build with 16KB Support

### Option 1: Using the Build Script (Recommended)

```bash
cd android
./build-16kb.sh
```

### Option 2: Manual Build

```bash
cd android
./gradlew clean
./gradlew bundleRelease \
    -Pandroid.bundle.enableUncompressedNativeLibs=true \
    -Pandroid.enableR8.fullMode=true \
    -Pandroid.native.buildOutput=verbose
```

## How to Verify 16KB Support

### Option 1: Using the Verification Script

```bash
cd android
./verify-16kb.sh
```

### Option 2: Manual Verification

1. Extract the AAB file (it's a ZIP file)
2. Check that `lib/` directory contains `.so` files (not compressed)
3. Verify `AndroidManifest.xml` contains `extractNativeLibs="false"`
4. Check that `BundleConfig.pb` exists

### Option 3: Google Play Console

1. Upload the AAB to Google Play Console
2. Go to "App bundle explorer"
3. Verify that native libraries show as uncompressed
4. Check the "App size" section for 16KB compliance

## Testing 16KB Support

### On Physical Devices

- Test on devices with 16KB page size support (Android 15+ devices)
- Verify app functionality and performance
- Check for any crashes or memory-related issues

### Using Android Studio

- Use the "App Bundle Explorer" to inspect the AAB
- Check native library compression status
- Verify bundle configuration

## Troubleshooting

### Common Issues

1. **Build Failures**

   - Ensure all dependencies are up to date
   - Check that NDK version is compatible
   - Verify Gradle and Android Gradle Plugin versions

2. **App Crashes on 16KB Devices**

   - Check native library compatibility
   - Verify that all native code is properly compiled
   - Test on multiple device configurations

3. **Play Console Warnings**
   - Ensure AAB is built with latest configurations
   - Verify that native libraries are uncompressed
   - Check bundle configuration in Play Console

### Debug Commands

```bash
# Check AAB contents
unzip -l app/build/outputs/bundle/release/app-release.aab

# Verify native libraries
unzip -l app/build/outputs/bundle/release/app-release.aab | grep "\.so"

# Check manifest
unzip -p app/build/outputs/bundle/release/app-release.aab manifest/AndroidManifest.xml | grep extractNativeLibs
```

## Important Notes

- **Deadline**: November 1, 2025 - All app updates must support 16KB page sizes
- **Backward Compatibility**: Apps will still work on devices with 4KB page sizes
- **Performance**: 16KB support may slightly increase app size but improves performance on supported devices
- **Testing**: Always test on both 4KB and 16KB devices before releasing

## Resources

- [Google's 16KB Page Size Documentation](https://developer.android.com/guide/app-bundle/optimize-for-modern-devices#16kb-pages)
- [Android 15 Migration Guide](https://developer.android.com/about/versions/15/migration)
- [Play Console Help](https://support.google.com/googleplay/android-developer/answer/9859348)

## Support

If you encounter issues with 16KB support implementation, please:

1. Check the troubleshooting section above
2. Review Google's official documentation
3. Test on multiple device configurations
4. Verify all configurations are properly applied
