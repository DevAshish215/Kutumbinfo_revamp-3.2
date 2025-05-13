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

// ----- Main Initialization -----

document.addEventListener("DOMContentLoaded", () => {
  // Check if we're on a services page
  const isServicesPage = window.location.pathname.includes('/Services/');
  
  if (isServicesPage && document.getElementById('navbar-placeholder')) {
    // For services pages with placeholder elements, load navbar and footer
    loadNavbarAndFooter();
    
    // Initialize scroll animations after a short delay to ensure all elements are loaded
    setTimeout(() => {
      initScrollAnimations();
      // Create particles for services hero section after a short delay
      setTimeout(createParticles, 100);
    }, 500);
    
    // Initialize talk to team buttons
    initializeTalkToTeamButtons();
    
    // Initialize smooth scrolling
    initializeSmoothScrolling();
    
    // Set active navbar item
    setActiveNavbarItem();
  } else {
    // For main site pages
    
    // Initialize navbar (this comes first in page load order)
    initializeNavbar();
    
    // Create particles for hero section after a short delay
    setTimeout(createParticles, 100);
    
    // Initialize scroll animations (affects sections as user scrolls)
    initScrollAnimations();
    
    // Initialize counters (typically appear in the middle of the page)
    initializeCounters();
    
    // Initialize testimonial slider if function exists (typically near bottom)
    if (typeof initializeTestimonialSlider === 'function') {
      initializeTestimonialSlider();
    }
    
    // Handle hash fragments for direct section navigation
    if (window.location.hash === '#contact-form') {
      handleContactFormNavigation();
    } else if (window.location.hash && typeof handleHashNavigation === 'function') {
      handleHashNavigation();
    }
    
    // Initialize contact form handling
    initializeContactForm();
    
    // Enhance Work With Us section
    enhanceWorkWithUsSection();
    
    // Initialize talk to team buttons
    initializeTalkToTeamButtons();
    
    // Initialize smooth scrolling
    initializeSmoothScrolling();
    
    // Set active navbar item
    setActiveNavbarItem();
  }
});