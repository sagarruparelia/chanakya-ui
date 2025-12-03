import { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { Box } from '@/components/ui/box';
import { Center } from '@/components/ui/center';
import { VStack } from '@/components/ui/vstack';
import { HStack } from '@/components/ui/hstack';
import { Heading } from '@/components/ui/heading';
import { Text } from '@/components/ui/text';
import { Input, InputField } from '@/components/ui/input';
import { Button, ButtonText, ButtonSpinner } from '@/components/ui/button';

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    setIsLoading(true);
    // TODO: Implement actual login logic with Cognito
    console.log('Login attempt:', { email, password });
    setTimeout(() => setIsLoading(false), 1000);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1 bg-background-0"
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
      >
        <Center className="flex-1 px-6 py-12">
          <Box className="w-full max-w-md">
            {/* Logo/Brand */}
            <VStack space="sm" className="mb-10 items-center">
              <Heading size="3xl" className="text-typography-950">
                Chanakya
              </Heading>
              <Text size="md" className="text-center text-typography-500">
                GST Compliance Platform for CA Firms
              </Text>
            </VStack>

            {/* Login Form */}
            <Box className="rounded-2xl bg-background-50 p-6 shadow-soft-2">
              <Heading size="xl" className="mb-6 text-center text-typography-900">
                Sign In
              </Heading>

              <VStack space="lg">
                {/* Email Field */}
                <VStack space="xs">
                  <Text size="sm" className="font-medium text-typography-700">
                    Email Address
                  </Text>
                  <Input size="lg" variant="outline">
                    <InputField
                      value={email}
                      onChangeText={setEmail}
                      placeholder="you@example.com"
                      keyboardType="email-address"
                      autoCapitalize="none"
                      autoComplete="email"
                    />
                  </Input>
                </VStack>

                {/* Password Field */}
                <VStack space="xs">
                  <Text size="sm" className="font-medium text-typography-700">
                    Password
                  </Text>
                  <Input size="lg" variant="outline">
                    <InputField
                      value={password}
                      onChangeText={setPassword}
                      placeholder="Enter your password"
                      secureTextEntry
                      autoComplete="password"
                    />
                  </Input>
                </VStack>

                {/* Forgot Password */}
                <Pressable className="self-end">
                  <Text size="sm" className="text-info-600">
                    Forgot password?
                  </Text>
                </Pressable>

                {/* Login Button */}
                <Button
                  size="lg"
                  action="primary"
                  onPress={handleLogin}
                  disabled={isLoading}
                  className="mt-2"
                >
                  {isLoading && <ButtonSpinner color="white" />}
                  <ButtonText>{isLoading ? 'Signing in...' : 'Sign In'}</ButtonText>
                </Button>
              </VStack>
            </Box>

            {/* Register Link */}
            <HStack space="xs" className="mt-6 justify-center">
              <Text size="md" className="text-typography-500">
                New CA firm?
              </Text>
              <Pressable onPress={() => router.push('/register')}>
                <Text size="md" className="font-semibold text-info-600">
                  Register here
                </Text>
              </Pressable>
            </HStack>
          </Box>
        </Center>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
