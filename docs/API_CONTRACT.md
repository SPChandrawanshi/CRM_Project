# API Contract - WhatsApp Multi-Channel CRM

## Base URL
`http://localhost:5000/api`

## Authentication
All protected routes require a Bearer Token in the `Authorization` header.
- `POST /auth/login`: Authenticate user and receive JWT.
- `POST /auth/register`: Register a new user account.

## Core Resource Endpoints

### Leads
- `GET /leads`: Fetch a list of leads (paginated).
- `GET /leads/:id`: Get detailed information for a specific lead.
- `POST /leads`: Manually add a new lead.
- `PATCH /leads/:id`: Update lead status or details.

### Messages & Inbox
- `GET /messages`: Retrieve message history for a conversation.
- `POST /messages/send`: Send a WhatsApp message.
- `GET /channels`: List connected WhatsApp channels.

### Dashboard & Analytics
- `GET /dashboard/stats`: Retrieve KPI summary data for the current user role.
- `GET /analytics/performance`: (Admin/Manager) Get team or counselor performance metrics.

### Configuration
- `GET /routing/rules`: Fetch current lead routing logic.
- `POST /routing/rules`: Update routing rules (Admin only).
- `GET /templates`: List approved message templates.

## Response Format
The API follows a consistent JSON response structure:

```json
{
  "success": true,
  "data": { ... },
  "message": "Optional descriptive message"
}
```

## Error Handling
In case of failure, the API returns:
- `400 Bad Request`: Validation errors.
- `401 Unauthorized`: Missing or invalid token.
- `403 Forbidden`: Insufficient permissions (Role-based).
- `404 Not Found`: Resource does not exist.
- `500 Internal Server Error`: Backend crash or database failure.
