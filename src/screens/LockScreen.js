import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  BackHandler, 
  Alert,
  Dimensions 
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

  useEffect(() => {
    // Disable back button when in lock screen
    const backAction = () => {
      Alert.alert(
        'Device Locked',
        'All navigation buttons are disabled in kiosk mode. Please complete your payments or contact support.',
        [{ text: 'OK' }]
      );
      return true; // Prevent default behavior
    };

    const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);

    return () => backHandler.remove();
  }, []);

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
        <TouchableOpacity style={styles.actionButton} onPress={handleContactSupport}>
          <Ionicons name="call" size={24} color="#CD853F" />
          <Text style={styles.actionLabel}>Emergency{'\n'}Support</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton} onPress={() => Alert.alert('Help', 'Payment help and FAQ coming soon!')}>
          <Ionicons name="help-circle" size={24} color="#CD853F" />
          <Text style={styles.actionLabel}>Payment{'\n'}Help</Text>
        </TouchableOpacity>

        {/* Test unlock button for development */}
        <TouchableOpacity style={[styles.actionButton, styles.unlockButton]} onPress={handleUnlockDevice}>
          <Ionicons name="lock-open" size={24} color="#10B981" />
          <Text style={[styles.actionLabel, styles.unlockLabel]}>Test{'\n'}Unlock</Text>
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
    paddingHorizontal: 15,
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    minWidth: 80,
    shadowColor: '#A0522D',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  unlockButton: {
    backgroundColor: '#10B981',
  },
  actionLabel: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
    marginTop: 5,
    lineHeight: 14,
  },
  unlockLabel: {
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
});