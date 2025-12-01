import { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, Pressable } from 'react-native';
import { YStack, XStack, Text, H1, Separator } from 'tamagui';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { router } from 'expo-router';
import { LogIn, Mail, Lock } from '@tamagui/lucide-icons';

import { Input, PasswordInput } from '@/components/forms/Input';
import { Button } from '@/components/ui/Button';
import { ErrorBanner } from '@/components/ui/ErrorBanner';
import { useLoginMutation } from '@/store/api';
import { colors, spacing, typography } from '@/constants/theme';

// Validation schema
const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address'),
  password: z
    .string()
    .min(1, 'Password is required'),
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
    } catch (err: any) {
      // Check if error is about pending approval
      if (err?.data?.message?.includes('pending admin approval')) {
        // Redirect to pending approval page
        router.replace('/pending-approval');
      }
      // Other errors are handled by RTK Query error state
    }
  };

  const errorMessage = (error as any)?.message || '';

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: colors.gray50 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={0}
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <YStack
          flex={1}
          padding="$4"
          justifyContent="center"
          $gtSm={{
            paddingHorizontal: '$8',
          }}
        >
          {/* Container with max width */}
          <YStack
            width="100%"
            maxWidth={440}
            alignSelf="center"
            gap="$6"
          >
            {/* Logo and Header */}
            <YStack alignItems="center" gap="$5">
              {/* Brand Logo */}
              <YStack alignItems="center" gap="$3">
                <YStack
                  width={100}
                  height={100}
                  backgroundColor={colors.caPrimary}
                  borderRadius="$8"
                  alignItems="center"
                  justifyContent="center"
                  shadowColor={colors.caPrimary}
                  shadowOffset={{ width: 0, height: 12 }}
                  shadowOpacity={0.4}
                  shadowRadius={20}
                  elevation={10}
                  borderWidth={4}
                  borderColor="white"
                >
                  <Text
                    fontSize={40}
                    fontWeight="900"
                    color="white"
                    letterSpacing={-1}
                  >
                    TC
                  </Text>
                </YStack>

                {/* Brand Name */}
                <YStack alignItems="center" gap="$1">
                  <Text
                    fontSize={typography['2xl']}
                    fontWeight="800"
                    color={colors.caPrimary as any}
                    letterSpacing={-0.5}
                  >
                    Tax Chanakya
                  </Text>
                  <Text
                    fontSize={typography.sm}
                    fontWeight="600"
                    color={colors.gray500 as any}
                    letterSpacing={1}
                    textTransform="uppercase"
                  >
                    GST Compliance Made Simple
                  </Text>
                </YStack>
              </YStack>

              {/* Welcome Message */}
              <YStack gap="$2" alignItems="center" marginTop="$2">
                <H1
                  fontSize={typography['2xl']}
                  fontWeight="700"
                  color={colors.gray900 as any}
                  textAlign="center"
                >
                  Welcome back
                </H1>
                <Text
                  fontSize={typography.base}
                  color={colors.gray600 as any}
                  textAlign="center"
                >
                  Sign in to your account to continue
                </Text>
              </YStack>
            </YStack>

            {/* Login Card */}
            <YStack
              backgroundColor="white"
              borderRadius="$6"
              padding="$6"
              gap="$5"
              borderWidth={1}
              borderColor={colors.gray200 as any}
              shadowColor="black"
              shadowOffset={{ width: 0, height: 2 }}
              shadowOpacity={0.05}
              shadowRadius={8}
              elevation={2}
            >
              {/* Error Banner */}
              {errorMessage && <ErrorBanner message={errorMessage} />}

              {/* Email Input */}
              <Controller
                control={control}
                name="email"
                render={({ field: { onChange, onBlur, value } }) => (
                  <Input
                    label="Email Address"
                    placeholder="you@example.com"
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    error={errors.email?.message}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoComplete="email"
                    autoCorrect={false}
                    textContentType="emailAddress"
                    editable={!isLoading}
                    leftIcon={<Mail size={18} color={colors.gray600 as any} />}
                  />
                )}
              />

              {/* Password Input */}
              <YStack gap="$2">
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
                      editable={!isLoading}
                      leftIcon={<Lock size={18} color={colors.gray600 as any} />}
                    />
                  )}
                />

                {/* Forgot Password Link */}
                <XStack justifyContent="flex-end">
                  <Pressable
                    onPress={() => router.push('/forgot-password' as any)}
                    hitSlop={spacing.sm}
                  >
                    <Text
                      fontSize={typography.sm}
                      color={colors.caPrimary as any}
                      fontWeight="600"
                    >
                      Forgot password?
                    </Text>
                  </Pressable>
                </XStack>
              </YStack>

              {/* Sign In Button */}
              <YStack marginTop="$3">
                <Button
                  onPress={handleSubmit(onSubmit)}
                  loading={isLoading}
                  loadingText="Signing in..."
                  fullWidth
                >
                  Sign In
                </Button>
              </YStack>
            </YStack>

            {/* Divider */}
            <XStack alignItems="center" gap="$3">
              <Separator flex={1} />
              <Text fontSize={typography.sm} color={colors.gray500 as any}>
                New to Tax Chanakya?
              </Text>
              <Separator flex={1} />
            </XStack>

            {/* Sign Up Link */}
            <YStack
              backgroundColor="white"
              borderRadius="$5"
              padding="$4"
              borderWidth={1}
              borderColor={colors.gray200 as any}
            >
              <XStack justifyContent="center" alignItems="center" gap="$2">
                <Text fontSize={typography.base} color={colors.gray700 as any}>
                  Don't have an account?
                </Text>
                <Pressable
                  onPress={() => router.push('/signup')}
                  hitSlop={spacing.sm}
                >
                  <Text
                    fontSize={typography.base}
                    fontWeight="700"
                    color={colors.caPrimary as any}
                  >
                    Sign Up
                  </Text>
                </Pressable>
              </XStack>
            </YStack>

            {/* Footer */}
            <YStack alignItems="center" gap="$2" marginTop="$4">
              <Text fontSize={typography.xs} color={colors.gray400 as any} textAlign="center">
                © 2025 Tax Chanakya. All rights reserved.
              </Text>
              <XStack gap="$3">
                <Pressable onPress={() => router.push('/terms-of-service' as any)}>
                  <Text fontSize={typography.xs} color={colors.gray500 as any} textDecorationLine="underline">
                    Terms
                  </Text>
                </Pressable>
                <Text fontSize={typography.xs} color={colors.gray400 as any}>•</Text>
                <Pressable onPress={() => router.push('/privacy-policy' as any)}>
                  <Text fontSize={typography.xs} color={colors.gray500 as any} textDecorationLine="underline">
                    Privacy
                  </Text>
                </Pressable>
                <Text fontSize={typography.xs} color={colors.gray400 as any}>•</Text>
                <Pressable onPress={() => router.push('/support' as any)}>
                  <Text fontSize={typography.xs} color={colors.gray500 as any} textDecorationLine="underline">
                    Support
                  </Text>
                </Pressable>
              </XStack>
            </YStack>
          </YStack>
        </YStack>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
