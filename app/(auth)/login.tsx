import { KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { YStack, XStack, Text, H1, H2 } from 'tamagui';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { router } from 'expo-router';
import { FileText } from '@tamagui/lucide-icons';
import { LinearGradient } from 'expo-linear-gradient';

import { Input, PasswordInput } from '@/components/forms/Input';
import { Button } from '@/components/ui/Button';
import { ErrorBanner } from '@/components/ui/ErrorBanner';
import { useLoginMutation } from '@/store/api';
import { appConfig } from '@/constants/config';
import { colors } from '@/constants/theme';

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
    } catch {
      // Error is handled by RTK Query
    }
  };

  const errorMessage = (error as any)?.message || '';

  return (
    <LinearGradient
      colors={[colors.caPrimary, colors.caDark]}
      style={{ flex: 1 }}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
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
            padding="$4"
            paddingTop="$12"
            alignItems="center"
            justifyContent="center"
            $gtSm={{
              paddingHorizontal: '$8',
            }}
          >
            {/* Container for max-width */}
            <YStack
              width="100%"
              maxWidth={400}
              gap="$6"
            >
              {/* Logo and branding */}
              <YStack alignItems="center" gap="$3" marginBottom="$2">
                {/* Logo icon */}
                <YStack
                  width={64}
                  height={64}
                  backgroundColor="white"
                  borderRadius="$4"
                  alignItems="center"
                  justifyContent="center"
                  shadowColor="black"
                  shadowOffset={{ width: 0, height: 4 }}
                  shadowOpacity={0.15}
                  shadowRadius={12}
                  elevation={8}
                >
                  <FileText size={32} color={colors.caPrimary as any} />
                </YStack>

                <H1
                  fontSize={30}
                  fontWeight="700"
                  color="white"
                  textAlign="center"
                >
                  {appConfig.name}
                </H1>

                <Text
                  fontSize={16}
                  color="rgba(255, 255, 255, 0.8)"
                  textAlign="center"
                >
                  {appConfig.tagline}
                </Text>
              </YStack>

              {/* Login form card */}
              <YStack
                backgroundColor="white"
                borderRadius="$6"
                padding="$6"
                shadowColor="black"
                shadowOffset={{ width: 0, height: 8 }}
                shadowOpacity={0.15}
                shadowRadius={24}
                elevation={12}
                gap="$4"
              >
                <H2
                  fontSize={20}
                  fontWeight="600"
                  color={colors.caPrimary as any}
                  marginBottom="$2"
                >
                  Welcome Back
                </H2>

                {/* Error Banner */}
                {errorMessage && <ErrorBanner message={errorMessage} />}

                {/* Email Input */}
                <Controller
                  control={control}
                  name="email"
                  render={({ field: { onChange, onBlur, value } }) => (
                    <Input
                      label="Email"
                      placeholder="name@cafirm.com"
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
                      placeholder="••••••••"
                      value={value}
                      onChangeText={onChange}
                      onBlur={onBlur}
                      error={errors.password?.message}
                      editable={!isLoading}
                    />
                  )}
                />

                {/* Forgot Password */}
                <XStack justifyContent="flex-end">
                  <Text
                    color={colors.caPrimary as any}
                    fontSize={14}
                    fontWeight="500"
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
                <YStack
                  borderTopWidth={1}
                  borderTopColor="#D1D5DB"
                  paddingTop="$4"
                  marginTop="$2"
                >
                  <XStack justifyContent="center" gap="$1">
                    <Text color="#4B5563" fontSize={14}>
                      New here?
                    </Text>
                    <Text
                      color="#111827"
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
          </YStack>
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}
