import { XStack, Text } from 'tamagui';
import { AlertCircle } from '@tamagui/lucide-icons';

interface ErrorBannerProps {
  message: string;
}

export function ErrorBanner({ message }: ErrorBannerProps) {
  if (!message) return null;

  return (
    <XStack
      backgroundColor="$errorBg"
      padding="$4"
      borderRadius="$2"
      gap="$3"
      alignItems="center"
      accessibilityRole="alert"
      accessibilityLiveRegion="polite"
    >
      <AlertCircle size={20} color="$error" flexShrink={0} />
      <Text color="$error" fontSize={14} flex={1}>
        {message}
      </Text>
    </XStack>
  );
}

export default ErrorBanner;
