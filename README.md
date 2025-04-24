# GoHighLevel Contact Management Service

A Node.js web service for managing contacts in GoHighLevel (GHL) with VIP tagging functionality.

## Features

- Search for existing contacts by phone number
- Create new contacts with provided details
- Automatically tag contacts as VIP
- Input validation and sanitization
- Comprehensive error handling and logging
- Rate limiting and security headers

## Prerequisites

- Node.js >= 18.0.0
- GoHighLevel API credentials
  - API Key
  - Location ID

## Environment Variables

Copy `.env.example` to `.env` and configure:

```env
# Server Configuration
PORT=3000
NODE_ENV=development

# GoHighLevel API Configuration
GHL_API_KEY=your_api_key_here
GHL_LOCATION_ID=your_location_id_here
GHL_BASE_URL=https://rest.gohighlevel.com/v1

# Logging Configuration
LOG_LEVEL=info
```

## Installation

```bash
npm install
```

## Running the Service

Development mode:
```bash
npm run dev
```

Production mode:
```bash
npm start
```

## API Endpoints

### Manage Contact

```
GET /api/contacts
```

Query Parameters:
- `clientName`: Full name of the client (required)
- `phoneNumber`: Phone number without '+' prefix (required, e.g., "11234567890")

Response Format:
```json
{
  "status": "success",
  "message": "Contact found and tagged as VIP",
  "data": {
    "contact": {
      "id": "contact_id",
      "firstName": "John",
      "lastName": "Doe",
      "phone": "+11234567890"
    },
    "isNewContact": false
  }
}
```

## Error Handling

The service returns appropriate HTTP status codes:
- 400: Bad Request (invalid input)
- 429: Too Many Requests (rate limit exceeded)
- 500: Internal Server Error

## Deployment

The service is configured for deployment on Render. Required files:
- `render.yaml`: Service configuration
- `.dockerignore`: File exclusion list

Set the following environment variables in Render dashboard:
- `GHL_API_KEY`
- `GHL_LOCATION_ID`

## Health Check

```
GET /health
```

Returns service health status.