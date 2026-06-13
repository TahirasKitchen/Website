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
  const toggle       = document.getElementById('order-toggle');
  if (!toggle) return; // not on contact page

  const panel        = document.getElementById('order-panel');
  const dishList     = document.getElementById('order-dish-list');
  const totalEl      = document.getElementById('order-total-value');
  const finishBtn    = document.getElementById('order-finish-btn');
  const listWrap     = document.getElementById('order-list-wrap');
  const summary      = document.getElementById('order-summary');
  const summaryLines = document.getElementById('order-summary-lines');
  const summaryTotal = document.getElementById('order-summary-total');
  const editBtn      = document.getElementById('order-edit-btn');
  const hiddenField  = document.getElementById('food-order-hidden');

  let dishes = [];      // loaded from dishes.json
  let orderMap = {};    // { id: { dish, qty } }

  // ---- Load dishes from existing dishes.json ----
  fetch('dishes.json')
    .then(r => r.json())
    .then(data => { dishes = data; buildDishList(); })
    .catch(() => {
      dishList.innerHTML = '<li style="padding:1rem;color:var(--white-dim);font-size:0.82rem;font-style:italic;">Could not load menu.</li>';
    });

  // ---- Toggle panel open/close ----
  toggle.addEventListener('change', () => {
    if (toggle.checked) {
      resetOrder(); // always start fresh when opening
      panel.classList.add('open');
      panel.setAttribute('aria-hidden', 'false');
    } else {
      panel.classList.remove('open');
      panel.setAttribute('aria-hidden', 'true');
      resetOrder();
    }
  });

  // ---- Build dish rows ----
  function buildDishList() {
    dishList.innerHTML = '';
    dishes.forEach(dish => {
      const price = parseFloat((dish.price || '$0').replace(/[^0-9.]/g, '')) || 0;
      const li = document.createElement('li');
      li.className = 'order-dish-item';
      li.dataset.id = dish.id;

      // Checkbox
      const cbWrap = document.createElement('span');
      cbWrap.className = 'order-dish-cb-wrap';

      const cb = document.createElement('input');
      cb.type = 'checkbox';
      cb.className = 'order-dish-cb';
      cb.id = `odish-${dish.id}`;
      cb.dataset.price = price;

      const cbBox = document.createElement('span');
      cbBox.className = 'order-dish-cb-box';

      cbWrap.appendChild(cb);
      cbWrap.appendChild(cbBox);

      // Label wraps cbWrap + name + price so clicking box OR name selects the dish
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

      // Qty controls
      const qtyWrap = document.createElement('span');
      qtyWrap.className = 'order-qty-wrap';

      const minusBtn = document.createElement('button');
      minusBtn.type = 'button';
      minusBtn.className = 'order-qty-btn';
      minusBtn.textContent = '−';
      minusBtn.setAttribute('aria-label', 'Decrease quantity');

      const qtyInput = document.createElement('input');
      qtyInput.type = 'number';
      qtyInput.className = 'order-qty-input';
      qtyInput.value = 1;
      qtyInput.min = 1;
      qtyInput.max = 20;
      qtyInput.setAttribute('aria-label', 'Quantity');

      const plusBtn = document.createElement('button');
      plusBtn.type = 'button';
      plusBtn.className = 'order-qty-btn';
      plusBtn.textContent = '+';
      plusBtn.setAttribute('aria-label', 'Increase quantity');

      qtyWrap.appendChild(minusBtn);
      qtyWrap.appendChild(qtyInput);
      qtyWrap.appendChild(plusBtn);

      li.appendChild(lbl);
      li.appendChild(qtyWrap);
      dishList.appendChild(li);

      // ---- Events ----
      cb.addEventListener('change', () => {
        if (cb.checked) {
          orderMap[dish.id] = { dish, qty: parseInt(qtyInput.value) || 1 };
        } else {
          delete orderMap[dish.id];
          qtyInput.value = 1;
        }
        updateTotal();
      });

      qtyInput.addEventListener('input', () => {
        let v = parseInt(qtyInput.value) || 1;
        if (v < 1) v = 1;
        if (v > 20) v = 20;
        qtyInput.value = v;
        if (cb.checked) {
          orderMap[dish.id] = { dish, qty: v };
          updateTotal();
        }
      });

      minusBtn.addEventListener('click', () => {
        let v = parseInt(qtyInput.value) || 1;
        if (v > 1) { qtyInput.value = v - 1; qtyInput.dispatchEvent(new Event('input')); }
      });

      plusBtn.addEventListener('click', () => {
        let v = parseInt(qtyInput.value) || 1;
        if (v < 20) { qtyInput.value = v + 1; qtyInput.dispatchEvent(new Event('input')); }
      });
    });
  }

  // ---- Running total ----
  function updateTotal() {
    const total = Object.values(orderMap).reduce((sum, { dish, qty }) => {
      const p = parseFloat((dish.price || '0').replace(/[^0-9.]/g, '')) || 0;
      return sum + p * qty;
    }, 0);
    totalEl.textContent = `$${total.toFixed(2)}`;
  }

  // ---- Finish order ----
  finishBtn.addEventListener('click', () => {
    if (Object.keys(orderMap).length === 0) {
      finishBtn.textContent = 'Select at least one dish';
      setTimeout(() => { finishBtn.textContent = 'Finish Order'; }, 2000);
      return;
    }
    showSummary();
  });

  function showSummary() {
    summaryLines.innerHTML = '';
    let total = 0;

    Object.values(orderMap).forEach(({ dish, qty }) => {
      const price = parseFloat((dish.price || '0').replace(/[^0-9.]/g, '')) || 0;
      const lineTotal = price * qty;
      total += lineTotal;

      const row = document.createElement('div');
      row.className = 'order-summary-line';

      const namePart = document.createElement('span');
      namePart.className = 'order-summary-line-name';
      namePart.textContent = qty > 1 ? `${dish.title} × ${qty}` : dish.title;

      const pricePart = document.createElement('span');
      pricePart.className = 'order-summary-line-price';
      pricePart.textContent = `$${lineTotal.toFixed(2)}`;

      row.appendChild(namePart);
      row.appendChild(pricePart);
      summaryLines.appendChild(row);
    });

    summaryTotal.textContent = `$${total.toFixed(2)}`;

    // Build hidden field value for email
    const orderText = Object.values(orderMap)
      .map(({ dish, qty }) => {
        const p = parseFloat((dish.price || '0').replace(/[^0-9.]/g, '')) || 0;
        return `${dish.title}${qty > 1 ? ` x${qty}` : ''} — $${(p * qty).toFixed(2)}`;
      })
      .join('; ') + ` | TOTAL: $${total.toFixed(2)}`;
    hiddenField.value = orderText;

    listWrap.hidden = true;
    summary.hidden = false;
  }

  // ---- Edit order ----
  editBtn.addEventListener('click', () => {
    summary.hidden = true;
    listWrap.hidden = false;
    hiddenField.value = '';
  });

  function resetOrder() {
    orderMap = {};
    hiddenField.value = '';
    listWrap.hidden = false;
    summary.hidden = true;
    // Uncheck all and reset qty
    dishList.querySelectorAll('.order-dish-cb').forEach(cb => { cb.checked = false; });
    dishList.querySelectorAll('.order-qty-input').forEach(inp => { inp.value = 1; });
    totalEl.textContent = '$0';
  }

})();
