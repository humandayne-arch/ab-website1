// Request submission system for Business Manager/VP requests
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('request-form');
    const statusMessage = document.getElementById('submission-status');

    // Form validation and submission
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        if (validateForm()) {
            submitRequest();
        }
    });

    // Form validation
    function validateForm() {
        const requiredFields = [
            'requesterName',
            'requesterEmail', 
            'recipientType',
            'priority',
            'subject',
            'requestDetails'
        ];

        let isValid = true;
        let firstErrorField = null;

        // Clear previous error states
        clearErrorStates();

        requiredFields.forEach(fieldName => {
            const field = document.getElementsByName(fieldName)[0];
            const value = field.value.trim();

            if (!value) {
                markFieldError(field);
                isValid = false;
                if (!firstErrorField) {
                    firstErrorField = field;
                }
            }
        });

        // Email validation
        const emailField = document.getElementsByName('requesterEmail')[0];
        if (emailField.value && !isValidEmail(emailField.value)) {
            markFieldError(emailField);
            isValid = false;
            if (!firstErrorField) {
                firstErrorField = emailField;
            }
        }

        if (!isValid) {
            showStatusMessage('Please fill in all required fields correctly.', 'error');
            if (firstErrorField) {
                firstErrorField.focus();
            }
        }

        return isValid;
    }

    // Email validation helper
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    // Mark field with error styling
    function markFieldError(field) {
        field.style.borderColor = '#e74c3c';
        field.style.backgroundColor = '#fdeeee';
    }

    // Clear error states
    function clearErrorStates() {
        const inputs = form.querySelectorAll('input, select, textarea');
        inputs.forEach(input => {
            input.style.borderColor = '#ddd';
            input.style.backgroundColor = 'white';
        });
    }

    // Submit request (simulated - in real implementation this would go to a server)
    function submitRequest() {
        // Show loading state
        form.classList.add('loading');
        
        // Collect form data
        const formData = new FormData(form);
        const requestData = {};
        
        for (let [key, value] of formData.entries()) {
            requestData[key] = value;
        }

        // Add timestamp
        requestData.submissionTime = new Date().toISOString();
        requestData.requestId = generateRequestId();

        // Simulate API call delay
        setTimeout(() => {
            // In a real implementation, this would be sent to a server
            console.log('Request submitted:', requestData);
            
            // Show success message
            showStatusMessage(
                `Request submitted successfully! Your request ID is: ${requestData.requestId}. ` +
                `A confirmation email will be sent to ${requestData.requesterEmail}.`,
                'success'
            );

            // Reset form
            form.reset();
            form.classList.remove('loading');

            // Scroll to status message
            statusMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });

        }, 1500);
    }

    // Generate unique request ID
    function generateRequestId() {
        const timestamp = Date.now();
        const random = Math.floor(Math.random() * 1000);
        return `REQ-${timestamp}-${random}`;
    }

    // Show status message
    function showStatusMessage(message, type) {
        statusMessage.textContent = message;
        statusMessage.className = `status-message ${type}`;
        statusMessage.style.display = 'block';

        // Auto-hide success messages after 10 seconds
        if (type === 'success') {
            setTimeout(() => {
                statusMessage.style.display = 'none';
            }, 10000);
        }
    }

    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Real-time form validation feedback
    const inputs = form.querySelectorAll('input, select, textarea');
    inputs.forEach(input => {
        input.addEventListener('blur', function() {
            if (this.hasAttribute('required') && !this.value.trim()) {
                markFieldError(this);
            } else if (this.type === 'email' && this.value && !isValidEmail(this.value)) {
                markFieldError(this);
            } else {
                this.style.borderColor = '#27ae60';
                this.style.backgroundColor = '#f8fff8';
            }
        });

        input.addEventListener('input', function() {
            if (this.style.borderColor === 'rgb(231, 76, 60)') { // If it was showing error
                this.style.borderColor = '#ddd';
                this.style.backgroundColor = 'white';
            }
        });
    });

    // Auto-save form data to localStorage (optional feature)
    const autoSaveKey = 'ab-website-form-draft';
    
    // Load saved draft
    function loadDraft() {
        const saved = localStorage.getItem(autoSaveKey);
        if (saved) {
            try {
                const data = JSON.parse(saved);
                Object.keys(data).forEach(key => {
                    const field = document.getElementsByName(key)[0];
                    if (field) {
                        field.value = data[key];
                    }
                });
            } catch (e) {
                console.log('Error loading draft:', e);
            }
        }
    }

    // Save draft
    function saveDraft() {
        const formData = new FormData(form);
        const data = {};
        for (let [key, value] of formData.entries()) {
            if (value.trim()) { // Only save non-empty values
                data[key] = value;
            }
        }
        localStorage.setItem(autoSaveKey, JSON.stringify(data));
    }

    // Auto-save every 30 seconds
    setInterval(saveDraft, 30000);

    // Save draft when user leaves the page
    window.addEventListener('beforeunload', saveDraft);

    // Load draft on page load
    loadDraft();

    // Clear draft after successful submission
    form.addEventListener('submit', function() {
        setTimeout(() => {
            localStorage.removeItem(autoSaveKey);
        }, 2000);
    });
});