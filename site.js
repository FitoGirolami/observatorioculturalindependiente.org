const navToggle = document.querySelector('.nav-toggle');
const siteNav = document.querySelector('.site-nav');

if (navToggle && siteNav) {
  navToggle.addEventListener('click', () => {
    const isOpen = siteNav.classList.toggle('is-open');
    navToggle.setAttribute('aria-expanded', String(isOpen));
  });

  siteNav.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      siteNav.classList.remove('is-open');
      navToggle.setAttribute('aria-expanded', 'false');
    });
  });
}

const year = document.getElementById('year');
if (year) year.textContent = new Date().getFullYear();

// Oculta las opciones de descarga ofrecidas por la interfaz del navegador.
// El archivo sigue siendo un recurso público necesario para la reproducción web.
document.querySelectorAll('.protected-audio').forEach((audio) => {
  audio.addEventListener('contextmenu', (event) => event.preventDefault());
  audio.addEventListener('dragstart', (event) => event.preventDefault());
});