import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import * as SecureStore from 'expo-secure-store';
import LockManager from '../components/mdm/LockManager';
import KioskManager from '../components/mdm/KioskManager';
import SystemKioskManager from '../components/mdm/SystemKioskManager';
import BlockingManager from '../components/mdm/BlockingManager';
import networkManager from '../components/mdm/NetworkManager';
import appRestrictionManager from '../components/mdm/AppRestrictionManager';
import AdminStackNavigator from './AdminNavigator';

// Import screens
import HomeScreen from '../screens/HomeScreen';
import MarketplaceScreen from '../screens/MarketplaceScreen';
import WalletScreen from '../screens/WalletScreen';
import CommunityScreen from '../screens/CommunityScreen';
import ProfileScreen from '../screens/ProfileScreen';

// Import MDM screens
import DeviceStatusScreen from '../screens/DeviceStatusScreen';
import LockScreen from '../screens/LockScreen';
import BlockingDemoScreen from '../screens/BlockingDemoScreen';
import ChatScreen from '../screens/ChatScreen';
import AuthScreen from '../screens/AuthScreen';
import AdminUserManagementScreen from '../screens/AdminUserManagementScreen';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

// Main tab navigator
function MainTabNavigator({ onLogout }) {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Marketplace') {
            iconName = focused ? 'storefront' : 'storefront-outline';
          } else if (route.name === 'Wallet') {
            iconName = focused ? 'wallet' : 'wallet-outline';
          } else if (route.name === 'Community') {
            iconName = focused ? 'people' : 'people-outline';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'person' : 'person-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#D4AF37',
        tabBarInactiveTintColor: '#8B4513',
        tabBarStyle: {
          backgroundColor: '#FFF8E7',
          borderTopColor: '#D4AF37',
          borderTopWidth: 1,
        },
        headerStyle: {
          backgroundColor: '#FFF8E7',
        },
        headerTintColor: '#2C1810',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      })}
    >
      <Tab.Screen 
        name="Home" 
        component={HomeScreen}
        options={{ title: 'TLB Diamond' }}
      />
      <Tab.Screen 
        name="Marketplace" 
        component={MarketplaceScreen}
        options={{ title: 'Shop' }}
      />
      <Tab.Screen 
        name="Wallet" 
        component={WalletScreen}
        options={{ title: 'Wallet' }}
      />
      <Tab.Screen 
        name="Community" 
        component={CommunityScreen}
        options={{ title: 'Community' }}
      />
      <Tab.Screen 
        name="Profile"
        options={{ title: 'Profile' }}
      >
        {(props) => <ProfileScreen {...props} onLogout={onLogout} />}
      </Tab.Screen>
    </Tab.Navigator>
  );
}

// Main app with navigation and lock management
function AppWithLockManager({ onLogout }) {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen 
        name="MainTabs"
      >
        {(props) => <MainTabNavigator {...props} onLogout={onLogout} />}
      </Stack.Screen>
      <Stack.Screen 
        name="DeviceStatus" 
        component={DeviceStatusScreen}
        options={{
          headerShown: true,
          title: 'Device Status',
          headerStyle: { backgroundColor: '#FFF8E7' },
          headerTintColor: '#2C1810',
        }}
      />
      <Stack.Screen 
        name="LockScreen" 
        component={LockScreen}
        options={{
          presentation: 'modal',
          headerShown: false,
        }}
      />
      <Stack.Screen 
        name="BlockingDemo" 
        component={BlockingDemoScreen}
        options={{
          headerShown: true,
          title: 'Blocking Demo',
          headerStyle: { backgroundColor: '#FFF8E7' },
          headerTintColor: '#2C1810',
        }}
      />
      <Stack.Screen 
        name="ChatScreen" 
        component={ChatScreen}
        options={{
          headerShown: false,
          presentation: 'modal',
        }}
      />
      <Stack.Screen 
        name="AdminUserManagement" 
        component={AdminUserManagementScreen}
        options={{
          headerShown: false,
        }}
      />
    </Stack.Navigator>
  );
}

// Root navigator with graduated blocking system
function AppNavigator() {
  const [paymentStatus, setPaymentStatus] = useState({
    overdue: false,
    overdueHours: 0,
    paid: false
  });
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [userRole, setUserRole] = useState(null);

  // Check authentication status on app start
  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const authToken = await SecureStore.getItemAsync('auth_token');
      const currentUser = await SecureStore.getItemAsync('currentUser');
      
      console.log('Checking auth status:', { hasToken: !!authToken, hasUser: !!currentUser });
      
      if (authToken && currentUser) {
        try {
          const userData = JSON.parse(currentUser);
          setUserRole(userData.role || 'user');
          console.log('User role:', userData.role);
        } catch (parseError) {
          console.error('Error parsing user data:', parseError);
          setUserRole('user');
        }
        setIsAuthenticated(true);
        console.log('User is authenticated');
      } else {
        console.log('User is not authenticated');
        setIsAuthenticated(false);
        setUserRole(null);
      }
    } catch (error) {
      console.error('Error checking auth status:', error);
      setIsAuthenticated(false);
      setUserRole(null);
    } finally {
      setIsCheckingAuth(false);
    }
  };

  // Simulate payment status changes (in real app, this would come from API)
  useEffect(() => {
    if (isAuthenticated) {
      // For demonstration, simulate overdue payment after 5 seconds
      const timer = setTimeout(() => {
        setPaymentStatus({
          overdue: true,
          overdueHours: 2, // 2 hours overdue - will trigger warning stage
          paid: false
        });
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [isAuthenticated]);

  // Handle payment requirement navigation
  const handlePaymentRequired = () => {
    // In real app, this would navigate to payment screen
    console.log('Navigating to payment screen...');
    // For demo, simulate payment completion after 3 seconds
    setTimeout(() => {
      setPaymentStatus(prev => ({
        ...prev,
        paid: true,
        overdue: false
      }));
    }, 3000);
  };

  // Show loading screen while checking auth
  if (isCheckingAuth) {
    return null; // Or a loading component
  }

  const handleAuthSuccess = async () => {
    console.log('Auth success callback triggered - setting isAuthenticated to true');
    setIsAuthenticated(true);
    
    // Re-check auth status to get user role
    try {
      const currentUser = await SecureStore.getItemAsync('currentUser');
      if (currentUser) {
        const userData = JSON.parse(currentUser);
        setUserRole(userData.role || 'user');
        console.log('User role set after auth success:', userData.role);
      }
    } catch (error) {
      console.error('Error getting user role after auth success:', error);
      setUserRole('user');
    }
    
    console.log('Authentication state updated, should show main app now');
  };

  const handleLogout = () => {
    console.log('Logout triggered - setting isAuthenticated to false');
    setIsAuthenticated(false);
    setUserRole(null);
    console.log('Authentication state updated, should show login screen now');
  };

  console.log('AppNavigator rendering, isAuthenticated:', isAuthenticated, 'userRole:', userRole);
  
  return (
    <NavigationContainer>
      {!isAuthenticated ? (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen 
            name="Auth"
            initialParams={{ onAuthSuccess: handleAuthSuccess }}
          >
            {(props) => <AuthScreen {...props} onAuthSuccess={handleAuthSuccess} />}
          </Stack.Screen>
        </Stack.Navigator>
      ) : userRole === 'admin' ? (
        <BlockingManager 
          paymentStatus={paymentStatus}
          onPaymentRequired={handlePaymentRequired}
        >
          <SystemKioskManager>
            <AdminStackNavigator onLogout={handleLogout} />
          </SystemKioskManager>
        </BlockingManager>
      ) : (
        <BlockingManager 
          paymentStatus={paymentStatus}
          onPaymentRequired={handlePaymentRequired}
        >
          <SystemKioskManager>
            <AppWithLockManager onLogout={handleLogout} />
          </SystemKioskManager>
        </BlockingManager>
      )}
    </NavigationContainer>
  );
}

export default AppNavigator;