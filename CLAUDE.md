# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a React Native mobile application built with Expo SDK 54 that implements a **kiosk mode functionality** for Android devices. The project uses React 19.1.0 and React Native 0.81.5 with Expo's new architecture enabled (`newArchEnabled: true` in app.json).

The app is branded as "TLB CASH DIAMOND TEST" and designed for commercial kiosk deployments.

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
- `npm run android` - Build and run on Android device/emulator (uses expo run:android)
- `npm run ios` - Build and run on iOS simulator (uses expo run:ios, macOS only)
- `npm run web` - Start web development server (uses expo start --web)

The Metro bundler runs on port 8081 by default. To use a different port: `npx expo start --port <port_number>`

### Building for Production
- Build APK: `cd android && ./gradlew assembleRelease` (requires Android setup)
- Development builds are recommended for testing kiosk functionality

### Platform-Specific Development
The app supports iOS, Android, and Web platforms. Platform-specific code can be added using `.ios.js`, `.android.js`, or `.web.js` file extensions.

### Running the App
- Use Expo Go app on physical devices for quick testing (limited kiosk functionality)
- For production-like testing with native code, create a development build
- Kiosk mode requires physical Android device with device owner privileges

## Architecture

### Entry Point
- [index.js](index.js) - Application entry point that registers the root component using `registerRootComponent` from Expo
- [App.js](App.js) - Root component that wraps the navigation with SafeAreaProvider
- [src/navigation/AppNavigator.js](src/navigation/AppNavigator.js) - Main navigation configuration with tab and stack navigators

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
- `/src` - Main source code directory
  - `/navigation` - Navigation configuration
  - `/screens` - All screen components (Home, Marketplace, Wallet, Community, Profile, DeviceStatus, LockScreen)
  - `/components` - Reusable components including MDM functionality

### React Native New Architecture
This project has the React Native new architecture enabled. When working with native modules or third-party libraries, ensure they are compatible with the new architecture (Fabric, TurboModules).

## Application Architecture

### Navigation Structure
The app uses React Navigation with a hybrid approach:
- **Bottom Tab Navigator** - Main navigation with 5 tabs (Home, Marketplace, Wallet, Community, Profile)
- **Stack Navigator** - Handles modal screens like DeviceStatus and LockScreen
- **LockManager Component** - Wraps the entire app to manage kiosk mode functionality

### Screen Components
- **HomeScreen** - Dashboard with quick actions, balance display, and status cards
- **MarketplaceScreen** - Shopping interface for TLB Diamond marketplace
- **WalletScreen** - Digital wallet for TLB Diamond tokens and payment management
- **CommunityScreen** - Social features, referrals, and bonus system
- **ProfileScreen** - User settings and account management
- **DeviceStatusScreen** - MDM device status and diagnostics
- **LockScreen** - Kiosk mode interface with payment and unlock functionality

### State Management
The app uses React hooks and context for state management:
- Local state in individual screens for component-specific data
- LockManager handles global kiosk mode state
- Navigation state managed by React Navigation

### MDM Integration
- **LockManager Component** - Central kiosk mode management in [src/components/mdm/LockManager.js](src/components/mdm/LockManager.js)
- **Device Owner Setup** - Requires ADB setup for production kiosk functionality
- **Hardware Integration** - BackHandler and native lock task mode integration
- **Development Mode** - Alert-based simulation for emulator testing

### Design System
- **Golden Theme** - Consistent gold/bronze color palette (`#D4AF37`, `#B8860B`, `#8B4513`)
- **Ionicons** - Vector icons throughout the interface
- **Safe Area** - Full safe area support with react-native-safe-area-context
- **Responsive Design** - Dimensions-based responsive layouts

### Development Notes
- MDM functionality disabled by default for emulator compatibility
- Requires physical Android device with device owner privileges for full kiosk mode
- See [KIOSK_SETUP.md](KIOSK_SETUP.md) for complete setup instructions