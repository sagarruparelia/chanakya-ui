import { useState, useEffect } from 'react';
import { ScrollView, Pressable, ActivityIndicator } from 'react-native';
import { YStack, XStack, Text, H2, View } from 'tamagui';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { router, useLocalSearchParams } from 'expo-router';
import { Mail, CheckCircle, XCircle } from '@tamagui/lucide-icons';

import { Input } from '@/components/forms/Input';
import { Button } from '@/components/ui/Button';
import { ErrorBanner } from '@/components/ui/ErrorBanner';
import { useVerifyEmailMutation, useResendVerificationMutation } from '@/store/api';

// Validation schema for manual token entry
const verifySchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address'),
});

type VerifyFormData = z.infer<typeof verifySchema>;

type VerificationStatus = 'idle' | 'verifying' | 'success' | 'error';

export default function VerifyEmailScreen() {
  const { token, email: emailParam } = useLocalSearchParams<{ token?: string; email?: string }>();
  const [verifyEmail, { isLoading: isVerifying, error: verifyError }] =
    useVerifyEmailMutation();
  const [resendVerification, { isLoading: isResending }] =
    useResendVerificationMutation();
  const [verificationStatus, setVerificationStatus] = useState<VerificationStatus>('idle');
  const [resendSuccess, setResendSuccess] = useState(false);
  const [resendEmail, setResendEmail] = useState(emailParam || '');

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<VerifyFormData>({
    resolver: zodResolver(verifySchema),
    defaultValues: {
      email: emailParam || '',
    },
  });

  // Auto-verify if token is provided in URL
  useEffect(() => {
    if (token && verificationStatus === 'idle') {
      handleTokenVerification(token);
    }
  }, [token]);

  const handleTokenVerification = async (verificationToken: string) => {
    setVerificationStatus('verifying');
    try {
      const result = await verifyEmail({ token: verificationToken }).unwrap();
      setVerificationStatus('success');

      // Redirect to pending approval or login after 2 seconds
      setTimeout(() => {
        if (result.accountPendingApproval) {
          router.replace('/(auth)/pending-approval' as any);
        } else {
          router.replace('/login');
        }
      }, 2000);
    } catch (err) {
      setVerificationStatus('error');
    }
  };

  const handleResend = async (data: VerifyFormData) => {
    try {
      await resendVerification({ email: data.email }).unwrap();
      setResendSuccess(true);
      setResendEmail(data.email);
      setTimeout(() => setResendSuccess(false), 5000);
    } catch (err) {
      // Error is handled by RTK Query
    }
  };

  const errorMessage = (verifyError as any)?.data?.message || (verifyError as any)?.message || '';

  // Show verification status when token is provided
  if (token) {
    return (
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        showsVerticalScrollIndicator={false}
      >
        <YStack
          flex={1}
          backgroundColor="#3d4f6f"
          padding="$6"
          paddingTop="$12"
          justifyContent="center"
          alignItems="center"
        >
          <YStack
            backgroundColor="white"
            borderRadius="$4"
            padding="$6"
            maxWidth={480}
            width="100%"
            alignItems="center"
            gap="$4"
          >
            {verificationStatus === 'verifying' && (
              <>
                <ActivityIndicator size="large" color="#3d4f6f" />
                <H2 fontSize={24} fontWeight="600" color="#3d4f6f" textAlign="center">
                  Verifying your email...
                </H2>
                <Text fontSize={14} color="#666" textAlign="center">
                  Please wait while we verify your email address
                </Text>
              </>
            )}

            {verificationStatus === 'success' && (
              <>
                <View backgroundColor="#e1ffe1" padding="$4" borderRadius={60}>
                  <CheckCircle size={48} color="#4caf50" />
                </View>
                <H2 fontSize={24} fontWeight="600" color="#3d4f6f" textAlign="center">
                  Email Verified!
                </H2>
                <Text fontSize={14} color="#666" textAlign="center">
                  Your email has been successfully verified. Redirecting...
                </Text>
              </>
            )}

            {verificationStatus === 'error' && (
              <>
                <View backgroundColor="#ffe1e1" padding="$4" borderRadius={60}>
                  <XCircle size={48} color="#f44336" />
                </View>
                <H2 fontSize={24} fontWeight="600" color="#3d4f6f" textAlign="center">
                  Verification Failed
                </H2>
                <Text fontSize={14} color="#666" textAlign="center">
                  {errorMessage || 'The verification link is invalid or has expired.'}
                </Text>
                <Button
                  variant="outlined"
                  onPress={() => router.replace('/login')}
                  fullWidth
                  marginTop="$2"
                >
                  Go to Login
                </Button>
              </>
            )}
          </YStack>
        </YStack>
      </ScrollView>
    );
  }

  // Show resend verification form when no token
  return (
    <ScrollView
      contentContainerStyle={{ flexGrow: 1 }}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
    >
      <YStack
        flex={1}
        backgroundColor="$background"
        padding="$6"
        paddingTop="$8"
        gap="$4"
      >
        <YStack gap="$3" marginBottom="$2">
          <H2 fontSize={24} fontWeight="600" color="$color">
            Verify your email
          </H2>
          <Text color="$colorSecondary" fontSize={14}>
            Enter your email to resend the verification link
          </Text>
        </YStack>

        <YStack gap="$4" flex={1}>
          {errorMessage && <ErrorBanner message={errorMessage} />}

          {resendSuccess && (
            <XStack
              backgroundColor="#e1ffe1"
              padding="$4"
              borderRadius="$2"
              gap="$3"
              alignItems="center"
            >
              <Mail size={20} color="#4caf50" />
              <Text color="#4caf50" fontSize={14} flex={1}>
                Verification email sent to {resendEmail}. Please check your inbox.
              </Text>
            </XStack>
          )}

          <Controller
            control={control}
            name="email"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                label="Email"
                placeholder="your@email.com"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                error={errors.email?.message}
                required
                keyboardType="email-address"
                autoCapitalize="none"
                editable={!isResending}
                autoFocus
              />
            )}
          />

          <YStack marginTop="$2">
            <Button
              onPress={handleSubmit(handleResend)}
              loading={isResending}
              loadingText="Sending..."
              fullWidth
            >
              Resend Verification Email
            </Button>
          </YStack>

          <Button
            variant="outlined"
            onPress={() => router.replace('/login')}
            fullWidth
          >
            Back to Login
          </Button>
        </YStack>
      </YStack>
    </ScrollView>
  );
}
