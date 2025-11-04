import React, { useState, useEffect, useRef } from 'react';
import { 
  View, 
  Text, 
  Modal, 
  Alert, 
  BackHandler,
  AppState,
  TouchableOpacity,
  StyleSheet
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import networkManager from './NetworkManager';
import appRestrictionManager from './AppRestrictionManager';

// Graduated blocking stages
const BLOCKING_STAGES = {
  NONE: 'none',
  WARNING: 'warning',
  APP_RESTRICTED: 'app_restricted',
  NETWORK_BLOCKED: 'network_blocked',
  FULL_LOCK: 'full_lock'
};

// Grace periods for each stage (in milliseconds)
const GRACE_PERIODS = {
  WARNING: 24 * 60 * 60 * 1000, // 24 hours
  APP_RESTRICTED: 12 * 60 * 60 * 1000, // 12 hours
  NETWORK_BLOCKED: 6 * 60 * 60 * 1000, // 6 hours
  FULL_LOCK: 0 // Immediate
};

const BlockingManager = ({ children, paymentStatus, onPaymentRequired }) => {
  const [currentStage, setCurrentStage] = useState(BLOCKING_STAGES.NONE);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [showWarningModal, setShowWarningModal] = useState(false);
  const [blockedApps, setBlockedApps] = useState([]);
  const [networkBlocked, setNetworkBlocked] = useState(false);
  const [appStateVisible, setAppStateVisible] = useState(AppState.currentState);

  const stageTimerRef = useRef(null);
  const warningIntervalRef = useRef(null);

  // Initialize blocking based on payment status
  useEffect(() => {
    if (paymentStatus?.overdue) {
      const overdueHours = paymentStatus.overdueHours || 0;
      initializeBlockingStage(overdueHours);
    } else {
      setCurrentStage(BLOCKING_STAGES.NONE);
    }
  }, [paymentStatus]);

  // Handle app state changes for app blocking
  useEffect(() => {
    const handleAppStateChange = (nextAppState) => {
      if (currentStage === BLOCKING_STAGES.APP_RESTRICTED && nextAppState === 'active') {
        checkAppRestrictions();
      }
      setAppStateVisible(nextAppState);
    };

    const subscription = AppState.addEventListener('change', handleAppStateChange);
    return () => subscription?.remove();
  }, [currentStage]);

  // Initialize the appropriate blocking stage based on overdue time
  const initializeBlockingStage = (overdueHours) => {
    if (overdueHours >= 72) {
      escalateToStage(BLOCKING_STAGES.FULL_LOCK);
    } else if (overdueHours >= 48) {
      escalateToStage(BLOCKING_STAGES.NETWORK_BLOCKED);
    } else if (overdueHours >= 24) {
      escalateToStage(BLOCKING_STAGES.APP_RESTRICTED);
    } else {
      escalateToStage(BLOCKING_STAGES.WARNING);
    }
  };

  // Escalate to a specific blocking stage
  const escalateToStage = (stage) => {
    setCurrentStage(stage);
    
    switch (stage) {
      case BLOCKING_STAGES.WARNING:
        startWarningPhase();
        break;
      case BLOCKING_STAGES.APP_RESTRICTED:
        startAppRestrictions();
        break;
      case BLOCKING_STAGES.NETWORK_BLOCKED:
        startNetworkBlocking();
        break;
      case BLOCKING_STAGES.FULL_LOCK:
        startFullLock();
        break;
    }
  };

  // Stage 1: Warning Phase
  const startWarningPhase = () => {
    setShowWarningModal(true);
    setTimeRemaining(GRACE_PERIODS.WARNING);
    
    // Start countdown timer
    stageTimerRef.current = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 0) {
          escalateToStage(BLOCKING_STAGES.APP_RESTRICTED);
          return 0;
        }
        return prev - 1000;
      });
    }, 1000);

    // Show periodic warnings
    warningIntervalRef.current = setInterval(() => {
      Alert.alert(
        '⚠️ Payment Required',
        `Your payment is overdue. Device restrictions will begin in ${formatTime(timeRemaining)}.\n\nPlease make your payment to avoid restrictions.`,
        [
          { text: 'Pay Now', onPress: () => onPaymentRequired?.() },
          { text: 'Remind Later', style: 'cancel' }
        ]
      );
    }, 60 * 60 * 1000); // Every hour
  };

  // Stage 2: App Restrictions
  const startAppRestrictions = () => {
    clearTimers();
    setShowWarningModal(false);
    
    // Enable app restrictions using the AppRestrictionManager
    appRestrictionManager.enableRestrictions();
    
    setTimeRemaining(GRACE_PERIODS.APP_RESTRICTED);
    
    Alert.alert(
      '🚫 App Restrictions Active',
      'Due to overdue payment, access to entertainment and social apps has been restricted.\n\nEssential apps (Phone, Messages, TLB Diamond) remain available.',
      [
        { text: 'Pay Now', onPress: () => onPaymentRequired?.() },
        { text: 'OK', style: 'cancel' }
      ]
    );

    // Timer for next escalation
    stageTimerRef.current = setTimeout(() => {
      escalateToStage(BLOCKING_STAGES.NETWORK_BLOCKED);
    }, GRACE_PERIODS.APP_RESTRICTED);
  };

  // Stage 3: Network Blocking
  const startNetworkBlocking = () => {
    clearTimers();
    
    // Enable network restrictions using the NetworkManager
    networkManager.setNetworkRestriction('restricted');
    setNetworkBlocked(true);
    setTimeRemaining(GRACE_PERIODS.NETWORK_BLOCKED);
    
    Alert.alert(
      '🌐 Network Access Restricted',
      'Internet access has been limited to essential services only.\n\nOnly TLB Diamond payment services and emergency contacts are available.',
      [
        { text: 'Pay Now', onPress: () => onPaymentRequired?.() },
        { text: 'Emergency', onPress: () => showEmergencyOptions() }
      ]
    );

    // Timer for final escalation
    stageTimerRef.current = setTimeout(() => {
      escalateToStage(BLOCKING_STAGES.FULL_LOCK);
    }, GRACE_PERIODS.NETWORK_BLOCKED);
  };

  // Stage 4: Full Device Lock
  const startFullLock = () => {
    clearTimers();
    // This will trigger the existing full kiosk mode
    Alert.alert(
      '🔒 Device Locked',
      'Your device has been locked due to overdue payments.\n\nOnly payment processing and emergency features are available.',
      [
        { text: 'Pay Now', onPress: () => onPaymentRequired?.() },
        { text: 'Emergency Support', onPress: () => showEmergencyOptions() }
      ]
    );
  };

  // Check if current app should be blocked
  const checkAppRestrictions = () => {
    if (currentStage !== BLOCKING_STAGES.APP_RESTRICTED) return;
    
    // In a real implementation, you would check the current app package name
    // For demo purposes, we'll simulate this
    const currentApp = 'com.example.blocked'; // This would be detected dynamically
    
    if (blockedApps.includes(currentApp)) {
      Alert.alert(
        '🚫 App Blocked',
        'This app is temporarily restricted due to overdue payment.\n\nPlease make your payment to restore full access.',
        [
          { text: 'Pay Now', onPress: () => onPaymentRequired?.() },
          { text: 'Back to TLB Diamond', onPress: () => {/* Navigate to app */} }
        ]
      );
    }
  };

  // Show emergency contact options
  const showEmergencyOptions = () => {
    Alert.alert(
      '🆘 Emergency Support',
      'Emergency contact options:\n\n📞 911 (Emergency Services)\n📞 1-800-TLB-HELP (Support)\n📧 emergency@tlbdiamond.com',
      [{ text: 'OK' }]
    );
  };

  // Format time remaining for display
  const formatTime = (milliseconds) => {
    const hours = Math.floor(milliseconds / (1000 * 60 * 60));
    const minutes = Math.floor((milliseconds % (1000 * 60 * 60)) / (1000 * 60));
    
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  // Clear all timers
  const clearTimers = () => {
    if (stageTimerRef.current) {
      clearInterval(stageTimerRef.current);
      clearTimeout(stageTimerRef.current);
      stageTimerRef.current = null;
    }
    if (warningIntervalRef.current) {
      clearInterval(warningIntervalRef.current);
      warningIntervalRef.current = null;
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => clearTimers();
  }, []);

  // Handle payment completion to remove restrictions
  const handlePaymentComplete = () => {
    clearTimers();
    setCurrentStage(BLOCKING_STAGES.NONE);
    setShowWarningModal(false);
    setBlockedApps([]);
    setNetworkBlocked(false);
    
    // Remove all restrictions
    appRestrictionManager.disableRestrictions();
    networkManager.setNetworkRestriction('open');
    
    Alert.alert(
      '✅ Payment Processed',
      'Thank you! All device restrictions have been removed.',
      [{ text: 'OK' }]
    );
  };

  // Expose payment completion handler
  useEffect(() => {
    if (paymentStatus?.paid && currentStage !== BLOCKING_STAGES.NONE) {
      handlePaymentComplete();
    }
  }, [paymentStatus?.paid]);

  return (
    <>
      {children}
      
      {/* Warning Modal */}
      <Modal
        visible={showWarningModal}
        transparent={true}
        animationType="fade"
      >
        <View style={styles.warningOverlay}>
          <View style={styles.warningContent}>
            <Ionicons name="warning" size={50} color="#F59E0B" />
            <Text style={styles.warningTitle}>⚠️ Payment Overdue</Text>
            <Text style={styles.warningMessage}>
              Your payment is overdue. Device restrictions will begin in:
            </Text>
            <Text style={styles.countdown}>{formatTime(timeRemaining)}</Text>
            <Text style={styles.warningDetails}>
              Make your payment now to avoid restrictions on apps and internet access.
            </Text>
            
            <View style={styles.warningButtons}>
              <TouchableOpacity 
                style={styles.payButton} 
                onPress={() => {
                  setShowWarningModal(false);
                  onPaymentRequired?.();
                }}
              >
                <Text style={styles.payButtonText}>Pay Now</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.laterButton} 
                onPress={() => setShowWarningModal(false)}
              >
                <Text style={styles.laterButtonText}>Remind Later</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Stage Indicator */}
      {currentStage !== BLOCKING_STAGES.NONE && (
        <View style={styles.stageIndicator}>
          <Text style={styles.stageText}>
            {getStageDisplayText(currentStage)}
          </Text>
        </View>
      )}
    </>
  );
};

// Helper function to get display text for current stage
const getStageDisplayText = (stage) => {
  switch (stage) {
    case BLOCKING_STAGES.WARNING:
      return '⚠️ Payment Warning';
    case BLOCKING_STAGES.APP_RESTRICTED:
      return '🚫 Apps Restricted';
    case BLOCKING_STAGES.NETWORK_BLOCKED:
      return '🌐 Network Limited';
    case BLOCKING_STAGES.FULL_LOCK:
      return '🔒 Device Locked';
    default:
      return '';
  }
};

const styles = {
  warningOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  warningContent: {
    backgroundColor: '#FFF8E7',
    borderRadius: 16,
    padding: 30,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#F59E0B',
    maxWidth: 350,
  },
  warningTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#8B4513',
    marginTop: 15,
    marginBottom: 10,
  },
  warningMessage: {
    fontSize: 16,
    color: '#8B4513',
    textAlign: 'center',
    marginBottom: 15,
  },
  countdown: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#F59E0B',
    marginBottom: 15,
  },
  warningDetails: {
    fontSize: 14,
    color: '#8B4513',
    textAlign: 'center',
    marginBottom: 25,
    lineHeight: 20,
  },
  warningButtons: {
    width: '100%',
    gap: 10,
  },
  payButton: {
    backgroundColor: '#D4AF37',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  payButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  laterButton: {
    backgroundColor: 'transparent',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#D4AF37',
  },
  laterButtonText: {
    color: '#D4AF37',
    fontSize: 16,
    fontWeight: '600',
  },
  stageIndicator: {
    position: 'absolute',
    top: 50,
    left: 20,
    right: 20,
    backgroundColor: 'rgba(245, 158, 11, 0.9)',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
    zIndex: 1000,
  },
  stageText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
};

export default BlockingManager;