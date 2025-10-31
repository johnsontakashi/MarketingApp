import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function CommunityScreen() {
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
        
        <TouchableOpacity style={styles.viewTreeButton}>
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
});