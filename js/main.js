/**
 * COPY'S PLACE WEBSITE - MAIN ENTRY POINT
 * Inicializa todos los módulos del sitio
 */

document.addEventListener('DOMContentLoaded', function() {
  console.log('🐱 Copy\'s Place Website - Inicializando...');

  // El theme y el menú del sitio los inicializa js/layout.js
  // (dependen de que el header/menú ya estén inyectados en el DOM)
  initComments();

  console.log('✅ Módulos de la página inicializados correctamente');
});
