import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Alert, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import simCardManager from '../components/mdm/SimCardManager';

export default function DeviceStatusScreen({ navigation }) {
  const [deviceStatus] = useState({
    isLocked: false,
    lockReason: null,
    lockedAt: null,
    gracePeriodEnd: null,
    paymentProgress: { completed: 0, total: 0 },
    nextPayment: null,
    securityStatus: 'secure',
    complianceScore: 95
  });

  const [simStatus, setSimStatus] = useState({
    isMonitoring: false,
    simState: 'unknown',
    removalCount: 0,
    lockTriggered: false
  });

  // Modal states
  const [showWalletModal, setShowWalletModal] = useState(false);
  const [showOrdersModal, setShowOrdersModal] = useState(false);
  const [showHelpModal, setShowHelpModal] = useState(false);

  // Update SIM status periodically
  useEffect(() => {
    const updateSimStatus = () => {
      const status = simCardManager.getSimStatus();
      setSimStatus(status);
    };

    updateSimStatus();
    const interval = setInterval(updateSimStatus, 2000);

    return () => clearInterval(interval);
  }, []);

  const securityChecks = [
    { name: 'Root Detection', status: 'passed', icon: 'shield-checkmark', color: '#10B981' },
    { name: 'App Integrity', status: 'passed', icon: 'checkmark-circle', color: '#10B981' },
    { name: 'Device Encryption', status: 'passed', icon: 'lock-closed', color: '#10B981' },
    { name: 'Network Security', status: 'passed', icon: 'wifi', color: '#10B981' },
    { name: 'Certificate Validation', status: 'warning', icon: 'alert-circle', color: '#F59E0B' },
  ];

  const handleEmergencyUnlock = () => {
    Alert.alert(
      'Emergency Unlock Request',
      'This will send a request to administrators for emergency device unlock. Use only in genuine emergencies.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Send Request', 
          style: 'destructive',
          onPress: () => Alert.alert('Request Sent', 'Emergency unlock request has been submitted.')
        }
      ]
    );
  };

  const handleContactSupport = () => {
    setShowHelpModal(true);
  };

  const handleViewWallet = () => {
    setShowWalletModal(true);
  };

  const handleViewOrders = () => {
    setShowOrdersModal(true);
  };

  const handleSimRemovalTest = () => {
    Alert.alert(
      '🧪 Test SIM Removal',
      'This will simulate SIM card removal to test the security lock functionality.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Simulate Removal', 
          style: 'destructive',
          onPress: () => {
            simCardManager.simulateSimRemoval();
            Alert.alert('SIM Removal Simulated', 'Check the console and device lock status.');
          }
        }
      ]
    );
  };

  const handleResetSimMonitoring = () => {
    Alert.alert(
      '🔄 Reset SIM Monitoring',
      'This will reset all SIM monitoring data and violations.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Reset', 
          onPress: async () => {
            await simCardManager.resetSimMonitoring();
            Alert.alert('Reset Complete', 'SIM monitoring has been reset.');
          }
        }
      ]
    );
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'secure': return '#10B981';
      case 'locked': return '#F59E0B';
      case 'violated': return '#EF4444';
      default: return '#8B4513';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'secure': return 'shield-checkmark';
      case 'locked': return 'lock-closed';
      case 'violated': return 'warning';
      default: return 'help-circle';
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      {/* Device Status Header */}
      <View style={styles.statusHeader}>
        <View style={[styles.statusIcon, { backgroundColor: getStatusColor(deviceStatus.securityStatus) }]}>
          <Ionicons 
            name={getStatusIcon(deviceStatus.securityStatus)} 
            size={30} 
            color="#FFFFFF" 
          />
        </View>
        <View style={styles.statusInfo}>
          <Text style={styles.statusTitle}>
            Device {deviceStatus.isLocked ? 'Locked' : 'Secure'}
          </Text>
          <Text style={styles.statusSubtitle}>
            {deviceStatus.isLocked 
              ? `Locked since ${deviceStatus.lockedAt || 'Unknown'}`
              : 'All security checks passed'
            }
          </Text>
          <View style={styles.complianceScore}>
            <Text style={styles.scoreLabel}>Compliance Score: </Text>
            <Text style={[styles.scoreValue, { color: getStatusColor(deviceStatus.securityStatus) }]}>
              {deviceStatus.complianceScore}%
            </Text>
          </View>
        </View>
      </View>

      {/* Security Checks */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>🔒 Security Checks</Text>
        <View style={styles.checksContainer}>
          {securityChecks.map((check, index) => (
            <View key={index} style={styles.checkItem}>
              <Ionicons name={check.icon} size={20} color={check.color} />
              <Text style={styles.checkName}>{check.name}</Text>
              <View style={[styles.checkStatus, { backgroundColor: check.color }]}>
                <Text style={styles.checkStatusText}>
                  {check.status === 'passed' ? 'PASS' : check.status.toUpperCase()}
                </Text>
              </View>
            </View>
          ))}
        </View>
      </View>

      {/* SIM Card Monitoring */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>📱 SIM Card Monitoring</Text>
        <View style={styles.simMonitoringCard}>
          <View style={styles.simInfoRow}>
            <Text style={styles.simInfoLabel}>Monitoring Status:</Text>
            <Text style={[styles.simInfoValue, { color: simStatus.isMonitoring ? '#10B981' : '#EF4444' }]}>
              {simStatus.isMonitoring ? 'ACTIVE' : 'INACTIVE'}
            </Text>
          </View>
          
          <View style={styles.simInfoRow}>
            <Text style={styles.simInfoLabel}>SIM State:</Text>
            <Text style={[styles.simInfoValue, { 
              color: simStatus.simState === 'present' ? '#10B981' : 
                    simStatus.simState === 'absent' ? '#EF4444' : '#F59E0B' 
            }]}>
              {simStatus.simState.toUpperCase()}
            </Text>
          </View>
          
          <View style={styles.simInfoRow}>
            <Text style={styles.simInfoLabel}>Removal Count:</Text>
            <Text style={[styles.simInfoValue, { color: simStatus.removalCount > 0 ? '#EF4444' : '#10B981' }]}>
              {simStatus.removalCount}
            </Text>
          </View>
          
          <View style={styles.simInfoRow}>
            <Text style={styles.simInfoLabel}>Security Lock:</Text>
            <Text style={[styles.simInfoValue, { color: simStatus.lockTriggered ? '#EF4444' : '#10B981' }]}>
              {simStatus.lockTriggered ? 'TRIGGERED' : 'NORMAL'}
            </Text>
          </View>
          
          {/* SIM Test Actions */}
          <View style={styles.simTestActions}>
            <TouchableOpacity 
              style={[styles.actionButton, styles.testButton]} 
              onPress={handleSimRemovalTest}
            >
              <Ionicons name="warning" size={20} color="#FF6B35" />
              <Text style={[styles.actionText, { color: '#FF6B35' }]}>Test SIM Removal</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.actionButton, styles.resetButton]} 
              onPress={handleResetSimMonitoring}
            >
              <Ionicons name="refresh" size={20} color="#6B7280" />
              <Text style={[styles.actionText, { color: '#6B7280' }]}>Reset Monitoring</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Lock Information (if locked) */}
      {deviceStatus.isLocked && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🔐 Lock Information</Text>
          <View style={styles.lockInfoCard}>
            <View style={styles.lockInfoRow}>
              <Text style={styles.lockInfoLabel}>Lock Reason:</Text>
              <Text style={styles.lockInfoValue}>{deviceStatus.lockReason}</Text>
            </View>
            
            {deviceStatus.gracePeriodEnd && (
              <View style={styles.lockInfoRow}>
                <Text style={styles.lockInfoLabel}>Grace Period:</Text>
                <Text style={styles.lockInfoValue}>Ends {deviceStatus.gracePeriodEnd}</Text>
              </View>
            )}
            
            {deviceStatus.paymentProgress.total > 0 && (
              <View style={styles.paymentProgress}>
                <Text style={styles.progressLabel}>Payment Progress</Text>
                <View style={styles.progressBar}>
                  <View 
                    style={[
                      styles.progressFill, 
                      { width: `${(deviceStatus.paymentProgress.completed / deviceStatus.paymentProgress.total) * 100}%` }
                    ]} 
                  />
                </View>
                <Text style={styles.progressText}>
                  {deviceStatus.paymentProgress.completed} of {deviceStatus.paymentProgress.total} payments completed
                </Text>
              </View>
            )}
          </View>
        </View>
      )}

      {/* Quick Actions */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>⚡ Quick Actions</Text>
        <View style={styles.actionsContainer}>
          <TouchableOpacity style={styles.actionButton} onPress={handleViewWallet}>
            <Ionicons name="wallet" size={20} color="#D4AF37" />
            <Text style={styles.actionText}>View Wallet</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.actionButton} onPress={handleViewOrders}>
            <Ionicons name="cube" size={20} color="#D4AF37" />
            <Text style={styles.actionText}>My Orders</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.actionButton} onPress={handleContactSupport}>
            <Ionicons name="help-circle" size={20} color="#D4AF37" />
            <Text style={styles.actionText}>Get Help</Text>
          </TouchableOpacity>
          
          {deviceStatus.isLocked && (
            <TouchableOpacity 
              style={[styles.actionButton, styles.emergencyButton]} 
              onPress={handleEmergencyUnlock}
            >
              <Ionicons name="alert-circle" size={20} color="#EF4444" />
              <Text style={[styles.actionText, styles.emergencyText]}>Emergency Unlock</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Device Information */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>📱 Device Information</Text>
        <View style={styles.deviceInfoCard}>
          <View style={styles.deviceInfoRow}>
            <Text style={styles.deviceInfoLabel}>Device Model:</Text>
            <Text style={styles.deviceInfoValue}>Samsung Galaxy S23</Text>
          </View>
          <View style={styles.deviceInfoRow}>
            <Text style={styles.deviceInfoLabel}>OS Version:</Text>
            <Text style={styles.deviceInfoValue}>Android 14.0</Text>
          </View>
          <View style={styles.deviceInfoRow}>
            <Text style={styles.deviceInfoLabel}>App Version:</Text>
            <Text style={styles.deviceInfoValue}>TLB Diamond v1.0.0</Text>
          </View>
          <View style={styles.deviceInfoRow}>
            <Text style={styles.deviceInfoLabel}>Last Check:</Text>
            <Text style={styles.deviceInfoValue}>2 minutes ago</Text>
          </View>
        </View>
      </View>

      {/* Wallet Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={showWalletModal}
        onRequestClose={() => setShowWalletModal(false)}
        statusBarTranslucent={true}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>💎 TLB Diamond Wallet</Text>
              <TouchableOpacity 
                style={styles.modalCloseButton}
                onPress={() => setShowWalletModal(false)}
              >
                <Ionicons name="close" size={24} color="#8B4513" />
              </TouchableOpacity>
            </View>
            
            <ScrollView style={styles.modalContent} showsVerticalScrollIndicator={false}>
              {/* Wallet Balance */}
              <View style={styles.walletBalanceCard}>
                <Text style={styles.balanceLabel}>Current Balance</Text>
                <Text style={styles.balanceAmount}>💎 1,250.00 TLB</Text>
                <Text style={styles.balanceUSD}>≈ $2,500.00 USD</Text>
              </View>

              {/* Recent Transactions */}
              <View style={styles.walletSection}>
                <Text style={styles.walletSectionTitle}>Recent Transactions</Text>
                
                <View style={styles.transactionItem}>
                  <View style={styles.transactionIcon}>
                    <Ionicons name="add" size={20} color="#10B981" />
                  </View>
                  <View style={styles.transactionInfo}>
                    <Text style={styles.transactionTitle}>Payment Received</Text>
                    <Text style={styles.transactionDate}>Today, 2:30 PM</Text>
                  </View>
                  <Text style={styles.transactionAmount}>+💎 50.00</Text>
                </View>

                <View style={styles.transactionItem}>
                  <View style={styles.transactionIcon}>
                    <Ionicons name="remove" size={20} color="#EF4444" />
                  </View>
                  <View style={styles.transactionInfo}>
                    <Text style={styles.transactionTitle}>Device Payment</Text>
                    <Text style={styles.transactionDate}>Yesterday, 10:15 AM</Text>
                  </View>
                  <Text style={styles.transactionAmount}>-💎 25.00</Text>
                </View>

                <View style={styles.transactionItem}>
                  <View style={styles.transactionIcon}>
                    <Ionicons name="add" size={20} color="#10B981" />
                  </View>
                  <View style={styles.transactionInfo}>
                    <Text style={styles.transactionTitle}>Bonus Credit</Text>
                    <Text style={styles.transactionDate}>Dec 3, 2024</Text>
                  </View>
                  <Text style={styles.transactionAmount}>+💎 15.00</Text>
                </View>
              </View>

              {/* Quick Actions */}
              <View style={styles.walletActions}>
                <TouchableOpacity style={styles.walletActionButton}>
                  <Ionicons name="add-circle" size={20} color="#FFFFFF" />
                  <Text style={styles.walletActionText}>Add Funds</Text>
                </TouchableOpacity>
                
                <TouchableOpacity style={[styles.walletActionButton, styles.secondaryButton]}>
                  <Ionicons name="send" size={20} color="#6B7280" />
                  <Text style={[styles.walletActionText, styles.secondaryText]}>Transfer</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Orders Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={showOrdersModal}
        onRequestClose={() => setShowOrdersModal(false)}
        statusBarTranslucent={true}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>📦 My Orders</Text>
              <TouchableOpacity 
                style={styles.modalCloseButton}
                onPress={() => setShowOrdersModal(false)}
              >
                <Ionicons name="close" size={24} color="#8B4513" />
              </TouchableOpacity>
            </View>
            
            <ScrollView style={styles.modalContent} showsVerticalScrollIndicator={false}>
              {/* Order Summary */}
              <View style={styles.orderSummaryCard}>
                <Text style={styles.orderSummaryTitle}>Order Summary</Text>
                <View style={styles.orderSummaryRow}>
                  <Text style={styles.orderSummaryLabel}>Total Orders:</Text>
                  <Text style={styles.orderSummaryValue}>3</Text>
                </View>
                <View style={styles.orderSummaryRow}>
                  <Text style={styles.orderSummaryLabel}>Completed:</Text>
                  <Text style={styles.orderSummaryValue}>2</Text>
                </View>
                <View style={styles.orderSummaryRow}>
                  <Text style={styles.orderSummaryLabel}>In Progress:</Text>
                  <Text style={styles.orderSummaryValue}>1</Text>
                </View>
              </View>

              {/* Recent Orders */}
              <View style={styles.ordersSection}>
                <Text style={styles.ordersSectionTitle}>Recent Orders</Text>
                
                <View style={styles.orderItem}>
                  <View style={styles.orderItemHeader}>
                    <Text style={styles.orderNumber}>Order #TLB-001</Text>
                    <View style={[styles.orderStatus, styles.inProgressStatus]}>
                      <Text style={styles.orderStatusText}>IN PROGRESS</Text>
                    </View>
                  </View>
                  <Text style={styles.orderProduct}>Samsung Galaxy S23 Ultra</Text>
                  <Text style={styles.orderDate}>Ordered: Dec 1, 2024</Text>
                  <Text style={styles.orderTotal}>💎 800.00 TLB</Text>
                </View>

                <View style={styles.orderItem}>
                  <View style={styles.orderItemHeader}>
                    <Text style={styles.orderNumber}>Order #TLB-002</Text>
                    <View style={[styles.orderStatus, styles.completedStatus]}>
                      <Text style={styles.orderStatusText}>COMPLETED</Text>
                    </View>
                  </View>
                  <Text style={styles.orderProduct}>iPhone 15 Pro</Text>
                  <Text style={styles.orderDate}>Delivered: Nov 28, 2024</Text>
                  <Text style={styles.orderTotal}>💎 950.00 TLB</Text>
                </View>

                <View style={styles.orderItem}>
                  <View style={styles.orderItemHeader}>
                    <Text style={styles.orderNumber}>Order #TLB-003</Text>
                    <View style={[styles.orderStatus, styles.completedStatus]}>
                      <Text style={styles.orderStatusText}>COMPLETED</Text>
                    </View>
                  </View>
                  <Text style={styles.orderProduct}>AirPods Pro (2nd Gen)</Text>
                  <Text style={styles.orderDate}>Delivered: Nov 25, 2024</Text>
                  <Text style={styles.orderTotal}>💎 120.00 TLB</Text>
                </View>
              </View>

              {/* Quick Actions */}
              <View style={styles.orderActions}>
                <TouchableOpacity style={styles.orderActionButton}>
                  <Ionicons name="storefront" size={20} color="#FFFFFF" />
                  <Text style={styles.orderActionText}>Shop Now</Text>
                </TouchableOpacity>
                
                <TouchableOpacity style={[styles.orderActionButton, styles.secondaryButton]}>
                  <Ionicons name="refresh" size={20} color="#6B7280" />
                  <Text style={[styles.orderActionText, styles.secondaryText]}>Track Orders</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Help Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={showHelpModal}
        onRequestClose={() => setShowHelpModal(false)}
        statusBarTranslucent={true}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>🆘 Help & Support</Text>
              <TouchableOpacity 
                style={styles.modalCloseButton}
                onPress={() => setShowHelpModal(false)}
              >
                <Ionicons name="close" size={24} color="#8B4513" />
              </TouchableOpacity>
            </View>
            
            <ScrollView style={styles.modalContent} showsVerticalScrollIndicator={false}>
              {/* Contact Methods */}
              <View style={styles.helpSection}>
                <Text style={styles.helpSectionTitle}>Contact Support</Text>
                
                <TouchableOpacity style={styles.helpContactItem}>
                  <View style={styles.helpContactIcon}>
                    <Ionicons name="mail" size={24} color="#D4AF37" />
                  </View>
                  <View style={styles.helpContactInfo}>
                    <Text style={styles.helpContactTitle}>Email Support</Text>
                    <Text style={styles.helpContactDetail}>support@tlbdiamond.com</Text>
                    <Text style={styles.helpContactTime}>Response within 24 hours</Text>
                  </View>
                </TouchableOpacity>

                <TouchableOpacity style={styles.helpContactItem}>
                  <View style={styles.helpContactIcon}>
                    <Ionicons name="call" size={24} color="#D4AF37" />
                  </View>
                  <View style={styles.helpContactInfo}>
                    <Text style={styles.helpContactTitle}>Phone Support</Text>
                    <Text style={styles.helpContactDetail}>1-800-TLB-HELP</Text>
                    <Text style={styles.helpContactTime}>Mon-Fri 9AM-6PM EST</Text>
                  </View>
                </TouchableOpacity>

                <TouchableOpacity style={styles.helpContactItem}>
                  <View style={styles.helpContactIcon}>
                    <Ionicons name="chatbubbles" size={24} color="#D4AF37" />
                  </View>
                  <View style={styles.helpContactInfo}>
                    <Text style={styles.helpContactTitle}>Live Chat</Text>
                    <Text style={styles.helpContactDetail}>Chat with an agent</Text>
                    <Text style={styles.helpContactTime}>Available 24/7</Text>
                  </View>
                </TouchableOpacity>
              </View>

              {/* FAQ Section */}
              <View style={styles.helpSection}>
                <Text style={styles.helpSectionTitle}>Frequently Asked Questions</Text>
                
                <View style={styles.faqItem}>
                  <Text style={styles.faqQuestion}>How do I unlock my device?</Text>
                  <Text style={styles.faqAnswer}>Complete your payment plan or contact support for assistance.</Text>
                </View>

                <View style={styles.faqItem}>
                  <Text style={styles.faqQuestion}>What happens if I remove the SIM card?</Text>
                  <Text style={styles.faqAnswer}>The device will automatically lock for security. Contact support to unlock.</Text>
                </View>

                <View style={styles.faqItem}>
                  <Text style={styles.faqQuestion}>How do I add funds to my wallet?</Text>
                  <Text style={styles.faqAnswer}>Go to the Wallet section and select "Add Funds" to deposit TLB Diamonds.</Text>
                </View>
              </View>

              {/* Emergency Actions */}
              <View style={styles.emergencySection}>
                <Text style={styles.emergencySectionTitle}>Emergency Support</Text>
                <TouchableOpacity style={styles.emergencyButton} onPress={handleEmergencyUnlock}>
                  <Ionicons name="alert-circle" size={20} color="#FFFFFF" />
                  <Text style={styles.emergencyButtonText}>Request Emergency Unlock</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF8E7',
  },
  contentContainer: {
    paddingBottom: 20,
  },
  statusHeader: {
    flexDirection: 'row',
    backgroundColor: '#F5E6A3',
    borderRadius: 16,
    padding: 20,
    margin: 20,
    borderWidth: 2,
    borderColor: '#D4AF37',
  },
  statusIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  statusInfo: {
    flex: 1,
  },
  statusTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2C1810',
    marginBottom: 5,
  },
  statusSubtitle: {
    fontSize: 14,
    color: '#8B4513',
    marginBottom: 8,
  },
  complianceScore: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  scoreLabel: {
    fontSize: 14,
    color: '#8B4513',
  },
  scoreValue: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2C1810',
    marginBottom: 15,
  },
  checksContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#D4AF37',
  },
  checkItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F5E6A3',
  },
  checkName: {
    flex: 1,
    fontSize: 14,
    color: '#2C1810',
    marginLeft: 12,
  },
  checkStatus: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  checkStatusText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  lockInfoCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#D4AF37',
  },
  lockInfoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  lockInfoLabel: {
    fontSize: 14,
    color: '#8B4513',
  },
  lockInfoValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2C1810',
  },
  paymentProgress: {
    marginTop: 10,
  },
  progressLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2C1810',
    marginBottom: 8,
  },
  progressBar: {
    height: 8,
    backgroundColor: '#F5E6A3',
    borderRadius: 4,
    marginBottom: 5,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#D4AF37',
    borderRadius: 4,
  },
  progressText: {
    fontSize: 12,
    color: '#8B4513',
  },
  actionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: '#D4AF37',
    minWidth: '48%',
  },
  emergencyButton: {
    borderColor: '#EF4444',
  },
  actionText: {
    fontSize: 14,
    color: '#2C1810',
    marginLeft: 8,
    fontWeight: '500',
  },
  emergencyText: {
    color: '#EF4444',
  },
  deviceInfoCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#D4AF37',
  },
  deviceInfoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  deviceInfoLabel: {
    fontSize: 14,
    color: '#8B4513',
  },
  deviceInfoValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2C1810',
  },
  simMonitoringCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#D4AF37',
  },
  simInfoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F5E6A3',
  },
  simInfoLabel: {
    fontSize: 14,
    color: '#8B4513',
    fontWeight: '500',
  },
  simInfoValue: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  simTestActions: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 15,
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: '#F5E6A3',
  },
  testButton: {
    borderColor: '#FF6B35',
    flex: 1,
  },
  resetButton: {
    borderColor: '#6B7280',
    flex: 1,
  },

  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    justifyContent: 'flex-end',
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  modalContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 20,
    maxHeight: '85%',
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: '#D4AF37',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 20,
    backgroundColor: '#F5E6A3',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(212, 175, 55, 0.3)',
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#2C1810',
    letterSpacing: 0.5,
  },
  modalCloseButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: 'rgba(212, 175, 55, 0.6)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  modalContent: {
    paddingHorizontal: 24,
    paddingVertical: 20,
  },

  // Wallet Modal Styles
  walletBalanceCard: {
    backgroundColor: '#F5E6A3',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    marginBottom: 24,
    borderWidth: 2,
    borderColor: '#D4AF37',
  },
  balanceLabel: {
    fontSize: 16,
    color: '#8B4513',
    marginBottom: 8,
  },
  balanceAmount: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#2C1810',
    marginBottom: 4,
  },
  balanceUSD: {
    fontSize: 16,
    color: '#8B4513',
  },
  walletSection: {
    marginBottom: 24,
  },
  walletSectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#2C1810',
    marginBottom: 16,
  },
  transactionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: 'rgba(0, 0, 0, 0.05)',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  transactionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F5E6A3',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  transactionInfo: {
    flex: 1,
  },
  transactionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2C1810',
    marginBottom: 2,
  },
  transactionDate: {
    fontSize: 14,
    color: '#8B4513',
  },
  transactionAmount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2C1810',
  },
  walletActions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  walletActionButton: {
    flex: 1,
    backgroundColor: '#D4AF37',
    borderRadius: 12,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#B8860B',
  },
  walletActionText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  secondaryButton: {
    backgroundColor: '#F9FAFB',
    borderColor: '#E5E7EB',
  },
  secondaryText: {
    color: '#6B7280',
  },

  // Orders Modal Styles
  orderSummaryCard: {
    backgroundColor: '#F5E6A3',
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    borderWidth: 2,
    borderColor: '#D4AF37',
  },
  orderSummaryTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#2C1810',
    marginBottom: 16,
  },
  orderSummaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  orderSummaryLabel: {
    fontSize: 16,
    color: '#8B4513',
  },
  orderSummaryValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2C1810',
  },
  ordersSection: {
    marginBottom: 24,
  },
  ordersSectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#2C1810',
    marginBottom: 16,
  },
  orderItem: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: 'rgba(0, 0, 0, 0.05)',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  orderItemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  orderNumber: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2C1810',
  },
  orderStatus: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  orderStatusText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  inProgressStatus: {
    backgroundColor: '#F59E0B',
  },
  completedStatus: {
    backgroundColor: '#10B981',
  },
  orderProduct: {
    fontSize: 15,
    color: '#2C1810',
    marginBottom: 4,
  },
  orderDate: {
    fontSize: 14,
    color: '#8B4513',
    marginBottom: 4,
  },
  orderTotal: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#D4AF37',
  },
  orderActions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  orderActionButton: {
    flex: 1,
    backgroundColor: '#D4AF37',
    borderRadius: 12,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#B8860B',
  },
  orderActionText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },

  // Help Modal Styles
  helpSection: {
    marginBottom: 24,
  },
  helpSectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#2C1810',
    marginBottom: 16,
  },
  helpContactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: 'rgba(0, 0, 0, 0.05)',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  helpContactIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#F5E6A3',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  helpContactInfo: {
    flex: 1,
  },
  helpContactTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2C1810',
    marginBottom: 2,
  },
  helpContactDetail: {
    fontSize: 15,
    color: '#D4AF37',
    fontWeight: '500',
    marginBottom: 2,
  },
  helpContactTime: {
    fontSize: 14,
    color: '#8B4513',
  },
  faqItem: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  faqQuestion: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2C1810',
    marginBottom: 8,
  },
  faqAnswer: {
    fontSize: 15,
    color: '#8B4513',
    lineHeight: 22,
  },
  emergencySection: {
    marginTop: 8,
  },
  emergencySectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#2C1810',
    marginBottom: 16,
  },
  emergencyButton: {
    backgroundColor: '#EF4444',
    borderRadius: 12,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#DC2626',
    shadowColor: 'rgba(239, 68, 68, 0.3)',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  emergencyButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    marginLeft: 8,
  },
});