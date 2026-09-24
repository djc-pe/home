const header = document.querySelector('.header');
let lastScroll = window.pageYOffset || document.documentElement.scrollTop;

// Inicializamos el header visible al cargar
header.style.transform = 'translateY(0)';

window.addEventListener('scroll', () => {
  const currentScroll = window.pageYOffset || document.documentElement.scrollTop;

  if (currentScroll > lastScroll && currentScroll > 50) {
    // Scroll hacia abajo -> ocultar header
    header.style.transform = 'translateY(-100%)';
  } else {
    // Scroll hacia arriba -> mostrar header
    header.style.transform = 'translateY(0)';
  }

  lastScroll = currentScroll <= 0 ? 0 : currentScroll;
});