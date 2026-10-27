/* Escaparate de la portada (la sección bajo el hero): pasa las campañas de las casas una tras otra.
   Cada diapositiva dura lo que dice su data-dur; la barra de su pestaña se llena mientras tanto.
   Arranca cuando se ve, y se para con el botón de pausa, fuera de pantalla o con la pestaña del navegador oculta.
   (No con el ratón encima: ocupa toda la pantalla y casi siempre lo está.)
   Con prefers-reduced-motion no pasa sola ni reproduce películas: se cambia con las pestañas, con un fundido.
   Las películas se cargan solo al llegar su turno; hasta que arrancan se ve su primer fotograma en foto. */
import { $, $$, reduceMotion } from './utils.js';

const WIPE = 'cubic-bezier(.77,0,.18,1)', OUT = 'cubic-bezier(.2,.7,.1,1)';

export function initEscaparate() {
  const esc = $('[data-esc]');
  if (!esc) return;
  const slides = $$('[data-slide]', esc), casas = $$('[data-esc-casa]', esc), tabs = $$('[data-tab]', esc), cards = $$('[data-card]', esc);
  if (slides.length < 2) return;
  const count = $('[data-count]', esc), credit = $('[data-credit]', esc), creditText = $('[data-credit-text]', esc), pauseBtn = $('[data-pause]', esc);
  $('[data-esc-nav]', esc).hidden = false;

  let i = 0, prog = null, userPaused = false, visible = false, started = false;
  const bar = (n) => $('i', tabs[n]);
  const card = (n) => cards.find((c) => c.dataset.card === String(n));
  const running = () => !userPaused && visible && !document.hidden;

  function playVideo(slide) {
    const v = $('video', slide);
    if (!v || reduceMotion) return;
    if (v.preload !== 'auto') { v.preload = 'auto'; v.load(); }
    v.currentTime = 0;
    v.play().then(() => slide.classList.add('is-playing')).catch(() => {});
  }
  function stopVideo(slide) {
    const v = $('video', slide);
    if (v) { v.pause(); slide.classList.remove('is-playing'); }
  }
  // Zoom muy lento mientras está delante (solo fotos; las películas ya se mueven)
  function drift(slide) {
    if (reduceMotion || $('video', slide)) return;
    $('img', slide).animate([{ scale: 1 }, { scale: 1.06 }], { duration: (Number(slide.dataset.dur) || 7000) + 1500, easing: 'linear', fill: 'both' });
  }

  function startProgress() {
    if (prog) prog.cancel();
    if (reduceMotion) { bar(i).style.transform = 'scaleX(1)'; return; }
    prog = bar(i).animate([{ transform: 'scaleX(0)' }, { transform: 'scaleX(1)' }], { duration: Number(slides[i].dataset.dur) || 7000, fill: 'forwards' });
    prog.onfinish = () => go((i + 1) % slides.length, 1);
  }

  // Aplica el estado de pausa a la barra y a la película que esté delante. La primera vez que se ve, arranca
  function sync() {
    if (running() && !started) { started = true; playVideo(slides[i]); drift(slides[i]); startProgress(); }
    const v = $('video', slides[i]);
    if (running()) { if (prog) prog.play(); if (v && v.paused && !reduceMotion) v.play().catch(() => {}); }
    else { if (prog) prog.pause(); if (v) v.pause(); }
    // Mientras pasa sola, los lectores de pantalla no anuncian cada cambio
    credit.setAttribute('aria-live', running() && !reduceMotion ? 'off' : 'polite');
    pauseBtn.setAttribute('aria-pressed', String(userPaused));
    $('.visually-hidden', pauseBtn).textContent = userPaused ? 'Reanudar el escaparate' : 'Pausar el escaparate';
  }

  // El nombre de la casa que se va sube y se desvanece; el nuevo sale de su ranura
  function swapCasa(from, to) {
    from.classList.remove('is-active');
    to.getAnimations({ subtree: true }).forEach((a) => a.cancel());
    to.hidden = false; to.classList.add('is-active');
    if (reduceMotion) { from.hidden = true; return; }
    from.animate([{ opacity: 1, transform: 'none' }, { opacity: 0, transform: 'translateY(-.6rem)' }], { duration: 450, easing: 'ease-in' })
      .onfinish = () => { if (!from.classList.contains('is-active')) from.hidden = true; };
    $('.esc__name > span', to).animate([{ transform: 'translateY(140%)' }, { transform: 'none' }], { duration: 1100, delay: 250, easing: OUT, fill: 'backwards' });
    $$('.esc__meta, .esc__link', to).forEach((el, k) => el.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 700, delay: 650 + k * 120, easing: 'ease-out', fill: 'backwards' }));
  }

  function go(n, dir = n > i ? 1 : -1) {
    if (n === i) return;
    started = true;
    const from = slides[i], to = slides[n];
    from.classList.remove('is-active'); from.classList.add('is-leaving'); from.setAttribute('aria-hidden', 'true');
    to.classList.add('is-active'); to.removeAttribute('aria-hidden');
    esc.dataset.tone = to.dataset.tone;
    swapCasa(casas[i], casas[n]);
    const c0 = card(i), c1 = card(n);
    if (c0) { c0.hidden = true; c0.classList.remove('is-active'); }
    if (c1) { c1.hidden = false; c1.classList.add('is-active'); }
    tabs.forEach((t, k) => {
      t.setAttribute('aria-selected', String(k === n)); t.tabIndex = k === n ? 0 : -1;
      bar(k).style.transform = `scaleX(${k < n ? 1 : 0})`;
    });
    count.textContent = String(n + 1).padStart(2, '0');
    creditText.textContent = to.dataset.credit;
    const done = () => { from.classList.remove('is-leaving'); stopVideo(from); };

    if (reduceMotion) {
      to.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 400 }).onfinish = done;
    } else {
      // Cortinilla: la nueva entra barriendo desde un lado mientras la anterior se aparta un poco
      const clip = dir > 0 ? ['inset(0 0 0 100%)', 'inset(0 0 0 0%)'] : ['inset(0 100% 0 0)', 'inset(0 0% 0 0)'];
      to.animate([{ clipPath: clip[0] }, { clipPath: clip[1] }], { duration: 1200, easing: WIPE }).onfinish = done;
      from.animate([{ transform: 'none' }, { transform: `translateX(${-8 * dir}%)` }], { duration: 1200, easing: WIPE });
      $$('img, video', to).forEach((el) => el.getAnimations().forEach((a) => a.cancel()));
      $$('img, video', to).forEach((el) => el.animate([{ transform: 'scale(1.14)' }, { transform: 'scale(1.02)' }], { duration: 1800, easing: OUT, fill: 'both' }));
    }
    i = n;
    playVideo(to);
    drift(to);
    startProgress();
    sync();
  }

  tabs.forEach((t, k) => {
    t.tabIndex = k === 0 ? 0 : -1;
    t.addEventListener('click', () => go(k));
  });
  $('[role="tablist"]', esc).addEventListener('keydown', (e) => {
    const d = { ArrowRight: 1, ArrowLeft: -1 }[e.key];
    if (!d) return;
    e.preventDefault();
    go((i + d + slides.length) % slides.length, d);
    tabs[i].focus();
  });
  if (reduceMotion) pauseBtn.hidden = true;
  pauseBtn.addEventListener('click', () => { userPaused = !userPaused; sync(); });

  // Deslizar el dedo sobre la foto
  let x0 = null;
  const stage = $('.esc__stage', esc);
  stage.addEventListener('pointerdown', (e) => { if (e.pointerType !== 'mouse') x0 = e.clientX; });
  stage.addEventListener('pointerup', (e) => {
    if (x0 === null) return;
    const dx = e.clientX - x0; x0 = null;
    if (Math.abs(dx) > 50) go((i + (dx < 0 ? 1 : -1) + slides.length) % slides.length, dx < 0 ? 1 : -1);
  });
  stage.style.touchAction = 'pan-y';

  new IntersectionObserver(([en]) => { visible = en.isIntersecting; sync(); }, { threshold: .25 }).observe(esc);
  document.addEventListener('visibilitychange', sync);
}
