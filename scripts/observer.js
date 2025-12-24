document.addEventListener('DOMContentLoaded', () => {
  const sections = document.querySelectorAll('.observe-section');
  if (!sections.length) return;

  const createObserver = (threshold) => {
    return new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          
          const cards = entry.target.querySelectorAll('.observe-group .card');
          if (cards.length) {
            cards.forEach((card, index) => {
              setTimeout(() => {
                card.classList.add('card--visible');
                
                const children = card.querySelectorAll('.card__image, .card__title, .card__description, .card__badge, .card__button');
                children.forEach((child, childIndex) => {
                  setTimeout(() => {
                    child.classList.add('card__item--visible');
                  }, childIndex * 50);
                });
              }, index * 80);
            });
          }
        }
      });
    }, { threshold });
  };

  const sectionObserver = createObserver(0.1);
  sections.forEach(section => sectionObserver.observe(section));
});

// Mobile drawer: overlay click closes menu, body scroll lock
(function() {
  const nav = document.querySelector('nav.links');
  const toggle = document.querySelector('.nav-toggle');
  const innerLinks = document.querySelector('nav .inner-links');
  
  if (!nav || !toggle || !innerLinks) return;

  nav.addEventListener('click', (e) => {
    if (e.target === nav && toggle.getAttribute('aria-expanded') === 'true') {
      toggle.click();
    }
  });

  const observer = new MutationObserver(() => {
    const isOpen = toggle.getAttribute('aria-expanded') === 'true';
    document.body.classList.toggle('nav-open-body', isOpen);
  });

  observer.observe(toggle, { attributes: true, attributeFilter: ['aria-expanded'] });
})();

// Add to observer.js after the drawer section code
document.addEventListener('DOMContentLoaded', () => {
  const toggle = document.querySelector('.nav-toggle');
  const innerLinks = document.querySelector('nav .inner-links');
  
  if (!toggle || !innerLinks) return;

  toggle.addEventListener('click', () => {
    const isOpen = toggle.getAttribute('aria-expanded') === 'true';
    toggle.setAttribute('aria-expanded', !isOpen);
    innerLinks.classList.toggle('nav-open');
  });

  innerLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      toggle.setAttribute('aria-expanded', 'false');
      innerLinks.classList.remove('nav-open');
    });
  });
});
