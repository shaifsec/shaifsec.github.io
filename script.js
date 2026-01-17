/* ========================================
   CYBERSECURITY SERVICE WEBSITE - SCRIPT
   Smooth scrolling, form handling, animations
   ======================================== */

// Mobile Menu Toggle
const hamburger = document.getElementById('hamburger');
const navMenu = document.querySelector('.nav-menu');

if (hamburger) {
  hamburger.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    hamburger.classList.toggle('active');
  });

  // Close menu when link is clicked
  document.querySelectorAll('.nav-menu a').forEach(link => {
    link.addEventListener('click', () => {
      navMenu.classList.remove('active');
      hamburger.classList.remove('active');
    });
  });
}

// Contact Form Handling
const contactForm = document.getElementById('contactForm');

if (contactForm) {
  contactForm.addEventListener('submit', function(e) {
    e.preventDefault();

    // Get form data
    const formData = new FormData(this);
    const data = {
      name: formData.get('name'),
      email: formData.get('email'),
      company: formData.get('company'),
      message: formData.get('message')
    };

    // Validate form
    if (!data.name || !data.email || !data.message) {
      alert('Please fill in all required fields');
      return;
    }

    // Send email via mailto (fallback)
    const mailtoLink = `mailto:shaifsec@gmail.com?subject=Security Assessment Inquiry from ${encodeURIComponent(data.name)}&body=Name: ${encodeURIComponent(data.name)}%0AEmail: ${encodeURIComponent(data.email)}%0ACompany: ${encodeURIComponent(data.company)}%0A%0AMessage:%0A${encodeURIComponent(data.message)}`;

    window.location.href = mailtoLink;

    // Clear form
    this.reset();

    // Show success message
    const btn = this.querySelector('button[type="submit"]');
    const originalText = btn.textContent;
    btn.textContent = 'Message Sent!';
    btn.style.background = '#00ff00';

    setTimeout(() => {
      btn.textContent = originalText;
      btn.style.background = '';
    }, 3000);
  });
}

// Intersection Observer for fade-in animations
const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('fade-in');
      observer.unobserve(entry.target);
    }
  });
}, observerOptions);

// Observe all service cards and benefit items
document.querySelectorAll('.service-card, .benefit-item, .stat-card, .testimonial-card').forEach(el => {
  observer.observe(el);
});

// Smooth scroll behavior for navigation links
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

// Active nav link highlight
window.addEventListener('scroll', () => {
  const sections = document.querySelectorAll('section[id]');
  const scrollY = window.pageYOffset;

  sections.forEach(current => {
    const sectionHeight = current.offsetHeight;
    const sectionTop = current.offsetTop - 200;
    const sectionId = current.getAttribute('id');
    const navLink = document.querySelector(`.nav-menu a[href="#${sectionId}"]`);

    if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
      // Remove active class from all links
      document.querySelectorAll('.nav-menu a').forEach(link => {
        link.style.color = '';
        link.style.textShadow = '';
      });

      // Add active style to current link
      if (navLink) {
        navLink.style.color = '#ff0055';
        navLink.style.textShadow = '0 0 10px rgba(255, 0, 85, 0.5)';
      }
    }
  });
});

// Add visual feedback to interactive elements
document.querySelectorAll('.service-card, .benefit-item, .stat-card, .testimonial-card').forEach(card => {
  card.addEventListener('mouseenter', () => {
    card.style.transform = 'translateY(-5px)';
  });

  card.addEventListener('mouseleave', () => {
    card.style.transform = 'translateY(0)';
  });
});

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
  console.log('ShaifSec Security Website Loaded');

  // Add entrance animations
  const hero = document.querySelector('.hero-content');
  if (hero) {
    hero.style.animation = 'fadeInLeft 0.8s ease-out';
  }

  // Animate counter numbers
  const statValues = document.querySelectorAll('.stat-value');
  statValues.forEach(stat => {
    const target = parseInt(stat.getAttribute('data-count'));
    animateCounter(stat, target);
  });

  // Log analytics (optional)
  console.log('Page loaded at:', new Date().toLocaleString());
});

// Counter Animation Function
function animateCounter(element, target) {
  let current = 0;
  const increment = target / 50; // 50 steps for smooth animation
  const duration = 2000; // 2 seconds
  const stepTime = duration / 50;

  const timer = setInterval(() => {
    current += increment;
    if (current >= target) {
      element.textContent = target;
      clearInterval(timer);
    } else {
      element.textContent = Math.floor(current);
    }
  }, stepTime);
}

// Unload handler (cleanup)
window.addEventListener('beforeunload', () => {
  // Cleanup if needed
  console.log('User leaving page');
});

// init
document.addEventListener('DOMContentLoaded', ()=>{
  document.getElementById('targetDomain').value = 'target.com'; // default target
  document.body.setAttribute('data-theme','dark');
  const toggle = document.getElementById('toggleTheme');
  if(toggle) toggle.textContent = 'Light theme';

  attachDorkHandlers();
  initThemeToggle();
});
