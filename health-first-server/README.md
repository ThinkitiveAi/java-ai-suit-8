# Health First EMR System

A Spring Boot 3.2.5 backend for a healthcare provider management system.

## Features

- Provider registration with validation
- Email verification (simulated)
- Security with JWT authentication
- Rate limiting for API endpoints
- Comprehensive error handling
- API documentation with OpenAPI/Swagger

## Technology Stack

- Java 17
- Spring Boot 3.2.5
- Spring Security
- Spring Data JPA
- H2 Database (for development)
- JWT for authentication
- OpenAPI/Swagger for documentation

## Getting Started

### Prerequisites

- Java 17 or higher
- Maven

### Running the Application

1. Clone the repository
2. Navigate to the project directory
3. Run the application using Maven:

```bash
mvn spring-boot:run
```

The application will start on port 8080.

### API Documentation

Once the application is running, you can access the API documentation at:

```
http://localhost:8080/swagger-ui.html
```

## API Endpoints

### Provider Registration

**Endpoint:** `POST /api/v1/provider/register`

**Request Body:**
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john.doe@example.com",
  "phoneNumber": "1234567890",
  "password": "Password1!",
  "confirmPassword": "Password1!",
  "specialization": "Cardiology",
  "licenseNumber": "LIC12345",
  "licenseDocumentUrl": "https://example.com/license.pdf",
  "yearsOfExperience": 5,
  "clinicAddress": {
    "street": "123 Main St",
    "city": "Boston",
    "state": "MA",
    "zip": "02108"
  }
}
```

**Success Response (201 Created):**
```json
{
  "success": true,
  "message": "Provider registered successfully. Verification email sent.",
  "data": {
    "providerId": "uuid-here",
    "email": "john.doe@example.com",
    "verificationStatus": "PENDING"
  },
  "timestamp": "2023-06-01T12:00:00Z"
}
```

### Email Verification

**Endpoint:** `GET /api/v1/provider/verify?token=verification-token`

**Success Response (200 OK):**
```json
{
  "success": true,
  "message": "Email verification successful. You can now log in.",
  "timestamp": "2023-06-01T12:00:00Z"
}
```

## Testing

Run the tests using Maven:

```bash
mvn test
```

## Security

- Password hashing using BCrypt with salt rounds of 12
- Input sanitization for all fields
- Rate limiting (5 requests per IP/hour for registration)
- JWT authentication for protected endpoints 