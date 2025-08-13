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
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
} from '@mui/icons-material';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

// Validation schema
const loginSchema = yup.object({
  email: yup
    .string()
    .email('Please enter a valid email address')
    .required('Email is required'),
  password: yup
    .string()
    .required('Password is required')
    .min(6, 'Password must be at least 6 characters'),
});

type LoginFormData = yup.InferType<typeof loginSchema>;

interface ProviderLoginProps {
  onLoginSuccess?: () => void;
  onForgotPassword?: () => void;
  onRegister?: () => void;
}

export const ProviderLogin: React.FC<ProviderLoginProps> = ({
  onLoginSuccess,
  onForgotPassword,
  onRegister,
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<LoginFormData>({
    resolver: yupResolver(loginSchema),
    mode: 'onChange',
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));
      console.log('Login attempt:', data);
      onLoginSuccess?.();
    } catch (err) {
      console.error('Login failed:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTogglePasswordVisibility = () => {
    setShowPassword(!showPassword);
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
        {/* Login Card - Positioned center-right as in the image */}
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'flex-end', 
          width: '100%', 
          maxWidth: 1200,
          px: 4 
        }}>
          <Card sx={{ 
            width: '100%', 
            maxWidth: 400,
            borderRadius: 3,
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
            border: '1px solid #e2e8f0',
          }}>
            <CardContent sx={{ p: 4 }}>
              {/* Title and Subtitle */}
              <Box sx={{ textAlign: 'left', mb: 4 }}>
                <Typography 
                  variant="h1" 
                  sx={{ 
                    fontSize: '1.875rem',
                    fontWeight: 700,
                    color: '#1e293b',
                    mb: 1,
                  }}
                >
                  Log in to your account
                </Typography>
                <Typography 
                  variant="body1" 
                  sx={{ 
                    color: '#64748b',
                    fontSize: '1rem',
                  }}
                >
                  Welcome back! Please enter your details.
                </Typography>
              </Box>

              {/* Login Form */}
              <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
                {/* Email Input */}
                <Controller
                  name="email"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      type="email"
                      label="Email *"
                      fullWidth
                      margin="normal"
                      error={!!errors.email}
                      helperText={errors.email?.message}
                      placeholder="Enter Email"
                      sx={{ mb: 3 }}
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
                      label="Password *"
                      fullWidth
                      margin="normal"
                      error={!!errors.password}
                      helperText={errors.password?.message}
                      placeholder="Enter Password"
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              aria-label="toggle password visibility"
                              onClick={handleTogglePasswordVisibility}
                              edge="end"
                              sx={{ color: '#64748b' }}
                            >
                              {showPassword ? <VisibilityOff /> : <Visibility />}
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                      sx={{ mb: 2 }}
                    />
                  )}
                />

                {/* Forgot Password Link */}
                <Box sx={{ display: 'flex', justifyContent: 'flex-start', mb: 4 }}>
                  <Link
                    component="button"
                    variant="body2"
                    onClick={onForgotPassword}
                    sx={{ 
                      color: '#1e40af',
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

                {/* Sign In Button */}
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  size="large"
                  disabled={!isValid || isLoading}
                  sx={{ 
                    py: 1.5,
                    backgroundColor: '#1e40af',
                    color: '#ffffff',
                    fontWeight: 600,
                    fontSize: '1rem',
                    textTransform: 'none',
                    '&:hover': {
                      backgroundColor: '#1e3a8a',
                    },
                    '&:disabled': {
                      backgroundColor: '#94a3b8',
                      color: '#ffffff',
                    },
                  }}
                >
                  {isLoading ? 'Signing in...' : 'Sign In'}
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Box>
        {/* Login Link */}
        <Box sx={{ textAlign: 'center', mt: 4 }}>
          <Typography variant="body2" color="text.secondary">
            Don't have an account?{' '}
            <Link
              component="button"
              variant="body2"
              onClick={onRegister}
              sx={{ 
                color: '#1e40af',
                textDecoration: 'none',
                fontWeight: 500,
                '&:hover': {
                  textDecoration: 'underline',
                },
              }}
            >
              Register here
            </Link>
          </Typography>
        </Box>
      </Box>
    </Container>
  );
}; 