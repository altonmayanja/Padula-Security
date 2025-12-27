document.addEventListener('DOMContentLoaded', () => {
  const productsContainer = document.querySelector('.point-wrapper');
  const dotsContainer = document.querySelector('.dots-container');
  const productCards = document.querySelectorAll('.point-wrapper .card');

  if (!productsContainer || !dotsContainer || !productCards.length) {
    return;
  }

  // Create dots
  productCards.forEach((_, i) => {
    const dot = document.createElement('button');
    dot.classList.add('dot');
    if (i === 0) {
      dot.classList.add('active');
    }
    dot.setAttribute('aria-label', `Go to slide ${i + 1}`);
    dotsContainer.appendChild(dot);
  });

  const dots = dotsContainer.querySelectorAll('.dot');

  // Function to update dots based on scroll position
  const updateDots = () => {
    const scrollLeft = productsContainer.scrollLeft;
    const cardWidth = productCards[0].offsetWidth;
    const activeIndex = Math.round(scrollLeft / cardWidth);

    dots.forEach((dot, i) => {
      dot.classList.toggle('active', i === activeIndex);
    });
  };

  // Function to scroll to a specific card
  const scrollToCard = (index) => {
    const cardWidth = productCards[0].offsetWidth;
    productsContainer.scrollTo({
      left: cardWidth * index,
      behavior: 'smooth'
    });
  };

  // Add click handlers to dots
  dots.forEach((dot, i) => {
    dot.addEventListener('click', () => {
      scrollToCard(i);
    });
  });

  // Use an observer to only run this on mobile
  const mediaQuery = window.matchMedia('(max-width: 768px)');

  const handleDeviceChange = (e) => {
    if (e.matches) {
      // On mobile
      dotsContainer.style.display = 'flex';
      productsContainer.addEventListener('scroll', updateDots, { passive: true });
      updateDots(); // Initial check
    } else {
      // On desktop
      dotsContainer.style.display = 'none';
      productsContainer.removeEventListener('scroll', updateDots);
    }
  };

  mediaQuery.addEventListener('change', handleDeviceChange);
  handleDeviceChange(mediaQuery); // Initial check
});


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
