/* Escaparate de la portada: una fragancia cada vez, que cambia sola cada SITE.escaparateSegundos.
   Se para al pasar el cursor, al llegar con el teclado, con el botón de pausa o con «reducir movimiento».
   La barra de cobre de la pestaña activa marca el tiempo (animación CSS); al terminar, pasa a la siguiente.
   Sin JavaScript se ve la primera fragancia entera. */
import { $, $$, reduceMotion } from './utils.js';

export function initEscaparate() {
  const root = $('[data-escaparate]');
  if (!root) return;
  const slides = $$('.slide', root), tabs = $$('[data-go]', root), pausa = $('[data-pausa]', root);
  if (slides.length < 2) return;
  let current = 0, userPaused = reduceMotion, hover = false, focus = false;
  root.style.setProperty('--dur', `${Number(root.dataset.seconds) || 7}s`);

  const sync = () => {
    const playing = !userPaused;
    root.classList.toggle('is-playing', playing);
    root.classList.toggle('is-paused', playing && (hover || focus));
    pausa.setAttribute('aria-pressed', String(userPaused));
    $('.visually-hidden', pausa).textContent = userPaused ? 'Reanudar el escaparate' : 'Pausar el escaparate';
  };

  const show = (i) => {
    current = (i + slides.length) % slides.length;
    slides.forEach((s, j) => { s.classList.toggle('is-active', j === current); s.inert = j !== current; });
    tabs.forEach((t, j) => { if (j === current) t.setAttribute('aria-current', 'true'); else t.removeAttribute('aria-current'); });
    root.dataset.familia = slides[current].dataset.familia;
    // Reinicia la barra de tiempo de la pestaña nueva
    const bar = $('.escaparate__progreso', tabs[current]);
    bar.style.animation = 'none'; bar.getBoundingClientRect(); bar.style.animation = '';
    const tab = tabs[current], list = tab.closest('ol');
    if (list.scrollWidth > list.clientWidth) list.scrollTo({ left: tab.offsetLeft - list.clientWidth / 2 + tab.clientWidth / 2, behavior: reduceMotion ? 'auto' : 'smooth' });
  };

  slides.forEach((s, j) => { s.inert = j !== 0; });
  tabs.forEach((t) => t.addEventListener('click', () => show(Number(t.dataset.go))));
  root.addEventListener('animationend', (e) => {
    if (e.animationName === 'escaparate-progreso' && e.target.closest('[aria-current="true"]')) show(current + 1);
  });
  pausa.hidden = false;
  pausa.addEventListener('click', () => { userPaused = !userPaused; sync(); });

  const stage = $('.escaparate__stage', root);
  stage.addEventListener('pointerenter', (e) => { if (e.pointerType === 'mouse') { hover = true; sync(); } });
  stage.addEventListener('pointerleave', () => { hover = false; sync(); });
  root.addEventListener('focusin', (e) => { if (!e.target.matches('[data-go], [data-pausa]')) { focus = true; sync(); } });
  root.addEventListener('focusout', () => { focus = false; sync(); });

  // Deslizar con el dedo sobre la vitrina o el texto
  let x0 = null, y0 = 0;
  stage.addEventListener('touchstart', (e) => { x0 = e.touches[0].clientX; y0 = e.touches[0].clientY; }, { passive: true });
  stage.addEventListener('touchend', (e) => {
    if (x0 === null) return;
    const dx = e.changedTouches[0].clientX - x0, dy = e.changedTouches[0].clientY - y0;
    x0 = null;
    if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) * 1.5) show(current + (dx < 0 ? 1 : -1));
  }, { passive: true });

  // Fuera de pantalla no corre: al volver sigue donde estaba
  new IntersectionObserver(([e]) => root.classList.toggle('is-offscreen', !e.isIntersecting)).observe(root);
  sync();
}

/* Avisos de la franja superior: uno cada 5 s */
export function initAvisos() {
  const items = $$('[data-avisos] li');
  if (items.length < 2 || reduceMotion) return;
  let i = 0;
  setInterval(() => {
    if (document.hidden) return;
    const prev = items[i]; i = (i + 1) % items.length;
    prev.className = 'is-prev';
    items[i].className = 'is-on';
    setTimeout(() => { prev.className = 'is-next'; }, 700);
  }, 5000);
}

/* Pestañas de la selección (patrón ARIA de pestañas, con flechas) y flechas de la fila lateral */
export function initPestanas() {
  $$('[data-pestanas]').forEach((box) => {
    const tabs = $$('[role="tab"]', box), panels = $$('[role="tabpanel"]', box);
    const prev = $('[data-rail="-1"]', box), next = $('[data-rail="1"]', box);
    const rail = () => $('[role="tabpanel"]:not([hidden]) .products--rail', box);
    const update = () => {
      const r = rail(); if (!r || !prev) return;
      prev.disabled = r.scrollLeft < 4;
      next.disabled = r.scrollLeft + r.clientWidth >= r.scrollWidth - 4;
    };
    const select = (t, moveFocus) => {
      tabs.forEach((x) => { const on = x === t; x.setAttribute('aria-selected', String(on)); x.tabIndex = on ? 0 : -1; });
      panels.forEach((p) => { p.hidden = p.id !== t.getAttribute('aria-controls'); });
      const r = rail(); if (r) r.scrollLeft = 0;
      if (moveFocus) t.focus();
      update();
    };
    tabs.forEach((t, i) => {
      t.addEventListener('click', () => select(t));
      t.addEventListener('keydown', (e) => {
        const k = { ArrowRight: 1, ArrowLeft: -1 }[e.key];
        if (k) { e.preventDefault(); select(tabs[(i + k + tabs.length) % tabs.length], true); }
        if (e.key === 'Home') { e.preventDefault(); select(tabs[0], true); }
        if (e.key === 'End') { e.preventDefault(); select(tabs[tabs.length - 1], true); }
      });
    });
    [prev, next].forEach((b) => b?.addEventListener('click', () => {
      const r = rail(); if (!r) return;
      r.scrollBy({ left: Number(b.dataset.rail) * r.clientWidth * .8, behavior: reduceMotion ? 'auto' : 'smooth' });
    }));
    panels.forEach((p) => $('.products--rail', p)?.addEventListener('scroll', update, { passive: true }));
    update();
  });
}
