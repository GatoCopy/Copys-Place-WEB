/**
 * COPY'S PLACE - UPDATES LOADER
 * Carga las actualizaciones desde data/updates.json
 */

async function loadUpdates() {
  try {
    const response = await fetch('data/updates.json');
    if (!response.ok) throw new Error('No se pudo cargar updates.json');
    
    const updatesData = await response.json();
    renderUpdates(updatesData);
  } catch (error) {
    console.error('Error cargando actualizaciones:', error);
    document.getElementById('actualizaciones-content').innerHTML = 
      '<p style="color: red;">Error cargando actualizaciones. Por favor, recarga la página.</p>';
  }
}

function renderUpdates(updatesData) {
  const container = document.getElementById('actualizaciones-content');
  
  if (!container) {
    console.error('No se encontró el contenedor de actualizaciones');
    return;
  }
  
  let html = '';
  
  // Iterar sobre cada mes
  Object.keys(updatesData).forEach(monthKey => {
    const updates = updatesData[monthKey];
    
    // Convertir "agosto-2026" a "Agosto 2026"
    const monthLabel = monthKey
      .split('-')
      .map((word, index) => {
        if (index === 0) {
          // Capitalizar mes
          return word.charAt(0).toUpperCase() + word.slice(1);
        }
        return word;
      })
      .join(' ');
    
    html += `<div class="update-month">📅 ${monthLabel}</div>`;
    
    updates.forEach(update => {
      html += `
        <div class="update-item">
          <div class="update-title">${update.title}</div>
          <div class="update-description">${update.description}</div>
        </div>
      `;
    });
  });
  
  container.innerHTML = html;
}

// Inicializar cuando el documento esté listo
document.addEventListener('DOMContentLoaded', loadUpdates);
