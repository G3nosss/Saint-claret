/**
 * Saint Claret School - Main JavaScript
 * Features: Mobile Nav, Scroll Animations, Ticker, Back-to-Top, Form Handling
 */

'use strict';

// =============================================
// Utility: Run after DOM is ready
// =============================================
document.addEventListener('DOMContentLoaded', () => {
  initNavigation();
  initScrollAnimations();
  initBackToTop();
  initTickerScroll();
  initCounterAnimations();
  initFormHandling();
  initActiveNavLinks();
  initSmoothScroll();
});

// =============================================
// Navigation: Mobile Toggle & Sticky Header
// =============================================
function initNavigation() {
  const toggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');
  const navCta = document.getElementById('navCta');
  const header = document.getElementById('header');

  // Mobile menu toggle
  if (toggle && navLinks) {
    toggle.addEventListener('click', () => {
      const isOpen = navLinks.classList.toggle('open');
      toggle.classList.toggle('open', isOpen);
      toggle.setAttribute('aria-expanded', String(isOpen));
      if (navCta) navCta.classList.toggle('open', isOpen);
    });
  }

  // Close menu on nav link click
  if (navLinks) {
    navLinks.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('open');
        if (navCta) navCta.classList.remove('open');
        if (toggle) {
          toggle.classList.remove('open');
          toggle.setAttribute('aria-expanded', 'false');
        }
      });
    });
  }

  // Close menu on outside click
  document.addEventListener('click', (e) => {
    if (navLinks && navLinks.classList.contains('open')) {
      if (!e.target.closest('#header')) {
        navLinks.classList.remove('open');
        if (navCta) navCta.classList.remove('open');
        if (toggle) {
          toggle.classList.remove('open');
          toggle.setAttribute('aria-expanded', 'false');
        }
      }
    }
  });

  // Sticky header shadow on scroll
  if (header) {
    const onScroll = () => {
      header.classList.toggle('scrolled', window.scrollY > 20);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }
}

// =============================================
// Smooth Scroll for Anchor Links
// =============================================
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
      const targetId = link.getAttribute('href');
      if (!targetId || targetId === '#') return;
      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        const headerH = document.getElementById('header')?.offsetHeight || 80;
        const top = target.getBoundingClientRect().top + window.scrollY - headerH - 16;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });
}

// =============================================
// Active Nav Link Highlighting on Scroll
// =============================================
function initActiveNavLinks() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link[href^="#"]');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach(link => {
          link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
        });
      }
    });
  }, {
    rootMargin: '-20% 0px -70% 0px',
    threshold: 0
  });

  sections.forEach(section => observer.observe(section));
}

// =============================================
// Scroll Reveal Animations
// =============================================
function initScrollAnimations() {
  const elements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');

  if (!elements.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });

  elements.forEach(el => observer.observe(el));
}

// =============================================
// Back to Top Button
// =============================================
function initBackToTop() {
  const btn = document.getElementById('backToTop');
  if (!btn) return;

  const onScroll = () => {
    btn.classList.toggle('visible', window.scrollY > 400);
  };

  window.addEventListener('scroll', onScroll, { passive: true });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

// =============================================
// News Ticker (duplicate content for loop)
// =============================================
function initTickerScroll() {
  const inner = document.querySelector('.ticker-inner');
  if (!inner) return;

  // Clone items for seamless loop
  const items = inner.querySelectorAll('.ticker-item');
  if (items.length) {
    items.forEach(item => {
      const clone = item.cloneNode(true);
      inner.appendChild(clone);
    });
  }
}

// =============================================
// Counter Animations for Stats
// =============================================
function initCounterAnimations() {
  const counters = document.querySelectorAll('[data-count]');
  if (!counters.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(counter => observer.observe(counter));
}

function animateCounter(element) {
  const target = parseInt(element.getAttribute('data-count'), 10);
  const suffix = element.getAttribute('data-suffix') || '';
  const prefix = element.getAttribute('data-prefix') || '';
  const duration = 1800;
  const start = performance.now();

  const update = (time) => {
    const elapsed = time - start;
    const progress = Math.min(elapsed / duration, 1);
    // Ease out cubic
    const eased = 1 - Math.pow(1 - progress, 3);
    const current = Math.round(eased * target);
    element.textContent = prefix + current.toLocaleString() + suffix;
    if (progress < 1) requestAnimationFrame(update);
  };

  requestAnimationFrame(update);
}

// =============================================
// Contact Form Handling
// =============================================
function initFormHandling() {
  const form = document.getElementById('contactForm');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const btn = form.querySelector('[type="submit"]');
    const originalText = btn.innerHTML;

    // Validate
    const fields = form.querySelectorAll('[required]');
    let valid = true;
    fields.forEach(field => {
      field.style.borderColor = '';
      if (!field.value.trim()) {
        field.style.borderColor = '#e53e3e';
        valid = false;
      }
    });

    if (!valid) {
      showFormMessage(form, 'Please fill in all required fields.', 'error');
      return;
    }

    // Simulate submission
    btn.innerHTML = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2a10 10 0 1 0 10 10"/></svg> Sending…`;
    btn.disabled = true;

    setTimeout(() => {
      btn.innerHTML = originalText;
      btn.disabled = false;
      form.reset();
      showFormMessage(form, '✓ Thank you! We\'ll get back to you within 24 hours.', 'success');
    }, 2000);
  });
}

function showFormMessage(form, message, type) {
  const existing = form.querySelector('.form-message');
  if (existing) existing.remove();

  const msg = document.createElement('div');
  msg.className = 'form-message';
  msg.textContent = message;
  msg.style.cssText = `
    margin-top: 14px;
    padding: 14px 18px;
    border-radius: 8px;
    font-size: 0.9rem;
    font-weight: 500;
    background: ${type === 'success' ? 'rgba(56, 161, 105, 0.1)' : 'rgba(229, 62, 62, 0.1)'};
    color: ${type === 'success' ? '#276749' : '#9b2c2c'};
    border: 1px solid ${type === 'success' ? 'rgba(56, 161, 105, 0.3)' : 'rgba(229, 62, 62, 0.3)'};
  `;

  form.appendChild(msg);

  if (type === 'success') {
    setTimeout(() => msg.remove(), 5000);
  }
}

// =============================================
// Keyboard Accessibility Enhancements
// =============================================
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    const navLinks = document.getElementById('navLinks');
    const navCta = document.getElementById('navCta');
    const toggle = document.getElementById('navToggle');
    if (navLinks && navLinks.classList.contains('open')) {
      navLinks.classList.remove('open');
      if (navCta) navCta.classList.remove('open');
      if (toggle) {
        toggle.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
        toggle.focus();
      }
    }
  }
});
