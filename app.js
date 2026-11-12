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

const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

if ('IntersectionObserver' in window && 'animate' in Element.prototype) {
  const revealTargets = document.querySelectorAll([
    'main h1',
    'main h2:not(.history-phase h2, .card h2)',
    '.hero-inner > p, .hero-inner .actions',
    '.page-content > p, .page-content > address, .page-content > .split > div',
    '.frame, .location-map',
    '.cards > .card, .product-directions > div, .history-phase',
  ].join(', '));

  const observer = new IntersectionObserver(entries => {
    const groupDelays = new Map();

    for (const { isIntersecting, target } of entries) {
      if (!isIntersecting) continue;
      observer.unobserve(target);
      if (reducedMotion.matches) continue;

      const group = target.closest('.cards, .product-directions, .phase-timeline');
      const delay = group ? groupDelays.get(group) ?? 0 : 0;
      if (group) groupDelays.set(group, Math.min(delay + 90, 270));

      target.animate(
        [
          { opacity: .08, transform: 'translateY(26px)' },
          { opacity: 1, transform: 'translateY(0)' },
        ],
        { duration: 650, delay, easing: 'ease-out', fill: 'backwards' },
      );
    }
  }, { threshold: 0.08 });

  const offscreenTargets = Array.from(revealTargets).filter(target => {
    const { top, bottom } = target.getBoundingClientRect();
    return top >= window.innerHeight || bottom <= 0;
  });
  const initialScrollY = window.scrollY;

  function startRevealing() {
    if (window.scrollY === initialScrollY) return;
    window.removeEventListener('scroll', startRevealing);
    offscreenTargets.forEach(target => observer.observe(target));
  }

  window.addEventListener('scroll', startRevealing, { passive: true });
}
