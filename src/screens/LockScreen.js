import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  BackHandler, 
  Alert,
  Dimensions,
  AppState,
  Modal
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

export default function LockScreen({ navigation }) {
  const [lockInfo] = useState({
    orderNumber: 'TLB20241029001',
    reason: 'Support bonus activated for Premium Headphones purchase',
    lockedAt: 'Oct 29, 2024 at 2:30 PM',
    paymentsCompleted: 2,
    totalPayments: 4,
    nextPaymentAmount: 25.00,
    nextPaymentDue: 'Nov 12, 2024'
  });

  const [homeButtonAttempts, setHomeButtonAttempts] = useState(0);
  const [showKioskWarning, setShowKioskWarning] = useState(false);

  useEffect(() => {
    let backHandler;
    let appStateListener;
    let homeButtonDetector;

    // Enhanced hardware button blocking
    const setupKioskMode = () => {
      // BACK button blocking
      const backAction = () => {
        setHomeButtonAttempts(prev => prev + 1);
        Alert.alert(
          '🔒 Device Locked - BACK Button',
          'BACK button is disabled in kiosk mode.\n\nTo unlock device:\n• Complete your payment\n• Contact emergency support\n\nAttempts: ' + (homeButtonAttempts + 1),
          [
            { text: 'Pay Now', onPress: () => handlePayNow() },
            { text: 'Emergency Support', onPress: () => handleContactSupport() },
            { text: 'OK', style: 'cancel' }
          ]
        );
        return true; // Prevent default behavior
      };

      // HOME button detection via AppState changes
      const handleAppStateChange = (nextAppState) => {
        if (nextAppState === 'background') {
          setHomeButtonAttempts(prev => prev + 1);
          console.warn('Kiosk violation: HOME button pressed or app switching attempted');
          
          // Show immediate warning
          setShowKioskWarning(true);
          
          // Auto-hide warning after 3 seconds
          setTimeout(() => {
            setShowKioskWarning(false);
          }, 3000);

          // Force app back to foreground after brief delay
          setTimeout(() => {
            if (AppState.currentState === 'background') {
              Alert.alert(
                '⚠️ Kiosk Mode Violation - HOME Button',
                'HOME button and app switching are disabled.\n\nDevice is locked in kiosk mode.\n\nAttempts: ' + homeButtonAttempts,
                [
                  { text: 'Return to App', onPress: () => {
                    // In real implementation, this would bring app to foreground
                    console.log('Attempting to return to app foreground');
                  }},
                  { text: 'Pay Now', onPress: () => handlePayNow() }
                ]
              );
            }
          }, 500);
        }
      };

      // Periodic check to ensure app stays in foreground (anti-overview/recent apps)
      homeButtonDetector = setInterval(() => {
        if (AppState.currentState !== 'active') {
          console.warn('Kiosk violation: App not in active state');
          setHomeButtonAttempts(prev => prev + 1);
        }
      }, 1000);

      backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);
      appStateListener = AppState.addEventListener('change', handleAppStateChange);
    };

    setupKioskMode();

    return () => {
      if (backHandler) backHandler.remove();
      if (appStateListener) appStateListener.remove();
      if (homeButtonDetector) clearInterval(homeButtonDetector);
    };
  }, [homeButtonAttempts]);

  const handlePayNow = () => {
    Alert.alert(
      'Payment Required',
      `Pay 💎 ${lockInfo.nextPaymentAmount} TLB now?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Pay Now', 
          onPress: () => {
            Alert.alert('Payment Processed', 'Thank you! Processing your payment...');
            // In real app, this would process payment and unlock if completed
          }
        }
      ]
    );
  };

  const handleContactSupport = () => {
    Alert.alert(
      'Contact Support',
      'Emergency support options:\n\n📞 1-800-TLB-HELP\n📧 emergency@tlbdiamond.com\n\nNote: Emergency unlocks are only for genuine emergencies and require verification.'
    );
  };

  const handleUnlockDevice = () => {
    Alert.alert(
      'Unlock Device',
      'This is a test unlock for development purposes.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Unlock', 
          onPress: () => {
            Alert.alert('Device Unlocked', 'Your device has been unlocked successfully!');
            navigation.goBack();
          }
        }
      ]
    );
  };

  const handleChat = () => {
    navigation.navigate('ChatScreen');
  };

  const progressPercentage = (lockInfo.paymentsCompleted / lockInfo.totalPayments) * 100;

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.lockIconContainer}>
          <Ionicons name="lock-closed" size={60} color="#F4E4BC" />
        </View>
        <Text style={styles.lockTitle}>Your Device is Locked</Text>
        <Text style={styles.lockSubtitle}>TLB CASH DIAMOND</Text>
        <Text style={styles.lockDescription}>
          Device locked due to active Support Bonus agreement. 
          Complete your payment schedule to unlock.
        </Text>
      </View>

      {/* Payment Progress */}
      <View style={styles.progressSection}>
        <Text style={styles.progressTitle}>Payment Progress</Text>
        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${progressPercentage}%` }]} />
          </View>
          <Text style={styles.progressText}>
            {lockInfo.paymentsCompleted} of {lockInfo.totalPayments} payments completed
          </Text>
        </View>

        <View style={styles.orderInfo}>
          <Text style={styles.orderLabel}>Order: {lockInfo.orderNumber}</Text>
          <Text style={styles.orderReason}>{lockInfo.reason}</Text>
          <Text style={styles.lockTime}>Locked since: {lockInfo.lockedAt}</Text>
        </View>
      </View>

      {/* Next Payment */}
      <View style={styles.paymentSection}>
        <Text style={styles.paymentTitle}>Next Payment Due</Text>
        <Text style={styles.paymentAmount}>💎 {lockInfo.nextPaymentAmount} TLB</Text>
        <Text style={styles.paymentDue}>Due: {lockInfo.nextPaymentDue}</Text>
        
        <TouchableOpacity style={styles.payButton} onPress={handlePayNow}>
          <Ionicons name="card" size={20} color="#FFFFFF" />
          <Text style={styles.payButtonText}>Pay Now</Text>
        </TouchableOpacity>
      </View>

      {/* Action Buttons */}
      <View style={styles.actionsContainer}>
        <TouchableOpacity style={[styles.actionButton, styles.emergencyButton]} onPress={handleContactSupport}>
          <Ionicons name="medical" size={24} color="#FFFFFF" />
          <Text style={[styles.actionLabel, styles.emergencyLabel]}>Emergency{'\n'}Support</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.actionButton, styles.helpButton]} onPress={() => Alert.alert('Help', 'Payment help and FAQ coming soon!')}>
          <Ionicons name="card" size={24} color="#FFFFFF" />
          <Text style={[styles.actionLabel, styles.helpLabel]}>Payment{'\n'}Help</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.actionButton, styles.chatButton]} onPress={handleChat}>
          <Ionicons name="chatbubble-ellipses" size={24} color="#FFFFFF" />
          <Text style={[styles.actionLabel, styles.chatLabel]}>Chat</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.actionButton, styles.unlockButton]} onPress={handleUnlockDevice}>
          <Ionicons name="lock-open" size={24} color="#FFFFFF" />
          <Text style={[styles.actionLabel, styles.unlockLabel]}>Unlock</Text>
        </TouchableOpacity>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>
          For assistance, contact our 24/7 support team
        </Text>
        <Text style={styles.footerContact}>
          📞 1-800-TLB-HELP • 📧 support@tlbdiamond.com
        </Text>
      </View>

      {/* Kiosk Violation Warning Overlay */}
      <Modal
        visible={showKioskWarning}
        transparent={true}
        animationType="fade"
      >
        <View style={styles.warningOverlay}>
          <View style={styles.warningContent}>
            <Ionicons name="warning" size={40} color="#FF6B35" />
            <Text style={styles.warningTitle}>🔒 Kiosk Mode Violation</Text>
            <Text style={styles.warningMessage}>
              Hardware button detected!{'\n\n'}
              • HOME button disabled{'\n'}
              • App switching blocked{'\n'}
              • Device locked in kiosk mode{'\n\n'}
              Attempts: {homeButtonAttempts}
            </Text>
          </View>
        </View>
      </Modal>

      {/* Hardware Button Blocking Indicator */}
      <View style={styles.kioskStatus}>
        <View style={styles.kioskIndicator}>
          <Ionicons name="shield-checkmark" size={16} color="#FF6B35" />
          <Text style={styles.kioskText}>
            KIOSK ACTIVE • BUTTONS DISABLED • ATTEMPTS: {homeButtonAttempts}
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#2C1810',
    justifyContent: 'space-between',
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  header: {
    alignItems: 'center',
    marginTop: 20,
  },
  lockIconContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(212, 175, 55, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  lockTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#F4E4BC',
    textAlign: 'center',
    marginBottom: 10,
  },
  lockSubtitle: {
    fontSize: 18,
    color: '#D4AF37',
    fontWeight: '600',
    marginBottom: 15,
  },
  lockDescription: {
    fontSize: 16,
    color: '#B8860B',
    textAlign: 'center',
    lineHeight: 22,
    paddingHorizontal: 20,
  },
  progressSection: {
    backgroundColor: 'rgba(245, 230, 163, 0.1)',
    borderRadius: 12,
    padding: 20,
    borderWidth: 1,
    borderColor: '#D4AF37',
  },
  progressTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#F4E4BC',
    marginBottom: 15,
    textAlign: 'center',
  },
  progressContainer: {
    marginBottom: 15,
  },
  progressBar: {
    height: 8,
    backgroundColor: 'rgba(184, 134, 11, 0.3)',
    borderRadius: 4,
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#D4AF37',
    borderRadius: 4,
  },
  progressText: {
    fontSize: 14,
    color: '#B8860B',
    textAlign: 'center',
  },
  orderInfo: {
    alignItems: 'center',
  },
  orderLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#F4E4BC',
    marginBottom: 5,
  },
  orderReason: {
    fontSize: 14,
    color: '#D4AF37',
    textAlign: 'center',
    marginBottom: 5,
  },
  lockTime: {
    fontSize: 12,
    color: '#B8860B',
  },
  paymentSection: {
    backgroundColor: 'rgba(218, 165, 32, 0.1)',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#DAA520',
  },
  paymentTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#F4E4BC',
    marginBottom: 10,
  },
  paymentAmount: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#D4AF37',
    marginBottom: 5,
  },
  paymentDue: {
    fontSize: 14,
    color: '#B8860B',
    marginBottom: 20,
  },
  payButton: {
    backgroundColor: '#DAA520',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 8,
    shadowColor: '#B8860B',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  payButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  actionButton: {
    backgroundColor: '#CD853F',
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    minWidth: 70,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 5,
  },
  unlockButton: {
    backgroundColor: '#10B981',
    borderWidth: 1,
    borderColor: '#059669',
  },
  emergencyButton: {
    backgroundColor: '#EF4444',
    borderWidth: 1,
    borderColor: '#DC2626',
  },
  helpButton: {
    backgroundColor: '#F59E0B',
    borderWidth: 1,
    borderColor: '#D97706',
  },
  chatButton: {
    backgroundColor: '#3B82F6',
    borderWidth: 1,
    borderColor: '#2563EB',
  },
  actionLabel: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '600',
    textAlign: 'center',
    marginTop: 5,
    lineHeight: 13,
  },
  unlockLabel: {
    color: '#FFFFFF',
  },
  emergencyLabel: {
    color: '#FFFFFF',
  },
  helpLabel: {
    color: '#FFFFFF',
  },
  chatLabel: {
    color: '#FFFFFF',
  },
  footer: {
    alignItems: 'center',
    paddingTop: 20,
  },
  footerText: {
    fontSize: 14,
    color: '#B8860B',
    textAlign: 'center',
    marginBottom: 5,
  },
  footerContact: {
    fontSize: 12,
    color: '#8B4513',
    textAlign: 'center',
  },
  warningOverlay: {
    flex: 1,
    backgroundColor: 'rgba(255, 107, 53, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  warningContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 30,
    alignItems: 'center',
    maxWidth: 350,
    borderWidth: 3,
    borderColor: '#FF6B35',
    shadowColor: '#FF6B35',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 10,
  },
  warningTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FF6B35',
    marginVertical: 15,
    textAlign: 'center',
  },
  warningMessage: {
    fontSize: 16,
    color: '#8B4513',
    textAlign: 'center',
    lineHeight: 22,
  },
  kioskStatus: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(255, 107, 53, 0.95)',
    paddingVertical: 8,
    zIndex: 1000,
  },
  kioskIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 15,
  },
  kioskText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
    marginLeft: 8,
    textAlign: 'center',
  },
});