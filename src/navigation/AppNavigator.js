import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import LockManager from '../components/mdm/LockManager';
import KioskManager from '../components/mdm/KioskManager';
import SystemKioskManager from '../components/mdm/SystemKioskManager';
import BlockingManager from '../components/mdm/BlockingManager';
import networkManager from '../components/mdm/NetworkManager';
import appRestrictionManager from '../components/mdm/AppRestrictionManager';

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

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

// Main tab navigator
function MainTabNavigator() {
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
        component={ProfileScreen}
        options={{ title: 'Profile' }}
      />
    </Tab.Navigator>
  );
}

// Main app with navigation and lock management
function AppWithLockManager() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen 
        name="MainTabs" 
        component={MainTabNavigator} 
      />
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

  // Simulate payment status changes (in real app, this would come from API)
  useEffect(() => {
    // For demonstration, simulate overdue payment after 5 seconds
    const timer = setTimeout(() => {
      setPaymentStatus({
        overdue: true,
        overdueHours: 2, // 2 hours overdue - will trigger warning stage
        paid: false
      });
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

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

  return (
    <NavigationContainer>
      <BlockingManager 
        paymentStatus={paymentStatus}
        onPaymentRequired={handlePaymentRequired}
      >
        <SystemKioskManager>
          <AppWithLockManager />
        </SystemKioskManager>
      </BlockingManager>
    </NavigationContainer>
  );
}

export default AppNavigator;