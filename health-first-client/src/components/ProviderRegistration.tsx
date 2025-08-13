import React, { useState, useRef } from 'react';
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Link,
  Stepper,
  Step,
  StepLabel,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Checkbox,
  CircularProgress,
  IconButton,
  Divider,
  LinearProgress,
  Container,
} from '@mui/material';
import {
  CloudUpload,
  Person,
  MedicalServices,
  Business,
  Security,
  Visibility,
  VisibilityOff,
  LocalHospital,
} from '@mui/icons-material';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

// Validation schema
const fullSchema = yup.object({
  firstName: yup.string().required('First name is required'),
  lastName: yup.string().required('Last name is required'),
  email: yup.string().email('Please enter a valid email').required('Email is required'),
  phone: yup.string().required('Phone number is required'),
  licenseNumber: yup.string().required('Medical license number is required'),
  specialization: yup.string().required('Specialization is required'),
  yearsExperience: yup.number().min(0, 'Years must be 0 or greater').required('Years of experience is required'),
  qualifications: yup.string().required('Medical qualifications are required'),
  practiceName: yup.string().required('Practice name is required'),
  streetAddress: yup.string().required('Street address is required'),
  city: yup.string().required('City is required'),
  state: yup.string().required('State is required'),
  zipCode: yup.string().required('ZIP code is required'),
  practiceType: yup.string().required('Practice type is required'),
  password: yup
    .string()
    .min(8, 'Password must be at least 8 characters')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/, 
      'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character')
    .required('Password is required'),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('password')], 'Passwords must match')
    .required('Please confirm your password'),
  termsAccepted: yup.boolean().oneOf([true], 'You must accept the terms and conditions').optional(),
});

type RegistrationFormData = yup.InferType<typeof fullSchema>;

interface ProviderRegistrationProps {
  onRegistrationSuccess?: () => void;
  onBackToLogin?: () => void;
}

const steps = ['Personal Info', 'Professional Info', 'Practice Info', 'Security'];

const specializations = [
  'Cardiology',
  'Dermatology',
  'Pediatrics',
  'Neurology',
  'Orthopedics',
  'Psychiatry',
  'Oncology',
  'Emergency Medicine',
  'Family Medicine',
  'Internal Medicine',
  'Obstetrics & Gynecology',
  'Radiology',
  'Surgery',
  'Anesthesiology',
  'Pathology',
];

const practiceTypes = [
  'Private Practice',
  'Hospital',
  'Clinic',
  'Medical Center',
  'Urgent Care',
  'Specialty Practice',
  'Academic Medical Center',
];

export const ProviderRegistration: React.FC<ProviderRegistrationProps> = ({
  onRegistrationSuccess,
  onBackToLogin,
}) => {
  const [activeStep, setActiveStep] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [profilePhoto, setProfilePhoto] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string>('');
  const [passwordStrength, setPasswordStrength] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    control,
    handleSubmit,
    watch,
    trigger,
    formState: { errors },
  } = useForm<RegistrationFormData>({
    resolver: yupResolver(fullSchema),
    mode: 'onChange',
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      licenseNumber: '',
      specialization: '',
      yearsExperience: 0,
      qualifications: '',
      practiceName: '',
      streetAddress: '',
      city: '',
      state: '',
      zipCode: '',
      practiceType: '',
      password: '',
      confirmPassword: '',
      termsAccepted: false,
    },
  });

  const watchedPassword = watch('password');

  // Calculate password strength
  React.useEffect(() => {
    if (!watchedPassword || typeof watchedPassword !== 'string') {
      setPasswordStrength(0);
      return;
    }

    let strength = 0;
    if (watchedPassword.length >= 8) strength += 25;
    if (/[a-z]/.test(watchedPassword)) strength += 25;
    if (/[A-Z]/.test(watchedPassword)) strength += 25;
    if (/[0-9]/.test(watchedPassword)) strength += 25;
    if (/[@$!%*?&]/.test(watchedPassword)) strength += 25;

    setPasswordStrength(Math.min(strength, 100));
  }, [watchedPassword]);

  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setProfilePhoto(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setPhotoPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleNext = async () => {
    const fieldsToValidate = getFieldsForStep(activeStep);
    const isValid = await trigger(fieldsToValidate);
    
    if (isValid) {
      setActiveStep((prevStep) => prevStep + 1);
    }
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const getFieldsForStep = (step: number): (keyof RegistrationFormData)[] => {
    switch (step) {
      case 0:
        return ['firstName', 'lastName', 'email', 'phone'];
      case 1:
        return ['licenseNumber', 'specialization', 'yearsExperience', 'qualifications'];
      case 2:
        return ['practiceName', 'streetAddress', 'city', 'state', 'zipCode', 'practiceType'];
      case 3:
        return ['password', 'confirmPassword', 'termsAccepted'];
      default:
        return [];
    }
  };

  const onSubmit = async (data: RegistrationFormData) => {
    setIsLoading(true);
    
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));
      console.log('Registration data:', data);
      onRegistrationSuccess?.();
    } catch (err) {
      console.error('Registration failed:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const getPasswordStrengthColor = () => {
    if (passwordStrength < 25) return '#ef4444';
    if (passwordStrength < 50) return '#f59e0b';
    if (passwordStrength < 75) return '#10b981';
    return '#059669';
  };

  const renderStepContent = (step: number) => {
    switch (step) {
      case 0:
        return (
          <Box>
            <Typography variant="h6" sx={{ mb: 3, display: 'flex', alignItems: 'center' }}>
              <Person sx={{ mr: 1 }} />
              Personal Information
            </Typography>
            
            {/* Profile Photo Upload */}
            <Box sx={{ mb: 3, textAlign: 'center' }}>
              <input
                type="file"
                accept="image/*"
                onChange={handlePhotoUpload}
                style={{ display: 'none' }}
                ref={fileInputRef}
              />
              <Box
                onClick={() => fileInputRef.current?.click()}
                sx={{
                  width: 120,
                  height: 120,
                  borderRadius: '50%',
                  border: '2px dashed #cbd5e1',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  mx: 'auto',
                  mb: 2,
                  background: photoPreview ? `url(${photoPreview}) center/cover` : '#f8fafc',
                  '&:hover': {
                    borderColor: '#2563eb',
                    backgroundColor: '#f1f5f9',
                  },
                }}
              >
                {!photoPreview && <CloudUpload sx={{ fontSize: 40, color: '#64748b' }} />}
              </Box>
              <Typography variant="body2" color="text.secondary">
                Click to upload profile photo
              </Typography>
            </Box>

            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
              <Box sx={{ flex: '1 1 300px', minWidth: 0 }}>
                <Controller
                  name="firstName"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="First Name *"
                      fullWidth
                      error={!!errors.firstName}
                      helperText={errors.firstName?.message}
                    />
                  )}
                />
              </Box>
              <Box sx={{ flex: '1 1 300px', minWidth: 0 }}>
                <Controller
                  name="lastName"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Last Name *"
                      fullWidth
                      error={!!errors.lastName}
                      helperText={errors.lastName?.message}
                    />
                  )}
                />
              </Box>
              <Box sx={{ flex: '1 1 100%' }}>
                <Controller
                  name="email"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      type="email"
                      label="Email Address *"
                      fullWidth
                      error={!!errors.email}
                      helperText={errors.email?.message}
                    />
                  )}
                />
              </Box>
              <Box sx={{ flex: '1 1 100%' }}>
                <Controller
                  name="phone"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Phone Number *"
                      fullWidth
                      error={!!errors.phone}
                      helperText={errors.phone?.message}
                    />
                  )}
                />
              </Box>
            </Box>
          </Box>
        );

      case 1:
        return (
          <Box>
            <Typography variant="h6" sx={{ mb: 3, display: 'flex', alignItems: 'center' }}>
              <MedicalServices sx={{ mr: 1 }} />
              Professional Information
            </Typography>
            
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Controller
                name="licenseNumber"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Medical License Number *"
                    fullWidth
                    error={!!errors.licenseNumber}
                    helperText={errors.licenseNumber?.message}
                  />
                )}
              />
              
              <FormControl fullWidth error={!!errors.specialization}>
                <InputLabel>Specialization *</InputLabel>
                <Controller
                  name="specialization"
                  control={control}
                  render={({ field }) => (
                    <Select {...field} label="Specialization *">
                      {specializations.map((spec) => (
                        <MenuItem key={spec} value={spec}>
                          {spec}
                        </MenuItem>
                      ))}
                    </Select>
                  )}
                />
              </FormControl>
              
              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                <Box sx={{ flex: '1 1 200px', minWidth: 0 }}>
                  <Controller
                    name="yearsExperience"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        type="number"
                        label="Years of Experience *"
                        fullWidth
                        error={!!errors.yearsExperience}
                        helperText={errors.yearsExperience?.message}
                      />
                    )}
                  />
                </Box>
              </Box>
              
              <Controller
                name="qualifications"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Medical Degree/Qualifications *"
                    fullWidth
                    multiline
                    rows={3}
                    error={!!errors.qualifications}
                    helperText={errors.qualifications?.message}
                  />
                )}
              />
            </Box>
          </Box>
        );

      case 2:
        return (
          <Box>
            <Typography variant="h6" sx={{ mb: 3, display: 'flex', alignItems: 'center' }}>
              <Business sx={{ mr: 1 }} />
              Practice Information
            </Typography>
            
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Controller
                name="practiceName"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Clinic/Hospital Name *"
                    fullWidth
                    error={!!errors.practiceName}
                    helperText={errors.practiceName?.message}
                  />
                )}
              />
              
              <Controller
                name="streetAddress"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Street Address *"
                    fullWidth
                    error={!!errors.streetAddress}
                    helperText={errors.streetAddress?.message}
                  />
                )}
              />
              
              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                <Box sx={{ flex: '1 1 200px', minWidth: 0 }}>
                  <Controller
                    name="city"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="City *"
                        fullWidth
                        error={!!errors.city}
                        helperText={errors.city?.message}
                      />
                    )}
                  />
                </Box>
                <Box sx={{ flex: '1 1 200px', minWidth: 0 }}>
                  <Controller
                    name="state"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="State *"
                        fullWidth
                        error={!!errors.state}
                        helperText={errors.state?.message}
                      />
                    )}
                  />
                </Box>
                <Box sx={{ flex: '1 1 200px', minWidth: 0 }}>
                  <Controller
                    name="zipCode"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="ZIP Code *"
                        fullWidth
                        error={!!errors.zipCode}
                        helperText={errors.zipCode?.message}
                      />
                    )}
                  />
                </Box>
              </Box>
              
              <FormControl fullWidth error={!!errors.practiceType}>
                <InputLabel>Practice Type *</InputLabel>
                <Controller
                  name="practiceType"
                  control={control}
                  render={({ field }) => (
                    <Select {...field} label="Practice Type *">
                      {practiceTypes.map((type) => (
                        <MenuItem key={type} value={type}>
                          {type}
                        </MenuItem>
                      ))}
                    </Select>
                  )}
                />
              </FormControl>
            </Box>
          </Box>
        );

      case 3:
        return (
          <Box>
            <Typography variant="h6" sx={{ mb: 3, display: 'flex', alignItems: 'center' }}>
              <Security sx={{ mr: 1 }} />
              Account Security
            </Typography>
            
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Controller
                name="password"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    type={showPassword ? 'text' : 'password'}
                    label="Password *"
                    fullWidth
                    error={!!errors.password}
                    helperText={errors.password?.message}
                    InputProps={{
                      endAdornment: (
                        <IconButton
                          onClick={() => setShowPassword(!showPassword)}
                          edge="end"
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      ),
                    }}
                  />
                )}
              />
              {watchedPassword && (
                <Box sx={{ mt: 1 }}>
                  <LinearProgress
                    variant="determinate"
                    value={passwordStrength}
                    sx={{
                      height: 8,
                      borderRadius: 4,
                      backgroundColor: '#e2e8f0',
                      '& .MuiLinearProgress-bar': {
                        backgroundColor: getPasswordStrengthColor(),
                      },
                    }}
                  />
                  <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
                    Password strength: {passwordStrength < 25 ? 'Weak' : passwordStrength < 50 ? 'Fair' : passwordStrength < 75 ? 'Good' : 'Strong'}
                  </Typography>
                </Box>
              )}
              
              <Controller
                name="confirmPassword"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    type={showConfirmPassword ? 'text' : 'password'}
                    label="Confirm Password *"
                    fullWidth
                    error={!!errors.confirmPassword}
                    helperText={errors.confirmPassword?.message}
                    InputProps={{
                      endAdornment: (
                        <IconButton
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          edge="end"
                        >
                          {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      ),
                    }}
                  />
                )}
              />
              
              <Controller
                name="termsAccepted"
                control={control}
                render={({ field }) => (
                  <FormControlLabel
                    control={
                      <Checkbox
                        {...field}
                        checked={field.value || false}
                        color="primary"
                      />
                    }
                    label={
                      <Typography variant="body2">
                        I agree to the{' '}
                        <Link href="#" sx={{ textDecoration: 'underline' }}>
                          Terms and Conditions
                        </Link>
                        {' '}and{' '}
                        <Link href="#" sx={{ textDecoration: 'underline' }}>
                          Privacy Policy
                        </Link>
                      </Typography>
                    }
                  />
                )}
              />
              {errors.termsAccepted && (
                <Typography variant="caption" color="error" sx={{ ml: 2 }}>
                  {errors.termsAccepted.message}
                </Typography>
              )}
            </Box>
          </Box>
        );

      default:
        return null;
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
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
              Provider Registration
            </Typography>
          </Box>
          <Typography variant="body1" color="text.secondary">
            Create your healthcare provider account
          </Typography>
        </Box>

        {/* Registration Card */}
        <Card sx={{ 
          width: '100%', 
          maxWidth: 800,
          borderRadius: 3,
          boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
          border: '1px solid #e2e8f0',
        }}>
          <CardContent sx={{ p: 4 }}>
            {/* Stepper */}
            <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
              {steps.map((label) => (
                <Step key={label}>
                  <StepLabel>{label}</StepLabel>
                </Step>
              ))}
            </Stepper>

            <Divider sx={{ mb: 4 }} />

            {/* Form Content */}
            <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
              {renderStepContent(activeStep)}

              {/* Navigation Buttons */}
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
                <Button
                  disabled={activeStep === 0}
                  onClick={handleBack}
                  sx={{ mr: 1 }}
                >
                  Back
                </Button>
                <Box>
                  {activeStep === steps.length - 1 ? (
                    <Button
                      type="submit"
                      variant="contained"
                      disabled={isLoading}
                      sx={{ 
                        backgroundColor: '#2563eb',
                        '&:hover': { backgroundColor: '#1d4ed8' },
                      }}
                    >
                      {isLoading ? (
                        <>
                          <CircularProgress size={20} sx={{ mr: 1, color: 'white' }} />
                          Creating Account...
                        </>
                      ) : (
                        'Create Account'
                      )}
                    </Button>
                  ) : (
                    <Button
                      variant="contained"
                      onClick={handleNext}
                      sx={{ 
                        backgroundColor: '#2563eb',
                        '&:hover': { backgroundColor: '#1d4ed8' },
                      }}
                    >
                      Next
                    </Button>
                  )}
                </Box>
              </Box>
            </Box>

            {/* Login Link */}
            <Box sx={{ textAlign: 'center', mt: 4 }}>
              <Typography variant="body2" color="text.secondary">
                Already have an account?{' '}
                <Link
                  component="button"
                  variant="body2"
                  onClick={onBackToLogin}
                  sx={{ 
                    color: '#2563eb',
                    textDecoration: 'none',
                    fontWeight: 500,
                    '&:hover': {
                      textDecoration: 'underline',
                    },
                  }}
                >
                  Sign in here
                </Link>
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </Box>
    </Container>
  );
}; 