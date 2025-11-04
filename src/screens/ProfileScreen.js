import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Alert, Modal, TextInput, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function ProfileScreen({ navigation }) {
  const [showEditModal, setShowEditModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showHelpModal, setShowHelpModal] = useState(false);
  const [showNotificationsModal, setShowNotificationsModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showAddPaymentModal, setShowAddPaymentModal] = useState(false);
  const [showOrdersModal, setShowOrdersModal] = useState(false);
  const [selectedPaymentType, setSelectedPaymentType] = useState('');
  const [paymentFormData, setPaymentFormData] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardholderName: '',
    bankName: '',
    accountNumber: '',
    routingNumber: '',
    paypalEmail: '',
    giftCardNumber: '',
    giftCardPin: ''
  });
  const [profileData, setProfileData] = useState({
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '+1 (555) 123-4567',
    address: '123 Main Street, City, State 12345',
    avatar: null
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

  const handleAvatarUpload = () => {
    // Demo placeholder avatars for development
    const avatarOptions = [
      'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80',
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80',
      'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80',
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80'
    ];

    Alert.alert(
      "🖼️ Select Avatar (Demo)",
      "Choose a demo profile picture or remove current avatar",
      [
        { text: "Avatar 1", onPress: () => selectDemoAvatar(avatarOptions[0]) },
        { text: "Avatar 2", onPress: () => selectDemoAvatar(avatarOptions[1]) },
        { text: "Avatar 3", onPress: () => selectDemoAvatar(avatarOptions[2]) },
        { text: "Avatar 4", onPress: () => selectDemoAvatar(avatarOptions[3]) },
        { text: "Remove Avatar", onPress: () => removeAvatar() },
        { text: "Cancel", style: "cancel" }
      ]
    );
  };

  const selectDemoAvatar = (avatarUri) => {
    setProfileData({ ...profileData, avatar: avatarUri });
    setEditData({ ...editData, avatar: avatarUri });
    Alert.alert("✅ Success", "Profile picture updated successfully!");
  };

  const removeAvatar = () => {
    setProfileData({ ...profileData, avatar: null });
    setEditData({ ...editData, avatar: null });
    Alert.alert("✅ Success", "Profile picture removed successfully!");
  };

  const handleMyOrders = () => {
    setShowOrdersModal(true);
  };

  const handlePaymentMethods = () => {
    setShowPaymentModal(true);
  };

  const handleAddPaymentMethod = (type) => {
    setSelectedPaymentType(type);
    setPaymentFormData({
      cardNumber: '',
      expiryDate: '',
      cvv: '',
      cardholderName: '',
      bankName: '',
      accountNumber: '',
      routingNumber: '',
      paypalEmail: '',
      giftCardNumber: '',
      giftCardPin: ''
    });
    setShowPaymentModal(false);
    setShowAddPaymentModal(true);
  };

  const handleSavePaymentMethod = () => {
    let isValid = false;
    let message = '';

    switch (selectedPaymentType) {
      case 'credit':
        isValid = paymentFormData.cardNumber && paymentFormData.expiryDate && 
                 paymentFormData.cvv && paymentFormData.cardholderName;
        message = isValid ? 
          `Credit Card ending in ${paymentFormData.cardNumber.slice(-4)} has been added successfully!` :
          'Please fill in all credit card fields.';
        break;
      case 'bank':
        isValid = paymentFormData.bankName && paymentFormData.accountNumber && 
                 paymentFormData.routingNumber;
        message = isValid ? 
          `Bank account at ${paymentFormData.bankName} has been added successfully!` :
          'Please fill in all bank account fields.';
        break;
      case 'paypal':
        isValid = paymentFormData.paypalEmail;
        message = isValid ? 
          `PayPal account ${paymentFormData.paypalEmail} has been added successfully!` :
          'Please enter your PayPal email address.';
        break;
      case 'gift':
        isValid = paymentFormData.giftCardNumber && paymentFormData.giftCardPin;
        message = isValid ? 
          `Gift card ending in ${paymentFormData.giftCardNumber.slice(-4)} has been added successfully!` :
          'Please fill in gift card number and PIN.';
        break;
    }

    if (isValid) {
      setShowAddPaymentModal(false);
      setShowPaymentModal(true);
      Alert.alert('Payment Method Added', message);
    } else {
      Alert.alert('Incomplete Information', message);
    }
  };

  const handleCancelPaymentForm = () => {
    setShowAddPaymentModal(false);
    setShowPaymentModal(true);
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
        <TouchableOpacity style={styles.avatarContainer} onPress={handleAvatarUpload}>
          {profileData.avatar ? (
            <Image source={{ uri: profileData.avatar }} style={styles.avatarImage} />
          ) : (
            <Ionicons name="person" size={40} color="#D4AF37" />
          )}
          <View style={styles.avatarEditBadge}>
            <Ionicons name="camera" size={12} color="#FFFFFF" />
          </View>
        </TouchableOpacity>
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

      {/* Payment Methods Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={showPaymentModal}
        onRequestClose={() => setShowPaymentModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>💳 Payment Methods</Text>
              <TouchableOpacity onPress={() => setShowPaymentModal(false)}>
                <Ionicons name="close" size={24} color="#8B4513" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalContent}>
              <Text style={styles.paymentDescription}>
                Your saved payment methods
              </Text>
              
              {/* Summary Stats */}
              <View style={styles.paymentSummary}>
                <Text style={styles.summaryTitle}>📊 Summary</Text>
                <View style={styles.paymentStatsGrid}>
                  <View style={styles.paymentStatCard}>
                    <Text style={styles.paymentStatNumber}>5</Text>
                    <Text style={styles.paymentStatLabel}>Total Methods</Text>
                  </View>
                  <View style={styles.paymentStatCard}>
                    <Text style={styles.paymentStatNumber}>5</Text>
                    <Text style={styles.paymentStatLabel}>Active</Text>
                  </View>
                  <View style={styles.paymentStatCard}>
                    <Text style={styles.paymentStatNumber}>💎 1,300</Text>
                    <Text style={styles.paymentStatLabel}>TLB Balance</Text>
                  </View>
                </View>
              </View>
              
              {/* Payment Methods */}
              <View style={styles.paymentSection}>
                <Text style={styles.paymentSectionTitle}>💳 Your Payment Methods</Text>
                
                {/* TLB Wallet - Default */}
                <TouchableOpacity style={[styles.paymentMethodCard, styles.defaultPaymentMethod]}>
                  <View style={styles.paymentMethodIcon}>
                    <Text style={styles.paymentMethodEmoji}>💎</Text>
                  </View>
                  <View style={styles.paymentMethodContent}>
                    <View style={styles.paymentMethodHeader}>
                      <Text style={styles.paymentMethodType}>TLB Wallet</Text>
                      <View style={styles.defaultBadge}>
                        <Text style={styles.defaultText}>DEFAULT</Text>
                      </View>
                    </View>
                    <Text style={styles.paymentMethodDetails}>Primary Payment Method</Text>
                    <Text style={styles.paymentMethodBalance}>💎 1,250.00 TLB</Text>
                  </View>
                  <View style={styles.paymentMethodStatus}>
                    <Text style={styles.statusActive}>✅</Text>
                  </View>
                </TouchableOpacity>
                
                {/* Credit Card */}
                <TouchableOpacity 
                  style={styles.paymentMethodCard}
                  onPress={() => handleAddPaymentMethod('credit')}
                >
                  <View style={styles.paymentMethodIcon}>
                    <Text style={styles.paymentMethodEmoji}>💳</Text>
                  </View>
                  <View style={styles.paymentMethodContent}>
                    <Text style={styles.paymentMethodType}>Credit Card</Text>
                    <Text style={styles.paymentMethodDetails}>**** **** **** 4532</Text>
                    <Text style={styles.paymentMethodExtra}>Visa | Expires: 12/27</Text>
                  </View>
                  <View style={styles.paymentMethodStatus}>
                    <Text style={styles.statusActive}>✅</Text>
                    <Ionicons name="create" size={16} color="#D4AF37" />
                  </View>
                </TouchableOpacity>
                
                {/* Bank Account */}
                <TouchableOpacity 
                  style={styles.paymentMethodCard}
                  onPress={() => handleAddPaymentMethod('bank')}
                >
                  <View style={styles.paymentMethodIcon}>
                    <Text style={styles.paymentMethodEmoji}>🏦</Text>
                  </View>
                  <View style={styles.paymentMethodContent}>
                    <Text style={styles.paymentMethodType}>Bank Account</Text>
                    <Text style={styles.paymentMethodDetails}>Chase Bank ****1234</Text>
                    <Text style={styles.paymentMethodExtra}>ACH Transfer</Text>
                  </View>
                  <View style={styles.paymentMethodStatus}>
                    <Text style={styles.statusActive}>✅</Text>
                    <Ionicons name="create" size={16} color="#D4AF37" />
                  </View>
                </TouchableOpacity>
                
                {/* PayPal */}
                <TouchableOpacity 
                  style={styles.paymentMethodCard}
                  onPress={() => handleAddPaymentMethod('paypal')}
                >
                  <View style={styles.paymentMethodIcon}>
                    <Text style={styles.paymentMethodEmoji}>🅿️</Text>
                  </View>
                  <View style={styles.paymentMethodContent}>
                    <Text style={styles.paymentMethodType}>PayPal</Text>
                    <Text style={styles.paymentMethodDetails}>john.doe@example.com</Text>
                    <Text style={styles.paymentMethodExtra}>Connected Account</Text>
                  </View>
                  <View style={styles.paymentMethodStatus}>
                    <Text style={styles.statusConnected}>🔗</Text>
                    <Ionicons name="create" size={16} color="#D4AF37" />
                  </View>
                </TouchableOpacity>
                
                {/* Gift Card */}
                <TouchableOpacity 
                  style={styles.paymentMethodCard}
                  onPress={() => handleAddPaymentMethod('gift')}
                >
                  <View style={styles.paymentMethodIcon}>
                    <Text style={styles.paymentMethodEmoji}>🎁</Text>
                  </View>
                  <View style={styles.paymentMethodContent}>
                    <Text style={styles.paymentMethodType}>Gift Card</Text>
                    <Text style={styles.paymentMethodDetails}>TLB Gift Card ****8765</Text>
                    <Text style={styles.paymentMethodBalance}>💎 50.00 TLB</Text>
                  </View>
                  <View style={styles.paymentMethodStatus}>
                    <Text style={styles.statusActive}>✅</Text>
                    <Ionicons name="create" size={16} color="#D4AF37" />
                  </View>
                </TouchableOpacity>
              </View>
              
              {/* Security Notice */}
              <View style={styles.paymentSecurity}>
                <Ionicons name="shield-checkmark" size={20} color="#10B981" />
                <Text style={styles.paymentSecurityText}>
                  All payments are secured with 256-bit encryption and PCI DSS compliance
                </Text>
              </View>
            </ScrollView>

            <View style={styles.paymentActions}>
              <TouchableOpacity 
                style={styles.addMethodButton}
                onPress={() => {
                  setShowPaymentModal(false);
                  Alert.alert('Add Payment', 'New payment method setup coming soon!');
                }}
              >
                <Ionicons name="add" size={16} color="#FFFFFF" />
                <Text style={styles.addMethodText}>Add New Method</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.manageMethodsButton}
                onPress={() => {
                  setShowPaymentModal(false);
                  Alert.alert('Manage', 'Payment method management coming soon!');
                }}
              >
                <Ionicons name="settings" size={16} color="#FFFFFF" />
                <Text style={styles.manageMethodsText}>Manage Methods</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Add Payment Method Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={showAddPaymentModal}
        onRequestClose={() => setShowAddPaymentModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {selectedPaymentType === 'credit' && '💳 Add Credit Card'}
                {selectedPaymentType === 'bank' && '🏦 Add Bank Account'}
                {selectedPaymentType === 'paypal' && '🅿️ Add PayPal Account'}
                {selectedPaymentType === 'gift' && '🎁 Add Gift Card'}
              </Text>
              <TouchableOpacity onPress={() => setShowAddPaymentModal(false)}>
                <Ionicons name="close" size={24} color="#8B4513" />
              </TouchableOpacity>
            </View>
            
            <ScrollView style={styles.modalContent}>
              {/* Credit Card Form */}
              {selectedPaymentType === 'credit' && (
                <View style={styles.paymentForm}>
                  <Text style={styles.formSectionTitle}>Credit Card Information</Text>
                  
                  <View style={styles.inputGroup}>
                    <Text style={styles.inputLabel}>Card Number</Text>
                    <TextInput
                      style={styles.paymentInput}
                      placeholder="1234 5678 9012 3456"
                      value={paymentFormData.cardNumber}
                      onChangeText={(text) => setPaymentFormData({...paymentFormData, cardNumber: text})}
                      keyboardType="numeric"
                      maxLength={19}
                    />
                  </View>
                  
                  <View style={styles.inputRow}>
                    <View style={styles.inputGroupHalf}>
                      <Text style={styles.inputLabel}>Expiry Date</Text>
                      <TextInput
                        style={styles.paymentInput}
                        placeholder="MM/YY"
                        value={paymentFormData.expiryDate}
                        onChangeText={(text) => setPaymentFormData({...paymentFormData, expiryDate: text})}
                        keyboardType="numeric"
                        maxLength={5}
                      />
                    </View>
                    
                    <View style={styles.inputGroupHalf}>
                      <Text style={styles.inputLabel}>CVV</Text>
                      <TextInput
                        style={styles.paymentInput}
                        placeholder="123"
                        value={paymentFormData.cvv}
                        onChangeText={(text) => setPaymentFormData({...paymentFormData, cvv: text})}
                        keyboardType="numeric"
                        maxLength={4}
                        secureTextEntry
                      />
                    </View>
                  </View>
                  
                  <View style={styles.inputGroup}>
                    <Text style={styles.inputLabel}>Cardholder Name</Text>
                    <TextInput
                      style={styles.paymentInput}
                      placeholder="John Doe"
                      value={paymentFormData.cardholderName}
                      onChangeText={(text) => setPaymentFormData({...paymentFormData, cardholderName: text})}
                    />
                  </View>
                </View>
              )}
              
              {/* Bank Account Form */}
              {selectedPaymentType === 'bank' && (
                <View style={styles.paymentForm}>
                  <Text style={styles.formSectionTitle}>Bank Account Information</Text>
                  
                  <View style={styles.inputGroup}>
                    <Text style={styles.inputLabel}>Bank Name</Text>
                    <TextInput
                      style={styles.paymentInput}
                      placeholder="Chase Bank"
                      value={paymentFormData.bankName}
                      onChangeText={(text) => setPaymentFormData({...paymentFormData, bankName: text})}
                    />
                  </View>
                  
                  <View style={styles.inputGroup}>
                    <Text style={styles.inputLabel}>Account Number</Text>
                    <TextInput
                      style={styles.paymentInput}
                      placeholder="1234567890"
                      value={paymentFormData.accountNumber}
                      onChangeText={(text) => setPaymentFormData({...paymentFormData, accountNumber: text})}
                      keyboardType="numeric"
                      secureTextEntry
                    />
                  </View>
                  
                  <View style={styles.inputGroup}>
                    <Text style={styles.inputLabel}>Routing Number</Text>
                    <TextInput
                      style={styles.paymentInput}
                      placeholder="021000021"
                      value={paymentFormData.routingNumber}
                      onChangeText={(text) => setPaymentFormData({...paymentFormData, routingNumber: text})}
                      keyboardType="numeric"
                    />
                  </View>
                </View>
              )}
              
              {/* PayPal Form */}
              {selectedPaymentType === 'paypal' && (
                <View style={styles.paymentForm}>
                  <Text style={styles.formSectionTitle}>PayPal Account Information</Text>
                  
                  <View style={styles.inputGroup}>
                    <Text style={styles.inputLabel}>PayPal Email Address</Text>
                    <TextInput
                      style={styles.paymentInput}
                      placeholder="john.doe@example.com"
                      value={paymentFormData.paypalEmail}
                      onChangeText={(text) => setPaymentFormData({...paymentFormData, paypalEmail: text})}
                      keyboardType="email-address"
                      autoCapitalize="none"
                    />
                  </View>
                  
                  <View style={styles.paymentNote}>
                    <Ionicons name="information-circle" size={16} color="#F59E0B" />
                    <Text style={styles.paymentNoteText}>
                      You'll be redirected to PayPal to authorize this connection.
                    </Text>
                  </View>
                </View>
              )}
              
              {/* Gift Card Form */}
              {selectedPaymentType === 'gift' && (
                <View style={styles.paymentForm}>
                  <Text style={styles.formSectionTitle}>Gift Card Information</Text>
                  
                  <View style={styles.inputGroup}>
                    <Text style={styles.inputLabel}>Gift Card Number</Text>
                    <TextInput
                      style={styles.paymentInput}
                      placeholder="1234 5678 9012 3456"
                      value={paymentFormData.giftCardNumber}
                      onChangeText={(text) => setPaymentFormData({...paymentFormData, giftCardNumber: text})}
                      keyboardType="numeric"
                    />
                  </View>
                  
                  <View style={styles.inputGroup}>
                    <Text style={styles.inputLabel}>Security PIN</Text>
                    <TextInput
                      style={styles.paymentInput}
                      placeholder="1234"
                      value={paymentFormData.giftCardPin}
                      onChangeText={(text) => setPaymentFormData({...paymentFormData, giftCardPin: text})}
                      keyboardType="numeric"
                      maxLength={8}
                      secureTextEntry
                    />
                  </View>
                </View>
              )}
              
              {/* Action Buttons */}
              <View style={styles.paymentFormActions}>
                <TouchableOpacity 
                  style={styles.cancelPaymentButton}
                  onPress={handleCancelPaymentForm}
                >
                  <Text style={styles.cancelPaymentText}>Cancel</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={styles.savePaymentButton}
                  onPress={handleSavePaymentMethod}
                >
                  <Text style={styles.savePaymentText}>Save Payment Method</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Orders Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={showOrdersModal}
        onRequestClose={() => setShowOrdersModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>📦 My Orders</Text>
              <TouchableOpacity onPress={() => setShowOrdersModal(false)}>
                <Ionicons name="close" size={24} color="#8B4513" />
              </TouchableOpacity>
            </View>
            
            <ScrollView 
              style={styles.modalContent}
              contentContainerStyle={styles.orderModalContentContainer}
              showsVerticalScrollIndicator={false}
            >
              <Text style={styles.orderDescription}>
                Your complete order history and tracking information
              </Text>
              
              {/* Summary Stats */}
              <View style={styles.orderSummary}>
                <Text style={styles.summaryTitle}>📊 Order Summary</Text>
                <View style={styles.orderStatsGrid}>
                  <View style={styles.orderStatCard}>
                    <Text style={styles.orderStatNumber}>5</Text>
                    <Text style={styles.orderStatLabel}>Total Orders</Text>
                  </View>
                  <View style={styles.orderStatCard}>
                    <Text style={styles.orderStatNumber}>2</Text>
                    <Text style={styles.orderStatLabel}>Delivered</Text>
                  </View>
                  <View style={styles.orderStatCard}>
                    <Text style={styles.orderStatNumber}>💎 530</Text>
                    <Text style={styles.orderStatLabel}>Total Spent</Text>
                  </View>
                </View>
              </View>
              
              {/* Recent Orders */}
              <View style={styles.orderSection}>
                <Text style={styles.orderSectionTitle}>📋 Recent Orders</Text>
                
                {/* Order 1 - Delivered */}
                <View style={styles.orderCard}>
                  <View style={styles.orderHeader}>
                    <View style={styles.orderIdSection}>
                      <Text style={styles.orderId}>ORD-001</Text>
                      <Text style={styles.orderDate}>Feb 20, 2024</Text>
                    </View>
                    <View style={[styles.orderStatus, styles.deliveredStatus]}>
                      <Text style={styles.orderStatusText}>✅ Delivered</Text>
                    </View>
                  </View>
                  
                  <View style={styles.orderItems}>
                    <View style={styles.orderItem}>
                      <Ionicons name="headset" size={16} color="#D4AF37" />
                      <Text style={styles.orderItemName}>Premium Wireless Headphones</Text>
                      <Text style={styles.orderItemPrice}>💎 200.00</Text>
                    </View>
                  </View>
                  
                  <View style={styles.orderFooter}>
                    <Text style={styles.orderTotal}>Total: 💎 200.00 TLB</Text>
                    <View style={styles.orderActions}>
                      <TouchableOpacity style={styles.orderActionButton}>
                        <Text style={styles.orderActionText}>Reorder</Text>
                      </TouchableOpacity>
                      <TouchableOpacity style={styles.orderActionButton}>
                        <Text style={styles.orderActionText}>Review</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
                
                {/* Order 2 - Processing */}
                <View style={styles.orderCard}>
                  <View style={styles.orderHeader}>
                    <View style={styles.orderIdSection}>
                      <Text style={styles.orderId}>ORD-002</Text>
                      <Text style={styles.orderDate}>Feb 15, 2024</Text>
                    </View>
                    <View style={[styles.orderStatus, styles.processingStatus]}>
                      <Text style={styles.orderStatusText}>⏳ Processing</Text>
                    </View>
                  </View>
                  
                  <View style={styles.orderItems}>
                    <View style={styles.orderItem}>
                      <Ionicons name="watch" size={16} color="#D4AF37" />
                      <Text style={styles.orderItemName}>Smart Fitness Watch</Text>
                      <Text style={styles.orderItemPrice}>💎 150.00</Text>
                    </View>
                  </View>
                  
                  <View style={styles.orderFooter}>
                    <Text style={styles.orderTotal}>Total: 💎 150.00 TLB</Text>
                    <View style={styles.orderActions}>
                      <TouchableOpacity style={styles.orderActionButton}>
                        <Text style={styles.orderActionText}>Track</Text>
                      </TouchableOpacity>
                      <TouchableOpacity style={styles.orderActionButton}>
                        <Text style={styles.orderActionText}>Cancel</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
                
                {/* Order 3 - Shipped */}
                <View style={styles.orderCard}>
                  <View style={styles.orderHeader}>
                    <View style={styles.orderIdSection}>
                      <Text style={styles.orderId}>ORD-003</Text>
                      <Text style={styles.orderDate}>Feb 10, 2024</Text>
                    </View>
                    <View style={[styles.orderStatus, styles.shippedStatus]}>
                      <Text style={styles.orderStatusText}>🚚 Shipped</Text>
                    </View>
                  </View>
                  
                  <View style={styles.orderItems}>
                    <View style={styles.orderItem}>
                      <Ionicons name="game-controller" size={16} color="#D4AF37" />
                      <Text style={styles.orderItemName}>Gaming Mouse Pro</Text>
                      <Text style={styles.orderItemPrice}>💎 75.00</Text>
                    </View>
                    <View style={styles.orderItem}>
                      <Ionicons name="volume-high" size={16} color="#D4AF37" />
                      <Text style={styles.orderItemName}>Bluetooth Speaker</Text>
                      <Text style={styles.orderItemPrice}>💎 85.00</Text>
                    </View>
                  </View>
                  
                  <View style={styles.orderFooter}>
                    <Text style={styles.orderTotal}>Total: 💎 160.00 TLB</Text>
                    <View style={styles.orderActions}>
                      <TouchableOpacity style={styles.orderActionButton}>
                        <Text style={styles.orderActionText}>Track</Text>
                      </TouchableOpacity>
                      <TouchableOpacity style={styles.orderActionButton}>
                        <Text style={styles.orderActionText}>Details</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
                
                {/* Order 4 - Delivered */}
                <View style={styles.orderCard}>
                  <View style={styles.orderHeader}>
                    <View style={styles.orderIdSection}>
                      <Text style={styles.orderId}>ORD-004</Text>
                      <Text style={styles.orderDate}>Feb 5, 2024</Text>
                    </View>
                    <View style={[styles.orderStatus, styles.deliveredStatus]}>
                      <Text style={styles.orderStatusText}>✅ Delivered</Text>
                    </View>
                  </View>
                  
                  <View style={styles.orderItems}>
                    <View style={styles.orderItem}>
                      <Ionicons name="battery-charging" size={16} color="#D4AF37" />
                      <Text style={styles.orderItemName}>Wireless Charging Pad</Text>
                      <Text style={styles.orderItemPrice}>💎 45.00</Text>
                    </View>
                  </View>
                  
                  <View style={styles.orderFooter}>
                    <Text style={styles.orderTotal}>Total: 💎 45.00 TLB</Text>
                    <View style={styles.orderActions}>
                      <TouchableOpacity style={styles.orderActionButton}>
                        <Text style={styles.orderActionText}>Reorder</Text>
                      </TouchableOpacity>
                      <TouchableOpacity style={styles.orderActionButton}>
                        <Text style={styles.orderActionText}>Review</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
                
                {/* Order 5 - Cancelled */}
                <View style={styles.orderCard}>
                  <View style={styles.orderHeader}>
                    <View style={styles.orderIdSection}>
                      <Text style={styles.orderId}>ORD-005</Text>
                      <Text style={styles.orderDate}>Jan 28, 2024</Text>
                    </View>
                    <View style={[styles.orderStatus, styles.cancelledStatus]}>
                      <Text style={styles.orderStatusText}>❌ Cancelled</Text>
                    </View>
                  </View>
                  
                  <View style={styles.orderItems}>
                    <View style={styles.orderItem}>
                      <Ionicons name="bulb" size={16} color="#D4AF37" />
                      <Text style={styles.orderItemName}>Smart LED Bulb</Text>
                      <Text style={styles.orderItemPrice}>💎 25.00</Text>
                    </View>
                  </View>
                  
                  <View style={styles.orderFooter}>
                    <View style={styles.orderTotalContainer}>
                      <Text style={styles.orderTotal}>Total: 💎 25.00 TLB</Text>
                      <Text style={styles.refundedText}>(Refunded)</Text>
                    </View>
                    <View style={styles.orderActions}>
                      <TouchableOpacity style={styles.orderActionButton}>
                        <Text style={styles.orderActionText}>Reorder</Text>
                      </TouchableOpacity>
                      <TouchableOpacity style={styles.orderActionButton}>
                        <Text style={styles.orderActionText}>Details</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              </View>
              
              {/* Action Buttons */}
              <View style={styles.orderModalActions}>
                <TouchableOpacity 
                  style={styles.trackAllButton}
                  onPress={() => {
                    setShowOrdersModal(false);
                    Alert.alert('Track Orders', 'Order tracking feature coming soon!');
                  }}
                >
                  <Ionicons name="location" size={16} color="#FFFFFF" />
                  <Text style={styles.trackAllText}>Track All Active Orders</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={styles.exportOrdersButton}
                  onPress={() => {
                    setShowOrdersModal(false);
                    Alert.alert('Export', 'Order history export feature coming soon!');
                  }}
                >
                  <Ionicons name="download" size={16} color="#FFFFFF" />
                  <Text style={styles.exportOrdersText}>Export Order History</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>

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
    position: 'relative',
  },
  avatarImage: {
    width: 56,
    height: 56,
    borderRadius: 28,
  },
  avatarEditBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#D4AF37',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
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
  paymentDescription: {
    fontSize: 16,
    color: '#2C1810',
    marginBottom: 20,
    fontWeight: '600',
    textAlign: 'center',
  },
  paymentSummary: {
    backgroundColor: '#F5E6A3',
    borderRadius: 12,
    padding: 15,
    marginBottom: 20,
    borderWidth: 2,
    borderColor: '#D4AF37',
  },
  paymentStatsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 10,
  },
  paymentStatCard: {
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 12,
    minWidth: 80,
    borderWidth: 1,
    borderColor: '#D4AF37',
  },
  paymentStatNumber: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#D4AF37',
    marginBottom: 3,
  },
  paymentStatLabel: {
    fontSize: 11,
    color: '#8B4513',
    fontWeight: '600',
    textAlign: 'center',
  },
  paymentSection: {
    marginBottom: 25,
  },
  paymentSectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2C1810',
    marginBottom: 15,
    paddingBottom: 8,
    borderBottomWidth: 2,
    borderBottomColor: '#D4AF37',
  },
  paymentMethodCard: {
    flexDirection: 'row',
    alignItems: 'center',
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
  defaultPaymentMethod: {
    borderColor: '#10B981',
    borderWidth: 2,
    backgroundColor: '#F0FDF4',
  },
  paymentMethodIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#F5E6A3',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  paymentMethodEmoji: {
    fontSize: 24,
  },
  paymentMethodContent: {
    flex: 1,
    marginRight: 10,
  },
  paymentMethodHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  paymentMethodType: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2C1810',
    marginRight: 8,
  },
  defaultBadge: {
    backgroundColor: '#10B981',
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  defaultText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: 'bold',
  },
  paymentMethodDetails: {
    fontSize: 14,
    color: '#8B4513',
    marginBottom: 3,
  },
  paymentMethodExtra: {
    fontSize: 12,
    color: '#A0522D',
    fontWeight: '500',
  },
  paymentMethodBalance: {
    fontSize: 14,
    color: '#D4AF37',
    fontWeight: '600',
    marginTop: 2,
  },
  paymentMethodStatus: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 30,
  },
  statusActive: {
    fontSize: 18,
  },
  statusConnected: {
    fontSize: 18,
  },
  paymentSecurity: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0FDF4',
    borderRadius: 8,
    padding: 12,
    marginTop: 10,
    borderWidth: 1,
    borderColor: '#10B981',
  },
  paymentSecurityText: {
    flex: 1,
    fontSize: 12,
    color: '#065F46',
    fontWeight: '500',
    lineHeight: 16,
    marginLeft: 8,
  },
  paymentActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderTopWidth: 1,
    borderTopColor: '#D4AF37',
    gap: 12,
  },
  addMethodButton: {
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
  addMethodText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 6,
  },
  manageMethodsButton: {
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
  manageMethodsText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 6,
  },
  // Payment form styles
  paymentForm: {
    marginBottom: 20,
  },
  formSectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2C1810',
    marginBottom: 15,
  },
  inputGroup: {
    marginBottom: 15,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#8B4513',
    marginBottom: 8,
  },
  paymentInput: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D4AF37',
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 16,
    color: '#2C1810',
  },
  inputRow: {
    flexDirection: 'row',
    gap: 15,
  },
  inputGroupHalf: {
    flex: 1,
  },
  paymentNote: {
    backgroundColor: '#FFF3CD',
    borderRadius: 8,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: 10,
  },
  paymentNoteText: {
    fontSize: 12,
    color: '#856404',
    marginLeft: 8,
    flex: 1,
  },
  paymentFormActions: {
    flexDirection: 'row',
    gap: 15,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#F5E6A3',
    marginTop: 20,
  },
  cancelPaymentButton: {
    flex: 1,
    backgroundColor: '#8B4513',
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
  },
  cancelPaymentText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  savePaymentButton: {
    flex: 1,
    backgroundColor: '#D4AF37',
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  savePaymentText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  // Orders modal styles
  orderModalContentContainer: {
    paddingBottom: 30,
  },
  orderDescription: {
    fontSize: 14,
    color: '#8B4513',
    marginBottom: 20,
    textAlign: 'center',
  },
  orderSummary: {
    backgroundColor: '#F5E6A3',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#D4AF37',
  },
  orderStatsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 15,
  },
  orderStatCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 4,
    borderWidth: 1,
    borderColor: '#D4AF37',
  },
  orderStatNumber: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2C1810',
    marginBottom: 4,
  },
  orderStatLabel: {
    fontSize: 10,
    color: '#8B4513',
    textAlign: 'center',
  },
  orderSection: {
    marginBottom: 20,
  },
  orderSectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2C1810',
    marginBottom: 15,
  },
  orderCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#D4AF37',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  orderIdSection: {
    flex: 1,
  },
  orderId: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2C1810',
  },
  orderDate: {
    fontSize: 12,
    color: '#8B4513',
    marginTop: 2,
  },
  orderStatus: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  deliveredStatus: {
    backgroundColor: '#D1FAE5',
  },
  processingStatus: {
    backgroundColor: '#FEF3C7',
  },
  shippedStatus: {
    backgroundColor: '#DBEAFE',
  },
  cancelledStatus: {
    backgroundColor: '#FEE2E2',
  },
  orderStatusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  orderItems: {
    marginBottom: 12,
  },
  orderItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
  },
  orderItemName: {
    flex: 1,
    fontSize: 14,
    color: '#2C1810',
    marginLeft: 8,
  },
  orderItemPrice: {
    fontSize: 14,
    fontWeight: '600',
    color: '#D4AF37',
  },
  orderFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#F5E6A3',
    paddingTop: 12,
    minHeight: 40,
  },
  orderTotalContainer: {
    flex: 1,
    marginRight: 10,
  },
  orderTotal: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2C1810',
  },
  refundedText: {
    fontSize: 12,
    color: '#8B4513',
    fontStyle: 'italic',
    marginTop: 2,
  },
  orderActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    flexShrink: 0,
  },
  orderActionButton: {
    backgroundColor: '#D4AF37',
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginLeft: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  orderActionText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  orderModalActions: {
    flexDirection: 'row',
    gap: 12,
    paddingTop: 15,
    paddingBottom: 10,
    borderTopWidth: 1,
    borderTopColor: '#F5E6A3',
    marginTop: 15,
  },
  trackAllButton: {
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
  trackAllText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 6,
  },
  exportOrdersButton: {
    flex: 1,
    backgroundColor: '#8B4513',
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
  exportOrdersText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 6,
  },
});