document.addEventListener('DOMContentLoaded', () => {
  const overlay = document.getElementById('drawerOverlay');

  // Funciones genéricas
  function openDrawer(id) {
    overlay.classList.add('active');
    document.querySelectorAll('.drawer').forEach(d => {
      if (d.id === id) d.style.transform = 'translateX(0)';
      else d.style.transform = d.dataset.side === 'left' ? 'translateX(-100%)' : 'translateX(100%)';
    });
  }

  function closeDrawers() {
    overlay.classList.remove('active');
    document.querySelectorAll('.drawer').forEach(d => {
      d.style.transform = d.dataset.side === 'left' ? 'translateX(-100%)' : 'translateX(100%)';
    });
  }

  // Iconos navbar
  document.querySelector('.navbar__a a:first-child')?.addEventListener('click', e => {
  // document.querySelector('.navbar__a')?.addEventListener('click', e => {
    e.preventDefault();
    openDrawer('mainMenu');
  });

  document.querySelector('.navbar__c a:last-child')?.addEventListener('click', e => {
    e.preventDefault();
    openDrawer('userMenu');
  });

  // Click fuera del drawer
  overlay.addEventListener('click', e => {
    if (e.target === overlay) closeDrawers();
  });

  // Botones cerrar
  document.querySelectorAll('.drawer-close').forEach(btn => {
    btn.addEventListener('click', closeDrawers);
  });

  window.openDrawer = openDrawer;
  window.closeDrawers = closeDrawers;
});