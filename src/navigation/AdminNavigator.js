import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';

// Admin Screens
import AdminHomeScreen from '../screens/AdminHomeScreen';
import UserManagementScreen from '../screens/admin/UserManagementScreen';
import ProductManagementScreen from '../screens/admin/ProductManagementScreen';
import DeviceManagementScreen from '../screens/admin/DeviceManagementScreen';
import AdminProfileScreen from '../screens/admin/AdminProfileScreen';

// Additional Admin Screens (Stack screens)
import OrderManagementScreen from '../screens/admin/OrderManagementScreen';
import FinancialDashboardScreen from '../screens/admin/FinancialDashboardScreen';
import SystemLogsScreen from '../screens/admin/SystemLogsScreen';
import AdminReportsScreen from '../screens/admin/AdminReportsScreen';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

// Admin Tab Navigator with dark theme
function AdminTabNavigator({ onLogout }) {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Dashboard') {
            iconName = focused ? 'analytics' : 'analytics-outline';
          } else if (route.name === 'Users') {
            iconName = focused ? 'people' : 'people-outline';
          } else if (route.name === 'Products') {
            iconName = focused ? 'cube' : 'cube-outline';
          } else if (route.name === 'Devices') {
            iconName = focused ? 'phone-portrait' : 'phone-portrait-outline';
          } else if (route.name === 'Settings') {
            iconName = focused ? 'settings' : 'settings-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#D4AF37',
        tabBarInactiveTintColor: '#6B7280',
        tabBarStyle: {
          backgroundColor: '#1a1a1a',
          borderTopColor: '#3d3d3d',
          borderTopWidth: 1,
          height: 60,
          paddingBottom: 8,
          paddingTop: 8,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
        },
        headerStyle: {
          backgroundColor: '#1a1a1a',
          borderBottomColor: '#3d3d3d',
        },
        headerTintColor: '#D4AF37',
        headerTitleStyle: {
          fontWeight: 'bold',
          color: '#FFFFFF',
        },
      })}
    >
      <Tab.Screen 
        name="Dashboard" 
        component={AdminHomeScreen}
        options={{ 
          title: 'Admin Dashboard',
          headerShown: false
        }}
      />
      <Tab.Screen 
        name="Users" 
        component={UserManagementScreen}
        options={{ title: 'User Management' }}
      />
      <Tab.Screen 
        name="Products" 
        component={ProductManagementScreen}
        options={{ title: 'Product Management' }}
      />
      <Tab.Screen 
        name="Devices" 
        component={DeviceManagementScreen}
        options={{ title: 'Device Management' }}
      />
      <Tab.Screen 
        name="Settings"
        options={{ title: 'Admin Settings' }}
      >
        {(props) => <AdminProfileScreen {...props} onLogout={onLogout} />}
      </Tab.Screen>
    </Tab.Navigator>
  );
}

// Admin Stack Navigator for additional screens
function AdminStackNavigator({ onLogout }) {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: '#1a1a1a',
          borderBottomColor: '#3d3d3d',
        },
        headerTintColor: '#D4AF37',
        headerTitleStyle: {
          fontWeight: 'bold',
          color: '#FFFFFF',
        },
        cardStyle: {
          backgroundColor: '#1a1a1a',
        },
      }}
    >
      <Stack.Screen 
        name="AdminTabs"
        options={{ headerShown: false }}
      >
        {(props) => <AdminTabNavigator {...props} onLogout={onLogout} />}
      </Stack.Screen>
      
      {/* Additional Admin Screens */}
      <Stack.Screen 
        name="OrderManagement" 
        component={OrderManagementScreen}
        options={{ 
          title: 'Order Management',
          headerBackTitleVisible: false,
        }}
      />
      <Stack.Screen 
        name="FinancialDashboard" 
        component={FinancialDashboardScreen}
        options={{ 
          title: 'Financial Dashboard',
          headerBackTitleVisible: false,
        }}
      />
      <Stack.Screen 
        name="SystemLogs" 
        component={SystemLogsScreen}
        options={{ 
          title: 'System Logs',
          headerBackTitleVisible: false,
        }}
      />
      <Stack.Screen 
        name="AdminReports" 
        component={AdminReportsScreen}
        options={{ 
          title: 'Admin Reports',
          headerBackTitleVisible: false,
        }}
      />
      
      {/* Placeholder screens for navigation */}
      <Stack.Screen 
        name="UserLookup"
        component={UserManagementScreen}
        options={{ 
          title: 'User Lookup',
          headerBackTitleVisible: false,
        }}
      />
      <Stack.Screen 
        name="AddProduct"
        component={ProductManagementScreen}
        options={{ 
          title: 'Add Product',
          headerBackTitleVisible: false,
        }}
      />
      <Stack.Screen 
        name="SendNotification"
        component={AdminHomeScreen}
        options={{ 
          title: 'Send Notification',
          headerBackTitleVisible: false,
        }}
      />
      <Stack.Screen 
        name="SupportCenter"
        component={DeviceManagementScreen}
        options={{ 
          title: 'Support Center',
          headerBackTitleVisible: false,
        }}
      />
      <Stack.Screen 
        name="AdminSettings"
        component={AdminProfileScreen}
        options={{ 
          title: 'System Settings',
          headerBackTitleVisible: false,
        }}
      />
    </Stack.Navigator>
  );
}

export default AdminStackNavigator;