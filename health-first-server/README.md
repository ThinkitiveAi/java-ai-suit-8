# Health First Server

A comprehensive healthcare backend module with JWT authentication, user registration, and provider availability management.

## Features

- **Authentication & Authorization**
  - JWT-based authentication
  - Role-based access control (Provider, Patient)
  - Secure password storage

- **User Management**
  - Provider registration and login
  - Patient registration and login
  - User profile management

- **Provider Availability**
  - Create, read, update, delete availability slots
  - Recurring availability patterns (daily, weekly, monthly)
  - Advanced search capabilities

## Tech Stack

- Java 17
- Spring Boot 3.x
- Spring Security
- Spring Data JPA
- H2 Database (in-memory)
- JWT Authentication
- Lombok
- MapStruct
- Validation API

## API Endpoints

### Authentication

- `POST /api/v1/auth/provider-register` - Register a new provider
- `POST /api/v1/auth/patient-register` - Register a new patient
- `POST /api/v1/auth/provider-login` - Login as provider
- `POST /api/v1/auth/patient-login` - Login as patient

### Provider Availability

- `POST /api/v1/provider/{providerId}/availability` - Create availability
- `POST /api/v1/provider/{providerId}/availability/recurring` - Create recurring availability
- `GET /api/v1/provider/{providerId}/availability` - Get provider's availability
- `GET /api/v1/availability/{id}` - Get availability by ID
- `PUT /api/v1/provider/availability/{id}` - Update availability
- `DELETE /api/v1/provider/availability/{id}` - Delete availability
- `DELETE /api/v1/provider/availability/{id}/recurring` - Delete recurring availability

### Availability Search

- `GET /api/v1/availability/search` - Search availabilities with filters
- `GET /api/v1/availability/search/specialization/{specialization}` - Search by specialization
- `GET /api/v1/availability/search/appointment-type/{appointmentType}` - Search by appointment type

## Getting Started

1. Clone the repository
2. Build the project: `./mvnw clean install`
3. Run the application: `./mvnw spring-boot:run`
4. Access the API at `http://localhost:8080`
5. Access H2 console at `http://localhost:8080/h2-console` (JDBC URL: `jdbc:h2:mem:healthfirstdb`, Username: `sa`, Password: empty)

## Security

- All endpoints except authentication endpoints require JWT authentication
- Provider-specific endpoints require PROVIDER role
- Patient-specific endpoints require PATIENT role
- JWT tokens expire after 24 hours 