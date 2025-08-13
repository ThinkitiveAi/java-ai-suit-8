# HealthFirst - Provider Dashboard & Availability Management

A comprehensive healthcare platform built with React, TypeScript, and Material UI that enables healthcare providers to manage their profiles, patients, appointments, and availability.

## Features

### Provider Dashboard
- Overview of patients, providers, and appointments
- Quick stats for total patients, active providers, and today's appointments
- Tabbed interface for easy navigation

### Provider Availability Management
- **Calendar View**: Interactive weekly/monthly calendar to view, add, update, or delete available time slots
- **Weekly Schedule**: Weekday availability selector with checkboxes for Mon-Sun
- **List View**: Comprehensive list of all availability slots with detailed information

### Availability Slot Management
- **Slot Creation Form**:
  - Date picker
  - Start/End Time (HH:mm, 24-hour format)
  - Timezone selection
  - Recurrence options (daily/weekly/monthly with end date)
  - Slot & break duration
  - Max appointments per slot
  - Appointment type selection
  - Location details (physical/virtual/hybrid)
  - Pricing information (fee, currency, insurance acceptance)
  - Notes & special requirements (tags)

### Validation & Security
- Time conflict detection (overlapping slots)
- Start time must be before end time
- Slot and break duration limits
- Location required for physical visit types
- Recurring slots require an end date
- Prevention of slot edits/deletions if appointments already booked

### UX Features
- Responsive layout (adapts to all screen sizes)
- Weekly/monthly toggle for calendar view
- Color-coded slots by type and booking status
- Real-time validation feedback
- Conflict warnings

## Technical Stack

- **React**: UI framework
- **TypeScript**: Type safety
- **Material UI**: Component library
- **React Hook Form**: Form validation and state management
- **Yup**: Schema-based form validation
- **date-fns**: Date manipulation and formatting

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```
3. Start the development server:
   ```
   npm run dev
   ```

## Project Structure

```
src/
├── components/
│   ├── ProviderDashboard.tsx       # Main dashboard component
│   ├── ProviderAvailability.tsx    # Availability management component
│   ├── ProviderAvailabilityCalendar.tsx  # Calendar view component
│   ├── SlotDialog.tsx              # Slot creation/edit dialog
│   └── ... other components
├── theme.ts                        # MUI theme configuration
└── App.tsx                         # Main application component
```

## Usage

1. Navigate to the Provider Dashboard
2. Click on the "Availability" tab or "Set Availability" button
3. Use the calendar view to visualize your schedule
4. Click "Add Slot" to create a new availability slot
5. Fill in the required information and save
6. Edit or delete slots as needed

## Future Enhancements

- Integration with backend API for persistent data storage
- Patient booking interface
- Notification system for booking confirmations
- Advanced recurrence patterns
- Timezone conversion for international patients
- Calendar export/import functionality
