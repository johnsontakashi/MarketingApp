import { Alert } from 'react-native';
import * as SecureStore from 'expo-secure-store';

class SimCardManager {
  constructor() {
    this.isMonitoring = false;
    this.simState = 'unknown'; // 'present', 'absent', 'unknown'
    this.initialSimState = null;
    this.simRemovedCount = 0;
    this.lockTriggered = false;
    this.monitoringInterval = null;
    this.deviceLockCallback = null;
  }

  // Initialize SIM monitoring
  async initializeSimMonitoring(deviceLockCallback) {
    this.deviceLockCallback = deviceLockCallback;
    
    try {
      // Get initial SIM state from secure storage
      const storedSimState = await SecureStore.getItemAsync('initial_sim_state');
      if (storedSimState) {
        this.initialSimState = storedSimState;
      }
      
      // Detect current SIM state
      await this.detectSimState();
      
      // Store initial state if not already stored
      if (!this.initialSimState) {
        this.initialSimState = this.simState;
        await SecureStore.setItemAsync('initial_sim_state', this.simState);
      }
      
      console.log(`📱 SIM Monitor initialized - Initial: ${this.initialSimState}, Current: ${this.simState}`);
    } catch (error) {
      console.warn('⚠️ Failed to initialize SIM monitoring:', error);
      // Assume SIM is present if we can't detect
      this.initialSimState = 'present';
      this.simState = 'present';
    }
  }

  // Detect current SIM card state
  async detectSimState() {
    try {
      // In a real implementation, this would use native modules to check SIM state
      // For now, we'll simulate SIM state detection using network connectivity
      // and device identifier information
      
      // Check if device has cellular capability
      const hasSimSlot = await this.checkSimSlotAvailability();
      
      if (!hasSimSlot) {
        this.simState = 'absent';
        return;
      }
      
      // Check network connection type and cellular info
      const networkInfo = await this.getNetworkInfo();
      
      if (networkInfo.hasCellular) {
        this.simState = 'present';
      } else {
        // Could be absent or no signal - need additional checks
        this.simState = this.performAdditionalSimChecks() ? 'present' : 'absent';
      }
      
    } catch (error) {
      console.warn('⚠️ Failed to detect SIM state:', error);
      this.simState = 'unknown';
    }
  }

  // Check if device has SIM slot capability
  async checkSimSlotAvailability() {
    try {
      // In a real implementation, this would check hardware capabilities
      // For demo purposes, assume device has SIM slot
      return true;
    } catch (error) {
      return false;
    }
  }

  // Get network information
  async getNetworkInfo() {
    try {
      // In a real implementation, this would use:
      // - Network connection type (cellular, wifi, none)
      // - Carrier information
      // - Phone number if available
      // - IMEI/device identifiers
      
      // For demo, simulate network detection
      return {
        hasCellular: Math.random() > 0.3, // 70% chance of having cellular
        carrier: 'Demo Carrier',
        connectionType: 'cellular'
      };
    } catch (error) {
      return {
        hasCellular: false,
        carrier: null,
        connectionType: 'unknown'
      };
    }
  }

  // Perform additional SIM presence checks
  performAdditionalSimChecks() {
    try {
      // Additional checks could include:
      // - Phone state listeners
      // - TelephonyManager checks
      // - SIM operator information
      // - Device unlock status
      
      // For demo, simulate additional checks
      return Math.random() > 0.5;
    } catch (error) {
      return false;
    }
  }

  // Start monitoring SIM card state
  startMonitoring() {
    if (this.isMonitoring) {
      console.log('📱 SIM monitoring already active');
      return;
    }

    this.isMonitoring = true;
    console.log('📱 Starting SIM card monitoring...');

    // Check SIM state every 5 seconds
    this.monitoringInterval = setInterval(async () => {
      await this.checkSimState();
    }, 5000);

    // Also listen for network state changes
    this.setupNetworkStateListener();
  }

  // Stop monitoring SIM card state
  stopMonitoring() {
    if (!this.isMonitoring) {
      return;
    }

    this.isMonitoring = false;
    console.log('📱 Stopping SIM card monitoring...');

    if (this.monitoringInterval) {
      clearInterval(this.monitoringInterval);
      this.monitoringInterval = null;
    }

    this.teardownNetworkStateListener();
  }

  // Setup network state change listener
  setupNetworkStateListener() {
    try {
      // In a real implementation, this would listen for:
      // - NetInfo state changes
      // - TelephonyManager state changes
      // - Connectivity changes
      
      console.log('📱 Network state listener activated');
    } catch (error) {
      console.warn('⚠️ Failed to setup network listener:', error);
    }
  }

  // Teardown network state listener
  teardownNetworkStateListener() {
    try {
      console.log('📱 Network state listener deactivated');
    } catch (error) {
      console.warn('⚠️ Failed to teardown network listener:', error);
    }
  }

  // Check current SIM state and handle changes
  async checkSimState() {
    const previousState = this.simState;
    await this.detectSimState();

    if (previousState !== this.simState) {
      console.log(`📱 SIM state changed: ${previousState} → ${this.simState}`);
      await this.handleSimStateChange(previousState, this.simState);
    }
  }

  // Handle SIM state changes
  async handleSimStateChange(previousState, currentState) {
    // SIM card was removed
    if (previousState === 'present' && currentState === 'absent') {
      this.simRemovedCount++;
      console.warn(`🚨 SIM CARD REMOVED - Count: ${this.simRemovedCount}`);
      
      await this.handleSimRemoval();
    }
    
    // SIM card was inserted
    else if (previousState === 'absent' && currentState === 'present') {
      console.log('📱 SIM card inserted');
      await this.handleSimInsertion();
    }
    
    // Store the state change
    try {
      await SecureStore.setItemAsync('sim_removal_count', this.simRemovedCount.toString());
      await SecureStore.setItemAsync('last_sim_state', currentState);
    } catch (error) {
      console.warn('⚠️ Failed to store SIM state:', error);
    }
  }

  // Handle SIM card removal
  async handleSimRemoval() {
    // Trigger immediate device lock regardless of current state
    if (!this.lockTriggered) {
      this.lockTriggered = true;
      
      Alert.alert(
        '🚨 SIM Card Removed - Security Violation',
        `SIM card removal detected!\n\nSecurity Measures Activated:\n• Device immediately locked\n• Network access blocked\n• All functions disabled\n• Violation logged\n\nRemoval Count: ${this.simRemovedCount}\n\nOnly payment completion can unlock device.`,
        [
          { text: 'Pay Now', onPress: () => this.redirectToPayment() },
          { text: 'Emergency Support', onPress: () => this.handleEmergencySupport() },
          { text: 'OK', style: 'cancel' }
        ]
      );

      // Trigger device lock via callback
      if (this.deviceLockCallback) {
        this.deviceLockCallback('sim_removal');
      }
    }
  }

  // Handle SIM card insertion  
  async handleSimInsertion() {
    // Check if this is the original SIM or a different one
    const isOriginalSim = await this.verifyOriginalSim();
    
    if (!isOriginalSim) {
      Alert.alert(
        '⚠️ Different SIM Card Detected',
        'A different SIM card has been inserted. Device remains locked for security.\n\nComplete payment to unlock device with any SIM card.',
        [
          { text: 'Pay Now', onPress: () => this.redirectToPayment() },
          { text: 'OK' }
        ]
      );
    } else {
      console.log('📱 Original SIM card re-inserted');
    }
  }

  // Verify if inserted SIM is the original
  async verifyOriginalSim() {
    try {
      // In a real implementation, this would compare:
      // - SIM serial number (ICCID)
      // - Phone number
      // - Carrier information
      // - Network operator codes
      
      // For demo, simulate verification
      return Math.random() > 0.7; // 30% chance it's the original SIM
    } catch (error) {
      return false;
    }
  }

  // Redirect to payment portal
  redirectToPayment() {
    console.log('💳 Redirecting to payment portal due to SIM violation...');
    // In real implementation, this would navigate to payment screen
  }

  // Handle emergency support
  handleEmergencySupport() {
    Alert.alert(
      '🆘 Emergency Support',
      'SIM removal emergency contacts:\n\n📞 911 (Emergency Services)\n📞 1-800-TLB-HELP (24/7 Support)\n📧 security@tlbdiamond.com\n\n⚠️ Device will remain locked until payment completion.',
      [{ text: 'OK' }]
    );
  }

  // Get SIM monitoring status
  getSimStatus() {
    return {
      isMonitoring: this.isMonitoring,
      simState: this.simState,
      initialSimState: this.initialSimState,
      removalCount: this.simRemovedCount,
      lockTriggered: this.lockTriggered,
      lastCheck: new Date().toISOString()
    };
  }

  // Reset SIM monitoring (for testing)
  async resetSimMonitoring() {
    this.stopMonitoring();
    this.simRemovedCount = 0;
    this.lockTriggered = false;
    this.initialSimState = null;
    
    try {
      await SecureStore.deleteItemAsync('initial_sim_state');
      await SecureStore.deleteItemAsync('sim_removal_count');
      await SecureStore.deleteItemAsync('last_sim_state');
    } catch (error) {
      console.warn('⚠️ Failed to reset SIM data:', error);
    }
    
    console.log('📱 SIM monitoring reset');
  }

  // Force trigger SIM removal (for testing)
  async simulateSimRemoval() {
    console.log('🧪 Simulating SIM card removal...');
    const previousState = this.simState;
    this.simState = 'absent';
    await this.handleSimStateChange(previousState, 'absent');
  }

  // Check if device should remain locked due to SIM violations
  shouldMaintainLock() {
    return this.lockTriggered || this.simRemovedCount > 0;
  }
}

// Create singleton instance
const simCardManager = new SimCardManager();

export default simCardManager;