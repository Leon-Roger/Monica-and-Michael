// JavaScript for interactive elements
document.addEventListener('DOMContentLoaded', function() {
    // Smooth scrolling for navigation
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth'
                });
                // Update URL without page reload
                history.pushState(null, null, this.getAttribute('href'));
            }
        });
    });
    
    // Mobile menu toggle
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');
    
    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', function() {
            navLinks.style.display = navLinks.style.display === 'flex' ? 'none' : 'flex';
            this.setAttribute('aria-expanded', navLinks.style.display === 'flex');
        });
        
        // Check screen size and adjust menu
        function checkScreenSize() {
            if (window.innerWidth <= 768) {
                navLinks.style.display = 'none';
                mobileMenuBtn.style.display = 'block';
            } else {
                navLinks.style.display = 'flex';
                mobileMenuBtn.style.display = 'none';
            }
        }
        
        window.addEventListener('resize', checkScreenSize);
        checkScreenSize();
    }
    
    // Form validation and submission
    const rsvpForm = document.getElementById('wedding-rsvp');
    if (rsvpForm) {
        // Custom multi-select functionality
        const multiselectSelected = document.getElementById('events-selected');
        const multiselectOptions = document.getElementById('events-options');
        const multiselectOptionsList = multiselectOptions.querySelectorAll('.multiselect-option');
        const eventsInput = document.getElementById('events');
        
        let selectedEvents = [];
        
        multiselectSelected.addEventListener('click', function(e) {
            e.stopPropagation();
            const isExpanded = this.getAttribute('aria-expanded') === 'true';
            this.setAttribute('aria-expanded', !isExpanded);
            multiselectOptions.classList.toggle('show', !isExpanded);
        });
        
        multiselectOptionsList.forEach(option => {
            option.addEventListener('click', function() {
                const value = this.getAttribute('data-value');
                const index = selectedEvents.indexOf(value);
                
                if (index === -1) {
                    selectedEvents.push(value);
                    this.classList.add('selected');
                } else {
                    selectedEvents.splice(index, 1);
                    this.classList.remove('selected');
                }
                
                // Update display and hidden input
                if (selectedEvents.length > 0) {
                    const selectedText = Array.from(multiselectOptionsList)
                        .filter(opt => selectedEvents.includes(opt.getAttribute('data-value')))
                        .map(opt => opt.textContent)
                        .join(', ');
                    multiselectSelected.textContent = selectedText;
                } else {
                    multiselectSelected.textContent = 'Select events';
                }
                
                eventsInput.value = selectedEvents.join(',');
            });
        });
        
        // Close multiselect when clicking outside
        document.addEventListener('click', function(e) {
            if (!multiselectSelected.contains(e.target)) {
                multiselectSelected.setAttribute('aria-expanded', 'false');
                multiselectOptions.classList.remove('show');
            }
        });
        
        // Form validation
        function validateForm() {
            let isValid = true;
            const requiredFields = rsvpForm.querySelectorAll('[required]');
            
            requiredFields.forEach(field => {
                const formGroup = field.closest('.form-group');
                if (!field.value || (field.id === 'events' && selectedEvents.length === 0)) {
                    formGroup.classList.add('error');
                    isValid = false;
                } else {
                    formGroup.classList.remove('error');
                }
                
                // Special email validation
                if (field.type === 'email' && field.value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(field.value)) {
                    formGroup.classList.add('error');
                    formGroup.querySelector('.form-error').textContent = 'Please enter a valid email';
                    isValid = false;
                }
            });
            
            return isValid;
        }
        
        // Form submission
        rsvpForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            if (validateForm()) {
                const spinner = document.getElementById('form-spinner');
                const successMessage = document.getElementById('success-message');
                
                // Show loading spinner
                spinner.style.display = 'block';
                
                // Simulate form submission (replace with actual AJAX call)
                setTimeout(() => {
                    spinner.style.display = 'none';
                    successMessage.style.display = 'block';
                    rsvpForm.reset();
                    selectedEvents = [];
                    multiselectSelected.textContent = 'Select events';
                    multiselectOptionsList.forEach(opt => opt.classList.remove('selected'));
                    
                    // Scroll to success message
                    successMessage.scrollIntoView({ behavior: 'smooth' });
                    
                    // Hide form
                    rsvpForm.querySelectorAll('.form-group, button').forEach(el => {
                        el.style.display = 'none';
                    });
                }, 1500);
            }
        });
        
        // Real-time validation for required fields
        rsvpForm.querySelectorAll('[required]').forEach(field => {
            field.addEventListener('input', function() {
                const formGroup = this.closest('.form-group');
                if (this.value) {
                    formGroup.classList.remove('error');
                }
            });
        });
    }
    
    // Lazy loading for images
    if ('loading' in HTMLImageElement.prototype) {
        // Native lazy loading is supported
        const lazyImages = document.querySelectorAll('img[loading="lazy"]');
        lazyImages.forEach(img => {
            img.src = img.dataset.src;
        });
    } else {
        // Fallback for browsers without native lazy loading
        const lazyImages = document.querySelectorAll('img[loading="lazy"]');
        const observer = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    observer.unobserve(img);
                }
            });
        });
        
        lazyImages.forEach(img => {
            observer.observe(img);
        });
    }
});

// Countdown timer to wedding date
function updateCountdown() {
    const weddingDate = new Date('Sep 15, 2025 00:00:00').getTime();
    const now = new Date().getTime();
    const distance = weddingDate - now;
    
    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);
    
    document.getElementById('countdown').innerHTML = `${days}d ${hours}h ${minutes}m ${seconds}s`;
}

// Update countdown every second
setInterval(updateCountdown, 1000);
updateCountdown(); // Initial call