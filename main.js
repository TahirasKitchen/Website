/**
 * TAHIRA'S KITCHEN — main.js
 * Works across index.html, dishes.html, contact.html.
 * Active nav tab is driven by data-page on <body>, not scroll position.
 */

/* ================================================
   NAV: Active tab — match body[data-page] to link[data-page]
   ================================================ */

const currentPage = document.body.dataset.page;

document.querySelectorAll('.nav-link, .nav-mobile-link').forEach(link => {
  if (link.dataset.page === currentPage) {
    link.classList.add('active');
  }
});


/* ================================================
   NAV: Hamburger toggle
   ================================================ */

const hamburger  = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobile-menu');

if (hamburger && mobileMenu) {
  hamburger.addEventListener('click', () => {
    const isOpen = hamburger.classList.toggle('open');
    mobileMenu.classList.toggle('open', isOpen);
    hamburger.setAttribute('aria-expanded', String(isOpen));
    mobileMenu.setAttribute('aria-hidden', String(!isOpen));
  });

  // Close on mobile link tap
  mobileMenu.querySelectorAll('.nav-mobile-link').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('open');
      mobileMenu.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
      mobileMenu.setAttribute('aria-hidden', 'true');
    });
  });

  // Close on outside click
  document.addEventListener('click', e => {
    if (!e.target.closest('.nav') && mobileMenu.classList.contains('open')) {
      hamburger.classList.remove('open');
      mobileMenu.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
      mobileMenu.setAttribute('aria-hidden', 'true');
    }
  });
}


/* ================================================
   GALLERY (dishes.html only)
   ================================================ */

const GALLERY = document.getElementById('gallery');

if (GALLERY) {

  const PLAY_ICON = `
    <svg width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <polygon points="2,1 9,5 2,9" fill="currentColor"/>
    </svg>`;

  const LIST_ICON = `
    <svg width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <line x1="1" y1="2.5" x2="9" y2="2.5" stroke="currentColor" stroke-width="1.2"/>
      <line x1="1" y1="5"   x2="9" y2="5"   stroke="currentColor" stroke-width="1.2"/>
      <line x1="1" y1="7.5" x2="9" y2="7.5" stroke="currentColor" stroke-width="1.2"/>
    </svg>`;

  function buildImageWrap(dish, index) {
    const imageWrap = document.createElement('div');
    imageWrap.className = 'card-image';
    if (dish.image) {
      const img = document.createElement('img');
      img.src = dish.image;
      img.alt = dish.title;
      img.loading = index < 4 ? 'eager' : 'lazy';
      img.decoding = 'async';
      img.onerror = () => {
        imageWrap.innerHTML = '';
        const fb = document.createElement('div');
        fb.className = 'card-image-fallback';
        fb.textContent = '🍽';
        imageWrap.appendChild(fb);
      };
      imageWrap.appendChild(img);
    } else {
      const fb = document.createElement('div');
      fb.className = 'card-image-fallback';
      fb.textContent = '🍽';
      imageWrap.appendChild(fb);
    }
    return imageWrap;
  }

  function buildCardFront(dish, index) {
    const front = document.createElement('div');
    front.className = 'card-front';

    front.appendChild(buildImageWrap(dish, index));

    const overlay = document.createElement('div');
    overlay.className = 'card-overlay';
    front.appendChild(overlay);

    const content = document.createElement('div');
    content.className = 'card-content';

    if (dish.category) {
      const cat = document.createElement('p');
      cat.className = 'card-category';
      cat.textContent = dish.category;
      content.appendChild(cat);
    }

    const titleRow = document.createElement('div');
    titleRow.className = 'card-title-row';

    const titleEl = document.createElement('h2');
    titleEl.className = 'card-title';
    const titleSpan = document.createElement('span');
    titleSpan.textContent = dish.title;
    titleEl.appendChild(titleSpan);
    titleRow.appendChild(titleEl);

    if (dish.price) {
      const price = document.createElement('span');
      price.className = 'card-price';
      price.textContent = dish.price;
      titleRow.appendChild(price);
    }

    content.appendChild(titleRow);

    if (dish.description) {
      const desc = document.createElement('p');
      desc.className = 'card-description';
      desc.textContent = dish.description;
      content.appendChild(desc);
    }

    // Actions row: Ingredient List + Watch on YouTube
    const actions = document.createElement('div');
    actions.className = 'card-actions';

    if (dish.ingredients && dish.ingredients.length) {
      const ingBtn = document.createElement('button');
      ingBtn.className = 'card-ingredients-btn';
      ingBtn.innerHTML = `${LIST_ICON} Ingredient List`;
      ingBtn.setAttribute('aria-label', `View ingredients for ${dish.title}`);
      ingBtn.addEventListener('click', e => {
        e.stopPropagation();
        const card = ingBtn.closest('.card');
        card.classList.add('flipped');
      });
      actions.appendChild(ingBtn);
    }

    const watchLabel = document.createElement('a');
    watchLabel.className = 'card-watch';
    watchLabel.href = dish.youtubeUrl;
    watchLabel.target = '_blank';
    watchLabel.rel = 'noopener noreferrer';
    watchLabel.setAttribute('aria-hidden', 'true');
    watchLabel.innerHTML = `${PLAY_ICON} Watch on YouTube`;
    actions.appendChild(watchLabel);

    content.appendChild(actions);

    front.appendChild(content);
    return front;
  }

  function buildCardBack(dish) {
    const back = document.createElement('div');
    back.className = 'card-back';
    back.setAttribute('aria-hidden', 'true');

    const header = document.createElement('div');
    header.className = 'card-back-header';

    const titleEl = document.createElement('p');
    titleEl.className = 'card-back-title';
    titleEl.textContent = dish.title;
    header.appendChild(titleEl);

    const closeBtn = document.createElement('button');
    closeBtn.className = 'card-back-close';
    closeBtn.innerHTML = '✕';
    closeBtn.setAttribute('aria-label', 'Close ingredient list');
    closeBtn.addEventListener('click', e => {
      e.stopPropagation();
      const card = closeBtn.closest('.card');
      card.classList.remove('flipped');
    });
    header.appendChild(closeBtn);
    back.appendChild(header);

    const eyebrow = document.createElement('p');
    eyebrow.className = 'card-back-eyebrow';
    eyebrow.textContent = 'What goes into it';
    back.appendChild(eyebrow);

    const list = document.createElement('ul');
    list.className = 'card-ingredients';
    (dish.ingredients || []).forEach(ing => {
      const li = document.createElement('li');
      li.textContent = ing;
      list.appendChild(li);
    });
    back.appendChild(list);

    return back;
  }

  function createCard(dish, index) {
    const card = document.createElement('article');
    card.className = 'card' + (dish.featured ? ' featured' : '');
    card.style.transitionDelay = `${Math.min(index * 80, 600)}ms`;

    // Flip wrapper
    const flipWrapper = document.createElement('div');
    flipWrapper.className = 'card-flip-wrapper';

    const flipInner = document.createElement('div');
    flipInner.className = 'card-flip-inner';

    flipInner.appendChild(buildCardFront(dish, index));
    flipInner.appendChild(buildCardBack(dish));

    flipWrapper.appendChild(flipInner);
    card.appendChild(flipWrapper);

    return card;
  }

  function initScrollReveal() {
    // Reveal observer — animate cards in as they enter the viewport
    const revealObserver = new IntersectionObserver(
      entries => entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('visible');
          revealObserver.unobserve(e.target);
        }
      }),
      { threshold: 0.08 }
    );

    document.querySelectorAll('.card').forEach(c => revealObserver.observe(c));

    // Scroll-to-unflip: on every scroll, check any flipped cards and revert
    // them the moment they are no longer substantially visible.
    let scrollTimer;
    window.addEventListener('scroll', () => {
      clearTimeout(scrollTimer);
      scrollTimer = setTimeout(() => {
        document.querySelectorAll('.card.flipped').forEach(card => {
          const rect = card.getBoundingClientRect();
          const windowH = window.innerHeight;
          // "substantially visible" = at least 30% of the card height is on screen
          const visiblePx = Math.min(rect.bottom, windowH) - Math.max(rect.top, 0);
          const threshold = card.offsetHeight * 0.3;
          if (visiblePx < threshold) {
            card.classList.remove('flipped');
          }
        });
      }, 80); // slight debounce so it doesn't fire on every pixel
    }, { passive: true });
  }

  function renderGallery(dishes) {
    GALLERY.innerHTML = '';
    if (!dishes || dishes.length === 0) {
      GALLERY.innerHTML = `<p style="color:var(--white-dim);padding:3rem;text-align:center;font-style:italic;grid-column:1/-1;">No dishes found. Add entries to dishes.json to get started.</p>`;
      return;
    }
    dishes.forEach((dish, i) => GALLERY.appendChild(createCard(dish, i)));
    requestAnimationFrame(() => requestAnimationFrame(initScrollReveal));
  }

  async function loadGallery() {
    try {
      const res = await fetch('dishes.json');
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const dishes = await res.json();
      // Initial full render
      renderGallery(dishes);
      // Hand data to filter module (runs after this block is parsed)
      requestAnimationFrame(() => {
        if (window._filterInit) window._filterInit(dishes);
      });
    } catch (err) {
      console.error('Could not load dishes.json:', err);
      GALLERY.innerHTML = `<p style="color:var(--white-dim);padding:3rem;text-align:center;font-style:italic;grid-column:1/-1;">Couldn't load dishes. Make sure <code>dishes.json</code> is in the same folder.</p>`;
    }
  }

  loadGallery();
}



/* ================================================
   FILTER & SEARCH (dishes.html only)
   ================================================ */

(function initFilterAndSearch() {
  const filterBtn       = document.getElementById('filter-btn');
  const filterPanel     = document.getElementById('filter-panel');
  const filterTagList   = document.getElementById('filter-tag-list');
  const filterApplyBtn  = document.getElementById('filter-apply-btn');
  const filterClearBtn  = document.getElementById('filter-clear-btn');
  const filterCount     = document.getElementById('filter-active-count');
  const searchInput     = document.getElementById('filter-search');
  const searchClear     = document.getElementById('filter-search-clear');
  const resultsMsg      = document.getElementById('filter-results-msg');

  if (!filterBtn) return; // not on dishes page

  let allDishes    = [];   // full dataset, set after fetch
  let activeTags   = new Set();
  let searchQuery  = '';
  let panelOpen    = false;

  // ---- Expose a hook so loadGallery can hand off the data ----
  window._filterInit = function(dishes) {
    allDishes = dishes;
    buildTagList(dishes);
  };

  window._filterApply = applyFilters; // called after render too

  // ---- Build tag checkboxes from all tags in the dataset ----
  function buildTagList(dishes) {
    const allTags = [...new Set(dishes.flatMap(d => d.tags || []))].sort();
    filterTagList.innerHTML = '';
    allTags.forEach(tag => {
      const li = document.createElement('li');
      li.className = 'filter-tag-item';

      const cb = document.createElement('input');
      cb.type = 'checkbox';
      cb.id = 'tag-' + tag.replace(/\s+/g, '-').toLowerCase();
      cb.value = tag;
      if (activeTags.has(tag)) cb.checked = true;

      const lbl = document.createElement('label');
      lbl.htmlFor = cb.id;
      lbl.textContent = tag;

      li.appendChild(cb);
      li.appendChild(lbl);
      filterTagList.appendChild(li);
    });
  }

  // ---- Open / close panel ----
  function openPanel() {
    panelOpen = true;
    filterPanel.classList.add('open');
    filterPanel.setAttribute('aria-hidden', 'false');
    filterBtn.setAttribute('aria-expanded', 'true');
    filterBtn.classList.add('active');
  }

  function closePanel() {
    panelOpen = false;
    filterPanel.classList.remove('open');
    filterPanel.setAttribute('aria-hidden', 'true');
    filterBtn.setAttribute('aria-expanded', 'false');
    if (activeTags.size === 0) filterBtn.classList.remove('active');
  }

  filterBtn.addEventListener('click', e => {
    e.stopPropagation();
    panelOpen ? closePanel() : openPanel();
  });

  document.addEventListener('click', e => {
    if (panelOpen && !e.target.closest('#filter-dropdown-wrap')) closePanel();
  });

  // ---- Apply button ----
  filterApplyBtn.addEventListener('click', () => {
    activeTags.clear();
    filterTagList.querySelectorAll('input[type="checkbox"]:checked').forEach(cb => {
      activeTags.add(cb.value);
    });
    updateCountBadge();
    applyFilters();
    closePanel();
  });

  // ---- Clear button ----
  filterClearBtn.addEventListener('click', () => {
    activeTags.clear();
    filterTagList.querySelectorAll('input[type="checkbox"]').forEach(cb => cb.checked = false);
    updateCountBadge();
    applyFilters();
  });

  // ---- Search input ----
  searchInput.addEventListener('input', () => {
    searchQuery = searchInput.value.trim().toLowerCase();
    searchClear.hidden = searchQuery.length === 0;
    applyFilters();
  });

  searchClear.addEventListener('click', () => {
    searchInput.value = '';
    searchQuery = '';
    searchClear.hidden = true;
    searchInput.focus();
    applyFilters();
  });

  // ---- Count badge on Filter button ----
  function updateCountBadge() {
    if (activeTags.size > 0) {
      filterCount.textContent = activeTags.size;
      filterCount.classList.add('visible');
      filterBtn.classList.add('active');
    } else {
      filterCount.textContent = '';
      filterCount.classList.remove('visible');
      filterBtn.classList.remove('active');
    }
  }

  // ---- Core filter logic ----
  function applyFilters() {
    if (!allDishes.length) return;

    let results = allDishes;

    // Tag filter: dish must have ALL active tags
    if (activeTags.size > 0) {
      results = results.filter(dish =>
        [...activeTags].every(tag => (dish.tags || []).includes(tag))
      );
    }

    // Search filter: match title, description, category, or tags
    if (searchQuery) {
      results = results.filter(dish => {
        const haystack = [
          dish.title,
          dish.description,
          dish.category,
          ...(dish.tags || [])
        ].join(' ').toLowerCase();
        return haystack.includes(searchQuery);
      });
    }

    renderFiltered(results);
  }

  // ---- Re-render gallery with filtered subset ----
  function renderFiltered(dishes) {
    // Use the global GALLERY and createCard already set up in the gallery block
    const gallery = document.getElementById('gallery');
    gallery.innerHTML = '';

    if (dishes.length === 0) {
      const msg = document.createElement('p');
      msg.className = 'gallery-empty-msg';
      msg.textContent = 'No dishes match your current filters.';
      gallery.appendChild(msg);
      resultsMsg.textContent = '';
      return;
    }

    dishes.forEach((dish, i) => gallery.appendChild(createCard(dish, i)));
    requestAnimationFrame(() => requestAnimationFrame(initScrollReveal));

    // Results message only when filtered
    const total = allDishes.length;
    if (activeTags.size > 0 || searchQuery) {
      resultsMsg.textContent = `Showing ${dishes.length} of ${total} dish${total !== 1 ? 'es' : ''}`;
    } else {
      resultsMsg.textContent = '';
    }
  }
})();

/* ================================================
   CONTACT FORM (contact.html only)
   ================================================ */

function handleContactSubmit(e) {
  e.preventDefault();
  const note = document.getElementById('form-note');
  const btn  = e.target.querySelector('.contact-submit');
  const form = e.target;

  btn.textContent = 'Sending…';
  btn.disabled = true;

  const data = new FormData(form);
  data.append('access_key', '954e1a30-859f-419a-9e52-ee39890f1374');
  data.append('subject', "New message — Tahira's Kitchen");

  fetch('https://api.web3forms.com/submit', {
    method: 'POST',
    body: data,
    headers: { 'Accept': 'application/json' }
  })
  .then(res => res.json())
  .then(data => {
    if (data.success) {
      note.textContent = '✦ Thank you — your message has been received.';
      form.reset();
    } else {
      note.textContent = 'Something went wrong. Please email us directly at TahirasKitchen2026@gmail.com';
      note.style.color = '#e88';
    }
  })
  .catch(() => {
    note.textContent = 'Could not send. Please email us directly at TahirasKitchen2026@gmail.com';
    note.style.color = '#e88';
  })
  .finally(() => {
    btn.textContent = 'Send Message';
    btn.disabled = false;
  });
}

/* ================================================
   CONTACT — FOOD ORDER PANEL (contact.html only)
   ================================================ */

(function initOrderPanel() {
  const toggle      = document.getElementById('order-toggle');
  if (!toggle) return;

  const panel       = document.getElementById('order-panel');
  const stepDates   = document.getElementById('order-step-dates');
  const stepNights  = document.getElementById('order-step-nights');
  const summary     = document.getElementById('order-summary');
  const summaryLines= document.getElementById('order-summary-lines');
  const summaryTotal= document.getElementById('order-summary-total');
  const editBtn     = document.getElementById('order-edit-btn');
  const hiddenField = document.getElementById('food-order-hidden');
  const checkinEl   = document.getElementById('order-checkin');
  const checkoutEl  = document.getElementById('order-checkout');
  const calHint     = document.getElementById('order-cal-hint');
  const calConfirm  = document.getElementById('order-cal-confirm');
  const nightsWrap  = document.getElementById('order-nights-wrap');
  const totalEl     = document.getElementById('order-total-value');
  const finishBtn   = document.getElementById('order-finish-btn');

  const MAX_NIGHTS  = 7;
  const HOURS       = ['12pm','1pm','2pm','3pm','4pm','5pm','6pm','7pm','8pm','9pm'];

  let dishes  = [];
  // nightOrders: { dateKey: { time: '6pm', items: { dishId: { dish, qty } } } }
  let nightOrders = {};
  let stayNights  = []; // array of Date objects (each night)

  // ── Seed today's date as min for both inputs ──────────────────────────────
  const todayStr = new Date().toISOString().split('T')[0];
  checkinEl.min  = todayStr;
  checkoutEl.min = todayStr;

  // ── Load dishes ───────────────────────────────────────────────────────────
  fetch('dishes.json')
    .then(r => r.json())
    .then(data => { dishes = data; })
    .catch(() => {});

  // ── Toggle ────────────────────────────────────────────────────────────────
  toggle.addEventListener('change', () => {
    if (toggle.checked) {
      resetAll();
      panel.classList.add('open');
      panel.setAttribute('aria-hidden', 'false');
    } else {
      panel.classList.remove('open');
      panel.setAttribute('aria-hidden', 'true');
      resetAll();
    }
  });

  // ── Date inputs ───────────────────────────────────────────────────────────
  checkinEl.addEventListener('change', validateDates);
  checkoutEl.addEventListener('change', validateDates);

  function validateDates() {
    calHint.textContent = '';
    calHint.style.color = 'var(--white-dim)';
    calConfirm.disabled = true;

    const ci = checkinEl.value;
    const co = checkoutEl.value;
    if (!ci || !co) return;

    const d1 = new Date(ci + 'T00:00:00');
    const d2 = new Date(co + 'T00:00:00');

    if (d2 <= d1) {
      calHint.textContent = 'Check-out must be after check-in.';
      calHint.style.color = '#e88';
      return;
    }

    const nights = Math.round((d2 - d1) / 86400000);
    if (nights > MAX_NIGHTS) {
      calHint.textContent = `Maximum ${MAX_NIGHTS} nights for food orders. Please contact us directly for longer stays.`;
      calHint.style.color = '#e88';
      return;
    }

    calHint.textContent = `${nights} night${nights > 1 ? 's' : ''} selected`;
    calHint.style.color = 'var(--gold)';
    calConfirm.disabled = false;
  }

  // ── Confirm dates → build per-night accordion ─────────────────────────────
  calConfirm.addEventListener('click', () => {
    const d1 = new Date(checkinEl.value + 'T00:00:00');
    const d2 = new Date(checkoutEl.value + 'T00:00:00');
    const nights = Math.round((d2 - d1) / 86400000);

    stayNights = [];
    nightOrders = {};
    for (let i = 0; i < nights; i++) {
      const d = new Date(d1);
      d.setDate(d1.getDate() + i);
      stayNights.push(d);
      const key = dateKey(d);
      nightOrders[key] = { time: '', items: {} };
    }

    buildNightAccordion();
    stepDates.hidden  = true;
    stepNights.hidden = false;
  });

  // ── Build accordion ───────────────────────────────────────────────────────
  function buildNightAccordion() {
    nightsWrap.innerHTML = '';

    stayNights.forEach((date, idx) => {
      const key = dateKey(date);
      const section = document.createElement('div');
      section.className = 'night-section';
      section.dataset.key = key;

      const header = document.createElement('button');
      header.type = 'button';
      header.className = 'night-header' + (idx === 0 ? ' open' : '');
      header.setAttribute('aria-expanded', idx === 0 ? 'true' : 'false');
      header.innerHTML = `
        <span class="night-header-left">
          <span class="night-date-label">${formatNight(date, idx)}</span>
          <span class="night-summary-pill" id="pill-${key}"></span>
        </span>
        <span class="night-chevron">
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
            <polyline points="2,3 5,7 8,3" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </span>`;

      const body = document.createElement('div');
      body.className = 'night-body' + (idx === 0 ? ' open' : '');
      body.id = `night-body-${key}`;

      const timeRow = document.createElement('div');
      timeRow.className = 'night-time-row';
      timeRow.innerHTML = `<span class="night-time-label">Preferred serving time</span>`;
      const timeSelect = document.createElement('select');
      timeSelect.className = 'night-time-select';
      timeSelect.id = `time-${key}`;
      const placeholder = document.createElement('option');
      placeholder.value = '';
      placeholder.textContent = '— Select time —';
      timeSelect.appendChild(placeholder);
      HOURS.forEach(h => {
        const opt = document.createElement('option');
        opt.value = h;
        opt.textContent = h;
        timeSelect.appendChild(opt);
      });
      timeRow.appendChild(timeSelect);
      body.appendChild(timeRow);

      const ul = document.createElement('ul');
      ul.className = 'order-dish-list night-dish-list';
      dishes.forEach(dish => {
        ul.appendChild(buildDishRow(dish, key));
      });
      body.appendChild(ul);

      section.appendChild(header);
      section.appendChild(body);
      nightsWrap.appendChild(section);

      header.addEventListener('click', () => {
        const isOpen = body.classList.contains('open');
        nightsWrap.querySelectorAll('.night-body').forEach(b => b.classList.remove('open'));
        nightsWrap.querySelectorAll('.night-header').forEach(h => {
          h.classList.remove('open');
          h.setAttribute('aria-expanded', 'false');
        });
        if (!isOpen) {
          body.classList.add('open');
          header.classList.add('open');
          header.setAttribute('aria-expanded', 'true');
        }
      });

      timeSelect.addEventListener('change', () => {
        nightOrders[key].time = timeSelect.value;
        updatePill(key);
        updateGrandTotal();
      });
    });
  }

  // ── Build one dish row (reusable per night) ───────────────────────────────
  function buildDishRow(dish, key) {
    const li = document.createElement('li');
    li.className = 'order-dish-item';

    const cbWrap = document.createElement('span');
    cbWrap.className = 'order-dish-cb-wrap';
    const cb = document.createElement('input');
    cb.type = 'checkbox';
    cb.className = 'order-dish-cb';
    cb.id = `odish-${key}-${dish.id}`;
    const cbBox = document.createElement('span');
    cbBox.className = 'order-dish-cb-box';
    cbWrap.appendChild(cb);
    cbWrap.appendChild(cbBox);

    const lbl = document.createElement('label');
    lbl.className = 'order-dish-label';
    lbl.htmlFor = cb.id;
    lbl.appendChild(cbWrap);
    const nameEl = document.createElement('span');
    nameEl.className = 'order-dish-name';
    nameEl.textContent = dish.title;
    const priceEl = document.createElement('span');
    priceEl.className = 'order-dish-price';
    priceEl.textContent = dish.price || '';
    lbl.appendChild(nameEl);
    lbl.appendChild(priceEl);

    const qtyWrap = document.createElement('span');
    qtyWrap.className = 'order-qty-wrap';
    const minusBtn = document.createElement('button');
    minusBtn.type = 'button';
    minusBtn.className = 'order-qty-btn';
    minusBtn.textContent = '−';
    const qtyInput = document.createElement('input');
    qtyInput.type = 'number';
    qtyInput.className = 'order-qty-input';
    qtyInput.value = 1; qtyInput.min = 1; qtyInput.max = 20;
    const plusBtn = document.createElement('button');
    plusBtn.type = 'button';
    plusBtn.className = 'order-qty-btn';
    plusBtn.textContent = '+';
    qtyWrap.appendChild(minusBtn);
    qtyWrap.appendChild(qtyInput);
    qtyWrap.appendChild(plusBtn);

    li.appendChild(lbl);
    li.appendChild(qtyWrap);

    const update = () => {
      if (cb.checked) {
        nightOrders[key].items[dish.id] = { dish, qty: parseInt(qtyInput.value) || 1 };
      } else {
        delete nightOrders[key].items[dish.id];
        qtyInput.value = 1;
      }
      updatePill(key);
      updateGrandTotal();
    };

    cb.addEventListener('change', update);
    qtyInput.addEventListener('input', () => {
      let v = parseInt(qtyInput.value) || 1;
      qtyInput.value = Math.min(Math.max(v, 1), 20);
      if (cb.checked) { nightOrders[key].items[dish.id].qty = parseInt(qtyInput.value); updatePill(key); updateGrandTotal(); }
    });
    minusBtn.addEventListener('click', () => {
      if (parseInt(qtyInput.value) > 1) { qtyInput.value--; qtyInput.dispatchEvent(new Event('input')); }
    });
    plusBtn.addEventListener('click', () => {
      if (parseInt(qtyInput.value) < 20) { qtyInput.value++; qtyInput.dispatchEvent(new Event('input')); }
    });

    return li;
  }

  // ── Pill: compact per-night summary in accordion header ───────────────────
  function updatePill(key) {
    const pill = document.getElementById(`pill-${key}`);
    if (!pill) return;
    const order = nightOrders[key];
    const count = Object.values(order.items).reduce((s, {qty}) => s + qty, 0);
    if (count === 0 && !order.time) { pill.textContent = ''; return; }
    const parts = [];
    if (count > 0) parts.push(`${count} dish${count > 1 ? 'es' : ''}`);
    if (order.time) parts.push(`@ ${order.time}`);
    pill.textContent = parts.join(' ');
  }

  // ── Grand total across all nights ─────────────────────────────────────────
  function updateGrandTotal() {
    const total = Object.values(nightOrders).reduce((sum, { items }) => {
      return sum + Object.values(items).reduce((s, { dish, qty }) => {
        return s + (parseFloat((dish.price||'0').replace(/[^0-9.]/g,''))||0) * qty;
      }, 0);
    }, 0);
    totalEl.textContent = `$${total.toFixed(2)}`;
  }

  // ── Finish order ──────────────────────────────────────────────────────────
  finishBtn.addEventListener('click', () => {
    const hasAnyDish = Object.values(nightOrders).some(n => Object.keys(n.items).length > 0);
    if (!hasAnyDish) {
      finishBtn.textContent = 'Select at least one dish';
      setTimeout(() => { finishBtn.textContent = 'Finish Order'; }, 2000);
      return;
    }
    showSummary();
  });

  function showSummary() {
    summaryLines.innerHTML = '';
    let grandTotal = 0;
    const emailLines = [];

    stayNights.forEach(date => {
      const key = dateKey(date);
      const { time, items } = nightOrders[key];
      if (Object.keys(items).length === 0) return;

      const dateHead = document.createElement('div');
      dateHead.className = 'order-summary-date-head';
      dateHead.textContent = formatNight(date) + (time ? ` — ${time}` : '');
      summaryLines.appendChild(dateHead);

      const emailNightLines = [];
      Object.values(items).forEach(({ dish, qty }) => {
        const p = parseFloat((dish.price||'0').replace(/[^0-9.]/g,''))||0;
        const lineTotal = p * qty;
        grandTotal += lineTotal;

        const row = document.createElement('div');
        row.className = 'order-summary-line';
        const nameEl = document.createElement('span');
        nameEl.className = 'order-summary-line-name';
        nameEl.textContent = qty > 1 ? `${dish.title} × ${qty}` : dish.title;
        const priceEl = document.createElement('span');
        priceEl.className = 'order-summary-line-price';
        priceEl.textContent = `$${lineTotal.toFixed(2)}`;
        row.appendChild(nameEl);
        row.appendChild(priceEl);
        summaryLines.appendChild(row);

        emailNightLines.push(`${dish.title}${qty > 1 ? ` x${qty}` : ''} ($${lineTotal.toFixed(2)})`);
      });

      emailLines.push(`${formatNight(date)}${time ? ' @ ' + time : ''}: ${emailNightLines.join(', ')}`);
    });

    summaryTotal.textContent = `$${grandTotal.toFixed(2)}`;
    hiddenField.value = emailLines.join(' | ') + ` | TOTAL: $${grandTotal.toFixed(2)}`;

    stepNights.hidden = true;
    summary.hidden = false;
  }

  // ── Edit ──────────────────────────────────────────────────────────────────
  editBtn.addEventListener('click', () => {
    summary.hidden    = true;
    stepNights.hidden = false;
    hiddenField.value = '';
  });

  // ── Helpers ───────────────────────────────────────────────────────────────
  function dateKey(d) {
    return d.toISOString().split('T')[0];
  }

  function formatNight(date, idx) {
    const label = date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
    return idx !== undefined ? `Night ${idx + 1} — ${label}` : label;
  }

  function resetAll() {
    nightOrders  = {};
    stayNights   = [];
    hiddenField.value = '';
    checkinEl.value   = '';
    checkoutEl.value  = '';
    calHint.textContent = '';
    if (calConfirm) calConfirm.disabled = true;
    nightsWrap.innerHTML = '';
    summary.hidden    = true;
    stepNights.hidden = true;
    stepDates.hidden  = false;
    if (totalEl) totalEl.textContent = '$0';
  }

})();

/* ================================================
   REVIEWS — Slideshow + Modal (index.html & contact.html)
   ================================================ */

(function initReviews() {

  /* ── How many cards to show at once based on viewport ── */
  function visibleCount() {
    const w = window.innerWidth;
    if (w >= 1200) return 3;
    if (w >= 720)  return 2;
    return 1;
  }

  /* ── Render stars ── */
  function starsHTML(rating) {
    return Array.from({length: 5}, (_, i) =>
      `<span class="review-card-star${i < rating ? '' : ' review-card-star-empty'}">★</span>`
    ).join('');
  }

  /* ── Slideshow (index.html only) ── */
  const stage = document.getElementById('reviews-stage');
  if (stage) {
    const prevBtn  = document.getElementById('reviews-prev');
    const nextBtn  = document.getElementById('reviews-next');
    const dotsWrap = document.getElementById('reviews-dots');

    let reviews    = [];
    let current    = 0;   // index of first visible card
    let perPage    = visibleCount();
    let cardWidth  = 0;
    let track      = null;

    fetch('reviews.json')
      .then(r => r.json())
      .then(data => {
        reviews = data.filter(r => r.approved);
        if (!reviews.length) { stage.closest('.reviews-section').hidden = true; return; }
        buildTrack();
        buildDots();
        updateSlider();
        window.addEventListener('resize', onResize);
      })
      .catch(() => { if (stage.closest) stage.closest('.reviews-section').hidden = true; });

    function buildTrack() {
      stage.innerHTML = '';
      track = document.createElement('div');
      track.className = 'reviews-track';

      reviews.forEach(r => {
        const card = document.createElement('div');
        card.className = 'review-card';
        card.innerHTML = `
          <div class="review-card-stars">${starsHTML(r.rating)}</div>
          <p class="review-card-title">${r.title}</p>
          <p class="review-card-body">${r.body}</p>
          <div class="review-card-meta">
            <span class="review-card-name">${r.name}</span>
            <span class="review-card-date">${r.date || ''}</span>
          </div>`;
        track.appendChild(card);
      });

      stage.appendChild(track);
    }

    function buildDots() {
      dotsWrap.innerHTML = '';
      const pages = Math.ceil(reviews.length / perPage);
      for (let i = 0; i < pages; i++) {
        const dot = document.createElement('button');
        dot.className = 'reviews-dot' + (i === 0 ? ' active' : '');
        dot.setAttribute('aria-label', `Go to page ${i + 1}`);
        dot.addEventListener('click', () => goTo(i * perPage));
        dotsWrap.appendChild(dot);
      }
    }

    function setCardWidths() {
      perPage = visibleCount();
      const gap = 20; // 1.25rem
      const stageW = stage.offsetWidth;
      cardWidth = (stageW - gap * (perPage - 1)) / perPage;
      track.querySelectorAll('.review-card').forEach(c => {
        c.style.width = cardWidth + 'px';
      });
      track.style.gap = gap + 'px';
    }

    function updateSlider() {
      setCardWidths();
      const gap = 20;
      const offset = current * (cardWidth + gap);
      track.style.transform = `translateX(-${offset}px)`;

      // Dots
      const pageIdx = Math.floor(current / perPage);
      dotsWrap.querySelectorAll('.reviews-dot').forEach((d, i) => {
        d.classList.toggle('active', i === pageIdx);
      });

      prevBtn.disabled = current === 0;
      nextBtn.disabled = current + perPage >= reviews.length;
    }

    function goTo(idx) {
      current = Math.max(0, Math.min(idx, reviews.length - perPage));
      updateSlider();
    }

    prevBtn.addEventListener('click', () => goTo(current - perPage));
    nextBtn.addEventListener('click', () => goTo(current + perPage));

    // Auto-advance every 5s, pause on hover
    let autoTimer = setInterval(() => {
      if (current + perPage >= reviews.length) { goTo(0); }
      else { goTo(current + perPage); }
    }, 5000);

    stage.addEventListener('mouseenter', () => clearInterval(autoTimer));
    stage.addEventListener('mouseleave', () => {
      autoTimer = setInterval(() => {
        if (current + perPage >= reviews.length) { goTo(0); }
        else { goTo(current + perPage); }
      }, 5000);
    });

    // Touch/swipe support
    let touchStartX = 0;
    stage.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; }, {passive:true});
    stage.addEventListener('touchend', e => {
      const diff = touchStartX - e.changedTouches[0].clientX;
      if (Math.abs(diff) > 40) { diff > 0 ? goTo(current + perPage) : goTo(current - perPage); }
    }, {passive:true});

    function onResize() {
      const newPer = visibleCount();
      if (newPer !== perPage) {
        current = 0;
        buildDots();
      }
      updateSlider();
    }
  }

  /* ── Modal (works on both index.html and contact.html) ── */
  const overlay   = document.getElementById('review-modal-overlay');
  if (!overlay) return;

  const modalClose  = document.getElementById('review-modal-close');
  const reviewForm  = document.getElementById('review-form');
  const starsEl     = document.getElementById('review-stars');
  const ratingField = document.getElementById('review-rating-hidden');
  const formNote    = document.getElementById('review-form-note');

  // Buttons that open the modal — one on index.html, one on contact.html
  ['reviews-leave-btn', 'contact-leave-review-btn'].forEach(id => {
    const btn = document.getElementById(id);
    if (btn) btn.addEventListener('click', openModal);
  });

  function openModal() {
    overlay.classList.add('open');
    overlay.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    overlay.classList.remove('open');
    overlay.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  if (modalClose) modalClose.addEventListener('click', closeModal);
  overlay.addEventListener('click', e => { if (e.target === overlay) closeModal(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });

  // Star rating picker
  let selectedRating = 0;
  if (starsEl) {
    const stars = starsEl.querySelectorAll('.review-star');
    stars.forEach(star => {
      star.addEventListener('mouseenter', () => highlightStars(+star.dataset.value));
      star.addEventListener('mouseleave', () => highlightStars(selectedRating));
      star.addEventListener('click', () => {
        selectedRating = +star.dataset.value;
        ratingField.value = selectedRating;
        highlightStars(selectedRating);
      });
    });

    function highlightStars(n) {
      stars.forEach((s, i) => s.classList.toggle('filled', i < n));
    }
  }

  // Submit
  if (reviewForm) {
    reviewForm.addEventListener('submit', e => {
      e.preventDefault();
      if (!selectedRating) {
        formNote.textContent = 'Please select a star rating.';
        formNote.style.color = '#e88';
        return;
      }

      const btn = reviewForm.querySelector('.review-submit-btn');
      btn.textContent = 'Sending…';
      btn.disabled = true;

      const data = new FormData(reviewForm);

      fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        body: data,
        headers: { 'Accept': 'application/json' }
      })
      .then(r => r.json())
      .then(res => {
        if (res.success) {
          formNote.style.color = 'var(--white-dim)';
          formNote.textContent = '✦ Thank you! Your review has been received.';
          reviewForm.reset();
          selectedRating = 0;
          starsEl && starsEl.querySelectorAll('.review-star').forEach(s => s.classList.remove('filled'));
          setTimeout(closeModal, 2200);
        } else {
          formNote.textContent = 'Something went wrong — please try again.';
          formNote.style.color = '#e88';
        }
      })
      .catch(() => {
        formNote.textContent = 'Could not send — please try again.';
        formNote.style.color = '#e88';
      })
      .finally(() => {
        btn.textContent = 'Submit Review';
        btn.disabled = false;
      });
    });
  }

})();
