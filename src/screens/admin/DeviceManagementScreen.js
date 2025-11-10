import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Modal,
  ScrollView,
  RefreshControl,
  ActivityIndicator,
  Switch
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import sharedDataService from '../../services/sharedDataService';
import AdminAlert from '../../components/admin/AdminAlert';
import { useAdminAlert } from '../../hooks/useAdminAlert';

export default function DeviceManagementScreen({ navigation }) {
  const [devices, setDevices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDevice, setSelectedDevice] = useState(null);
  const [showDeviceDetails, setShowDeviceDetails] = useState(false);
  const [filterStatus, setFilterStatus] = useState('all'); // all, online, offline, locked, blocked
  const { alertConfig, hideAlert, showSuccess, showError, showDestructiveConfirm, showAlert } = useAdminAlert();
  const [messageModal, setMessageModal] = useState({ visible: false, message: '' });
  const [chatModal, setChatModal] = useState({ visible: false, userEmail: '', messages: [], inputMessage: '' });

  useEffect(() => {
    loadDevices();
  }, []);

  const loadDevices = async () => {
    try {
      setLoading(true);
      
      // Load real devices from shared data service
      const registeredDevices = await sharedDataService.getDevices();
      
      if (registeredDevices.length === 0) {
        console.log('No registered devices found in the system');
        setDevices([]);
        showError(
          'No Devices Found',
          'No registered devices found in the system. Devices will appear here when users register and connect their devices.'
        );
      } else {
        setDevices(registeredDevices);
        console.log(`Loaded ${registeredDevices.length} registered devices from database`);
      }
    } catch (error) {
      console.error('Error loading devices:', error);
      setDevices([]); // Set empty array if there's an error
      
      showError(
        'Failed to Load Devices',
        'Unable to load device data from the system. This might be due to:\n\n• Database connectivity issues\n• Permission problems\n• Corrupted device registry\n\nPlease try refreshing or restart the app.'
      );
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadDevices();
    setRefreshing(false);
  };

  const filteredDevices = devices.filter(device => {
    const matchesSearch = 
      device.device_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      device.device_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      device.user_email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      device.location.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesFilter = 
      filterStatus === 'all' ||
      (filterStatus === 'online' && device.status === 'online') ||
      (filterStatus === 'offline' && device.status === 'offline') ||
      (filterStatus === 'locked' && device.is_locked) ||
      (filterStatus === 'blocked' && device.is_blocked);
    
    return matchesSearch && matchesFilter;
  });

  const handleDeviceAction = (action, device) => {
    console.log('Device action triggered:', action, 'for device:', device.device_name);
    setSelectedDevice(device);
    
    switch (action) {
      case 'view':
        console.log('Opening device details modal for:', device.device_name);
        setShowDeviceDetails(true);
        break;
      case 'lock':
        showDestructiveConfirm(
          'Lock Device',
          `Are you sure you want to lock ${device.device_name}? This will prevent device access.`,
          () => toggleDeviceLock(device.id, true),
          null,
          'Lock'
        );
        break;
      case 'unlock':
        showAlert({
          type: 'confirm',
          title: 'Unlock Device',
          message: `Are you sure you want to unlock ${device.device_name}?`,
          buttons: [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Unlock', onPress: () => toggleDeviceLock(device.id, false) }
          ]
        });
        break;
      case 'block':
        showDestructiveConfirm(
          'Block Device',
          `Are you sure you want to block ${device.device_name}? This will prevent all app access.`,
          () => toggleDeviceBlock(device.id, true),
          null,
          'Block'
        );
        break;
      case 'unblock':
        showAlert({
          type: 'confirm',
          title: 'Unblock Device',
          message: `Are you sure you want to unblock ${device.device_name}?`,
          buttons: [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Unblock', onPress: () => toggleDeviceBlock(device.id, false) }
          ]
        });
        break;
      case 'wipe':
        showDestructiveConfirm(
          'Remote Wipe Device',
          `Are you sure you want to remotely wipe ${device.device_name}? This will remove all app data and cannot be undone.`,
          () => wipeDevice(device.id),
          null,
          'Wipe'
        );
        break;
      case 'toggle_kiosk':
        console.log('Toggling kiosk mode for device:', device.device_name);
        toggleKioskMode(device.id, !device.kiosk_mode);
        break;
      case 'send_message':
        console.log('Opening chat modal for device:', device.device_name);
        openChatModal(device.user_email);
        break;
    }
  };

  const toggleDeviceLock = async (deviceId, shouldLock) => {
    try {
      // Update device in shared data service
      await sharedDataService.updateDevice(deviceId, { is_locked: shouldLock });
      
      // Update local state
      setDevices(prev => prev.map(device => 
        device.id === deviceId ? { ...device, is_locked: shouldLock } : device
      ));
      
      showSuccess('Success', `Device has been ${shouldLock ? 'locked' : 'unlocked'} successfully.`);
    } catch (error) {
      showError('Error', `Failed to ${shouldLock ? 'lock' : 'unlock'} device. Please try again.`);
    }
  };

  const toggleDeviceBlock = async (deviceId, shouldBlock) => {
    try {
      // Update device in shared data service
      await sharedDataService.updateDevice(deviceId, { is_blocked: shouldBlock });
      
      // Update local state
      setDevices(prev => prev.map(device => 
        device.id === deviceId ? { ...device, is_blocked: shouldBlock } : device
      ));
      
      showSuccess('Success', `Device has been ${shouldBlock ? 'blocked' : 'unblocked'} successfully.`);
    } catch (error) {
      showError('Error', `Failed to ${shouldBlock ? 'block' : 'unblock'} device. Please try again.`);
    }
  };

  const toggleKioskMode = async (deviceId, enableKiosk) => {
    try {
      // Update device in shared data service
      await sharedDataService.updateDevice(deviceId, { kiosk_mode: enableKiosk });
      
      // Update local state
      setDevices(prev => prev.map(device => 
        device.id === deviceId ? { ...device, kiosk_mode: enableKiosk } : device
      ));
      
      showSuccess('Success', `Kiosk mode has been ${enableKiosk ? 'enabled' : 'disabled'} for the device.`);
    } catch (error) {
      showError('Error', 'Failed to toggle kiosk mode. Please try again.');
    }
  };

  const wipeDevice = async (deviceId) => {
    try {
      // TODO: API call to wipe device
      showSuccess('Success', 'Remote wipe command has been sent to the device.');
    } catch (error) {
      showError('Error', 'Failed to send wipe command. Please try again.');
    }
  };

  const openChatModal = async (userEmail) => {
    try {
      // Load chat history for this user
      const userChat = await sharedDataService.getUserChat(userEmail);
      const messages = userChat ? userChat.messages : [];
      
      setChatModal({
        visible: true,
        userEmail: userEmail,
        messages: messages,
        inputMessage: ''
      });
      
      // Mark as read
      if (userChat && userChat.hasUnreadMessages) {
        await sharedDataService.markChatAsRead(userEmail);
      }
    } catch (error) {
      showError('Error', 'Failed to load chat. Please try again.');
    }
  };

  const sendChatMessage = async () => {
    if (!chatModal.inputMessage.trim()) return;
    
    try {
      const message = chatModal.inputMessage.trim();
      
      // Send admin message
      await sharedDataService.createOrUpdateUserChat(chatModal.userEmail, message, 'admin');
      
      // Refresh chat
      const userChat = await sharedDataService.getUserChat(chatModal.userEmail);
      setChatModal(prev => ({
        ...prev,
        messages: userChat ? userChat.messages : [],
        inputMessage: ''
      }));
      
      showSuccess('Message Sent', 'Your message has been sent to the user.');
    } catch (error) {
      showError('Error', 'Failed to send message. Please try again.');
    }
  };

  const sendMessageToDevice = async (deviceId, message) => {
    try {
      // TODO: API call to send message to device
      showSuccess('Success', 'Message has been sent to the device.');
    } catch (error) {
      showError('Error', 'Failed to send message. Please try again.');
    }
  };

  const formatLastSeen = (dateString) => {
    const now = new Date();
    const lastSeen = new Date(dateString);
    const diffInMinutes = Math.floor((now - lastSeen) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  const getStatusColor = (device) => {
    if (device.is_blocked) return '#EF4444';
    if (device.is_locked) return '#F59E0B';
    if (device.status === 'offline') return '#6B7280';
    return '#10B981';
  };

  const getStatusText = (device) => {
    if (device.is_blocked) return 'Blocked';
    if (device.is_locked) return 'Locked';
    if (device.status === 'offline') return 'Offline';
    return 'Online';
  };

  const getBatteryColor = (level) => {
    if (level > 50) return '#10B981';
    if (level > 20) return '#F59E0B';
    return '#EF4444';
  };

  const DeviceCard = ({ device }) => (
    <TouchableOpacity 
      style={styles.deviceCard}
      onPress={() => handleDeviceAction('view', device)}
      activeOpacity={0.8}
    >
      <View style={styles.deviceHeader}>
        <View style={styles.deviceInfo}>
          <View style={styles.deviceTitleRow}>
            <Text style={styles.deviceName}>{device.device_name}</Text>
            <View style={[styles.statusBadge, { backgroundColor: getStatusColor(device) + '20' }]}>
              <Text style={[styles.statusText, { color: getStatusColor(device) }]}>
                {getStatusText(device)}
              </Text>
            </View>
          </View>
          <Text style={styles.deviceId}>{device.device_id}</Text>
          <Text style={styles.deviceUser}>{device.user_email}</Text>
          <Text style={styles.deviceLocation}>📍 {device.location}</Text>
        </View>
      </View>
      
      <View style={styles.deviceMeta}>
        <View style={styles.metaRow}>
          <View style={styles.metaItem}>
            <Ionicons name="phone-portrait" size={14} color="#9CA3AF" />
            <Text style={styles.metaText}>{device.device_model}</Text>
          </View>
          <View style={styles.metaItem}>
            <Ionicons name="time" size={14} color="#9CA3AF" />
            <Text style={styles.metaText}>{formatLastSeen(device.last_seen)}</Text>
          </View>
        </View>
        
        <View style={styles.metaRow}>
          <View style={styles.metaItem}>
            <Ionicons name="battery-half" size={14} color={getBatteryColor(device.battery_level)} />
            <Text style={[styles.metaText, { color: getBatteryColor(device.battery_level) }]}>
              {device.battery_level}%
            </Text>
          </View>
          <View style={styles.metaItem}>
            <Ionicons name="server" size={14} color="#9CA3AF" />
            <Text style={styles.metaText}>
              {device.storage_used}GB / {device.storage_total}GB
            </Text>
          </View>
        </View>
      </View>
      
      <View style={styles.deviceActions}>
        <TouchableOpacity 
          style={styles.actionButton}
          onPress={() => {
            console.log('View button pressed for device:', device.device_name);
            handleDeviceAction('view', device);
          }}
          activeOpacity={0.7}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Ionicons name="eye" size={18} color="#D4AF37" />
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.actionButton, device.is_locked ? styles.unlockButton : styles.lockButton]}
          onPress={() => {
            console.log('Lock/Unlock button pressed for device:', device.device_name, 'Currently locked:', device.is_locked);
            handleDeviceAction(device.is_locked ? 'unlock' : 'lock', device);
          }}
          activeOpacity={0.7}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Ionicons name={device.is_locked ? 'lock-open' : 'lock-closed'} size={18} color={device.is_locked ? '#10B981' : '#F59E0B'} />
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.actionButton, device.is_blocked ? styles.unblockButton : styles.blockButton]}
          onPress={() => {
            console.log('Block/Unblock button pressed for device:', device.device_name, 'Currently blocked:', device.is_blocked);
            handleDeviceAction(device.is_blocked ? 'unblock' : 'block', device);
          }}
          activeOpacity={0.7}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Ionicons name={device.is_blocked ? 'play-circle' : 'ban'} size={18} color={device.is_blocked ? '#10B981' : '#EF4444'} />
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.actionButton, styles.messageButton]}
          onPress={() => {
            console.log('Message button pressed for device:', device.device_name);
            handleDeviceAction('send_message', device);
          }}
          activeOpacity={0.7}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Ionicons name="chatbubble" size={18} color="#3B82F6" />
        </TouchableOpacity>
      </View>
      
      {device.kiosk_mode && (
        <View style={styles.kioskBadge}>
          <Ionicons name="tv" size={12} color="#D4AF37" />
          <Text style={styles.kioskText}>KIOSK MODE</Text>
        </View>
      )}
    </TouchableOpacity>
  );

  const FilterButton = ({ type, label, active }) => (
    <TouchableOpacity
      style={[styles.filterButton, active && styles.activeFilterButton]}
      onPress={() => setFilterStatus(type)}
    >
      <Text style={[styles.filterButtonText, active && styles.activeFilterButtonText]}>
        {label}
      </Text>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#D4AF37" />
        <Text style={styles.loadingText}>Loading devices...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color="#9CA3AF" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search devices..."
            placeholderTextColor="#9CA3AF"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Ionicons name="close-circle" size={20} color="#9CA3AF" />
            </TouchableOpacity>
          )}
        </View>
        
        {/* Filter Buttons */}
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          style={styles.filterContainer}
        >
          <FilterButton type="all" label="All Devices" active={filterStatus === 'all'} />
          <FilterButton type="online" label="Online" active={filterStatus === 'online'} />
          <FilterButton type="offline" label="Offline" active={filterStatus === 'offline'} />
          <FilterButton type="locked" label="Locked" active={filterStatus === 'locked'} />
          <FilterButton type="blocked" label="Blocked" active={filterStatus === 'blocked'} />
        </ScrollView>
      </View>

      {/* Device List */}
      <FlatList
        data={filteredDevices}
        keyExtractor={item => item.id}
        renderItem={({ item }) => <DeviceCard device={item} />}
        style={styles.deviceList}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        ListEmptyComponent={() => (
          <View style={styles.emptyContainer}>
            <Ionicons name="phone-portrait-outline" size={64} color="#6B7280" />
            <Text style={styles.emptyText}>No devices found</Text>
            <Text style={styles.emptySubtext}>
              {searchQuery ? 'Try adjusting your search criteria' : 'Devices will appear here once registered'}
            </Text>
          </View>
        )}
      />

      {/* Device Details Modal */}
      <Modal
        visible={showDeviceDetails}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => {
          console.log('Device details modal onRequestClose triggered');
          setShowDeviceDetails(false);
          setSelectedDevice(null);
        }}
      >
        {selectedDevice && (
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Device Details</Text>
              <TouchableOpacity 
                style={styles.modalCloseButton}
                onPress={() => {
                  console.log('Device details modal close button pressed');
                  setShowDeviceDetails(false);
                  setSelectedDevice(null);
                }}
                activeOpacity={0.7}
                hitSlop={{ top: 15, bottom: 15, left: 15, right: 15 }}
                testID="deviceDetailsCloseButton"
              >
                <Ionicons name="close" size={28} color="#D4AF37" />
              </TouchableOpacity>
            </View>
            
            <ScrollView style={styles.modalContent}>
              <View style={styles.detailSection}>
                <Text style={styles.sectionTitle}>Device Information</Text>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Name:</Text>
                  <Text style={styles.detailValue}>{selectedDevice.device_name}</Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>ID:</Text>
                  <Text style={styles.detailValue}>{selectedDevice.device_id}</Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Model:</Text>
                  <Text style={styles.detailValue}>{selectedDevice.device_model}</Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>OS Version:</Text>
                  <Text style={styles.detailValue}>{selectedDevice.os_version}</Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>App Version:</Text>
                  <Text style={styles.detailValue}>{selectedDevice.app_version}</Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>IP Address:</Text>
                  <Text style={styles.detailValue}>{selectedDevice.ip_address}</Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Location:</Text>
                  <Text style={styles.detailValue}>{selectedDevice.location}</Text>
                </View>
              </View>
              
              <View style={styles.detailSection}>
                <Text style={styles.sectionTitle}>Status & Controls</Text>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Status:</Text>
                  <Text style={[styles.detailValue, { color: getStatusColor(selectedDevice) }]}>
                    {getStatusText(selectedDevice)}
                  </Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Last Seen:</Text>
                  <Text style={styles.detailValue}>{formatLastSeen(selectedDevice.last_seen)}</Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Battery:</Text>
                  <Text style={[styles.detailValue, { color: getBatteryColor(selectedDevice.battery_level) }]}>
                    {selectedDevice.battery_level}%
                  </Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Storage:</Text>
                  <Text style={styles.detailValue}>
                    {selectedDevice.storage_used}GB / {selectedDevice.storage_total}GB
                  </Text>
                </View>
                
                <View style={styles.switchRow}>
                  <Text style={styles.detailLabel}>Kiosk Mode:</Text>
                  <Switch
                    value={selectedDevice.kiosk_mode}
                    onValueChange={() => handleDeviceAction('toggle_kiosk', selectedDevice)}
                    trackColor={{ false: '#3d3d3d', true: '#D4AF37' }}
                    thumbColor={selectedDevice.kiosk_mode ? '#1a1a1a' : '#9CA3AF'}
                  />
                </View>
              </View>
              
              <View style={styles.detailSection}>
                <Text style={styles.sectionTitle}>User Information</Text>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>User Email:</Text>
                  <Text style={styles.detailValue}>{selectedDevice.user_email}</Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Registered:</Text>
                  <Text style={styles.detailValue}>
                    {new Date(selectedDevice.registered_at).toLocaleDateString()} {new Date(selectedDevice.registered_at).toLocaleTimeString()}
                  </Text>
                </View>
              </View>
              
              <View style={styles.actionButtonsContainer}>
                <TouchableOpacity 
                  style={[styles.modalActionButton, styles.messageButton]}
                  onPress={() => {
                    console.log('Message button pressed from modal');
                    handleDeviceAction('send_message', selectedDevice);
                  }}
                  activeOpacity={0.8}
                >
                  <Ionicons name="chatbubble" size={20} color="#FFFFFF" />
                  <Text style={styles.modalActionButtonText}>Send Message</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={[styles.modalActionButton, selectedDevice.is_locked ? styles.unlockModalButton : styles.lockModalButton]}
                  onPress={() => {
                    console.log('Lock/unlock button pressed from modal');
                    handleDeviceAction(selectedDevice.is_locked ? 'unlock' : 'lock', selectedDevice);
                  }}
                  activeOpacity={0.8}
                >
                  <Ionicons name={selectedDevice.is_locked ? 'lock-open' : 'lock-closed'} size={20} color="#FFFFFF" />
                  <Text style={styles.modalActionButtonText}>
                    {selectedDevice.is_locked ? 'Unlock' : 'Lock'} Device
                  </Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={[styles.modalActionButton, styles.wipeButton]}
                  onPress={() => {
                    console.log('Wipe button pressed from modal');
                    handleDeviceAction('wipe', selectedDevice);
                  }}
                  activeOpacity={0.8}
                >
                  <Ionicons name="trash" size={20} color="#FFFFFF" />
                  <Text style={styles.modalActionButtonText}>Remote Wipe</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        )}
      </Modal>

      {/* Custom Message Modal */}
      <Modal
        visible={messageModal.visible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setMessageModal({ visible: false, message: '' })}
      >
        <View style={styles.messageModalOverlay}>
          <View style={styles.messageModalContainer}>
            <View style={styles.messageModalHeader}>
              <Text style={styles.messageModalTitle}>Send Message to Device</Text>
              <TouchableOpacity
                onPress={() => setMessageModal({ visible: false, message: '' })}
                style={styles.messageModalClose}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <Ionicons name="close" size={24} color="#D4AF37" />
              </TouchableOpacity>
            </View>
            
            <View style={styles.messageModalContent}>
              <Text style={styles.messageModalLabel}>Message:</Text>
              <TextInput
                style={styles.messageModalInput}
                placeholder="Enter the message to display on the device..."
                placeholderTextColor="#9CA3AF"
                value={messageModal.message}
                onChangeText={(text) => setMessageModal(prev => ({ ...prev, message: text }))}
                multiline={true}
                numberOfLines={4}
                maxLength={500}
              />
              <Text style={styles.messageModalCharCount}>
                {messageModal.message.length}/500 characters
              </Text>
            </View>
            
            <View style={styles.messageModalButtons}>
              <TouchableOpacity
                style={[styles.messageModalButton, styles.messageModalCancelButton]}
                onPress={() => setMessageModal({ visible: false, message: '' })}
                activeOpacity={0.8}
              >
                <Text style={styles.messageModalCancelText}>Cancel</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[styles.messageModalButton, styles.messageModalSendButton]}
                onPress={() => {
                  if (messageModal.message.trim()) {
                    sendMessageToDevice(selectedDevice.id, messageModal.message.trim());
                    setMessageModal({ visible: false, message: '' });
                  } else {
                    showError('Error', 'Please enter a message to send.');
                  }
                }}
                activeOpacity={0.8}
              >
                <Text style={styles.messageModalSendText}>Send Message</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Chat Modal */}
      <Modal
        visible={chatModal.visible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setChatModal(prev => ({ ...prev, visible: false }))}
      >
        <View style={styles.chatModalOverlay}>
          <View style={styles.chatModalContainer}>
            <View style={styles.chatModalHeader}>
              <Text style={styles.chatModalTitle}>
                Chat with {chatModal.userEmail}
              </Text>
              <TouchableOpacity
                onPress={() => setChatModal(prev => ({ ...prev, visible: false }))}
                style={styles.chatModalClose}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <Ionicons name="close" size={24} color="#D4AF37" />
              </TouchableOpacity>
            </View>
            
            <View style={styles.chatMessagesContainer}>
              <ScrollView style={styles.chatMessagesList}>
                {chatModal.messages.map((message, index) => {
                  const isAdmin = message.sender === 'admin';
                  return (
                    <View key={index} style={[
                      styles.chatMessageBubble,
                      isAdmin ? styles.adminMessage : styles.userMessage
                    ]}>
                      <Text style={[
                        styles.chatMessageText,
                        isAdmin ? styles.adminMessageText : styles.userMessageText
                      ]}>
                        {message.text}
                      </Text>
                      <Text style={styles.chatMessageTime}>
                        {new Date(message.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                      </Text>
                    </View>
                  );
                })}
              </ScrollView>
            </View>
            
            <View style={styles.chatInputContainer}>
              <TextInput
                style={styles.chatInput}
                placeholder="Type your response..."
                placeholderTextColor="#9CA3AF"
                value={chatModal.inputMessage}
                onChangeText={(text) => setChatModal(prev => ({ ...prev, inputMessage: text }))}
                multiline={true}
                numberOfLines={2}
                maxLength={500}
              />
              <TouchableOpacity
                style={[styles.chatSendButton, !chatModal.inputMessage.trim() && styles.chatSendButtonDisabled]}
                onPress={sendChatMessage}
                disabled={!chatModal.inputMessage.trim()}
                activeOpacity={0.8}
              >
                <Ionicons name="send" size={20} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Admin Alert */}
      <AdminAlert
        visible={alertConfig.visible}
        type={alertConfig.type}
        title={alertConfig.title}
        message={alertConfig.message}
        buttons={alertConfig.buttons}
        onClose={hideAlert}
        icon={alertConfig.icon}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a1a',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1a1a1a',
  },
  loadingText: {
    color: '#9CA3AF',
    marginTop: 16,
    fontSize: 16,
  },
  header: {
    backgroundColor: '#2d2d2d',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#3d3d3d',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#3d3d3d',
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 16,
  },
  searchInput: {
    flex: 1,
    color: '#FFFFFF',
    fontSize: 16,
    paddingVertical: 12,
    marginLeft: 8,
  },
  filterContainer: {
    marginBottom: 8,
  },
  filterButton: {
    backgroundColor: '#3d3d3d',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
  },
  activeFilterButton: {
    backgroundColor: '#D4AF37',
  },
  filterButtonText: {
    color: '#9CA3AF',
    fontSize: 14,
    fontWeight: '500',
  },
  activeFilterButtonText: {
    color: '#1a1a1a',
  },
  deviceList: {
    flex: 1,
    padding: 16,
  },
  deviceCard: {
    backgroundColor: '#2d2d2d',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#3d3d3d',
    position: 'relative',
  },
  deviceHeader: {
    marginBottom: 12,
  },
  deviceInfo: {
    flex: 1,
  },
  deviceTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 4,
  },
  deviceName: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    flex: 1,
  },
  deviceId: {
    color: '#D4AF37',
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 2,
  },
  deviceUser: {
    color: '#9CA3AF',
    fontSize: 14,
    marginBottom: 2,
  },
  deviceLocation: {
    color: '#9CA3AF',
    fontSize: 12,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  deviceMeta: {
    marginBottom: 12,
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  metaText: {
    color: '#9CA3AF',
    fontSize: 12,
    marginLeft: 4,
  },
  deviceActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: 8,
  },
  actionButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#3d3d3d',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  lockButton: {
    backgroundColor: '#F59E0B' + '20',
  },
  unlockButton: {
    backgroundColor: '#10B981' + '20',
  },
  blockButton: {
    backgroundColor: '#EF4444' + '20',
  },
  unblockButton: {
    backgroundColor: '#10B981' + '20',
  },
  kioskBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#D4AF37' + '20',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  kioskText: {
    color: '#D4AF37',
    fontSize: 10,
    fontWeight: 'bold',
    marginLeft: 2,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 100,
  },
  emptyText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 16,
  },
  emptySubtext: {
    color: '#9CA3AF',
    fontSize: 14,
    textAlign: 'center',
    marginTop: 8,
    paddingHorizontal: 32,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#1a1a1a',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#3d3d3d',
  },
  modalTitle: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
  },
  modalCloseButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#EF4444',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  modalContent: {
    flex: 1,
    padding: 16,
  },
  detailSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    color: '#D4AF37',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#3d3d3d',
  },
  detailLabel: {
    color: '#9CA3AF',
    fontSize: 14,
    fontWeight: '500',
  },
  detailValue: {
    color: '#FFFFFF',
    fontSize: 14,
    textAlign: 'right',
    flex: 1,
    marginLeft: 16,
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#3d3d3d',
  },
  actionButtonsContainer: {
    marginTop: 20,
    marginBottom: 32,
  },
  modalActionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
  },
  modalActionButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  messageButton: {
    backgroundColor: '#3B82F6',
  },
  wipeButton: {
    backgroundColor: '#EF4444',
  },
  messageButton: {
    backgroundColor: '#3B82F6' + '20',
  },
  lockModalButton: {
    backgroundColor: '#F59E0B',
  },
  unlockModalButton: {
    backgroundColor: '#10B981',
  },
  // Message Modal Styles
  messageModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  messageModalContainer: {
    backgroundColor: '#2d2d2d',
    borderRadius: 16,
    width: '100%',
    maxWidth: 400,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },
  messageModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#3d3d3d',
  },
  messageModalTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    flex: 1,
  },
  messageModalClose: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#3d3d3d',
    justifyContent: 'center',
    alignItems: 'center',
  },
  messageModalContent: {
    padding: 20,
  },
  messageModalLabel: {
    color: '#D4AF37',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  messageModalInput: {
    backgroundColor: '#3d3d3d',
    color: '#FFFFFF',
    fontSize: 16,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#4d4d4d',
    textAlignVertical: 'top',
    minHeight: 100,
    maxHeight: 150,
  },
  messageModalCharCount: {
    color: '#9CA3AF',
    fontSize: 12,
    textAlign: 'right',
    marginTop: 8,
  },
  messageModalButtons: {
    flexDirection: 'row',
    padding: 16,
    gap: 12,
  },
  messageModalButton: {
    flex: 1,
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  messageModalCancelButton: {
    backgroundColor: '#6B7280',
  },
  messageModalSendButton: {
    backgroundColor: '#D4AF37',
  },
  messageModalCancelText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  messageModalSendText: {
    color: '#1a1a1a',
    fontSize: 16,
    fontWeight: '600',
  },
  // Chat Modal Styles
  chatModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  chatModalContainer: {
    backgroundColor: '#2d2d2d',
    borderRadius: 16,
    width: '95%',
    height: '80%',
    maxHeight: 600,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },
  chatModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#3d3d3d',
  },
  chatModalTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    flex: 1,
  },
  chatModalClose: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#3d3d3d',
    justifyContent: 'center',
    alignItems: 'center',
  },
  chatMessagesContainer: {
    flex: 1,
    padding: 16,
  },
  chatMessagesList: {
    flex: 1,
  },
  chatMessageBubble: {
    marginBottom: 12,
    padding: 12,
    borderRadius: 12,
    maxWidth: '80%',
  },
  adminMessage: {
    backgroundColor: '#D4AF37',
    alignSelf: 'flex-end',
  },
  userMessage: {
    backgroundColor: '#3d3d3d',
    alignSelf: 'flex-start',
  },
  chatMessageText: {
    fontSize: 14,
    lineHeight: 18,
    marginBottom: 4,
  },
  adminMessageText: {
    color: '#1a1a1a',
  },
  userMessageText: {
    color: '#FFFFFF',
  },
  chatMessageTime: {
    fontSize: 10,
    color: '#9CA3AF',
    textAlign: 'right',
  },
  chatInputContainer: {
    flexDirection: 'row',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#3d3d3d',
    alignItems: 'flex-end',
  },
  chatInput: {
    flex: 1,
    backgroundColor: '#3d3d3d',
    color: '#FFFFFF',
    fontSize: 14,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#4d4d4d',
    textAlignVertical: 'top',
    maxHeight: 80,
    marginRight: 8,
  },
  chatSendButton: {
    backgroundColor: '#D4AF37',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  chatSendButtonDisabled: {
    backgroundColor: '#6B7280',
  },
});