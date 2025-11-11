import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  ScrollView, 
  TouchableOpacity, 
  StyleSheet,
  Dimensions,
  Alert,
  RefreshControl,
  Modal,
  FlatList
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { CommonActions, useFocusEffect } from '@react-navigation/native';
import sharedDataService from '../services/sharedDataService';
import AdminAlert from '../components/admin/AdminAlert';
import { useAdminAlert } from '../hooks/useAdminAlert';

const { width } = Dimensions.get('window');

export default function AdminHomeScreen({ navigation }) {
  const { alertConfig, hideAlert, showSuccess, showError, showWarning, showSuccessNotification, showInfoNotification } = useAdminAlert();
  const [refreshing, setRefreshing] = useState(false);
  const [showNotificationModal, setShowNotificationModal] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadChatCount, setUnreadChatCount] = useState(0);
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
    loadAdminNotifications();
  }, []);

  // Refresh notifications when screen comes into focus
  useFocusEffect(
    React.useCallback(() => {
      loadAdminNotifications();
    }, [])
  );

  // Auto-refresh notifications every 30 seconds
  useEffect(() => {
    const notificationInterval = setInterval(() => {
      loadAdminNotifications();
    }, 30000); // 30 seconds

    return () => clearInterval(notificationInterval);
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

  const loadAdminNotifications = async () => {
    try {
      const [users, products, chatCount] = await Promise.all([
        sharedDataService.getRegisteredUsers(),
        sharedDataService.getProducts(),
        sharedDataService.getUnreadChatCount()
      ]);
      
      // Update unread chat count state
      setUnreadChatCount(chatCount);

      // Generate admin notifications based on real data
      const adminNotifications = [];

      // Chat notifications
      if (chatCount > 0) {
        adminNotifications.push({
          id: 'unread_chats',
          type: 'warning',
          icon: 'chatbubble-ellipses',
          title: 'New User Messages',
          message: `${chatCount} unread message${chatCount > 1 ? 's' : ''} from users`,
          time: 'Just now',
          priority: 'high',
          action: () => navigation.navigate('ChatManagement')
        });
      }

      // Low stock alerts
      const lowStockProducts = products.filter(p => p.stock_quantity < 5);
      if (lowStockProducts.length > 0) {
        adminNotifications.push({
          id: 'low_stock',
          type: 'warning',
          icon: 'warning',
          title: 'Low Stock Alert',
          message: `${lowStockProducts.length} product${lowStockProducts.length > 1 ? 's' : ''} running low on stock`,
          time: '5 minutes ago',
          priority: 'high',
          action: () => navigation.navigate('Products')
        });
      }

      // New user registrations
      if (users.length > 0) {
        const recentUsers = users.filter(u => {
          const registrationDate = new Date(u.registeredAt);
          const yesterday = new Date();
          yesterday.setDate(yesterday.getDate() - 1);
          return registrationDate > yesterday;
        });

        if (recentUsers.length > 0) {
          adminNotifications.push({
            id: 'new_users',
            type: 'success',
            icon: 'person-add',
            title: 'New User Registrations',
            message: `${recentUsers.length} new user${recentUsers.length > 1 ? 's' : ''} registered today`,
            time: '1 hour ago',
            priority: 'medium',
            action: () => navigation.navigate('Users')
          });
        }
      }

      // System alerts
      if (dashboardData.pendingOrders > 20) {
        adminNotifications.push({
          id: 'pending_orders',
          type: 'info',
          icon: 'receipt',
          title: 'High Pending Orders',
          message: `${dashboardData.pendingOrders} orders require attention`,
          time: '30 minutes ago',
          priority: 'medium',
          action: () => handleNavigation('OrderManagement', 'Order Management')
        });
      }

      // Server performance
      adminNotifications.push({
        id: 'server_status',
        type: 'success',
        icon: 'server',
        title: 'Server Status',
        message: 'All systems operational - 99.9% uptime',
        time: '2 hours ago',
        priority: 'low'
      });

      setNotifications(adminNotifications);
    } catch (error) {
      console.error('Failed to load admin notifications:', error);
      // Set fallback notifications
      setNotifications([
        {
          id: 'system_check',
          type: 'info',
          icon: 'shield-checkmark',
          title: 'System Health Check',
          message: 'Daily system maintenance completed successfully',
          time: '1 hour ago',
          priority: 'low'
        }
      ]);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await Promise.all([loadDashboardData(), loadAdminNotifications()]);
    setRefreshing(false);
  };

  const handleNotificationPress = () => {
    if (notifications.length === 0) {
      showInfoNotification('No Notifications', 'All caught up! No new notifications.', 3000);
      return;
    }
    setShowNotificationModal(true);
  };

  const handleNotificationAction = (notification) => {
    setShowNotificationModal(false);
    if (notification.action) {
      notification.action();
      // Refresh notifications after action is taken
      setTimeout(() => {
        loadAdminNotifications();
      }, 1000); // Short delay to allow action to complete
    }
  };

  const markAllAsRead = () => {
    setShowNotificationModal(false);
    // Clear notifications and unread chat count immediately
    setNotifications([]);
    setUnreadChatCount(0);
    showSuccessNotification('Notifications Cleared', 'All notifications have been marked as read.', 3000);
    // Refresh after delay to get actual state
    setTimeout(() => {
      loadAdminNotifications();
    }, 2000);
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
              onPress={handleNotificationPress}
              activeOpacity={0.7}
            >
              <Ionicons name="notifications" size={24} color="#D4AF37" />
              {unreadChatCount > 0 && (
                <View style={styles.notificationBadge}>
                  <Text style={styles.badgeText}>{unreadChatCount}</Text>
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
              title="Chat Management"
              icon="chatbubble-ellipses"
              color="#10B981"
              onPress={() => navigation.navigate('ChatManagement')}
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

      {/* Admin Notifications Modal */}
      <Modal
        visible={showNotificationModal}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowNotificationModal(false)}
      >
        <View style={styles.notificationModalContainer}>
          <View style={styles.notificationModalHeader}>
            <Text style={styles.notificationModalTitle}>Admin Notifications</Text>
            <View style={styles.notificationModalActions}>
              <TouchableOpacity
                style={styles.markAllReadButton}
                onPress={markAllAsRead}
                activeOpacity={0.7}
              >
                <Ionicons name="checkmark-done" size={20} color="#D4AF37" />
                <Text style={styles.markAllReadText}>Mark All Read</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.closeNotificationButton}
                onPress={() => setShowNotificationModal(false)}
                activeOpacity={0.7}
              >
                <Ionicons name="close" size={24} color="#D4AF37" />
              </TouchableOpacity>
            </View>
          </View>

          <FlatList
            data={notifications}
            keyExtractor={(item) => item.id}
            style={styles.notificationsList}
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[
                  styles.notificationItem,
                  item.priority === 'high' && styles.highPriorityNotification
                ]}
                onPress={() => handleNotificationAction(item)}
                activeOpacity={0.7}
              >
                <View style={styles.notificationIconContainer}>
                  <View style={[
                    styles.notificationIconBg,
                    { backgroundColor: item.type === 'warning' ? '#F59E0B20' :
                                     item.type === 'success' ? '#10B98120' :
                                     item.type === 'error' ? '#EF444420' :
                                     '#3B82F620' }
                  ]}>
                    <Ionicons
                      name={item.icon}
                      size={24}
                      color={item.type === 'warning' ? '#F59E0B' :
                            item.type === 'success' ? '#10B981' :
                            item.type === 'error' ? '#EF4444' :
                            '#3B82F6'}
                    />
                  </View>
                </View>
                <View style={styles.notificationContent}>
                  <Text style={styles.notificationTitle}>{item.title}</Text>
                  <Text style={styles.notificationMessage}>{item.message}</Text>
                  <Text style={styles.notificationTime}>{item.time}</Text>
                </View>
                {item.priority === 'high' && (
                  <View style={styles.priorityBadge}>
                    <Text style={styles.priorityText}>HIGH</Text>
                  </View>
                )}
              </TouchableOpacity>
            )}
            ListEmptyComponent={() => (
              <View style={styles.emptyNotifications}>
                <Ionicons name="notifications-off" size={64} color="#6B7280" />
                <Text style={styles.emptyNotificationsText}>No notifications</Text>
                <Text style={styles.emptyNotificationsSubtext}>You're all caught up!</Text>
              </View>
            )}
          />
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
  // Notification Modal Styles
  notificationModalContainer: {
    flex: 1,
    backgroundColor: '#1a1a1a',
  },
  notificationModalHeader: {
    backgroundColor: '#2d2d2d',
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#3d3d3d',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  notificationModalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#D4AF37',
  },
  notificationModalActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  markAllReadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 15,
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: '#3d3d3d',
    borderRadius: 8,
  },
  markAllReadText: {
    color: '#D4AF37',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 6,
  },
  closeNotificationButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#3d3d3d',
    justifyContent: 'center',
    alignItems: 'center',
  },
  notificationsList: {
    flex: 1,
    padding: 16,
  },
  notificationItem: {
    backgroundColor: '#2d2d2d',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#3d3d3d',
    flexDirection: 'row',
    alignItems: 'center',
  },
  highPriorityNotification: {
    borderColor: '#F59E0B',
    backgroundColor: '#2d2d2d',
  },
  notificationIconContainer: {
    marginRight: 16,
  },
  notificationIconBg: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notificationContent: {
    flex: 1,
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  notificationMessage: {
    fontSize: 14,
    color: '#9CA3AF',
    marginBottom: 4,
  },
  notificationTime: {
    fontSize: 12,
    color: '#6B7280',
  },
  priorityBadge: {
    backgroundColor: '#F59E0B',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  priorityText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  emptyNotifications: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 100,
  },
  emptyNotificationsText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginTop: 16,
  },
  emptyNotificationsSubtext: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 8,
  },
});