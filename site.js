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

// Reconstruye únicamente en la página del estudio la captura documental,
// almacenada en dos fragmentos binarios para preservar la fuente visual.
const reachImage = document.querySelector('img[src$="alcance-debate-modelo-turistico-banos-2026.webp"]');
if (reachImage) {
  Promise.all([
    fetch('../assets/estudios/alcance-debate-modelo-turistico-banos-2026.part1').then((response) => {
      if (!response.ok) throw new Error('No se pudo cargar la primera parte de la captura.');
      return response.arrayBuffer();
    }),
    fetch('../assets/estudios/alcance-debate-modelo-turistico-banos-2026.part2').then((response) => {
      if (!response.ok) throw new Error('No se pudo cargar la segunda parte de la captura.');
      return response.arrayBuffer();
    })
  ]).then(([part1, part2]) => {
    const combined = new Uint8Array(part1.byteLength + part2.byteLength);
    combined.set(new Uint8Array(part1), 0);
    combined.set(new Uint8Array(part2), part1.byteLength);
    reachImage.src = URL.createObjectURL(new Blob([combined], { type: 'image/webp' }));
  }).catch(() => {
    reachImage.hidden = true;
    const caption = reachImage.closest('figure')?.querySelector('figcaption');
    if (caption) caption.textContent = 'La captura documental no pudo cargarse en este momento.';
  });
}
