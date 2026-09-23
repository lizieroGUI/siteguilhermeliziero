const header = document.querySelector('.site-header');
const menuToggle = document.getElementById('menuToggle');
const menu = document.getElementById('siteNav');
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

function updateHeader() { header.classList.toggle('is-scrolled', window.scrollY > 60); }
window.addEventListener('scroll', updateHeader, { passive: true });
updateHeader();

function setMenu(open) {
  menu.classList.toggle('is-open', open);
  menuToggle.setAttribute('aria-expanded', String(open));
  menuToggle.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
}
menuToggle.addEventListener('click', () => setMenu(!menu.classList.contains('is-open')));
menu.querySelectorAll('a').forEach(link => link.addEventListener('click', () => setMenu(false)));
document.addEventListener('keydown', event => { if (event.key === 'Escape') setMenu(false); });

const dialog = document.getElementById('demoDialog');
document.querySelectorAll('.demo-action').forEach(button => button.addEventListener('click', () => dialog.showModal()));
document.getElementById('dialogClose').addEventListener('click', () => dialog.close());
dialog.addEventListener('click', event => { if (event.target === dialog) dialog.close(); });
document.getElementById('year').textContent = new Date().getFullYear();

const rail = document.getElementById('servicesRail');
const cards = [...rail.querySelectorAll('.service-card')];
const clones = cards.map(card => {
  const clone = card.cloneNode(true);
  clone.classList.add('is-clone');
  clone.setAttribute('aria-hidden', 'true');
  clone.setAttribute('inert', '');
  rail.appendChild(clone);
  return clone;
});
rail.classList.add('is-looping');
const count = document.getElementById('servicesCount');
let cycleWidth = 0;
let offsets = [];
let manualTarget = null;
let visible = false;

function measure() {
  cycleWidth = clones[0].offsetLeft - cards[0].offsetLeft;
  offsets = cards.map(card => card.offsetLeft - cards[0].offsetLeft);
  if (cycleWidth && rail.scrollLeft >= cycleWidth) rail.scrollLeft %= cycleWidth;
}
function activeIndex() {
  if (!cycleWidth) return 0;
  const position = rail.scrollLeft % cycleWidth;
  return offsets.reduce((nearest, offset, index) => {
    const a = Math.abs(offset - position);
    const b = Math.abs(offsets[nearest] - position);
    return Math.min(a, cycleWidth - a) < Math.min(b, cycleWidth - b) ? index : nearest;
  }, 0);
}
let displayedIndex = -1;
function updateCount() {
  const index = activeIndex();
  if (index === displayedIndex) return;
  displayedIndex = index;
  count.textContent = `${String(index + 1).padStart(2, '0')} / 04`;
}
function moveTo(direction) {
  if (!cycleWidth) return;
  const next = (activeIndex() + direction + cards.length) % cards.length;
  let position = rail.scrollLeft;
  if (direction < 0 && next === cards.length - 1 && position < offsets[1]) {
    position += cycleWidth;
    rail.scrollLeft = position;
  }
  let target = offsets[next];
  if (direction > 0 && target <= position) target += cycleWidth;
  if (reducedMotion.matches) {
    rail.scrollLeft = target;
    manualTarget = null;
  } else manualTarget = target;
  updateCount();
}
document.getElementById('servicesPrev').addEventListener('click', () => moveTo(-1));
document.getElementById('servicesNext').addEventListener('click', () => moveTo(1));
rail.addEventListener('keydown', event => {
  if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
  event.preventDefault();
  moveTo(event.key === 'ArrowRight' ? 1 : -1);
});
rail.addEventListener('scroll', updateCount, { passive: true });
window.addEventListener('resize', () => { manualTarget = null; measure(); updateCount(); });
measure();
updateCount();
if ('IntersectionObserver' in window) {
  new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; }, { threshold: .2 }).observe(rail);
} else visible = true;
let lastFrame = 0;
function tick(now) {
  const elapsed = lastFrame ? Math.min(now - lastFrame, 50) : 0;
  lastFrame = now;
  if (!reducedMotion.matches && visible && !document.hidden && cycleWidth) {
    if (manualTarget !== null) {
      const remaining = manualTarget - rail.scrollLeft;
      if (Math.abs(remaining) < 1) manualTarget = null;
      else rail.scrollLeft += Math.sign(remaining) * Math.min(Math.abs(remaining), Math.max(1, Math.abs(remaining) * .1));
    } else {
      rail.scrollLeft += elapsed * .026;
      if (rail.scrollLeft >= cycleWidth) rail.scrollLeft -= cycleWidth;
    }
    updateCount();
  }
  requestAnimationFrame(tick);
}
requestAnimationFrame(tick);

if (!reducedMotion.matches && 'IntersectionObserver' in window) {
  const elements = document.querySelectorAll('.opening__inner, .story__grid, .journey__grid, .therapist__grid, .service-card:not(.is-clone), .quote__inner, .journal article, .location__grid, .faq__grid');
  const reveal = new IntersectionObserver((entries, observer) => entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    entry.target.classList.add('in');
    observer.unobserve(entry.target);
  }), { threshold: .08, rootMargin: '0px 0px -30px 0px' });
  elements.forEach(element => { element.classList.add('reveal'); reveal.observe(element); });
}
