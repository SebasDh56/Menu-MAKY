/**
 * Maky Restaurant - Main JavaScript
 * Handles dynamic image validation, card-to-list conversion,
 * scroll animations, smooth navigation, and nav scroll indicator.
 */

// ─── Utilidad: altura de la barra sticky ────────────────────────────────────
function getNavHeight() {
  const nav = document.querySelector('.nav-sticky');
  return nav ? nav.getBoundingClientRect().height : 0;
}

// ─── Get or create list container for a section ─────────────────────────────
function getOrCreateListContainer(section) {
  let listContainer = section.querySelector('.lista-platos-dinamica');

  if (!listContainer) {
    const gridContainer = section.querySelector('.grid-platos');
    listContainer = document.createElement('div');
    listContainer.className = 'lista-platos lista-platos-dinamica';
    listContainer.style.marginTop = '32px';

    if (gridContainer) {
      gridContainer.parentNode.insertBefore(listContainer, gridContainer.nextSibling);
    } else {
      section.querySelector('.contenedor').appendChild(listContainer);
    }
  }

  return listContainer;
}

// ─── Convert card to list format when image fails ───────────────────────────
function convertCardToList(cardElement) {
  const cardImagen = cardElement.querySelector('.card-imagen');
  const cardCuerpo = cardElement.querySelector('.card-cuerpo');

  if (!cardImagen || !cardCuerpo) return;

  const nombre      = cardCuerpo.querySelector('.plato-nombre')?.textContent || '';
  const descripcion = cardCuerpo.querySelector('.plato-descripcion')?.textContent || '';

  let precio = '';
  const precioBadge  = cardImagen.querySelector('.precio-badge');
  const precioInline = cardCuerpo.querySelector('.precio-inline');
  const precioGrande = cardCuerpo.querySelector('.precio-grande');

  if (precioBadge)  precio = precioBadge.textContent;
  else if (precioInline) precio = precioInline.textContent;
  else if (precioGrande) precio = precioGrande.textContent;

  const badgeEspecial = cardImagen.querySelector('.badge-especial');
  const platoNota     = cardCuerpo.querySelector('.plato-nota');

  const listItem = document.createElement('div');
  listItem.className = 'item-lista';
  listItem.setAttribute('aria-label', cardElement.getAttribute('aria-label') || nombre);

  listItem.innerHTML = `
    <div class="item-lista-info">
      <h3 class="item-lista-nombre">${nombre}${badgeEspecial ? ' ' + badgeEspecial.textContent : ''}</h3>
      <p class="item-lista-desc">${descripcion}</p>
      ${platoNota ? `<span class="plato-nota" style="display:inline-flex; align-items:center; gap:6px; margin-top:8px; font-size:0.78rem; font-style:italic; color:var(--tierra);">${platoNota.innerHTML}</span>` : ''}
    </div>
    <span class="item-lista-precio">${precio}</span>
  `;
  listItem.classList.add('visible');

  const section = cardElement.closest('section');
  const listContainer = getOrCreateListContainer(section);

  cardElement.remove();
  listContainer.appendChild(listItem);

  const gridContainer = section.querySelector('.grid-platos, .dos-col');
  if (gridContainer && gridContainer.children.length === 0) {
    gridContainer.style.display = 'none';
  }
}

// ─── Check if image exists ───────────────────────────────────────────────────
function checkImageExists(imgElement, cardElement) {
  const img = new Image();
  img.src = imgElement.src;

  img.onload  = () => cardElement.classList.add('imagen-existe');
  img.onerror = () => convertCardToList(cardElement);
}

// ─── Dynamic image validation ────────────────────────────────────────────────
function initDynamicImageValidation() {
  const allCards = document.querySelectorAll('.card-plato, .card-horizontal, .guaguas-card');

  allCards.forEach(card => {
    const img = card.querySelector('.card-imagen img');
    if (img && img.src) checkImageExists(img, card);
  });
}

// ─── Static image error handling ────────────────────────────────────────────
function initStaticImageErrorHandling() {
  const logoImg = document.querySelector('.logo-img');
  if (logoImg) {
    logoImg.addEventListener('error', function () {
      this.style.display = 'none';
      const fallback = document.getElementById('logo-texto-fallback');
      if (fallback) fallback.style.display = 'block';
    });
  }

  const beverageImg = document.querySelector('.bebidas-imagen-deco img');
  if (beverageImg) {
    beverageImg.addEventListener('error', function () {
      this.style.display = 'none';
    });
  }
}

// ─── Scroll animations (IntersectionObserver) ───────────────────────────────
function initScrollAnimations() {
  const observables = document.querySelectorAll(
    '.card-plato, .card-horizontal, .bebida-item, .item-lista, .guaguas-card'
  );

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const siblings = Array.from(entry.target.parentElement.children);
        const idx = siblings.indexOf(entry.target);
        entry.target.style.transitionDelay = `${idx * 80}ms`;
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  observables.forEach(el => observer.observe(el));
}

// ─── ✨ SMOOTH SCROLL con ajuste de offset dinámico ─────────────────────────
// Intercepta todos los clicks en .nav-item y hace un scroll suave
// desplazándose el alto exacto de la barra sticky.
function initSmoothScrollWithOffset() {
  const navLinks = document.querySelectorAll('.nav-item[href^="#"]');

  navLinks.forEach(link => {
    link.addEventListener('click', function (e) {
      e.preventDefault();

      const targetId = this.getAttribute('href').slice(1);
      const targetEl = document.getElementById(targetId);
      if (!targetEl) return;

      const navHeight = getNavHeight();
      const elementTop = targetEl.getBoundingClientRect().top + window.pageYOffset;
      const offsetPosition = elementTop - navHeight - 8; // 8px de margen extra

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });

      // También desplaza la propia nav hacia el botón activo en móvil
      scrollNavToActiveItem(this);
    });
  });
}

// ─── ✨ Desplaza la barra nav para centrar el ítem activo ────────────────────
function scrollNavToActiveItem(activeLink) {
  const wrapper = document.getElementById('navScrollWrapper');
  if (!wrapper) return;

  const linkLeft  = activeLink.offsetLeft;
  const linkWidth = activeLink.offsetWidth;
  const wrapperWidth = wrapper.offsetWidth;

  const scrollTarget = linkLeft - wrapperWidth / 2 + linkWidth / 2;
  wrapper.scrollTo({ left: scrollTarget, behavior: 'smooth' });
}

// ─── Navigation active state on scroll ──────────────────────────────────────
function initNavActiveState() {
  const secciones = document.querySelectorAll('section[id]');
  const navItems  = document.querySelectorAll('.nav-item');

  const navObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navItems.forEach(item => item.classList.remove('activo'));
        const active = document.querySelector(`.nav-item[href="#${entry.target.id}"]`);
        if (active) {
          active.classList.add('activo');
          scrollNavToActiveItem(active);
        }
      }
    });
  }, { threshold: 0.35 });

  secciones.forEach(s => navObserver.observe(s));
}

// ─── ✨ Indicador de scroll en la barra nav (quita el fade al llegar al fin) ─
function initNavScrollIndicator() {
  const wrapper = document.getElementById('navScrollWrapper');
  if (!wrapper) return;

  function updateFade() {
    const { scrollLeft, scrollWidth, clientWidth } = wrapper;
    const atEnd = scrollLeft + clientWidth >= scrollWidth - 4;
    wrapper.classList.toggle('al-final', atEnd);
  }

  wrapper.addEventListener('scroll', updateFade, { passive: true });
  // Comprobación inicial
  updateFade();
}

// ─── Init ────────────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  initDynamicImageValidation();
  initStaticImageErrorHandling();
  initScrollAnimations();
  initSmoothScrollWithOffset();   // ✨ nuevo
  initNavActiveState();
  initNavScrollIndicator();       // ✨ nuevo
});