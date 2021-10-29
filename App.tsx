import React from 'react';
import AppLoading from 'expo-app-loading';
import { ThemeProvider } from 'styled-components';
import { AppProvider } from './src/shared/hooks';
import { AuthProvider, useAuth } from './src/shared/hooks/auth';

import {
  useFonts,
  Roboto_400Regular,
  Roboto_500Medium,
  Roboto_700Bold
} from '@expo-google-fonts/roboto';

import { Routes } from './src/shared/routes';
import theme from './src/shared/global/styles/theme';

interface Props {
  type: 'available' | 'unavailable';
}

export default function App({ type }: Props) {
  const [fontsLoaded] = useFonts({
    Roboto_400Regular,
    Roboto_500Medium,
    Roboto_700Bold
  });

  const { loading } = useAuth();

  if (!fontsLoaded || loading) {
    return <AppLoading />
  }

  return (
    <ThemeProvider theme={theme}>
      <AppProvider>
        <AuthProvider>
          <Routes />
        </AuthProvider>
      </AppProvider>
    </ThemeProvider>
  );
}
