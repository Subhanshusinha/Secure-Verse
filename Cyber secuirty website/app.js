
  (() => {
    // State storage simulated with localStorage
    const STATE = {
      loggedIn: false,
      adminMode: false,
      newsList: JSON.parse(localStorage.getItem('newsList')) || [
        {
          id: '1',
          title: 'New phishing scam targets financial apps',
          description: 'Users warned to be cautious of fraudulent emails impersonating banks.',
          date: '2024-06-15'
        },
        {
          id: '2',
          title: 'Zero-day vulnerability found in popular web framework',
          description: 'Developers are urged to update immediately to avoid exploitation.',
          date: '2024-06-12'
        }
      ],
      currentUser: null
    };

    // DOM Elements
    const sidebar = document.querySelector('.sidebar');
    const navLinks = sidebar.querySelectorAll('.nav-link');
    const sections = {
      auth: document.getElementById('auth-section'),
      dashboard: document.getElementById('dashboard-section'),
      phishing: document.getElementById('phishing-section'),
      vulnerability: document.getElementById('vulnerability-section'),
      password: document.getElementById('password-section'),
      news: document.getElementById('news-section'),
    };
    const welcomeMessage = document.getElementById('welcome-message');
    const toggleSidebarBtn = document.getElementById('toggle-sidebar');
    const logoutBtn = document.getElementById('logout-button');

    // Authentication Forms
    const authSection = sections.auth;
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
    const showRegisterLink = document.getElementById('show-register');
    const showLoginLink = document.getElementById('show-login');
    const loginError = document.getElementById('login-error');
    const registerError = document.getElementById('register-error');
    const registerSuccess = document.getElementById('register-success');

    // Phishing detection elements
    const phishingForm = document.getElementById('phishing-form');
    const phishingResult = document.getElementById('phishing-result');

    // Code vulnerability detector elements
    const codeInput = document.getElementById('code-input');
    const checkVulnerabilitiesBtn = document.getElementById('check-vulnerabilities-btn');
    const vulnerabilitiesResult = document.getElementById('vulnerabilities-result');

    // Password strength checker elements
    const passwordInput = document.getElementById('password-input');
    const strengthMeterFill = document.getElementById('strength-meter-fill');
    const checklistItems = {
      length: document.getElementById('length-check'),
      uppercase: document.getElementById('uppercase-check'),
      lowercase: document.getElementById('lowercase-check'),
      number: document.getElementById('number-check'),
      symbol: document.getElementById('symbol-check'),
    };

    // News section elements
    const newsContainer = document.getElementById('news-container');
    const adminToggleBtn = document.getElementById('admin-toggle-btn');
    const addNewsFormContainer = document.getElementById('add-news-form-container');
    const addNewsForm = document.getElementById('add-news-form');
    const newsTitleInput = document.getElementById('news-title');
    const newsDescriptionInput = document.getElementById('news-description');
    const newsDateInput = document.getElementById('news-date');

    // Show sections helper
    function showSection(name) {
      for (const key in sections) {
        sections[key].style.display = (key === name) ? 'block' : 'none';
      }
      // Update sidebar active class
      navLinks.forEach(link => {
        link.classList.toggle('active', link.dataset.section === name);
        // Update aria-current for accessibility
        if (link.dataset.section === name) {
          link.setAttribute('aria-current', 'page');
        } else {
          link.removeAttribute('aria-current');
        }
      });
      // Focus main content for screen reader
      sections[name].focus?.();
    }

    // Initialization: check if logged in
    function init() {
      const storedUser = localStorage.getItem('secureverseUser');
      if (storedUser) {
        STATE.loggedIn = true;
        STATE.currentUser = JSON.parse(storedUser);
        welcomeMessage.textContent = `Welcome, ${STATE.currentUser.email}`;
        showSection('dashboard');
      } else {
        showSection('auth');
      }
      renderNews();
    }

    // Toggle sidebar on mobile
    toggleSidebarBtn.addEventListener('click', () => {
      const expanded = toggleSidebarBtn.getAttribute('aria-expanded') === 'true';
      if (expanded) {
        sidebar.classList.remove('show');
        toggleSidebarBtn.setAttribute('aria-expanded', 'false');
      } else {
        sidebar.classList.add('show');
        toggleSidebarBtn.setAttribute('aria-expanded', 'true');
      }
    });

    // Sidebar navigation click handler
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        const target = link.dataset.section;
        if (target) {
          if (target === 'auth') return; // No auth section in nav
          if (target === 'logout') {
            logout();
            return;
          }
          showSection(target);
          if (window.innerWidth <= 768) {
            sidebar.classList.remove('show');
            toggleSidebarBtn.setAttribute('aria-expanded', 'false');
          }
        }
      });
      // Keyboard accessibility for nav-link divs that are role=button
      link.addEventListener('keydown', (e) => {
        if(e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          link.click();
        }
      });
    });

    // LOGIN logic (mock)
    loginForm.addEventListener('submit', e => {
      e.preventDefault();
      loginError.textContent = '';
      const email = loginForm['login-email'].value.trim().toLowerCase();
      const password = loginForm['login-password'].value;

      // Simple validation & mock login
      if (!email || !password) {
        loginError.textContent = 'Please enter both email and password.';
        return;
      }
      // Mock check: password must be at least 6 chars
      if (password.length < 6) {
        loginError.textContent = 'Password must be at least 6 characters.';
        return;
      }
      // Simulate successful login
      STATE.loggedIn = true;
      STATE.currentUser = { email };
      localStorage.setItem('secureverseUser', JSON.stringify(STATE.currentUser));
      welcomeMessage.textContent = `Welcome, ${email}`;
      loginForm.reset();
      showSection('dashboard');
    });

    // REGISTER logic (mock)
    registerForm.addEventListener('submit', e => {
      e.preventDefault();
      registerError.textContent = '';
      registerSuccess.textContent = '';
      const email = registerForm['register-email'].value.trim().toLowerCase();
      const password = registerForm['register-password'].value;

      if (!email || !password) {
        registerError.textContent = 'Please enter both email and password.';
        return;
      }
      if (password.length < 6) {
        registerError.textContent = 'Password must be at least 6 characters.';
        return;
      }
      // Mock: pretend registered successfully
      registerSuccess.textContent = 'Registration successful! Please login.';
      registerForm.reset();
    });

    // Switch login/register forms
    showRegisterLink.addEventListener('click', e => {
      e.preventDefault();
      loginForm.style.display = 'none';
      registerForm.style.display = 'block';
      loginError.textContent = '';
      registerError.textContent = '';
      registerSuccess.textContent = '';
    });
    showLoginLink.addEventListener('click', e => {
      e.preventDefault();
      loginForm.style.display = 'block';
      registerForm.style.display = 'none';
      loginError.textContent = '';
      registerError.textContent = '';
      registerSuccess.textContent = '';
    });

    // LOGOUT
    function logout() {
      STATE.loggedIn = false;
      STATE.currentUser = null;
      localStorage.removeItem('secureverseUser');
      welcomeMessage.textContent = 'Welcome to SecureVerse';
      showSection('auth');
    }
    logoutBtn.addEventListener('click', logout);

    // PHISHING Detector (mock logic)
    phishingForm.addEventListener('submit', e => {
      e.preventDefault();
      const url = phishingForm['url-input'].value.trim().toLowerCase();
      phishingResult.textContent = '';
      if (!url) return;

      // Simple mock logic: URLs that contain "phish" flagged as phishing
      if (url.includes('phish') || url.includes('fake')) {
        phishingResult.innerHTML = `<span class="badge-phishing" aria-label="Phishing detected">
          <span class="material-icons status-icon" aria-hidden="true">dangerous</span> Phishing
        </span>`;
      } else {
        phishingResult.innerHTML = `<span class="badge-safe" aria-label="Safe site detected">
          <span class="material-icons status-icon" aria-hidden="true">check_circle</span> Safe
        </span>`;
      }
    });

    // Code Vulnerability Detector (basic pattern match)
    checkVulnerabilitiesBtn.addEventListener('click', () => {
      const code = codeInput.value.toLowerCase();
      vulnerabilitiesResult.innerHTML = '';

      if (!code.trim()) {
        vulnerabilitiesResult.textContent = 'Please paste some code before checking.';
        vulnerabilitiesResult.style.color = '#dc2626'; // red
        return;
      }
      const issues = [];

      // Pattern detection examples
      if (code.match(/(['"])(or|and)\1.*=|union.*select|select.*from+/)) {
        issues.push({
          title: 'SQL Injection',
          suggestion: 'Use parameterized queries or ORM to prevent SQL injection.'
        });
      }
      if (code.match(/<script>|onerror=|onload=|javascript:/)) {
        issues.push({
          title: 'Cross-Site Scripting (XSS)',
          suggestion: 'Sanitize and encode inputs/output and use Content Security Policy.'
        });
      }
      if (code.match(/password\s*=\s*['"]\w+['"]|api_key\s*=\s*['"]\w+['"]/)) {
        issues.push({
          title: 'Hardcoded Credentials',
          suggestion: 'Do not hardcode passwords or API keys in source code.'
        });
      }
      if (issues.length === 0) {
        vulnerabilitiesResult.textContent = 'No common vulnerabilities detected.';
        vulnerabilitiesResult.style.color = '#16a34a'; // green
        return;
      }

      // Show detected issues
      const ul = document.createElement('ul');
      issues.forEach(issue => {
        const li = document.createElement('li');
        li.style.marginBottom = '0.8rem';
        li.innerHTML = `<strong>${issue.title}</strong>: ${issue.suggestion}`;
        ul.appendChild(li);
      });
      vulnerabilitiesResult.appendChild(ul);
      vulnerabilitiesResult.style.color = '#b45309'; // amber
    });

    // Password Strength Checker logic
    passwordInput.addEventListener('input', () => {
      const pwd = passwordInput.value;
      const checks = {
        length: pwd.length >= 8,
        uppercase: /[A-Z]/.test(pwd),
        lowercase: /[a-z]/.test(pwd),
        number: /\d/.test(pwd),
        symbol: /[!@#$%^&*]/.test(pwd),
      };

      // Update checklist UI
      for (const key in checks) {
        checklistItems[key].classList.toggle('valid', checks[key]);
        const icon = checklistItems[key].querySelector('span.material-icons');
        icon.textContent = checks[key] ? 'check_circle' : 'close';
      }

      // Calculate strength
      const passed = Object.values(checks).filter(Boolean).length;
      let strengthClass = 'strength-weak';
      if (passed >= 5) strengthClass = 'strength-strong';
      else if (passed >= 4) strengthClass = 'strength-good';
      else if (passed >= 3) strengthClass = 'strength-fair';

      // Update meter
      const widthPercent = (passed / 5) * 100;
      strengthMeterFill.style.width = widthPercent + '%';
      strengthMeterFill.className = `strength-meter-fill ${strengthClass}`;
    });

    // Render News items
    function renderNews() {
      newsContainer.innerHTML = '';
      if (STATE.newsList.length === 0) {
        newsContainer.innerHTML = '<p>No news articles available.</p>';
        return;
      }
      STATE.newsList.forEach(news => {
        const card = document.createElement('article');
        card.className = 'news-card';
        card.setAttribute('tabindex', '0');
        card.setAttribute('aria-label', `News article: ${news.title}`);

        let deleteBtnHTML = '';
        if (STATE.adminMode) {
          deleteBtnHTML = `<button class="btn-delete" aria-label="Delete news ${news.title}" data-id="${news.id}">&times;</button>`;
        }
        card.innerHTML = `
          <h4>${news.title}</h4>
          <p>${news.description}</p>
          <time datetime="${news.date}">${new Date(news.date).toLocaleDateString()}</time>
          ${deleteBtnHTML}
        `;
        newsContainer.appendChild(card);
      });

      // Attach event listeners to delete buttons
      if (STATE.adminMode) {
        document.querySelectorAll('.btn-delete').forEach(btn => {
          btn.addEventListener('click', () => {
            const idToDelete = btn.getAttribute('data-id');
            STATE.newsList = STATE.newsList.filter(n => n.id !== idToDelete);
            localStorage.setItem('newsList', JSON.stringify(STATE.newsList));
            renderNews();
          });
        });
      }
    }

    // Admin mode toggle
    adminToggleBtn.addEventListener('click', () => {
      STATE.adminMode = !STATE.adminMode;
      adminToggleBtn.textContent = STATE.adminMode ? 'Exit Admin Mode' : 'Enter Admin Mode';
      adminToggleBtn.setAttribute('aria-pressed', STATE.adminMode.toString());
      addNewsFormContainer.style.display = STATE.adminMode ? 'block' : 'none';
      renderNews();
    });

    // Add news form submission
    addNewsForm.addEventListener('submit', e => {
      e.preventDefault();
      const title = newsTitleInput.value.trim();
      const description = newsDescriptionInput.value.trim();
      const date = newsDateInput.value;
      if (!title || !description || !date) return;

      const newNews = {
        id: crypto.randomUUID(),
        title,
        description,
        date,
      };
      STATE.newsList.unshift(newNews);
      localStorage.setItem('newsList', JSON.stringify(STATE.newsList));
      addNewsForm.reset();
      renderNews();
    });

    // Responsive behavior: Hide sidebar on small screens initially
    function handleResize() {
      if (window.innerWidth > 768) {
        sidebar.classList.add('show'); // show by default on desktop
        toggleSidebarBtn.setAttribute('aria-expanded', 'true');
      } else {
        sidebar.classList.remove('show');
        toggleSidebarBtn.setAttribute('aria-expanded', 'false');
      }
    }
    window.addEventListener('resize', handleResize);
    handleResize();

    // init app
    init();
  })();
