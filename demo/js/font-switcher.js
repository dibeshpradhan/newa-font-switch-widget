/**
 * Font Switcher Widget
 * A standalone widget for switching between Original, Ranjana, and Noto Sans Newa fonts
 */

(function(window) {
  'use strict';

  const FontSwitcher = {
    config: {
      targetSelector: 'body',
      targetClasses: null,  // Array of class names (e.g., ['content', 'article'])
      container: null,       // CSS selector or DOM element to insert widget into (null = fixed top-right)
      backgroundColor: null, // Custom background color (e.g., '#2c3e50', 'transparent', 'rgba(0,0,0,0.1)')
      position: 'fixed',
      autoLoad: true,
      storageKey: 'font-switcher-selection'
    },

    fonts: {
      devanavari: {
        name: 'Devanavari',
        family: null
      },
      ranjana: {
        name: 'Ranjana',
        family: 'NithyaRanjana, sans-serif'
      },
      newa: {
        name: 'Newa Aakha',
        family: '"NewaAkha", sans-serif'
      }
    },

    currentFont: 'devanavari',
    widgetElement: null,
    googleFontsLoaded: false,

    /**
     * Initialize the font switcher widget
     * @param {Object} options - Configuration options
     */
    init: function(options) {
      // Merge user options with defaults
      if (options) {
        Object.assign(this.config, options);
      }

      // Wait for DOM to be ready
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => this.setup());
      } else {
        this.setup();
      }
    },

    /**
     * Setup the widget
     */
    setup: function() {
      // Load saved preference from localStorage
      const savedFont = this.getSavedFont();
      if (savedFont && this.fonts[savedFont]) {
        this.currentFont = savedFont;
      }

      // Create and inject widget UI
      this.createWidget();

      // Apply initial font
      this.applyFont(this.currentFont);

      // Load Google Fonts if needed and autoLoad is enabled
      if (this.config.autoLoad && (this.currentFont === 'newa' || savedFont === 'newa')) {
        this.loadGoogleFonts();
      }
    },

    /**
     * Check if a color is dark (for automatic text color adjustment)
     * @param {string} color - Color value (hex, rgb, rgba, etc.)
     * @returns {boolean} True if color is dark
     */
    isDarkColor: function(color) {
      if (!color) return false;
      
      // Remove whitespace and convert to lowercase
      color = color.trim().toLowerCase();
      
      // Handle transparent
      if (color === 'transparent') return false;
      
      // Handle hex colors
      if (color.startsWith('#')) {
        const hex = color.replace('#', '');
        const r = parseInt(hex.substring(0, 2), 16);
        const g = parseInt(hex.substring(2, 4), 16);
        const b = parseInt(hex.substring(4, 6), 16);
        // Calculate luminance
        const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
        return luminance < 0.5;
      }
      
      // Handle rgb/rgba
      const rgbMatch = color.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
      if (rgbMatch) {
        const r = parseInt(rgbMatch[1]);
        const g = parseInt(rgbMatch[2]);
        const b = parseInt(rgbMatch[3]);
        const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
        return luminance < 0.5;
      }
      
      // Handle named colors (common dark colors)
      const darkColors = ['black', 'navy', 'darkblue', 'mediumblue', 'blue', 'darkgreen', 'green', 'teal', 'darkcyan', 'deepskyblue', 'darkred', 'red', 'darkmagenta', 'magenta', 'maroon', 'purple', 'indigo', 'darkslategray', 'darkslategrey', 'darkgray', 'darkgrey', 'gray', 'grey'];
      if (darkColors.includes(color)) {
        return true;
      }
      
      // Default to light if we can't determine
      return false;
    },

    /**
     * Get the container element where widget should be inserted
     * @returns {HTMLElement|null} Container element or null for default positioning
     */
    getContainerElement: function() {
      if (!this.config.container) {
        return null; // Use default fixed positioning
      }

      // If it's already a DOM element, return it
      if (this.config.container instanceof HTMLElement) {
        return this.config.container;
      }

      // If it's a string, treat it as a CSS selector
      if (typeof this.config.container === 'string') {
        const element = document.querySelector(this.config.container);
        if (!element) {
          console.warn('Font Switcher: Container element not found:', this.config.container);
          return null;
        }
        return element;
      }

      return null;
    },

    /**
     * Create the widget UI element
     */
    createWidget: function() {
      // Create container
      const container = document.createElement('div');
      container.id = 'font-switcher-widget';
      container.className = 'font-switcher-container';

      // Check if we should use a custom container or default positioning
      const targetContainer = this.getContainerElement();
      if (targetContainer) {
        // Insert into custom container - remove fixed positioning styles
        container.classList.add('font-switcher-inline');
      } else {
        // Use default fixed positioning
        container.classList.add('font-switcher-fixed');
      }

      // Create label
      const label = document.createElement('label');
      label.htmlFor = 'font-switcher-select';
      label.className = 'font-switcher-label';
      label.textContent = 'Font:';
      label.setAttribute('aria-label', 'Select font');

      // Create select dropdown
      const select = document.createElement('select');
      select.id = 'font-switcher-select';
      select.className = 'font-switcher-select';
      select.setAttribute('aria-label', 'Font selection');

      // Create options
      Object.keys(this.fonts).forEach(key => {
        const option = document.createElement('option');
        option.value = key;
        option.textContent = this.fonts[key].name;
        if (key === this.currentFont) {
          option.selected = true;
        }
        select.appendChild(option);
      });

      // Add change event listener
      select.addEventListener('change', (e) => {
        this.switchFont(e.target.value);
      });

      // Assemble widget
      container.appendChild(label);
      container.appendChild(select);

      // Apply custom background color if specified (after elements are created)
      if (this.config.backgroundColor) {
        container.style.backgroundColor = this.config.backgroundColor;
        
        // Auto-adjust text color for better contrast on dark backgrounds
        const isDark = this.isDarkColor(this.config.backgroundColor);
        if (isDark) {
          container.style.color = '#ffffff';
          label.style.color = '#ffffff';
          select.style.backgroundColor = this.config.backgroundColor;
          select.style.color = '#ffffff';
          select.style.borderColor = 'rgba(255, 255, 255, 0.3)';
        }
      }

      // Insert into target container or body (for fixed positioning)
      if (targetContainer) {
        targetContainer.appendChild(container);
      } else {
        document.body.appendChild(container);
      }

      this.widgetElement = container;
    },

    /**
     * Switch to a different font
     * @param {string} fontKey - Font key ('devanavari', 'ranjana', or 'newa')
     */
    switchFont: function(fontKey) {
      if (!this.fonts[fontKey]) {
        console.warn('Invalid font key:', fontKey);
        return;
      }

      this.currentFont = fontKey;
      this.applyFont(fontKey);
      this.saveFont(fontKey);

      // Load Google Fonts if switching to Newa
      if (fontKey === 'newa' && !this.googleFontsLoaded && this.config.autoLoad) {
        this.loadGoogleFonts();
      }
    },

    /**
     * Get all target elements based on configuration
     * @returns {NodeList} List of target elements
     */
    getTargetElements: function() {
      let elements = [];
      
      // If targetClasses is specified, use it
      if (this.config.targetClasses && Array.isArray(this.config.targetClasses) && this.config.targetClasses.length > 0) {
        // Build selector from class names
        const classSelector = this.config.targetClasses
          .map(className => className.trim().replace(/^\./, '')) // Remove leading dot if present
          .map(className => `.${className}`)
          .join(', ');
        elements = document.querySelectorAll(classSelector);
      } else if (this.config.targetSelector) {
        // Use targetSelector if targetClasses is not specified
        elements = document.querySelectorAll(this.config.targetSelector);
      }
      
      return elements;
    },

    /**
     * Apply font to target elements
     * @param {string} fontKey - Font key
     */
    applyFont: function(fontKey) {
      const font = this.fonts[fontKey];
      const targetElements = this.getTargetElements();
      const dataAttribute = 'data-font-switcher-original-size';

      targetElements.forEach(el => {
        // Handle font size for Ranjana
        if (fontKey === 'ranjana') {
          // Store original font size if not already stored
          if (!el.hasAttribute(dataAttribute)) {
            const computedStyle = window.getComputedStyle(el);
            const originalSize = computedStyle.fontSize;
            el.setAttribute(dataAttribute, originalSize);
          }
          
          // Apply increased font size (20% larger)
          const originalSize = el.getAttribute(dataAttribute);
          const originalSizeValue = parseFloat(originalSize);
          const increasedSize = originalSizeValue * 1.50;
          el.style.fontSize = increasedSize + 'px';
        } else {
          // Restore original font size if it was stored
          if (el.hasAttribute(dataAttribute)) {
            const originalSize = el.getAttribute(dataAttribute);
            el.style.fontSize = originalSize;
          } else {
            el.style.fontSize = '';
          }
        }

        // Handle font family
        if (fontKey === 'devanavari') {
          // Remove font-family to restore original
          el.style.fontFamily = '';
          el.classList.remove('font-switcher-ranjana', 'font-switcher-newa');
        } else {
          // Apply font family
          el.style.fontFamily = font.family;
          el.classList.remove('font-switcher-ranjana', 'font-switcher-newa');
          el.classList.add(`font-switcher-${fontKey}`);
        }
      });

      // Update select dropdown
      const select = document.getElementById('font-switcher-select');
      if (select) {
        select.value = fontKey;
      }
    },

    /**
     * Load Google Fonts for Noto Sans Newa
     */
    loadGoogleFonts: function() {
      if (this.googleFontsLoaded) {
        return;
      }

      // Check if Google Fonts API is already loaded
      const existingLink = document.querySelector('link[href*="fonts.googleapis.com"]');
      if (existingLink) {
        this.googleFontsLoaded = true;
        return;
      }

      // Create link element for Google Fonts
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = 'https://fonts.googleapis.com/css2?family=Noto+Sans+Newa&display=swap';
      link.onload = () => {
        this.googleFontsLoaded = true;
      };
      document.head.appendChild(link);
    },

    /**
     * Save font selection to localStorage
     * @param {string} fontKey - Font key to save
     */
    saveFont: function(fontKey) {
      try {
        localStorage.setItem(this.config.storageKey, fontKey);
      } catch (e) {
        // localStorage not available, silently fail
        console.warn('localStorage not available:', e);
      }
    },

    /**
     * Get saved font from localStorage
     * @returns {string|null} Saved font key or null
     */
    getSavedFont: function() {
      try {
        return localStorage.getItem(this.config.storageKey);
      } catch (e) {
        // localStorage not available, silently fail
        return null;
      }
    },

    /**
     * Destroy the widget and remove it from DOM
     */
    destroy: function() {
      if (this.widgetElement && this.widgetElement.parentNode) {
        this.widgetElement.parentNode.removeChild(this.widgetElement);
        this.widgetElement = null;
      }

      // Remove font classes and styles, and restore font sizes
      const targetElements = this.getTargetElements();
      const dataAttribute = 'data-font-switcher-original-size';
      targetElements.forEach(el => {
        el.style.fontFamily = '';
        el.classList.remove('font-switcher-ranjana', 'font-switcher-newa');
        
        // Restore original font size if it was stored
        if (el.hasAttribute(dataAttribute)) {
          const originalSize = el.getAttribute(dataAttribute);
          el.style.fontSize = originalSize;
          el.removeAttribute(dataAttribute);
        } else {
          el.style.fontSize = '';
        }
      });
    }
  };

  // Expose to global scope
  window.FontSwitcher = FontSwitcher;

})(window);

