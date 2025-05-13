/**
 * Products Page JavaScript
 */
document.addEventListener('DOMContentLoaded', function() {
    // Intercept contact form links
    setupContactFormLinks();
    
    // Load navbar
    fetch('../navbar.html')
        .then(response => response.text())
        .then(data => {
            document.getElementById('navbar-placeholder').innerHTML = data;
            
            // After the navbar is loaded, attach event handlers to it
            initializeNavbarHandlers();
        });
    
    // Load footer
    fetch('../footer.html')
        .then(response => response.text())
        .then(data => {
            document.getElementById('footer-placeholder').innerHTML = data;
        });
        
    // Initialize scroll animations after a short delay to ensure all elements are loaded
    setTimeout(initializeScrollAnimations, 500);
    
    // Initialize particles
    if (typeof particlesJS !== 'undefined') {
        particlesJS('particles-js', {
            particles: {
                number: { value: 80, density: { enable: true, value_area: 800 } },
                color: { value: '#39e29d' },
                shape: {
                    type: 'circle',
                    stroke: { width: 0, color: '#000000' },
                    polygon: { nb_sides: 5 }
                },
                opacity: {
                    value: 0.5,
                    random: false,
                    anim: { enable: false }
                },
                size: {
                    value: 3,
                    random: true,
                    anim: { enable: false }
                },
                line_linked: {
                    enable: true,
                    distance: 150,
                    color: '#39e29d',
                    opacity: 0.4,
                    width: 1
                },
                move: {
                    enable: true,
                    speed: 3,
                    direction: 'none',
                    random: false,
                    straight: false,
                    out_mode: 'out',
                    bounce: false,
                    attract: { enable: false }
                }
            },
            interactivity: {
                detect_on: 'canvas',
                events: {
                    onhover: { enable: true, mode: 'repulse' },
                    onclick: { enable: true, mode: 'push' },
                    resize: true
                },
                modes: {
                    grab: { distance: 400, line_linked: { opacity: 1 } },
                    bubble: { distance: 400, size: 40, duration: 2, opacity: 8, speed: 3 },
                    repulse: { distance: 200, duration: 0.4 },
                    push: { particles_nb: 4 },
                    remove: { particles_nb: 2 }
                }
            },
            retina_detect: true
        });
    }
    
    // Initialize fintech specific features if on a fintech page
    if (document.querySelector('.fintech-hero-section') || document.querySelector('.product-hero-section')) {
        initFintechFeatures();
    }
    
    // Initialize tabs functionality for product/service tabs
    const tabButtons = document.querySelectorAll('.tab-button');
    if (tabButtons.length > 0) {
        tabButtons.forEach(button => {
            button.addEventListener('click', function() {
                const tabName = this.getAttribute('id').replace('-tab', '');
                switchTab(tabName);
            });
        });
    }
});

// Initialize navbar event handlers
function initializeNavbarHandlers() {
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    
    if (menuToggle) {
        menuToggle.addEventListener('click', () => {
            navLinks.classList.toggle('open');
            menuToggle.classList.toggle('open');
        });
    }
}

// Initialize scroll reveal animations
function initializeScrollAnimations() {
    // Get all elements that need to be revealed on scroll
    const revealSections = document.querySelectorAll('.reveal-section');
    const revealItems = document.querySelectorAll('.reveal-item');
    
    // Create an Intersection Observer
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };
    
    // Observer for sections
    const sectionObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Observer for items
    const itemObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Apply observers to elements
    revealSections.forEach(section => {
        sectionObserver.observe(section);
    });
    
    revealItems.forEach(item => {
        itemObserver.observe(item);
    });
}

/**
 * Initialize product tabs
 */
function initTabs() {
    const tabButtons = document.querySelectorAll('.tab-btn');
    const productTabs = document.querySelectorAll('.product-tab');
    
    if (tabButtons.length === 0) return;
    
    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all buttons and tabs
            tabButtons.forEach(btn => btn.classList.remove('active'));
            productTabs.forEach(tab => tab.classList.remove('active'));
            
            // Add active class to clicked button
            this.classList.add('active');
            
            // Show the corresponding tab
            const tabId = this.getAttribute('data-tab');
            const targetTab = document.getElementById(tabId);
            if (targetTab) {
                targetTab.classList.add('active');
            }
        });
    });
}

/**
 * Initialize case study slider
 */
function initSlider() {
    const sliderDots = document.querySelectorAll('.slider-dot');
    const sliderSlides = document.querySelectorAll('.case-study-slide');
    const prevArrow = document.querySelector('.prev-arrow');
    const nextArrow = document.querySelector('.next-arrow');
    
    if (sliderDots.length === 0 || sliderSlides.length === 0) return;
    
    let currentSlide = 0;
    
    function showSlide(index) {
        // Hide all slides
        sliderSlides.forEach(slide => slide.classList.remove('active'));
        // Remove active class from all dots
        sliderDots.forEach(dot => dot.classList.remove('active'));
        
        // Show the selected slide
        sliderSlides[index].classList.add('active');
        // Add active class to the corresponding dot
        sliderDots[index].classList.add('active');
        
        currentSlide = index;
    }
    
    // Dot click event
    sliderDots.forEach((dot, index) => {
        dot.addEventListener('click', () => showSlide(index));
    });
    
    // Previous arrow click event
    if (prevArrow) {
        prevArrow.addEventListener('click', () => {
            let newIndex = currentSlide - 1;
            if (newIndex < 0) newIndex = sliderSlides.length - 1;
            showSlide(newIndex);
        });
    }
    
    // Next arrow click event
    if (nextArrow) {
        nextArrow.addEventListener('click', () => {
            let newIndex = currentSlide + 1;
            if (newIndex >= sliderSlides.length) newIndex = 0;
            showSlide(newIndex);
        });
    }
    
    // Auto-rotate slides every 5 seconds
    setInterval(() => {
        let newIndex = currentSlide + 1;
        if (newIndex >= sliderSlides.length) newIndex = 0;
        showSlide(newIndex);
    }, 5000);
}

/**
 * Initialize form handling
 */
function initForms() {
    const demoForm = document.getElementById('demo-form');
    
    if (demoForm) {
        demoForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Simple form validation
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            
            if (!name || !email) {
                alert('Please fill in all required fields.');
                return;
            }
            
            // Show success message (in a real application, you'd send the data to a server)
            alert('Thank you for your interest! Our team will contact you shortly to schedule your personalized demo.');
            
            // Reset form
            demoForm.reset();
        });
    }
}

/**
 * Smooth scroll to element when clicking on anchor links
 */
document.addEventListener('click', function(e) {
    if (e.target.tagName === 'A') {
        const href = e.target.getAttribute('href');
        
        // Check if the link is an anchor link on the same page
        if (href && href.startsWith('#') && href.length > 1) {
            const targetElement = document.getElementById(href.substring(1));
            
            if (targetElement) {
                e.preventDefault();
                window.scrollTo({
                    top: targetElement.offsetTop - 100, // Offset for fixed header
                    behavior: 'smooth'
                });
            }
        }
    }
});

/**
 * Initialize Fintech Page Features
 */
function initFintechFeatures() {
    // Initialize particles.js for fintech pages
    if (typeof particlesJS !== 'undefined' && document.getElementById('particles-js')) {
        particlesJS("particles-js", {
            "particles": {
                "number": {
                    "value": 80,
                    "density": {
                        "enable": true,
                        "value_area": 800
                    }
                },
                "color": {
                    "value": "#6eaf2a"
                },
                "shape": {
                    "type": "circle",
                    "stroke": {
                        "width": 0,
                        "color": "#000000"
                    },
                    "polygon": {
                        "nb_sides": 5
                    }
                },
                "opacity": {
                    "value": 0.5,
                    "random": false,
                    "anim": {
                        "enable": false,
                        "speed": 1,
                        "opacity_min": 0.1,
                        "sync": false
                    }
                },
                "size": {
                    "value": 3,
                    "random": true,
                    "anim": {
                        "enable": false,
                        "speed": 40,
                        "size_min": 0.1,
                        "sync": false
                    }
                },
                "line_linked": {
                    "enable": true,
                    "distance": 150,
                    "color": "#003366",
                    "opacity": 0.4,
                    "width": 1
                },
                "move": {
                    "enable": true,
                    "speed": 3,
                    "direction": "none",
                    "random": false,
                    "straight": false,
                    "out_mode": "out",
                    "bounce": false,
                    "attract": {
                        "enable": false,
                        "rotateX": 600,
                        "rotateY": 1200
                    }
                }
            },
            "interactivity": {
                "detect_on": "canvas",
                "events": {
                    "onhover": {
                        "enable": true,
                        "mode": "grab"
                    },
                    "onclick": {
                        "enable": true,
                        "mode": "push"
                    },
                    "resize": true
                },
                "modes": {
                    "grab": {
                        "distance": 140,
                        "line_linked": {
                            "opacity": 1
                        }
                    },
                    "bubble": {
                        "distance": 400,
                        "size": 40,
                        "duration": 2,
                        "opacity": 8,
                        "speed": 3
                    },
                    "repulse": {
                        "distance": 200,
                        "duration": 0.4
                    },
                    "push": {
                        "particles_nb": 4
                    },
                    "remove": {
                        "particles_nb": 2
                    }
                }
            },
            "retina_detect": true
        });
    }
    
    // Add custom particles to hero section
    createParticles();
}

/**
 * Create particle effects for fintech pages
 */
function createParticles() {
    const heroSection = document.querySelector('.fintech-hero-section, .product-hero-section');
    const particlesContainer = document.querySelector('.particles-container');
    if (!heroSection || !particlesContainer) return;
    
    for (let i = 0; i < 50; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        
        // Random position
        const posX = Math.random() * 100;
        const posY = Math.random() * 100;
        
        // Random size
        const size = Math.random() * 4 + 1;
        
        // Random opacity
        const opacity = Math.random() * 0.5 + 0.1;
        
        // Animation duration
        const duration = Math.random() * 20 + 10;
        
        // Set styles
        particle.style.cssText = `
            left: ${posX}%;
            top: ${posY}%;
            width: ${size}px;
            height: ${size}px;
            opacity: ${opacity};
            animation: floatParticle ${duration}s linear infinite;
        `;
        
        particlesContainer.appendChild(particle);
    }
}

/**
 * Switch between tabs for product/service content
 */
function switchTab(tabName) {
    // Hide all tab contents
    document.querySelectorAll('.tab-content').forEach(content => {
        content.style.display = 'none';
    });
    
    // Remove active class from all tab buttons
    document.querySelectorAll('.tab-button').forEach(button => {
        button.classList.remove('active');
        button.style.backgroundColor = '#e9ecef';
        button.style.color = '#003366';
    });
    
    // Show the selected tab content
    if (document.getElementById(tabName + '-content')) {
        document.getElementById(tabName + '-content').style.display = 'block';
    }
    
    // Set active class on selected tab button
    if (document.getElementById(tabName + '-tab')) {
        document.getElementById(tabName + '-tab').classList.add('active');
        document.getElementById(tabName + '-tab').style.backgroundColor = '#003366';
        document.getElementById(tabName + '-tab').style.color = 'white';
    }
}

// Setup direct navigation for contact form links
function setupContactFormLinks() {
    // Find all links that point to the contact form
    const contactLinks = document.querySelectorAll('a[href="../work_with_us.html#contact-form"]');
    
    contactLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Navigate to work_with_us page with special parameter
            const targetUrl = '../work_with_us.html?scrollTo=contact-form';
            window.location.href = targetUrl;
        });
    });
} 