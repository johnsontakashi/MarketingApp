import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Alert, Modal, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function ProfileScreen({ navigation }) {
  const [showEditModal, setShowEditModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
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
                <Text style={styles.summaryTitle}>📊 Summary:</Text>
                <Text style={styles.summaryText}>• Total Settings: 21</Text>
                <Text style={styles.summaryText}>• Active/Enabled: 15</Text>
                <Text style={styles.summaryText}>• Security Level: High 🔒</Text>
                <Text style={styles.summaryText}>• Last Updated: Today</Text>
                
                <Text style={styles.summaryTip}>
                  💡 Tip: Most settings can be customized in the full settings menu
                </Text>
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
    borderRadius: 8,
    padding: 15,
    marginTop: 10,
    borderWidth: 1,
    borderColor: '#D4AF37',
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2C1810',
    marginBottom: 8,
  },
  summaryText: {
    fontSize: 14,
    color: '#2C1810',
    marginBottom: 3,
  },
  summaryTip: {
    fontSize: 12,
    color: '#8B4513',
    fontStyle: 'italic',
    marginTop: 8,
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
});