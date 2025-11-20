import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Platform } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import type { AuthState, User } from '@/types';
import { api } from './api';

const TOKEN_KEY = 'chanakya_access_token';

// Storage helpers
const storage = {
  async getToken(): Promise<string | null> {
    if (Platform.OS === 'web') {
      // On web, token is in memory only for security
      return null;
    }
    try {
      return await SecureStore.getItemAsync(TOKEN_KEY);
    } catch {
      return null;
    }
  },
  async setToken(token: string): Promise<void> {
    if (Platform.OS === 'web') {
      // On web, token is in memory only
      return;
    }
    try {
      await SecureStore.setItemAsync(TOKEN_KEY, token);
    } catch {
      // Ignore storage errors
    }
  },
  async removeToken(): Promise<void> {
    if (Platform.OS === 'web') {
      return;
    }
    try {
      await SecureStore.deleteItemAsync(TOKEN_KEY);
    } catch {
      // Ignore storage errors
    }
  },
};

const initialState: AuthState = {
  user: null,
  accessToken: null,
  isAuthenticated: false,
  isLoading: true,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (
      state,
      action: PayloadAction<{ user: User; accessToken: string }>
    ) => {
      state.user = action.payload.user;
      state.accessToken = action.payload.accessToken;
      state.isAuthenticated = true;
      state.isLoading = false;
      storage.setToken(action.payload.accessToken);
    },
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
    },
    logout: (state) => {
      state.user = null;
      state.accessToken = null;
      state.isAuthenticated = false;
      state.isLoading = false;
      storage.removeToken();
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    initializeFromStorage: (
      state,
      action: PayloadAction<{ token: string | null }>
    ) => {
      if (action.payload.token) {
        state.accessToken = action.payload.token;
      }
      state.isLoading = false;
    },
  },
  extraReducers: (builder) => {
    // Handle login success
    builder.addMatcher(
      api.endpoints.login.matchFulfilled,
      (state, { payload }) => {
        state.user = payload.user;
        state.accessToken = payload.accessToken;
        state.isAuthenticated = true;
        state.isLoading = false;
        storage.setToken(payload.accessToken);
      }
    );

    // Handle refresh token success
    builder.addMatcher(
      api.endpoints.refreshToken.matchFulfilled,
      (state, { payload }) => {
        state.user = payload.user;
        state.accessToken = payload.accessToken;
        state.isAuthenticated = true;
        storage.setToken(payload.accessToken);
      }
    );

    // Handle getMe success
    builder.addMatcher(
      api.endpoints.getMe.matchFulfilled,
      (state, { payload }) => {
        state.user = payload;
        state.isAuthenticated = true;
        state.isLoading = false;
      }
    );

    // Handle getMe error (unauthorized)
    builder.addMatcher(
      api.endpoints.getMe.matchRejected,
      (state) => {
        state.user = null;
        state.accessToken = null;
        state.isAuthenticated = false;
        state.isLoading = false;
        storage.removeToken();
      }
    );

    // Handle logout
    builder.addMatcher(
      api.endpoints.logout.matchFulfilled,
      (state) => {
        state.user = null;
        state.accessToken = null;
        state.isAuthenticated = false;
        storage.removeToken();
      }
    );
  },
});

export const {
  setCredentials,
  setUser,
  logout,
  setLoading,
  initializeFromStorage,
} = authSlice.actions;

export default authSlice.reducer;

// Selectors
export const selectCurrentUser = (state: { auth: AuthState }) => state.auth.user;
export const selectIsAuthenticated = (state: { auth: AuthState }) =>
  state.auth.isAuthenticated;
export const selectAuthLoading = (state: { auth: AuthState }) =>
  state.auth.isLoading;
export const selectAccessToken = (state: { auth: AuthState }) =>
  state.auth.accessToken;
