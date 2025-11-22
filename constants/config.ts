// API configuration
export const config = {
  apiUrl: process.env.EXPO_PUBLIC_API_URL || 'http://localhost:8080',
};

// App metadata
export const appConfig = {
  name: 'Chanakya',
  tagline: 'Simplify financial chaos',
  version: '1.0.0',
};

// Validation rules
export const validationRules = {
  password: {
    minLength: 8,
    requireUppercase: true,
    requireLowercase: true,
    requireNumber: true,
  },
  phone: {
    defaultCountryCode: '+91',
  },
  name: {
    minLength: 2,
  },
};

// Timeouts
export const timeouts = {
  apiRequest: 30000, // 30 seconds
  debounce: 300, // 300ms for async validation
};
