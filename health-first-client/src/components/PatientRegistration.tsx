import React, { useState, useEffect } from 'react';
import {
  Box, Card, CardContent, TextField, Button, Typography, Link, InputAdornment,
  IconButton, Container, Alert, CircularProgress, FormControl, InputLabel,
  Select, MenuItem, FormControlLabel, Checkbox, Divider, LinearProgress,
  Chip, OutlinedInput,
} from '@mui/material';
import {
  Visibility, VisibilityOff, LocalHospital, Person, Email, Phone,
  LocationOn, Emergency, HealthAndSafety, CalendarToday, Security,
} from '@mui/icons-material';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

// Validation schema
const patientRegistrationSchema = yup.object({
  firstName: yup.string().required('First name is required').min(2, 'First name must be at least 2 characters').max(50, 'First name must be less than 50 characters'),
  lastName: yup.string().required('Last name is required').min(2, 'Last name must be at least 2 characters').max(50, 'Last name must be less than 50 characters'),
  email: yup.string().required('Email is required').email('Please enter a valid email address'),
  phoneNumber: yup.string().required('Phone number is required').matches(/^\+?[\d\s\-\(\)]{10,}$/, 'Please enter a valid phone number'),
  password: yup.string().required('Password is required').min(8, 'Password must be at least 8 characters').matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/, 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'),
  confirmPassword: yup.string().required('Please confirm your password').oneOf([yup.ref('password')], 'Passwords must match'),
  dateOfBirth: yup.date().required('Date of birth is required').max(new Date(), 'Date of birth cannot be in the future').test('age', 'You must be at least 13 years old', function(value) {
    if (!value) return false;
    const today = new Date();
    const birthDate = new Date(value);
    const age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      return age - 1 >= 13;
    }
    return age >= 13;
  }),
  gender: yup.string().required('Please select your gender'),
  street: yup.string().required('Street address is required').max(200, 'Street address must be less than 200 characters'),
  city: yup.string().required('City is required').max(100, 'City must be less than 100 characters'),
  state: yup.string().required('State is required').max(50, 'State must be less than 50 characters'),
  zipCode: yup.string().required('ZIP code is required').matches(/^\d{5}(-\d{4})?$/, 'Please enter a valid ZIP code'),
  emergencyName: yup.string().max(100, 'Emergency contact name must be less than 100 characters'),
  emergencyPhone: yup.string().matches(/^(\+?[\d\s\-\(\)]{10,})?$/, 'Please enter a valid phone number'),
  emergencyRelationship: yup.string().max(50, 'Relationship must be less than 50 characters'),
  insuranceProvider: yup.string().max(100, 'Insurance provider must be less than 100 characters'),
  policyNumber: yup.string().max(50, 'Policy number must be less than 50 characters'),
  medicalHistory: yup.array().of(yup.string()),
  termsAccepted: yup.boolean().oneOf([true], 'You must accept the terms and conditions'),
});

type PatientRegistrationData = yup.InferType<typeof patientRegistrationSchema>;

interface PatientRegistrationProps {
  onRegistrationSuccess?: () => void;
  onBackToLogin?: () => void;
}

const medicalConditions = ['Diabetes', 'Hypertension', 'Asthma', 'Heart Disease', 'Allergies', 'Depression', 'Anxiety', 'Arthritis', 'Cancer', 'Stroke', 'Kidney Disease', 'Liver Disease', 'Thyroid Disorder', 'Epilepsy', 'None'];

export const PatientRegistration: React.FC<PatientRegistrationProps> = ({
  onRegistrationSuccess,
  onBackToLogin,
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [showEmergencyContact, setShowEmergencyContact] = useState(false);
  const [showInsuranceInfo, setShowInsuranceInfo] = useState(false);
  const [showMedicalHistory, setShowMedicalHistory] = useState(false);

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors, isValid },
  } = useForm<PatientRegistrationData>({
    resolver: yupResolver(patientRegistrationSchema),
    mode: 'onChange',
    defaultValues: {
      firstName: '', lastName: '', email: '', phoneNumber: '', password: '', confirmPassword: '',
      dateOfBirth: '', gender: '', street: '', city: '', state: '', zipCode: '',
      emergencyName: '', emergencyPhone: '', emergencyRelationship: '',
      insuranceProvider: '', policyNumber: '', medicalHistory: [], termsAccepted: false,
    },
  });

  const watchedPassword = watch('password');

  useEffect(() => {
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

  const onSubmit = async (data: PatientRegistrationData) => {
    setIsLoading(true);
    const sanitizedData = {
      firstName: data.firstName.trim(),
      lastName: data.lastName.trim(),
      email: data.email.trim().toLowerCase(),
      phoneNumber: data.phoneNumber.trim(),
      password: data.password.trim(),
      confirmPassword: data.confirmPassword.trim(),
      dateOfBirth: data.dateOfBirth,
      gender: data.gender,
      street: data.street.trim(),
      city: data.city.trim(),
      state: data.state.trim(),
      zipCode: data.zipCode.trim(),
      emergencyName: data.emergencyName?.trim() || '',
      emergencyPhone: data.emergencyPhone?.trim() || '',
      emergencyRelationship: data.emergencyRelationship?.trim() || '',
      insuranceProvider: data.insuranceProvider?.trim() || '',
      policyNumber: data.policyNumber?.trim() || '',
      medicalHistory: data.medicalHistory || [],
      termsAccepted: data.termsAccepted,
    };

    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      console.log('Patient registration successful:', sanitizedData);
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

  const getPasswordStrengthText = () => {
    if (passwordStrength < 25) return 'Weak';
    if (passwordStrength < 50) return 'Fair';
    if (passwordStrength < 75) return 'Good';
    return 'Strong';
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', background: '#f1f5f9' }}>
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
            <LocalHospital sx={{ fontSize: 40, color: 'primary.main', mr: 1 }} />
            <Typography variant="h1" color="primary.main" sx={{ fontSize: '2rem', fontWeight: 700 }}>
              Patient Registration
            </Typography>
          </Box>
          <Typography variant="body1" color="text.secondary">
            Create your patient account to access health services
          </Typography>
        </Box>

        <Card sx={{ width: '100%', maxWidth: 800, borderRadius: 3, boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)', border: '1px solid #e2e8f0' }}>
          <CardContent sx={{ p: 4 }}>
            <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
              <Typography variant="h6" sx={{ mb: 3, display: 'flex', alignItems: 'center' }}>
                <Person sx={{ mr: 1 }} />
                Personal Information
              </Typography>

              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 3 }}>
                <Box sx={{ flex: '1 1 300px', minWidth: 0 }}>
                  <Controller name="firstName" control={control} render={({ field }) => (
                    <TextField {...field} label="First Name *" fullWidth error={!!errors.firstName} helperText={errors.firstName?.message} autoComplete="given-name" autoCorrect="off" autoCapitalize="words" spellCheck="false" />
                  )} />
                </Box>
                <Box sx={{ flex: '1 1 300px', minWidth: 0 }}>
                  <Controller name="lastName" control={control} render={({ field }) => (
                    <TextField {...field} label="Last Name *" fullWidth error={!!errors.lastName} helperText={errors.lastName?.message} autoComplete="family-name" autoCorrect="off" autoCapitalize="words" spellCheck="false" />
                  )} />
                </Box>
              </Box>

              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 3 }}>
                <Box sx={{ flex: '1 1 300px', minWidth: 0 }}>
                  <Controller name="email" control={control} render={({ field }) => (
                    <TextField {...field} type="email" label="Email Address *" fullWidth error={!!errors.email} helperText={errors.email?.message} InputProps={{ startAdornment: <InputAdornment position="start"><Email color="action" /></InputAdornment> }} autoComplete="email" autoCorrect="off" autoCapitalize="off" spellCheck="false" />
                  )} />
                </Box>
                <Box sx={{ flex: '1 1 300px', minWidth: 0 }}>
                  <Controller name="phoneNumber" control={control} render={({ field }) => (
                    <TextField {...field} type="tel" label="Phone Number *" fullWidth error={!!errors.phoneNumber} helperText={errors.phoneNumber?.message} InputProps={{ startAdornment: <InputAdornment position="start"><Phone color="action" /></InputAdornment> }} autoComplete="tel" autoCorrect="off" autoCapitalize="off" spellCheck="false" />
                  )} />
                </Box>
              </Box>

              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 3 }}>
                <Box sx={{ flex: '1 1 200px', minWidth: 0 }}>
                  <Controller name="dateOfBirth" control={control} render={({ field }) => (
                    <TextField {...field} type="date" label="Date of Birth *" fullWidth error={!!errors.dateOfBirth} helperText={errors.dateOfBirth?.message} InputProps={{ startAdornment: <InputAdornment position="start"><CalendarToday color="action" /></InputAdornment> }} inputProps={{ max: new Date().toISOString().split('T')[0] }} />
                  )} />
                </Box>
                <Box sx={{ flex: '1 1 200px', minWidth: 0 }}>
                  <FormControl fullWidth error={!!errors.gender}>
                    <InputLabel>Gender *</InputLabel>
                    <Controller name="gender" control={control} render={({ field }) => (
                      <Select {...field} label="Gender *">
                        <MenuItem value="male">Male</MenuItem>
                        <MenuItem value="female">Female</MenuItem>
                        <MenuItem value="other">Other</MenuItem>
                        <MenuItem value="prefer_not_to_say">Prefer not to say</MenuItem>
                      </Select>
                    )} />
                  </FormControl>
                </Box>
              </Box>

              <Typography variant="h6" sx={{ mb: 3, display: 'flex', alignItems: 'center' }}>
                <Security sx={{ mr: 1 }} />
                Account Security
              </Typography>

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mb: 3 }}>
                <Controller name="password" control={control} render={({ field }) => (
                  <TextField {...field} type={showPassword ? 'text' : 'password'} label="Password *" fullWidth error={!!errors.password} helperText={errors.password?.message} InputProps={{ endAdornment: <InputAdornment position="end"><IconButton onClick={() => setShowPassword(!showPassword)} edge="end">{showPassword ? <VisibilityOff /> : <Visibility />}</IconButton></InputAdornment> }} autoComplete="new-password" autoCorrect="off" autoCapitalize="off" spellCheck="false" />
                )} />

                {watchedPassword && (
                  <Box sx={{ mt: 1 }}>
                    <LinearProgress variant="determinate" value={passwordStrength} sx={{ height: 8, borderRadius: 4, backgroundColor: '#e2e8f0', '& .MuiLinearProgress-bar': { backgroundColor: getPasswordStrengthColor() } }} />
                    <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
                      Password strength: {getPasswordStrengthText()}
                    </Typography>
                  </Box>
                )}

                <Controller name="confirmPassword" control={control} render={({ field }) => (
                  <TextField {...field} type={showConfirmPassword ? 'text' : 'password'} label="Confirm Password *" fullWidth error={!!errors.confirmPassword} helperText={errors.confirmPassword?.message} InputProps={{ endAdornment: <InputAdornment position="end"><IconButton onClick={() => setShowConfirmPassword(!showConfirmPassword)} edge="end">{showConfirmPassword ? <VisibilityOff /> : <Visibility />}</IconButton></InputAdornment> }} autoComplete="new-password" autoCorrect="off" autoCapitalize="off" spellCheck="false" />
                )} />
              </Box>

              <Typography variant="h6" sx={{ mb: 3, display: 'flex', alignItems: 'center' }}>
                <LocationOn sx={{ mr: 1 }} />
                Address
              </Typography>

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mb: 3 }}>
                <Controller name="street" control={control} render={({ field }) => (
                  <TextField {...field} label="Street Address *" fullWidth error={!!errors.street} helperText={errors.street?.message} autoComplete="street-address" autoCorrect="off" autoCapitalize="words" spellCheck="false" />
                )} />

                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                  <Box sx={{ flex: '1 1 200px', minWidth: 0 }}>
                    <Controller name="city" control={control} render={({ field }) => (
                      <TextField {...field} label="City *" fullWidth error={!!errors.city} helperText={errors.city?.message} autoComplete="address-level2" autoCorrect="off" autoCapitalize="words" spellCheck="false" />
                    )} />
                  </Box>
                  <Box sx={{ flex: '1 1 200px', minWidth: 0 }}>
                    <Controller name="state" control={control} render={({ field }) => (
                      <TextField {...field} label="State *" fullWidth error={!!errors.state} helperText={errors.state?.message} autoComplete="address-level1" autoCorrect="off" autoCapitalize="words" spellCheck="false" />
                    )} />
                  </Box>
                  <Box sx={{ flex: '1 1 200px', minWidth: 0 }}>
                    <Controller name="zipCode" control={control} render={({ field }) => (
                      <TextField {...field} label="ZIP Code *" fullWidth error={!!errors.zipCode} helperText={errors.zipCode?.message} autoComplete="postal-code" autoCorrect="off" autoCapitalize="off" spellCheck="false" />
                    )} />
                  </Box>
                </Box>
              </Box>

              <Box sx={{ mb: 3 }}>
                <FormControlLabel control={<Checkbox checked={showEmergencyContact} onChange={(e) => setShowEmergencyContact(e.target.checked)} />} label="Add Emergency Contact (Optional)" />
              </Box>

              {showEmergencyContact && (
                <Box sx={{ mb: 3 }}>
                  <Typography variant="h6" sx={{ mb: 3, display: 'flex', alignItems: 'center' }}>
                    <Emergency sx={{ mr: 1 }} />
                    Emergency Contact
                  </Typography>

                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 2 }}>
                    <Box sx={{ flex: '1 1 300px', minWidth: 0 }}>
                      <Controller name="emergencyName" control={control} render={({ field }) => (
                        <TextField {...field} label="Emergency Contact Name" fullWidth error={!!errors.emergencyName} helperText={errors.emergencyName?.message} autoComplete="name" autoCorrect="off" autoCapitalize="words" spellCheck="false" />
                      )} />
                    </Box>
                    <Box sx={{ flex: '1 1 300px', minWidth: 0 }}>
                      <Controller name="emergencyPhone" control={control} render={({ field }) => (
                        <TextField {...field} type="tel" label="Emergency Contact Phone" fullWidth error={!!errors.emergencyPhone} helperText={errors.emergencyPhone?.message} InputProps={{ startAdornment: <InputAdornment position="start"><Phone color="action" /></InputAdornment> }} autoComplete="tel" autoCorrect="off" autoCapitalize="off" spellCheck="false" />
                      )} />
                    </Box>
                  </Box>

                  <Controller name="emergencyRelationship" control={control} render={({ field }) => (
                    <TextField {...field} label="Relationship" fullWidth error={!!errors.emergencyRelationship} helperText={errors.emergencyRelationship?.message} autoCorrect="off" autoCapitalize="words" spellCheck="false" />
                  )} />
                </Box>
              )}

              <Box sx={{ mb: 3 }}>
                <FormControlLabel control={<Checkbox checked={showInsuranceInfo} onChange={(e) => setShowInsuranceInfo(e.target.checked)} />} label="Add Insurance Information (Optional)" />
              </Box>

              {showInsuranceInfo && (
                <Box sx={{ mb: 3 }}>
                  <Typography variant="h6" sx={{ mb: 3, display: 'flex', alignItems: 'center' }}>
                    <HealthAndSafety sx={{ mr: 1 }} />
                    Insurance Information
                  </Typography>

                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                    <Box sx={{ flex: '1 1 300px', minWidth: 0 }}>
                      <Controller name="insuranceProvider" control={control} render={({ field }) => (
                        <TextField {...field} label="Insurance Provider" fullWidth error={!!errors.insuranceProvider} helperText={errors.insuranceProvider?.message} autoCorrect="off" autoCapitalize="words" spellCheck="false" />
                      )} />
                    </Box>
                    <Box sx={{ flex: '1 1 300px', minWidth: 0 }}>
                      <Controller name="policyNumber" control={control} render={({ field }) => (
                        <TextField {...field} label="Policy Number" fullWidth error={!!errors.policyNumber} helperText={errors.policyNumber?.message} autoCorrect="off" autoCapitalize="off" spellCheck="false" />
                      )} />
                    </Box>
                  </Box>
                </Box>
              )}

              <Box sx={{ mb: 3 }}>
                <FormControlLabel control={<Checkbox checked={showMedicalHistory} onChange={(e) => setShowMedicalHistory(e.target.checked)} />} label="Add Medical History (Optional)" />
              </Box>

              {showMedicalHistory && (
                <Box sx={{ mb: 3 }}>
                  <Typography variant="h6" sx={{ mb: 3, display: 'flex', alignItems: 'center' }}>
                    <HealthAndSafety sx={{ mr: 1 }} />
                    Medical History
                  </Typography>

                  <Controller name="medicalHistory" control={control} render={({ field }) => (
                    <FormControl fullWidth>
                      <InputLabel>Medical Conditions</InputLabel>
                      <Select {...field} multiple input={<OutlinedInput label="Medical Conditions" />} renderValue={(selected) => (
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                          {selected.map((value) => (<Chip key={value} label={value} size="small" />))}
                        </Box>
                      )}>
                        {medicalConditions.map((condition) => (<MenuItem key={condition} value={condition}>{condition}</MenuItem>))}
                      </Select>
                    </FormControl>
                  )} />
                </Box>
              )}

              <Box sx={{ mb: 4 }}>
                <Controller name="termsAccepted" control={control} render={({ field }) => (
                  <FormControlLabel control={<Checkbox {...field} checked={field.value || false} color="primary" />} label={
                    <Typography variant="body2">
                      I agree to the <Link href="#" sx={{ textDecoration: 'underline' }}>Terms and Conditions</Link> and <Link href="#" sx={{ textDecoration: 'underline' }}>Privacy Policy</Link>
                    </Typography>
                  } />
                )} />
                {errors.termsAccepted && (
                  <Typography variant="caption" color="error" sx={{ ml: 2 }}>
                    {errors.termsAccepted.message}
                  </Typography>
                )}
              </Box>

              <Button type="submit" fullWidth variant="contained" size="large" disabled={!isValid || isLoading} sx={{ py: 1.5, backgroundColor: '#059669', color: '#ffffff', fontWeight: 600, fontSize: '1rem', textTransform: 'none', '&:hover': { backgroundColor: '#047857' }, '&:disabled': { backgroundColor: '#94a3b8', color: '#ffffff' } }}>
                {isLoading ? (<><CircularProgress size={20} sx={{ mr: 1, color: 'white' }} />Creating Account...</>) : ('Create Patient Account')}
              </Button>
            </Box>

            <Box sx={{ textAlign: 'center', mt: 4 }}>
              <Typography variant="body2" color="text.secondary">
                Already have an account? <Link component="button" variant="body2" onClick={onBackToLogin} sx={{ color: '#059669', textDecoration: 'none', fontWeight: 500, '&:hover': { textDecoration: 'underline' } }}>
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