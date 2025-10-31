import React, { useState } from 'react';
import { 
  View, 
  Text, 
  ScrollView, 
  TouchableOpacity, 
  StyleSheet,
  Dimensions,
  Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

export default function WalletScreen({ navigation }) {
  const [balanceVisible, setBalanceVisible] = useState(true);
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

  const transactions = [
    {
      id: 1,
      type: 'received',
      amount: 5.00,
      title: 'Referral Bonus',
      subtitle: 'From: Sarah M.',
      time: 'Today',
      icon: 'people',
      color: '#10B981'
    },
    {
      id: 2,
      type: 'sent',
      amount: 25.00,
      title: 'Order Payment',
      subtitle: 'Installment #2',
      time: 'Yesterday',
      icon: 'card',
      color: '#EF4444'
    },
    {
      id: 3,
      type: 'received',
      amount: 50.00,
      title: 'Birthday Bonus',
      subtitle: 'Special reward',
      time: '2 days ago',
      icon: 'gift',
      color: '#10B981'
    },
    {
      id: 4,
      type: 'sent',
      amount: 200.00,
      title: 'Product Purchase',
      subtitle: 'Wireless Headphones',
      time: '3 days ago',
      icon: 'storefront',
      color: '#EF4444'
    }
  ];

  const quickActions = [
    { icon: 'send', label: 'Send', color: '#D4AF37' },
    { icon: 'download', label: 'Request', color: '#B8860B' },
    { icon: 'list', label: 'History', color: '#CD853F' },
    { icon: 'card', label: 'Top Up', color: '#8B4513' }
  ];

  const handleQuickAction = (action) => {
    Alert.alert('Coming Soon', `${action} functionality will be available soon!`);
  };

  const handleTransactionPress = (transaction) => {
    Alert.alert('Transaction Details', `${transaction.title}\nAmount: 💎 ${transaction.amount} TLB`);
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
          <TouchableOpacity onPress={() => handleQuickAction('View All')}>
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
});