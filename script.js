/* ── Navbar scroll effect ─────────────────────────────────────── */
const nav = document.getElementById('nav');

function updateNav() {
  nav.classList.toggle('scrolled', window.scrollY > 20);
}
window.addEventListener('scroll', updateNav, { passive: true });
updateNav();

/* ── Active nav link on scroll ───────────────────────────────── */
const sections = document.querySelectorAll('section[id]');
const navLinks  = document.querySelectorAll('.nav-link');

const sectionObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach(link => {
          link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
        });
      }
    });
  },
  { rootMargin: '-40% 0px -55% 0px' }
);
sections.forEach(s => sectionObserver.observe(s));

/* ── Mobile hamburger menu ────────────────────────────────────── */
const hamburger = document.getElementById('hamburger');
const navMenu   = document.getElementById('navLinks');

hamburger.addEventListener('click', () => {
  const isOpen = hamburger.classList.toggle('open');
  navMenu.classList.toggle('open', isOpen);
  hamburger.setAttribute('aria-expanded', String(isOpen));
  document.body.style.overflow = isOpen ? 'hidden' : '';
});

navMenu.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('open');
    navMenu.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  });
});

/* ── Scroll-reveal ────────────────────────────────────────────── */
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { rootMargin: '0px 0px -60px 0px', threshold: 0.05 }
);

document.querySelectorAll('.reveal').forEach((el, i) => {
  el.style.transitionDelay = `${Math.min(i * 0.04, 0.3)}s`;
  revealObserver.observe(el);
});

/* ── Typing animation (hero tagline) ─────────────────────────── */
const typingEl = document.getElementById('typingText');
const phrases  = [
  'games, AI, and real-world impact',
  'production ML pipelines on AWS',
  'on-device AI for mobile',
  'conversational AI with real guardrails',
];
let phraseIdx = 0;
let charIdx   = 0;
let deleting  = false;
let paused    = false;

function type() {
  if (!typingEl || paused) return;

  const current = phrases[phraseIdx];

  if (!deleting) {
    typingEl.textContent = current.slice(0, charIdx + 1);
    charIdx++;
    if (charIdx === current.length) {
      paused = true;
      setTimeout(() => { deleting = true; paused = false; type(); }, 2800);
      return;
    }
  } else {
    typingEl.textContent = current.slice(0, charIdx - 1);
    charIdx--;
    if (charIdx === 0) {
      deleting  = false;
      phraseIdx = (phraseIdx + 1) % phrases.length;
    }
  }

  setTimeout(type, deleting ? 40 : 62);
}

setTimeout(type, 1600);

/* ── Video Modal ──────────────────────────────────────────────── */
const modal      = document.getElementById('videoModal');
const modalVideo = document.getElementById('modalVideo');
const modalSrc   = document.getElementById('modalVideoSrc');
const modalTitle = document.getElementById('modalTitle');
const modalDesc  = document.getElementById('modalDesc');
const modalClose = document.getElementById('modalClose');
const modalOverlay = document.getElementById('modalOverlay');

function openModal(src, title, desc) {
  modalSrc.setAttribute('src', src);
  modalTitle.textContent = title;
  modalDesc.textContent  = desc;
  modalVideo.load();

  modal.setAttribute('aria-hidden', 'false');
  modal.classList.add('active');
  document.body.style.overflow = 'hidden';
  modalClose.focus();
}

function closeModal() {
  modalVideo.pause();
  modal.setAttribute('aria-hidden', 'true');
  modal.classList.remove('active');
  document.body.style.overflow = '';
  setTimeout(() => {
    modalSrc.setAttribute('src', '');
    modalVideo.load();
  }, 300);
}

modalClose.addEventListener('click', closeModal);
modalOverlay.addEventListener('click', closeModal);

document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && modal.classList.contains('active')) closeModal();
});

/* expose to inline onclick attributes in HTML */
window.openModal = openModal;
