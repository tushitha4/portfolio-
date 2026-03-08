// Master Form Suite JavaScript

document.addEventListener('DOMContentLoaded', function() {
    initializeForms();
    initializeValidation();
    initializeMultiStepForm();
    initializePasswordToggle();
});

// Initialize all forms
function initializeForms() {
    // Get Matched Form
    const getMatchedForm = document.getElementById('get-matched-form-element');
    if (getMatchedForm) {
        getMatchedForm.addEventListener('submit', function(e) {
            e.preventDefault();
            if (validateGetMatchedForm()) {
                submitGetMatchedForm();
            }
        });
    }

    // Contact Form
    const contactForm = document.getElementById('contact-form-element');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            if (validateContactForm()) {
                submitContactForm();
            }
        });
    }

    // Login Form
    const loginForm = document.getElementById('login-form-element');
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            if (validateLoginForm()) {
                submitLoginForm();
            }
        });
    }

    // Signup Form
    const signupForm = document.getElementById('signup-form-element');
    if (signupForm) {
        signupForm.addEventListener('submit', function(e) {
            e.preventDefault();
            if (validateSignupForm()) {
                submitSignupForm();
            }
        });
    }

    // Newsletter Form
    const newsletterForm = document.getElementById('newsletter-form-element');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            if (validateNewsletterForm()) {
                submitNewsletterForm();
            }
        });
    }
}

// Form Navigation
function showForm(formType) {
    // Hide all forms
    document.querySelectorAll('.form-container').forEach(form => {
        form.classList.remove('active');
    });
    
    // Remove active class from all buttons
    document.querySelectorAll('header .btn-group .btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // Show selected form
    document.getElementById(`${formType}-form`).classList.add('active');
    
    // Add active class to clicked button
    event.target.classList.add('active');
    
    // Reset form when switching
    resetForm(formType);
}

// Multi-step Form Functions
let currentStep = {
    'get-matched': 1
};

function nextStep(formType) {
    const currentStepNum = currentStep[formType];
    const nextStepNum = currentStepNum + 1;
    
    if (validateStep(formType, currentStepNum)) {
        // Hide current step
        document.querySelector(`#${formType}-form-element .form-step[data-step="${currentStepNum}"]`).classList.remove('active');
        
        // Show next step
        document.querySelector(`#${formType}-form-element .form-step[data-step="${nextStepNum}"]`).classList.add('active');
        
        // Update step indicators
        updateStepIndicators(formType, nextStepNum);
        
        // Update progress bar
        updateProgressBar(formType, nextStepNum);
        
        // Update current step
        currentStep[formType] = nextStepNum;
        
        // Scroll to top of form
        document.querySelector(`#${formType}-form .card`).scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}

function previousStep(formType) {
    const currentStepNum = currentStep[formType];
    const prevStepNum = currentStepNum - 1;
    
    if (prevStepNum >= 1) {
        // Hide current step
        document.querySelector(`#${formType}-form-element .form-step[data-step="${currentStepNum}"]`).classList.remove('active');
        
        // Show previous step
        document.querySelector(`#${formType}-form-element .form-step[data-step="${prevStepNum}"]`).classList.add('active');
        
        // Update step indicators
        updateStepIndicators(formType, prevStepNum);
        
        // Update progress bar
        updateProgressBar(formType, prevStepNum);
        
        // Update current step
        currentStep[formType] = prevStepNum;
    }
}

function updateStepIndicators(formType, stepNum) {
    const steps = document.querySelectorAll(`#${formType}-form .step`);
    steps.forEach((step, index) => {
        const stepCircle = step.querySelector('.step-circle');
        if (index + 1 < stepNum) {
            step.classList.add('completed');
            step.classList.remove('active');
            stepCircle.innerHTML = '<i class="fas fa-check"></i>';
        } else if (index + 1 === stepNum) {
            step.classList.add('active');
            step.classList.remove('completed');
            stepCircle.innerHTML = stepNum;
        } else {
            step.classList.remove('active', 'completed');
            stepCircle.innerHTML = index + 1;
        }
    });
}

function updateProgressBar(formType, stepNum) {
    const progressBar = document.querySelector(`#${formType}-form .progress-bar`);
    const progress = (stepNum / 3) * 100;
    progressBar.style.width = `${progress}%`;
}

// Validation Functions
function validateStep(formType, stepNum) {
    const currentStepElement = document.querySelector(`#${formType}-form-element .form-step[data-step="${stepNum}"]`);
    const requiredFields = currentStepElement.querySelectorAll('[required]');
    let isValid = true;
    
    requiredFields.forEach(field => {
        if (!validateField(field)) {
            isValid = false;
        }
    });
    
    // Special validation for step 2 (at least one checkbox must be checked)
    if (stepNum === 2 && formType === 'get-matched') {
        const checkboxes = currentStepElement.querySelectorAll('input[type="checkbox"]:not(#terms)');
        const atLeastOneChecked = Array.from(checkboxes).some(cb => cb.checked);
        
        if (!atLeastOneChecked) {
            showNotification('Please select at least one feature', 'error');
            isValid = false;
        }
    }
    
    return isValid;
}

function validateField(field) {
    const value = field.value.trim();
    let isValid = true;
    
    // Remove previous validation classes
    field.classList.remove('is-invalid', 'is-valid');
    
    // Check if required and empty
    if (field.hasAttribute('required') && !value) {
        field.classList.add('is-invalid');
        isValid = false;
    }
    
    // Email validation
    if (field.type === 'email' && value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            field.classList.add('is-invalid');
            isValid = false;
        }
    }
    
    // Phone validation
    if (field.type === 'tel' && value) {
        const phoneRegex = /^[\d\s\-\+\(\)]+$/;
        if (!phoneRegex.test(value) || value.length < 10) {
            field.classList.add('is-invalid');
            isValid = false;
        }
    }
    
    // Password validation
    if (field.type === 'password' && value) {
        if (value.length < 8) {
            field.classList.add('is-invalid');
            isValid = false;
        }
    }
    
    // Add valid class if valid
    if (isValid && value) {
        field.classList.add('is-valid');
    }
    
    return isValid;
}

// Form-specific validation functions
function validateGetMatchedForm() {
    return validateStep('get-matched', 3);
}

function validateContactForm() {
    const form = document.getElementById('contact-form-element');
    const requiredFields = form.querySelectorAll('[required]');
    let isValid = true;
    
    requiredFields.forEach(field => {
        if (!validateField(field)) {
            isValid = false;
        }
    });
    
    // Validate message length
    const messageField = document.getElementById('contact-message');
    if (messageField.value.length < 10) {
        messageField.classList.add('is-invalid');
        showNotification('Message must be at least 10 characters long', 'error');
        isValid = false;
    }
    
    return isValid;
}

function validateLoginForm() {
    const form = document.getElementById('login-form-element');
    const requiredFields = form.querySelectorAll('[required]');
    let isValid = true;
    
    requiredFields.forEach(field => {
        if (!validateField(field)) {
            isValid = false;
        }
    });
    
    return isValid;
}

function validateSignupForm() {
    const form = document.getElementById('signup-form-element');
    const requiredFields = form.querySelectorAll('[required]');
    let isValid = true;
    
    requiredFields.forEach(field => {
        if (!validateField(field)) {
            isValid = false;
        }
    });
    
    // Check if passwords match
    const password = document.getElementById('signup-password').value;
    const confirmPassword = document.getElementById('signup-confirm-password').value;
    
    if (password !== confirmPassword) {
        document.getElementById('signup-confirm-password').classList.add('is-invalid');
        showNotification('Passwords do not match', 'error');
        isValid = false;
    }
    
    return isValid;
}

function validateNewsletterForm() {
    const form = document.getElementById('newsletter-form-element');
    const requiredFields = form.querySelectorAll('[required]');
    let isValid = true;
    
    requiredFields.forEach(field => {
        if (!validateField(field)) {
            isValid = false;
        }
    });
    
    // Check if at least one interest is selected
    const interests = form.querySelectorAll('input[type="checkbox"][id^="interest-"]');
    const atLeastOneInterest = Array.from(interests).some(cb => cb.checked);
    
    if (!atLeastOneInterest) {
        showNotification('Please select at least one interest', 'error');
        isValid = false;
    }
    
    return isValid;
}

// Form Submission Functions
function submitGetMatchedForm() {
    const formData = collectFormData('get-matched-form-element');
    
    // Show loading state
    const submitBtn = document.querySelector('#get-matched-form-element button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<span class="loading"></span> Processing...';
    submitBtn.disabled = true;
    
    // Simulate API call
    setTimeout(() => {
        showSuccessModal('Request Submitted!', 'We\'ll review your requirements and get back to you within 24 hours.');
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
        
        // Store data (in real app, send to server)
        console.log('Get Matched Form Data:', formData);
        
        // Reset form
        setTimeout(() => {
            resetGetMatchedForm();
        }, 2000);
    }, 2000);
}

function submitContactForm() {
    const formData = collectFormData('contact-form-element');
    
    // Show loading state
    const submitBtn = document.querySelector('#contact-form-element button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<span class="loading"></span> Sending...';
    submitBtn.disabled = true;
    
    // Simulate API call
    setTimeout(() => {
        showSuccessModal('Message Sent!', 'We\'ll get back to you within 24 hours.');
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
        
        // Store data
        console.log('Contact Form Data:', formData);
        
        // Reset form
        document.getElementById('contact-form-element').reset();
        clearValidationStates('contact-form-element');
    }, 1500);
}

function submitLoginForm() {
    const formData = collectFormData('login-form-element');
    
    // Show loading state
    const submitBtn = document.querySelector('#login-form-element button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<span class="loading"></span> Logging in...';
    submitBtn.disabled = true;
    
    // Simulate API call
    setTimeout(() => {
        // Simulate successful login
        showSuccessModal('Login Successful!', 'Welcome back to your dashboard.');
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
        
        // Store data
        console.log('Login Form Data:', formData);
        
        // Reset form
        document.getElementById('login-form-element').reset();
        clearValidationStates('login-form-element');
    }, 1500);
}

function submitSignupForm() {
    const formData = collectFormData('signup-form-element');
    
    // Show loading state
    const submitBtn = document.querySelector('#signup-form-element button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<span class="loading"></span> Creating account...';
    submitBtn.disabled = true;
    
    // Simulate API call
    setTimeout(() => {
        showSuccessModal('Account Created!', 'Your account has been created successfully. Please check your email to verify.');
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
        
        // Store data
        console.log('Signup Form Data:', formData);
        
        // Reset form
        document.getElementById('signup-form-element').reset();
        clearValidationStates('signup-form-element');
        
        // Switch to login tab
        const loginTab = document.getElementById('login-tab');
        const tab = new bootstrap.Tab(loginTab);
        tab.show();
    }, 2000);
}

function submitNewsletterForm() {
    const formData = collectFormData('newsletter-form-element');
    
    // Show loading state
    const submitBtn = document.querySelector('#newsletter-form-element button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<span class="loading"></span> Subscribing...';
    submitBtn.disabled = true;
    
    // Simulate API call
    setTimeout(() => {
        showSuccessModal('Subscribed!', 'Thank you for subscribing to our newsletter.');
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
        
        // Store data
        console.log('Newsletter Form Data:', formData);
        
        // Reset form
        document.getElementById('newsletter-form-element').reset();
        clearValidationStates('newsletter-form-element');
    }, 1500);
}

// Utility Functions
function collectFormData(formId) {
    const form = document.getElementById(formId);
    const formData = new FormData(form);
    const data = {};
    
    // Add text inputs and selects
    form.querySelectorAll('input[type="text"], input[type="email"], input[type="tel"], input[type="password"], select, textarea').forEach(field => {
        data[field.id] = field.value;
    });
    
    // Add checkboxes
    form.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
        if (checkbox.checked) {
            if (!data[checkbox.name]) {
                data[checkbox.name] = [];
            }
            data[checkbox.name].push(checkbox.value);
        }
    });
    
    // Add radio buttons
    form.querySelectorAll('input[type="radio"]:checked').forEach(radio => {
        data[radio.name] = radio.value;
    });
    
    return data;
}

function resetForm(formType) {
    if (formType === 'get-matched') {
        resetGetMatchedForm();
    } else {
        const formElement = document.getElementById(`${formType}-form-element`);
        if (formElement) {
            formElement.reset();
            clearValidationStates(`${formType}-form-element`);
        }
    }
}

function resetGetMatchedForm() {
    // Reset form
    document.getElementById('get-matched-form-element').reset();
    clearValidationStates('get-matched-form-element');
    
    // Reset to step 1
    currentStep['get-matched'] = 1;
    document.querySelectorAll('#get-matched-form-element .form-step').forEach(step => {
        step.classList.remove('active');
    });
    document.querySelector('#get-matched-form-element .form-step[data-step="1"]').classList.add('active');
    
    // Reset step indicators
    updateStepIndicators('get-matched', 1);
    updateProgressBar('get-matched', 1);
}

function clearValidationStates(formId) {
    const form = document.getElementById(formId);
    form.querySelectorAll('.is-invalid, .is-valid').forEach(field => {
        field.classList.remove('is-invalid', 'is-valid');
    });
}

function initializeValidation() {
    // Add real-time validation
    document.querySelectorAll('input, select, textarea').forEach(field => {
        field.addEventListener('blur', function() {
            validateField(this);
        });
        
        field.addEventListener('input', function() {
            if (this.classList.contains('is-invalid')) {
                validateField(this);
            }
        });
    });
}

function initializeMultiStepForm() {
    // Initialize step indicators
    updateStepIndicators('get-matched', 1);
}

function initializePasswordToggle() {
    // Password toggle functionality
    window.togglePassword = function(fieldId) {
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
    };
}

function showSuccessModal(title, message) {
    document.getElementById('success-title').textContent = title;
    document.getElementById('success-message').textContent = message;
    
    const modal = new bootstrap.Modal(document.getElementById('successModal'));
    modal.show();
}

function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 20px;
        border-radius: 8px;
        color: white;
        font-weight: 500;
        z-index: 10000;
        max-width: 300px;
        box-shadow: 0 5px 15px rgba(0,0,0,0.3);
        transform: translateX(100%);
        transition: transform 0.3s ease;
    `;
    
    // Set background color based on type
    const colors = {
        success: '#28a745',
        error: '#dc3545',
        warning: '#ffc107',
        info: '#17a2b8'
    };
    notification.style.background = colors[type] || colors.info;
    
    notification.textContent = message;
    document.body.appendChild(notification);
    
    // Show notification
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Hide notification after 3 seconds
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

// Keyboard navigation
document.addEventListener('keydown', function(e) {
    // Enter key to submit forms
    if (e.key === 'Enter' && e.target.tagName !== 'TEXTAREA') {
        const form = e.target.closest('form');
        if (form && e.target.type !== 'submit') {
            const submitBtn = form.querySelector('button[type="submit"]');
            if (submitBtn) {
                submitBtn.click();
            }
        }
    }
    
    // Escape key to close modal
    if (e.key === 'Escape') {
        const modal = document.querySelector('.modal.show');
        if (modal) {
            const modalInstance = bootstrap.Modal.getInstance(modal);
            modalInstance.hide();
        }
    }
});

// Form data persistence (for demo purposes)
function saveFormData(formId, data) {
    localStorage.setItem(`${formId}_data`, JSON.stringify(data));
}

function getFormData(formId) {
    const data = localStorage.getItem(`${formId}_data`);
    return data ? JSON.parse(data) : null;
}

function clearFormData(formId) {
    localStorage.removeItem(`${formId}_data`);
}
