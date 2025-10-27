# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a React Native mobile application built with Expo SDK 54 that implements a **kiosk mode functionality** for Android devices. The project uses React 19.1.0 and React Native 0.81.5 with Expo's new architecture enabled (`newArchEnabled: true` in app.json).

### Core Functionality
The app is designed to lock Android devices into kiosk mode, disabling:
- Home button navigation
- Back button functionality  
- App switching
- Hardware button access
- Status bar interactions

The app includes a payment interface and unlock mechanism for controlled device access.

## Development Commands

### Starting the Development Server
- `npm start` - Start Expo development server with interactive menu (default port: 8081)
- `npm run android` - Start with Android device/emulator
- `npm run ios` - Start with iOS simulator (macOS only)
- `npm run web` - Start web development server

The Metro bundler runs on port 8081 by default. To use a different port: `npx expo start --port <port_number>`

### Platform-Specific Development
The app supports iOS, Android, and Web platforms. Platform-specific code can be added using `.ios.js`, `.android.js`, or `.web.js` file extensions.

### Running the App
- Use Expo Go app on physical devices for quick testing
- For production-like testing with native code, create a development build

## Architecture

### Entry Point
- [index.js](index.js) - Application entry point that registers the root component using `registerRootComponent` from Expo
- [App.js](App.js) - Main application component

### Configuration
- [app.json](app.json) - Expo application configuration including:
  - App metadata (name, version, slug)
  - Platform-specific settings (iOS, Android, Web)
  - New Architecture is enabled
  - Edge-to-edge display enabled for Android
  - Asset references for icons and splash screens

### Project Structure
- `/assets` - Static assets (icons, splash screens, images)
  - `icon.png` - App icon
  - `adaptive-icon.png` - Android adaptive icon
  - `splash-icon.png` - Splash screen image
  - `favicon.png` - Web favicon

### React Native New Architecture
This project has the React Native new architecture enabled. When working with native modules or third-party libraries, ensure they are compatible with the new architecture (Fabric, TurboModules).

## Application Architecture

### State Management
The app uses React hooks for state management:
- `isLocked` - Controls kiosk mode state
- `showConfirmModal` - Controls lock confirmation dialog
- `homeButtonDisabled` - Tracks hardware button restrictions
- `toggleValue` - Controls the lock toggle switch

### Key Components
- **Lock Screen Button** - Triggers kiosk mode activation with confirmation
- **Confirmation Modal** - Bottom sheet with toggle switch for kiosk activation
- **Lock Screen Overlay** - Full-screen modal displayed during kiosk mode
- **Payment Button** - Payment processing interface (currently shows placeholder alert)
- **Unlock Button** - Exits kiosk mode

### Hardware Integration
The app integrates with Android's Lock Task Mode API (currently commented out for emulator compatibility):
- `react-native-lock-task` library for native kiosk functionality
- Device Owner privileges required for full kiosk mode
- BackHandler integration to intercept hardware back button

### Development Notes
- Native kiosk functionality is disabled by default for emulator testing
- Uncomment `LockTask` imports and function calls for real device testing
- Requires device owner setup via ADB for production kiosk mode
- See [KIOSK_SETUP.md](KIOSK_SETUP.md) for complete setup instructions
