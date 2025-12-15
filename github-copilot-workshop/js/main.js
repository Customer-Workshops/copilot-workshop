/**
 * GitHub Copilot Workshop - Main JavaScript
 * Handles theme switching, navigation, and step progression
 */

(function () {
  'use strict';

  // DOM Elements
  const themeToggle = document.getElementById('theme-toggle');
  const sidebarToggle = document.getElementById('sidebar-toggle');
  const sidebarOverlay = document.getElementById('sidebar-overlay');
  const sidebar = document.getElementById('workshop-sidebar');

  /**
   * Theme Management
   */
  const ThemeManager = {
    storageKey: 'copilot-workshop-theme',

    init() {
      const savedTheme = localStorage.getItem(this.storageKey);
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      const theme = savedTheme || (prefersDark ? 'dark' : 'dark');
      this.setTheme(theme);
      this.bindEvents();
    },

    setTheme(theme) {
      document.documentElement.setAttribute('data-theme', theme);
      localStorage.setItem(this.storageKey, theme);
      this.updateToggleButton(theme);
    },

    toggle() {
      const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      this.setTheme(newTheme);
    },

    updateToggleButton(theme) {
      if (!themeToggle) return;
      const icon = themeToggle.querySelector('.theme-toggle-icon');
      const text = themeToggle.querySelector('.theme-toggle-text');
      
      if (theme === 'dark') {
        if (icon) icon.innerHTML = `<path d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>`;
        if (text) text.textContent = 'Light';
      } else {
        if (icon) icon.innerHTML = `<path d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>`;
        if (text) text.textContent = 'Dark';
      }
    },

    bindEvents() {
      if (themeToggle) {
        themeToggle.addEventListener('click', () => this.toggle());
      }
    }
  };

  /**
   * Mobile Sidebar Management
   */
  const SidebarManager = {
    init() {
      this.bindEvents();
    },

    open() {
      if (sidebar) sidebar.classList.add('open');
      if (sidebarOverlay) sidebarOverlay.classList.add('open');
      document.body.style.overflow = 'hidden';
    },

    close() {
      if (sidebar) sidebar.classList.remove('open');
      if (sidebarOverlay) sidebarOverlay.classList.remove('open');
      document.body.style.overflow = '';
    },

    toggle() {
      const isOpen = sidebar && sidebar.classList.contains('open');
      if (isOpen) {
        this.close();
      } else {
        this.open();
      }
    },

    bindEvents() {
      if (sidebarToggle) {
        sidebarToggle.addEventListener('click', () => this.toggle());
      }
      if (sidebarOverlay) {
        sidebarOverlay.addEventListener('click', () => this.close());
      }
    }
  };

  /**
   * Step Navigation Management
   */
  const StepManager = {
    storageKeyPrefix: 'copilot-workshop-progress-',
    currentStep: 1,
    totalSteps: 0,

    init() {
      const stepSections = document.querySelectorAll('.step-section');
      this.totalSteps = stepSections.length;

      if (this.totalSteps === 0) return;

      // Get current step from URL hash or storage
      const hashStep = this.getStepFromHash();
      const savedStep = this.getSavedStep();
      this.currentStep = hashStep || savedStep || 1;

      this.showStep(this.currentStep);
      this.bindEvents();
      this.updateProgress();
    },

    getStepFromHash() {
      const hash = window.location.hash;
      if (hash && hash.startsWith('#step-')) {
        const step = parseInt(hash.replace('#step-', ''), 10);
        if (step >= 1 && step <= this.totalSteps) {
          return step;
        }
      }
      return null;
    },

    getSavedStep() {
      const pagePath = this.getPagePath();
      const saved = localStorage.getItem(this.storageKeyPrefix + pagePath);
      return saved ? parseInt(saved, 10) : null;
    },

    saveStep(step) {
      const pagePath = this.getPagePath();
      localStorage.setItem(this.storageKeyPrefix + pagePath, step);
    },

    getPagePath() {
      // Use encodeURIComponent to create safe localStorage key names from pathname
      return encodeURIComponent(window.location.pathname);
    },

    showStep(step) {
      if (step < 1 || step > this.totalSteps) return;

      this.currentStep = step;

      // Hide all steps
      document.querySelectorAll('.step-section').forEach(section => {
        section.classList.remove('active');
      });

      // Show current step
      const currentSection = document.getElementById(`step-${step}`);
      if (currentSection) {
        currentSection.classList.add('active');
      }

      // Update sidebar navigation
      this.updateSidebarNav();

      // Update URL hash
      history.replaceState(null, '', `#step-${step}`);

      // Save progress
      this.saveStep(step);

      // Update progress bar
      this.updateProgress();

      // Scroll to top of content
      const content = document.querySelector('.workshop-content');
      if (content) {
        content.scrollTo(0, 0);
      }

      // Close mobile sidebar if open
      SidebarManager.close();
    },

    updateSidebarNav() {
      document.querySelectorAll('.sidebar-nav-link').forEach((link, index) => {
        const stepNum = index + 1;
        link.classList.remove('active', 'completed');
        
        if (stepNum === this.currentStep) {
          link.classList.add('active');
        } else if (stepNum < this.currentStep) {
          link.classList.add('completed');
        }
      });
    },

    updateProgress() {
      const progressFill = document.querySelector('.progress-fill');
      const progressCurrent = document.querySelector('.progress-current');
      const progressTotal = document.querySelector('.progress-total');

      if (progressFill) {
        const percentage = (this.currentStep / this.totalSteps) * 100;
        progressFill.style.width = `${percentage}%`;
      }

      if (progressCurrent) {
        progressCurrent.textContent = this.currentStep;
      }

      if (progressTotal) {
        progressTotal.textContent = this.totalSteps;
      }
    },

    nextStep() {
      if (this.currentStep < this.totalSteps) {
        this.showStep(this.currentStep + 1);
      }
    },

    prevStep() {
      if (this.currentStep > 1) {
        this.showStep(this.currentStep - 1);
      }
    },

    bindEvents() {
      // Sidebar nav clicks
      document.querySelectorAll('.sidebar-nav-link').forEach((link, index) => {
        link.addEventListener('click', (e) => {
          e.preventDefault();
          this.showStep(index + 1);
        });
      });

      // Next/Prev buttons
      document.querySelectorAll('.step-nav-next').forEach(btn => {
        btn.addEventListener('click', () => this.nextStep());
      });

      document.querySelectorAll('.step-nav-prev').forEach(btn => {
        btn.addEventListener('click', () => this.prevStep());
      });

      // Hash change
      window.addEventListener('hashchange', () => {
        const step = this.getStepFromHash();
        if (step) {
          this.showStep(step);
        }
      });

      // Keyboard navigation
      document.addEventListener('keydown', (e) => {
        // Only if not typing in an input
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

        if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
          e.preventDefault();
          this.nextStep();
        } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
          e.preventDefault();
          this.prevStep();
        }
      });
    }
  };

  /**
   * Copy Code Button
   */
  const CopyCodeManager = {
    copyIcon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
      <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
    </svg>`,
    
    checkIcon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
      <polyline points="20 6 9 17 4 12"/>
    </svg>`,

    createCopyButton(codeBlock) {
      const button = document.createElement('button');
      button.className = 'copy-code-button';
      button.innerHTML = `${this.copyIcon}<span>Copy</span>`;
      button.setAttribute('aria-label', 'Copy code to clipboard');

      button.addEventListener('click', () => this.handleCopy(button, codeBlock));

      return button;
    },

    async handleCopy(button, codeBlock) {
      try {
        await navigator.clipboard.writeText(codeBlock.textContent);
        button.innerHTML = `${this.checkIcon}<span>Copied!</span>`;
        button.classList.add('copied');
        
        setTimeout(() => {
          button.innerHTML = `${this.copyIcon}<span>Copy</span>`;
          button.classList.remove('copied');
        }, 2000);
      } catch (err) {
        console.error('Failed to copy:', err);
      }
    },

    init() {
      document.querySelectorAll('pre code').forEach(block => {
        const pre = block.parentElement;
        // Verify DOM structure is valid and pre has a parent
        if (!pre || pre.tagName !== 'PRE' || !pre.parentNode) {
          return; // Skip if DOM structure is invalid
        }

        const wrapper = document.createElement('div');
        wrapper.className = 'code-block-wrapper';

        const button = this.createCopyButton(block);

        try {
          pre.parentNode.insertBefore(wrapper, pre);
          wrapper.appendChild(pre);
          wrapper.appendChild(button);
        } catch (err) {
          console.error('Failed to create copy button wrapper:', err);
        }
      });
    }
  };

  /**
   * Smooth scroll for anchor links
   */
  const SmoothScrollManager = {
    init() {
      document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
          const href = this.getAttribute('href');
          if (href === '#' || href.startsWith('#step-')) return;

          e.preventDefault();
          const target = document.querySelector(href);
          if (target) {
            target.scrollIntoView({
              behavior: 'smooth',
              block: 'start'
            });
          }
        });
      });
    }
  };

  /**
   * Initialize all managers
   */
  function init() {
    ThemeManager.init();
    SidebarManager.init();
    StepManager.init();
    CopyCodeManager.init();
    SmoothScrollManager.init();
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
