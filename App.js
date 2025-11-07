import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import AppNavigator from './src/navigation/AppNavigator';
import { GlobalModalProvider } from './src/components/modals/GlobalModalProvider';

export default function App() {
  return (
    <SafeAreaProvider>
      <GlobalModalProvider>
        <AppNavigator />
      </GlobalModalProvider>
    </SafeAreaProvider>
  );
