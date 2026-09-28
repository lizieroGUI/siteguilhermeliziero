(function () {
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return [].slice.call((r || document).querySelectorAll(s)); };

  // ===== Menu mobile =====
  var burger = $('.burger'), menu = $('#menu');
  var outside = [$('main'), $('.footer')];
  function setMenu(open) {
    menu.classList.toggle('is-open', open);
    burger.setAttribute('aria-expanded', String(open));
    burger.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
    document.body.classList.toggle('menu-open', open);
    outside.forEach(function (el) { el.inert = open; });
  }
  burger.addEventListener('click', function () { setMenu(!menu.classList.contains('is-open')); });
  $$('a', menu).forEach(function (a) { a.addEventListener('click', function () { setMenu(false); }); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && menu.classList.contains('is-open')) { setMenu(false); burger.focus(); } });

  // ===== Galeria: cada foto vai para a coluna mais curta (proporção vem dos atributos width/height) =====
  var gallery = $('#gallery'), items = $$('#gallery li'), cols = 0;
  function layout(force) {
    var n = innerWidth >= 900 ? 3 : 2;
    if (n === cols && !force) return;
    cols = n;
    var colEls = [], heights = [];
    for (var i = 0; i < n; i++) { var ul = document.createElement('ul'); ul.className = 'gcol'; colEls.push(ul); heights.push(0); }
    items.forEach(function (li) {
      if (li.hidden) { colEls[0].appendChild(li); return; }
      var img = $('img', li), k = heights.indexOf(Math.min.apply(null, heights));
      colEls[k].appendChild(li);
      heights[k] += img.height / img.width + .03;
    });
    gallery.replaceChildren.apply(gallery, colEls);
  }
  layout(true);
  var rz; addEventListener('resize', function () { clearTimeout(rz); rz = setTimeout(function () { layout(false); }, 150); });

  // ===== Filtro do portfólio =====
  var chips = $$('.chip');
  chips.forEach(function (chip) {
    chip.addEventListener('click', function () {
      var f = chip.dataset.filter;
      chips.forEach(function (c) { var on = c === chip; c.classList.toggle('is-active', on); c.setAttribute('aria-pressed', String(on)); });
      items.forEach(function (li) { li.hidden = f !== 'todos' && li.dataset.cat !== f; });
      layout(true);
      if (window.ScrollTrigger) ScrollTrigger.refresh();
    });
  });

  // ===== Lightbox (polaroid ampliada) =====
  var lb = $('#lightbox'), lbImg = $('#lbImg'), lbCap = $('#lbCap'), current = 0;
  // ordem original (não a das colunas) para as setas seguirem a sequência do portfólio
  var visibleShots = function () { return items.filter(function (li) { return !li.hidden; }).map(function (li) { return $('.shot', li); }); };
  function show(i) {
    var shots = visibleShots();
    current = (i + shots.length) % shots.length;
    var img = $('img', shots[current]);
    // versão maior com o mesmo recorte: dobra largura e altura
    lbImg.src = img.src.replace(/([?&])(w|h)=(\d+)/g, function (m, p, k, v) { return p + k + '=' + v * 2; });
    lbImg.alt = img.alt;
    lbCap.textContent = shots[current].dataset.caption;
  }
  $$('.shot').forEach(function (shot) {
    shot.addEventListener('click', function () { show(visibleShots().indexOf(shot)); lb.showModal(); });
  });
  $$('.lightbox__nav').forEach(function (b) { b.addEventListener('click', function () { show(current + Number(b.dataset.dir)); }); });
  $('.lightbox__close').addEventListener('click', function () { lb.close(); });
  lb.addEventListener('click', function (e) { if (e.target === lb) lb.close(); });
  lb.addEventListener('keydown', function (e) { if (e.key === 'ArrowRight') show(current + 1); if (e.key === 'ArrowLeft') show(current - 1); });

  // ===== Depoimentos =====
  var quotes = $$('.quote'), count = $('.quotes__count'), q = 0;
  function showQuote(i) {
    q = (i + quotes.length) % quotes.length;
    quotes.forEach(function (el, k) { el.classList.toggle('is-active', k === q); });
    count.textContent = (q + 1) + ' / ' + quotes.length;
  }
  $$('.quotes__nav .round').forEach(function (b) { b.addEventListener('click', function () { showQuote(q + Number(b.dataset.dir)); }); });
  swipe($('.quotes__track'), function (d) { showQuote(q + d); });

  // ===== Pacote escolhido já vem marcado no formulário =====
  var plano = $('#f-plano'), planField = $('#planField'), planOk = $('#planOk'), okTimer;
  $$('[data-plan]').forEach(function (a) {
    a.addEventListener('click', function () {
      plano.value = a.dataset.plan;
      planOk.textContent = 'pacote ' + a.dataset.plan + ' marcado ✓';
      planField.classList.add('is-picked');
      clearTimeout(okTimer); okTimer = setTimeout(function () { planField.classList.remove('is-picked'); }, 2400);
    });
  });
  plano.addEventListener('change', function () { planOk.textContent = ''; });

  // ===== CTA fixo no mobile: aparece depois do hero, some quando o formulário está na tela =====
  var sticky = $('#stickyCta');
  if ('IntersectionObserver' in window) {
    var past = false, nearForm = false;
    var upd = function () { sticky.classList.toggle('is-on', past && !nearForm); };
    new IntersectionObserver(function (en) { past = !en[0].isIntersecting; upd(); }).observe($('.hero__actions'));
    new IntersectionObserver(function (en) { nearForm = en[0].isIntersecting; upd(); }).observe($('#agendar'));
  }

  // ===== Deslizar (toque) para trocar foto no lightbox e depoimento no carrossel =====
  function swipe(el, fn) {
    var x0 = null;
    el.addEventListener('pointerdown', function (e) { if (e.pointerType !== 'mouse') x0 = e.clientX; });
    el.addEventListener('pointerup', function (e) {
      if (x0 === null) return;
      var dx = e.clientX - x0; x0 = null;
      if (Math.abs(dx) > 45) fn(dx < 0 ? 1 : -1);
    });
  }
  swipe(lb, function (d) { show(current + d); });

  // ===== Formulário: validação inline + aviso da demo =====
  var form = $('#bookForm'), dialog = $('#demoDialog'), msg = $('#demoMsg');
  var rules = {
    'f-nome': function (v) { return v.trim().length >= 2; },
    'f-zap': function (v) { return v.replace(/\D/g, '').length >= 10; },
    'f-tipo': function (v) { return v !== ''; }
  };
  function check(id) {
    var el = document.getElementById(id), ok = rules[id](el.value);
    el.closest('.field').classList.toggle('is-invalid', !ok);
    el.setAttribute('aria-invalid', String(!ok));
    el.setAttribute('aria-describedby', 'e-' + id.slice(2));
    return ok;
  }
  Object.keys(rules).forEach(function (id) {
    document.getElementById(id).addEventListener('blur', function () { if (this.value) check(id); });
    document.getElementById(id).addEventListener('input', function () { if (this.closest('.field').classList.contains('is-invalid')) check(id); });
  });
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var bad = Object.keys(rules).filter(function (id) { return !check(id); });
    if (bad.length) { document.getElementById(bad[0]).focus(); return; }
    var d = form.elements.data.value ? new Date(form.elements.data.value + 'T12:00').toLocaleDateString('pt-BR') : 'a combinar';
    msg.textContent = 'Oi, Nina! Sou ' + form.elements.nome.value.trim() + '.\nQuero um ensaio de ' + form.elements.tipo.value.toLowerCase() +
      ' (pacote: ' + form.elements.pacote.value + ').\nData: ' + d + '.';
    dialog.showModal();
  });
  $('.demo-dialog__close').addEventListener('click', function () { dialog.close(); });
  dialog.addEventListener('click', function (e) { if (e.target === dialog) dialog.close(); });

  // ===== Visor: timecode só corre com a seção na tela =====
  var tc = $('#timecode'), secs = 0, timer = null;
  var fmt = function (n) { return String(n).padStart(2, '0'); };
  if ('IntersectionObserver' in window && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
    new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting && !timer) timer = setInterval(function () { secs++; tc.textContent = '00:' + fmt(Math.floor(secs / 60)) + ':' + fmt(secs % 60); }, 1000);
        if (!en.isIntersecting && timer) { clearInterval(timer); timer = null; }
      });
    }).observe($('.viewfinder'));
  }
}());
