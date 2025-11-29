import { KeyboardAvoidingView, Platform, ScrollView, Pressable } from 'react-native';
import { YStack, XStack, Text, H2, Separator, View } from 'tamagui';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { router, useLocalSearchParams } from 'expo-router';
import { ArrowLeft, Calendar, Check } from '@tamagui/lucide-icons';
import { useState, createElement } from 'react';
import DateTimePicker from '@react-native-community/datetimepicker';

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
    firstName: z
      .string()
      .min(1, 'First name is required')
      .max(50, 'First name must be less than 50 characters'),
    lastName: z
      .string()
      .min(1, 'Last name is required')
      .max(50, 'Last name must be less than 50 characters'),
    email: z
      .string()
      .min(1, 'Email is required')
      .email('Please enter a valid email address'),
    phone: z
      .string()
      .regex(/^\+?[1-9]\d{9,14}$/, 'Please enter a valid phone number')
      .optional()
      .or(z.literal('')),
    dateOfBirth: z
      .date({ message: 'Date of birth is required' }),
    password: z
      .string()
      .min(1, 'Password is required')
      .min(8, 'Password must be at least 8 characters')
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        'Password must include uppercase, lowercase, and number'
      ),
    confirmPassword: z.string().min(1, 'Please confirm your password'),
    termsAccepted: z
      .boolean()
      .refine((val) => val === true, {
        message: 'You must accept the terms and conditions',
      }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

type SignupFormData = z.infer<typeof signupSchema>;

export default function SignupScreen() {
  const [signup, { isLoading, error }] = useSignupMutation();
  const params = useLocalSearchParams<{ token?: string; email?: string }>();
  const [showDatePicker, setShowDatePicker] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      inviteToken: params.token || '',
      firstName: '',
      lastName: '',
      email: params.email || '',
      phone: '',
      dateOfBirth: undefined,
      password: '',
      confirmPassword: '',
      termsAccepted: false,
    },
  });

  const dateOfBirth = watch('dateOfBirth');
  const password = watch('password');

  const onSubmit = async (data: SignupFormData) => {
    try {
      const { confirmPassword, termsAccepted, ...signupData } = data;
      // Format date as ISO string for API
      const formattedData = {
        ...signupData,
        dateOfBirth: data.dateOfBirth.toISOString().split('T')[0], // YYYY-MM-DD format
      };
      await signup(formattedData).unwrap();
      router.replace('/(tabs)' as any);
    } catch (err) {
      // Error is handled by RTK Query
    }
  };

  const errorMessage = (error as any)?.message || '';

  const formatDate = (date: Date | undefined) => {
    if (!date) return '';
    return date.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

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
          backgroundColor="#3d4f6f"
          padding="$4"
          paddingTop="$6"
        >
          {/* Back to login */}
          <Pressable
            onPress={() => router.push('/login')}
            accessibilityRole="button"
            accessibilityLabel="Back to login"
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <XStack alignItems="center" gap="$2" marginBottom="$4">
              <ArrowLeft size={20} color="white" />
              <Text color="white" fontSize={16}>
                Back to login
              </Text>
            </XStack>
          </Pressable>

          {/* Card Container */}
          <YStack
            backgroundColor="white"
            borderRadius="$4"
            padding="$5"
            paddingTop="$6"
            alignItems="center"
            $gtSm={{
              maxWidth: 480,
              alignSelf: 'center',
              width: '100%',
            }}
          >
            {/* Calendar Icon */}
            <View
              backgroundColor="#f0f0f0"
              padding="$3"
              borderRadius="$3"
              marginBottom="$4"
            >
              <Calendar size={24} color="#3d4f6f" />
            </View>

            {/* Title */}
            <H2
              fontSize={24}
              fontWeight="600"
              color="#3d4f6f"
              marginBottom="$4"
            >
              Create your account
            </H2>

            {/* Form */}
            <YStack gap="$3" width="100%">
              {/* Error Banner */}
              {errorMessage && <ErrorBanner message={errorMessage} />}

              {/* Invite Token is handled by react-hook-form defaultValues */}

              {/* First Name */}
              <Controller
                control={control}
                name="firstName"
                render={({ field: { onChange, onBlur, value } }) => (
                  <Input
                    label="First Name"
                    placeholder="John"
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    error={errors.firstName?.message}
                    required
                    autoCapitalize="words"
                    autoComplete="given-name"
                    textContentType="givenName"
                    editable={!isLoading}
                  />
                )}
              />

              {/* Last Name */}
              <Controller
                control={control}
                name="lastName"
                render={({ field: { onChange, onBlur, value } }) => (
                  <Input
                    label="Last Name"
                    placeholder="Doe"
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    error={errors.lastName?.message}
                    required
                    autoCapitalize="words"
                    autoComplete="family-name"
                    textContentType="familyName"
                    editable={!isLoading}
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
                    placeholder="john@example.com"
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
                    placeholder="+919876543210"
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    error={errors.phone?.message}
                    keyboardType="phone-pad"
                    autoComplete="tel"
                    textContentType="telephoneNumber"
                    editable={!isLoading}
                  />
                )}
              />

              {/* Date of Birth */}
              <YStack gap="$1">
                <Text fontSize={14} fontWeight="500" color="#000">
                  Date of Birth <Text color="red">*</Text>
                </Text>
                {Platform.OS === 'web' ? (
                  createElement('div', {
                    style: {
                      backgroundColor: 'white',
                      borderRadius: 8,
                      border: '1px solid #e0e0e0',
                      padding: 12,
                    },
                  }, createElement('input', {
                    type: 'date',
                    value: dateOfBirth ? dateOfBirth.toISOString().split('T')[0] : '',
                    onChange: (e: any) => {
                      if (e.target.value) {
                        setValue('dateOfBirth', new Date(e.target.value));
                      }
                    },
                    max: new Date().toISOString().split('T')[0],
                    disabled: isLoading,
                    style: {
                      border: 'none',
                      outline: 'none',
                      fontSize: 16,
                      width: '100%',
                      backgroundColor: 'transparent',
                      color: '#000',
                      fontFamily: 'inherit',
                    },
                  }))
                ) : (
                  <Pressable
                    onPress={() => setShowDatePicker(true)}
                    disabled={isLoading}
                  >
                    <XStack
                      backgroundColor="white"
                      borderRadius="$3"
                      borderWidth={1}
                      borderColor="#e0e0e0"
                      padding="$3"
                      paddingVertical="$3.5"
                      alignItems="center"
                      justifyContent="space-between"
                    >
                      <Text
                        color={dateOfBirth ? '#000' : '#999'}
                        fontSize={16}
                      >
                        {dateOfBirth ? formatDate(dateOfBirth) : 'Select date'}
                      </Text>
                      <Calendar size={20} color="#666" />
                    </XStack>
                  </Pressable>
                )}
                {errors.dateOfBirth && (
                  <Text color="red" fontSize={12}>
                    {errors.dateOfBirth.message}
                  </Text>
                )}
              </YStack>

              {/* Mobile date picker modal */}
              {Platform.OS !== 'web' && showDatePicker && (
                <DateTimePicker
                  value={dateOfBirth || new Date(2000, 0, 1)}
                  mode="date"
                  display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                  maximumDate={new Date()}
                  onChange={(event, selectedDate) => {
                    setShowDatePicker(Platform.OS === 'ios');
                    if (selectedDate) {
                      setValue('dateOfBirth', selectedDate);
                    }
                  }}
                />
              )}

              {/* Password */}
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
                    required
                    autoComplete="password-new"
                    textContentType="newPassword"
                    editable={!isLoading}
                  />
                )}
              />

              {/* Password Strength Indicator */}
              <PasswordStrengthIndicator password={password} />

              {/* Confirm Password */}
              <Controller
                control={control}
                name="confirmPassword"
                render={({ field: { onChange, onBlur, value } }) => (
                  <PasswordInput
                    label="Confirm Password"
                    placeholder="••••••••"
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

              {/* Terms and Conditions */}
              <Controller
                control={control}
                name="termsAccepted"
                render={({ field: { value, onChange } }) => (
                  <YStack gap="$2">
                    <XStack
                      alignItems="center"
                      gap="$3"
                      onPress={() => onChange(!value)}
                    >
                      <Pressable
                        onPress={() => onChange(!value)}
                        hitSlop={10}
                        accessibilityLabel="Accept terms and conditions"
                        accessibilityRole="checkbox"
                        accessibilityState={{ checked: value }}
                      >
                        <View
                          width={20}
                          height={20}
                          borderRadius="$1"
                          borderWidth={2}
                          borderColor={errors.termsAccepted ? 'red' : '#ccc'}
                          backgroundColor={value ? '#3d4f6f' : 'transparent'}
                          justifyContent="center"
                          alignItems="center"
                        >
                          {value && <Check size={14} color="white" />}
                        </View>
                      </Pressable>
                      <Text
                        fontSize={12}
                        color="#666"
                        flex={1}
                        onPress={() => onChange(!value)}
                      >
                        I agree to the{' '}
                        <Text
                          textDecorationLine="underline"
                          onPress={() => router.push('/terms-of-service' as any)}
                        >
                          Terms of Service
                        </Text>{' '}
                        and{' '}
                        <Text
                          textDecorationLine="underline"
                          onPress={() => router.push('/privacy-policy' as any)}
                        >
                          Privacy Policy
                        </Text>
                        .
                      </Text>
                    </XStack>
                    {errors.termsAccepted && (
                      <Text color="red" fontSize={12} marginLeft="$5">
                        {errors.termsAccepted.message}
                      </Text>
                    )}
                  </YStack>
                )}
              />

              {/* Create Account Button */}
              <YStack marginTop="$3">
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

              {/* Divider */}
              <Separator marginVertical="$3" />

              {/* Sign In Link */}
              <XStack justifyContent="center" gap="$1">
                <Text color="$colorSecondary" fontSize={14}>
                  Already have an account?
                </Text>
                <Text
                  color="#3d4f6f"
                  fontSize={14}
                  fontWeight="600"
                  onPress={() => router.push('/login')}
                  accessibilityRole="link"
                  accessibilityLabel="Sign in"
                  pressStyle={{ opacity: 0.7 }}
                  textDecorationLine="underline"
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

// Password strength component
function PasswordStrengthIndicator({ password = '' }: { password?: string }) {
  const criteria = [
    { label: 'At least 8 characters', regex: /.{8,}/ },
    { label: 'An uppercase letter', regex: /[A-Z]/ },
    { label: 'A lowercase letter', regex: /[a-z]/ },
    { label: 'A number', regex: /\d/ },
  ];

  return (
    <YStack gap="$2" paddingHorizontal="$1" marginTop="$1">
      {criteria.map((criterion, index) => {
        const met = criterion.regex.test(password);
        return (
          <XStack key={index} alignItems="center" gap="$2">
            <Check
              size={16}
              color={met ? '$green10' : '$gray8'}
              animation="bouncy"
              key={met ? 'met' : 'unmet'}
            />
            <Text fontSize={12} color={met ? '$green11' : '$gray10'}>
              {criterion.label}
            </Text>
          </XStack>
        );
      })}
    </YStack>
  );
}
