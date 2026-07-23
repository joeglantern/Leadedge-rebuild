// Leadedge Consults — site behaviour: loader, scroll reveals, stat counters,
// hero word rotation, mobile menu, contact form.

/* ------------------------------------------------------------------ */
/* Loader                                                             */
/* ------------------------------------------------------------------ */
const loader = document.getElementById('le-loader');
if (loader) {
  const pxs = loader.querySelectorAll('.le-px');
  const onMove = (e) => {
    const cx = e.clientX / window.innerWidth - 0.5;
    const cy = e.clientY / window.innerHeight - 0.5;
    pxs.forEach((p) => {
      const d = parseFloat(p.dataset.depth) || 0.1;
      p.style.transform = `translate(${cx * d * 440}px, ${cy * d * 440}px)`;
    });
  };
  window.addEventListener('mousemove', onMove);

  const bar = document.getElementById('le-bar');
  const cnt = document.getElementById('le-count');
  const dur = 2100;
  const t0 = performance.now();
  const tick = (t) => {
    const p = Math.min((t - t0) / dur, 1);
    const eased = 1 - Math.pow(1 - p, 3);
    const v = Math.round(eased * 100);
    if (bar) bar.style.width = v + '%';
    if (cnt) cnt.textContent = v + '%';
    if (p < 1) requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);

  setTimeout(() => {
    window.removeEventListener('mousemove', onMove);
    loader.remove();
  }, 3400);
}

/* ------------------------------------------------------------------ */
/* Scroll reveals + animated counters                                 */
/* ------------------------------------------------------------------ */
const io = new IntersectionObserver((entries) => {
  entries.forEach((e) => {
    if (!e.isIntersecting) return;
    io.unobserve(e.target);
    if (e.target.hasAttribute('data-reveal')) {
      e.target.classList.remove('pre');
      e.target.classList.add('on');
      return;
    }
    const end = +e.target.dataset.count;
    const suffix = e.target.dataset.suffix || '';
    const t0 = performance.now();
    const dur = 1400;
    const tick = (t) => {
      const p = Math.min((t - t0) / dur, 1);
      const ease = 1 - Math.pow(1 - p, 4);
      e.target.textContent = Math.round(ease * end) + suffix;
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  });
}, { threshold: 0.12 });

document.querySelectorAll('[data-reveal], [data-count]').forEach((el) => {
  if (el.hasAttribute('data-reveal') && el.getBoundingClientRect().top > window.innerHeight * 0.85) {
    el.classList.add('pre');
  }
  io.observe(el);
});

/* ------------------------------------------------------------------ */
/* Hero rotating word (home page)                                     */
/* ------------------------------------------------------------------ */
const heroWord = document.getElementById('hero-word');
if (heroWord) {
  const words = [
    ['strategy.', '#8C3283'],
    ['research.', '#242D6E'],
    ['development.', '#04ACEC'],
  ];
  let i = 0;
  setInterval(() => {
    i = (i + 1) % words.length;
    heroWord.textContent = words[i][0];
    heroWord.style.color = words[i][1];
    heroWord.style.animation = 'none';
    void heroWord.offsetWidth; // restart the wordIn animation
    heroWord.style.animation = 'wordIn 0.55s cubic-bezier(.2,.6,.2,1) both';
  }, 2600);
}

/* ------------------------------------------------------------------ */
/* Mobile menu                                                        */
/* ------------------------------------------------------------------ */
const toggle = document.querySelector('.nav-toggle');
const menu = document.getElementById('mobile-menu');
if (toggle && menu) {
  const closeBtn = menu.querySelector('.mm-close');
  const setOpen = (open) => {
    menu.classList.toggle('open', open);
    menu.setAttribute('aria-hidden', String(!open));
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    document.body.classList.toggle('menu-open', open);
  };
  toggle.addEventListener('click', () => setOpen(!menu.classList.contains('open')));
  closeBtn.addEventListener('click', () => setOpen(false));
  menu.querySelectorAll('a').forEach((a) => a.addEventListener('click', () => setOpen(false)));
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && menu.classList.contains('open')) setOpen(false);
  });
  window.addEventListener('resize', () => {
    if (window.innerWidth > 860 && menu.classList.contains('open')) setOpen(false);
  });
}

/* ------------------------------------------------------------------ */
/* Contact form                                                       */
/* ------------------------------------------------------------------ */
// Same-origin endpoint served by formrelay (nginx proxies /api/ to it).
const FORM_ENDPOINT = '/api/submit/leadedge';

const form = document.getElementById('contact-form');
if (form) {
  const card = document.getElementById('form-card');
  const hint = document.getElementById('form-hint');
  const submitBtn = form.querySelector('.form-submit');
  const submitLabel = submitBtn.innerHTML;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = form.elements.name.value.trim();
    const email = form.elements.email.value.trim();
    const msg = form.elements.msg.value.trim();
    if (!name || !email || !msg) {
      hint.textContent = 'Please fill in your name, email, and message.';
      return;
    }
    hint.textContent = '';

    submitBtn.disabled = true;
    submitBtn.textContent = 'Sending…';
    try {
      const res = await fetch(FORM_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          email,
          org: form.elements.org.value.trim(),
          msg,
          _gotcha: form.elements._gotcha ? form.elements._gotcha.value : '',
        }),
      });
      if (!res.ok) throw new Error('HTTP ' + res.status);
      card.classList.add('sent');
    } catch {
      hint.textContent = 'Something went wrong. Please try again, or email us at info@leadedgeconsults.com.';
    } finally {
      submitBtn.disabled = false;
      submitBtn.innerHTML = submitLabel;
    }
  });

  document.getElementById('form-reset').addEventListener('click', () => {
    form.reset();
    card.classList.remove('sent');
  });
}
