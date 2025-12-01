import { useState, createElement } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, Pressable } from 'react-native';
import { YStack, XStack, Text, H1, H2, Separator, View } from 'tamagui';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { router, useLocalSearchParams } from 'expo-router';
import { UserPlus, ArrowLeft, Calendar, Check } from '@tamagui/lucide-icons';
import DateTimePicker from '@react-native-community/datetimepicker';

import { Input, PasswordInput } from '@/components/forms/Input';
import { Button } from '@/components/ui/Button';
import { ErrorBanner } from '@/components/ui/ErrorBanner';
import { useSignupMutation } from '@/store/api';
import { colors, spacing, typography } from '@/constants/theme';

// Validation schema
const signupSchema = z
  .object({
    inviteToken: z.string().optional(),
    customerType: z.enum(['CA_ORG', 'ENTERPRISE', 'INDIVIDUAL'], {
      required_error: 'Please select account type',
    }),
    organizationName: z.string().optional(),
    gstin: z.string().optional(),
    pan: z.string().optional(),
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
  })
  .refine((data) => {
    // Organization name is required for CA_ORG and ENTERPRISE
    if ((data.customerType === 'CA_ORG' || data.customerType === 'ENTERPRISE') &&
        (!data.organizationName || data.organizationName.trim() === '')) {
      return false;
    }
    return true;
  }, {
    message: 'Organization name is required',
    path: ['organizationName'],
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
      inviteToken: params.token || undefined,
      customerType: undefined,
      organizationName: '',
      gstin: '',
      pan: '',
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
  const customerType = watch('customerType');

  const onSubmit = async (data: SignupFormData) => {
    try {
      const { confirmPassword, termsAccepted, ...signupData } = data;
      // Format date as ISO string for API
      const formattedData = {
        ...signupData,
        dateOfBirth: data.dateOfBirth.toISOString().split('T')[0], // YYYY-MM-DD format
      };
      const response = await signup(formattedData).unwrap();

      // Check if account is pending approval
      if (response.user?.status === 'PENDING_APPROVAL') {
        router.replace('/(auth)/pending-approval' as any);
      } else {
        router.replace('/(tabs)' as any);
      }
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
          paddingTop="$6"
          paddingBottom="$8"
          $gtSm={{
            paddingHorizontal: '$8',
          }}
        >
          {/* Back to login */}
          <Pressable
            onPress={() => router.push('/login')}
            hitSlop={spacing.sm}
          >
            <XStack alignItems="center" gap="$2" marginBottom="$6">
              <ArrowLeft size={20} color={colors.gray700 as any} />
              <Text color={colors.gray700 as any} fontSize={typography.base} fontWeight="500">
                Back to login
              </Text>
            </XStack>
          </Pressable>

          {/* Container with max width */}
          <YStack
            width="100%"
            maxWidth={540}
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
                  backgroundColor={colors.caPrimary as any}
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
                  Create your account
                </H1>
                <Text
                  fontSize={typography.base}
                  color={colors.gray600 as any}
                  textAlign="center"
                >
                  Join Tax Chanakya and streamline your GST compliance
                </Text>
              </YStack>
            </YStack>

            {/* Signup Card */}
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

              {/* Account Type Selection */}
              <Controller
                control={control}
                name="customerType"
                render={({ field: { onChange, value } }) => (
                  <YStack gap="$2">
                    <Text fontSize={typography.sm} fontWeight="600" color={colors.gray700 as any}>
                      Account Type <Text color={colors.error as any}>*</Text>
                    </Text>
                    <XStack gap="$2" flexWrap="wrap">
                      {[
                        { value: 'CA_ORG' as const, label: 'CA Firm' },
                        { value: 'ENTERPRISE' as const, label: 'Enterprise' },
                        { value: 'INDIVIDUAL' as const, label: 'Individual' },
                      ].map((type) => (
                        <Pressable
                          key={type.value}
                          onPress={() => onChange(type.value)}
                          style={{ flex: 1, minWidth: 100 }}
                        >
                          <YStack
                            backgroundColor={value === type.value ? (colors.caPrimary as any) : 'white'}
                            borderWidth={2}
                            borderColor={value === type.value ? (colors.caPrimary as any) : (colors.gray300 as any)}
                            borderRadius="$3"
                            padding="$3"
                            alignItems="center"
                            justifyContent="center"
                          >
                            <Text
                              color={value === type.value ? 'white' : (colors.gray700 as any)}
                              fontWeight="600"
                              fontSize={typography.sm}
                            >
                              {type.label}
                            </Text>
                          </YStack>
                        </Pressable>
                      ))}
                    </XStack>
                    {errors.customerType && (
                      <Text color={colors.error as any} fontSize={typography.xs}>
                        {errors.customerType.message}
                      </Text>
                    )}
                  </YStack>
                )}
              />

              {/* Organization Details Section */}
              {(customerType === 'CA_ORG' || customerType === 'ENTERPRISE') && (
                <YStack gap="$4" padding="$4" backgroundColor={colors.gray50 as any} borderRadius="$4">
                  <H2 fontSize={typography.lg} fontWeight="600" color={colors.gray800 as any}>
                    Organization Details
                  </H2>

                  {/* Organization Name */}
                  <Controller
                    control={control}
                    name="organizationName"
                    render={({ field: { onChange, onBlur, value } }) => (
                      <Input
                        label="Organization Name"
                        placeholder={customerType === 'CA_ORG' ? 'ABC & Associates' : 'Your Company Name'}
                        value={value}
                        onChangeText={onChange}
                        onBlur={onBlur}
                        error={errors.organizationName?.message}
                        required
                        autoCapitalize="words"
                        editable={!isLoading}
                      />
                    )}
                  />

                  {/* GSTIN */}
                  <Controller
                    control={control}
                    name="gstin"
                    render={({ field: { onChange, onBlur, value } }) => (
                      <Input
                        label="GSTIN"
                        placeholder="27AABCA1234A1Z5"
                        value={value}
                        onChangeText={onChange}
                        onBlur={onBlur}
                        error={errors.gstin?.message}
                        hint="Optional"
                        autoCapitalize="characters"
                        editable={!isLoading}
                      />
                    )}
                  />
                </YStack>
              )}

              {/* Personal Details Section */}
              <YStack gap="$4">
                <H2 fontSize={typography.lg} fontWeight="600" color={colors.gray800 as any}>
                  Personal Details
                </H2>

                {/* Name Row */}
                <XStack gap="$3">
                  {/* First Name */}
                  <Controller
                    control={control}
                    name="firstName"
                    render={({ field: { onChange, onBlur, value } }) => (
                      <YStack flex={1}>
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
                      </YStack>
                    )}
                  />

                  {/* Last Name */}
                  <Controller
                    control={control}
                    name="lastName"
                    render={({ field: { onChange, onBlur, value } }) => (
                      <YStack flex={1}>
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
                      </YStack>
                    )}
                  />
                </XStack>

                {/* Email */}
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
                      hint="Optional"
                      keyboardType="phone-pad"
                      autoComplete="tel"
                      textContentType="telephoneNumber"
                      editable={!isLoading}
                    />
                  )}
                />

                {/* Date of Birth */}
                <YStack gap="$2">
                  <XStack alignItems="center" gap="$2">
                    <Text fontSize={typography.sm} fontWeight="600" color={colors.gray700 as any}>
                      Date of Birth <Text color={colors.error as any}>*</Text>
                    </Text>
                  </XStack>
                  {Platform.OS === 'web' ? (
                    <YStack position="relative">
                      <XStack
                        backgroundColor={errors.dateOfBirth ? (colors.statusError as any) : (colors.gray100 as any)}
                        borderRadius="$2"
                        borderWidth={1}
                        borderColor={errors.dateOfBirth ? (colors.error as any) : (colors.gray300 as any)}
                        paddingHorizontal="$4"
                        height={52}
                        alignItems="center"
                        gap="$3"
                      >
                        <Calendar size={20} color={colors.gray600 as any} />
                        {createElement('input', {
                          type: 'date',
                          value: dateOfBirth ? dateOfBirth.toISOString().split('T')[0] : '',
                          onChange: (e: any) => {
                            if (e.target.value) {
                              setValue('dateOfBirth', new Date(e.target.value));
                            }
                          },
                          max: new Date().toISOString().split('T')[0],
                          disabled: isLoading,
                          placeholder: 'DD/MM/YYYY',
                          style: {
                            border: 'none',
                            outline: 'none',
                            fontSize: 16,
                            width: '100%',
                            backgroundColor: 'transparent',
                            color: colors.gray900,
                            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
                            cursor: isLoading ? 'not-allowed' : 'pointer',
                          },
                        })}
                      </XStack>
                    </YStack>
                  ) : (
                    <Pressable
                      onPress={() => setShowDatePicker(true)}
                      disabled={isLoading}
                    >
                      <XStack
                        backgroundColor={errors.dateOfBirth ? (colors.statusError as any) : (colors.gray100 as any)}
                        borderRadius="$2"
                        borderWidth={1}
                        borderColor={errors.dateOfBirth ? (colors.error as any) : (colors.gray300 as any)}
                        paddingHorizontal="$4"
                        height={52}
                        alignItems="center"
                        justifyContent="space-between"
                        opacity={isLoading ? 0.7 : 1}
                      >
                        <XStack alignItems="center" gap="$3" flex={1}>
                          <Calendar size={20} color={colors.gray600 as any} />
                          <Text
                            color={dateOfBirth ? (colors.gray900 as any) : (colors.gray500 as any)}
                            fontSize={16}
                          >
                            {dateOfBirth ? formatDate(dateOfBirth) : 'DD/MM/YYYY'}
                          </Text>
                        </XStack>
                        <YStack
                          backgroundColor={colors.caPrimary as any}
                          width={32}
                          height={32}
                          borderRadius="$2"
                          alignItems="center"
                          justifyContent="center"
                        >
                          <Calendar size={16} color="white" />
                        </YStack>
                      </XStack>
                    </Pressable>
                  )}
                  {errors.dateOfBirth && (
                    <XStack alignItems="center" gap="$1.5">
                      <Text color={colors.error as any} fontSize={typography.xs}>
                        {errors.dateOfBirth.message}
                      </Text>
                    </XStack>
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
              </YStack>

              {/* Security Section */}
              <YStack gap="$4">
                <H2 fontSize={typography.lg} fontWeight="600" color={colors.gray800 as any}>
                  Security
                </H2>

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
              </YStack>

              {/* Terms and Conditions */}
              <Controller
                control={control}
                name="termsAccepted"
                render={({ field: { value, onChange } }) => (
                  <YStack gap="$2">
                    <XStack alignItems="flex-start" gap="$3">
                      <Pressable
                        onPress={() => onChange(!value)}
                        hitSlop={spacing.sm}
                      >
                        <View
                          width={20}
                          height={20}
                          borderRadius="$1"
                          borderWidth={2}
                          borderColor={errors.termsAccepted ? (colors.error as any) : (colors.gray300 as any)}
                          backgroundColor={value ? (colors.caPrimary as any) : 'transparent'}
                          justifyContent="center"
                          alignItems="center"
                        >
                          {value && <Check size={14} color="white" />}
                        </View>
                      </Pressable>
                      <Text
                        fontSize={typography.sm}
                        color={colors.gray700 as any}
                        flex={1}
                        onPress={() => onChange(!value)}
                      >
                        I agree to the{' '}
                        <Text
                          fontWeight="600"
                          color={colors.caPrimary as any}
                          textDecorationLine="underline"
                          onPress={() => router.push('/terms-of-service' as any)}
                        >
                          Terms of Service
                        </Text>{' '}
                        and{' '}
                        <Text
                          fontWeight="600"
                          color={colors.caPrimary as any}
                          textDecorationLine="underline"
                          onPress={() => router.push('/privacy-policy' as any)}
                        >
                          Privacy Policy
                        </Text>
                      </Text>
                    </XStack>
                    {errors.termsAccepted && (
                      <Text color={colors.error as any} fontSize={typography.xs} marginLeft="$5">
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
                >
                  Create Account
                </Button>
              </YStack>
            </YStack>

            {/* Divider */}
            <XStack alignItems="center" gap="$3">
              <Separator flex={1} />
              <Text fontSize={typography.sm} color={colors.gray500 as any}>
                Already have an account?
              </Text>
              <Separator flex={1} />
            </XStack>

            {/* Sign In Link */}
            <YStack
              backgroundColor="white"
              borderRadius="$5"
              padding="$4"
              borderWidth={1}
              borderColor={colors.gray200 as any}
            >
              <XStack justifyContent="center" alignItems="center" gap="$2">
                <Pressable
                  onPress={() => router.push('/login')}
                  hitSlop={spacing.sm}
                >
                  <Text
                    fontSize={typography.base}
                    fontWeight="700"
                    color={colors.caPrimary as any}
                  >
                    Sign In Instead
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

// Password strength component
function PasswordStrengthIndicator({ password = '' }: { password?: string }) {
  const criteria = [
    { label: 'At least 8 characters', regex: /.{8,}/ },
    { label: 'Uppercase letter', regex: /[A-Z]/ },
    { label: 'Lowercase letter', regex: /[a-z]/ },
    { label: 'Number', regex: /\d/ },
  ];

  return (
    <YStack
      gap="$2"
      padding="$3"
      backgroundColor={colors.gray50 as any}
      borderRadius="$3"
    >
      <Text fontSize={typography.xs} fontWeight="600" color={colors.gray700 as any}>
        Password must contain:
      </Text>
      {criteria.map((criterion, index) => {
        const met = criterion.regex.test(password);
        return (
          <XStack key={index} alignItems="center" gap="$2">
            <View
              width={16}
              height={16}
              borderRadius="$full"
              backgroundColor={met ? (colors.success as any) : (colors.gray300 as any)}
              alignItems="center"
              justifyContent="center"
            >
              {met && <Check size={12} color="white" />}
            </View>
            <Text
              fontSize={typography.xs}
              color={met ? (colors.success as any) : (colors.gray600 as any)}
              fontWeight={met ? '600' : '400'}
            >
              {criterion.label}
            </Text>
          </XStack>
        );
      })}
    </YStack>
  );
}
