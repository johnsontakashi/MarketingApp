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
  ScrollView
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as SecureStore from 'expo-secure-store';

export default function AdminUserManagementScreen({ navigation }) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [showUserDetails, setShowUserDetails] = useState(false);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const allKeys = await SecureStore.getValueAsync();
      // This is a simplified version - in a real app, you'd have a better way to get all users
      // For now, we'll show a placeholder message
      setUsers([
        {
          id: '1',
          email: 'john.doe@example.com',
          firstName: 'John',
          lastName: 'Doe',
          userType: 'buyer',
          registeredAt: new Date().toISOString(),
          isVerified: true
        },
        {
          id: '2',
          email: 'jane.seller@example.com',
          firstName: 'Jane',
          lastName: 'Smith',
          userType: 'seller',
          registeredAt: new Date().toISOString(),
          isVerified: true
        }
      ]);
    } catch (error) {
      console.error('Error loading users:', error);
      Alert.alert('Error', 'Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = users.filter(user =>
    user.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleUserAction = (user, action) => {
    Alert.alert(
      'Confirm Action',
      `Are you sure you want to ${action} this user?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Confirm', 
          onPress: () => {
            Alert.alert('Success', `User ${action} successfully!`);
            // In a real app, this would update the user in the database
          }
        }
      ]
    );
  };

  const changeUserRole = (user, newRole) => {
    Alert.alert(
      'Change User Role',
      `Change ${user.firstName} ${user.lastName} from ${user.userType} to ${newRole}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Confirm', 
          onPress: () => {
            Alert.alert('Success', `User role changed to ${newRole}!`);
            // In a real app, this would update the user role
          }
        }
      ]
    );
  };

  const renderUserItem = ({ item }) => (
    <View style={styles.userCard}>
      <View style={styles.userInfo}>
        <View style={styles.userHeader}>
          <Text style={styles.userName}>{item.firstName} {item.lastName}</Text>
          <View style={[styles.roleBadge, { backgroundColor: getRoleColor(item.userType) }]}>
            <Text style={styles.roleBadgeText}>{item.userType.toUpperCase()}</Text>
          </View>
        </View>
        <Text style={styles.userEmail}>{item.email}</Text>
        <Text style={styles.userDate}>
          Registered: {new Date(item.registeredAt).toLocaleDateString()}
        </Text>
      </View>
      
      <View style={styles.userActions}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => {
            setSelectedUser(item);
            setShowUserDetails(true);
          }}
        >
          <Ionicons name="eye" size={20} color="#3B82F6" />
        </TouchableOpacity>
        
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => {
            const newRole = item.userType === 'buyer' ? 'seller' : 'buyer';
            changeUserRole(item, newRole);
          }}
        >
          <Ionicons name="swap-horizontal" size={20} color="#10B981" />
        </TouchableOpacity>
        
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => handleUserAction(item, 'suspend')}
        >
          <Ionicons name="ban" size={20} color="#F59E0B" />
        </TouchableOpacity>
      </View>
    </View>
  );

  const getRoleColor = (role) => {
    switch (role) {
      case 'admin': return '#EF4444';
      case 'seller': return '#10B981';
      case 'buyer': return '#3B82F6';
      default: return '#6B7280';
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>User Management</Text>
        <TouchableOpacity style={styles.refreshButton} onPress={loadUsers}>
          <Ionicons name="refresh" size={24} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#8B4513" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search users by name or email..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholderTextColor="#8B8B8B"
        />
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{users.length}</Text>
          <Text style={styles.statLabel}>Total Users</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{users.filter(u => u.userType === 'buyer').length}</Text>
          <Text style={styles.statLabel}>Buyers</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{users.filter(u => u.userType === 'seller').length}</Text>
          <Text style={styles.statLabel}>Sellers</Text>
        </View>
      </View>

      <FlatList
        data={filteredUsers}
        renderItem={renderUserItem}
        keyExtractor={(item) => item.id}
        style={styles.usersList}
        contentContainerStyle={styles.usersListContent}
        showsVerticalScrollIndicator={false}
        refreshing={loading}
        onRefresh={loadUsers}
      />

      {/* User Details Modal */}
      <Modal
        visible={showUserDetails}
        transparent
        animationType="slide"
        onRequestClose={() => setShowUserDetails(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            {selectedUser && (
              <>
                <View style={styles.modalHeader}>
                  <Text style={styles.modalTitle}>User Details</Text>
                  <TouchableOpacity onPress={() => setShowUserDetails(false)}>
                    <Ionicons name="close" size={24} color="#8B4513" />
                  </TouchableOpacity>
                </View>
                
                <ScrollView style={styles.modalContent}>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Name:</Text>
                    <Text style={styles.detailValue}>
                      {selectedUser.firstName} {selectedUser.lastName}
                    </Text>
                  </View>
                  
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Email:</Text>
                    <Text style={styles.detailValue}>{selectedUser.email}</Text>
                  </View>
                  
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Role:</Text>
                    <View style={[styles.roleBadge, { backgroundColor: getRoleColor(selectedUser.userType) }]}>
                      <Text style={styles.roleBadgeText}>{selectedUser.userType.toUpperCase()}</Text>
                    </View>
                  </View>
                  
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Phone:</Text>
                    <Text style={styles.detailValue}>{selectedUser.phoneNumber || 'Not provided'}</Text>
                  </View>
                  
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Registered:</Text>
                    <Text style={styles.detailValue}>
                      {new Date(selectedUser.registeredAt).toLocaleDateString()}
                    </Text>
                  </View>
                  
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Status:</Text>
                    <Text style={[styles.detailValue, { color: selectedUser.isVerified ? '#10B981' : '#EF4444' }]}>
                      {selectedUser.isVerified ? 'Verified' : 'Pending'}
                    </Text>
                  </View>
                </ScrollView>
                
                <View style={styles.modalActions}>
                  <TouchableOpacity
                    style={[styles.modalActionButton, { backgroundColor: '#10B981' }]}
                    onPress={() => {
                      const newRole = selectedUser.userType === 'buyer' ? 'seller' : 'buyer';
                      changeUserRole(selectedUser, newRole);
                      setShowUserDetails(false);
                    }}
                  >
                    <Text style={styles.modalActionButtonText}>Change Role</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity
                    style={[styles.modalActionButton, { backgroundColor: '#EF4444' }]}
                    onPress={() => {
                      handleUserAction(selectedUser, 'suspend');
                      setShowUserDetails(false);
                    }}
                  >
                    <Text style={styles.modalActionButtonText}>Suspend User</Text>
                  </TouchableOpacity>
                </View>
              </>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF8E7',
  },
  header: {
    backgroundColor: '#D4AF37',
    paddingTop: 50,
    paddingBottom: 16,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  refreshButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginTop: 16,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 14,
    fontSize: 16,
    color: '#2C1810',
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginTop: 16,
    marginBottom: 16,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    padding: 16,
    marginHorizontal: 4,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#D4AF37',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#8B4513',
    fontWeight: '600',
  },
  usersList: {
    flex: 1,
    paddingHorizontal: 16,
  },
  usersListContent: {
    paddingBottom: 20,
  },
  userCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  userInfo: {
    flex: 1,
  },
  userHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  userName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2C1810',
    flex: 1,
  },
  roleBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  roleBadgeText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  userEmail: {
    fontSize: 14,
    color: '#8B4513',
    marginBottom: 4,
  },
  userDate: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  userActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionButton: {
    padding: 8,
    marginLeft: 8,
    borderRadius: 6,
    backgroundColor: '#F3F4F6',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 0,
    width: '90%',
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2C1810',
  },
  modalContent: {
    padding: 20,
    maxHeight: 300,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  detailLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#8B4513',
    width: 80,
  },
  detailValue: {
    fontSize: 14,
    color: '#2C1810',
    flex: 1,
  },
  modalActions: {
    flexDirection: 'row',
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  modalActionButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 4,
  },
  modalActionButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
});