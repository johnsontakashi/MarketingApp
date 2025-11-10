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
  ActivityIndicator
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import apiClient from '../../services/api';

export default function UserManagementScreen({ navigation }) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [showUserDetails, setShowUserDetails] = useState(false);
  const [filterType, setFilterType] = useState('all'); // all, buyer, seller, admin

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setLoading(true);
      // TODO: Replace with actual API call when backend endpoint is available
      // const response = await apiClient.get('/admin/users');
      // setUsers(response.data);
      
      // Mock data for now
      const mockUsers = [
        {
          id: '1',
          email: 'admin@tlbdiamond.com',
          first_name: 'Admin',
          last_name: 'User',
          role: 'admin',
          created_at: '2024-11-01T10:00:00.000Z',
          is_verified: true,
          last_login: '2024-11-10T08:30:00.000Z',
          status: 'active',
          device_count: 1
        },
        {
          id: '2',
          email: 'john.doe@example.com',
          first_name: 'John',
          last_name: 'Doe',
          role: 'user',
          created_at: '2024-11-05T14:20:00.000Z',
          is_verified: true,
          last_login: '2024-11-09T16:45:00.000Z',
          status: 'active',
          device_count: 2
        },
        {
          id: '3',
          email: 'jane.seller@example.com',
          first_name: 'Jane',
          last_name: 'Smith',
          role: 'user',
          created_at: '2024-11-03T09:15:00.000Z',
          is_verified: false,
          last_login: '2024-11-08T12:20:00.000Z',
          status: 'pending',
          device_count: 0
        },
        {
          id: '4',
          email: 'mike.buyer@example.com',
          first_name: 'Mike',
          last_name: 'Johnson',
          role: 'user',
          created_at: '2024-11-07T16:30:00.000Z',
          is_verified: true,
          last_login: '2024-11-10T07:15:00.000Z',
          status: 'active',
          device_count: 1
        },
        {
          id: '5',
          email: 'sarah.inactive@example.com',
          first_name: 'Sarah',
          last_name: 'Wilson',
          role: 'user',
          created_at: '2024-10-20T11:45:00.000Z',
          is_verified: true,
          last_login: '2024-10-25T14:30:00.000Z',
          status: 'inactive',
          device_count: 0
        }
      ];
      setUsers(mockUsers);
    } catch (error) {
      console.error('Error loading users:', error);
      Alert.alert('Error', 'Failed to load users. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadUsers();
    setRefreshing(false);
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      `${user.first_name} ${user.last_name}`.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesFilter = 
      filterType === 'all' || 
      (filterType === 'admin' && user.role === 'admin') ||
      (filterType === 'user' && user.role === 'user') ||
      (filterType === 'verified' && user.is_verified) ||
      (filterType === 'pending' && !user.is_verified);
    
    return matchesSearch && matchesFilter;
  });

  const handleUserAction = (action, user) => {
    setSelectedUser(user);
    
    switch (action) {
      case 'view':
        setShowUserDetails(true);
        break;
      case 'verify':
        Alert.alert(
          'Verify User',
          `Are you sure you want to verify ${user.first_name} ${user.last_name}?`,
          [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Verify', onPress: () => verifyUser(user.id) }
          ]
        );
        break;
      case 'deactivate':
        Alert.alert(
          'Deactivate User',
          `Are you sure you want to deactivate ${user.first_name} ${user.last_name}?`,
          [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Deactivate', style: 'destructive', onPress: () => deactivateUser(user.id) }
          ]
        );
        break;
      case 'delete':
        Alert.alert(
          'Delete User',
          `Are you sure you want to permanently delete ${user.first_name} ${user.last_name}? This action cannot be undone.`,
          [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Delete', style: 'destructive', onPress: () => deleteUser(user.id) }
          ]
        );
        break;
    }
  };

  const verifyUser = async (userId) => {
    try {
      // TODO: API call to verify user
      setUsers(prev => prev.map(user => 
        user.id === userId ? { ...user, is_verified: true, status: 'active' } : user
      ));
      Alert.alert('Success', 'User has been verified successfully.');
    } catch (error) {
      Alert.alert('Error', 'Failed to verify user. Please try again.');
    }
  };

  const deactivateUser = async (userId) => {
    try {
      // TODO: API call to deactivate user
      setUsers(prev => prev.map(user => 
        user.id === userId ? { ...user, status: 'inactive' } : user
      ));
      Alert.alert('Success', 'User has been deactivated successfully.');
    } catch (error) {
      Alert.alert('Error', 'Failed to deactivate user. Please try again.');
    }
  };

  const deleteUser = async (userId) => {
    try {
      // TODO: API call to delete user
      setUsers(prev => prev.filter(user => user.id !== userId));
      Alert.alert('Success', 'User has been deleted successfully.');
    } catch (error) {
      Alert.alert('Error', 'Failed to delete user. Please try again.');
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  };

  const getStatusColor = (status, isVerified) => {
    if (!isVerified) return '#EF4444';
    switch (status) {
      case 'active': return '#10B981';
      case 'inactive': return '#6B7280';
      default: return '#F59E0B';
    }
  };

  const getStatusText = (status, isVerified) => {
    if (!isVerified) return 'Pending Verification';
    switch (status) {
      case 'active': return 'Active';
      case 'inactive': return 'Inactive';
      default: return 'Pending';
    }
  };

  const UserCard = ({ user }) => (
    <TouchableOpacity 
      style={styles.userCard}
      onPress={() => handleUserAction('view', user)}
      activeOpacity={0.8}
    >
      <View style={styles.userHeader}>
        <View style={styles.userInfo}>
          <Text style={styles.userName}>{user.first_name} {user.last_name}</Text>
          <Text style={styles.userEmail}>{user.email}</Text>
          <View style={styles.userMeta}>
            <View style={[styles.statusBadge, { backgroundColor: getStatusColor(user.status, user.is_verified) + '20' }]}>
              <Text style={[styles.statusText, { color: getStatusColor(user.status, user.is_verified) }]}>
                {getStatusText(user.status, user.is_verified)}
              </Text>
            </View>
            {user.role === 'admin' && (
              <View style={styles.adminBadge}>
                <Text style={styles.adminText}>ADMIN</Text>
              </View>
            )}
          </View>
        </View>
        
        <View style={styles.userActions}>
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => handleUserAction('view', user)}
          >
            <Ionicons name="eye" size={18} color="#D4AF37" />
          </TouchableOpacity>
          
          {!user.is_verified && (
            <TouchableOpacity 
              style={[styles.actionButton, styles.verifyButton]}
              onPress={() => handleUserAction('verify', user)}
            >
              <Ionicons name="checkmark-circle" size={18} color="#10B981" />
            </TouchableOpacity>
          )}
          
          {user.status === 'active' && user.role !== 'admin' && (
            <TouchableOpacity 
              style={[styles.actionButton, styles.deactivateButton]}
              onPress={() => handleUserAction('deactivate', user)}
            >
              <Ionicons name="pause-circle" size={18} color="#F59E0B" />
            </TouchableOpacity>
          )}
          
          {user.role !== 'admin' && (
            <TouchableOpacity 
              style={[styles.actionButton, styles.deleteButton]}
              onPress={() => handleUserAction('delete', user)}
            >
              <Ionicons name="trash" size={18} color="#EF4444" />
            </TouchableOpacity>
          )}
        </View>
      </View>
      
      <View style={styles.userFooter}>
        <View style={styles.userStat}>
          <Ionicons name="time" size={14} color="#9CA3AF" />
          <Text style={styles.statText}>Joined {new Date(user.created_at).toLocaleDateString()}</Text>
        </View>
        <View style={styles.userStat}>
          <Ionicons name="phone-portrait" size={14} color="#9CA3AF" />
          <Text style={styles.statText}>{user.device_count} device{user.device_count !== 1 ? 's' : ''}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  const FilterButton = ({ type, label, active }) => (
    <TouchableOpacity
      style={[styles.filterButton, active && styles.activeFilterButton]}
      onPress={() => setFilterType(type)}
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
        <Text style={styles.loadingText}>Loading users...</Text>
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
            placeholder="Search users by name or email..."
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
          <FilterButton type="all" label="All Users" active={filterType === 'all'} />
          <FilterButton type="admin" label="Admins" active={filterType === 'admin'} />
          <FilterButton type="user" label="Regular Users" active={filterType === 'user'} />
          <FilterButton type="verified" label="Verified" active={filterType === 'verified'} />
          <FilterButton type="pending" label="Pending" active={filterType === 'pending'} />
        </ScrollView>
      </View>

      {/* User List */}
      <FlatList
        data={filteredUsers}
        keyExtractor={item => item.id}
        renderItem={({ item }) => <UserCard user={item} />}
        style={styles.userList}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        ListEmptyComponent={() => (
          <View style={styles.emptyContainer}>
            <Ionicons name="people-outline" size={64} color="#6B7280" />
            <Text style={styles.emptyText}>No users found</Text>
            <Text style={styles.emptySubtext}>
              {searchQuery ? 'Try adjusting your search criteria' : 'Users will appear here once they register'}
            </Text>
          </View>
        )}
      />

      {/* User Details Modal */}
      <Modal
        visible={showUserDetails}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        {selectedUser && (
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>User Details</Text>
              <TouchableOpacity onPress={() => setShowUserDetails(false)}>
                <Ionicons name="close" size={24} color="#D4AF37" />
              </TouchableOpacity>
            </View>
            
            <ScrollView style={styles.modalContent}>
              <View style={styles.detailSection}>
                <Text style={styles.sectionTitle}>Personal Information</Text>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Name:</Text>
                  <Text style={styles.detailValue}>{selectedUser.first_name} {selectedUser.last_name}</Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Email:</Text>
                  <Text style={styles.detailValue}>{selectedUser.email}</Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Role:</Text>
                  <Text style={styles.detailValue}>{selectedUser.role}</Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Status:</Text>
                  <Text style={[styles.detailValue, { color: getStatusColor(selectedUser.status, selectedUser.is_verified) }]}>
                    {getStatusText(selectedUser.status, selectedUser.is_verified)}
                  </Text>
                </View>
              </View>
              
              <View style={styles.detailSection}>
                <Text style={styles.sectionTitle}>Account Information</Text>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Registered:</Text>
                  <Text style={styles.detailValue}>{formatDate(selectedUser.created_at)}</Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Last Login:</Text>
                  <Text style={styles.detailValue}>{formatDate(selectedUser.last_login)}</Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Devices:</Text>
                  <Text style={styles.detailValue}>{selectedUser.device_count} registered</Text>
                </View>
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
  userList: {
    flex: 1,
    padding: 16,
  },
  userCard: {
    backgroundColor: '#2d2d2d',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#3d3d3d',
  },
  userHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  userEmail: {
    color: '#9CA3AF',
    fontSize: 14,
    marginBottom: 8,
  },
  userMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 8,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  adminBadge: {
    backgroundColor: '#D4AF37',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  adminText: {
    color: '#1a1a1a',
    fontSize: 10,
    fontWeight: 'bold',
  },
  userActions: {
    flexDirection: 'row',
    alignItems: 'center',
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
  verifyButton: {
    backgroundColor: '#10B981' + '20',
  },
  deactivateButton: {
    backgroundColor: '#F59E0B' + '20',
  },
  deleteButton: {
    backgroundColor: '#EF4444' + '20',
  },
  userFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#3d3d3d',
  },
  userStat: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statText: {
    color: '#9CA3AF',
    fontSize: 12,
    marginLeft: 4,
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
});