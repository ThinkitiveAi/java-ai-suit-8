import React, { useState, useEffect } from 'react';
import {
  Box, Card, CardContent, Typography, Button, Tabs, Tab, Avatar,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, Chip, IconButton, Rating, Divider, Dialog, DialogTitle, DialogContent,
} from '@mui/material';
import {
  Person, CalendarToday, AccessTime, LocationOn, Phone, Email,
  Edit, Delete, Add, Visibility, Star, Event,
} from '@mui/icons-material';
import { format } from 'date-fns';
import { ProviderAvailability } from './ProviderAvailability';

interface Patient {
  id: string;
  name: string;
  email: string;
  phone: string;
  lastVisit: Date;
  nextAppointment?: Date;
  medicalHistory: string[];
  insuranceProvider?: string;
  status: 'Active' | 'Pending' | 'Inactive';
}

interface Provider {
  id: string;
  name: string;
  specialization: string;
  experience: number;
  rating: number;
  reviewCount: number;
  availability: {
    days: string[];
    hours: string;
  };
  status: 'Available' | 'Busy' | 'Off';
  upcomingAppointments: number;
  avatar: string;
}

interface Appointment {
  id: string;
  patientName: string;
  patientId: string;
  date: Date;
  time: string;
  type: string;
  status: 'Scheduled' | 'Completed' | 'Cancelled';
  notes?: string;
}

export const ProviderDashboard = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [providers, setProviders] = useState<Provider[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isAvailabilityModalOpen, setIsAvailabilityModalOpen] = useState(false);
  const [selectedProviderId, setSelectedProviderId] = useState<string | null>(null);

  // Mock data for demonstration
  useEffect(() => {
    // Mock patients data
    const mockPatients: Patient[] = [
      {
        id: '1',
        name: 'John Smith',
        email: 'john@example.com',
        phone: '+1-555-123-4567',
        lastVisit: new Date('2024-01-10'),
        nextAppointment: new Date('2024-01-25'),
        medicalHistory: ['Hypertension', 'Diabetes'],
        insuranceProvider: 'Blue Cross',
        status: 'Active',
      },
      {
        id: '2',
        name: 'Sarah Johnson',
        email: 'sarah@example.com',
        phone: '+1-555-234-5678',
        lastVisit: new Date('2024-01-15'),
        medicalHistory: ['Asthma'],
        insuranceProvider: 'Aetna',
        status: 'Active',
      },
      {
        id: '3',
        name: 'Michael Brown',
        email: 'michael@example.com',
        phone: '+1-555-345-6789',
        lastVisit: new Date('2024-01-05'),
        nextAppointment: new Date('2024-01-30'),
        medicalHistory: ['Arthritis'],
        status: 'Pending',
      },
    ];

    // Mock providers data
    const mockProviders: Provider[] = [
      {
        id: '1',
        name: 'Dr. Emily Wilson',
        specialization: 'Cardiology',
        experience: 12,
        rating: 4.8,
        reviewCount: 156,
        availability: {
          days: ['Monday', 'Wednesday', 'Friday'],
          hours: '9:00 AM - 5:00 PM',
        },
        status: 'Available',
        upcomingAppointments: 5,
        avatar: '/avatars/doctor1.jpg',
      },
      {
        id: '2',
        name: 'Dr. James Martinez',
        specialization: 'Pediatrics',
        experience: 8,
        rating: 4.9,
        reviewCount: 123,
        availability: {
          days: ['Tuesday', 'Thursday'],
          hours: '10:00 AM - 6:00 PM',
        },
        status: 'Busy',
        upcomingAppointments: 3,
        avatar: '/avatars/doctor2.jpg',
      },
      {
        id: '3',
        name: 'Dr. Lisa Chen',
        specialization: 'Dermatology',
        experience: 15,
        rating: 4.7,
        reviewCount: 189,
        availability: {
          days: ['Monday', 'Tuesday', 'Thursday'],
          hours: '8:00 AM - 4:00 PM',
        },
        status: 'Available',
        upcomingAppointments: 4,
        avatar: '/avatars/doctor3.jpg',
      },
    ];

    // Mock appointments data
    const mockAppointments: Appointment[] = [
      {
        id: '1',
        patientName: 'John Smith',
        patientId: '1',
        date: new Date('2024-01-25'),
        time: '10:00 AM',
        type: 'Follow-up',
        status: 'Scheduled',
        notes: 'Blood pressure check',
      },
      {
        id: '2',
        patientName: 'Sarah Johnson',
        patientId: '2',
        date: new Date('2024-01-20'),
        time: '2:30 PM',
        type: 'Consultation',
        status: 'Completed',
        notes: 'Annual check-up',
      },
      {
        id: '3',
        patientName: 'Michael Brown',
        patientId: '3',
        date: new Date('2024-01-30'),
        time: '11:15 AM',
        type: 'New Patient',
        status: 'Scheduled',
      },
    ];

    setPatients(mockPatients);
    setProviders(mockProviders);
    setAppointments(mockAppointments);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active':
      case 'Available':
      case 'Scheduled':
        return 'success';
      case 'Pending':
      case 'Busy':
        return 'warning';
      case 'Inactive':
      case 'Off':
      case 'Cancelled':
        return 'error';
      default:
        return 'default';
    }
  };

  const handleOpenAvailabilityModal = (providerId: string) => {
    setSelectedProviderId(providerId);
    setIsAvailabilityModalOpen(true);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Provider Dashboard
      </Typography>

      {/* Quick Stats */}
      <Box sx={{ display: 'flex', gap: 2, mb: 4 }}>
        <Card sx={{ flex: 1 }}>
          <CardContent>
            <Typography color="text.secondary" gutterBottom>
              Total Patients
            </Typography>
            <Typography variant="h4">
              {patients.length}
            </Typography>
          </CardContent>
        </Card>
        <Card sx={{ flex: 1 }}>
          <CardContent>
            <Typography color="text.secondary" gutterBottom>
              Active Providers
            </Typography>
            <Typography variant="h4">
              {providers.filter(p => p.status === 'Available').length}
            </Typography>
          </CardContent>
        </Card>
        <Card sx={{ flex: 1 }}>
          <CardContent>
            <Typography color="text.secondary" gutterBottom>
              Today's Appointments
            </Typography>
            <Typography variant="h4">
              {appointments.filter(a => 
                format(a.date, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd')
              ).length}
            </Typography>
          </CardContent>
        </Card>
      </Box>

      <Tabs value={activeTab} onChange={(_, newValue) => setActiveTab(newValue)} sx={{ mb: 3 }}>
        <Tab label="Patients" />
        <Tab label="Providers" />
        <Tab label="Appointments" />
        <Tab label="Availability" />
      </Tabs>

      {/* Patients Tab */}
      {activeTab === 0 && (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Contact</TableCell>
                <TableCell>Last Visit</TableCell>
                <TableCell>Next Appointment</TableCell>
                <TableCell>Medical History</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {patients.map((patient) => (
                <TableRow key={patient.id}>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Avatar sx={{ mr: 2 }}>
                        <Person />
                      </Avatar>
                      {patient.name}
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box>
                      <Typography variant="body2">
                        <Email fontSize="small" sx={{ mr: 1, verticalAlign: 'middle' }} />
                        {patient.email}
                      </Typography>
                      <Typography variant="body2">
                        <Phone fontSize="small" sx={{ mr: 1, verticalAlign: 'middle' }} />
                        {patient.phone}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>{format(patient.lastVisit, 'MMM dd, yyyy')}</TableCell>
                  <TableCell>
                    {patient.nextAppointment ? format(patient.nextAppointment, 'MMM dd, yyyy') : '-'}
                  </TableCell>
                  <TableCell>
                    {patient.medicalHistory.map((condition) => (
                      <Chip key={condition} label={condition} size="small" sx={{ mr: 0.5, mb: 0.5 }} />
                    ))}
                  </TableCell>
                  <TableCell>
                    <Chip label={patient.status} color={getStatusColor(patient.status)} size="small" />
                  </TableCell>
                  <TableCell>
                    <IconButton size="small" onClick={() => {}}>
                      <Visibility />
                    </IconButton>
                    <IconButton size="small" onClick={() => {}}>
                      <Edit />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Providers Tab */}
      {activeTab === 1 && (
        <Box>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
            <Button 
              variant="contained" 
              startIcon={<CalendarToday />}
              onClick={() => handleOpenAvailabilityModal('current-provider-id')}
            >
              Set Availability
            </Button>
          </Box>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
            {providers.map((provider) => (
              <Card key={provider.id} sx={{ width: 350 }}>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
                    <Avatar src={provider.avatar} sx={{ width: 60, height: 60, mr: 2 }}>
                      <Person />
                    </Avatar>
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="h6">{provider.name}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        {provider.specialization} • {provider.experience} years
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
                        <Rating value={provider.rating} readOnly size="small" />
                        <Typography variant="body2" sx={{ ml: 1 }}>
                          ({provider.reviewCount})
                        </Typography>
                      </Box>
                    </Box>
                  </Box>

                  <Divider sx={{ my: 2 }} />

                  <Typography variant="body2" sx={{ mb: 1 }}>
                    <CalendarToday fontSize="small" sx={{ mr: 1, verticalAlign: 'middle' }} />
                    {provider.availability.days.join(', ')}
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    <AccessTime fontSize="small" sx={{ mr: 1, verticalAlign: 'middle' }} />
                    {provider.availability.hours}
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 2 }}>
                    <Event fontSize="small" sx={{ mr: 1, verticalAlign: 'middle' }} />
                    {provider.upcomingAppointments} upcoming appointments
                  </Typography>

                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Chip
                      label={provider.status}
                      color={getStatusColor(provider.status)}
                      size="small"
                    />
                    <Box>
                      <IconButton size="small" onClick={() => {}}>
                        <Edit />
                      </IconButton>
                      <IconButton 
                        size="small" 
                        onClick={() => handleOpenAvailabilityModal(provider.id)}
                      >
                        <CalendarToday />
                      </IconButton>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            ))}
          </Box>
        </Box>
      )}

      {/* Appointments Tab */}
      {activeTab === 2 && (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Patient</TableCell>
                <TableCell>Date & Time</TableCell>
                <TableCell>Type</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Notes</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {appointments.map((appointment) => (
                <TableRow key={appointment.id}>
                  <TableCell>{appointment.patientName}</TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {format(appointment.date, 'MMM dd, yyyy')}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {appointment.time}
                    </Typography>
                  </TableCell>
                  <TableCell>{appointment.type}</TableCell>
                  <TableCell>
                    <Chip
                      label={appointment.status}
                      color={getStatusColor(appointment.status)}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>{appointment.notes || '-'}</TableCell>
                  <TableCell>
                    <IconButton size="small" onClick={() => {}}>
                      <Edit />
                    </IconButton>
                    <IconButton size="small" onClick={() => {}}>
                      <Delete />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Availability Tab */}
      {activeTab === 3 && (
        <Box>
          <ProviderAvailability providerId="current-provider-id" />
        </Box>
      )}

      {/* Availability Modal */}
      <Dialog 
        open={isAvailabilityModalOpen} 
        onClose={() => setIsAvailabilityModalOpen(false)}
        maxWidth="lg"
        fullWidth
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6">Manage Provider Availability</Typography>
            <Button onClick={() => setIsAvailabilityModalOpen(false)}>Close</Button>
          </Box>
        </DialogTitle>
        <DialogContent>
          <ProviderAvailability providerId={selectedProviderId || undefined} />
        </DialogContent>
      </Dialog>
    </Box>
  );
}; 