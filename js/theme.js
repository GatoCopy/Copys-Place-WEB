/**
 * COPY'S PLACE - THEME MANAGER
 * Gestiona el cambio entre modo claro y modo oscuro
 */

function initTheme() {
  const savedTheme = localStorage.getItem('copyplaceTheme') || 'light';
  const themeToggle = document.getElementById('themeToggle');

  if (savedTheme === 'dark') {
    document.body.classList.add('dark-mode');
    themeToggle.textContent = '☀️';
  }

  themeToggle.addEventListener('click', toggleTheme);
}

function toggleTheme() {
  const themeToggle = document.getElementById('themeToggle');
  document.body.classList.toggle('dark-mode');
  
  const isDark = document.body.classList.contains('dark-mode');
  localStorage.setItem('copyplaceTheme', isDark ? 'dark' : 'light');
  themeToggle.textContent = isDark ? '☀️' : '🌙';
}
