/**
 * COPY'S PLACE - DATA LOADER
 * Carga datos desde archivos JSON (intro del sitio, novedades, bio, proyectos, etc)
 * Cada función revisa si su contenedor existe antes de renderizar,
 * así el mismo archivo sirve para todas las páginas del sitio.
 */

async function loadAllData() {
  await Promise.all([
    loadSiteIntro(),
    loadNovedadDestacada(),
    loadBioData(),
    loadProjectsData(),
    loadGalleryData()
  ]);
}

/* ========== INTRODUCCIÓN DE LA PÁGINA (home) ========== */
async function loadSiteIntro() {
  const container = document.getElementById('site-intro-content');
  if (!container) return;

  try {
    const response = await fetch('data/site-intro.json');
    if (!response.ok) throw new Error('No se pudo cargar site-intro.json');
    const intro = await response.json();

    container.innerHTML = `
      <h2>${intro.title}</h2>
      <p>${intro.text}</p>
    `;
  } catch (error) {
    console.error('Error cargando la introducción de la página:', error);
  }
}

/* ========== NOVEDAD DESTACADA (home) ========== */
async function loadNovedadDestacada() {
  const container = document.getElementById('novedad-destacada');
  if (!container) return;

  try {
    const response = await fetch('data/updates.json');
    if (!response.ok) throw new Error('No se pudo cargar updates.json');
    const updatesData = await response.json();

    const months = Object.keys(updatesData);
    if (months.length === 0) return;

    const latestMonth = months[0];
    const latestUpdate = updatesData[latestMonth][0];
    if (!latestUpdate) return;

    container.innerHTML = `
      <div class="spotlight-label">✦ Lo más reciente ✦</div>
      <div class="spotlight-title">${latestUpdate.title}</div>
      <div class="spotlight-description">${latestUpdate.description}</div>
      <a href="actualizaciones.html" class="spotlight-link">Ver todas las actualizaciones →</a>
    `;
  } catch (error) {
    console.error('Error cargando la novedad destacada:', error);
  }
}

/* ========== BIOGRAFÍA (solo en acerca.html) ========== */
async function loadBioData() {
  const acercaSection = document.getElementById('acerca-content');
  if (!acercaSection) return;

  try {
    const response = await fetch('data/bio.json');
    if (!response.ok) throw new Error('No se pudo cargar bio.json');
    const bioData = await response.json();
    renderBioSection(bioData);
  } catch (error) {
    console.error('Error cargando datos personales:', error);
  }
}

function renderBioSection(bioData) {
  const acercaDeSection = document.getElementById('acerca-content');
  if (!acercaDeSection || !bioData) return;

  const skillsHtml = bioData.skills
    .map(skill => `<div class="skill">${skill}</div>`)
    .join('');

  acercaDeSection.innerHTML = `
    <div class="about-content">
      <div class="name">${bioData.name}</div>
      <div class="alias">${bioData.alias}</div>
      <p>${bioData.longBio.split('\n')[0]}</p>
      <p>${bioData.longBio.split('\n')[1] || ''}</p>
      <h3>Habilidades & Intereses</h3>
      <div class="skill-list">
        ${skillsHtml}
      </div>
    </div>
  `;
}

/* ========== PROYECTOS (solo en proyectos.html) ========== */
async function loadProjectsData() {
  const container = document.getElementById('proyectos-content');
  if (!container) return;

  try {
    const response = await fetch('data/projects.json');
    if (!response.ok) throw new Error('No se pudo cargar projects.json');
    const projectsData = await response.json();
    renderProjectsSection(projectsData);
  } catch (error) {
    console.error('Error cargando proyectos:', error);
  }
}

function renderProjectsSection(projectsData) {
  const projectsContent = document.getElementById('proyectos-content');
  if (!projectsContent || !projectsData) return;

  let html = '';

  projectsData.projects.forEach(project => {
    html += `
      <div class="portfolio-item">
        <h3>${project.icon} ${project.name}</h3>
        <p>${project.shortDescription}</p>
        <div id="project-${project.id}"></div>
      </div>
    `;
  });

  projectsContent.innerHTML = html;

  projectsData.projects.forEach(project => {
    loadProjectDetails(project.id, project.dataFile);
  });
}

async function loadProjectDetails(projectId, dataFile) {
  try {
    const response = await fetch(dataFile);
    if (!response.ok) throw new Error(`No se pudo cargar ${dataFile}`);
    const projectData = await response.json();

    const projectContainer = document.getElementById(`project-${projectId}`);
    if (!projectContainer) return;

    const tagsHtml = projectData.tags
      .map(tag => `<span class="portfolio-tag">${tag}</span>`)
      .join('');

    let imagesHtml = '';
    if (projectData.images && projectData.images.length > 0) {
      imagesHtml = `
        <div class="project-preview">
          ${projectData.images.map(img => `<img src="${img}" alt="${projectData.title}" />`).join('')}
        </div>
      `;
    }

    let linksHtml = '';
    if (projectData.links) {
      linksHtml = '<p style="margin-top: 1rem; font-size: 0.85rem;">';
      Object.entries(projectData.links).forEach(([key, url]) => {
        const labels = {
          github: 'Ver repositorio',
          stoat: 'Ver en Stoat',
          updates: 'Ver actualizaciones',
          community: 'Unirse a la comunidad'
        };
        const label = labels[key] || key;
        linksHtml += `<a href="${url}" style="color: var(--orange); text-decoration: none; font-weight: bold; margin-right: 1rem;">${label} →</a>`;
      });
      linksHtml += '</p>';
    }

    projectContainer.innerHTML = `
      ${imagesHtml}
      ${tagsHtml}
      ${linksHtml}
    `;
  } catch (error) {
    console.error(`Error cargando detalles del proyecto ${projectId}:`, error);
  }
}

/* ========== GALERÍA (solo en galeria.html) ========== */
async function loadGalleryData() {
  const container = document.getElementById('galeria-content');
  if (!container) return;

  try {
    const response = await fetch('data/galeria.json');
    if (!response.ok) throw new Error('No se pudo cargar galeria.json');
    const galleryData = await response.json();
    renderGallery(galleryData);
  } catch (error) {
    console.error('Error cargando la galería:', error);
  }
}

function renderGallery(galleryData) {
  const container = document.getElementById('galeria-content');
  if (!container || !galleryData) return;

  if (!galleryData.images || galleryData.images.length === 0) {
    // Se queda el placeholder que ya está en el HTML
    return;
  }

  let html = '';
  galleryData.images.forEach(image => {
    html += `
      <div class="gallery-item">
        <img src="${image.src}" alt="${image.caption || ''}" loading="lazy">
        ${image.caption ? `<div class="gallery-caption">${image.caption}</div>` : ''}
      </div>
    `;
  });

  container.innerHTML = html;
}

document.addEventListener('DOMContentLoaded', loadAllData);
