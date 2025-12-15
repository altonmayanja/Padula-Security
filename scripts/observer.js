document.addEventListener('DOMContentLoaded', () => {
    const sections = document.querySelectorAll('.observe-section');
    if (!sections.length) return;

    let sectionObserver;
    const createObserver = (threshold) => {
        if (sectionObserver) sectionObserver.disconnect();

        sectionObserver = new IntersectionObserver((entries, obs) => {
            entries.forEach(entry => {
                if (!entry.isIntersecting) return;
                const section = entry.target;

                section.classList.add('in-view');

                const groups = section.querySelectorAll('.observe-group');
                groups.forEach(group => {
                    const cards = Array.from(group.querySelectorAll('.card'));
                    cards.forEach((card, i) => {
                        const cardDelay = (window.innerWidth < 768) ? i * 80 : i * 120;
                        setTimeout(() => {
                            card.classList.add('card--visible');

                            const revealItems = card.querySelectorAll('.card__image, .card__badge, .card__title, .card__description, .card__button, p');
                            revealItems.forEach((el, j) => {
                                setTimeout(() => el.classList.add('card__item--visible'), j * 50);
                            });

                            // re-enable pointer-events after animation
                            setTimeout(() => card.style.removeProperty('pointer-events'), 600);
                        }, cardDelay);
                    });
                });

                obs.unobserve(section);
            });
        }, { root: null, rootMargin: '0px', threshold });
    };

    // init observer
    const initialThreshold = (window.innerWidth < 768) ? 0.15 : 0.10;
    createObserver(initialThreshold);
    sections.forEach(s => sectionObserver.observe(s));

    // Recreate observer on resize (debounced)
    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            const newThreshold = (window.innerWidth < 768) ? 0.15 : 0.10;
            createObserver(newThreshold);
            sections.forEach(s => sectionObserver.observe(s));
            // close mobile nav if switching to desktop
            if (window.innerWidth >= 600) {
                const innerLinks = document.querySelector('.inner-links');
                if (innerLinks && innerLinks.classList.contains('nav-open')) {
                    innerLinks.classList.remove('nav-open');
                    const toggle = document.querySelector('.nav-toggle');
                    if (toggle) toggle.setAttribute('aria-expanded', 'false');
                }
            }
        }, 150);
    });

    /* Mobile hamburger toggle behavior (defensive) */
    const navEl = document.querySelector('nav.links') || document.querySelector('nav');
    const navToggle = document.querySelector('.nav-toggle');
    const innerLinks = navEl?.querySelector('.inner-links') || document.querySelector('.inner-links');

    if (!navToggle) console.warn('nav-toggle not found (use .nav-toggle selector)');
    if (!innerLinks) console.warn('inner-links not found (use nav .inner-links)');
    if (!navEl) console.warn('nav element not found');

    if (navToggle && innerLinks && navEl) {
        // avoid attaching multiple listeners
        if (!navToggle.dataset.bound) {
            navToggle.dataset.bound = 'true';
            navToggle.style.zIndex = '9999';

            const setOpen = (opened) => {
                navEl.classList.toggle('nav-open', opened);
                innerLinks.classList.toggle('nav-open', opened);
                navToggle.setAttribute('aria-expanded', opened ? 'true' : 'false');
            };

            navToggle.addEventListener('click', (e) => {
                // read current aria and flip explicitly
                const currentlyOpen = navToggle.getAttribute('aria-expanded') === 'true';
                setOpen(!currentlyOpen);
                console.log('nav toggle clicked — opened:', !currentlyOpen);
            }, { passive: true });

            innerLinks.addEventListener('click', (e) => {
                const anchor = e.target.closest('a');
                if (anchor && window.innerWidth < 600) {
                    setOpen(false);
                }
            });
        } else {
            console.log('nav-toggle already bound; skipping duplicate listener');
        }
    }
});
