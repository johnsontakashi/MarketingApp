import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Alert, Modal, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

export default function CommunityScreen() {
  const [showTreeModal, setShowTreeModal] = useState(false);
  const [availableBonuses] = useState([
    {
      id: 1,
      type: 'birthday',
      amount: 50.00,
      title: 'Birthday Bonus',
      description: 'Special birthday reward just for you!',
      expiresIn: '2 days',
      icon: '🎂'
    },
    {
      id: 2,
      type: 'gift_of_legacy',
      amount: 25.00,
      title: 'Gift of Legacy',
      description: 'A surprise gift from a community member',
      giver: 'Sarah M.',
      message: 'Good luck! 🍀',
      expiresIn: '5 days',
      icon: '⭐'
    },
    {
      id: 3,
      type: 'daily',
      amount: 5.00,
      title: 'Daily Login Bonus',
      description: 'Keep your streak going!',
      expiresIn: '18 hours',
      icon: '🎁'
    }
  ]);

  const [referralStats] = useState({
    totalReferrals: 12,
    totalEarnings: 45.00,
    thisMonthEarnings: 15.00,
    generationBreakdown: [
      { level: 1, count: 5, earnings: 25.00 },
      { level: 2, count: 7, earnings: 15.00 },
      { level: 3, count: 0, earnings: 5.00 }
    ]
  });

  const handleClaimBonus = (bonus) => {
    Alert.alert(
      'Claim Bonus',
      `Claim ${bonus.icon} ${bonus.title} worth 💎 ${bonus.amount} TLB?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Claim', onPress: () => Alert.alert('Success!', 'Bonus claimed successfully!') }
      ]
    );
  };

  const handleShareReferral = () => {
    Alert.alert('Share Referral', 'Your referral code: JOHN2024\n\nShare this code with friends!');
  };

  const fullTreeData = [
    {
      generation: 1,
      referrals: [
        { name: 'Sarah M.', joined: '2024-01-15', earnings: '💎 8.50', status: 'Active' },
        { name: 'Mike K.', joined: '2024-01-20', earnings: '💎 5.20', status: 'Active' },
        { name: 'Emma L.', joined: '2024-02-03', earnings: '💎 6.80', status: 'Active' },
        { name: 'David R.', joined: '2024-02-10', earnings: '💎 2.40', status: 'New' },
        { name: 'Lisa P.', joined: '2024-02-15', earnings: '💎 2.10', status: 'New' }
      ]
    },
    {
      generation: 2,
      referrals: [
        { name: 'Alex T.', joined: '2024-01-25', earnings: '💎 3.20', status: 'Active' },
        { name: 'Nina S.', joined: '2024-02-01', earnings: '💎 2.80', status: 'Active' },
        { name: 'James W.', joined: '2024-02-05', earnings: '💎 2.10', status: 'Active' },
        { name: 'Maria G.', joined: '2024-02-12', earnings: '💎 1.90', status: 'New' },
        { name: 'Tom H.', joined: '2024-02-18', earnings: '💎 1.50', status: 'New' },
        { name: 'Kate B.', joined: '2024-02-20', earnings: '💎 1.20', status: 'New' },
        { name: 'Ryan C.', joined: '2024-02-22', earnings: '💎 1.30', status: 'New' }
      ]
    }
  ];

  const handleViewFullTree = () => {
    setShowTreeModal(true);
  };

  const handleShareNetwork = () => {
    setShowTreeModal(false);
    Alert.alert('Share Network', 'Network sharing feature coming soon!');
  };

  const handleExportData = () => {
    setShowTreeModal(false);
    Alert.alert('Export Data', 'Network data export feature coming soon!');
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      {/* Your Network Overview */}
      <View style={styles.networkCard}>
        <Text style={styles.networkTitle}>🤝 Your Network</Text>
        <View style={styles.networkStats}>
          <View style={styles.networkStat}>
            <Text style={styles.networkNumber}>{referralStats.totalReferrals}</Text>
            <Text style={styles.networkLabel}>Referrals</Text>
          </View>
          <View style={styles.networkStat}>
            <Text style={styles.networkNumber}>💎 {referralStats.totalEarnings}</Text>
            <Text style={styles.networkLabel}>Total Earnings</Text>
          </View>
        </View>
        
        <TouchableOpacity style={styles.shareButton} onPress={handleShareReferral}>
          <Ionicons name="share" size={16} color="#FFFFFF" />
          <Text style={styles.shareButtonText}>Share Referral Code</Text>
        </TouchableOpacity>
      </View>

      {/* Available Bonuses */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>🎁 Available Bonuses ({availableBonuses.length})</Text>
        
        {availableBonuses.map((bonus) => (
          <View key={bonus.id} style={styles.bonusCard}>
            <View style={styles.bonusHeader}>
              <Text style={styles.bonusIcon}>{bonus.icon}</Text>
              <View style={styles.bonusInfo}>
                <Text style={styles.bonusTitle}>{bonus.title}</Text>
                <Text style={styles.bonusAmount}>💎 {bonus.amount.toFixed(2)} TLB</Text>
              </View>
              <View style={styles.bonusExpiry}>
                <Text style={styles.expiryText}>Expires in</Text>
                <Text style={styles.expiryTime}>{bonus.expiresIn}</Text>
              </View>
            </View>
            
            <Text style={styles.bonusDescription}>{bonus.description}</Text>
            
            {bonus.giver && (
              <View style={styles.giverInfo}>
                <Text style={styles.giverText}>From: {bonus.giver}</Text>
                {bonus.message && <Text style={styles.messageText}>"{bonus.message}"</Text>}
              </View>
            )}
            
            <View style={styles.bonusActions}>
              <TouchableOpacity 
                style={styles.claimButton}
                onPress={() => handleClaimBonus(bonus)}
              >
                <Text style={styles.claimButtonText}>Claim Bonus</Text>
              </TouchableOpacity>
              
              {bonus.type === 'gift_of_legacy' && (
                <TouchableOpacity style={styles.forwardButton}>
                  <Text style={styles.forwardButtonText}>Forward</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        ))}
      </View>

      {/* Referral Tree */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>📈 Your Referral Tree</Text>
        
        <View style={styles.treeContainer}>
          {referralStats.generationBreakdown.map((gen, index) => (
            <View key={index} style={styles.generationRow}>
              <View style={styles.generationInfo}>
                <Text style={styles.generationLabel}>Generation {gen.level}</Text>
                <Text style={styles.generationCount}>{gen.count} people</Text>
              </View>
              <Text style={styles.generationEarnings}>💎 {gen.earnings.toFixed(2)}</Text>
            </View>
          ))}
        </View>
        
        <TouchableOpacity style={styles.viewTreeButton} onPress={handleViewFullTree}>
          <Text style={styles.viewTreeText}>View Full Tree</Text>
          <Ionicons name="arrow-forward" size={16} color="#D4AF37" />
        </TouchableOpacity>
      </View>

      {/* Community Stats */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>🌟 Community Highlights</Text>
        
        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <Ionicons name="trophy" size={24} color="#F59E0B" />
            <Text style={styles.statNumber}>Top 15%</Text>
            <Text style={styles.statLabel}>Referrer Rank</Text>
          </View>
          
          <View style={styles.statCard}>
            <Ionicons name="flash" size={24} color="#EF4444" />
            <Text style={styles.statNumber}>7 days</Text>
            <Text style={styles.statLabel}>Login Streak</Text>
          </View>
          
          <View style={styles.statCard}>
            <Ionicons name="gift" size={24} color="#10B981" />
            <Text style={styles.statNumber}>12</Text>
            <Text style={styles.statLabel}>Bonuses Claimed</Text>
          </View>
          
          <View style={styles.statCard}>
            <Ionicons name="heart" size={24} color="#EF4444" />
            <Text style={styles.statNumber}>3</Text>
            <Text style={styles.statLabel}>Gifts Sent</Text>
          </View>
        </View>
      </View>

      {/* Full Tree Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={showTreeModal}
        onRequestClose={() => setShowTreeModal(false)}
      >
        <View style={styles.treeModalOverlay}>
          <View style={styles.treeModalContainer}>
            <View style={styles.treeModalHeader}>
              <Text style={styles.treeModalTitle}>🌳 Full Referral Tree</Text>
              <TouchableOpacity onPress={() => setShowTreeModal(false)}>
                <Ionicons name="close" size={24} color="#8B4513" />
              </TouchableOpacity>
            </View>

            <ScrollView 
              style={styles.treeModalContent}
              contentContainerStyle={styles.treeModalContentContainer}
              showsVerticalScrollIndicator={false}
            >
              <Text style={styles.treeDescription}>
                Your complete referral network
              </Text>
              
              {fullTreeData.map((generation, genIndex) => (
                <View key={genIndex} style={styles.generationContainer}>
                  <View style={styles.generationHeader}>
                    <Text style={styles.generationTitle}>
                      Generation {generation.generation}
                    </Text>
                    <Text style={styles.generationCount}>
                      {generation.referrals.length} people
                    </Text>
                  </View>
                  
                  {generation.referrals.map((referral, refIndex) => (
                    <View key={refIndex} style={styles.referralCard}>
                      <View style={styles.referralInfo}>
                        <View style={styles.referralHeader}>
                          <Text style={styles.referralName}>{referral.name}</Text>
                          <View style={[
                            styles.statusBadge,
                            referral.status === 'Active' ? styles.activeBadge : styles.newBadge
                          ]}>
                            <Text style={[
                              styles.statusText,
                              referral.status === 'Active' ? styles.activeText : styles.newText
                            ]}>
                              {referral.status}
                            </Text>
                          </View>
                        </View>
                        <View style={styles.referralDetails}>
                          <Text style={styles.referralEarnings}>{referral.earnings} TLB</Text>
                          <Text style={styles.referralJoined}>Joined: {referral.joined}</Text>
                        </View>
                      </View>
                    </View>
                  ))}
                </View>
              ))}
              
              {/* Summary Section */}
              <View style={styles.treeSummarySection}>
                <Text style={styles.treeSummaryTitle}>📊 Network Summary</Text>
                
                <View style={styles.treeSummaryGrid}>
                  <View style={styles.treeSummaryCard}>
                    <Text style={styles.treeSummaryNumber}>
                      {fullTreeData.reduce((total, gen) => total + gen.referrals.length, 0)}
                    </Text>
                    <Text style={styles.treeSummaryLabel}>Total People</Text>
                  </View>
                  
                  <View style={styles.treeSummaryCard}>
                    <Text style={styles.treeSummaryNumber}>💎 {referralStats.totalEarnings}</Text>
                    <Text style={styles.treeSummaryLabel}>Total Earnings</Text>
                  </View>
                  
                  <View style={styles.treeSummaryCard}>
                    <Text style={styles.treeSummaryNumber}>{fullTreeData.length}</Text>
                    <Text style={styles.treeSummaryLabel}>Generations</Text>
                  </View>
                </View>
                
                <View style={styles.commissionInfo}>
                  <Text style={styles.commissionTitle}>💰 Commission Rates</Text>
                  <View style={styles.commissionRow}>
                    <Text style={styles.commissionText}>• Generation 1: 50%</Text>
                    <Text style={styles.commissionText}>• Generation 2: 25%</Text>
                  </View>
                </View>
              </View>
            </ScrollView>

            <View style={styles.treeModalActions}>
              <TouchableOpacity 
                style={styles.treeActionButton}
                onPress={handleShareNetwork}
              >
                <Ionicons name="share" size={16} color="#FFFFFF" />
                <Text style={styles.treeActionText}>Share Network</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.treeActionButton, styles.exportButton]}
                onPress={handleExportData}
              >
                <Ionicons name="download" size={16} color="#FFFFFF" />
                <Text style={styles.treeActionText}>Export Data</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
  networkCard: {
    backgroundColor: '#F5E6A3',
    borderRadius: 16,
    padding: 20,
    margin: 20,
    borderWidth: 2,
    borderColor: '#D4AF37',
  },
  networkTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2C1810',
    marginBottom: 15,
  },
  networkStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  networkStat: {
    alignItems: 'center',
  },
  networkNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2C1810',
  },
  networkLabel: {
    fontSize: 12,
    color: '#8B4513',
    marginTop: 2,
  },
  shareButton: {
    backgroundColor: '#D4AF37',
    borderRadius: 8,
    padding: 12,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  shareButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    marginLeft: 8,
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2C1810',
    marginBottom: 15,
  },
  bonusCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#D4AF37',
  },
  bonusHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  bonusIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  bonusInfo: {
    flex: 1,
  },
  bonusTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2C1810',
  },
  bonusAmount: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#D4AF37',
  },
  bonusExpiry: {
    alignItems: 'flex-end',
  },
  expiryText: {
    fontSize: 10,
    color: '#8B4513',
  },
  expiryTime: {
    fontSize: 12,
    fontWeight: '600',
    color: '#EF4444',
  },
  bonusDescription: {
    fontSize: 14,
    color: '#8B4513',
    marginBottom: 10,
    lineHeight: 18,
  },
  giverInfo: {
    backgroundColor: '#F5E6A3',
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
  },
  giverText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#8B4513',
  },
  messageText: {
    fontSize: 12,
    color: '#8B4513',
    fontStyle: 'italic',
    marginTop: 2,
  },
  bonusActions: {
    flexDirection: 'row',
    gap: 10,
  },
  claimButton: {
    backgroundColor: '#D4AF37',
    borderRadius: 8,
    paddingHorizontal: 20,
    paddingVertical: 10,
    flex: 1,
  },
  claimButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    textAlign: 'center',
  },
  forwardButton: {
    backgroundColor: '#8B4513',
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  forwardButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  treeContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#D4AF37',
    marginBottom: 15,
  },
  generationRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F5E6A3',
  },
  generationInfo: {
    flex: 1,
  },
  generationLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2C1810',
  },
  generationCount: {
    fontSize: 12,
    color: '#8B4513',
  },
  generationEarnings: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#D4AF37',
  },
  viewTreeButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5E6A3',
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: '#D4AF37',
  },
  viewTreeText: {
    color: '#2C1810',
    fontWeight: '600',
    marginRight: 5,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 15,
    alignItems: 'center',
    width: '48%',
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#D4AF37',
  },
  statNumber: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2C1810',
    marginTop: 8,
  },
  statLabel: {
    fontSize: 12,
    color: '#8B4513',
    textAlign: 'center',
    marginTop: 2,
  },
  // Tree Modal Styles
  treeModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  treeModalContainer: {
    width: width * 0.95,
    maxHeight: '90%',
    backgroundColor: '#FFF8E7',
    borderRadius: 16,
    overflow: 'hidden',
  },
  treeModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#D4AF37',
  },
  treeModalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2C1810',
  },
  treeModalContent: {
    flex: 1,
  },
  treeModalContentContainer: {
    padding: 20,
    paddingBottom: 30,
  },
  treeDescription: {
    fontSize: 16,
    color: '#8B4513',
    marginBottom: 20,
    textAlign: 'center',
  },
  generationContainer: {
    marginBottom: 25,
  },
  generationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#F5E6A3',
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#D4AF37',
  },
  generationTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2C1810',
  },
  generationCount: {
    fontSize: 14,
    color: '#8B4513',
    fontWeight: '600',
  },
  referralCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#D4AF37',
    marginLeft: 15,
  },
  referralInfo: {
    flex: 1,
  },
  referralHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  referralName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#2C1810',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
  },
  activeBadge: {
    backgroundColor: '#10B981',
  },
  newBadge: {
    backgroundColor: '#F59E0B',
  },
  statusText: {
    fontSize: 11,
    fontWeight: '600',
  },
  activeText: {
    color: '#FFFFFF',
  },
  newText: {
    color: '#FFFFFF',
  },
  referralDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  referralEarnings: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#D4AF37',
  },
  referralJoined: {
    fontSize: 12,
    color: '#8B4513',
  },
  treeSummarySection: {
    marginTop: 20,
    backgroundColor: '#F5E6A3',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#D4AF37',
  },
  treeSummaryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2C1810',
    marginBottom: 15,
    textAlign: 'center',
  },
  treeSummaryGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  treeSummaryCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
    width: '31%',
    borderWidth: 1,
    borderColor: '#D4AF37',
  },
  treeSummaryNumber: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#D4AF37',
    marginBottom: 4,
  },
  treeSummaryLabel: {
    fontSize: 11,
    color: '#8B4513',
    textAlign: 'center',
  },
  commissionInfo: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: '#D4AF37',
  },
  commissionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#2C1810',
    marginBottom: 8,
    textAlign: 'center',
  },
  commissionRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  commissionText: {
    fontSize: 12,
    color: '#8B4513',
  },
  treeModalActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderTopWidth: 1,
    borderTopColor: '#D4AF37',
    gap: 10,
  },
  treeActionButton: {
    backgroundColor: '#D4AF37',
    borderRadius: 8,
    paddingHorizontal: 20,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  exportButton: {
    backgroundColor: '#8B4513',
  },
  treeActionText: {
    color: '#FFFFFF',
    fontWeight: '600',
    marginLeft: 8,
    fontSize: 14,
  },
});