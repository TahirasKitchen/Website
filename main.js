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
    // Reveal observer
    const revealObserver = new IntersectionObserver(
      entries => entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('visible');
          revealObserver.unobserve(e.target);
        }
      }),
      { threshold: 0.08 }
    );

    // Scroll-to-unflip observer — fires when card scrolls mostly out of view
    const unflipObserver = new IntersectionObserver(
      entries => entries.forEach(e => {
        if (!e.isIntersecting) {
          e.target.classList.remove('flipped');
        }
      }),
      { threshold: 0.15 }
    );

    document.querySelectorAll('.card').forEach(c => {
      revealObserver.observe(c);
      unflipObserver.observe(c);
    });
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
      renderGallery(await res.json());
    } catch (err) {
      console.error('Could not load dishes.json:', err);
      GALLERY.innerHTML = `<p style="color:var(--white-dim);padding:3rem;text-align:center;font-style:italic;grid-column:1/-1;">Couldn't load dishes. Make sure <code>dishes.json</code> is in the same folder.</p>`;
    }
  }

  loadGallery();
}


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

  // Formspree handles the email delivery to tahiraskitchen2026@gmail.com
  // Replace YOUR_FORM_ID below with the ID from your Formspree dashboard (see setup steps)
  const FORMSPREE_ID = 'mdavldkv';

  const data = new FormData(form);

  fetch(`https://formspree.io/f/${FORMSPREE_ID}`, {
    method: 'POST',
    body: data,
    headers: { 'Accept': 'application/json' }
  })
  .then(res => {
    if (res.ok) {
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
