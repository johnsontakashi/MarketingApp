import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  RefreshControl,
  Alert,
  Modal,
  KeyboardAvoidingView,
  Platform,
  Dimensions,
  BackHandler
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import sharedDataService from '../../services/sharedDataService';

const { width, height } = Dimensions.get('window');

export default function ChatManagementScreen({ navigation }) {
  const [chats, setChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [replyText, setReplyText] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showChatModal, setShowChatModal] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const flatListRef = useRef(null);

  useEffect(() => {
    loadChats();
    // Auto-refresh every 10 seconds
    const interval = setInterval(loadChats, 10000);
    return () => clearInterval(interval);
  }, []);

  // Handle Android hardware back button
  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => {
        if (showChatModal) {
          // Close chat modal if open
          closeModal();
          return true;
        }
        // Allow default back behavior for main screen
        return false;
      };

      const subscription = BackHandler.addEventListener('hardwareBackPress', onBackPress);
      return () => subscription.remove();
    }, [showChatModal])
  );

  const loadChats = async () => {
    try {
      const chatData = await sharedDataService.getChats();
      const sortedChats = chatData.sort((a, b) => 
        new Date(b.lastMessageTime) - new Date(a.lastMessageTime)
      );
      setChats(sortedChats);
      
      // Count unread messages
      const unread = sortedChats.filter(chat => chat.hasUnreadMessages).length;
      setUnreadCount(unread);
    } catch (error) {
      console.error('Error loading chats:', error);
      Alert.alert('Error', 'Failed to load chats');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  const onRefresh = () => {
    setIsRefreshing(true);
    loadChats();
  };

  const openChat = (chat) => {
    setSelectedChat(chat);
    setShowChatModal(true);
    // Mark as read
    markChatAsRead(chat.userEmail);
  };

  const closeModal = () => {
    setShowChatModal(false);
    setSelectedChat(null);
    setReplyText('');
    // Refresh chats when closing modal to update any changes
    loadChats();
  };

  const markChatAsRead = async (userEmail) => {
    try {
      await sharedDataService.markChatAsRead(userEmail);
      // Refresh chats to update unread status
      loadChats();
    } catch (error) {
      console.error('Error marking chat as read:', error);
    }
  };

  const sendReply = async () => {
    if (!replyText.trim() || !selectedChat) return;

    try {
      const message = replyText.trim();
      setReplyText('');
      
      // Send admin reply
      await sharedDataService.createOrUpdateUserChat(selectedChat.userEmail, message, 'admin');
      
      // Refresh the selected chat
      const updatedChat = await sharedDataService.getUserChat(selectedChat.userEmail);
      setSelectedChat(updatedChat);
      
      // Refresh all chats
      loadChats();
      
      // Auto-scroll to bottom
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
      
    } catch (error) {
      console.error('Error sending reply:', error);
      Alert.alert('Error', 'Failed to send reply');
    }
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMinutes = Math.floor((now - date) / (1000 * 60));
    
    if (diffMinutes < 1) return 'Just now';
    if (diffMinutes < 60) return `${diffMinutes}m ago`;
    if (diffMinutes < 1440) return `${Math.floor(diffMinutes / 60)}h ago`;
    return date.toLocaleDateString();
  };

  const renderChatItem = ({ item }) => (
    <TouchableOpacity style={styles.chatItem} onPress={() => openChat(item)}>
      <View style={styles.chatHeader}>
        <View style={styles.userInfo}>
          <View style={styles.avatarContainer}>
            <Text style={styles.avatarText}>
              {item.userName.split(' ').map(n => n[0]).join('').toUpperCase()}
            </Text>
          </View>
          <View style={styles.chatContent}>
            <Text style={styles.userName}>{item.userName}</Text>
            <Text style={styles.userEmail}>{item.userEmail}</Text>
            <Text style={styles.lastMessage} numberOfLines={2}>
              {item.lastMessage}
            </Text>
          </View>
        </View>
        <View style={styles.chatMeta}>
          <Text style={styles.chatTime}>{formatTime(item.lastMessageTime)}</Text>
          {item.hasUnreadMessages && (
            <View style={styles.unreadBadge}>
              <Text style={styles.unreadText}>NEW</Text>
            </View>
          )}
          <Text style={styles.messageCount}>
            {item.messages.length} messages
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderMessage = ({ item }) => {
    const isAdmin = item.sender === 'admin';
    const formattedTime = new Date(item.timestamp).toLocaleTimeString([], {
      hour: '2-digit', 
      minute: '2-digit'
    });
    
    return (
      <View style={[styles.messageContainer, isAdmin ? styles.adminMessage : styles.userMessage]}>
        <View style={[styles.messageBubble, isAdmin ? styles.adminBubble : styles.userBubble]}>
          <Text style={[styles.messageText, isAdmin ? styles.adminText : styles.userText]}>
            {item.text}
          </Text>
          <Text style={[styles.messageTime, isAdmin ? styles.adminTime : styles.userTime]}>
            {formattedTime}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.headerBackButton} 
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#D4AF37" />
          <Text style={styles.headerBackText}>Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Chat Management</Text>
        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.refreshButton} onPress={onRefresh}>
            <Ionicons name="refresh" size={20} color="#D4AF37" />
          </TouchableOpacity>
          {unreadCount > 0 && (
            <View style={styles.unreadCountBadge}>
              <Text style={styles.unreadCountText}>{unreadCount}</Text>
            </View>
          )}
        </View>
      </View>

      {/* Chat List */}
      {chats.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="chatbubbles-outline" size={64} color="#666" />
          <Text style={styles.emptyTitle}>No Chats Yet</Text>
          <Text style={styles.emptyMessage}>
            User messages will appear here when they contact support
          </Text>
        </View>
      ) : (
        <FlatList
          data={chats}
          renderItem={renderChatItem}
          keyExtractor={item => item.id}
          style={styles.chatList}
          refreshControl={
            <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />
          }
        />
      )}

      {/* Chat Modal */}
      <Modal
        visible={showChatModal}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={closeModal}
      >
        <KeyboardAvoidingView 
          style={styles.modalContainer}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          {/* Modal Header */}
          <View style={styles.modalHeader}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={closeModal}
            >
              <Ionicons name="arrow-back" size={24} color="#D4AF37" />
              <Text style={styles.backText}>Back</Text>
            </TouchableOpacity>
            {selectedChat && (
              <View style={styles.modalHeaderInfo}>
                <Text style={styles.modalTitle}>{selectedChat.userName}</Text>
                <Text style={styles.modalSubtitle}>{selectedChat.userEmail}</Text>
              </View>
            )}
          </View>

          {/* Messages */}
          {selectedChat && (
            <>
              <FlatList
                ref={flatListRef}
                data={selectedChat.messages}
                renderItem={renderMessage}
                keyExtractor={item => item.id}
                style={styles.messagesList}
                contentContainerStyle={styles.messagesContent}
              />

              {/* Reply Input */}
              <View style={styles.replyContainer}>
                <View style={styles.inputWrapper}>
                  <TextInput
                    style={styles.replyInput}
                    value={replyText}
                    onChangeText={setReplyText}
                    placeholder="Type your reply..."
                    placeholderTextColor="#999"
                    multiline
                    maxLength={500}
                  />
                  <TouchableOpacity
                    style={[
                      styles.sendButton,
                      replyText.trim() ? styles.sendButtonActive : null
                    ]}
                    onPress={sendReply}
                    disabled={!replyText.trim()}
                  >
                    <Ionicons name="send" size={20} color="#FFFFFF" />
                  </TouchableOpacity>
                </View>
              </View>
            </>
          )}
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a1a',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#3d3d3d',
  },
  headerBackButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    borderRadius: 8,
    backgroundColor: 'rgba(212, 175, 55, 0.1)',
    marginRight: 16,
  },
  headerBackText: {
    color: '#D4AF37',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  title: {
    flex: 1,
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    marginRight: 16,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  refreshButton: {
    padding: 8,
    borderRadius: 6,
    backgroundColor: 'rgba(212, 175, 55, 0.1)',
  },
  unreadCountBadge: {
    backgroundColor: '#FF4444',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginLeft: 8,
  },
  unreadCountText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  chatList: {
    flex: 1,
  },
  chatItem: {
    backgroundColor: '#2a2a2a',
    marginHorizontal: 16,
    marginVertical: 4,
    borderRadius: 12,
    padding: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#D4AF37',
  },
  chatHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  userInfo: {
    flexDirection: 'row',
    flex: 1,
  },
  avatarContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#D4AF37',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarText: {
    color: '#1a1a1a',
    fontSize: 18,
    fontWeight: 'bold',
  },
  chatContent: {
    flex: 1,
  },
  userName: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  userEmail: {
    color: '#999',
    fontSize: 14,
    marginBottom: 4,
  },
  lastMessage: {
    color: '#CCC',
    fontSize: 14,
    lineHeight: 20,
  },
  chatMeta: {
    alignItems: 'flex-end',
  },
  chatTime: {
    color: '#999',
    fontSize: 12,
    marginBottom: 4,
  },
  unreadBadge: {
    backgroundColor: '#FF4444',
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 2,
    marginBottom: 4,
  },
  unreadText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: 'bold',
  },
  messageCount: {
    color: '#666',
    fontSize: 12,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyMessage: {
    fontSize: 16,
    color: '#999',
    textAlign: 'center',
    lineHeight: 24,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#1a1a1a',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#3d3d3d',
    paddingTop: 50,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  backText: {
    color: '#D4AF37',
    fontSize: 16,
    marginLeft: 8,
  },
  modalHeaderInfo: {
    flex: 1,
  },
  modalTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  modalSubtitle: {
    color: '#999',
    fontSize: 14,
    marginTop: 2,
  },
  messagesList: {
    flex: 1,
    paddingHorizontal: 16,
  },
  messagesContent: {
    paddingTop: 16,
    paddingBottom: 8,
  },
  messageContainer: {
    marginBottom: 12,
  },
  userMessage: {
    alignItems: 'flex-start',
  },
  adminMessage: {
    alignItems: 'flex-end',
  },
  messageBubble: {
    maxWidth: width * 0.75,
    borderRadius: 16,
    padding: 12,
  },
  userBubble: {
    backgroundColor: '#3B82F6',
    borderBottomLeftRadius: 4,
  },
  adminBubble: {
    backgroundColor: '#D4AF37',
    borderBottomRightRadius: 4,
  },
  messageText: {
    fontSize: 16,
    lineHeight: 20,
  },
  userText: {
    color: '#FFFFFF',
  },
  adminText: {
    color: '#1a1a1a',
  },
  messageTime: {
    fontSize: 11,
    marginTop: 6,
  },
  userTime: {
    color: 'rgba(255, 255, 255, 0.7)',
  },
  adminTime: {
    color: 'rgba(26, 26, 26, 0.7)',
    textAlign: 'right',
  },
  replyContainer: {
    backgroundColor: '#2a2a2a',
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 16,
    borderTopWidth: 1,
    borderTopColor: '#3d3d3d',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    backgroundColor: '#3d3d3d',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  replyInput: {
    flex: 1,
    fontSize: 16,
    color: '#FFFFFF',
    maxHeight: 100,
    paddingVertical: 8,
  },
  sendButton: {
    backgroundColor: '#666',
    borderRadius: 16,
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  sendButtonActive: {
    backgroundColor: '#D4AF37',
  },
});