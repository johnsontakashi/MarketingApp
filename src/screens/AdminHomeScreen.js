import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  ScrollView, 
  TouchableOpacity, 
  StyleSheet,
  Dimensions,
  Alert,
  RefreshControl
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { CommonActions } from '@react-navigation/native';
import sharedDataService from '../services/sharedDataService';

const { width } = Dimensions.get('window');

export default function AdminHomeScreen({ navigation }) {
  const [refreshing, setRefreshing] = useState(false);
  const [dashboardData, setDashboardData] = useState({
    totalUsers: 0,
    activeUsers: 0,
    totalOrders: 0,
    pendingOrders: 0,
    totalRevenue: 0,
    monthlyRevenue: 0,
    totalProducts: 0,
    lowStockProducts: 0,
    totalDevices: 0,
    onlineDevices: 0,
    supportTickets: 0,
    systemAlerts: 0
  });

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      // Load real data from shared data service
      const stats = await sharedDataService.getDashboardStats();
      setDashboardData(stats);
      console.log('Loaded real dashboard statistics:', stats);
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
      // Fallback to basic stats if shared data fails
      setDashboardData({
        totalUsers: 0,
        activeUsers: 0,
        totalOrders: 0,
        pendingOrders: 0,
        totalRevenue: 0,
        monthlyRevenue: 0,
        totalProducts: 0,
        lowStockProducts: 0,
        totalDevices: 0,
        onlineDevices: 0,
        supportTickets: 0,
        systemAlerts: 0
      });
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadDashboardData();
    setRefreshing(false);
  };

  const handleNavigation = (route, title) => {
    console.log(`Navigating to: ${route}`);
    
    // Tab routes - navigate directly within the tab navigator
    const tabRoutes = ['Users', 'Products', 'Devices', 'Settings'];
    
    // Stack routes - navigate to the parent stack navigator
    const stackRoutes = [
      'OrderManagement', 
      'FinancialDashboard', 
      'SystemLogs', 
      'AdminReports',
      'UserLookup',
      'AddProduct', 
      'SendNotification',
      'SupportCenter'
    ];
    
    try {
      if (tabRoutes.includes(route)) {
        // Navigate to tab screen
        navigation.navigate(route);
      } else if (stackRoutes.includes(route)) {
        // Navigate to stack screen - get parent navigator
        const parent = navigation.getParent();
        if (parent) {
          parent.navigate(route);
        } else {
          console.error('Parent navigator not found');
          Alert.alert('Navigation Error', 'Unable to navigate to screen');
        }
      } else {
        console.error(`Unknown route: ${route}`);
        Alert.alert('Navigation Error', `Screen "${route}" not found`);
      }
    } catch (error) {
      console.error('Navigation error:', error);
      Alert.alert('Navigation Error', error.message);
    }
  };

  const AdminCard = ({ title, value, subtext, icon, color, onPress, alert = false }) => (
    <TouchableOpacity 
      style={[styles.adminCard, alert && styles.alertCard]} 
      onPress={onPress}
      activeOpacity={0.8}
    >
      <View style={styles.cardHeader}>
        <View style={[styles.iconContainer, { backgroundColor: color + '20' }]}>
          <Ionicons name={icon} size={24} color={color} />
        </View>
        {alert && (
          <View style={styles.alertBadge}>
            <Ionicons name="warning" size={14} color="#FF4444" />
          </View>
        )}
      </View>
      <Text style={styles.cardTitle}>{title}</Text>
      <Text style={[styles.cardValue, alert && styles.alertValue]}>{value}</Text>
      {subtext && <Text style={styles.cardSubtext}>{subtext}</Text>}
    </TouchableOpacity>
  );

  const QuickAction = ({ title, icon, color, onPress }) => (
    <TouchableOpacity style={styles.quickAction} onPress={onPress} activeOpacity={0.7}>
      <View style={[styles.actionIcon, { backgroundColor: color }]}>
        <Ionicons name={icon} size={20} color="#FFFFFF" />
      </View>
      <Text style={styles.actionText}>{title}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <StatusBar style="dark" backgroundColor="#1a1a1a" />
      
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <View>
            <Text style={styles.headerTitle}>Admin Dashboard</Text>
            <Text style={styles.headerSubtitle}>TLB Diamond Control Center</Text>
          </View>
          <View style={styles.headerActions}>
            <TouchableOpacity 
              style={styles.notificationButton} 
              onPress={() => {
                console.log('Notifications button pressed');
                Alert.alert('Notifications', 'Notification center coming soon!');
              }}
              activeOpacity={0.7}
            >
              <Ionicons name="notifications" size={24} color="#D4AF37" />
              {dashboardData.systemAlerts > 0 && (
                <View style={styles.notificationBadge}>
                  <Text style={styles.badgeText}>{dashboardData.systemAlerts}</Text>
                </View>
              )}
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.settingsButton} 
              onPress={() => handleNavigation('Settings', 'Admin Settings')}
              activeOpacity={0.7}
            >
              <Ionicons name="settings" size={24} color="#D4AF37" />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <ScrollView 
        style={styles.scrollView}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        showsVerticalScrollIndicator={false}
      >
        {/* System Status */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📊 System Overview</Text>
          <View style={styles.cardGrid}>
            <AdminCard
              title="Total Users"
              value={dashboardData.totalUsers.toLocaleString()}
              subtext={`${dashboardData.activeUsers} active`}
              icon="people"
              color="#10B981"
              onPress={() => handleNavigation('Users', 'User Management')}
            />
            <AdminCard
              title="Orders"
              value={dashboardData.totalOrders.toLocaleString()}
              subtext={`${dashboardData.pendingOrders} pending`}
              icon="receipt"
              color="#3B82F6"
              onPress={() => handleNavigation('OrderManagement', 'Order Management')}
              alert={dashboardData.pendingOrders > 20}
            />
            <AdminCard
              title="Revenue"
              value={`$${dashboardData.totalRevenue.toLocaleString()}`}
              subtext={`$${dashboardData.monthlyRevenue.toLocaleString()} this month`}
              icon="trending-up"
              color="#D4AF37"
              onPress={() => handleNavigation('FinancialDashboard', 'Financial Dashboard')}
            />
            <AdminCard
              title="Products"
              value={dashboardData.totalProducts.toString()}
              subtext={`${dashboardData.lowStockProducts} low stock`}
              icon="cube"
              color="#8B5CF6"
              onPress={() => handleNavigation('Products', 'Product Management')}
              alert={dashboardData.lowStockProducts > 5}
            />
          </View>
        </View>

        {/* Device Management */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📱 Device Management (MDM)</Text>
          <View style={styles.cardGrid}>
            <AdminCard
              title="Total Devices"
              value={dashboardData.totalDevices.toString()}
              subtext={`${dashboardData.onlineDevices} online`}
              icon="phone-portrait"
              color="#F59E0B"
              onPress={() => handleNavigation('Devices', 'Device Management')}
            />
            <AdminCard
              title="Support Tickets"
              value={dashboardData.supportTickets.toString()}
              subtext="Active tickets"
              icon="help-circle"
              color="#EF4444"
              onPress={() => handleNavigation('SupportCenter', 'Support Center')}
              alert={dashboardData.supportTickets > 10}
            />
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>⚡ Quick Actions</Text>
          <View style={styles.quickActionsGrid}>
            <QuickAction
              title="Add Product"
              icon="add-circle"
              color="#10B981"
              onPress={() => handleNavigation('Products', 'Add Product')}
            />
            <QuickAction
              title="User Lookup"
              icon="search"
              color="#3B82F6"
              onPress={() => handleNavigation('Users', 'User Lookup')}
            />
            <QuickAction
              title="System Logs"
              icon="document-text"
              color="#8B5CF6"
              onPress={() => handleNavigation('SystemLogs', 'System Logs')}
            />
            <QuickAction
              title="Backup Data"
              icon="cloud-upload"
              color="#F59E0B"
              onPress={() => Alert.alert('Backup', 'Database backup initiated')}
            />
            <QuickAction
              title="Send Alert"
              icon="megaphone"
              color="#EF4444"
              onPress={() => handleNavigation('SendNotification', 'Send Notification')}
            />
            <QuickAction
              title="Reports"
              icon="bar-chart"
              color="#6366F1"
              onPress={() => handleNavigation('AdminReports', 'Admin Reports')}
            />
          </View>
        </View>

        {/* Recent Activity */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📈 Recent Activity</Text>
          <View style={styles.activityCard}>
            <View style={styles.activityItem}>
              <View style={styles.activityIcon}>
                <Ionicons name="person-add" size={16} color="#10B981" />
              </View>
              <View style={styles.activityContent}>
                <Text style={styles.activityText}>5 new users registered</Text>
                <Text style={styles.activityTime}>2 minutes ago</Text>
              </View>
            </View>
            <View style={styles.activityItem}>
              <View style={styles.activityIcon}>
                <Ionicons name="card" size={16} color="#3B82F6" />
              </View>
              <View style={styles.activityContent}>
                <Text style={styles.activityText}>12 orders completed</Text>
                <Text style={styles.activityTime}>15 minutes ago</Text>
              </View>
            </View>
            <View style={styles.activityItem}>
              <View style={styles.activityIcon}>
                <Ionicons name="warning" size={16} color="#EF4444" />
              </View>
              <View style={styles.activityContent}>
                <Text style={styles.activityText}>Device offline alert</Text>
                <Text style={styles.activityTime}>1 hour ago</Text>
              </View>
            </View>
          </View>
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a1a',
  },
  header: {
    backgroundColor: '#2d2d2d',
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#3d3d3d',
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#D4AF37',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#9CA3AF',
    marginTop: 2,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  notificationButton: {
    marginRight: 15,
    position: 'relative',
  },
  notificationBadge: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: '#EF4444',
    borderRadius: 10,
    minWidth: 18,
    height: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: 'bold',
  },
  settingsButton: {},
  scrollView: {
    flex: 1,
  },
  section: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 16,
  },
  cardGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  adminCard: {
    width: (width - 60) / 2,
    backgroundColor: '#2d2d2d',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#3d3d3d',
    position: 'relative',
  },
  alertCard: {
    borderColor: '#EF4444',
    backgroundColor: '#2d1f1f',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  alertBadge: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#2d1f1f',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#EF4444',
  },
  cardTitle: {
    fontSize: 14,
    color: '#9CA3AF',
    marginBottom: 4,
  },
  cardValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  alertValue: {
    color: '#EF4444',
  },
  cardSubtext: {
    fontSize: 12,
    color: '#6B7280',
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  quickAction: {
    width: (width - 60) / 3,
    alignItems: 'center',
    marginBottom: 20,
  },
  actionIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  actionText: {
    fontSize: 12,
    color: '#9CA3AF',
    textAlign: 'center',
  },
  activityCard: {
    backgroundColor: '#2d2d2d',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#3d3d3d',
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  activityIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#3d3d3d',
    marginRight: 12,
  },
  activityContent: {
    flex: 1,
  },
  activityText: {
    fontSize: 14,
    color: '#FFFFFF',
    marginBottom: 2,
  },
  activityTime: {
    fontSize: 12,
    color: '#6B7280',
  },
});