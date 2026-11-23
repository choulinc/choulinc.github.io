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

