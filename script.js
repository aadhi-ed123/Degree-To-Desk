// Initialize Data
/* Changing let to var to ensure global access from other scripts/modules */
var currentUser = JSON.parse(localStorage.getItem('currentUser')) || null;
var users = []; // Fetched only if needed (admin)
var jobs = [];
var applications = [];
var chatHistory = [];
var isChatbotOpen = false;

// Default Data
// Default jobs are now seeded on the server side.

const companies = [
    { name: "Google", logo: "fab fa-google", openings: 25, type: "Tech Giant" },
    { name: "Microsoft", logo: "fab fa-microsoft", openings: 30, type: "Tech Giant" },
    { name: "Amazon", logo: "fab fa-amazon", openings: 45, type: "E-commerce" },
    { name: "Apple", logo: "fab fa-apple", openings: 15, type: "Tech Giant" },
    { name: "Meta", logo: "fab fa-facebook", openings: 20, type: "Social Media" },
    { name: "Netflix", logo: "fas fa-film", openings: 10, type: "Entertainment" }
];

const colleges = [
    { name: "IIT Bombay", placements: 98, avgPackage: "₹25 LPA" },
    { name: "IIT Delhi", placements: 97, avgPackage: "₹24 LPA" },
    { name: "BITS Pilani", placements: 95, avgPackage: "₹18 LPA" },
    { name: "NIT Trichy", placements: 92, avgPackage: "₹14 LPA" }
];

const skills = ["Python", "JavaScript", "Java", "React", "Node.js", "SQL", "Machine Learning", "Data Science", "Cloud Computing", "DevOps", "System Design", "C++"];

// Initialize on load
document.addEventListener('DOMContentLoaded', function () {
    initializeApp();
});

async function initializeApp() {
    try {
        const jobsRes = await fetch('/api/jobs');
        jobs = await jobsRes.json();

        if (currentUser) {
            const appsRes = await fetch('/api/applications');
            applications = await appsRes.json();
        }
    } catch (e) {
        console.error("Error loading data", e);
    }

    renderCompanies();
    renderColleges();
    renderSkills();
    renderJobs();
    updateAuthUI();
    setupFormHandlers();
}

// Render Functions
function renderCompanies() {
    const grid = document.getElementById('companiesGrid');
    grid.innerHTML = companies.map(company => `
        <div class="bg-white rounded-xl shadow-lg p-6 card-hover">
            <div class="flex items-center space-x-4 mb-4">
                <div class="w-14 h-14 gradient-bg rounded-full flex items-center justify-center">
                    <i class="${company.logo} text-white text-2xl"></i>
                </div>
                <div>
                    <h3 class="text-xl font-bold text-gray-800">${company.name}</h3>
                    <p class="text-gray-500">${company.type}</p>
                </div>
            </div>
            <div class="flex justify-between items-center">
                <span class="bg-green-100 text-green-600 px-3 py-1 rounded-full text-sm font-semibold">${company.openings} Openings</span>
                <button onclick="showPage('portal')" class="text-purple-600 font-semibold hover:text-purple-800">View Jobs →</button>
            </div>
        </div>
    `).join('');
}

function renderColleges() {
    const grid = document.getElementById('collegesGrid');
    grid.innerHTML = colleges.map(college => `
        <div class="bg-white rounded-xl shadow-lg p-6 card-hover text-center">
            <div class="w-16 h-16 gradient-bg rounded-full flex items-center justify-center mx-auto mb-4">
                <i class="fas fa-university text-white text-2xl"></i>
            </div>
            <h3 class="text-lg font-bold text-gray-800 mb-2">${college.name}</h3>
            <p class="text-green-600 font-semibold">${college.placements}% Placed</p>
            <p class="text-gray-500 text-sm">Avg: ${college.avgPackage}</p>
        </div>
    `).join('');
}

function renderSkills() {
    const grid = document.getElementById('skillsGrid');
    grid.innerHTML = skills.map(skill => `
        <span class="bg-white/20 px-6 py-3 rounded-full font-semibold hover:bg-white/30 transition cursor-default">${skill}</span>
    `).join('');
}

function renderJobs() {
    const grid = document.getElementById('jobsGrid');
    const filterType = document.getElementById('filterType')?.value || 'all';
    const filterDept = document.getElementById('filterDept')?.value || 'all';

    let filteredJobs = jobs.filter(job => {
        const typeMatch = filterType === 'all' || job.type === filterType;
        const deptMatch = filterDept === 'all' || job.departments.includes(filterDept);
        return typeMatch && deptMatch;
    });

    if (filteredJobs.length === 0) {
        grid.innerHTML = '<div class="col-span-full text-center py-10 text-gray-500"><i class="fas fa-search text-4xl mb-4"></i><p>No jobs found matching your criteria</p></div>';
        return;
    }

    grid.innerHTML = filteredJobs.map(job => `
        <div class="bg-white rounded-xl shadow-lg overflow-hidden card-hover">
            <div class="p-6">
                <div class="flex justify-between items-start mb-4">
                    <div class="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                        <i class="fas fa-building text-purple-600 text-xl"></i>
                    </div>
                    <span class="px-3 py-1 rounded-full text-xs font-semibold ${job.type === 'internship' ? 'bg-blue-100 text-blue-600' : 'bg-green-100 text-green-600'}">
                        ${job.type === 'internship' ? 'Internship' : 'Full-time'}
                    </span>
                </div>
                <h3 class="text-xl font-bold text-gray-800 mb-1">${job.title}</h3>
                <p class="text-purple-600 font-semibold mb-3">${job.company}</p>
                <div class="space-y-2 text-gray-600 text-sm mb-4">
                    <p><i class="fas fa-map-marker-alt mr-2"></i>${job.location}</p>
                    <p><i class="fas fa-money-bill-wave mr-2"></i>${job.salary}</p>
                    <p><i class="fas fa-calendar mr-2"></i>Deadline: ${formatDate(job.deadline)}</p>
                </div>
                <div class="flex flex-wrap gap-2 mb-4">
                    ${job.skills.slice(0, 3).map(skill => `<span class="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs">${skill}</span>`).join('')}
                </div>
                <button onclick="applyForJob(${job.id})" class="w-full gradient-bg text-white py-2 rounded-lg font-semibold hover:opacity-90 transition">
                    Apply Now
                </button>
            </div>
        </div>
    `).join('');
}

function filterJobs() {
    renderJobs();
}

// Page Navigation
function showPage(page) {
    document.querySelectorAll('.page').forEach(p => p.classList.add('hidden'));
    document.getElementById(page + 'Page').classList.remove('hidden');

    if (page === 'profile') {
        updateProfilePage();
    }

    window.scrollTo(0, 0);
}

function updateProfilePage() {
    const notLoggedIn = document.getElementById('notLoggedIn');
    const studentDashboard = document.getElementById('studentDashboard');
    const adminDashboard = document.getElementById('adminDashboard');

    notLoggedIn.classList.add('hidden');
    studentDashboard.classList.add('hidden');
    adminDashboard.classList.add('hidden');

    if (!currentUser) {
        notLoggedIn.classList.remove('hidden');
        return;
    }

    if (currentUser.role === 'admin') {
        adminDashboard.classList.remove('hidden');
        renderAdminDashboard();
    } else {
        studentDashboard.classList.remove('hidden');
        renderStudentDashboard();
    }
}

function renderStudentDashboard() {
    document.getElementById('studentName').textContent = currentUser.name;
    document.getElementById('studentEmail').textContent = currentUser.email;

    const myApps = applications.filter(app => app.userId === currentUser.email);
    document.getElementById('studentApplied').textContent = myApps.length;
    document.getElementById('studentShortlisted').textContent = myApps.filter(a => a.status === 'shortlisted').length;
    document.getElementById('studentInterviews').textContent = myApps.filter(a => a.status === 'interview').length;

    const container = document.getElementById('myApplications');
    if (myApps.length === 0) {
        container.innerHTML = '<div class="text-center py-10 text-gray-500"><i class="fas fa-inbox text-4xl mb-4"></i><p>No applications yet. Start applying!</p></div>';
        return;
    }

    container.innerHTML = myApps.map(app => {
        const job = jobs.find(j => j.id === app.jobId);
        const statusColors = {
            pending: 'bg-yellow-100 text-yellow-600',
            shortlisted: 'bg-green-100 text-green-600',
            interview: 'bg-blue-100 text-blue-600',
            rejected: 'bg-red-100 text-red-600'
        };
        return `
            <div class="bg-white rounded-xl shadow-lg p-6 card-hover">
                <div class="flex justify-between items-start">
                    <div>
                        <h3 class="text-xl font-bold text-gray-800">${job?.title || 'Unknown Position'}</h3>
                        <p class="text-purple-600 font-semibold">${job?.company || 'Unknown Company'}</p>
                        <p class="text-gray-500 text-sm mt-2">Applied on ${formatDate(app.appliedDate)}</p>
                    </div>
                    <span class="px-3 py-1 rounded-full text-sm font-semibold ${statusColors[app.status]}">${app.status.charAt(0).toUpperCase() + app.status.slice(1)}</span>
                </div>
            </div>
        `;
    }).join('');
}

function renderAdminDashboard() {
    document.getElementById('adminTotalJobs').textContent = jobs.length;
    document.getElementById('adminTotalApps').textContent = applications.length;
    document.getElementById('adminTotalStudents').textContent = users.filter(u => u.role === 'student').length;
    document.getElementById('adminActiveJobs').textContent = jobs.filter(j => new Date(j.deadline) > new Date()).length;

    renderAdminJobs();
    renderAdminApplications();
}

function renderAdminJobs() {
    const container = document.getElementById('adminJobsList');
    container.innerHTML = jobs.map(job => `
        <div class="bg-gray-50 rounded-xl p-6 flex justify-between items-center">
            <div>
                <h3 class="text-lg font-bold text-gray-800">${job.title}</h3>
                <p class="text-purple-600">${job.company}</p>
                <p class="text-gray-500 text-sm">${job.type === 'internship' ? 'Internship' : 'Full-time'} • ${job.location}</p>
            </div>
            <div class="flex items-center space-x-4">
                <span class="bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-sm">${applications.filter(a => a.jobId === job.id).length} Applications</span>
                <button onclick="deleteJob(${job.id})" class="text-red-500 hover:text-red-700"><i class="fas fa-trash"></i></button>
            </div>
        </div>
    `).join('');
}

function renderAdminApplications() {
    const container = document.getElementById('adminApplicationsList');
    if (applications.length === 0) {
        container.innerHTML = '<div class="text-center py-10 text-gray-500"><i class="fas fa-inbox text-4xl mb-4"></i><p>No applications received yet</p></div>';
        return;
    }

    container.innerHTML = applications.map(app => {
        const job = jobs.find(j => j.id === app.jobId);
        return `
            <div class="bg-gray-50 rounded-xl p-6">
                <div class="flex justify-between items-start mb-4">
                    <div>
                        <h3 class="text-lg font-bold text-gray-800">${app.name}</h3>
                        <p class="text-gray-600">${app.email} • ${app.phone}</p>
                        <p class="text-purple-600 text-sm">Applied for: ${job?.title || 'Unknown'} at ${job?.company || 'Unknown'}</p>
                    </div>
                    <select onchange="updateApplicationStatus('${app.id}', this.value)" class="border rounded-lg px-3 py-1 text-sm">
                        <option value="pending" ${app.status === 'pending' ? 'selected' : ''}>Pending</option>
                        <option value="shortlisted" ${app.status === 'shortlisted' ? 'selected' : ''}>Shortlisted</option>
                        <option value="interview" ${app.status === 'interview' ? 'selected' : ''}>Interview</option>
                        <option value="rejected" ${app.status === 'rejected' ? 'selected' : ''}>Rejected</option>
                    </select>
                </div>
                <div class="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div><span class="text-gray-500">Department:</span> ${app.department}</div>
                    <div><span class="text-gray-500">Year:</span> ${app.year}</div>
                    <div><span class="text-gray-500">CGPA:</span> ${app.cgpa}</div>
                    <div><span class="text-gray-500">Skills:</span> ${app.skills}</div>
                </div>
                ${app.resumeName ? `<p class="mt-2 text-sm text-green-600"><i class="fas fa-file-pdf mr-1"></i>Resume: ${app.resumeName}</p>` : ''}
            </div>
        `;
    }).join('');
}

function showAdminTab(tab) {
    document.getElementById('adminJobsTab').classList.add('hidden');
    document.getElementById('adminApplicationsTab').classList.add('hidden');
    document.getElementById('tabJobs').classList.remove('text-purple-600', 'border-purple-600');
    document.getElementById('tabApplications').classList.remove('text-purple-600', 'border-purple-600');
    document.getElementById('tabJobs').classList.add('text-gray-500');
    document.getElementById('tabApplications').classList.add('text-gray-500');

    if (tab === 'jobs') {
        document.getElementById('adminJobsTab').classList.remove('hidden');
        document.getElementById('tabJobs').classList.add('text-purple-600', 'border-purple-600');
        document.getElementById('tabJobs').classList.remove('text-gray-500');
    } else {
        document.getElementById('adminApplicationsTab').classList.remove('hidden');
        document.getElementById('tabApplications').classList.add('text-purple-600', 'border-purple-600');
        document.getElementById('tabApplications').classList.remove('text-gray-500');
    }
}

function showPostJobForm() {
    document.getElementById('postJobForm').classList.remove('hidden');
}

function hidePostJobForm() {
    document.getElementById('postJobForm').classList.add('hidden');
    document.getElementById('newJobForm').reset();
}

async function deleteJob(id) {
    if (confirm('Are you sure you want to delete this job?')) {
        try {
            const res = await fetch(`/api/jobs/${id}`, { method: 'DELETE' });
            if (res.ok) {
                // Refresh jobs
                const jobsRes = await fetch('/api/jobs');
                jobs = await jobsRes.json();
                renderAdminDashboard();
                renderJobs();
                showToast('Job deleted successfully!');
            } else {
                alert('Failed to delete job');
            }
        } catch (e) {
            console.error(e);
            alert('Error deleting job');
        }
    }
}

async function updateApplicationStatus(id, status) {
    try {
        const res = await fetch(`/api/applications/${id}/status`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status })
        });

        if (res.ok) {
            // Update local state to reflect change immediately in UI
            const app = applications.find(a => a.id == id); // id might be string or int
            if (app) app.status = status;
            showToast('Application status updated!');
        } else {
            alert('Failed to update status');
        }
    } catch (e) {
        console.error(e);
        alert('Error updating status');
    }
}

// Modal Functions
function showModal(type) {
    document.getElementById(type + 'Modal').classList.remove('hidden');
}

function hideModal(type) {
    document.getElementById(type + 'Modal').classList.add('hidden');
}

function toggleMobileMenu() {
    document.getElementById('mobileMenu').classList.toggle('hidden');
}

// Authentication
function setupFormHandlers() {
    document.getElementById('loginForm').addEventListener('submit', handleLogin);
    document.getElementById('signupForm').addEventListener('submit', handleSignup);
    document.getElementById('applicationForm').addEventListener('submit', handleApplication);
    document.getElementById('newJobForm').addEventListener('submit', handlePostJob);
}

async function handleLogin(e) {
    e.preventDefault();
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    const role = document.getElementById('loginRole').value;

    try {
        const res = await fetch('/api/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password, role })
        });

        if (res.ok) {
            const user = await res.json();
            currentUser = user;
            localStorage.setItem('currentUser', JSON.stringify(user));

            // Fetch applications
            try {
                const appsRes = await fetch('/api/applications');
                applications = await appsRes.json();
            } catch (e) { console.error("Error fetching apps", e); }

            hideModal('login');
            updateAuthUI();
            showToast('Login successful! Welcome back, ' + user.name);
            showPage('profile');
        } else {
            alert('Invalid credentials or user not found!');
        }
    } catch (e) {
        console.error(e);
        alert('Login failed');
    }
}

async function handleSignup(e) {
    e.preventDefault();
    const name = document.getElementById('signupName').value;
    const email = document.getElementById('signupEmail').value;
    const password = document.getElementById('signupPassword').value;
    const confirmPassword = document.getElementById('signupConfirmPassword').value;
    const role = document.getElementById('signupRole').value;

    if (password !== confirmPassword) {
        alert('Passwords do not match!');
        return;
    }

    if (getPasswordStrength(password).score < 2) {
        alert('Please use a stronger password!');
        return;
    }

    try {
        const res = await fetch('/api/signup', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, password, role })
        });

        if (res.ok) {
            const user = await res.json();
            currentUser = user;
            localStorage.setItem('currentUser', JSON.stringify(user));

            hideModal('signup');
            updateAuthUI();
            showToast('Account created successfully! Welcome, ' + name);
            showPage('profile');
        } else {
            const data = await res.json();
            alert(data.error || 'Signup failed');
        }
    } catch (e) {
        console.error(e);
        alert('Signup failed');
    }
}

async function logout() {
    // If Supabase client is available, sign out there as well
    if (window.supabase) {
        try {
            await window.supabase.auth.signOut();
        } catch (err) {
            console.error('Supabase signOut error', err);
        }
    }

    currentUser = null;
    localStorage.removeItem('currentUser');
    updateAuthUI();
    showPage('home');
    showToast('Logged out successfully!');
}

function updateAuthUI() {
    const authButtons = document.getElementById('authButtons');
    const userMenu = document.getElementById('userMenu');
    const userName = document.getElementById('userName');
    const mobileAuthButtons = document.getElementById('mobileAuthButtons');
    const mobileUserMenu = document.getElementById('mobileUserMenu');
    const mobileUserName = document.getElementById('mobileUserName');

    if (currentUser) {
        authButtons.classList.add('hidden');
        userMenu.classList.remove('hidden');
        userName.textContent = currentUser.name;
        mobileAuthButtons.classList.add('hidden');
        mobileUserMenu.classList.remove('hidden');
        mobileUserName.textContent = currentUser.name + ' (' + currentUser.role + ')';
    } else {
        authButtons.classList.remove('hidden');
        userMenu.classList.add('hidden');
        mobileAuthButtons.classList.remove('hidden');
        mobileUserMenu.classList.add('hidden');
    }
}

// Job Application
function applyForJob(jobId) {
    if (!currentUser) {
        showModal('login');
        return;
    }

    if (currentUser.role === 'admin') {
        alert('Admins cannot apply for jobs!');
        return;
    }

    if (applications.find(a => a.jobId === jobId && a.userId === currentUser.email)) {
        alert('You have already applied for this job!');
        return;
    }

    const job = jobs.find(j => j.id === jobId);
    document.getElementById('applyJobId').value = jobId;
    document.getElementById('applyJobTitle').textContent = job.title + ' at ' + job.company;
    document.getElementById('appName').value = currentUser.name;
    document.getElementById('appEmail').value = currentUser.email;
    showModal('application');
}

async function handleApplication(e) {
    e.preventDefault();

    const resumeFile = document.getElementById('appResume').files[0];

    const application = {
        jobId: parseInt(document.getElementById('applyJobId').value),
        userId: currentUser ? currentUser.email : null,
        name: document.getElementById('appName').value,
        phone: document.getElementById('appPhone').value,
        email: document.getElementById('appEmail').value,
        department: document.getElementById('appDepartment').value,
        year: document.getElementById('appYear').value,
        cgpa: document.getElementById('appCGPA').value,
        backlogs: document.getElementById('appBacklogs').value,
        skills: document.getElementById('appSkills').value,
        coverLetter: document.getElementById('appCoverLetter').value,
        resumeName: resumeFile ? resumeFile.name : null,
        status: 'pending',
        appliedDate: new Date().toISOString().split('T')[0]
    };

    try {
        const res = await fetch('/api/applications', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(application)
        });

        if (res.ok) {
            const savedApp = await res.json();
            applications.push(savedApp); // Update local state
            showToast('Application submitted successfully!');
            hideModal('application');
            document.getElementById('applicationForm').reset();
            updateProfilePage();
        } else {
            alert('Failed to submit application');
        }
    } catch (e) {
        console.error(e);
        alert('Error submitting application');
    }
}

async function handlePostJob(e) {
    e.preventDefault();

    const newJob = {
        company: document.getElementById('jobCompany').value,
        title: document.getElementById('jobTitle').value,
        type: document.getElementById('jobType').value,
        salary: document.getElementById('jobSalary').value,
        location: document.getElementById('jobLocation').value,
        departments: document.getElementById('jobDepts').value.split(',').map(d => d.trim()),
        skills: document.getElementById('jobSkills').value.split(',').map(s => s.trim()),
        description: document.getElementById('jobDescription').value,
        deadline: document.getElementById('jobDeadline').value,
        logo: "fas fa-briefcase", // Default logo
        posted: new Date().toISOString().split('T')[0]
    };

    try {
        const res = await fetch('/api/jobs', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newJob)
        });

        if (res.ok) {
            const savedJob = await res.json();
            jobs.unshift(savedJob);

            if (document.getElementById('sendNotification').checked) {
                showNotification(savedJob);
            }

            hidePostJobForm();
            renderAdminDashboard();
            renderJobs();
            showToast('Job posted successfully!');
        } else {
            alert('Failed to post job');
        }
    } catch (e) {
        console.error(e);
        alert('Error posting job');
    }
}

// Password Strength
function checkPasswordStrength() {
    const password = document.getElementById('signupPassword').value;
    const result = getPasswordStrength(password);

    const fill = document.getElementById('passwordStrengthFill');
    const text = document.getElementById('passwordStrengthText');

    fill.style.width = (result.score * 25) + '%';
    fill.className = 'h-full rounded-full transition-all ' + result.color;
    text.textContent = result.label;
    text.className = 'text-sm mt-1 ' + result.textColor;
}

function getPasswordStrength(password) {
    let score = 0;
    if (password.length >= 8) score++;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score++;
    if (/\d/.test(password)) score++;
    if (/[^a-zA-Z0-9]/.test(password)) score++;

    const levels = [
        { score: 0, label: '', color: 'bg-gray-300', textColor: 'text-gray-500' },
        { score: 1, label: 'Weak', color: 'bg-red-500', textColor: 'text-red-500' },
        { score: 2, label: 'Fair', color: 'bg-yellow-500', textColor: 'text-yellow-500' },
        { score: 3, label: 'Good', color: 'bg-blue-500', textColor: 'text-blue-500' },
        { score: 4, label: 'Strong', color: 'bg-green-500', textColor: 'text-green-500' }
    ];

    return { ...levels[score], score };
}

function togglePassword(id) {
    const input = document.getElementById(id);
    input.type = input.type === 'password' ? 'text' : 'password';
}

// Notifications
async function showNotification(job) {
    document.getElementById('notificationText').textContent = `${job.company} is hiring for ${job.title}!`;
    document.getElementById('notificationBanner').classList.remove('hidden');

    console.log('Sending email notifications...');

    // Call the backend to send emails
    try {
        const res = await fetch('/api/notify-job', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(job)
        });
        const data = await res.json();
        console.log('Server response:', data.message);

        if (data.message) {
            console.log(data.message);

            let alertMsg = data.message;
            if (data.previewUrl) {
                alertMsg += "\n\nTest Mode Active: Check browser console for Preview URL!";
                console.log('📧 PREVIEW URL:', data.previewUrl);
            }
            alert(alertMsg);
        }
    } catch (e) {
        console.error("Error sending email notification:", e);
    }
}

function hideNotification() {
    document.getElementById('notificationBanner').classList.add('hidden');
}

// Toast
function showToast(message) {
    const toast = document.getElementById('toast');
    document.getElementById('toastMessage').textContent = message;
    toast.classList.remove('hidden');

    setTimeout(() => {
        toast.classList.add('hidden');
    }, 3000);
}

// Utilities
function formatDate(dateStr) {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}

// ============================================
// AI CHATBOT FUNCTIONS
// ============================================

function toggleChatbot() {
    isChatbotOpen = !isChatbotOpen;
    const chatWindow = document.getElementById('chatbotWindow');
    const chatButton = document.getElementById('chatbotButton');

    if (isChatbotOpen) {
        chatWindow.classList.add('open');
        chatButton.innerHTML = '<i class="fas fa-times"></i>';
    } else {
        chatWindow.classList.remove('open');
        chatButton.innerHTML = '<i class="fas fa-comments"></i>';
    }
}

function handleChatKeyPress(event) {
    if (event.key === 'Enter') {
        sendMessage();
    }
}

function sendQuickMessage(message) {
    document.getElementById('chatbotInput').value = message;
    sendMessage();
}

async function sendMessage() {
    const input = document.getElementById('chatbotInput');
    const message = input.value.trim();

    if (!message) return;

    // Add user message to chat
    addMessageToChat(message, 'user');
    input.value = '';

    // Disable send button and show typing indicator
    const sendButton = document.getElementById('chatbotSend');
    sendButton.disabled = true;
    showTypingIndicator();

    try {
        // Attempt to send message to backend proxy at /api/chat
        const resp = await fetch('/api/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message, history: chatHistory, system: getSystemPrompt() })
        });

        // If backend exists but returns non-JSON or non-OK, fall through to catch
        const data = await resp.json();

        // Remove typing indicator
        removeTypingIndicator();

        if (!resp.ok) {
            throw new Error(data.error || 'Server returned an error');
        }

        // Extract response text
        const botResponse = data.reply || 'Sorry, I did not get a reply.';

        // Add bot response to chat
        addMessageToChat(botResponse, 'bot');

        // Update chat history
        chatHistory.push(
            { role: 'user', content: message },
            { role: 'assistant', content: botResponse }
        );

        // Keep only last 10 messages in history to manage context
        if (chatHistory.length > 20) {
            chatHistory = chatHistory.slice(-20);
        }

    } catch (error) {
        // Backend not available or returned error — use local fallback responder
        console.warn('Chatbot backend error, using local fallback:', error);

        try {
            const local = await localRespond(message);
            removeTypingIndicator();
            const botResponse = local.reply || 'Sorry, I could not process that.';
            addMessageToChat(botResponse, 'bot');

            chatHistory.push(
                { role: 'user', content: message },
                { role: 'assistant', content: botResponse }
            );

            if (chatHistory.length > 20) chatHistory = chatHistory.slice(-20);
        } catch (localErr) {
            removeTypingIndicator();
            addMessageToChat('Sorry, I encountered an error. Please try again later.', 'bot');
            console.error('Local chatbot error:', localErr);
        }
    } finally {
        sendButton.disabled = false;
    }
}

// Local fallback responder (works offline for testing)
function localRespond(message) {
    return new Promise(resolve => {
        const msg = message.toLowerCase();

        // Simple intent matching
        if (msg.includes('job') || msg.includes('available')) {
            const topJobs = jobs.slice(0, 3).map(j => `${j.company}: ${j.title} (${j.location})`).join('\n');
            return setTimeout(() => resolve({ reply: `Here are some open roles:\n${topJobs}` }), 600);
        }

        if (msg.includes('interview') || msg.includes('prepare')) {
            return setTimeout(() => resolve({ reply: `Interview tips:\n1) Research the company\n2) Practice coding and behavioral questions\n3) Prepare questions for the interviewer` }), 600);
        }

        if (msg.includes('company') || msg.includes('companies') || msg.includes('top')) {
            const companies = [...new Set(jobs.map(j => j.company))].slice(0, 5).join(', ');
            return setTimeout(() => resolve({ reply: `Top companies on our platform include: ${companies}` }), 600);
        }

        // Default fallback
        return setTimeout(() => resolve({ reply: `I'm a local assistant. I can list jobs, give interview tips, or mention top companies. Try asking: "What jobs are available?"` }), 600);
    });
}

function getSystemPrompt() {
    const jobsList = jobs.map(j =>
        `${j.company} - ${j.title} (${j.type}) - ${j.salary} - Location: ${j.location} - Departments: ${j.departments.join(', ')} - Skills: ${j.skills.join(', ')}`
    ).join('\n');

    const userContext = currentUser ?
        `The user is logged in as ${currentUser.name} (${currentUser.role}).` :
        'The user is not logged in.';

    return `You are a helpful career assistant for Degree To Desk, a campus placement platform. You help students with:
- Finding job opportunities and internships
- Interview preparation tips
- Resume and career advice
- Information about companies and placements

${userContext}

Available jobs on the platform:
${jobsList}

Be friendly, concise, and helpful. When discussing jobs, provide specific details from the available listings. Encourage students to apply through the portal. If asked about features or navigation, guide them appropriately.`;
}

function addMessageToChat(text, sender) {
    const messagesContainer = document.getElementById('chatbotMessages');
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${sender}`;

    const contentDiv = document.createElement('div');
    contentDiv.className = 'message-content';
    contentDiv.textContent = text;

    messageDiv.appendChild(contentDiv);
    messagesContainer.appendChild(messageDiv);

    // Scroll to bottom
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

function showTypingIndicator() {
    const messagesContainer = document.getElementById('chatbotMessages');
    const typingDiv = document.createElement('div');
    typingDiv.className = 'message bot';
    typingDiv.id = 'typingIndicator';

    typingDiv.innerHTML = `
        <div class="typing-indicator">
            <div class="typing-dot"></div>
            <div class="typing-dot"></div>
            <div class="typing-dot"></div>
        </div>
    `;

    messagesContainer.appendChild(typingDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

function removeTypingIndicator() {
    const indicator = document.getElementById('typingIndicator');
    if (indicator) {
        indicator.remove();
    }
}

// Supabase integration setup
// Add your Supabase URL and anon key below
const SUPABASE_URL = 'https://icehtsgqdclkkvynaqrc.supabase.co';
const SUPABASE_ANON_KEY = eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImljZWh0c2dxZGNsa2t2eW5hcXJjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzAxMTU4MDIsImV4cCI6MjA4NTY5MTgwMn0.PTNZ9gvE31tis3oHq45xR5l3MBzNwiOFrIRKthJkh2A

// Initialize Supabase client
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Insert a user
async function insertUser(name, email, degree, desk) {
    const { data, error } = await supabase
        .from('users')
        .insert([{ name, email, degree, desk }]);
    if (error) {
        console.error('Insert error:', error);
    } else {
        console.log('Inserted:', data);
    }
}

// Update a user's desk
async function updateDesk(email, newDesk) {
    const { data, error } = await supabase
        .from('users')
        .update({ desk: newDesk })
        .eq('email', email);
    if (error) {
        console.error('Update error:', error);
    } else {
        console.log('Updated:', data);
    }
}

// View all users
async function viewUsers() {
    const { data, error } = await supabase
        .from('users')
        .select('*');
    if (error) {
        console.error('View error:', error);
    } else {
        console.log('Users:', data);
    }
}