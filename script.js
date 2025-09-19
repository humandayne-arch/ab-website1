// AB Website Starter JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Smooth scrolling for navigation links
    const navLinks = document.querySelectorAll('nav a[href^="#"]');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // CTA button click handler
    const ctaButton = document.querySelector('.cta-button');
    if (ctaButton) {
        ctaButton.addEventListener('click', function() {
            alert('Welcome! This is the A/B testing starter template.');
        });
    }

    // Form submission handler
    const form = document.querySelector('form');
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            const email = this.querySelector('input[type="email"]').value;
            if (email) {
                alert(`Thank you for subscribing with email: ${email}`);
                this.reset();
            }
        });
    }

    // Simple A/B testing functionality
    function initABTest() {
        // Randomly assign user to variant A or B
        const variant = Math.random() < 0.5 ? 'A' : 'B';
        document.body.setAttribute('data-variant', variant);
        
        // Store variant in sessionStorage
        sessionStorage.setItem('abVariant', variant);
        
        // Apply variant-specific changes
        if (variant === 'B') {
            // Variant B: Change CTA button color and text
            const ctaButton = document.querySelector('.cta-button');
            if (ctaButton) {
                ctaButton.style.backgroundColor = '#e74c3c';
                ctaButton.textContent = 'Start Now';
            }
            
            // Variant B: Change header background
            const header = document.querySelector('header');
            if (header) {
                header.style.backgroundColor = '#8e44ad';
            }
        }
        
        console.log(`AB Test Variant: ${variant}`);
    }

    // Initialize A/B test
    initABTest();
});