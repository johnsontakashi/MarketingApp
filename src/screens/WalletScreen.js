import React, { useState } from 'react';
import { 
  View, 
  Text, 
  ScrollView, 
  TouchableOpacity, 
  StyleSheet,
  Dimensions,
  Alert,
  Modal
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

export default function WalletScreen({ navigation }) {
  const [balanceVisible, setBalanceVisible] = useState(true);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
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
    if (action === 'History') {
      setShowHistoryModal(true);
    } else {
      Alert.alert('Coming Soon', `${action} functionality will be available soon!`);
    }
  };

  const handleTransactionPress = (transaction) => {
    Alert.alert('Transaction Details', `${transaction.title}\nAmount: 💎 ${transaction.amount} TLB`);
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
    </ScrollView>
  );
}

const handleTransactionDetailPress = (transaction) => {
  Alert.alert(
    '💎 Transaction Details',
    `Transaction ID: ${transaction.transactionId}\n\nTitle: ${transaction.title}\nDescription: ${transaction.subtitle}\nAmount: ${transaction.type === 'received' ? '+' : '-'}💎 ${transaction.amount.toFixed(2)} TLB\nDate: ${transaction.date}\nStatus: ${transaction.status}\nType: ${transaction.type === 'received' ? 'Credit' : 'Debit'}`,
    [
      { text: 'Copy ID', onPress: () => Alert.alert('Copied', 'Transaction ID copied to clipboard') },
      { text: 'Close', style: 'cancel' }
    ]
  );
};

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
    gap: 12,
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
});