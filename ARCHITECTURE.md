# 🏗️ Architecture & System Design

Complete technical architecture documentation for Degree To Desk.

## System Overview

Degree To Desk follows a **client-server architecture** with a clear separation between frontend and backend:

```
┌─────────────────────────────────────────────────────────┐
│                    Browser (Client)                      │
│  ┌────────────────────────────────────────────────────┐  │
│  │  HTML (UI)  JavaScript (Logic)  CSS (Styling)     │  │
│  │                                                    │  │
│  │  - Job browsing                                   │  │
│  │  - Application submission                         │  │
│  │  - User authentication                            │  │
│  │  - Profile management                             │  │
│  └────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
                           ↕ HTTP/JSON
┌─────────────────────────────────────────────────────────┐
│                  Express Server (Backend)                │
│  ┌────────────────────────────────────────────────────┐  │
│  │  API Endpoints                                     │  │
│  │  - Jobs Management                                │  │
│  │  - Applications Management                        │  │
│  │  - User Authentication                            │  │
│  │  - Statistics & Reporting                         │  │
│  └────────────────────────────────────────────────────┘  │
│  ┌────────────────────────────────────────────────────┐  │
│  │  Middleware & Utilities                            │  │
│  │  - CORS Handler                                    │  │
│  │  - Body Parser                                     │  │
│  │  - Error Handling                                  │  │
│  │  - Email Service (Nodemailer)                      │  │
│  └────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
                           ↕
         ┌────────────────────────────────┐
         │     SQLite Database           │
         │  (placement.db)               │
         │                                │
         │  - Users Table                │
         │  - Jobs Table                 │
         │  - Applications Table         │
         └────────────────────────────────┘
```

## Architecture Layers

### 1. Presentation Layer (Frontend)

**Files**: `index.html`, `style.css`, `script.js`

**Components**:
- **HTML Structure**: Semantic markup with Tailwind CSS framework
- **CSS Styling**: Utility-first approach, responsive design
- **JavaScript Logic**: DOM manipulation, API communication, state management

**Key Responsibilities**:
- Render UI components
- Handle user interactions
- Communicate with backend API
- Manage client-side state via localStorage

**Technologies**:
- HTML5
- Tailwind CSS
- Vanilla JavaScript
- Font Awesome Icons

### 2. Application Layer (Backend API)

**Files**: `server.js`

**Components**:

#### API Routes
```javascript
// Jobs Management
GET    /api/jobs
GET    /api/jobs/:id
POST   /api/jobs
PUT    /api/jobs/:id
DELETE /api/jobs/:id

// Applications Management
GET    /api/applications
GET    /api/applications/:id
POST   /api/applications
PUT    /api/applications/:id
DELETE /api/applications/:id

// User Authentication
POST   /api/auth/register
POST   /api/auth/login

// User Profiles
GET    /api/users/:id
PUT    /api/users/:id
DELETE /api/users/:id
```

**Key Responsibilities**:
- Handle HTTP requests
- Validate input data
- Process business logic
- Communicate with database
- Return JSON responses

**Technologies**:
- Express.js
- Node.js
- body-parser middleware
- CORS middleware

### 3. Data Access Layer (Database)

**Database**: SQLite3

**Tables**:

#### Users Table
```sql
id (PK) | name | email (UNIQUE) | password | role | created_at
```

#### Jobs Table
```sql
id (PK) | company | title | type | salary | location | 
departments | skills | description | deadline | logo | posted
```

#### Applications Table
```sql
id (PK) | jobId (FK) | userId | name | email | phone | 
department | year | cgpa | backlogs | skills | coverLetter | 
resumeName | status | appliedDate
```

**Key Responsibilities**:
- Persist application data
- Enforce data integrity
- Provide efficient data retrieval
- Support transactions

**Technology**: SQLite3

## Data Flow Architecture

### Job Browsing Flow

```
1. User Opens Application
   ↓
2. JavaScript fetch() → GET /api/jobs
   ↓
3. Express processes request
   ↓
4. Query SQLite jobs table
   ↓
5. Return JSON array of jobs
   ↓
6. JavaScript renders HTML
   ↓
7. User sees job listings
```

### Application Submission Flow

```
1. User fills application form
   ↓
2. JavaScript validates input
   ↓
3. fetch() → POST /api/applications (JSON)
   ↓
4. Express receives and validates data
   ↓
5. Insert into applications table
   ↓
6. Send email confirmation (optional)
   ↓
7. Return success response
   ↓
8. JavaScript updates UI
   ↓
9. User sees confirmation message
```

### User Authentication Flow

```
1. User enters credentials
   ↓
2. JavaScript sends POST /api/auth/login
   ↓
3. Express queries users table
   ↓
4. Verify password
   ↓
5. Return user object
   ↓
6. JavaScript stores in localStorage
   ↓
7. Update navbar with user info
   ↓
8. Redirect to home page
```

## Component Interaction Diagram

```
┌─────────────────────────────────────────────────────────┐
│                      Browser Tab                         │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  ┌────────────────────────────────────────────────────┐ │
│  │           DOM / UI Components                      │ │
│  │  - Navigation Bar                                  │ │
│  │  - Job Cards                                       │ │
│  │  - Application Form                                │ │
│  │  - User Profile                                    │ │
│  └────────────────────────────────────────────────────┘ │
│         ↑↓ Manipulation & Rendering                     │
│  ┌────────────────────────────────────────────────────┐ │
│  │         JavaScript Event Handlers                  │ │
│  │  - Form submissions                                │ │
│  │  - Button clicks                                   │ │
│  │  - Page navigation                                 │ │
│  └────────────────────────────────────────────────────┘ │
│         ↑↓ Triggers & Updates                          │
│  ┌────────────────────────────────────────────────────┐ │
│  │        API Communication Layer                     │ │
│  │  - fetch() for GET requests                        │ │
│  │  - fetch() for POST/PUT/DELETE                     │ │
│  │  - JSON parsing & serialization                    │ │
│  └────────────────────────────────────────────────────┘ │
│         ↑↓ HTTP Requests/Responses                     │
└─────────────────────────────────────────────────────────┘
                           ↕
         HTTP (REST/JSON) Communication
                           ↕
┌─────────────────────────────────────────────────────────┐
│                   Express Server                         │
├─────────────────────────────────────────────────────────┤
│  ┌────────────────────────────────────────────────────┐ │
│  │           Request Router                           │ │
│  │  - Route matching                                  │ │
│  │  - Method validation (GET/POST/PUT/DELETE)        │ │
│  └────────────────────────────────────────────────────┘ │
│         ↓                                               │
│  ┌────────────────────────────────────────────────────┐ │
│  │         Middleware Stack                           │ │
│  │  - CORS handler                                    │ │
│  │  - Body parser                                     │ │
│  │  - Static file server                              │ │
│  │  - Error handler                                   │ │
│  └────────────────────────────────────────────────────┘ │
│         ↓                                               │
│  ┌────────────────────────────────────────────────────┐ │
│  │         Route Handlers                             │ │
│  │  - Jobs (CRUD operations)                          │ │
│  │  - Applications (CRUD operations)                  │ │
│  │  - Auth (register, login)                          │ │
│  │  - Users (profile management)                      │ │
│  └────────────────────────────────────────────────────┘ │
│         ↓                                               │
│  ┌────────────────────────────────────────────────────┐ │
│  │       Database Layer                               │ │
│  │  - SQLite3 queries                                 │ │
│  │  - Connection management                           │ │
│  │  - Transaction handling                            │ │
│  └────────────────────────────────────────────────────┘ │
│         ↓↑ SQL                                          │
└─────────────────────────────────────────────────────────┘
         ↓↑ Database Operations
┌─────────────────────────────────────────────────────────┐
│           SQLite Database File                          │
│  (placement.db)                                         │
│  - users table                                          │
│  - jobs table                                           │
│  - applications table                                   │
└─────────────────────────────────────────────────────────┘
```

## State Management Architecture

### Client-Side State (Frontend)

```javascript
// Global State Variables
var currentUser = null;              // Current authenticated user
var jobs = [];                       // All job listings
var applications = [];               // User's applications
var users = [];                      // Admin: All users
var chatHistory = [];                // Chat messages
var isChatbotOpen = false;          // UI state

// Persistent Storage
localStorage.setItem('currentUser', JSON.stringify(user));
const user = JSON.parse(localStorage.getItem('currentUser'));
```

**State Flow**:
```
User Action
    ↓
Event Handler
    ↓
API Request
    ↓
Response Processing
    ↓
State Update
    ↓
DOM Re-render
```

### Server-Side State (Backend)

```javascript
const db = new sqlite3.Database('./placement.db');

// Database represents persistent state
// Express session handles temporary state
// No in-memory state for scalability
```

## Middleware Stack

### Express Middleware Chain

```
HTTP Request
    ↓
1. CORS Middleware (cors)
   - Handles cross-origin requests
   - Sets headers
    ↓
2. Body Parser Middleware (body-parser)
   - Parses JSON request bodies
   - Parses URL-encoded data
    ↓
3. Static File Server (express.static)
   - Serves HTML, CSS, JS
   - Serves static assets
    ↓
4. Route Handler
   - Processes specific endpoint
   - Validates input
   - Query database
    ↓
5. Error Handler
   - Catches errors
   - Sends error response
    ↓
HTTP Response
```

## Database Design Principles

### Normalization
- **First Normal Form (1NF)**: Atomic values, no repeating groups
- **Second Normal Form (2NF)**: No partial dependencies
- **Third Normal Form (3NF)**: No transitive dependencies

### Data Integrity
```sql
-- Primary Keys
CREATE TABLE users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  ...
);

-- Foreign Keys
CREATE TABLE applications (
  jobId INTEGER NOT NULL,
  FOREIGN KEY (jobId) REFERENCES jobs (id)
);

-- Unique Constraints
CREATE TABLE users (
  email TEXT UNIQUE NOT NULL,
  ...
);

-- Default Values
CREATE TABLE applications (
  status TEXT DEFAULT 'pending',
  ...
);
```

### Performance Optimization
```sql
-- Indexes for frequent queries
CREATE INDEX idx_user_email ON users(email);
CREATE INDEX idx_job_company ON jobs(company);
CREATE INDEX idx_app_status ON applications(status);

-- Query optimization
SELECT * FROM jobs WHERE type = ? LIMIT 10;
```

## Security Architecture

### Input Validation
```javascript
// Frontend validation
- Email format validation
- Required field checks
- Data type validation

// Backend validation
- Re-validate all inputs
- Sanitize strings
- Type checking
```

### Authentication
```javascript
// Current Implementation
- localStorage for session storage
- Email + password authentication

// Recommended Enhancements
- JWT tokens
- HTTP-only cookies
- Password hashing (bcrypt)
- Two-factor authentication
```

### Data Protection
```javascript
// CORS
- Allow specific origins
- Restrict HTTP methods
- Validate headers

// HTTPS
- Encrypt data in transit
- SSL/TLS certificates
- Redirect HTTP to HTTPS
```

## Scalability Considerations

### Horizontal Scaling
```
Load Balancer
    ↓
┌───────────────────────┐
│ Server Instance 1     │
└───────────────────────┘
┌───────────────────────┐
│ Server Instance 2     │
└───────────────────────┘
┌───────────────────────┐
│ Server Instance N     │
└───────────────────────┘
    ↓
Shared Database
(PostgreSQL/MySQL)
```

### Vertical Scaling
- Increase server resources (CPU, RAM)
- Optimize database queries
- Implement caching

### Database Migration Path
```
SQLite (Development)
    ↓
PostgreSQL (Production)
- Better concurrency
- ACID compliance
- Scaling capabilities
```

## Deployment Architecture

### Development Environment
```
Laptop/Computer
├── Node.js (v14+)
├── npm
├── SQLite3
└── Port 3000
```

### Production Environment
```
Cloud Server (AWS/GCP/Azure)
├── Node.js Runtime
├── Process Manager (PM2)
├── Nginx (Reverse Proxy)
├── PostgreSQL Database
├── Redis (Caching)
├── SSL/TLS Certificates
└── Port 443 (HTTPS)
```

### Docker Containerization
```dockerfile
FROM node:14-alpine
WORKDIR /app
COPY package.json .
RUN npm install --only=production
COPY . .
EXPOSE 3000
CMD ["node", "server.js"]
```

## API Architecture

### REST Principles
```
Resource-based URLs
/api/jobs
/api/jobs/:id
/api/applications
/api/applications/:id

HTTP Methods
GET     - Retrieve resource
POST    - Create resource
PUT     - Update resource
DELETE  - Delete resource

HTTP Status Codes
200 - OK
201 - Created
400 - Bad Request
401 - Unauthorized
403 - Forbidden
404 - Not Found
500 - Internal Server Error
```

### Response Format
```json
{
  "success": true,
  "data": {...},
  "message": "Operation successful",
  "error": null
}
```

## Error Handling Architecture

### Frontend Error Handling
```javascript
try {
  const response = await fetch('/api/jobs');
  if (!response.ok) throw new Error('API Error');
  const data = await response.json();
  // Process data
} catch (error) {
  console.error(error);
  showErrorMessage('Failed to load jobs');
}
```

### Backend Error Handling
```javascript
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    error: 'Internal server error'
  });
});
```

## Testing Architecture

### Unit Testing
- Test individual functions
- Mock database calls
- Validate business logic

### Integration Testing
- Test API endpoints
- Database operations
- External services

### E2E Testing
- Test complete user workflows
- Browser compatibility
- Performance metrics

## Monitoring & Logging

### Server Logs
```javascript
console.log('Event description');
console.error('Error occurred');
console.warn('Warning message');
```

### Performance Monitoring
- Response time tracking
- Database query performance
- Memory usage
- CPU utilization

### Error Tracking
- Exception logging
- Stack trace collection
- Error categorization

---

**Architecture Documentation Version**: 1.0  
**Last Updated**: February 2026
