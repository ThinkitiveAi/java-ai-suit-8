import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  IconButton,
  Button,
  Grid,
  Chip,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Switch,
  FormControlLabel,
  Alert,
} from '@mui/material';
import {
  ChevronLeft,
  ChevronRight,
  Add,
  Edit,
  Delete,
  Event,
  AccessTime,
  LocationOn,
  AttachMoney,
  Info,
} from '@mui/icons-material';
import { LocalizationProvider, DatePicker, TimePicker } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import {
  format,
  addDays,
  addWeeks,
  addMonths,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameDay,
  isWithinInterval,
  parseISO,
  isBefore,
  isAfter,
} from 'date-fns';
import { SlotDialog } from './SlotDialog';

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

interface ProviderAvailabilityCalendarProps {
  slots: TimeSlot[];
  onSlotCreate: (slot: Omit<TimeSlot, 'id' | 'isBooked'>) => void;
  onSlotUpdate: (slot: TimeSlot) => void;
  onSlotDelete: (slotId: string) => void;
}

const timezones = [
  'UTC',
  'America/New_York',
  'America/Chicago',
  'America/Denver',
  'America/Los_Angeles',
  'Europe/London',
  'Europe/Paris',
  'Asia/Tokyo',
  'Australia/Sydney',
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

const currencies = ['USD', 'EUR', 'GBP', 'JPY', 'CAD', 'AUD'];

export const ProviderAvailabilityCalendar: React.FC<ProviderAvailabilityCalendarProps> = ({
  slots,
  onSlotCreate,
  onSlotUpdate,
  onSlotDelete,
}) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<'week' | 'month'>('week');
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [deleteReason, setDeleteReason] = useState('');

  const handlePrevious = () => {
    setCurrentDate(viewMode === 'week' ? addWeeks(currentDate, -1) : addMonths(currentDate, -1));
  };

  const handleNext = () => {
    setCurrentDate(viewMode === 'week' ? addWeeks(currentDate, 1) : addMonths(currentDate, 1));
  };

  const handleToday = () => {
    setCurrentDate(new Date());
  };

  const getDaysInView = () => {
    const start = viewMode === 'week' ? startOfWeek(currentDate) : startOfMonth(currentDate);
    const end = viewMode === 'week' ? endOfWeek(currentDate) : endOfMonth(currentDate);
    return eachDayOfInterval({ start, end });
  };

  const getSlotsForDay = (date: Date) => {
    return slots.filter(slot => isSameDay(slot.date, date));
  };

  const handleCreateSlot = () => {
    setSelectedSlot(null);
    setIsDialogOpen(true);
  };

  const handleEditSlot = (slot: TimeSlot) => {
    setSelectedSlot(slot);
    setIsDialogOpen(true);
  };

  const handleDeleteSlot = (slot: TimeSlot) => {
    if (slot.isBooked) {
      alert('Cannot delete a booked slot');
      return;
    }
    setSelectedSlot(slot);
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (selectedSlot) {
      onSlotDelete(selectedSlot.id);
      setIsDeleteDialogOpen(false);
      setSelectedSlot(null);
      setDeleteReason('');
    }
  };

  const getSlotColor = (slot: TimeSlot) => {
    if (slot.isBooked) return 'error.light';
    if (slot.isRecurring) return 'info.light';
    return 'primary.light';
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Box>
        {/* Calendar Header */}
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <Box sx={{ flex: 1 }}>
            <Button variant="outlined" onClick={handleToday} sx={{ mr: 2 }}>
              Today
            </Button>
            <IconButton onClick={handlePrevious}>
              <ChevronLeft />
            </IconButton>
            <IconButton onClick={handleNext}>
              <ChevronRight />
            </IconButton>
            <Typography variant="h6" component="span" sx={{ ml: 2 }}>
              {format(currentDate, viewMode === 'week' ? 'MMMM yyyy, wo week' : 'MMMM yyyy')}
            </Typography>
          </Box>
          <Box>
            <Button
              variant="outlined"
              onClick={() => setViewMode(viewMode === 'week' ? 'month' : 'week')}
              sx={{ mr: 2 }}
            >
              {viewMode === 'week' ? 'Month View' : 'Week View'}
            </Button>
            <Button variant="contained" startIcon={<Add />} onClick={handleCreateSlot}>
              Add Slot
            </Button>
          </Box>
        </Box>

        {/* Calendar Grid */}
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
          {/* Day Headers */}
          {getDaysInView().map((day, index) => (
            <Box
              key={index}
              sx={{
                flex: `0 0 ${viewMode === 'week' ? '14.28%' : '14.28%'}`,
                p: 1,
                textAlign: 'center',
                bgcolor: 'grey.100',
                borderRadius: 1,
              }}
            >
              <Typography variant="subtitle2" color="text.secondary">
                {format(day, 'EEE')}
              </Typography>
              <Typography variant="h6">
                {format(day, 'd')}
              </Typography>
            </Box>
          ))}

          {/* Time Slots */}
          {getDaysInView().map((day, index) => (
            <Box
              key={`slots-${index}`}
              sx={{
                flex: `0 0 ${viewMode === 'week' ? '14.28%' : '14.28%'}`,
                minHeight: 120,
              }}
            >
              {getSlotsForDay(day).map((slot) => (
                <Card
                  key={slot.id}
                  sx={{
                    mb: 1,
                    bgcolor: getSlotColor(slot),
                    position: 'relative',
                  }}
                >
                  <CardContent sx={{ p: '8px !important' }}>
                    <Typography variant="caption" display="block">
                      {format(slot.startTime, 'HH:mm')} - {format(slot.endTime, 'HH:mm')}
                    </Typography>
                    <Typography variant="caption" display="block">
                      {slot.appointmentType}
                    </Typography>
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 1 }}>
                      <IconButton
                        size="small"
                        onClick={() => handleEditSlot(slot)}
                        disabled={slot.isBooked}
                      >
                        <Edit fontSize="small" />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() => handleDeleteSlot(slot)}
                        disabled={slot.isBooked}
                      >
                        <Delete fontSize="small" />
                      </IconButton>
                    </Box>
                    {slot.isBooked && (
                      <Tooltip title="This slot is booked">
                        <Info
                          sx={{
                            position: 'absolute',
                            top: 4,
                            right: 4,
                            fontSize: 16,
                            color: 'error.main',
                          }}
                        />
                      </Tooltip>
                    )}
                  </CardContent>
                </Card>
              ))}
            </Box>
          ))}
        </Box>

        {/* Slot Dialog */}
        <SlotDialog
          open={isDialogOpen}
          onClose={() => setIsDialogOpen(false)}
          onSubmit={(data) => {
            if (selectedSlot) {
              onSlotUpdate({ ...data, id: selectedSlot.id, isBooked: selectedSlot.isBooked });
            } else {
              onSlotCreate(data);
            }
          }}
          slot={selectedSlot || undefined}
          timezones={timezones}
          appointmentTypes={appointmentTypes}
          currencies={currencies}
          availableTags={[
            'New Patients',
            'Insurance Accepted',
            'Wheelchair Accessible',
            'Parking Available',
            'Public Transport',
            'Evening Hours',
            'Weekend Hours',
            'Emergency Available',
            'Child-Friendly',
            'Senior-Friendly',
          ]}
        />

        {/* Delete Confirmation Dialog */}
        <Dialog open={isDeleteDialogOpen} onClose={() => setIsDeleteDialogOpen(false)}>
          <DialogTitle>Delete Time Slot</DialogTitle>
          <DialogContent>
            <Alert severity="warning" sx={{ mb: 2 }}>
              Are you sure you want to delete this time slot?
            </Alert>
            {selectedSlot && (
              <Box>
                <Typography variant="body2" gutterBottom>
                  Date: {format(selectedSlot.date, 'MMM dd, yyyy')}
                </Typography>
                <Typography variant="body2" gutterBottom>
                  Time: {format(selectedSlot.startTime, 'HH:mm')} - {format(selectedSlot.endTime, 'HH:mm')}
                </Typography>
                <TextField
                  label="Reason for deletion"
                  fullWidth
                  multiline
                  rows={2}
                  value={deleteReason}
                  onChange={(e) => setDeleteReason(e.target.value)}
                  sx={{ mt: 2 }}
                />
              </Box>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setIsDeleteDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleConfirmDelete} color="error">
              Delete
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </LocalizationProvider>
  );
}; 