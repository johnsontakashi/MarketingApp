import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  Modal, 
  Alert, 
  BackHandler, 
  Switch,
  StyleSheet,
  Platform,
  AppState,
  StatusBar,
  Dimensions
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as NavigationBar from 'expo-navigation-bar';
import { activateKeepAwake, deactivateKeepAwake } from 'expo-keep-awake';
import networkManager from './NetworkManager';
import simCardManager from './SimCardManager';

const { width, height } = Dimensions.get('window');

const SystemKioskManager = ({ children, navigation }) => {
  const [isLocked, setIsLocked] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [toggleValue, setToggleValue] = useState(false);
  const [violationCount, setViolationCount] = useState(0);
  const [showViolationWarning, setShowViolationWarning] = useState(false);
  const [homeButtonBlocked, setHomeButtonBlocked] = useState(false);
  const [simViolationCount, setSimViolationCount] = useState(0);
  const [simLockActive, setSimLockActive] = useState(false);

  // SIM card lock callback
  const handleSimTriggeredLock = (reason) => {
    console.warn(`🚨 SIM-triggered lock: ${reason}`);
    setSimLockActive(true);
    setIsLocked(true);
    setSimViolationCount(prev => prev + 1);
    
    // Force kiosk mode activation regardless of current state
    if (navigation) {
      navigation.navigate('LockScreen');
    }
  };

  // Initialize SIM monitoring on component mount
  useEffect(() => {
    const initializeSimMonitoring = async () => {
      try {
        await simCardManager.initializeSimMonitoring(handleSimTriggeredLock);
        simCardManager.startMonitoring();
        console.log('📱 SIM monitoring initialized and started');
      } catch (error) {
        console.warn('⚠️ Failed to initialize SIM monitoring:', error);
      }
    };

    initializeSimMonitoring();

    return () => {
      simCardManager.stopMonitoring();
    };
  }, []);

  useEffect(() => {
    let backHandler;
    let appStateListener;
    let homeButtonMonitor;
    let immersiveTimer;

    const setupKioskMode = async () => {
      if (isLocked) {
        // 1. Enable immersive mode and hide system UI
        if (Platform.OS === 'android') {
          try {
            // Hide navigation bar
            await NavigationBar.setVisibilityAsync('hidden');
            await NavigationBar.setBehaviorAsync('inset-swipe');
            
            // Keep screen awake
            activateKeepAwake();
            
            console.log('✅ Android immersive mode activated');
          } catch (error) {
            console.warn('⚠️ Failed to set immersive mode:', error);
          }
        }

        // 2. Enable network blocking
        networkManager.setNetworkRestriction('blocked');
        console.log('🚫 Network access blocked - only essential services allowed');

        // 3. Block BACK button
        const backAction = () => {
          setViolationCount(prev => prev + 1);
          showKioskViolation('BACK Button', 'The BACK button has been disabled in kiosk mode.');
          return true;
        };

        // 4. Monitor HOME button via AppState
        const handleAppStateChange = (nextAppState) => {
          if (isLocked) {
            if (nextAppState === 'background') {
              setViolationCount(prev => prev + 1);
              setHomeButtonBlocked(true);
              
              console.warn('🔒 KIOSK VIOLATION: HOME button pressed or app switching detected');
              
              // Immediate visual feedback
              setShowViolationWarning(true);
              setTimeout(() => setShowViolationWarning(false), 3000);
              
              // Attempt to bring app back to foreground
              setTimeout(() => {
                if (AppState.currentState === 'background') {
                  showKioskViolation('HOME Button / App Switch', 
                    'System navigation has been disabled. The device is locked in kiosk mode.');
                }
              }, 500);
            } else if (nextAppState === 'active' && homeButtonBlocked) {
              // App returned to foreground - show violation alert
              setTimeout(() => {
                showKioskViolation('System Navigation Attempt', 
                  'HOME button and app switching are disabled in kiosk mode.');
                setHomeButtonBlocked(false);
              }, 100);
            }
          }
        };

        // 5. Continuous monitoring for app switching / overview
        homeButtonMonitor = setInterval(() => {
          if (isLocked && AppState.currentState !== 'active') {
            setViolationCount(prev => prev + 1);
            console.warn('🔒 KIOSK VIOLATION: App not in foreground - possible OVERVIEW button');
          }
        }, 500);

        // 6. Re-enable immersive mode periodically (Android)
        if (Platform.OS === 'android') {
          immersiveTimer = setInterval(async () => {
            try {
              await NavigationBar.setVisibilityAsync('hidden');
            } catch (error) {
              console.warn('⚠️ Failed to maintain immersive mode:', error);
            }
          }, 2000);
        }

        backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);
        appStateListener = AppState.addEventListener('change', handleAppStateChange);
      } else {
        // Restore normal UI and network access when unlocked
        if (Platform.OS === 'android') {
          try {
            await NavigationBar.setVisibilityAsync('visible');
            deactivateKeepAwake();
            console.log('✅ Normal UI restored');
          } catch (error) {
            console.warn('⚠️ Failed to restore normal UI:', error);
          }
        }
        
        // Restore full network access
        networkManager.setNetworkRestriction('open');
        console.log('✅ Network access fully restored');
      }
    };

    setupKioskMode();

    return () => {
      if (backHandler) backHandler.remove();
      if (appStateListener) appStateListener.remove();
      if (homeButtonMonitor) clearInterval(homeButtonMonitor);
      if (immersiveTimer) clearInterval(immersiveTimer);
    };
  }, [isLocked]);

  const showKioskViolation = (buttonType, message) => {
    Alert.alert(
      `🔒 Kiosk Violation - ${buttonType}`,
      `${message}\n\nViolation #${violationCount + 1}\n\nTo unlock device:\n• Complete payment\n• Contact emergency support`,
      [
        { text: 'Pay Now', onPress: () => handlePaymentRequired() },
        { text: 'Emergency Support', onPress: () => handleEmergencySupport() },
        { text: 'OK', style: 'cancel' }
      ]
    );
  };

  const handlePaymentRequired = () => {
    Alert.alert(
      '💳 Complete Payment',
      'Redirecting to payment processing...',
      [{ text: 'OK' }]
    );
  };

  const handleEmergencySupport = () => {
    Alert.alert(
      '🆘 Emergency Support',
      'Emergency contact options:\n\n📞 911 (Emergency Services)\n📞 1-800-TLB-HELP (Support)\n📧 emergency@tlbdiamond.com',
      [{ text: 'OK' }]
    );
  };

  const handleLockScreen = () => {
    setToggleValue(false);
    setShowConfirmModal(true);
  };

  const handleToggleChange = (value) => {
    setToggleValue(value);
    if (value) {
      setShowConfirmModal(false);
      activateSystemKiosk();
    }
  };

  const activateSystemKiosk = () => {
    Alert.alert(
      '🔒 Activating System Kiosk Mode',
      'This will enable maximum security kiosk mode:\n\n• BACK button disabled\n• HOME button blocked\n• App switching prevented\n• System UI hidden\n• Navigation bar hidden\n• Status bar restricted\n• Network access blocked\n• SIM card monitoring active\n\nDevice will be completely locked until payment.',
      [
        { text: 'Cancel', onPress: () => setToggleValue(false) },
        { 
          text: 'Activate Kiosk', 
          style: 'destructive',
          onPress: () => {
            setIsLocked(true);
            setViolationCount(0);
            
            Alert.alert(
              '✅ System Kiosk Mode Active',
              '🔒 Maximum security kiosk mode is now active.\n\n• All hardware buttons disabled\n• System navigation blocked\n• App switching prevented\n• Immersive mode enabled\n• Network access restricted\n• SIM card monitoring active',
              [{ text: 'OK', onPress: () => {
                if (navigation) {
                  navigation.navigate('LockScreen');
                }
              }}]
            );
          }
        }
      ]
    );
  };

  const cancelLockScreen = () => {
    setToggleValue(false);
    setShowConfirmModal(false);
  };

  const handleUnlockDevice = async () => {
    // Check if SIM violations prevent unlocking
    const simStatus = simCardManager.getSimStatus();
    if (simStatus.lockTriggered || simViolationCount > 0) {
      Alert.alert(
        '🚫 Unlock Blocked - SIM Violation',
        `Device cannot be unlocked due to SIM card security violations:\n\n• SIM removals detected: ${simViolationCount}\n• Security lock active: ${simStatus.lockTriggered ? 'YES' : 'NO'}\n\nOnly payment completion can unlock device after SIM violations.`,
        [
          { text: 'Pay Now', onPress: () => handlePaymentRequired() },
          { text: 'Emergency Support', onPress: () => handleEmergencySupport() },
          { text: 'OK', style: 'cancel' }
        ]
      );
      return;
    }

    Alert.alert(
      '🔓 Unlock System Kiosk',
      'Disable maximum security kiosk mode?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Unlock', 
          onPress: async () => {
            setIsLocked(false);
            setToggleValue(false);
            setViolationCount(0);
            setHomeButtonBlocked(false);
            
            // Restore normal Android UI and network access
            if (Platform.OS === 'android') {
              try {
                await NavigationBar.setVisibilityAsync('visible');
                deactivateKeepAwake();
              } catch (error) {
                console.warn('⚠️ Failed to restore UI:', error);
              }
            }
            
            // Restore full network access
            networkManager.setNetworkRestriction('open');
            
            Alert.alert(
              '✅ System Kiosk Disabled',
              '🔓 All restrictions have been removed:\n\n• Hardware buttons enabled\n• System navigation restored\n• App switching allowed\n• Normal UI restored\n• Network access fully restored',
              [{ text: 'OK' }]
            );
          }
        }
      ]
    );
  };

  // Expose functions to parent components
  React.useEffect(() => {
    if (navigation) {
      navigation.setParams({
        handleLockScreen,
        handleUnlockDevice,
        isLocked,
        violationCount
      });
    }
  }, [navigation, isLocked, violationCount]);

  return (
    <>
      {children}
      
      {/* System Kiosk Status Indicator */}
      {isLocked && (
        <View style={styles.systemKioskIndicator}>
          <View style={styles.kioskHeader}>
            <Ionicons name="shield-checkmark" size={18} color="#FFFFFF" />
            <Text style={styles.kioskTitle}>SYSTEM KIOSK ACTIVE</Text>
            <View style={[styles.statusDot, { backgroundColor: '#FF4444' }]} />
          </View>
          <Text style={styles.kioskDetails}>
            🔒 ALL BUTTONS DISABLED • 📱 IMMERSIVE MODE • 🚫 NETWORK BLOCKED • 📱 SIM MONITORED • ⚠️ VIOLATIONS: {violationCount + simViolationCount}
          </Text>
        </View>
      )}

      {/* Instant Violation Warning */}
      {showViolationWarning && (
        <View style={styles.violationFlash}>
          <Ionicons name="warning" size={30} color="#FF4444" />
          <Text style={styles.violationText}>KIOSK VIOLATION DETECTED!</Text>
        </View>
      )}

      {/* Enhanced Kiosk Confirmation Modal */}
      <Modal
        visible={showConfirmModal}
        transparent={true}
        animationType="slide"
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Ionicons name="shield" size={50} color="#FF6B35" />
              <Text style={styles.modalTitle}>System Kiosk Mode</Text>
              <Text style={styles.modalSubtitle}>Maximum Security</Text>
            </View>

            <Text style={styles.modalDescription}>
              Activate maximum security kiosk mode. This will completely lock down the device using advanced system-level restrictions.
            </Text>

            <View style={styles.featureList}>
              <View style={styles.featureItem}>
                <Ionicons name="ban" size={20} color="#FF6B35" />
                <Text style={styles.featureText}>Hardware buttons disabled</Text>
              </View>
              <View style={styles.featureItem}>
                <Ionicons name="eye-off" size={20} color="#FF6B35" />
                <Text style={styles.featureText}>System UI hidden</Text>
              </View>
              <View style={styles.featureItem}>
                <Ionicons name="lock-closed" size={20} color="#FF6B35" />
                <Text style={styles.featureText}>App switching blocked</Text>
              </View>
              <View style={styles.featureItem}>
                <Ionicons name="shield-checkmark" size={20} color="#FF6B35" />
                <Text style={styles.featureText}>Immersive mode active</Text>
              </View>
            </View>

            <View style={styles.toggleContainer}>
              <Text style={styles.toggleLabel}>Enable System Kiosk</Text>
              <Switch
                value={toggleValue}
                onValueChange={handleToggleChange}
                trackColor={{ false: '#FFE5E5', true: '#FF6B35' }}
                thumbColor={toggleValue ? '#FF4500' : '#CCCCCC'}
                ios_backgroundColor="#FFE5E5"
                style={styles.toggle}
              />
            </View>

            <TouchableOpacity 
              style={styles.cancelButton} 
              onPress={cancelLockScreen}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Full-screen immersive overlay */}
      {isLocked && (
        <View style={styles.immersiveOverlay} pointerEvents="none">
          <StatusBar hidden={true} />
        </View>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  systemKioskIndicator: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(255, 68, 68, 0.95)',
    paddingTop: 40,
    paddingBottom: 15,
    paddingHorizontal: 15,
    zIndex: 2000,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 10,
  },
  kioskHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 5,
  },
  kioskTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    marginHorizontal: 10,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  kioskDetails: {
    color: '#FFFFFF',
    fontSize: 12,
    textAlign: 'center',
    fontWeight: '600',
  },
  violationFlash: {
    position: 'absolute',
    top: '45%',
    left: 20,
    right: 20,
    backgroundColor: 'rgba(255, 68, 68, 0.95)',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    zIndex: 3000,
    borderWidth: 2,
    borderColor: '#FF4444',
  },
  violationText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 10,
    textAlign: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 30,
    width: '100%',
    maxWidth: 400,
    alignItems: 'center',
  },
  modalHeader: {
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#2C1810',
    marginTop: 10,
  },
  modalSubtitle: {
    fontSize: 16,
    color: '#FF6B35',
    fontWeight: '600',
    marginTop: 5,
  },
  modalDescription: {
    fontSize: 16,
    color: '#5D4E37',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 25,
  },
  featureList: {
    width: '100%',
    marginBottom: 25,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 15,
    backgroundColor: '#FFF5F5',
    borderRadius: 8,
    marginBottom: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#FF6B35',
  },
  featureText: {
    marginLeft: 12,
    fontSize: 14,
    color: '#8B4513',
    fontWeight: '500',
  },
  toggleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    paddingVertical: 15,
    paddingHorizontal: 20,
    backgroundColor: '#F0F0F0',
    borderRadius: 12,
    marginBottom: 20,
  },
  toggleLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2C1810',
    flex: 1,
  },
  toggle: {
    transform: [{ scaleX: 1.2 }, { scaleY: 1.2 }],
  },
  cancelButton: {
    backgroundColor: '#6B7280',
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 8,
    width: '100%',
  },
  cancelButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  immersiveOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'transparent',
    zIndex: -1,
  },
});

export default SystemKioskManager;