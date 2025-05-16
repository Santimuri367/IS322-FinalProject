import React from 'react';
import { UserProvider } from './src/context/UserContext';
import AppNavigator from './src/navigation/AppNavigator';
import { StatusBar } from 'react-native';
import { DefaultTheme, Provider as PaperProvider } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';

// Define the enhanced theme with a more athletic look
const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#4F46E5', // Indigo
    accent: '#10B981',  // Emerald
    background: '#F9FAFB',
    text: '#1F2937',
    error: '#EF4444',
    notification: '#3B82F6',
    surface: 'white',
  },
  roundness: 12,
  fonts: {
    ...DefaultTheme.fonts,
    regular: {
      fontFamily: 'System',
      fontWeight: '400',
    },
    medium: {
      fontFamily: 'System',
      fontWeight: '500',
    },
    light: {
      fontFamily: 'System',
      fontWeight: '300',
    },
    thin: {
      fontFamily: 'System',
      fontWeight: '100',
    },
  },
  animation: {
    scale: 1.0,
  },
};

export default function App() {
  return (
    <SafeAreaProvider>
      <PaperProvider theme={theme}>
        <UserProvider>
          <StatusBar barStyle="dark-content" backgroundColor="#F9FAFB" />
          <AppNavigator />
        </UserProvider>
      </PaperProvider>
    </SafeAreaProvider>
  );
}