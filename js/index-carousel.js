// index-carousel.js
// Carrossel de promoções do index.html

document.addEventListener('DOMContentLoaded', function() {
  const track = document.querySelector('.carousel-track');
  const promos = Array.from(document.querySelectorAll('.promo'));
  const leftBtn = document.querySelector('.carousel-arrow.left');
  const rightBtn = document.querySelector('.carousel-arrow.right');
  const dots = Array.from(document.querySelectorAll('.carousel-dots .dot'));
  let current = 0;

  function updateCarousel(idx) {
    promos.forEach((promo, i) => {
      promo.style.display = i === idx ? 'flex' : 'none';
    });
    dots.forEach((dot, i) => {
      dot.classList.toggle('active', i === idx);
    });
    current = idx;
  }

  leftBtn.onclick = () => {
    let idx = (current - 1 + promos.length) % promos.length;
    updateCarousel(idx);
  };
  rightBtn.onclick = () => {
    let idx = (current + 1) % promos.length;
    updateCarousel(idx);
  };
  dots.forEach((dot, i) => {
    dot.onclick = () => updateCarousel(i);
  });
  updateCarousel(0);

  // Indicação ao navegar para o cardápio
  document.querySelectorAll('.promo-link').forEach(link => {
    link.addEventListener('click', function(e) {
      const destino = this.getAttribute('data-lanche-destino');
      if (destino) {
        sessionStorage.setItem('lancheDestacado', destino);
      }
    });
  });
});
