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

export default function RegisterScreen() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    firmName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });
  const [isLoading, setIsLoading] = useState(false);

  const updateField = (field: keyof typeof formData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleRegister = async () => {
    if (formData.password !== formData.confirmPassword) {
      console.log('Passwords do not match');
      return;
    }
    setIsLoading(true);
    // TODO: Implement actual registration logic with API
    console.log('Register attempt:', formData);
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
            <VStack space="sm" className="mb-8 items-center">
              <Heading size="3xl" className="text-typography-950">
                Chanakya
              </Heading>
              <Text size="md" className="text-center text-typography-500">
                GST Compliance Platform for CA Firms
              </Text>
            </VStack>

            {/* Registration Form */}
            <Box className="rounded-2xl bg-background-50 p-6 shadow-soft-2">
              <Heading size="xl" className="mb-6 text-center text-typography-900">
                Register Your CA Firm
              </Heading>

              <VStack space="md">
                {/* Firm Name */}
                <VStack space="xs">
                  <Text size="sm" className="font-medium text-typography-700">
                    CA Firm Name
                  </Text>
                  <Input size="lg" variant="outline">
                    <InputField
                      value={formData.firmName}
                      onChangeText={(v) => updateField('firmName', v)}
                      placeholder="Your CA Firm Name"
                      autoCapitalize="words"
                    />
                  </Input>
                </VStack>

                {/* Email Field */}
                <VStack space="xs">
                  <Text size="sm" className="font-medium text-typography-700">
                    Email Address
                  </Text>
                  <Input size="lg" variant="outline">
                    <InputField
                      value={formData.email}
                      onChangeText={(v) => updateField('email', v)}
                      placeholder="you@example.com"
                      keyboardType="email-address"
                      autoCapitalize="none"
                      autoComplete="email"
                    />
                  </Input>
                </VStack>

                {/* Phone Field */}
                <VStack space="xs">
                  <Text size="sm" className="font-medium text-typography-700">
                    Phone Number
                  </Text>
                  <Input size="lg" variant="outline">
                    <InputField
                      value={formData.phone}
                      onChangeText={(v) => updateField('phone', v)}
                      placeholder="+91 98765 43210"
                      keyboardType="phone-pad"
                      autoComplete="tel"
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
                      value={formData.password}
                      onChangeText={(v) => updateField('password', v)}
                      placeholder="Create a password"
                      secureTextEntry
                      autoComplete="new-password"
                    />
                  </Input>
                </VStack>

                {/* Confirm Password Field */}
                <VStack space="xs">
                  <Text size="sm" className="font-medium text-typography-700">
                    Confirm Password
                  </Text>
                  <Input size="lg" variant="outline">
                    <InputField
                      value={formData.confirmPassword}
                      onChangeText={(v) => updateField('confirmPassword', v)}
                      placeholder="Confirm your password"
                      secureTextEntry
                      autoComplete="new-password"
                    />
                  </Input>
                </VStack>

                {/* Terms Notice */}
                <Text size="xs" className="text-center text-typography-400">
                  By registering, you agree to our Terms of Service and Privacy Policy
                </Text>

                {/* Register Button */}
                <Button
                  size="lg"
                  action="primary"
                  onPress={handleRegister}
                  disabled={isLoading}
                  className="mt-2"
                >
                  {isLoading && <ButtonSpinner color="white" />}
                  <ButtonText>{isLoading ? 'Registering...' : 'Register'}</ButtonText>
                </Button>
              </VStack>
            </Box>

            {/* Login Link */}
            <HStack space="xs" className="mt-6 justify-center">
              <Text size="md" className="text-typography-500">
                Already have an account?
              </Text>
              <Pressable onPress={() => router.push('/')}>
                <Text size="md" className="font-semibold text-info-600">
                  Sign In
                </Text>
              </Pressable>
            </HStack>
          </Box>
        </Center>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
