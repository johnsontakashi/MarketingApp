import { Alert, Linking, AppState } from 'react-native';

class AppRestrictionManager {
  constructor() {
    this.restrictedApps = new Set();
    this.isRestrictionActive = false;
    this.allowedApps = new Set([
      'com.anonymous.MyAppNew', // TLB Diamond app
      'com.android.phone', // Phone app
      'com.android.mms', // Messages
      'com.android.settings', // Settings
      'com.android.contacts', // Contacts
      'com.android.emergency' // Emergency apps
    ]);
    this.appStateListener = null;
  }

  // Enable app restrictions
  enableRestrictions(restrictedAppList = []) {
    this.isRestrictionActive = true;
    
    // Default restricted apps (entertainment and social)
    const defaultRestricted = [
      'com.facebook.katana', // Facebook
      'com.instagram.android', // Instagram
      'com.snapchat.android', // Snapchat
      'com.tiktok.video', // TikTok
      'com.google.android.youtube', // YouTube
      'com.spotify.music', // Spotify
      'com.netflix.mediaclient', // Netflix
      'com.twitter.android', // Twitter
      'com.whatsapp', // WhatsApp (non-essential messaging)
      'com.discord', // Discord
      'com.reddit.frontpage', // Reddit
      'com.pinterest', // Pinterest
      'com.amazon.mShop.android.shopping', // Amazon Shopping
      'com.ebay.mobile', // eBay
      'com.king.candycrushsaga', // Candy Crush
      'com.supercell.clashofclans', // Clash of Clans
      'com.ea.games.madden' // Gaming apps
    ];
    
    // Combine default and custom restricted apps
    const allRestricted = [...defaultRestricted, ...restrictedAppList];
    this.restrictedApps = new Set(allRestricted);
    
    // Start monitoring app launches
    this.startAppMonitoring();
    
    Alert.alert(
      '🚫 App Restrictions Active',
      `Due to overdue payment, ${this.restrictedApps.size} entertainment and social apps have been restricted.\n\nEssential apps remain available:\n• Phone & Messages\n• TLB Diamond\n• Settings\n• Emergency services`,
      [{ text: 'OK' }]
    );
    
    console.log(`App restrictions enabled for ${this.restrictedApps.size} apps`);
  }

  // Disable app restrictions
  disableRestrictions() {
    this.isRestrictionActive = false;
    this.restrictedApps.clear();
    this.stopAppMonitoring();
    
    Alert.alert(
      '✅ App Restrictions Removed',
      'All apps are now accessible. Thank you for completing your payment!',
      [{ text: 'OK' }]
    );
    
    console.log('App restrictions disabled');
  }

  // Check if an app is restricted
  isAppRestricted(packageName) {
    return this.isRestrictionActive && this.restrictedApps.has(packageName);
  }

  // Check if an app is allowed
  isAppAllowed(packageName) {
    return this.allowedApps.has(packageName) || !this.isRestrictionActive;
  }

  // Handle app launch attempt
  handleAppLaunch(packageName, appName = 'this app') {
    if (this.isAppRestricted(packageName)) {
      Alert.alert(
        '🚫 App Blocked',
        `${appName} is temporarily restricted due to overdue payment.\n\nRestricted apps:\n• Social media\n• Entertainment\n• Gaming\n• Shopping\n\nMake your payment to restore full access.`,
        [
          { 
            text: 'Pay Now', 
            onPress: () => this.redirectToPayment() 
          },
          { 
            text: 'Back to TLB Diamond', 
            onPress: () => this.openTLBApp() 
          },
          { 
            text: 'Cancel', 
            style: 'cancel' 
          }
        ]
      );
      return false;
    }
    return true;
  }

  // Start monitoring app state changes
  startAppMonitoring() {
    this.appStateListener = AppState.addEventListener('change', (nextAppState) => {
      if (nextAppState === 'active') {
        // In a real implementation, you would detect the current app package name
        // For demonstration, we'll simulate this
        this.checkCurrentApp();
      }
    });
  }

  // Stop monitoring app state changes
  stopAppMonitoring() {
    if (this.appStateListener) {
      this.appStateListener.remove();
      this.appStateListener = null;
    }
  }

  // Check if current app should be blocked (simulation)
  checkCurrentApp() {
    // In a real implementation, this would detect the actual current app
    // For demo purposes, we'll randomly simulate blocked app detection
    if (Math.random() < 0.1) { // 10% chance to simulate blocked app detection
      const simulatedApps = [
        { package: 'com.facebook.katana', name: 'Facebook' },
        { package: 'com.instagram.android', name: 'Instagram' },
        { package: 'com.google.android.youtube', name: 'YouTube' }
      ];
      
      const randomApp = simulatedApps[Math.floor(Math.random() * simulatedApps.length)];
      this.handleAppLaunch(randomApp.package, randomApp.name);
    }
  }

  // Redirect to payment screen
  redirectToPayment() {
    // This would navigate to the payment screen in the app
    console.log('Redirecting to payment screen...');
    // In a real app: navigation.navigate('Wallet');
  }

  // Open TLB Diamond app
  openTLBApp() {
    // This would bring the TLB Diamond app to foreground
    console.log('Opening TLB Diamond app...');
    // In a real app: this would use deep linking or app switching
  }

  // Get restriction status
  getRestrictionStatus() {
    return {
      isActive: this.isRestrictionActive,
      restrictedCount: this.restrictedApps.size,
      allowedCount: this.allowedApps.size,
      restrictedApps: Array.from(this.restrictedApps),
      allowedApps: Array.from(this.allowedApps)
    };
  }

  // Add app to restricted list
  addRestrictedApp(packageName) {
    this.restrictedApps.add(packageName);
  }

  // Remove app from restricted list
  removeRestrictedApp(packageName) {
    this.restrictedApps.delete(packageName);
  }

  // Add app to allowed list (for emergency apps)
  addAllowedApp(packageName) {
    this.allowedApps.add(packageName);
  }

  // Show restriction summary
  showRestrictionSummary() {
    const status = this.getRestrictionStatus();
    
    Alert.alert(
      '📱 App Restriction Status',
      `Status: ${status.isActive ? 'Active' : 'Inactive'}\n\n` +
      `✅ Allowed Apps: ${status.allowedCount}\n` +
      `🚫 Restricted Apps: ${status.restrictedCount}\n\n` +
      (status.isActive ? 'Make your payment to remove restrictions.' : 'All apps are currently accessible.'),
      [{ text: 'OK' }]
    );
  }
}

// Create singleton instance
const appRestrictionManager = new AppRestrictionManager();

export default appRestrictionManager;