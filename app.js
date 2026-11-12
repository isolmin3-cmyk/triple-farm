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
