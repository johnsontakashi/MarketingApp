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

### Device Owner Setup Requirements
For full kiosk functionality on Android devices:
1. Device must have no Google accounts (factory reset or remove accounts)
2. Install app via `npm run android` or APK
3. Set device owner: `adb shell dpm set-device-owner com.anonymous.MyAppNew/com.rnlocktask.MyAdmin`
4. Verify setup by testing lock screen functionality

### Current Implementation Details
- **Single-file architecture**: All UI and logic contained in [App.js](App.js)
- **Modal-based UI**: Uses React Native Modal components for confirmation and lock screens
- **State-driven interface**: React hooks manage kiosk state, modal visibility, and hardware button controls
- **Emulator-friendly**: Native kiosk code commented out for development, replaced with Alert dialogs
- **Golden theme**: Consistent gold/bronze color scheme throughout UI components

## TLB Diamond Marketplace Expansion

This project is designed to evolve into a comprehensive **Marketplace + Community Ecosystem** powered by MDM Lock technology and TLB Diamond digital currency. The complete architecture documentation includes:

### Architecture Documentation
- [ARCHITECTURE.md](ARCHITECTURE.md) - Complete system architecture and component design
- [database/schema.sql](database/schema.sql) - Comprehensive database schema for all features
- [api/endpoints.md](api/endpoints.md) - Complete API documentation for all services
- [design/user-flows.md](design/user-flows.md) - User journey flows for all roles
- [design/ui-wireframes.md](design/ui-wireframes.md) - UI wireframes and component architecture
- [security/security-architecture.md](security/security-architecture.md) - Multi-layer security framework
- [business/monetization-strategy.md](business/monetization-strategy.md) - Business model and scaling strategy

### Core Features Planned
- **Marketplace System**: Buy/sell products with TLB Diamond tokens
- **Payment Plans**: 50-60% upfront + 3-4 biweekly installments  
- **Support Bonus**: Guaranteed payment coverage with MDM lock requirement
- **Community Network**: Multi-generation affiliate commission system
- **Bonus System**: Daily bonuses, Gift of Legacy, birthday rewards
- **Enterprise Solutions**: White-label platform and MDM-as-a-Service

### Implementation Priority
When implementing new features, follow this order:
1. Enhanced authentication and user management
2. Basic marketplace functionality
3. TLB Diamond wallet integration
4. Payment plan and installment system
5. Enhanced MDM lock controls with server validation
6. Community and affiliate features
7. Bonus and reward systems
8. Admin dashboard and analytics
9. Security hardening and compliance
10. Enterprise features and white-labeling
