import { useEffect, useState } from 'react';
import { useColorScheme, ActivityIndicator } from 'react-native';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { TamaguiProvider, Theme, YStack, Text } from 'tamagui';
import { Provider } from 'react-redux';
import 'react-native-reanimated';

import config from '../tamagui.config';
import { store, useAppSelector, useAppDispatch } from '@/store';
import { selectIsAuthenticated, selectAuthLoading, selectCurrentUser, initializeFromStorage, storage } from '@/store/authSlice';
import { useLazyGetMeQuery } from '@/store/api';

export const unstable_settings = {
  initialRouteName: '(auth)',
};

function AuthNavigator() {
  const dispatch = useAppDispatch();
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const isLoading = useAppSelector(selectAuthLoading);
  const user = useAppSelector(selectCurrentUser);
  const segments = useSegments();
  const router = useRouter();
  const [getMe] = useLazyGetMeQuery();
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialize auth from storage on mount
  useEffect(() => {
    const initAuth = async () => {
      const token = await storage.getToken();
      dispatch(initializeFromStorage({ token }));
      setIsInitialized(true);

      // If we have a stored token, validate it by fetching user info
      if (token) {
        getMe();
      }
    };

    initAuth();
  }, [dispatch, getMe]);

  // Handle navigation based on auth state
  useEffect(() => {
    // Wait for initialization and loading to complete
    if (!isInitialized || isLoading) return;

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
  }, [isAuthenticated, isLoading, isInitialized, segments, user]);

  // Show loading screen while initializing auth
  if (!isInitialized || isLoading) {
    return (
      <YStack flex={1} justifyContent="center" alignItems="center" backgroundColor="$background">
        <YStack alignItems="center" gap="$4">
          <ActivityIndicator size="large" color="#007AFF" />
          <Text color="$colorSecondary" fontSize={14}>
            Loading...
          </Text>
        </YStack>
      </YStack>
    );
  }

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
