// User Dashboard JavaScript

// State Management
const appState = {
    isAuthenticated: false,
    currentUser: null,
    theme: 'light',
    activities: [],
    orders: [],
    wishlist: []
};

// Sample data
const sampleOrders = [
    {
        id: 'ORD-001',
        date: '2024-01-15',
        total: 299.99,
        status: 'delivered',
        items: 3
    },
    {
        id: 'ORD-002',
        date: '2024-01-20',
        total: 149.99,
        status: 'shipped',
        items: 2
    },
    {
        id: 'ORD-003',
        date: '2024-01-25',
        total: 89.99,
        status: 'processing',
        items: 1
    }
];

const sampleWishlist = [
    {
        id: 1,
        name: 'Wireless Headphones',
        price: 89.99,
        image: 'https://via.placeholder.com/80x80'
    },
    {
        id: 2,
        name: 'Smart Watch',
        price: 249.99,
        image: 'https://via.placeholder.com/80x80'
    },
    {
        id: 3,
        name: 'Laptop Stand',
        price: 34.99,
        image: 'https://via.placeholder.com/80x80'
    }
];

const sampleActivities = [
    {
        type: 'login',
        title: 'Logged in',
        description: 'Successfully logged into your account',
        time: '2 hours ago',
        icon: 'login'
    },
    {
        type: 'order',
        title: 'Order Placed',
        description: 'Order ORD-003 has been placed',
        time: '1 day ago',
        icon: 'order'
    },
    {
        type: 'profile',
        title: 'Profile Updated',
        description: 'Your profile information was updated',
        time: '3 days ago',
        icon: 'profile'
    },
    {
        type: 'settings',
        title: 'Settings Changed',
        description: 'Notification preferences updated',
        time: '1 week ago',
        icon: 'settings'
    }
];

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    // Load saved state
    loadAppState();
    
    // Check authentication
    checkAuthentication();
    
    // Initialize event listeners
    initializeEventListeners();
    
    // Load sample data
    appState.orders = [...sampleOrders];
    appState.wishlist = [...sampleWishlist];
    appState.activities = [...sampleActivities];
}

function initializeEventListeners() {
    // Login form
    document.getElementById('login-form').addEventListener('submit', handleLogin);
    
    // Profile form
    document.getElementById('profile-form').addEventListener('submit', handleProfileUpdate);
    
    // Password form
    document.getElementById('password-form').addEventListener('submit', handlePasswordChange);
    
    // Search functionality
    document.addEventListener('keydown', function(e) {
        // Ctrl/Cmd + K for search (placeholder)
        if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
            e.preventDefault();
            // In a real app, this would focus a search input
        }
    });
}

// Authentication Functions
function checkAuthentication() {
    const savedAuth = localStorage.getItem('dashboard_auth');
    if (savedAuth) {
        const auth = JSON.parse(savedAuth);
        if (auth.isAuthenticated && auth.expiry > Date.now()) {
            appState.isAuthenticated = true;
            appState.currentUser = auth.user;
            showDashboard();
        } else {
            localStorage.removeItem('dashboard_auth');
            showLogin();
        }
    } else {
        showLogin();
    }
}

function handleLogin(e) {
    e.preventDefault();
    
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    const rememberMe = document.getElementById('remember-me').checked;
    
    // Simulate authentication (accept any credentials for demo)
    const user = {
        email: email,
        name: email.split('@')[0].replace('.', ' ').replace(/\b\w/g, l => l.toUpperCase()),
        firstName: email.split('@')[0].split('.')[0] || 'John',
        lastName: email.split('@')[0].split('.')[1] || 'Doe'
    };
    
    // Set authentication state
    appState.isAuthenticated = true;
    appState.currentUser = user;
    
    // Save to localStorage
    const expiry = rememberMe ? Date.now() + (7 * 24 * 60 * 60 * 1000) : Date.now() + (24 * 60 * 60 * 1000);
    localStorage.setItem('dashboard_auth', JSON.stringify({
        isAuthenticated: true,
        user: user,
        expiry: expiry
    }));
    
    // Add activity
    addActivity('login', 'Logged in', 'Successfully logged into your account');
    
    // Show dashboard
    showDashboard();
    
    // Show success message
    showToast('Login successful!', 'success');
}

function logout() {
    if (confirm('Are you sure you want to logout?')) {
        // Clear authentication
        appState.isAuthenticated = false;
        appState.currentUser = null;
        localStorage.removeItem('dashboard_auth');
        
        // Add activity
        addActivity('login', 'Logged out', 'Successfully logged out');
        
        // Show login
        showLogin();
        
        showToast('Logged out successfully', 'info');
    }
}

// UI Functions
function showLogin() {
    document.getElementById('login-page').style.display = 'flex';
    document.getElementById('dashboard-page').style.display = 'none';
    document.body.classList.remove('dashboard-active');
}

function showDashboard() {
    document.getElementById('login-page').style.display = 'none';
    document.getElementById('dashboard-page').style.display = 'block';
    document.body.classList.add('dashboard-active');
    
    // Update UI with user data
    updateDashboardUI();
    
    // Load initial section
    showSection('overview');
}

function updateDashboardUI() {
    if (appState.currentUser) {
        document.getElementById('user-name').textContent = appState.currentUser.name;
        document.getElementById('first-name').value = appState.currentUser.firstName;
        document.getElementById('last-name').value = appState.currentUser.lastName;
        document.getElementById('profile-email').value = appState.currentUser.email;
    }
    
    // Update stats
    updateStats();
    
    // Load activities
    renderRecentActivity();
}

function updateStats() {
    // Calculate stats
    const totalOrders = appState.orders.length;
    const totalSpent = appState.orders.reduce((sum, order) => sum + order.total, 0);
    const wishlistCount = appState.wishlist.length;
    const lastLogin = appState.activities
        .filter(a => a.type === 'login')
        .sort((a, b) => new Date(b.time) - new Date(a.time))[1];
    
    // Update DOM
    document.getElementById('orders-count').textContent = totalOrders;
    document.getElementById('total-spent').textContent = `$${totalSpent.toFixed(2)}`;
    document.getElementById('wishlist-count').textContent = wishlistCount;
    document.getElementById('last-login').textContent = lastLogin ? formatTime(lastLogin.time) : 'First time';
}

// Section Navigation
function showSection(sectionName) {
    // Hide all sections
    document.querySelectorAll('.content-section').forEach(section => {
        section.style.display = 'none';
    });
    
    // Show selected section
    const targetSection = document.getElementById(`${sectionName}-section`);
    if (targetSection) {
        targetSection.style.display = 'block';
    }
    
    // Update navigation
    document.querySelectorAll('.sidebar-nav .nav-link').forEach(link => {
        link.classList.remove('active');
    });
    
    const activeLink = document.querySelector(`.sidebar-nav .nav-link[onclick*="${sectionName}"]`);
    if (activeLink) {
        activeLink.classList.add('active');
    }
    
    // Load section-specific data
    switch (sectionName) {
        case 'orders':
            renderOrders();
            break;
        case 'wishlist':
            renderWishlist();
            break;
        case 'activity':
            renderActivityLog();
            break;
    }
}

function showProfile() {
    showSection('profile');
}

function showSettings() {
    showSection('settings');
}

// Profile Management
function handleProfileUpdate(e) {
    e.preventDefault();
    
    const firstName = document.getElementById('first-name').value;
    const lastName = document.getElementById('last-name').value;
    const email = document.getElementById('profile-email').value;
    const phone = document.getElementById('phone').value;
    const bio = document.getElementById('bio').value;
    
    // Update user state
    appState.currentUser.firstName = firstName;
    appState.currentUser.lastName = lastName;
    appState.currentUser.email = email;
    appState.currentUser.phone = phone;
    appState.currentUser.bio = bio;
    appState.currentUser.name = `${firstName} ${lastName}`;
    
    // Update UI
    document.getElementById('user-name').textContent = appState.currentUser.name;
    
    // Save to localStorage
    const auth = JSON.parse(localStorage.getItem('dashboard_auth') || '{}');
    auth.user = appState.currentUser;
    localStorage.setItem('dashboard_auth', JSON.stringify(auth));
    
    // Add activity
    addActivity('profile', 'Profile Updated', 'Your profile information was updated');
    
    showToast('Profile updated successfully!', 'success');
}

function resetProfile() {
    if (confirm('Are you sure you want to reset your profile information?')) {
        // Reset to original values
        if (appState.currentUser) {
            document.getElementById('first-name').value = appState.currentUser.firstName;
            document.getElementById('last-name').value = appState.currentUser.lastName;
            document.getElementById('profile-email').value = appState.currentUser.email;
            document.getElementById('phone').value = appState.currentUser.phone || '';
            document.getElementById('bio').value = appState.currentUser.bio || '';
        }
        
        showToast('Profile reset to original values', 'info');
    }
}

// Password Management
function handlePasswordChange(e) {
    e.preventDefault();
    
    const currentPassword = document.getElementById('current-password').value;
    const newPassword = document.getElementById('new-password').value;
    const confirmPassword = document.getElementById('confirm-password').value;
    
    // Validation
    if (newPassword.length < 8) {
        showToast('New password must be at least 8 characters long', 'error');
        return;
    }
    
    if (newPassword !== confirmPassword) {
        showToast('Passwords do not match', 'error');
        return;
    }
    
    // Simulate password change
    setTimeout(() => {
        // Clear form
        document.getElementById('password-form').reset();
        
        // Add activity
        addActivity('settings', 'Password Changed', 'Your password was successfully updated');
        
        showToast('Password changed successfully!', 'success');
    }, 1000);
}

// Settings Management
function saveNotificationSettings() {
    const emailNotifications = document.getElementById('email-notifications').checked;
    const smsNotifications = document.getElementById('sms-notifications').checked;
    const marketingEmails = document.getElementById('marketing-emails').checked;
    
    // Save settings (in a real app, send to server)
    const settings = {
        emailNotifications,
        smsNotifications,
        marketingEmails
    };
    
    localStorage.setItem('notification_settings', JSON.stringify(settings));
    
    // Add activity
    addActivity('settings', 'Settings Changed', 'Notification preferences updated');
    
    showToast('Notification settings saved!', 'success');
}

// Activity Management
function addActivity(type, title, description) {
    const activity = {
        type,
        title,
        description,
        time: new Date().toISOString(),
        icon: getActivityIcon(type)
    };
    
    appState.activities.unshift(activity);
    
    // Keep only last 50 activities
    if (appState.activities.length > 50) {
        appState.activities = appState.activities.slice(0, 50);
    }
    
    // Update recent activity if on overview
    if (document.getElementById('overview-section').style.display !== 'none') {
        renderRecentActivity();
    }
}

function getActivityIcon(type) {
    const icons = {
        'login': 'login',
        'order': 'order',
        'profile': 'profile',
        'settings': 'settings'
    };
    return icons[type] || 'login';
}

function renderRecentActivity() {
    const container = document.getElementById('recent-activity');
    const recentActivities = appState.activities.slice(0, 5);
    
    if (recentActivities.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-history"></i>
                <h5>No recent activity</h5>
                <p>Your activity will appear here</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = recentActivities.map(activity => `
        <div class="activity-item">
            <div class="activity-icon ${activity.icon}">
                <i class="fas fa-${getActivityIconClass(activity.icon)}"></i>
            </div>
            <div class="activity-details">
                <div class="activity-title">${activity.title}</div>
                <div class="activity-description">${activity.description}</div>
                <div class="activity-time">${formatTime(activity.time)}</div>
            </div>
        </div>
    `).join('');
}

function renderActivityLog() {
    const container = document.getElementById('activity-log');
    
    if (appState.activities.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-history"></i>
                <h5>No activity recorded</h5>
                <p>Your activities will appear here</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = appState.activities.map(activity => `
        <div class="activity-item">
            <div class="activity-icon ${activity.icon}">
                <i class="fas fa-${getActivityIconClass(activity.icon)}"></i>
            </div>
            <div class="activity-details">
                <div class="activity-title">${activity.title}</div>
                <div class="activity-description">${activity.description}</div>
                <div class="activity-time">${formatFullTime(activity.time)}</div>
            </div>
        </div>
    `).join('');
}

function getActivityIconClass(iconType) {
    const classes = {
        'login': 'sign-in-alt',
        'order': 'shopping-bag',
        'profile': 'user',
        'settings': 'cog'
    };
    return classes[iconType] || 'circle';
}

// Orders Management
function renderOrders() {
    const container = document.getElementById('orders-list');
    
    if (appState.orders.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-shopping-bag"></i>
                <h5>No orders yet</h5>
                <p>When you place orders, they will appear here</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = appState.orders.map(order => `
        <div class="order-item">
            <div class="order-info">
                <h6>${order.id}</h6>
                <p>${formatFullTime(order.date)} • ${order.items} items</p>
                <p><strong>Total: $${order.total.toFixed(2)}</strong></p>
            </div>
            <div class="order-status ${order.status}">
                ${order.status}
            </div>
        </div>
    `).join('');
}

// Wishlist Management
function renderWishlist() {
    const container = document.getElementById('wishlist-items');
    
    if (appState.wishlist.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-heart"></i>
                <h5>Your wishlist is empty</h5>
                <p>Save items you love for later!</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = appState.wishlist.map(item => `
        <div class="wishlist-item">
            <div class="wishlist-image">
                <img src="${item.image}" alt="${item.name}">
            </div>
            <div class="wishlist-details">
                <div class="wishlist-name">${item.name}</div>
                <div class="wishlist-price">$${item.price}</div>
                <div class="wishlist-actions">
                    <button class="btn btn-sm btn-primary">Add to Cart</button>
                    <button class="btn btn-sm btn-outline-secondary" onclick="removeFromWishlist(${item.id})">Remove</button>
                </div>
            </div>
        </div>
    `).join('');
}

function removeFromWishlist(itemId) {
    if (confirm('Remove this item from your wishlist?')) {
        appState.wishlist = appState.wishlist.filter(item => item.id !== itemId);
        renderWishlist();
        updateStats();
        showToast('Item removed from wishlist', 'info');
    }
}

// Theme Management
function toggleTheme() {
    const currentTheme = appState.theme;
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    
    appState.theme = newTheme;
    document.body.classList.toggle('dark-theme', newTheme === 'dark');
    
    // Update icon
    const themeIcon = document.getElementById('theme-icon');
    themeIcon.className = newTheme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
    
    // Save preference
    localStorage.setItem('dashboard_theme', newTheme);
    
    showToast(`${newTheme === 'dark' ? 'Dark' : 'Light'} theme activated`, 'info');
}

// Utility Functions
function formatTime(timeString) {
    const now = new Date();
    const time = new Date(timeString);
    const diffMs = now - time;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);
    
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    
    return time.toLocaleDateString();
}

function formatFullTime(timeString) {
    const time = new Date(timeString);
    return time.toLocaleDateString() + ' at ' + time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function togglePassword(fieldId) {
    const field = document.getElementById(fieldId);
    const button = field.nextElementSibling;
    const icon = button.querySelector('i');
    
    if (field.type === 'password') {
        field.type = 'text';
        icon.classList.remove('fa-eye');
        icon.classList.add('fa-eye-slash');
    } else {
        field.type = 'password';
        icon.classList.remove('fa-eye-slash');
        icon.classList.add('fa-eye');
    }
}

function showToast(message, type = 'info') {
    // Create toast container if it doesn't exist
    let toastContainer = document.querySelector('.toast-container');
    if (!toastContainer) {
        toastContainer = document.createElement('div');
        toastContainer.className = 'toast-container';
        toastContainer.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 1050;
        `;
        document.body.appendChild(toastContainer);
    }
    
    // Create toast
    const toast = document.createElement('div');
    toast.className = `toast align-items-center text-white bg-${type === 'error' ? 'danger' : type} border-0`;
    toast.setAttribute('role', 'alert');
    toast.innerHTML = `
        <div class="d-flex">
            <div class="toast-body">
                ${message}
            </div>
            <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button>
        </div>
    `;
    
    toastContainer.appendChild(toast);
    
    // Show toast
    const bsToast = new bootstrap.Toast(toast);
    bsToast.show();
    
    // Remove after hidden
    toast.addEventListener('hidden.bs.toast', () => {
        toast.remove();
    });
}

// State Management
function loadAppState() {
    // Load theme
    const savedTheme = localStorage.getItem('dashboard_theme');
    if (savedTheme) {
        appState.theme = savedTheme;
        document.body.classList.toggle('dark-theme', savedTheme === 'dark');
        const themeIcon = document.getElementById('theme-icon');
        if (themeIcon) {
            themeIcon.className = savedTheme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
        }
    }
    
    // Load notification settings
    const savedSettings = localStorage.getItem('notification_settings');
    if (savedSettings) {
        const settings = JSON.parse(savedSettings);
        document.getElementById('email-notifications').checked = settings.emailNotifications;
        document.getElementById('sms-notifications').checked = settings.smsNotifications;
        document.getElementById('marketing-emails').checked = settings.marketingEmails;
    }
}

function saveAppState() {
    // Save current state (excluding sensitive data)
    const stateToSave = {
        theme: appState.theme,
        activities: appState.activities,
        orders: appState.orders,
        wishlist: appState.wishlist
    };
    localStorage.setItem('dashboard_state', JSON.stringify(stateToSave));
}

// Export functions for global access
window.logout = logout;
window.showSection = showSection;
window.showProfile = showProfile;
window.showSettings = showSettings;
window.toggleTheme = toggleTheme;
window.togglePassword = togglePassword;
window.resetProfile = resetProfile;
window.saveNotificationSettings = saveNotificationSettings;
window.removeFromWishlist = removeFromWishlist;

// Auto-save state periodically
setInterval(saveAppState, 30000); // Save every 30 seconds

// Handle page visibility change
document.addEventListener('visibilitychange', function() {
    if (document.hidden) {
        saveAppState();
    }
});

// Handle before unload
window.addEventListener('beforeunload', function() {
    saveAppState();
});
