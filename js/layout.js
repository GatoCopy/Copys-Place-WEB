/**
 * COPY'S PLACE - LAYOUT MANAGER
 * Inyecta el header, footer y menú del sitio en cada página,
 * y gestiona el menú deslizante (antes usado solo para redes).
 */

async function initLayout() {
  try {
    const [headerHtml, footerHtml, menuHtml, bioData, menuData] = await Promise.all([
      fetch('partials/header.html').then(r => r.text()),
      fetch('partials/footer.html').then(r => r.text()),
      fetch('partials/nav-menu.html').then(r => r.text()),
      fetch('data/bio.json').then(r => r.json()),
      fetch('data/menu.json').then(r => r.json())
    ]);

    const headerEl = document.getElementById('header');
    const footerEl = document.getElementById('footer');
    const menuRoot = document.getElementById('menu-root');

    if (headerEl) headerEl.innerHTML = headerHtml;
    if (footerEl) footerEl.innerHTML = footerHtml;
    if (menuRoot) menuRoot.innerHTML = menuHtml;

    renderFooterSocials(bioData);
    renderSiteMenu(menuData);

    // Estos módulos dependen de que el header/menú ya existan en el DOM
    if (typeof initTheme === 'function') initTheme();
    initMenuPanel();
  } catch (error) {
    console.error('Error inicializando el layout:', error);
  }
}

function renderFooterSocials(bioData) {
  const container = document.getElementById('footer-socials');
  if (!container || !bioData) return;

  let html = '';
  Object.entries(bioData.socialMedia).forEach(([key, social]) => {
    html += `<a href="${social.url}" target="_blank" class="social-link" title="${social.name}">${social.icon}</a>`;
  });
  container.innerHTML = html;

  if (bioData.name && bioData.alias) {
    const signature = document.getElementById('footer-signature');
    if (signature) {
      signature.innerHTML = `🐱 © 2026 ${bioData.name} (${bioData.alias}) - Hecho con amor, código y gatos`;
    }
  }
}

function renderSiteMenu(menuData) {
  const container = document.getElementById('site-menu-links');
  if (!container || !menuData) return;

  const currentPage = window.location.pathname.split('/').pop() || 'index.html';

  let html = '';
  menuData.items.forEach(item => {
    const isActive = item.url === currentPage;
    html += `
      <a href="${item.url}" class="social-link-item ${isActive ? 'active-link' : ''}">
        <div class="social-link-icon">${item.icon}</div>
        <div class="social-link-text">${item.label}</div>
      </a>
    `;
  });

  container.innerHTML = html;
}

function initMenuPanel() {
  const menuToggle = document.getElementById('menuToggle');
  const menuCloseBtn = document.getElementById('menuCloseBtn');
  const menuSlidePanel = document.getElementById('menuSlidePanel');
  const menuOverlay = document.getElementById('menuOverlay');

  if (!menuToggle || !menuSlidePanel || !menuOverlay) return;

  function openMenu() {
    menuSlidePanel.classList.add('active');
    menuOverlay.classList.add('active');
  }

  function closeMenu() {
    menuSlidePanel.classList.remove('active');
    menuOverlay.classList.remove('active');
  }

  menuToggle.addEventListener('click', openMenu);
  menuCloseBtn.addEventListener('click', closeMenu);
  menuOverlay.addEventListener('click', closeMenu);
}

document.addEventListener('DOMContentLoaded', initLayout);
