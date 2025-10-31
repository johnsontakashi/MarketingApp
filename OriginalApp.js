import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TouchableOpacity, Modal, Alert, BackHandler, Switch } from 'react-native';
import { useState, useEffect } from 'react';
// import LockTask from 'react-native-lock-task'; // Disabled for emulator compatibility

export default function App() {
  const [isLocked, setIsLocked] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [homeButtonDisabled, setHomeButtonDisabled] = useState(false);
  const [toggleValue, setToggleValue] = useState(false);

  useEffect(() => {
    // Check if app is already in lock task mode on startup
    // LockTask.isAppInLockTaskMode((error, isLocked) => {
    //   if (!error && isLocked) {
    //     setIsLocked(true);
    //     setHomeButtonDisabled(true);
    //   }
    // });

    const backAction = () => {
      if (isLocked || homeButtonDisabled) {
        // Disable back button when locked or home button is disabled
        Alert.alert(
          'Device Locked',
          'All navigation buttons are disabled in kiosk mode.',
          [{text: 'OK'}]
        );
        return true;
      }
      return false;
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction
    );

    return () => backHandler.remove();
  }, [isLocked, homeButtonDisabled]);

  const handleLockScreen = () => {
    setToggleValue(false); // Reset toggle when opening modal
    setShowConfirmModal(true);
  };

  const handleToggleChange = (value) => {
    setToggleValue(value);
    if (value) {
      // Toggle switched to ON - activate kiosk mode
      setShowConfirmModal(false);
      setHomeButtonDisabled(true);
      
      // Simulate kiosk mode for emulator testing
      Alert.alert(
        'Kiosk Mode Activated',
        'All your function would be disabled.',
        [{text: 'OK', onPress: () => setIsLocked(true)}]
      );
      
      // For real device, uncomment this:
      // LockTask.startLockTask((error) => {
      //   if (error) {
      //     Alert.alert('Error', 'Failed to start kiosk mode: ' + error);
      //   } else {
      //     setHomeButtonDisabled(true);
      //     setIsLocked(true);
      //   }
      // });
    }
  };

  const cancelLockScreen = () => {
    setToggleValue(false); // Reset toggle when cancelled
    setShowConfirmModal(false);
  };

  const handleUnlockScreen = () => {
    setIsLocked(false);
    setHomeButtonDisabled(false);
    
    Alert.alert(
      'Kiosk Mode Disabled',
      'All your function would be re-enabled.',
      [{text: 'OK'}]
    );
    
    // For real device, uncomment this:
    // LockTask.stopLockTask((error) => {
    //   if (error) {
    //     Alert.alert('Error', 'Failed to stop kiosk mode: ' + error);
    //   } else {
    //     setIsLocked(false);
    //     setHomeButtonDisabled(false);
    //   }
    // });
  };

  return (
    <View style={styles.container}>
      <Text> TLB CASH DIAMOND TEST</Text>
      
      {homeButtonDisabled && (
        <View style={styles.statusIndicator}>
          <Text style={styles.statusText}>🔒 Home Button Disabled</Text>
        </View>
      )}

      <TouchableOpacity
        style={[styles.lockButton, isLocked && styles.buttonDisabled]}
        onPress={handleLockScreen}
        disabled={isLocked}
      >
        <View style={styles.buttonContent}>
          <Text style={styles.lockIcon}>
            {homeButtonDisabled ? '🔒' : '🔓'}
          </Text>
          <Text style={styles.buttonText}>
            {homeButtonDisabled ? 'Kiosk Mode Active' : 'Lock'}
          </Text>
        </View>
      </TouchableOpacity>

      <StatusBar style="auto" />

      {/* Popup Modal */}
      <Modal
        visible={showConfirmModal}
        transparent={true}
        animationType="slide"
      >
        <TouchableOpacity 
          style={styles.popupOverlay}
          activeOpacity={1}
          onPress={cancelLockScreen}
        >
          <TouchableOpacity 
            style={styles.popupContent}
            activeOpacity={1}
            onPress={(e) => e.stopPropagation()}
          >
            <View style={styles.toggleContainer}>
              <Text style={styles.toggleLabel}>Lock Device</Text>
              <Switch
                value={toggleValue}
                onValueChange={handleToggleChange}
                trackColor={{ false: '#F5E6A3', true: '#D4AF37' }}
                thumbColor={toggleValue ? '#B8860B' : '#DDD6C1'}
                ios_backgroundColor="#F5E6A3"
                style={styles.toggle}
              />
            </View>

            <Text style={styles.popupMessage}>
              This will enable full kiosk mode and disable all device functions.
            </Text>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>

      {/* Lock Screen Overlay */}
      <Modal
        visible={isLocked}
        transparent={false}
        animationType="fade"
      >
        <View style={styles.lockOverlay}>
          <View style={styles.lockHeader}>
            <Text style={styles.lockIcon}>🔒</Text>
            <Text style={styles.lockTitle}>Your Device is Locked</Text>
            <Text style={styles.lockExplanation}>
               TLB CASH DIAMOND TEST
            </Text>
            <Text style={styles.lockInstructions}>
              Please use the payment system or contact an administrator 
              to unlock the device.
            </Text>
          </View>

          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={styles.imageButton}
              onPress={() => alert('Phone function')}
            >
              <Text style={styles.buttonIcon}>📞</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.payButton}
              onPress={() => alert('Your payment can not find, Please check your payment')}
            >
              <Text style={styles.buttonText}>Payment</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.imageButton}
              onPress={handleUnlockScreen}
            >
              <Text style={styles.buttonIcon}>🔓</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF8E7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  lockButton: {
    marginTop: 20,
    backgroundColor: '#D4AF37',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 8,
    shadowColor: '#B8860B',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  confirmButton: {
    backgroundColor: '#B8860B',
    paddingHorizontal: 25,
    paddingVertical: 12,
    borderRadius: 8,
    flex: 1,
    marginLeft: 10,
    alignItems: 'center',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: 20,
    marginTop: 30,
  },
  payButton: {
    backgroundColor: '#DAA520',
    paddingHorizontal: 40,
    paddingVertical: 18,
    borderRadius: 8,
    shadowColor: '#B8860B',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
    minWidth: 140,
    alignItems: 'center',
    flex: 2,
    marginHorizontal: 10,
  },
  imageButton: {
    backgroundColor: '#CD853F',
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderRadius: 6,
    shadowColor: '#A0522D',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
    width: 50,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    flex: 0,
  },
  buttonIcon: {
    fontSize: 20,
    color: '#fff',
  },
  unlockButton: {
    marginTop: 15,
    backgroundColor: '#CD853F',
    paddingHorizontal: 40,
    paddingVertical: 15,
    borderRadius: 8,
    shadowColor: '#A0522D',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
    minWidth: 120,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  lockOverlay: {
    flex: 1,
    backgroundColor: '#2C1810',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 40,
  },
  lockHeader: {
    alignItems: 'center',
    paddingHorizontal: 30,
    flex: 1,
    justifyContent: 'center',
  },
  lockIcon: {
    fontSize: 80,
    marginBottom: 20,
    color: '#F4E4BC',
  },
  lockTitle: {
    color: '#F4E4BC',
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  lockExplanation: {
    color: '#D4AF37',
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 15,
    paddingHorizontal: 10,
  },
  lockInstructions: {
    color: '#B8860B',
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
    fontStyle: 'italic',
    paddingHorizontal: 10,
  },
  popupOverlay: {
    flex: 1,
    backgroundColor: 'rgba(44, 24, 16, 0.7)',
    justifyContent: 'flex-end',
  },
  popupContent: {
    backgroundColor: '#FFF8E7',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 25,
    alignItems: 'center',
    shadowColor: '#B8860B',
    shadowOffset: {
      width: 0,
      height: -3,
    },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 10,
    minHeight: 250,
    borderWidth: 2,
    borderColor: '#D4AF37',
  },
  popupTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#B8860B',
    textAlign: 'center',
  },
  popupMessage: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 30,
    color: '#8B4513',
    lineHeight: 26,
    paddingHorizontal: 10,
  },
  toggleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    paddingVertical: 20,
    paddingHorizontal: 10,
    marginBottom: 20,
    backgroundColor: '#F5E6A3',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#D4AF37',
  },
  toggleLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#8B4513',
    flex: 1,
  },
  toggle: {
    transform: [{ scaleX: 1.2 }, { scaleY: 1.2 }],
  },
  statusIndicator: {
    backgroundColor: '#F5E6A3',
    borderColor: '#D4AF37',
    borderWidth: 2,
    borderRadius: 8,
    padding: 12,
    marginBottom: 15,
    alignItems: 'center',
  },
  statusText: {
    color: '#B8860B',
    fontSize: 16,
    fontWeight: 'bold',
  },
  buttonDisabled: {
    backgroundColor: '#DDD6C1',
    opacity: 0.7,
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  lockIcon: {
    fontSize: 20,
    marginRight: 8,
  },
});
