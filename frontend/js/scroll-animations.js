// Professional Scroll-Based Reveal Animations
// Using Intersection Observer (no library required)

document.addEventListener('DOMContentLoaded', function() {
    // Create Intersection Observer
    const observerOptions = {
        threshold: 0.1, // Trigger when 10% of element is visible
        rootMargin: '0px 0px -50px 0px' // Trigger slightly before element comes into view
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                
                // Optional: Stop observing after animation
                if (entry.target.classList.contains('once')) {
                    observer.unobserve(entry.target);
                }
            }
        });
    }, observerOptions);

    // Observe all elements with reveal classes
    const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale, .reveal-rotate');
    revealElements.forEach(element => {
        observer.observe(element);
    });

    // Add reveal classes to common elements automatically
    const autoReveal = {
        'section': 'reveal',
        '.section-title': 'reveal',
        '.project-card': 'reveal-scale stagger-',
        '.certificate-card': 'reveal-scale stagger-',
        '.timeline-item': 'reveal-left stagger-',
        '.skill-category': 'reveal',
        '.about-content': 'reveal',
        '.contact-form': 'reveal',
        '.form-group': 'reveal stagger-'
    };

    // Apply auto-reveal classes
    Object.keys(autoReveal).forEach(selector => {
        const elements = document.querySelectorAll(selector);
        elements.forEach((element, index) => {
            const className = autoReveal[selector];
            if (className.includes('stagger-')) {
                element.classList.add(className.replace('stagger-', ''), 'stagger-' + ((index % 6) + 1));
            } else {
                element.classList.add(className);
            }
            observer.observe(element);
        });
    });

    // Special handling for hero section
    const heroSection = document.querySelector('.hero-section');
    if (heroSection) {
        heroSection.classList.add('page-load');
    }

    // Smooth scroll for navigation links
    const navLinks = document.querySelectorAll('a[href^="#"]');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            if (targetSection) {
                targetSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
});
