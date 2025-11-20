import { forwardRef } from 'react';
import { Pressable } from 'react-native';
import { Spinner, Text, XStack, YStack, useTheme } from 'tamagui';

type ButtonVariant = 'solid' | 'outlined' | 'ghost' | 'danger';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps {
  children: React.ReactNode;
  onPress?: () => void;
  loading?: boolean;
  loadingText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  accessibilityLabel?: string;
  accessibilityHint?: string;
  fullWidth?: boolean;
  variant?: ButtonVariant;
  size?: ButtonSize;
  disabled?: boolean;
}

export const Button = forwardRef<any, ButtonProps>(
  (
    {
      children,
      onPress,
      loading,
      loadingText,
      leftIcon,
      rightIcon,
      disabled,
      accessibilityLabel,
      accessibilityHint,
      variant = 'solid',
      size = 'lg',
      fullWidth,
    },
    ref
  ) => {
    const theme = useTheme();
    const isDisabled = disabled || loading;
    const isFilled = variant === 'solid' || variant === 'danger';

    const getBackgroundColor = () => {
      if (variant === 'solid') return theme.primary?.val;
      if (variant === 'danger') return theme.error?.val;
      return 'transparent';
    };

    const getBorderColor = () => {
      if (variant === 'outlined') return theme.primary?.val;
      return 'transparent';
    };

    const getTextColor = () => {
      if (isFilled) return theme.onPrimary?.val;
      return theme.primary?.val;
    };

    const getHeight = () => {
      switch (size) {
        case 'sm': return 36;
        case 'md': return 44;
        case 'lg': return 52;
      }
    };

    const getPadding = () => {
      switch (size) {
        case 'sm': return 16;
        case 'md': return 20;
        case 'lg': return 24;
      }
    };

    return (
      <Pressable
        ref={ref}
        onPress={onPress}
        disabled={isDisabled}
        accessibilityRole="button"
        accessibilityLabel={
          accessibilityLabel || (typeof children === 'string' ? children : undefined)
        }
        accessibilityHint={accessibilityHint}
        accessibilityState={{ disabled: isDisabled }}
        style={({ pressed }) => ({
          height: getHeight(),
          paddingHorizontal: getPadding(),
          backgroundColor: getBackgroundColor(),
          borderWidth: variant === 'outlined' ? 1 : 0,
          borderColor: getBorderColor(),
          borderRadius: 8,
          justifyContent: 'center',
          alignItems: 'center',
          opacity: isDisabled ? 0.7 : pressed ? 0.9 : 1,
          transform: [{ scale: pressed ? 0.98 : 1 }],
          width: fullWidth ? '100%' : undefined,
        })}
      >
        <XStack alignItems="center" justifyContent="center" gap="$2">
          {loading ? (
            <>
              <Spinner size="small" color={isFilled ? 'white' : '$primary'} />
              {loadingText && (
                <Text
                  color={isFilled ? '$onPrimary' : '$primary'}
                  fontSize={size === 'sm' ? 14 : 16}
                  fontWeight="600"
                >
                  {loadingText}
                </Text>
              )}
            </>
          ) : (
            <>
              {leftIcon}
              {typeof children === 'string' ? (
                <Text
                  color={isFilled ? '$onPrimary' : '$primary'}
                  fontSize={size === 'sm' ? 14 : 16}
                  fontWeight="600"
                >
                  {children}
                </Text>
              ) : (
                children
              )}
              {rightIcon}
            </>
          )}
        </XStack>
      </Pressable>
    );
  }
);

Button.displayName = 'Button';

export default Button;
