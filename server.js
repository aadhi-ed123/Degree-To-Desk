const express = require('express');
require('dotenv').config(); // Load environment variables
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(__dirname)); // Serve static files from current directory

// Database Setup
const db = new sqlite3.Database('./placement.db', (err) => {
    if (err) {
        console.error('Error opening database:', err.message);
    } else {
        console.log('Connected to the SQLite database.');
        initializeTables();
    }
});

function initializeTables() {
    db.serialize(() => {
        // Users Table
        db.run(`CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            email TEXT UNIQUE NOT NULL,
            password TEXT NOT NULL,
            role TEXT NOT NULL
        )`);

        // Jobs Table
        db.run(`CREATE TABLE IF NOT EXISTS jobs (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            company TEXT NOT NULL,
            title TEXT NOT NULL,
            type TEXT NOT NULL,
            salary TEXT NOT NULL,
            location TEXT NOT NULL,
            departments TEXT NOT NULL, -- Stored as JSON string
            skills TEXT NOT NULL,      -- Stored as JSON string
            description TEXT NOT NULL,
            deadline TEXT NOT NULL,
            logo TEXT,
            posted TEXT NOT NULL
        )`, (err) => {
            if (!err) {
                checkAndSeedJobs();
            }
        });

        // Applications Table
        db.run(`CREATE TABLE IF NOT EXISTS applications (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            jobId INTEGER NOT NULL,
            userId TEXT NOT NULL, -- Email of the user
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
        )`);
    });
}

function checkAndSeedJobs() {
    db.get("SELECT count(*) as count FROM jobs", (err, row) => {
        if (err) return console.error(err.message);
        if (row.count === 0) {
            console.log("Seeding initial jobs...");
            const defaultJobs = [
                {
                    company: "Google",
                    title: "Software Engineer Intern",
                    type: "internship",
                    salary: "₹80,000/month",
                    location: "Bangalore",
                    departments: ["CSE", "IT", "ECE"],
                    skills: ["Python", "Data Structures", "Algorithms"],
                    description: "Join Google's engineering team and work on cutting-edge projects that impact millions of users worldwide.",
                    deadline: "2024-03-15",
                    logo: "fab fa-google",
                    posted: "2024-01-15"
                },
                {
                    company: "Microsoft",
                    title: "Full Stack Developer",
                    type: "job",
                    salary: "₹15-20 LPA",
                    location: "Hyderabad",
                    departments: ["CSE", "IT"],
                    skills: ["React", "Node.js", "Azure"],
                    description: "Build next-generation applications using Microsoft's cloud technologies and modern frameworks.",
                    deadline: "2024-03-20",
                    logo: "fab fa-microsoft",
                    posted: "2024-01-10"
                },
                {
                    company: "Amazon",
                    title: "SDE Intern",
                    type: "internship",
                    salary: "₹60,000/month",
                    location: "Chennai",
                    departments: ["CSE", "IT", "ECE"],
                    skills: ["Java", "AWS", "System Design"],
                    description: "Experience working at scale with Amazon's world-class infrastructure and delivery systems.",
                    deadline: "2024-03-25",
                    logo: "fab fa-amazon",
                    posted: "2024-01-12"
                }
            ];

            const stmt = db.prepare(`INSERT INTO jobs (company, title, type, salary, location, departments, skills, description, deadline, logo, posted) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`);
            defaultJobs.forEach(job => {
                stmt.run(
                    job.company,
                    job.title,
                    job.type,
                    job.salary,
                    job.location,
                    JSON.stringify(job.departments),
                    JSON.stringify(job.skills),
                    job.description,
                    job.deadline,
                    job.logo,
                    job.posted
                );
            });
            stmt.finalize();
            console.log("Jobs seeded.");
        }
    });
}

// API Endpoints

// Login
app.post('/api/login', (req, res) => {
    const { email, password, role } = req.body;
    db.get("SELECT * FROM users WHERE email = ? AND password = ? AND role = ?", [email, password, role], (err, row) => {
        if (err) return res.status(500).json({ error: err.message });
        if (row) {
            res.json(row);
        } else {
            res.status(401).json({ error: "Invalid credentials" });
        }
    });
});

// Signup
app.post('/api/signup', (req, res) => {
    const { name, email, password, role } = req.body;
    db.run("INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)", [name, email, password, role], function (err) {
        if (err) {
            if (err.message.includes('UNIQUE constraint failed')) {
                return res.status(400).json({ error: "Email already exists" });
            }
            return res.status(500).json({ error: err.message });
        }
        res.json({ id: this.lastID, name, email, role });
    });
});

// Get Jobs
app.get('/api/jobs', (req, res) => {
    db.all("SELECT * FROM jobs ORDER BY id DESC", [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        // Parse JSON fields
        const jobs = rows.map(job => ({
            ...job,
            departments: JSON.parse(job.departments || '[]'),
            skills: JSON.parse(job.skills || '[]')
        }));
        res.json(jobs);
    });
});

// Post Job
app.post('/api/jobs', (req, res) => {
    const job = req.body;
    db.run(`INSERT INTO jobs (company, title, type, salary, location, departments, skills, description, deadline, logo, posted) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [job.company, job.title, job.type, job.salary, job.location, JSON.stringify(job.departments), JSON.stringify(job.skills), job.description, job.deadline, job.logo, job.posted],
        function (err) {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ id: this.lastID, ...job });
        }
    );
});

// Delete Job
app.delete('/api/jobs/:id', (req, res) => {
    const id = req.params.id;
    db.run("DELETE FROM jobs WHERE id = ?", id, function (err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: "Deleted", changes: this.changes });
    });
});

// Get Applications
app.get('/api/applications', (req, res) => {
    db.all("SELECT * FROM applications ORDER BY id DESC", [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

// Submit Application
app.post('/api/applications', (req, res) => {
    const appData = req.body;
    db.run(`INSERT INTO applications (jobId, userId, name, email, phone, department, year, cgpa, backlogs, skills, coverLetter, resumeName, status, appliedDate) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [appData.jobId, appData.userId, appData.name, appData.email, appData.phone, appData.department, appData.year, appData.cgpa, appData.backlogs, appData.skills, appData.coverLetter, appData.resumeName, appData.status, appData.appliedDate],
        function (err) {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ id: this.lastID, ...appData });
        }
    );
});

// Update Application Status
app.put('/api/applications/:id/status', (req, res) => {
    const { status } = req.body;
    const id = req.params.id;
    db.run("UPDATE applications SET status = ? WHERE id = ?", [status, id], function (err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: "Updated", changes: this.changes });
    });
});

// Chatbot Endpoint (Mock)
app.post('/api/chat', (req, res) => {
    // Simple echo for now, or use the logic from script.js on server side
    const { message } = req.body;
    // ... logic ...
    res.json({ reply: "I am the server chatbot. I received: " + message });
});

// Email Transporter Setup
// Email Transporter Setup
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// Verify connection configuration
transporter.verify(function (error, success) {
    if (error) {
        console.log("==================================================================");
        console.log("⚠️  EMAIL NOT CONFIGURED YET (or credentials are wrong)");
        console.log("   To send real emails:");
        console.log("   1. Open server.js");
        console.log("   2. Go to line ~255");
        console.log("   3. Enter your real Gmail address and App Password");
        console.log("   Error details:", error.message);
        console.log("==================================================================");
    } else {
        console.log("✅ Email Service Configured Successfully! Ready to send.");
    }
});

// Email Endpoint (Generic)
app.post('/api/send-email', (req, res) => {
    if (!transporter) return res.status(500).json({ error: "Email system not initialized yet" });

    const { to, subject, text, html } = req.body;
    const mailOptions = {
        from: '"DegreeToDesk" <no-reply@degreetodesk.com>',
        to,
        subject,
        text,
        html
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error("Email error:", error);
            return res.status(500).json({ error: error.message });
        }
        const previewUrl = nodemailer.getTestMessageUrl(info);
        console.log("Preview URL: %s", previewUrl);
        res.json({ message: 'Email sent successfully', info: info.response, previewUrl });
    });
});

// Notify All Students Endpoint
app.post('/api/notify-job', (req, res) => {
    if (!transporter) return res.status(500).json({ error: "Email system not initialized yet" });

    const job = req.body;

    // Get all student emails
    db.all("SELECT email FROM users WHERE role = 'student'", [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });

        const emails = rows.map(row => row.email);

        if (emails.length === 0) {
            return res.json({ message: "No students to notify" });
        }

        const mailOptions = {
            from: '"DegreeToDesk Portal" <jobs@degreetodesk.com>',
            to: emails,
            subject: `New Opportunity: ${job.title} at ${job.company}`,
            html: `
                <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #ddd; border-radius: 10px; max-width: 600px; margin: auto;">
                    <h2 style="color: #6b21a8;">New Job Alert! 🚀</h2>
                    <p>Hello,</p>
                    <p>A new exciting opportunity has been posted on the portal.</p>
                    <div style="background-color: #f3f4f6; padding: 15px; border-radius: 8px; margin: 15px 0;">
                        <h3 style="margin: 0; color: #1f2937;">${job.title}</h3>
                        <p style="margin: 5px 0; color: #4b5563;"><strong>${job.company}</strong></p>
                        <hr style="border: 0; border-top: 1px solid #e5e7eb; margin: 10px 0;">
                        <ul style="list-style-type: none; padding: 0; margin: 0; line-height: 1.6;">
                            <li>📍 <strong>Location:</strong> ${job.location}</li>
                            <li>💰 <strong>Salary:</strong> ${job.salary}</li>
                            <li>📅 <strong>Deadline:</strong> ${job.deadline}</li>
                        </ul>
                    </div>
                    <p style="text-align: center; margin-top: 25px;">
                        <a href="http://localhost:3000" style="background-color: #6b21a8; color: white; padding: 12px 25px; text-decoration: none; border-radius: 30px; font-weight: bold; display: inline-block;">Apply Now</a>
                    </p>
                    <p style="text-align: center; color: #9ca3af; font-size: 12px; margin-top: 20px;">
                        DegreeToDesk Placement Portal
                    </p>
                </div>
            `
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error("Notification error:", error);
                return res.json({ message: "Job posted but email failed to send", error: error.message });
            }

            const previewUrl = nodemailer.getTestMessageUrl(info);
            console.log("------------------------------------------");
            console.log("📨 Notification Sent!");
            console.log("   Message ID:", info.messageId);
            console.log("   Preview URL:", previewUrl);
            console.log("------------------------------------------");

            res.json({ message: 'Notifications sent to ' + emails.length + ' students', previewUrl });
        });
    });
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
    console.log(`SQLite database is located at ./placement.db`);
    console.log(`You can use 'DB Browser for SQLite' to view 'placement.db'`);
});
