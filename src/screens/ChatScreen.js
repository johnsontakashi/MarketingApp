import React, { useState, useRef, useEffect } from 'react';
import { 
  View, 
  Text, 
  TextInput,
  TouchableOpacity, 
  FlatList,
  StyleSheet, 
  KeyboardAvoidingView,
  Platform,
  Alert,
  Dimensions
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as SecureStore from 'expo-secure-store';

const { width } = Dimensions.get('window');

const CHAT_STORAGE_KEY = 'TLBDiamondChatHistory';

export default function ChatScreen({ navigation }) {
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const flatListRef = useRef(null);

  const defaultWelcomeMessage = {
    id: '1',
    text: 'Hello! I\'m Sarah from TLB Diamond Support. I\'m here to help you with any questions about your locked device or payment issues. How can I assist you today?',
    sender: 'support',
    timestamp: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}),
    avatar: '👩‍💼'
  };

  const supportResponses = [
    "I understand your concern. Let me help you with that payment issue.",
    "For device unlock, you'll need to complete your remaining payments. Would you like me to show you the payment options?",
    "Your device is currently in kiosk mode due to the Support Bonus agreement. I can help you understand the unlock process.",
    "Let me check your account details. Can you please confirm your order number?",
    "I see that you have 2 payments remaining. The next payment of 💎 25.00 TLB is due on Nov 12, 2024.",
    "Would you like me to help you make a payment now? I can guide you through the process.",
    "For emergency situations, we do have an emergency unlock option. This requires verification. Is this a genuine emergency?",
    "I'm here to help 24/7. What specific issue are you experiencing with your device?",
    "Thank you for contacting support. I'll do my best to resolve your issue quickly."
  ];

  // Load chat history from storage
  const loadChatHistory = async () => {
    try {
      const storedMessages = await SecureStore.getItemAsync(CHAT_STORAGE_KEY);
      if (storedMessages && storedMessages.trim() !== '') {
        const parsedMessages = JSON.parse(storedMessages);
        // Validate that we have an array with valid message structure
        if (Array.isArray(parsedMessages) && parsedMessages.length > 0) {
          setMessages(parsedMessages);
        } else {
          setMessages([defaultWelcomeMessage]);
        }
      } else {
        // If no chat history, start with welcome message
        setMessages([defaultWelcomeMessage]);
      }
    } catch (error) {
      console.error('Error loading chat history:', error);
      // Fallback to welcome message if loading fails
      setMessages([defaultWelcomeMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  // Save chat history to storage
  const saveChatHistory = async (newMessages) => {
    try {
      // Only save if we have valid messages
      if (Array.isArray(newMessages) && newMessages.length > 0) {
        await SecureStore.setItemAsync(CHAT_STORAGE_KEY, JSON.stringify(newMessages));
      }
    } catch (error) {
      console.error('Error saving chat history:', error);
      // Don't show error to user, just log it
    }
  };

  // Clear chat history (for testing or reset)
  const clearChatHistory = async () => {
    try {
      await SecureStore.deleteItemAsync(CHAT_STORAGE_KEY);
      setMessages([defaultWelcomeMessage]);
      saveChatHistory([defaultWelcomeMessage]);
    } catch (error) {
      console.error('Error clearing chat history:', error);
    }
  };

  // Load chat history on component mount
  useEffect(() => {
    loadChatHistory();
  }, []);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (messages.length > 0 && !isLoading) {
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [messages, isLoading]);

  const sendMessage = () => {
    if (inputText.trim() === '') return;

    const newMessage = {
      id: Date.now().toString(),
      text: inputText.trim(),
      sender: 'user',
      timestamp: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}),
    };

    const updatedMessages = [...messages, newMessage];
    setMessages(updatedMessages);
    saveChatHistory(updatedMessages);
    setInputText('');
    
    // Simulate support response
    setIsTyping(true);
    setTimeout(() => {
      const randomResponse = supportResponses[Math.floor(Math.random() * supportResponses.length)];
      const supportMessage = {
        id: (Date.now() + 1).toString(),
        text: randomResponse,
        sender: 'support',
        timestamp: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}),
        avatar: '👩‍💼'
      };
      const finalMessages = [...updatedMessages, supportMessage];
      setMessages(finalMessages);
      saveChatHistory(finalMessages);
      setIsTyping(false);
    }, 1500 + Math.random() * 1000);
  };

  const renderMessage = ({ item }) => {
    const isUser = item.sender === 'user';
    
    return (
      <View style={[styles.messageContainer, isUser ? styles.userMessage : styles.supportMessage]}>
        {!isUser && (
          <View style={styles.avatarContainer}>
            <Text style={styles.avatar}>{item.avatar}</Text>
          </View>
        )}
        <View style={[styles.messageBubble, isUser ? styles.userBubble : styles.supportBubble]}>
          {!isUser && <Text style={styles.senderName}>Sarah - Support</Text>}
          <Text style={[styles.messageText, isUser ? styles.userText : styles.supportText]}>
            {item.text}
          </Text>
          <Text style={[styles.timestamp, isUser ? styles.userTimestamp : styles.supportTimestamp]}>
            {item.timestamp}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
          <Text style={styles.backText}>Return</Text>
        </TouchableOpacity>
        <View style={styles.headerInfo}>
          <Text style={styles.headerTitle}>Live Support Chat</Text>
          <Text style={styles.headerSubtitle}>TLB Diamond Support Team</Text>
        </View>
        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.clearButton} onPress={clearChatHistory}>
            <Ionicons name="refresh" size={18} color="#FFFFFF" />
          </TouchableOpacity>
          <View style={styles.statusIndicator}>
            <View style={styles.onlineIndicator} />
            <Text style={styles.onlineText}>Online</Text>
          </View>
        </View>
      </View>

      {/* Messages */}
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading chat history...</Text>
        </View>
      ) : (
        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={(item) => item.id}
          renderItem={renderMessage}
          style={styles.messagesList}
          contentContainerStyle={styles.messagesContent}
          showsVerticalScrollIndicator={false}
        />
      )}

      {/* Typing Indicator */}
      {isTyping && (
        <View style={styles.typingContainer}>
          <View style={styles.typingBubble}>
            <Text style={styles.typingText}>Sarah is typing</Text>
            <View style={styles.typingDots}>
              <View style={[styles.dot, styles.dot1]} />
              <View style={[styles.dot, styles.dot2]} />
              <View style={[styles.dot, styles.dot3]} />
            </View>
          </View>
        </View>
      )}

      {/* Input */}
      <View style={styles.inputContainer}>
        <View style={styles.inputWrapper}>
          <TextInput
            style={styles.textInput}
            value={inputText}
            onChangeText={setInputText}
            placeholder="Type your message..."
            placeholderTextColor="#8B8B8B"
            multiline
            maxLength={500}
          />
          <TouchableOpacity 
            style={[styles.sendButton, inputText.trim() ? styles.sendButtonActive : null]} 
            onPress={sendMessage}
            disabled={!inputText.trim()}
          >
            <Ionicons name="send" size={20} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
        <View style={styles.bottomActions}>
          <TouchableOpacity style={styles.returnButton} onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={16} color="#3B82F6" />
            <Text style={styles.returnButtonText}>Return to Lock Screen</Text>
          </TouchableOpacity>
          <Text style={styles.helperText}>
            💎 Emergency: 1-800-TLB-HELP
          </Text>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  header: {
    backgroundColor: '#3B82F6',
    paddingTop: 50,
    paddingBottom: 16,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 12,
    padding: 8,
    borderRadius: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  backText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 6,
  },
  headerInfo: {
    flex: 1,
  },
  headerTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  headerSubtitle: {
    color: '#E5E7EB',
    fontSize: 14,
    marginTop: 2,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  clearButton: {
    padding: 8,
    marginRight: 12,
    borderRadius: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  statusIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  onlineIndicator: {
    width: 8,
    height: 8,
    backgroundColor: '#10B981',
    borderRadius: 4,
    marginRight: 6,
  },
  onlineText: {
    color: '#E5E7EB',
    fontSize: 12,
    fontWeight: '500',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  loadingText: {
    fontSize: 16,
    color: '#6B7280',
    fontStyle: 'italic',
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
    flexDirection: 'row',
    marginBottom: 16,
  },
  userMessage: {
    justifyContent: 'flex-end',
  },
  supportMessage: {
    justifyContent: 'flex-start',
  },
  avatarContainer: {
    marginRight: 8,
  },
  avatar: {
    fontSize: 32,
    width: 40,
    height: 40,
    textAlign: 'center',
    textAlignVertical: 'center',
    backgroundColor: '#E5E7EB',
    borderRadius: 20,
    lineHeight: 40,
  },
  messageBubble: {
    maxWidth: width * 0.75,
    borderRadius: 16,
    padding: 12,
  },
  userBubble: {
    backgroundColor: '#3B82F6',
    borderBottomRightRadius: 4,
  },
  supportBubble: {
    backgroundColor: '#FFFFFF',
    borderBottomLeftRadius: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  senderName: {
    fontSize: 12,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 4,
  },
  messageText: {
    fontSize: 16,
    lineHeight: 20,
  },
  userText: {
    color: '#FFFFFF',
  },
  supportText: {
    color: '#374151',
  },
  timestamp: {
    fontSize: 11,
    marginTop: 6,
  },
  userTimestamp: {
    color: '#E5E7EB',
    textAlign: 'right',
  },
  supportTimestamp: {
    color: '#9CA3AF',
  },
  typingContainer: {
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  typingBubble: {
    backgroundColor: '#E5E7EB',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    maxWidth: width * 0.6,
  },
  typingText: {
    fontSize: 14,
    color: '#6B7280',
    fontStyle: 'italic',
    marginRight: 8,
  },
  typingDots: {
    flexDirection: 'row',
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#9CA3AF',
    marginHorizontal: 1,
  },
  inputContainer: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 16,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    backgroundColor: '#F3F4F6',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginBottom: 8,
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    color: '#374151',
    maxHeight: 100,
    paddingVertical: 8,
  },
  sendButton: {
    backgroundColor: '#9CA3AF',
    borderRadius: 16,
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  sendButtonActive: {
    backgroundColor: '#3B82F6',
  },
  bottomActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  returnButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#3B82F6',
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
  },
  returnButtonText: {
    fontSize: 14,
    color: '#3B82F6',
    fontWeight: '600',
    marginLeft: 6,
  },
  helperText: {
    fontSize: 12,
    color: '#6B7280',
    flex: 1,
    textAlign: 'right',
  },
});