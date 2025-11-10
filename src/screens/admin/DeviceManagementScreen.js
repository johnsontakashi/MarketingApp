import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
  TextInput,
  Modal,
  ScrollView,
  RefreshControl,
  ActivityIndicator,
  Switch
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import apiClient from '../../services/api';

export default function DeviceManagementScreen({ navigation }) {
  const [devices, setDevices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDevice, setSelectedDevice] = useState(null);
  const [showDeviceDetails, setShowDeviceDetails] = useState(false);
  const [filterStatus, setFilterStatus] = useState('all'); // all, online, offline, locked, blocked

  useEffect(() => {
    loadDevices();
  }, []);

  const loadDevices = async () => {
    try {
      setLoading(true);
      // TODO: Replace with actual API call when backend endpoint is available
      // const response = await apiClient.get('/admin/devices');
      // setDevices(response.data);
      
      // Mock data for now
      const mockDevices = [
        {
          id: '1',
          device_id: 'TLBD001',
          device_name: 'Admin Tablet 1',
          user_email: 'admin@tlbdiamond.com',
          device_model: 'Samsung Galaxy Tab S8',
          os_version: 'Android 13',
          app_version: '1.0.0',
          ip_address: '192.168.1.101',
          last_seen: '2024-11-10T10:30:00.000Z',
          registered_at: '2024-11-01T10:00:00.000Z',
          status: 'online',
          is_locked: false,
          is_blocked: false,
          kiosk_mode: true,
          location: 'New York Store',
          battery_level: 85,
          storage_used: 12.5,
          storage_total: 64
        },
        {
          id: '2',
          device_id: 'TLBD002',
          device_name: 'Customer Kiosk 1',
          user_email: 'john.doe@example.com',
          device_model: 'iPad Pro 11"',
          os_version: 'iOS 17.1',
          app_version: '1.0.0',
          ip_address: '192.168.1.102',
          last_seen: '2024-11-10T10:25:00.000Z',
          registered_at: '2024-11-05T14:20:00.000Z',
          status: 'online',
          is_locked: false,
          is_blocked: false,
          kiosk_mode: false,
          location: 'Los Angeles Store',
          battery_level: 67,
          storage_used: 8.2,
          storage_total: 32
        },
        {
          id: '3',
          device_id: 'TLBD003',
          device_name: 'Display Kiosk 2',
          user_email: 'jane.seller@example.com',
          device_model: 'Samsung Galaxy Tab A8',
          os_version: 'Android 12',
          app_version: '0.9.8',
          ip_address: '192.168.1.103',
          last_seen: '2024-11-10T09:45:00.000Z',
          registered_at: '2024-11-03T09:15:00.000Z',
          status: 'offline',
          is_locked: true,
          is_blocked: false,
          kiosk_mode: true,
          location: 'Chicago Store',
          battery_level: 23,
          storage_used: 15.8,
          storage_total: 32
        },
        {
          id: '4',
          device_id: 'TLBD004',
          device_name: 'Mobile Sales Device',
          user_email: 'mike.buyer@example.com',
          device_model: 'iPhone 14 Pro',
          os_version: 'iOS 16.6',
          app_version: '1.0.0',
          ip_address: '192.168.1.104',
          last_seen: '2024-11-10T08:15:00.000Z',
          registered_at: '2024-11-07T16:30:00.000Z',
          status: 'online',
          is_locked: false,
          is_blocked: true,
          kiosk_mode: false,
          location: 'Remote',
          battery_level: 92,
          storage_used: 45.2,
          storage_total: 128
        },
        {
          id: '5',
          device_id: 'TLBD005',
          device_name: 'Legacy Kiosk',
          user_email: 'sarah.inactive@example.com',
          device_model: 'Samsung Galaxy Tab S7',
          os_version: 'Android 11',
          app_version: '0.9.5',
          ip_address: '192.168.1.105',
          last_seen: '2024-11-08T14:30:00.000Z',
          registered_at: '2024-10-20T11:45:00.000Z',
          status: 'offline',
          is_locked: false,
          is_blocked: false,
          kiosk_mode: true,
          location: 'Miami Store',
          battery_level: 0,
          storage_used: 28.9,
          storage_total: 64
        }
      ];
      setDevices(mockDevices);
    } catch (error) {
      console.error('Error loading devices:', error);
      Alert.alert('Error', 'Failed to load devices. Please try again.');
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
    setSelectedDevice(device);
    
    switch (action) {
      case 'view':
        setShowDeviceDetails(true);
        break;
      case 'lock':
        Alert.alert(
          'Lock Device',
          `Are you sure you want to lock ${device.device_name}?`,
          [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Lock', style: 'destructive', onPress: () => toggleDeviceLock(device.id, true) }
          ]
        );
        break;
      case 'unlock':
        Alert.alert(
          'Unlock Device',
          `Are you sure you want to unlock ${device.device_name}?`,
          [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Unlock', onPress: () => toggleDeviceLock(device.id, false) }
          ]
        );
        break;
      case 'block':
        Alert.alert(
          'Block Device',
          `Are you sure you want to block ${device.device_name}? This will prevent all app access.`,
          [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Block', style: 'destructive', onPress: () => toggleDeviceBlock(device.id, true) }
          ]
        );
        break;
      case 'unblock':
        Alert.alert(
          'Unblock Device',
          `Are you sure you want to unblock ${device.device_name}?`,
          [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Unblock', onPress: () => toggleDeviceBlock(device.id, false) }
          ]
        );
        break;
      case 'wipe':
        Alert.alert(
          'Remote Wipe Device',
          `Are you sure you want to remotely wipe ${device.device_name}? This will remove all app data and cannot be undone.`,
          [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Wipe', style: 'destructive', onPress: () => wipeDevice(device.id) }
          ]
        );
        break;
      case 'toggle_kiosk':
        toggleKioskMode(device.id, !device.kiosk_mode);
        break;
      case 'send_message':
        Alert.prompt(
          'Send Message to Device',
          'Enter the message to display on the device:',
          (text) => {
            if (text && text.trim()) {
              sendMessageToDevice(device.id, text.trim());
            }
          },
          'plain-text',
          '',
          'default'
        );
        break;
    }
  };

  const toggleDeviceLock = async (deviceId, shouldLock) => {
    try {
      // TODO: API call to lock/unlock device
      setDevices(prev => prev.map(device => 
        device.id === deviceId ? { ...device, is_locked: shouldLock } : device
      ));
      Alert.alert('Success', `Device has been ${shouldLock ? 'locked' : 'unlocked'} successfully.`);
    } catch (error) {
      Alert.alert('Error', `Failed to ${shouldLock ? 'lock' : 'unlock'} device. Please try again.`);
    }
  };

  const toggleDeviceBlock = async (deviceId, shouldBlock) => {
    try {
      // TODO: API call to block/unblock device
      setDevices(prev => prev.map(device => 
        device.id === deviceId ? { ...device, is_blocked: shouldBlock } : device
      ));
      Alert.alert('Success', `Device has been ${shouldBlock ? 'blocked' : 'unblocked'} successfully.`);
    } catch (error) {
      Alert.alert('Error', `Failed to ${shouldBlock ? 'block' : 'unblock'} device. Please try again.`);
    }
  };

  const toggleKioskMode = async (deviceId, enableKiosk) => {
    try {
      // TODO: API call to toggle kiosk mode
      setDevices(prev => prev.map(device => 
        device.id === deviceId ? { ...device, kiosk_mode: enableKiosk } : device
      ));
      Alert.alert('Success', `Kiosk mode has been ${enableKiosk ? 'enabled' : 'disabled'} for the device.`);
    } catch (error) {
      Alert.alert('Error', 'Failed to toggle kiosk mode. Please try again.');
    }
  };

  const wipeDevice = async (deviceId) => {
    try {
      // TODO: API call to wipe device
      Alert.alert('Success', 'Remote wipe command has been sent to the device.');
    } catch (error) {
      Alert.alert('Error', 'Failed to send wipe command. Please try again.');
    }
  };

  const sendMessageToDevice = async (deviceId, message) => {
    try {
      // TODO: API call to send message to device
      Alert.alert('Success', 'Message has been sent to the device.');
    } catch (error) {
      Alert.alert('Error', 'Failed to send message. Please try again.');
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
          onPress={() => handleDeviceAction('view', device)}
        >
          <Ionicons name="eye" size={16} color="#D4AF37" />
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.actionButton, device.is_locked ? styles.unlockButton : styles.lockButton]}
          onPress={() => handleDeviceAction(device.is_locked ? 'unlock' : 'lock', device)}
        >
          <Ionicons name={device.is_locked ? 'lock-open' : 'lock-closed'} size={16} color={device.is_locked ? '#10B981' : '#F59E0B'} />
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.actionButton, device.is_blocked ? styles.unblockButton : styles.blockButton]}
          onPress={() => handleDeviceAction(device.is_blocked ? 'unblock' : 'block', device)}
        >
          <Ionicons name={device.is_blocked ? 'play-circle' : 'ban'} size={16} color={device.is_blocked ? '#10B981' : '#EF4444'} />
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.actionButton}
          onPress={() => handleDeviceAction('send_message', device)}
        >
          <Ionicons name="chatbubble" size={16} color="#3B82F6" />
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
      >
        {selectedDevice && (
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Device Details</Text>
              <TouchableOpacity onPress={() => setShowDeviceDetails(false)}>
                <Ionicons name="close" size={24} color="#D4AF37" />
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
                  onPress={() => handleDeviceAction('send_message', selectedDevice)}
                >
                  <Ionicons name="chatbubble" size={20} color="#FFFFFF" />
                  <Text style={styles.modalActionButtonText}>Send Message</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={[styles.modalActionButton, selectedDevice.is_locked ? styles.unlockButton : styles.lockButton]}
                  onPress={() => handleDeviceAction(selectedDevice.is_locked ? 'unlock' : 'lock', selectedDevice)}
                >
                  <Ionicons name={selectedDevice.is_locked ? 'lock-open' : 'lock-closed'} size={20} color="#FFFFFF" />
                  <Text style={styles.modalActionButtonText}>
                    {selectedDevice.is_locked ? 'Unlock' : 'Lock'} Device
                  </Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={[styles.modalActionButton, styles.wipeButton]}
                  onPress={() => handleDeviceAction('wipe', selectedDevice)}
                >
                  <Ionicons name="trash" size={20} color="#FFFFFF" />
                  <Text style={styles.modalActionButtonText}>Remote Wipe</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        )}
      </Modal>
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
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#3d3d3d',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
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
});