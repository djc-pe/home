document.addEventListener('DOMContentLoaded', () => {
  const sections = document.querySelectorAll('div.section');

  let charCount = 0;
  const charSpace = 1000;

  sections.forEach((section) => {
    const text = section.textContent || '';
    charCount += text.trim().length;

    console.log('chars acumulados:', charCount);

    if (charCount >= charSpace) {
      const ad = document.createElement('ins');
      ad.className = 'adsbygoogle';
      ad.style.display = 'block';
      ad.setAttribute("data-ad-client", "ca-pub-3775900744037301");
      ad.setAttribute("data-ad-slot", "8296560475");
      ad.setAttribute("data-ad-format", "auto");
      ad.setAttribute("data-full-width-responsive", "true");
      
      const newDiv = document.createElement('div');
      newDiv.className = 'new';
      newDiv.appendChild(ad);

      section.insertAdjacentElement('afterend', newDiv);

      try {
        (adsbygoogle = window.adsbygoogle || []).push({});
      } catch (e) {
        console.error('Error cargando anuncio:', e);
      }

      // Reiniciar contador
      charCount = 0;
    }
  });
});