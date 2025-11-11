# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a React Native mobile application built with Expo SDK 54 that implements an MDM (Mobile Device Management) kiosk system for Android devices. The project uses React 19.1.0 and React Native 0.81.5 with Expo's new architecture enabled (`newArchEnabled: true` in app.json).

The app is branded as "MyAppNew" and features authentication-gated access to a TLB Diamond marketplace ecosystem with MDM lock functionality for secure device management.

### Core Functionality
The app features authentication-gated access with graduated MDM lock functionality:
- **Authentication System**: Secure login required to access main features
- **Kiosk Mode**: Lock Android devices with disabled navigation and hardware controls
- **Graduated Blocking**: Progressive restrictions based on payment status (warnings → limited access → full lock)
- **Payment Integration**: TLB Diamond wallet system with installment support
- **Community Features**: Affiliate system, referral bonuses, and social elements
- **Device Management**: Complete MDM control including anti-tamper measures

## Development Commands

### Starting the Development Server
- `npm start` - Start Expo development server with interactive menu (default port: 8081)
- `npm run android` - Build and run on Android device/emulator (uses expo run:android)
- `npm run ios` - Build and run on iOS simulator (uses expo run:ios, macOS only)
- `npm run web` - Start web development server (uses expo start --web)

The Metro bundler runs on port 8081 by default. To use a different port: `npx expo start --port <port_number>`

### Building for Production
- Build APK: `cd android && ./gradlew assembleRelease` (requires Android setup)
- Build debug APK: `cd android && ./gradlew assembleDebug`
- Development builds are recommended for testing kiosk functionality
- Create development build: `npx expo run:android --variant release`

### Key Dependencies
- **React Navigation v7** - Navigation framework with bottom tabs and stack navigators
- **Expo SDK 54** - Framework with new architecture enabled
- **React Native 0.81.5** - Core framework
- **Expo SecureStore** - Secure authentication token storage
- **Ionicons** - Icon system via @expo/vector-icons

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
The app uses React Navigation with authentication-gated hybrid navigation:
- **Authentication Gate** - AuthScreen blocks access until user login is completed
- **Bottom Tab Navigator** - Main navigation with 5 tabs (Home, Marketplace, Wallet, Community, Profile)
- **Stack Navigator** - Handles modal screens (DeviceStatus, LockScreen, ChatScreen, AdminUserManagement)
- **MDM Wrapper System** - Multi-layered approach with BlockingManager → SystemKioskManager → LockManager

### Screen Components
- **AuthScreen** - Login/registration interface with secure authentication (src/screens/AuthScreen.js:227)
- **HomeScreen** - Dashboard with quick actions, balance display, and status cards
- **MarketplaceScreen** - Shopping interface for TLB Diamond marketplace
- **WalletScreen** - Digital wallet for TLB Diamond tokens and payment management
- **CommunityScreen** - Social features, referrals, and bonus system
- **ProfileScreen** - User settings and account management
- **DeviceStatusScreen** - MDM device status and diagnostics
- **LockScreen** - Kiosk mode interface with payment and unlock functionality
- **ChatScreen** - Communication interface (modal presentation)
- **AdminUserManagementScreen** - Administrative user management interface
- **BlockingDemoScreen** - Demonstration of MDM blocking capabilities

### State Management
The app uses React hooks and context for state management:
- **Local State**: Component-specific data managed with useState/useEffect
- **Authentication State**: Managed in AppNavigator with SecureStore persistence (src/navigation/AppNavigator.js:160-184)
- **Global Modal State**: Centralized modal management via GlobalModalProvider context
- **MDM Lock State**: Multi-layered state across BlockingManager, SystemKioskManager, and LockManager components
- **Navigation State**: React Navigation handles screen transitions and stack management

### MDM Integration
The MDM system is architected with multiple specialized managers:
- **LockManager** - Core kiosk mode toggle and hardware button blocking (src/components/mdm/LockManager.js:14)
- **KioskManager** - Device lock task management and native kiosk controls
- **SystemKioskManager** - System-level kiosk enforcement and security
- **BlockingManager** - Graduated access restriction based on payment status (src/navigation/AppNavigator.js:241-248)
- **NetworkManager** - Network access control and restrictions
- **AppRestrictionManager** - Application access control and whitelisting
- **SimCardManager** - SIM card monitoring and security enforcement
- **Development Mode** - Alert-based simulation for emulator compatibility

### Design System
- **Golden Theme** - Consistent gold/bronze color palette (`#D4AF37`, `#B8860B`, `#8B4513`)
- **Ionicons** - Vector icons throughout the interface
- **Safe Area** - Full safe area support with react-native-safe-area-context
- **Responsive Design** - Dimensions-based responsive layouts

### Development Notes
- MDM functionality disabled by default for emulator compatibility
- Requires physical Android device with device owner privileges for full kiosk mode
- See [KIOSK_SETUP.md](KIOSK_SETUP.md) for complete setup instructions
- Global modal system implemented via GlobalModalProvider for consistent UI overlays
- Custom alert system using useCustomAlert hook for native-like dialogs

## Key Development Patterns

### Authentication Flow
The app implements a secure authentication gate pattern:
- **Entry Point Gate** - AppNavigator checks authentication status before showing main app (src/navigation/AppNavigator.js:168-184)
- **SecureStore Integration** - User sessions persisted using Expo SecureStore for security
- **State-Driven Navigation** - Authentication state determines which navigator tree is rendered
- **Auth Callback Pattern** - AuthScreen uses callback props to notify parent of successful authentication

### Global Modal System
The app uses a centralized modal system for consistent UI:
- **GlobalModalProvider** - Context provider wrapping entire app with modal overlay support (src/components/modals/GlobalModalProvider.js:26)
- **ModalRegistry** - Service for cross-component modal management (src/services/ModalRegistry.js)
- **useCustomAlert** - Hook for native-like alert dialogs (src/hooks/useCustomAlert.js)
- **Specialized Modals** - Pre-built modals like SIM card detection warnings with security features list

### MDM Component Architecture
The MDM (Mobile Device Management) system is modular:
- **LockManager** - Primary kiosk mode controller
- **KioskManager** - Device lock task management
- **SystemKioskManager** - System-level kiosk controls
- **BlockingManager** - Content/feature blocking
- **NetworkManager** - Network restriction management
- **AppRestrictionManager** - Application access control
- **SimCardManager** - SIM card management for device security

### Screen Organization
- All screens follow consistent navigation patterns with React Navigation
- Modal screens (DeviceStatus, LockScreen) are handled as stack overlays
- Bottom tab navigation for main features (Home, Marketplace, Wallet, Community, Profile)

## Important Development Notes

### Testing MDM Functionality
- **Development Mode**: Emulator uses alert-based simulation instead of actual device locking
- **Production Mode**: Requires physical Android device with device owner privileges
- **ADB Setup Required**: Device owner setup needed for full kiosk mode (`adb shell dpm set-device-owner`)
- **Factory Reset Requirement**: Device must have no Google accounts for device owner setup
- **Authentication Testing**: Use any credentials to test auth flow (no backend validation in current implementation)

### Admin Interface
The app includes a complete admin interface with separate navigation:
- **AdminNavigator** - Dedicated admin navigation with dark theme (src/navigation/AdminNavigator.js)
- **Role-Based Access** - Authentication system differentiates between 'admin' and 'user' roles
- **Admin Screens** - Complete admin panel including user management, product management, device management, and analytics
- **Admin Screen Components**: AdminHomeScreen, UserManagementScreen, ProductManagementScreen, DeviceManagementScreen, AdminProfileScreen, OrderManagementScreen, FinancialDashboardScreen, SystemLogsScreen, AdminReportsScreen
- **Dual Interface System** - Regular users see the main app, admins see the admin dashboard

### Services and Utilities
- **sharedDataService.js** - Shared data management across components (currently modified in git status)
- **api.js** - API service layer for backend communication
- **ModalRegistry.js** - Cross-component modal management service
- **Custom Hooks**:
  - `useCustomAlert` - Native-like alert dialogs (src/hooks/useCustomAlert.js)
  - `useAdminAlert` - Admin-specific alert system (src/hooks/useAdminAlert.js)
- **UI Components**:
  - `CustomAlert` - Reusable alert component (src/components/ui/CustomAlert.js)
  - `AdminAlert` - Admin-specific alert component (src/components/admin/AdminAlert.js)
  - `WelcomeModal` - Welcome/onboarding modal (src/components/WelcomeModal.js)

### Code Quality Guidelines
- No linting or testing scripts are configured in package.json
- Follow existing component structure and naming conventions
- Use hooks-based state management (no Redux/Context API globally)
- Maintain consistent styling with the golden theme palette
- Ensure all new components support safe area contexts
- Admin interface uses darker theme while main app uses golden theme

### Port Management
The app uses various ports for development:
- **8081** - Default Metro bundler port
- **8082, 8084, 8099, 8100, 8101** - Alternative ports for running multiple instances
- Use `EXPO_DEV_SERVER_URL=http://localhost:<port>` to specify custom ports

## Additional Documentation
- **ARCHITECTURE.md** - Detailed technical architecture and business logic documentation including TLB Diamond marketplace ecosystem
- **KIOSK_SETUP.md** - Complete setup instructions for Android device owner and kiosk mode functionality
- **README.md** - Currently contains generic Vendure documentation (should be updated for this project)

## Important Reminders
- MDM functionality requires physical Android device with device owner privileges for full testing
- The app supports dual interface system: regular users see main app, admins see admin dashboard
- Authentication gate prevents access to main features until login is completed
- All screens implement safe area context for proper display on various devices
- Golden theme palette should be maintained across all new components