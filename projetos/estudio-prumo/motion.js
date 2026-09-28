// ===== MOTION =====
// Regras: só transform/opacity, cada animação roda uma vez, nada anima com "reduzir movimento".
// Sem GSAP (CDN fora do ar) a página aparece inteira e estática.
(() => {
  const root = document.documentElement;
  if (!window.gsap || !window.ScrollTrigger) { root.classList.remove('motion'); return; }
  const hasSplit = !!window.SplitText;
  gsap.registerPlugin(ScrollTrigger, ...(hasSplit ? [SplitText] : []));
  gsap.defaults({ ease: 'power3.out', duration: 0.9 });

  const mm = gsap.matchMedia();
  mm.add({ motion: '(prefers-reduced-motion: no-preference)', desktop: '(min-width: 861px)' }, (self) => {
    const { conditions } = self;
    if (!conditions.motion) { root.classList.remove('motion'); return; }
    const { desktop } = conditions;

    // Divide um título em linhas com máscara. Com autoSplit, refaz a divisão no resize/troca de fonte
    // e o GSAP transfere o progresso da animação para as novas linhas.
    const splitLines = (el, build) => hasSplit
      ? SplitText.create(el, { type: 'lines', mask: 'lines', autoSplit: true, onSplit: self => build(self.lines) })
      : build([el]);

    // 1. HERO: entrada curta que dá ordem de leitura (título → texto → CTA). A foto não some,
    // só assenta com um leve zoom, então não atrasa o carregamento percebido.
    const heroImg = document.querySelector('.hero__img img');
    const heroIntro = () => {
      root.classList.remove('motion');
      // no desktop a foto fica em 1.08 para sobrar margem para o parallax sem abrir fresta
      gsap.fromTo(heroImg, { scale: desktop ? 1.2 : 1.12 }, { scale: desktop ? 1.08 : 1, duration: 1.6, ease: 'power2.out' });
      gsap.from('.hero__main .label', { autoAlpha: 0, y: 12, duration: 0.6 });
      splitLines('.hero__title', lines => gsap.from(lines, { yPercent: 105, stagger: 0.08, delay: 0.1 }));
      gsap.from('.hero__side > *', { autoAlpha: 0, y: 20, stagger: 0.1, delay: 0.35 });
    };
    // espera a fonte (no máx. 600 ms) para dividir as linhas certas de primeira
    Promise.race([document.fonts.ready, new Promise(r => setTimeout(r, 600))]).then(() => self.add(heroIntro)); // self.add: entra no revert do matchMedia

    // 2. HERO (desktop): a foto desce mais devagar que a página, dando profundidade à fachada.
    if (desktop) {
      gsap.fromTo(heroImg, { yPercent: 0 }, {
        yPercent: 3.5, ease: 'none',
        scrollTrigger: { trigger: '.hero__img', start: 'top top+=100', end: 'bottom top', scrub: true },
      });
    }

    // 3. Títulos grandes: revelam linha a linha quando entram na tela (marcam a mudança de assunto).
    gsap.utils.toArray('.section .h2, .final-cta .h2').forEach(h => {
      splitLines(h, lines => gsap.from(lines, {
        yPercent: 105, stagger: 0.08,
        scrollTrigger: { trigger: h, start: 'top 88%', once: true },
      }));
    });

    // 4. Blocos de conteúdo: entram em sequência, na ordem em que devem ser lidos.
    // Nas revelações por scroll usa opacity (não autoAlpha): visibility:hidden tiraria o conteúdo
    // ainda não revelado da ordem do Tab e do leitor de tela.
    const reveal = (selector, opts = {}) => {
      const items = gsap.utils.toArray(selector);
      if (!items.length) return;
      gsap.set(items, { opacity: 0, y: opts.y ?? 28 });
      ScrollTrigger.batch(items, {
        start: opts.start ?? 'top 90%', once: true,
        onEnter: batch => gsap.to(batch, { opacity: 1, y: 0, stagger: 0.1, overwrite: true }),
      });
    };
    reveal('.about__text > p, .signature');
    reveal('.service');
    reveal('.feature');
    reveal('.faq details', { y: 16 });
    reveal('.gallery__cta, .final-cta .cta', { y: 16 });

    // 5. Números: contam até o valor quando aparecem. Chamam o olho para a prova.
    gsap.utils.toArray('.stats strong').forEach(el => {
      el.dataset.final ??= el.textContent; // guarda o valor real para reexecuções do matchMedia
      const [, num, suffix] = el.dataset.final.match(/^(\d+)(.*)$/) || [];
      if (!num) return;
      el.textContent = '0' + suffix;
      const counter = { v: 0 };
      gsap.to(counter, {
        v: +num, duration: 1.4, ease: 'power2.out',
        onUpdate: () => { el.textContent = Math.round(counter.v) + suffix; },
        scrollTrigger: { trigger: '.stats', start: 'top 90%', once: true },
      });
    });

    // 6. Portfólio: foto sobe e assenta do zoom. É a principal prova do escritório.
    const figures = gsap.utils.toArray('.gallery .g');
    gsap.set(figures, { opacity: 0, y: 40 });
    gsap.set('.gallery .g__media img', { scale: 1.08 });
    ScrollTrigger.batch(figures, {
      start: 'top 92%', once: true,
      onEnter: batch => {
        gsap.timeline()
          .to(batch, { opacity: 1, y: 0, stagger: 0.12 })
          .to(batch.map(f => f.querySelector('img')), { scale: 1, duration: 1.2, stagger: 0.12, clearProps: 'transform' }, '<');
      },
    });

    // 7. Como funciona: a linha de cada etapa é desenhada em ordem e o texto vem depois.
    // Aqui a sequência é o próprio conteúdo (01 → 04).
    const steps = gsap.utils.toArray('.step');
    gsap.set(steps, { '--line-w': '0%' });
    gsap.set('.step > *', { opacity: 0, y: 16 });
    gsap.timeline({ scrollTrigger: { trigger: '.steps', start: 'top 85%', once: true } })
      .to(steps, { '--line-w': '100%', duration: 0.7, ease: 'power2.inOut', stagger: 0.18 })
      .to('.step > *', { opacity: 1, y: 0, duration: 0.6, stagger: 0.05 }, 0.25);

    // Imagens lazy mudam a altura da página ao carregar: recalcula posições uma vez no fim
    window.addEventListener('load', () => ScrollTrigger.refresh(), { once: true });

    // ao reverter (troca de breakpoint), devolve os números reais
    return () => document.querySelectorAll('.stats strong').forEach(el => { if (el.dataset.final) el.textContent = el.dataset.final; });
  });

  // 8. FAQ: a resposta aparece com um leve deslizar ao abrir (retorno visual do clique).
  if (!matchMedia('(prefers-reduced-motion: reduce)').matches) {
    document.querySelectorAll('.faq details').forEach(d => {
      d.addEventListener('toggle', () => {
        if (d.open) gsap.from(d.querySelector('p'), { autoAlpha: 0, y: -8, duration: 0.35, ease: 'power2.out' });
      });
    });
  }
})();
