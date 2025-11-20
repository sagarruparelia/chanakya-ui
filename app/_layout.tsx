import { useEffect } from 'react';
import { useColorScheme } from 'react-native';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { TamaguiProvider, Theme } from 'tamagui';
import { Provider } from 'react-redux';
import 'react-native-reanimated';

import config from '../tamagui.config';
import { store, useAppSelector, useAppDispatch } from '@/store';
import { selectIsAuthenticated, selectAuthLoading, selectCurrentUser } from '@/store/authSlice';
import { useLazyGetMeQuery } from '@/store/api';

export const unstable_settings = {
  initialRouteName: '(auth)',
};

function AuthNavigator() {
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const isLoading = useAppSelector(selectAuthLoading);
  const user = useAppSelector(selectCurrentUser);
  const segments = useSegments();
  const router = useRouter();
  const [getMe] = useLazyGetMeQuery();

  // Check auth on mount
  useEffect(() => {
    getMe();
  }, []);

  // Handle navigation based on auth state
  useEffect(() => {
    if (isLoading) return;

    const inAuthGroup = segments[0] === '(auth)';

    if (!isAuthenticated && !inAuthGroup) {
      // Not authenticated, redirect to login
      router.replace('/login' as any);
    } else if (isAuthenticated && inAuthGroup) {
      // Authenticated, check user status
      if (user) {
        switch (user.status) {
          case 'INVITED':
            // User invited but not yet fully registered
            router.replace('/login' as any);
            break;
          case 'DISABLED':
            // Account disabled
            router.replace('/login' as any);
            break;
          case 'ACTIVE':
          default:
            // User is fully set up
            router.replace('/(tabs)' as any);
            break;
        }
      } else {
        router.replace('/(tabs)' as any);
      }
    }
  }, [isAuthenticated, isLoading, segments, user]);

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(auth)" />
      <Stack.Screen name="(onboarding)" />
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
    </Stack>
  );
}

function RootLayoutContent() {
  const colorScheme = useColorScheme();

  return (
    <TamaguiProvider config={config}>
      <Theme name={colorScheme === 'dark' ? 'dark' : 'light'}>
        <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
          <AuthNavigator />
          <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
        </ThemeProvider>
      </Theme>
    </TamaguiProvider>
  );
}

export default function RootLayout() {
  return (
    <Provider store={store}>
      <RootLayoutContent />
    </Provider>
  );
}
