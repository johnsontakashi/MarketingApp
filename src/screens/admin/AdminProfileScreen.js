import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
  TextInput,
  Modal,
  Switch,
  ActivityIndicator
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as SecureStore from 'expo-secure-store';
import apiClient from '../../services/api';

export default function AdminProfileScreen({ navigation, onLogout }) {
  const [loading, setLoading] = useState(true);
  const [adminData, setAdminData] = useState({});
  const [systemSettings, setSystemSettings] = useState({
    maintenanceMode: false,
    newRegistrations: true,
    emailNotifications: true,
    pushNotifications: true,
    autoBackup: true,
    debugMode: false,
    kioskModeDefault: true,
    maxDevicesPerUser: 5
  });
  const [showProfileEdit, setShowProfileEdit] = useState(false);
  const [profileForm, setProfileForm] = useState({
    first_name: '',
    last_name: '',
    email: '',
    current_password: '',
    new_password: '',
    confirm_password: ''
  });

  useEffect(() => {
    loadAdminData();
  }, []);

  const loadAdminData = async () => {
    try {
      setLoading(true);
      const currentUser = await SecureStore.getItemAsync('currentUser');
      if (currentUser) {
        const userData = JSON.parse(currentUser);
        setAdminData(userData);
        setProfileForm({
          first_name: userData.first_name || '',
          last_name: userData.last_name || '',
          email: userData.email || '',
          current_password: '',
          new_password: '',
          confirm_password: ''
        });
      }
      
      // TODO: Load system settings from API
      // const settingsResponse = await apiClient.get('/admin/settings');
      // setSystemSettings(settingsResponse.data);
    } catch (error) {
      console.error('Error loading admin data:', error);
      Alert.alert('Error', 'Failed to load admin data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const updateSystemSetting = async (key, value) => {
    try {
      // TODO: API call to update system setting
      setSystemSettings(prev => ({ ...prev, [key]: value }));
      
      // Show confirmation for critical settings
      if (key === 'maintenanceMode') {
        Alert.alert(
          'Maintenance Mode',
          value ? 'Maintenance mode has been enabled. Users may experience service interruptions.' :
                  'Maintenance mode has been disabled. Normal service has been restored.',
          [{ text: 'OK' }]
        );
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to update system setting. Please try again.');
      // Revert the change on error
      setSystemSettings(prev => ({ ...prev, [key]: !value }));
    }
  };

  const updateProfile = async () => {
    try {
      if (!profileForm.first_name || !profileForm.last_name) {
        Alert.alert('Error', 'Please fill in all required fields.');
        return;
      }

      if (profileForm.new_password) {
        if (profileForm.new_password !== profileForm.confirm_password) {
          Alert.alert('Error', 'New passwords do not match.');
          return;
        }
        if (profileForm.new_password.length < 8) {
          Alert.alert('Error', 'New password must be at least 8 characters long.');
          return;
        }
        if (!profileForm.current_password) {
          Alert.alert('Error', 'Please enter your current password to change it.');
          return;
        }
      }

      // TODO: API call to update profile
      const updatedData = {
        ...adminData,
        first_name: profileForm.first_name,
        last_name: profileForm.last_name
      };
      
      await SecureStore.setItemAsync('currentUser', JSON.stringify(updatedData));
      setAdminData(updatedData);
      
      Alert.alert('Success', 'Profile updated successfully.');
      setShowProfileEdit(false);
      setProfileForm(prev => ({
        ...prev,
        current_password: '',
        new_password: '',
        confirm_password: ''
      }));
    } catch (error) {
      Alert.alert('Error', 'Failed to update profile. Please try again.');
    }
  };

  const handleLogout = async () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out of the admin account?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Sign Out',
          style: 'destructive',
          onPress: async () => {
            try {
              await SecureStore.deleteItemAsync('auth_token');
              await SecureStore.deleteItemAsync('currentUser');
              onLogout();
            } catch (error) {
              console.error('Error during logout:', error);
              onLogout(); // Still logout even if cleanup fails
            }
          }
        }
      ]
    );
  };

  const exportSystemLogs = () => {
    Alert.alert(
      'Export System Logs',
      'System logs will be prepared for download. This may take a few minutes.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Export', onPress: () => {
          // TODO: Implement log export
          Alert.alert('Export Started', 'System logs export has been initiated. You will be notified when ready.');
        }}
      ]
    );
  };

  const clearSystemCache = () => {
    Alert.alert(
      'Clear System Cache',
      'This will clear all cached data and may improve performance. Continue?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Clear Cache', style: 'destructive', onPress: () => {
          // TODO: Implement cache clearing
          Alert.alert('Success', 'System cache has been cleared successfully.');
        }}
      ]
    );
  };

  const resetToDefaults = () => {
    Alert.alert(
      'Reset to Defaults',
      'This will reset all system settings to their default values. This action cannot be undone. Continue?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Reset', style: 'destructive', onPress: () => {
          setSystemSettings({
            maintenanceMode: false,
            newRegistrations: true,
            emailNotifications: true,
            pushNotifications: true,
            autoBackup: true,
            debugMode: false,
            kioskModeDefault: true,
            maxDevicesPerUser: 5
          });
          Alert.alert('Success', 'System settings have been reset to defaults.');
        }}
      ]
    );
  };

  const SettingRow = ({ title, description, value, onToggle, type = 'switch' }) => (
    <View style={styles.settingRow}>
      <View style={styles.settingInfo}>
        <Text style={styles.settingTitle}>{title}</Text>
        {description && <Text style={styles.settingDescription}>{description}</Text>}
      </View>
      {type === 'switch' ? (
        <Switch
          value={value}
          onValueChange={onToggle}
          trackColor={{ false: '#3d3d3d', true: '#D4AF37' }}
          thumbColor={value ? '#1a1a1a' : '#9CA3AF'}
        />
      ) : (
        <TouchableOpacity style={styles.settingButton} onPress={onToggle}>
          <Text style={styles.settingButtonText}>{value}</Text>
          <Ionicons name="chevron-forward" size={16} color="#9CA3AF" />
        </TouchableOpacity>
      )}
    </View>
  );

  const ProfileSection = ({ title, children }) => (
    <View style={styles.profileSection}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {children}
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#D4AF37" />
        <Text style={styles.loadingText}>Loading admin profile...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {/* Admin Profile Header */}
        <View style={styles.profileHeader}>
          <View style={styles.avatarContainer}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>
                {adminData.first_name?.[0]}{adminData.last_name?.[0]}
              </Text>
            </View>
            <View style={styles.adminBadge}>
              <Ionicons name="shield-checkmark" size={14} color="#D4AF37" />
              <Text style={styles.adminBadgeText}>ADMIN</Text>
            </View>
          </View>
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>{adminData.first_name} {adminData.last_name}</Text>
            <Text style={styles.profileEmail}>{adminData.email}</Text>
            <Text style={styles.profileRole}>System Administrator</Text>
          </View>
          <TouchableOpacity style={styles.editButton} onPress={() => setShowProfileEdit(true)}>
            <Ionicons name="create" size={20} color="#D4AF37" />
          </TouchableOpacity>
        </View>

        {/* System Settings */}
        <ProfileSection title="🛠 System Settings">
          <SettingRow
            title="Maintenance Mode"
            description="Temporarily disable user access for system updates"
            value={systemSettings.maintenanceMode}
            onToggle={(value) => updateSystemSetting('maintenanceMode', value)}
          />
          <SettingRow
            title="New User Registrations"
            description="Allow new users to create accounts"
            value={systemSettings.newRegistrations}
            onToggle={(value) => updateSystemSetting('newRegistrations', value)}
          />
          <SettingRow
            title="Default Kiosk Mode"
            description="Enable kiosk mode by default for new devices"
            value={systemSettings.kioskModeDefault}
            onToggle={(value) => updateSystemSetting('kioskModeDefault', value)}
          />
          <SettingRow
            title="Debug Mode"
            description="Enable detailed logging for troubleshooting"
            value={systemSettings.debugMode}
            onToggle={(value) => updateSystemSetting('debugMode', value)}
          />
        </ProfileSection>

        {/* Notification Settings */}
        <ProfileSection title="🔔 Notifications">
          <SettingRow
            title="Email Notifications"
            description="Receive system alerts via email"
            value={systemSettings.emailNotifications}
            onToggle={(value) => updateSystemSetting('emailNotifications', value)}
          />
          <SettingRow
            title="Push Notifications"
            description="Receive push notifications for critical events"
            value={systemSettings.pushNotifications}
            onToggle={(value) => updateSystemSetting('pushNotifications', value)}
          />
        </ProfileSection>

        {/* Backup & Security */}
        <ProfileSection title="🔒 Backup & Security">
          <SettingRow
            title="Automatic Backup"
            description="Automatically backup system data daily"
            value={systemSettings.autoBackup}
            onToggle={(value) => updateSystemSetting('autoBackup', value)}
          />
          <SettingRow
            title="Max Devices Per User"
            description="Maximum devices allowed per user account"
            value={`${systemSettings.maxDevicesPerUser} devices`}
            onToggle={() => {
              Alert.prompt(
                'Max Devices Per User',
                'Enter the maximum number of devices allowed per user:',
                (text) => {
                  const num = parseInt(text);
                  if (!isNaN(num) && num > 0 && num <= 50) {
                    updateSystemSetting('maxDevicesPerUser', num);
                  } else {
                    Alert.alert('Error', 'Please enter a valid number between 1 and 50.');
                  }
                },
                'plain-text',
                systemSettings.maxDevicesPerUser.toString(),
                'numeric'
              );
            }}
            type="button"
          />
        </ProfileSection>

        {/* System Tools */}
        <ProfileSection title="⚙️ System Tools">
          <TouchableOpacity style={styles.toolButton} onPress={exportSystemLogs}>
            <View style={styles.toolInfo}>
              <Ionicons name="download" size={20} color="#3B82F6" />
              <Text style={styles.toolTitle}>Export System Logs</Text>
            </View>
            <Ionicons name="chevron-forward" size={16} color="#9CA3AF" />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.toolButton} onPress={clearSystemCache}>
            <View style={styles.toolInfo}>
              <Ionicons name="refresh" size={20} color="#F59E0B" />
              <Text style={styles.toolTitle}>Clear System Cache</Text>
            </View>
            <Ionicons name="chevron-forward" size={16} color="#9CA3AF" />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.toolButton} onPress={resetToDefaults}>
            <View style={styles.toolInfo}>
              <Ionicons name="restore" size={20} color="#EF4444" />
              <Text style={styles.toolTitle}>Reset to Defaults</Text>
            </View>
            <Ionicons name="chevron-forward" size={16} color="#9CA3AF" />
          </TouchableOpacity>
        </ProfileSection>

        {/* Logout */}
        <View style={styles.logoutSection}>
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Ionicons name="log-out" size={20} color="#FFFFFF" />
            <Text style={styles.logoutButtonText}>Sign Out</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Profile Edit Modal */}
      <Modal
        visible={showProfileEdit}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Edit Admin Profile</Text>
            <TouchableOpacity onPress={() => setShowProfileEdit(false)}>
              <Ionicons name="close" size={24} color="#D4AF37" />
            </TouchableOpacity>
          </View>
          
          <ScrollView style={styles.modalContent}>
            <View style={styles.formSection}>
              <Text style={styles.formSectionTitle}>Personal Information</Text>
              
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>First Name *</Text>
                <TextInput
                  style={styles.textInput}
                  value={profileForm.first_name}
                  onChangeText={(text) => setProfileForm(prev => ({ ...prev, first_name: text }))}
                  placeholder="Enter first name"
                  placeholderTextColor="#9CA3AF"
                />
              </View>
              
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Last Name *</Text>
                <TextInput
                  style={styles.textInput}
                  value={profileForm.last_name}
                  onChangeText={(text) => setProfileForm(prev => ({ ...prev, last_name: text }))}
                  placeholder="Enter last name"
                  placeholderTextColor="#9CA3AF"
                />
              </View>
              
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Email</Text>
                <TextInput
                  style={[styles.textInput, styles.disabledInput]}
                  value={profileForm.email}
                  editable={false}
                  placeholder="Email address"
                  placeholderTextColor="#9CA3AF"
                />
                <Text style={styles.inputNote}>Email cannot be changed for admin accounts</Text>
              </View>
            </View>
            
            <View style={styles.formSection}>
              <Text style={styles.formSectionTitle}>Change Password</Text>
              <Text style={styles.formSectionNote}>Leave blank to keep current password</Text>
              
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Current Password</Text>
                <TextInput
                  style={styles.textInput}
                  value={profileForm.current_password}
                  onChangeText={(text) => setProfileForm(prev => ({ ...prev, current_password: text }))}
                  placeholder="Enter current password"
                  placeholderTextColor="#9CA3AF"
                  secureTextEntry
                />
              </View>
              
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>New Password</Text>
                <TextInput
                  style={styles.textInput}
                  value={profileForm.new_password}
                  onChangeText={(text) => setProfileForm(prev => ({ ...prev, new_password: text }))}
                  placeholder="Enter new password (min 8 characters)"
                  placeholderTextColor="#9CA3AF"
                  secureTextEntry
                />
              </View>
              
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Confirm New Password</Text>
                <TextInput
                  style={styles.textInput}
                  value={profileForm.confirm_password}
                  onChangeText={(text) => setProfileForm(prev => ({ ...prev, confirm_password: text }))}
                  placeholder="Confirm new password"
                  placeholderTextColor="#9CA3AF"
                  secureTextEntry
                />
              </View>
            </View>
            
            <TouchableOpacity style={styles.saveButton} onPress={updateProfile}>
              <Text style={styles.saveButtonText}>Update Profile</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
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
  scrollView: {
    flex: 1,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#2d2d2d',
    borderBottomWidth: 1,
    borderBottomColor: '#3d3d3d',
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 16,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#D4AF37',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    color: '#1a1a1a',
    fontSize: 20,
    fontWeight: 'bold',
  },
  adminBadge: {
    position: 'absolute',
    top: -5,
    right: -5,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1a1a1a',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#D4AF37',
  },
  adminBadgeText: {
    color: '#D4AF37',
    fontSize: 8,
    fontWeight: 'bold',
    marginLeft: 2,
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  profileEmail: {
    color: '#9CA3AF',
    fontSize: 14,
    marginBottom: 2,
  },
  profileRole: {
    color: '#D4AF37',
    fontSize: 12,
    fontWeight: '600',
  },
  editButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#3d3d3d',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileSection: {
    backgroundColor: '#2d2d2d',
    margin: 16,
    borderRadius: 12,
    overflow: 'hidden',
  },
  sectionTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    padding: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#3d3d3d',
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#3d3d3d',
  },
  settingInfo: {
    flex: 1,
    marginRight: 16,
  },
  settingTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 2,
  },
  settingDescription: {
    color: '#9CA3AF',
    fontSize: 12,
    lineHeight: 16,
  },
  settingButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#3d3d3d',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  settingButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    marginRight: 8,
  },
  toolButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#3d3d3d',
  },
  toolInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  toolTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '500',
    marginLeft: 12,
  },
  logoutSection: {
    margin: 16,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#EF4444',
    padding: 16,
    borderRadius: 12,
  },
  logoutButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
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
  formSection: {
    marginBottom: 24,
  },
  formSectionTitle: {
    color: '#D4AF37',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  formSectionNote: {
    color: '#9CA3AF',
    fontSize: 14,
    marginBottom: 16,
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    color: '#9CA3AF',
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 8,
  },
  textInput: {
    backgroundColor: '#3d3d3d',
    color: '#FFFFFF',
    fontSize: 16,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#4d4d4d',
  },
  disabledInput: {
    backgroundColor: '#2a2a2a',
    color: '#6B7280',
  },
  inputNote: {
    color: '#6B7280',
    fontSize: 12,
    marginTop: 4,
    fontStyle: 'italic',
  },
  saveButton: {
    backgroundColor: '#D4AF37',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 32,
  },
  saveButtonText: {
    color: '#1a1a1a',
    fontSize: 16,
    fontWeight: 'bold',
  },
});