/* ========================================
   CYBERSECURITY SERVICE WEBSITE - SCRIPT
   Form handling, smooth scrolling, and mobile nav
   ======================================== */

function setActiveNavLink() {
  const currentUrl = new URL(window.location.href);
  const currentPath = currentUrl.pathname.replace(/\/index\.html$/, '/');

  document.querySelectorAll('.nav-menu a').forEach(link => {
    const href = link.getAttribute('href') || '';
    const targetUrl = new URL(href, currentUrl);
    const targetPath = targetUrl.pathname.replace(/\/index\.html$/, '/');
    const onHomePage = currentPath === '/';
    const onResourcesPage = currentPath.startsWith('/resources/');
    const onBlogPage = currentPath.startsWith('/blog/');
    const isActive = onHomePage
      ? targetPath === '/' && (targetUrl.hash || '#hero') === (currentUrl.hash || '#hero')
      : onResourcesPage
        ? targetPath === '/resources/'
        : onBlogPage
          ? targetPath === '/blog/'
          : false;

    link.classList.toggle('active', isActive);
  });
}

function setTheme(theme) {
  const isDark = theme === 'dark';
  document.documentElement.dataset.theme = theme;

  const toggle = document.getElementById('theme-toggle');
  if (toggle) {
    const nextTheme = isDark ? 'light' : 'dark';
    toggle.setAttribute('aria-label', `Switch to ${nextTheme} mode`);
    toggle.title = `Switch to ${nextTheme} mode`;
  }
}

const savedTheme = localStorage.getItem('shaifsec-theme');
const systemTheme = matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
setTheme(savedTheme === 'light' || savedTheme === 'dark' ? savedTheme : systemTheme);

matchMedia('(prefers-color-scheme: light)').addEventListener('change', event => {
  const preference = localStorage.getItem('shaifsec-theme');
  if (preference !== 'light' && preference !== 'dark') {
    setTheme(event.matches ? 'light' : 'dark');
  }
});

window.addEventListener('storage', event => {
  if (event.key === 'shaifsec-theme') {
    const preference = event.newValue;
    setTheme(preference === 'light' || preference === 'dark' ? preference : systemTheme);
  }
});

function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      const target = document.querySelector(targetId);

      if (!target) return;

      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      window.history.pushState(null, '', targetId);
      setActiveNavLink();
    });
  });

  document.querySelectorAll('.nav-menu a[href*="index.html#"]').forEach(anchor => {
    anchor.addEventListener('click', function (event) {
      event.preventDefault();
      const destination = new URL(this.getAttribute('href'), window.location.href);
      window.location.assign(`${destination.pathname}${destination.search}${destination.hash}`);
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
      url: formData.get('url'),
      service: formData.get('service'),
      message: formData.get('message')
    };

    if (!data.name || !data.email || !data.message) {
      alert('Please fill in all required fields');
      return;
    }

    const mailtoLink = `mailto:shaifsec@gmail.com?subject=${encodeURIComponent(`Security Assessment Inquiry - ${data.service}`)}&body=Name: ${encodeURIComponent(data.name)}%0AEmail: ${encodeURIComponent(data.email)}%0ACompany: ${encodeURIComponent(data.company || 'Not provided')}%0AWebsite / Application: ${encodeURIComponent(data.url || 'Not provided')}%0AService: ${encodeURIComponent(data.service)}%0A%0AMessage:%0A${encodeURIComponent(data.message)}`;

    window.location.href = mailtoLink;
    this.reset();

    const btn = this.querySelector('button[type="submit"]');
    if (btn) {
      const originalText = btn.textContent;
      btn.textContent = 'Opening Email';

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
  setTheme(document.documentElement.dataset.theme || 'dark');

  const themeToggle = document.getElementById('theme-toggle');
  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const nextTheme = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
      localStorage.setItem('shaifsec-theme', nextTheme);
      setTheme(nextTheme);
    });
  }

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

  document.querySelectorAll('.service-link[data-service]').forEach(link => {
    link.addEventListener('click', () => {
      const select = document.getElementById('contact-service');
      if (select) select.value = link.dataset.service;
    });
  });

  if (hamburger && navMenu) {
    const setMenuOpen = (isOpen) => {
      navMenu.classList.toggle('active', isOpen);
      hamburger.classList.toggle('active', isOpen);
      hamburger.setAttribute('aria-expanded', String(isOpen));
    };

    hamburger.addEventListener('click', () => {
      setMenuOpen(!navMenu.classList.contains('active'));
    });

    navMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => setMenuOpen(false));
    });

    document.addEventListener('keydown', event => {
      if (event.key === 'Escape' && navMenu.classList.contains('active')) {
        setMenuOpen(false);
        hamburger.focus();
      }
    });

    document.addEventListener('click', event => {
      if (!navMenu.contains(event.target) && !hamburger.contains(event.target)) {
        setMenuOpen(false);
      }
    });

    window.addEventListener('resize', () => {
      if (window.innerWidth > 1280) setMenuOpen(false);
    });
  }
});

window.addEventListener('hashchange', setActiveNavLink);
