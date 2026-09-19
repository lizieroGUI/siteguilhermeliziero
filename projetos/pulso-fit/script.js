document.addEventListener('DOMContentLoaded', () => {

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Ano no rodapé ---------- */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- Menu mobile ---------- */
  const menuToggle = document.getElementById('menuToggle');
  const nav = document.getElementById('nav');

  if (menuToggle && nav) {
    menuToggle.addEventListener('click', () => {
      const isOpen = nav.classList.toggle('is-open');
      menuToggle.setAttribute('aria-expanded', isOpen);
      menuToggle.setAttribute('aria-label', isOpen ? 'Fechar menu' : 'Abrir menu');
    });

    nav.querySelectorAll('.nav__link').forEach(link => {
      link.addEventListener('click', () => {
        nav.classList.remove('is-open');
        menuToggle.setAttribute('aria-expanded', 'false');
        menuToggle.setAttribute('aria-label', 'Abrir menu');
      });
    });
  }

  /* ---------- Accordion (FAQ) ---------- */
  // A altura do painel é controlada via CSS (grid-template-rows), então aqui
  // só alternamos o estado. Isso também evita o painel ficar com altura
  // errada se a pessoa girar a tela com um item aberto.
  const triggers = document.querySelectorAll('.acc-trigger');

  triggers.forEach(trigger => {
    trigger.addEventListener('click', () => {
      const isExpanded = trigger.getAttribute('aria-expanded') === 'true';
      triggers.forEach(t => {
        t.setAttribute('aria-expanded', 'false');
        const panel = document.getElementById(t.getAttribute('aria-controls'));
        if (panel) panel.setAttribute('aria-hidden', 'true');
      });
      trigger.setAttribute('aria-expanded', String(!isExpanded));
      const panel = document.getElementById(trigger.getAttribute('aria-controls'));
      if (panel) panel.setAttribute('aria-hidden', String(isExpanded));
    });
  });

  /* ---------- Contador animado (stats) ---------- */
  const counters = document.querySelectorAll('.stat__num');

  const setFinalValue = (el) => {
    const target = parseFloat(el.dataset.count);
    const isDecimal = el.dataset.decimal === 'true';
    const suffix = el.dataset.suffix || '';
    el.textContent = (isDecimal ? (target / 10).toFixed(1) : target) + suffix;
  };

  const animateCounter = (el) => {
    if (prefersReducedMotion) { setFinalValue(el); return; }

    const target = parseFloat(el.dataset.count);
    const isDecimal = el.dataset.decimal === 'true';
    const suffix = el.dataset.suffix || '';
    const duration = 1400;
    const start = performance.now();

    const step = (now) => {
      const progress = Math.max(0, Math.min((now - start) / duration, 1));
      const eased = 1 - Math.pow(1 - progress, 3);
      let value = target * eased;
      value = isDecimal ? (value / 10).toFixed(1) : Math.round(value);
      el.textContent = value + suffix;
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };

  if ('IntersectionObserver' in window && counters.length) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    counters.forEach(counter => observer.observe(counter));
  } else {
    counters.forEach(animateCounter);
  }

  /* ---------- Carrossel de depoimentos ---------- */
  const track = document.getElementById('testiTrack');
  const prevBtn = document.getElementById('testiPrev');
  const nextBtn = document.getElementById('testiNext');
  const dotsWrap = document.getElementById('testiDots');

  if (track) {
    const slides = Array.from(track.children);
    let current = 0;

    slides.forEach((_, i) => {
      const dot = document.createElement('button');
      dot.className = 'dot' + (i === 0 ? ' is-active' : '');
      dot.setAttribute('aria-label', 'Ir para depoimento ' + (i + 1));
      dot.addEventListener('click', () => goTo(i));
      dotsWrap.appendChild(dot);
    });

    const dots = Array.from(dotsWrap.children);

    function goTo(index, behavior) {
      current = (index + slides.length) % slides.length;
      track.scrollTo({
        left: current * track.clientWidth,
        behavior: behavior || (prefersReducedMotion ? 'auto' : 'smooth')
      });
      dots.forEach((d, i) => d.classList.toggle('is-active', i === current));
      slides.forEach((slide, i) => slide.setAttribute('aria-hidden', String(i !== current)));
    }

    prevBtn.addEventListener('click', () => goTo(current - 1));
    nextBtn.addEventListener('click', () => goTo(current + 1));

    // Realinha o slide atual se a largura do track mudar (ex.: girar o celular)
    window.addEventListener('resize', () => goTo(current, 'auto'));

    if (!prefersReducedMotion) {
      let autoplay;
      const stopAutoplay = () => clearInterval(autoplay);
      const startAutoplay = () => {
        stopAutoplay();
        autoplay = setInterval(() => goTo(current + 1), 6000);
      };

      startAutoplay();
      track.addEventListener('mouseenter', stopAutoplay);
      track.addEventListener('mouseleave', startAutoplay);
      track.addEventListener('focusin', stopAutoplay);
      track.addEventListener('focusout', startAutoplay);
      track.addEventListener('touchstart', stopAutoplay, { passive: true });
      document.addEventListener('visibilitychange', () => {
        if (document.hidden) stopAutoplay();
        else startAutoplay();
      });
    }
  }

  /* ---------- CTA fixo aparece somente depois do hero ---------- */
  const stickyCta = document.getElementById('stickyCta');
  const heroCta = document.querySelector('.hero .btn--primary');

  if (stickyCta && heroCta && 'IntersectionObserver' in window) {
    const stickyObserver = new IntersectionObserver(([entry]) => {
      stickyCta.classList.toggle('is-visible', !entry.isIntersecting);
    }, { threshold: 0.2 });
    stickyObserver.observe(heroCta);
  } else if (stickyCta) {
    stickyCta.classList.add('is-visible');
  }

  /* ---------- Entrada inicial sem deslocar o layout ---------- */
  if (!prefersReducedMotion && window.gsap) {
    const gsap = window.gsap;
    gsap.fromTo(
      ['.hero__content', '.hero__visual'],
      { autoAlpha: 0 },
      {
        autoAlpha: 1,
        duration: 0.72,
        stagger: 0.08,
        ease: 'power1.out',
        clearProps: 'opacity,visibility',
        overwrite: 'auto'
      }
    );
  }

});
