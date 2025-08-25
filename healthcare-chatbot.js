// DOM & Section logic
function showHelp() {
    showSection('help');
    setActiveNavButton('help');
}

function showHistory() {
    showSection('history');
    setActiveNavButton('history');
    loadHistory();
}

function showMostSearched() {
    showSection('most-searched');
    setActiveNavButton('most-searched');
}

// Navigation
function setActiveNavButton(section) {
    document.querySelectorAll('.nav-btn').forEach(btn => btn.classList.remove('active'));
    const buttons = document.querySelectorAll('.nav-btn');
    if (section === 'recommendations') buttons[0].classList.add('active');
    else if (section === 'most-searched') buttons[1].classList.add('active');
    else if (section === 'history') buttons[2].classList.add('active');
    else if (section === 'help') buttons[3].classList.add('active');
}

function loadHistory() {
    const historyList = document.getElementById('history-list');
    const history = JSON.parse(localStorage.getItem('searchHistory')) || [];
    if (history.length === 0) {
        historyList.innerHTML = '<p class="empty-history">No search history yet. Your searches will appear here.</p>';
        return;
    }
    historyList.innerHTML = '';
    history.forEach((item, index) => {
        const historyItem = document.createElement('div');
        historyItem.className = 'history-item';
        historyItem.innerHTML = `
            <div class="history-query">${item.query}</div>
            <div class="history-date">${new Date(item.timestamp).toLocaleString()}</div>
            <button onclick="viewHistoryItem(${index})" class="view-btn">
                <i class="fas fa-eye"></i> View
            </button>
        `;
        historyList.appendChild(historyItem);
    });
}
function viewHistoryItem(index) {
    const history = JSON.parse(localStorage.getItem('searchHistory')) || [];
    if (history[index]) {
        document.getElementById('user-requirements').value = history[index].query;
        showRecommendations();
    }
}

function showRecommendations() {
    showSection('recommendations');
    setActiveNavButton('recommendations');
    const form = document.getElementById('recommendations-form');
    form.classList.add('animate__animated', 'animate__fadeInUp');
    if (!localStorage.getItem('welcomeShown')) {
        setTimeout(() => {
            showWelcomeTooltip();
            localStorage.setItem('welcomeShown', 'true');
        }, 1000);
    }
}
function showWelcomeTooltip() {
    const tooltip = document.createElement('div');
    tooltip.className = 'welcome-tooltip animate__animated animate__bounce';
    tooltip.innerHTML = `
        <div class="tooltip-content">
            <h3>Welcome to HealthBot! 👋</h3>
            <p>Describe your health concern and get trusted advice or resources.</p>
            <button onclick="this.parentElement.parentElement.remove()">Got it!</button>
        </div>
        <div class="tooltip-arrow"></div>
    `;
    document.getElementById('recommendations').appendChild(tooltip);
    const textarea = document.getElementById('user-requirements');
    const rect = textarea.getBoundingClientRect();
    tooltip.style.top = `${rect.top - 120}px`;
    tooltip.style.left = `${rect.left}px`;
}

function showExamples() {
    const dropdown = document.getElementById('examples-dropdown');
    dropdown.classList.toggle('hidden');
    if (!dropdown.classList.contains('hidden')) {
        dropdown.classList.add('animate__animated', 'animate__fadeIn');
    }
}
function insertExample(text) {
    document.getElementById('user-requirements').value = text;
    document.getElementById('examples-dropdown').classList.add('hidden');
}

// Section logic
const profileIcon = document.getElementById('profile-icon');
const profileMenu = document.getElementById('profile-menu');
const sections = {
    signup: document.getElementById('signup'),
    login: document.getElementById('login'),
    forgotPassword: document.getElementById('forgot-password'),
    profile: document.getElementById('profile'),
    updateProfile: document.getElementById('update-profile'),
    updatePassword: document.getElementById('update-password'),
    recommendations: document.getElementById('recommendations'),
    results: document.getElementById('results')
};
let previousSection = '';

profileIcon.addEventListener('click', (e) => {
    e.stopPropagation();
    profileMenu.classList.toggle('show');
});
document.addEventListener('click', () => {
    profileMenu.classList.remove('show');
});

function showSection(sectionId) {
    const currentVisible = Object.values(sections).find(section => !section.classList.contains('hidden'));
    if (currentVisible) previousSection = currentVisible.id;
    Object.values(sections).forEach(section => section.classList.add('hidden'));
    const section = document.getElementById(sectionId);
    section.classList.remove('hidden');
    section.classList.add('animate__animated', 'animate__fadeIn');
    window.scrollTo(0, 0);
}
function backToDashboard() { showSection('recommendations'); }
function backToProfile() { showSection('profile'); }
function showSignup() { showSection('signup'); }
function showLogin() { showSection('login'); }
function showForgotPassword() { showSection('forgot-password'); }
function viewProfile() {
    previousSection = document.querySelector('.form-section:not(.hidden)').id;
    document.getElementById('display-username').textContent = "John Doe";
    document.getElementById('display-email').textContent = "john.doe@example.com";
    document.getElementById('display-created').textContent = new Date().toLocaleDateString();
    showSection('profile');
    profileMenu.classList.remove('show');
}
function showUpdateProfile() {
    previousSection = 'profile';
    document.getElementById('update-name').value = "John Doe";
    document.getElementById('update-email').value = "john.doe@example.com";
    showSection('update-profile');
    profileMenu.classList.remove('show');
}
function showUpdatePassword() {
    previousSection = 'profile';
    showSection('update-password');
    profileMenu.classList.remove('show');
}
function logoutUser() {
    profileIcon.classList.add('hidden');
    document.getElementById('main-nav').classList.add('hidden');
    showSection('login');
    profileMenu.classList.remove('show');
    const loginError = document.getElementById('login-error');
    loginError.textContent = "You have been successfully logged out.";
    loginError.classList.remove('error');
    loginError.classList.add('success');
    loginError.classList.remove('hidden');
    setTimeout(() => { loginError.classList.add('hidden'); }, 5000);
}

// Form submissions (signup/login/profile/password)
document.getElementById('signup-form').addEventListener('submit', function(e) {
    e.preventDefault();
    const errorElement = document.getElementById('signup-error');
    const password = document.getElementById('signup-password').value;
    if (password.length < 8) {
        errorElement.textContent = "Password must be at least 8 characters long.";
        errorElement.classList.remove('hidden');
        errorElement.classList.add('animate__animated', 'animate__shakeX');
        return;
    }
    errorElement.classList.add('hidden');
    profileIcon.classList.remove('hidden');
    document.getElementById('main-nav').classList.remove('hidden');
    showSection('recommendations');
});
document.getElementById('login-form').addEventListener('submit', function(e) {
    e.preventDefault();
    const errorElement = document.getElementById('login-error');
    errorElement.classList.add('hidden');
    profileIcon.classList.remove('hidden');
    document.getElementById('main-nav').classList.remove('hidden');
    showSection('recommendations');
});
document.getElementById('forgot-password-form').addEventListener('submit', function(e) {
    e.preventDefault();
    const errorElement = document.getElementById('reset-error');
    errorElement.textContent = "Password reset link has been sent to your email.";
    errorElement.classList.remove('error');
    errorElement.classList.add('success');
    errorElement.classList.remove('hidden');
});
document.getElementById('update-profile-form').addEventListener('submit', function(e) {
    e.preventDefault();
    document.getElementById('display-username').textContent = document.getElementById('update-name').value;
    document.getElementById('display-email').textContent = document.getElementById('update-email').value;
    showSection('profile');
});
document.getElementById('update-password-form').addEventListener('submit', function(e) {
    e.preventDefault();
    const errorElement = document.getElementById('password-error');
    const newPassword = document.getElementById('new-password').value;
    const confirmPassword = document.getElementById('confirm-password').value;
    if (newPassword !== confirmPassword) {
        errorElement.textContent = "Passwords do not match.";
        errorElement.classList.remove('hidden');
        errorElement.classList.add('animate__animated', 'animate__shakeX');
        return;
    }
    if (newPassword.length < 8) {
        errorElement.textContent = "Password must be at least 8 characters long.";
        errorElement.classList.remove('hidden');
        errorElement.classList.add('animate__animated', 'animate__shakeX');
        return;
    }
    errorElement.textContent = "Password changed successfully!";
    errorElement.classList.remove('error');
    errorElement.classList.add('success');
    errorElement.classList.remove('hidden');
    this.reset();
});

// Healthcare Recommendation Chatbot API logic
document.getElementById('recommendations-form').addEventListener('submit', async function(e) {
    e.preventDefault();
    const requirements = document.getElementById('user-requirements').value;
    const responseElement = document.getElementById('software-response');
    // Save to history
    const history = JSON.parse(localStorage.getItem('searchHistory')) || [];
    history.unshift({
        query: requirements,
        timestamp: new Date().getTime()
    });
    localStorage.setItem('searchHistory', JSON.stringify(history));
    // Show loading state
    responseElement.innerHTML = '<p class="loading-text">Finding the best advice and resources for you...</p>';
    showSection('results');
    try {
        // NOTE: Change this endpoint to your healthcare backend API!
        const response = await fetch('http://127.0.0.1:5001/answer_prompt', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt: requirements })
});
        if (!response.ok) throw new Error('Network response was not ok');
        const data = await response.json();
        if (data.status === 'error') throw new Error(data.error);
        responseElement.innerHTML = formatRecommendations(data.recommendations);
    } catch (error) {
        responseElement.innerHTML = `
            <div class="error">
                <i class="fas fa-exclamation-triangle"></i>
                <p>Error getting health advice: ${error.message}</p>
            </div>
            <button onclick="showRecommendations()" class="secondary-btn">Try Again <i class="fas fa-redo"></i></button>
        `;
    }
});

function formatRecommendations(text) {
    let html = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    html = html.replace(/\n/g, '<br>');
    return `<div class="api-response">${html}</div>
        <button onclick="showRecommendations()" class="secondary-btn">New Search <i class="fas fa-redo"></i></button>`;
}

// Most Searched Health Topics details
function viewSoftware(topicId) {
    let description = "";
    switch(topicId) {
        case 'diabetes':
            description = "Find resources and tips to help manage diabetes, including diet, exercise, medication, and monitoring.";
            break;
        case 'mentalhealth':
            description = "Learn about strategies for mental wellness, stress reduction, and accessing professional help.";
            break;
        case 'hearthealth':
            description = "Discover ways to maintain heart health, recognize symptoms, and preventive practices.";
            break;
        case 'womenshealth':
            description = "Explore advice and support for women's health including screenings and reproductive care.";
            break;
    }
    document.getElementById('software-response').innerHTML = `
        <div class="software-detail">
            <h3>${document.querySelector(`.software-card[onclick="viewSoftware('${topicId}')"] h3`).textContent}</h3>
            <p>${description}</p>
            <button onclick="showMostSearched()" class="secondary-btn">
                <i class="fas fa-arrow-left"></i> Back to Most Searched
            </button>
        </div>
    `;
    showSection('results');
}

// Dark mode toggle
function toggleDarkMode() {
    document.body.classList.toggle('dark-mode');
    const toggleBtn = document.querySelector('.toggle-btn');
    if (document.body.classList.contains('dark-mode')) {
        toggleBtn.innerHTML = '<i class="fas fa-sun"></i>';
        localStorage.setItem('darkMode', 'enabled');
    } else {
        toggleBtn.innerHTML = '<i class="fas fa-moon"></i>';
        localStorage.setItem('darkMode', 'disabled');
    }
}
if (localStorage.getItem('darkMode') === 'enabled') {
    document.body.classList.add('dark-mode');
    document.querySelector('.toggle-btn').innerHTML = '<i class="fas fa-sun"></i>';
}
document.addEventListener('DOMContentLoaded', () => {
    setInterval(() => {
        const submitBtn = document.querySelector('.pulse-animation');
        if (submitBtn) {
            submitBtn.classList.add('animate__animated', 'animate__pulse');
            setTimeout(() => {
                submitBtn.classList.remove('animate__animated', 'animate__pulse');
            }, 1000);
        }
    }, 5000);
});

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    const isLoggedIn = false;
    if (isLoggedIn) {
        profileIcon.classList.remove('hidden');
        document.getElementById('main-nav').classList.remove('hidden');
        showSection('recommendations');
        setActiveNavButton('recommendations');
    } else {
        showSection('signup');
    }
});

// Social login functions (placeholder)
function signInWithGoogle() {
    alert("In a real app, this would connect to Google authentication");
}
function signInWithFacebook() {
    alert("In a real app, this would connect to Facebook authentication");
}