import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { config } from '@/constants/config';
import type { RootState } from './index';
import type {
  AuthResponse,
  LoginRequest,
  SignupRequest,
  VerifyEmailRequest,
  ForgotPasswordRequest,
  ResetPasswordRequest,
  AccessRequestSubmit,
  AccessRequestStatus,
  InvitationActivateRequest,
  InvitationActivateResponse,
  InvitationStatus,
  CompleteProfileRequest,
  User,
  ApiResponse,
} from '@/types';

// Error message mapping
const errorMessages: Record<string, string> = {
  UserNotFoundException: 'No account found with this email',
  NotAuthorizedException: 'Incorrect email or password',
  UserNotConfirmedException: 'Please verify your email first',
  UsernameExistsException: 'An account with this email already exists',
  InvalidPasswordException:
    'Password must be at least 8 characters with a number and uppercase letter',
  CodeMismatchException: 'Invalid verification code',
  ExpiredCodeException: 'Code has expired. Please request a new one',
  LimitExceededException: 'Too many attempts. Please try again in a few minutes',
  InvalidInvitationCode: 'Invalid or expired invitation code',
  InvitationAlreadyUsed: 'This invitation code has already been used',
  AccessRequestPending: 'You already have a pending access request',
  ProfileIncomplete: 'Please complete your profile to continue',
  NetworkError: 'Unable to connect. Please check your internet connection',
  TimeoutError: 'Request timed out. Please try again',
};

const getErrorMessage = (error: any): string => {
  const code = error?.data?.code || error?.code || '';
  return errorMessages[code] || error?.data?.message || 'Something went wrong. Please try again';
};

export const api = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: config.apiUrl,
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).auth.accessToken;
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      headers.set('Content-Type', 'application/json');
      return headers;
    },
  }),
  tagTypes: ['User', 'AccessRequest', 'Invitation'],
  endpoints: (builder) => ({
    // Auth endpoints
    signup: builder.mutation<ApiResponse, SignupRequest>({
      query: (body) => ({
        url: '/api/auth/signup',
        method: 'POST',
        body,
      }),
      transformErrorResponse: (response) => ({
        message: getErrorMessage(response),
      }),
    }),

    verifyEmail: builder.mutation<ApiResponse, VerifyEmailRequest>({
      query: (body) => ({
        url: '/api/auth/verify-email',
        method: 'POST',
        body,
      }),
      transformErrorResponse: (response) => ({
        message: getErrorMessage(response),
      }),
    }),

    resendVerification: builder.mutation<ApiResponse, { email: string }>({
      query: (body) => ({
        url: '/api/auth/resend-verification',
        method: 'POST',
        body,
      }),
      transformErrorResponse: (response) => ({
        message: getErrorMessage(response),
      }),
    }),

    login: builder.mutation<AuthResponse, LoginRequest>({
      query: (body) => ({
        url: '/api/auth/login',
        method: 'POST',
        body,
      }),
      transformErrorResponse: (response) => ({
        message: getErrorMessage(response),
      }),
    }),

    logout: builder.mutation<void, void>({
      query: () => ({
        url: '/api/auth/logout',
        method: 'POST',
      }),
    }),

    refreshToken: builder.mutation<AuthResponse, void>({
      query: () => ({
        url: '/api/auth/refresh',
        method: 'POST',
      }),
    }),

    forgotPassword: builder.mutation<ApiResponse, ForgotPasswordRequest>({
      query: (body) => ({
        url: '/api/auth/forgot-password',
        method: 'POST',
        body,
      }),
      transformErrorResponse: (response) => ({
        message: getErrorMessage(response),
      }),
    }),

    resetPassword: builder.mutation<ApiResponse, ResetPasswordRequest>({
      query: (body) => ({
        url: '/api/auth/reset-password',
        method: 'POST',
        body,
      }),
      transformErrorResponse: (response) => ({
        message: getErrorMessage(response),
      }),
    }),

    getMe: builder.query<User, void>({
      query: () => '/api/auth/me',
      providesTags: ['User'],
    }),

    // Access request endpoints
    submitAccessRequest: builder.mutation<ApiResponse, AccessRequestSubmit>({
      query: (body) => ({
        url: '/api/access-requests',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['AccessRequest'],
      transformErrorResponse: (response) => ({
        message: getErrorMessage(response),
      }),
    }),

    getMyAccessRequest: builder.query<AccessRequestStatus | null, void>({
      query: () => '/api/access-requests/mine',
      providesTags: ['AccessRequest'],
    }),

    // Invitation endpoints
    validateInvitation: builder.query<InvitationStatus, string>({
      query: (code) => `/api/invitations/validate?code=${code}`,
      providesTags: ['Invitation'],
    }),

    activateInvitation: builder.mutation<InvitationActivateResponse, InvitationActivateRequest>({
      query: (body) => ({
        url: '/api/invitations/activate',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['User', 'Invitation'],
      transformErrorResponse: (response) => ({
        message: getErrorMessage(response),
      }),
    }),

    // Profile endpoints
    completeProfile: builder.mutation<ApiResponse, CompleteProfileRequest>({
      query: (body) => ({
        url: '/api/profile/complete',
        method: 'PUT',
        body,
      }),
      invalidatesTags: ['User'],
      transformErrorResponse: (response) => ({
        message: getErrorMessage(response),
      }),
    }),
  }),
});

export const {
  useSignupMutation,
  useVerifyEmailMutation,
  useResendVerificationMutation,
  useLoginMutation,
  useLogoutMutation,
  useRefreshTokenMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation,
  useGetMeQuery,
  useLazyGetMeQuery,
  useSubmitAccessRequestMutation,
  useGetMyAccessRequestQuery,
  useValidateInvitationQuery,
  useLazyValidateInvitationQuery,
  useActivateInvitationMutation,
  useCompleteProfileMutation,
} = api;
