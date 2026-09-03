/**
 * PORTFOLIO WEBSITE - JAVASCRIPT
 * Handles navigation, interactivity, form submission, and animations
 */

// ============= INITIALIZATION =============
document.addEventListener('DOMContentLoaded', initializePortfolio);

function initializePortfolio() {
    initializeEmailJS();
    setupNavigation();
    setupScrollAnimations();
    setupFormHandling();
    setupSmoothScroll();
}

const emailJsConfig = {
    publicKey: '7bGpSQNV8VDFsdL1W',
    serviceId: 'service_gzg7h9t',
    templateId: 'template_8k9q0c9'
};

function initializeEmailJS() {
    if (window.emailjs) {
        emailjs.init({ publicKey: emailJsConfig.publicKey });
    }
}

// ============= NAVIGATION MENU =============
function setupNavigation() {
    const menuToggle = document.querySelector('.menu-toggle');
    const siteNav = document.querySelector('.site-nav');
    const navLinks = siteNav.querySelectorAll('a');

    // Toggle menu on button click
    menuToggle.addEventListener('click', () => {
        const isOpen = siteNav.classList.toggle('open');
        menuToggle.setAttribute('aria-expanded', isOpen);
        
        // Prevent body scroll when menu is open
        document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    // Close menu when a link is clicked
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            siteNav.classList.remove('open');
            menuToggle.setAttribute('aria-expanded', 'false');
            document.body.style.overflow = '';
        });
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!menuToggle.contains(e.target) && !siteNav.contains(e.target)) {
            if (siteNav.classList.contains('open')) {
                siteNav.classList.remove('open');
                menuToggle.setAttribute('aria-expanded', 'false');
                document.body.style.overflow = '';
            }
        }
    });
}

// ============= SCROLL ANIMATIONS =============
function setupScrollAnimations() {
    // Intersection Observer for fade-in animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe all reveal elements
    document.querySelectorAll('.reveal').forEach(element => {
        observer.observe(element);
    });

    // Update section counter on scroll
    updateSectionCounter();
    window.addEventListener('scroll', updateSectionCounter);
}

function updateSectionCounter() {
    const sections = document.querySelectorAll('section[id]');
    const scrollPosition = window.scrollY + 200;

    sections.forEach((section, index) => {
        const sectionTop = section.offsetTop;
        const sectionBottom = sectionTop + section.offsetHeight;

        if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
            const counter = document.querySelector('.section-counter');
            if (counter) {
                const totalSections = sections.length;
                counter.textContent = `0${index + 1} / 0${totalSections}`;
            }
        }
    });
}

// ============= SMOOTH SCROLL =============
function setupSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            
            if (href !== '#') {
                e.preventDefault();
                const target = document.querySelector(href);
                
                if (target) {
                    const headerHeight = document.querySelector('.site-header').offsetHeight;
                    const targetPosition = target.offsetTop - headerHeight;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });
}

function setupFormHandling() {
    const contactForm = document.querySelector('.contact-form');
    
    if (!contactForm) return;

    contactForm.addEventListener('submit', handleFormSubmit);

    // Add real-time validation
    const inputs = contactForm.querySelectorAll('input, textarea');
    inputs.forEach(input => {
        input.addEventListener('blur', validateField);
        input.addEventListener('change', validateField);
    });

    // Setup thank you slide close button
    const closeThankYouBtn = document.querySelector('.close-thank-you');
    if (closeThankYouBtn) {
        closeThankYouBtn.addEventListener('click', closeThankYouSlide);
    }

    // Close thank you slide when clicking outside
    const thankYouSlide = document.querySelector('.thank-you-slide');
    if (thankYouSlide) {
        thankYouSlide.addEventListener('click', (e) => {
            if (e.target === thankYouSlide) {
                closeThankYouSlide();
            }
        });
    }
}

function closeThankYouSlide() {
    const thankYouSlide = document.querySelector('.thank-you-slide');
    if (thankYouSlide) {
        thankYouSlide.classList.remove('show');
        thankYouSlide.setAttribute('aria-hidden', 'true');
    }
}

function showThankYouSlide() {
    const thankYouSlide = document.querySelector('.thank-you-slide');
    if (thankYouSlide) {
        thankYouSlide.classList.add('show');
        thankYouSlide.setAttribute('aria-hidden', 'false');
        // Auto close after 10 seconds
        setTimeout(closeThankYouSlide, 10000);
    }
}

function validateField(event) {
    const field = event.target;
    const value = field.value.trim();
    const fieldType = field.type;

    // Remove previous error state
    field.classList.remove('error');

    // Validate based on type
    if (value === '') {
        field.classList.add('error');
        return false;
    }

    if (fieldType === 'email') {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            field.classList.add('error');
            return false;
        }
    }

    return true;
}

function handleFormSubmit(event) {
    event.preventDefault();

    const form = event.target;
    const nameInput = form.querySelector('input[name="name"]');
    const emailInput = form.querySelector('input[name="email"]');
    const phoneInput = form.querySelector('input[name="phone"]');
    const messageInput = form.querySelector('textarea[name="message"]');
    const statusElement = form.querySelector('.form-status');
    const submitButton = form.querySelector('button[type="submit"]');

    let isValid = true;
    [nameInput, emailInput, phoneInput, messageInput].forEach(input => {
        if (!validateField({ target: input })) {
            isValid = false;
        }
    });

    if (!isValid) {
        statusElement.textContent = 'Please fill in all fields correctly.';
        statusElement.style.color = '#c94d4d';
        return;
    }

    const originalText = submitButton.textContent;
    submitButton.textContent = 'Sending...';
    submitButton.disabled = true;
    statusElement.textContent = 'Sending your message...';
    statusElement.style.color = '#6c921b';

    if (!window.emailjs) {
        statusElement.textContent = 'Email service is not configured yet.';
        statusElement.style.color = '#c94d4d';
        submitButton.textContent = originalText;
        submitButton.disabled = false;
        return;
    }

    emailjs.sendForm(emailJsConfig.serviceId, emailJsConfig.templateId, form)
        .then(() => {
            statusElement.textContent = 'Message sent successfully!';
            statusElement.style.color = '#6c921b';

            form.reset();
            form.querySelectorAll('input, textarea').forEach(input => {
                input.classList.remove('error');
            });

            submitButton.textContent = originalText;
            submitButton.disabled = false;

            showThankYouSlide();

            setTimeout(() => {
                statusElement.textContent = '';
                statusElement.style.color = '';
            }, 5000);
        })
        .catch((error) => {
            console.error('EmailJS error:', error);
            statusElement.textContent = error.status === 400
                ? 'EmailJS Public Key is invalid. Please check your Account settings.'
                : 'Message could not be sent. Please try again.';
            statusElement.style.color = '#c94d4d';
            submitButton.textContent = originalText;
            submitButton.disabled = false;
        });
}

// ============= SCROLL POSITION INDICATOR =============
function updateScrollIndicator() {
    const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrolled = (window.scrollY / scrollHeight) * 100;

    // Add scroll progress indicator if needed
    let progressBar = document.querySelector('.scroll-progress');
    if (!progressBar) {
        progressBar = document.createElement('div');
        progressBar.className = 'scroll-progress';
        document.body.appendChild(progressBar);
    }

    progressBar.style.width = scrolled + '%';
}

// ============= KEYBOARD NAVIGATION =============
document.addEventListener('keydown', (event) => {
    // Close menu on Escape key
    if (event.key === 'Escape') {
        const siteNav = document.querySelector('.site-nav');
        const menuToggle = document.querySelector('.menu-toggle');
        
        if (siteNav.classList.contains('open')) {
            siteNav.classList.remove('open');
            menuToggle.setAttribute('aria-expanded', 'false');
            document.body.style.overflow = '';
        }

        // Close thank you slide on Escape key
        const thankYouSlide = document.querySelector('.thank-you-slide');
        if (thankYouSlide && thankYouSlide.classList.contains('show')) {
            closeThankYouSlide();
        }
    }
});

// ============= LAZY LOADING IMAGES =============
function setupLazyLoading() {
    const images = document.querySelectorAll('img[loading="lazy"]');
    
    if ('IntersectionObserver' in window) {
        const lazyImageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src || img.src;
                    img.classList.add('loaded');
                    lazyImageObserver.unobserve(img);
                }
            });
        });

        images.forEach(img => lazyImageObserver.observe(img));
    }
}

// ============= PERFORMANCE MONITORING =============
function logPerformanceMetrics() {
    if (window.performance && window.performance.timing) {
        const perfData = window.performance.timing;
        const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
        
        console.log('Page Load Performance:', {
            totalLoadTime: pageLoadTime + 'ms',
            domContentLoaded: perfData.domContentLoadedEventEnd - perfData.navigationStart + 'ms',
            resourcesLoaded: perfData.loadEventEnd - perfData.domContentLoadedEventEnd + 'ms'
        });
    }
}

// ============= ON WINDOW LOAD =============
window.addEventListener('load', () => {
    setupLazyLoading();
    logPerformanceMetrics();
    
    // Remove loading class if present
    document.body.classList.remove('loading');
});

// ============= UTILITY FUNCTIONS =============

/**
 * Debounce function for optimizing resize/scroll events
 */
function debounce(func, delay) {
    let timeoutId;
    return function (...args) {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => func.apply(this, args), delay);
    };
}

/**
 * Check if element is in viewport
 */
function isInViewport(element) {
    const rect = element.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

/**
 * Get element scroll parent
 */
function getScrollParent(element) {
    if (element === null) {
        return null;
    }

    if (element.scrollHeight > element.clientHeight) {
        return element;
    } else {
        return getScrollParent(element.parentNode);
    }
}

// ============= ACCESSIBILITY ENHANCEMENTS =============

// Add skip to main content link
function addA11yEnhancements() {
    const skipLink = document.createElement('a');
    skipLink.href = '#home';
    skipLink.className = 'skip-link';
    skipLink.textContent = 'Skip to main content';
    document.body.insertBefore(skipLink, document.body.firstChild);
}

// ============= THEME DETECTION =============
function detectThemePreference() {
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        document.documentElement.setAttribute('data-theme', 'dark');
    } else {
        document.documentElement.setAttribute('data-theme', 'light');
    }

    // Listen for theme changes
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
        document.documentElement.setAttribute('data-theme', e.matches ? 'dark' : 'light');
    });
}

// ============= INITIALIZATION CALL =============
detectThemePreference();
addA11yEnhancements();
