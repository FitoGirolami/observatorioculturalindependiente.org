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

const formatTime = (seconds) => {
  if (!Number.isFinite(seconds)) return '00:00';
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
};

document.querySelectorAll('[data-audio-player]').forEach((player) => {
  const audio = player.querySelector('audio');
  const toggle = player.querySelector('.audio-toggle');
  const progress = player.querySelector('.audio-progress');
  const current = player.querySelector('.audio-current');
  const duration = player.querySelector('.audio-duration');

  if (!audio || !toggle || !progress || !current || !duration) return;

  audio.addEventListener('contextmenu', (event) => event.preventDefault());
  audio.addEventListener('dragstart', (event) => event.preventDefault());

  audio.addEventListener('loadedmetadata', () => {
    duration.textContent = formatTime(audio.duration);
  });

  audio.addEventListener('timeupdate', () => {
    current.textContent = formatTime(audio.currentTime);
    progress.value = audio.duration ? String((audio.currentTime / audio.duration) * 100) : '0';
  });

  toggle.addEventListener('click', async () => {
    try {
      if (audio.paused) {
        await audio.play();
      } else {
        audio.pause();
      }
    } catch (error) {
      toggle.textContent = 'No disponible';
      toggle.disabled = true;
    }
  });

  audio.addEventListener('play', () => {
    toggle.textContent = 'Pausar';
    toggle.setAttribute('aria-label', 'Pausar audio');
  });

  audio.addEventListener('pause', () => {
    toggle.textContent = 'Reproducir';
    toggle.setAttribute('aria-label', 'Reproducir audio');
  });

  audio.addEventListener('ended', () => {
    progress.value = '0';
    current.textContent = '00:00';
  });

  progress.addEventListener('input', () => {
    if (audio.duration) {
      audio.currentTime = (Number(progress.value) / 100) * audio.duration;
    }
  });
});