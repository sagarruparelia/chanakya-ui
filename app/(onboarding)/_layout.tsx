import { Stack } from 'expo-router';
import { useTheme } from 'tamagui';

export default function OnboardingLayout() {
  const theme = useTheme();

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: {
          backgroundColor: theme.background?.val,
        },
        animation: 'fade',
      }}
    >
      <Stack.Screen name="request-access" />
      <Stack.Screen name="enter-invitation" />
      <Stack.Screen name="pending-approval" />
      <Stack.Screen name="pending-verification" />
      <Stack.Screen name="rejected" />
      <Stack.Screen name="complete-profile" />
    </Stack>
  );
}
