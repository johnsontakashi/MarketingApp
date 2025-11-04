import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Alert, Modal, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function ProfileScreen({ navigation }) {
  const [showEditModal, setShowEditModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showHelpModal, setShowHelpModal] = useState(false);
  const [showNotificationsModal, setShowNotificationsModal] = useState(false);
  const [profileData, setProfileData] = useState({
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '+1 (555) 123-4567',
    address: '123 Main Street, City, State 12345'
  });
  const [editData, setEditData] = useState({ ...profileData });

  const menuItems = [
    { icon: 'person', title: 'Edit Profile', subtitle: 'Update your information', action: 'editProfile' },
    { icon: 'cube', title: 'My Orders', subtitle: 'View order history', action: 'orders' },
    { icon: 'card', title: 'Payment Methods', subtitle: 'Manage payment options', action: 'payments' },
    { icon: 'shield-checkmark', title: 'Device Status', subtitle: 'Check security status', action: 'deviceStatus' },
    { icon: 'notifications', title: 'Notifications', subtitle: 'Manage preferences', action: 'notifications' },
    { icon: 'help-circle', title: 'Help & Support', subtitle: 'Get assistance', action: 'support' },
    { icon: 'settings', title: 'Settings', subtitle: 'App preferences', action: 'settings' },
    { icon: 'log-out', title: 'Sign Out', subtitle: 'Exit your account', action: 'signOut' },
  ];

  const handleEditProfile = () => {
    setEditData({ ...profileData });
    setShowEditModal(true);
  };

  const handleSaveProfile = () => {
    setProfileData({ ...editData });
    setShowEditModal(false);
    Alert.alert('Profile Updated', 'Your profile has been successfully updated!');
  };

  const handleCancelEdit = () => {
    setEditData({ ...profileData });
    setShowEditModal(false);
  };

  const handleMyOrders = () => {
    const orderHistory = [
      {
        id: 'ORD-001',
        date: '2024-02-20',
        status: 'Delivered',
        total: 200.00,
        items: [
          { name: 'Premium Wireless Headphones', price: 200.00, qty: 1 }
        ]
      },
      {
        id: 'ORD-002',
        date: '2024-02-15',
        status: 'Processing',
        total: 150.00,
        items: [
          { name: 'Smart Fitness Watch', price: 150.00, qty: 1 }
        ]
      },
      {
        id: 'ORD-003',
        date: '2024-02-10',
        status: 'Shipped',
        total: 160.00,
        items: [
          { name: 'Gaming Mouse Pro', price: 75.00, qty: 1 },
          { name: 'Bluetooth Speaker', price: 85.00, qty: 1 }
        ]
      },
      {
        id: 'ORD-004',
        date: '2024-02-05',
        status: 'Delivered',
        total: 45.00,
        items: [
          { name: 'Wireless Charging Pad', price: 45.00, qty: 1 }
        ]
      },
      {
        id: 'ORD-005',
        date: '2024-01-28',
        status: 'Cancelled',
        total: 25.00,
        items: [
          { name: 'Smart LED Bulb', price: 25.00, qty: 1 }
        ]
      }
    ];

    const orderSummary = orderHistory.map(order => {
      const itemsList = order.items.map(item => `  • ${item.name} (×${item.qty}) - 💎 ${item.price}`).join('\n');
      const statusEmoji = order.status === 'Delivered' ? '✅' : 
                         order.status === 'Shipped' ? '🚚' : 
                         order.status === 'Processing' ? '⏳' : 
                         order.status === 'Cancelled' ? '❌' : '📦';
      
      return `${statusEmoji} ${order.id} (${order.date})\nStatus: ${order.status}\nTotal: 💎 ${order.total} TLB\nItems:\n${itemsList}`;
    }).join('\n\n─────────────────────\n\n');

    const totalOrders = orderHistory.length;
    const totalSpent = orderHistory
      .filter(order => order.status !== 'Cancelled')
      .reduce((sum, order) => sum + order.total, 0);
    const deliveredOrders = orderHistory.filter(order => order.status === 'Delivered').length;

    Alert.alert(
      '📦 My Order History',
      `Your complete order history:\n\n${orderSummary}\n\n📊 Summary:\n• Total Orders: ${totalOrders}\n• Delivered: ${deliveredOrders}\n• Total Spent: 💎 ${totalSpent} TLB\n• Active Orders: ${orderHistory.filter(o => o.status === 'Processing' || o.status === 'Shipped').length}`,
      [
        { text: 'Track Order', onPress: () => Alert.alert('Track Order', 'Order tracking feature coming soon!') },
        { text: 'Reorder', onPress: () => Alert.alert('Reorder', 'Quick reorder feature coming soon!') },
        { text: 'Close', style: 'cancel' }
      ]
    );
  };

  const handlePaymentMethods = () => {
    const paymentMethods = [
      {
        id: 'pm_001',
        type: 'TLB Wallet',
        details: 'Primary Payment Method',
        balance: '💎 1,250.00 TLB',
        status: 'Active',
        default: true,
        icon: '💎'
      },
      {
        id: 'pm_002',
        type: 'Credit Card',
        details: '**** **** **** 4532',
        brand: 'Visa',
        expiry: '12/27',
        status: 'Active',
        default: false,
        icon: '💳'
      },
      {
        id: 'pm_003',
        type: 'Bank Account',
        details: 'Chase Bank ****1234',
        routing: 'ACH Transfer',
        status: 'Verified',
        default: false,
        icon: '🏦'
      },
      {
        id: 'pm_004',
        type: 'PayPal',
        details: 'john.doe@example.com',
        status: 'Connected',
        default: false,
        icon: '🅿️'
      },
      {
        id: 'pm_005',
        type: 'Gift Card',
        details: 'TLB Gift Card ****8765',
        balance: '💎 50.00 TLB',
        status: 'Active',
        default: false,
        icon: '🎁'
      }
    ];

    const methodsList = paymentMethods.map(method => {
      const statusEmoji = method.status === 'Active' ? '✅' : 
                         method.status === 'Verified' ? '✅' : 
                         method.status === 'Connected' ? '🔗' : '⚠️';
      const defaultText = method.default ? ' (Default)' : '';
      const balanceText = method.balance ? `\nBalance: ${method.balance}` : '';
      const additionalInfo = method.brand ? `\nBrand: ${method.brand} | Expires: ${method.expiry}` :
                             method.routing ? `\nType: ${method.routing}` : '';
      
      return `${method.icon} ${method.type}${defaultText}\n${statusEmoji} ${method.details}${balanceText}${additionalInfo}`;
    }).join('\n\n─────────────────────\n\n');

    const totalMethods = paymentMethods.length;
    const activeMethods = paymentMethods.filter(method => 
      method.status === 'Active' || method.status === 'Verified' || method.status === 'Connected'
    ).length;
    const defaultMethod = paymentMethods.find(method => method.default);
    const tlbBalance = paymentMethods.find(method => method.type === 'TLB Wallet')?.balance || '💎 0.00';

    Alert.alert(
      '💳 Payment Methods',
      `Your saved payment methods:\n\n${methodsList}\n\n📊 Summary:\n• Total Methods: ${totalMethods}\n• Active Methods: ${activeMethods}\n• Default: ${defaultMethod?.type || 'None'}\n• TLB Wallet: ${tlbBalance}\n\n⚡ All payments are secured with 256-bit encryption`,
      [
        { text: 'Add New Method', onPress: () => Alert.alert('Add Payment', 'New payment method setup coming soon!') },
        { text: 'Manage Methods', onPress: () => Alert.alert('Manage', 'Payment method management coming soon!') },
        { text: 'Close', style: 'cancel' }
      ]
    );
  };

  const handleSettings = () => {
    const appSettings = [
      {
        category: 'Security',
        icon: '🔒',
        settings: [
          { name: 'Two-Factor Authentication', value: 'Enabled', status: '✅' },
          { name: 'Biometric Login', value: 'Face ID Enabled', status: '✅' },
          { name: 'Auto-Lock Timer', value: '5 minutes', status: '⏰' },
          { name: 'Device Lock on SIM Removal', value: 'Active', status: '🔐' }
        ]
      },
      {
        category: 'Notifications',
        icon: '🔔',
        settings: [
          { name: 'Push Notifications', value: 'Enabled', status: '✅' },
          { name: 'Payment Alerts', value: 'Enabled', status: '💳' },
          { name: 'Order Updates', value: 'Enabled', status: '📦' },
          { name: 'Community Alerts', value: 'Enabled', status: '👥' },
          { name: 'Bonus Notifications', value: 'Enabled', status: '🎁' }
        ]
      },
      {
        category: 'Privacy',
        icon: '🛡️',
        settings: [
          { name: 'Data Sharing', value: 'Limited', status: '🔒' },
          { name: 'Analytics', value: 'Anonymous Only', status: '📊' },
          { name: 'Location Services', value: 'App Only', status: '📍' },
          { name: 'Profile Visibility', value: 'Community Only', status: '👁️' }
        ]
      },
      {
        category: 'App Preferences',
        icon: '⚙️',
        settings: [
          { name: 'Theme', value: 'Golden (Default)', status: '🎨' },
          { name: 'Language', value: 'English (US)', status: '🌐' },
          { name: 'Currency Display', value: 'TLB Diamond', status: '💎' },
          { name: 'Auto-Update', value: 'Wi-Fi Only', status: '🔄' }
        ]
      },
      {
        category: 'Advanced',
        icon: '🔧',
        settings: [
          { name: 'Developer Mode', value: 'Disabled', status: '🚫' },
          { name: 'Debug Logging', value: 'Disabled', status: '📝' },
          { name: 'Beta Features', value: 'Enabled', status: '🧪' },
          { name: 'Performance Mode', value: 'Balanced', status: '⚡' }
        ]
      }
    ];

    const settingsDisplay = appSettings.map(category => {
      const categorySettings = category.settings.map(setting => 
        `  ${setting.status} ${setting.name}: ${setting.value}`
      ).join('\n');
      
      return `${category.icon} ${category.category}:\n${categorySettings}`;
    }).join('\n\n─────────────────────\n\n');

    const totalSettings = appSettings.reduce((total, category) => total + category.settings.length, 0);
    const enabledSettings = appSettings.reduce((total, category) => 
      total + category.settings.filter(setting => setting.value.includes('Enabled') || setting.value.includes('Active')).length, 0
    );

    setShowSettingsModal(true);
  };

  const handleHelpSupport = () => {
    setShowHelpModal(true);
  };

  const handleNotifications = () => {
    setShowNotificationsModal(true);
  };

  const handleMenuPress = (action) => {
    switch (action) {
      case 'editProfile':
        handleEditProfile();
        break;
      case 'orders':
        handleMyOrders();
        break;
      case 'payments':
        handlePaymentMethods();
        break;
      case 'settings':
        handleSettings();
        break;
      case 'support':
        handleHelpSupport();
        break;
      case 'notifications':
        handleNotifications();
        break;
      case 'deviceStatus':
        navigation.navigate('DeviceStatus');
        break;
      case 'signOut':
        Alert.alert(
          'Sign Out',
          'Are you sure you want to sign out?',
          [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Sign Out', style: 'destructive', onPress: () => Alert.alert('Signed Out') }
          ]
        );
        break;
      default:
        Alert.alert('Coming Soon', `${action} functionality will be available soon!`);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      {/* Profile Header */}
      <View style={styles.profileHeader}>
        <View style={styles.avatarContainer}>
          <Ionicons name="person" size={40} color="#D4AF37" />
        </View>
        <View style={styles.profileInfo}>
          <Text style={styles.profileName}>{profileData.name}</Text>
          <Text style={styles.profileEmail}>{profileData.email}</Text>
          <View style={styles.verificationBadge}>
            <Ionicons name="checkmark-circle" size={16} color="#10B981" />
            <Text style={styles.verificationText}>Verified</Text>
          </View>
        </View>
        <TouchableOpacity style={styles.editButton} onPress={handleEditProfile}>
          <Ionicons name="create" size={20} color="#D4AF37" />
        </TouchableOpacity>
      </View>

      {/* Quick Stats */}
      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>15</Text>
          <Text style={styles.statLabel}>Orders</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>12</Text>
          <Text style={styles.statLabel}>Referrals</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>💎 2.5K</Text>
          <Text style={styles.statLabel}>Earned</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>7</Text>
          <Text style={styles.statLabel}>Streak</Text>
        </View>
      </View>

      {/* Menu Items */}
      <View style={styles.menuContainer}>
        {menuItems.map((item, index) => (
          <TouchableOpacity 
            key={index}
            style={[
              styles.menuItem,
              item.action === 'signOut' && styles.signOutItem
            ]}
            onPress={() => handleMenuPress(item.action)}
          >
            <View style={[
              styles.menuIcon,
              item.action === 'signOut' && styles.signOutIcon
            ]}>
              <Ionicons 
                name={item.icon} 
                size={20} 
                color={item.action === 'signOut' ? '#EF4444' : '#D4AF37'} 
              />
            </View>
            <View style={styles.menuContent}>
              <Text style={[
                styles.menuTitle,
                item.action === 'signOut' && styles.signOutText
              ]}>
                {item.title}
              </Text>
              <Text style={styles.menuSubtitle}>{item.subtitle}</Text>
            </View>
            <Ionicons 
              name="chevron-forward" 
              size={16} 
              color="#8B4513" 
            />
          </TouchableOpacity>
        ))}
      </View>

      {/* App Version */}
      <View style={styles.versionContainer}>
        <Text style={styles.versionText}>TLB Diamond v1.0.0</Text>
        <Text style={styles.buildText}>Build 2024.10.29</Text>
      </View>

      {/* Notifications Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={showNotificationsModal}
        onRequestClose={() => setShowNotificationsModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>🔔 Notifications</Text>
              <TouchableOpacity onPress={() => setShowNotificationsModal(false)}>
                <Ionicons name="close" size={24} color="#8B4513" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalContent}>
              <Text style={styles.notificationDescription}>
                Your notification center
              </Text>
              
              {/* Summary Stats */}
              <View style={styles.notificationSummary}>
                <Text style={styles.summaryTitle}>📊 Summary</Text>
                <View style={styles.summaryStatsGrid}>
                  <View style={styles.summaryStatCard}>
                    <Text style={styles.summaryStatNumber}>5</Text>
                    <Text style={styles.summaryStatLabel}>Total</Text>
                  </View>
                  <View style={styles.summaryStatCard}>
                    <Text style={styles.summaryStatNumber}>2</Text>
                    <Text style={styles.summaryStatLabel}>Unread</Text>
                  </View>
                  <View style={styles.summaryStatCard}>
                    <Text style={styles.summaryStatNumber}>3</Text>
                    <Text style={styles.summaryStatLabel}>Read</Text>
                  </View>
                </View>
              </View>
              
              {/* Recent Notifications */}
              <View style={styles.notificationSection}>
                <Text style={styles.notificationSectionTitle}>🔔 Recent Notifications</Text>
                
                <TouchableOpacity style={[styles.notificationItem, styles.unreadNotification]}>
                  <View style={styles.notificationIcon}>
                    <Text style={styles.notificationEmoji}>💳</Text>
                  </View>
                  <View style={styles.notificationContent}>
                    <Text style={styles.notificationTitle}>Payment Reminder</Text>
                    <Text style={styles.notificationMessage}>Next payment due in 3 days for your Wireless Headphones order</Text>
                    <Text style={styles.notificationTime}>2 hours ago</Text>
                  </View>
                  <View style={styles.notificationStatus}>
                    <View style={[styles.priorityDot, { backgroundColor: '#EF4444' }]} />
                    <View style={styles.unreadDot} />
                  </View>
                </TouchableOpacity>
                
                <TouchableOpacity style={[styles.notificationItem, styles.unreadNotification]}>
                  <View style={styles.notificationIcon}>
                    <Text style={styles.notificationEmoji}>🎁</Text>
                  </View>
                  <View style={styles.notificationContent}>
                    <Text style={styles.notificationTitle}>Daily Login Bonus Available</Text>
                    <Text style={styles.notificationMessage}>Claim your 7-day streak bonus: 📎 5.00 TLB</Text>
                    <Text style={styles.notificationTime}>4 hours ago</Text>
                  </View>
                  <View style={styles.notificationStatus}>
                    <View style={[styles.priorityDot, { backgroundColor: '#F59E0B' }]} />
                    <View style={styles.unreadDot} />
                  </View>
                </TouchableOpacity>
                
                <TouchableOpacity style={styles.notificationItem}>
                  <View style={styles.notificationIcon}>
                    <Text style={styles.notificationEmoji}>🔒</Text>
                  </View>
                  <View style={styles.notificationContent}>
                    <Text style={styles.notificationTitle}>Security Update Complete</Text>
                    <Text style={styles.notificationMessage}>Your device has been successfully secured with latest updates</Text>
                    <Text style={styles.notificationTime}>1 day ago</Text>
                  </View>
                  <View style={styles.notificationStatus}>
                    <View style={[styles.priorityDot, { backgroundColor: '#10B981' }]} />
                    <Ionicons name="checkmark" size={12} color="#10B981" />
                  </View>
                </TouchableOpacity>
                
                <TouchableOpacity style={styles.notificationItem}>
                  <View style={styles.notificationIcon}>
                    <Text style={styles.notificationEmoji}>🚚</Text>
                  </View>
                  <View style={styles.notificationContent}>
                    <Text style={styles.notificationTitle}>Order Shipped</Text>
                    <Text style={styles.notificationMessage}>Your Gaming Mouse Pro has been shipped! Track: #TLB123456</Text>
                    <Text style={styles.notificationTime}>2 days ago</Text>
                  </View>
                  <View style={styles.notificationStatus}>
                    <View style={[styles.priorityDot, { backgroundColor: '#F59E0B' }]} />
                    <Ionicons name="checkmark" size={12} color="#10B981" />
                  </View>
                </TouchableOpacity>
                
                <TouchableOpacity style={styles.notificationItem}>
                  <View style={styles.notificationIcon}>
                    <Text style={styles.notificationEmoji}>👥</Text>
                  </View>
                  <View style={styles.notificationContent}>
                    <Text style={styles.notificationTitle}>New Referral Bonus</Text>
                    <Text style={styles.notificationMessage}>Sarah M. joined using your referral code. You earned 📎 2.50 TLB</Text>
                    <Text style={styles.notificationTime}>3 days ago</Text>
                  </View>
                  <View style={styles.notificationStatus}>
                    <View style={[styles.priorityDot, { backgroundColor: '#10B981' }]} />
                    <Ionicons name="checkmark" size={12} color="#10B981" />
                  </View>
                </TouchableOpacity>
              </View>
              
              {/* Notification Settings */}
              <View style={styles.notificationSection}>
                <Text style={styles.notificationSectionTitle}>⚙️ Current Settings</Text>
                
                <View style={styles.settingItem}>
                  <View style={styles.settingInfo}>
                    <Text style={styles.settingName}>Push Notifications</Text>
                    <Text style={styles.settingDescription}>Receive notifications on your device</Text>
                  </View>
                  <View style={styles.settingToggle}>
                    <Text style={styles.settingStatus}>✅</Text>
                  </View>
                </View>
                
                <View style={styles.settingItem}>
                  <View style={styles.settingInfo}>
                    <Text style={styles.settingName}>Payment Alerts</Text>
                    <Text style={styles.settingDescription}>Reminders for upcoming payments</Text>
                  </View>
                  <View style={styles.settingToggle}>
                    <Text style={styles.settingStatus}>✅</Text>
                  </View>
                </View>
                
                <View style={styles.settingItem}>
                  <View style={styles.settingInfo}>
                    <Text style={styles.settingName}>Order Updates</Text>
                    <Text style={styles.settingDescription}>Shipping and delivery notifications</Text>
                  </View>
                  <View style={styles.settingToggle}>
                    <Text style={styles.settingStatus}>✅</Text>
                  </View>
                </View>
                
                <View style={styles.settingItem}>
                  <View style={styles.settingInfo}>
                    <Text style={styles.settingName}>Community Updates</Text>
                    <Text style={styles.settingDescription}>Referral and community activity</Text>
                  </View>
                  <View style={styles.settingToggle}>
                    <Text style={styles.settingStatus}>❌</Text>
                  </View>
                </View>
              </View>
              
              {/* Tip */}
              <View style={styles.notificationTip}>
                <Ionicons name="bulb" size={16} color="#F59E0B" />
                <Text style={styles.notificationTipText}>
                  Tap on any notification to view details and take action. Manage all settings from the main settings menu.
                </Text>
              </View>
            </ScrollView>

            <View style={styles.notificationActions}>
              <TouchableOpacity 
                style={styles.markReadButton}
                onPress={() => {
                  setShowNotificationsModal(false);
                  Alert.alert('Marked as Read', 'All notifications have been marked as read!');
                }}
              >
                <Ionicons name="checkmark-done" size={16} color="#FFFFFF" />
                <Text style={styles.markReadText}>Mark All Read</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.manageButton}
                onPress={() => {
                  setShowNotificationsModal(false);
                  Alert.alert('Notification Settings', 'Notification preferences can be customized in the full settings menu.\n\nComing features:\n• Custom notification times\n• Priority filtering\n• Sound preferences\n• Do not disturb schedules');
                }}
              >
                <Ionicons name="settings" size={16} color="#FFFFFF" />
                <Text style={styles.manageText}>Manage Settings</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Help & Support Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={showHelpModal}
        onRequestClose={() => setShowHelpModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>🆘 Help & Support</Text>
              <TouchableOpacity onPress={() => setShowHelpModal(false)}>
                <Ionicons name="close" size={24} color="#8B4513" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalContent}>
              <Text style={styles.helpDescription}>
                Get assistance with TLB Diamond
              </Text>
              
              {/* Quick Help Section */}
              <View style={styles.helpSection}>
                <Text style={styles.helpSectionTitle}>⚡ Quick Help</Text>
                
                <TouchableOpacity style={styles.helpItem}>
                  <View style={styles.helpItemIcon}>
                    <Ionicons name="person-circle" size={24} color="#D4AF37" />
                  </View>
                  <View style={styles.helpItemContent}>
                    <Text style={styles.helpItemTitle}>Account Issues</Text>
                    <Text style={styles.helpItemDescription}>Login, profile, verification problems</Text>
                  </View>
                  <Ionicons name="chevron-forward" size={16} color="#8B4513" />
                </TouchableOpacity>
                
                <TouchableOpacity style={styles.helpItem}>
                  <View style={styles.helpItemIcon}>
                    <Ionicons name="card" size={24} color="#D4AF37" />
                  </View>
                  <View style={styles.helpItemContent}>
                    <Text style={styles.helpItemTitle}>Payment Problems</Text>
                    <Text style={styles.helpItemDescription}>Transaction errors, wallet issues</Text>
                  </View>
                  <Ionicons name="chevron-forward" size={16} color="#8B4513" />
                </TouchableOpacity>
                
                <TouchableOpacity style={styles.helpItem}>
                  <View style={styles.helpItemIcon}>
                    <Ionicons name="bug" size={24} color="#D4AF37" />
                  </View>
                  <View style={styles.helpItemContent}>
                    <Text style={styles.helpItemTitle}>Technical Support</Text>
                    <Text style={styles.helpItemDescription}>App crashes, bugs, performance</Text>
                  </View>
                  <Ionicons name="chevron-forward" size={16} color="#8B4513" />
                </TouchableOpacity>
                
                <TouchableOpacity style={styles.helpItem}>
                  <View style={styles.helpItemIcon}>
                    <Ionicons name="shield-checkmark" size={24} color="#D4AF37" />
                  </View>
                  <View style={styles.helpItemContent}>
                    <Text style={styles.helpItemTitle}>Security Concerns</Text>
                    <Text style={styles.helpItemDescription}>Device lock, unauthorized access</Text>
                  </View>
                  <Ionicons name="chevron-forward" size={16} color="#8B4513" />
                </TouchableOpacity>
              </View>
              
              {/* Resources Section */}
              <View style={styles.helpSection}>
                <Text style={styles.helpSectionTitle}>📚 Resources</Text>
                
                <TouchableOpacity style={styles.helpItem}>
                  <View style={styles.helpItemIcon}>
                    <Ionicons name="book" size={24} color="#D4AF37" />
                  </View>
                  <View style={styles.helpItemContent}>
                    <Text style={styles.helpItemTitle}>User Guide</Text>
                    <Text style={styles.helpItemDescription}>Complete app usage instructions</Text>
                  </View>
                  <Ionicons name="chevron-forward" size={16} color="#8B4513" />
                </TouchableOpacity>
                
                <TouchableOpacity style={styles.helpItem}>
                  <View style={styles.helpItemIcon}>
                    <Ionicons name="play-circle" size={24} color="#D4AF37" />
                  </View>
                  <View style={styles.helpItemContent}>
                    <Text style={styles.helpItemTitle}>Video Tutorials</Text>
                    <Text style={styles.helpItemDescription}>Step-by-step visual guides</Text>
                  </View>
                  <Ionicons name="chevron-forward" size={16} color="#8B4513" />
                </TouchableOpacity>
                
                <TouchableOpacity style={styles.helpItem}>
                  <View style={styles.helpItemIcon}>
                    <Ionicons name="help-circle" size={24} color="#D4AF37" />
                  </View>
                  <View style={styles.helpItemContent}>
                    <Text style={styles.helpItemTitle}>FAQ</Text>
                    <Text style={styles.helpItemDescription}>Frequently asked questions</Text>
                  </View>
                  <Ionicons name="chevron-forward" size={16} color="#8B4513" />
                </TouchableOpacity>
                
                <TouchableOpacity style={styles.helpItem}>
                  <View style={styles.helpItemIcon}>
                    <Ionicons name="people" size={24} color="#D4AF37" />
                  </View>
                  <View style={styles.helpItemContent}>
                    <Text style={styles.helpItemTitle}>Community Forum</Text>
                    <Text style={styles.helpItemDescription}>Connect with other users</Text>
                  </View>
                  <Ionicons name="chevron-forward" size={16} color="#8B4513" />
                </TouchableOpacity>
              </View>
              
              {/* Contact Support Section */}
              <View style={styles.helpSection}>
                <Text style={styles.helpSectionTitle}>📞 Contact Support</Text>
                
                <TouchableOpacity style={[styles.helpItem, styles.priorityItem]}>
                  <View style={styles.helpItemIcon}>
                    <Ionicons name="chatbubbles" size={24} color="#10B981" />
                  </View>
                  <View style={styles.helpItemContent}>
                    <Text style={styles.helpItemTitle}>Live Chat</Text>
                    <Text style={styles.helpItemDescription}>Available 24/7 for urgent issues</Text>
                  </View>
                  <View style={styles.priorityBadge}>
                    <Text style={styles.priorityText}>FASTEST</Text>
                  </View>
                </TouchableOpacity>
                
                <TouchableOpacity style={styles.helpItem}>
                  <View style={styles.helpItemIcon}>
                    <Ionicons name="mail" size={24} color="#D4AF37" />
                  </View>
                  <View style={styles.helpItemContent}>
                    <Text style={styles.helpItemTitle}>Email Support</Text>
                    <Text style={styles.helpItemDescription}>support@tlbdiamond.com</Text>
                  </View>
                  <Ionicons name="chevron-forward" size={16} color="#8B4513" />
                </TouchableOpacity>
                
                <TouchableOpacity style={styles.helpItem}>
                  <View style={styles.helpItemIcon}>
                    <Ionicons name="call" size={24} color="#D4AF37" />
                  </View>
                  <View style={styles.helpItemContent}>
                    <Text style={styles.helpItemTitle}>Phone Support</Text>
                    <Text style={styles.helpItemDescription}>+1 (555) DIAMOND (342-6663)</Text>
                  </View>
                  <Ionicons name="chevron-forward" size={16} color="#8B4513" />
                </TouchableOpacity>
                
                <TouchableOpacity style={styles.helpItem}>
                  <View style={styles.helpItemIcon}>
                    <Ionicons name="document-text" size={24} color="#D4AF37" />
                  </View>
                  <View style={styles.helpItemContent}>
                    <Text style={styles.helpItemTitle}>Submit Ticket</Text>
                    <Text style={styles.helpItemDescription}>Detailed support request form</Text>
                  </View>
                  <Ionicons name="chevron-forward" size={16} color="#8B4513" />
                </TouchableOpacity>
              </View>
              
              {/* App Info */}
              <View style={styles.helpAppInfo}>
                <Text style={styles.appInfoTitle}>App Information</Text>
                <View style={styles.appInfoGrid}>
                  <View style={styles.appInfoItem}>
                    <Text style={styles.appInfoLabel}>Version</Text>
                    <Text style={styles.appInfoValue}>1.0.0</Text>
                  </View>
                  <View style={styles.appInfoItem}>
                    <Text style={styles.appInfoLabel}>Updated</Text>
                    <Text style={styles.appInfoValue}>Today</Text>
                  </View>
                  <View style={styles.appInfoItem}>
                    <Text style={styles.appInfoLabel}>Rating</Text>
                    <Text style={styles.appInfoValue}>4.8/5 ⭐</Text>
                  </View>
                </View>
                
                <View style={styles.helpTip}>
                  <Ionicons name="bulb" size={16} color="#F59E0B" />
                  <Text style={styles.helpTipText}>
                    For fastest response, use Live Chat for urgent issues or submit a detailed ticket for complex problems.
                  </Text>
                </View>
              </View>
            </ScrollView>

            <View style={styles.helpActions}>
              <TouchableOpacity 
                style={styles.liveChatButton}
                onPress={() => {
                  setShowHelpModal(false);
                  Alert.alert('Live Chat', 'Connecting to support agent...\n\nEstimated wait time: < 2 minutes\n\nPlease describe your issue briefly when connected.');
                }}
              >
                <Ionicons name="chatbubbles" size={16} color="#FFFFFF" />
                <Text style={styles.liveChatText}>Live Chat</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.ticketButton}
                onPress={() => {
                  setShowHelpModal(false);
                  Alert.alert('Submit Ticket', 'Ticket submission form coming soon!\n\nIn the meantime, please email us at support@tlbdiamond.com with:\n\n• Your issue description\n• Device model\n• App version\n• Screenshots (if applicable)');
                }}
              >
                <Ionicons name="document-text" size={16} color="#FFFFFF" />
                <Text style={styles.ticketText}>Submit Ticket</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Settings Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={showSettingsModal}
        onRequestClose={() => setShowSettingsModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>⚙️ App Settings</Text>
              <TouchableOpacity onPress={() => setShowSettingsModal(false)}>
                <Ionicons name="close" size={24} color="#8B4513" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalContent}>
              <Text style={styles.settingsDescription}>
                Current app configuration:
              </Text>
              
              {(() => {
                const appSettings = [
                  {
                    category: 'Security',
                    icon: '🔒',
                    settings: [
                      { name: 'Two-Factor Authentication', value: 'Enabled', status: '✅' },
                      { name: 'Biometric Login', value: 'Face ID Enabled', status: '✅' },
                      { name: 'Auto-Lock Timer', value: '5 minutes', status: '⏰' },
                      { name: 'Device Lock on SIM Removal', value: 'Active', status: '🔐' }
                    ]
                  },
                  {
                    category: 'Notifications',
                    icon: '🔔',
                    settings: [
                      { name: 'Push Notifications', value: 'Enabled', status: '✅' },
                      { name: 'Payment Alerts', value: 'Enabled', status: '💳' },
                      { name: 'Order Updates', value: 'Enabled', status: '📦' },
                      { name: 'Community Alerts', value: 'Enabled', status: '👥' },
                      { name: 'Bonus Notifications', value: 'Enabled', status: '🎁' }
                    ]
                  },
                  {
                    category: 'Privacy',
                    icon: '🛡️',
                    settings: [
                      { name: 'Data Sharing', value: 'Limited', status: '🔒' },
                      { name: 'Analytics', value: 'Anonymous Only', status: '📊' },
                      { name: 'Location Services', value: 'App Only', status: '📍' },
                      { name: 'Profile Visibility', value: 'Community Only', status: '👁️' }
                    ]
                  },
                  {
                    category: 'App Preferences',
                    icon: '⚙️',
                    settings: [
                      { name: 'Theme', value: 'Golden (Default)', status: '🎨' },
                      { name: 'Language', value: 'English (US)', status: '🌐' },
                      { name: 'Currency Display', value: 'TLB Diamond', status: '💎' },
                      { name: 'Auto-Update', value: 'Wi-Fi Only', status: '🔄' }
                    ]
                  },
                  {
                    category: 'Advanced',
                    icon: '🔧',
                    settings: [
                      { name: 'Developer Mode', value: 'Disabled', status: '🚫' },
                      { name: 'Debug Logging', value: 'Disabled', status: '📝' },
                      { name: 'Beta Features', value: 'Enabled', status: '🧪' },
                      { name: 'Performance Mode', value: 'Balanced', status: '⚡' }
                    ]
                  }
                ];
                
                return appSettings.map((category, index) => (
                  <View key={index} style={styles.settingsCategory}>
                    <Text style={styles.categoryTitle}>
                      {category.icon} {category.category}
                    </Text>
                    {category.settings.map((setting, settingIndex) => (
                      <View key={settingIndex} style={styles.settingItem}>
                        <Text style={styles.settingStatus}>{setting.status}</Text>
                        <View style={styles.settingInfo}>
                          <Text style={styles.settingName}>{setting.name}</Text>
                          <Text style={styles.settingValue}>{setting.value}</Text>
                        </View>
                      </View>
                    ))}
                  </View>
                ));
              })()}
              
              <View style={styles.settingsSummary}>
                <Text style={styles.summaryTitle}>📊 Summary</Text>
                
                <View style={styles.summaryGrid}>
                  <View style={styles.summaryCard}>
                    <Text style={styles.summaryNumber}>21</Text>
                    <Text style={styles.summaryLabel}>Total Settings</Text>
                  </View>
                  
                  <View style={styles.summaryCard}>
                    <Text style={styles.summaryNumber}>15</Text>
                    <Text style={styles.summaryLabel}>Active/Enabled</Text>
                  </View>
                </View>
                
                <View style={styles.summaryInfoRow}>
                  <View style={styles.summaryInfoItem}>
                    <Text style={styles.summaryIcon}>🔒</Text>
                    <View style={styles.summaryInfoText}>
                      <Text style={styles.summaryInfoLabel}>Security Level</Text>
                      <Text style={styles.summaryInfoValue}>High</Text>
                    </View>
                  </View>
                  
                  <View style={styles.summaryInfoItem}>
                    <Text style={styles.summaryIcon}>📅</Text>
                    <View style={styles.summaryInfoText}>
                      <Text style={styles.summaryInfoLabel}>Last Updated</Text>
                      <Text style={styles.summaryInfoValue}>Today</Text>
                    </View>
                  </View>
                </View>
                
                <View style={styles.summaryTipContainer}>
                  <Text style={styles.summaryTipIcon}>💡</Text>
                  <Text style={styles.summaryTip}>
                    Most settings can be customized in the full settings menu
                  </Text>
                </View>
              </View>
            </ScrollView>

            <View style={styles.settingsActions}>
              <TouchableOpacity 
                style={styles.settingsActionButton}
                onPress={() => {
                  setShowSettingsModal(false);
                  Alert.alert('Settings', 'Full settings menu coming soon!');
                }}
              >
                <Text style={styles.settingsActionText}>Full Settings</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.settingsActionButton, styles.resetButton]}
                onPress={() => {
                  Alert.alert('Reset', 'All settings will be restored to defaults. This action cannot be undone.', [
                    { text: 'Cancel', style: 'cancel' },
                    { 
                      text: 'Reset', 
                      style: 'destructive', 
                      onPress: () => {
                        setShowSettingsModal(false);
                        Alert.alert('Reset Complete', 'Settings have been restored to defaults.');
                      }
                    }
                  ]);
                }}
              >
                <Text style={styles.resetButtonText}>Reset</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.settingsActionButton, styles.closeButton]}
                onPress={() => setShowSettingsModal(false)}
              >
                <Text style={styles.closeButtonText}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Edit Profile Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={showEditModal}
        onRequestClose={handleCancelEdit}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Edit Profile</Text>
              <TouchableOpacity onPress={handleCancelEdit}>
                <Ionicons name="close" size={24} color="#8B4513" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalContent}>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Full Name</Text>
                <TextInput
                  style={styles.textInput}
                  value={editData.name}
                  onChangeText={(text) => setEditData({...editData, name: text})}
                  placeholder="Enter your full name"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Email Address</Text>
                <TextInput
                  style={styles.textInput}
                  value={editData.email}
                  onChangeText={(text) => setEditData({...editData, email: text})}
                  placeholder="Enter your email"
                  keyboardType="email-address"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Phone Number</Text>
                <TextInput
                  style={styles.textInput}
                  value={editData.phone}
                  onChangeText={(text) => setEditData({...editData, phone: text})}
                  placeholder="Enter your phone number"
                  keyboardType="phone-pad"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Address</Text>
                <TextInput
                  style={[styles.textInput, styles.multilineInput]}
                  value={editData.address}
                  onChangeText={(text) => setEditData({...editData, address: text})}
                  placeholder="Enter your address"
                  multiline={true}
                  numberOfLines={3}
                />
              </View>
            </ScrollView>

            <View style={styles.modalActions}>
              <TouchableOpacity style={styles.cancelButton} onPress={handleCancelEdit}>
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.saveButton} onPress={handleSaveProfile}>
                <Text style={styles.saveButtonText}>Save Changes</Text>
              </TouchableOpacity>
            </View>
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
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5E6A3',
    borderRadius: 16,
    padding: 20,
    margin: 20,
    borderWidth: 2,
    borderColor: '#D4AF37',
  },
  avatarContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
    borderWidth: 2,
    borderColor: '#D4AF37',
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2C1810',
    marginBottom: 2,
  },
  profileEmail: {
    fontSize: 14,
    color: '#8B4513',
    marginBottom: 5,
  },
  verificationBadge: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  verificationText: {
    fontSize: 12,
    color: '#10B981',
    fontWeight: '600',
    marginLeft: 4,
  },
  editButton: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 8,
    borderWidth: 1,
    borderColor: '#D4AF37',
  },
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    marginHorizontal: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#D4AF37',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2C1810',
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 12,
    color: '#8B4513',
  },
  menuContainer: {
    paddingHorizontal: 20,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#D4AF37',
  },
  signOutItem: {
    borderColor: '#EF4444',
  },
  menuIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F5E6A3',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  signOutIcon: {
    backgroundColor: '#FEE2E2',
  },
  menuContent: {
    flex: 1,
  },
  menuTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2C1810',
    marginBottom: 2,
  },
  signOutText: {
    color: '#EF4444',
  },
  menuSubtitle: {
    fontSize: 12,
    color: '#8B4513',
  },
  versionContainer: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  versionText: {
    fontSize: 14,
    color: '#8B4513',
    fontWeight: '600',
  },
  buildText: {
    fontSize: 12,
    color: '#8B4513',
    marginTop: 2,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: '#FFF8E7',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 20,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#D4AF37',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2C1810',
  },
  modalContent: {
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2C1810',
    marginBottom: 8,
  },
  textInput: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D4AF37',
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 16,
    color: '#2C1810',
  },
  multilineInput: {
    height: 80,
    textAlignVertical: 'top',
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 20,
    borderTopWidth: 1,
    borderTopColor: '#D4AF37',
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#8B4513',
    borderRadius: 8,
    paddingVertical: 12,
    marginRight: 10,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#8B4513',
    fontSize: 16,
    fontWeight: '600',
  },
  saveButton: {
    flex: 1,
    backgroundColor: '#D4AF37',
    borderRadius: 8,
    paddingVertical: 12,
    marginLeft: 10,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  settingsDescription: {
    fontSize: 16,
    color: '#2C1810',
    marginBottom: 20,
    fontWeight: '600',
  },
  settingsCategory: {
    marginBottom: 20,
  },
  categoryTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2C1810',
    marginBottom: 10,
    paddingBottom: 5,
    borderBottomWidth: 1,
    borderBottomColor: '#D4AF37',
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 10,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    marginBottom: 5,
    borderWidth: 1,
    borderColor: '#F5E6A3',
  },
  settingStatus: {
    fontSize: 16,
    marginRight: 10,
    width: 25,
  },
  settingInfo: {
    flex: 1,
  },
  settingName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2C1810',
  },
  settingValue: {
    fontSize: 12,
    color: '#8B4513',
    marginTop: 2,
  },
  settingsSummary: {
    backgroundColor: '#F5E6A3',
    borderRadius: 12,
    padding: 20,
    marginTop: 15,
    borderWidth: 2,
    borderColor: '#D4AF37',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2C1810',
    marginBottom: 15,
    textAlign: 'center',
  },
  summaryGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
    gap: 10,
  },
  summaryCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 15,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#D4AF37',
  },
  summaryNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#D4AF37',
    marginBottom: 5,
  },
  summaryLabel: {
    fontSize: 12,
    color: '#8B4513',
    textAlign: 'center',
    fontWeight: '600',
  },
  summaryInfoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
    gap: 10,
  },
  summaryInfoItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: '#D4AF37',
  },
  summaryIcon: {
    fontSize: 20,
    marginRight: 10,
  },
  summaryInfoText: {
    flex: 1,
  },
  summaryInfoLabel: {
    fontSize: 12,
    color: '#8B4513',
    fontWeight: '500',
  },
  summaryInfoValue: {
    fontSize: 14,
    color: '#2C1810',
    fontWeight: '600',
    marginTop: 2,
  },
  summaryTipContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: '#D4AF37',
  },
  summaryTipIcon: {
    fontSize: 16,
    marginRight: 8,
    marginTop: 2,
  },
  summaryTip: {
    flex: 1,
    fontSize: 12,
    color: '#8B4513',
    fontStyle: 'italic',
    lineHeight: 16,
  },
  settingsActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderTopWidth: 1,
    borderTopColor: '#D4AF37',
    gap: 10,
  },
  settingsActionButton: {
    flex: 1,
    backgroundColor: '#D4AF37',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
  },
  settingsActionText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  resetButton: {
    backgroundColor: '#EF4444',
  },
  resetButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  closeButton: {
    backgroundColor: '#8B4513',
  },
  closeButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  helpDescription: {
    fontSize: 16,
    color: '#2C1810',
    marginBottom: 20,
    fontWeight: '600',
    textAlign: 'center',
  },
  helpSection: {
    marginBottom: 25,
  },
  helpSectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2C1810',
    marginBottom: 15,
    paddingBottom: 8,
    borderBottomWidth: 2,
    borderBottomColor: '#D4AF37',
  },
  helpItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#D4AF37',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  priorityItem: {
    borderColor: '#10B981',
    borderWidth: 2,
  },
  helpItemIcon: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
    backgroundColor: '#F5E6A3',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  helpItemContent: {
    flex: 1,
  },
  helpItemTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2C1810',
    marginBottom: 3,
  },
  helpItemDescription: {
    fontSize: 13,
    color: '#8B4513',
    lineHeight: 18,
  },
  priorityBadge: {
    backgroundColor: '#10B981',
    borderRadius: 4,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  priorityText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: 'bold',
  },
  helpAppInfo: {
    backgroundColor: '#F5E6A3',
    borderRadius: 12,
    padding: 20,
    marginTop: 10,
    borderWidth: 2,
    borderColor: '#D4AF37',
  },
  appInfoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2C1810',
    marginBottom: 15,
    textAlign: 'center',
  },
  appInfoGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 15,
  },
  appInfoItem: {
    alignItems: 'center',
  },
  appInfoLabel: {
    fontSize: 12,
    color: '#8B4513',
    fontWeight: '500',
  },
  appInfoValue: {
    fontSize: 14,
    color: '#2C1810',
    fontWeight: '600',
    marginTop: 3,
  },
  helpTip: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: '#D4AF37',
  },
  helpTipText: {
    flex: 1,
    fontSize: 12,
    color: '#8B4513',
    fontStyle: 'italic',
    lineHeight: 16,
    marginLeft: 8,
  },
  helpActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderTopWidth: 1,
    borderTopColor: '#D4AF37',
    gap: 12,
  },
  liveChatButton: {
    flex: 1,
    backgroundColor: '#10B981',
    borderRadius: 8,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  liveChatText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 6,
  },
  ticketButton: {
    flex: 1,
    backgroundColor: '#D4AF37',
    borderRadius: 8,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  ticketText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 6,
  },
  notificationDescription: {
    fontSize: 16,
    color: '#2C1810',
    marginBottom: 20,
    fontWeight: '600',
    textAlign: 'center',
  },
  notificationSummary: {
    backgroundColor: '#F5E6A3',
    borderRadius: 12,
    padding: 15,
    marginBottom: 20,
    borderWidth: 2,
    borderColor: '#D4AF37',
  },
  summaryStatsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 10,
  },
  summaryStatCard: {
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 12,
    minWidth: 60,
    borderWidth: 1,
    borderColor: '#D4AF37',
  },
  summaryStatNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#D4AF37',
    marginBottom: 3,
  },
  summaryStatLabel: {
    fontSize: 12,
    color: '#8B4513',
    fontWeight: '600',
  },
  notificationSection: {
    marginBottom: 25,
  },
  notificationSectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2C1810',
    marginBottom: 15,
    paddingBottom: 8,
    borderBottomWidth: 2,
    borderBottomColor: '#D4AF37',
  },
  notificationItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#D4AF37',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  unreadNotification: {
    borderColor: '#F59E0B',
    borderWidth: 2,
    backgroundColor: '#FFFBEB',
  },
  notificationIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F5E6A3',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  notificationEmoji: {
    fontSize: 20,
  },
  notificationContent: {
    flex: 1,
    marginRight: 10,
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2C1810',
    marginBottom: 4,
  },
  notificationMessage: {
    fontSize: 14,
    color: '#8B4513',
    lineHeight: 18,
    marginBottom: 6,
  },
  notificationTime: {
    fontSize: 12,
    color: '#A0522D',
    fontWeight: '500',
  },
  notificationStatus: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 20,
  },
  priorityDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginBottom: 6,
  },
  unreadDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#F59E0B',
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 14,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#D4AF37',
  },
  settingInfo: {
    flex: 1,
  },
  settingName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2C1810',
    marginBottom: 2,
  },
  settingDescription: {
    fontSize: 12,
    color: '#8B4513',
    lineHeight: 16,
  },
  settingToggle: {
    width: 30,
    alignItems: 'center',
  },
  settingStatus: {
    fontSize: 16,
  },
  notificationTip: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#FFFBEB',
    borderRadius: 8,
    padding: 12,
    marginTop: 10,
    borderWidth: 1,
    borderColor: '#F59E0B',
  },
  notificationTipText: {
    flex: 1,
    fontSize: 12,
    color: '#8B4513',
    fontStyle: 'italic',
    lineHeight: 16,
    marginLeft: 8,
  },
  notificationActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderTopWidth: 1,
    borderTopColor: '#D4AF37',
    gap: 12,
  },
  markReadButton: {
    flex: 1,
    backgroundColor: '#10B981',
    borderRadius: 8,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  markReadText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 6,
  },
  manageButton: {
    flex: 1,
    backgroundColor: '#D4AF37',
    borderRadius: 8,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  manageText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 6,
  },
});