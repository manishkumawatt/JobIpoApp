# SoLoader DSONotFoundError Fix

## Issue

The application crashes with `com.facebook.soloader.SoLoaderDSONotFoundError` when trying to load `libc++_shared.so` for x86_64 architecture. This occurs because:

1. The APK is missing native libraries for x86_64 architecture
2. The app is running on an x86_64 device/emulator
3. With `extractNativeLibs=false`, all ABIs must be in the APK

## Root Cause

- Device/Emulator is x86_64
- APK only contains arm64-v8a libraries (or missing x86_64)
- SoLoader cannot find `libc++_shared.so` for x86_64

## Fixes Applied

### 1. Enhanced Packaging Configuration (`build.gradle`)

- Added explicit `pickFirsts` for `libc++_shared.so` across all ABIs
- Set `excludes = []` in `jniLibs` to ensure no architectures are excluded
- Added comments explaining the critical nature of including all ABIs

### 2. Verified ABI Filters

- Confirmed `ndk.abiFilters` includes all 4 architectures:
  - `armeabi-v7a`
  - `arm64-v8a`
  - `x86`
  - `x86_64`

### 3. Split Configuration

- Disabled ABI splits to include all architectures in single APK
- Required for `extractNativeLibs=false`

### 4. Created Verification Script

- `check-apk-abis.sh` - Verifies APK contains native libraries for all ABIs

## Next Steps - CRITICAL

### Step 1: Clean Build (REQUIRED)

```bash
cd android
./gradlew clean
rm -rf app/build build .gradle
cd ..
```

### Step 2: Rebuild

```bash
npm run android
# OR
cd android && ./gradlew assembleDebug
```

### Step 3: Verify APK Contents

After building, verify all ABIs are included:

```bash
cd android
./check-apk-abis.sh app/build/outputs/apk/debug/app-debug.apk
```

Expected output:

```
✅ armeabi-v7a: X libraries found (libc++_shared.so ✓)
✅ arm64-v8a: X libraries found (libc++_shared.so ✓)
✅ x86: X libraries found (libc++_shared.so ✓)
✅ x86_64: X libraries found (libc++_shared.so ✓)
✅ All required ABIs are present in the APK
```

### Step 4: Manual APK Inspection (Optional)

If you want to manually verify:

```bash
# Rename APK to ZIP
cp app/build/outputs/apk/debug/app-debug.apk app-debug.zip

# Extract
unzip -q app-debug.zip -d apk_contents

# Check for x86_64 libraries
ls -la apk_contents/lib/x86_64/ | grep libc++_shared.so
```

## Important Notes

1. **Clean Build is MANDATORY**: Stale build artifacts may prevent all ABIs from being included
2. **extractNativeLibs=false**: All ABIs must be in the APK - no splits allowed
3. **Emulator Architecture**: Ensure your emulator matches one of the supported ABIs
4. **APK Size**: Including all 4 ABIs will increase APK size significantly

## Troubleshooting

### If x86_64 is still missing after rebuild:

1. Check React Native dependencies support x86_64:

   ```bash
   cd android
   ./gradlew :app:dependencies | grep -i "x86_64\|x86"
   ```

2. Verify Gradle is building for all ABIs:

   ```bash
   ./gradlew :app:assembleDebug --info | grep -i "abi\|architecture"
   ```

3. Check for any dependency excluding x86_64:
   ```bash
   ./gradlew :app:dependencies --configuration debugRuntimeClasspath | grep -i exclude
   ```

### Alternative: Exclude x86_64 for testing

If you only test on ARM devices, you can temporarily exclude x86 architectures:

```gradle
ndk {
    abiFilters "armeabi-v7a", "arm64-v8a"  // Remove x86, x86_64
}
```

⚠️ **WARNING**: This will break on x86_64 emulators/devices!

## Related Files Modified

- `android/app/build.gradle` - Packaging and ABI configuration
- `android/app/src/main/java/com/jobipoapp/MainApplication.kt` - SoLoader initialization
- `android/check-apk-abis.sh` - New verification script
