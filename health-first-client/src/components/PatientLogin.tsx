import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Link,
  InputAdornment,
  IconButton,
  Container,
  Alert,
  CircularProgress,
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  LocalHospital,
  Person,
  Email,
  Phone,
} from '@mui/icons-material';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

// Email or phone validation regex
const emailOrPhoneRegex = /^(\+?[\d\s\-\(\)]{10,}|[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})$/;

// Validation schema
const loginSchema = yup.object({
  emailOrPhone: yup
    .string()
    .required('Email or phone number is required')
    .matches(emailOrPhoneRegex, 'Please enter a valid email or phone number'),
  password: yup
    .string()
    .required('Password is required')
    .min(1, 'Password cannot be empty'),
});

type LoginFormData = yup.InferType<typeof loginSchema>;

interface PatientLoginProps {
  onLoginSuccess?: () => void;
  onForgotPassword?: () => void;
  onRegister?: () => void;
}

export const PatientLogin: React.FC<PatientLoginProps> = ({
  onLoginSuccess,
  onForgotPassword,
  onRegister,
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [inputType, setInputType] = useState<'email' | 'tel' | 'text'>('text');

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors, isValid },
  } = useForm<LoginFormData>({
    resolver: yupResolver(loginSchema),
    mode: 'onChange',
    defaultValues: {
      emailOrPhone: '',
      password: '',
    },
  });

  const emailOrPhoneValue = watch('emailOrPhone');

  // Update input type based on content
  React.useEffect(() => {
    if (emailOrPhoneValue) {
      if (isEmail(emailOrPhoneValue)) {
        setInputType('email');
      } else if (isPhone(emailOrPhoneValue)) {
        setInputType('tel');
      } else {
        setInputType('text');
      }
    }
  }, [emailOrPhoneValue]);

  // Helper functions to detect input type
  const isEmail = (value: string): boolean => {
    return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value);
  };

  const isPhone = (value: string): boolean => {
    return /^\+?[\d\s\-\(\)]{10,}$/.test(value);
  };

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    setError(null);

    // Sanitize and trim input
    const sanitizedData = {
      emailOrPhone: data.emailOrPhone.trim(),
      password: data.password.trim(),
    };

    try {
      // Simulate API call with sanitized data
      await new Promise((resolve) => setTimeout(resolve, 1500));
      
      // Simulate login validation
      if (sanitizedData.emailOrPhone === 'patient@example.com' && sanitizedData.password === 'password123') {
        console.log('Patient login successful:', sanitizedData);
        onLoginSuccess?.();
      } else {
        setError('Invalid email/phone or password. Please try again.');
      }
    } catch (err) {
      setError('Network error. Please check your connection and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleTogglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const getInputIcon = () => {
    if (isEmail(emailOrPhoneValue || '')) {
      return <Email color="action" />;
    } else if (isPhone(emailOrPhoneValue || '')) {
      return <Phone color="action" />;
    }
    return <Email color="action" />;
  };

  return (
    <Container maxWidth="sm" sx={{ py: 4 }}>
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          background: '#f1f5f9',
        }}
      >
        {/* Header */}
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
            <LocalHospital sx={{ fontSize: 40, color: 'primary.main', mr: 1 }} />
            <Typography variant="h1" color="primary.main" sx={{ fontSize: '2rem', fontWeight: 700 }}>
              Patient Portal
            </Typography>
          </Box>
          <Typography variant="h2" color="text.primary" gutterBottom>
            Patient Login
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Access your health information and services securely
          </Typography>
        </Box>

        {/* Login Card */}
        <Card sx={{ 
          width: '100%', 
          maxWidth: 400,
          borderRadius: 3,
          boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
          border: '1px solid #e2e8f0',
        }}>
          <CardContent sx={{ p: 4 }}>
            {error && (
              <Alert severity="error" sx={{ mb: 3 }}>
                {error}
              </Alert>
            )}

            <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
              {/* Email/Phone Input */}
              <Controller
                name="emailOrPhone"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    type={inputType}
                    label="Email or Phone Number"
                    fullWidth
                    margin="normal"
                    error={!!errors.emailOrPhone}
                    helperText={errors.emailOrPhone?.message}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          {getInputIcon()}
                        </InputAdornment>
                      ),
                    }}
                    sx={{ mb: 2 }}
                    // Security: Prevent autofill and browser password saving
                    autoComplete="off"
                    autoCorrect="off"
                    autoCapitalize="off"
                    spellCheck="false"
                  />
                )}
              />

              {/* Password Input */}
              <Controller
                name="password"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    type={showPassword ? 'text' : 'password'}
                    label="Password"
                    fullWidth
                    margin="normal"
                    error={!!errors.password}
                    helperText={errors.password?.message}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            aria-label="toggle password visibility"
                            onClick={handleTogglePasswordVisibility}
                            edge="end"
                          >
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                    sx={{ mb: 3 }}
                    // Security: Prevent autofill and browser password saving
                    autoComplete="new-password"
                    autoCorrect="off"
                    autoCapitalize="off"
                    spellCheck="false"
                  />
                )}
              />

              {/* Forgot Password Link */}
              <Box sx={{ display: 'flex', justifyContent: 'flex-start', mb: 3 }}>
                <Link
                  component="button"
                  variant="body2"
                  onClick={onForgotPassword}
                  sx={{ 
                    color: '#2563eb',
                    textDecoration: 'none',
                    fontWeight: 500,
                    fontSize: '0.875rem',
                    '&:hover': {
                      textDecoration: 'underline',
                    },
                  }}
                >
                  Forgot your password?
                </Link>
              </Box>

              {/* Login Button */}
              <Button
                type="submit"
                fullWidth
                variant="contained"
                size="large"
                disabled={!isValid || isLoading}
                sx={{ 
                  py: 1.5,
                  backgroundColor: '#2563eb',
                  color: '#ffffff',
                  fontWeight: 600,
                  fontSize: '1rem',
                  textTransform: 'none',
                  '&:hover': {
                    backgroundColor: '#1d4ed8',
                  },
                  '&:disabled': {
                    backgroundColor: '#94a3b8',
                    color: '#ffffff',
                  },
                }}
              >
                {isLoading ? (
                  <>
                    <CircularProgress size={20} sx={{ mr: 1, color: 'white' }} />
                    Signing In...
                  </>
                ) : (
                  'Sign In'
                )}
              </Button>
            </Box>

            {/* Registration Link */}
            <Box sx={{ textAlign: 'center', mt: 4 }}>
              <Typography variant="body2" color="text.secondary">
                New patient?{' '}
                <Link
                  component="button"
                  variant="body2"
                  onClick={onRegister}
                  sx={{ 
                    color: '#2563eb',
                    textDecoration: 'none',
                    fontWeight: 500,
                    '&:hover': {
                      textDecoration: 'underline',
                    },
                  }}
                >
                  Create an account
                </Link>
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </Box>
    </Container>
  );
}; 