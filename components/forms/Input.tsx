import { forwardRef, useState } from 'react';
import {
  Input as TamaguiInput,
  Label,
  XStack,
  YStack,
  Text,
  styled,
  GetProps,
} from 'tamagui';
import { Eye, EyeOff, AlertCircle } from '@tamagui/lucide-icons';
import { Pressable, TextInput } from 'react-native';

const StyledInput = styled(TamaguiInput, {
  height: 52,
  borderWidth: 1,
  borderColor: '$borderColorStrong',
  backgroundColor: '$background',
  borderRadius: '$2',
  paddingHorizontal: '$4',
  fontSize: 16,
  color: '$color',
  placeholderTextColor: '$colorMuted',

  focusStyle: {
    borderColor: '$primary',
    borderWidth: 2,
  },

  variants: {
    disabled: {
      true: {
        backgroundColor: '$backgroundSubtle',
        color: '$colorDisabled',
        opacity: 0.7,
      },
    },
  },
});

interface InputProps extends Omit<GetProps<typeof TamaguiInput>, 'size'> {
  label: string;
  error?: string;
  hint?: string;
  required?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Input = forwardRef<TextInput, InputProps>(
  (
    {
      label,
      error,
      hint,
      required,
      leftIcon,
      rightIcon,
      disabled,
      id,
      ...props
    },
    ref
  ) => {
    const inputId = id || `input-${label.toLowerCase().replace(/\s/g, '-')}`;
    const errorId = `${inputId}-error`;
    const hintId = `${inputId}-hint`;

    return (
      <YStack gap="$1.5">
        <Label
          htmlFor={inputId}
          fontSize={14}
          fontWeight="600"
          color="$color"
        >
          {label}
          {required && (
            <Text color="$error" aria-hidden={true}>
              {' '}
              *
            </Text>
          )}
        </Label>

        <XStack alignItems="center" position="relative">
          {leftIcon && (
            <XStack
              position="absolute"
              left="$4"
              zIndex={1}
              pointerEvents="none"
            >
              {leftIcon}
            </XStack>
          )}

          <StyledInput
            ref={ref}
            id={inputId}
            borderColor={error ? '$error' : '$borderColorStrong'}
            backgroundColor={error ? '$errorBg' : '$background'}
            disabled={disabled}
            paddingLeft={leftIcon ? '$10' : '$4'}
            paddingRight={rightIcon ? '$10' : '$4'}
            flex={1}
            accessibilityLabel={label}
            accessibilityHint={hint}
            accessibilityState={{ disabled: !!disabled }}
            {...props}
          />

          {rightIcon && (
            <XStack
              position="absolute"
              right="$4"
              zIndex={1}
            >
              {rightIcon}
            </XStack>
          )}
        </XStack>

        {error && (
          <XStack gap="$1.5" alignItems="center">
            <AlertCircle size={14} color="$error" />
            <Text
              id={errorId}
              fontSize={12}
              color="$error"
              accessibilityRole="alert"
              accessibilityLiveRegion="polite"
            >
              {error}
            </Text>
          </XStack>
        )}

        {hint && !error && (
          <Text id={hintId} fontSize={12} color="$colorSecondary">
            {hint}
          </Text>
        )}
      </YStack>
    );
  }
);

Input.displayName = 'Input';

// Password input with visibility toggle
interface PasswordInputProps extends Omit<InputProps, 'secureTextEntry' | 'rightIcon'> {}

export const PasswordInput = forwardRef<TextInput, PasswordInputProps>(
  (props, ref) => {
    const [visible, setVisible] = useState(false);

    return (
      <Input
        ref={ref}
        secureTextEntry={!visible}
        autoCapitalize="none"
        autoCorrect={false}
        textContentType="password"
        rightIcon={
          <Pressable
            onPress={() => setVisible(!visible)}
            accessibilityRole="button"
            accessibilityLabel={visible ? 'Hide password' : 'Show password'}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            {visible ? (
              <EyeOff size={20} color="$colorSecondary" />
            ) : (
              <Eye size={20} color="$colorSecondary" />
            )}
          </Pressable>
        }
        {...props}
      />
    );
  }
);

PasswordInput.displayName = 'PasswordInput';

export default Input;
