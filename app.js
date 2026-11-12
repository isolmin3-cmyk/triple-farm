const nav = document.querySelector('#nav');
const toggle = document.querySelector('#menu-toggle');
const mobile = window.matchMedia('(max-width: 900px)');
const groups = Array.from(nav.querySelectorAll('details'));

function setMenu(open) {
  nav.toggleAttribute('data-collapsed', mobile.matches && !open);
  toggle.setAttribute('aria-expanded', String(mobile.matches && open));
  if (!open) groups.forEach(group => { group.open = false; });
}

function syncMenu() {
  toggle.hidden = !mobile.matches;
  setMenu(false);
}

toggle.addEventListener('click', () => {
  setMenu(toggle.getAttribute('aria-expanded') !== 'true');
});

groups.forEach(group => {
  group.addEventListener('toggle', () => {
    if (group.open) {
      groups.filter(other => other !== group).forEach(other => { other.open = false; });
    }
  });
});

document.addEventListener('click', event => {
  if (!event.target.closest('.header')) setMenu(false);
});

document.addEventListener('keydown', event => {
  if (event.key !== 'Escape') return;
  const openGroup = groups.find(group => group.open);
  if (openGroup) {
    openGroup.open = false;
    openGroup.querySelector('summary').focus();
  } else if (toggle.getAttribute('aria-expanded') === 'true') {
    setMenu(false);
    toggle.focus();
  }
});

mobile.addEventListener('change', syncMenu);
syncMenu();

const historyPhases = document.querySelectorAll('.history-phase');
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

if (historyPhases.length && 'IntersectionObserver' in window) {
  const observer = new IntersectionObserver(entries => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      if (!reducedMotion.matches) {
        entry.target.animate(
          [
            { opacity: 0, transform: 'translateY(16px)' },
            { opacity: 1, transform: 'translateY(0)' },
          ],
          { duration: 600, easing: 'ease-out' },
        );
      }
      observer.unobserve(entry.target);
    }
  }, { threshold: 0.18 });

  historyPhases.forEach(phase => observer.observe(phase));
}
