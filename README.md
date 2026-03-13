# 🎓 Degree To Desk

A comprehensive placement portal web application that connects students with internship and job opportunities. The platform provides a user-friendly interface for browsing job listings, managing applications, and tracking placement statistics.

## 📋 Overview

**Degree To Desk** is a full-stack web application designed to facilitate the placement process for students. It offers a centralized platform where students can discover job opportunities, submit applications, and track their application status. The platform also provides insights into top companies and colleges with placement data.

## ✨ Features

- **Job Portal**: Browse and filter job listings from top companies
- **User Authentication**: Secure login and registration system
- **Application Management**: Submit and track job applications
- **User Profiles**: Manage student information and qualifications
- **Companies Dashboard**: View available opportunities by company
- **Statistics**: Track placement statistics across colleges
- **Skills Matching**: View required skills for different positions
- **Responsive Design**: Mobile-friendly interface for all devices
- **Email Notifications**: Contact through integrated email system
- **Admin Panel**: Manage users and job postings

## 🛠️ Tech Stack

### Frontend
- **HTML5** - Semantic markup and structure
- **Tailwind CSS** - Utility-first CSS framework
- **JavaScript** - Interactive frontend logic and API communication
- **Font Awesome** - Icon library

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **SQLite3** - Lightweight database
- **Nodemailer** - Email service integration

### Key Dependencies
```json
{
  "express": "^5.2.1",
  "sqlite3": "^5.1.7",
  "body-parser": "^2.2.2",
  "cors": "^2.8.6",
  "dotenv": "^17.3.1",
  "nodemailer": "^8.0.1",
  "multiparty": "^4.2.3"
}
```

## 📁 Project Structure

```
Degree To Desk/
├── index.html           # Main HTML file (single-page application)
├── style.css            # Custom CSS styles
├── script.js            # Frontend JavaScript logic
├── server.js            # Backend Express server
├── package.json         # Project dependencies and scripts
├── placement.db         # SQLite database (auto-created)
└── README.md            # Project documentation
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm (Node Package Manager)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/aadhi-ed123/Degree-To-Desk.git
   cd Degree\ To\ Desk
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env` file in the root directory:
   ```env
   PORT=3000
   # Add other environment variables as needed
   ```

4. **Start the server**
   ```bash
   npm start
   ```

5. **Open in browser**
   Navigate to `http://localhost:3000`

## 📖 Usage

### For Students
1. Register or login with your credentials
2. Browse available job postings in the portal
3. Filter jobs by company, type, and location
4. View detailed job descriptions and requirements
5. Submit applications with your resume and cover letter
6. Track application status from your profile

### For Administrators
1. Login with admin credentials
2. Manage job postings (create, update, delete)
3. Review student applications
4. Update application status (pending, accepted, rejected)
5. View placement statistics

## 🗄️ Database Schema

### Users Table
```sql
CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    role TEXT NOT NULL
)
```

### Jobs Table
```sql
CREATE TABLE jobs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    company TEXT NOT NULL,
    title TEXT NOT NULL,
    type TEXT NOT NULL,
    salary TEXT NOT NULL,
    location TEXT NOT NULL,
    departments TEXT NOT NULL,
    skills TEXT NOT NULL,
    description TEXT NOT NULL,
    deadline TEXT NOT NULL,
    logo TEXT,
    posted TEXT NOT NULL
)
```

### Applications Table
```sql
CREATE TABLE applications (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    jobId INTEGER NOT NULL,
    userId TEXT NOT NULL,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    department TEXT,
    year TEXT,
    cgpa TEXT,
    backlogs TEXT,
    skills TEXT,
    coverLetter TEXT,
    resumeName TEXT,
    status TEXT DEFAULT 'pending',
    appliedDate TEXT,
    FOREIGN KEY (jobId) REFERENCES jobs (id)
)
```

## 🔌 API Endpoints

### Jobs
- `GET /api/jobs` - Retrieve all job listings
- `GET /api/jobs/:id` - Get specific job details
- `POST /api/jobs` - Create new job posting (Admin)
- `PUT /api/jobs/:id` - Update job posting (Admin)
- `DELETE /api/jobs/:id` - Delete job posting (Admin)

### Applications
- `GET /api/applications` - Get user's applications
- `POST /api/applications` - Submit new application
- `GET /api/applications/:id` - Get application details
- `PUT /api/applications/:id` - Update application status (Admin)

### Users
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/users/:id` - Get user profile
- `PUT /api/users/:id` - Update user profile

## 🔐 Security Features

- Environment variable management with `dotenv`
- CORS enabled for cross-origin requests
- Password-based authentication
- Session management via localStorage
- Unique email constraint on users table

## 🎨 Styling

The application uses **Tailwind CSS** for styling with a gradient color scheme:
- Primary Color: Purple gradient
- Responsive breakpoints for mobile, tablet, and desktop
- Smooth transitions and hover effects
- Card-based layout design

## 📦 Building for Production

To prepare the application for production:

1. Minimize CSS and JavaScript files
2. Set `NODE_ENV=production`
3. Configure appropriate environment variables
4. Ensure database backups are in place
5. Set up HTTPS certificates

```bash
export NODE_ENV=production
npm start
```

## 🐛 Troubleshooting

### Database Connection Issues
- Ensure SQLite3 is properly installed: `npm install sqlite3`
- Check database file permissions

### Port Already in Use
- Change the port in `.env` file
- Or kill the process using the port: `lsof -i :3000`

### CORS Errors
- Verify CORS middleware is enabled in server.js
- Check frontend API endpoint URLs

## 📝 Environment Variables

Create a `.env` file with the following variables:

```env
PORT=3000
NODE_ENV=development
DATABASE_URL=./placement.db
```

## 🤝 Contributing

Contributions are welcome! Please follow these steps:
1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Submit a pull request

## 📄 License

This project is licensed under the ISC License - see the package.json file for details.

## 👨‍💻 Author

**Aadhi**
- GitHub: [@aadhi-ed123](https://github.com/aadhi-ed123)
- Repository: [Degree-To-Desk](https://github.com/aadhi-ed123/Degree-To-Desk)

## 📧 Contact & Support

For issues, bug reports, or suggestions:
- Open an issue on [GitHub Issues](https://github.com/aadhi-ed123/Degree-To-Desk/issues)
- Check existing documentation and FAQ

## 🎯 Future Enhancements

- [ ] Advanced filtering and search capabilities
- [ ] Resume parser and skill matching algorithm
- [ ] Email notifications for new job postings
- [ ] Interview scheduling system
- [ ] Analytics dashboard for placement trends
- [ ] Two-factor authentication
- [ ] Interview preparation resources
- [ ] Placement timeline tracker

---

**Last Updated**: February 2026
