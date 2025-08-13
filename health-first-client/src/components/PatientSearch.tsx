import React, { useState, useEffect } from 'react';
import {
  Box, Card, CardContent, Typography, Button, TextField, FormControl, InputLabel,
  Select, MenuItem, Grid, Chip, IconButton, Dialog, DialogTitle, DialogContent,
  DialogActions, Alert, CircularProgress, Rating, Avatar, Divider, Switch, FormControlLabel,
  InputAdornment, Slider, Checkbox, ListItemText, OutlinedInput,
} from '@mui/material';
import {
  Search, LocationOn, AttachMoney, AccessTime, Star, Person, Phone,
  Email, Schedule, Event, Warning, CheckCircle, Error, Info, FilterList,
} from '@mui/icons-material';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { format, addDays, isBefore, isAfter, parseISO } from 'date-fns';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

// Validation schema for booking
const bookingSchema = yup.object({
  patientName: yup.string().required('Patient name is required'),
  patientEmail: yup.string().email('Please enter a valid email').required('Email is required'),
  patientPhone: yup.string().required('Phone number is required'),
  reason: yup.string().required('Please provide a reason for the appointment'),
  insuranceProvider: yup.string().optional(),
  insurancePolicyNumber: yup.string().optional(),
  notes: yup.string().max(500, 'Notes must be less than 500 characters').optional(),
});

type BookingFormData = yup.InferType<typeof bookingSchema>;

interface PatientSearchProps {
  onBookingCreated?: (booking: any) => void;
}

interface Provider {
  id: string;
  name: string;
  specialization: string;
  experience: number;
  rating: number;
  reviewCount: number;
  clinic: string;
  address: string;
  phone: string;
  email: string;
  avatar: string;
  insuranceAccepted: boolean;
  maxPrice: number;
  currency: string;
  tags: string[];
}

interface AvailableSlot {
  id: string;
  providerId: string;
  date: Date;
  startTime: Date;
  endTime: Date;
  appointmentType: string;
  fee: number;
  currency: string;
  locationType: string;
  address?: string;
  room?: string;
  timezone: string;
  availableSpots: number;
  totalSpots: number;
}

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

const appointmentTypes = [
  'Consultation',
  'Follow-up',
  'Physical Examination',
  'Mental Health Session',
  'Specialist Consultation',
  'Emergency Visit',
  'Telemedicine',
  'Lab Work',
  'Procedure',
];

const locationTypes = [
  'physical',
  'virtual',
  'hybrid',
];

const insuranceProviders = [
  'Blue Cross Blue Shield',
  'Aetna',
  'Cigna',
  'UnitedHealth',
  'Humana',
  'Kaiser Permanente',
  'Medicare',
  'Medicaid',
  'Other',
];

export const PatientSearch: React.FC<PatientSearchProps> = ({
  onBookingCreated,
}) => {
  const [providers, setProviders] = useState<Provider[]>([]);
  const [availableSlots, setAvailableSlots] = useState<AvailableSlot[]>([]);
  const [filteredSlots, setFilteredSlots] = useState<AvailableSlot[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<AvailableSlot | null>(null);
  const [isBookingDialogOpen, setIsBookingDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [searchFilters, setSearchFilters] = useState({
    dateRange: [new Date(), addDays(new Date(), 7)],
    specialization: '',
    appointmentType: '',
    locationType: '',
    maxPrice: 500,
    insuranceAccepted: false,
  });

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isValid },
  } = useForm<BookingFormData>({
    resolver: yupResolver(bookingSchema),
    mode: 'onChange',
    defaultValues: {
      patientName: '',
      patientEmail: '',
      patientPhone: '',
      reason: '',
      insuranceProvider: '',
      insurancePolicyNumber: '',
      notes: '',
    },
  });

  // Mock data for demonstration
  useEffect(() => {
    const mockProviders: Provider[] = [
      {
        id: '1',
        name: 'Dr. Sarah Johnson',
        specialization: 'Cardiology',
        experience: 15,
        rating: 4.8,
        reviewCount: 127,
        clinic: 'Heart Care Medical Center',
        address: '123 Medical Center Dr, New York, NY 10001',
        phone: '+1-555-123-4567',
        email: 'dr.johnson@heartcare.com',
        avatar: '/avatars/doctor1.jpg',
        insuranceAccepted: true,
        maxPrice: 250,
        currency: 'USD',
        tags: ['New Patients', 'Insurance Accepted', 'Wheelchair Accessible'],
      },
      {
        id: '2',
        name: 'Dr. Michael Chen',
        specialization: 'Dermatology',
        experience: 12,
        rating: 4.9,
        reviewCount: 89,
        clinic: 'Skin Health Clinic',
        address: '456 Health Plaza, New York, NY 10002',
        phone: '+1-555-234-5678',
        email: 'dr.chen@skinhealth.com',
        avatar: '/avatars/doctor2.jpg',
        insuranceAccepted: true,
        maxPrice: 180,
        currency: 'USD',
        tags: ['New Patients', 'Insurance Accepted', 'Evening Hours'],
      },
      {
        id: '3',
        name: 'Dr. Emily Rodriguez',
        specialization: 'Pediatrics',
        experience: 8,
        rating: 4.7,
        reviewCount: 156,
        clinic: 'Children\'s Wellness Center',
        address: '789 Pediatric Ave, New York, NY 10003',
        phone: '+1-555-345-6789',
        email: 'dr.rodriguez@childrenswellness.com',
        avatar: '/avatars/doctor3.jpg',
        insuranceAccepted: true,
        maxPrice: 150,
        currency: 'USD',
        tags: ['Child-Friendly', 'Insurance Accepted', 'Weekend Hours'],
      },
    ];

    const mockSlots: AvailableSlot[] = [
      {
        id: '1',
        providerId: '1',
        date: new Date(),
        startTime: new Date(new Date().setHours(9, 0, 0, 0)),
        endTime: new Date(new Date().setHours(17, 0, 0, 0)),
        appointmentType: 'Consultation',
        fee: 200,
        currency: 'USD',
        locationType: 'physical',
        address: '123 Medical Center Dr, New York, NY 10001',
        room: 'Room 101',
        timezone: 'America/New_York',
        availableSpots: 3,
        totalSpots: 5,
      },
      {
        id: '2',
        providerId: '2',
        date: addDays(new Date(), 1),
        startTime: new Date(addDays(new Date(), 1).setHours(10, 0, 0, 0)),
        endTime: new Date(addDays(new Date(), 1).setHours(16, 0, 0, 0)),
        appointmentType: 'Follow-up',
        fee: 150,
        currency: 'USD',
        locationType: 'virtual',
        timezone: 'America/New_York',
        availableSpots: 2,
        totalSpots: 4,
      },
      {
        id: '3',
        providerId: '3',
        date: addDays(new Date(), 2),
        startTime: new Date(addDays(new Date(), 2).setHours(8, 0, 0, 0)),
        endTime: new Date(addDays(new Date(), 2).setHours(18, 0, 0, 0)),
        appointmentType: 'Physical Examination',
        fee: 120,
        currency: 'USD',
        locationType: 'physical',
        address: '789 Pediatric Ave, New York, NY 10003',
        room: 'Room 205',
        timezone: 'America/New_York',
        availableSpots: 5,
        totalSpots: 8,
      },
    ];

    setProviders(mockProviders);
    setAvailableSlots(mockSlots);
    setFilteredSlots(mockSlots);
  }, []);

  const handleSearch = () => {
    const filtered = availableSlots.filter(slot => {
      const provider = providers.find(p => p.id === slot.providerId);
      if (!provider) return false;

      // Date range filter
      const slotDate = new Date(slot.date);
      const [startDate, endDate] = searchFilters.dateRange;
      if (isBefore(slotDate, startDate) || isAfter(slotDate, endDate)) return false;

      // Specialization filter
      if (searchFilters.specialization && provider.specialization !== searchFilters.specialization) return false;

      // Appointment type filter
      if (searchFilters.appointmentType && slot.appointmentType !== searchFilters.appointmentType) return false;

      // Location type filter
      if (searchFilters.locationType && slot.locationType !== searchFilters.locationType) return false;

      // Price filter
      if (slot.fee > searchFilters.maxPrice) return false;

      // Insurance filter
      if (searchFilters.insuranceAccepted && !provider.insuranceAccepted) return false;

      return true;
    });

    setFilteredSlots(filtered);
  };

  const handleBookAppointment = (slot: AvailableSlot) => {
    setSelectedSlot(slot);
    reset();
    setIsBookingDialogOpen(true);
  };

  const onSubmitBooking = async (data: BookingFormData) => {
    if (!selectedSlot) return;

    setIsLoading(true);
    
    try {
      const booking = {
        id: Date.now().toString(),
        slotId: selectedSlot.id,
        providerId: selectedSlot.providerId,
        patientName: data.patientName,
        patientEmail: data.patientEmail,
        patientPhone: data.patientPhone,
        reason: data.reason,
        insuranceProvider: data.insuranceProvider,
        insurancePolicyNumber: data.insurancePolicyNumber,
        notes: data.notes,
        bookingDate: new Date(),
        status: 'confirmed',
      };

      // Update available spots
      setAvailableSlots(slots => 
        slots.map(slot => 
          slot.id === selectedSlot.id 
            ? { ...slot, availableSpots: slot.availableSpots - 1 }
            : slot
        )
      );

      onBookingCreated?.(booking);
      setIsBookingDialogOpen(false);
      setSelectedSlot(null);
    } catch (error) {
      console.error('Error creating booking:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getProviderForSlot = (slot: AvailableSlot) => {
    return providers.find(p => p.id === slot.providerId);
  };

  const formatTime = (date: Date) => {
    return format(date, 'HH:mm');
  };

  const formatDate = (date: Date) => {
    return format(date, 'MMM dd, yyyy');
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Box sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>
          Find and Book Appointments
        </Typography>

        {/* Search Filters */}
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              <FilterList sx={{ mr: 1, verticalAlign: 'middle' }} />
              Search Filters
            </Typography>
            
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
              <Box sx={{ flex: '1 1 300px', minWidth: 0 }}>
                <DatePicker
                  label="From Date"
                  value={searchFilters.dateRange[0]}
                  onChange={(date) => setSearchFilters(prev => ({ ...prev, dateRange: [date || new Date(), prev.dateRange[1]] }))}
                  slotProps={{
                    textField: { fullWidth: true },
                  }}
                />
              </Box>
              <Box sx={{ flex: '1 1 300px', minWidth: 0 }}>
                <DatePicker
                  label="To Date"
                  value={searchFilters.dateRange[1]}
                  onChange={(date) => setSearchFilters(prev => ({ ...prev, dateRange: [prev.dateRange[0], date || new Date()] }))}
                  slotProps={{
                    textField: { fullWidth: true },
                  }}
                />
              </Box>
              <Box sx={{ flex: '1 1 300px', minWidth: 0 }}>
                <FormControl fullWidth>
                  <InputLabel>Specialization</InputLabel>
                  <Select
                    value={searchFilters.specialization}
                    onChange={(e) => setSearchFilters(prev => ({ ...prev, specialization: e.target.value }))}
                    label="Specialization"
                  >
                    <MenuItem value="">All Specializations</MenuItem>
                    {specializations.map((spec) => (
                      <MenuItem key={spec} value={spec}>{spec}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>
              <Box sx={{ flex: '1 1 300px', minWidth: 0 }}>
                <FormControl fullWidth>
                  <InputLabel>Appointment Type</InputLabel>
                  <Select
                    value={searchFilters.appointmentType}
                    onChange={(e) => setSearchFilters(prev => ({ ...prev, appointmentType: e.target.value }))}
                    label="Appointment Type"
                  >
                    <MenuItem value="">All Types</MenuItem>
                    {appointmentTypes.map((type) => (
                      <MenuItem key={type} value={type}>{type}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>
              <Box sx={{ flex: '1 1 300px', minWidth: 0 }}>
                <FormControl fullWidth>
                  <InputLabel>Location Type</InputLabel>
                  <Select
                    value={searchFilters.locationType}
                    onChange={(e) => setSearchFilters(prev => ({ ...prev, locationType: e.target.value }))}
                    label="Location Type"
                  >
                    <MenuItem value="">All Locations</MenuItem>
                    {locationTypes.map((type) => (
                      <MenuItem key={type} value={type}>{type}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>
              <Box sx={{ flex: '1 1 300px', minWidth: 0 }}>
                <Typography gutterBottom>Max Price: ${searchFilters.maxPrice}</Typography>
                <Slider
                  value={searchFilters.maxPrice}
                  onChange={(_, value) => setSearchFilters(prev => ({ ...prev, maxPrice: value as number }))}
                  min={0}
                  max={1000}
                  step={10}
                  valueLabelDisplay="auto"
                />
              </Box>
              <Box sx={{ flex: '1 1 300px', minWidth: 0 }}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={searchFilters.insuranceAccepted}
                      onChange={(e) => setSearchFilters(prev => ({ ...prev, insuranceAccepted: e.target.checked }))}
                    />
                  }
                  label="Insurance Accepted Only"
                />
              </Box>
              <Box sx={{ width: '100%', mt: 2 }}>
                <Button
                  variant="contained"
                  startIcon={<Search />}
                  onClick={handleSearch}
                  sx={{ mr: 2 }}
                >
                  Search
                </Button>
                <Button
                  variant="outlined"
                  onClick={() => setSearchFilters({
                    dateRange: [new Date(), addDays(new Date(), 7)],
                    specialization: '',
                    appointmentType: '',
                    locationType: '',
                    maxPrice: 500,
                    insuranceAccepted: false,
                  })}
                >
                  Clear Filters
                </Button>
              </Box>
            </Box>
          </CardContent>
        </Card>

        {/* Search Results */}
        <Typography variant="h6" gutterBottom>
          Available Appointments ({filteredSlots.length})
        </Typography>

        {filteredSlots.map((slot) => {
          const provider = getProviderForSlot(slot);
          if (!provider) return null;

          return (
            <Card key={slot.id} sx={{ mb: 2 }}>
              <CardContent>
                <Grid container spacing={3}>
                  <Grid item xs={12} md={8}>
                    <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
                      <Avatar src={provider.avatar} sx={{ mr: 2, width: 60, height: 60 }}>
                        <Person />
                      </Avatar>
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="h6">
                          {provider.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {provider.specialization} • {provider.experience} years experience
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                          <Rating value={provider.rating} readOnly size="small" />
                          <Typography variant="body2" sx={{ ml: 1 }}>
                            ({provider.reviewCount} reviews)
                          </Typography>
                        </Box>
                        <Typography variant="body2" sx={{ mt: 1 }}>
                          <LocationOn fontSize="small" sx={{ mr: 0.5, verticalAlign: 'middle' }} />
                          {provider.clinic}
                        </Typography>
                        <Box sx={{ mt: 1 }}>
                          {provider.tags.map((tag) => (
                            <Chip key={tag} label={tag} size="small" sx={{ mr: 0.5, mb: 0.5 }} />
                          ))}
                        </Box>
                      </Box>
                    </Box>

                    <Divider sx={{ my: 2 }} />

                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Event fontSize="small" sx={{ mr: 0.5 }} />
                        <Typography variant="body2">
                          {formatDate(slot.date)}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <AccessTime fontSize="small" sx={{ mr: 0.5 }} />
                        <Typography variant="body2">
                          {formatTime(slot.startTime)} - {formatTime(slot.endTime)}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <AttachMoney fontSize="small" sx={{ mr: 0.5 }} />
                        <Typography variant="body2">
                          ${slot.fee} {slot.currency}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Schedule fontSize="small" sx={{ mr: 0.5 }} />
                        <Typography variant="body2">
                          {slot.availableSpots} of {slot.totalSpots} spots available
                        </Typography>
                      </Box>
                    </Box>

                    <Typography variant="body2" sx={{ mt: 1 }}>
                      <strong>Appointment Type:</strong> {slot.appointmentType}
                    </Typography>
                    <Typography variant="body2">
                      <strong>Location:</strong> {slot.locationType === 'physical' ? slot.address : 'Virtual Appointment'}
                      {slot.room && ` (${slot.room})`}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'space-between' }}>
                      <Box>
                        <Alert severity="info" sx={{ mb: 2 }}>
                          <Typography variant="body2">
                            Time shown in {slot.timezone}
                          </Typography>
                        </Alert>
                        {slot.availableSpots === 0 && (
                          <Alert severity="warning" sx={{ mb: 2 }}>
                            No available spots
                          </Alert>
                        )}
                      </Box>
                      <Button
                        variant="contained"
                        fullWidth
                        disabled={slot.availableSpots === 0}
                        onClick={() => handleBookAppointment(slot)}
                        sx={{ mt: 'auto' }}
                      >
                        Book Now
                      </Button>
                    </Box>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          );
        })}

        {filteredSlots.length === 0 && (
          <Card>
            <CardContent sx={{ textAlign: 'center', py: 4 }}>
              <Typography variant="h6" color="text.secondary" gutterBottom>
                No appointments found
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Try adjusting your search filters or expanding your date range.
              </Typography>
            </CardContent>
          </Card>
        )}

        {/* Booking Dialog */}
        <Dialog open={isBookingDialogOpen} onClose={() => setIsBookingDialogOpen(false)} maxWidth="md" fullWidth>
          <DialogTitle>
            Book Appointment
            {selectedSlot && (
              <Typography variant="body2" color="text.secondary">
                {getProviderForSlot(selectedSlot)?.name} • {formatDate(selectedSlot.date)} at {formatTime(selectedSlot.startTime)}
              </Typography>
            )}
          </DialogTitle>
          <DialogContent>
            <Box component="form" onSubmit={handleSubmit(onSubmitBooking)} sx={{ mt: 2 }}>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <Controller
                    name="patientName"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="Patient Name"
                        fullWidth
                        error={!!errors.patientName}
                        helperText={errors.patientName?.message}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Controller
                    name="patientEmail"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="Email"
                        type="email"
                        fullWidth
                        error={!!errors.patientEmail}
                        helperText={errors.patientEmail?.message}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Controller
                    name="patientPhone"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="Phone Number"
                        fullWidth
                        error={!!errors.patientPhone}
                        helperText={errors.patientPhone?.message}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Controller
                    name="insuranceProvider"
                    control={control}
                    render={({ field }) => (
                      <FormControl fullWidth>
                        <InputLabel>Insurance Provider (Optional)</InputLabel>
                        <Select {...field} label="Insurance Provider (Optional)">
                          <MenuItem value="">No Insurance</MenuItem>
                          {insuranceProviders.map((provider) => (
                            <MenuItem key={provider} value={provider}>{provider}</MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    )}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Controller
                    name="insurancePolicyNumber"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="Policy Number (Optional)"
                        fullWidth
                        error={!!errors.insurancePolicyNumber}
                        helperText={errors.insurancePolicyNumber?.message}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Controller
                    name="reason"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="Reason for Appointment"
                        multiline
                        rows={3}
                        fullWidth
                        error={!!errors.reason}
                        helperText={errors.reason?.message}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Controller
                    name="notes"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="Additional Notes (Optional)"
                        multiline
                        rows={2}
                        fullWidth
                        error={!!errors.notes}
                        helperText={errors.notes?.message}
                      />
                    )}
                  />
                </Grid>
              </Grid>
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setIsBookingDialogOpen(false)}>Cancel</Button>
            <Button
              type="submit"
              variant="contained"
              disabled={!isValid || isLoading}
              onClick={handleSubmit(onSubmitBooking)}
            >
              {isLoading ? <CircularProgress size={20} /> : 'Confirm Booking'}
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </LocalizationProvider>
  );
}; 