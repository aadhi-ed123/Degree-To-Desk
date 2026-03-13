# 🛠️ Setup and Installation Guide

Complete step-by-step guide to set up and run the Degree To Desk application.

## Prerequisites

Before you begin, ensure you have the following installed on your system:

- **Node.js** (v14.0.0 or higher) - [Download](https://nodejs.org/)
- **npm** (v6.0.0 or higher) - Comes with Node.js
- **Git** (optional, for cloning repository) - [Download](https://git-scm.com/)
- **Code Editor** (VS Code recommended) - [Download](https://code.visualstudio.com/)

### Verify Installation

Open your terminal/command prompt and verify installations:

```bash
# Check Node.js version
node --version

# Check npm version
npm --version

# Check Git version (if installed)
git --version
```

## Installation Steps

### Step 1: Clone or Download the Repository

**Option A: Using Git**
```bash
git clone https://github.com/aadhi-ed123/Degree-To-Desk.git
cd "Degree To Desk"
```

**Option B: Manual Download**
1. Download the ZIP file from GitHub
2. Extract the folder
3. Open terminal in the extracted folder

### Step 2: Navigate to Project Directory

```bash
cd "Degree To Desk"
```

On Windows with spaces in the path:
```bash
cd c:\Users\aadhi\OneDrive\Desktop\"Degree To Desk"
```

### Step 3: Install Dependencies

```bash
npm install
```

This command will:
- Read package.json
- Download all required packages
- Create a node_modules folder
- Generate package-lock.json

Expected packages installed:
- express
- sqlite3
- body-parser
- cors
- dotenv
- nodemailer
- multiparty

### Step 4: Create Environment Configuration

Create a `.env` file in the root directory:

```bash
# Windows PowerShell
New-Item .env

# Mac/Linux
touch .env
```

Add the following content to `.env`:

```env
# Server Configuration
PORT=3000
NODE_ENV=development

# Database Configuration
DATABASE_URL=./placement.db

# Email Service (if using Nodemailer)
EMAIL_SERVICE=gmail
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password

# API Configuration
API_TIMEOUT=30000
```

### Step 5: Initialize the Database

The database is created automatically when the server starts:

1. Delete `placement.db` if it exists (to start fresh)
2. Start the server (see Step 6)
3. The server will create tables and seed initial data

### Step 6: Start the Server

```bash
npm start
```

Expected output:
```
Connected to the SQLite database.
Seeding initial jobs...
Server running on port 3000
```

### Step 7: Access the Application

Open your web browser and navigate to:

```
http://localhost:3000
```

You should see the Degree To Desk landing page with:
- Navigation bar
- Companies grid
- Colleges statistics
- Skills section
- Login/Sign Up buttons

## Troubleshooting Installation

### Issue: `npm install` fails

**Solution 1: Clear npm cache**
```bash
npm cache clean --force
npm install
```

**Solution 2: Delete node_modules and try again**
```bash
# Windows
rmdir /s /q node_modules
del package-lock.json
npm install

# Mac/Linux
rm -rf node_modules
rm package-lock.json
npm install
```

**Solution 3: Use npm ci instead**
```bash
npm ci
```

### Issue: Port 3000 already in use

**Solution 1: Change port in .env**
```env
PORT=3001
```

**Solution 2: Kill process using port 3000**

Windows PowerShell:
```powershell
# Find process
netstat -ano | findstr :3000

# Kill process (replace PID with actual process ID)
taskkill /PID <PID> /F
```

Mac/Linux:
```bash
# Find and kill process
lsof -i :3000 | grep LISTEN | awk '{print $2}' | xargs kill -9
```

### Issue: SQLite3 installation fails

**Solution: Reinstall SQLite3**
```bash
npm install sqlite3 --build-from-source
```

### Issue: Module not found errors

**Solution: Verify all dependencies are installed**
```bash
npm list
```

This shows all installed packages. If any are missing, reinstall:
```bash
npm install
```

### Issue: CORS errors in browser

**Solution: Ensure server is running and accessible**
```bash
# Verify server is running on correct port
curl http://localhost:3000

# Check network connectivity
ping localhost
```

## Development Setup

### Install Development Dependencies (Optional)

For development and debugging:

```bash
npm install --save-dev nodemon
```

### Update package.json scripts

Add nodemon for auto-restart during development:

```json
"scripts": {
  "start": "node server.js",
  "dev": "nodemon server.js",
  "test": "echo \"Error: no test specified\" && exit 1"
}
```

### Run with Auto-Reload

```bash
npm run dev
```

## Database Operations

### Reset Database

To start fresh with a clean database:

```bash
# Delete existing database
rm placement.db

# Start server to recreate database
npm start
```

### Database Backup

```bash
# Create backup
cp placement.db placement.db.backup

# Restore from backup
cp placement.db.backup placement.db
```

### Inspect Database

Using SQLite CLI (if installed):

```bash
# Open database
sqlite3 placement.db

# View all tables
.tables

# View table schema
.schema jobs

# Exit
.quit
```

## Configuration

### environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| PORT | 3000 | Server port |
| NODE_ENV | development | Environment mode |
| DATABASE_URL | ./placement.db | Database file location |
| EMAIL_SERVICE | gmail | Email service provider |
| EMAIL_USER | - | Email account username |
| EMAIL_PASSWORD | - | Email account password |

### Modify Static File Directory

In `server.js`:
```javascript
// Current (serves from current directory)
app.use(express.static(__dirname));

// To serve from public folder
app.use(express.static(path.join(__dirname, 'public')));
```

## Production Deployment

### Prepare for Production

1. **Update .env**
```env
NODE_ENV=production
PORT=80
```

2. **Optimize dependencies**
```bash
npm install --only=production
npm prune
```

3. **Test build**
```bash
npm start
```

### Deploy Options

#### Option 1: Heroku

1. Install Heroku CLI
2. Create Procfile
3. Configure environment variables
4. Deploy:
   ```bash
   heroku create degree-to-desk
   git push heroku main
   ```

#### Option 2: AWS

Use EC2 or Elastic Beanstalk with Node.js support

#### Option 3: DigitalOcean

Deploy using App Platform or Droplet

## Updating the Project

### Pull Latest Updates

```bash
git pull origin main
npm install
```

### Update Dependencies

```bash
npm update
```

## Testing the Setup

### 1. Server Test
```bash
curl http://localhost:3000
```

### 2. API Test
```bash
curl http://localhost:3000/api/jobs
```

### 3. Database Test
- Login with test credentials
- Create new application
- Check data in database

## Uninstall/Cleanup

### Remove All Traces

```bash
# Delete node_modules
rm -rf node_modules

# Delete package-lock.json
rm package-lock.json

# Delete database
rm placement.db

# Delete .env
rm .env
```

## Next Steps

After successful installation:

1. **Update Configuration**: Modify `.env` with your actual email credentials
2. **Customize Content**: Update company logos and job descriptions
3. **Test Features**: Try login, job browsing, and applications
4. **Security Review**: Change default passwords and secret keys
5. **Deploy**: Follow production deployment guide

## Support & Help

For installation issues:

1. Check this troubleshooting section
2. Review error messages carefully
3. Check GitHub Issues: [Degree-To-Desk Issues](https://github.com/aadhi-ed123/Degree-To-Desk/issues)
4. Ensure all prerequisites are installed

---

**Setup Guide Version**: 1.0  
**Last Updated**: February 2026
