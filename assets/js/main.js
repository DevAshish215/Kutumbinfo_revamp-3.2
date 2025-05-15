/**
 * Kutumbinfo Main JavaScript
 * Contains navigation, animations, and component loading functionality
 * Optimized for performance and maintainability
 */

// ----- Core Utility Functions -----

/**
 * Gets the base path for navigation based on current URL
 */
function getBasePath() {
  const path = window.location.pathname;
  return (path.includes('/Services/') || 
          path.includes('/Expertise/') || 
          path.includes('/Products/')) ? '../' : './';
}

/**
 * Scrolls to top of page
 */
function scrollToTop(behavior = 'instant') {
  window.scrollTo({
    top: 0,
    behavior
  });
}

/**
 * Navigates to a page with optional scroll to top
 */
function navigateTo(page, scrollTop = true) {
  if (scrollTop) {
    scrollToTop();
  }
  window.location.href = getBasePath() + page;
}

// ----- Navigation Functions -----

/**
 * Toggles mobile menu state
 */
function toggleMobileMenu() {
  const menuToggle = document.querySelector('.menu-toggle');
  const navbar = document.querySelector('.navbar');
  const body = document.body;
  const navLinks = document.querySelector('.nav-links');

  // Toggle the menu open/closed state
  menuToggle.classList.toggle('open');
  navbar.classList.toggle('show');
  body.classList.toggle('menu-open');
  
  // Check if we're closing the menu
  if (!navbar.classList.contains('show')) {
    // Close any open dropdowns when toggling the menu
    const activeDropdowns = document.querySelectorAll('.dropdown.active');
    activeDropdowns.forEach(dropdown => {
      dropdown.classList.remove('active');
      dropdown.style.zIndex = ''; // Reset any custom z-index
      const dropdownContent = dropdown.querySelector('.dropdown-content');
      if (dropdownContent) {
        hideDropdownContent(dropdownContent);
        
        // Also reset styles on dropdown boxes
        const dropdownBoxes = dropdownContent.querySelectorAll('.dropdown-box');
        dropdownBoxes.forEach(box => {
          box.style.display = '';
          box.style.visibility = '';
          box.style.opacity = '';
        });
      }
    });
    
    // Ensure nav-links is hidden when menu is closed
    if (navLinks) {
      navLinks.style.display = 'none';
      navLinks.style.opacity = '0';
      navLinks.style.transform = 'translateY(-100%)';
    }
  } else {
    // Force display of nav-links when showing the menu
    if (navLinks) {
      navLinks.style.display = 'flex';
      navLinks.style.opacity = '1';
      navLinks.style.transform = 'translateY(0)';
    }
  }
}

/**
 * Toggles dropdown directly from HTML
 * @param {HTMLElement} element - The dropdown toggle element
 */
function toggleDropdown(element) {
  const dropdown = element.closest('.dropdown');
  if (!dropdown) return false;
  
  // Check if we're on mobile
  const isMobile = window.innerWidth <= 768;
  
  // Get all dropdowns to track their order
  const allDropdowns = Array.from(document.querySelectorAll('.dropdown'));
  const currentIndex = allDropdowns.indexOf(dropdown);
  
  // Get the dropdown text to determine if it's Products or Expertise
  const dropdownText = element.textContent.trim();
  const isProducts = dropdownText === 'Products';
  const isExpertise = dropdownText === 'Expertise';
  
  // For mobile view, special handling
  if (isMobile) {
    // If Expertise is being toggled and already active, hide Products too
    if (isExpertise && dropdown.classList.contains('active')) {
      const productsDropdown = document.querySelector('.dropdown:nth-child(4)');
      if (productsDropdown && productsDropdown.classList.contains('active')) {
        productsDropdown.classList.remove('active');
        const productsContent = productsDropdown.querySelector('.dropdown-content');
        if (productsContent) {
          hideDropdownContent(productsContent);
        }
      }
    }
    
    // If Products is clicked
    if (isProducts) {
      // Ensure Expertise is open
      const expertiseDropdown = document.querySelector('.dropdown:nth-child(3)');
      if (expertiseDropdown && !expertiseDropdown.classList.contains('active')) {
        // Open Expertise dropdown automatically
        expertiseDropdown.classList.add('active');
        const expertiseContent = expertiseDropdown.querySelector('.dropdown-content');
        if (expertiseContent) {
          showDropdownContent(expertiseContent, true);
        }
      }
    }
  }
  
  
  // Toggle current dropdown
  dropdown.classList.toggle('active');
  
  // Get the dropdown content
  const dropdownContent = dropdown.querySelector('.dropdown-content');
  if (dropdownContent) {
    if (dropdown.classList.contains('active')) {
      // Set z-index based on dropdown position to ensure proper stacking
      if (isMobile) {
        // For Products, set a lower z-index than Expertise
        if (isProducts) {
          dropdown.style.zIndex = '3';
          // Find Expertise dropdown and ensure it has higher z-index
          allDropdowns.forEach(d => {
            const toggle = d.querySelector('.dropdown-toggle');
            if (toggle && toggle.textContent.trim() === 'Expertise') {
              d.style.zIndex = '4';
            }
          });
        } else {
          dropdown.style.zIndex = 5 - currentIndex;
        }
      }
      
      showDropdownContent(dropdownContent, isMobile);
      
      // Ensure the dropdown content is visible in the viewport on mobile
      if (isMobile) {
        const rect = dropdownContent.getBoundingClientRect();
        const viewportHeight = window.innerHeight;
        
        if (rect.bottom > viewportHeight) {
          dropdownContent.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
      }
    } else {
      hideDropdownContent(dropdownContent);
    }
  }
  
  // Prevent default action
  return false;
}

/**
 * Handles navbar scroll effect
 */
function handleNavbarScroll() {
  const navbar = document.querySelector('.navbar');
  const scrollPosition = window.scrollY;
  
  if (scrollPosition > 50) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
}

/**
 * Initializes particles for sections with gradient backgrounds
 */
function initGradientSectionParticles() {
  // Select all sections with bg-dark-gradient class that have particles container
  const darkGradientSections = document.querySelectorAll('.bg-dark-gradient');
  
  if (darkGradientSections.length > 0) {
    darkGradientSections.forEach((section, index) => {
      // Get the particles container in this section
      const container = section.querySelector('.particles-container');
      if (!container) return;
      
      // Create particles for each container
      for (let i = 0; i < 15; i++) {
        const particle = document.createElement('div');
        particle.classList.add('particle');
        
        // Set random properties for each particle
        const size = Math.random() * 5 + 2;
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        particle.style.top = `${Math.random() * 100}%`;
        particle.style.left = `${Math.random() * 100}%`;
        particle.style.opacity = Math.random() * 0.5 + 0.2;
        particle.style.animationDuration = `${Math.random() * 10 + 5}s`;
        particle.style.animationDelay = `${Math.random() * 5}s`;
        
        // Add to container
        container.appendChild(particle);
      }
    });
  }
}

// ----- Navigation Click Handlers -----

// Main navigation handlers
function handleHomeClick() { navigateTo('index.html'); }
function handleWhyKutumbinfoClick() { navigateTo('why_kutumbinfo.html', false); }
function handleWorkWithUsClick() { navigateTo('work_with_us.html', false); }

// Services navigation handlers
function handleWebDevelopmentClick() { navigateTo('Services/web_dev.html'); }
function handleMobileAppDevClick() { navigateTo('Services/mob_app.html'); }
function handleCustomSoftDevClick() { navigateTo('Services/custom_soft.html'); }
function handleUIUXDesignClick() { navigateTo('Services/ui_ux_design.html'); }
function handleAPIdevClick() { navigateTo('Services/api_dev.html'); }
function handleMaintainanceSupportClick() { navigateTo('Services/maintain_support.html'); }

// Expertise navigation handlers
function goToAngular() { navigateTo('Expertise/angular.html'); }
function goToReact() { navigateTo('Expertise/react.html'); }
function goToVuejs() { navigateTo('Expertise/vuejs.html'); }
function goToWordpress() { navigateTo('Expertise/wordpress.html'); }
function goToFlutter() { navigateTo('Expertise/flutter.html'); }
function goToJava() { navigateTo('Expertise/java.html'); }
function goToNodejs() { navigateTo('Expertise/nodejs.html'); }
function goToPhp() { navigateTo('Expertise/php.html'); }

// Products navigation handlers
function goToNonFintech() { navigateTo('Products/non_fintech.html'); }
function goToFintech() { navigateTo('Products/fintech.html'); }

/**
 * Handle contact form navigation when accessed via hash fragment
 */
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

// ----- Navbar Initialization Functions -----

/**
 * Initializes navbar functionality
 */
function initializeNavbar() {
  // Initialize menu toggle
  const menuToggle = document.querySelector('.menu-toggle');
  if (menuToggle) {
    // Remove any existing click handlers by cloning the element
    const newMenuToggle = menuToggle.cloneNode(true);
    menuToggle.parentNode.replaceChild(newMenuToggle, menuToggle);
    
    // Add a fresh click handler
    newMenuToggle.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      toggleMobileMenu();
    });
  }
  
  
  // Close menu on navigation link click
  const navLinks = document.querySelectorAll('.nav-links a:not(.dropdown-toggle)');
  navLinks.forEach(link => {
    link.addEventListener('click', function() {
      if (window.innerWidth <= 768) {
        setTimeout(() => {
          toggleMobileMenu();
        }, 100);
      }
    });
  });
 
  // Setup mobile dropdown box click behavior
  setupMobileDropdownBoxes();
}

/**
 * Sets up click behavior for mobile dropdown boxes
 */
function setupMobileDropdownBoxes() {
  // This function handles dropdown box interactions on mobile
  const dropdownBoxes = document.querySelectorAll('.dropdown-box');
  if (!dropdownBoxes.length) return;
  
  dropdownBoxes.forEach(box => {
    // Ensure click events only fire once by removing and re-adding
    const newBox = box.cloneNode(true);
    box.parentNode.replaceChild(newBox, box);
    
    // Add the event listener to the new element
    newBox.addEventListener('click', function(e) {
      // Prevent event from bubbling to parent elements
      e.stopPropagation();
    });
  });
}

// ----- Animation Functions -----

/**
 * Creates particle background effect for the hero section
 */
function createParticles() {
  const heroSection = document.querySelector('.hero, .why-hero-section, .web-hero-section');
  const particlesContainer = document.querySelector('.particles-container');
  if (!heroSection || !particlesContainer) return;

  // Use document fragment for better performance
  const fragment = document.createDocumentFragment();
  const particleCount = 40; // Reduced from 70 to 40 for fewer particles

  for (let i = 0; i < particleCount; i++) {
    const particle = document.createElement('div');
    particle.className = 'particle';
    
    // Set styles with random properties
    particle.style.cssText = `
      left: ${Math.random() * 100}%;
      top: ${Math.random() * 100}%;
      width: ${Math.random() * 5 + 1}px;
      height: ${Math.random() * 5 + 1}px;
      opacity: ${Math.random() * 0.6 + 0.2};
      animation: floatParticle ${Math.random() * 25 + 10}s linear infinite;
      animation-delay: ${Math.random() * 5}s;
    `;

    fragment.appendChild(particle);
  }

  // Append all particles at once for better performance
  particlesContainer.appendChild(fragment);
}

/**
 * Initializes scroll animations
 */
function initScrollAnimations() {
  if ('IntersectionObserver' in window) {
    console.log("Using IntersectionObserver for reveal animations");
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
        threshold: 0.1 // 10% of the element must be visible
      }
    );

    // Observe all sections
    document.querySelectorAll('.reveal-section').forEach(section => {
      observer.observe(section);
    });
  } else {
    // Fallback for browsers that don't support IntersectionObserver
    console.log("Using scroll event fallback for reveal animations");
    window.addEventListener('scroll', revealOnScroll);
    revealOnScroll(); // Initial check
  }
}

/**
 * Initializes all counter animations on the page
 */
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

/**
 * Animates a counter element from 0 to target value
 */
function animateCounter(counter) {
  counter.textContent = '0';
  
  const target = +counter.dataset.target;
  const duration = 5000; // 5 seconds duration
  const startTime = performance.now();
  
  function updateCounter(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const easedProgress = 1 - Math.pow(1 - progress, 3);
    const current = Math.floor(easedProgress * target);
    counter.textContent = current;
    
    if (progress < 1) {
      requestAnimationFrame(updateCounter);
    } else {
      counter.textContent = target;
    }
  }
  
  requestAnimationFrame(updateCounter);
}

/**
 * Handles the display of FAQs on the Work With Us page
 * This function is deprecated since we've switched to a static FAQ layout
 * Keeping as a comment for reference
 */
/* 
function initializeFAQs() {
  const faqItems = document.querySelectorAll('.faq-item');
  
  if (!faqItems.length) return;
  
  // Add click event listener to each FAQ question
  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    const answer = item.querySelector('.faq-answer');
    
    if (!question || !answer) return;
    
    // Initialize FAQs to be closed
    answer.style.display = 'none';
    
    // Add click handler to question
    question.addEventListener('click', () => {
      // Toggle answer visibility
      const isOpen = answer.style.display === 'block';
      
      // Close all other FAQs
      document.querySelectorAll('.faq-answer').forEach(a => {
        a.style.display = 'none';
      });
      
      // Toggle current FAQ
      answer.style.display = isOpen ? 'none' : 'block';
      
      // Add/remove active class for styling
      faqItems.forEach(fi => fi.classList.remove('active'));
      
      if (!isOpen) {
        item.classList.add('active');
      }
    });
  });
}
*/

/**
 * Handles contact form submission on the Work With Us page
 */
function initializeContactForm() {
  const contactForm = document.querySelector('.inquiry-form');
  
  if (!contactForm) return;
  
  contactForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Basic form validation
    const name = contactForm.querySelector('#name').value.trim();
    const company = contactForm.querySelector('#company').value.trim();
    const email = contactForm.querySelector('#email').value.trim();
    const message = contactForm.querySelector('#message').value.trim();
    
    if (!name || !company || !email || !message) {
      alert('Please fill out all required fields.');
      return;
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      alert('Please enter a valid email address.');
      return;
    }
    
    // Form would be submitted to backend here
    alert('Thank you for your inquiry! We will get back to you within 24 hours.');
    
    // Reset form
    contactForm.reset();
  });
}

/**
 * Enhances the Why Work With Us section with staggered animations
 */
function enhanceWorkWithUsSection() {
  const benefitCards = document.querySelectorAll('.benefit-card');
  
  if (!benefitCards.length) return;
  
  // Add staggered animation delays to benefit cards
  benefitCards.forEach((card, index) => {
    // Set staggered animation delays
    card.style.transitionDelay = `${index * 0.1}s`;
    
    // Add hover interaction for desktop
    if (window.innerWidth > 768) {
      card.addEventListener('mouseenter', () => {
        const icon = card.querySelector('.benefit-icon');
        if (icon) {
          icon.style.transform = 'rotate(15deg) scale(1.05)';
        }
      });
      
      card.addEventListener('mouseleave', () => {
        const icon = card.querySelector('.benefit-icon');
        if (icon) {
          icon.style.transform = '';
        }
      });
    }
  });
}

/**
 * Handles the loading of navbar and footer for services pages
 */
function loadNavbarAndFooter() {
  // Load navbar
  fetch('../navbar.html')
    .then(response => response.text())
    .then(data => {
      document.getElementById('navbar-placeholder').innerHTML = data;
        
      // After the navbar is loaded, attach event handlers to it
      initializeNavbar();
    });
  
  // Load footer
  fetch('../footer.html')
    .then(response => response.text())
    .then(data => {
      // Fix image paths in footer for services pages
      data = data.replace(/src="images\//g, 'src="../images/');
      
      document.getElementById('footer-placeholder').innerHTML = data;
      
      // Further fix social icon paths specifically
      setTimeout(function() {
        // Fix footer logo
        const footerLogo = document.querySelector('.footer-logo img');
        if (footerLogo && !footerLogo.src.includes('../images/')) {
          footerLogo.src = '../images/logo kutumbinfo13.png';
        }
        
        // Fix social media icons
        const socialIcons = document.querySelectorAll('.social-icons img');
        socialIcons.forEach(icon => {
          // Extract the filename
          const srcParts = icon.src.split('/');
          const filename = srcParts[srcParts.length - 1];
          
          // Update with correct path
          icon.src = `../images/social_icon/${filename}`;
        });
      }, 300);
    });
}

/**
 * Adds click event listeners to "Talk to our team" buttons
 */
function initializeTalkToTeamButtons() {
  const talkButtons = document.querySelectorAll('.talk-to-team, .cta-button');
  
  talkButtons.forEach(button => {
    button.addEventListener('click', function(e) {
      if (button.getAttribute('href') === null) {
        e.preventDefault();
        window.location.href = '../Services/contact.html';
      }
    });
  });
}

/**
 * Handles smooth scrolling for anchor links
 */
function initializeSmoothScrolling() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      
      const targetId = this.getAttribute('href');
      
      if (targetId !== '#') {
        const targetElement = document.querySelector(targetId);
        
        if (targetElement) {
          window.scrollTo({
            top: targetElement.offsetTop - 100,
            behavior: 'smooth'
          });
        }
      }
    });
  });
}

/**
 * Adds active state to navbar based on the current page
 */
function setActiveNavbarItem() {
  setTimeout(() => {
    const currentPath = window.location.pathname;
    const navLinks = document.querySelectorAll('.nav-links a');
    
    navLinks.forEach(link => {
      const linkPath = new URL(link.href).pathname;
      
      if (currentPath.includes(linkPath) && linkPath !== '/') {
        link.classList.add('active');
      } else if (currentPath === '/' && linkPath === '/') {
        link.classList.add('active');
      }
    });
  }, 1000); // Delay to ensure navbar is loaded
}

// ----- Product Page Specific Functions -----

/**
 * Initialize fintech specific features
 */
function initFintechFeatures() {
    // Create particles for decorative effect
    createProductParticles();
    
    // Generate particles for hero section background
    const heroSection = document.querySelector('.fintech-hero-section') || document.querySelector('.product-hero-section');
    if (heroSection) {
        const particlesContainer = heroSection.querySelector('.particles-container');
        if (particlesContainer) {
            for (let i = 0; i < 20; i++) {
                const size = Math.random() * 10 + 5;
                const particle = document.createElement('div');
                particle.classList.add('particle');
                particle.style.width = size + 'px';
                particle.style.height = size + 'px';
                particle.style.left = Math.random() * 100 + '%';
                particle.style.top = Math.random() * 100 + '%';
                particle.style.opacity = Math.random() * 0.5 + 0.1;
                particle.style.animationDuration = (Math.random() * 15 + 10) + 's';
                particle.style.animationDelay = (Math.random() * 5) + 's';
                particlesContainer.appendChild(particle);
            }
        }
    }
    
    // Initialize tabs functionality
    initTabs();
    
    // Initialize slider
    initSlider();
    
    // Initialize forms
    initForms();
}

/**
 * Initialize product particles using ParticlesJS library
 */
function createProductParticles() {
    if (typeof particlesJS !== 'undefined' && document.getElementById('particles-js')) {
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
}

/**
 * Switch between tabs in the products page
 */
function switchTab(tabName) {
    const tabs = document.querySelectorAll('.product-tab');
    const buttons = document.querySelectorAll('.tab-button');
    
    tabs.forEach(tab => {
        tab.classList.remove('active');
    });
    
    buttons.forEach(button => {
        button.classList.remove('active');
    });
    
    document.getElementById(tabName).classList.add('active');
    document.getElementById(tabName + '-tab').classList.add('active');
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
 * Initialize form handling for product pages
 */
function initForms() {
    const demoForm = document.getElementById('demo-form');
    
    if (demoForm) {
        demoForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Basic validation
            const nameInput = document.getElementById('demo-name');
            const emailInput = document.getElementById('demo-email');
            const companyInput = document.getElementById('demo-company');
            
            let isValid = true;
            
            if (!nameInput.value.trim()) {
                isValid = false;
                nameInput.classList.add('error');
            } else {
                nameInput.classList.remove('error');
            }
            
            if (!emailInput.value.trim() || !isValidEmail(emailInput.value)) {
                isValid = false;
                emailInput.classList.add('error');
            } else {
                emailInput.classList.remove('error');
            }
            
            if (!companyInput.value.trim()) {
                isValid = false;
                companyInput.classList.add('error');
            } else {
                companyInput.classList.remove('error');
            }
            
            if (isValid) {
                // If form is valid, show a success message for demonstration
                const formContainer = demoForm.parentElement;
                formContainer.innerHTML = '<div class="success-message"><h3>Thank you for your interest!</h3><p>We\'ve received your request and will get back to you shortly.</p></div>';
            }
        });
    }
    
    // Helper function to validate email format
    function isValidEmail(email) {
        const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    }
}

/**
 * Set up contact form links
 */
function setupContactFormLinks() {
    const contactLinks = document.querySelectorAll('a[href*="#contact"]');
    
    contactLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href').split('#')[1];
            const targetSection = document.getElementById(targetId);
            
            if (targetSection) {
                // Scroll to the target section
                const offset = 100; // Adjust this value as needed
                const targetPosition = targetSection.getBoundingClientRect().top + window.pageYOffset - offset;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// ----- Main Initialization -----
document.addEventListener('DOMContentLoaded', function() {
  // Initialize the components
  initializeNavbar();
  
  // Add scroll event listener for navbar
  window.addEventListener('scroll', handleNavbarScroll);
  window.addEventListener('scroll', initScrollAnimations);
  
  // Initialize scroll animations
  initScrollAnimations();
  
  // Initialize counters for achievements section
  initializeCounters();
  
  // Initialize the contact form if present
    initializeContactForm();
    
  // Initialize work with us specific functionalities
    enhanceWorkWithUsSection();
    
  // Set up talk to team buttons
    initializeTalkToTeamButtons();
    
    // Initialize smooth scrolling
    initializeSmoothScrolling();
    
  // Set active navbar item based on current page
    setActiveNavbarItem();
  
  // Create particles effect for home page
  if (document.querySelector('.hero-section')) {
    createParticles();
  }
  
  // Add product page functionality
  setupContactFormLinks();
  
  // Initialize fintech specific features if on a fintech/product page
  if (document.querySelector('.fintech-hero-section') || document.querySelector('.product-hero-section')) {
      setTimeout(initFintechFeatures, 500);
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
  
  // Initialize particles for gradient sections
  initGradientSectionParticles();
});