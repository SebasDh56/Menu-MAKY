/**
 * Maky Restaurant - Main JavaScript
 * Handles dynamic image validation, card-to-list conversion, and scroll animations
 */

// Get or create list container for a section
function getOrCreateListContainer(section) {
  let listContainer = section.querySelector('.lista-platos-dinamica');
  
  if (!listContainer) {
    // Create list container after the grid
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

// Convert card to list format when image fails to load
function convertCardToList(cardElement) {
  const cardImagen = cardElement.querySelector('.card-imagen');
  const cardCuerpo = cardElement.querySelector('.card-cuerpo');
  
  if (!cardImagen || !cardCuerpo) return;
  
  // Extract data from card
  const nombre = cardCuerpo.querySelector('.plato-nombre')?.textContent || '';
  const descripcion = cardCuerpo.querySelector('.plato-descripcion')?.textContent || '';
  
  // Extract price (could be in different classes)
  let precio = '';
  const precioBadge = cardImagen.querySelector('.precio-badge');
  const precioInline = cardCuerpo.querySelector('.precio-inline');
  const precioGrande = cardCuerpo.querySelector('.precio-grande');
  
  if (precioBadge) precio = precioBadge.textContent;
  else if (precioInline) precio = precioInline.textContent;
  else if (precioGrande) precio = precioGrande.textContent;
  
  // Extract special badges
  const badgeEspecial = cardImagen.querySelector('.badge-especial');
  const platoNota = cardCuerpo.querySelector('.plato-nota');
  
  // Build list item HTML
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
  listItem.classList.add('visible')
  // Move to list container instead of replacing
  const section = cardElement.closest('section');
  const listContainer = getOrCreateListContainer(section);
  
  // Remove card from grid
  cardElement.remove();
  
  // Add to list container
  listContainer.appendChild(listItem);
  
  // Hide grid container if empty
  const gridContainer = section.querySelector('.grid-platos,.dos-col');
  if (gridContainer && gridContainer.children.length === 0) {
    gridContainer.style.display = 'none';
  }
}

// Check if image exists and handle accordingly
function checkImageExists(imgElement, cardElement) {
  const img = new Image();
  img.src = imgElement.src;
  
  img.onload = function() {
    // Image exists, keep as card
    cardElement.classList.add('imagen-existe');
  };
  
  img.onerror = function() {
    // Image doesn't exist, convert to list
    convertCardToList(cardElement);
  };
}

// Initialize dynamic image validation
function initDynamicImageValidation() {
  const allCards = document.querySelectorAll('.card-plato, .card-horizontal, .guaguas-card');
  
  allCards.forEach(card => {
    const img = card.querySelector('.card-imagen img');
    if (img && img.src) {
      checkImageExists(img, card);
    }
  });
}

// Handle logo image error
function handleLogoError(img, fallbackId) {
  img.style.display = 'none';
  const fallback = document.getElementById(fallbackId);
  if (fallback) {
    fallback.style.display = 'block';
  }
}

// Handle decorative beverage image error
function handleBeverageImageError(img) {
  img.style.display = 'none';
}

// Initialize static image error handling (for logo and decorative images)
function initStaticImageErrorHandling() {
  // Handle logo image
  const logoImg = document.querySelector('.logo-img');
  if (logoImg) {
    logoImg.addEventListener('error', function() {
      handleLogoError(this, 'logo-texto-fallback');
    });
  }

  // Handle decorative beverage image
  const beverageImg = document.querySelector('.bebidas-imagen-deco img');
  if (beverageImg) {
    beverageImg.addEventListener('error', function() {
      handleBeverageImageError(this);
    });
  }
}

// Intersection Observer for scroll animations
function initScrollAnimations() {
  const observables = document.querySelectorAll('.card-plato, .card-horizontal, .bebida-item, .item-lista, .guaguas-card');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        // Stagger delay based on position
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

// Navigation active state on scroll
function initNavActiveState() {
  const secciones = document.querySelectorAll('section[id]');
  const navItems = document.querySelectorAll('.nav-item');

  const navObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navItems.forEach(item => item.classList.remove('activo'));
        const active = document.querySelector(`.nav-item[href="#${entry.target.id}"]`);
        if (active) active.classList.add('activo');
      }
    });
  }, { threshold: 0.4 });

  secciones.forEach(s => navObserver.observe(s));
}

// Initialize all functionality when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  initDynamicImageValidation();
  initStaticImageErrorHandling();
  initScrollAnimations();
  initNavActiveState();
});
