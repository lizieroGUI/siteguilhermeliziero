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

  // ===== Triagem "Por onde começar" =====
  var PEOPLE = {
    camila: { name: 'Dra. Camila Rezende', role: 'Médica de família', img: 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=120&h=120&fit=crop&crop=faces&q=75&auto=format' },
    rafael: { name: 'Dr. Rafael Nunes', role: 'Pediatra', img: 'https://images.unsplash.com/photo-1622253694238-3b22139576c6?w=120&h=120&fit=crop&crop=faces&q=75&auto=format' },
    antonio: { name: 'Dr. Antônio Veloso', role: 'Geriatra', img: 'https://images.unsplash.com/photo-1758691461935-202e2ef6b69f?w=120&h=120&fit=crop&crop=faces&q=75&auto=format' },
    julia: { name: 'Júlia Okuda', role: 'Nutricionista', img: 'https://images.unsplash.com/photo-1585358682246-23acb1561f6b?w=120&h=120&fit=crop&crop=faces&q=75&auto=format' }
  };
  var steps = $$('.quiz__step'), bars = $$('.quiz__progress li'), current = 0;
  var next = $('#quizNext'), back = $('#quizBack'), error = $('#quizError'), nav = $('#quizNav');
  var result = $('#quizResult'), rTitle = $('#resultTitle'), rText = $('#resultText'), rWho = $('#resultWho');
  var answer = function (name) { var el = $('input[name="' + name + '"]:checked'); return el ? el.value : null; };

  function go(i) {
    current = i;
    steps.forEach(function (s, k) { s.hidden = k !== i; s.classList.toggle('is-active', k === i); });
    bars.forEach(function (b, k) { b.classList.toggle('is-on', k <= i); });
    back.hidden = i === 0;
    next.textContent = i === steps.length - 1 ? 'Ver indicação' : 'Continuar';
    error.textContent = '';
  }
  // escolher uma opção já avança (menos toques); o botão continua para teclado
  $$('.quiz__step input').forEach(function (input) {
    input.addEventListener('change', function () { setTimeout(function () { if (current < steps.length - 1) go(current + 1); else finish(); }, 260); });
  });
  next.addEventListener('click', function () {
    var names = ['quem', 'motivo', 'periodo'];
    if (!answer(names[current])) { error.textContent = 'Escolha uma opção para continuar.'; $('input', steps[current]).focus(); return; }
    if (current < steps.length - 1) go(current + 1); else finish();
  });
  back.addEventListener('click', function () { go(current - 1); });

  var rec;
  function finish() {
    var quem = answer('quem'), motivo = answer('motivo'), periodo = answer('periodo');
    var who = [], title, text, esp;
    if (quem === 'criança') {
      esp = motivo === 'alimentacao' ? 'Pediatria e nutrição infantil' : 'Pediatria';
      title = esp; who = motivo === 'alimentacao' ? ['rafael', 'julia'] : ['rafael'];
      text = motivo === 'alimentacao' ? 'Primeiro a consulta pediátrica, depois a nutricionista monta um plano que a criança topa comer.' : 'Consulta pediátrica com tempo para examinar com calma e tirar todas as dúvidas dos pais.';
    } else if (motivo === 'alimentacao') {
      esp = 'Cuidado integrado: consulta médica + nutrição';
      title = 'Cuidado integrado'; who = ['camila', 'julia'];
      text = 'A médica avalia exames e saúde geral, e a nutricionista monta o plano alimentar com a sua rotina. Retorno em conjunto em 30 dias.';
    } else {
      esp = quem === 'idoso' ? 'Geriatria' : 'Clínica geral';
      title = esp; who = [quem === 'idoso' ? 'antonio' : 'camila'];
      text = motivo === 'checkup' ? 'Consulta de prevenção com pedido dos exames certos para a sua idade.' : motivo === 'cronico' ? 'Acompanhamento com revisão dos remédios e metas combinadas com você.' : 'Consulta para investigar o sintoma com calma e definir os próximos passos.';
      if (motivo === 'cronico') { who.push('julia'); text += ' A nutricionista pode entrar no plano se fizer sentido.'; }
    }
    rTitle.textContent = title;
    rText.textContent = text;
    rWho.innerHTML = '';
    who.forEach(function (k) {
      var p = PEOPLE[k], d = document.createElement('div');
      d.className = 'who';
      d.innerHTML = '<img src="' + p.img + '" width="44" height="44" alt=""><span><strong>' + p.name + '</strong>' + p.role + '</span>';
      rWho.appendChild(d);
    });
    rec = { esp: esp, quem: quem, periodo: periodo, motivo: $('input[name="motivo"]:checked + span').firstChild.textContent.trim().toLowerCase() };
    steps.forEach(function (s) { s.hidden = true; });
    bars.forEach(function (b) { b.classList.add('is-on'); });
    nav.hidden = true;
    result.hidden = false;
    result.focus();
  }
  $('#quizReset').addEventListener('click', function () {
    $$('.quiz__step input').forEach(function (i) { i.checked = false; });
    result.hidden = true; nav.hidden = false; go(0);
  });

  var dialog = $('#demoDialog'), msg = $('#demoMsg');
  $('#quizSend').addEventListener('click', function () {
    msg.textContent = 'Olá, Clínica Aurora! Quero agendar: ' + rec.esp + '.\nPara: ' + rec.quem + ' · motivo: ' + rec.motivo + '.\nPeríodo preferido: ' + rec.periodo + '.';
    dialog.showModal();
  });
  $('.demo-dialog__close').addEventListener('click', function () { dialog.close(); });
  dialog.addEventListener('click', function (e) { if (e.target === dialog) dialog.close(); });

  // ===== Equipe: a faixa vertical mostra a especialidade de quem está em destaque =====
  var TEAM = [
    { role: 'Médica de família · Responsável técnica', name: 'Dra. Camila Rezende', reg: 'CRM-SP 000000 · RQE 00000 (fictícios)', quote: '“A consulta boa é a que termina com você sabendo exatamente o que fazer em casa.”', text: 'Residência em Medicina de Família e Comunidade. Atende crianças, adultos e idosos, e coordena a equipe da Aurora.' },
    { role: 'Nutricionista', name: 'Júlia Okuda', reg: 'CRN-3 00000 (fictício)', quote: '“Não existe plano bom que você não consegue seguir numa terça-feira corrida.”', text: 'Especialista em nutrição clínica e comportamento alimentar. Monta cardápios com receitas simples e lista de compras.' },
    { role: 'Pediatra', name: 'Dr. Rafael Nunes', reg: 'CRM-SP 000000 · RQE 00000 (fictícios)', quote: '“Criança que sai rindo da consulta volta sem medo. Isso também é saúde.”', text: 'Residência em Pediatria. Acompanha o desenvolvimento do recém-nascido aos 12 anos e orienta os pais sem julgamento.' },
    { role: 'Geriatra', name: 'Dr. Antônio Veloso', reg: 'CRM-SP 000000 · RQE 00000 (fictícios)', quote: '“Envelhecer bem é continuar fazendo o que se gosta, com segurança.”', text: 'Especialista em Geriatria. Revisa os remédios em uso, cuida da autonomia e sempre inclui a família nas decisões.' }
  ];
  var docs = $$('.doc'), bio = $('#teamBio'), active = 0;
  function feature(i) {
    active = (i + docs.length) % docs.length;
    docs.forEach(function (d, k) { var on = k === active; d.classList.toggle('is-active', on); d.setAttribute('aria-selected', String(on)); d.tabIndex = on ? 0 : -1; });
    var t = TEAM[active];
    $('#bioRole').textContent = t.role; $('#bioName').textContent = t.name; $('#bioReg').textContent = t.reg;
    $('#bioQuote').textContent = t.quote; $('#bioText').textContent = t.text;
    bio.classList.remove('is-swap'); void bio.offsetWidth; bio.classList.add('is-swap');
  }
  docs.forEach(function (d, i) {
    d.addEventListener('click', function () { feature(i); });
    d.addEventListener('keydown', function (e) {
      var k = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0;
      if (k) { feature(active + k); docs[active].focus(); }
    });
  });
  $$('.arrows .round').forEach(function (b) { b.addEventListener('click', function () { feature(active + Number(b.dataset.dir)); }); });

  // ===== Depoimentos: duplica cada fileira para o deslize ser contínuo =====
  $$('.marquee').forEach(function (m) {
    var track = $('.marquee__track', m);
    [].slice.call(track.children).forEach(function (li) { var c = li.cloneNode(true); c.setAttribute('aria-hidden', 'true'); track.appendChild(c); });
    m.style.setProperty('--dur', (track.children.length * 7) + 's');
    m.classList.add('is-ready');
  });

  // ===== CTA fixo no mobile + entradas ao rolar =====
  if ('IntersectionObserver' in window) {
    var sticky = $('#stickyCta'), past = false, near = false;
    var upd = function () { sticky.classList.toggle('is-on', past && !near); };
    new IntersectionObserver(function (en) { past = !en[0].isIntersecting; upd(); }).observe($('.hero__actions'));
    new IntersectionObserver(function (en) { near = en[0].isIntersecting; upd(); }).observe($('#comecar'));

    $$('.perk, .section-head, .spec, .together__grid, .team, .faq__col, .local').forEach(function (el) { el.classList.add('reveal'); });
    var ro = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add('is-visible'); ro.unobserve(en.target); } });
    }, { threshold: .12, rootMargin: '0px 0px -40px' });
    $$('.reveal').forEach(function (el) { ro.observe(el); });
  }
}());
