import React, { useState } from 'react';
import { 
  View, 
  Text, 
  ScrollView, 
  TouchableOpacity, 
  StyleSheet,
  Dimensions,
  Alert,
  Modal,
  TextInput
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import CustomAlert from '../components/ui/CustomAlert';
import { useCustomAlert } from '../hooks/useCustomAlert';

const { width } = Dimensions.get('window');

export default function WalletScreen({ navigation }) {
  const { alertConfig, showAlert, hideAlert, showSuccess, showError, showWarning, showInfo, showConfirm } = useCustomAlert();
  
  const [balanceVisible, setBalanceVisible] = useState(true);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [showSendModal, setShowSendModal] = useState(false);
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [showTopUpModal, setShowTopUpModal] = useState(false);
  const [showTransactionDetailsModal, setShowTransactionDetailsModal] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  
  // Send form state
  const [sendForm, setSendForm] = useState({
    recipient: '',
    amount: '',
    message: ''
  });
  
  // Request form state
  const [requestForm, setRequestForm] = useState({
    requester: '',
    amount: '',
    message: ''
  });
  const [walletData] = useState({
    available: 1200.00,
    locked: 50.00,
    pending: 0.00,
    lifetimeEarned: 5000.00,
    lifetimeSpent: 3750.00,
    monthlyEarned: 150.00,
    monthlySpent: 300.00,
    monthlyBonuses: 75.00
  });

  const [allTransactions] = useState([
    {
      id: 1,
      type: 'received',
      amount: 5.00,
      title: 'Referral Bonus',
      subtitle: 'From: Sarah M.',
      time: 'Today',
      date: '2024-12-05',
      icon: 'people',
      color: '#10B981',
      status: 'completed',
      transactionId: 'TXN-001234'
    },
    {
      id: 2,
      type: 'sent',
      amount: 25.00,
      title: 'Order Payment',
      subtitle: 'Installment #2',
      time: 'Yesterday',
      date: '2024-12-04',
      icon: 'card',
      color: '#EF4444',
      status: 'completed',
      transactionId: 'TXN-001235'
    },
    {
      id: 3,
      type: 'received',
      amount: 50.00,
      title: 'Birthday Bonus',
      subtitle: 'Special reward',
      time: '2 days ago',
      date: '2024-12-03',
      icon: 'gift',
      color: '#10B981',
      status: 'completed',
      transactionId: 'TXN-001236'
    },
    {
      id: 4,
      type: 'sent',
      amount: 200.00,
      title: 'Product Purchase',
      subtitle: 'Wireless Headphones',
      time: '3 days ago',
      date: '2024-12-02',
      icon: 'storefront',
      color: '#EF4444',
      status: 'completed',
      transactionId: 'TXN-001237'
    },
    {
      id: 5,
      type: 'received',
      amount: 25.00,
      title: 'Daily Login Bonus',
      subtitle: 'Streak: 7 days',
      time: '4 days ago',
      date: '2024-12-01',
      icon: 'calendar',
      color: '#10B981',
      status: 'completed',
      transactionId: 'TXN-001238'
    },
    {
      id: 6,
      type: 'sent',
      amount: 75.00,
      title: 'Gaming Mouse Pro',
      subtitle: 'Installment #1',
      time: '5 days ago',
      date: '2024-11-30',
      icon: 'storefront',
      color: '#EF4444',
      status: 'completed',
      transactionId: 'TXN-001239'
    },
    {
      id: 7,
      type: 'received',
      amount: 10.00,
      title: 'Weekly Bonus',
      subtitle: 'Community reward',
      time: '1 week ago',
      date: '2024-11-28',
      icon: 'gift',
      color: '#10B981',
      status: 'completed',
      transactionId: 'TXN-001240'
    },
    {
      id: 8,
      type: 'sent',
      amount: 150.00,
      title: 'Smart Fitness Watch',
      subtitle: 'Full payment',
      time: '1 week ago',
      date: '2024-11-27',
      icon: 'card',
      color: '#EF4444',
      status: 'completed',
      transactionId: 'TXN-001241'
    },
    {
      id: 9,
      type: 'received',
      amount: 30.00,
      title: 'Support Bonus',
      subtitle: 'Payment assistance',
      time: '2 weeks ago',
      date: '2024-11-20',
      icon: 'shield-checkmark',
      color: '#10B981',
      status: 'completed',
      transactionId: 'TXN-001242'
    },
    {
      id: 10,
      type: 'sent',
      amount: 85.00,
      title: 'Bluetooth Speaker',
      subtitle: 'Installment #2',
      time: '2 weeks ago',
      date: '2024-11-19',
      icon: 'storefront',
      color: '#EF4444',
      status: 'completed',
      transactionId: 'TXN-001243'
    }
  ]);

  const transactions = allTransactions.slice(0, 4); // Show only first 4 in recent

  const quickActions = [
    { icon: 'send', label: 'Send', color: '#D4AF37' },
    { icon: 'download', label: 'Request', color: '#B8860B' },
    { icon: 'list', label: 'History', color: '#CD853F' },
    { icon: 'card', label: 'Top Up', color: '#8B4513' }
  ];

  const handleQuickAction = (action) => {
    switch (action) {
      case 'Send':
        setShowSendModal(true);
        break;
      case 'Request':
        setShowRequestModal(true);
        break;
      case 'History':
        setShowHistoryModal(true);
        break;
      case 'Top Up':
        setShowTopUpModal(true);
        break;
      default:
        showInfo('Coming Soon', `${action} functionality will be available soon!`);
    }
  };

  const handleSendTLB = () => {
    if (!sendForm.recipient || !sendForm.amount) {
      showError('Incomplete Form', 'Please fill in both recipient and amount fields.');
      return;
    }

    const amount = parseFloat(sendForm.amount);
    if (isNaN(amount) || amount <= 0) {
      showError('Invalid Amount', 'Please enter a valid amount greater than 0.');
      return;
    }

    if (amount > walletData.available) {
      showError('Insufficient Balance', `You only have 💎 ${walletData.available.toFixed(2)} TLB available.`);
      return;
    }

    showAlert({
      title: 'Confirm Transfer',
      message: `Send 💎 ${amount.toFixed(2)} TLB to ${sendForm.recipient}?\n\n${sendForm.message ? `Message: "${sendForm.message}"` : 'No message included.'}`,
      type: 'warning',
      icon: 'send',
      buttons: [
        {
          text: 'Cancel',
          style: 'cancel',
          onPress: () => {}
        },
        {
          text: 'Send TLB',
          style: 'default',
          onPress: () => {
            setShowSendModal(false);
            setSendForm({ recipient: '', amount: '', message: '' });
            showSuccess('Transfer Sent!', `💎 ${amount.toFixed(2)} TLB sent successfully to ${sendForm.recipient}.`);
          }
        }
      ]
    });
  };

  const handleRequestTLB = () => {
    if (!requestForm.requester || !requestForm.amount) {
      showError('Incomplete Form', 'Please fill in both requester and amount fields.');
      return;
    }

    const amount = parseFloat(requestForm.amount);
    if (isNaN(amount) || amount <= 0) {
      showError('Invalid Amount', 'Please enter a valid amount greater than 0.');
      return;
    }

    showAlert({
      title: 'Send Request',
      message: `Request 💎 ${amount.toFixed(2)} TLB from ${requestForm.requester}?\n\n${requestForm.message ? `Message: "${requestForm.message}"` : 'No message included.'}`,
      type: 'info',
      icon: 'download',
      buttons: [
        {
          text: 'Cancel',
          style: 'cancel',
          onPress: () => {}
        },
        {
          text: 'Send Request',
          style: 'default',
          onPress: () => {
            setShowRequestModal(false);
            setRequestForm({ requester: '', amount: '', message: '' });
            showSuccess('Request Sent!', `Request for 💎 ${amount.toFixed(2)} TLB sent to ${requestForm.requester}.`);
          }
        }
      ]
    });
  };

  const handleTopUpOption = (method) => {
    setShowTopUpModal(false);
    
    switch (method) {
      case 'card':
        showInfo(
          'Credit/Debit Card Top Up',
          'Add funds using your credit or debit card:\n\n💳 Instant processing\n💎 Min: 10.00 TLB\n💎 Max: 5,000.00 TLB\n💰 Fee: 2.9% + $0.30\n\nFeature coming soon!'
        );
        break;
      case 'bank':
        showInfo(
          'Bank Transfer Top Up',
          'Add funds via bank transfer:\n\n🏦 3-5 business days\n💎 Min: 25.00 TLB\n💎 Max: 10,000.00 TLB\n💰 Fee: $5.00 flat rate\n\nFeature coming soon!'
        );
        break;
      case 'crypto':
        showInfo(
          'Cryptocurrency Top Up',
          'Add funds using cryptocurrency:\n\n₿ Bitcoin, Ethereum supported\n💎 Min: 50.00 TLB equivalent\n💎 Max: 25,000.00 TLB equivalent\n💰 Fee: 1.5%\n\nFeature coming soon!'
        );
        break;
      case 'gift':
        showInfo(
          'Gift Card Redemption',
          'Redeem TLB Diamond gift cards:\n\n🎁 Instant processing\n💎 Variable amounts\n💰 No fees\n\nFeature coming soon!'
        );
        break;
    }
  };

  const handleTransactionPress = (transaction) => {
    setSelectedTransaction(transaction);
    setShowTransactionDetailsModal(true);
  };

  const handleTransactionDetailPress = (transaction) => {
    setSelectedTransaction(transaction);
    setShowTransactionDetailsModal(true);
  };

  const handleViewAllTransactions = () => {
    setShowHistoryModal(true);
  };

  const handleExportTransactionHistory = () => {
    Alert.alert(
      '📊 Export Transaction History',
      'Export your complete TLB transaction history with detailed analytics.\n\nChoose your preferred format:',
      [
        { text: 'PDF Report', onPress: () => simulateExport('PDF') },
        { text: 'CSV Data', onPress: () => simulateExport('CSV') },
        { text: 'JSON File', onPress: () => simulateExport('JSON') },
        { text: 'Cancel', style: 'cancel' }
      ]
    );
  };

  const simulateExport = (format) => {
    const totalTransactions = transactions.length + 4; // Including the extra ones from "View All"
    const totalValue = transactions.reduce((sum, t) => sum + t.amount, 0) + 210; // Extra transactions value
    
    setTimeout(() => {
      Alert.alert(
        '✅ Export Complete!',
        `Transaction history exported successfully!\n\n📄 Format: ${format}\n📊 Transactions: ${totalTransactions}\n💎 Total Value: ${totalValue.toFixed(2)} TLB\n📅 Export Date: ${new Date().toLocaleDateString()}\n\nFile saved to Downloads folder.`,
        [{ text: 'OK' }]
      );
    }, 1000);
  };

  const totalBalance = walletData.available + walletData.locked + walletData.pending;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      {/* Wallet Balance Card */}
      <View style={styles.balanceCard}>
        <View style={styles.balanceHeader}>
          <Text style={styles.balanceLabel}>Total Balance</Text>
          <TouchableOpacity onPress={() => setBalanceVisible(!balanceVisible)}>
            <Ionicons 
              name={balanceVisible ? 'eye' : 'eye-off'} 
              size={20} 
              color="#8B4513" 
            />
          </TouchableOpacity>
        </View>
        
        <Text style={styles.balanceAmount}>
          {balanceVisible ? `💎 ${totalBalance.toFixed(2)} TLB` : '💎 ••••••'}
        </Text>
        
        <View style={styles.balanceBreakdown}>
          <View style={styles.breakdownItem}>
            <Text style={styles.breakdownLabel}>Available</Text>
            <Text style={styles.breakdownAmount}>
              💎 {balanceVisible ? walletData.available.toFixed(2) : '••••'}
            </Text>
          </View>
          
          <View style={styles.breakdownItem}>
            <Text style={styles.breakdownLabel}>Locked</Text>
            <Text style={styles.breakdownAmount}>
              💎 {balanceVisible ? walletData.locked.toFixed(2) : '••••'}
            </Text>
          </View>
          
          <View style={styles.breakdownItem}>
            <Text style={styles.breakdownLabel}>Pending</Text>
            <Text style={styles.breakdownAmount}>
              💎 {balanceVisible ? walletData.pending.toFixed(2) : '••••'}
            </Text>
          </View>
        </View>
      </View>

      {/* Quick Actions */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.quickActionsContainer}>
          {quickActions.map((action, index) => (
            <TouchableOpacity 
              key={index}
              style={[styles.quickActionButton, { backgroundColor: action.color }]}
              onPress={() => handleQuickAction(action.label)}
            >
              <Ionicons name={action.icon} size={24} color="#FFFFFF" />
              <Text style={styles.quickActionLabel}>{action.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Monthly Overview */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>This Month</Text>
        <View style={styles.monthlyOverview}>
          <View style={styles.monthlyCard}>
            <Ionicons name="trending-up" size={20} color="#10B981" />
            <Text style={styles.monthlyLabel}>Earned</Text>
            <Text style={styles.monthlyAmount}>+💎 {walletData.monthlyEarned.toFixed(2)}</Text>
          </View>
          
          <View style={styles.monthlyCard}>
            <Ionicons name="trending-down" size={20} color="#EF4444" />
            <Text style={styles.monthlyLabel}>Spent</Text>
            <Text style={styles.monthlyAmount}>-💎 {walletData.monthlySpent.toFixed(2)}</Text>
          </View>
          
          <View style={styles.monthlyCard}>
            <Ionicons name="gift" size={20} color="#F59E0B" />
            <Text style={styles.monthlyLabel}>Bonuses</Text>
            <Text style={styles.monthlyAmount}>+💎 {walletData.monthlyBonuses.toFixed(2)}</Text>
          </View>
        </View>
      </View>

      {/* Recent Transactions */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recent Transactions</Text>
          <TouchableOpacity onPress={handleViewAllTransactions}>
            <Text style={styles.viewAllText}>View All</Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.transactionsList}>
          {transactions.map((transaction) => (
            <TouchableOpacity 
              key={transaction.id}
              style={styles.transactionItem}
              onPress={() => handleTransactionPress(transaction)}
            >
              <View style={[styles.transactionIcon, { backgroundColor: transaction.color }]}>
                <Ionicons name={transaction.icon} size={20} color="#FFFFFF" />
              </View>
              
              <View style={styles.transactionDetails}>
                <Text style={styles.transactionTitle}>{transaction.title}</Text>
                <Text style={styles.transactionSubtitle}>{transaction.subtitle}</Text>
              </View>
              
              <View style={styles.transactionAmount}>
                <Text style={[
                  styles.transactionAmountText,
                  { color: transaction.type === 'received' ? '#10B981' : '#EF4444' }
                ]}>
                  {transaction.type === 'received' ? '+' : '-'}💎 {transaction.amount.toFixed(2)}
                </Text>
                <Text style={styles.transactionTime}>{transaction.time}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Lifetime Stats */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Lifetime Statistics</Text>
        <View style={styles.lifetimeStats}>
          <View style={styles.statCard}>
            <Text style={styles.statAmount}>💎 {walletData.lifetimeEarned.toFixed(2)}</Text>
            <Text style={styles.statLabel}>Total Earned</Text>
          </View>
          
          <View style={styles.statCard}>
            <Text style={styles.statAmount}>💎 {walletData.lifetimeSpent.toFixed(2)}</Text>
            <Text style={styles.statLabel}>Total Spent</Text>
          </View>
        </View>
      </View>

      {/* Transaction History Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={showHistoryModal}
        onRequestClose={() => setShowHistoryModal(false)}
        statusBarTranslucent={true}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>💎 Transaction History</Text>
              <TouchableOpacity 
                style={styles.modalCloseButton}
                onPress={() => setShowHistoryModal(false)}
              >
                <Ionicons name="close" size={24} color="#8B4513" />
              </TouchableOpacity>
            </View>
            
            {/* History Summary */}
            <View style={styles.historySummary}>
              <View style={styles.summaryCard}>
                <Text style={styles.summaryLabel}>Total Transactions</Text>
                <Text style={styles.summaryValue}>{allTransactions.length}</Text>
              </View>
              <View style={styles.summaryCard}>
                <Text style={styles.summaryLabel}>This Month</Text>
                <Text style={styles.summaryValue}>
                  {allTransactions.filter(t => t.date.includes('2024-12')).length}
                </Text>
              </View>
              <View style={styles.summaryCard}>
                <Text style={styles.summaryLabel}>Net Flow</Text>
                <Text style={styles.summaryValue}>
                  💎 {(allTransactions
                    .filter(t => t.type === 'received')
                    .reduce((sum, t) => sum + t.amount, 0) - 
                  allTransactions
                    .filter(t => t.type === 'sent')
                    .reduce((sum, t) => sum + t.amount, 0)).toFixed(2)}
                </Text>
              </View>
            </View>
            
            <ScrollView style={styles.modalContent} showsVerticalScrollIndicator={false}>
              {/* All Transactions List */}
              <View style={styles.historySection}>
                <Text style={styles.historySectionTitle}>All Transactions</Text>
                
                {allTransactions.map((transaction) => (
                  <TouchableOpacity 
                    key={transaction.id}
                    style={styles.historyTransactionItem}
                    onPress={() => handleTransactionDetailPress(transaction)}
                  >
                    <View style={[styles.historyTransactionIcon, { backgroundColor: transaction.color }]}>
                      <Ionicons name={transaction.icon} size={20} color="#FFFFFF" />
                    </View>
                    
                    <View style={styles.historyTransactionDetails}>
                      <Text style={styles.historyTransactionTitle}>{transaction.title}</Text>
                      <Text style={styles.historyTransactionSubtitle}>{transaction.subtitle}</Text>
                      <Text style={styles.historyTransactionId}>ID: {transaction.transactionId}</Text>
                    </View>
                    
                    <View style={styles.historyTransactionAmount}>
                      <Text style={[
                        styles.historyTransactionAmountText,
                        { color: transaction.type === 'received' ? '#10B981' : '#EF4444' }
                      ]}>
                        {transaction.type === 'received' ? '+' : '-'}💎 {transaction.amount.toFixed(2)}
                      </Text>
                      <Text style={styles.historyTransactionTime}>{transaction.time}</Text>
                      <Text style={styles.historyTransactionDate}>{transaction.date}</Text>
                    </View>
                  </TouchableOpacity>
                ))}
              </View>

              {/* Monthly Breakdown */}
              <View style={styles.historySection}>
                <Text style={styles.historySectionTitle}>Monthly Breakdown</Text>
                
                <View style={styles.monthlyBreakdown}>
                  <View style={styles.monthlyBreakdownItem}>
                    <Text style={styles.monthlyBreakdownLabel}>December 2024</Text>
                    <View style={styles.monthlyBreakdownAmounts}>
                      <Text style={styles.monthlyReceived}>
                        +💎 {allTransactions
                          .filter(t => t.date.includes('2024-12') && t.type === 'received')
                          .reduce((sum, t) => sum + t.amount, 0).toFixed(2)}
                      </Text>
                      <Text style={styles.monthlySent}>
                        -💎 {allTransactions
                          .filter(t => t.date.includes('2024-12') && t.type === 'sent')
                          .reduce((sum, t) => sum + t.amount, 0).toFixed(2)}
                      </Text>
                    </View>
                  </View>
                  
                  <View style={styles.monthlyBreakdownItem}>
                    <Text style={styles.monthlyBreakdownLabel}>November 2024</Text>
                    <View style={styles.monthlyBreakdownAmounts}>
                      <Text style={styles.monthlyReceived}>
                        +💎 {allTransactions
                          .filter(t => t.date.includes('2024-11') && t.type === 'received')
                          .reduce((sum, t) => sum + t.amount, 0).toFixed(2)}
                      </Text>
                      <Text style={styles.monthlySent}>
                        -💎 {allTransactions
                          .filter(t => t.date.includes('2024-11') && t.type === 'sent')
                          .reduce((sum, t) => sum + t.amount, 0).toFixed(2)}
                      </Text>
                    </View>
                  </View>
                </View>
              </View>
            </ScrollView>

            {/* Action Buttons */}
            <View style={styles.historyActions}>
              <TouchableOpacity 
                style={styles.exportButton}
                onPress={handleExportTransactionHistory}
              >
                <Ionicons name="download" size={20} color="#FFFFFF" />
                <Text style={styles.exportButtonText}>Export History</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.filterButton}
                onPress={() => Alert.alert('Filter', 'Transaction filtering coming soon!')}
              >
                <Ionicons name="filter" size={20} color="#6B7280" />
                <Text style={styles.filterButtonText}>Filter</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Send TLB Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={showSendModal}
        onRequestClose={() => setShowSendModal(false)}
        statusBarTranslucent={true}
      >
        <View style={styles.walletModalOverlay}>
          <View style={styles.walletActionContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>💎 Send TLB Diamonds</Text>
              <TouchableOpacity 
                style={styles.modalCloseButton}
                onPress={() => setShowSendModal(false)}
              >
                <Ionicons name="close" size={24} color="#8B4513" />
              </TouchableOpacity>
            </View>

            <View style={styles.walletModalContent}>
              <View style={styles.walletFormSection}>
                <Text style={styles.formLabel}>Recipient</Text>
                <TextInput
                  style={styles.formInput}
                  placeholder="Enter username or email"
                  value={sendForm.recipient}
                  onChangeText={(text) => setSendForm({...sendForm, recipient: text})}
                  autoCapitalize="none"
                />
              </View>

              <View style={styles.walletFormSection}>
                <Text style={styles.formLabel}>Amount (TLB)</Text>
                <TextInput
                  style={styles.formInput}
                  placeholder="0.00"
                  value={sendForm.amount}
                  onChangeText={(text) => setSendForm({...sendForm, amount: text})}
                  keyboardType="decimal-pad"
                />
                <Text style={styles.formHelper}>
                  Available: 💎 {walletData.available.toFixed(2)} TLB
                </Text>
              </View>

              <View style={[styles.walletFormSection, styles.expandedMessageSection]}>
                <Text style={styles.formLabel}>Message (Optional)</Text>
                <TextInput
                  style={[styles.formInput, styles.expandedMessageInput]}
                  placeholder="Add a note..."
                  value={sendForm.message}
                  onChangeText={(text) => setSendForm({...sendForm, message: text})}
                  multiline={true}
                  numberOfLines={6}
                />
              </View>
            </View>

            <View style={styles.walletActionButtons}>
              <TouchableOpacity 
                style={styles.cancelButton}
                onPress={() => setShowSendModal(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.primaryButton}
                onPress={handleSendTLB}
              >
                <Ionicons name="send" size={20} color="#FFFFFF" />
                <Text style={styles.primaryButtonText}>Send TLB</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Request TLB Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={showRequestModal}
        onRequestClose={() => setShowRequestModal(false)}
        statusBarTranslucent={true}
      >
        <View style={styles.walletModalOverlay}>
          <View style={styles.walletActionContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>💎 Request TLB Diamonds</Text>
              <TouchableOpacity 
                style={styles.modalCloseButton}
                onPress={() => setShowRequestModal(false)}
              >
                <Ionicons name="close" size={24} color="#8B4513" />
              </TouchableOpacity>
            </View>

            <View style={styles.walletModalContent}>
              <View style={styles.walletFormSection}>
                <Text style={styles.formLabel}>Request From</Text>
                <TextInput
                  style={styles.formInput}
                  placeholder="Enter username or email"
                  value={requestForm.requester}
                  onChangeText={(text) => setRequestForm({...requestForm, requester: text})}
                  autoCapitalize="none"
                />
              </View>

              <View style={styles.walletFormSection}>
                <Text style={styles.formLabel}>Amount (TLB)</Text>
                <TextInput
                  style={styles.formInput}
                  placeholder="0.00"
                  value={requestForm.amount}
                  onChangeText={(text) => setRequestForm({...requestForm, amount: text})}
                  keyboardType="decimal-pad"
                />
              </View>

              <View style={[styles.walletFormSection, styles.expandedMessageSection]}>
                <Text style={styles.formLabel}>Message (Optional)</Text>
                <TextInput
                  style={[styles.formInput, styles.expandedMessageInput]}
                  placeholder="Reason for request..."
                  value={requestForm.message}
                  onChangeText={(text) => setRequestForm({...requestForm, message: text})}
                  multiline={true}
                  numberOfLines={6}
                />
              </View>
            </View>

            <View style={styles.walletActionButtons}>
              <TouchableOpacity 
                style={styles.cancelButton}
                onPress={() => setShowRequestModal(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.primaryButton}
                onPress={handleRequestTLB}
              >
                <Ionicons name="download" size={20} color="#FFFFFF" />
                <Text style={styles.primaryButtonText}>Send Request</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Top Up Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={showTopUpModal}
        onRequestClose={() => setShowTopUpModal(false)}
        statusBarTranslucent={true}
      >
        <View style={styles.walletModalOverlay}>
          <View style={styles.walletActionContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>💳 Top Up Wallet</Text>
              <TouchableOpacity 
                style={styles.modalCloseButton}
                onPress={() => setShowTopUpModal(false)}
              >
                <Ionicons name="close" size={24} color="#8B4513" />
              </TouchableOpacity>
            </View>

            <ScrollView 
              style={styles.walletModalContent} 
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.walletModalContentContainer}
            >
              <Text style={styles.topUpSubtitle}>
                Choose a payment method to add TLB Diamonds to your wallet:
              </Text>

              {/* Credit/Debit Card */}
              <TouchableOpacity 
                style={styles.topUpOptionCard}
                onPress={() => handleTopUpOption('card')}
                activeOpacity={0.7}
              >
                <View style={[styles.topUpOptionIcon, { backgroundColor: '#D4AF37' }]}>
                  <Ionicons name="card" size={24} color="#FFFFFF" />
                </View>
                <View style={styles.topUpOptionContent}>
                  <Text style={styles.topUpOptionTitle}>Credit/Debit Card</Text>
                  <Text style={styles.topUpOptionDescription}>Instant • 2.9% + $0.30 fee</Text>
                  <Text style={styles.topUpOptionLimits}>💎 10.00 - 5,000.00 TLB</Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color="#8B4513" />
              </TouchableOpacity>

              {/* Bank Transfer */}
              <TouchableOpacity 
                style={styles.topUpOptionCard}
                onPress={() => handleTopUpOption('bank')}
                activeOpacity={0.7}
              >
                <View style={[styles.topUpOptionIcon, { backgroundColor: '#10B981' }]}>
                  <Ionicons name="business" size={24} color="#FFFFFF" />
                </View>
                <View style={styles.topUpOptionContent}>
                  <Text style={styles.topUpOptionTitle}>Bank Transfer</Text>
                  <Text style={styles.topUpOptionDescription}>3-5 days • $5.00 flat fee</Text>
                  <Text style={styles.topUpOptionLimits}>💎 25.00 - 10,000.00 TLB</Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color="#8B4513" />
              </TouchableOpacity>

              {/* Cryptocurrency */}
              <TouchableOpacity 
                style={styles.topUpOptionCard}
                onPress={() => handleTopUpOption('crypto')}
                activeOpacity={0.7}
              >
                <View style={[styles.topUpOptionIcon, { backgroundColor: '#F59E0B' }]}>
                  <Ionicons name="logo-bitcoin" size={24} color="#FFFFFF" />
                </View>
                <View style={styles.topUpOptionContent}>
                  <Text style={styles.topUpOptionTitle}>Cryptocurrency</Text>
                  <Text style={styles.topUpOptionDescription}>1-2 hours • 1.5% fee</Text>
                  <Text style={styles.topUpOptionLimits}>💎 50.00 - 25,000.00 TLB</Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color="#8B4513" />
              </TouchableOpacity>

              {/* Gift Card */}
              <TouchableOpacity 
                style={styles.topUpOptionCard}
                onPress={() => handleTopUpOption('gift')}
                activeOpacity={0.7}
              >
                <View style={[styles.topUpOptionIcon, { backgroundColor: '#EC4899' }]}>
                  <Ionicons name="gift" size={24} color="#FFFFFF" />
                </View>
                <View style={styles.topUpOptionContent}>
                  <Text style={styles.topUpOptionTitle}>Gift Card</Text>
                  <Text style={styles.topUpOptionDescription}>Instant • No fees</Text>
                  <Text style={styles.topUpOptionLimits}>💎 Variable amounts</Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color="#8B4513" />
              </TouchableOpacity>
            </ScrollView>

            <View style={styles.walletActionButtons}>
              <TouchableOpacity 
                style={styles.cancelButton}
                onPress={() => setShowTopUpModal(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Transaction Details Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={showTransactionDetailsModal}
        onRequestClose={() => setShowTransactionDetailsModal(false)}
        statusBarTranslucent={true}
      >
        <View style={styles.transactionDetailOverlay}>
          <View style={styles.transactionDetailContainer}>
            <View style={styles.transactionDetailHeader}>
              <Text style={styles.transactionDetailTitle}>💎 Transaction Details</Text>
              <TouchableOpacity 
                style={styles.modalCloseButton}
                onPress={() => setShowTransactionDetailsModal(false)}
              >
                <Ionicons name="close" size={24} color="#8B4513" />
              </TouchableOpacity>
            </View>
            
            {selectedTransaction && (
              <View style={styles.transactionDetailContent}>
                <View style={styles.transactionDetailCard}>
                  <View style={[styles.transactionDetailIcon, { backgroundColor: selectedTransaction.color }]}>
                    <Ionicons name={selectedTransaction.icon} size={28} color="#FFFFFF" />
                  </View>
                  
                  <View style={styles.transactionDetailInfo}>
                    <Text style={styles.transactionDetailAmount}>
                      {selectedTransaction.type === 'received' ? '+' : '-'}💎 {selectedTransaction.amount.toFixed(2)} TLB
                    </Text>
                    <Text style={styles.transactionDetailStatus}>
                      {selectedTransaction.status || 'Completed'}
                    </Text>
                  </View>
                </View>
                
                <View style={styles.transactionDetailFields}>
                  <View style={styles.transactionDetailFieldRow}>
                    <View style={styles.transactionDetailField}>
                      <Text style={styles.transactionDetailFieldLabel}>Transaction ID</Text>
                      <Text style={styles.transactionDetailFieldValue} numberOfLines={1}>{selectedTransaction.transactionId}</Text>
                    </View>
                  </View>
                  
                  <View style={styles.transactionDetailFieldRow}>
                    <View style={styles.transactionDetailField}>
                      <Text style={styles.transactionDetailFieldLabel}>Title</Text>
                      <Text style={styles.transactionDetailFieldValue} numberOfLines={1}>{selectedTransaction.title}</Text>
                    </View>
                  </View>
                  
                  <View style={styles.transactionDetailFieldRow}>
                    <View style={styles.transactionDetailField}>
                      <Text style={styles.transactionDetailFieldLabel}>Date</Text>
                      <Text style={styles.transactionDetailFieldValue}>{selectedTransaction.time || selectedTransaction.date}</Text>
                    </View>
                  </View>
                  
                  <View style={styles.transactionDetailFieldRow}>
                    <View style={styles.transactionDetailField}>
                      <Text style={styles.transactionDetailFieldLabel}>Type</Text>
                      <Text style={styles.transactionDetailFieldValue}>{selectedTransaction.type === 'received' ? 'Credit' : 'Debit'}</Text>
                    </View>
                  </View>
                </View>
                
                <View style={styles.transactionDetailActions}>
                  <TouchableOpacity 
                    style={styles.transactionDetailCopyButton}
                    onPress={() => {
                      showSuccess('Copied!', 'Transaction ID copied to clipboard');
                    }}
                  >
                    <Ionicons name="copy" size={20} color="#D4AF37" />
                    <Text style={styles.transactionDetailCopyText}>Copy ID</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
            
            <View style={styles.transactionDetailFooter}>
              <TouchableOpacity 
                style={styles.transactionDetailCloseButton}
                onPress={() => setShowTransactionDetailsModal(false)}
              >
                <Text style={styles.transactionDetailCloseText}>Close</Text>
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
  balanceCard: {
    backgroundColor: '#F5E6A3',
    borderRadius: 16,
    padding: 24,
    margin: 20,
    borderWidth: 2,
    borderColor: '#D4AF37',
  },
  balanceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  balanceLabel: {
    fontSize: 16,
    color: '#8B4513',
    fontWeight: '500',
  },
  balanceAmount: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#2C1810',
    marginBottom: 20,
  },
  balanceBreakdown: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  breakdownItem: {
    alignItems: 'center',
  },
  breakdownLabel: {
    fontSize: 12,
    color: '#8B4513',
    marginBottom: 4,
  },
  breakdownAmount: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2C1810',
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 25,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2C1810',
    marginBottom: 15,
  },
  viewAllText: {
    color: '#D4AF37',
    fontSize: 14,
    fontWeight: '600',
  },
  quickActionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  quickActionButton: {
    width: (width - 60) / 4,
    aspectRatio: 1,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  quickActionLabel: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
    marginTop: 5,
  },
  monthlyOverview: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  monthlyCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 15,
    alignItems: 'center',
    width: (width - 60) / 3,
    borderWidth: 1,
    borderColor: '#D4AF37',
  },
  monthlyLabel: {
    fontSize: 12,
    color: '#8B4513',
    marginTop: 5,
    marginBottom: 5,
  },
  monthlyAmount: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#2C1810',
  },
  transactionsList: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#D4AF37',
  },
  transactionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F5E6A3',
  },
  transactionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  transactionDetails: {
    flex: 1,
  },
  transactionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2C1810',
    marginBottom: 2,
  },
  transactionSubtitle: {
    fontSize: 12,
    color: '#8B4513',
  },
  transactionAmount: {
    alignItems: 'flex-end',
  },
  transactionAmountText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  transactionTime: {
    fontSize: 10,
    color: '#8B4513',
  },
  lifetimeStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    width: (width - 50) / 2,
    borderWidth: 1,
    borderColor: '#D4AF37',
  },
  statAmount: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#D4AF37',
    marginBottom: 5,
  },
  statLabel: {
    fontSize: 14,
    color: '#8B4513',
  },

  // History Modal Styles
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
    maxHeight: '90%',
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: '#D4AF37',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 16,
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
  modalContent: {
    paddingHorizontal: 24,
    paddingVertical: 20,
  },
  historySummary: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    paddingVertical: 16,
    backgroundColor: '#FAFAFA',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(229, 231, 235, 0.6)',
  },
  summaryCard: {
    flex: 1,
    alignItems: 'center',
  },
  summaryLabel: {
    fontSize: 12,
    color: '#8B4513',
    marginBottom: 4,
    textAlign: 'center',
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: '700',
    color: '#2C1810',
    textAlign: 'center',
  },
  historySection: {
    marginBottom: 24,
  },
  historySectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#2C1810',
    marginBottom: 16,
  },
  historyTransactionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: 'rgba(0, 0, 0, 0.05)',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  historyTransactionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  historyTransactionDetails: {
    flex: 1,
  },
  historyTransactionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2C1810',
    marginBottom: 2,
  },
  historyTransactionSubtitle: {
    fontSize: 13,
    color: '#8B4513',
    marginBottom: 2,
  },
  historyTransactionId: {
    fontSize: 11,
    color: '#9CA3AF',
    fontFamily: 'monospace',
  },
  historyTransactionAmount: {
    alignItems: 'flex-end',
  },
  historyTransactionAmountText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  historyTransactionTime: {
    fontSize: 11,
    color: '#8B4513',
    marginBottom: 1,
  },
  historyTransactionDate: {
    fontSize: 10,
    color: '#9CA3AF',
    fontFamily: 'monospace',
  },
  monthlyBreakdown: {
    gap: 12,
  },
  monthlyBreakdownItem: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  monthlyBreakdownLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2C1810',
    marginBottom: 8,
  },
  monthlyBreakdownAmounts: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  monthlyReceived: {
    fontSize: 15,
    fontWeight: '600',
    color: '#10B981',
  },
  monthlySent: {
    fontSize: 15,
    fontWeight: '600',
    color: '#EF4444',
  },
  historyActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingVertical: 20,
    borderTopWidth: 1,
    borderTopColor: 'rgba(229, 231, 235, 0.6)',
    backgroundColor: '#FAFAFA',
  },
  exportButton: {
    flex: 1.5,
    backgroundColor: '#D4AF37',
    borderRadius: 14,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#B8860B',
    shadowColor: 'rgba(212, 175, 55, 0.4)',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 8,
  },
  exportButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    marginLeft: 8,
    letterSpacing: 0.4,
  },
  filterButton: {
    flex: 1,
    backgroundColor: '#F9FAFB',
    borderRadius: 14,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
    shadowColor: 'rgba(0, 0, 0, 0.05)',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  filterButtonText: {
    color: '#6B7280',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },

  // Wallet Action Modal Styles
  walletModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: '100%',
    height: '100%',
  },
  walletActionContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 0,
    width: '100%',
    maxWidth: 420,
    height: '85%',
    minHeight: 600,
    shadowColor: 'rgba(0, 0, 0, 0.3)',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 20,
    borderWidth: 2,
    borderColor: '#D4AF37',
    overflow: 'hidden',
    flexDirection: 'column',
  },
  walletModalContent: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 16,
    justifyContent: 'flex-start',
    minHeight: 400,
  },
  walletModalContentContainer: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  walletFormSection: {
    marginBottom: 24,
  },
  formLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2C1810',
    marginBottom: 8,
  },
  formInput: {
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    padding: 18,
    fontSize: 16,
    color: '#2C1810',
    minHeight: 56,
  },
  messageInput: {
    height: 80,
    textAlignVertical: 'top',
  },
  compactMessageInput: {
    height: 120,
    textAlignVertical: 'top',
  },
  expandedMessageSection: {
    flex: 1,
    marginBottom: 16,
  },
  expandedMessageInput: {
    flex: 1,
    minHeight: 150,
    maxHeight: 200,
    textAlignVertical: 'top',
  },
  formHelper: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 6,
  },
  walletActionButtons: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    justifyContent: 'space-between',
    backgroundColor: '#FAFAFA',
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#F3F4F6',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 12,
    alignItems: 'center',
    marginRight: 6,
  },
  cancelButtonText: {
    color: '#6B7280',
    fontSize: 16,
    fontWeight: '600',
  },
  primaryButton: {
    flex: 1,
    backgroundColor: '#D4AF37',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 6,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  
  // Top Up Modal Styles
  topUpSubtitle: {
    fontSize: 15,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 22,
  },
  topUpOptionCard: {
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginBottom: 12,
    shadowColor: 'rgba(0, 0, 0, 0.05)',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  topUpOptionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  topUpOptionContent: {
    flex: 1,
  },
  topUpOptionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2C1810',
    marginBottom: 2,
  },
  topUpOptionDescription: {
    fontSize: 13,
    color: '#6B7280',
    marginBottom: 2,
  },
  topUpOptionLimits: {
    fontSize: 12,
    color: '#8B4513',
    fontWeight: '500',
  },
  // Transaction Details Modal Styles
  transactionDetailOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  transactionDetailContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    width: '100%',
    maxWidth: 400,
    maxHeight: '90%',
    minHeight: 500,
    shadowColor: 'rgba(0, 0, 0, 0.3)',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 20,
    borderWidth: 2,
    borderColor: '#D4AF37',
    overflow: 'hidden',
  },
  transactionDetailHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F5E6A3',
    backgroundColor: '#FFFDF4',
  },
  transactionDetailTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2C1810',
  },
  transactionDetailContent: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 12,
    justifyContent: 'space-between',
  },
  transactionDetailCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFDF4',
    borderRadius: 16,
    padding: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#F5E6A3',
  },
  transactionDetailIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    shadowColor: 'rgba(0, 0, 0, 0.1)',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  transactionDetailInfo: {
    flex: 1,
  },
  transactionDetailAmount: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2C1810',
    marginBottom: 2,
  },
  transactionDetailStatus: {
    fontSize: 14,
    color: '#10B981',
    fontWeight: '600',
  },
  transactionDetailFields: {
    flex: 1,
    marginBottom: 12,
  },
  transactionDetailFieldRow: {
    marginBottom: 10,
  },
  transactionDetailField: {
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  transactionDetailFieldLabel: {
    fontSize: 13,
    color: '#6B7280',
    fontWeight: '500',
    marginBottom: 2,
  },
  transactionDetailFieldValue: {
    fontSize: 15,
    color: '#2C1810',
    fontWeight: '600',
  },
  transactionDetailActions: {
    alignItems: 'center',
    marginBottom: 8,
  },
  transactionDetailCopyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFDF4',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#D4AF37',
  },
  transactionDetailCopyText: {
    fontSize: 14,
    color: '#D4AF37',
    fontWeight: '600',
    marginLeft: 6,
  },
  transactionDetailFooter: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#F5E6A3',
    backgroundColor: '#FFFDF4',
  },
  transactionDetailCloseButton: {
    backgroundColor: '#D4AF37',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    shadowColor: 'rgba(0, 0, 0, 0.1)',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  transactionDetailCloseText: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
});