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
  ActivityIndicator,
  Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import sharedDataService from '../services/sharedDataService';
import AdminAlert from '../components/admin/AdminAlert';
import { useAdminAlert } from '../hooks/useAdminAlert';

export default function AdminUserManagementScreen({ navigation }) {
  const { alertConfig, hideAlert, showSuccess, showError, showWarning } = useAdminAlert();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [showUserDetails, setShowUserDetails] = useState(false);
  const [showChatModal, setShowChatModal] = useState(false);
  const [chatUser, setChatUser] = useState(null);
  const [chatMessages, setChatMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setLoading(true);
      
      // Load actual users from the shared data service
      const registeredUsers = await sharedDataService.getRegisteredUsers();
      
      // If no users found, show helpful message
      if (registeredUsers.length === 0) {
        console.log('No registered users found in the system');
        setUsers([]);
        showWarning(
          'No Users Found',
          'No registered users found in the system. New users will appear here when they register.'
        );
      } else {
        setUsers(registeredUsers);
        console.log(`Loaded ${registeredUsers.length} registered users from database`);
        showSuccess(
          'Users Loaded',
          `Successfully loaded ${registeredUsers.length} registered user${registeredUsers.length > 1 ? 's' : ''}.`
        );
      }
    } catch (error) {
      console.error('Error loading users:', error);
      setUsers([]); // Set empty array if there's an error
      
      // Show more helpful error message with troubleshooting
      showError(
        'Failed to Load Users',
        'Unable to load user data from the system. This might be due to:\n\n• Database connectivity issues\n• Permission problems\n• Corrupted user registry\n\nPlease try refreshing or restart the app.'
      );
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

  const openChatModal = async (user) => {
    try {
      setChatUser(user);
      const userChat = await sharedDataService.getUserChat(user.email);
      const messages = userChat ? userChat.messages : [];
      setChatMessages(messages);
      setShowChatModal(true);
    } catch (error) {
      console.error('Error loading chat:', error);
      showError('Chat Error', 'Failed to load chat messages.');
    }
  };

  const sendChatMessage = async () => {
    if (!newMessage.trim() || !chatUser) return;

    try {
      const messageText = newMessage.trim();
      setNewMessage('');
      
      // Send message as admin
      await sharedDataService.createOrUpdateUserChat(chatUser.email, messageText, 'admin');
      
      // Refresh chat messages
      const userChat = await sharedDataService.getUserChat(chatUser.email);
      const messages = userChat ? userChat.messages : [];
      setChatMessages(messages);
    } catch (error) {
      console.error('Error sending message:', error);
      showError('Message Error', 'Failed to send message.');
    }
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
          onPress={() => openChatModal(item)}
        >
          <Ionicons name="chatbubble-ellipses" size={20} color="#8B5CF6" />
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

  // Show loading screen on initial load
  if (loading && users.length === 0) {
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
        
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#D4AF37" />
          <Text style={styles.loadingText}>Loading users...</Text>
          <Text style={styles.loadingSubtext}>Please wait while we fetch user data</Text>
        </View>

        {/* Admin Alert Component */}
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
                    style={[styles.modalActionButton, { backgroundColor: '#8B5CF6' }]}
                    onPress={() => {
                      setShowUserDetails(false);
                      openChatModal(selectedUser);
                    }}
                  >
                    <Text style={styles.modalActionButtonText}>Chat</Text>
                  </TouchableOpacity>
                  
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

      {/* Chat Modal */}
      <Modal
        visible={showChatModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowChatModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.chatModalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                Chat with {chatUser?.firstName} {chatUser?.lastName}
              </Text>
              <TouchableOpacity onPress={() => setShowChatModal(false)}>
                <Ionicons name="close" size={24} color="#8B4513" />
              </TouchableOpacity>
            </View>
            
            <ScrollView style={styles.chatMessages}>
              {chatMessages.length === 0 ? (
                <View style={styles.emptyChatContainer}>
                  <Ionicons name="chatbubble-ellipses-outline" size={48} color="#9CA3AF" />
                  <Text style={styles.emptyChatText}>No messages yet</Text>
                  <Text style={styles.emptyChatSubtext}>Start a conversation with this user</Text>
                </View>
              ) : (
                chatMessages.map((message, index) => (
                  <View 
                    key={index} 
                    style={[
                      styles.chatMessage,
                      message.sender === 'admin' ? styles.adminMessage : styles.userMessage
                    ]}
                  >
                    <View style={[
                      styles.messageBubble,
                      message.sender === 'admin' ? styles.adminBubble : styles.userBubble
                    ]}>
                      <Text style={styles.senderName}>
                        {message.sender === 'admin' ? 'Admin' : `${chatUser?.firstName}`}
                      </Text>
                      <Text style={[
                        styles.messageText,
                        message.sender === 'admin' ? styles.adminText : styles.userText
                      ]}>
                        {message.text}
                      </Text>
                      <Text style={styles.messageTime}>
                        {new Date(message.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                      </Text>
                    </View>
                  </View>
                ))
              )}
            </ScrollView>
            
            <View style={styles.chatInputContainer}>
              <TextInput
                style={styles.chatInput}
                value={newMessage}
                onChangeText={setNewMessage}
                placeholder="Type your message..."
                placeholderTextColor="#8B8B8B"
                multiline
                maxLength={500}
              />
              <TouchableOpacity 
                style={[styles.sendButton, newMessage.trim() ? styles.sendButtonActive : null]}
                onPress={sendChatMessage}
                disabled={!newMessage.trim()}
              >
                <Ionicons name="send" size={20} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Admin Alert Component */}
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 100,
  },
  loadingText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#D4AF37',
    marginTop: 16,
  },
  loadingSubtext: {
    fontSize: 12,
    color: '#8B4513',
    marginTop: 8,
  },
  chatModalContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 0,
    width: '90%',
    height: '80%',
    maxHeight: 600,
  },
  chatMessages: {
    flex: 1,
    padding: 16,
  },
  emptyChatContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyChatText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6B7280',
    marginTop: 12,
  },
  emptyChatSubtext: {
    fontSize: 14,
    color: '#9CA3AF',
    marginTop: 4,
  },
  chatMessage: {
    marginBottom: 16,
  },
  adminMessage: {
    alignItems: 'flex-end',
  },
  userMessage: {
    alignItems: 'flex-start',
  },
  messageBubble: {
    maxWidth: '80%',
    borderRadius: 16,
    padding: 12,
  },
  adminBubble: {
    backgroundColor: '#D4AF37',
    borderBottomRightRadius: 4,
  },
  userBubble: {
    backgroundColor: '#F3F4F6',
    borderBottomLeftRadius: 4,
  },
  senderName: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 4,
  },
  messageText: {
    fontSize: 14,
    lineHeight: 18,
  },
  adminText: {
    color: '#FFFFFF',
  },
  userText: {
    color: '#374151',
  },
  messageTime: {
    fontSize: 10,
    marginTop: 4,
    opacity: 0.7,
  },
  chatInputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    backgroundColor: '#F9FAFB',
  },
  chatInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    fontSize: 14,
    color: '#374151',
    backgroundColor: '#FFFFFF',
    maxHeight: 80,
  },
  sendButton: {
    backgroundColor: '#9CA3AF',
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  sendButtonActive: {
    backgroundColor: '#D4AF37',
  },
});