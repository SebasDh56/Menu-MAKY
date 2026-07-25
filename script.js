/**
 * Maky Restaurante — script.js
 * Resuelve: smooth scroll con offset, nav activa, indicador de scroll nav,
 * validación de imágenes opcionales, skeleton loader y scroll a inicio.
 */

// ─── Utilidades ──────────────────────────────────────────────────────────────

const DEBUG_SECTION_TRACKING = false;

function getNavHeight() {
  const nav = document.querySelector('.nav-sticky');
  return nav ? nav.getBoundingClientRect().height : 0;
}

// ─── Scroll al inicio en cada carga (evita posición guardada en móvil) ───────
window.addEventListener('load', () => {
  // Solo si el hash está vacío o es #inicio
  if (!window.location.hash || window.location.hash === '#inicio') {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }
});

// ─── Smooth scroll con offset dinámico ───────────────────────────────────────
function initSmoothScrollWithOffset() {
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href').slice(1);
      if (!targetId) return;
      const targetEl = document.getElementById(targetId);
      if (!targetEl) return;
      e.preventDefault();

      const navHeight = getNavHeight();
      const top = targetEl.getBoundingClientRect().top + window.pageYOffset - navHeight - 10;

      window.scrollTo({ top, behavior: 'smooth' });
      scrollNavToItem(this);

      // Accesibilidad: mover el foco al heading de la sección
      const heading = targetEl.querySelector('h2, h1');
      if (heading) {
        heading.setAttribute('tabindex', '-1');
        heading.focus({ preventScroll: true });
      }
    });
  });
}

// ─── Centra el ítem activo dentro de la barra nav (móvil) ────────────────────
function scrollNavToItem(link) {
  const wrapper = document.getElementById('navScrollWrapper');
  if (!wrapper) return;
  const left = link.offsetLeft - wrapper.offsetWidth / 2 + link.offsetWidth / 2;
  wrapper.scrollTo({ left, behavior: 'smooth' });
}

// ─── Nav activa en scroll ─────────────────────────────────────────────────────
function initNavActiveState() {
  const secciones = document.querySelectorAll('section[id]');
  const navItems  = document.querySelectorAll('.nav-item');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navItems.forEach(i => i.classList.remove('activo'));
        const active = document.querySelector(`.nav-item[href="#${entry.target.id}"]`);
        if (active) {
          active.classList.add('activo');
          active.setAttribute('aria-current', 'true');
          scrollNavToItem(active);
        }
        navItems.forEach(i => {
          if (!i.classList.contains('activo')) i.removeAttribute('aria-current');
        });
      }
    });
  }, { threshold: 0.35 });

  secciones.forEach(s => observer.observe(s));
}

// ─── Indicador de scroll en nav (fade a la derecha) ──────────────────────────
function initNavScrollIndicator() {
  const wrapper = document.getElementById('navScrollWrapper');
  if (!wrapper) return;

  const update = () => {
    const { scrollLeft, scrollWidth, clientWidth } = wrapper;
    wrapper.classList.toggle('al-final', scrollLeft + clientWidth >= scrollWidth - 4);
  };

  wrapper.addEventListener('scroll', update, { passive: true });
  window.addEventListener('resize', update);
  update();
}

// ─── Skeleton loader: reemplaza fondo de .card-imagen con shimmer ─────────────
function initSkeletonLoader() {
  document.querySelectorAll('.card-imagen').forEach(wrapper => {
    const img = wrapper.querySelector('img');
    if (!img) return;

    wrapper.classList.add('skeleton');
    const removeShimmer = () => wrapper.classList.remove('skeleton');
    if (img.complete) { removeShimmer(); return; }
    img.addEventListener('load',  removeShimmer, { once: true });
    img.addEventListener('error', removeShimmer, { once: true });
  });
}

// ─── Get or create lista dinámica ────────────────────────────────────────────
function getOrCreateListContainer(section) {
  let list = section.querySelector('.lista-platos-dinamica');
  if (!list) {
    list = document.createElement('div');
    list.className = 'lista-platos lista-platos-dinamica';
    list.style.marginTop = '32px';
    const grid = section.querySelector('.grid-platos, .dos-col');
    if (grid) grid.parentNode.insertBefore(list, grid.nextSibling);
    else section.querySelector('.contenedor')?.appendChild(list);
  }
  return list;
}

// ─── Convierte card a ítem de lista cuando la imagen falla ───────────────────
function convertCardToList(card) {
  const cardImagen = card.querySelector('.card-imagen');
  const cardCuerpo = card.querySelector('.card-cuerpo');
  if (!cardImagen || !cardCuerpo) return;

  const nombre      = cardCuerpo.querySelector('.plato-nombre')?.textContent?.trim() || '';
  const descripcion = cardCuerpo.querySelector('.plato-descripcion')?.textContent?.trim() || '';
  const platoNota   = cardCuerpo.querySelector('.plato-nota');
  const badgeEsp    = cardImagen.querySelector('.badge-especial');

  let precio = '';
  const badge  = cardImagen.querySelector('.precio-badge');
  const inline = cardCuerpo.querySelector('.precio-inline');
  const grande = cardCuerpo.querySelector('.precio-grande');
  if (badge)  precio = badge.textContent.trim();
  else if (inline) precio = inline.textContent.trim();
  else if (grande) precio = grande.textContent.trim();

  const item = document.createElement('div');
  item.className = 'item-lista visible';
  item.setAttribute('aria-label', card.getAttribute('aria-label') || nombre);
  item.innerHTML = `
    <div class="item-lista-info">
      <h3 class="item-lista-nombre">${nombre}${badgeEsp ? ' <small style="font-size:.7em;opacity:.7;">' + badgeEsp.textContent.trim() + '</small>' : ''}</h3>
      <p class="item-lista-desc">${descripcion}</p>
      ${platoNota ? `<span class="plato-nota" style="display:inline-flex;align-items:center;gap:6px;margin-top:8px;font-size:.78rem;font-style:italic;color:var(--tierra);">${platoNota.innerHTML}</span>` : ''}
    </div>
    <span class="item-lista-precio" aria-label="Precio: ${precio}">${precio}</span>
  `;

  const section = card.closest('section');
  const listContainer = getOrCreateListContainer(section);
  card.remove();
  listContainer.appendChild(item);

  const grid = section.querySelector('.grid-platos, .dos-col');
  if (grid && grid.children.length === 0) grid.style.display = 'none';
}

// ─── Valida existencia de imagen con guard ────────────────────────────────────
function checkImageExists(imgEl, card) {
  // Guard: src vacío o data-url no necesita validación
  if (!imgEl.src || imgEl.src === window.location.href) {
    convertCardToList(card);
    return;
  }
  const probe = new Image();
  probe.onload  = () => card.classList.add('imagen-existe');
  probe.onerror = () => convertCardToList(card);
  probe.src = imgEl.src;
}

function initDynamicImageValidation() {
  document.querySelectorAll('.card-plato, .card-horizontal, .guaguas-card').forEach(card => {
    if (card.querySelector('.card-imagen-pendiente')) {
      convertCardToList(card);
      return;
    }

    const img = card.querySelector('.card-imagen img');
    if (img) checkImageExists(img, card);
  });
}

// ─── Logo e imagen decorativa ─────────────────────────────────────────────────
function initStaticImageErrorHandling() {
  const logoImg = document.querySelector('.logo-img');
  if (logoImg) {
    logoImg.addEventListener('error', function () {
      this.style.display = 'none';
      const fallback = document.getElementById('logo-texto-fallback');
      if (fallback) fallback.style.display = 'block';
    }, { once: true });
  }

  const beverageImg = document.querySelector('.bebidas-imagen-deco img');
  if (beverageImg) {
    beverageImg.addEventListener('error', function () {
      this.closest('.bebidas-imagen-deco')?.style && (this.closest('.bebidas-imagen-deco').style.display = 'none');
    }, { once: true });
  }
}

// ─── Animaciones de entrada por Intersection Observer ────────────────────────
function initScrollAnimations() {
  const items = document.querySelectorAll(
    '.card-plato, .card-horizontal, .bebida-item, .item-lista, .guaguas-card, .trust-badge'
  );

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const siblings = Array.from(entry.target.parentElement?.children || []);
      const idx = siblings.indexOf(entry.target);
      entry.target.style.transitionDelay = `${Math.min(idx * 70, 400)}ms`;
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.10, rootMargin: '0px 0px -32px 0px' });

  items.forEach(el => observer.observe(el));
}

// ─── Tracking local opcional para debugging ──────────────────────────────────
function initSectionTracking() {
  if (!DEBUG_SECTION_TRACKING) return;

  const secciones = document.querySelectorAll('section[id]');
  const visited = new Set();

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !visited.has(entry.target.id)) {
        visited.add(entry.target.id);
        console.info('[Maky Analytics] Sección vista:', entry.target.id);
      }
    });
  }, { threshold: 0.4 });

  secciones.forEach(s => observer.observe(s));
}

// ─── Init ─────────────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  initSkeletonLoader();
  initDynamicImageValidation();
  initStaticImageErrorHandling();
  initScrollAnimations();
  initSmoothScrollWithOffset();
  initNavActiveState();
  initNavScrollIndicator();
  initSectionTracking();
});
