/**
 * Main Interactive Logic - Shivang Pandey Portfolio
 * (Full-Stack Web Developer & Python Backend Specialist)
 */

(function () {
  'use strict';

  // --- Project Detailed Data for Quick-View Modal ---
  const PROJECTS_DATA = {
    swiftkart: {
      title: 'SwiftKart - Full-Stack Modern E-Commerce Platform',
      tag: 'Python Backend & React/JS',
      badge: 'FastAPI / Flask & JavaScript',
      desc: 'SwiftKart is an end-to-end e-commerce platform featuring a high-performance Python backend and an interactive frontend. Engineered for responsive product browsing, client-side live catalog search, persistent cart checkout pipeline, and relational database order processing.',
      features: [
        'Robust Python backend with modular RESTful endpoints and structured data validation',
        'Interactive frontend built with JavaScript (ES6+) and React-style responsive UI components',
        'Instant multi-parameter catalog filtering (category, price range, stock availability)',
        'Persistent cart state synchronized across tabs and SQLite / PostgreSQL database transactions'
      ],
      metrics: [
        { label: 'Architecture', val: 'Python REST API' },
        { label: 'Frontend', val: 'React & JavaScript' }
      ],
      tech: ['Python', 'FastAPI / Flask', 'JavaScript (ES6+)', 'React.js', 'SQLite / PostgreSQL', 'REST APIs'],
      github: 'https://github.com',
      demo: '#'
    },

    stockflow: {
      title: 'StockFlow - Enterprise Inventory & Management Platform',
      tag: 'Python / Django & JavaScript',
      badge: 'Django ORM & Database Design',
      desc: 'StockFlow is a business inventory and multi-warehouse management system built with Python and Django. Features structured relational models, automated supplier replenishment triggers, role-based authentication, and live turnover analytics dashboards.',
      features: [
        'Django ORM models with normalized schemas and optimized multi-table join queries',
        'Role-based access control (Admin, Inventory Manager, Operations) with session security',
        'Interactive dashboard built with JavaScript to visualize stock metrics and inventory turnover',
        'Automated low-stock alert triggers and purchase order generation pipelines'
      ],
      metrics: [
        { label: 'Backend Framework', val: 'Django' },
        { label: 'Database', val: 'PostgreSQL' }
      ],
      tech: ['Python', 'Django', 'PostgreSQL', 'JavaScript', 'Django REST Framework', 'Chart.js'],
      github: 'https://github.com',
      demo: '#'
    },

    ministore: {
      title: 'MiniStore - Modular E-Commerce & Order Management Engine',
      tag: 'Python / Flask Web App',
      badge: 'Flask & Relational Database',
      desc: 'MiniStore is a modular e-commerce web application featuring dynamic catalog management, customer authentication, automated cart calculations, and relational database migrations built with Python and Flask.',
      features: [
        'Structured relational SQL database schemas with foreign-key constraints and migrations',
        'Flask blueprints architecture cleanly separating routes, controllers, and database models',
        'Interactive product catalog with image galleries and inventory stock badges',
        'Frontend interactivity crafted with modern JavaScript and responsive UI styling'
      ],
      metrics: [
        { label: 'Pattern', val: 'Flask Blueprints' },
        { label: 'Database CRUD', val: 'SQLite / MySQL' }
      ],
      tech: ['Python', 'Flask', 'SQLite / MySQL', 'JavaScript', 'Jinja2', 'HTML5 & CSS3'],
      github: 'https://github.com',
      demo: '#'
    },

    taskflow: {
      title: 'TaskFlow Pro - Real-Time Sprint & Task Tracker',
      tag: 'React & Flask Application',
      badge: 'Flask REST API & React UI',
      desc: 'TaskFlow Pro combines a lightweight Flask RESTful API backend with a reactive JavaScript / React user interface for managing engineering tasks, priorities, and sprint backlogs in real-time.',
      features: [
        'RESTful API backend in Flask providing full CRUD operations for tasks and categories',
        'Dynamic frontend built with React.js / modern JavaScript with responsive state management',
        'Filterable by priority (Urgent, High, Normal, Low) with instant client-side updates',
        'Persistent SQLite / LocalStorage synchronization preventing state conflicts'
      ],
      metrics: [
        { label: 'Backend API', val: 'Flask REST API' },
        { label: 'Frontend UI', val: 'React & JavaScript' }
      ],
      tech: ['Python', 'Flask', 'React.js', 'JavaScript', 'REST APIs', 'SQLite'],
      github: 'https://github.com',
      demo: '#'
    }
  };

  // --- Dynamic Typewriter Subtitle (Python Backend & React/JS) ---
  const typewriterElement = document.getElementById('typewriter-text');
  const roles = [
    'Full-Stack Web Developer',
    'Python Backend Developer',
    'Django & FastAPI Developer',
    'REST API Developer',
    'Business Web Application Developer'
  ];
  let roleIdx = 0;
  let charIdx = 0;
  let isDeleting = false;
  const typeSpeed = 85;
  const deleteSpeed = 40;
  const delayBetweenRoles = 2000;

  function typeEffect() {
    if (!typewriterElement) return;

    const currentRole = roles[roleIdx];

    if (isDeleting) {
      typewriterElement.textContent = currentRole.substring(0, charIdx - 1);
      charIdx--;
    } else {
      typewriterElement.textContent = currentRole.substring(0, charIdx + 1);
      charIdx++;
    }

    let speed = isDeleting ? deleteSpeed : typeSpeed;

    if (!isDeleting && charIdx === currentRole.length) {
      speed = delayBetweenRoles;
      isDeleting = true;
    } else if (isDeleting && charIdx === 0) {
      isDeleting = false;
      roleIdx = (roleIdx + 1) % roles.length;
      speed = 350;
    }

    setTimeout(typeEffect, speed);
  }

  // --- Theme Picker Switcher ---
  function initTheme() {
    const savedTheme = localStorage.getItem('portfolio-theme') || 'violet';
    setTheme(savedTheme);

    document.querySelectorAll('.theme-dot').forEach(dot => {
      dot.addEventListener('click', () => {
        const pick = dot.getAttribute('data-pick');
        if (pick) setTheme(pick);
      });
    });
  }

  function setTheme(themeName) {
    if (themeName === 'violet') {
      document.documentElement.removeAttribute('data-theme');
    } else {
      document.documentElement.setAttribute('data-theme', themeName);
    }
    localStorage.setItem('portfolio-theme', themeName);

    document.querySelectorAll('.theme-dot').forEach(dot => {
      dot.classList.toggle('active', dot.getAttribute('data-pick') === themeName);
    });
  }

  // --- Navbar Scroll & Mobile Toggle ---
  const header = document.querySelector('.header');
  const mobileToggle = document.getElementById('mobile-toggle');
  const navLinks = document.getElementById('nav-links');

  function initNav() {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 40) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }

      // Back to top button visibility
      const btt = document.getElementById('back-to-top');
      if (btt) {
        if (window.scrollY > 450) {
          btt.classList.add('visible');
        } else {
          btt.classList.remove('visible');
        }
      }

      updateActiveNavOnScroll();
    }, { passive: true });

    if (mobileToggle && navLinks) {
      mobileToggle.addEventListener('click', () => {
        mobileToggle.classList.toggle('open');
        navLinks.classList.toggle('open');
      });

      navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
          mobileToggle.classList.remove('open');
          navLinks.classList.remove('open');
        });
      });
    }

    // Back to top click
    const btt = document.getElementById('back-to-top');
    if (btt) {
      btt.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
    }
  }

  function updateActiveNavOnScroll() {
    const sections = document.querySelectorAll('section[id]');
    const scrollY = window.pageYOffset;

    sections.forEach(section => {
      const sectionHeight = section.offsetHeight;
      const sectionTop = section.offsetTop - 140;
      const sectionId = section.getAttribute('id');
      const navItem = document.querySelector(`.nav-links a[href*="${sectionId}"]`);

      if (navItem) {
        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
          navItem.classList.add('active');
        } else {
          navItem.classList.remove('active');
        }
      }
    });
  }

  // --- Projects Filtering & Quick-View Modal ---
  const projectFilterTabs = document.querySelectorAll('.project-tab');
  const projectCards = document.querySelectorAll('.project-card');
  const modalOverlay = document.getElementById('project-modal');
  const modalCloseBtn = document.getElementById('modal-close-btn');

  function initProjectFeatures() {
    // Project Category Filtering
    projectFilterTabs.forEach(tab => {
      tab.addEventListener('click', () => {
        projectFilterTabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');

        const filter = tab.getAttribute('data-filter');

        document.querySelectorAll('.project-card').forEach(card => {
          const category = card.getAttribute('data-category') || '';
          if (filter === 'all' || category.includes(filter)) {
            card.style.display = 'flex';
          } else {
            card.style.display = 'none';
          }
        });
      });
    });

    // Quick-View Triggers
    document.querySelectorAll('.btn-quickview').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const projectId = btn.getAttribute('data-project');
        openProjectModal(projectId);
      });
    });

    if (modalCloseBtn) {
      modalCloseBtn.addEventListener('click', closeProjectModal);
    }
    if (modalOverlay) {
      modalOverlay.addEventListener('click', (e) => {
        if (e.target === modalOverlay) closeProjectModal();
      });
    }

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modalOverlay && modalOverlay.classList.contains('active')) {
        closeProjectModal();
      }
    });
  }

  function openProjectModal(projectId) {
    const data = PROJECTS_DATA[projectId];
    if (!data || !modalOverlay) return;

    document.getElementById('modal-badge').textContent = data.badge;
    document.getElementById('modal-title').textContent = data.title;
    document.getElementById('modal-desc').textContent = data.desc;

    // Features
    const featuresList = document.getElementById('modal-features');
    featuresList.innerHTML = '';
    data.features.forEach(f => {
      const li = document.createElement('li');
      li.textContent = f;
      featuresList.appendChild(li);
    });

    // Metrics
    const metricsGrid = document.getElementById('modal-metrics');
    metricsGrid.innerHTML = '';
    data.metrics.forEach(m => {
      const card = document.createElement('div');
      card.className = 'modal-metric-card';
      card.innerHTML = `<div class="modal-metric-val">${m.val}</div><div class="modal-metric-lbl">${m.label}</div>`;
      metricsGrid.appendChild(card);
    });

    // Tech
    const techBox = document.getElementById('modal-tech');
    techBox.innerHTML = '';
    data.tech.forEach(t => {
      const span = document.createElement('span');
      span.className = 'tech-pill';
      span.textContent = t;
      techBox.appendChild(span);
    });

    modalOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeProjectModal() {
    if (!modalOverlay) return;
    modalOverlay.classList.remove('active');
    document.body.style.overflow = '';
  }

  // --- Skills Filter Tabs ---
  const skillFilterTabs = document.querySelectorAll('.skill-tab');
  const skillCards = document.querySelectorAll('.skill-card');

  function initSkillsFilter() {
    skillFilterTabs.forEach(tab => {
      tab.addEventListener('click', () => {
        skillFilterTabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');

        const filter = tab.getAttribute('data-skill-filter');

        skillCards.forEach(card => {
          const cat = card.getAttribute('data-skill-cat') || '';
          if (filter === 'all' || cat === filter) {
            card.style.display = 'flex';
          } else {
            card.style.display = 'none';
          }
        });
      });
    });
  }

  // --- Live Number Counter Animation ---
  function initNumberCounters() {
    const statsSection = document.querySelector('.hero-stats');
    if (!statsSection) return;

    let hasAnimated = false;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !hasAnimated) {
          hasAnimated = true;
          document.querySelectorAll('.stat-number').forEach(counter => {
            const target = parseInt(counter.getAttribute('data-target'), 10) || 0;
            const suffix = counter.getAttribute('data-suffix') || '';
            animateCounter(counter, target, suffix);
          });
        }
      });
    }, { threshold: 0.5 });

    observer.observe(statsSection);
  }

  function animateCounter(element, target, suffix) {
    let current = 0;
    const duration = 1400;
    const stepTime = 25;
    const steps = duration / stepTime;
    const increment = target / steps;

    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        element.textContent = target + suffix;
        clearInterval(timer);
      } else {
        element.textContent = Math.floor(current) + suffix;
      }
    }, stepTime);
  }

  // --- Copy Email to Clipboard Widget ---
  const copyBtn = document.getElementById('btn-copy-email');
  if (copyBtn) {
    copyBtn.addEventListener('click', () => {
      const email = 'pandeyshivang987@gmail.com';
      navigator.clipboard.writeText(email).then(() => {
        showToast('✔ Copied pandeyshivang987@gmail.com to clipboard!');
      }).catch(() => {
        showToast('Direct email: pandeyshivang987@gmail.com');
      });
    });
  }

  // --- Copy Phone Number to Clipboard Widget ---
  const copyPhoneBtn = document.getElementById('btn-copy-phone');
  if (copyPhoneBtn) {
    copyPhoneBtn.addEventListener('click', () => {
      const phone = '+919026399211';
      navigator.clipboard.writeText(phone).then(() => {
        showToast('✔ Copied +91 9026399211 to clipboard!');
      }).catch(() => {
        showToast('Direct phone: +91 9026399211');
      });
    });
  }

  // --- Contact Form Submission ---
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('form-name').value.trim();
      const email = document.getElementById('form-email').value.trim();
      const message = document.getElementById('form-message').value.trim();

      if (!name || !email || !message) {
        showToast('⚠ Please fill in all fields before sending.');
        return;
      }

      showToast(`⚡ Thank you ${name}! Shivang will respond to your email shortly.`);
      contactForm.reset();

      // Launch mailto fallback
      setTimeout(() => {
        const mailtoUrl = `mailto:pandeyshivang987@gmail.com?subject=Portfolio Inquiry from ${encodeURIComponent(name)}&body=${encodeURIComponent(message + '\n\nFrom: ' + name + ' (' + email + ')')}`;
        window.location.href = mailtoUrl;
      }, 1200);
    });
  }

  // --- Global Toast Notifications ---
  function showToast(message) {
    let container = document.querySelector('.toast-container');
    if (!container) {
      container = document.createElement('div');
      container.className = 'toast-container';
      document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `<span>${escapeHtml(message)}</span>`;
    container.appendChild(toast);

    setTimeout(() => {
      toast.classList.add('toast-out');
      setTimeout(() => toast.remove(), 300);
    }, 3500);
  }

  function escapeHtml(str) {
    return str.replace(/[&<>"']/g, function (m) {
      switch (m) {
        case '&': return '&amp;';
        case '<': return '&lt;';
        case '>': return '&gt;';
        case '"': return '&quot;';
        case "'": return '&#39;';
        default: return m;
      }
    });
  }

  // --- Initialize Everything ---
  window.addEventListener('DOMContentLoaded', () => {
    initTheme();
    initNav();
    typeEffect();
    initProjectFeatures();
    initSkillsFilter();
  });
})();
