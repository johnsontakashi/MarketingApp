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
import PaymentRequiredModal from '../components/modals/PaymentRequiredModal';

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
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  const handlePayNow = () => {
    setShowPaymentModal(true);
  };

  const handlePaymentComplete = () => {
    setShowPaymentModal(false);
    Alert.alert('Payment Processed', 'Thank you! Processing your payment...');
  };

  const handlePaymentCancel = () => {
    setShowPaymentModal(false);
  };

  const handleContactSupport = () => {
    Alert.alert(
      'Contact Support',
      'Emergency support options:\n\nPhone: 1-800-TLB-HELP\nEmail: emergency@tlbdiamond.com\n\nNote: Emergency unlocks are only for genuine emergencies and require verification.'
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

      <View style={styles.paymentSection}>
        <Text style={styles.paymentTitle}>Next Payment Due</Text>
        <Text style={styles.paymentAmount}>Diamond {lockInfo.nextPaymentAmount} TLB</Text>
        <Text style={styles.paymentDue}>Due: {lockInfo.nextPaymentDue}</Text>
        
        <TouchableOpacity style={styles.payButton} onPress={handlePayNow}>
          <Ionicons name="card" size={20} color="#FFFFFF" />
          <Text style={styles.payButtonText}>Pay Now</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.actionsContainer}>
        <TouchableOpacity style={[styles.actionButton, styles.emergencyButton]} onPress={handleContactSupport}>
          <Ionicons name="medical" size={24} color="#FFFFFF" />
          <Text style={[styles.actionLabel, styles.emergencyLabel]}>Emergency Support</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.actionButton, styles.helpButton]} onPress={() => Alert.alert('Help', 'Payment help and FAQ coming soon!')}>
          <Ionicons name="card" size={24} color="#FFFFFF" />
          <Text style={[styles.actionLabel, styles.helpLabel]}>Payment Help</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.actionButton, styles.chatButton]} onPress={handleChat}>
          <Ionicons name="chatbubble-ellipses" size={24} color="#FFFFFF" />
          <Text style={[styles.actionLabel, styles.chatLabel]}>Admin Chat</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.actionButton, styles.unlockButton]} onPress={handleUnlockDevice}>
          <Ionicons name="lock-open" size={24} color="#FFFFFF" />
          <Text style={[styles.actionLabel, styles.unlockLabel]}>Unlock</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>
          For assistance, contact our 24/7 support team
        </Text>
        <Text style={styles.footerContact}>
          Phone: 1-800-TLB-HELP - Email: support@tlbdiamond.com
        </Text>
      </View>

      <View style={styles.kioskStatus}>
        <View style={styles.kioskIndicator}>
          <Ionicons name="shield-checkmark" size={16} color="#FF6B35" />
          <Text style={styles.kioskText}>
            KIOSK ACTIVE - BUTTONS DISABLED - ATTEMPTS: {homeButtonAttempts}
          </Text>
        </View>
      </View>

      <PaymentRequiredModal
        visible={showPaymentModal}
        title="Payment Required"
        message={`Complete your payment to unlock the device and continue using all features.`}
        amount={lockInfo.nextPaymentAmount}
        dueDate={lockInfo.nextPaymentDue}
        type="urgent"
        onPayNow={handlePaymentComplete}
        onEmergencySupport={handleContactSupport}
        onClose={handlePaymentCancel}
        showCancel={true}
      />
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
    marginBottom: 5,
    textAlign: 'center',
  },
  lockSubtitle: {
    fontSize: 16,
    color: '#D4AF37',
    fontWeight: '600',
    marginBottom: 15,
    letterSpacing: 2,
  },
  lockDescription: {
    fontSize: 16,
    color: '#F4E4BC',
    textAlign: 'center',
    lineHeight: 22,
    paddingHorizontal: 20,
  },
  progressSection: {
    marginVertical: 30,
  },
  progressTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#D4AF37',
    marginBottom: 15,
    textAlign: 'center',
  },
  progressContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  progressBar: {
    width: '80%',
    height: 8,
    backgroundColor: '#4A3728',
    borderRadius: 4,
    marginBottom: 10,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#D4AF37',
    borderRadius: 4,
  },
  progressText: {
    fontSize: 14,
    color: '#F4E4BC',
    textAlign: 'center',
  },
  orderInfo: {
    alignItems: 'center',
    marginTop: 15,
  },
  orderLabel: {
    fontSize: 14,
    color: '#B8860B',
    marginBottom: 5,
  },
  orderReason: {
    fontSize: 13,
    color: '#8B4513',
    textAlign: 'center',
    marginBottom: 5,
    paddingHorizontal: 20,
  },
  lockTime: {
    fontSize: 12,
    color: '#8B4513',
  },
  paymentSection: {
    alignItems: 'center',
    marginVertical: 20,
  },
  paymentTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#D4AF37',
    marginBottom: 10,
  },
  paymentAmount: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#F4E4BC',
    marginBottom: 5,
  },
  paymentDue: {
    fontSize: 14,
    color: '#B8860B',
    marginBottom: 20,
  },
  payButton: {
    backgroundColor: '#D4AF37',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  payButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  actionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    marginVertical: 20,
  },
  actionButton: {
    width: '22%',
    aspectRatio: 1,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  actionLabel: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '600',
    marginTop: 5,
    textAlign: 'center',
  },
  emergencyButton: {
    backgroundColor: '#FF4444',
  },
  emergencyLabel: {
    color: '#FFFFFF',
  },
  helpButton: {
    backgroundColor: '#4A90E2',
  },
  helpLabel: {
    color: '#FFFFFF',
  },
  chatButton: {
    backgroundColor: '#7ED321',
  },
  chatLabel: {
    color: '#FFFFFF',
  },
  unlockButton: {
    backgroundColor: '#D4AF37',
  },
  unlockLabel: {
    color: '#FFFFFF',
  },
  footer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  footerText: {
    fontSize: 12,
    color: '#8B4513',
    textAlign: 'center',
    marginBottom: 5,
  },
  footerContact: {
    fontSize: 12,
    color: '#B8860B',
    textAlign: 'center',
    fontWeight: '600',
  },
  kioskStatus: {
    position: 'absolute',
    bottom: 10,
    left: 10,
    right: 10,
  },
  kioskIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 107, 53, 0.1)',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#FF6B35',
  },
  kioskText: {
    fontSize: 10,
    color: '#FF6B35',
    marginLeft: 8,
    fontWeight: 'bold',
    flex: 1,
  },
});