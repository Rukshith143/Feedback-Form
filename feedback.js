// DOM Elements
const feedbackForm = document.getElementById('feedbackForm');
const submitBtn = document.getElementById('submitBtn');
const successMessage = document.getElementById('successMessage');
const resetBtn = document.getElementById('resetBtn');
const starRating = document.getElementById('starRating');
const ratingInput = document.getElementById('rating');
const ratingText = document.getElementById('ratingText');

// Form fields
const nameInput = document.getElementById('name');
const emailInput = document.getElementById('email');
const categorySelect = document.getElementById('category');
const messageTextarea = document.getElementById('message');
const suggestionsTextarea = document.getElementById('suggestions');

// Error message elements
const nameError = document.getElementById('nameError');
const emailError = document.getElementById('emailError');
const categoryError = document.getElementById('categoryError');
const messageError = document.getElementById('messageError');

// Rating system
let selectedRating = 0;
const ratingTexts = {
    1: "Poor - We're sorry to hear this",
    2: "Fair - We'll work to improve",
    3: "Good - Thanks for your feedback",
    4: "Very Good - We're pleased!",
    5: "Excellent - Thank you so much!"
};

// Initialize rating system
function initializeRating() {
    const stars = starRating.querySelectorAll('.star');
    
    stars.forEach((star, index) => {
        star.addEventListener('click', () => {
            selectedRating = index + 1;
            ratingInput.value = selectedRating;
            updateStars();
            updateRatingText();
            clearError('rating');
        });
        
        star.addEventListener('mouseenter', () => {
            highlightStars(index + 1);
        });
    });
    
    starRating.addEventListener('mouseleave', () => {
        updateStars();
    });
}

function highlightStars(rating) {
    const stars = starRating.querySelectorAll('.star');
    stars.forEach((star, index) => {
        if (index < rating) {
            star.classList.add('active');
        } else {
            star.classList.remove('active');
        }
    });
}

function updateStars() {
    highlightStars(selectedRating);
}

function updateRatingText() {
    if (selectedRating > 0) {
        ratingText.textContent = ratingTexts[selectedRating];
        ratingText.style.color = '#667eea';
    } else {
        ratingText.textContent = 'Rate your experience';
        ratingText.style.color = '#6b7280';
    }
}

// Validation functions
function validateName(name) {
    if (!name.trim()) {
        return 'Name is required';
    }
    if (name.trim().length < 2) {
        return 'Name must be at least 2 characters long';
    }
    if (!/^[a-zA-Z\s'-]+$/.test(name.trim())) {
        return 'Name can only contain letters, spaces, hyphens, and apostrophes';
    }
    return null;
}

function validateEmail(email) {
    if (!email.trim()) {
        return 'Email address is required';
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
        return 'Please enter a valid email address';
    }
    return null;
}

function validateCategory(category) {
    if (!category) {
        return 'Please select a feedback category';
    }
    return null;
}

function validateMessage(message) {
    if (!message.trim()) {
        return 'Feedback message is required';
    }
    if (message.trim().length < 10) {
        return 'Please provide more detailed feedback (at least 10 characters)';
    }
    if (message.trim().length > 1000) {
        return 'Feedback message is too long (maximum 1000 characters)';
    }
    return null;
}

function validateRating(rating) {
    if (!rating || rating < 1 || rating > 5) {
        return 'Please provide a rating';
    }
    return null;
}

// Error display functions
function showError(fieldName, message) {
    const errorElement = document.getElementById(fieldName + 'Error');
    const inputElement = document.getElementById(fieldName);
    
    if (errorElement && inputElement) {
        errorElement.textContent = message;
        errorElement.classList.add('show');
        inputElement.classList.add('error');
        inputElement.classList.remove('success');
    }
}

function clearError(fieldName) {
    const errorElement = document.getElementById(fieldName + 'Error');
    const inputElement = document.getElementById(fieldName);
    
    if (errorElement && inputElement) {
        errorElement.textContent = '';
        errorElement.classList.remove('show');
        inputElement.classList.remove('error');
        inputElement.classList.add('success');
    }
}

function clearAllErrors() {
    const fields = ['name', 'email', 'category', 'message'];
    fields.forEach(field => clearError(field));
}

// Real-time validation
function setupRealTimeValidation() {
    nameInput.addEventListener('blur', () => {
        const error = validateName(nameInput.value);
        if (error) {
            showError('name', error);
        } else {
            clearError('name');
        }
    });
    
    emailInput.addEventListener('blur', () => {
        const error = validateEmail(emailInput.value);
        if (error) {
            showError('email', error);
        } else {
            clearError('email');
        }
    });
    
    categorySelect.addEventListener('change', () => {
        const error = validateCategory(categorySelect.value);
        if (error) {
            showError('category', error);
        } else {
            clearError('category');
        }
    });
    
    messageTextarea.addEventListener('blur', () => {
        const error = validateMessage(messageTextarea.value);
        if (error) {
            showError('message', error);
        } else {
            clearError('message');
        }
    });
    
    // Character counter for message
    messageTextarea.addEventListener('input', () => {
        const remaining = 1000 - messageTextarea.value.length;
        if (remaining < 100) {
            messageTextarea.style.borderColor = remaining < 0 ? '#dc2626' : '#f59e0b';
        } else {
            messageTextarea.style.borderColor = '#e5e7eb';
        }
    });
}

// Form submission
function handleFormSubmit(event) {
    event.preventDefault();
    
    // Clear previous errors
    clearAllErrors();
    
    // Validate all fields
    const nameError = validateName(nameInput.value);
    const emailError = validateEmail(emailInput.value);
    const categoryError = validateCategory(categorySelect.value);
    const messageError = validateMessage(messageTextarea.value);
    const ratingError = validateRating(selectedRating);
    
    let hasErrors = false;
    
    // Show errors if any
    if (nameError) {
        showError('name', nameError);
        hasErrors = true;
    }
    
    if (emailError) {
        showError('email', emailError);
        hasErrors = true;
    }
    
    if (categoryError) {
        showError('category', categoryError);
        hasErrors = true;
    }
    
    if (messageError) {
        showError('message', messageError);
        hasErrors = true;
    }
    
    if (ratingError) {
        ratingText.textContent = 'Please select a rating';
        ratingText.style.color = '#dc2626';
        hasErrors = true;
    }
    
    if (hasErrors) {
        // Shake animation for submit button
        submitBtn.style.animation = 'shake 0.5s ease-in-out';
        setTimeout(() => {
            submitBtn.style.animation = '';
        }, 500);
        return;
    }
    
    // Show loading state
    submitBtn.classList.add('loading');
    
    // Simulate API call
    setTimeout(() => {
        // In a real application, you would send the data to your server here
        const formData = {
            name: nameInput.value.trim(),
            email: emailInput.value.trim(),
            category: categorySelect.value,
            message: messageTextarea.value.trim(),
            suggestions: suggestionsTextarea.value.trim(),
            rating: selectedRating,
            timestamp: new Date().toISOString()
        };
        
        console.log('Feedback submitted:', formData);
        
        // Show success message
        submitBtn.classList.remove('loading');
        feedbackForm.style.display = 'none';
        successMessage.classList.add('show');
        
        // Store in localStorage for demo purposes
        const existingFeedback = JSON.parse(localStorage.getItem('feedback') || '[]');
        existingFeedback.push(formData);
        localStorage.setItem('feedback', JSON.stringify(existingFeedback));
        
    }, 2000); // Simulate 2 second delay
}

// Reset form
function resetForm() {
    feedbackForm.reset();
    selectedRating = 0;
    ratingInput.value = '';
    updateStars();
    updateRatingText();
    clearAllErrors();
    
    // Hide success message and show form
    successMessage.classList.remove('show');
    feedbackForm.style.display = 'flex';
    
    // Reset submit button
    submitBtn.classList.remove('loading');
    
    // Smooth scroll to top
    document.querySelector('.feedback-card').scrollIntoView({
        behavior: 'smooth',
        block: 'start'
    });
}

// Add shake animation to CSS
const shakeKeyframes = `
@keyframes shake {
    0%, 100% { transform: translateX(0); }
    25% { transform: translateX(-5px); }
    75% { transform: translateX(5px); }
}
`;

// Auto-save draft functionality
function autoSave() {
    const draft = {
        name: nameInput.value,
        email: emailInput.value,
        category: categorySelect.value,
        message: messageTextarea.value,
        suggestions: suggestionsTextarea.value,
        rating: selectedRating
    };
    localStorage.setItem('feedbackDraft', JSON.stringify(draft));
}

function loadDraft() {
    const draft = localStorage.getItem('feedbackDraft');
    if (draft) {
        const data = JSON.parse(draft);
        nameInput.value = data.name || '';
        emailInput.value = data.email || '';
        categorySelect.value = data.category || '';
        messageTextarea.value = data.message || '';
        suggestionsTextarea.value = data.suggestions || '';
        if (data.rating) {
            selectedRating = data.rating;
            ratingInput.value = selectedRating;
            updateStars();
            updateRatingText();
        }
    }
}

function clearDraft() {
    localStorage.removeItem('feedbackDraft');
}

// Initialize the application
function init() {
    // Add shake animation to document
    const style = document.createElement('style');
    style.textContent = shakeKeyframes;
    document.head.appendChild(style);
    
    // Initialize components
    initializeRating();
    setupRealTimeValidation();
    loadDraft();
    
    // Event listeners
    feedbackForm.addEventListener('submit', handleFormSubmit);
    resetBtn.addEventListener('click', resetForm);
    
    // Auto-save every 30 seconds
    setInterval(autoSave, 30000);
    
    // Save draft when user leaves the page
    window.addEventListener('beforeunload', autoSave);
    
    // Clear draft when form is successfully submitted
    feedbackForm.addEventListener('submit', () => {
        setTimeout(clearDraft, 2500);
    });
    
    console.log('Feedback form initialized successfully!');
    console.log('Saved feedback can be viewed in localStorage under "feedback" key');
}

// Start the application when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}