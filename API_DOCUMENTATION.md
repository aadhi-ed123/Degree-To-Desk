# 📡 API Documentation

Complete API reference for Degree To Desk backend endpoints.

## Base URL

```
http://localhost:3000
```

## Authentication

Currently, authentication is session-based using localStorage on the client side.

## Response Format

All API responses are in JSON format:

```json
{
  "success": true,
  "data": {},
  "message": "Success message",
  "error": null
}
```

---

## 🏢 Jobs Endpoints

### Get All Jobs

Retrieve all job listings.

**Endpoint**: `GET /api/jobs`

**Parameters**: None

**Response** (200 OK):
```json
[
  {
    "id": 1,
    "company": "Google",
    "title": "Software Engineer Intern",
    "type": "internship",
    "salary": "₹80,000/month",
    "location": "Bangalore",
    "departments": ["CSE", "IT", "ECE"],
    "skills": ["Python", "Data Structures", "Algorithms"],
    "description": "Join Google's engineering team...",
    "deadline": "2024-03-15",
    "logo": "fab fa-google",
    "posted": "2024-01-15"
  }
]
```

**Example Request**:
```bash
curl http://localhost:3000/api/jobs
```

---

### Get Job by ID

Retrieve specific job details.

**Endpoint**: `GET /api/jobs/:id`

**Parameters**:
| Name | Type | Required | Description |
|------|------|----------|-------------|
| id | integer | Yes | Job ID |

**Response** (200 OK):
```json
{
  "id": 1,
  "company": "Google",
  "title": "Software Engineer Intern",
  "type": "internship",
  "salary": "₹80,000/month",
  "location": "Bangalore",
  "departments": ["CSE", "IT", "ECE"],
  "skills": ["Python", "Data Structures", "Algorithms"],
  "description": "Join Google's engineering team...",
  "deadline": "2024-03-15",
  "logo": "fab fa-google",
  "posted": "2024-01-15"
}
```

**Error Response** (404 Not Found):
```json
{
  "success": false,
  "error": "Job not found"
}
```

**Example Request**:
```bash
curl http://localhost:3000/api/jobs/1
```

---

### Create Job (Admin)

Create a new job posting.

**Endpoint**: `POST /api/jobs`

**Headers**:
```
Content-Type: application/json
```

**Request Body**:
```json
{
  "company": "Google",
  "title": "Software Engineer Intern",
  "type": "internship",
  "salary": "₹80,000/month",
  "location": "Bangalore",
  "departments": ["CSE", "IT", "ECE"],
  "skills": ["Python", "Data Structures"],
  "description": "Join Google's engineering team...",
  "deadline": "2024-03-15",
  "logo": "fab fa-google"
}
```

**Response** (201 Created):
```json
{
  "success": true,
  "message": "Job created successfully",
  "jobId": 10
}
```

**Example Request**:
```bash
curl -X POST http://localhost:3000/api/jobs \
  -H "Content-Type: application/json" \
  -d '{
    "company": "Google",
    "title": "Software Engineer Intern",
    "type": "internship",
    "salary": "₹80,000/month",
    "location": "Bangalore",
    "departments": ["CSE", "IT", "ECE"],
    "skills": ["Python", "Data Structures"],
    "description": "Join Google engineering team",
    "deadline": "2024-03-15",
    "logo": "fab fa-google"
  }'
```

---

### Update Job (Admin)

Update an existing job posting.

**Endpoint**: `PUT /api/jobs/:id`

**Parameters**:
| Name | Type | Required | Description |
|------|------|----------|-------------|
| id | integer | Yes | Job ID |

**Request Body**: Same as Create Job (only include fields to update)

**Response** (200 OK):
```json
{
  "success": true,
  "message": "Job updated successfully"
}
```

**Example Request**:
```bash
curl -X PUT http://localhost:3000/api/jobs/1 \
  -H "Content-Type: application/json" \
  -d '{
    "salary": "₹100,000/month"
  }'
```

---

### Delete Job (Admin)

Delete a job posting.

**Endpoint**: `DELETE /api/jobs/:id`

**Parameters**:
| Name | Type | Required | Description |
|------|------|----------|-------------|
| id | integer | Yes | Job ID |

**Response** (200 OK):
```json
{
  "success": true,
  "message": "Job deleted successfully"
}
```

**Example Request**:
```bash
curl -X DELETE http://localhost:3000/api/jobs/1
```

---

## 📋 Applications Endpoints

### Get All Applications

Retrieve all applications (with filters).

**Endpoint**: `GET /api/applications`

**Query Parameters**:
| Name | Type | Description |
|------|------|-------------|
| userId | string | Filter by user email |
| jobId | integer | Filter by job ID |
| status | string | Filter by status (pending, accepted, rejected) |

**Response** (200 OK):
```json
[
  {
    "id": 1,
    "jobId": 1,
    "userId": "student@example.com",
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "+91-9876543210",
    "department": "CSE",
    "year": "3",
    "cgpa": "8.5",
    "backlogs": "0",
    "skills": ["Python", "JavaScript"],
    "coverLetter": "I'm interested in this position...",
    "resumeName": "john_resume.pdf",
    "status": "pending",
    "appliedDate": "2024-01-20"
  }
]
```

**Example Request**:
```bash
# Get all applications
curl http://localhost:3000/api/applications

# Get applications for specific job
curl "http://localhost:3000/api/applications?jobId=1"

# Get applications with specific status
curl "http://localhost:3000/api/applications?status=pending"
```

---

### Get Application by ID

Retrieve specific application details.

**Endpoint**: `GET /api/applications/:id`

**Parameters**:
| Name | Type | Required | Description |
|------|------|----------|-------------|
| id | integer | Yes | Application ID |

**Response** (200 OK):
```json
{
  "id": 1,
  "jobId": 1,
  "userId": "student@example.com",
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "+91-9876543210",
  "department": "CSE",
  "year": "3",
  "cgpa": "8.5",
  "backlogs": "0",
  "skills": ["Python", "JavaScript"],
  "coverLetter": "I'm interested in this position...",
  "resumeName": "john_resume.pdf",
  "status": "pending",
  "appliedDate": "2024-01-20"
}
```

**Example Request**:
```bash
curl http://localhost:3000/api/applications/1
```

---

### Submit Application

Submit a new job application.

**Endpoint**: `POST /api/applications`

**Headers**:
```
Content-Type: application/json
```

**Request Body**:
```json
{
  "jobId": 1,
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "+91-9876543210",
  "department": "CSE",
  "year": "3",
  "cgpa": "8.5",
  "backlogs": "0",
  "skills": ["Python", "JavaScript"],
  "coverLetter": "I'm interested in this position...",
  "resumeName": "john_resume.pdf"
}
```

**Response** (201 Created):
```json
{
  "success": true,
  "message": "Application submitted successfully",
  "applicationId": 15
}
```

**Error Response** (400 Bad Request):
```json
{
  "success": false,
  "error": "All required fields must be filled"
}
```

**Example Request**:
```bash
curl -X POST http://localhost:3000/api/applications \
  -H "Content-Type: application/json" \
  -d '{
    "jobId": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "+91-9876543210",
    "department": "CSE",
    "year": "3",
    "cgpa": "8.5",
    "backlogs": "0",
    "skills": ["Python", "JavaScript"],
    "coverLetter": "I am interested in this position",
    "resumeName": "john_resume.pdf"
  }'
```

---

### Update Application Status (Admin)

Update application status.

**Endpoint**: `PUT /api/applications/:id`

**Parameters**:
| Name | Type | Required | Description |
|------|------|----------|-------------|
| id | integer | Yes | Application ID |

**Request Body**:
```json
{
  "status": "accepted"
}
```

**Valid Status Values**: `pending`, `accepted`, `rejected`

**Response** (200 OK):
```json
{
  "success": true,
  "message": "Application status updated successfully"
}
```

**Example Request**:
```bash
curl -X PUT http://localhost:3000/api/applications/1 \
  -H "Content-Type: application/json" \
  -d '{
    "status": "accepted"
  }'
```

---

### Delete Application

Delete an application.

**Endpoint**: `DELETE /api/applications/:id`

**Parameters**:
| Name | Type | Required | Description |
|------|------|----------|-------------|
| id | integer | Yes | Application ID |

**Response** (200 OK):
```json
{
  "success": true,
  "message": "Application deleted successfully"
}
```

**Example Request**:
```bash
curl -X DELETE http://localhost:3000/api/applications/1
```

---

## 👥 Users Endpoints

### Register User

Create a new user account.

**Endpoint**: `POST /api/auth/register`

**Headers**:
```
Content-Type: application/json
```

**Request Body**:
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "SecurePassword123",
  "role": "student"
}
```

**Response** (201 Created):
```json
{
  "success": true,
  "message": "User registered successfully",
  "userId": 5
}
```

**Error Response** (400 Bad Request):
```json
{
  "success": false,
  "error": "Email already exists"
}
```

**Example Request**:
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "SecurePassword123",
    "role": "student"
  }'
```

---

### Login User

Authenticate user and get session.

**Endpoint**: `POST /api/auth/login`

**Headers**:
```
Content-Type: application/json
```

**Request Body**:
```json
{
  "email": "john@example.com",
  "password": "SecurePassword123"
}
```

**Response** (200 OK):
```json
{
  "success": true,
  "message": "Login successful",
  "user": {
    "id": 5,
    "name": "John Doe",
    "email": "john@example.com",
    "role": "student"
  }
}
```

**Error Response** (401 Unauthorized):
```json
{
  "success": false,
  "error": "Invalid email or password"
}
```

**Example Request**:
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "SecurePassword123"
  }'
```

---

### Get User Profile

Retrieve user profile information.

**Endpoint**: `GET /api/users/:id`

**Parameters**:
| Name | Type | Required | Description |
|------|------|----------|-------------|
| id | integer | Yes | User ID |

**Response** (200 OK):
```json
{
  "id": 5,
  "name": "John Doe",
  "email": "john@example.com",
  "role": "student",
  "createdDate": "2024-01-01"
}
```

**Example Request**:
```bash
curl http://localhost:3000/api/users/5
```

---

### Update User Profile

Update user information.

**Endpoint**: `PUT /api/users/:id`

**Parameters**:
| Name | Type | Required | Description |
|------|------|----------|-------------|
| id | integer | Yes | User ID |

**Request Body**:
```json
{
  "name": "John Smith",
  "email": "john.smith@example.com"
}
```

**Response** (200 OK):
```json
{
  "success": true,
  "message": "User profile updated successfully"
}
```

**Example Request**:
```bash
curl -X PUT http://localhost:3000/api/users/5 \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Smith",
    "email": "john.smith@example.com"
  }'
```

---

### Delete User Account

Delete a user account.

**Endpoint**: `DELETE /api/users/:id`

**Parameters**:
| Name | Type | Required | Description |
|------|------|----------|-------------|
| id | integer | Yes | User ID |

**Response** (200 OK):
```json
{
  "success": true,
  "message": "User account deleted successfully"
}
```

**Example Request**:
```bash
curl -X DELETE http://localhost:3000/api/users/5
```

---

## 📊 Statistics Endpoints

### Get Placement Statistics

Get overall placement statistics.

**Endpoint**: `GET /api/statistics/placements`

**Response** (200 OK):
```json
{
  "totalApplications": 150,
  "acceptedApplications": 45,
  "rejectedApplications": 30,
  "pendingApplications": 75,
  "acceptanceRate": "30%",
  "topCompanies": [
    {
      "company": "Google",
      "acceptances": 15
    },
    {
      "company": "Microsoft",
      "acceptances": 12
    }
  ]
}
```

**Example Request**:
```bash
curl http://localhost:3000/api/statistics/placements
```

---

### Get Company Statistics

Get statistics by company.

**Endpoint**: `GET /api/statistics/companies`

**Response** (200 OK):
```json
[
  {
    "company": "Google",
    "totalApplications": 50,
    "positions": 5,
    "acceptances": 15
  },
  {
    "company": "Microsoft",
    "totalApplications": 40,
    "positions": 4,
    "acceptances": 12
  }
]
```

**Example Request**:
```bash
curl http://localhost:3000/api/statistics/companies
```

---

## 🔍 Search & Filter Endpoints

### Search Jobs

Search jobs by criteria.

**Endpoint**: `GET /api/jobs/search`

**Query Parameters**:
| Name | Type | Description |
|------|------|-------------|
| company | string | Company name |
| title | string | Job title |
| location | string | Job location |
| type | string | Job type (internship, fulltime, etc.) |
| minSalary | string | Minimum salary |
| maxSalary | string | Maximum salary |

**Example Request**:
```bash
# Search for internships in Bangalore
curl "http://localhost:3000/api/jobs/search?location=Bangalore&type=internship"

# Search by company
curl "http://localhost:3000/api/jobs/search?company=Google"
```

---

## ❌ Error Responses

### 400 Bad Request
```json
{
  "success": false,
  "error": "Invalid request parameters"
}
```

### 401 Unauthorized
```json
{
  "success": false,
  "error": "Authentication required"
}
```

### 403 Forbidden
```json
{
  "success": false,
  "error": "Insufficient permissions"
}
```

### 404 Not Found
```json
{
  "success": false,
  "error": "Resource not found"
}
```

### 500 Internal Server Error
```json
{
  "success": false,
  "error": "Internal server error"
}
```

---

## 📈 Rate Limiting

No rate limiting is currently implemented. For production, consider implementing:
- IP-based rate limiting
- User-based rate limiting
- Endpoint-specific limits

---

## 🔐 CORS Headers

Responses include CORS headers:
```
Access-Control-Allow-Origin: *
Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS
Access-Control-Allow-Headers: Content-Type
```

---

## 📝 Testing API with cURL

### Test All Endpoints Script

```bash
#!/bin/bash

BASE_URL="http://localhost:3000"

# Test Jobs
echo "Testing GET /api/jobs"
curl $BASE_URL/api/jobs

echo "\nTesting GET /api/jobs/1"
curl $BASE_URL/api/jobs/1

# Test Applications
echo "\nTesting GET /api/applications"
curl $BASE_URL/api/applications
```

---

## 🧪 Testing with Postman

1. Import API into Postman
2. Create environment variables:
   - `base_url` = `http://localhost:3000`
   - `jobId` = `1`
   - `applicationId` = `1`

3. Use variables in requests: `{{base_url}}/api/jobs`

---

**API Documentation Version**: 1.0  
**Last Updated**: February 2026
