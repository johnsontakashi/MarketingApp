import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Alert, Modal, TextInput, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import CustomAlert from '../components/ui/CustomAlert';
import { useCustomAlert } from '../hooks/useCustomAlert';

export default function ProfileScreen({ navigation }) {
  const { alertConfig, showAlert, hideAlert, showSuccess, showError, showWarning, showInfo, showConfirm } = useCustomAlert();
  
  const [showEditModal, setShowEditModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showFullSettingsModal, setShowFullSettingsModal] = useState(false);
  const [showResetConfirmModal, setShowResetConfirmModal] = useState(false);
  const [showHelpModal, setShowHelpModal] = useState(false);
  const [showNotificationsModal, setShowNotificationsModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showAddPaymentModal, setShowAddPaymentModal] = useState(false);
  const [showOrdersModal, setShowOrdersModal] = useState(false);
  const [showTrackModal, setShowTrackModal] = useState(false);
  const [trackingData, setTrackingData] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [orderDetailsData, setOrderDetailsData] = useState(null);
  const [showReorderModal, setShowReorderModal] = useState(false);
  const [reorderData, setReorderData] = useState(null);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviewData, setReviewData] = useState(null);
  const [selectedRating, setSelectedRating] = useState(0);
  const [showAddedToCartModal, setShowAddedToCartModal] = useState(false);
  const [addedToCartData, setAddedToCartData] = useState(null);
  const [showExportModal, setShowExportModal] = useState(false);
  const [exportData, setExportData] = useState(null);
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

  // Full Settings state variables
  const [deviceBindingEnabled, setDeviceBindingEnabled] = useState(true);
  const [analyticsOptOut, setAnalyticsOptOut] = useState(false);
  const [developerModeEnabled, setDeveloperModeEnabled] = useState(false);
  const [betaFeaturesEnabled, setBetaFeaturesEnabled] = useState(false);
  const [pinCodeLength, setPinCodeLength] = useState(6);
  const [sessionTimeout, setSessionTimeout] = useState(5);

  // Full Settings handler functions
  const handleChangePinLength = () => {
    showAlert({
      title: 'Change PIN Code Length',
      message: 'Select new PIN code length:',
      type: 'info',
      buttons: [
        { text: '4 digits', onPress: () => setPinCodeLength(4) },
        { text: '6 digits', onPress: () => setPinCodeLength(6) },
        { text: '8 digits', onPress: () => setPinCodeLength(8) },
        { text: 'Cancel', style: 'cancel' }
      ]
    });
  };

  const handleConfigureSessionTimeout = () => {
    showAlert({
      title: 'Configure Session Timeout',
      message: 'Select auto-logout duration:',
      type: 'info',
      buttons: [
        { text: '1 minute', onPress: () => setSessionTimeout(1) },
        { text: '5 minutes', onPress: () => setSessionTimeout(5) },
        { text: '15 minutes', onPress: () => setSessionTimeout(15) },
        { text: '30 minutes', onPress: () => setSessionTimeout(30) },
        { text: 'Cancel', style: 'cancel' }
      ]
    });
  };

  const handleToggleDeviceBinding = () => {
    setDeviceBindingEnabled(!deviceBindingEnabled);
    showSuccess(
      'Device Binding',
      deviceBindingEnabled 
        ? 'Device binding has been disabled. Your account can now be accessed from other devices.'
        : 'Device binding has been enabled. Your account is now restricted to this device only.'
    );
  };

  const handleDataExport = () => {
    showSuccess(
      'Data Export',
      'Your data export is being prepared. You will receive an email with download links within 24 hours.',
      [
        {
          text: 'OK',
          onPress: () => console.log('Data export requested')
        }
      ]
    );
  };

  const handleToggleAnalyticsOptOut = () => {
    setAnalyticsOptOut(!analyticsOptOut);
    showInfo(
      'Analytics Settings',
      analyticsOptOut 
        ? 'Analytics tracking has been enabled. Anonymous usage data will be collected to improve the app.'
        : 'Analytics tracking has been disabled. No usage data will be collected.'
    );
  };

  const handleToggleDeveloperMode = () => {
    if (!developerModeEnabled) {
      showWarning(
        'Enable Developer Mode',
        'This will enable advanced debugging features and may affect app performance. Continue?',
        [
          {
            text: 'Enable',
            onPress: () => {
              setDeveloperModeEnabled(true);
              showSuccess('Developer Mode Enabled', 'Debug features are now available.');
            }
          },
          { text: 'Cancel', style: 'cancel' }
        ]
      );
    } else {
      setDeveloperModeEnabled(false);
      showSuccess('Developer Mode Disabled', 'Debug features have been disabled.');
    }
  };

  const handleToggleBetaFeatures = () => {
    if (!betaFeaturesEnabled) {
      showWarning(
        'Enable Beta Features',
        'Beta features are experimental and may be unstable. Enable at your own risk.',
        [
          {
            text: 'Enable',
            onPress: () => {
              setBetaFeaturesEnabled(true);
              showSuccess('Beta Features Enabled', 'Experimental features are now available.');
            }
          },
          { text: 'Cancel', style: 'cancel' }
        ]
      );
    } else {
      setBetaFeaturesEnabled(false);
      showSuccess('Beta Features Disabled', 'Experimental features have been disabled.');
    }
  };

  // Help & Support handler functions
  const handleAccountIssues = () => {
    showInfo(
      'Account Issues',
      'Common account problems and solutions:\n\n• Login Problems: Try resetting your password\n• Profile Updates: Check your internet connection\n• Verification Issues: Contact support with ID documents\n• Account Security: Enable two-factor authentication',
      [
        { text: 'Reset Password', onPress: () => showInfo('Password Reset', 'Password reset link sent to your email address.') },
        { text: 'Contact Support', onPress: () => handleLiveChat() },
        { text: 'Close', style: 'cancel' }
      ]
    );
  };

  const handlePaymentProblems = () => {
    showWarning(
      'Payment Problems',
      'Transaction and wallet troubleshooting:\n\n• Failed Payments: Check card details and bank limits\n• Wallet Sync: Refresh your wallet balance\n• Missing Transactions: Allow 24-48 hours for processing\n• Refund Requests: Contact support with transaction ID',
      [
        { text: 'Refresh Wallet', onPress: () => showSuccess('Wallet Refreshed', 'Your wallet balance has been updated.') },
        { text: 'Transaction History', onPress: () => navigation.navigate('Wallet') },
        { text: 'Contact Support', onPress: () => handleLiveChat() },
        { text: 'Close', style: 'cancel' }
      ]
    );
  };

  const handleTechnicalSupport = () => {
    showError(
      'Technical Support',
      'App performance and bug reporting:\n\n• App Crashes: Try restarting the app\n• Slow Performance: Clear app cache\n• Feature Bugs: Report with screenshots\n• Update Issues: Check app store for updates',
      [
        { text: 'Clear Cache', onPress: () => showSuccess('Cache Cleared', 'App cache has been cleared. Restart recommended.') },
        { text: 'Report Bug', onPress: () => handleSubmitTicket() },
        { text: 'Contact Support', onPress: () => handleLiveChat() },
        { text: 'Close', style: 'cancel' }
      ]
    );
  };

  const handleSecurityConcerns = () => {
    showWarning(
      'Security Concerns',
      'Device security and access issues:\n\n• Device Lock: Use emergency unlock if needed\n• Unauthorized Access: Change password immediately\n• SIM Card Issues: Contact your carrier\n• Suspicious Activity: Review transaction history',
      [
        { text: 'Emergency Unlock', onPress: () => navigation.navigate('DeviceStatus') },
        { text: 'Change Password', onPress: () => showInfo('Password Change', 'Password change link sent to your email.') },
        { text: 'Contact Support', onPress: () => handleLiveChat() },
        { text: 'Close', style: 'cancel' }
      ]
    );
  };

  const handleUserGuide = () => {
    showInfo(
      'User Guide',
      'Complete app usage instructions:\n\n📱 Getting Started\n💰 Wallet Management\n🛒 Marketplace Usage\n🔒 Security Features\n👥 Community Features\n⚙️ Settings & Preferences',
      [
        { text: 'Download PDF', onPress: () => showSuccess('Download Started', 'User guide PDF is being downloaded to your device.') },
        { text: 'Online Guide', onPress: () => showInfo('Opening Browser', 'Opening online user guide in your browser...') },
        { text: 'Close', style: 'cancel' }
      ]
    );
  };

  const handleVideoTutorials = () => {
    showInfo(
      'Video Tutorials',
      'Step-by-step visual guides available:\n\n🎥 App Setup & Registration\n🎥 Wallet & Payment Setup\n🎥 Making Your First Purchase\n🎥 Community & Referrals\n🎥 Security & Device Lock\n🎥 Troubleshooting Tips',
      [
        { text: 'Watch Now', onPress: () => showSuccess('Opening Videos', 'Redirecting to video tutorials...') },
        { text: 'Download Offline', onPress: () => showInfo('Download', 'Offline video package is being prepared...') },
        { text: 'Close', style: 'cancel' }
      ]
    );
  };

  const handleFAQ = () => {
    showInfo(
      'Frequently Asked Questions',
      'Quick answers to common questions:\n\n❓ How do I add funds to my wallet?\n❓ What is kiosk mode?\n❓ How do I invite friends?\n❓ Why is my device locked?\n❓ How do I contact support?\n❓ How do I update the app?',
      [
        { text: 'View All FAQs', onPress: () => showInfo('FAQ', 'Opening comprehensive FAQ section...') },
        { text: 'Search FAQs', onPress: () => showInfo('Search', 'FAQ search feature coming soon!') },
        { text: 'Close', style: 'cancel' }
      ]
    );
  };

  const handleCommunityForum = () => {
    showInfo(
      'Community Forum',
      'Connect with other TLB Diamond users:\n\n👥 Share experiences and tips\n💡 Get help from the community\n📢 Latest announcements\n🎁 Community challenges\n⭐ Success stories',
      [
        { text: 'Join Forum', onPress: () => showSuccess('Joining', 'Redirecting to TLB Diamond community forum...') },
        { text: 'Browse Topics', onPress: () => showInfo('Browse', 'Opening popular forum topics...') },
        { text: 'Close', style: 'cancel' }
      ]
    );
  };

  const handleLiveChat = () => {
    showSuccess(
      'Live Chat',
      'Connecting to support agent...\n\n⏱️ Estimated wait time: < 2 minutes\n\n💬 Please describe your issue briefly when connected.\n\n✅ Available 24/7 for urgent issues',
      [
        { text: 'Continue', onPress: () => showInfo('Chat Started', 'Live chat session initiated. Agent will connect shortly.') },
        { text: 'Cancel', style: 'cancel' }
      ]
    );
  };

  const handleEmailSupport = () => {
    showInfo(
      'Email Support',
      'Send us a detailed message:\n\n📧 support@tlbdiamond.com\n\n⏱️ Response time: 4-6 hours\n\nPlease include:\n• Detailed description\n• Device information\n• Screenshots if applicable\n• Your account email',
      [
        { text: 'Open Email App', onPress: () => showSuccess('Opening Email', 'Opening your default email app...') },
        { text: 'Copy Email', onPress: () => showSuccess('Copied', 'Email address copied to clipboard!') },
        { text: 'Close', style: 'cancel' }
      ]
    );
  };

  const handlePhoneSupport = () => {
    showInfo(
      'Phone Support',
      'Call our support team:\n\n📞 +1 (555) DIAMOND (342-6663)\n\n⏰ Hours: 9 AM - 9 PM EST\n🌍 Available Monday - Sunday\n\n🎯 Best for urgent issues requiring immediate assistance',
      [
        { text: 'Call Now', onPress: () => showSuccess('Calling', 'Opening phone dialer...') },
        { text: 'Save Number', onPress: () => showSuccess('Saved', 'Support number saved to contacts!') },
        { text: 'Close', style: 'cancel' }
      ]
    );
  };

  const handleSubmitTicket = () => {
    showInfo(
      'Submit Support Ticket',
      'Create a detailed support request:\n\n📝 Include problem description\n📱 Device and app information\n📸 Screenshots or videos\n⚡ Priority level selection\n\n⏱️ Response time: 2-4 hours for urgent issues',
      [
        { text: 'Create Ticket', onPress: () => showSuccess('Ticket Created', 'Support ticket #TLB-12345 created successfully!\n\nYou will receive email updates on progress.') },
        { text: 'Email Instead', onPress: () => handleEmailSupport() },
        { text: 'Close', style: 'cancel' }
      ]
    );
  };

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
    showSuccess('Profile Updated', 'Your profile has been successfully updated!');
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
    showSuccess("Success", "Profile picture updated successfully!");
  };

  const removeAvatar = () => {
    setProfileData({ ...profileData, avatar: null });
    setEditData({ ...editData, avatar: null });
    showSuccess("Success", "Profile picture removed successfully!");
  };

  const handleMyOrders = () => {
    setShowOrdersModal(true);
  };

  const handlePaymentMethods = () => {
    setShowPaymentModal(true);
  };

  const handleShowAddMethodOptions = () => {
    Alert.alert(
      '💳 Add Payment Method',
      'Choose the type of payment method you want to add:',
      [
        {
          text: '💳 Credit/Debit Card',
          onPress: () => handleAddPaymentMethod('credit')
        },
        {
          text: '🏦 Bank Account',
          onPress: () => handleAddPaymentMethod('bank')
        },
        {
          text: '📱 PayPal',
          onPress: () => handleAddPaymentMethod('paypal')
        },
        {
          text: '🎁 Gift Card',
          onPress: () => handleAddPaymentMethod('gift')
        },
        {
          text: 'Cancel',
          style: 'cancel'
        }
      ]
    );
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

  const handleTrackOrder = (orderId, orderStatus, productName) => {
    let trackingData;
    
    switch (orderStatus) {
      case 'Processing':
        trackingData = {
          orderId,
          productName,
          status: 'Processing',
          statusColor: '#F59E0B',
          statusIcon: 'hourglass',
          steps: [
            { step: 'Order Placed', completed: true, date: 'Feb 15, 2024 at 2:30 PM' },
            { step: 'Processing Payment', completed: false, date: 'In Progress', current: true },
            { step: 'Preparing for Shipment', completed: false, date: 'Pending' },
            { step: 'Shipped', completed: false, date: 'Pending' },
            { step: 'Out for Delivery', completed: false, date: 'Pending' },
            { step: 'Delivered', completed: false, date: 'Pending' }
          ],
          estimatedDelivery: 'Feb 18-20, 2024',
          trackingNumber: null,
          carrier: null
        };
        break;
      case 'Shipped':
        trackingData = {
          orderId,
          productName,
          status: 'Shipped',
          statusColor: '#3B82F6',
          statusIcon: 'car',
          steps: [
            { step: 'Order Placed', completed: true, date: 'Feb 10, 2024 at 10:15 AM' },
            { step: 'Payment Confirmed', completed: true, date: 'Feb 10, 2024 at 10:16 AM' },
            { step: 'Prepared for Shipment', completed: true, date: 'Feb 11, 2024 at 9:00 AM' },
            { step: 'Shipped', completed: true, date: 'Feb 12, 2024 at 8:30 AM' },
            { step: 'Out for Delivery', completed: false, date: 'Today', current: true },
            { step: 'Delivered', completed: false, date: 'Pending' }
          ],
          estimatedDelivery: 'Today by 6:00 PM',
          trackingNumber: 'TLB123456789',
          carrier: 'TLB Express'
        };
        break;
      case 'Delivered':
        trackingData = {
          orderId,
          productName,
          status: 'Delivered',
          statusColor: '#10B981',
          statusIcon: 'checkmark-circle',
          steps: [
            { step: 'Order Placed', completed: true, date: 'Feb 5, 2024 at 3:45 PM' },
            { step: 'Payment Confirmed', completed: true, date: 'Feb 5, 2024 at 3:46 PM' },
            { step: 'Prepared for Shipment', completed: true, date: 'Feb 6, 2024 at 11:00 AM' },
            { step: 'Shipped', completed: true, date: 'Feb 7, 2024 at 7:20 AM' },
            { step: 'Out for Delivery', completed: true, date: 'Feb 8, 2024 at 8:00 AM' },
            { step: 'Delivered', completed: true, date: 'Feb 8, 2024 at 2:15 PM', current: true }
          ],
          estimatedDelivery: 'Delivered',
          trackingNumber: 'TLB123456789',
          carrier: 'TLB Express',
          deliveryDetails: {
            deliveredTo: 'John Doe',
            location: 'Front Door',
            signature: 'Not Required'
          }
        };
        break;
      default:
        trackingData = {
          orderId,
          productName,
          status: 'Unknown',
          statusColor: '#8B4513',
          statusIcon: 'help-circle',
          steps: [],
          estimatedDelivery: 'Information being updated',
          trackingNumber: null,
          carrier: null
        };
    }

    setTrackingData(trackingData);
    setShowTrackModal(true);
  };

  const handleOrderDetails = (orderId, orderStatus, items, total, orderDate) => {
    let statusColor, statusIcon, statusDescription;
    
    switch (orderStatus) {
      case 'Processing':
        statusColor = '#F59E0B';
        statusIcon = 'hourglass';
        statusDescription = 'Your order is being processed and will be shipped soon.';
        break;
      case 'Shipped':
        statusColor = '#3B82F6';
        statusIcon = 'car';
        statusDescription = 'Your order has been shipped and is on its way!';
        break;
      case 'Delivered':
        statusColor = '#10B981';
        statusIcon = 'checkmark-circle';
        statusDescription = 'Your order has been successfully delivered.';
        break;
      case 'Cancelled':
        statusColor = '#EF4444';
        statusIcon = 'close-circle';
        statusDescription = 'This order has been cancelled and refunded.';
        break;
      default:
        statusColor = '#8B4513';
        statusIcon = 'information-circle';
        statusDescription = 'Order status information.';
    }

    const orderDetailsData = {
      orderId,
      orderDate,
      orderStatus,
      statusColor,
      statusIcon,
      statusDescription,
      items,
      total,
      paymentMethod: 'TLB Diamond Wallet',
      shippingMethod: 'Standard Delivery',
      deliveryAddress: '123 Main Street, City, State 12345',
      customerService: 'support@tlbdiamond.com'
    };

    setOrderDetailsData(orderDetailsData);
    setShowDetailsModal(true);
  };

  const handleReorder = (orderId, items, total) => {
    const reorderInfo = {
      orderId,
      items,
      total,
      itemsList: items.map(item => ({ name: item.name, price: item.price })),
      subtotal: parseFloat(total),
      tax: parseFloat(total) * 0.08,
      shipping: 5.99,
      finalTotal: parseFloat(total) + (parseFloat(total) * 0.08) + 5.99
    };
    
    setReorderData(reorderInfo);
    setShowReorderModal(true);
  };

  const handleAddToCart = () => {
    setShowReorderModal(false);
    
    const cartData = {
      orderId: reorderData?.orderId,
      itemCount: reorderData?.items?.length,
      totalAmount: reorderData?.finalTotal?.toFixed(2),
      items: reorderData?.itemsList || [],
      subtotal: reorderData?.subtotal?.toFixed(2),
      tax: reorderData?.tax?.toFixed(2),
      shipping: reorderData?.shipping?.toFixed(2)
    };
    
    setAddedToCartData(cartData);
    setShowAddedToCartModal(true);
  };

  const handleExportOrderHistory = () => {
    // Static order data based on the hardcoded values in the orders modal
    const staticOrders = [
      { id: 'ORD-001', date: 'Feb 20, 2024', total: 200.00, status: 'Delivered', items: ['Premium Wireless Headphones'] },
      { id: 'ORD-002', date: 'Feb 18, 2024', total: 150.00, status: 'In Transit', items: ['Smart Fitness Watch'] },
      { id: 'ORD-003', date: 'Feb 15, 2024', total: 75.00, status: 'Processing', items: ['Gaming Mouse Pro'] },
      { id: 'ORD-004', date: 'Feb 12, 2024', total: 80.00, status: 'Delivered', items: ['Bluetooth Speaker'] },
      { id: 'ORD-005', date: 'Feb 10, 2024', total: 25.00, status: 'Cancelled', items: ['Phone Case'] }
    ];

    const ordersData = {
      totalOrders: staticOrders.length,
      totalValue: staticOrders.reduce((sum, order) => sum + order.total, 0),
      ordersList: staticOrders,
      exportDate: new Date().toISOString().split('T')[0],
      availableFormats: ['PDF', 'CSV', 'JSON', 'Excel']
    };
    
    setExportData(ordersData);
    setShowExportModal(true);
  };

  const handleReview = (orderId, items, orderStatus) => {
    if (orderStatus !== 'Delivered') {
      Alert.alert(
        '📝 Review Not Available',
        'You can only review orders that have been delivered. Please wait until your order is completed.',
        [{ text: 'OK', style: 'cancel' }]
      );
      return;
    }
    
    const reviewInfo = {
      orderId,
      items,
      itemsList: items.map(item => item.name).join(', '),
      orderStatus
    };
    
    setReviewData(reviewInfo);
    setSelectedRating(0);
    setShowReviewModal(true);
  };

  const submitReview = (rating, reviewText) => {
    setShowReviewModal(false);
    
    const descriptions = {
      1: reviewText || 'Poor experience',
      2: reviewText || 'Below average experience', 
      3: reviewText || 'Average experience',
      4: reviewText || 'Good experience',
      5: reviewText || 'Excellent experience'
    };
    
    Alert.alert(
      '✅ Review Submitted',
      `Thank you for your ${rating}-star review of Order ${reviewData?.orderId}!\n\n"${descriptions[rating]}"\n\nYour feedback helps us improve our products and service. You've earned 5 TLB Diamond bonus points!`,
      [
        { text: 'View My Reviews', onPress: () => Alert.alert('📝 Reviews', 'Review history feature coming soon!') },
        { text: 'OK', style: 'cancel' }
      ]
    );
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
          '🚪 Sign Out',
          'Are you sure you want to sign out?\n\n• Your session will be ended\n• You will need to log back in\n• Any unsaved changes will be lost',
          [
            { text: 'Cancel', style: 'cancel' },
            { 
              text: 'Sign Out', 
              style: 'destructive', 
              onPress: () => {
                // Show signing out process
                Alert.alert(
                  '✅ Signing Out',
                  'Please wait while we securely sign you out...',
                  [],
                  { cancelable: false }
                );
                
                // Simulate sign out process
                setTimeout(() => {
                  Alert.alert(
                    '👋 Signed Out Successfully',
                    'You have been securely signed out of TLB Diamond.\n\n• All local data cleared\n• Session terminated\n• Security tokens removed\n\nThank you for using TLB Diamond!',
                    [
                      { 
                        text: 'Return to Home', 
                        onPress: () => {
                          // Navigate back to home screen
                          navigation.navigate('Home');
                          // In a real app, you would:
                          // - Clear AsyncStorage/SecureStore
                          // - Reset navigation state
                          // - Navigate to login screen
                          console.log('User signed out successfully');
                        }
                      }
                    ]
                  );
                }, 2000);
              }
            }
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
        animationType="fade"
        transparent={true}
        visible={showPaymentModal}
        onRequestClose={() => setShowPaymentModal(false)}
        statusBarTranslucent={true}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>💳 Payment Methods</Text>
              <TouchableOpacity 
                style={styles.modalCloseButton}
                onPress={() => setShowPaymentModal(false)}
              >
                <Ionicons name="close" size={24} color="#8B4513" />
              </TouchableOpacity>
            </View>

            <ScrollView 
              style={styles.modalContent}
              contentContainerStyle={styles.paymentModalContentContainer}
              showsVerticalScrollIndicator={false}
            >
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
                  handleShowAddMethodOptions();
                }}
              >
                <Ionicons name="add" size={20} color="#FFFFFF" />
                <Text style={styles.addMethodText}>Add New Method</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.manageMethodsButton}
                onPress={() => {
                  setShowPaymentModal(false);
                  Alert.alert('Manage', 'Payment method management coming soon!');
                }}
              >
                <Ionicons name="settings" size={20} color="#6B7280" />
                <Text style={styles.manageMethodsText}>Manage Methods</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Add Payment Method Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={showAddPaymentModal}
        onRequestClose={() => setShowAddPaymentModal(false)}
        statusBarTranslucent={true}
      >
        <View style={styles.addPaymentModalOverlay}>
          <View style={styles.addPaymentModalContainer}>
            
            {/* Header Section */}
            <View style={styles.addPaymentModalHeader}>
              <View style={styles.addPaymentIconContainer}>
                {selectedPaymentType === 'credit' && <Ionicons name="card" size={32} color="#D4AF37" />}
                {selectedPaymentType === 'bank' && <Ionicons name="business" size={32} color="#D4AF37" />}
                {selectedPaymentType === 'paypal' && <Ionicons name="logo-paypal" size={32} color="#D4AF37" />}
                {selectedPaymentType === 'gift' && <Ionicons name="gift" size={32} color="#D4AF37" />}
              </View>
              
              <Text style={styles.addPaymentModalTitle}>
                {selectedPaymentType === 'credit' && '💳 Add Credit Card'}
                {selectedPaymentType === 'bank' && '🏦 Add Bank Account'}
                {selectedPaymentType === 'paypal' && '🅿️ Add PayPal Account'}
                {selectedPaymentType === 'gift' && '🎁 Add Gift Card'}
              </Text>
              
              <Text style={styles.addPaymentModalSubtitle}>
                Securely add your payment information to your TLB Diamond wallet
              </Text>
              
              <TouchableOpacity 
                style={styles.addPaymentCloseButton}
                onPress={() => setShowAddPaymentModal(false)}
              >
                <Ionicons name="close" size={24} color="#8B4513" />
              </TouchableOpacity>
            </View>
            
            <ScrollView style={styles.addPaymentModalContent} showsVerticalScrollIndicator={false}>
              {/* Credit Card Form */}
              {selectedPaymentType === 'credit' && (
                <View style={styles.addPaymentForm}>
                  <View style={styles.addPaymentFormSection}>
                    <Text style={styles.addPaymentSectionTitle}>
                      <Ionicons name="card" size={18} color="#D4AF37" /> Credit Card Information
                    </Text>
                    
                    <View style={styles.addPaymentInputContainer}>
                      <Text style={styles.addPaymentInputLabel}>Card Number</Text>
                      <View style={styles.addPaymentInputWrapper}>
                        <Ionicons name="card-outline" size={20} color="#8B4513" style={styles.addPaymentInputIcon} />
                        <TextInput
                          style={styles.addPaymentInput}
                          placeholder="1234 5678 9012 3456"
                          placeholderTextColor="#B8860B"
                          value={paymentFormData.cardNumber}
                          onChangeText={(text) => setPaymentFormData({...paymentFormData, cardNumber: text})}
                          keyboardType="numeric"
                          maxLength={19}
                        />
                      </View>
                    </View>
                    
                    <View style={styles.addPaymentInputRow}>
                      <View style={styles.addPaymentInputContainerHalf}>
                        <Text style={styles.addPaymentInputLabel}>Expiry Date</Text>
                        <View style={styles.addPaymentInputWrapper}>
                          <Ionicons name="calendar-outline" size={20} color="#8B4513" style={styles.addPaymentInputIcon} />
                          <TextInput
                            style={styles.addPaymentInput}
                            placeholder="MM/YY"
                            placeholderTextColor="#B8860B"
                            value={paymentFormData.expiryDate}
                            onChangeText={(text) => setPaymentFormData({...paymentFormData, expiryDate: text})}
                            keyboardType="numeric"
                            maxLength={5}
                          />
                        </View>
                      </View>
                      
                      <View style={styles.addPaymentInputContainerHalf}>
                        <Text style={styles.addPaymentInputLabel}>CVV</Text>
                        <View style={styles.addPaymentInputWrapper}>
                          <Ionicons name="shield-checkmark-outline" size={20} color="#8B4513" style={styles.addPaymentInputIcon} />
                          <TextInput
                            style={styles.addPaymentInput}
                            placeholder="123"
                            placeholderTextColor="#B8860B"
                            value={paymentFormData.cvv}
                            onChangeText={(text) => setPaymentFormData({...paymentFormData, cvv: text})}
                            keyboardType="numeric"
                            maxLength={4}
                            secureTextEntry
                          />
                        </View>
                      </View>
                    </View>
                    
                    <View style={styles.addPaymentInputContainer}>
                      <Text style={styles.addPaymentInputLabel}>Cardholder Name</Text>
                      <View style={styles.addPaymentInputWrapper}>
                        <Ionicons name="person-outline" size={20} color="#8B4513" style={styles.addPaymentInputIcon} />
                        <TextInput
                          style={styles.addPaymentInput}
                          placeholder="John Doe"
                          placeholderTextColor="#B8860B"
                          value={paymentFormData.cardholderName}
                          onChangeText={(text) => setPaymentFormData({...paymentFormData, cardholderName: text})}
                          autoCapitalize="words"
                        />
                      </View>
                    </View>
                  </View>
                  
                  {/* Security Notice */}
                  <View style={styles.addPaymentSecurityNotice}>
                    <Ionicons name="shield-checkmark" size={20} color="#10B981" />
                    <Text style={styles.addPaymentSecurityText}>
                      Your payment information is encrypted and securely stored
                    </Text>
                  </View>
                </View>
              )}
              
              {/* Bank Account Form */}
              {selectedPaymentType === 'bank' && (
                <View style={styles.addPaymentForm}>
                  <View style={styles.addPaymentFormSection}>
                    <Text style={styles.addPaymentSectionTitle}>
                      <Ionicons name="business" size={18} color="#D4AF37" /> Bank Account Information
                    </Text>
                    
                    <View style={styles.addPaymentInputContainer}>
                      <Text style={styles.addPaymentInputLabel}>Bank Name</Text>
                      <View style={styles.addPaymentInputWrapper}>
                        <Ionicons name="business-outline" size={20} color="#8B4513" style={styles.addPaymentInputIcon} />
                        <TextInput
                          style={styles.addPaymentInput}
                          placeholder="Chase Bank"
                          placeholderTextColor="#B8860B"
                          value={paymentFormData.bankName}
                          onChangeText={(text) => setPaymentFormData({...paymentFormData, bankName: text})}
                          autoCapitalize="words"
                        />
                      </View>
                    </View>
                    
                    <View style={styles.addPaymentInputContainer}>
                      <Text style={styles.addPaymentInputLabel}>Account Number</Text>
                      <View style={styles.addPaymentInputWrapper}>
                        <Ionicons name="keypad-outline" size={20} color="#8B4513" style={styles.addPaymentInputIcon} />
                        <TextInput
                          style={styles.addPaymentInput}
                          placeholder="1234567890"
                          placeholderTextColor="#B8860B"
                          value={paymentFormData.accountNumber}
                          onChangeText={(text) => setPaymentFormData({...paymentFormData, accountNumber: text})}
                          keyboardType="numeric"
                          secureTextEntry
                        />
                      </View>
                    </View>
                    
                    <View style={styles.addPaymentInputContainer}>
                      <Text style={styles.addPaymentInputLabel}>Routing Number</Text>
                      <View style={styles.addPaymentInputWrapper}>
                        <Ionicons name="git-network-outline" size={20} color="#8B4513" style={styles.addPaymentInputIcon} />
                        <TextInput
                          style={styles.addPaymentInput}
                          placeholder="021000021"
                          placeholderTextColor="#B8860B"
                          value={paymentFormData.routingNumber}
                          onChangeText={(text) => setPaymentFormData({...paymentFormData, routingNumber: text})}
                          keyboardType="numeric"
                        />
                      </View>
                    </View>
                  </View>
                  
                  {/* Bank Security Notice */}
                  <View style={styles.addPaymentSecurityNotice}>
                    <Ionicons name="shield-checkmark" size={20} color="#10B981" />
                    <Text style={styles.addPaymentSecurityText}>
                      Bank-level encryption protects your account information
                    </Text>
                  </View>
                </View>
              )}
              
              {/* PayPal Form */}
              {selectedPaymentType === 'paypal' && (
                <View style={styles.addPaymentForm}>
                  <View style={styles.addPaymentFormSection}>
                    <Text style={styles.addPaymentSectionTitle}>
                      <Ionicons name="logo-paypal" size={18} color="#D4AF37" /> PayPal Account Information
                    </Text>
                    
                    <View style={styles.addPaymentInputContainer}>
                      <Text style={styles.addPaymentInputLabel}>PayPal Email Address</Text>
                      <View style={styles.addPaymentInputWrapper}>
                        <Ionicons name="mail-outline" size={20} color="#8B4513" style={styles.addPaymentInputIcon} />
                        <TextInput
                          style={styles.addPaymentInput}
                          placeholder="john.doe@example.com"
                          placeholderTextColor="#B8860B"
                          value={paymentFormData.paypalEmail}
                          onChangeText={(text) => setPaymentFormData({...paymentFormData, paypalEmail: text})}
                          keyboardType="email-address"
                          autoCapitalize="none"
                        />
                      </View>
                    </View>
                  </View>
                  
                  {/* PayPal Notice */}
                  <View style={styles.addPaymentPaypalNotice}>
                    <Ionicons name="information-circle" size={20} color="#0070BA" />
                    <Text style={styles.addPaymentPaypalText}>
                      You'll be redirected to PayPal to securely authorize this connection
                    </Text>
                  </View>
                </View>
              )}
              
              {/* Gift Card Form */}
              {selectedPaymentType === 'gift' && (
                <View style={styles.addPaymentForm}>
                  <View style={styles.addPaymentFormSection}>
                    <Text style={styles.addPaymentSectionTitle}>
                      <Ionicons name="gift" size={18} color="#D4AF37" /> Gift Card Information
                    </Text>
                    
                    <View style={styles.addPaymentInputContainer}>
                      <Text style={styles.addPaymentInputLabel}>Gift Card Number</Text>
                      <View style={styles.addPaymentInputWrapper}>
                        <Ionicons name="card-outline" size={20} color="#8B4513" style={styles.addPaymentInputIcon} />
                        <TextInput
                          style={styles.addPaymentInput}
                          placeholder="1234 5678 9012 3456"
                          placeholderTextColor="#B8860B"
                          value={paymentFormData.giftCardNumber}
                          onChangeText={(text) => setPaymentFormData({...paymentFormData, giftCardNumber: text})}
                          keyboardType="numeric"
                        />
                      </View>
                    </View>
                    
                    <View style={styles.addPaymentInputContainer}>
                      <Text style={styles.addPaymentInputLabel}>Security PIN</Text>
                      <View style={styles.addPaymentInputWrapper}>
                        <Ionicons name="keypad-outline" size={20} color="#8B4513" style={styles.addPaymentInputIcon} />
                        <TextInput
                          style={styles.addPaymentInput}
                          placeholder="1234"
                          placeholderTextColor="#B8860B"
                          value={paymentFormData.giftCardPin}
                          onChangeText={(text) => setPaymentFormData({...paymentFormData, giftCardPin: text})}
                          keyboardType="numeric"
                          maxLength={8}
                          secureTextEntry
                        />
                      </View>
                    </View>
                  </View>
                  
                  {/* Gift Card Notice */}
                  <View style={styles.addPaymentSecurityNotice}>
                    <Ionicons name="gift" size={20} color="#F59E0B" />
                    <Text style={styles.addPaymentSecurityText}>
                      Gift card balance will be added to your TLB Diamond wallet
                    </Text>
                  </View>
                </View>
              )}
              
              {/* Action Buttons */}
              <View style={styles.addPaymentModalActions}>
                <TouchableOpacity 
                  style={styles.addPaymentCancelButton}
                  onPress={handleCancelPaymentForm}
                >
                  <Ionicons name="close-circle-outline" size={20} color="#6B7280" />
                  <Text style={styles.addPaymentCancelText}>Cancel</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={styles.addPaymentSaveButton}
                  onPress={handleSavePaymentMethod}
                >
                  <Ionicons name="checkmark-circle" size={20} color="#FFFFFF" />
                  <Text style={styles.addPaymentSaveText}>Save Payment Method</Text>
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
                      <TouchableOpacity 
                        style={styles.orderActionButton}
                        onPress={() => handleReorder('ORD-001', [{name: 'Premium Wireless Headphones', price: '200.00'}], '200.00')}
                      >
                        <Text style={styles.orderActionText}>Reorder</Text>
                      </TouchableOpacity>
                      <TouchableOpacity 
                        style={styles.orderActionButton}
                        onPress={() => handleReview('ORD-001', [{name: 'Premium Wireless Headphones', price: '200.00'}], 'Delivered')}
                      >
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
                      <TouchableOpacity 
                        style={styles.orderActionButton}
                        onPress={() => handleTrackOrder('ORD-002', 'Processing', 'Smart Fitness Watch')}
                      >
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
                      <TouchableOpacity 
                        style={styles.orderActionButton}
                        onPress={() => handleTrackOrder('ORD-003', 'Shipped', 'Gaming Mouse Pro')}
                      >
                        <Text style={styles.orderActionText}>Track</Text>
                      </TouchableOpacity>
                      <TouchableOpacity 
                        style={styles.orderActionButton}
                        onPress={() => handleOrderDetails('ORD-003', 'Shipped', [{name: 'Gaming Mouse Pro', price: '75.00'}, {name: 'Bluetooth Speaker', price: '85.00'}], '160.00', 'Feb 10, 2024')}
                      >
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
                      <TouchableOpacity 
                        style={styles.orderActionButton}
                        onPress={() => handleReorder('ORD-004', [{name: 'Wireless Charging Pad', price: '45.00'}], '45.00')}
                      >
                        <Text style={styles.orderActionText}>Reorder</Text>
                      </TouchableOpacity>
                      <TouchableOpacity 
                        style={styles.orderActionButton}
                        onPress={() => handleReview('ORD-004', [{name: 'Wireless Charging Pad', price: '45.00'}], 'Delivered')}
                      >
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
                      <TouchableOpacity 
                        style={styles.orderActionButton}
                        onPress={() => handleReorder('ORD-005', [{name: 'Smart LED Bulb', price: '25.00'}], '25.00')}
                      >
                        <Text style={styles.orderActionText}>Reorder</Text>
                      </TouchableOpacity>
                      <TouchableOpacity 
                        style={styles.orderActionButton}
                        onPress={() => handleOrderDetails('ORD-005', 'Cancelled', [{name: 'Smart LED Bulb', price: '25.00'}], '25.00', 'Jan 28, 2024')}
                      >
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
                    handleExportOrderHistory();
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

            <ScrollView 
              style={styles.modalContent}
              contentContainerStyle={styles.notificationModalContentContainer}
              showsVerticalScrollIndicator={false}
            >
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

            <ScrollView 
              style={styles.modalContent}
              contentContainerStyle={styles.helpModalContentContainer}
              showsVerticalScrollIndicator={false}
            >
              <Text style={styles.helpDescription}>
                Get assistance with TLB Diamond
              </Text>
              
              {/* Quick Help Section */}
              <View style={styles.helpSection}>
                <Text style={styles.helpSectionTitle}>⚡ Quick Help</Text>
                
                <TouchableOpacity style={styles.helpItem} onPress={handleAccountIssues}>
                  <View style={styles.helpItemIcon}>
                    <Ionicons name="person-circle" size={24} color="#D4AF37" />
                  </View>
                  <View style={styles.helpItemContent}>
                    <Text style={styles.helpItemTitle}>Account Issues</Text>
                    <Text style={styles.helpItemDescription}>Login, profile, verification problems</Text>
                  </View>
                  <Ionicons name="chevron-forward" size={16} color="#8B4513" />
                </TouchableOpacity>
                
                <TouchableOpacity style={styles.helpItem} onPress={handlePaymentProblems}>
                  <View style={styles.helpItemIcon}>
                    <Ionicons name="card" size={24} color="#D4AF37" />
                  </View>
                  <View style={styles.helpItemContent}>
                    <Text style={styles.helpItemTitle}>Payment Problems</Text>
                    <Text style={styles.helpItemDescription}>Transaction errors, wallet issues</Text>
                  </View>
                  <Ionicons name="chevron-forward" size={16} color="#8B4513" />
                </TouchableOpacity>
                
                <TouchableOpacity style={styles.helpItem} onPress={handleTechnicalSupport}>
                  <View style={styles.helpItemIcon}>
                    <Ionicons name="bug" size={24} color="#D4AF37" />
                  </View>
                  <View style={styles.helpItemContent}>
                    <Text style={styles.helpItemTitle}>Technical Support</Text>
                    <Text style={styles.helpItemDescription}>App crashes, bugs, performance</Text>
                  </View>
                  <Ionicons name="chevron-forward" size={16} color="#8B4513" />
                </TouchableOpacity>
                
                <TouchableOpacity style={styles.helpItem} onPress={handleSecurityConcerns}>
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
                
                <TouchableOpacity style={styles.helpItem} onPress={handleUserGuide}>
                  <View style={styles.helpItemIcon}>
                    <Ionicons name="book" size={24} color="#D4AF37" />
                  </View>
                  <View style={styles.helpItemContent}>
                    <Text style={styles.helpItemTitle}>User Guide</Text>
                    <Text style={styles.helpItemDescription}>Complete app usage instructions</Text>
                  </View>
                  <Ionicons name="chevron-forward" size={16} color="#8B4513" />
                </TouchableOpacity>
                
                <TouchableOpacity style={styles.helpItem} onPress={handleVideoTutorials}>
                  <View style={styles.helpItemIcon}>
                    <Ionicons name="play-circle" size={24} color="#D4AF37" />
                  </View>
                  <View style={styles.helpItemContent}>
                    <Text style={styles.helpItemTitle}>Video Tutorials</Text>
                    <Text style={styles.helpItemDescription}>Step-by-step visual guides</Text>
                  </View>
                  <Ionicons name="chevron-forward" size={16} color="#8B4513" />
                </TouchableOpacity>
                
                <TouchableOpacity style={styles.helpItem} onPress={handleFAQ}>
                  <View style={styles.helpItemIcon}>
                    <Ionicons name="help-circle" size={24} color="#D4AF37" />
                  </View>
                  <View style={styles.helpItemContent}>
                    <Text style={styles.helpItemTitle}>FAQ</Text>
                    <Text style={styles.helpItemDescription}>Frequently asked questions</Text>
                  </View>
                  <Ionicons name="chevron-forward" size={16} color="#8B4513" />
                </TouchableOpacity>
                
                <TouchableOpacity style={styles.helpItem} onPress={handleCommunityForum}>
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
                
                <TouchableOpacity style={[styles.helpItem, styles.priorityItem]} onPress={handleLiveChat}>
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
                
                <TouchableOpacity style={styles.helpItem} onPress={handleEmailSupport}>
                  <View style={styles.helpItemIcon}>
                    <Ionicons name="mail" size={24} color="#D4AF37" />
                  </View>
                  <View style={styles.helpItemContent}>
                    <Text style={styles.helpItemTitle}>Email Support</Text>
                    <Text style={styles.helpItemDescription}>support@tlbdiamond.com</Text>
                  </View>
                  <Ionicons name="chevron-forward" size={16} color="#8B4513" />
                </TouchableOpacity>
                
                <TouchableOpacity style={styles.helpItem} onPress={handlePhoneSupport}>
                  <View style={styles.helpItemIcon}>
                    <Ionicons name="call" size={24} color="#D4AF37" />
                  </View>
                  <View style={styles.helpItemContent}>
                    <Text style={styles.helpItemTitle}>Phone Support</Text>
                    <Text style={styles.helpItemDescription}>+1 (555) DIAMOND (342-6663)</Text>
                  </View>
                  <Ionicons name="chevron-forward" size={16} color="#8B4513" />
                </TouchableOpacity>
                
                <TouchableOpacity style={styles.helpItem} onPress={handleSubmitTicket}>
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
                  handleLiveChat();
                }}
              >
                <Ionicons name="chatbubbles" size={16} color="#FFFFFF" />
                <Text style={styles.liveChatText}>Live Chat</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.ticketButton}
                onPress={() => {
                  setShowHelpModal(false);
                  handleSubmitTicket();
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

            <ScrollView 
              style={styles.modalContent}
              contentContainerStyle={styles.settingsModalContentContainer}
              showsVerticalScrollIndicator={false}
            >
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
                  setShowFullSettingsModal(true);
                }}
              >
                <Text style={styles.settingsActionText}>Full Settings</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.settingsActionButton, styles.resetButton]}
                onPress={() => {
                  setShowSettingsModal(false);
                  setShowResetConfirmModal(true);
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

      {/* Track Order Modal */}
      <Modal
        visible={showTrackModal}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowTrackModal(false)}
      >
        <View style={styles.trackModalContainer}>
          <View style={styles.trackModalHeader}>
            <Text style={styles.trackModalTitle}>📦 Order Tracking</Text>
            <TouchableOpacity 
              style={styles.trackModalCloseButton}
              onPress={() => setShowTrackModal(false)}
            >
              <Ionicons name="close" size={24} color="#8B4513" />
            </TouchableOpacity>
          </View>

          {trackingData && (
            <ScrollView style={styles.trackModalContent} contentContainerStyle={styles.trackModalContentContainer}>
              {/* Order Header */}
              <View style={styles.trackOrderHeader}>
                <View style={styles.trackOrderInfo}>
                  <Text style={styles.trackOrderId}>Order {trackingData.orderId}</Text>
                  <Text style={styles.trackProductName}>{trackingData.productName}</Text>
                </View>
                <View style={[styles.trackStatusBadge, { backgroundColor: trackingData.statusColor }]}>
                  <Ionicons name={trackingData.statusIcon} size={16} color="#FFFFFF" />
                  <Text style={styles.trackStatusText}>{trackingData.status}</Text>
                </View>
              </View>

              {/* Tracking Information */}
              {trackingData.trackingNumber && (
                <View style={styles.trackInfoCard}>
                  <Text style={styles.trackInfoTitle}>Tracking Information</Text>
                  <View style={styles.trackInfoRow}>
                    <Text style={styles.trackInfoLabel}>Tracking Number:</Text>
                    <Text style={styles.trackInfoValue}>{trackingData.trackingNumber}</Text>
                  </View>
                  <View style={styles.trackInfoRow}>
                    <Text style={styles.trackInfoLabel}>Carrier:</Text>
                    <Text style={styles.trackInfoValue}>{trackingData.carrier}</Text>
                  </View>
                  <View style={styles.trackInfoRow}>
                    <Text style={styles.trackInfoLabel}>Estimated Delivery:</Text>
                    <Text style={styles.trackInfoValue}>{trackingData.estimatedDelivery}</Text>
                  </View>
                </View>
              )}

              {/* Progress Steps */}
              <View style={styles.trackProgressCard}>
                <Text style={styles.trackProgressTitle}>Order Progress</Text>
                {trackingData.steps.map((step, index) => (
                  <View key={index} style={styles.trackProgressStep}>
                    <View style={styles.trackProgressIndicator}>
                      <View style={[
                        styles.trackProgressDot,
                        {
                          backgroundColor: step.completed ? '#10B981' : step.current ? trackingData.statusColor : '#E5E5E5',
                          borderColor: step.completed ? '#10B981' : step.current ? trackingData.statusColor : '#C7C7C7'
                        }
                      ]}>
                        {step.completed && <Ionicons name="checkmark" size={12} color="#FFFFFF" />}
                        {step.current && !step.completed && <View style={styles.trackProgressCurrentIndicator} />}
                      </View>
                      {index < trackingData.steps.length - 1 && (
                        <View style={[
                          styles.trackProgressLine,
                          { backgroundColor: step.completed ? '#10B981' : '#E5E5E5' }
                        ]} />
                      )}
                    </View>
                    <View style={styles.trackProgressDetails}>
                      <Text style={[
                        styles.trackProgressStepTitle,
                        { 
                          color: step.completed ? '#10B981' : step.current ? trackingData.statusColor : '#8B4513',
                          fontWeight: step.current ? 'bold' : '500'
                        }
                      ]}>
                        {step.step}
                      </Text>
                      <Text style={styles.trackProgressStepDate}>{step.date}</Text>
                    </View>
                  </View>
                ))}
              </View>

              {/* Delivery Details for completed orders */}
              {trackingData.deliveryDetails && (
                <View style={styles.trackDeliveryCard}>
                  <Text style={styles.trackDeliveryTitle}>Delivery Details</Text>
                  <View style={styles.trackDeliveryRow}>
                    <Text style={styles.trackDeliveryLabel}>Delivered to:</Text>
                    <Text style={styles.trackDeliveryValue}>{trackingData.deliveryDetails.deliveredTo}</Text>
                  </View>
                  <View style={styles.trackDeliveryRow}>
                    <Text style={styles.trackDeliveryLabel}>Location:</Text>
                    <Text style={styles.trackDeliveryValue}>{trackingData.deliveryDetails.location}</Text>
                  </View>
                  <View style={styles.trackDeliveryRow}>
                    <Text style={styles.trackDeliveryLabel}>Signature:</Text>
                    <Text style={styles.trackDeliveryValue}>{trackingData.deliveryDetails.signature}</Text>
                  </View>
                </View>
              )}

              {/* Action Buttons */}
              <View style={styles.trackActionButtons}>
                <TouchableOpacity 
                  style={styles.trackActionButton}
                  onPress={() => {
                    setShowTrackModal(false);
                    Alert.alert('📞 Support', 'Redirecting to support chat...');
                  }}
                >
                  <Ionicons name="headset" size={18} color="#FFFFFF" />
                  <Text style={styles.trackActionButtonText}>Contact Support</Text>
                </TouchableOpacity>
                
                {trackingData.status === 'Delivered' && (
                  <TouchableOpacity 
                    style={[styles.trackActionButton, styles.trackRatingButton]}
                    onPress={() => {
                      setShowTrackModal(false);
                      Alert.alert('⭐ Rate Delivery', 'Thank you for your feedback!');
                    }}
                  >
                    <Ionicons name="star" size={18} color="#FFFFFF" />
                    <Text style={styles.trackActionButtonText}>Rate Delivery</Text>
                  </TouchableOpacity>
                )}
              </View>
            </ScrollView>
          )}
        </View>
      </Modal>

      {/* Order Details Modal */}
      <Modal
        visible={showDetailsModal}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowDetailsModal(false)}
      >
        <View style={styles.detailsModalContainer}>
          <View style={styles.detailsModalHeader}>
            <Text style={styles.detailsModalTitle}>📋 Order Details</Text>
            <TouchableOpacity 
              style={styles.detailsModalCloseButton}
              onPress={() => setShowDetailsModal(false)}
            >
              <Ionicons name="close" size={24} color="#8B4513" />
            </TouchableOpacity>
          </View>

          {orderDetailsData && (
            <ScrollView style={styles.detailsModalContent} contentContainerStyle={styles.detailsModalContentContainer}>
              {/* Order Header */}
              <View style={styles.detailsOrderHeader}>
                <View style={styles.detailsOrderInfo}>
                  <Text style={styles.detailsOrderId}>Order {orderDetailsData.orderId}</Text>
                  <Text style={styles.detailsOrderDate}>{orderDetailsData.orderDate}</Text>
                </View>
                <View style={[styles.detailsStatusBadge, { backgroundColor: orderDetailsData.statusColor }]}>
                  <Ionicons name={orderDetailsData.statusIcon} size={16} color="#FFFFFF" />
                  <Text style={styles.detailsStatusText}>{orderDetailsData.orderStatus}</Text>
                </View>
              </View>

              {/* Status Description */}
              <View style={styles.detailsStatusCard}>
                <Text style={styles.detailsStatusTitle}>Order Status</Text>
                <Text style={styles.detailsStatusDescription}>{orderDetailsData.statusDescription}</Text>
              </View>

              {/* Items Ordered */}
              <View style={styles.detailsItemsCard}>
                <Text style={styles.detailsItemsTitle}>Items Ordered</Text>
                {orderDetailsData.items.map((item, index) => (
                  <View key={index} style={styles.detailsItemRow}>
                    <View style={styles.detailsItemInfo}>
                      <Text style={styles.detailsItemName}>{item.name}</Text>
                      <Text style={styles.detailsItemQuantity}>Quantity: 1</Text>
                    </View>
                    <Text style={styles.detailsItemPrice}>💎 {item.price} TLB</Text>
                  </View>
                ))}
                <View style={styles.detailsTotalRow}>
                  <Text style={styles.detailsTotalLabel}>Total Amount:</Text>
                  <Text style={styles.detailsTotalAmount}>💎 {orderDetailsData.total} TLB</Text>
                </View>
              </View>

              {/* Payment Information */}
              <View style={styles.detailsPaymentCard}>
                <Text style={styles.detailsPaymentTitle}>Payment Information</Text>
                <View style={styles.detailsPaymentRow}>
                  <Text style={styles.detailsPaymentLabel}>Payment Method:</Text>
                  <Text style={styles.detailsPaymentValue}>{orderDetailsData.paymentMethod}</Text>
                </View>
                <View style={styles.detailsPaymentRow}>
                  <Text style={styles.detailsPaymentLabel}>Payment Status:</Text>
                  <Text style={[styles.detailsPaymentValue, { color: orderDetailsData.orderStatus === 'Cancelled' ? '#EF4444' : '#10B981' }]}>
                    {orderDetailsData.orderStatus === 'Cancelled' ? 'Refunded' : 'Paid'}
                  </Text>
                </View>
              </View>

              {/* Shipping Information */}
              <View style={styles.detailsShippingCard}>
                <Text style={styles.detailsShippingTitle}>Shipping Information</Text>
                <View style={styles.detailsShippingRow}>
                  <Text style={styles.detailsShippingLabel}>Shipping Method:</Text>
                  <Text style={styles.detailsShippingValue}>{orderDetailsData.shippingMethod}</Text>
                </View>
                <View style={styles.detailsShippingRow}>
                  <Text style={styles.detailsShippingLabel}>Delivery Address:</Text>
                  <Text style={styles.detailsShippingValue}>{orderDetailsData.deliveryAddress}</Text>
                </View>
              </View>

              {/* Customer Service */}
              <View style={styles.detailsServiceCard}>
                <Text style={styles.detailsServiceTitle}>Need Help?</Text>
                <Text style={styles.detailsServiceDescription}>
                  Questions about your order? Our customer service team is here to help.
                </Text>
                <Text style={styles.detailsServiceContact}>{orderDetailsData.customerService}</Text>
              </View>

              {/* Action Buttons */}
              <View style={styles.detailsActionButtons}>
                {orderDetailsData.orderStatus !== 'Cancelled' && (
                  <TouchableOpacity 
                    style={styles.detailsActionButton}
                    onPress={() => {
                      setShowDetailsModal(false);
                      setTimeout(() => {
                        handleTrackOrder(orderDetailsData.orderId, orderDetailsData.orderStatus, orderDetailsData.items[0]?.name || 'Product');
                      }, 300);
                    }}
                  >
                    <Ionicons name="location" size={18} color="#FFFFFF" />
                    <Text style={styles.detailsActionButtonText}>Track Order</Text>
                  </TouchableOpacity>
                )}
                
                <TouchableOpacity 
                  style={[styles.detailsActionButton, styles.detailsSupportButton]}
                  onPress={() => {
                    setShowDetailsModal(false);
                    Alert.alert('📞 Support', 'Redirecting to support chat...');
                  }}
                >
                  <Ionicons name="headset" size={18} color="#FFFFFF" />
                  <Text style={styles.detailsActionButtonText}>Contact Support</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          )}
        </View>
      </Modal>

      {/* Reorder Modal */}
      <Modal
        visible={showReorderModal}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowReorderModal(false)}
      >
        <View style={styles.reorderModalContainer}>
          <View style={styles.reorderModalHeader}>
            <Text style={styles.reorderModalTitle}>🛍️ Reorder Items</Text>
            <TouchableOpacity 
              style={styles.reorderModalCloseButton}
              onPress={() => setShowReorderModal(false)}
            >
              <Ionicons name="close" size={24} color="#8B4513" />
            </TouchableOpacity>
          </View>

          {reorderData && (
            <ScrollView style={styles.reorderModalContent} contentContainerStyle={styles.reorderModalContentContainer}>
              {/* Order Header */}
              <View style={styles.reorderOrderHeader}>
                <View style={styles.reorderOrderInfo}>
                  <Text style={styles.reorderOrderNumber}>Order {reorderData.orderId}</Text>
                  <Text style={styles.reorderOrderLabel}>Original order total: 💎 {reorderData.subtotal.toFixed(2)} TLB</Text>
                </View>
              </View>

              {/* Items List */}
              <View style={styles.reorderItemsSection}>
                <Text style={styles.reorderSectionTitle}>📦 Items to Reorder</Text>
                {reorderData.itemsList.map((item, index) => (
                  <View key={index} style={styles.reorderItemCard}>
                    <View style={styles.reorderItemIcon}>
                      <Ionicons name="cube" size={20} color="#D4AF37" />
                    </View>
                    <View style={styles.reorderItemDetails}>
                      <Text style={styles.reorderItemName}>{item.name}</Text>
                      <Text style={styles.reorderItemPrice}>💎 {item.price} TLB</Text>
                    </View>
                    <View style={styles.reorderItemCheck}>
                      <Ionicons name="checkmark-circle" size={24} color="#10B981" />
                    </View>
                  </View>
                ))}
              </View>

              {/* Pricing Breakdown */}
              <View style={styles.reorderPricingSection}>
                <Text style={styles.reorderSectionTitle}>💰 New Order Summary</Text>
                <View style={styles.reorderPricingCard}>
                  <View style={styles.reorderPricingRow}>
                    <Text style={styles.reorderPricingLabel}>Subtotal</Text>
                    <Text style={styles.reorderPricingValue}>💎 {reorderData.subtotal.toFixed(2)} TLB</Text>
                  </View>
                  <View style={styles.reorderPricingRow}>
                    <Text style={styles.reorderPricingLabel}>Tax (8%)</Text>
                    <Text style={styles.reorderPricingValue}>💎 {reorderData.tax.toFixed(2)} TLB</Text>
                  </View>
                  <View style={styles.reorderPricingRow}>
                    <Text style={styles.reorderPricingLabel}>Shipping</Text>
                    <Text style={styles.reorderPricingValue}>💎 {reorderData.shipping.toFixed(2)} TLB</Text>
                  </View>
                  <View style={[styles.reorderPricingRow, styles.reorderPricingTotal]}>
                    <Text style={styles.reorderPricingTotalLabel}>Total</Text>
                    <Text style={styles.reorderPricingTotalValue}>💎 {reorderData.finalTotal.toFixed(2)} TLB</Text>
                  </View>
                </View>
              </View>

              {/* Information Section */}
              <View style={styles.reorderInfoSection}>
                <View style={styles.reorderInfoCard}>
                  <Ionicons name="information-circle" size={20} color="#D4AF37" />
                  <Text style={styles.reorderInfoText}>
                    Items will be added to your cart with current pricing. You can review and modify before checkout.
                  </Text>
                </View>
              </View>

              {/* Action Buttons */}
              <View style={styles.reorderActionButtons}>
                <TouchableOpacity 
                  style={styles.reorderCancelButton}
                  onPress={() => setShowReorderModal(false)}
                >
                  <Ionicons name="close-circle" size={18} color="#8B4513" />
                  <Text style={styles.reorderCancelButtonText}>Cancel</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={styles.reorderAddButton}
                  onPress={handleAddToCart}
                >
                  <Ionicons name="cart" size={18} color="#FFFFFF" />
                  <Text style={styles.reorderAddButtonText}>Add to Cart</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          )}
        </View>
      </Modal>

      {/* Review Modal */}
      <Modal
        visible={showReviewModal}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowReviewModal(false)}
      >
        <View style={styles.reviewModalContainer}>
          <View style={styles.reviewModalHeader}>
            <Text style={styles.reviewModalTitle}>⭐ Write a Review</Text>
            <TouchableOpacity 
              style={styles.reviewModalCloseButton}
              onPress={() => setShowReviewModal(false)}
            >
              <Ionicons name="close" size={24} color="#8B4513" />
            </TouchableOpacity>
          </View>

          {reviewData && (
            <ScrollView style={styles.reviewModalContent} contentContainerStyle={styles.reviewModalContentContainer}>
              {/* Order Info */}
              <View style={styles.reviewOrderHeader}>
                <Text style={styles.reviewOrderNumber}>Order {reviewData.orderId}</Text>
                <Text style={styles.reviewOrderItems}>Items: {reviewData.itemsList}</Text>
              </View>

              {/* Star Rating */}
              <View style={styles.reviewRatingSection}>
                <Text style={styles.reviewSectionTitle}>How was your experience?</Text>
                <View style={styles.reviewStarsContainer}>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <TouchableOpacity
                      key={star}
                      style={styles.reviewStarButton}
                      onPress={() => setSelectedRating(star)}
                    >
                      <Ionicons 
                        name={star <= selectedRating ? "star" : "star-outline"} 
                        size={40} 
                        color={star <= selectedRating ? "#D4AF37" : "#B8860B"} 
                      />
                    </TouchableOpacity>
                  ))}
                </View>
                <Text style={styles.reviewRatingText}>
                  {selectedRating === 0 && "Tap to rate your experience"}
                  {selectedRating === 1 && "Poor - We'll do better next time"}
                  {selectedRating === 2 && "Below Average - Room for improvement"}
                  {selectedRating === 3 && "Average - Met expectations"}
                  {selectedRating === 4 && "Good - Above expectations"}
                  {selectedRating === 5 && "Excellent - Outstanding experience!"}
                </Text>
              </View>

              {/* Review Text */}
              <View style={styles.reviewTextSection}>
                <Text style={styles.reviewSectionTitle}>Share your thoughts (optional)</Text>
                <TextInput
                  style={styles.reviewTextInput}
                  placeholder="Tell us about your experience with this order..."
                  placeholderTextColor="#8B4513"
                  multiline
                  numberOfLines={4}
                  textAlignVertical="top"
                />
              </View>

              {/* Bonus Information */}
              <View style={styles.reviewBonusSection}>
                <View style={styles.reviewBonusCard}>
                  <Ionicons name="gift" size={20} color="#10B981" />
                  <Text style={styles.reviewBonusText}>
                    🎁 Earn 5 TLB Diamond bonus points for your review!
                  </Text>
                </View>
              </View>

              {/* Action Buttons */}
              <View style={styles.reviewActionButtons}>
                <TouchableOpacity 
                  style={styles.reviewCancelButton}
                  onPress={() => setShowReviewModal(false)}
                >
                  <Text style={styles.reviewCancelButtonText}>Cancel</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={[
                    styles.reviewSubmitButton,
                    selectedRating === 0 && styles.reviewSubmitButtonDisabled
                  ]}
                  onPress={() => selectedRating > 0 && submitReview(selectedRating)}
                  disabled={selectedRating === 0}
                >
                  <Ionicons name="send" size={18} color="#FFFFFF" />
                  <Text style={styles.reviewSubmitButtonText}>Submit Review</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          )}
        </View>
      </Modal>

      {/* Added to Cart Modal */}
      <Modal
        visible={showAddedToCartModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowAddedToCartModal(false)}
      >
        <View style={styles.addedToCartModalOverlay}>
          <View style={styles.addedToCartModalContainer}>
            {/* Success Icon */}
            <View style={styles.addedToCartSuccessIcon}>
              <Ionicons name="checkmark-circle" size={60} color="#10B981" />
            </View>

            {/* Title */}
            <Text style={styles.addedToCartTitle}>✅ Added to Cart!</Text>

            {addedToCartData && (
              <>
                {/* Order Information */}
                <View style={styles.addedToCartOrderInfo}>
                  <Text style={styles.addedToCartOrderText}>
                    Items from Order {addedToCartData.orderId} have been successfully added to your cart.
                  </Text>
                </View>

                {/* Items Summary */}
                <View style={styles.addedToCartSummary}>
                  <View style={styles.addedToCartSummaryRow}>
                    <Text style={styles.addedToCartSummaryLabel}>Items Added:</Text>
                    <Text style={styles.addedToCartSummaryValue}>{addedToCartData.itemCount}</Text>
                  </View>
                  <View style={styles.addedToCartSummaryRow}>
                    <Text style={styles.addedToCartSummaryLabel}>Subtotal:</Text>
                    <Text style={styles.addedToCartSummaryValue}>💎 {addedToCartData.subtotal} TLB</Text>
                  </View>
                  <View style={styles.addedToCartSummaryRow}>
                    <Text style={styles.addedToCartSummaryLabel}>Tax:</Text>
                    <Text style={styles.addedToCartSummaryValue}>💎 {addedToCartData.tax} TLB</Text>
                  </View>
                  <View style={styles.addedToCartSummaryRow}>
                    <Text style={styles.addedToCartSummaryLabel}>Shipping:</Text>
                    <Text style={styles.addedToCartSummaryValue}>💎 {addedToCartData.shipping} TLB</Text>
                  </View>
                  <View style={[styles.addedToCartSummaryRow, styles.addedToCartTotalRow]}>
                    <Text style={styles.addedToCartTotalLabel}>Total:</Text>
                    <Text style={styles.addedToCartTotalValue}>💎 {addedToCartData.totalAmount} TLB</Text>
                  </View>
                </View>

                {/* Items List */}
                <View style={styles.addedToCartItemsSection}>
                  <Text style={styles.addedToCartItemsTitle}>Items in your cart:</Text>
                  {addedToCartData.items.map((item, index) => (
                    <View key={index} style={styles.addedToCartItem}>
                      <Ionicons name="cube" size={16} color="#D4AF37" />
                      <Text style={styles.addedToCartItemName}>{item.name}</Text>
                      <Text style={styles.addedToCartItemPrice}>💎 {item.price} TLB</Text>
                    </View>
                  ))}
                </View>

                {/* Information */}
                <View style={styles.addedToCartInfo}>
                  <Ionicons name="information-circle" size={20} color="#D4AF37" />
                  <Text style={styles.addedToCartInfoText}>
                    You can review and modify your cart before checkout in the Marketplace.
                  </Text>
                </View>
              </>
            )}

            {/* Action Buttons */}
            <View style={styles.addedToCartActions}>
              <TouchableOpacity 
                style={styles.addedToCartContinueButton}
                onPress={() => {
                  setShowAddedToCartModal(false);
                  navigation.navigate('Marketplace');
                }}
              >
                <Ionicons name="storefront" size={18} color="#FFFFFF" />
                <Text style={styles.addedToCartContinueText}>Continue Shopping</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.addedToCartViewButton}
                onPress={() => {
                  setShowAddedToCartModal(false);
                  navigation.navigate('Marketplace');
                }}
              >
                <Ionicons name="cart" size={18} color="#FFFFFF" />
                <Text style={styles.addedToCartViewText}>View Cart</Text>
              </TouchableOpacity>
            </View>

            {/* Close Button */}
            <TouchableOpacity 
              style={styles.addedToCartCloseButton}
              onPress={() => setShowAddedToCartModal(false)}
            >
              <Text style={styles.addedToCartCloseText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Export Order History Modal */}
      <Modal
        visible={showExportModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowExportModal(false)}
      >
        <View style={styles.exportModalOverlay}>
          <View style={styles.exportModalContainer}>
            {/* Export Icon */}
            <View style={styles.exportModalIcon}>
              <Ionicons name="download-outline" size={50} color="#D4AF37" />
            </View>

            {/* Title */}
            <Text style={styles.exportModalTitle}>📊 Export Order History</Text>

            {exportData && (
              <>
                {/* Export Information */}
                <View style={styles.exportModalInfo}>
                  <Text style={styles.exportModalDescription}>
                    Export your complete order history with detailed transaction data and analytics.
                  </Text>
                </View>

                {/* Statistics */}
                <View style={styles.exportStatsContainer}>
                  <View style={styles.exportStatItem}>
                    <Ionicons name="cube" size={20} color="#D4AF37" />
                    <Text style={styles.exportStatLabel}>Total Orders</Text>
                    <Text style={styles.exportStatValue}>{exportData.totalOrders}</Text>
                  </View>
                  
                  <View style={styles.exportStatItem}>
                    <Ionicons name="diamond" size={20} color="#D4AF37" />
                    <Text style={styles.exportStatLabel}>Total Value</Text>
                    <Text style={styles.exportStatValue}>💎 {exportData.totalValue.toFixed(2)} TLB</Text>
                  </View>
                  
                  <View style={styles.exportStatItem}>
                    <Ionicons name="calendar" size={20} color="#D4AF37" />
                    <Text style={styles.exportStatLabel}>Export Date</Text>
                    <Text style={styles.exportStatValue}>{exportData.exportDate}</Text>
                  </View>
                </View>

                {/* Export Format Selection */}
                <View style={styles.exportFormatsContainer}>
                  <Text style={styles.exportFormatsTitle}>Select Export Format:</Text>
                  <View style={styles.exportFormatsList}>
                    {exportData.availableFormats.map((format, index) => (
                      <TouchableOpacity 
                        key={index}
                        style={styles.exportFormatButton}
                        onPress={() => {
                          setShowExportModal(false);
                          // Simulate export success
                          setTimeout(() => {
                            Alert.alert(
                              '✅ Export Complete!',
                              `Your order history has been exported to ${format} format.\n\nThe file has been saved to your Downloads folder.`,
                              [{ text: 'OK' }]
                            );
                          }, 500);
                        }}
                      >
                        <Ionicons 
                          name={
                            format === 'PDF' ? 'document-text' :
                            format === 'CSV' ? 'grid' :
                            format === 'JSON' ? 'code-slash' :
                            'document'
                          } 
                          size={24} 
                          color="#FFFFFF" 
                        />
                        <Text style={styles.exportFormatText}>{format}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>

                {/* Additional Options */}
                <View style={styles.exportOptionsContainer}>
                  <View style={styles.exportOption}>
                    <Ionicons name="filter" size={18} color="#8B4513" />
                    <Text style={styles.exportOptionText}>
                      Export includes: Order details, payment history, delivery tracking, and purchase analytics
                    </Text>
                  </View>
                  
                  <View style={styles.exportOption}>
                    <Ionicons name="lock-closed" size={18} color="#8B4513" />
                    <Text style={styles.exportOptionText}>
                      All personal data is encrypted and secure during export
                    </Text>
                  </View>
                </View>
              </>
            )}

            {/* Action Buttons */}
            <View style={styles.exportModalActions}>
              <TouchableOpacity 
                style={styles.exportCancelButton}
                onPress={() => setShowExportModal(false)}
              >
                <Text style={styles.exportCancelText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Full Settings Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={showFullSettingsModal}
        onRequestClose={() => setShowFullSettingsModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>⚙️ Full Settings</Text>
              <TouchableOpacity onPress={() => setShowFullSettingsModal(false)}>
                <Ionicons name="close" size={24} color="#8B4513" />
              </TouchableOpacity>
            </View>

            <ScrollView 
              style={styles.modalContent}
              contentContainerStyle={styles.fullSettingsContentContainer}
              showsVerticalScrollIndicator={false}
            >
              <Text style={styles.settingsDescription}>
                Complete application settings management
              </Text>
              
              {/* Advanced Security Settings */}
              <View style={styles.settingsCategory}>
                <View style={styles.categoryHeader}>
                  <Text style={styles.categoryIcon}>🔒</Text>
                  <Text style={styles.categoryTitle}>Advanced Security</Text>
                </View>
                <View style={styles.settingsList}>
                  <View style={styles.settingItem}>
                    <View style={styles.settingInfo}>
                      <Text style={styles.settingName}>PIN Code Length</Text>
                      <Text style={styles.settingDescription}>Current: {pinCodeLength} digits</Text>
                    </View>
                    <TouchableOpacity style={styles.settingButton} onPress={handleChangePinLength}>
                      <Text style={styles.settingButtonText}>Change</Text>
                    </TouchableOpacity>
                  </View>
                  <View style={styles.settingItem}>
                    <View style={styles.settingInfo}>
                      <Text style={styles.settingName}>Session Timeout</Text>
                      <Text style={styles.settingDescription}>Auto-logout after {sessionTimeout} minute{sessionTimeout !== 1 ? 's' : ''}</Text>
                    </View>
                    <TouchableOpacity style={styles.settingButton} onPress={handleConfigureSessionTimeout}>
                      <Text style={styles.settingButtonText}>Configure</Text>
                    </TouchableOpacity>
                  </View>
                  <View style={styles.settingItem}>
                    <View style={styles.settingInfo}>
                      <Text style={styles.settingName}>Device Binding</Text>
                      <Text style={styles.settingDescription}>Restrict to current device</Text>
                    </View>
                    <TouchableOpacity style={styles.settingToggle} onPress={handleToggleDeviceBinding}>
                      <Text style={styles.settingToggleText}>{deviceBindingEnabled ? '✅ Enabled' : '❌ Disabled'}</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>

              {/* Privacy & Data Settings */}
              <View style={styles.settingsCategory}>
                <View style={styles.categoryHeader}>
                  <Text style={styles.categoryIcon}>🛡️</Text>
                  <Text style={styles.categoryTitle}>Privacy & Data</Text>
                </View>
                <View style={styles.settingsList}>
                  <View style={styles.settingItem}>
                    <View style={styles.settingInfo}>
                      <Text style={styles.settingName}>Data Export</Text>
                      <Text style={styles.settingDescription}>Download your data</Text>
                    </View>
                    <TouchableOpacity style={styles.settingButton} onPress={handleDataExport}>
                      <Text style={styles.settingButtonText}>Export</Text>
                    </TouchableOpacity>
                  </View>
                  <View style={styles.settingItem}>
                    <View style={styles.settingInfo}>
                      <Text style={styles.settingName}>Analytics Opt-out</Text>
                      <Text style={styles.settingDescription}>Disable usage tracking</Text>
                    </View>
                    <TouchableOpacity style={styles.settingToggle} onPress={handleToggleAnalyticsOptOut}>
                      <Text style={styles.settingToggleText}>{analyticsOptOut ? '✅ Enabled' : '❌ Disabled'}</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>

              {/* Advanced Features */}
              <View style={styles.settingsCategory}>
                <View style={styles.categoryHeader}>
                  <Text style={styles.categoryIcon}>⚡</Text>
                  <Text style={styles.categoryTitle}>Advanced Features</Text>
                </View>
                <View style={styles.settingsList}>
                  <View style={styles.settingItem}>
                    <View style={styles.settingInfo}>
                      <Text style={styles.settingName}>Developer Mode</Text>
                      <Text style={styles.settingDescription}>Enable debug features</Text>
                    </View>
                    <TouchableOpacity style={styles.settingToggle} onPress={handleToggleDeveloperMode}>
                      <Text style={styles.settingToggleText}>{developerModeEnabled ? '✅ Enabled' : '❌ Disabled'}</Text>
                    </TouchableOpacity>
                  </View>
                  <View style={styles.settingItem}>
                    <View style={styles.settingInfo}>
                      <Text style={styles.settingName}>Beta Features</Text>
                      <Text style={styles.settingDescription}>Try experimental features</Text>
                    </View>
                    <TouchableOpacity style={styles.settingToggle} onPress={handleToggleBetaFeatures}>
                      <Text style={styles.settingToggleText}>{betaFeaturesEnabled ? '✅ Enabled' : '❌ Disabled'}</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>

              <View style={styles.fullSettingsNote}>
                <Text style={styles.fullSettingsNoteIcon}>ℹ️</Text>
                <Text style={styles.fullSettingsNoteText}>
                  Changes to these settings will take effect immediately. Some features may require app restart.
                </Text>
              </View>
            </ScrollView>

            <View style={styles.fullSettingsActions}>
              <TouchableOpacity 
                style={styles.fullSettingsSaveButton}
                onPress={() => {
                  setShowFullSettingsModal(false);
                  showSuccess('Settings Saved', 'Your preferences have been updated successfully.');
                }}
              >
                <Text style={styles.fullSettingsSaveText}>Save Changes</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.fullSettingsCancelButton}
                onPress={() => setShowFullSettingsModal(false)}
              >
                <Text style={styles.fullSettingsCancelText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Reset Confirmation Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={showResetConfirmModal}
        onRequestClose={() => setShowResetConfirmModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.resetConfirmContainer}>
            <View style={styles.resetConfirmHeader}>
              <Text style={styles.resetConfirmIcon}>⚠️</Text>
              <Text style={styles.resetConfirmTitle}>Reset App Settings</Text>
            </View>

            <View style={styles.resetConfirmContent}>
              <Text style={styles.resetConfirmMessage}>
                Are you sure you want to reset all app settings to their default values?
              </Text>
              
              <View style={styles.resetConfirmWarning}>
                <Text style={styles.resetConfirmWarningIcon}>🚨</Text>
                <Text style={styles.resetConfirmWarningText}>
                  This action cannot be undone. The following will be reset:
                </Text>
              </View>

              <View style={styles.resetConfirmList}>
                <Text style={styles.resetConfirmListItem}>• All notification preferences</Text>
                <Text style={styles.resetConfirmListItem}>• Security settings (except passwords)</Text>
                <Text style={styles.resetConfirmListItem}>• Display and theme preferences</Text>
                <Text style={styles.resetConfirmListItem}>• Privacy settings</Text>
                <Text style={styles.resetConfirmListItem}>• App customizations</Text>
              </View>

              <View style={styles.resetConfirmNote}>
                <Text style={styles.resetConfirmNoteIcon}>💡</Text>
                <Text style={styles.resetConfirmNoteText}>
                  Your profile data, wallet balance, and transaction history will remain unchanged.
                </Text>
              </View>
            </View>

            <View style={styles.resetConfirmActions}>
              <TouchableOpacity 
                style={styles.resetConfirmResetButton}
                onPress={() => {
                  setShowResetConfirmModal(false);
                  showSuccess(
                    'Settings Reset Complete', 
                    'All settings have been restored to their default values. Please restart the app for changes to take full effect.',
                    [
                      {
                        text: 'OK',
                        onPress: () => console.log('Settings reset confirmed')
                      }
                    ]
                  );
                }}
              >
                <Text style={styles.resetConfirmResetText}>Reset Settings</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.resetConfirmCancelButton}
                onPress={() => setShowResetConfirmModal(false)}
              >
                <Text style={styles.resetConfirmCancelText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
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
  modalContent: {
    paddingHorizontal: 24,
    paddingVertical: 20,
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
  paymentModalContentContainer: {
    paddingBottom: 30,
    flexGrow: 1,
  },
  notificationModalContentContainer: {
    paddingBottom: 30,
    flexGrow: 1,
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
    padding: 15,
    marginTop: 15,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#D4AF37',
  },
  summaryTipIcon: {
    fontSize: 16,
    marginRight: 10,
    marginTop: 2,
  },
  summaryTip: {
    flex: 1,
    fontSize: 13,
    color: '#8B4513',
    fontStyle: 'italic',
    lineHeight: 18,
    flexWrap: 'wrap',
  },
  settingsModalContentContainer: {
    paddingBottom: 30,
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
    padding: 15,
    marginTop: 15,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#D4AF37',
  },
  helpTipText: {
    flex: 1,
    fontSize: 13,
    color: '#8B4513',
    fontStyle: 'italic',
    lineHeight: 18,
    marginLeft: 10,
    flexWrap: 'wrap',
  },
  helpModalContentContainer: {
    paddingBottom: 30,
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
    padding: 15,
    marginTop: 15,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#F59E0B',
  },
  notificationTipText: {
    flex: 1,
    fontSize: 13,
    color: '#8B4513',
    fontStyle: 'italic',
    lineHeight: 18,
    marginLeft: 10,
    flexWrap: 'wrap',
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
    borderRadius: 16,
    padding: 18,
    marginBottom: 14,
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
    shadowColor: 'rgba(0, 0, 0, 0.08)',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  defaultPaymentMethod: {
    borderColor: '#10B981',
    borderWidth: 2,
    backgroundColor: '#F0FDF4',
    shadowColor: 'rgba(16, 185, 129, 0.2)',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 6,
  },
  paymentMethodIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#F5E6A3',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
    shadowColor: 'rgba(212, 175, 55, 0.2)',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 3,
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
    alignItems: 'flex-start',
    backgroundColor: '#F0FDF4',
    borderRadius: 8,
    padding: 15,
    marginTop: 15,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#10B981',
  },
  paymentSecurityText: {
    flex: 1,
    fontSize: 13,
    color: '#065F46',
    fontWeight: '500',
    lineHeight: 18,
    marginLeft: 10,
    flexWrap: 'wrap',
  },
  paymentActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingVertical: 20,
    borderTopWidth: 1,
    borderTopColor: 'rgba(229, 231, 235, 0.6)',
    gap: 16,
    backgroundColor: '#FAFAFA',
  },
  addMethodButton: {
    flex: 1,
    backgroundColor: '#D4AF37',
    borderRadius: 14,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: 'rgba(212, 175, 55, 0.4)',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 8,
    borderWidth: 1,
    borderColor: '#B8860B',
  },
  addMethodText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    marginLeft: 8,
    letterSpacing: 0.4,
  },
  manageMethodsButton: {
    flex: 1,
    backgroundColor: '#F9FAFB',
    borderRadius: 14,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: 'rgba(0, 0, 0, 0.05)',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
  },
  manageMethodsText: {
    color: '#6B7280',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
    letterSpacing: 0.3,
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

  // Track Modal Styles
  trackModalContainer: {
    flex: 1,
    backgroundColor: '#FFF8E7',
  },
  trackModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#D4AF37',
    backgroundColor: '#F5E6A3',
  },
  trackModalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2C1810',
  },
  trackModalCloseButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(139, 69, 19, 0.1)',
  },
  trackModalContent: {
    flex: 1,
  },
  trackModalContentContainer: {
    padding: 20,
    paddingBottom: 40,
  },
  trackOrderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#D4AF37',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  trackOrderInfo: {
    flex: 1,
  },
  trackOrderId: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2C1810',
    marginBottom: 4,
  },
  trackProductName: {
    fontSize: 14,
    color: '#8B4513',
  },
  trackStatusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginLeft: 12,
  },
  trackStatusText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
    marginLeft: 4,
  },
  trackInfoCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#D4AF37',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  trackInfoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2C1810',
    marginBottom: 12,
  },
  trackInfoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  trackInfoLabel: {
    fontSize: 14,
    color: '#8B4513',
    flex: 1,
  },
  trackInfoValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2C1810',
    flex: 1,
    textAlign: 'right',
  },
  trackProgressCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#D4AF37',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  trackProgressTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2C1810',
    marginBottom: 16,
  },
  trackProgressStep: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  trackProgressIndicator: {
    alignItems: 'center',
    marginRight: 12,
  },
  trackProgressDot: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  trackProgressCurrentIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FFFFFF',
  },
  trackProgressLine: {
    width: 2,
    height: 24,
    marginTop: 4,
  },
  trackProgressDetails: {
    flex: 1,
    paddingTop: 2,
  },
  trackProgressStepTitle: {
    fontSize: 14,
    marginBottom: 2,
  },
  trackProgressStepDate: {
    fontSize: 12,
    color: '#8B4513',
  },
  trackDeliveryCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#D4AF37',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  trackDeliveryTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2C1810',
    marginBottom: 12,
  },
  trackDeliveryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  trackDeliveryLabel: {
    fontSize: 14,
    color: '#8B4513',
    flex: 1,
  },
  trackDeliveryValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2C1810',
    flex: 1,
    textAlign: 'right',
  },
  trackActionButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  trackActionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#D4AF37',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  trackRatingButton: {
    backgroundColor: '#F59E0B',
  },
  trackActionButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 6,
  },

  // Details Modal Styles
  detailsModalContainer: {
    flex: 1,
    backgroundColor: '#FFF8E7',
  },
  detailsModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#D4AF37',
    backgroundColor: '#F5E6A3',
  },
  detailsModalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2C1810',
  },
  detailsModalCloseButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(139, 69, 19, 0.1)',
  },
  detailsModalContent: {
    flex: 1,
  },
  detailsModalContentContainer: {
    padding: 20,
    paddingBottom: 40,
  },
  detailsOrderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#D4AF37',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  detailsOrderInfo: {
    flex: 1,
  },
  detailsOrderId: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2C1810',
    marginBottom: 4,
  },
  detailsOrderDate: {
    fontSize: 14,
    color: '#8B4513',
  },
  detailsStatusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginLeft: 12,
  },
  detailsStatusText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
    marginLeft: 4,
  },
  detailsStatusCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#D4AF37',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  detailsStatusTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2C1810',
    marginBottom: 8,
  },
  detailsStatusDescription: {
    fontSize: 14,
    color: '#8B4513',
    lineHeight: 20,
  },
  detailsItemsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#D4AF37',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  detailsItemsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2C1810',
    marginBottom: 12,
  },
  detailsItemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F5E6A3',
  },
  detailsItemInfo: {
    flex: 1,
  },
  detailsItemName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2C1810',
    marginBottom: 4,
  },
  detailsItemQuantity: {
    fontSize: 12,
    color: '#8B4513',
  },
  detailsItemPrice: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#D4AF37',
  },
  detailsTotalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    marginTop: 8,
    borderTopWidth: 2,
    borderTopColor: '#D4AF37',
  },
  detailsTotalLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2C1810',
  },
  detailsTotalAmount: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#D4AF37',
  },
  detailsPaymentCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#D4AF37',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  detailsPaymentTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2C1810',
    marginBottom: 12,
  },
  detailsPaymentRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  detailsPaymentLabel: {
    fontSize: 14,
    color: '#8B4513',
    flex: 1,
  },
  detailsPaymentValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2C1810',
    flex: 1,
    textAlign: 'right',
  },
  detailsShippingCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#D4AF37',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  detailsShippingTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2C1810',
    marginBottom: 12,
  },
  detailsShippingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  detailsShippingLabel: {
    fontSize: 14,
    color: '#8B4513',
    flex: 1,
  },
  detailsShippingValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2C1810',
    flex: 2,
    textAlign: 'right',
  },
  detailsServiceCard: {
    backgroundColor: '#F5E6A3',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#D4AF37',
  },
  detailsServiceTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2C1810',
    marginBottom: 8,
  },
  detailsServiceDescription: {
    fontSize: 14,
    color: '#8B4513',
    lineHeight: 20,
    marginBottom: 8,
  },
  detailsServiceContact: {
    fontSize: 14,
    fontWeight: '600',
    color: '#D4AF37',
  },
  detailsActionButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  detailsActionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#D4AF37',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  detailsSupportButton: {
    backgroundColor: '#8B4513',
  },
  detailsActionButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 6,
  },

  // Reorder Modal Styles
  reorderModalContainer: {
    flex: 1,
    backgroundColor: '#FFF8E7',
  },
  reorderModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#D4AF37',
    backgroundColor: '#F5E6A3',
  },
  reorderModalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2C1810',
  },
  reorderModalCloseButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(139, 69, 19, 0.1)',
  },
  reorderModalContent: {
    flex: 1,
  },
  reorderModalContentContainer: {
    padding: 20,
    paddingBottom: 40,
  },
  reorderOrderHeader: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#D4AF37',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  reorderOrderInfo: {
    alignItems: 'center',
  },
  reorderOrderNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2C1810',
    marginBottom: 8,
  },
  reorderOrderLabel: {
    fontSize: 14,
    color: '#8B4513',
  },
  reorderSectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2C1810',
    marginBottom: 15,
  },
  reorderItemsSection: {
    marginBottom: 20,
  },
  reorderItemCard: {
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
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  reorderItemIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F5E6A3',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  reorderItemDetails: {
    flex: 1,
  },
  reorderItemName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2C1810',
    marginBottom: 4,
  },
  reorderItemPrice: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#D4AF37',
  },
  reorderItemCheck: {
    marginLeft: 12,
  },
  reorderPricingSection: {
    marginBottom: 20,
  },
  reorderPricingCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    borderWidth: 1,
    borderColor: '#D4AF37',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  reorderPricingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  reorderPricingLabel: {
    fontSize: 14,
    color: '#8B4513',
  },
  reorderPricingValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2C1810',
  },
  reorderPricingTotal: {
    borderTopWidth: 1,
    borderTopColor: '#D4AF37',
    marginTop: 8,
    paddingTop: 12,
  },
  reorderPricingTotalLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2C1810',
  },
  reorderPricingTotalValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#D4AF37',
  },
  reorderInfoSection: {
    marginBottom: 30,
  },
  reorderInfoCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#F0F9FF',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#D4AF37',
  },
  reorderInfoText: {
    flex: 1,
    fontSize: 14,
    color: '#8B4513',
    lineHeight: 20,
    marginLeft: 12,
  },
  reorderActionButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  reorderCancelButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#8B4513',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  reorderCancelButtonText: {
    color: '#8B4513',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  reorderAddButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#D4AF37',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 5,
  },
  reorderAddButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },

  // Review Modal Styles
  reviewModalContainer: {
    flex: 1,
    backgroundColor: '#FFF8E7',
  },
  reviewModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#D4AF37',
    backgroundColor: '#F5E6A3',
  },
  reviewModalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2C1810',
  },
  reviewModalCloseButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(139, 69, 19, 0.1)',
  },
  reviewModalContent: {
    flex: 1,
  },
  reviewModalContentContainer: {
    padding: 20,
    paddingBottom: 40,
  },
  reviewOrderHeader: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#D4AF37',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  reviewOrderNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2C1810',
    marginBottom: 8,
    textAlign: 'center',
  },
  reviewOrderItems: {
    fontSize: 14,
    color: '#8B4513',
    textAlign: 'center',
  },
  reviewSectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2C1810',
    marginBottom: 15,
  },
  reviewRatingSection: {
    marginBottom: 25,
  },
  reviewStarsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    marginBottom: 15,
  },
  reviewStarButton: {
    padding: 8,
  },
  reviewRatingText: {
    fontSize: 16,
    color: '#8B4513',
    textAlign: 'center',
    fontWeight: '500',
  },
  reviewTextSection: {
    marginBottom: 25,
  },
  reviewTextInput: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: '#2C1810',
    borderWidth: 1,
    borderColor: '#D4AF37',
    minHeight: 100,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  reviewBonusSection: {
    marginBottom: 30,
  },
  reviewBonusCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0FDF4',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#10B981',
  },
  reviewBonusText: {
    flex: 1,
    fontSize: 14,
    color: '#059669',
    fontWeight: '600',
    marginLeft: 12,
  },
  reviewActionButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  reviewCancelButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#8B4513',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  reviewCancelButtonText: {
    color: '#8B4513',
    fontSize: 16,
    fontWeight: '600',
  },
  reviewSubmitButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#D4AF37',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 5,
  },
  reviewSubmitButtonDisabled: {
    backgroundColor: '#B8860B',
    opacity: 0.6,
  },
  reviewSubmitButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },

  // Added to Cart Modal Styles
  addedToCartModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  addedToCartModalContainer: {
    backgroundColor: '#FFF8E7',
    borderRadius: 20,
    padding: 24,
    width: '100%',
    maxWidth: 400,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  addedToCartSuccessIcon: {
    marginBottom: 16,
  },
  addedToCartTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2C1810',
    marginBottom: 16,
    textAlign: 'center',
  },
  addedToCartOrderInfo: {
    backgroundColor: '#F0FDF4',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    width: '100%',
    borderWidth: 1,
    borderColor: '#10B981',
  },
  addedToCartOrderText: {
    fontSize: 14,
    color: '#059669',
    textAlign: 'center',
    lineHeight: 20,
  },
  addedToCartSummary: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    width: '100%',
    borderWidth: 1,
    borderColor: '#D4AF37',
  },
  addedToCartSummaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 6,
  },
  addedToCartSummaryLabel: {
    fontSize: 14,
    color: '#8B4513',
  },
  addedToCartSummaryValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2C1810',
  },
  addedToCartTotalRow: {
    borderTopWidth: 1,
    borderTopColor: '#D4AF37',
    marginTop: 8,
    paddingTop: 12,
  },
  addedToCartTotalLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2C1810',
  },
  addedToCartTotalValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#D4AF37',
  },
  addedToCartItemsSection: {
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    width: '100%',
    borderWidth: 1,
    borderColor: '#E5E5E5',
  },
  addedToCartItemsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2C1810',
    marginBottom: 12,
  },
  addedToCartItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    gap: 8,
  },
  addedToCartItemName: {
    flex: 1,
    fontSize: 14,
    color: '#2C1810',
  },
  addedToCartItemPrice: {
    fontSize: 14,
    fontWeight: '600',
    color: '#D4AF37',
  },
  addedToCartInfo: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#FEF3C7',
    borderRadius: 12,
    padding: 12,
    marginBottom: 20,
    width: '100%',
    borderWidth: 1,
    borderColor: '#D4AF37',
  },
  addedToCartInfoText: {
    flex: 1,
    fontSize: 12,
    color: '#8B4513',
    lineHeight: 16,
    marginLeft: 8,
  },
  addedToCartActions: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
    marginBottom: 16,
  },
  addedToCartContinueButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#D4AF37',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 5,
  },
  addedToCartContinueText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
    marginLeft: 6,
  },
  addedToCartViewButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#8B4513',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 5,
  },
  addedToCartViewText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
    marginLeft: 6,
  },
  addedToCartCloseButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    backgroundColor: 'transparent',
  },
  addedToCartCloseText: {
    color: '#8B4513',
    fontSize: 14,
    fontWeight: '600',
  },

  // Export Order History Modal Styles
  exportModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  exportModalContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 25,
    width: '100%',
    maxWidth: 400,
    maxHeight: '90%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 15,
    borderWidth: 2,
    borderColor: '#D4AF37',
  },
  exportModalIcon: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#FFF8E7',
    alignSelf: 'center',
    marginBottom: 20,
    borderWidth: 3,
    borderColor: '#D4AF37',
    shadowColor: '#D4AF37',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },
  exportModalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2C1810',
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 28,
  },
  exportModalInfo: {
    backgroundColor: '#FFF8E7',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    borderLeftWidth: 4,
    borderLeftColor: '#D4AF37',
  },
  exportModalDescription: {
    fontSize: 15,
    color: '#2C1810',
    lineHeight: 20,
    textAlign: 'center',
  },
  exportStatsContainer: {
    marginBottom: 25,
    backgroundColor: '#F5E6A3',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#D4AF37',
  },
  exportStatItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#E6D07A',
  },
  exportStatLabel: {
    flex: 1,
    fontSize: 14,
    color: '#8B4513',
    fontWeight: '500',
    marginLeft: 12,
  },
  exportStatValue: {
    fontSize: 14,
    color: '#2C1810',
    fontWeight: 'bold',
  },
  exportFormatsContainer: {
    marginBottom: 20,
  },
  exportFormatsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2C1810',
    marginBottom: 15,
    textAlign: 'center',
  },
  exportFormatsList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 10,
  },
  exportFormatButton: {
    backgroundColor: '#D4AF37',
    borderRadius: 12,
    padding: 15,
    alignItems: 'center',
    justifyContent: 'center',
    width: '48%',
    aspectRatio: 1.5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
    borderWidth: 1,
    borderColor: '#B8860B',
  },
  exportFormatText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: 'bold',
    marginTop: 8,
    textAlign: 'center',
  },
  exportOptionsContainer: {
    backgroundColor: '#FFF8E7',
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#F5E6A3',
  },
  exportOption: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  exportOptionText: {
    fontSize: 12,
    color: '#8B4513',
    lineHeight: 16,
    marginLeft: 10,
    flex: 1,
  },
  exportModalActions: {
    alignItems: 'center',
  },
  exportCancelButton: {
    backgroundColor: '#8B4513',
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 30,
    width: '100%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#5D4E37',
  },
  exportCancelText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },

  // Add Payment Method Modal Styles
  addPaymentModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.85)',
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  addPaymentModalContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    width: '100%',
    maxWidth: 480,
    maxHeight: '92%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.35,
    shadowRadius: 25,
    elevation: 25,
    borderWidth: 2,
    borderColor: '#D4AF37',
    overflow: 'hidden',
  },
  addPaymentModalHeader: {
    backgroundColor: '#F5E6A3',
    paddingVertical: 28,
    paddingHorizontal: 24,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(212, 175, 55, 0.3)',
    position: 'relative',
  },
  addPaymentIconContainer: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 2,
    borderColor: '#D4AF37',
    shadowColor: '#D4AF37',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 8,
  },
  addPaymentModalTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#2C1810',
    textAlign: 'center',
    marginBottom: 10,
    letterSpacing: 0.5,
  },
  addPaymentModalSubtitle: {
    fontSize: 15,
    color: '#8B4513',
    textAlign: 'center',
    lineHeight: 22,
    paddingHorizontal: 8,
    opacity: 0.9,
  },
  addPaymentCloseButton: {
    position: 'absolute',
    top: 18,
    right: 18,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: 'rgba(212, 175, 55, 0.6)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 4,
  },
  addPaymentModalContent: {
    flex: 1,
    paddingHorizontal: 24,
    paddingVertical: 20,
  },
  addPaymentForm: {
    flex: 1,
  },
  addPaymentFormSection: {
    marginBottom: 24,
  },
  addPaymentSectionTitle: {
    fontSize: 19,
    fontWeight: '700',
    color: '#2C1810',
    marginBottom: 20,
    paddingHorizontal: 2,
    letterSpacing: 0.3,
  },
  addPaymentInputContainer: {
    marginBottom: 18,
  },
  addPaymentInputContainerHalf: {
    flex: 1,
    marginBottom: 18,
  },
  addPaymentInputRow: {
    flexDirection: 'row',
    gap: 16,
  },
  addPaymentInputLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: '#2C1810',
    marginBottom: 10,
    paddingHorizontal: 4,
    letterSpacing: 0.2,
  },
  addPaymentInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
    paddingHorizontal: 16,
    shadowColor: 'rgba(0, 0, 0, 0.1)',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
    minHeight: 56,
  },
  addPaymentInputIcon: {
    marginRight: 14,
    opacity: 0.7,
  },
  addPaymentInput: {
    flex: 1,
    fontSize: 16,
    color: '#2C1810',
    paddingVertical: 16,
    fontWeight: '500',
    letterSpacing: 0.3,
  },
  addPaymentSecurityNotice: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0FDF4',
    borderRadius: 14,
    padding: 16,
    marginTop: 24,
    borderWidth: 1,
    borderColor: '#10B981',
    shadowColor: 'rgba(16, 185, 129, 0.1)',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 2,
  },
  addPaymentSecurityText: {
    marginLeft: 12,
    fontSize: 14,
    color: '#065F46',
    fontWeight: '500',
    flex: 1,
    lineHeight: 20,
  },
  addPaymentPaypalNotice: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EBF4FF',
    borderRadius: 14,
    padding: 16,
    marginTop: 24,
    borderWidth: 1,
    borderColor: '#0070BA',
    shadowColor: 'rgba(0, 112, 186, 0.1)',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 2,
  },
  addPaymentPaypalText: {
    marginLeft: 12,
    fontSize: 14,
    color: '#003087',
    fontWeight: '500',
    flex: 1,
    lineHeight: 20,
  },
  addPaymentModalActions: {
    flexDirection: 'row',
    gap: 16,
    paddingTop: 24,
    paddingBottom: 8,
    borderTopWidth: 1,
    borderTopColor: 'rgba(229, 231, 235, 0.6)',
    marginTop: 16,
  },
  addPaymentCancelButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F9FAFB',
    borderRadius: 14,
    paddingVertical: 18,
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
    shadowColor: 'rgba(0, 0, 0, 0.05)',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  addPaymentCancelText: {
    color: '#6B7280',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  addPaymentSaveButton: {
    flex: 2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#D4AF37',
    borderRadius: 14,
    paddingVertical: 18,
    borderWidth: 1,
    borderColor: '#B8860B',
    shadowColor: 'rgba(212, 175, 55, 0.4)',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 8,
  },
  addPaymentSaveText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
    letterSpacing: 0.4,
  },
  
  // Additional utility styles for better UX
  addPaymentInputWrapperFocused: {
    borderColor: '#D4AF37',
    borderWidth: 2,
    backgroundColor: '#FFF8E7',
    shadowColor: 'rgba(212, 175, 55, 0.3)',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  
  addPaymentInputError: {
    borderColor: '#EF4444',
    borderWidth: 2,
    backgroundColor: '#FEF2F2',
  },

  // Full Settings Modal Styles
  fullSettingsContentContainer: {
    paddingBottom: 20,
  },
  settingsCategory: {
    marginBottom: 20,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    shadowColor: 'rgba(0, 0, 0, 0.1)',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  categoryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F5E6A3',
  },
  categoryIcon: {
    fontSize: 20,
    marginRight: 8,
  },
  categoryTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#8B4513',
  },
  settingsList: {
    gap: 12,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  settingInfo: {
    flex: 1,
    marginRight: 12,
  },
  settingName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#2D2D2D',
    marginBottom: 2,
  },
  settingDescription: {
    fontSize: 14,
    color: '#666666',
  },
  settingButton: {
    backgroundColor: '#D4AF37',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  settingButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  settingToggle: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    backgroundColor: '#F5E6A3',
  },
  settingToggleText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#8B4513',
  },
  fullSettingsNote: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#E8F4FD',
    padding: 12,
    borderRadius: 8,
    marginTop: 16,
  },
  fullSettingsNoteIcon: {
    fontSize: 16,
    marginRight: 8,
    marginTop: 2,
  },
  fullSettingsNoteText: {
    flex: 1,
    fontSize: 14,
    color: '#2563EB',
    lineHeight: 20,
  },
  fullSettingsActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  fullSettingsSaveButton: {
    flex: 1,
    backgroundColor: '#D4AF37',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  fullSettingsSaveText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  fullSettingsCancelButton: {
    flex: 1,
    backgroundColor: '#F0F0F0',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  fullSettingsCancelText: {
    color: '#666666',
    fontSize: 16,
    fontWeight: '500',
  },

  // Reset Confirmation Modal Styles
  resetConfirmContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    margin: 20,
    maxWidth: 400,
    width: '90%',
    alignSelf: 'center',
    shadowColor: 'rgba(0, 0, 0, 0.3)',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  resetConfirmHeader: {
    alignItems: 'center',
    marginBottom: 20,
  },
  resetConfirmIcon: {
    fontSize: 48,
    marginBottom: 8,
  },
  resetConfirmTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#DC2626',
    textAlign: 'center',
  },
  resetConfirmContent: {
    marginBottom: 24,
  },
  resetConfirmMessage: {
    fontSize: 16,
    color: '#374151',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 16,
  },
  resetConfirmWarning: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#FEF2F2',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#DC2626',
  },
  resetConfirmWarningIcon: {
    fontSize: 16,
    marginRight: 8,
    marginTop: 2,
  },
  resetConfirmWarningText: {
    flex: 1,
    fontSize: 14,
    color: '#DC2626',
    fontWeight: '500',
    lineHeight: 20,
  },
  resetConfirmList: {
    backgroundColor: '#F9FAFB',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  resetConfirmListItem: {
    fontSize: 14,
    color: '#4B5563',
    marginBottom: 4,
    lineHeight: 20,
  },
  resetConfirmNote: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#F0F9FF',
    padding: 12,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#0EA5E9',
  },
  resetConfirmNoteIcon: {
    fontSize: 16,
    marginRight: 8,
    marginTop: 2,
  },
  resetConfirmNoteText: {
    flex: 1,
    fontSize: 14,
    color: '#0284C7',
    lineHeight: 20,
  },
  resetConfirmActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  resetConfirmResetButton: {
    flex: 1,
    backgroundColor: '#DC2626',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  resetConfirmResetText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  resetConfirmCancelButton: {
    flex: 1,
    backgroundColor: '#F3F4F6',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  resetConfirmCancelText: {
    color: '#6B7280',
    fontSize: 16,
    fontWeight: '500',
  },
});