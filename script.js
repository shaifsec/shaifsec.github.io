/* ========================================
   CYBERSECURITY SERVICE WEBSITE - SCRIPT
   Form handling, smooth scrolling, and mobile nav
   ======================================== */

function setActiveNavLink() {
  const pathname = window.location.pathname;
  const hash = window.location.hash;

  document.querySelectorAll('.nav-menu a').forEach(link => {
    const href = link.getAttribute('href') || '';
    let isActive = false;

    if (pathname.includes('/resources/')) {
      isActive = href.includes('resources');
    } else if (pathname.includes('/blog/')) {
      isActive = href.includes('blog');
    } else if (pathname === '/' || pathname.endsWith('/index.html')) {
      if (href === '#hero' && (!hash || hash === '#hero')) {
        isActive = true;
      } else if (href === '#contact' && hash === '#contact') {
        isActive = true;
      }
    }

    link.classList.toggle('active', isActive);
  });
}

function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      const target = document.querySelector(targetId);

      if (!target) return;

      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      window.history.pushState(null, '', targetId);
    });
  });
}

function animateCounter(element, target) {
  let current = 0;
  const increment = target / 50;
  const duration = 2000;
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

const contactForm = document.getElementById('contactForm');

if (contactForm) {
  contactForm.addEventListener('submit', function (e) {
    e.preventDefault();

    const formData = new FormData(this);
    const data = {
      name: formData.get('name'),
      email: formData.get('email'),
      company: formData.get('company'),
      message: formData.get('message')
    };

    if (!data.name || !data.email || !data.message) {
      alert('Please fill in all required fields');
      return;
    }

    const mailtoLink = `mailto:shaifsec@gmail.com?subject=Security Assessment Inquiry from ${encodeURIComponent(data.name)}&body=Name: ${encodeURIComponent(data.name)}%0AEmail: ${encodeURIComponent(data.email)}%0ACompany: ${encodeURIComponent(data.company)}%0A%0AMessage:%0A${encodeURIComponent(data.message)}`;

    window.location.href = mailtoLink;
    this.reset();

    const btn = this.querySelector('button[type="submit"]');
    if (btn) {
      const originalText = btn.textContent;
      btn.textContent = 'Message Sent!';
      btn.style.background = '#00ff00';

      setTimeout(() => {
        btn.textContent = originalText;
        btn.style.background = '';
      }, 3000);
    }
  });
}

document.addEventListener('DOMContentLoaded', () => {
  setActiveNavLink();
  initSmoothScroll();

  const hero = document.querySelector('.hero-content');
  if (hero) {
    hero.style.animation = 'fadeInLeft 0.8s ease-out';
  }

  const statValues = document.querySelectorAll('.stat-value');
  statValues.forEach(stat => {
    const target = parseInt(stat.getAttribute('data-count'));
    animateCounter(stat, target);
  });

  const hamburger = document.getElementById('hamburger');
  const navMenu = document.querySelector('.nav-menu');

  if (hamburger && navMenu) {
    hamburger.addEventListener('click', () => {
      const isActive = navMenu.classList.toggle('active');
      hamburger.classList.toggle('active');

      if (window.innerWidth <= 768) {
        if (isActive) {
          navMenu.style.display = 'flex';
          navMenu.style.flexDirection = 'column';
          navMenu.style.position = 'absolute';
          navMenu.style.top = '64px';
          navMenu.style.right = '16px';
          navMenu.style.background = 'rgba(9,22,40,0.95)';
          navMenu.style.padding = '12px 16px';
          navMenu.style.borderRadius = '10px';
          navMenu.style.boxShadow = '0 8px 24px rgba(0,0,0,0.5)';
          navMenu.style.zIndex = '2000';
        } else {
          navMenu.style.removeProperty('display');
          navMenu.style.removeProperty('flex-direction');
          navMenu.style.removeProperty('position');
          navMenu.style.removeProperty('top');
          navMenu.style.removeProperty('right');
          navMenu.style.removeProperty('background');
          navMenu.style.removeProperty('padding');
          navMenu.style.removeProperty('border-radius');
          navMenu.style.removeProperty('box-shadow');
          navMenu.style.removeProperty('z-index');
        }
      }
    });

    navMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        hamburger.classList.remove('active');
      });
    });
  }
});

window.addEventListener('hashchange', setActiveNavLink);
