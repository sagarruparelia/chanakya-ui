import { YStack, XStack, Text, H2, View } from 'tamagui';
import { router } from 'expo-router';
import { Clock, CheckCircle, Mail } from '@tamagui/lucide-icons';

import { Button } from '@/components/ui/Button';
import { useAppDispatch } from '@/store';
import { logout } from '@/store/authSlice';

export default function PendingApprovalScreen() {
  const dispatch = useAppDispatch();

  const handleSignOut = () => {
    dispatch(logout());
    router.replace('/login');
  };

  return (
    <YStack
      flex={1}
      backgroundColor="#3d4f6f"
      padding="$4"
      paddingTop="$12"
      justifyContent="center"
      alignItems="center"
    >
      {/* Card Container */}
      <YStack
        backgroundColor="white"
        borderRadius="$4"
        padding="$6"
        paddingTop="$8"
        maxWidth={480}
        width="100%"
        alignItems="center"
        gap="$4"
      >
        {/* Icon */}
        <View
          backgroundColor="#fff4e1"
          padding="$4"
          borderRadius={60}
          marginBottom="$2"
        >
          <Clock size={48} color="#ff9800" />
        </View>

        {/* Title */}
        <H2
          fontSize={24}
          fontWeight="600"
          color="#3d4f6f"
          textAlign="center"
        >
          Account Under Review
        </H2>

        {/* Description */}
        <YStack gap="$3" width="100%">
          <Text
            fontSize={16}
            color="#666"
            textAlign="center"
            lineHeight={24}
          >
            Thank you for signing up! Your account is currently under review by
            our team.
          </Text>

          {/* Steps */}
          <YStack
            backgroundColor="#f5f5f5"
            borderRadius="$3"
            padding="$4"
            gap="$3"
            marginTop="$2"
          >
            <XStack gap="$3" alignItems="flex-start">
              <CheckCircle size={20} color="#4caf50" style={{ marginTop: 2 }} />
              <YStack flex={1}>
                <Text fontSize={14} fontWeight="600" color="#000">
                  Application Submitted
                </Text>
                <Text fontSize={13} color="#666">
                  We've received your registration
                </Text>
              </YStack>
            </XStack>

            <XStack gap="$3" alignItems="flex-start">
              <Clock size={20} color="#ff9800" style={{ marginTop: 2 }} />
              <YStack flex={1}>
                <Text fontSize={14} fontWeight="600" color="#000">
                  Under Review
                </Text>
                <Text fontSize={13} color="#666">
                  Our team is reviewing your details
                </Text>
              </YStack>
            </XStack>

            <XStack gap="$3" alignItems="flex-start">
              <Mail size={20} color="#2196f3" style={{ marginTop: 2 }} />
              <YStack flex={1}>
                <Text fontSize={14} fontWeight="600" color="#000">
                  Email Verification
                </Text>
                <Text fontSize={13} color="#666">
                  Please check your inbox and verify your email address
                </Text>
              </YStack>
            </XStack>

            <XStack gap="$3" alignItems="flex-start">
              <Mail size={20} color="#9c27b0" style={{ marginTop: 2 }} />
              <YStack flex={1}>
                <Text fontSize={14} fontWeight="600" color="#000">
                  Account Approval
                </Text>
                <Text fontSize={13} color="#666">
                  You'll receive an email once your account is approved
                </Text>
              </YStack>
            </XStack>
          </YStack>

          {/* Info Box */}
          <YStack
            backgroundColor="#e3f2fd"
            borderLeftWidth={4}
            borderLeftColor="#2196f3"
            borderRadius="$2"
            padding="$3"
            marginTop="$2"
          >
            <Text fontSize={14} color="#1976d2" fontWeight="500">
              What happens next?
            </Text>
            <Text fontSize={13} color="#1565c0" marginTop="$1">
              1. Verify your email address by clicking the link we sent to your inbox
            </Text>
            <Text fontSize={13} color="#1565c0" marginTop="$1">
              2. We'll review your application within 24-48 hours
            </Text>
            <Text fontSize={13} color="#1565c0" marginTop="$1">
              3. Once approved, you'll receive login credentials via email
            </Text>
          </YStack>

          {/* Resend Verification */}
          <Text
            fontSize={13}
            color="#666"
            textAlign="center"
            marginTop="$2"
          >
            Didn't receive the verification email?{' '}
            <Text
              color="#3d4f6f"
              fontWeight="600"
              textDecorationLine="underline"
              onPress={() => router.push('/(auth)/verify-email' as any)}
            >
              Resend
            </Text>
          </Text>
        </YStack>

        {/* Action Button */}
        <YStack width="100%" gap="$2" marginTop="$3">
          <Button
            variant="outlined"
            onPress={handleSignOut}
            fullWidth
            accessibilityLabel="Go to login"
          >
            Go to Login
          </Button>

          <Text fontSize={12} color="#999" textAlign="center">
            You can close this page and check your email for updates
          </Text>
        </YStack>
      </YStack>
    </YStack>
  );
}
