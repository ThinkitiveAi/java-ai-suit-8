import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Tabs,
  Tab,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Grid,
  Paper,
  Divider,
  Alert,
  IconButton,
  Chip,
} from '@mui/material';
import {
  Add,
  CalendarToday,
  CalendarViewWeek,
  CalendarViewMonth,
  Edit,
  Delete,
  Warning,
} from '@mui/icons-material';
import { format, addDays, startOfWeek, endOfWeek, isSameDay } from 'date-fns';
import { ProviderAvailabilityCalendar } from './ProviderAvailabilityCalendar';
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

interface WeekdayAvailability {
  monday: boolean;
  tuesday: boolean;
  wednesday: boolean;
  thursday: boolean;
  friday: boolean;
  saturday: boolean;
  sunday: boolean;
}

interface ProviderAvailabilityProps {
  providerId?: string;
  onSlotCreated?: (slot: any) => void;
  onSlotUpdated?: (slot: any) => void;
  onSlotDeleted?: (slotId: string) => void;
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

const availableTags = [
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
];

export const ProviderAvailability: React.FC<ProviderAvailabilityProps> = ({
  providerId,
  onSlotCreated,
  onSlotUpdated,
  onSlotDeleted,
}) => {
  const [activeTab, setActiveTab] = useState(0);
  const [slots, setSlots] = useState<TimeSlot[]>([]);
  const [weekdayAvailability, setWeekdayAvailability] = useState<WeekdayAvailability>({
    monday: true,
    tuesday: true,
    wednesday: true,
    thursday: true,
    friday: true,
    saturday: false,
    sunday: false,
  });
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null);
  const [viewMode, setViewMode] = useState<'week' | 'month'>('week');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [hasConflicts, setHasConflicts] = useState(false);

  // Mock data for demonstration
  useEffect(() => {
    const mockSlots: TimeSlot[] = [
      {
        id: '1',
        date: new Date(),
        startTime: new Date(new Date().setHours(9, 0, 0, 0)),
        endTime: new Date(new Date().setHours(17, 0, 0, 0)),
        timezone: 'America/New_York',
        appointmentType: 'Consultation',
        slotDuration: 30,
        breakDuration: 10,
        maxAppointments: 1,
        locationType: 'physical',
        address: '123 Medical Center Dr, New York, NY 10001',
        room: 'Room 101',
        fee: 150,
        currency: 'USD',
        insuranceAccepted: true,
        notes: 'New patients welcome',
        tags: ['New Patients', 'Insurance Accepted'],
        isRecurring: true,
        recurrenceType: 'weekly',
        recurrenceEndDate: new Date(new Date().setDate(new Date().getDate() + 30)),
        isBooked: false,
      },
      {
        id: '2',
        date: new Date(new Date().setDate(new Date().getDate() + 1)),
        startTime: new Date(new Date().setHours(10, 0, 0, 0)),
        endTime: new Date(new Date().setHours(16, 0, 0, 0)),
        timezone: 'America/New_York',
        appointmentType: 'Follow-up',
        slotDuration: 45,
        breakDuration: 15,
        maxAppointments: 1,
        locationType: 'virtual',
        fee: 120,
        currency: 'USD',
        insuranceAccepted: true,
        notes: 'Telemedicine appointments',
        tags: ['Telemedicine', 'Evening Hours'],
        isRecurring: false,
        isBooked: true,
      },
    ];

    setSlots(mockSlots);
  }, []);

  const handleWeekdayChange = (day: keyof WeekdayAvailability) => {
    setWeekdayAvailability({
      ...weekdayAvailability,
      [day]: !weekdayAvailability[day],
    });
  };

  const handleSlotCreate = (slot: Omit<TimeSlot, 'id' | 'isBooked'>) => {
    const newSlot: TimeSlot = {
      ...slot,
      id: Date.now().toString(),
      isBooked: false,
    };
    
    // Check for conflicts
    const hasConflict = checkForConflicts(newSlot);
    if (hasConflict) {
      setHasConflicts(true);
      return;
    }
    
    setSlots([...slots, newSlot]);
    onSlotCreated?.(newSlot);
    setHasConflicts(false);
  };

  const handleSlotUpdate = (updatedSlot: TimeSlot) => {
    // Check for conflicts, excluding the slot being updated
    const hasConflict = checkForConflicts(updatedSlot, updatedSlot.id);
    if (hasConflict) {
      setHasConflicts(true);
      return;
    }
    
    setSlots(slots.map(slot => slot.id === updatedSlot.id ? updatedSlot : slot));
    onSlotUpdated?.(updatedSlot);
    setHasConflicts(false);
  };

  const handleSlotDelete = (slotId: string) => {
    setSlots(slots.filter(slot => slot.id !== slotId));
    onSlotDeleted?.(slotId);
    setHasConflicts(false);
  };

  const checkForConflicts = (newSlot: TimeSlot, excludeId?: string) => {
    return slots.some(slot => {
      // Skip the slot being updated
      if (excludeId && slot.id === excludeId) return false;
      
      // Check if dates are the same
      if (!isSameDay(slot.date, newSlot.date)) return false;
      
      // Check for time overlap
      const slotStart = new Date(slot.startTime).getTime();
      const slotEnd = new Date(slot.endTime).getTime();
      const newSlotStart = new Date(newSlot.startTime).getTime();
      const newSlotEnd = new Date(newSlot.endTime).getTime();
      
      return (
        (newSlotStart >= slotStart && newSlotStart < slotEnd) || // New slot starts during existing slot
        (newSlotEnd > slotStart && newSlotEnd <= slotEnd) || // New slot ends during existing slot
        (newSlotStart <= slotStart && newSlotEnd >= slotEnd) // New slot completely contains existing slot
      );
    });
  };

  const handleOpenDialog = (slot?: TimeSlot) => {
    setSelectedSlot(slot || null);
    setIsDialogOpen(true);
    setHasConflicts(false);
  };

  return (
    <Box sx={{ p: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5">Provider Availability Management</Typography>
        <Box>
          <Button
            variant={viewMode === 'week' ? 'contained' : 'outlined'}
            startIcon={<CalendarViewWeek />}
            onClick={() => setViewMode('week')}
            sx={{ mr: 1 }}
          >
            Week View
          </Button>
          <Button
            variant={viewMode === 'month' ? 'contained' : 'outlined'}
            startIcon={<CalendarViewMonth />}
            onClick={() => setViewMode('month')}
            sx={{ mr: 1 }}
          >
            Month View
          </Button>
          <Button
            variant="contained"
            color="primary"
            startIcon={<Add />}
            onClick={() => handleOpenDialog()}
          >
            Add Slot
          </Button>
        </Box>
      </Box>

      {hasConflicts && (
        <Alert severity="error" sx={{ mb: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Warning sx={{ mr: 1 }} />
            <Typography>
              Time slot conflicts detected. Please adjust the time range to avoid overlapping with existing slots.
            </Typography>
          </Box>
        </Alert>
      )}

      <Tabs value={activeTab} onChange={(_, newValue) => setActiveTab(newValue)} sx={{ mb: 3 }}>
        <Tab label="Calendar" />
        <Tab label="Weekly Schedule" />
        <Tab label="List View" />
      </Tabs>

      {activeTab === 0 && (
        <ProviderAvailabilityCalendar
          slots={slots}
          onSlotCreate={handleSlotCreate}
          onSlotUpdate={handleSlotUpdate}
          onSlotDelete={handleSlotDelete}
        />
      )}

      {activeTab === 1 && (
        <Box>
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Weekly Availability
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Select the days of the week when you are generally available
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 3 }}>
                <Box sx={{ flex: '1 1 300px', minWidth: 0 }}>
                  <FormGroup>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={weekdayAvailability.monday}
                          onChange={() => handleWeekdayChange('monday')}
                        />
                      }
                      label="Monday"
                    />
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={weekdayAvailability.tuesday}
                          onChange={() => handleWeekdayChange('tuesday')}
                        />
                      }
                      label="Tuesday"
                    />
                  </FormGroup>
                </Box>
                <Box sx={{ flex: '1 1 300px', minWidth: 0 }}>
                  <FormGroup>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={weekdayAvailability.wednesday}
                          onChange={() => handleWeekdayChange('wednesday')}
                        />
                      }
                      label="Wednesday"
                    />
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={weekdayAvailability.thursday}
                          onChange={() => handleWeekdayChange('thursday')}
                        />
                      }
                      label="Thursday"
                    />
                  </FormGroup>
                </Box>
                <Box sx={{ flex: '1 1 300px', minWidth: 0 }}>
                  <FormGroup>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={weekdayAvailability.friday}
                          onChange={() => handleWeekdayChange('friday')}
                        />
                      }
                      label="Friday"
                    />
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={weekdayAvailability.saturday}
                          onChange={() => handleWeekdayChange('saturday')}
                        />
                      }
                      label="Saturday"
                    />
                  </FormGroup>
                </Box>
                <Box sx={{ flex: '1 1 300px', minWidth: 0 }}>
                  <FormGroup>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={weekdayAvailability.sunday}
                          onChange={() => handleWeekdayChange('sunday')}
                        />
                      }
                      label="Sunday"
                    />
                  </FormGroup>
                </Box>
              </Box>
              <Divider sx={{ my: 2 }} />
              <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                <Button variant="outlined" sx={{ mr: 1 }}>Cancel</Button>
                <Button variant="contained">Save Weekly Schedule</Button>
              </Box>
            </CardContent>
          </Card>

          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6">Time Slots for Selected Days</Typography>
            <Button
              variant="outlined"
              startIcon={<Add />}
              onClick={() => handleOpenDialog()}
            >
              Add Slot
            </Button>
          </Box>

          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
            {Object.entries(weekdayAvailability)
              .filter(([_, isAvailable]) => isAvailable)
              .map(([day]) => (
                <Box 
                  key={day} 
                  sx={{ 
                    flex: '1 1 calc(50% - 8px)',
                    minWidth: { xs: '100%', md: 'calc(50% - 8px)' } 
                  }}
                >
                  <Paper sx={{ p: 2, height: '100%' }}>
                    <Typography variant="subtitle1" sx={{ mb: 2, textTransform: 'capitalize' }}>
                      {day}
                    </Typography>
                    {slots
                      .filter(slot => {
                        const dayOfWeek = format(slot.date, 'EEEE').toLowerCase();
                        return dayOfWeek === day.toLowerCase();
                      })
                      .map(slot => (
                        <Box
                          key={slot.id}
                          sx={{
                            p: 1,
                            mb: 1,
                            borderRadius: 1,
                            bgcolor: slot.isBooked ? 'error.light' : 'primary.light',
                            position: 'relative',
                          }}
                        >
                          <Typography variant="body2">
                            {format(slot.startTime, 'HH:mm')} - {format(slot.endTime, 'HH:mm')}
                          </Typography>
                          <Typography variant="caption" display="block">
                            {slot.appointmentType} ({slot.slotDuration} min)
                          </Typography>
                          <Box sx={{ mt: 1 }}>
                            {slot.tags.slice(0, 2).map(tag => (
                              <Chip
                                key={tag}
                                label={tag}
                                size="small"
                                sx={{ mr: 0.5, mb: 0.5 }}
                              />
                            ))}
                            {slot.tags.length > 2 && (
                              <Chip
                                label={`+${slot.tags.length - 2}`}
                                size="small"
                                sx={{ mr: 0.5, mb: 0.5 }}
                              />
                            )}
                          </Box>
                          <Box sx={{ position: 'absolute', top: 8, right: 8 }}>
                            <IconButton
                              size="small"
                              onClick={() => handleOpenDialog(slot)}
                              disabled={slot.isBooked}
                            >
                              <Edit fontSize="small" />
                            </IconButton>
                            <IconButton
                              size="small"
                              onClick={() => handleSlotDelete(slot.id)}
                              disabled={slot.isBooked}
                            >
                              <Delete fontSize="small" />
                            </IconButton>
                          </Box>
                        </Box>
                      ))}
                    {slots.filter(slot => {
                      const dayOfWeek = format(slot.date, 'EEEE').toLowerCase();
                      return dayOfWeek === day.toLowerCase();
                    }).length === 0 && (
                      <Typography variant="body2" color="text.secondary">
                        No time slots defined for this day
                      </Typography>
                    )}
                  </Paper>
                </Box>
              ))}
          </Box>
        </Box>
      )}

      {activeTab === 2 && (
        <Box>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
            <Button
              variant="outlined"
              startIcon={<Add />}
              onClick={() => handleOpenDialog()}
            >
              Add Slot
            </Button>
          </Box>
          
          {slots.length === 0 ? (
            <Paper sx={{ p: 3, textAlign: 'center' }}>
              <Typography variant="body1">No availability slots defined yet</Typography>
              <Button
                variant="contained"
                startIcon={<Add />}
                onClick={() => handleOpenDialog()}
                sx={{ mt: 2 }}
              >
                Add Your First Slot
              </Button>
            </Paper>
          ) : (
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
              {slots.map(slot => (
                <Box 
                  key={slot.id} 
                  sx={{ 
                    flex: '1 1 calc(50% - 8px)',
                    minWidth: { xs: '100%', md: 'calc(50% - 8px)' } 
                  }}
                >
                  <Card>
                    <CardContent>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant="h6">
                          {format(slot.date, 'EEEE, MMMM d, yyyy')}
                        </Typography>
                        <Box>
                          <IconButton
                            size="small"
                            onClick={() => handleOpenDialog(slot)}
                            disabled={slot.isBooked}
                          >
                            <Edit />
                          </IconButton>
                          <IconButton
                            size="small"
                            onClick={() => handleSlotDelete(slot.id)}
                            disabled={slot.isBooked}
                          >
                            <Delete />
                          </IconButton>
                        </Box>
                      </Box>
                      
                      <Box sx={{ mt: 2 }}>
                        <Typography variant="body1">
                          {format(slot.startTime, 'HH:mm')} - {format(slot.endTime, 'HH:mm')} ({slot.timezone})
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {slot.appointmentType} • {slot.slotDuration} min slots • {slot.breakDuration} min breaks
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {slot.locationType === 'physical' ? `${slot.address} ${slot.room ? `(${slot.room})` : ''}` : 'Virtual Appointment'}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          ${slot.fee} {slot.currency} {slot.insuranceAccepted && '• Insurance Accepted'}
                        </Typography>
                        
                        <Box sx={{ mt: 1 }}>
                          {slot.tags.map(tag => (
                            <Chip
                              key={tag}
                              label={tag}
                              size="small"
                              sx={{ mr: 0.5, mb: 0.5 }}
                            />
                          ))}
                        </Box>
                        
                        {slot.isRecurring && (
                          <Chip
                            label={`Recurring ${slot.recurrenceType}`}
                            color="info"
                            size="small"
                            sx={{ mt: 1 }}
                          />
                        )}
                        
                        {slot.isBooked && (
                          <Chip
                            label="Booked"
                            color="error"
                            size="small"
                            sx={{ mt: 1, ml: 1 }}
                          />
                        )}
                      </Box>
                    </CardContent>
                  </Card>
                </Box>
              ))}
            </Box>
          )}
        </Box>
      )}

      <SlotDialog
        open={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onSubmit={(data) => {
          if (selectedSlot) {
            handleSlotUpdate({ ...data, id: selectedSlot.id, isBooked: selectedSlot.isBooked });
          } else {
            handleSlotCreate(data);
          }
        }}
        slot={selectedSlot || undefined}
        timezones={timezones}
        appointmentTypes={appointmentTypes}
        currencies={currencies}
        availableTags={availableTags}
      />
    </Box>
  );
}; 