/* Escaparate de la portada: pasa las campañas de las casas una tras otra.
   Cada diapositiva dura lo que dice su data-dur; la barra de su pestaña se llena mientras tanto.
   Se para con el botón de pausa, fuera de pantalla o con la pestaña del navegador oculta. (No con el ratón
   encima: el escaparate ocupa toda la pantalla y casi siempre lo está.)
   Con prefers-reduced-motion no pasa sola ni reproduce películas: se cambia con las pestañas, con un fundido.
   Las películas se cargan solo al llegar su turno; hasta que arrancan se ve su primer fotograma en foto. */
import { $, $$, reduceMotion } from './utils.js';

const WIPE = 'cubic-bezier(.77,0,.18,1)';

export function initEscaparate() {
  const hero = $('[data-hero]');
  if (!hero) return;
  const slides = $$('[data-slide]', hero), cards = $$('[data-card]', hero), tabs = $$('[data-tab]', hero);
  if (slides.length < 2) return;
  const count = $('[data-count]', hero), credit = $('[data-credit-text]', hero), pauseBtn = $('[data-pause]', hero);
  $('[data-hero-nav]', hero).hidden = false;

  let i = 0, prog = null, userPaused = false, visible = true;
  const bar = (n) => $('i', tabs[n]);
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

  function startProgress() {
    if (prog) prog.cancel();
    if (reduceMotion) { bar(i).style.transform = 'scaleX(1)'; return; }
    prog = bar(i).animate([{ transform: 'scaleX(0)' }, { transform: 'scaleX(1)' }], { duration: Number(slides[i].dataset.dur) || 7000, fill: 'forwards' });
    prog.onfinish = () => go((i + 1) % slides.length, 1);
    sync();
  }

  // Aplica el estado de pausa a la barra y a la película que esté delante
  function sync() {
    const v = $('video', slides[i]);
    if (running()) { if (prog) prog.play(); if (v && v.paused && !reduceMotion) v.play().catch(() => {}); }
    else { if (prog) prog.pause(); if (v) v.pause(); }
    pauseBtn.setAttribute('aria-pressed', String(userPaused));
    $('.visually-hidden', pauseBtn).textContent = userPaused ? 'Reanudar el escaparate' : 'Pausar el escaparate';
  }

  function go(n, dir = n > i ? 1 : -1) {
    if (n === i) return;
    const from = slides[i], to = slides[n];
    from.classList.remove('is-active'); from.classList.add('is-leaving'); from.setAttribute('aria-hidden', 'true');
    to.classList.add('is-active'); to.removeAttribute('aria-hidden');
    hero.dataset.tone = to.dataset.tone;
    cards[i].hidden = true; cards[i].classList.remove('is-active');
    cards[n].hidden = false; cards[n].classList.add('is-active');
    tabs.forEach((t, k) => {
      t.setAttribute('aria-selected', String(k === n)); t.tabIndex = k === n ? 0 : -1;
      bar(k).style.transform = `scaleX(${k < n ? 1 : 0})`;
    });
    count.textContent = String(n + 1).padStart(2, '0');
    credit.textContent = to.dataset.credit;
    const media = $('img', to), done = () => { from.classList.remove('is-leaving'); stopVideo(from); };

    if (reduceMotion) {
      to.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 400 }).onfinish = done;
    } else {
      // Cortinilla: la nueva entra barriendo desde un lado mientras la anterior se aparta un poco
      const clip = dir > 0 ? ['inset(0 0 0 100%)', 'inset(0 0 0 0%)'] : ['inset(0 100% 0 0)', 'inset(0 0% 0 0)'];
      to.animate([{ clipPath: clip[0] }, { clipPath: clip[1] }], { duration: 1200, easing: WIPE }).onfinish = done;
      from.animate([{ transform: 'none' }, { transform: `translateX(${-8 * dir}%)` }], { duration: 1200, easing: WIPE });
      $$('img, video', to).forEach((el) => el.getAnimations().forEach((a) => a.cancel()));
      $$('img, video', to).forEach((el) => el.animate([{ transform: 'scale(1.14)' }, { transform: 'scale(1.02)' }], { duration: 1800, easing: 'cubic-bezier(.2,.7,.1,1)', fill: 'both' }));
      // Zoom muy lento mientras está delante (solo fotos; las películas ya se mueven)
      if (!$('video', to)) media.animate([{ scale: 1 }, { scale: 1.06 }], { duration: (Number(to.dataset.dur) || 7000) + 1500, easing: 'linear', fill: 'both' });
    }
    i = n;
    playVideo(to);
    startProgress();
  }

  tabs.forEach((t, k) => {
    t.tabIndex = k === 0 ? 0 : -1;
    t.addEventListener('click', () => go(k));
  });
  $('[role="tablist"]', hero).addEventListener('keydown', (e) => {
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
  const stage = $('.hero__stage', hero);
  stage.addEventListener('pointerdown', (e) => { if (e.pointerType !== 'mouse') x0 = e.clientX; });
  stage.addEventListener('pointerup', (e) => {
    if (x0 === null) return;
    const dx = e.clientX - x0; x0 = null;
    if (Math.abs(dx) > 50) go((i + (dx < 0 ? 1 : -1) + slides.length) % slides.length, dx < 0 ? 1 : -1);
  });
  stage.style.touchAction = 'pan-y';

  new IntersectionObserver(([en]) => { visible = en.isIntersecting; sync(); }, { threshold: .25 }).observe(hero);
  document.addEventListener('visibilitychange', sync);

  playVideo(slides[0]);
  if (!reduceMotion) $('img', slides[0]).animate([{ scale: 1 }, { scale: 1.06 }], { duration: Number(slides[0].dataset.dur) + 1500, easing: 'linear', fill: 'both' });
  startProgress();
}
