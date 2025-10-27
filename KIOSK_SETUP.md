# Kiosk Mode Setup Instructions

This app now has full kiosk mode capabilities using Android Lock Task Mode. Follow these steps to set up and use the kiosk functionality.

## Prerequisites

- Android device (physical device recommended for testing)
- USB debugging enabled on the device
- ADB (Android Debug Bridge) installed on your computer

## Setup Steps

### 1. Build and Install the App

First, build and install the app on your Android device:

```bash
npm run android
```

Or build an APK:

```bash
cd android
./gradlew assembleRelease
```

### 2. Set Your App as Device Owner

**IMPORTANT:** This step must be done on a device with NO Google accounts added. If you have accounts, you need to:
- Factory reset the device, OR
- Remove all accounts in Settings > Accounts

Once the device is clean, connect it via USB and run:

```bash
adb shell dpm set-device-owner com.anonymous.MyAppNew/com.rnlocktask.MyAdmin
```

You should see: `Success: Device owner set to package com.anonymous.MyAppNew`

### 3. Test Kiosk Mode

1. Open the app
2. Press the **"Lock Screen"** button
3. Confirm the dialog
4. The app will enter full kiosk mode:
   - ✅ Home button disabled
   - ✅ App switcher disabled
   - ✅ Back button disabled
   - ✅ Notifications disabled
   - ✅ Status bar hidden

### 4. Exit Kiosk Mode

Press the **"Unlock"** button in the locked screen to exit kiosk mode.

## Troubleshooting

### "Not allowed to set the device owner" Error

This means:
- The device has accounts added - factory reset or remove all accounts
- Another app is already device owner - remove it first with:
  ```bash
  adb shell dpm remove-active-admin com.anonymous.MyAppNew/com.rnlocktask.MyAdmin
  ```

### App Crashes When Pressing Lock Screen

- Make sure you ran the `adb shell dpm set-device-owner` command successfully
- Check that the app has device admin permissions in Settings > Security > Device admin apps

### Remove Device Owner (For Development)

To remove device owner status:

```bash
adb shell dpm remove-active-admin com.anonymous.MyAppNew/com.rnlocktask.MyAdmin
```

Or from within the app, you can add:
```javascript
import LockTask from 'react-native-lock-task';
LockTask.clearDeviceOwnerApp();
```

## Production Deployment

For production kiosk devices:

1. Factory reset all devices
2. Install your app APK
3. Set as device owner using ADB
4. Configure the app to auto-start in kiosk mode on boot
5. Physically secure the device

## Features

- **Lock Screen Button**: Enables full kiosk mode with confirmation dialog
- **Pay Button**: Payment processing (customize as needed)
- **Unlock Button**: Exits kiosk mode
- **Auto-detection**: App detects if it's already in kiosk mode on startup
