/**
 * PL-900 Study Materials Module — App Controller
 * Handles: sidebar navigation, progress tracking, scroll spy, mobile menu
 */

(function () {
  'use strict';

  /* ========================================================================
     DOM References
     ======================================================================== */
  const sidebar = document.getElementById('sidebar');
  const overlay = document.getElementById('sidebar-overlay');
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const progressBar = document.getElementById('progress-bar');
  const sidebarProgressFill = document.getElementById('sidebar-progress-fill');
  const backToTopBtn = document.getElementById('back-to-top');
  const allModuleNavBtns = document.querySelectorAll('.module-nav-btn');
  const allSectionLinks = document.querySelectorAll('.section-nav-link');
  const allSections = document.querySelectorAll('.module-section');

  /* ========================================================================
     Mobile Sidebar Toggle
     ======================================================================== */
  if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener('click', () => {
      sidebar.classList.toggle('open');
      overlay.classList.toggle('open');
    });
  }

  if (overlay) {
    overlay.addEventListener('click', () => {
      sidebar.classList.remove('open');
      overlay.classList.remove('open');
    });
  }

  // Close sidebar when a nav link is clicked (mobile)
  allSectionLinks.forEach(link => {
    link.addEventListener('click', () => {
      if (window.innerWidth <= 768) {
        sidebar.classList.remove('open');
        overlay.classList.remove('open');
      }
    });
  });

  /* ========================================================================
     Module Accordion (sidebar)
     ======================================================================== */
  allModuleNavBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const moduleId = btn.getAttribute('data-module');
      const sectionList = document.getElementById(`section-list-${moduleId}`);

      const isOpen = btn.classList.contains('open');

      // Close all
      allModuleNavBtns.forEach(b => {
        b.classList.remove('open');
        const id = b.getAttribute('data-module');
        const list = document.getElementById(`section-list-${id}`);
        if (list) list.classList.remove('open');
      });

      // Open clicked (toggle)
      if (!isOpen) {
        btn.classList.add('open');
        if (sectionList) sectionList.classList.add('open');
      }
    });
  });

  /* ========================================================================
     Reading Progress Bar
     ======================================================================== */
  function updateProgressBar() {
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;

    if (progressBar) progressBar.style.width = pct.toFixed(1) + '%';
    if (sidebarProgressFill) sidebarProgressFill.style.width = pct.toFixed(1) + '%';

    // Update sidebar progress text
    const progressText = document.getElementById('sidebar-progress-text');
    if (progressText) {
      progressText.textContent = `${Math.round(pct)}% complete`;
    }

    // Back to top button
    if (backToTopBtn) {
      if (scrollTop > 400) {
        backToTopBtn.classList.add('visible');
      } else {
        backToTopBtn.classList.remove('visible');
      }
    }
  }

  window.addEventListener('scroll', updateProgressBar, { passive: true });

  /* ========================================================================
     Scroll Spy — Highlight active section in sidebar
     ======================================================================== */
  const observerOptions = {
    root: null,
    rootMargin: '-80px 0px -70% 0px',
    threshold: 0
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const sectionId = entry.target.id;

        // Highlight section links
        allSectionLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
          }
        });

        // Activate the parent module button and open its accordion
        const moduleGroup = entry.target.closest('[data-module-group]');
        if (moduleGroup) {
          const moduleId = moduleGroup.getAttribute('data-module-group');
          allModuleNavBtns.forEach(btn => {
            btn.classList.remove('active');
            const id = btn.getAttribute('data-module');
            const list = document.getElementById(`section-list-${id}`);
            if (id === moduleId) {
              btn.classList.add('active', 'open');
              if (list) list.classList.add('open');
            }
          });
        }
      }
    });
  }, observerOptions);

  allSections.forEach(section => observer.observe(section));

  /* ========================================================================
     Back to Top
     ======================================================================== */
  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ========================================================================
     Smooth Scroll Offset (for sticky header)
     ======================================================================== */
  function scrollToElement(target) {
    if (!target) return;
    const offset = 100;
    const top = target.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: 'smooth' });
  }

  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        scrollToElement(target);
      }
    });
  });

  // Handle hash scroll on initial load (with offset)
  window.addEventListener('load', () => {
    if (window.location.hash) {
      const target = document.querySelector(window.location.hash);
      if (target) {
        // Delay slightly to let layout/fonts load and determine accurate height
        setTimeout(() => {
          scrollToElement(target);
        }, 200);
      }
    }
  });

  /* ========================================================================
     Entrance animations with IntersectionObserver
     ======================================================================== */
  const animObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
        // Clean up inline styling after transition to restore CSS-defined hover styles
        setTimeout(() => {
          if (entry.target) {
            entry.target.style.opacity = '';
            entry.target.style.transform = '';
            entry.target.style.transition = '';
          }
        }, 400);
        animObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08 });

  document.querySelectorAll(
    '.feature-card, .takeaway-card, .numbered-list-item, .platform-card, .security-layer-card, .exam-tip-item'
  ).forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(16px)';
    el.style.transition = 'opacity 0.4s cubic-bezier(0.16, 1, 0.3, 1), transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)';
    animObserver.observe(el);
  });

  // Initialise
  updateProgressBar();

  // Open first module by default
  if (allModuleNavBtns.length > 0) {
    const firstBtn = allModuleNavBtns[0];
    firstBtn.classList.add('open', 'active');
    const firstId = firstBtn.getAttribute('data-module');
    const firstList = document.getElementById(`section-list-${firstId}`);
    if (firstList) firstList.classList.add('open');
  }

})();
