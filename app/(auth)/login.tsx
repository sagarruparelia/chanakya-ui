import { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { YStack, XStack, Text, H1 } from 'tamagui';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { router } from 'expo-router';
import { Mail } from '@tamagui/lucide-icons';

import { Input, PasswordInput } from '@/components/forms/Input';
import { Button } from '@/components/ui/Button';
import { ErrorBanner } from '@/components/ui/ErrorBanner';
import { useLoginMutation } from '@/store/api';
import { appConfig } from '@/constants/config';

// Validation schema
const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address'),
  password: z
    .string()
    .min(1, 'Password is required')
    .min(8, 'Password must be at least 8 characters'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginScreen() {
  const [login, { isLoading, error }] = useLoginMutation();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      await login(data).unwrap();
      // Navigation will be handled by auth state change
    } catch (err) {
      // Error is handled by RTK Query
    }
  };

  const errorMessage = (error as any)?.message || '';

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
          paddingTop="$12"
          gap="$6"
          alignItems="center"
          $gtSm={{
            paddingTop: '$16',
            paddingHorizontal: '$8',
          }}
        >
          {/* Container for max-width on web */}
          <YStack
            width="100%"
            maxWidth={400}
            gap="$6"
          >
          {/* Header */}
          <YStack alignItems="center" gap="$3" marginBottom="$4">
            {/* Logo placeholder - replace with actual logo */}
            <YStack
              width={80}
              height={80}
              backgroundColor="$backgroundStrong"
              borderRadius="$4"
              alignItems="center"
              justifyContent="center"
              marginBottom="$2"
            >
              <Text fontSize={32} fontWeight="700" color="$primary">
                C
              </Text>
            </YStack>

            <H1
              fontSize={28}
              fontWeight="700"
              color="$color"
              textAlign="center"
            >
              {appConfig.name}
            </H1>

            <Text
              fontSize={16}
              color="$colorSecondary"
              textAlign="center"
            >
              {appConfig.tagline}
            </Text>
          </YStack>

          {/* Form */}
          <YStack gap="$4" flex={1}>
            {/* Error Banner */}
            {errorMessage && <ErrorBanner message={errorMessage} />}

            {/* Email Input */}
            <Controller
              control={control}
              name="email"
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  label="Email"
                  placeholder="you@example.com"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  error={errors.email?.message}
                  required
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoComplete="email"
                  autoCorrect={false}
                  textContentType="emailAddress"
                  editable={!isLoading}
                  leftIcon={<Mail size={20} color="$colorSecondary" />}
                />
              )}
            />

            {/* Password Input */}
            <Controller
              control={control}
              name="password"
              render={({ field: { onChange, onBlur, value } }) => (
                <PasswordInput
                  label="Password"
                  placeholder="Enter your password"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  error={errors.password?.message}
                  required
                  editable={!isLoading}
                />
              )}
            />

            {/* Forgot Password */}
            <XStack justifyContent="flex-end">
              <Text
                color="$primary"
                fontSize={14}
                fontWeight="600"
                onPress={() => router.push('/forgot-password' as any)}
                accessibilityRole="link"
                accessibilityLabel="Forgot password"
                pressStyle={{ opacity: 0.7 }}
              >
                Forgot password?
              </Text>
            </XStack>

            {/* Sign In Button */}
            <YStack marginTop="$2">
              <Button
                onPress={handleSubmit(onSubmit)}
                loading={isLoading}
                loadingText="Signing in..."
                fullWidth
                accessibilityLabel="Sign in to your account"
                accessibilityHint="Submit your email and password to sign in"
              >
                Sign In
              </Button>
            </YStack>

            {/* Sign Up Link */}
            <XStack justifyContent="center" gap="$1" marginTop="$2">
              <Text color="$colorSecondary" fontSize={14}>
                New here?
              </Text>
              <Text
                color="$primary"
                fontSize={14}
                fontWeight="600"
                onPress={() => router.push('/signup')}
                accessibilityRole="link"
                accessibilityLabel="Create account"
                pressStyle={{ opacity: 0.7 }}
              >
                Create account
              </Text>
            </XStack>
          </YStack>
          </YStack>
        </YStack>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
