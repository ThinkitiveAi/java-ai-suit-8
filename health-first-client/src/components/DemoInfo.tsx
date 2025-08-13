import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Chip,
} from '@mui/material';
import {
  CheckCircle,
  Security,
  Accessibility,
  Phone,
  Lock,
} from '@mui/icons-material';

export const DemoInfo: React.FC = () => {
  return (
    <Card sx={{ maxWidth: 600, mx: 'auto', mt: 4, mb: 4 }}>
      <CardContent>
        <Typography variant="h5" gutterBottom color="primary.main">
          🏥 MedCare Provider Login - Demo
        </Typography>
        
        <Typography variant="body1" sx={{ mb: 3 }}>
          This is a fully functional Provider Login UI built with React, TypeScript, and Material-UI.
        </Typography>

        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            ✨ Features Implemented:
          </Typography>
          <List dense>
            <ListItem>
              <ListItemIcon>
                <CheckCircle color="success" />
              </ListItemIcon>
              <ListItemText primary="Responsive design with medical theme" />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <Phone color="primary" />
              </ListItemIcon>
              <ListItemText primary="Email or phone number input with format detection" />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <Lock color="primary" />
              </ListItemIcon>
              <ListItemText primary="Password field with show/hide toggle" />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <Security color="primary" />
              </ListItemIcon>
              <ListItemText primary="Real-time form validation" />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <Accessibility color="primary" />
              </ListItemIcon>
              <ListItemText primary="Full accessibility support" />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <CheckCircle color="success" />
              </ListItemIcon>
              <ListItemText primary="Loading states and error handling" />
            </ListItem>
          </List>
        </Box>

        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            🧪 Test the Features:
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            <Chip label="Try: doctor@medcare.com" color="primary" variant="outlined" />
            <Chip label="Try: +1-555-123-4567" color="primary" variant="outlined" />
            <Chip label="Password: min 6 chars" color="secondary" variant="outlined" />
            <Chip label="Click 'Remember Me'" color="secondary" variant="outlined" />
            <Chip label="Test validation errors" color="error" variant="outlined" />
          </Box>
        </Box>

        <Typography variant="body2" color="text.secondary">
          <strong>Note:</strong> This is a demo application. The login simulation takes 2 seconds to complete.
          In a real application, this would connect to your authentication API.
        </Typography>
      </CardContent>
    </Card>
  );
}; 