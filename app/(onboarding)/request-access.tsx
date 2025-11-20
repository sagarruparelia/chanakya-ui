import { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, Pressable } from 'react-native';
import { YStack, XStack, Text, H2, RadioGroup, Label, TextArea } from 'tamagui';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { router } from 'expo-router';
import { User, Building, Briefcase } from '@tamagui/lucide-icons';

import { Input } from '@/components/forms/Input';
import { Button } from '@/components/ui/Button';
import { ErrorBanner } from '@/components/ui/ErrorBanner';
import { useSubmitAccessRequestMutation, useActivateInvitationMutation } from '@/store/api';
import { useAppDispatch } from '@/store';
import { logout } from '@/store/authSlice';
import type { AccessType } from '@/types';

// Validation schema
const accessRequestSchema = z.object({
  accessType: z.enum(['individual', 'business', 'ca_firm']),
  reason: z
    .string()
    .min(1, 'Please tell us what you are looking for')
    .min(10, 'Please provide more detail (at least 10 characters)'),
  invitationCode: z.string().optional(),
});

type AccessRequestFormData = z.infer<typeof accessRequestSchema>;

const accessTypes = [
  {
    value: 'individual' as AccessType,
    label: 'Individual',
    description: 'For personal use',
    icon: User,
  },
  {
    value: 'business' as AccessType,
    label: 'Business',
    description: 'For my company',
    icon: Building,
  },
  {
    value: 'ca_firm' as AccessType,
    label: 'CA Firm',
    description: 'Managing multiple clients',
    icon: Briefcase,
  },
];

export default function RequestAccessScreen() {
  const dispatch = useAppDispatch();
  const [submitRequest, { isLoading: isSubmitting, error: submitError }] =
    useSubmitAccessRequestMutation();
  const [activateInvitation, { isLoading: isActivating, error: activateError }] =
    useActivateInvitationMutation();
  const [showInvitationInput, setShowInvitationInput] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<AccessRequestFormData>({
    resolver: zodResolver(accessRequestSchema),
    defaultValues: {
      accessType: undefined,
      reason: '',
      invitationCode: '',
    },
  });

  const invitationCode = watch('invitationCode');

  const onSubmit = async (data: AccessRequestFormData) => {
    try {
      // If invitation code is provided, try to activate it
      if (data.invitationCode && data.invitationCode.length > 0) {
        const result = await activateInvitation({ code: data.invitationCode }).unwrap();
        if (result.status === 'activated') {
          router.replace('/complete-profile' as any);
        } else {
          router.replace('/pending-verification' as any);
        }
      } else {
        // Submit access request
        await submitRequest({
          accessType: data.accessType,
          reason: data.reason,
        }).unwrap();
        router.replace('/pending-approval' as any);
      }
    } catch (err) {
      // Error is handled by RTK Query
    }
  };

  const handleSignOut = () => {
    dispatch(logout());
    router.replace('/login');
  };

  const errorMessage = (submitError as any)?.message || (activateError as any)?.message || '';
  const isLoading = isSubmitting || isActivating;

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
            <H2 fontSize={24} fontWeight="600" color="$color">
              Request Access
            </H2>

            <Text color="$colorSecondary" fontSize={14}>
              How will you use Chanakya?
            </Text>
          </YStack>

          {/* Form */}
          <YStack gap="$4" flex={1}>
            {/* Error Banner */}
            {errorMessage && <ErrorBanner message={errorMessage} />}

            {/* Access Type Selection */}
            <Controller
              control={control}
              name="accessType"
              render={({ field: { onChange, value } }) => (
                <YStack gap="$3">
                  {accessTypes.map((type) => {
                    const Icon = type.icon;
                    const isSelected = value === type.value;

                    return (
                      <Pressable
                        key={type.value}
                        onPress={() => onChange(type.value)}
                        accessibilityRole="radio"
                        accessibilityState={{ checked: isSelected }}
                        accessibilityLabel={`${type.label}: ${type.description}`}
                      >
                        <XStack
                          backgroundColor={isSelected ? '$infoBg' : '$backgroundStrong'}
                          borderWidth={2}
                          borderColor={isSelected ? '$primary' : 'transparent'}
                          borderRadius="$2"
                          padding="$4"
                          gap="$3"
                          alignItems="center"
                        >
                          <YStack
                            width={40}
                            height={40}
                            borderRadius="$2"
                            backgroundColor={isSelected ? '$primary' : '$backgroundSubtle'}
                            alignItems="center"
                            justifyContent="center"
                          >
                            <Icon
                              size={20}
                              color={isSelected ? '$onPrimary' : '$colorSecondary'}
                            />
                          </YStack>
                          <YStack flex={1}>
                            <Text
                              fontWeight="600"
                              color="$color"
                              fontSize={16}
                            >
                              {type.label}
                            </Text>
                            <Text
                              color="$colorSecondary"
                              fontSize={14}
                            >
                              {type.description}
                            </Text>
                          </YStack>
                          <YStack
                            width={20}
                            height={20}
                            borderRadius={10}
                            borderWidth={2}
                            borderColor={isSelected ? '$primary' : '$borderColorStrong'}
                            backgroundColor={isSelected ? '$primary' : 'transparent'}
                            alignItems="center"
                            justifyContent="center"
                          >
                            {isSelected && (
                              <YStack
                                width={8}
                                height={8}
                                borderRadius={4}
                                backgroundColor="$onPrimary"
                              />
                            )}
                          </YStack>
                        </XStack>
                      </Pressable>
                    );
                  })}
                  {errors.accessType && (
                    <Text color="$error" fontSize={12}>
                      {errors.accessType.message}
                    </Text>
                  )}
                </YStack>
              )}
            />

            {/* Reason */}
            <Controller
              control={control}
              name="reason"
              render={({ field: { onChange, onBlur, value } }) => (
                <YStack gap="$1.5">
                  <Label fontSize={14} fontWeight="600" color="$color">
                    What are you looking for? *
                  </Label>
                  <TextArea
                    placeholder="Tell us about your needs..."
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    height={100}
                    borderWidth={1}
                    borderColor={errors.reason ? '$error' : '$borderColorStrong'}
                    backgroundColor="$background"
                    borderRadius="$2"
                    padding="$3"
                    fontSize={16}
                    color="$color"
                    placeholderTextColor="$colorMuted"
                    editable={!isLoading}
                    accessibilityLabel="What are you looking for"
                    accessibilityHint="Describe your needs and how you plan to use Chanakya"
                  />
                  {errors.reason && (
                    <Text color="$error" fontSize={12}>
                      {errors.reason.message}
                    </Text>
                  )}
                </YStack>
              )}
            />

            {/* Divider */}
            <XStack alignItems="center" gap="$3" marginVertical="$2">
              <YStack flex={1} height={1} backgroundColor="$borderColor" />
              <Text color="$colorMuted" fontSize={12}>
                OR
              </Text>
              <YStack flex={1} height={1} backgroundColor="$borderColor" />
            </XStack>

            {/* Invitation Code */}
            {!showInvitationInput ? (
              <Pressable
                onPress={() => setShowInvitationInput(true)}
                accessibilityRole="button"
                accessibilityLabel="Enter invitation code"
              >
                <Text
                  color="$primary"
                  fontSize={14}
                  fontWeight="600"
                  textAlign="center"
                >
                  Have an invitation code?
                </Text>
              </Pressable>
            ) : (
              <Controller
                control={control}
                name="invitationCode"
                render={({ field: { onChange, onBlur, value } }) => (
                  <Input
                    label="Invitation Code"
                    placeholder="Enter your code"
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    hint="Code expires 7 days from issue date"
                    autoCapitalize="characters"
                    editable={!isLoading}
                  />
                )}
              />
            )}

            {/* Submit Button */}
            <YStack marginTop="$2">
              <Button
                onPress={handleSubmit(onSubmit)}
                loading={isLoading}
                loadingText={invitationCode ? 'Activating...' : 'Submitting...'}
                fullWidth
                accessibilityLabel={invitationCode ? 'Activate invitation' : 'Submit access request'}
              >
                {invitationCode ? 'Activate' : 'Submit Request'}
              </Button>
            </YStack>

            {/* Sign Out */}
            <Button
              variant="outlined"
              onPress={handleSignOut}
              fullWidth
              accessibilityLabel="Sign out"
            >
              Sign Out
            </Button>
          </YStack>
        </YStack>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
