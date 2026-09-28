// ===== MOTION =====
// A ideia central: as fotos "revelam" como polaroid (surgem lavadas e ganham cor e contraste).
// Só transform, opacity e filter em poucas imagens, uma vez cada. Com "reduzir movimento" ou sem GSAP, tudo aparece pronto.
(() => {
  const root = document.documentElement;
  if (!window.gsap || !window.ScrollTrigger) { root.classList.remove('motion'); return; }
  gsap.registerPlugin(ScrollTrigger);

  const DEVELOP_FROM = 'brightness(1.9) contrast(.55) saturate(0)';
  const DEVELOPED = 'brightness(1) contrast(1) saturate(1)';

  const mm = gsap.matchMedia();
  mm.add('(prefers-reduced-motion: no-preference)', () => {
    // 1. Hero: as polaroids caem no mural, uma a uma, e revelam
    const wall = gsap.utils.toArray('.wall__p');
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' }, onStart: () => root.classList.remove('motion') });
    // o texto do hero não anima: é o maior conteúdo da tela (LCP) e precisa aparecer na hora
    tl.from(wall, { autoAlpha: 0, y: -70, rotation: (i) => [-12, 14, 9, -15][i], duration: .9, stagger: .16, ease: 'back.out(1.3)' })
      .fromTo(wall.map((p) => p.querySelector('img')), { filter: DEVELOP_FROM }, { filter: DEVELOPED, duration: 2.4, stagger: .16, ease: 'power1.inOut' }, .5);

    // 2. Portfólio: cada foto sobe e revela ao entrar na tela
    const shots = gsap.utils.toArray('#gallery img');
    gsap.set(shots, { opacity: 0, y: 30, filter: DEVELOP_FROM });
    ScrollTrigger.batch(shots, {
      start: 'top 92%', once: true,
      onEnter: (batch) => gsap.to(batch, { opacity: 1, y: 0, filter: DEVELOPED, duration: 1.4, stagger: .1, ease: 'power2.out',
        onComplete() { this.targets().forEach((el) => gsap.set(el, { clearProps: 'filter,transform' })); } }),
    });

    // 3. Polaroids das outras seções (sobre e dúvidas) revelam do mesmo jeito
    gsap.utils.toArray('.about__p img, .faq__p img').forEach((img) => {
      gsap.fromTo(img, { filter: DEVELOP_FROM }, { filter: DEVELOPED, duration: 2, ease: 'power1.inOut', scrollTrigger: { trigger: img, start: 'top 85%', once: true } });
    });

    // 4. Pacotes entram em sequência
    gsap.from('.plan', { opacity: 0, y: 30, duration: .8, stagger: .12, ease: 'power3.out', scrollTrigger: { trigger: '.plans', start: 'top 85%', once: true } });

    window.addEventListener('load', () => ScrollTrigger.refresh(), { once: true });
  });
})();
