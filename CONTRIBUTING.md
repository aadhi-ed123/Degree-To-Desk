# 🤝 Contributing Guide

Thank you for considering contributing to Degree To Desk! This guide will help you understand the contribution process and coding standards.

## Code of Conduct

- Be respectful and inclusive to all contributors
- Provide constructive feedback
- Help others learn and grow
- Report inappropriate behavior to maintainers

## How to Contribute

### 1. Reporting Bugs

Found a bug? Please report it by opening an issue on GitHub.

**Before reporting:**
- Check if the bug has already been reported
- Verify the bug is reproducible
- Collect relevant system information

**Include in bug report:**
```
**Description:**
Brief description of the bug

**Steps to Reproduce:**
1. Step 1
2. Step 2
3. Step 3

**Expected Behavior:**
What should happen

**Actual Behavior:**
What actually happens

**Screenshots:**
If applicable, add screenshots

**Environment:**
- Node.js version: 
- npm version:
- OS: 

**Additional Context:**
Any other relevant information
```

### 2. Feature Requests

Have a feature idea? Share it with the community!

**Include in feature request:**
```
**Description:**
Clear description of the feature

**Motivation:**
Why is this feature needed?

**Implementation Details:**
How would you like it implemented? (if you have ideas)

**Example Usage:**
Show how the feature would be used

**Related Issues:**
Link any related issues
```

### 3. Submitting Pull Requests

#### Step 1: Fork the Repository

```bash
# Visit https://github.com/aadhi-ed123/Degree-To-Desk
# Click the "Fork" button to create your copy
```

#### Step 2: Clone Your Fork

```bash
git clone https://github.com/YOUR-USERNAME/Degree-To-Desk.git
cd "Degree To Desk"
```

#### Step 3: Create a Feature Branch

```bash
# Create and switch to a new branch
git checkout -b feature/your-feature-name

# Or for bug fixes
git checkout -b bugfix/bug-description
```

Branch naming convention:
- Features: `feature/feature-name`
- Bugfixes: `bugfix/bug-description`
- Docs: `docs/documentation-topic`
- Hotfix: `hotfix/critical-fix`

#### Step 4: Make Your Changes

```bash
# Make your code changes
# Follow the coding standards (see below)
# Test your changes thoroughly
```

#### Step 5: Commit Your Changes

```bash
# Stage your changes
git add .

# Commit with clear message
git commit -m "Add feature: description of changes"
```

Commit message guidelines:
- Use present tense ("Add feature" not "Added feature")
- Limit to 50 characters for subject line
- Reference issues when applicable: "#123"
- Example: `Add email notification feature for job alerts (#42)`

#### Step 6: Push to Your Fork

```bash
git push origin feature/your-feature-name
```

#### Step 7: Create Pull Request

1. Go to GitHub and navigate to your fork
2. Click "New Pull Request" button
3. Select your feature branch
4. Fill in the PR template:

```markdown
## Description
Brief description of your changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Related Issues
Closes #(issue number)

## Changes Made
- Point 1
- Point 2
- Point 3

## Testing Done
Describe tests you performed

## Checklist
- [ ] Code follows style guidelines
- [ ] Changes tested locally
- [ ] Documentation updated
- [ ] No new warnings generated
```

5. Submit the PR

#### Step 8: Address Feedback

- Respond to reviewer comments
- Make requested changes
- Push updates to the same branch
- PR will update automatically

## Development Setup

### Local Development Environment

```bash
# Clone and install
git clone https://github.com/YOUR-USERNAME/Degree-To-Desk.git
cd "Degree To Desk"
npm install

# Create .env for development
echo "PORT=3000
NODE_ENV=development
DATABASE_URL=./placement.db" > .env

# Run with auto-reload
npm run dev
```

### Development Tools

Consider installing these tools:

```bash
# Nodemon for auto-reload
npm install --save-dev nodemon

# ESLint for code quality
npm install --save-dev eslint

# Prettier for code formatting
npm install --save-dev prettier
```

## Coding Standards

### JavaScript Naming Conventions

```javascript
// Constants - UPPER_SNAKE_CASE
const MAX_RETRIES = 3;
const API_TIMEOUT = 5000;

// Variables - camelCase
let currentUser = null;
let jobApplications = [];

// Functions - camelCase
function fetchJobDetails(jobId) { }
const handleApplicationSubmit = () => { };

// Classes - PascalCase
class JobManager { }
class UserService { }

// Private methods - prefix with underscore
function _validateEmail(email) { }
```

### Code Style

```javascript
// Use strict equality
if (status === 'active') { } // Good
if (status == 'active') { }  // Avoid

// Use const by default, let if reassignment needed
const config = { };  // Good
let counter = 0;     // Good if reassignment needed
var oldStyle = 0;    // Avoid

// Use arrow functions for callbacks
array.map(item => item * 2);          // Good
array.map(function(item) { ... });    // Okay but less preferred

// Comment complex logic
// Calculate acceptance rate considering pending applications
const rate = (accepted / (accepted + rejected)) * 100;
```

### File Structure

```
project/
├── server.js           # Server entry point
├── script.js           # Frontend logic
├── style.css           # Styles
├── index.html          # Main HTML
├── package.json        # Dependencies
├── .env               # Environment variables
├── .gitignore         # Git ignore rules
└── README.md          # Documentation
```

### HTML/CSS Standards

```html
<!-- Use semantic HTML -->
<header>
  <nav></nav>
</header>
<main>
  <article></article>
</main>
<footer></footer>

<!-- Use descriptive class names -->
<div class="job-card"></div>       <!-- Good -->
<div class="jc"></div>             <!-- Avoid -->
```

```css
/* Use meaningful class names */
.job-application-form { }
.application-status-badge { }

/* Organize by component */
/* Navigation Styles */
.navbar { }

/* Job Styles */
.job-card { }
.job-details { }
```

## Testing

### Manual Testing Checklist

Before submitting PR, test:

- [ ] Feature works as described
- [ ] No console errors
- [ ] No console warnings
- [ ] Responsive on mobile (< 768px)
- [ ] Responsive on tablet (768px - 1024px)
- [ ] Responsive on desktop (> 1024px)
- [ ] Works in Chrome, Firefox, Safari
- [ ] Database operations work correctly
- [ ] API endpoints respond correctly

### Testing Priority

1. **Core Features**: Always test main functionality
2. **Edge Cases**: Test boundary conditions
3. **Browser Compatibility**: Test on multiple browsers
4. **Responsive Design**: Test all screen sizes

## Documentation

### When to Document

- New features
- API changes
- New functions or classes
- Complex algorithms
- Configuration options

### Documentation Format

```javascript
/**
 * Submit a job application
 * 
 * @param {number} jobId - The ID of the job
 * @param {Object} applicationData - Application information
 * @param {string} applicationData.name - Applicant's name
 * @param {string} applicationData.email - Applicant's email
 * @returns {Promise<Object>} Application submission result
 * @throws {Error} If jobId is invalid
 */
async function submitApplication(jobId, applicationData) {
  // Implementation
}
```

## Performance Considerations

### Frontend Optimization

```javascript
// Lazy load images
<img loading="lazy" src="image.jpg" alt="Description">

// Debounce search input
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Memoize expensive calculations
function memoize(fn) {
  const cache = {};
  return (arg) => cache[arg] || (cache[arg] = fn(arg));
}
```

### Database Optimization

```javascript
// Use indexes for frequently queried columns
db.run("CREATE INDEX idx_user_email ON users(email)");

// Limit results
db.get("SELECT * FROM jobs LIMIT 10");

// Use parameterized queries
db.run("SELECT * FROM jobs WHERE type = ?", [jobType]);
```

## Security Best Practices

### Input Validation

```javascript
// Validate email format
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Sanitize user input
function sanitizeInput(input) {
  return input.trim().replace(/[<>]/g, '');
}
```

### Error Handling

```javascript
// Use try-catch for async operations
try {
  const result = await fetchData();
} catch (error) {
  console.error('Error:', error.message);
  // Handle error appropriately
}

// Don't expose sensitive information
// Bad
res.status(500).json({ error: error.message });

// Good
res.status(500).json({ error: 'Internal server error' });
```

## Changelog

When contributing, update the changelog:

```markdown
## [Version] - Date

### Added
- New feature X

### Fixed
- Bug Y

### Changed
- Modified behavior Z

### Removed
- Deprecated feature A
```

## Review Process

### What Reviewers Look For

1. **Code Quality**
   - Follows coding standards
   - Clear and readable
   - Well-commented where needed

2. **Functionality**
   - Works as intended
   - Handles edge cases
   - No new bugs introduced

3. **Performance**
   - No significant performance regression
   - Optimized queries
   - Efficient algorithms

4. **Documentation**
   - Changes documented
   - ReadMe updated if needed
   - Comments clear

5. **Testing**
   - Manually tested
   - No console errors
   - All browsers tested

### Tips for Quick Approval

- Follow the contribution guidelines closely
- Test thoroughly before submitting
- Provide clear PR description
- Respond promptly to feedback
- Keep PRs focused and smaller

## Getting Help

### Resources

- **Documentation**: See [README.md](README.md)
- **Setup Guide**: See [SETUP.md](SETUP.md)
- **API Reference**: See [API_DOCUMENTATION.md](API_DOCUMENTATION.md)
- **Architecture**: See [ARCHITECTURE.md](ARCHITECTURE.md)
- **Issues**: [GitHub Issues](https://github.com/aadhi-ed123/Degree-To-Desk/issues)

### Asking Questions

When asking for help:
- Search existing issues first
- Provide clear context
- Include error messages and screenshots
- Describe what you've already tried

## Contributor Recognition

Contributors will be recognized in:
- README.md contributors section
- GitHub contributors page
- Release notes

## License

By contributing, you agree that your contributions will be licensed under the same ISC license.

---

**Thank you for contributing to Degree To Desk! 🎉**

**Contributing Guide Version**: 1.0  
**Last Updated**: February 2026
