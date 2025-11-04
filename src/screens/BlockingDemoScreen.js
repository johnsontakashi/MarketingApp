import React, { useState } from 'react';
import { 
  View, 
  Text, 
  ScrollView, 
  TouchableOpacity, 
  StyleSheet, 
  Alert 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import networkManager from '../components/mdm/NetworkManager';
import appRestrictionManager from '../components/mdm/AppRestrictionManager';

export default function BlockingDemoScreen({ navigation }) {
  const [networkStatus, setNetworkStatus] = useState(networkManager.getNetworkStatus());
  const [appRestrictions, setAppRestrictions] = useState(appRestrictionManager.getRestrictionStatus());

  // Simulate different blocking stages
  const simulateWarningStage = () => {
    Alert.alert(
      '⚠️ Warning Stage Demo',
      'This simulates the warning phase where users receive notifications about upcoming restrictions.',
      [{ text: 'OK' }]
    );
  };

  const simulateAppRestrictions = () => {
    appRestrictionManager.enableRestrictions();
    setAppRestrictions(appRestrictionManager.getRestrictionStatus());
    
    // Simulate blocked app detection after 2 seconds
    setTimeout(() => {
      appRestrictionManager.handleAppLaunch('com.facebook.katana', 'Facebook');
    }, 2000);
  };

  const simulateNetworkBlocking = () => {
    networkManager.setNetworkRestriction('restricted');
    setNetworkStatus(networkManager.getNetworkStatus());
    
    // Simulate blocked website access
    setTimeout(() => {
      networkManager.interceptRequest('https://www.facebook.com');
    }, 1000);
  };

  const simulateFullBlock = () => {
    networkManager.setNetworkRestriction('blocked');
    setNetworkStatus(networkManager.getNetworkStatus());
  };

  const removeAllRestrictions = () => {
    appRestrictionManager.disableRestrictions();
    networkManager.setNetworkRestriction('open');
    setAppRestrictions(appRestrictionManager.getRestrictionStatus());
    setNetworkStatus(networkManager.getNetworkStatus());
  };

  const showNetworkStatus = () => {
    const status = networkManager.getNetworkStatus();
    Alert.alert(
      '🌐 Network Status',
      `State: ${status.state}\nBlocked: ${status.isBlocked ? 'Yes' : 'No'}\nAllowed Domains: ${status.allowedDomains.length}\nBlocked Sites: ${status.blockedCount}`,
      [{ text: 'OK' }]
    );
  };

  const showAppStatus = () => {
    appRestrictionManager.showRestrictionSummary();
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      {/* Header */}
      <View style={styles.header}>
        <Ionicons name="warning" size={40} color="#F59E0B" />
        <Text style={styles.title}>Graduated Blocking Demo</Text>
        <Text style={styles.subtitle}>
          Test the progressive restriction system
        </Text>
      </View>

      {/* Current Status */}
      <View style={styles.statusSection}>
        <Text style={styles.sectionTitle}>📊 Current Status</Text>
        
        <View style={styles.statusCard}>
          <View style={styles.statusRow}>
            <Text style={styles.statusLabel}>App Restrictions:</Text>
            <Text style={[styles.statusValue, { color: appRestrictions.isActive ? '#EF4444' : '#10B981' }]}>
              {appRestrictions.isActive ? `${appRestrictions.restrictedCount} blocked` : 'None'}
            </Text>
          </View>
          
          <View style={styles.statusRow}>
            <Text style={styles.statusLabel}>Network Status:</Text>
            <Text style={[styles.statusValue, { color: networkStatus.isBlocked ? '#EF4444' : '#10B981' }]}>
              {networkStatus.state}
            </Text>
          </View>
        </View>
      </View>

      {/* Blocking Stage Demos */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>🔄 Simulate Blocking Stages</Text>
        
        <TouchableOpacity style={styles.demoButton} onPress={simulateWarningStage}>
          <Ionicons name="warning-outline" size={20} color="#F59E0B" />
          <Text style={styles.demoButtonText}>Stage 1: Warning Phase</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.demoButton} onPress={simulateAppRestrictions}>
          <Ionicons name="apps-outline" size={20} color="#F97316" />
          <Text style={styles.demoButtonText}>Stage 2: App Restrictions</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.demoButton} onPress={simulateNetworkBlocking}>
          <Ionicons name="wifi-outline" size={20} color="#EF4444" />
          <Text style={styles.demoButtonText}>Stage 3: Network Blocking</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.demoButton} onPress={simulateFullBlock}>
          <Ionicons name="lock-closed-outline" size={20} color="#DC2626" />
          <Text style={styles.demoButtonText}>Stage 4: Full Lock</Text>
        </TouchableOpacity>
      </View>

      {/* Status Check Actions */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>📋 Check Status</Text>
        
        <TouchableOpacity style={styles.statusButton} onPress={showAppStatus}>
          <Ionicons name="apps" size={20} color="#D4AF37" />
          <Text style={styles.statusButtonText}>App Restriction Status</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.statusButton} onPress={showNetworkStatus}>
          <Ionicons name="wifi" size={20} color="#D4AF37" />
          <Text style={styles.statusButtonText}>Network Status</Text>
        </TouchableOpacity>
      </View>

      {/* Reset Actions */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>🔓 Reset</Text>
        
        <TouchableOpacity style={styles.resetButton} onPress={removeAllRestrictions}>
          <Ionicons name="refresh" size={20} color="#10B981" />
          <Text style={styles.resetButtonText}>Remove All Restrictions</Text>
        </TouchableOpacity>
      </View>

      {/* Information */}
      <View style={styles.infoSection}>
        <Text style={styles.infoTitle}>ℹ️ How It Works</Text>
        <Text style={styles.infoText}>
          • Stage 1: Warning notifications with countdown{'\n'}
          • Stage 2: Block entertainment/social apps{'\n'}
          • Stage 3: Restrict internet to essential services{'\n'}
          • Stage 4: Full device lock (kiosk mode){'\n'}
          {'\n'}
          Each stage has a grace period before escalating to the next level.
        </Text>
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
  header: {
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#F5E6A3',
    borderBottomWidth: 2,
    borderBottomColor: '#D4AF37',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2C1810',
    marginTop: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#8B4513',
    marginTop: 5,
    textAlign: 'center',
  },
  statusSection: {
    padding: 20,
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2C1810',
    marginBottom: 15,
  },
  statusCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#D4AF37',
  },
  statusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  statusLabel: {
    fontSize: 14,
    color: '#8B4513',
  },
  statusValue: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  demoButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 15,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#F59E0B',
  },
  demoButtonText: {
    fontSize: 16,
    color: '#2C1810',
    marginLeft: 10,
    fontWeight: '500',
  },
  statusButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 15,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#D4AF37',
  },
  statusButtonText: {
    fontSize: 16,
    color: '#2C1810',
    marginLeft: 10,
    fontWeight: '500',
  },
  resetButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#10B981',
    borderRadius: 8,
    padding: 15,
    justifyContent: 'center',
  },
  resetButtonText: {
    fontSize: 16,
    color: '#FFFFFF',
    marginLeft: 10,
    fontWeight: 'bold',
  },
  infoSection: {
    margin: 20,
    padding: 16,
    backgroundColor: '#E0F2FE',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#0EA5E9',
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0C4A6E',
    marginBottom: 10,
  },
  infoText: {
    fontSize: 14,
    color: '#0C4A6E',
    lineHeight: 20,
  },
});