// LPS Esports Website JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all components
    initNavigation();
    initHeroAnimations();
    initCounterAnimations();
    initNewsCarousel();
    initContactForm();
    initScrollEffects();
    initMobileNavigation();
});

// Navigation functionality
function initNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    
    // Handle navigation link clicks
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            scrollToSection(targetId);
            
            // Update active state
            updateActiveNavLink(this);
            
            // Close mobile menu if open
            closeMobileNav();
        });
    });
    
    // Update active nav link based on scroll position
    window.addEventListener('scroll', throttle(updateNavOnScroll, 100));
    
    // Add scroll effect to navbar
    window.addEventListener('scroll', throttle(handleNavbarScroll, 100));
}

function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        const navHeight = document.querySelector('.navbar').offsetHeight;
        const targetPosition = section.offsetTop - navHeight - 20;
        
        // Use native smooth scrolling
        window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
        });
    }
}

// Make scrollToSection available globally
window.scrollToSection = scrollToSection;

function updateActiveNavLink(activeLink) {
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
    });
    activeLink.classList.add('active');
}

function updateNavOnScroll() {
    const sections = document.querySelectorAll('section[id]');
    const navHeight = document.querySelector('.navbar').offsetHeight;
    const scrollPosition = window.scrollY + navHeight + 100;
    
    sections.forEach((section) => {
        const sectionTop = section.offsetTop;
        const sectionBottom = sectionTop + section.offsetHeight;
        
        if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
            const targetLink = document.querySelector(`.nav-link[href="#${section.id}"]`);
            if (targetLink && !targetLink.classList.contains('active')) {
                updateActiveNavLink(targetLink);
            }
        }
    });
}

function handleNavbarScroll() {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.style.background = 'rgba(19, 52, 59, 0.98)';
        navbar.style.backdropFilter = 'blur(15px)';
    } else {
        navbar.style.background = 'rgba(19, 52, 59, 0.95)';
        navbar.style.backdropFilter = 'blur(10px)';
    }
}

// Mobile Navigation
function initMobileNavigation() {
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    
    if (navToggle) {
        navToggle.addEventListener('click', toggleMobileNav);
    }
    
    // Close mobile nav when clicking outside
    document.addEventListener('click', function(e) {
        if (navToggle && navMenu && !navToggle.contains(e.target) && !navMenu.contains(e.target)) {
            closeMobileNav();
        }
    });
}

function toggleMobileNav() {
    const navMenu = document.getElementById('nav-menu');
    const navToggle = document.getElementById('nav-toggle');
    
    if (navMenu && navToggle) {
        navMenu.classList.toggle('mobile-active');
        navToggle.classList.toggle('active');
    }
}

function closeMobileNav() {
    const navMenu = document.getElementById('nav-menu');
    const navToggle = document.getElementById('nav-toggle');
    
    if (navMenu && navToggle) {
        navMenu.classList.remove('mobile-active');
        navToggle.classList.remove('active');
    }
}

// Hero Animations
function initHeroAnimations() {
    // Hero scroll button
    const heroScroll = document.querySelector('.hero-scroll');
    if (heroScroll) {
        heroScroll.addEventListener('click', function() {
            scrollToSection('about');
        });
    }
    
    // Parallax effect for hero background
    window.addEventListener('scroll', throttle(heroParallaxEffect, 16));
}

function heroParallaxEffect() {
    const hero = document.querySelector('.hero');
    const heroContent = document.querySelector('.hero-content');
    
    if (hero && heroContent) {
        const scrolled = window.pageYOffset;
        const heroHeight = hero.offsetHeight;
        
        if (scrolled < heroHeight) {
            const opacity = Math.max(0, 1 - (scrolled / heroHeight) * 1.5);
            heroContent.style.opacity = opacity;
            heroContent.style.transform = `translateY(${scrolled * 0.3}px)`;
        }
    }
}

// Counter Animations
function initCounterAnimations() {
    const counters = document.querySelectorAll('.stat-number[data-count]');
    let countersAnimated = false;
    
    function animateCounters() {
        if (countersAnimated) return;
        
        const heroSection = document.querySelector('.hero');
        if (!heroSection) return;
        
        const heroBottom = heroSection.offsetTop + heroSection.offsetHeight;
        const scrollPosition = window.scrollY + window.innerHeight;
        
        if (scrollPosition > heroBottom - 300) {
            countersAnimated = true;
            
            counters.forEach(counter => {
                const target = parseInt(counter.getAttribute('data-count'));
                const duration = 2000;
                const steps = 60;
                const increment = target / steps;
                let current = 0;
                let step = 0;
                
                const timer = setInterval(() => {
                    step++;
                    current = Math.min(target, increment * step);
                    
                    if (step >= steps) {
                        current = target;
                        clearInterval(timer);
                    }
                    
                    if (target >= 1000) {
                        counter.textContent = formatNumber(Math.floor(current));
                    } else {
                        counter.textContent = Math.floor(current);
                    }
                }, duration / steps);
            });
        }
    }
    
    window.addEventListener('scroll', throttle(animateCounters, 100));
    
    // Also check on load in case user scrolled already
    setTimeout(animateCounters, 500);
}

function formatNumber(num) {
    return num.toLocaleString('ru-RU');
}

// News Carousel
function initNewsCarousel() {
    const track = document.getElementById('newsTrack');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    
    if (!track || !prevBtn || !nextBtn) return;
    
    const cards = track.querySelectorAll('.news-card');
    if (cards.length === 0) return;
    
    const cardWidth = cards[0].offsetWidth + 24; // card width + gap
    let currentIndex = 0;
    const maxIndex = Math.max(0, cards.length - Math.floor(track.parentElement.offsetWidth / cardWidth));
    
    function updateCarousel() {
        const translateX = -currentIndex * cardWidth;
        track.style.transform = `translateX(${translateX}px)`;
        
        // Update button states
        prevBtn.disabled = currentIndex === 0;
        nextBtn.disabled = currentIndex >= maxIndex;
        
        // Update button opacity
        prevBtn.style.opacity = currentIndex === 0 ? '0.5' : '1';
        nextBtn.style.opacity = currentIndex >= maxIndex ? '0.5' : '1';
        prevBtn.style.cursor = currentIndex === 0 ? 'not-allowed' : 'pointer';
        nextBtn.style.cursor = currentIndex >= maxIndex ? 'not-allowed' : 'pointer';
    }
    
    prevBtn.addEventListener('click', (e) => {
        e.preventDefault();
        if (currentIndex > 0) {
            currentIndex--;
            updateCarousel();
        }
    });
    
    nextBtn.addEventListener('click', (e) => {
        e.preventDefault();
        if (currentIndex < maxIndex) {
            currentIndex++;
            updateCarousel();
        }
    });
    
    // Auto-slide every 6 seconds
    let autoSlideInterval = setInterval(() => {
        if (currentIndex >= maxIndex) {
            currentIndex = 0;
        } else {
            currentIndex++;
        }
        updateCarousel();
    }, 6000);
    
    // Pause auto-slide on hover
    const carousel = track.closest('.news-carousel');
    if (carousel) {
        carousel.addEventListener('mouseenter', () => {
            clearInterval(autoSlideInterval);
        });
        
        carousel.addEventListener('mouseleave', () => {
            autoSlideInterval = setInterval(() => {
                if (currentIndex >= maxIndex) {
                    currentIndex = 0;
                } else {
                    currentIndex++;
                }
                updateCarousel();
            }, 6000);
        });
    }
    
    // Update carousel on window resize
    window.addEventListener('resize', debounce(() => {
        const newCardWidth = cards[0].offsetWidth + 24;
        const newMaxIndex = Math.max(0, cards.length - Math.floor(track.parentElement.offsetWidth / newCardWidth));
        
        if (currentIndex > newMaxIndex) {
            currentIndex = newMaxIndex;
        }
        
        updateCarousel();
    }, 250));
    
    // Initial update
    updateCarousel();
}

// Contact Form
function initContactForm() {
    const form = document.getElementById('contactForm');
    
    if (form) {
        form.addEventListener('submit', handleFormSubmit);
    }
}

function handleFormSubmit(e) {
    e.preventDefault();
    
    // Get form values
    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const message = document.getElementById('message').value.trim();
    
    // Basic validation
    if (!name || !email || !message) {
        showNotification('Пожалуйста, заполните все поля', 'error');
        return;
    }
    
    if (!isValidEmail(email)) {
        showNotification('Пожалуйста, введите корректный email', 'error');
        return;
    }
    
    // Simulate form submission
    const submitBtn = e.target.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Отправка...';
    submitBtn.disabled = true;
    
    setTimeout(() => {
        // Reset form
        e.target.reset();
        
        // Reset button
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
        
        // Show success modal
        showModal('successModal');
    }, 1500);
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Modal functionality
function showModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
        
        // Close modal when clicking outside
        const closeHandler = function(e) {
            if (e.target === modal) {
                closeModal(modalId);
                modal.removeEventListener('click', closeHandler);
            }
        };
        
        modal.addEventListener('click', closeHandler);
        
        // Close modal with Escape key
        const escHandler = function(e) {
            if (e.key === 'Escape') {
                closeModal(modalId);
                document.removeEventListener('keydown', escHandler);
            }
        };
        
        document.addEventListener('keydown', escHandler);
    }
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.add('hidden');
        document.body.style.overflow = 'auto';
    }
}

// Make closeModal available globally for onclick handlers
window.closeModal = closeModal;

// Scroll Effects
function initScrollEffects() {
    // Check if IntersectionObserver is available
    if (!window.IntersectionObserver) {
        return;
    }
    
    // Fade in animations for sections
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Observe all major sections
    const sections = document.querySelectorAll('.about, .tournaments, .team, .news, .contact');
    sections.forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(30px)';
        section.style.transition = 'opacity 0.8s ease-out, transform 0.8s ease-out';
        observer.observe(section);
    });
    
    // Add fade-in class styles
    const style = document.createElement('style');
    style.textContent = `
        .fade-in {
            opacity: 1 !important;
            transform: translateY(0) !important;
        }
    `;
    document.head.appendChild(style);
}

function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(n => n.remove());
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification--${type}`;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 16px 24px;
        background: var(--color-surface);
        border: 1px solid var(--color-border);
        border-radius: 8px;
        color: var(--color-text);
        font-weight: 500;
        box-shadow: var(--shadow-lg);
        z-index: 3000;
        transform: translateX(100%);
        transition: transform 0.3s ease-out;
        max-width: 300px;
        word-wrap: break-word;
    `;
    
    if (type === 'error') {
        notification.style.borderColor = 'var(--color-error)';
        notification.style.background = 'rgba(255, 84, 89, 0.1)';
        notification.style.color = 'var(--color-error)';
    } else if (type === 'success') {
        notification.style.borderColor = 'var(--color-success)';
        notification.style.background = 'rgba(50, 184, 198, 0.1)';
        notification.style.color = 'var(--color-success)';
    }
    
    notification.textContent = message;
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Animate out and remove
    setTimeout(() => {
        if (notification.parentNode) {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (notification.parentNode) {
                    document.body.removeChild(notification);
                }
            }, 300);
        }
    }, 3000);
}

function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

function debounce(func, wait, immediate) {
    let timeout;
    return function() {
        const context = this, args = arguments;
        const later = function() {
            timeout = null;
            if (!immediate) func.apply(context, args);
        };
        const callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
    };
}

// Add mobile navigation styles dynamically
const mobileNavStyles = `
    @media (max-width: 768px) {
        .nav-menu {
            position: fixed;
            top: 70px;
            left: -100%;
            width: 100%;
            height: calc(100vh - 70px);
            background: rgba(19, 52, 59, 0.98);
            backdrop-filter: blur(15px);
            flex-direction: column;
            justify-content: flex-start;
            align-items: center;
            padding-top: 50px;
            transition: left 0.3s ease-in-out;
            z-index: 999;
            display: flex;
        }
        
        .nav-menu.mobile-active {
            left: 0;
        }
        
        .nav-link {
            font-size: 18px;
            padding: 20px;
            width: 100%;
            text-align: center;
            border-bottom: 1px solid var(--color-border);
        }
        
        .nav-toggle.active span:nth-child(1) {
            transform: rotate(-45deg) translate(-5px, 6px);
        }
        
        .nav-toggle.active span:nth-child(2) {
            opacity: 0;
        }
        
        .nav-toggle.active span:nth-child(3) {
            transform: rotate(45deg) translate(-5px, -6px);
        }
    }
`;

const styleSheet = document.createElement('style');
styleSheet.textContent = mobileNavStyles;
document.head.appendChild(styleSheet);

// Add loading animation
window.addEventListener('load', function() {
    // Fade in the page
    document.body.style.opacity = '1';
    
    // Trigger counter animation after load if in view
    setTimeout(() => {
        const heroSection = document.querySelector('.hero');
        if (heroSection && window.scrollY < heroSection.offsetHeight) {
            const counters = document.querySelectorAll('.stat-number[data-count]');
            counters.forEach(counter => {
                const target = parseInt(counter.getAttribute('data-count'));
                const duration = 2000;
                const steps = 60;
                const increment = target / steps;
                let current = 0;
                let step = 0;
                
                const timer = setInterval(() => {
                    step++;
                    current = Math.min(target, increment * step);
                    
                    if (step >= steps) {
                        current = target;
                        clearInterval(timer);
                    }
                    
                    if (target >= 1000) {
                        counter.textContent = formatNumber(Math.floor(current));
                    } else {
                        counter.textContent = Math.floor(current);
                    }
                }, duration / steps);
            });
        }
    }, 1000);
});

// Performance optimization: Preload critical images
function preloadImages() {
    const images = [
        'https://pplx-res.cloudinary.com/image/upload/v1755731207/pplx_project_search_images/0cf192cd21e2b47b962bff11d5618695dd31fc17.png',
        'https://pplx-res.cloudinary.com/image/upload/v1755731207/pplx_project_search_images/3fbcc31971ff137516bbec1e6276cfd398f3a493.png'
    ];
    
    images.forEach(src => {
        const img = new Image();
        img.src = src;
    });
}

// Initialize preloading
preloadImages();

// Set initial body opacity for smooth loading
document.body.style.opacity = '0';
document.body.style.transition = 'opacity 0.5s ease-in';