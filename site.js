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

// Amplía la página OCI-TTR-2026-01 con indicadores descriptivos,
// patrones discursivos y programa de investigaciones publicables.
const studyResults = document.querySelector('#resultados');
if (studyResults) {
  fetch('../datos/modelo-turistico-banos-2026-patrones.json')
    .then((response) => {
      if (!response.ok) throw new Error('No se pudo cargar el panel ampliado.');
      return response.json();
    })
    .then((data) => {
      const formatNumber = (value) => new Intl.NumberFormat('es-EC').format(value);
      const formatPercent = (value) => `${String(value).replace('.', ',')} %`;

      const style = document.createElement('style');
      style.textContent = `
        .expanded-dashboard{margin-top:3rem;padding-top:3rem;border-top:1px solid var(--line)}
        .expanded-dashboard h3{font-size:clamp(1.6rem,3vw,2.35rem);margin:0 0 1rem}
        .expanded-note{padding:1rem 1.2rem;background:#f2e4c5;border-left:4px solid #aa7a2d}
        .corpus-profile{display:grid;grid-template-columns:repeat(4,1fr);border-top:1px solid var(--line);border-left:1px solid var(--line);margin:1.5rem 0 3rem}
        .corpus-profile article{padding:1.2rem;border-right:1px solid var(--line);border-bottom:1px solid var(--line);background:var(--white)}
        .corpus-profile strong{display:block;font-family:Georgia,"Times New Roman",serif;font-size:2rem;line-height:1}
        .corpus-profile span{display:block;margin-top:.55rem;color:var(--muted);font-size:.8rem}
        .pattern-list{margin:1.5rem 0 3rem}
        .pattern-row{display:grid;grid-template-columns:minmax(260px,.95fr) 1.2fr 90px;gap:1rem;align-items:center;padding:.7rem 0;border-bottom:1px solid var(--line)}
        .pattern-row b{font-size:.9rem}
        .pattern-track{height:10px;background:#dedbd2}
        .pattern-track i{display:block;height:100%;background:var(--green)}
        .pattern-value{text-align:right;color:var(--muted);font-size:.8rem}
        .absence-finding{padding:1.6rem;background:#102b24;color:white;margin:2rem 0}
        .absence-finding h4{font-family:Georgia,"Times New Roman",serif;font-size:1.8rem;margin:.2rem 0 1rem;color:white}
        .absence-finding p{color:#ffffffc5}
        .destination-grid{display:grid;grid-template-columns:repeat(4,1fr);border-top:1px solid var(--line);border-left:1px solid var(--line);margin:1.5rem 0 3rem}
        .destination-grid div{padding:1rem;border-right:1px solid var(--line);border-bottom:1px solid var(--line);background:var(--white)}
        .destination-grid strong{font-family:Georgia,"Times New Roman",serif;font-size:1.7rem}
        .destination-grid span{display:block;color:var(--muted);font-size:.8rem}
        .research-program{margin-top:4rem}
        .research-grid-expanded{display:grid;grid-template-columns:repeat(2,1fr);border-top:1px solid var(--line);border-left:1px solid var(--line)}
        .research-grid-expanded article{padding:1.35rem;border-right:1px solid var(--line);border-bottom:1px solid var(--line);background:var(--white)}
        .research-grid-expanded code{font-size:.7rem;color:#aa7a2d}
        .research-grid-expanded h4{font-family:Georgia,"Times New Roman",serif;font-size:1.25rem;margin:.8rem 0}
        .research-grid-expanded p{color:var(--muted);font-size:.88rem}
        .research-grid-expanded span{display:inline-block;margin-top:.5rem;padding:.25rem .5rem;background:var(--paper-strong);font-size:.72rem}
        .data-actions{display:flex;flex-wrap:wrap;gap:.7rem;margin-top:1.5rem}
        .data-actions a{display:inline-flex;padding:.75rem 1rem;border:1px solid var(--ink);text-decoration:none;font-weight:700;font-size:.82rem}
        @media(max-width:900px){.corpus-profile,.destination-grid{grid-template-columns:repeat(2,1fr)}.pattern-row{grid-template-columns:1fr}.pattern-value{text-align:left}.research-grid-expanded{grid-template-columns:1fr}}
        @media(max-width:560px){.corpus-profile,.destination-grid{grid-template-columns:1fr}}
      `;
      document.head.appendChild(style);

      const profile = data.perfil_corpus;
      const topPatterns = data.patrones_discursivos.slice(0, 16);
      const maxPattern = Math.max(...topPatterns.map((item) => item.n), 1);

      const dashboard = document.createElement('div');
      dashboard.className = 'expanded-dashboard';
      dashboard.innerHTML = `
        <p class="eyebrow">Auditoría ampliada · versión ${data.version}</p>
        <h3>Perfil del corpus y patrones discursivos detectados</h3>
        <p class="expanded-note">${data.advertencia}</p>

        <div class="corpus-profile">
          <article><strong>${formatNumber(profile.comentarios_validos_descriptivos)}</strong><span>comentarios válidos para la descripción textual</span></article>
          <article><strong>${profile.mediana_palabras}</strong><span>palabras como mediana por comentario</span></article>
          <article><strong>${formatPercent(profile.porcentaje_10_o_mas)}</strong><span>tiene diez o más palabras</span></article>
          <article><strong>${formatPercent(profile.porcentaje_20_o_mas)}</strong><span>tiene veinte o más palabras</span></article>
        </div>

        <h3>Indicadores de marcos discursivos</h3>
        <p>Estas frecuencias permiten formular hipótesis publicables. Un comentario puede contener más de un patrón.</p>
        <div class="pattern-list">
          ${topPatterns.map((item) => `
            <div class="pattern-row">
              <b>${item.patron}</b>
              <div class="pattern-track" aria-hidden="true"><i style="width:${Math.max(2, item.n / maxPattern * 100).toFixed(1)}%"></i></div>
              <div class="pattern-value">${formatNumber(item.n)} · ${formatPercent(item.porcentaje)}</div>
            </div>
          `).join('')}
        </div>

        <div class="absence-finding">
          <p class="eyebrow">Hallazgo de ausencia</p>
          <h4>Los efectos visibles dominan la conversación; las estructuras casi no aparecen.</h4>
          <p>En la detección preliminar, innovación y copia aparecen en 5 comentarios; concentración o favoritismo en 4; agua y saneamiento no registran menciones explícitas. La ausencia no demuestra que esos problemas no existan: muestra que casi no ingresaron al marco espontáneo del debate.</p>
        </div>

        <h3>Destinos utilizados como comparación</h3>
        <div class="destination-grid">
          ${data.destinos_comparados.map((item) => `<div><strong>${formatNumber(item.n)}</strong><span>${item.destino}</span></div>`).join('')}
        </div>

        <div class="data-actions">
          <a href="../datos/modelo-turistico-banos-2026-patrones.csv" download>Descargar patrones en CSV</a>
          <a href="../datos/modelo-turistico-banos-2026-patrones.json" download>Descargar datos en JSON</a>
          <a href="../datos/modelo-turistico-banos-2026-libro-codigos.md">Consultar libro de códigos</a>
        </div>

        <div class="research-program" id="programa-investigacion">
          <p class="eyebrow">Serie OCI-TTR-2026-01</p>
          <h3>Programa de investigaciones publicables</h3>
          <p>El estudio base se convierte en una serie de análisis independientes, cada uno con pregunta, método, resultados y versión propia.</p>
          <div class="research-grid-expanded">
            ${data.programa_investigacion.map((item) => `
              <article>
                <code>${item.codigo}</code>
                <h4>${item.titulo}</h4>
                <p>${item.objetivo}</p>
                <span>${item.estado}</span>
              </article>
            `).join('')}
          </div>
        </div>
      `;

      studyResults.appendChild(dashboard);

      const codeBadge = document.querySelector('.code');
      if (codeBadge) codeBadge.textContent = 'OCI-TTR-2026-01 · Versión 0.2 preliminar';

      const toc = document.querySelector('.toc');
      if (toc && !toc.querySelector('a[href="#programa-investigacion"]')) {
        const link = document.createElement('a');
        link.href = '#programa-investigacion';
        link.textContent = '11 · Programa de investigación';
        toc.appendChild(link);
      }
    })
    .catch((error) => {
      console.warn(error);
    });
}
