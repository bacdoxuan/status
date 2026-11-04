/**
 * Simple Money Tracker — Dark/Light Mode Theme Toggle v1.2
 * Fully compliant with Modern Web Guidance (dark-mode-toggle standard)
 */
(function() {
  function getSystemTheme() {
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }

  function getResolvedTheme() {
    var stored = null;
    try {
      stored = localStorage.getItem('smt-theme');
    } catch(e) {}
    if (stored === 'dark' || stored === 'light') return stored;
    return getSystemTheme();
  }

  function applyTheme(target) {
    var meta = document.querySelector('meta[name="color-scheme"]');
    if (target === 'dark' || target === 'light') {
      document.documentElement.setAttribute('data-theme', target);
      if (meta) meta.content = target;
    } else {
      document.documentElement.removeAttribute('data-theme');
      if (meta) meta.content = 'light dark';
    }
  }

  function updateButtonUI(resolvedTheme) {
    var btn = document.getElementById('smt-theme-toggle-btn');
    if (!btn) return;
    var isDark = resolvedTheme === 'dark';
    btn.setAttribute('aria-checked', isDark ? 'true' : 'false');
    btn.setAttribute('title', isDark ? 'Chuyển sang Light Mode' : 'Chuyển sang Dark Mode');
    btn.classList.toggle('is-dark', isDark);
  }

  function toggleTheme() {
    var current = getResolvedTheme();
    var target = current === 'dark' ? 'light' : 'dark';
    var system = getSystemTheme();

    try {
      if (target === system) {
        localStorage.removeItem('smt-theme');
        applyTheme('system');
      } else {
        localStorage.setItem('smt-theme', target);
        applyTheme(target);
      }
    } catch(e) {
      applyTheme(target);
    }

    updateButtonUI(target);
  }

  function mountThemeToggle() {
    if (document.getElementById('smt-theme-toggle-btn')) {
      updateButtonUI(getResolvedTheme());
      return true;
    }

    var navUl = document.querySelector('nav ul');
    if (!navUl) return false;

    var li = document.createElement('li');
    li.className = 'theme-toggle-item';
    li.innerHTML = [
      '<button id="smt-theme-toggle-btn" class="theme-toggle-switch" type="button" role="switch" aria-label="Chuyển chế độ Dark/Light Mode" aria-checked="false" title="Chuyển chế độ Dark/Light Mode">',
      '  <span class="toggle-icon toggle-sun" aria-hidden="true">',
      '    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">',
      '      <circle cx="12" cy="12" r="5"></circle>',
      '      <line x1="12" y1="1" x2="12" y2="3"></line>',
      '      <line x1="12" y1="21" x2="12" y2="23"></line>',
      '      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>',
      '      <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>',
      '      <line x1="1" y1="12" x2="3" y2="12"></line>',
      '      <line x1="21" y1="12" x2="23" y2="12"></line>',
      '      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>',
      '      <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>',
      '    </svg>',
      '  </span>',
      '  <span class="toggle-thumb" aria-hidden="true"></span>',
      '  <span class="toggle-icon toggle-moon" aria-hidden="true">',
      '    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">',
      '      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>',
      '    </svg>',
      '  </span>',
      '</button>'
    ].join('');

    navUl.appendChild(li);

    var btn = document.getElementById('smt-theme-toggle-btn');
    btn.addEventListener('click', toggleTheme);

    updateButtonUI(getResolvedTheme());
    return true;
  }

  function init() {
    if (mountThemeToggle()) return;

    var observer = new MutationObserver(function() {
      if (mountThemeToggle()) {
        observer.disconnect();
      }
    });

    observer.observe(document.body || document.documentElement, {
      childList: true,
      subtree: true
    });

    setTimeout(mountThemeToggle, 250);
    setTimeout(mountThemeToggle, 750);
    setTimeout(mountThemeToggle, 2000);
  }

  // Cross-tab synchronization
  window.addEventListener('storage', function(e) {
    if (e.key === 'smt-theme') {
      var current = getResolvedTheme();
      applyTheme(current === getSystemTheme() ? 'system' : current);
      updateButtonUI(current);
    }
  });

  // OS theme change listener
  if (window.matchMedia) {
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function(e) {
      try {
        if (!localStorage.getItem('smt-theme')) {
          updateButtonUI(e.matches ? 'dark' : 'light');
        }
      } catch(err) {}
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
