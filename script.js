(() => {
  const navLinks = [...document.querySelectorAll('.main-nav a:not(.talk-btn)')];

  navLinks.forEach((link) => {
    link.addEventListener('click', () => {
      navLinks.forEach((item) => item.classList.remove('is-active'));
      link.classList.add('is-active');
    });
  });

  // Prevent accidental image dragging in the fixed desktop composition.
  document.querySelectorAll('img').forEach((img) => {
    img.addEventListener('dragstart', (event) => event.preventDefault());
  });

  // ---------- Mobile menu (hamburger drawer) ----------
  const navToggle = document.getElementById('navToggle');
  const primaryNav = document.getElementById('primary-nav');

  if (navToggle && primaryNav) {
    const closeMenu = () => {
      document.body.classList.remove('nav-open');
      navToggle.setAttribute('aria-expanded', 'false');
    };

    const openMenu = () => {
      document.body.classList.add('nav-open');
      navToggle.setAttribute('aria-expanded', 'true');
    };

    navToggle.addEventListener('click', () => {
      const isOpen = document.body.classList.contains('nav-open');
      if (isOpen) {
        closeMenu();
      } else {
        openMenu();
      }
    });

    // Tapping any link inside the drawer (section links or the CTA) closes it.
    primaryNav.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', closeMenu);
    });

    // Esc closes the drawer; resizing back up to desktop closes it too so
    // it can't get stuck open if the viewport crosses the breakpoint.
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') closeMenu();
    });

    window.addEventListener('resize', () => {
      if (window.innerWidth > 768) closeMenu();
    });
  }
})();

// ---------- Scroll reveal ----------
// Every element carrying data-reveal starts hidden (via the .js-reveal
// flag below) and fades/rises/draws into place the first time it enters
// the viewport. Siblings under the same parent — a row of service cards,
// a cluster of hero copy — auto-stagger off their DOM order, so no
// element needs a hand-picked delay.
(() => {
  const revealEls = [...document.querySelectorAll('[data-reveal]')];
  if (!revealEls.length) return;

  // Only hide content once we know JS is actually running — if this
  // script fails to load, nothing stays stuck invisible.
  document.documentElement.classList.add('js-reveal');

  const STEP_MS = 90;
  const MAX_STEPS = 6;
  const siblingGroups = new Map();

  revealEls.forEach((el) => {
    const parent = el.parentElement;
    if (!siblingGroups.has(parent)) siblingGroups.set(parent, []);
    siblingGroups.get(parent).push(el);
  });

  siblingGroups.forEach((siblings) => {
    siblings.forEach((el, index) => {
      const delay = Math.min(index, MAX_STEPS) * STEP_MS;
      el.style.setProperty('--reveal-delay', `${delay}ms`);
    });
  });

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.15, rootMargin: '0px 0px -8% 0px' }
  );

  revealEls.forEach((el) => observer.observe(el));
})();
