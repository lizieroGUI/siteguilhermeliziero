// ===== CTAs (demo) =====
// Demo de portfólio: os botões de WhatsApp abrem um aviso em vez de iniciar conversa.
// Sem JS, o link leva à seção de contato do portfólio.
const dialog = document.getElementById('demoDialog');
document.querySelectorAll('.js-wa').forEach(a => a.addEventListener('click', e => {
  if (!dialog || !dialog.showModal) return;
  e.preventDefault();
  dialog.showModal();
}));
dialog?.querySelector('.demo-dialog__close').addEventListener('click', () => dialog.close());
dialog?.addEventListener('click', e => { if (e.target === dialog) dialog.close(); }); // clique no fundo fecha

// Menu mobile
const burger = document.getElementById('burger');
const nav = document.getElementById('nav');
const outside = [document.querySelector('main'), document.querySelector('.site-footer'), document.querySelector('.sticky-wa')];
const toggleMenu = (open) => {
  nav.classList.toggle('is-open', open);
  document.body.classList.toggle('menu-open', open);
  burger.setAttribute('aria-expanded', open);
  burger.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
  document.body.style.overflow = open ? 'hidden' : '';
  outside.forEach(el => el.inert = open); // foco fica dentro do menu
};
burger.addEventListener('click', () => toggleMenu(!nav.classList.contains('is-open')));
nav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => toggleMenu(false)));
document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && nav.classList.contains('is-open')) { toggleMenu(false); burger.focus(); }
});

// Botão flutuante some enquanto um CTA da página está visível (evita CTA duplicado e sobreposição)
const sticky = document.querySelector('.sticky-wa');
const inlineCtas = document.querySelectorAll('main .btn--wa');
if ('IntersectionObserver' in window && sticky) {
  const visible = new Set();
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => e.isIntersecting ? visible.add(e.target) : visible.delete(e.target));
    sticky.classList.toggle('is-hidden', visible.size > 0);
  });
  inlineCtas.forEach(el => io.observe(el));
}

// FAQ: mantém só um item aberto
document.querySelectorAll('.faq details').forEach(d => {
  d.addEventListener('toggle', () => {
    if (d.open) document.querySelectorAll('.faq details').forEach(o => o !== d && (o.open = false));
  });
});

// Ano do rodapé
document.getElementById('ano').textContent = new Date().getFullYear();
