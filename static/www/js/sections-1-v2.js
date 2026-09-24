document.addEventListener('DOMContentLoaded', () => {
  const probability = 0.5;
  let value = Math.random();
  console.log('probability', probability)
  console.log('value', value)

  if (value > probability) {
    return;
  }

  const firstSection = document.querySelector('main.content');
  console.log('firstsection-1(as)')
  console.log('firstsection-2', firstSection)

  if (firstSection && !document.querySelector('div.new')) {
    console.log('firstsection-3')

    const ad = document.createElement("ins");
    ad.className = "adsbygoogle";
    ad.style.display = "block";
    ad.setAttribute("data-ad-client", "ca-pub-3775900744037301");
    ad.setAttribute("data-ad-slot", "7314651297");
    ad.setAttribute("data-ad-format", "auto");
    ad.setAttribute("data-full-width-responsive", "true");

    const newDiv = document.createElement('div');
    newDiv.className = 'new';
    newDiv.appendChild(ad)

    // firstSection.parentNode.insertBefore(newDiv, firstSection);
    firstSection.prepend(newDiv);

    (adsbygoogle = window.adsbygoogle || []).push({});
    console.log('firstsection-4')
  }
});