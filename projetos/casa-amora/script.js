(function () {
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return [].slice.call((r || document).querySelectorAll(s)); };

  // ===== Menu mobile =====
  var burger = $('.burger'), menu = $('#menu');
  function setMenu(open) {
    menu.classList.toggle('is-open', open);
    burger.setAttribute('aria-expanded', String(open));
    burger.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
    document.body.classList.toggle('menu-open', open);
    [$('main'), $('.footer')].forEach(function (el) { el.inert = open; });
  }
  burger.addEventListener('click', function () { setMenu(!menu.classList.contains('is-open')); });
  $$('a', menu).forEach(function (a) { a.addEventListener('click', function () { setMenu(false); }); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && menu.classList.contains('is-open')) { setMenu(false); burger.focus(); } });

  // ===== Abas do cardápio (setas do teclado navegam entre abas) =====
  var tabs = $$('.tab');
  function select(tab) {
    tabs.forEach(function (t) {
      var on = t === tab, panel = document.getElementById(t.getAttribute('aria-controls'));
      t.classList.toggle('is-active', on);
      t.setAttribute('aria-selected', String(on));
      t.tabIndex = on ? 0 : -1;
      panel.hidden = !on;
      panel.classList.toggle('is-active', on);
    });
  }
  tabs.forEach(function (tab, i) {
    tab.addEventListener('click', function () { select(tab); });
    tab.addEventListener('keydown', function (e) {
      var d = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0;
      if (!d) return;
      var next = tabs[(i + d + tabs.length) % tabs.length];
      select(next); next.focus();
    });
  });

  // ===== Reserva em 3 toques =====
  var DAYS = ['dom', 'seg', 'ter', 'qua', 'qui', 'sex', 'sáb'];
  var MONTHS = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'];
  var LUNCH = ['12h30', '13h30'], DINNER = ['19h30', '20h30', '21h30'];
  var state = { day: null, time: null, people: 2 };
  var daysEl = $('#days'), timesEl = $('#times'), summary = $('#summary'), peopleEl = $('#people');

  function chip(label, sub, disabled) {
    var b = document.createElement('button');
    b.type = 'button'; b.className = 'chip'; b.setAttribute('aria-pressed', 'false'); b.disabled = !!disabled;
    b.innerHTML = label + (sub ? '<small>' + sub + '</small>' : '');
    return b;
  }
  function press(group, btn) { $$('.chip', group).forEach(function (c) { c.setAttribute('aria-pressed', String(c === btn)); }); }

  function renderDays() {
    var today = new Date();
    for (var i = 0; i < 7; i++) {
      var d = new Date(today); d.setDate(today.getDate() + i);
      var closed = d.getDay() === 1; // segunda fechado
      var b = chip(i === 0 ? 'hoje' : i === 1 ? 'amanhã' : DAYS[d.getDay()], d.getDate() + ' ' + MONTHS[d.getMonth()], closed);
      if (closed) { b.setAttribute('aria-label', 'Segunda, fechado'); b.classList.add('is-off'); }
      (function (d, b) {
        b.addEventListener('click', function () { state.day = d; state.time = null; press(daysEl, b); renderTimes(); update(); });
      })(d, b);
      daysEl.appendChild(b);
    }
  }
  function renderTimes() {
    timesEl.innerHTML = '';
    var wd = state.day ? state.day.getDay() : null;
    var slots = wd === null ? DINNER : wd === 0 ? LUNCH.concat(['15h']) : wd === 6 ? LUNCH.concat(DINNER) : DINNER;
    slots.forEach(function (t, k) {
      var full = state.day && (state.day.getDate() + k) % 5 === 0; // alguns horários "lotados" para a demo
      var b = chip(t, full ? 'lotado' : null, full || !state.day);
      if (full) b.classList.add('is-off');
      b.addEventListener('click', function () { state.time = t; press(timesEl, b); update(); });
      timesEl.appendChild(b);
    });
  }
  function label() {
    var d = state.day;
    return DAYS[d.getDay()] + ', ' + d.getDate() + ' de ' + MONTHS[d.getMonth()] + ' às ' + state.time + ' · ' + state.people + (state.people > 1 ? ' pessoas' : ' pessoa');
  }
  function update() {
    summary.classList.remove('is-error');
    summary.textContent = state.day && state.time ? 'Mesa para ' + label().replace(' · ', ', ') + '.' : state.day ? 'Agora escolha um horário.' : 'Escolha um dia e um horário.';
  }
  $$('.stepper__btn').forEach(function (b) {
    b.addEventListener('click', function () {
      state.people = Math.min(20, Math.max(1, state.people + Number(b.dataset.step)));
      peopleEl.textContent = state.people; update();
      if (state.people > 10) { summary.textContent += ' Para mais de 10 pessoas o menu é fechado.'; }
    });
  });
  renderDays(); renderTimes();
  // o primeiro dia aberto já vem marcado: a reserva fica em dois toques
  var firstOpen = $('#days .chip:not(:disabled)'); if (firstOpen) firstOpen.click();

  var dialog = $('#demoDialog'), msg = $('#demoMsg');
  $('#booker').addEventListener('submit', function (e) {
    e.preventDefault();
    if (!state.day || !state.time) {
      summary.classList.add('is-error');
      summary.textContent = !state.day ? 'Escolha um dia para continuar.' : 'Escolha um horário para continuar.';
      $((!state.day ? '#days' : '#times') + ' .chip:not(:disabled)').focus();
      return;
    }
    msg.textContent = 'Olá, Casa Amora! Quero reservar uma mesa:\n' + label() + '.';
    dialog.showModal();
  });
  $('.demo-dialog__close').addEventListener('click', function () { dialog.close(); });
  dialog.addEventListener('click', function (e) { if (e.target === dialog) dialog.close(); });

  // ===== CTA fixo no mobile: aparece depois do hero, some perto da reserva =====
  var sticky = $('#stickyCta');
  if ('IntersectionObserver' in window) {
    var past = false, near = false;
    var upd = function () { sticky.classList.toggle('is-on', past && !near); };
    new IntersectionObserver(function (en) { past = !en[0].isIntersecting; upd(); }).observe($('.hero__actions'));
    new IntersectionObserver(function (en) { near = en[0].isIntersecting; upd(); }).observe($('#reservar'));

    // entradas ao rolar
    $$('.section-head, .panel__photo, .dishes, .chef__photos, .chef__copy, .bento figure, .review, .booker, .visit > *').forEach(function (el) { el.classList.add('reveal'); });
    var ro = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add('is-visible'); ro.unobserve(en.target); } });
    }, { threshold: .12, rootMargin: '0px 0px -40px' });
    $$('.reveal').forEach(function (el) { ro.observe(el); });
  }
}());
