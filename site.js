const themeButton = document.querySelector('.theme-button');
const root = document.documentElement;
const navLinks = [...document.querySelectorAll('nav a')];
const portrait = document.querySelector('.portrait img');

function reflectTheme() {
  themeButton.setAttribute('aria-pressed', String(root.dataset.theme === 'dark'));
}

themeButton.addEventListener('click', () => {
  root.dataset.theme = root.dataset.theme === 'dark' ? 'light' : 'dark';
  try { localStorage.setItem('lin-chou-color-theme', root.dataset.theme); } catch {}
  reflectTheme();
});

reflectTheme();
themeButton.hidden = false;

function reflectLocation() {
  const location = navLinks.find(link => link.hash === window.location.hash) ?? navLinks[0];
  for (const link of navLinks) {
    if (link === location) link.setAttribute('aria-current', 'location');
    else link.removeAttribute('aria-current');
  }
}

window.addEventListener('hashchange', reflectLocation);
reflectLocation();

if (portrait.dataset.image) {
  portrait.addEventListener('load', () => { portrait.hidden = false; }, { once: true });
  portrait.src = portrait.dataset.image;
}

const publicationDialog = document.getElementById('publication-figure-dialog');
if (typeof publicationDialog.showModal === 'function') {
  const enlarged = publicationDialog.querySelector('img');
  for (const link of document.querySelectorAll('.paper-art a, .entry-links a[data-figure-view]')) {
    link.addEventListener('click', (event) => {
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      event.preventDefault();
      enlarged.src = link.href;
      enlarged.alt = link.dataset.figureAlt ?? link.querySelector('img').alt;
      publicationDialog.dataset.view = link.dataset.figureView ?? 'diagram';
      publicationDialog.showModal();
    });
  }
}

const scrollMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
if (typeof window.IntersectionObserver === 'function' && !scrollMotion.matches) {
  let previousScrollY = window.scrollY;
  let scrollDirection = 1;
  let hasScrolled = false;
  const visibleElements = new WeakSet();

  window.addEventListener('scroll', () => {
    const currentScrollY = window.scrollY;
    scrollDirection = currentScrollY >= previousScrollY ? 1 : -1;
    previousScrollY = currentScrollY;
    hasScrolled = true;
  }, { passive: true });

  const revealObserver = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (!entry.isIntersecting) {
        visibleElements.delete(entry.target);
        continue;
      }
      if (visibleElements.has(entry.target)) continue;
      visibleElements.add(entry.target);
      if (!hasScrolled || scrollMotion.matches) continue;
      entry.target.animate([
        { opacity: 0, transform: `translateY(${scrollDirection * 18}px)` },
        { opacity: 1, transform: 'translateY(0)' },
      ], {
        duration: 300,
        easing: 'ease-out',
      });
    }
  }, { rootMargin: '-20px 0px -20px 0px' });

  for (const element of document.querySelectorAll('.intro-text, .section > h2, .education-entry, .research-interests, .section > article')) {
    revealObserver.observe(element);
  }
}

