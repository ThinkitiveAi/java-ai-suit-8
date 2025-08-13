import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { theme } from './theme';
import { ProviderLogin } from './components/ProviderLogin';
import { ProviderRegistration } from './components/ProviderRegistration';
import { PatientLogin } from './components/PatientLogin';
import { PatientRegistration } from './components/PatientRegistration';
import { ProviderAvailability } from './components/ProviderAvailability';
import { PatientSearch } from './components/PatientSearch';
import { UserTypeSelector } from './components/UserTypeSelector';
import { ProviderDashboard } from './components/ProviderDashboard';

function App() {
  const handleProviderLoginSuccess = () => {
    console.log('Provider login successful!');
    window.location.href = '/provider/dashboard';
  };

  const handleProviderForgotPassword = () => {
    console.log('Navigate to provider forgot password page');
    alert('Navigate to provider forgot password page');
  };

  const handleProviderRegistrationSuccess = () => {
    console.log('Provider registration successful!');
    alert('Provider registration successful! Please check your email for verification.');
  };

  const handlePatientLoginSuccess = () => {
    console.log('Patient login successful!');
    alert('Patient login successful! Redirecting to patient dashboard...');
  };

  const handlePatientForgotPassword = () => {
    console.log('Navigate to patient forgot password page');
    alert('Navigate to patient forgot password page');
  };

  const handlePatientRegistrationSuccess = () => {
    console.log('Patient registration successful!');
    alert('Patient registration successful! Please check your email for verification.');
  };

  const handleBackToProviderLogin = () => {
    window.location.href = '/provider/login';
  };

  const handleBackToPatientLogin = () => {
    window.location.href = '/patient/login';
  };

  const handleGoToProviderRegistration = () => {
    window.location.href = '/provider/register';
  };

  const handleGoToPatientRegistration = () => {
    window.location.href = '/patient/register';
  };

  const handleSelectProvider = () => {
    window.location.href = '/provider/login';
  };

  const handleSelectPatient = () => {
    window.location.href = '/patient/login';
  };

  const handleSlotCreated = (slot: any) => {
    console.log('Slot created:', slot);
    alert('Time slot created successfully!');
  };

  const handleSlotUpdated = (slot: any) => {
    console.log('Slot updated:', slot);
    alert('Time slot updated successfully!');
  };

  const handleSlotDeleted = (slotId: string) => {
    console.log('Slot deleted:', slotId);
    alert('Time slot deleted successfully!');
  };

  const handleBookingCreated = (booking: any) => {
    console.log('Booking created:', booking);
    alert('Appointment booked successfully! You will receive a confirmation email shortly.');
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Routes>
          {/* Main Landing Page */}
          <Route 
            path="/" 
            element={
              <UserTypeSelector
                onSelectProvider={handleSelectProvider}
                onSelectPatient={handleSelectPatient}
              />
            } 
          />

          {/* Provider Routes */}
          <Route 
            path="/provider/login" 
            element={
              <ProviderLogin
                onLoginSuccess={handleProviderLoginSuccess}
                onForgotPassword={handleProviderForgotPassword}
                onRegister={handleGoToProviderRegistration}
              />
            } 
          />
          <Route 
            path="/provider/register" 
            element={
              <ProviderRegistration
                onRegistrationSuccess={handleProviderRegistrationSuccess}
                onBackToLogin={handleBackToProviderLogin}
              />
            } 
          />
          <Route 
            path="/provider/availability" 
            element={
              <ProviderAvailability
                onSlotCreated={handleSlotCreated}
                onSlotUpdated={handleSlotUpdated}
                onSlotDeleted={handleSlotDeleted}
              />
            } 
          />
          <Route 
            path="/provider/dashboard" 
            element={<ProviderDashboard />} 
          />

          {/* Patient Routes */}
          <Route 
            path="/patient/login" 
            element={
              <PatientLogin
                onLoginSuccess={handlePatientLoginSuccess}
                onForgotPassword={handlePatientForgotPassword}
                onRegister={handleGoToPatientRegistration}
              />
            } 
          />
          <Route 
            path="/patient/register" 
            element={
              <PatientRegistration
                onRegistrationSuccess={handlePatientRegistrationSuccess}
                onBackToLogin={handleBackToPatientLogin}
              />
            } 
          />
          <Route 
            path="/patient/search" 
            element={
              <PatientSearch
                onBookingCreated={handleBookingCreated}
              />
            } 
          />

          {/* Legacy Routes - Redirect to main page */}
          <Route path="/login" element={<Navigate to="/" replace />} />
          <Route path="/register" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
