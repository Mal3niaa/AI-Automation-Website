// main.js — shared entrypoint, page bootstrap
// navigation.js and ui.js self-initialize on import.
// This file is the single script tag every page can safely include,
// and where any page-agnostic global behavior lives.

document.addEventListener('DOMContentLoaded', () => {
  document.body.classList.add('js-ready');
});

// Header background intensifies slightly on scroll (subtle, not jarring)
const header = document.getElementById('site-header');
if (header) {
  let lastScroll = 0;
  window.addEventListener(
    'scroll',
    () => {
      const scrollY = window.scrollY;
      if (scrollY > 8 && lastScroll <= 8) {
        header.style.boxShadow = '0 4px 24px rgba(0,0,0,0.25)';
      } else if (scrollY <= 8 && lastScroll > 8) {
        header.style.boxShadow = 'none';
      }
      lastScroll = scrollY;
    },
    { passive: true }
  );
}