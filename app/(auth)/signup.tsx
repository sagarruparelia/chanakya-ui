import { KeyboardAvoidingView, Platform, ScrollView, Pressable } from 'react-native';
import { YStack, XStack, Text, H2 } from 'tamagui';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { router, useLocalSearchParams } from 'expo-router';
import { ArrowLeft, User, Mail, Phone } from '@tamagui/lucide-icons';

import { Input, PasswordInput } from '@/components/forms/Input';
import { Button } from '@/components/ui/Button';
import { ErrorBanner } from '@/components/ui/ErrorBanner';
import { useSignupMutation } from '@/store/api';

// Validation schema
const signupSchema = z
  .object({
    inviteToken: z
      .string()
      .min(1, 'Invite token is required'),
    name: z
      .string()
      .min(1, 'Name is required')
      .min(2, 'Name must be at least 2 characters'),
    email: z
      .string()
      .min(1, 'Email is required')
      .email('Please enter a valid email address'),
    phone: z
      .string()
      .optional()
      .refine(
        (val) => !val || /^\+?[1-9]\d{9,14}$/.test(val),
        'Please enter a valid phone number'
      ),
    password: z
      .string()
      .min(1, 'Password is required')
      .min(8, 'Password must be at least 8 characters')
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        'Password must include uppercase, lowercase, and number'
      ),
    confirmPassword: z.string().min(1, 'Please confirm your password'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

type SignupFormData = z.infer<typeof signupSchema>;

export default function SignupScreen() {
  const [signup, { isLoading, error }] = useSignupMutation();
  const params = useLocalSearchParams<{ token?: string; email?: string }>();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      inviteToken: params.token || '',
      name: '',
      email: params.email || '',
      phone: '',
      password: '',
      confirmPassword: '',
    },
  });

  const onSubmit = async (data: SignupFormData) => {
    try {
      const { confirmPassword, ...signupData } = data;
      await signup(signupData).unwrap();
      // On successful signup, auth state will be updated and navigation handled automatically
      router.replace('/(tabs)' as any);
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
          paddingTop="$8"
          gap="$4"
          alignItems="center"
          $gtSm={{
            paddingTop: '$12',
            paddingHorizontal: '$8',
          }}
        >
          {/* Container for max-width on web */}
          <YStack
            width="100%"
            maxWidth={480}
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

            <H2
              fontSize={24}
              fontWeight="600"
              color="$color"
            >
              Create your account
            </H2>
          </YStack>

          {/* Form */}
          <YStack gap="$4" flex={1}>
            {/* Error Banner */}
            {errorMessage && <ErrorBanner message={errorMessage} />}

            {/* Invite Token */}
            <Controller
              control={control}
              name="inviteToken"
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  label="Invite Code"
                  placeholder="Enter your invite code"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  error={errors.inviteToken?.message}
                  required
                  autoCapitalize="none"
                  autoCorrect={false}
                  editable={!isLoading && !params.token}
                />
              )}
            />

            {/* Name */}
            <Controller
              control={control}
              name="name"
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  label="Full Name"
                  placeholder="John Doe"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  error={errors.name?.message}
                  required
                  autoCapitalize="words"
                  autoComplete="name"
                  textContentType="name"
                  editable={!isLoading}
                  leftIcon={<User size={20} color="$colorSecondary" />}
                />
              )}
            />

            {/* Email */}
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
                  editable={!isLoading && !params.email}
                  leftIcon={<Mail size={20} color="$colorSecondary" />}
                />
              )}
            />

            {/* Phone */}
            <Controller
              control={control}
              name="phone"
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  label="Phone Number"
                  placeholder="+91 98765 43210"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  error={errors.phone?.message}
                  keyboardType="phone-pad"
                  autoComplete="tel"
                  textContentType="telephoneNumber"
                  editable={!isLoading}
                  leftIcon={<Phone size={20} color="$colorSecondary" />}
                />
              )}
            />

            {/* Password */}
            <Controller
              control={control}
              name="password"
              render={({ field: { onChange, onBlur, value } }) => (
                <PasswordInput
                  label="Password"
                  placeholder="Create a strong password"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  error={errors.password?.message}
                  hint="At least 8 characters with uppercase, lowercase, and number"
                  required
                  autoComplete="password-new"
                  textContentType="newPassword"
                  editable={!isLoading}
                />
              )}
            />

            {/* Confirm Password */}
            <Controller
              control={control}
              name="confirmPassword"
              render={({ field: { onChange, onBlur, value } }) => (
                <PasswordInput
                  label="Confirm Password"
                  placeholder="Re-enter your password"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  error={errors.confirmPassword?.message}
                  required
                  autoComplete="password-new"
                  textContentType="newPassword"
                  editable={!isLoading}
                />
              )}
            />

            {/* Create Account Button */}
            <YStack marginTop="$2">
              <Button
                onPress={handleSubmit(onSubmit)}
                loading={isLoading}
                loadingText="Creating account..."
                fullWidth
                accessibilityLabel="Create account"
                accessibilityHint="Submit your information to create a new account"
              >
                Create Account
              </Button>
            </YStack>

            {/* Sign In Link */}
            <XStack justifyContent="center" gap="$1" marginTop="$2">
              <Text color="$colorSecondary" fontSize={14}>
                Already have an account?
              </Text>
              <Text
                color="$primary"
                fontSize={14}
                fontWeight="600"
                onPress={() => router.push('/login')}
                accessibilityRole="link"
                accessibilityLabel="Sign in"
                pressStyle={{ opacity: 0.7 }}
              >
                Sign in
              </Text>
            </XStack>
            </YStack>
          </YStack>
        </YStack>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
