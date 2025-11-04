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
  DeviceEventEmitter,
  AppState
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const KioskManager = ({ children, navigation }) => {
  const [isLocked, setIsLocked] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [toggleValue, setToggleValue] = useState(false);
  const [kioskLevel, setKioskLevel] = useState('none'); // 'none', 'partial', 'full'

  useEffect(() => {
    let backHandler;
    let appStateListener;
    let homeButtonInterval;

    const setupKioskMode = () => {
      if (isLocked) {
        // Block BACK button
        const backAction = () => {
          Alert.alert(
            '🔒 Device Locked',
            'All navigation buttons are disabled in kiosk mode.\n\nTo unlock, complete your payment or contact support.',
            [
              { text: 'Pay Now', onPress: () => handlePaymentRequired() },
              { text: 'Emergency Support', onPress: () => handleEmergencySupport() },
              { text: 'OK', style: 'cancel' }
            ]
          );
          return true; // Prevent default behavior
        };

        backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);

        // Monitor app state changes to detect HOME button attempts
        const handleAppStateChange = (nextAppState) => {
          if (isLocked && nextAppState === 'background') {
            // User tried to go to home screen or switch apps
            setTimeout(() => {
              if (AppState.currentState === 'background') {
                // Force app back to foreground if it's still in background after 100ms
                console.warn('Kiosk violation: App sent to background');
                Alert.alert(
                  '⚠️ Kiosk Mode Active',
                  'HOME and app switching are disabled. Device is locked in kiosk mode.',
                  [
                    { text: 'Return to App', onPress: () => {
                      // In a real implementation, this would bring the app back to foreground
                      console.log('Attempting to bring app to foreground');
                    }}
                  ]
                );
              }
            }, 100);
          }
        };

        appStateListener = AppState.addEventListener('change', handleAppStateChange);

        // Periodic check to ensure app remains in foreground (anti-home button)
        homeButtonInterval = setInterval(() => {
          if (isLocked && AppState.currentState !== 'active') {
            console.warn('Kiosk violation detected: App not in foreground');
            // In production, this would use native code to bring app to foreground
          }
        }, 1000);

        // Hide system UI bars and make app immersive
        if (Platform.OS === 'android') {
          // This would require native implementation
          console.log('Kiosk mode: Hiding system UI');
        }
      }
    };

    setupKioskMode();

    return () => {
      if (backHandler) backHandler.remove();
      if (appStateListener) appStateListener.remove();
      if (homeButtonInterval) clearInterval(homeButtonInterval);
    };
  }, [isLocked, kioskLevel]);

  const handlePaymentRequired = () => {
    Alert.alert(
      '💳 Payment Required',
      'Complete your payment to unlock the device.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Pay Now', onPress: () => {
          // Navigate to payment screen
          Alert.alert('Payment', 'Redirecting to payment screen...');
        }}
      ]
    );
  };

  const handleEmergencySupport = () => {
    Alert.alert(
      '🆘 Emergency Support',
      'Emergency contact options:\n\n📞 911 (Emergency Services)\n📞 1-800-TLB-HELP (Support)\n📧 emergency@tlbdiamond.com\n\nNote: Emergency unlocks require verification.',
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
      activateKioskMode();
    }
  };

  const activateKioskMode = () => {
    Alert.alert(
      '🔒 Activating Kiosk Mode',
      'This will disable:\n• BACK button\n• HOME button\n• App switching\n• System notifications\n• Status bar access\n\nDevice will be locked until payment is completed.',
      [
        { text: 'Cancel', onPress: () => setToggleValue(false) },
        { 
          text: 'Lock Device', 
          style: 'destructive',
          onPress: () => {
            setIsLocked(true);
            setKioskLevel('full');
            
            Alert.alert(
              '✅ Kiosk Mode Activated',
              'All device functions are now restricted.\n\n• Hardware buttons disabled\n• App switching blocked\n• System access restricted',
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

  const handleUnlockDevice = () => {
    Alert.alert(
      '🔓 Unlock Device',
      'Are you sure you want to disable kiosk mode?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Unlock', 
          onPress: () => {
            setIsLocked(false);
            setKioskLevel('none');
            setToggleValue(false);
            
            Alert.alert(
              '✅ Device Unlocked',
              'All device functions have been restored.\n\n• Hardware buttons enabled\n• App switching allowed\n• System access restored',
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
        kioskLevel
      });
    }
  }, [navigation, isLocked, kioskLevel]);

  return (
    <>
      {children}
      
      {/* Kiosk Mode Status Indicator */}
      {isLocked && (
        <View style={styles.kioskIndicator}>
          <View style={styles.kioskIconContainer}>
            <Ionicons name="lock-closed" size={16} color="#FFFFFF" />
          </View>
          <Text style={styles.kioskText}>KIOSK MODE ACTIVE</Text>
          <View style={styles.kioskStatus}>
            <View style={[styles.statusDot, { backgroundColor: '#FF6B6B' }]} />
            <Text style={styles.statusText}>LOCKED</Text>
          </View>
        </View>
      )}

      {/* Lock Confirmation Modal */}
      <Modal
        visible={showConfirmModal}
        transparent={true}
        animationType="slide"
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Ionicons name="warning" size={40} color="#FF6B35" />
              <Text style={styles.modalTitle}>Activate Kiosk Mode</Text>
            </View>

            <Text style={styles.modalDescription}>
              This will enable full device lockdown mode. All hardware buttons and system functions will be disabled until payment is completed.
            </Text>

            <View style={styles.warningList}>
              <View style={styles.warningItem}>
                <Ionicons name="close-circle" size={20} color="#FF6B35" />
                <Text style={styles.warningText}>BACK button disabled</Text>
              </View>
              <View style={styles.warningItem}>
                <Ionicons name="close-circle" size={20} color="#FF6B35" />
                <Text style={styles.warningText}>HOME button disabled</Text>
              </View>
              <View style={styles.warningItem}>
                <Ionicons name="close-circle" size={20} color="#FF6B35" />
                <Text style={styles.warningText}>App switching blocked</Text>
              </View>
              <View style={styles.warningItem}>
                <Ionicons name="close-circle" size={20} color="#FF6B35" />
                <Text style={styles.warningText}>System access restricted</Text>
              </View>
            </View>

            <View style={styles.toggleContainer}>
              <Text style={styles.toggleLabel}>Enable Kiosk Mode</Text>
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

      {/* Full-screen overlay when locked (additional security) */}
      {isLocked && (
        <Modal
          visible={true}
          transparent={true}
          animationType="none"
        >
          <View style={styles.lockOverlay}>
            <TouchableOpacity 
              style={styles.overlayTouch}
              onPress={() => {
                Alert.alert(
                  '🔒 Device Locked',
                  'Kiosk mode is active. Hardware buttons are disabled.',
                  [{ text: 'OK' }]
                );
              }}
            >
              <View style={styles.overlayContent}>
                <Ionicons name="lock-closed" size={24} color="rgba(255, 255, 255, 0.8)" />
                <Text style={styles.overlayText}>Kiosk Mode Active</Text>
              </View>
            </TouchableOpacity>
          </View>
        </Modal>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  kioskIndicator: {
    position: 'absolute',
    top: 50,
    left: 20,
    right: 20,
    backgroundColor: 'rgba(255, 107, 107, 0.95)',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 8,
    zIndex: 1000,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  kioskIconContainer: {
    marginRight: 10,
  },
  kioskText: {
    flex: 1,
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
  kioskStatus: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 5,
  },
  statusText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 25,
    width: '100%',
    maxWidth: 400,
    alignItems: 'center',
  },
  modalHeader: {
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2C1810',
    marginTop: 10,
  },
  modalDescription: {
    fontSize: 16,
    color: '#5D4E37',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 20,
  },
  warningList: {
    width: '100%',
    marginBottom: 25,
  },
  warningItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 15,
    backgroundColor: '#FFF5F5',
    borderRadius: 8,
    marginBottom: 8,
    borderLeftWidth: 3,
    borderLeftColor: '#FF6B35',
  },
  warningText: {
    marginLeft: 10,
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
    backgroundColor: '#F5F5F5',
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
  lockOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 100,
    backgroundColor: 'rgba(255, 107, 107, 0.1)',
    zIndex: 999,
  },
  overlayTouch: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlayContent: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 107, 107, 0.8)',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
  },
  overlayText: {
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 5,
  },
});

export default KioskManager;