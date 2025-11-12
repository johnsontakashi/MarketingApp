import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  Modal, 
  Alert, 
  BackHandler, 
  Switch,
  StyleSheet 
} from 'react-native';
import * as SecureStore from 'expo-secure-store';
import sharedDataService from '../../services/sharedDataService';
// import LockTask from 'react-native-lock-task'; // Disabled for emulator compatibility

const LockManager = ({ children, navigation }) => {
  const [isLocked, setIsLocked] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [homeButtonDisabled, setHomeButtonDisabled] = useState(false);
  const [toggleValue, setToggleValue] = useState(false);
  const [adminLockStatus, setAdminLockStatus] = useState(false);

  // Check for admin-imposed locks
  const checkAdminLockStatus = async () => {
    try {
      const currentUserData = await SecureStore.getItemAsync('currentUser');
      if (!currentUserData) return;
      
      const currentUser = JSON.parse(currentUserData);
      const devices = await sharedDataService.getDevices();
      
      // Find the device for the current user
      const currentUserDevice = devices.find(device => 
        device.user_email === currentUser.email || 
        device.user_id === currentUser.id
      );
      
      if (currentUserDevice && currentUserDevice.is_locked) {
        console.log('🔒 Admin has locked this device:', currentUserDevice.device_name);
        setAdminLockStatus(true);
        setIsLocked(true);
        setToggleValue(true);
      } else {
        setAdminLockStatus(false);
        // Only unlock if it was admin-locked (don't override manual user lock)
        if (adminLockStatus && isLocked) {
          setIsLocked(false);
          setToggleValue(false);
        }
      }
    } catch (error) {
      console.error('Error checking admin lock status:', error);
    }
  };

  useEffect(() => {
    // Check admin lock status when component mounts and periodically
    checkAdminLockStatus();
    
    // Check every 30 seconds for admin lock changes
    const lockCheckInterval = setInterval(checkAdminLockStatus, 30000);
    
    return () => clearInterval(lockCheckInterval);
  }, []);

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
    // Prevent unlocking if admin has locked the device
    if (!value && adminLockStatus) {
      Alert.alert(
        '🔒 Admin Locked',
        'This device has been locked by an administrator. You cannot unlock it until the admin removes the lock.',
        [{ text: 'OK' }]
      );
      setToggleValue(true); // Keep it locked
      return;
    }
    
    setToggleValue(value);
    if (value) {
      // Toggle switched to ON - activate kiosk mode
      setShowConfirmModal(false);
      setHomeButtonDisabled(true);
      
      // Simulate kiosk mode for emulator testing
      Alert.alert(
        adminLockStatus ? '🔒 Admin Locked Device' : 'Kiosk Mode Activated',
        adminLockStatus 
          ? 'This device has been locked by an administrator. All functions are disabled.'
          : 'All your function would be disabled.',
        [{text: 'OK', onPress: () => {
          setIsLocked(true);
          navigation.navigate('LockScreen');
        }}]
      );
      
      // For real device, uncomment this:
      // LockTask.startLockTask((error) => {
      //   if (error) {
      //     Alert.alert('Error', 'Failed to start kiosk mode: ' + error);
      //   } else {
      //     setHomeButtonDisabled(true);
      //     setIsLocked(true);
      //     navigation.navigate('LockScreen');
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

  // Expose lock functions to parent components
  React.useEffect(() => {
    if (navigation) {
      navigation.setParams({
        handleLockScreen,
        handleUnlockScreen,
        isLocked,
        homeButtonDisabled
      });
    }
  }, [navigation, isLocked, homeButtonDisabled]);

  return (
    <>
      {children}
      
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
    </>
  );
};

const styles = StyleSheet.create({
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
  popupMessage: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 30,
    color: '#8B4513',
    lineHeight: 26,
    paddingHorizontal: 10,
  },
});

export default LockManager;