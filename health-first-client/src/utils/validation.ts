import * as yup from 'yup';

// Email or phone validation regex
const emailOrPhoneRegex = /^(\+?[\d\s\-\(\)]{10,}|[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})$/;

export const loginSchema = yup.object({
  emailOrPhone: yup
    .string()
    .required('Email or phone number is required')
    .matches(emailOrPhoneRegex, 'Please enter a valid email or phone number'),
  password: yup
    .string()
    .required('Password is required')
    .min(6, 'Password must be at least 6 characters'),
  rememberMe: yup.boolean().required(),
});

export type LoginFormData = yup.InferType<typeof loginSchema>;

// Helper function to detect if input is email or phone
export const isEmail = (value: string): boolean => {
  return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value);
};

export const isPhone = (value: string): boolean => {
  return /^\+?[\d\s\-\(\)]{10,}$/.test(value);
}; 