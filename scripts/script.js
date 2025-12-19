// Observe containers with class .observe-group. When container is >=10% visible,
// slide each .card in from the left with a stagger and fade the paragraph inside.

document.addEventListener('DOMContentLoaded', function () {
  const groups = document.querySelectorAll('.observe-group');
  if (!groups.length) return;

  const options = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1 
  };

  const groupObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;

      const cards = Array.from(entry.target.querySelectorAll('.card'));
      cards.forEach((card, i) => {
        const delay = i * 120; 
        setTimeout(() => {
          card.classList.add('card--visible');

          const para = card.querySelector('.card__description') || card.querySelector('p');
          if (para) {
            para.classList.add('card__description--visible');
            if (para.tagName.toLowerCase() === 'p') para.classList.add('card-para-visible');
          }
        }, delay);
      });

      observer.unobserve(entry.target);
    });
  }, options);

  groups.forEach(g => groupObserver.observe(g));
});

    // set dynamic copyright year footer
    (function(){
      const el = document.getElementById('copy-year');
      if(el) el.textContent = new Date().getFullYear();
    })();
