// TechCorp Job Search Website - Enhanced JavaScript
// Professional functionality with dark/light mode toggle

class TechCorpApp {
    constructor() {
        this.currentTheme = localStorage.getItem('theme') || 'light';
        this.isMenuOpen = false;
        this.init();
    }

    init() {
        this.setupTheme();
        this.initNavigation();
        this.initSearchFilters();
        this.initContactForm();
        this.initMobileMenu();
        this.initScrollEffects();
        this.initAnimations();
        this.initAccessibility();
        this.initJobSearch();
        this.initThemeToggle();
        this.initSidebarToggle();
    }

    // Theme Management
    setupTheme() {
        document.documentElement.setAttribute('data-theme', this.currentTheme);
        this.updateThemeToggle();
    }

    toggleTheme() {
        const previousTheme = this.currentTheme;
        this.currentTheme = this.currentTheme === 'light' ? 'dark' : 'light';
        
        // Apply theme change
        document.documentElement.setAttribute('data-theme', this.currentTheme);
        localStorage.setItem('theme', this.currentTheme);
        
        // Update toggle button
        this.updateThemeToggle();
        
        // Animate transition
        this.animateThemeTransition();
        
        // Show notification
        this.showNotification(
            `Switched to ${this.currentTheme} mode`, 
            'success'
        );
        
        console.log(`Theme changed from ${previousTheme} to ${this.currentTheme}`);
    }

    updateThemeToggle() {
        const toggleBtn = document.querySelector('.theme-toggle');
        if (toggleBtn) {
            const icon = toggleBtn.querySelector('i');
            if (this.currentTheme === 'dark') {
                icon.className = 'fas fa-sun';
                toggleBtn.setAttribute('aria-label', 'Switch to light mode');
            } else {
                icon.className = 'fas fa-moon';
                toggleBtn.setAttribute('aria-label', 'Switch to dark mode');
            }
        }
    }

    animateThemeTransition() {
        // Add a smooth transition effect for theme changes
        document.body.style.transition = 'all 0.5s ease';
        
        // Add a subtle animation to the theme toggle button
        const themeToggle = document.querySelector('.theme-toggle');
        if (themeToggle) {
            themeToggle.style.transform = 'scale(1.2) rotate(180deg)';
            setTimeout(() => {
                themeToggle.style.transform = 'scale(1) rotate(0deg)';
            }, 200);
        }
        
        // Reset body transition after animation
        setTimeout(() => {
            document.body.style.transition = '';
        }, 500);
    }

    initThemeToggle() {
        const toggleBtn = document.querySelector('.theme-toggle');
        if (toggleBtn) {
            toggleBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.toggleTheme();
            });
            
            // Add keyboard support
            toggleBtn.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    this.toggleTheme();
                }
            });
        } else {
            console.warn('Theme toggle button not found');
        }
    }

    // Navigation Management
    initNavigation() {
        const navLinks = document.querySelectorAll('.nav-link');
        const currentPage = window.location.pathname.split('/').pop() || 'index.html';
        
        navLinks.forEach(link => {
            const href = link.getAttribute('href');
            if (href === currentPage || (currentPage === '' && href === 'index.html')) {
                link.classList.add('active');
            }
            
            link.addEventListener('click', (e) => {
                if (href && href !== '#') {
                    navLinks.forEach(l => l.classList.remove('active'));
                    link.classList.add('active');
                }
            });
        });
    }

    // Enhanced Search Filters
    initSearchFilters() {
        const filterTags = document.querySelectorAll('.filter-tag');
        const clearBtn = document.querySelector('.btn-clear');
        const saveBtn = document.querySelector('.btn-save');
        
        filterTags.forEach(tag => {
            tag.addEventListener('click', (e) => {
                const closeIcon = tag.querySelector('i');
                
                if (e.target === closeIcon) {
                    this.removeFilterTag(tag);
                    return;
                }
                
                this.toggleFilterTag(tag);
            });
        });
        
        if (clearBtn) {
            clearBtn.addEventListener('click', () => this.clearAllFilters());
        }
        
        if (saveBtn) {
            saveBtn.addEventListener('click', () => this.saveSearch());
        }
    }

    toggleFilterTag(tag) {
        tag.classList.toggle('active');
        this.updateFilterCount();
        this.performSearch();
    }

    removeFilterTag(tag) {
        tag.style.transform = 'scale(0.8)';
        tag.style.opacity = '0';
        setTimeout(() => {
            tag.remove();
            this.updateFilterCount();
            this.performSearch();
        }, 200);
    }

    clearAllFilters() {
        const activeFilters = document.querySelectorAll('.filter-tag.active');
        activeFilters.forEach(tag => {
            tag.classList.remove('active');
        });
        this.updateFilterCount();
        this.performSearch();
    }

    saveSearch() {
        const activeFilters = Array.from(document.querySelectorAll('.filter-tag.active'))
            .map(tag => tag.textContent.trim().replace('×', ''));
        
        if (activeFilters.length > 0) {
            this.showNotification('Search saved successfully!', 'success');
            // Store in localStorage
            const savedSearches = JSON.parse(localStorage.getItem('savedSearches') || '[]');
            savedSearches.push({
                filters: activeFilters,
                timestamp: new Date().toISOString()
            });
            localStorage.setItem('savedSearches', JSON.stringify(savedSearches));
        } else {
            this.showNotification('Please select at least one filter to save your search.', 'warning');
        }
    }

    updateFilterCount() {
        const activeFilters = document.querySelectorAll('.filter-tag.active');
        const filterCount = document.querySelector('.filter-count');
        
        if (filterCount) {
            const count = activeFilters.length;
            filterCount.textContent = `${count} Filter${count !== 1 ? 's' : ''} Applied`;
            filterCount.style.display = count > 0 ? 'inline-block' : 'none';
        }
    }

    // Enhanced Contact Form
    initContactForm() {
        const contactForm = document.querySelector('form');
        
        if (contactForm) {
            contactForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleFormSubmission(contactForm);
            });
            
            // Real-time validation
            const inputs = contactForm.querySelectorAll('input, textarea, select');
            inputs.forEach(input => {
                input.addEventListener('blur', () => this.validateField(input));
                input.addEventListener('input', () => this.clearFieldError(input));
            });
        }
    }

    handleFormSubmission(form) {
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());
        
        if (this.validateForm(data)) {
            this.submitForm(form, data);
        }
    }

    validateForm(data) {
        const required = ['name', 'email', 'subject', 'message'];
        let isValid = true;
        
        required.forEach(field => {
            if (!data[field] || data[field].trim() === '') {
                this.showFieldError(field, 'This field is required');
                isValid = false;
            }
        });
        
        if (data.email && !this.isValidEmail(data.email)) {
            this.showFieldError('email', 'Please enter a valid email address');
            isValid = false;
        }
        
        return isValid;
    }

    validateField(field) {
        const value = field.value.trim();
        const fieldName = field.name;
        
        if (field.hasAttribute('required') && !value) {
            this.showFieldError(fieldName, 'This field is required');
            return false;
        }
        
        if (fieldName === 'email' && value && !this.isValidEmail(value)) {
            this.showFieldError(fieldName, 'Please enter a valid email address');
            return false;
        }
        
        this.clearFieldError(field);
        return true;
    }

    showFieldError(fieldName, message) {
        const field = document.querySelector(`[name="${fieldName}"]`);
        if (field) {
            field.classList.add('error');
            this.showFieldMessage(field, message, 'error');
        }
    }

    clearFieldError(field) {
        field.classList.remove('error');
        const message = field.parentNode.querySelector('.field-message');
        if (message) {
            message.remove();
        }
    }

    showFieldMessage(field, message, type) {
        this.clearFieldError(field);
        const messageEl = document.createElement('div');
        messageEl.className = `field-message ${type}`;
        messageEl.textContent = message;
        field.parentNode.appendChild(messageEl);
    }

    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    submitForm(form, data) {
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        
        submitBtn.textContent = 'Sending...';
        submitBtn.disabled = true;
        
        // Simulate API call
        setTimeout(() => {
            this.showNotification('Thank you for your message! We\'ll get back to you within 24 hours.', 'success');
            form.reset();
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }, 2000);
    }

    // Mobile Menu
    initMobileMenu() {
        this.createMobileMenuButton();
        this.setupMobileMenuEvents();
        this.handleWindowResize();
    }

    createMobileMenuButton() {
        const navContainer = document.querySelector('.nav-container');
        if (navContainer && !document.querySelector('.mobile-menu-btn')) {
            const mobileMenuBtn = document.createElement('button');
            mobileMenuBtn.className = 'mobile-menu-btn';
            mobileMenuBtn.innerHTML = '<i class="fas fa-bars"></i>';
            mobileMenuBtn.setAttribute('aria-label', 'Toggle mobile menu');
            navContainer.appendChild(mobileMenuBtn);
        }
    }

    setupMobileMenuEvents() {
        const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
        const navLinks = document.querySelector('.nav-links');
        const navActions = document.querySelector('.nav-actions');
        
        if (mobileMenuBtn && navLinks && navActions) {
            mobileMenuBtn.addEventListener('click', () => {
                this.toggleMobileMenu();
            });
        }
        
        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (this.isMenuOpen && !e.target.closest('.nav-container')) {
                this.closeMobileMenu();
            }
        });
    }

    toggleMobileMenu() {
        const navLinks = document.querySelector('.nav-links');
        const navActions = document.querySelector('.nav-actions');
        const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
        
        if (this.isMenuOpen) {
            this.closeMobileMenu();
        } else {
            this.openMobileMenu();
        }
    }

    openMobileMenu() {
        const navLinks = document.querySelector('.nav-links');
        const navActions = document.querySelector('.nav-actions');
        const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
        
        if (navLinks && navActions && mobileMenuBtn) {
            navLinks.style.display = 'flex';
            navActions.style.display = 'flex';
            navLinks.style.flexDirection = 'column';
            navActions.style.flexDirection = 'column';
            navLinks.style.gap = '15px';
            navActions.style.gap = '15px';
            
            mobileMenuBtn.innerHTML = '<i class="fas fa-times"></i>';
            this.isMenuOpen = true;
        }
    }

    closeMobileMenu() {
        const navLinks = document.querySelector('.nav-links');
        const navActions = document.querySelector('.nav-actions');
        const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
        
        if (navLinks && navActions && mobileMenuBtn) {
            navLinks.style.display = 'none';
            navActions.style.display = 'none';
            mobileMenuBtn.innerHTML = '<i class="fas fa-bars"></i>';
            this.isMenuOpen = false;
        }
    }

    handleWindowResize() {
        window.addEventListener('resize', () => {
            if (window.innerWidth > 768) {
                this.closeMobileMenu();
            }
        });
    }

    // Scroll Effects
    initScrollEffects() {
        this.setupSmoothScrolling();
        this.setupNavbarScrollEffect();
        this.setupScrollAnimations();
    }

    setupSmoothScrolling() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                e.preventDefault();
                const target = document.querySelector(anchor.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    }

    setupNavbarScrollEffect() {
        let lastScrollY = window.scrollY;
        
        window.addEventListener('scroll', () => {
            const navbar = document.querySelector('.navbar');
            const currentScrollY = window.scrollY;
            
            if (navbar) {
                if (currentScrollY > 50) {
                    navbar.classList.add('scrolled');
                } else {
                    navbar.classList.remove('scrolled');
                }
                
                // Hide/show navbar on scroll
                if (currentScrollY > lastScrollY && currentScrollY > 100) {
                    navbar.style.transform = 'translateY(-100%)';
                } else {
                    navbar.style.transform = 'translateY(0)';
                }
            }
            
            lastScrollY = currentScrollY;
        });
    }

    setupScrollAnimations() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                }
            });
        }, observerOptions);
        
        document.querySelectorAll('.content-card, .content-section').forEach(el => {
            observer.observe(el);
        });
    }

    // Job Search Functionality
    initJobSearch() {
        this.setupSearchInput();
        this.loadSavedSearches();
    }

    setupSearchInput() {
        const searchInput = document.querySelector('input[type="search"]');
        if (searchInput) {
            searchInput.addEventListener('input', this.debounce(() => {
                this.performSearch();
            }, 300));
        }
    }

    performSearch() {
        const searchInput = document.querySelector('input[type="search"]');
        const searchResults = document.querySelector('.search-results');
        
        if (searchInput && searchResults) {
            const query = searchInput.value.toLowerCase();
            const activeFilters = Array.from(document.querySelectorAll('.filter-tag.active'))
                .map(tag => tag.textContent.trim().replace('×', ''));
            
            this.displaySearchResults(query, activeFilters, searchResults);
        }
    }

    displaySearchResults(query, filters, container) {
        const mockResults = [
            { title: 'Software Engineer', location: 'Lagos, Nigeria', type: 'Full-time', team: 'Engineering' },
            { title: 'Product Manager', location: 'Abuja, Nigeria', type: 'Full-time', team: 'Product' },
            { title: 'UX Designer', location: 'Remote', type: 'Contract', team: 'Design' },
            { title: 'Data Scientist', location: 'Lagos, Nigeria', type: 'Full-time', team: 'Engineering' },
            { title: 'Marketing Specialist', location: 'Port Harcourt, Nigeria', type: 'Part-time', team: 'Marketing' },
            { title: 'Customer Service Specialist', location: 'Remote', type: 'Full-time', team: 'Support' }
        ];
        
        let filteredResults = mockResults;
        
        if (query) {
            filteredResults = filteredResults.filter(job => 
                job.title.toLowerCase().includes(query) || 
                job.location.toLowerCase().includes(query) ||
                job.team.toLowerCase().includes(query)
            );
        }
        
        if (filters.length > 0) {
            filteredResults = filteredResults.filter(job => 
                filters.some(filter => 
                    job.title.toLowerCase().includes(filter.toLowerCase()) ||
                    job.location.toLowerCase().includes(filter.toLowerCase()) ||
                    job.team.toLowerCase().includes(filter.toLowerCase())
                )
            );
        }
        
        this.renderSearchResults(filteredResults, container);
    }

    renderSearchResults(results, container) {
        if (results.length === 0) {
            container.innerHTML = `
                <div class="no-results">
                    <i class="fas fa-search" style="font-size: 3rem; color: #86868b; margin-bottom: 20px;"></i>
                    <h4>No results found</h4>
                    <p>Try adjusting your search criteria or browse all available positions.</p>
                </div>
            `;
            return;
        }
        
        const resultsHTML = results.map(job => `
            <div class="job-result">
                <div class="job-header">
                    <h3>${job.title}</h3>
                    <span class="job-type">${job.type}</span>
                </div>
                <div class="job-details">
                    <p><i class="fas fa-map-marker-alt"></i> ${job.location}</p>
                    <p><i class="fas fa-users"></i> ${job.team}</p>
                </div>
                <div class="job-actions">
                    <button class="btn-primary">Apply Now</button>
                    <button class="btn-secondary">Save Job</button>
                </div>
            </div>
        `).join('');
        
        container.innerHTML = `
            <div class="search-results-grid">
                ${resultsHTML}
            </div>
        `;
    }

    loadSavedSearches() {
        const savedSearches = JSON.parse(localStorage.getItem('savedSearches') || '[]');
        const sidebar = document.querySelector('.sidebar-section:first-child .sidebar-list');
        
        if (sidebar && savedSearches.length > 0) {
            const recentSearches = savedSearches.slice(-3).reverse();
            sidebar.innerHTML = recentSearches.map(search => `
                <li><a href="#" data-filters='${JSON.stringify(search.filters)}'>${search.filters.join(', ')}</a></li>
            `).join('');
        }
    }

    // Animations
    initAnimations() {
        this.setupCardAnimations();
        this.setupHoverEffects();
    }

    setupCardAnimations() {
        const cards = document.querySelectorAll('.content-card');
        cards.forEach(card => {
            card.addEventListener('mouseenter', () => {
                card.style.transform = 'translateY(-5px) scale(1.02)';
            });
            
            card.addEventListener('mouseleave', () => {
                card.style.transform = 'translateY(0) scale(1)';
            });
        });
    }

    setupHoverEffects() {
        const buttons = document.querySelectorAll('.btn-primary, .btn-secondary');
        buttons.forEach(button => {
            button.addEventListener('mouseenter', () => {
                button.style.transform = 'translateY(-2px)';
            });
            
            button.addEventListener('mouseleave', () => {
                button.style.transform = 'translateY(0)';
            });
        });
    }

    // Accessibility
    initAccessibility() {
        this.setupKeyboardNavigation();
        this.setupFocusManagement();
        this.setupARIALabels();
    }

    setupKeyboardNavigation() {
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeMobileMenu();
            }
            
            if (e.key === 'Tab') {
                document.body.classList.add('keyboard-navigation');
            }
        });
        
        document.addEventListener('mousedown', () => {
            document.body.classList.remove('keyboard-navigation');
        });
    }

    setupFocusManagement() {
        const focusableElements = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';
        
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Tab') {
                const focusable = Array.from(document.querySelectorAll(focusableElements));
                const firstFocusable = focusable[0];
                const lastFocusable = focusable[focusable.length - 1];
                
                if (e.shiftKey && document.activeElement === firstFocusable) {
                    e.preventDefault();
                    lastFocusable.focus();
                } else if (!e.shiftKey && document.activeElement === lastFocusable) {
                    e.preventDefault();
                    firstFocusable.focus();
                }
            }
        });
    }

    setupARIALabels() {
        const themeToggle = document.querySelector('.theme-toggle');
        if (themeToggle) {
            themeToggle.setAttribute('role', 'button');
            themeToggle.setAttribute('aria-pressed', this.currentTheme === 'dark');
        }
    }

    // Sidebar Toggle Functionality
    initSidebarToggle() {
        this.setupSidebarEvents();
    }

    setupSidebarEvents() {
        const sidebarToggle = document.querySelector('.sidebar-toggle');
        const sidebarClose = document.querySelector('.sidebar-close');
        const sidebar = document.querySelector('.sidebar');
        const sidebarOverlay = document.querySelector('.sidebar-overlay');

        if (sidebarToggle) {
            sidebarToggle.addEventListener('click', () => this.toggleSidebar());
        }

        if (sidebarClose) {
            sidebarClose.addEventListener('click', () => this.closeSidebar());
        }

        if (sidebarOverlay) {
            sidebarOverlay.addEventListener('click', () => this.closeSidebar());
        }

        // Close sidebar on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isSidebarOpen) {
                this.closeSidebar();
            }
        });
    }

    toggleSidebar() {
        if (this.isSidebarOpen) {
            this.closeSidebar();
        } else {
            this.openSidebar();
        }
    }

    openSidebar() {
        const sidebar = document.querySelector('.sidebar');
        const sidebarOverlay = document.querySelector('.sidebar-overlay');
        
        if (sidebar && sidebarOverlay) {
            sidebar.classList.add('open');
            sidebarOverlay.classList.add('show');
            this.isSidebarOpen = true;
            
            // Prevent body scroll when sidebar is open
            document.body.style.overflow = 'hidden';
        }
    }

    closeSidebar() {
        const sidebar = document.querySelector('.sidebar');
        const sidebarOverlay = document.querySelector('.sidebar-overlay');
        
        if (sidebar && sidebarOverlay) {
            sidebar.classList.remove('open');
            sidebarOverlay.classList.remove('show');
            this.isSidebarOpen = false;
            
            // Restore body scroll
            document.body.style.overflow = '';
        }
    }

    // Utility Functions
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'warning' ? 'exclamation-triangle' : 'info-circle'}"></i>
            <span>${message}</span>
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.classList.add('show');
        }, 100);
        
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, 3000);
    }
}

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    new TechCorpApp();
});

// Service Worker Registration (for PWA capabilities)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('SW registered: ', registration);
            })
            .catch(registrationError => {
                console.log('SW registration failed: ', registrationError);
            });
    });
}
