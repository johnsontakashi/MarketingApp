import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Alert } from 'react-native';
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
    Alert.alert('Contact Support', 'Support contact options:\n\n📧 support@tlbdiamond.com\n📞 1-800-TLB-HELP\n💬 Live Chat (24/7)');
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
          <TouchableOpacity style={styles.actionButton} onPress={() => navigation.navigate('Wallet')}>
            <Ionicons name="wallet" size={20} color="#D4AF37" />
            <Text style={styles.actionText}>View Wallet</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.actionButton} onPress={() => navigation.navigate('Profile')}>
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
});