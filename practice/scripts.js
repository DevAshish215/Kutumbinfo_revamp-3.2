// DOM Content Loaded Event Handler
document.addEventListener("DOMContentLoaded", () => {
    console.log("DOM Content Loaded, checking for hash fragment");
    
    // Load navbar and footer components first
    loadComponents().then(() => {
        console.log("Components loaded, now handling hash navigation");
        
        // Handle hash fragments for direct section navigation
        if (window.location.hash === '#contact-form') {
            handleContactFormNavigation();
        } else if (window.location.hash) {
            // Assuming handleHashNavigation is defined elsewhere
            if (typeof handleHashNavigation === 'function') {
                handleHashNavigation();
            }
        }
    });
    
    // Initialize all interactive elements
    initializeCounters();
    
    // Initialize scroll animations
    initScrollAnimations();    
    
    // Initialize testimonial slider if function exists
    if (typeof initializeTestimonialSlider === 'function') {
        initializeTestimonialSlider();
    }
    
    // Create particles for hero section if on homepage
    createParticles();
});

// Handle contact form navigation
function handleContactFormNavigation() {
    const contactForm = document.querySelector('#contact-form');
    if (!contactForm) return;
    
    // Make the section visible immediately
    contactForm.classList.add('active');
    const formItems = contactForm.querySelectorAll('.reveal-item');
    formItems.forEach(item => item.classList.add('active'));
    
    // Scroll after everything is loaded and visible
    setTimeout(() => {
        const headerHeight = document.querySelector('header') ? 
            document.querySelector('header').offsetHeight : 0;
        
        // Scroll to contact form
        window.scrollTo({
            top: contactForm.offsetTop - headerHeight - 20,
            behavior: 'auto'
        });
    }, 800); // Longer delay for cross-page navigation
}

// ============================
// Component Loading Functions
// ============================
function loadComponents() {
    // Create promises for navbar and footer loading
    const navbarPromise = fetchComponent(getBasePath() + "navbar.html", "navbar-placeholder")
        .then(() => {
            // Initialize navbar functionality after loaded
            initializeNavbarToggle();
            initializeDropdowns();
        });
        
    const navbarRootPromise = fetchComponent(getBasePath() + "navbar_root.html", "navbar_root-placeholder");
    const footerPromise = fetchComponent(getBasePath() + "footer.html", "footer-placeholder");
    
    // Return promise that resolves when all are done
    return Promise.all([navbarPromise, navbarRootPromise, footerPromise]);
}

function fetchComponent(url, targetId) {
    const targetElement = document.getElementById(targetId);
    if (!targetElement) return Promise.resolve();

    return fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Failed to load ${url}: ${response.status} ${response.statusText}`);
            }
            return response.text();
        })
        .then(data => {
            // Fix paths for images in Services and Expertise directories
            if ((window.location.pathname.includes('/Services/') || 
                 window.location.pathname.includes('/Expertise/')) && 
                targetId === 'footer-placeholder') {
                // Add parent directory prefix to image paths in footer
                data = data.replace(/src="images\//g, 'src="../images/');
            }
            
            targetElement.innerHTML = data;
            return data;
        })
        .catch(error => {
            console.error(`Error loading ${url}:`, error);
        });
}

// ============================
// Counter Animation Functions
// ============================
function initializeCounters() {
    const counters = document.querySelectorAll(".counter");
    const counterSection = document.querySelector(".counter-section");

    if (!counterSection || counters.length === 0) return;

    const counterObserver = new IntersectionObserver(
        entries => {
            if (entries[0].isIntersecting) {
                counters.forEach(counter => animateCounter(counter));
                counterObserver.unobserve(entries[0].target);
            }
        },
        { threshold: 0.5 }
    );

    counterObserver.observe(counterSection);
}

function animateCounter(counter) {
    // Reset the counter
    counter.textContent = '0';
    
    const target = +counter.dataset.target;
    const duration = 5000; // 5 seconds duration
    const startTime = performance.now();
    
    // Use requestAnimationFrame for smoother animation
    function updateCounter(currentTime) {
        // Calculate progress (0 to 1)
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Ease-out function for smoother deceleration
        const easedProgress = 1 - Math.pow(1 - progress, 3);
        
        // Calculate and update current value
        const current = Math.floor(easedProgress * target);
        counter.textContent = current;
        
        // Continue animation if not complete
        if (progress < 1) {
            requestAnimationFrame(updateCounter);
        } else {
            // Ensure we end at the exact target value
            counter.textContent = target;
        }
    }
    
    // Start the animation
    requestAnimationFrame(updateCounter);
}


// ============================
// Scroll Animation Functions
// ============================
function setupIntersectionObserver() {
    const observer = new IntersectionObserver(
        (entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const target = entry.target;
                    target.classList.add('active');
                    
                    // Animate children with staggered delay
                    const items = target.querySelectorAll('.reveal-item');
                    items.forEach((item, index) => {
                        setTimeout(() => {
                            item.classList.add('active');
                        }, 100 + (index * 100)); // Staggered delay based on index
                    });
                    
                    // Unobserve after animation is triggered
                    observer.unobserve(target);
                }
            });
        }, 
        {
            root: null, // viewport
            rootMargin: '0px',
            threshold: 0.1 // 10% of the element must be visible
        }
    );

    // Observe all sections
    const sections = document.querySelectorAll('.reveal-section');
    sections.forEach(section => {
        observer.observe(section);
    });
}

// Use Intersection Observer if supported, otherwise fallback
function initScrollAnimations() {
    if ('IntersectionObserver' in window) {
        setupIntersectionObserver();
    } else if (typeof revealOnScroll === 'function') {
        // Fallback to scroll event if revealOnScroll is defined elsewhere
        window.addEventListener('scroll', revealOnScroll);
        revealOnScroll(); // Initial check
    }
}


// Create particles for hero section if on the homepage
function createParticles() {
    const heroSection = document.querySelector('.hero');
    const particlesContainer = document.querySelector('.particles-container');
    if (!heroSection || !particlesContainer) return;

    // Use document fragment for better performance
    const fragment = document.createDocumentFragment();
    const particleCount = 50;

    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        
        // Set styles with random properties
        particle.style.cssText = `
            left: ${Math.random() * 100}%;
            top: ${Math.random() * 100}%;
            width: ${Math.random() * 4 + 1}px;
            height: ${Math.random() * 4 + 1}px;
            opacity: ${Math.random() * 0.5 + 0.1};
            animation: floatParticle ${Math.random() * 20 + 10}s linear infinite;
        `;

        fragment.appendChild(particle);
    }

    // Append all particles at once for better performance
    particlesContainer.appendChild(fragment);
}

//navbar

// Initialize navbar toggle functionality
function initializeNavbarToggle() {
    const menuToggle = document.querySelector('.menu-toggle');
    if (menuToggle) {
        menuToggle.addEventListener('click', function() {
            if (typeof toggleMobileMenu === 'function') {
                toggleMobileMenu();
            } else {
                // Fallback if toggleMobileMenu is not defined
                const navLinks = document.querySelector('.nav-links');
                const body = document.body;
                
                menuToggle.classList.toggle('open');
                if (navLinks) navLinks.classList.toggle('show');
                body.classList.toggle('menu-open');
            }
        });
    }
}

// Initialize dropdown behavior
function initializeDropdowns() {
    // This function will be used for dropdown initialization if needed
    // Currently managed in navigation.js
}