import { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, Pressable } from 'react-native';
import { YStack, XStack, Text, H2 } from 'tamagui';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { router, useLocalSearchParams } from 'expo-router';
import { ArrowLeft, Mail } from '@tamagui/lucide-icons';

import { Input } from '@/components/forms/Input';
import { Button } from '@/components/ui/Button';
import { ErrorBanner } from '@/components/ui/ErrorBanner';
import { useVerifyEmailMutation, useResendVerificationMutation } from '@/store/api';

// Validation schema
const verifySchema = z.object({
  code: z
    .string()
    .min(1, 'Verification code is required')
    .length(6, 'Code must be 6 digits')
    .regex(/^\d+$/, 'Code must contain only numbers'),
});

type VerifyFormData = z.infer<typeof verifySchema>;

export default function VerifyEmailScreen() {
  const { email } = useLocalSearchParams<{ email: string }>();
  const [verifyEmail, { isLoading: isVerifying, error: verifyError }] =
    useVerifyEmailMutation();
  const [resendVerification, { isLoading: isResending }] =
    useResendVerificationMutation();
  const [resendSuccess, setResendSuccess] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<VerifyFormData>({
    resolver: zodResolver(verifySchema),
    defaultValues: {
      code: '',
    },
  });

  const onSubmit = async (data: VerifyFormData) => {
    if (!email) return;

    try {
      await verifyEmail({ email, code: data.code }).unwrap();
      // Navigate to login after successful verification
      router.replace('/login');
    } catch (err) {
      // Error is handled by RTK Query
    }
  };

  const handleResend = async () => {
    if (!email) return;

    try {
      await resendVerification({ email }).unwrap();
      setResendSuccess(true);
      setTimeout(() => setResendSuccess(false), 5000);
    } catch (err) {
      // Error is handled by RTK Query
    }
  };

  const errorMessage = (verifyError as any)?.message || '';

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
    >
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
          {/* Header */}
          <YStack gap="$3" marginBottom="$2">
            <Pressable
              onPress={() => router.back()}
              accessibilityRole="button"
              accessibilityLabel="Go back"
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <ArrowLeft size={24} color="$color" />
            </Pressable>

            <H2 fontSize={24} fontWeight="600" color="$color">
              Verify your email
            </H2>

            <Text color="$colorSecondary" fontSize={14}>
              We sent a 6-digit code to
            </Text>
            <Text color="$color" fontSize={14} fontWeight="600">
              {email}
            </Text>
          </YStack>

          {/* Form */}
          <YStack gap="$4" flex={1}>
            {/* Error Banner */}
            {errorMessage && <ErrorBanner message={errorMessage} />}

            {/* Success Message */}
            {resendSuccess && (
              <XStack
                backgroundColor="$successBg"
                padding="$4"
                borderRadius="$2"
                gap="$3"
                alignItems="center"
              >
                <Mail size={20} color="$success" />
                <Text color="$success" fontSize={14} flex={1}>
                  Verification code sent successfully!
                </Text>
              </XStack>
            )}

            {/* Code Input */}
            <Controller
              control={control}
              name="code"
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  label="Verification Code"
                  placeholder="123456"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  error={errors.code?.message}
                  required
                  keyboardType="number-pad"
                  maxLength={6}
                  textAlign="center"
                  editable={!isVerifying}
                  autoFocus
                />
              )}
            />

            {/* Verify Button */}
            <YStack marginTop="$2">
              <Button
                onPress={handleSubmit(onSubmit)}
                loading={isVerifying}
                loadingText="Verifying..."
                fullWidth
                accessibilityLabel="Verify email"
                accessibilityHint="Submit the verification code to verify your email"
              >
                Verify
              </Button>
            </YStack>

            {/* Resend Link */}
            <XStack justifyContent="center" gap="$1" marginTop="$2">
              <Text color="$colorSecondary" fontSize={14}>
                Didn't receive it?
              </Text>
              <Text
                color="$primary"
                fontSize={14}
                fontWeight="600"
                onPress={handleResend}
                accessibilityRole="button"
                accessibilityLabel="Resend verification code"
                opacity={isResending ? 0.5 : 1}
                pressStyle={{ opacity: 0.7 }}
              >
                {isResending ? 'Sending...' : 'Resend code'}
              </Text>
            </XStack>
          </YStack>
        </YStack>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
