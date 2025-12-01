import { YStack, XStack, Text, H1, View, ScrollView } from 'tamagui';
import { router } from 'expo-router';
import { Clock, CheckCircle, Mail, Shield } from '@tamagui/lucide-icons';

import { Button } from '@/components/ui/Button';
import { useAppDispatch } from '@/store';
import { logout } from '@/store/authSlice';
import { colors, typography } from '@/constants/theme';

export default function PendingApprovalScreen() {
  const dispatch = useAppDispatch();

  const handleSignOut = () => {
    dispatch(logout());
    router.replace('/login');
  };

  return (
    <ScrollView
      flex={1}
      backgroundColor={colors.gray50}
      contentContainerStyle={{
        flexGrow: 1,
        padding: 16,
        paddingTop: 48,
        justifyContent: 'center',
        alignItems: 'center',
      }}
      showsVerticalScrollIndicator={false}
    >
      {/* Brand Logo */}
      <YStack alignItems="center" gap="$3" marginBottom="$6">
        <YStack
          width={80}
          height={80}
          backgroundColor={colors.caPrimary as any}
          borderRadius="$8"
          alignItems="center"
          justifyContent="center"
          shadowColor={colors.caPrimary}
          shadowOffset={{ width: 0, height: 8 }}
          shadowOpacity={0.3}
          shadowRadius={16}
          elevation={8}
          borderWidth={4}
          borderColor="white"
        >
          <Text
            fontSize={32}
            fontWeight="900"
            color="white"
            letterSpacing={-1}
          >
            TC
          </Text>
        </YStack>

        <YStack alignItems="center" gap="$1">
          <Text
            fontSize={typography.xl}
            fontWeight="800"
            color={colors.caPrimary as any}
            letterSpacing={-0.5}
          >
            Tax Chanakya
          </Text>
          <Text
            fontSize={typography.xs}
            fontWeight="600"
            color={colors.gray500 as any}
            textTransform="uppercase"
            letterSpacing={0.5}
          >
            GST Compliance Made Simple
          </Text>
        </YStack>
      </YStack>

      {/* Card Container */}
      <YStack
        backgroundColor="white"
        borderRadius="$6"
        padding="$6"
        paddingTop="$8"
        maxWidth={540}
        width="100%"
        alignItems="center"
        gap="$5"
        borderWidth={1}
        borderColor={colors.gray200 as any}
        shadowColor="black"
        shadowOffset={{ width: 0, height: 2 }}
        shadowOpacity={0.05}
        shadowRadius={8}
        elevation={2}
      >
        {/* Icon */}
        <View
          backgroundColor={colors.statusWarning as any}
          padding="$5"
          borderRadius={999}
          marginBottom="$2"
        >
          <Clock size={56} color={colors.warning as any} />
        </View>

        {/* Title */}
        <YStack alignItems="center" gap="$2">
          <H1
            fontSize={typography['2xl']}
            fontWeight="700"
            color={colors.gray900 as any}
            textAlign="center"
          >
            Account Under Review
          </H1>
          <Text
            fontSize={typography.base}
            color={colors.gray600 as any}
            textAlign="center"
            lineHeight={24}
          >
            Thank you for signing up with Tax Chanakya!
          </Text>
        </YStack>

        {/* Description */}
        <YStack gap="$4" width="100%">
          {/* Current Status */}
          <YStack
            backgroundColor={colors.statusWarning as any}
            borderRadius="$3"
            padding="$4"
            gap="$2"
          >
            <XStack alignItems="center" gap="$2">
              <Shield size={20} color={colors.warning as any} />
              <Text fontSize={typography.sm} fontWeight="700" color={colors.statusWarningText as any}>
                Your account is pending approval
              </Text>
            </XStack>
            <Text fontSize={typography.sm} color={colors.statusWarningText as any} lineHeight={20}>
              We manually verify all new CA organizations to ensure platform security and compliance.
            </Text>
          </YStack>

          {/* Steps */}
          <YStack
            backgroundColor={colors.gray50 as any}
            borderRadius="$4"
            padding="$4"
            gap="$4"
          >
            <Text fontSize={typography.base} fontWeight="600" color={colors.gray800 as any}>
              Registration Progress
            </Text>

            <XStack gap="$3" alignItems="flex-start">
              <YStack
                width={28}
                height={28}
                borderRadius={999}
                backgroundColor={colors.success as any}
                alignItems="center"
                justifyContent="center"
              >
                <CheckCircle size={18} color="white" />
              </YStack>
              <YStack flex={1}>
                <Text fontSize={typography.sm} fontWeight="600" color={colors.gray900 as any}>
                  Account Created
                </Text>
                <Text fontSize={typography.xs} color={colors.gray600 as any}>
                  Your account has been successfully created
                </Text>
              </YStack>
            </XStack>

            <XStack gap="$3" alignItems="flex-start">
              <YStack
                width={28}
                height={28}
                borderRadius={999}
                backgroundColor={colors.warning as any}
                alignItems="center"
                justifyContent="center"
              >
                <Clock size={18} color="white" />
              </YStack>
              <YStack flex={1}>
                <Text fontSize={typography.sm} fontWeight="600" color={colors.gray900 as any}>
                  Under Review
                </Text>
                <Text fontSize={typography.xs} color={colors.gray600 as any}>
                  Our team is verifying your organization details
                </Text>
              </YStack>
            </XStack>

            <XStack gap="$3" alignItems="flex-start">
              <YStack
                width={28}
                height={28}
                borderRadius={999}
                backgroundColor={colors.gray300 as any}
                alignItems="center"
                justifyContent="center"
              >
                <Mail size={18} color={colors.gray600 as any} />
              </YStack>
              <YStack flex={1}>
                <Text fontSize={typography.sm} fontWeight="600" color={colors.gray600 as any}>
                  Approval Notification
                </Text>
                <Text fontSize={typography.xs} color={colors.gray500 as any}>
                  You'll receive an email once approved
                </Text>
              </YStack>
            </XStack>
          </YStack>

          {/* Info Box */}
          <YStack
            backgroundColor={colors.statusInfo as any}
            borderLeftWidth={4}
            borderLeftColor={colors.info as any}
            borderRadius="$3"
            padding="$4"
            gap="$2"
          >
            <Text fontSize={typography.sm} color={colors.statusInfoText as any} fontWeight="600">
              What happens next?
            </Text>
            <YStack gap="$1.5">
              <Text fontSize={typography.xs} color={colors.statusInfoText as any} lineHeight={18}>
                • Our team will review your application within 24-48 hours
              </Text>
              <Text fontSize={typography.xs} color={colors.statusInfoText as any} lineHeight={18}>
                • You'll receive an email notification once your account is approved
              </Text>
              <Text fontSize={typography.xs} color={colors.statusInfoText as any} lineHeight={18}>
                • After approval, you can login using the password you created during signup
              </Text>
            </YStack>
          </YStack>

          {/* Important Note */}
          <YStack
            backgroundColor="white"
            borderWidth={1}
            borderColor={colors.gray300 as any}
            borderRadius="$3"
            padding="$3"
            gap="$1"
          >
            <Text fontSize={typography.xs} fontWeight="600" color={colors.gray700 as any}>
              💡 Remember your login credentials
            </Text>
            <Text fontSize={typography.xs} color={colors.gray600 as any} lineHeight={18}>
              You created your password during signup. Use it to login once your account is approved.
            </Text>
          </YStack>
        </YStack>

        {/* Action Buttons */}
        <YStack width="100%" gap="$3" marginTop="$2">
          <Button
            onPress={handleSignOut}
            fullWidth
          >
            Go to Login
          </Button>

          <Text fontSize={typography.xs} color={colors.gray500 as any} textAlign="center" lineHeight={18}>
            You can safely close this page. We'll send you an email once your account is approved.
          </Text>
        </YStack>
      </YStack>

      {/* Footer */}
      <YStack alignItems="center" gap="$2" marginTop="$6" marginBottom="$4">
        <Text fontSize={typography.xs} color={colors.gray400 as any}>
          © 2025 Tax Chanakya. All rights reserved.
        </Text>
      </YStack>
    </ScrollView>
  );
}
