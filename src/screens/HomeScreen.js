import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  ScrollView, 
  TouchableOpacity, 
  Alert, 
  StyleSheet,
  Dimensions,
  Image,
  Modal,
  FlatList
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import * as SecureStore from 'expo-secure-store';
import CustomAlert from '../components/ui/CustomAlert';
import { useCustomAlert } from '../hooks/useCustomAlert';

const { width } = Dimensions.get('window');

export default function HomeScreen({ navigation }) {
  const { alertConfig, showAlert, hideAlert, showSuccess, showError, showWarning, showInfo, showConfirm } = useCustomAlert();
  
  const [userName, setUserName] = useState('User');
  const [userBalance, setUserBalance] = useState(1250.00);
  const [deviceStatus, setDeviceStatus] = useState('secure');
  const [activeOrders, setActiveOrders] = useState(2);
  const [pendingPayments, setPendingPayments] = useState(50.00);
  const [availableBonuses, setAvailableBonuses] = useState(3);
  const [referralEarnings, setReferralEarnings] = useState(25.00);
  const [showNotificationModal, setShowNotificationModal] = useState(false);

  // Load user data when component mounts
  useEffect(() => {
    const loadUserData = async () => {
      try {
        const storedUser = await SecureStore.getItemAsync('currentUser');
        if (storedUser) {
          const userData = JSON.parse(storedUser);
          const firstName = userData.first_name || userData.firstName || 'User';
          setUserName(firstName);
          
          // Also set balance if available from user data
          if (userData.balance !== undefined) {
            setUserBalance(userData.balance);
          }
        }
      } catch (error) {
        console.error('Error loading user data:', error);
      }
    };

    loadUserData();
  }, []);

  // Featured products data
  const featuredProducts = [
    {
      id: 1,
      title: 'Premium Wireless Headphones',
      price: 200.00,
      originalPrice: 250.00,
      image: require('../../assets/pic1.jpeg'),
      supportBonus: 50,
      installments: 4
    },
    {
      id: 2,
      title: 'Smart Fitness Watch',
      price: 150.00,
      image: require('../../assets/pic2.jpeg'),
      supportBonus: 45,
      installments: 3
    },
    {
      id: 3,
      title: 'Gaming Mouse Pro',
      price: 75.00,
      image: require('../../assets/pic3.jpeg'),
      supportBonus: 40,
      installments: 2
    }
  ];

  // Quick action buttons data
  const quickActions = [
    { icon: 'storefront', label: 'Shop', screen: 'Marketplace', color: '#D4AF37' },
    { icon: 'card', label: 'Pay', screen: 'Wallet', color: '#B8860B' },
    { icon: 'gift', label: 'Bonuses', screen: 'Community', color: '#CD853F' },
    { icon: 'cube', label: 'Orders', screen: 'Profile', color: '#8B4513' },
    { icon: 'people', label: 'Referrals', screen: 'Community', color: '#A0522D' },
    { icon: 'warning', label: 'Blocking Demo', screen: 'BlockingDemo', color: '#F59E0B' },
    // Lock button removed - only admins should control device locking
  ];

  const handleQuickAction = (screenOrAction) => {
    // Lock functionality removed - only admins can control device locking
    if (screenOrAction) {
      navigation.navigate(screenOrAction);
    }
  };

  const handleDeviceStatus = () => {
    navigation.navigate('DeviceStatus');
  };

  // Notification data with state
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: 'payment',
      icon: 'card-outline',
      title: 'Payment Reminder',
      message: 'Next payment due in 3 days',
      time: '2 hours ago',
      color: '#F59E0B',
      unread: true
    },
    {
      id: 2,
      type: 'security',
      icon: 'shield-checkmark-outline',
      title: 'Security Update',
      message: 'Device successfully secured with MDM Lock',
      time: '5 hours ago',
      color: '#10B981',
      unread: true
    },
    {
      id: 3,
      type: 'bonus',
      icon: 'gift-outline',
      title: 'Daily Bonus Available',
      message: 'Claim your daily login bonus now!',
      time: '1 day ago',
      color: '#8B5CF6',
      unread: true
    },
    {
      id: 4,
      type: 'order',
      icon: 'cube-outline',
      title: 'Order Update',
      message: 'Your order #12345 has been shipped',
      time: '2 days ago',
      color: '#06B6D4',
      unread: false
    },
    {
      id: 5,
      type: 'referral',
      icon: 'people-outline',
      title: 'New Referral',
      message: 'Sarah joined your network. Earn 💎 25 TLB bonus!',
      time: '3 days ago',
      color: '#D4AF37',
      unread: false
    },
    {
      id: 6,
      type: 'promotion',
      icon: 'pricetag-outline',
      title: 'Special Promotion',
      message: '50% off on premium headphones - Limited time offer',
      time: '4 days ago',
      color: '#EF4444',
      unread: false
    }
  ]);

  const handleNotifications = () => {
    setShowNotificationModal(true);
  };

  const handleMarkAsRead = (notificationId) => {
    // Mark specific notification as read
    setNotifications(prevNotifications => 
      prevNotifications.map(notification => 
        notification.id === notificationId 
          ? { ...notification, unread: false }
          : notification
      )
    );
    
    // Update available bonuses counter
    if (availableBonuses > 0) {
      setAvailableBonuses(prev => Math.max(0, prev - 1));
    }
  };

  const handleMarkAllAsRead = () => {
    // Mark all notifications as read
    setNotifications(prevNotifications => 
      prevNotifications.map(notification => ({ 
        ...notification, 
        unread: false 
      }))
    );
    
    // Reset available bonuses counter
    setAvailableBonuses(0);
  };

  const renderNotificationItem = ({ item }) => (
    <TouchableOpacity 
      style={[styles.notificationItem, item.unread && styles.unreadNotification]}
      onPress={() => handleMarkAsRead(item.id)}
    >
      <View style={[styles.notificationIcon, { backgroundColor: item.color }]}>
        <Ionicons name={item.icon} size={20} color="#FFFFFF" />
      </View>
      
      <View style={styles.notificationContent}>
        <View style={styles.notificationHeader}>
          <Text style={styles.notificationTitle}>{item.title}</Text>
          <Text style={styles.notificationTime}>{item.time}</Text>
        </View>
        <Text style={styles.notificationMessage}>{item.message}</Text>
      </View>
      
      {item.unread && <View style={styles.unreadDot} />}
    </TouchableOpacity>
  );

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <StatusBar style="dark" />
      
      {/* Header Section */}
      <View style={styles.header}>
        <View style={styles.greeting}>
          <Text style={styles.greetingText}>👋 Hi {userName}!</Text>
          <TouchableOpacity style={styles.notificationButton} onPress={handleNotifications}>
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
        <Text style={styles.sectionTitle}>⚡ Quick Actions</Text>
        <View style={styles.quickActionsContainer}>
          {/* First Row - 4 buttons */}
          <View style={styles.quickActionsRow}>
            {quickActions.slice(0, 4).map((action, index) => (
              <TouchableOpacity 
                key={index}
                style={[styles.quickActionButton, { backgroundColor: action.color }]}
                onPress={() => handleQuickAction(action.screen || action.action)}
              >
                <View style={styles.quickActionIconContainer}>
                  <Ionicons name={action.icon} size={22} color="#FFFFFF" />
                </View>
                <Text style={styles.quickActionLabel}>{action.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
          
          {/* Second Row - 3 buttons */}
          <View style={styles.quickActionsRow}>
            {quickActions.slice(4, 7).map((action, index) => (
              <TouchableOpacity 
                key={index + 4}
                style={[styles.quickActionButton, { backgroundColor: action.color }]}
                onPress={() => handleQuickAction(action.screen || action.action)}
              >
                <View style={styles.quickActionIconContainer}>
                  <Ionicons name={action.icon} size={22} color="#FFFFFF" />
                </View>
                <Text style={styles.quickActionLabel}>{action.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
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
            {featuredProducts.map((product) => (
              <TouchableOpacity 
                key={product.id} 
                style={styles.productCard}
                onPress={() => navigation.navigate('Marketplace')}
              >
                <View style={styles.productImageContainer}>
                  <Image 
                    source={product.image} 
                    style={styles.productImage}
                    resizeMode="cover"
                  />
                  {product.originalPrice && (
                    <View style={styles.discountBadge}>
                      <Text style={styles.discountText}>SALE</Text>
                    </View>
                  )}
                </View>
                
                <View style={styles.productInfo}>
                  <Text style={styles.productTitle} numberOfLines={2}>
                    {product.title}
                  </Text>
                  
                  <View style={styles.priceContainer}>
                    <Text style={styles.productPrice}>💎 {product.price.toFixed(2)} TLB</Text>
                    {product.originalPrice && (
                      <Text style={styles.originalPrice}>💎 {product.originalPrice.toFixed(2)}</Text>
                    )}
                  </View>
                  
                  <View style={styles.productFeatures}>
                    <Text style={styles.featureText}>🎁 {product.supportBonus}% Bonus</Text>
                    <Text style={styles.featureText}>💳 {product.installments} Payments</Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </View>

      {/* Notification Modal */}
      <Modal
        visible={showNotificationModal}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowNotificationModal(false)}
      >
        <View style={styles.notificationModalContainer}>
          {/* Modal Header */}
          <View style={styles.notificationModalHeader}>
            <View style={styles.notificationModalTitleContainer}>
              <Ionicons name="notifications" size={24} color="#D4AF37" />
              <Text style={styles.notificationModalTitle}>Notifications</Text>
            </View>
            <TouchableOpacity 
              style={styles.closeButton}
              onPress={() => setShowNotificationModal(false)}
            >
              <Ionicons name="close" size={24} color="#8B4513" />
            </TouchableOpacity>
          </View>

          {/* Action Buttons */}
          <View style={styles.notificationActions}>
            <TouchableOpacity 
              style={[
                styles.markAllReadButton,
                notifications.every(n => !n.unread) && styles.markAllReadButtonDisabled
              ]}
              onPress={handleMarkAllAsRead}
              disabled={notifications.every(n => !n.unread)}
            >
              <Ionicons 
                name="checkmark-done" 
                size={18} 
                color={notifications.every(n => !n.unread) ? "#8B4513" : "#FFFFFF"} 
              />
              <Text style={[
                styles.markAllReadText,
                notifications.every(n => !n.unread) && styles.markAllReadTextDisabled
              ]}>
                {notifications.every(n => !n.unread) ? 'All Read' : 'Mark All Read'}
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.settingsButton}
              onPress={() => {
                setShowNotificationModal(false);
                navigation.navigate('Profile');
              }}
            >
              <Ionicons name="settings-outline" size={18} color="#D4AF37" />
              <Text style={styles.settingsButtonText}>Settings</Text>
            </TouchableOpacity>
          </View>

          {/* Notifications List */}
          <FlatList
            data={notifications}
            renderItem={renderNotificationItem}
            keyExtractor={(item) => item.id.toString()}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.notificationsList}
            ItemSeparatorComponent={() => <View style={styles.notificationSeparator} />}
          />
        </View>
      </Modal>

      {/* Custom Alert */}
      <CustomAlert
        visible={alertConfig.visible}
        onClose={hideAlert}
        title={alertConfig.title}
        message={alertConfig.message}
        buttons={alertConfig.buttons}
        type={alertConfig.type}
        icon={alertConfig.icon}
      />
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
  quickActionsContainer: {
    gap: 12,
  },
  quickActionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 2,
  },
  quickActionButton: {
    flex: 1,
    aspectRatio: 1.1,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 5,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  quickActionIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  quickActionLabel: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
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
    width: 180,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 12,
    marginRight: 15,
    borderWidth: 1,
    borderColor: '#D4AF37',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  productImageContainer: {
    position: 'relative',
    marginBottom: 10,
  },
  productImage: {
    width: '100%',
    height: 100,
    borderRadius: 12,
    backgroundColor: '#F5E6A3',
  },
  discountBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: '#EF4444',
    borderRadius: 6,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  discountText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: 'bold',
  },
  productInfo: {
    flex: 1,
  },
  productTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2C1810',
    marginBottom: 8,
    lineHeight: 18,
  },
  priceContainer: {
    marginBottom: 8,
  },
  productPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#D4AF37',
    marginBottom: 2,
  },
  originalPrice: {
    fontSize: 12,
    color: '#8B4513',
    textDecorationLine: 'line-through',
  },
  productFeatures: {
    gap: 3,
  },
  featureText: {
    fontSize: 10,
    color: '#8B4513',
    backgroundColor: '#F5E6A3',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    overflow: 'hidden',
  },
  // Notification Modal Styles
  notificationModalContainer: {
    flex: 1,
    backgroundColor: '#FFF8E7',
  },
  notificationModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingTop: 60,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F0E5B8',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  notificationModalTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  notificationModalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2C1810',
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F5E6A3',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#D4AF37',
  },
  notificationActions: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 15,
    gap: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F0E5B8',
  },
  markAllReadButton: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#10B981',
    paddingVertical: 12,
    borderRadius: 12,
    gap: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  markAllReadText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  markAllReadButtonDisabled: {
    backgroundColor: '#F5E6A3',
    borderWidth: 1,
    borderColor: '#D4AF37',
  },
  markAllReadTextDisabled: {
    color: '#8B4513',
  },
  settingsButton: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#D4AF37',
    gap: 8,
  },
  settingsButtonText: {
    color: '#D4AF37',
    fontSize: 16,
    fontWeight: '600',
  },
  notificationsList: {
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  notificationItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#F0E5B8',
  },
  unreadNotification: {
    backgroundColor: '#FFFEF7',
    borderColor: '#D4AF37',
    borderLeftWidth: 4,
    borderLeftColor: '#D4AF37',
  },
  notificationIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  notificationContent: {
    flex: 1,
  },
  notificationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 4,
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2C1810',
    flex: 1,
    marginRight: 8,
  },
  notificationTime: {
    fontSize: 12,
    color: '#8B4513',
    fontWeight: '500',
  },
  notificationMessage: {
    fontSize: 14,
    color: '#5D4E37',
    lineHeight: 20,
    marginTop: 2,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#EF4444',
    marginLeft: 8,
    marginTop: 6,
  },
  notificationSeparator: {
    height: 12,
  },
});