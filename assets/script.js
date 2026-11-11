(() => {
'use strict';
const root = document.documentElement;
const toggle = document.querySelector('.theme-toggle');
const update = () => {
  const dark = root.dataset.theme === 'dark';
  toggle.setAttribute('aria-pressed', String(dark));
  toggle.setAttribute('aria-label', 'Switch to ' + (dark ? 'light' : 'dark') + ' theme');
  document.querySelector('meta[name="theme-color"]').content = dark ? '#14111d' : '#8a6cf0';
};
toggle.hidden = false;
update();
toggle.addEventListener('click', () => {
  root.dataset.theme = root.dataset.theme === 'dark' ? 'light' : 'dark';
  try { localStorage.setItem('juyoung-theme', root.dataset.theme); } catch (_) {}
  update();
});
const newsButton = document.querySelector('.news-toggle');
const olderNews = [...document.querySelectorAll('#news-list > li')].slice(3);
if (newsButton && olderNews.length) {
  const setNewsExpanded = expanded => {
    olderNews.forEach(item => { item.hidden = !expanded; });
    newsButton.setAttribute('aria-expanded', String(expanded));
    newsButton.textContent = expanded ? 'Show less updates ↑' : 'Show more updates (' + olderNews.length + ' more) ↓';
  };
  setNewsExpanded(false);
  newsButton.hidden = false;
  newsButton.addEventListener('click', () => {
    setNewsExpanded(newsButton.getAttribute('aria-expanded') !== 'true');
  });
}

const links = [...document.querySelectorAll('nav a')];
if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver(entries => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      links.forEach(link => {
        if (link.hash === '#' + entry.target.id) link.setAttribute('aria-current', 'location');
        else link.removeAttribute('aria-current');
      });
    }
  }, {rootMargin:'-12% 0px -63% 0px', threshold:0});
  links.forEach(link => { const target = document.querySelector(link.hash); if (target) observer.observe(target); });
}
const dialog = document.querySelector('#citation-dialog');
if (dialog && typeof dialog.showModal === 'function') {
  const trigger = document.querySelector('[data-citation]');
  trigger.hidden = false;
  trigger.addEventListener('click', () => { document.querySelector('.copy-status').textContent = ''; dialog.showModal(); });
  document.querySelector('.dialog-close').addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', event => {
    if (event.target !== dialog) return;
    const b = dialog.getBoundingClientRect();
    if (event.clientX < b.left || event.clientX > b.right || event.clientY < b.top || event.clientY > b.bottom) dialog.close();
  });
  document.querySelector('.copy-citation').addEventListener('click', async () => {
    const status = document.querySelector('.copy-status');
    try {
      await navigator.clipboard.writeText(document.querySelector('#bibtex').textContent.trim());
      status.textContent = 'Citation copied.';
    } catch (_) {
      const range = document.createRange();
      range.selectNodeContents(document.querySelector('#bibtex'));
      const selection = window.getSelection();
      selection.removeAllRanges(); selection.addRange(range);
      status.textContent = 'Citation selected. Press Ctrl+C or ⌘C to copy.';
    }
  });
}
const oldAnchors = {'-news':'news','-publications':'publications','-project':'projects','-honors-and-awards':'honors-and-awards','-education':'education','-teaching-experience':'teaching-experience'};
function followOldAnchor() {
  let hash;
  try { hash = decodeURIComponent(location.hash.slice(1)); } catch (_) { return; }
  if (oldAnchors[hash]) document.getElementById(oldAnchors[hash])?.scrollIntoView();
}
followOldAnchor(); window.addEventListener('hashchange', followOldAnchor);

/* Image strips: frames sit side by side and slide horizontally. */
const calm = window.matchMedia('(prefers-reduced-motion: reduce)');
const makeStrip = strip => {
  const frames = [...strip.querySelectorAll('img')];
  if (frames.length < 2) return null;
  let shown = 0;
  const place = () => frames.forEach((frame, i) => {
    frame.style.transform = 'translateX(' + ((i - shown) * 100) + '%)';
  });
  place();
  return {
    frames,
    next: () => { shown = (shown + 1) % frames.length; place(); },
    reset: () => { shown = 0; place(); }
  };
};

/* Paper thumbnails holding more than one image advance on their own. */
document.querySelectorAll('.paper-slides').forEach(strip => {
  const deck = makeStrip(strip);
  if (!deck) return;
  let timer = null;
  const stop = () => { clearInterval(timer); timer = null; };
  const start = () => {
    if (timer || calm.matches) return;
    timer = setInterval(() => { if (!document.hidden) deck.next(); },
      Number(strip.dataset.interval) || 4500);
  };
  start();
  calm.addEventListener('change', () => { calm.matches ? stop() : start(); });
  const card = strip.closest('.publication');
  card?.addEventListener('mouseenter', stop);
  card?.addEventListener('mouseleave', start);
});

/* Project decks page through their key slides while the pointer rests on them. */
document.querySelectorAll('.deck-pages').forEach(strip => {
  const deck = makeStrip(strip);
  if (!deck) return;
  const card = strip.closest('.deck');
  let timer = null;
  card.addEventListener('mouseenter', () => {
    if (timer || calm.matches) return;
    deck.next();
    timer = setInterval(deck.next, 1400);
  });
  card.addEventListener('mouseleave', () => {
    clearInterval(timer); timer = null;
    deck.reset();
  });
});

})();
