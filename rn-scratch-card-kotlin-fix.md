# RN-Scratch-Card Kotlin Compilation Fix

## Problem

The `rn-scratch-card` package fails to compile on Android with the following error:

```
e: file:///path/to/node_modules/rn-scratch-card/android/src/main/java/com/rnscratchcard/RNScratchCard.kt:71:45
Argument type mismatch: actual type is 'android.graphics.Bitmap.Config?', but 'android.graphics.Bitmap.Config' was expected.
```

## Root Cause

The `resource.config` property can be nullable (`Bitmap.Config?`), but the `copy()` method expects a non-nullable `Bitmap.Config`.

## Solution

### Option 1: Apply the Patch (Recommended)

Apply the provided patch file:

```bash
patch -p1 < rn-scratch-card-fix.patch
```

### Option 2: Manual Fix

Edit the file `node_modules/rn-scratch-card/android/src/main/java/com/rnscratchcard/RNScratchCard.kt` at line 71:

**Before:**

```kotlin
pathStrippedImage = resource.copy(resource.config, true)
```

**After:**

```kotlin
pathStrippedImage = resource.copy(resource.config ?: Bitmap.Config.ARGB_8888, true)
```

### Option 3: Alternative Solutions

If the above doesn't work, try these alternatives:

1. **Use RGB_565 as fallback:**

```kotlin
pathStrippedImage = resource.copy(resource.config ?: Bitmap.Config.RGB_565, true)
```

2. **Use ALPHA_8 as fallback:**

```kotlin
pathStrippedImage = resource.copy(resource.config ?: Bitmap.Config.ALPHA_8, true)
```

3. **Use null check with default:**

```kotlin
val config = resource.config ?: Bitmap.Config.ARGB_8888
pathStrippedImage = resource.copy(config, true)
```

## When to Apply

Apply this fix when:

- Building React Native Android app
- Using `rn-scratch-card` package
- Getting Kotlin compilation errors related to nullable Bitmap.Config

## Testing

After applying the fix:

1. Clean your build: `cd android && ./gradlew clean`
2. Rebuild: `npx react-native run-android`
3. Verify the app builds and runs successfully

## Notes

- This fix uses `ARGB_8888` as the default configuration, which provides the best quality
- The fix is backward compatible and doesn't change the API
- Consider updating to a newer version of `rn-scratch-card` if available
