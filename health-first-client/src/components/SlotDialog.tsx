import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Switch,
  InputAdornment,
  Chip,
  OutlinedInput,
  Checkbox,
  ListItemText,
  Alert,
} from '@mui/material';
import { LocalizationProvider, DatePicker, TimePicker } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { format, isBefore, isAfter } from 'date-fns';

interface TimeSlot {
  id: string;
  date: Date;
  startTime: Date;
  endTime: Date;
  timezone: string;
  appointmentType: string;
  slotDuration: number;
  breakDuration: number;
  maxAppointments: number;
  locationType: 'physical' | 'virtual' | 'hybrid';
  address?: string;
  room?: string;
  fee: number;
  currency: string;
  insuranceAccepted: boolean;
  notes?: string;
  tags: string[];
  isRecurring: boolean;
  recurrenceType?: 'daily' | 'weekly' | 'monthly';
  recurrenceEndDate?: Date;
  isBooked: boolean;
}

interface SlotDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: Omit<TimeSlot, 'id' | 'isBooked'>) => void;
  slot?: TimeSlot;
  timezones: string[];
  appointmentTypes: string[];
  currencies: string[];
  availableTags: string[];
}

const slotSchema = yup.object({
  date: yup.date().required('Date is required').min(new Date(), 'Date cannot be in the past'),
  startTime: yup.date().required('Start time is required'),
  endTime: yup.date().required('End time is required'),
  timezone: yup.string().required('Timezone is required'),
  appointmentType: yup.string().required('Appointment type is required'),
  slotDuration: yup.number()
    .required('Slot duration is required')
    .min(15, 'Minimum 15 minutes')
    .max(120, 'Maximum 120 minutes'),
  breakDuration: yup.number()
    .required('Break duration is required')
    .min(5, 'Minimum 5 minutes')
    .max(30, 'Maximum 30 minutes'),
  maxAppointments: yup.number()
    .required('Max appointments is required')
    .min(1, 'Minimum 1 appointment')
    .max(10, 'Maximum 10 appointments'),
  locationType: yup.string<'physical' | 'virtual' | 'hybrid'>().required('Location type is required'),
  address: yup.string().optional(),
  room: yup.string().optional(),
  fee: yup.number()
    .required('Fee is required')
    .min(0, 'Fee cannot be negative'),
  currency: yup.string().required('Currency is required'),
  insuranceAccepted: yup.boolean().required(),
  notes: yup.string().max(500, 'Notes must be less than 500 characters').optional(),
  tags: yup.array().of(yup.string()).optional(),
  isRecurring: yup.boolean().required(),
  recurrenceType: yup.string().optional(),
  recurrenceEndDate: yup.date().optional(),
}).required();

// Add conditional validation
slotSchema.test('address-required-for-physical', 'Address is required for physical visits', function(value) {
  if (value.locationType === 'physical' && !value.address) {
    return this.createError({ path: 'address', message: 'Address is required for physical visits' });
  }
  return true;
});

slotSchema.test('recurrence-validation', 'Recurrence fields are required when isRecurring is true', function(value) {
  if (value.isRecurring) {
    if (!value.recurrenceType) {
      return this.createError({ path: 'recurrenceType', message: 'Recurrence type is required' });
    }
    if (!value.recurrenceEndDate) {
      return this.createError({ path: 'recurrenceEndDate', message: 'Recurrence end date is required' });
    }
    if (value.recurrenceEndDate && value.date && value.recurrenceEndDate < value.date) {
      return this.createError({ path: 'recurrenceEndDate', message: 'End date must be after start date' });
    }
  }
  return true;
});

type SlotFormData = yup.InferType<typeof slotSchema>;

export const SlotDialog: React.FC<SlotDialogProps> = ({
  open,
  onClose,
  onSubmit,
  slot,
  timezones,
  appointmentTypes,
  currencies,
  availableTags,
}) => {
  const {
    control,
    handleSubmit,
    watch,
    formState: { errors, isValid },
    reset,
  } = useForm<SlotFormData>({
    resolver: yupResolver(slotSchema),
    mode: 'onChange',
    defaultValues: {
      date: slot?.date || new Date(),
      startTime: slot?.startTime || new Date(),
      endTime: slot?.endTime || new Date(),
      timezone: slot?.timezone || 'UTC',
      appointmentType: slot?.appointmentType || appointmentTypes[0],
      slotDuration: slot?.slotDuration || 30,
      breakDuration: slot?.breakDuration || 10,
      maxAppointments: slot?.maxAppointments || 1,
      locationType: slot?.locationType || 'physical',
      address: slot?.address || '',
      room: slot?.room || '',
      fee: slot?.fee || 100,
      currency: slot?.currency || currencies[0],
      insuranceAccepted: slot?.insuranceAccepted || false,
      notes: slot?.notes || '',
      tags: slot?.tags || [],
      isRecurring: slot?.isRecurring || false,
      recurrenceType: slot?.recurrenceType || 'weekly',
      recurrenceEndDate: slot?.recurrenceEndDate,
    },
  });

  const watchedLocationType = watch('locationType');
  const watchedIsRecurring = watch('isRecurring');
  const watchedStartTime = watch('startTime');
  const watchedEndTime = watch('endTime');

  // Check for time conflicts
  const hasTimeConflict = watchedStartTime && watchedEndTime && !isBefore(watchedStartTime, watchedEndTime);

  const handleClose = () => {
    reset();
    onClose();
  };

  const handleFormSubmit = (data: SlotFormData) => {
    onSubmit(data);
    handleClose();
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle>
          {slot ? 'Edit Time Slot' : 'Create New Time Slot'}
        </DialogTitle>
        <DialogContent>
          <Box component="form" sx={{ mt: 2 }}>
            {hasTimeConflict && (
              <Alert severity="error" sx={{ mb: 2 }}>
                End time must be after start time
              </Alert>
            )}

            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
              {/* Date and Time */}
              <Box sx={{ flex: '1 1 300px' }}>
                <Controller
                  name="date"
                  control={control}
                  render={({ field }) => (
                    <DatePicker
                      label="Date"
                      {...field}
                      slotProps={{
                        textField: {
                          fullWidth: true,
                          error: !!errors.date,
                          helperText: errors.date?.message,
                        },
                      }}
                    />
                  )}
                />
              </Box>

              <Box sx={{ flex: '1 1 300px' }}>
                <Controller
                  name="timezone"
                  control={control}
                  render={({ field }) => (
                    <FormControl fullWidth error={!!errors.timezone}>
                      <InputLabel>Timezone</InputLabel>
                      <Select {...field} label="Timezone">
                        {timezones.map((tz) => (
                          <MenuItem key={tz} value={tz}>{tz}</MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  )}
                />
              </Box>

              <Box sx={{ flex: '1 1 300px' }}>
                <Controller
                  name="startTime"
                  control={control}
                  render={({ field }) => (
                    <TimePicker
                      label="Start Time"
                      {...field}
                      slotProps={{
                        textField: {
                          fullWidth: true,
                          error: !!errors.startTime,
                          helperText: errors.startTime?.message,
                        },
                      }}
                    />
                  )}
                />
              </Box>

              <Box sx={{ flex: '1 1 300px' }}>
                <Controller
                  name="endTime"
                  control={control}
                  render={({ field }) => (
                    <TimePicker
                      label="End Time"
                      {...field}
                      slotProps={{
                        textField: {
                          fullWidth: true,
                          error: !!errors.endTime,
                          helperText: errors.endTime?.message,
                        },
                      }}
                    />
                  )}
                />
              </Box>

              {/* Slot Details */}
              <Box sx={{ flex: '1 1 300px' }}>
                <Controller
                  name="appointmentType"
                  control={control}
                  render={({ field }) => (
                    <FormControl fullWidth error={!!errors.appointmentType}>
                      <InputLabel>Appointment Type</InputLabel>
                      <Select {...field} label="Appointment Type">
                        {appointmentTypes.map((type) => (
                          <MenuItem key={type} value={type}>{type}</MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  )}
                />
              </Box>

              <Box sx={{ flex: '1 1 300px' }}>
                <Controller
                  name="slotDuration"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Slot Duration (minutes)"
                      type="number"
                      fullWidth
                      error={!!errors.slotDuration}
                      helperText={errors.slotDuration?.message}
                    />
                  )}
                />
              </Box>

              <Box sx={{ flex: '1 1 300px' }}>
                <Controller
                  name="breakDuration"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Break Duration (minutes)"
                      type="number"
                      fullWidth
                      error={!!errors.breakDuration}
                      helperText={errors.breakDuration?.message}
                    />
                  )}
                />
              </Box>

              <Box sx={{ flex: '1 1 300px' }}>
                <Controller
                  name="maxAppointments"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Max Appointments per Slot"
                      type="number"
                      fullWidth
                      error={!!errors.maxAppointments}
                      helperText={errors.maxAppointments?.message}
                    />
                  )}
                />
              </Box>

              {/* Location */}
              <Box sx={{ flex: '1 1 300px' }}>
                <Controller
                  name="locationType"
                  control={control}
                  render={({ field }) => (
                    <FormControl fullWidth error={!!errors.locationType}>
                      <InputLabel>Location Type</InputLabel>
                      <Select {...field} label="Location Type">
                        <MenuItem value="physical">Physical</MenuItem>
                        <MenuItem value="virtual">Virtual</MenuItem>
                        <MenuItem value="hybrid">Hybrid</MenuItem>
                      </Select>
                    </FormControl>
                  )}
                />
              </Box>

              {watchedLocationType === 'physical' && (
                <>
                  <Box sx={{ flex: '1 1 300px' }}>
                    <Controller
                      name="address"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          label="Address"
                          fullWidth
                          error={!!errors.address}
                          helperText={errors.address?.message}
                        />
                      )}
                    />
                  </Box>

                  <Box sx={{ flex: '1 1 300px' }}>
                    <Controller
                      name="room"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          label="Room (optional)"
                          fullWidth
                          error={!!errors.room}
                          helperText={errors.room?.message}
                        />
                      )}
                    />
                  </Box>
                </>
              )}

              {/* Pricing */}
              <Box sx={{ flex: '1 1 300px' }}>
                <Controller
                  name="fee"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Fee"
                      type="number"
                      fullWidth
                      error={!!errors.fee}
                      helperText={errors.fee?.message}
                      InputProps={{
                        startAdornment: <InputAdornment position="start">$</InputAdornment>,
                      }}
                    />
                  )}
                />
              </Box>

              <Box sx={{ flex: '1 1 300px' }}>
                <Controller
                  name="currency"
                  control={control}
                  render={({ field }) => (
                    <FormControl fullWidth error={!!errors.currency}>
                      <InputLabel>Currency</InputLabel>
                      <Select {...field} label="Currency">
                        {currencies.map((currency) => (
                          <MenuItem key={currency} value={currency}>{currency}</MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  )}
                />
              </Box>

              <Box sx={{ flex: '1 1 300px' }}>
                <FormControlLabel
                  control={
                    <Controller
                      name="insuranceAccepted"
                      control={control}
                      render={({ field }) => (
                        <Switch
                          {...field}
                          checked={field.value}
                        />
                      )}
                    />
                  }
                  label="Accept Insurance"
                />
              </Box>

              {/* Notes and Tags */}
              <Box sx={{ flex: '1 1 100%' }}>
                <Controller
                  name="notes"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Notes"
                      multiline
                      rows={3}
                      fullWidth
                      error={!!errors.notes}
                      helperText={errors.notes?.message}
                    />
                  )}
                />
              </Box>

              <Box sx={{ flex: '1 1 100%' }}>
                <Controller
                  name="tags"
                  control={control}
                  render={({ field }) => (
                    <FormControl fullWidth>
                      <InputLabel>Tags</InputLabel>
                      <Select
                        {...field}
                        multiple
                        input={<OutlinedInput label="Tags" />}
                        renderValue={(selected) => (
                          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                            {selected.map((value) => (
                              <Chip key={value} label={value} size="small" />
                            ))}
                          </Box>
                        )}
                      >
                        {availableTags.map((tag) => (
                          <MenuItem key={tag} value={tag}>
                            <Checkbox checked={field.value?.indexOf(tag) > -1} />
                            <ListItemText primary={tag} />
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  )}
                />
              </Box>

              {/* Recurrence */}
              <Box sx={{ flex: '1 1 100%' }}>
                <FormControlLabel
                  control={
                    <Controller
                      name="isRecurring"
                      control={control}
                      render={({ field }) => (
                        <Switch
                          {...field}
                          checked={field.value}
                        />
                      )}
                    />
                  }
                  label="Make this slot recurring"
                />
              </Box>

              {watchedIsRecurring && (
                <>
                  <Box sx={{ flex: '1 1 300px' }}>
                    <Controller
                      name="recurrenceType"
                      control={control}
                      render={({ field }) => (
                        <FormControl fullWidth error={!!errors.recurrenceType}>
                          <InputLabel>Recurrence Type</InputLabel>
                          <Select {...field} label="Recurrence Type">
                            <MenuItem value="daily">Daily</MenuItem>
                            <MenuItem value="weekly">Weekly</MenuItem>
                            <MenuItem value="monthly">Monthly</MenuItem>
                          </Select>
                        </FormControl>
                      )}
                    />
                  </Box>

                  <Box sx={{ flex: '1 1 300px' }}>
                    <Controller
                      name="recurrenceEndDate"
                      control={control}
                      render={({ field }) => (
                        <DatePicker
                          label="End Date"
                          {...field}
                          slotProps={{
                            textField: {
                              fullWidth: true,
                              error: !!errors.recurrenceEndDate,
                              helperText: errors.recurrenceEndDate?.message,
                            },
                          }}
                        />
                      )}
                    />
                  </Box>
                </>
              )}
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button
            onClick={handleSubmit(handleFormSubmit)}
            variant="contained"
            disabled={!isValid || hasTimeConflict}
          >
            {slot ? 'Update Slot' : 'Create Slot'}
          </Button>
        </DialogActions>
      </Dialog>
    </LocalizationProvider>
  );
}; 