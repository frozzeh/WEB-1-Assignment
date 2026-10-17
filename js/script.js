// KFC Kazakhstan | Frontend interactions
// 1. Food menu: product customization and cart
document.addEventListener('DOMContentLoaded', () => {
    const modal = document.getElementById('product-modal');

    // Food Menu: product-specific customization and a persistent demo cart.
    if (modal) {
        const products = {
            'Chefburger': { included: ['Chicken fillet', 'Fresh lettuce', 'Tomatoes', 'Special sauce'], optional: [['Extra cheese', 200], ['Pickles', 150], ['Extra sauce', 100]] },
            'Twister Wrap': { included: ['Crispy chicken tenders', 'Fresh tomatoes', 'Creamy mayo', 'Warm tortilla'], optional: [['Extra cheese', 200], ['Extra sauce', 100], ['Pickles', 150]] },
            'Zinger Burger': { included: ['Spicy chicken fillet', 'Fresh lettuce', 'Signature mayo', 'Sesame bun'], optional: [['Extra cheese', 200], ['Pickles', 150], ['Extra sauce', 100]] }
        };
        const nameEl = document.getElementById('modal-dish-name');
        const imgEl = document.getElementById('modal-dish-img');
        const totalEl = document.getElementById('modal-total-price');
        const ingredientsEl = modal.querySelector('.ingredients-list');
        const cartBtn = document.getElementById('add-to-cart-btn');
        const money = value => Number(value).toLocaleString('en-US').replace(/,/g, ' ') + ' ₸';
        let selected = null;
        let lastFocus = null;
        function updatePrice() {
            if (!selected) return;
            const extra = [...ingredientsEl.querySelectorAll('input:checked')].reduce((sum, input) => sum + Number(input.dataset.price || 0), 0);
            totalEl.textContent = money(selected.price + extra).replace(' ₸', '');
        }
        function openProduct(button) {
            lastFocus = document.activeElement;
            selected = { name: button.dataset.name, price: Number(button.dataset.price) };
            const product = products[selected.name];
            nameEl.textContent = selected.name;
            imgEl.src = button.dataset.img; imgEl.alt = selected.name;
            document.getElementById('modal-dish-description').textContent = button.dataset.description || '';
            ingredientsEl.replaceChildren();
            [...product.included.map(name => [name, 0, true]), ...product.optional.map(([name, price]) => [name, price, false])].forEach(([name, price, checked]) => {
                const label = document.createElement('label'); label.className = 'ingredient-item';
                const input = document.createElement('input'); input.type = 'checkbox'; input.checked = checked; input.dataset.price = price;
                const text = document.createElement('span'); text.textContent = name + (price ? ' (+' + money(price) + ')' : '');
                label.append(input, text); ingredientsEl.append(label);
            });
            cartBtn.textContent = 'Add to Cart'; cartBtn.disabled = false;
            updatePrice(); modal.style.display = 'flex'; modal.classList.add('menu-modal-visible'); modal.setAttribute('aria-hidden', 'false');
            document.body.classList.add('menu-dialog-open'); modal.querySelector('.close-btn').focus();
        }
        function closeProduct() {
            modal.classList.remove('menu-modal-visible'); modal.style.display = 'none'; modal.setAttribute('aria-hidden', 'true');
            document.body.classList.remove('menu-dialog-open'); lastFocus?.focus();
        }
        document.querySelectorAll('.open-modal-btn').forEach(button => button.addEventListener('click', () => openProduct(button)));
        ingredientsEl.addEventListener('change', updatePrice);
        modal.querySelector('.close-btn').addEventListener('click', closeProduct);
        modal.addEventListener('click', event => { if (event.target === modal) closeProduct(); });
        document.addEventListener('keydown', event => {
            if (modal.getAttribute('aria-hidden') === 'true') return;
            if (event.key === 'Escape') closeProduct();
            if (event.key === 'Tab') {
                const focusable = [...modal.querySelectorAll('button:not(:disabled), input:not(:disabled)')];
                const first = focusable[0], last = focusable[focusable.length - 1];
                if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
                else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
            }
        });
        cartBtn.addEventListener('click', () => {
            if (!selected) return;
            const options = [...ingredientsEl.querySelectorAll('label')].filter(label => label.querySelector('input').checked).map(label => label.querySelector('span').textContent);
            const price = Number(totalEl.textContent.replace(/[^0-9]/g, ''));
            window.KFCCart.add({name:selected.name, price, options, image:imgEl.getAttribute('src'), type:'food'});
            closeProduct();
            window.KFCCart.open();
            showToast(selected.name + ' added to your cart!', 'success');
        });
    }

});
// 2. Assignment 4: FAQ, background color, clock, and subscription
 document.addEventListener('DOMContentLoaded', () => {
    // Accordion: CSS transition handles smooth opening and closing.
    document.querySelectorAll('.faq-question').forEach(button => {
        button.addEventListener('click', () => {
            const expanded = button.getAttribute('aria-expanded') === 'true';
            document.querySelectorAll('.faq-question').forEach(other => { if (other !== button) { other.setAttribute('aria-expanded', 'false'); other.nextElementSibling.classList.remove('is-open'); other.querySelector('span').textContent = '+'; } });
            button.setAttribute('aria-expanded', String(!expanded));
            button.nextElementSibling.classList.toggle('is-open', !expanded);
            button.querySelector('span').textContent = expanded ? '+' : '−';
        });
    });

    // Background colors cycle on every click.
    const colors = ['#fff8f2', '#eef6ff', '#effaf0', '#fff2f6', '#ffffff'];
    let colorIndex = -1;
    document.getElementById('color-change-btn')?.addEventListener('click', () => {
        colorIndex = (colorIndex + 1) % colors.length;
        document.body.style.backgroundColor = colors[colorIndex];
    });

    // Live clock updates every second using the Date object.
    const clock = document.getElementById('live-clock');
    function updateClock() {
        if (clock) clock.textContent = new Date().toLocaleString('en-US', {
            year: 'numeric', month: 'long', day: 'numeric',
            hour: 'numeric', minute: '2-digit', second: '2-digit'
        });
    }
    if (clock) {
        updateClock();
        setInterval(updateClock, 1000);
    }

    // Subscription dialog opens by button, closes by X, backdrop or Escape.
    const modal = document.getElementById('subscribe-modal');
    const open = document.getElementById('subscribe-open-btn');
    const close = document.getElementById('subscribe-close-btn');
    let previousFocus;
    function hideModal() {
        modal.classList.remove('is-visible');
        modal.setAttribute('aria-hidden', 'true');
        document.body.classList.remove('modal-open');
        previousFocus?.focus();
    }
    open?.addEventListener('click', () => {
        previousFocus = document.activeElement;
        modal.classList.add('is-visible');
        modal.setAttribute('aria-hidden', 'false');
        document.body.classList.add('modal-open');
        document.getElementById('subscriber-name').focus();
    });
    close?.addEventListener('click', hideModal);
    modal?.addEventListener('click', event => { if (event.target === modal) hideModal(); });
    document.addEventListener('keydown', event => {
        if (event.key === 'Escape' && modal?.classList.contains('is-visible')) hideModal();
        if (event.key === 'Tab' && modal?.classList.contains('is-visible')) {
            const controls = [...modal.querySelectorAll('button, input')];
            const first = controls[0], last = controls[controls.length - 1];
            if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
            else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
        }
    });
    document.getElementById('subscribe-form')?.addEventListener('submit', event => {
        event.preventDefault();
        const name = document.getElementById('subscriber-name');
        const email = document.getElementById('subscriber-email');
        const error = document.getElementById('subscribe-error');
        const success = document.getElementById('subscribe-success');
        error.textContent = ''; success.textContent = '';
        if (!name.value.trim()) { error.textContent = 'Please enter your name.'; name.focus(); return; }
        if (!email.value.trim() || !email.checkValidity()) { error.textContent = 'Please enter a valid email.'; email.focus(); return; }
        success.textContent = 'Form validated successfully (demo only).';
        showToast('Subscription form validated successfully!', 'success');
        event.target.reset();
    });
});

// 3. Shared toast notifications
function showToast(message, type = 'success') {
    let area = document.getElementById('site-toast-area');
    if (!area) { area = document.createElement('div'); area.id = 'site-toast-area'; area.setAttribute('aria-live', 'polite'); document.body.append(area); }
    const toast = document.createElement('div'); toast.className = 'site-toast ' + type; toast.textContent = message;
    area.append(toast); setTimeout(() => { toast.remove(); }, 3600);
}
// 4. Developer profile dialog
document.addEventListener('DOMContentLoaded', () => {
    const modal = document.getElementById('team-modal');
    if (!modal) return;
    const close = document.getElementById('team-modal-close');
    let lastFocus;
    function hide() { modal.classList.remove('is-visible'); modal.setAttribute('aria-hidden', 'true'); document.body.classList.remove('modal-open'); lastFocus?.focus(); }
    document.querySelectorAll('.team-profile-trigger').forEach(card => card.addEventListener('click', () => {
        lastFocus = document.activeElement;
        document.getElementById('team-modal-name').textContent = card.dataset.name;
        document.getElementById('team-modal-role').textContent = card.dataset.role;
        document.getElementById('team-modal-description').textContent = card.dataset.description;
        // Render the selected developer's contribution tags.
        const tags = document.getElementById('team-modal-tags');
        if (tags) {
            tags.replaceChildren();
            (card.dataset.tags || '').split(',').filter(Boolean).forEach(label => {
                const tag = document.createElement('span');
                tag.textContent = label;
                tags.append(tag);
            });
        }
        const image = document.getElementById('team-modal-image'); image.src = card.dataset.image; image.alt = card.dataset.name;
        modal.classList.add('is-visible'); modal.setAttribute('aria-hidden', 'false'); document.body.classList.add('modal-open'); close.focus();
    }));
    close.addEventListener('click', hide);
    modal.addEventListener('click', e => { if (e.target === modal) hide(); });
    document.addEventListener('keydown', e => {
        if (!modal.classList.contains('is-visible')) return;
        if (e.key === 'Escape') hide();
        if (e.key === 'Tab') { e.preventDefault(); close.focus(); }
    });
});

// 5. Food card interactions, gallery lightbox, and reviews
document.addEventListener('DOMContentLoaded', () => {
  // The existing menu customization dialog doubles as a detailed dish card.
  document.querySelectorAll('.interactive-food-card').forEach(card => {
    const button = card.querySelector('.open-modal-btn');
    if (!button) return;
    card.addEventListener('click', event => {
      if (event.target.closest('button, a, input, select')) return;
      button.click();
    });
    card.addEventListener('keydown', event => {
      if ((event.key === 'Enter' || event.key === ' ') && event.target === card) { event.preventDefault(); button.click(); }
    });
  });

  // Fullscreen gallery with keyboard navigation and original images.
  const lightbox = document.getElementById('gallery-lightbox');
  if (lightbox) {
    const items = [...document.querySelectorAll('.gallery-open')];
    const image = document.getElementById('gallery-lightbox-image');
    const caption = document.getElementById('gallery-lightbox-caption');
    const count = document.getElementById('gallery-lightbox-count');
    const stage = lightbox.querySelector('.gallery-photo-stage');
    let active = 0, lastFocus = null, switchingTimer = null;
    function show(index, animate = false) {
      const next = (index + items.length) % items.length;
      if (switchingTimer) { clearTimeout(switchingTimer); switchingTimer = null; }
      const update = () => {
        active = next;
        const original = items[active].querySelector('img');
        image.src = original.getAttribute('src');
        image.alt = original.alt;
        caption.textContent = items[active].querySelector('.gallery-caption').textContent;
        count.textContent = `${active + 1} / ${items.length}`;
        image.classList.remove('gallery-switching');
      };
      if (animate && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        image.classList.add('gallery-switching');
        switchingTimer = setTimeout(() => { switchingTimer = null; update(); }, 130);
      } else update();
    }
    let touchStartX = null, touchStartY = null;
    stage.addEventListener('touchstart', e => {
      if (e.touches.length !== 1) return;
      touchStartX = e.touches[0].clientX; touchStartY = e.touches[0].clientY;
    }, { passive: true });
    stage.addEventListener('touchend', e => {
      if (touchStartX === null || !e.changedTouches.length) return;
      const dx = e.changedTouches[0].clientX - touchStartX;
      const dy = e.changedTouches[0].clientY - touchStartY;
      touchStartX = null; touchStartY = null;
      if (Math.abs(dx) > 55 && Math.abs(dx) > Math.abs(dy) * 1.3) show(active + (dx < 0 ? 1 : -1), true);
    }, { passive: true });
    function close() {
      lightbox.classList.remove('is-visible'); lightbox.setAttribute('aria-hidden', 'true');
      document.body.classList.remove('modal-open'); lastFocus?.focus();
    }
    items.forEach((item, index) => {
      function open() {
        lastFocus = document.activeElement; show(index);
        lightbox.classList.add('is-visible'); lightbox.setAttribute('aria-hidden', 'false');
        document.body.classList.add('modal-open'); lightbox.querySelector('.gallery-close').focus();
      }
      item.addEventListener('click', open);
      item.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(); } });
    });
    lightbox.querySelector('.gallery-close').addEventListener('click', close);
    lightbox.addEventListener('click', e => { if (e.target === lightbox) close(); });
    document.getElementById('gallery-prev').addEventListener('click', () => show(active - 1, true));
    document.getElementById('gallery-next').addEventListener('click', () => show(active + 1, true));
    document.addEventListener('keydown', e => {
      if (!lightbox.classList.contains('is-visible')) return;
      if (e.key === 'Escape') close();
      if (e.key === 'ArrowLeft') show(active - 1, true);
      if (e.key === 'ArrowRight') show(active + 1, true);
      if (e.key === 'Tab') { // Keep focus inside the open dialog.
        const controls = [...lightbox.querySelectorAll('button')];
        const first = controls[0], last = controls[controls.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    });
  }

  // Ratings and browser-local reviews. Passwords and emails are never stored.
  const form = document.getElementById('contact-form');
  const feed = document.getElementById('reviews-feed');
  if (form && feed) {
    const select = document.getElementById('rating-select');
    const picker = document.querySelector('.star-picker');
    const sort = document.getElementById('review-sort');
    const summary = document.getElementById('review-summary');
    const storageKey = 'kfc-assignment4-reviews-v1';
    const stars = n => {
      const rating = Math.max(0, Math.min(5, Math.round(Number(n) || 0)));
      return `<span class="star-filled">${'★'.repeat(rating)}</span>` +
             `<span class="star-empty">${'★'.repeat(5 - rating)}</span>`;
    };
    // OPTIONAL REVIEW PHOTOS: put images in images/avatars/ and set a path here.
    // Leave an empty string to display automatically generated initials instead.
    const reviewAvatars = {
      'Artem Saharov': 'images/avatars/artem.jpg',
      'Aruzhan S.': '',
      'Burmalda': 'images/avatars/burmalda.jpg'
    };
    function createReviewAvatar(name) {
      const avatar = document.createElement('span');
      avatar.className = 'review-avatar';
      avatar.setAttribute('aria-hidden', 'true');
      const parts = String(name || '').trim().split(/\s+/).filter(Boolean);
      const initials = (parts.length > 1 ? parts[0][0] + parts[parts.length - 1][0] : (parts[0] || '?').slice(0, 2)).toUpperCase();
      avatar.textContent = initials;
      const palette = [
        ['#fce7ea', '#c8102e'], ['#e7edf9', '#3157a5'],
        ['#f3e8ff', '#7e22ce'], ['#e3f4ed', '#19745b'],
        ['#fff0d9', '#995900']
      ];
      const hash = [...String(name || '')].reduce((n, ch) => n + ch.charCodeAt(0), 0);
      const [background, foreground] = palette[hash % palette.length];
      avatar.style.backgroundColor = background;
      avatar.style.color = foreground;
      const photo = reviewAvatars[name];
      if (photo) {
        const img = document.createElement('img');
        img.src = photo;
        img.alt = '';
        img.loading = 'lazy';
        img.onerror = () => img.remove(); // Missing photo: initials remain visible.
        avatar.append(img);
      }
      return avatar;
    }
    let chosen = 5;
    const stored = (() => { try { const a = JSON.parse(localStorage.getItem(storageKey) || '[]'); return Array.isArray(a) ? a.filter(x => x && typeof x.name === 'string' && typeof x.text === 'string' && Number.isInteger(x.rating) && x.rating >= 1 && x.rating <= 5).slice(0,100) : []; } catch { return []; } })();
    const defaults = [...feed.querySelectorAll('.feed-item')].map((el,i) => ({
      name: el.querySelector('.feed-author').textContent,
      text: el.querySelector('.feed-text').textContent.replace(/^"|"$/g,''),


      rating: (() => {
        const node = el.querySelector('.feed-stars');
        if (!node) return 0;
        if (node.hasAttribute('data-rating')) return Number(node.dataset.rating);
        const filled = node.querySelector('.stars-filled, .star-filled');
        if (filled) {
          if (filled.classList.contains('stars-filled')) return (filled.textContent.match(/[⭐★]/g) || []).length;
          return node.querySelectorAll('.star-filled').length;
        }
        return (node.textContent.match(/[⭐★]/g) || []).length;
      })(),
      date: el.querySelector('.feed-date').textContent,
      timestamp: new Date('2026-09-12T12:00:00').getTime() - i*86400000,
      seed: true
    }));
    const all = [...stored, ...defaults];
    function render() {
      const mode = sort.value;
      const ordered = [...all].sort((a,b) => mode === 'highest' ? b.rating-a.rating || b.timestamp-a.timestamp : mode === 'lowest' ? a.rating-b.rating || b.timestamp-a.timestamp : b.timestamp-a.timestamp);
      feed.replaceChildren();
      ordered.forEach(review => {
        const item = document.createElement('div'); item.className = 'feed-item';
        const header = document.createElement('div'); header.className = 'feed-header';
        const author = document.createElement('span'); author.className = 'feed-author'; author.textContent = review.name;
        const rating = document.createElement('span'); rating.className = 'feed-stars'; rating.dataset.rating = String(review.rating); rating.innerHTML = stars(review.rating); rating.setAttribute('aria-label', `${review.rating} out of 5 stars`);
        const body = document.createElement('p'); body.className = 'feed-text'; body.textContent = `"${review.text}"`;
        const date = document.createElement('span'); date.className = 'feed-date'; date.textContent = review.date;
        header.append(author,rating);
        const avatar = createReviewAvatar(review.name);
        const content = document.createElement('div'); content.className = 'review-content';
        content.append(header,body,date);
        item.append(avatar,content); feed.append(item);
      });
      const average = all.reduce((sum,x)=>sum+x.rating,0)/all.length;
      summary.textContent = `${average.toFixed(1)} ★ · ${all.length} reviews`;
    }
    function paintStars() {
      picker.querySelectorAll('button').forEach(b => {
        const selected = Number(b.dataset.rating) <= chosen;
        b.classList.toggle('selected', selected);
        b.setAttribute('aria-pressed', String(Number(b.dataset.rating) === chosen));
      });
      select.selectedIndex = 5-chosen;
    }
    picker.querySelectorAll('button').forEach(button => button.addEventListener('click', () => { chosen = Number(button.dataset.rating); paintStars(); }));
    select.addEventListener('change', () => { chosen = (select.value.match(/[⭐★]/g)||[]).length; paintStars(); });
    sort.addEventListener('change', render);
    // Validate once, then save and render a new review.
    form.addEventListener('submit', event => {
      event.preventDefault();
      const name = document.getElementById('author-name').value.trim();
      const email = document.getElementById('author-email');
      const message = document.getElementById('review-message');
      const password = document.getElementById('review-password');
      const confirm = document.getElementById('review-confirm-password');
      const error = document.getElementById('review-validation-message');
      const reviewText = message.value.trim();
      error.textContent = '';
      if (!name) { error.textContent = 'Please enter your name.'; return; }
      if (!email.value.trim() || !email.checkValidity()) { error.textContent = 'Please enter a valid email.'; return; }
      if (password.value.length < 8) { error.textContent = 'Password must contain at least 8 characters.'; return; }
      if (password.value !== confirm.value) { error.textContent = 'Passwords do not match.'; return; }
      if (!reviewText) { error.textContent = 'Please write your review.'; return; }
      const review = {
        name, text: reviewText, rating: chosen,
        date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
        timestamp: Date.now()
      };
      stored.unshift(review);
      if (stored.length > 100) stored.length = 100;
      all.unshift(review);
      try { localStorage.setItem(storageKey, JSON.stringify(stored)); }
      catch { showToast('Review added, but local saving is unavailable.', 'error'); }
      render();
      form.reset();
      chosen = 5;
      paintStars();
      showToast('Review submitted successfully!', 'success');
    });
    paintStars(); render();
  }
});

// 6. Student offer dialogs (demo only)
document.addEventListener('DOMContentLoaded', () => {
  const modal = document.getElementById('offer-modal');
  if (!modal) return;
  const offers = {
    calculus: {title:'Calculus Retake Relief', description:'A 50% student demo discount for a calculus retake. Enter your name and student ID to generate a sample coupon.', photo:'images/calculus-combo.jpg', code:'RETAKE50', label:'Student ID'},
    draft: {title:'Draft-Free Combo Bonus', description:'A free-combo demo offer for eligible adults. This is a fictional campus promotion, not an official eligibility check.', photo:'images/draft-free-combo.jpg', code:'DRAFTFREE', label:'Student / reference ID'},
    friends: {title:'Friends Bucket', description:'A 25% demo discount on a bucket shared with classmates. Enter your name and group reference to claim.', photo:'images/friends-bucket-combo.jpg', code:'FRIENDS25', label:'Group reference'}
  };
  const form = document.getElementById('offer-form');
  const result = document.getElementById('offer-result');
  const error = document.getElementById('offer-error');
  let current = 'calculus', previousFocus;
  function close(){ modal.classList.remove('is-visible'); modal.setAttribute('aria-hidden','true'); document.body.classList.remove('modal-open'); previousFocus?.focus(); }
  document.querySelectorAll('.offer-open').forEach(button=>button.addEventListener('click',()=>{
    current=button.dataset.offer; const offer=offers[current]; previousFocus=document.activeElement;
    document.getElementById('offer-title').textContent=offer.title;
    document.getElementById('offer-description').textContent=offer.description;
    document.getElementById('offer-photo').src=offer.photo;
    document.getElementById('offer-photo').alt=offer.title;
    document.getElementById('offer-id-label').textContent=offer.label;
    form.reset();form.hidden=false;result.hidden=true;error.textContent='';
    modal.classList.add('is-visible');modal.setAttribute('aria-hidden','false');document.body.classList.add('modal-open');document.getElementById('offer-close').focus();
  }));
  document.getElementById('offer-close').addEventListener('click',close);
  modal.addEventListener('click',e=>{if(e.target===modal)close();});
  document.addEventListener('keydown',e=>{if(!modal.classList.contains('is-visible'))return;if(e.key==='Escape')close();if(e.key==='Tab'){const controls=[...modal.querySelectorAll('button:not([hidden]),input:not([hidden])')].filter(x=>x.offsetParent!==null);const first=controls[0],last=controls[controls.length-1];if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus();}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus();}}});
  form.addEventListener('submit',e=>{e.preventDefault();const name=document.getElementById('offer-name').value.trim(),ref=document.getElementById('offer-id').value.trim();if(name.length<2||ref.length<2){error.textContent='Please enter your name and a reference of at least 2 characters.';return;}error.textContent='';document.getElementById('offer-code').textContent='Demo code: '+offers[current].code;form.hidden=true;result.hidden=false;document.getElementById('offer-add-cart').disabled=false;document.getElementById('offer-add-cart').textContent='Add offer to cart';});
  document.getElementById('offer-add-cart').addEventListener('click',()=>{const offer=offers[current];window.KFCCart.add({name:offer.title,price:null,options:['Demo coupon: '+offer.code],image:offer.photo,type:'offer',code:offer.code});document.getElementById('offer-add-cart').disabled=true;document.getElementById('offer-add-cart').textContent='Added to cart ✓';window.KFCCart.open();});
  document.getElementById('offer-copy').addEventListener('click',()=>{const code=offers[current].code;if(navigator.clipboard&&window.isSecureContext){navigator.clipboard.writeText(code).then(()=>{document.getElementById('offer-copy').textContent='Copied!';}).catch(()=>{document.getElementById('offer-copy').textContent='Code: '+code;});}else{document.getElementById('offer-copy').textContent='Code: '+code;}});
});
