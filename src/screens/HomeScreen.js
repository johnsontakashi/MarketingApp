import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  ScrollView, 
  TouchableOpacity, 
  Alert, 
  StyleSheet,
  Dimensions
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';

const { width } = Dimensions.get('window');

export default function HomeScreen({ navigation }) {
  const [userBalance, setUserBalance] = useState(1250.00);
  const [deviceStatus, setDeviceStatus] = useState('secure');
  const [activeOrders, setActiveOrders] = useState(2);
  const [pendingPayments, setPendingPayments] = useState(50.00);
  const [availableBonuses, setAvailableBonuses] = useState(3);
  const [referralEarnings, setReferralEarnings] = useState(25.00);

  // Quick action buttons data
  const quickActions = [
    { icon: 'storefront', label: 'Shop', screen: 'Marketplace', color: '#D4AF37' },
    { icon: 'card', label: 'Pay', screen: 'Wallet', color: '#B8860B' },
    { icon: 'gift', label: 'Bonuses', screen: 'Community', color: '#CD853F' },
    { icon: 'cube', label: 'Orders', screen: 'Profile', color: '#8B4513' },
    { icon: 'people', label: 'Referrals', screen: 'Community', color: '#A0522D' },
    { icon: 'warning', label: 'Blocking Demo', screen: 'BlockingDemo', color: '#F59E0B' },
    { icon: 'lock-closed', label: 'Lock', action: 'lock', color: '#EF4444' },
  ];

  const handleQuickAction = (screenOrAction) => {
    if (screenOrAction === 'lock') {
      // Trigger the lock screen modal - this will be handled by LockManager
      Alert.alert(
        'Activate Kiosk Mode',
        'This will lock your device for demonstration purposes. You can unlock it from the lock screen.',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Continue', onPress: () => navigation.navigate('LockScreen') }
        ]
      );
    } else {
      navigation.navigate(screenOrAction);
    }
  };

  const handleDeviceStatus = () => {
    navigation.navigate('DeviceStatus');
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <StatusBar style="dark" />
      
      {/* Header Section */}
      <View style={styles.header}>
        <View style={styles.greeting}>
          <Text style={styles.greetingText}>👋 Hi John!</Text>
          <TouchableOpacity style={styles.notificationButton}>
            <Ionicons name="notifications" size={24} color="#D4AF37" />
            <View style={styles.notificationBadge}>
              <Text style={styles.notificationCount}>3</Text>
            </View>
          </TouchableOpacity>
        </View>
        
        <View style={styles.balanceCard}>
          <Text style={styles.balanceLabel}>TLB Wallet Balance</Text>
          <Text style={styles.balanceAmount}>💎 {userBalance.toFixed(2)} TLB</Text>
        </View>

        <TouchableOpacity style={styles.deviceStatusCard} onPress={handleDeviceStatus}>
          <Ionicons 
            name={deviceStatus === 'secure' ? 'shield-checkmark' : 'shield'} 
            size={20} 
            color={deviceStatus === 'secure' ? '#10B981' : '#F59E0B'} 
          />
          <Text style={styles.deviceStatusText}>
            Device: {deviceStatus === 'secure' ? 'Secure' : 'Locked'}
          </Text>
          <Ionicons name="chevron-forward" size={16} color="#8B4513" />
        </TouchableOpacity>
      </View>

      {/* Quick Actions */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.quickActionsGrid}>
          {quickActions.map((action, index) => (
            <TouchableOpacity 
              key={index}
              style={[styles.quickActionButton, { backgroundColor: action.color }]}
              onPress={() => handleQuickAction(action.screen || action.action)}
            >
              <Ionicons name={action.icon} size={24} color="#FFFFFF" />
              <Text style={styles.quickActionLabel}>{action.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Overview Cards */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Your Overview</Text>
        <View style={styles.overviewGrid}>
          <View style={styles.overviewCard}>
            <Text style={styles.overviewNumber}>{activeOrders}</Text>
            <Text style={styles.overviewLabel}>Active Orders</Text>
            <Ionicons name="cube-outline" size={20} color="#D4AF37" />
          </View>
          
          <View style={styles.overviewCard}>
            <Text style={styles.overviewNumber}>💎 {pendingPayments}</Text>
            <Text style={styles.overviewLabel}>Pending Payments</Text>
            <Ionicons name="time-outline" size={20} color="#F59E0B" />
          </View>
          
          <View style={styles.overviewCard}>
            <Text style={styles.overviewNumber}>{availableBonuses}</Text>
            <Text style={styles.overviewLabel}>Available Bonuses</Text>
            <Ionicons name="gift-outline" size={20} color="#10B981" />
          </View>
          
          <View style={styles.overviewCard}>
            <Text style={styles.overviewNumber}>💎 {referralEarnings}</Text>
            <Text style={styles.overviewLabel}>Referral Earnings</Text>
            <Ionicons name="people-outline" size={20} color="#8B4513" />
          </View>
        </View>
      </View>

      {/* Featured Products */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>🔥 Featured Products</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Marketplace')}>
            <Text style={styles.seeAllText}>See All</Text>
          </TouchableOpacity>
        </View>
        
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={styles.featuredProductsContainer}>
            {[1, 2, 3].map((item) => (
              <View key={item} style={styles.productCard}>
                <View style={styles.productImage}>
                  <Ionicons name="image" size={40} color="#D4AF37" />
                </View>
                <Text style={styles.productTitle}>Premium Headphones</Text>
                <Text style={styles.productPrice}>💎 200.00 TLB</Text>
                <View style={styles.productFeatures}>
                  <Text style={styles.featureText}>🎁 50% Support Bonus</Text>
                  <Text style={styles.featureText}>💳 4 Installments</Text>
                </View>
              </View>
            ))}
          </View>
        </ScrollView>
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
    padding: 20,
    paddingTop: 10,
  },
  greeting: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  greetingText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2C1810',
  },
  notificationButton: {
    position: 'relative',
  },
  notificationBadge: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: '#EF4444',
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  notificationCount: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  balanceCard: {
    backgroundColor: '#F5E6A3',
    borderRadius: 12,
    padding: 20,
    marginBottom: 15,
    borderWidth: 2,
    borderColor: '#D4AF37',
  },
  balanceLabel: {
    color: '#8B4513',
    fontSize: 14,
    marginBottom: 5,
  },
  balanceAmount: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2C1810',
  },
  deviceStatusCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: '#D4AF37',
  },
  deviceStatusText: {
    flex: 1,
    marginLeft: 10,
    color: '#2C1810',
    fontSize: 16,
    fontWeight: '500',
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 25,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2C1810',
    marginBottom: 15,
  },
  seeAllText: {
    color: '#D4AF37',
    fontSize: 16,
    fontWeight: '600',
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  quickActionButton: {
    width: (width - 60) / 3,
    aspectRatio: 1,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  quickActionLabel: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
    marginTop: 5,
  },
  overviewGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  overviewCard: {
    width: (width - 50) / 2,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 15,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#D4AF37',
    alignItems: 'center',
  },
  overviewNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2C1810',
    marginBottom: 5,
  },
  overviewLabel: {
    fontSize: 12,
    color: '#8B4513',
    textAlign: 'center',
    marginBottom: 10,
  },
  featuredProductsContainer: {
    flexDirection: 'row',
  },
  productCard: {
    width: 160,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 15,
    marginRight: 15,
    borderWidth: 1,
    borderColor: '#D4AF37',
  },
  productImage: {
    height: 80,
    backgroundColor: '#F5E6A3',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  productTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2C1810',
    marginBottom: 5,
  },
  productPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#D4AF37',
    marginBottom: 8,
  },
  productFeatures: {
    gap: 2,
  },
  featureText: {
    fontSize: 10,
    color: '#8B4513',
  },
});