import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Button,
  Typography,
  Container,
} from '@mui/material';
import {
  LocalHospital,
  Person,
  MedicalServices,
} from '@mui/icons-material';

interface UserTypeSelectorProps {
  onSelectProvider?: () => void;
  onSelectPatient?: () => void;
}

export const UserTypeSelector: React.FC<UserTypeSelectorProps> = ({
  onSelectProvider,
  onSelectPatient,
}) => {
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
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
            <LocalHospital sx={{ fontSize: 40, color: 'primary.main', mr: 1 }} />
            <Typography variant="h1" color="primary.main" sx={{ fontSize: '2rem', fontWeight: 700 }}>
              Health First
            </Typography>
          </Box>
          <Typography variant="h2" color="text.primary" gutterBottom>
            Welcome to Health First
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Choose your account type to continue
          </Typography>
        </Box>

        {/* User Type Selection */}
        <Card sx={{ 
          width: '100%', 
          maxWidth: 500,
          borderRadius: 3,
          boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
          border: '1px solid #e2e8f0',
        }}>
          <CardContent sx={{ p: 4 }}>
            <Typography variant="h6" sx={{ mb: 4, textAlign: 'center' }}>
              Select Account Type
            </Typography>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              {/* Provider Option */}
              <Button
                variant="outlined"
                size="large"
                onClick={onSelectProvider}
                sx={{
                  py: 3,
                  px: 4,
                  borderColor: '#2563eb',
                  color: '#2563eb',
                  '&:hover': {
                    borderColor: '#1d4ed8',
                    backgroundColor: '#f8fafc',
                  },
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                  <MedicalServices sx={{ fontSize: 32, mr: 2, color: '#2563eb' }} />
                  <Box sx={{ textAlign: 'left', flex: 1 }}>
                    <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5 }}>
                      Healthcare Provider
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Doctors, nurses, and medical staff
                    </Typography>
                  </Box>
                </Box>
              </Button>

              {/* Patient Option */}
              <Button
                variant="outlined"
                size="large"
                onClick={onSelectPatient}
                sx={{
                  py: 3,
                  px: 4,
                  borderColor: '#059669',
                  color: '#059669',
                  '&:hover': {
                    borderColor: '#047857',
                    backgroundColor: '#f0fdf4',
                  },
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                  <Person sx={{ fontSize: 32, mr: 2, color: '#059669' }} />
                  <Box sx={{ textAlign: 'left', flex: 1 }}>
                    <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5 }}>
                      Patient
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Access your health information and services
                    </Typography>
                  </Box>
                </Box>
              </Button>
            </Box>

            <Box sx={{ textAlign: 'center', mt: 4 }}>
              <Typography variant="body2" color="text.secondary">
                Need help? Contact our support team
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </Box>
    </Container>
  );
}; 