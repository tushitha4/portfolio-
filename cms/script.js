// Simple CMS JavaScript

// State Management
const cmsState = {
    currentSection: 'dashboard',
    editingContent: null,
    contentTypes: {
        hero: [],
        features: [],
        testimonials: [],
        categories: [],
        cta: [],
        media: [],
        footer: {}
    },
    activities: []
};

// Sample data
const sampleContent = {
    hero: [
        {
            id: 1,
            title: 'Build Amazing Digital Experiences',
            subtitle: 'Transform your ideas into reality with cutting-edge technology',
            description: 'Join thousands of satisfied customers worldwide',
            image: 'https://via.placeholder.com/600x400',
            status: 'published',
            order: 1
        }
    ],
    features: [
        {
            id: 1,
            title: 'Lightning Fast',
            subtitle: 'Optimized performance',
            description: 'Cutting-edge technology stack for maximum speed',
            image: 'https://via.placeholder.com/100x100',
            status: 'published',
            order: 1
        },
        {
            id: 2,
            title: 'Secure & Reliable',
            subtitle: 'Enterprise-grade security',
            description: '99.9% uptime guarantee with advanced protection',
            image: 'https://via.placeholder.com/100x100',
            status: 'published',
            order: 2
        }
    ],
    testimonials: [
        {
            id: 1,
            title: 'Sarah Johnson',
            subtitle: 'CEO, TechStart',
            description: 'This platform transformed our business completely. The features are amazing and the support team is incredible!',
            image: 'https://via.placeholder.com/80x80',
            status: 'published',
            order: 1
        }
    ],
    categories: [
        {
            id: 1,
            title: 'E-Commerce',
            subtitle: 'Complete online store solutions',
            description: 'Payment integration and inventory management',
            image: 'https://via.placeholder.com/100x100',
            status: 'published',
            order: 1
        },
        {
            id: 2,
            title: 'Education',
            subtitle: 'Interactive learning platforms',
            description: 'Course management and student engagement',
            image: 'https://via.placeholder.com/100x100',
            status: 'published',
            order: 2
        }
    ],
    cta: [
        {
            id: 1,
            title: 'Ready to Get Started?',
            subtitle: 'Join thousands of successful businesses',
            description: 'Start your free trial today',
            image: 'https://via.placeholder.com/600x300',
            status: 'published',
            order: 1
        }
    ],
    media: [
        {
            id: 1,
            name: 'Hero Background',
            type: 'image',
            url: 'https://via.placeholder.com/800x400',
            alt: 'Hero section background'
        },
        {
            id: 2,
            name: 'Product Demo',
            type: 'video',
            url: 'https://example.com/demo.mp4',
            alt: 'Product demonstration video'
        }
    ],
    footer: {
        company: 'TechPro',
        tagline: 'Building digital experiences that matter',
        description: 'We create innovative solutions for modern businesses',
        email: 'contact@techpro.com',
        phone: '+1 (555) 123-4567',
        address: '123 Tech Street, Silicon Valley, CA',
        social: {
            facebook: 'https://facebook.com/techpro',
            twitter: 'https://twitter.com/techpro',
            linkedin: 'https://linkedin.com/company/techpro',
            instagram: 'https://instagram.com/techpro'
        }
    }
};

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeCMS();
});

function initializeCMS() {
    // Load saved state
    loadCMSState();
    
    // Load sample data if empty
    if (Object.keys(cmsState.contentTypes.hero).length === 0) {
        cmsState.contentTypes = JSON.parse(JSON.stringify(sampleContent));
    }
    
    // Load initial section
    showSection('dashboard');
    
    // Initialize event listeners
    initializeEventListeners();
    
    // Update stats
    updateStats();
    
    // Load activities
    loadActivities();
}

function initializeEventListeners() {
    // Content form submission
    document.getElementById('content-form').addEventListener('submit', function(e) {
        e.preventDefault();
        saveContent();
    });
    
    // Footer form submission
    document.getElementById('footer-form').addEventListener('submit', function(e) {
        e.preventDefault();
        saveFooterSettings();
    });
    
    // Media upload form
    document.getElementById('media-upload-form').addEventListener('submit', function(e) {
        e.preventDefault();
        saveMedia();
    });
    
    // Keyboard shortcuts
    document.addEventListener('keydown', function(e) {
        // Ctrl/Cmd + S to save
        if ((e.ctrlKey || e.metaKey) && e.key === 's') {
            e.preventDefault();
            if (cmsState.editingContent) {
                saveContent();
            }
        }
        
        // Ctrl/Cmd + N for new content
        if ((e.ctrlKey || e.metaKey) && e.key === 'n') {
            e.preventDefault();
            addNewContentForCurrentSection();
        }
        
        // Escape to close modals
        if (e.key === 'Escape') {
            closeAllModals();
        }
    });
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
    
    // Update current section
    cmsState.currentSection = sectionName;
    
    // Load section-specific content
    loadSectionContent(sectionName);
}

function loadSectionContent(sectionName) {
    switch (sectionName) {
        case 'dashboard':
            renderDashboard();
            break;
        case 'hero':
            renderHeroContent();
            break;
        case 'features':
            renderFeatures();
            break;
        case 'testimonials':
            renderTestimonials();
            break;
        case 'categories':
            renderCategories();
            break;
        case 'media':
            renderMedia();
            break;
        case 'cta':
            renderCTA();
            break;
        case 'footer':
            loadFooterSettings();
            break;
    }
}

// Dashboard Functions
function renderDashboard() {
    updateStats();
    renderRecentActivity();
}

function updateStats() {
    const totalContent = Object.values(cmsState.contentTypes).reduce((total, content) => {
        if (Array.isArray(content)) {
            return total + content.length;
        } else if (typeof content === 'object' && content !== null) {
            return total + 1;
        }
        return total;
    }, 0);
    
    const publishedContent = Object.values(cmsState.contentTypes).reduce((total, content) => {
        if (Array.isArray(content)) {
            return total + content.filter(item => item.status === 'published').length;
        }
        return total;
    }, 0);
    
    const draftContent = totalContent - publishedContent;
    
    document.getElementById('total-pages').textContent = totalContent;
    document.getElementById('published-content').textContent = publishedContent;
    document.getElementById('draft-content').textContent = draftContent;
    document.getElementById('last-updated').textContent = 'Today';
}

function renderRecentActivity() {
    const container = document.getElementById('recent-activity');
    const recentActivities = cmsState.activities.slice(0, 5);
    
    if (recentActivities.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-history"></i>
                <h5>No recent activity</h5>
                <p>Your CMS activity will appear here</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = recentActivities.map(activity => `
        <div class="activity-item">
            <div class="activity-icon ${activity.type}">
                <i class="fas fa-${getActivityIcon(activity.type)}"></i>
            </div>
            <div class="activity-details">
                <div class="activity-title">${activity.title}</div>
                <div class="activity-description">${activity.description}</div>
                <div class="activity-time">${formatTime(activity.time)}</div>
            </div>
        </div>
    `).join('');
}

// Content Management Functions
function addHeroContent() {
    openContentModal('hero');
}

function addFeature() {
    openContentModal('features');
}

function addTestimonial() {
    openContentModal('testimonials');
}

function addCategory() {
    openContentModal('categories');
}

function addCTA() {
    openContentModal('cta');
}

function openContentModal(contentType, contentId = null) {
    cmsState.editingContent = {
        type: contentType,
        id: contentId
    };
    
    const modal = new bootstrap.Modal(document.getElementById('contentModal'));
    const modalTitle = document.getElementById('modal-title');
    
    if (contentId) {
        // Edit existing content
        const content = cmsState.contentTypes[contentType].find(item => item.id === contentId);
        if (content) {
            modalTitle.textContent = `Edit ${contentType.charAt(0).toUpperCase() + contentType.slice(1)} Content`;
            document.getElementById('content-title').value = content.title;
            document.getElementById('content-subtitle').value = content.subtitle || '';
            document.getElementById('content-description').value = content.description || '';
            document.getElementById('content-image').value = content.image || '';
            document.getElementById('content-status').value = content.status;
            document.getElementById('content-order').value = content.order || 0;
            document.getElementById('delete-btn').style.display = 'inline-block';
        }
    } else {
        // Add new content
        modalTitle.textContent = `Add ${contentType.charAt(0).toUpperCase() + contentType.slice(1)} Content`;
        document.getElementById('content-form').reset();
        document.getElementById('content-status').value = 'published';
        document.getElementById('content-order').value = cmsState.contentTypes[contentType].length + 1;
        document.getElementById('delete-btn').style.display = 'none';
    }
    
    modal.show();
}

function saveContent() {
    const contentType = cmsState.editingContent.type;
    const contentId = cmsState.editingContent.id;
    
    const contentData = {
        title: document.getElementById('content-title').value,
        subtitle: document.getElementById('content-subtitle').value,
        description: document.getElementById('content-description').value,
        image: document.getElementById('content-image').value,
        status: document.getElementById('content-status').value,
        order: parseInt(document.getElementById('content-order').value) || 0
    };
    
    if (contentId) {
        // Update existing content
        const index = cmsState.contentTypes[contentType].findIndex(item => item.id === contentId);
        if (index > -1) {
            cmsState.contentTypes[contentType][index] = { ...cmsState.contentTypes[contentType][index], ...contentData };
            addActivity('update', `Updated ${contentType} content`, `${contentData.title} has been updated`);
        }
    } else {
        // Add new content
        const newContent = {
            id: Date.now(),
            ...contentData
        };
        cmsState.contentTypes[contentType].push(newContent);
        addActivity('create', `Added ${contentType} content`, `${contentData.title} has been added`);
    }
    
    // Sort by order
    cmsState.contentTypes[contentType].sort((a, b) => a.order - b.order);
    
    // Save state
    saveCMSState();
    
    // Close modal
    bootstrap.Modal.getInstance(document.getElementById('contentModal')).hide();
    
    // Reload section
    loadSectionContent(contentType);
    
    // Update stats
    updateStats();
    
    // Show success message
    showToast('Content saved successfully!', 'success');
}

function deleteContent() {
    if (!cmsState.editingContent.id) return;
    
    if (confirm('Are you sure you want to delete this content?')) {
        const contentType = cmsState.editingContent.type;
        const contentId = cmsState.editingContent.id;
        
        const content = cmsState.contentTypes[contentType].find(item => item.id === contentId);
        if (content) {
            cmsState.contentTypes[contentType] = cmsState.contentTypes[contentType].filter(item => item.id !== contentId);
            addActivity('delete', `Deleted ${contentType} content`, `${content.title} has been deleted`);
            
            // Save state
            saveCMSState();
            
            // Close modal
            bootstrap.Modal.getInstance(document.getElementById('contentModal')).hide();
            
            // Reload section
            loadSectionContent(contentType);
            
            // Update stats
            updateStats();
            
            // Show success message
            showToast('Content deleted successfully!', 'success');
        }
    }
}

// Render Functions
function renderHeroContent() {
    renderContentList('hero', 'hero-content-list');
}

function renderFeatures() {
    renderContentList('features', 'features-list');
}

function renderTestimonials() {
    renderContentList('testimonials', 'testimonials-list');
}

function renderCategories() {
    renderContentList('categories', 'categories-list');
}

function renderCTA() {
    renderContentList('cta', 'cta-content-list');
}

function renderContentList(contentType, containerId) {
    const container = document.getElementById(containerId);
    const content = cmsState.contentTypes[contentType];
    
    if (content.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-folder-open"></i>
                <h5>No ${contentType} content yet</h5>
                <p>Add your first ${contentType} content to get started</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = content.map(item => `
        <div class="content-item" draggable="true" data-id="${item.id}">
            <div class="content-item-header">
                <div>
                    <div class="content-item-title">${item.title}</div>
                    ${item.subtitle ? `<div class="content-item-subtitle">${item.subtitle}</div>` : ''}
                </div>
                <div>
                    <span class="content-item-status ${item.status}">${item.status}</span>
                </div>
            </div>
            <div class="d-flex align-items-start">
                ${item.image ? `
                    <div class="content-item-image">
                        <img src="${item.image}" alt="${item.title}">
                    </div>
                ` : ''}
                <div class="flex-grow-1">
                    ${item.description ? `<div class="content-item-description">${item.description}</div>` : ''}
                    <div class="content-item-actions">
                        <button class="btn btn-sm btn-outline-primary" onclick="openContentModal('${contentType}', ${item.id})">
                            <i class="fas fa-edit me-1"></i>Edit
                        </button>
                        <button class="btn btn-sm btn-outline-success" onclick="toggleStatus('${contentType}', ${item.id})">
                            <i class="fas fa-${item.status === 'published' ? 'eye-slash' : 'eye'} me-1"></i>
                            ${item.status === 'published' ? 'Unpublish' : 'Publish'}
                        </button>
                        <button class="btn btn-sm btn-outline-danger" onclick="deleteContentById('${contentType}', ${item.id})">
                            <i class="fas fa-trash me-1"></i>Delete
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `).join('');
    
    // Initialize drag and drop
    initializeDragAndDrop(contentType);
}

function toggleStatus(contentType, contentId) {
    const content = cmsState.contentTypes[contentType].find(item => item.id === contentId);
    if (content) {
        content.status = content.status === 'published' ? 'draft' : 'published';
        const action = content.status === 'published' ? 'published' : 'unpublished';
        addActivity('publish', `${action.charAt(0).toUpperCase() + action.slice(1)} ${contentType} content`, `${content.title} has been ${action}`);
        
        saveCMSState();
        loadSectionContent(contentType);
        updateStats();
        
        showToast(`Content ${action}!`, 'success');
    }
}

function deleteContentById(contentType, contentId) {
    if (confirm('Are you sure you want to delete this content?')) {
        const content = cmsState.contentTypes[contentType].find(item => item.id === contentId);
        if (content) {
            cmsState.contentTypes[contentType] = cmsState.contentTypes[contentType].filter(item => item.id !== contentId);
            addActivity('delete', `Deleted ${contentType} content`, `${content.title} has been deleted`);
            
            saveCMSState();
            loadSectionContent(contentType);
            updateStats();
            
            showToast('Content deleted successfully!', 'success');
        }
    }
}

// Media Management
function uploadMedia() {
    const modal = new bootstrap.Modal(document.getElementById('mediaModal'));
    document.getElementById('media-upload-form').reset();
    modal.show();
}

function saveMedia() {
    const mediaData = {
        id: Date.now(),
        name: document.getElementById('media-name').value,
        type: document.getElementById('media-type').value,
        url: document.getElementById('media-url').value,
        alt: document.getElementById('media-alt').value
    };
    
    cmsState.contentTypes.media.push(mediaData);
    addActivity('create', 'Uploaded media', `${mediaData.name} has been uploaded`);
    
    saveCMSState();
    bootstrap.Modal.getInstance(document.getElementById('mediaModal')).hide();
    renderMedia();
    
    showToast('Media uploaded successfully!', 'success');
}

function renderMedia() {
    const container = document.getElementById('media-grid');
    const media = cmsState.contentTypes.media;
    
    if (media.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-photo-video"></i>
                <h5>No media files yet</h5>
                <p>Upload your first media file to get started</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = media.map(item => `
        <div class="media-item">
            <div class="media-item-image">
                ${item.type === 'image' ? 
                    `<img src="${item.url}" alt="${item.alt || item.name}">` :
                    `<i class="fas fa-video"></i>`
                }
            </div>
            <div class="media-item-info">
                <div class="media-item-name">${item.name}</div>
                <div class="media-item-type">${item.type}</div>
            </div>
            <div class="media-item-actions">
                <button class="btn btn-sm btn-outline-primary" onclick="copyMediaUrl('${item.url}')">
                    <i class="fas fa-copy"></i>
                </button>
                <button class="btn btn-sm btn-outline-danger" onclick="deleteMedia(${item.id})">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        </div>
    `).join('');
}

function filterMedia(type) {
    const buttons = document.querySelectorAll('.media-filters .btn');
    buttons.forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
    
    const media = cmsState.contentTypes.media;
    const filteredMedia = type === 'all' ? media : media.filter(item => item.type === type);
    
    const container = document.getElementById('media-grid');
    if (filteredMedia.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-photo-video"></i>
                <h5>No ${type} files found</h5>
                <p>Upload some ${type} files to see them here</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = filteredMedia.map(item => `
        <div class="media-item">
            <div class="media-item-image">
                ${item.type === 'image' ? 
                    `<img src="${item.url}" alt="${item.alt || item.name}">` :
                    `<i class="fas fa-video"></i>`
                }
            </div>
            <div class="media-item-info">
                <div class="media-item-name">${item.name}</div>
                <div class="media-item-type">${item.type}</div>
            </div>
            <div class="media-item-actions">
                <button class="btn btn-sm btn-outline-primary" onclick="copyMediaUrl('${item.url}')">
                    <i class="fas fa-copy"></i>
                </button>
                <button class="btn btn-sm btn-outline-danger" onclick="deleteMedia(${item.id})">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        </div>
    `).join('');
}

function copyMediaUrl(url) {
    navigator.clipboard.writeText(url).then(() => {
        showToast('URL copied to clipboard!', 'success');
    });
}

function deleteMedia(mediaId) {
    if (confirm('Are you sure you want to delete this media file?')) {
        const media = cmsState.contentTypes.media.find(item => item.id === mediaId);
        if (media) {
            cmsState.contentTypes.media = cmsState.contentTypes.media.filter(item => item.id !== mediaId);
            addActivity('delete', 'Deleted media', `${media.name} has been deleted`);
            
            saveCMSState();
            renderMedia();
            
            showToast('Media deleted successfully!', 'success');
        }
    }
}

// Footer Management
function loadFooterSettings() {
    const footer = cmsState.contentTypes.footer;
    document.getElementById('footer-company').value = footer.company || '';
    document.getElementById('footer-tagline').value = footer.tagline || '';
    document.getElementById('footer-description').value = footer.description || '';
    document.getElementById('footer-email').value = footer.email || '';
    document.getElementById('footer-phone').value = footer.phone || '';
    document.getElementById('footer-address').value = footer.address || '';
    
    // Load social links
    const socialInputs = document.querySelectorAll('#footer-section input[type="url"]');
    const socialLinks = ['facebook', 'twitter', 'linkedin', 'instagram'];
    socialLinks.forEach((platform, index) => {
        if (socialInputs[index] && footer.social && footer.social[platform]) {
            socialInputs[index].value = footer.social[platform];
        }
    });
}

function saveFooterSettings() {
    const footer = {
        company: document.getElementById('footer-company').value,
        tagline: document.getElementById('footer-tagline').value,
        description: document.getElementById('footer-description').value,
        email: document.getElementById('footer-email').value,
        phone: document.getElementById('footer-phone').value,
        address: document.getElementById('footer-address').value,
        social: {}
    };
    
    // Save social links
    const socialInputs = document.querySelectorAll('#footer-section input[type="url"]');
    const socialLinks = ['facebook', 'twitter', 'linkedin', 'instagram'];
    socialLinks.forEach((platform, index) => {
        if (socialInputs[index]) {
            footer.social[platform] = socialInputs[index].value;
        }
    });
    
    cmsState.contentTypes.footer = footer;
    addActivity('update', 'Updated footer settings', 'Footer configuration has been updated');
    
    saveCMSState();
    showToast('Footer settings saved successfully!', 'success');
}

// Activity Management
function addActivity(type, title, description) {
    const activity = {
        type,
        title,
        description,
        time: new Date().toISOString()
    };
    
    cmsState.activities.unshift(activity);
    
    // Keep only last 50 activities
    if (cmsState.activities.length > 50) {
        cmsState.activities = cmsState.activities.slice(0, 50);
    }
    
    // Update recent activity if on dashboard
    if (cmsState.currentSection === 'dashboard') {
        renderRecentActivity();
    }
}

function loadActivities() {
    // Load some sample activities if empty
    if (cmsState.activities.length === 0) {
        cmsState.activities = [
            {
                type: 'create',
                title: 'Created hero content',
                description: 'Build Amazing Digital Experiences has been added',
                time: new Date(Date.now() - 3600000).toISOString()
            },
            {
                type: 'update',
                title: 'Updated features',
                description: 'Feature list has been modified',
                time: new Date(Date.now() - 7200000).toISOString()
            },
            {
                type: 'publish',
                title: 'Published testimonials',
                description: 'Testimonials section is now live',
                time: new Date(Date.now() - 10800000).toISOString()
            }
        ];
    }
}

// Drag and Drop
function initializeDragAndDrop(contentType) {
    const items = document.querySelectorAll(`#${contentType}-section .content-item`);
    
    items.forEach(item => {
        item.addEventListener('dragstart', handleDragStart);
        item.addEventListener('dragend', handleDragEnd);
        item.addEventListener('dragover', handleDragOver);
        item.addEventListener('drop', handleDrop);
    });
}

let draggedElement = null;

function handleDragStart(e) {
    draggedElement = this;
    this.classList.add('dragging');
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/html', this.innerHTML);
}

function handleDragEnd(e) {
    this.classList.remove('dragging');
    
    // Update order in state
    const contentType = cmsState.currentSection;
    const items = document.querySelectorAll(`#${contentType}-section .content-item`);
    const newOrder = [];
    
    items.forEach(item => {
        const id = parseInt(item.dataset.id);
        const content = cmsState.contentTypes[contentType].find(c => c.id === id);
        if (content) {
            newOrder.push(content);
        }
    });
    
    cmsState.contentTypes[contentType] = newOrder;
    saveCMSState();
}

function handleDragOver(e) {
    if (e.preventDefault) {
        e.preventDefault();
    }
    
    e.dataTransfer.dropEffect = 'move';
    
    const afterElement = getDragAfterElement(this.parentNode, e.clientY);
    if (afterElement == null) {
        this.parentNode.appendChild(draggedElement);
    } else {
        this.parentNode.insertBefore(draggedElement, afterElement);
    }
    
    return false;
}

function handleDrop(e) {
    if (e.stopPropagation) {
        e.stopPropagation();
    }
    
    return false;
}

function getDragAfterElement(container, y) {
    const draggableElements = [...container.querySelectorAll('.content-item:not(.dragging)')];
    
    return draggableElements.reduce((closest, child) => {
        const box = child.getBoundingClientRect();
        const offset = y - box.top - box.height / 2;
        
        if (offset < 0 && offset > closest.offset) {
            return { offset: offset, element: child };
        } else {
            return closest;
        }
    }, { offset: Number.NEGATIVE_INFINITY }).element;
}

// Utility Functions
function getActivityIcon(type) {
    const icons = {
        'create': 'plus',
        'update': 'edit',
        'delete': 'trash',
        'publish': 'eye'
    };
    return icons[type] || 'circle';
}

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

function closeAllModals() {
    document.querySelectorAll('.modal.show').forEach(modal => {
        bootstrap.Modal.getInstance(modal).hide();
    });
}

function addNewContentForCurrentSection() {
    const section = cmsState.currentSection;
    if (['hero', 'features', 'testimonials', 'categories', 'cta'].includes(section)) {
        openContentModal(section);
    }
}

// State Management
function saveCMSState() {
    const stateToSave = {
        contentTypes: cmsState.contentTypes,
        activities: cmsState.activities
    };
    localStorage.setItem('cms_state', JSON.stringify(stateToSave));
}

function loadCMSState() {
    const saved = localStorage.getItem('cms_state');
    if (saved) {
        const data = JSON.parse(saved);
        cmsState.contentTypes = data.contentTypes || cmsState.contentTypes;
        cmsState.activities = data.activities || cmsState.activities;
    }
}

// Preview Functions
function previewSite() {
    const modal = new bootstrap.Modal(document.getElementById('previewModal'));
    const iframe = document.getElementById('preview-frame');
    
    // Generate preview HTML (simplified version)
    const previewHTML = generatePreviewHTML();
    const blob = new Blob([previewHTML], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    
    iframe.src = url;
    modal.show();
    
    // Clean up URL when modal is hidden
    document.getElementById('previewModal').addEventListener('hidden.bs.modal', function() {
        URL.revokeObjectURL(url);
    }, { once: true });
}

function generatePreviewHTML() {
    const footer = cmsState.contentTypes.footer;
    const hero = cmsState.contentTypes.hero[0];
    
    return `
    <!DOCTYPE html>
    <html>
    <head>
        <title>Site Preview</title>
        <style>
            body { font-family: Arial, sans-serif; margin: 0; }
            .hero { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 100px 20px; text-align: center; }
            .hero h1 { font-size: 3em; margin-bottom: 20px; }
            .hero p { font-size: 1.2em; margin-bottom: 30px; }
            .content { padding: 50px 20px; max-width: 1200px; margin: 0 auto; }
            .footer { background: #333; color: white; padding: 40px 20px; text-align: center; }
        </style>
    </head>
    <body>
        ${hero ? `
        <section class="hero">
            <h1>${hero.title}</h1>
            <p>${hero.subtitle}</p>
            <p>${hero.description}</p>
        </section>
        ` : ''}
        
        <div class="content">
            <h2>Welcome to your website</h2>
            <p>This is a preview of your landing page with the CMS content you've configured.</p>
        </div>
        
        <footer class="footer">
            <h3>${footer.company || 'Your Company'}</h3>
            <p>${footer.tagline || ''}</p>
            <p>${footer.description || ''}</p>
            <p>&copy; 2024 ${footer.company || 'Your Company'}. All rights reserved.</p>
        </footer>
    </body>
    </html>
    `;
}

// Logout
function logout() {
    if (confirm('Are you sure you want to logout?')) {
        // Clear any session data
        localStorage.removeItem('cms_session');
        
        // Redirect to login (in a real app)
        showToast('Logged out successfully', 'info');
        
        // In a real app, you would redirect to login page
        setTimeout(() => {
            location.reload();
        }, 1000);
    }
}

// Export functions for global access
window.showSection = showSection;
window.addHeroContent = addHeroContent;
window.addFeature = addFeature;
window.addTestimonial = addTestimonial;
window.addCategory = addCategory;
window.addCTA = addCTA;
window.uploadMedia = uploadMedia;
window.filterMedia = filterMedia;
window.copyMediaUrl = copyMediaUrl;
window.deleteMedia = deleteMedia;
window.deleteContent = deleteContent;
window.saveContent = saveContent;
window.toggleStatus = toggleStatus;
window.deleteContentById = deleteContentById;
window.previewSite = previewSite;
window.logout = logout;

// Auto-save state periodically
setInterval(saveCMSState, 30000); // Save every 30 seconds

// Handle page visibility change
document.addEventListener('visibilitychange', function() {
    if (document.hidden) {
        saveCMSState();
    }
});

// Handle before unload
window.addEventListener('beforeunload', function() {
    saveCMSState();
});
