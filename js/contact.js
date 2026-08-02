/**
 * COPY'S PLACE - CONTACT FORM
 * Gestiona el envío del formulario de contacto
 *
 * NOTA: Neocities no tiene backend propio, así que este formulario
 * no envía el mensaje a ningún servidor por ahora. Solo da feedback
 * visual al usuario. Si más adelante quieres recibir los mensajes de
 * verdad, puedes conectar este formulario a un servicio como Formspree
 * o Web3Forms (gratis, sin backend propio).
 */

function initContact() {
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', handleContactSubmit);
  }
}

function handleContactSubmit(e) {
  e.preventDefault();

  const name = document.getElementById('contact-name').value.trim();
  const email = document.getElementById('contact-email').value.trim();
  const subject = document.getElementById('contact-subject').value;
  const message = document.getElementById('contact-message').value.trim();

  if (!name || !email || !subject || !message) {
    alert('Por favor completa todos los campos');
    return;
  }

  // Feedback visual (aquí es donde conectarías un servicio real de envío)
  const btn = document.querySelector('.contact-submit');
  const originalText = btn.textContent;
  btn.textContent = '¡Mensaje Enviado! 📨';
  btn.disabled = true;

  setTimeout(() => {
    btn.textContent = originalText;
    btn.disabled = false;
    document.getElementById('contactForm').reset();
  }, 2500);
}

document.addEventListener('DOMContentLoaded', initContact);
