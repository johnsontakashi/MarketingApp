import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Alert, Modal, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useCustomAlert } from '../hooks/useCustomAlert';
import CustomAlert from '../components/ui/CustomAlert';

const { width } = Dimensions.get('window');

export default function CommunityScreen() {
  const { alertConfig, showAlert, hideAlert, showInfo, showSuccess } = useCustomAlert();
  const [showTreeModal, setShowTreeModal] = useState(false);
  const [expandedGenerations, setExpandedGenerations] = useState({});
  const [selectedMember, setSelectedMember] = useState(null);
  const [showMemberDetail, setShowMemberDetail] = useState(false);
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
    showAlert({
      title: '🎯 Share Referral Code',
      message: 'Your referral code: JOHN2024\n\nShare this code with friends and earn rewards!',
      type: 'info',
      icon: 'share',
      buttons: [
        { 
          text: 'Copy Code', 
          onPress: () => {
            showSuccess('✅ Copied!', 'Referral code copied to clipboard');
          }
        },
        { 
          text: 'Share', 
          onPress: () => {
            showSuccess('📤 Shared!', 'Referral code shared successfully');
          }
        },
        { text: 'Close', style: 'cancel' }
      ]
    });
  };

  const [fullTreeData] = useState([
    {
      generation: 1,
      totalEarnings: 25.00,
      commissionRate: 50,
      referrals: [
        { 
          id: 1,
          name: 'Sarah M.', 
          joined: '2024-01-15', 
          earnings: 8.50, 
          status: 'Active',
          avatar: '👩',
          totalPurchases: 3,
          totalSpent: 285.00,
          lastActivity: '2 hours ago',
          referredBy: 'You',
          location: 'New York, USA',
          memberSince: '8 months'
        },
        { 
          id: 2,
          name: 'Mike K.', 
          joined: '2024-01-20', 
          earnings: 5.20, 
          status: 'Active',
          avatar: '👨',
          totalPurchases: 2,
          totalSpent: 180.00,
          lastActivity: '1 day ago',
          referredBy: 'You',
          location: 'California, USA',
          memberSince: '7 months'
        },
        { 
          id: 3,
          name: 'Emma L.', 
          joined: '2024-02-03', 
          earnings: 6.80, 
          status: 'Active',
          avatar: '👩',
          totalPurchases: 4,
          totalSpent: 320.00,
          lastActivity: '3 hours ago',
          referredBy: 'You',
          location: 'Texas, USA',
          memberSince: '6 months'
        },
        { 
          id: 4,
          name: 'David R.', 
          joined: '2024-02-10', 
          earnings: 2.40, 
          status: 'New',
          avatar: '👨',
          totalPurchases: 1,
          totalSpent: 75.00,
          lastActivity: '1 week ago',
          referredBy: 'You',
          location: 'Florida, USA',
          memberSince: '3 months'
        },
        { 
          id: 5,
          name: 'Lisa P.', 
          joined: '2024-02-15', 
          earnings: 2.10, 
          status: 'New',
          avatar: '👩',
          totalPurchases: 1,
          totalSpent: 65.00,
          lastActivity: '3 days ago',
          referredBy: 'You',
          location: 'Illinois, USA',
          memberSince: '3 months'
        }
      ]
    },
    {
      generation: 2,
      totalEarnings: 15.00,
      commissionRate: 25,
      referrals: [
        { 
          id: 6,
          name: 'Alex T.', 
          joined: '2024-01-25', 
          earnings: 3.20, 
          status: 'Active',
          avatar: '👨',
          totalPurchases: 2,
          totalSpent: 150.00,
          lastActivity: '5 hours ago',
          referredBy: 'Sarah M.',
          location: 'Nevada, USA',
          memberSince: '6 months'
        },
        { 
          id: 7,
          name: 'Nina S.', 
          joined: '2024-02-01', 
          earnings: 2.80, 
          status: 'Active',
          avatar: '👩',
          totalPurchases: 3,
          totalSpent: 210.00,
          lastActivity: '1 day ago',
          referredBy: 'Mike K.',
          location: 'Washington, USA',
          memberSince: '5 months'
        },
        { 
          id: 8,
          name: 'James W.', 
          joined: '2024-02-05', 
          earnings: 2.10, 
          status: 'Active',
          avatar: '👨',
          totalPurchases: 1,
          totalSpent: 95.00,
          lastActivity: '2 days ago',
          referredBy: 'Emma L.',
          location: 'Oregon, USA',
          memberSince: '5 months'
        },
        { 
          id: 9,
          name: 'Maria G.', 
          joined: '2024-02-12', 
          earnings: 1.90, 
          status: 'New',
          avatar: '👩',
          totalPurchases: 1,
          totalSpent: 85.00,
          lastActivity: '4 days ago',
          referredBy: 'David R.',
          location: 'Arizona, USA',
          memberSince: '4 months'
        },
        { 
          id: 10,
          name: 'Tom H.', 
          joined: '2024-02-18', 
          earnings: 1.50, 
          status: 'New',
          avatar: '👨',
          totalPurchases: 1,
          totalSpent: 55.00,
          lastActivity: '1 week ago',
          referredBy: 'Lisa P.',
          location: 'Colorado, USA',
          memberSince: '3 months'
        },
        { 
          id: 11,
          name: 'Kate B.', 
          joined: '2024-02-20', 
          earnings: 1.20, 
          status: 'New',
          avatar: '👩',
          totalPurchases: 1,
          totalSpent: 45.00,
          lastActivity: '5 days ago',
          referredBy: 'Sarah M.',
          location: 'Utah, USA',
          memberSince: '3 months'
        },
        { 
          id: 12,
          name: 'Ryan C.', 
          joined: '2024-02-22', 
          earnings: 1.30, 
          status: 'New',
          avatar: '👨',
          totalPurchases: 1,
          totalSpent: 60.00,
          lastActivity: '2 weeks ago',
          referredBy: 'Mike K.',
          location: 'Georgia, USA',
          memberSince: '2 months'
        }
      ]
    },
    {
      generation: 3,
      totalEarnings: 5.00,
      commissionRate: 12.5,
      referrals: [
        { 
          id: 13,
          name: 'Jessica R.', 
          joined: '2024-03-01', 
          earnings: 1.80, 
          status: 'Active',
          avatar: '👩',
          totalPurchases: 2,
          totalSpent: 125.00,
          lastActivity: '1 day ago',
          referredBy: 'Alex T.',
          location: 'Michigan, USA',
          memberSince: '2 months'
        },
        { 
          id: 14,
          name: 'Carlos M.', 
          joined: '2024-03-05', 
          earnings: 1.20, 
          status: 'New',
          avatar: '👨',
          totalPurchases: 1,
          totalSpent: 75.00,
          lastActivity: '3 days ago',
          referredBy: 'Nina S.',
          location: 'Pennsylvania, USA',
          memberSince: '2 months'
        },
        { 
          id: 15,
          name: 'Sophie L.', 
          joined: '2024-03-10', 
          earnings: 2.00, 
          status: 'Active',
          avatar: '👩',
          totalPurchases: 2,
          totalSpent: 140.00,
          lastActivity: '6 hours ago',
          referredBy: 'James W.',
          location: 'Ohio, USA',
          memberSince: '1 month'
        }
      ]
    }
  ]);

  const handleViewFullTree = () => {
    setShowTreeModal(true);
    // Initialize all generations as expanded
    const initialExpanded = {};
    fullTreeData.forEach(gen => {
      initialExpanded[gen.generation] = true;
    });
    setExpandedGenerations(initialExpanded);
  };

  const toggleGeneration = (generation) => {
    setExpandedGenerations(prev => ({
      ...prev,
      [generation]: !prev[generation]
    }));
  };

  const handleMemberPress = (member) => {
    setSelectedMember(member);
    setShowMemberDetail(true);
  };

  const handleShareNetwork = () => {
    const totalMembers = fullTreeData.reduce((sum, gen) => sum + gen.referrals.length, 0);
    const totalEarnings = fullTreeData.reduce((sum, gen) => sum + gen.totalEarnings, 0);
    
    Alert.alert(
      '🌐 Share Your Network',
      `Share your amazing referral network!\n\n📊 Network Stats:\n• ${totalMembers} total members\n• 💎 ${totalEarnings.toFixed(2)} TLB earned\n• ${fullTreeData.length} generations deep\n\nYour referral code: JOHN2024`,
      [
        { text: 'Copy Link', onPress: () => Alert.alert('✅ Copied', 'Network link copied to clipboard!') },
        { text: 'Share', onPress: () => Alert.alert('📤 Shared', 'Network shared successfully!') },
        { text: 'Close', style: 'cancel' }
      ]
    );
  };

  const handleExportData = () => {
    const totalMembers = fullTreeData.reduce((sum, gen) => sum + gen.referrals.length, 0);
    const totalEarnings = fullTreeData.reduce((sum, gen) => sum + gen.totalEarnings, 0);
    
    Alert.alert(
      '📊 Export Network Data',
      'Choose your export format:',
      [
        { 
          text: 'PDF Report', 
          onPress: () => {
            setTimeout(() => {
              Alert.alert(
                '✅ Export Complete!',
                `Network report exported successfully!\n\n📄 Format: PDF\n👥 Members: ${totalMembers}\n💎 Total Earnings: ${totalEarnings.toFixed(2)} TLB\n📅 Export Date: ${new Date().toLocaleDateString()}\n\nFile saved to Downloads folder.`
              );
            }, 1000);
          }
        },
        { 
          text: 'CSV Data', 
          onPress: () => {
            setTimeout(() => {
              Alert.alert(
                '✅ Export Complete!',
                `Network data exported successfully!\n\n📄 Format: CSV\n👥 Members: ${totalMembers}\n💎 Total Earnings: ${totalEarnings.toFixed(2)} TLB\n📅 Export Date: ${new Date().toLocaleDateString()}\n\nFile saved to Downloads folder.`
              );
            }, 1000);
          }
        },
        { text: 'Cancel', style: 'cancel' }
      ]
    );
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
        animationType="fade"
        transparent={true}
        visible={showTreeModal}
        onRequestClose={() => setShowTreeModal(false)}
        statusBarTranslucent={true}
      >
        <View style={styles.treeModalOverlay}>
          <View style={styles.treeModalContainer}>
            <View style={styles.treeModalHeader}>
              <Text style={styles.treeModalTitle}>🌳 Full Referral Tree</Text>
              <TouchableOpacity 
                style={styles.treeModalCloseButton}
                onPress={() => setShowTreeModal(false)}
              >
                <Ionicons name="close" size={24} color="#8B4513" />
              </TouchableOpacity>
            </View>

            {/* Tree Summary */}
            <View style={styles.treeQuickStats}>
              <View style={styles.quickStatItem}>
                <Text style={styles.quickStatNumber}>
                  {fullTreeData.reduce((total, gen) => total + gen.referrals.length, 0)}
                </Text>
                <Text style={styles.quickStatLabel}>Total Members</Text>
              </View>
              <View style={styles.quickStatItem}>
                <Text style={styles.quickStatNumber}>
                  💎 {fullTreeData.reduce((sum, gen) => sum + gen.totalEarnings, 0).toFixed(2)}
                </Text>
                <Text style={styles.quickStatLabel}>Total Earnings</Text>
              </View>
              <View style={styles.quickStatItem}>
                <Text style={styles.quickStatNumber}>{fullTreeData.length}</Text>
                <Text style={styles.quickStatLabel}>Generations</Text>
              </View>
            </View>

            <ScrollView 
              style={styles.treeModalContent}
              contentContainerStyle={styles.treeModalContentContainer}
              showsVerticalScrollIndicator={false}
            >
              {fullTreeData.map((generation, genIndex) => (
                <View key={genIndex} style={styles.generationContainer}>
                  <TouchableOpacity 
                    style={styles.generationHeader}
                    onPress={() => toggleGeneration(generation.generation)}
                  >
                    <View style={styles.generationInfo}>
                      <Text style={styles.generationTitle}>
                        🏆 Generation {generation.generation}
                      </Text>
                      <Text style={styles.generationSubtitle}>
                        {generation.referrals.length} members • {generation.commissionRate}% commission • 💎 {generation.totalEarnings.toFixed(2)} TLB
                      </Text>
                    </View>
                    <Ionicons 
                      name={expandedGenerations[generation.generation] ? "chevron-up" : "chevron-down"} 
                      size={20} 
                      color="#8B4513" 
                    />
                  </TouchableOpacity>
                  
                  {expandedGenerations[generation.generation] && (
                    <View style={styles.generationMembers}>
                      {generation.referrals.map((referral, refIndex) => (
                        <TouchableOpacity 
                          key={refIndex} 
                          style={styles.referralCard}
                          onPress={() => handleMemberPress(referral)}
                        >
                          <View style={styles.referralAvatar}>
                            <Text style={styles.avatarEmoji}>{referral.avatar}</Text>
                          </View>
                          
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
                              <Text style={styles.referralEarnings}>💎 {referral.earnings.toFixed(2)} TLB</Text>
                              <Text style={styles.referralActivity}>{referral.lastActivity}</Text>
                            </View>
                            <View style={styles.referralMeta}>
                              <Text style={styles.referralLocation}>📍 {referral.location}</Text>
                              <Text style={styles.referralPurchases}>🛒 {referral.totalPurchases} purchases</Text>
                            </View>
                          </View>
                          
                          <View style={styles.referralActions}>
                            <Ionicons name="chevron-forward" size={16} color="#D4AF37" />
                          </View>
                        </TouchableOpacity>
                      ))}
                    </View>
                  )}
                </View>
              ))}
              
              {/* Enhanced Summary Section */}
              <View style={styles.treeSummarySection}>
                <Text style={styles.treeSummaryTitle}>📊 Network Analytics</Text>
                
                <View style={styles.analyticsGrid}>
                  {fullTreeData.map((gen, index) => (
                    <View key={index} style={styles.analyticsCard}>
                      <Text style={styles.analyticsGeneration}>Gen {gen.generation}</Text>
                      <Text style={styles.analyticsMembers}>{gen.referrals.length} members</Text>
                      <Text style={styles.analyticsEarnings}>💎 {gen.totalEarnings.toFixed(2)}</Text>
                      <Text style={styles.analyticsRate}>{gen.commissionRate}% rate</Text>
                    </View>
                  ))}
                </View>

                <View style={styles.performanceStats}>
                  <Text style={styles.performanceTitle}>🎯 Performance Insights</Text>
                  <View style={styles.performanceItem}>
                    <Text style={styles.performanceLabel}>Most Active Generation:</Text>
                    <Text style={styles.performanceValue}>
                      Generation {fullTreeData.find(gen => 
                        gen.referrals.filter(r => r.status === 'Active').length === 
                        Math.max(...fullTreeData.map(g => g.referrals.filter(r => r.status === 'Active').length))
                      )?.generation || 1}
                    </Text>
                  </View>
                  <View style={styles.performanceItem}>
                    <Text style={styles.performanceLabel}>Average Earnings per Member:</Text>
                    <Text style={styles.performanceValue}>
                      💎 {(fullTreeData.reduce((sum, gen) => sum + gen.totalEarnings, 0) / 
                        fullTreeData.reduce((sum, gen) => sum + gen.referrals.length, 0)).toFixed(2)}
                    </Text>
                  </View>
                </View>
              </View>
            </ScrollView>

            <View style={styles.treeModalActions}>
              <TouchableOpacity 
                style={styles.treeActionButton}
                onPress={handleShareNetwork}
              >
                <Ionicons name="share" size={18} color="#FFFFFF" />
                <Text style={styles.treeActionText}>Share Network</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.treeActionButton, styles.exportButton]}
                onPress={handleExportData}
              >
                <Ionicons name="download" size={18} color="#FFFFFF" />
                <Text style={styles.treeActionText}>Export Data</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Member Detail Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={showMemberDetail}
        onRequestClose={() => setShowMemberDetail(false)}
        statusBarTranslucent={true}
      >
        <View style={styles.memberModalOverlay}>
          <View style={styles.memberModalContainer}>
            <View style={styles.memberModalHeader}>
              <Text style={styles.memberModalTitle}>👤 Member Details</Text>
              <TouchableOpacity 
                style={styles.memberModalCloseButton}
                onPress={() => setShowMemberDetail(false)}
              >
                <Ionicons name="close" size={24} color="#8B4513" />
              </TouchableOpacity>
            </View>
            
            {selectedMember && (
              <ScrollView style={styles.memberModalContent} showsVerticalScrollIndicator={false}>
                <View style={styles.memberProfile}>
                  <Text style={styles.memberAvatar}>{selectedMember.avatar}</Text>
                  <Text style={styles.memberName}>{selectedMember.name}</Text>
                  <View style={[
                    styles.memberStatusBadge,
                    selectedMember.status === 'Active' ? styles.activeBadge : styles.newBadge
                  ]}>
                    <Text style={[
                      styles.memberStatusText,
                      selectedMember.status === 'Active' ? styles.activeText : styles.newText
                    ]}>
                      {selectedMember.status}
                    </Text>
                  </View>
                </View>

                <View style={styles.memberStats}>
                  <View style={styles.memberStatCard}>
                    <Text style={styles.memberStatNumber}>💎 {selectedMember.earnings.toFixed(2)}</Text>
                    <Text style={styles.memberStatLabel}>Earnings Generated</Text>
                  </View>
                  <View style={styles.memberStatCard}>
                    <Text style={styles.memberStatNumber}>{selectedMember.totalPurchases}</Text>
                    <Text style={styles.memberStatLabel}>Total Purchases</Text>
                  </View>
                  <View style={styles.memberStatCard}>
                    <Text style={styles.memberStatNumber}>${selectedMember.totalSpent.toFixed(2)}</Text>
                    <Text style={styles.memberStatLabel}>Total Spent</Text>
                  </View>
                </View>

                <View style={styles.memberDetails}>
                  <View style={styles.memberDetailItem}>
                    <Ionicons name="calendar" size={16} color="#8B4513" />
                    <Text style={styles.memberDetailLabel}>Member Since:</Text>
                    <Text style={styles.memberDetailValue}>{selectedMember.memberSince}</Text>
                  </View>
                  <View style={styles.memberDetailItem}>
                    <Ionicons name="time" size={16} color="#8B4513" />
                    <Text style={styles.memberDetailLabel}>Last Activity:</Text>
                    <Text style={styles.memberDetailValue}>{selectedMember.lastActivity}</Text>
                  </View>
                  <View style={styles.memberDetailItem}>
                    <Ionicons name="location" size={16} color="#8B4513" />
                    <Text style={styles.memberDetailLabel}>Location:</Text>
                    <Text style={styles.memberDetailValue}>{selectedMember.location}</Text>
                  </View>
                  <View style={styles.memberDetailItem}>
                    <Ionicons name="person" size={16} color="#8B4513" />
                    <Text style={styles.memberDetailLabel}>Referred By:</Text>
                    <Text style={styles.memberDetailValue}>{selectedMember.referredBy}</Text>
                  </View>
                  <View style={styles.memberDetailItem}>
                    <Ionicons name="bag" size={16} color="#8B4513" />
                    <Text style={styles.memberDetailLabel}>Joined:</Text>
                    <Text style={styles.memberDetailValue}>{selectedMember.joined}</Text>
                  </View>
                </View>

                <View style={styles.memberActions}>
                  <TouchableOpacity 
                    style={styles.memberActionButton}
                    onPress={() => {
                      setShowMemberDetail(false);
                      Alert.alert('📞 Contact', `Contact ${selectedMember.name} feature coming soon!`);
                    }}
                  >
                    <Ionicons name="chatbubble" size={16} color="#FFFFFF" />
                    <Text style={styles.memberActionText}>Contact</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity 
                    style={[styles.memberActionButton, styles.giftActionButton]}
                    onPress={() => {
                      setShowMemberDetail(false);
                      Alert.alert('🎁 Send Gift', `Send a gift to ${selectedMember.name} feature coming soon!`);
                    }}
                  >
                    <Ionicons name="gift" size={16} color="#FFFFFF" />
                    <Text style={styles.memberActionText}>Send Gift</Text>
                  </TouchableOpacity>
                </View>
              </ScrollView>
            )}
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
    justifyContent: 'space-between',
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
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    justifyContent: 'flex-end',
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  treeModalContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 20,
    maxHeight: '92%',
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: '#D4AF37',
  },
  treeModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 20,
    backgroundColor: '#F5E6A3',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(212, 175, 55, 0.3)',
  },
  treeModalTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#2C1810',
    letterSpacing: 0.5,
  },
  treeModalCloseButton: {
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
  treeQuickStats: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    paddingVertical: 16,
    backgroundColor: '#FAFAFA',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(229, 231, 235, 0.6)',
  },
  quickStatItem: {
    flex: 1,
    alignItems: 'center',
  },
  quickStatNumber: {
    fontSize: 18,
    fontWeight: '700',
    color: '#D4AF37',
    marginBottom: 4,
  },
  quickStatLabel: {
    fontSize: 11,
    color: '#8B4513',
    textAlign: 'center',
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
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1.5,
    borderColor: '#D4AF37',
    shadowColor: 'rgba(212, 175, 55, 0.2)',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 3,
  },
  generationInfo: {
    flex: 1,
  },
  generationTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#2C1810',
    marginBottom: 4,
  },
  generationSubtitle: {
    fontSize: 13,
    color: '#8B4513',
    fontWeight: '500',
  },
  generationMembers: {
    paddingLeft: 16,
    marginBottom: 16,
  },
  referralAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#F5E6A3',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    borderWidth: 2,
    borderColor: '#D4AF37',
  },
  avatarEmoji: {
    fontSize: 20,
  },
  referralCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: 'rgba(0, 0, 0, 0.05)',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
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
  referralActivity: {
    fontSize: 12,
    color: '#6B7280',
  },
  referralMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  referralLocation: {
    fontSize: 11,
    color: '#9CA3AF',
  },
  referralPurchases: {
    fontSize: 11,
    color: '#9CA3AF',
  },
  referralActions: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingLeft: 8,
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
    marginHorizontal: 5,
  },
  exportButton: {
    backgroundColor: '#8B4513',
  },
  treeActionText: {
    color: '#FFFFFF',
    fontWeight: '700',
    marginLeft: 8,
    fontSize: 16,
    letterSpacing: 0.4,
  },

  // Analytics Styles
  analyticsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  analyticsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 12,
    alignItems: 'center',
    width: '30%',
    borderWidth: 1,
    borderColor: '#D4AF37',
    marginBottom: 8,
  },
  analyticsGeneration: {
    fontSize: 12,
    fontWeight: '700',
    color: '#D4AF37',
    marginBottom: 4,
  },
  analyticsMembers: {
    fontSize: 11,
    color: '#2C1810',
    marginBottom: 2,
  },
  analyticsEarnings: {
    fontSize: 11,
    fontWeight: '600',
    color: '#10B981',
    marginBottom: 2,
  },
  analyticsRate: {
    fontSize: 10,
    color: '#8B4513',
  },
  performanceStats: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 12,
    borderWidth: 1,
    borderColor: '#D4AF37',
  },
  performanceTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#2C1810',
    marginBottom: 8,
    textAlign: 'center',
  },
  performanceItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  performanceLabel: {
    fontSize: 12,
    color: '#8B4513',
    flex: 1,
  },
  performanceValue: {
    fontSize: 12,
    fontWeight: '600',
    color: '#D4AF37',
  },

  // Member Detail Modal Styles
  memberModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  memberModalContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    width: '100%',
    maxWidth: 400,
    maxHeight: '85%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 20,
    borderWidth: 2,
    borderColor: '#D4AF37',
    overflow: 'hidden',
  },
  memberModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#F5E6A3',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(212, 175, 55, 0.3)',
  },
  memberModalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#2C1810',
  },
  memberModalCloseButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(212, 175, 55, 0.6)',
  },
  memberModalContent: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  memberProfile: {
    alignItems: 'center',
    marginBottom: 20,
  },
  memberAvatar: {
    fontSize: 48,
    marginBottom: 8,
  },
  memberName: {
    fontSize: 22,
    fontWeight: '700',
    color: '#2C1810',
    marginBottom: 8,
  },
  memberStatusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 16,
  },
  memberStatusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  memberStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  memberStatCard: {
    backgroundColor: '#F5E6A3',
    borderRadius: 10,
    padding: 12,
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 4,
    borderWidth: 1,
    borderColor: '#D4AF37',
  },
  memberStatNumber: {
    fontSize: 16,
    fontWeight: '700',
    color: '#2C1810',
    marginBottom: 4,
  },
  memberStatLabel: {
    fontSize: 10,
    color: '#8B4513',
    textAlign: 'center',
  },
  memberDetails: {
    marginBottom: 20,
  },
  memberDetailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  memberDetailLabel: {
    fontSize: 14,
    color: '#8B4513',
    marginLeft: 8,
    flex: 1,
  },
  memberDetailValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2C1810',
  },
  memberActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  memberActionButton: {
    flex: 1,
    backgroundColor: '#D4AF37',
    borderRadius: 12,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#B8860B',
    marginHorizontal: 6,
  },
  giftActionButton: {
    backgroundColor: '#10B981',
    borderColor: '#059669',
  },
  memberActionText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 6,
  },
});