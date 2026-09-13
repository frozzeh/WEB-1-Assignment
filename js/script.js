// KFC Kazakhstan — order modal & review feed logic
document.addEventListener('DOMContentLoaded', () => {
    const modal = document.getElementById('product-modal');
    const reviewForm = document.getElementById('contact-form');
    const feed = document.getElementById('reviews-feed');

    // Review form: prepend the new review to the feed
    if (reviewForm && feed) {
        reviewForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = document.getElementById('author-name').value;
            const stars = document.getElementById('rating-select').value;
            const text = document.getElementById('review-message').value;

            const item = document.createElement('div');
            item.className = 'feed-item';
            item.innerHTML = `
                <div class="feed-header">
                    <span class="feed-author">${name}</span>
                    <span class="feed-stars">${stars}</span>
                </div>
                <p class="feed-text">"${text}"</p>
                <span class="feed-date">Just now</span>`;
            feed.prepend(item);
            reviewForm.reset();
        });
    }

    // Dish customization modal (menu page only)
    if (modal) {
        const closeBtn = modal.querySelector('.close-btn');
        const openBtns = document.querySelectorAll('.open-modal-btn');
        const checkboxes = modal.querySelectorAll('.ingredient-item input');
        const nameEl = document.getElementById('modal-dish-name');
        const imgEl = document.getElementById('modal-dish-img');
        const totalEl = document.getElementById('modal-total-price');
        const cartBtn = document.getElementById('add-to-cart-btn');
        let basePrice = 0;

        const updatePrice = () => {
            let total = basePrice;
            checkboxes.forEach(cb => {
                if (cb.checked) total += parseInt(cb.dataset.addon || 0);
            });
            totalEl.textContent = total.toLocaleString();
        };

        openBtns.forEach(btn => btn.addEventListener('click', () => {
            basePrice = parseInt(btn.dataset.price);
            nameEl.textContent = btn.dataset.name;
            imgEl.src = btn.dataset.img;
            cartBtn.textContent = 'Add to Cart';
            cartBtn.style.backgroundColor = '';
            updatePrice();
            modal.style.display = 'flex';
        }));

        checkboxes.forEach(cb => cb.addEventListener('change', updatePrice));
        closeBtn.addEventListener('click', () => { modal.style.display = 'none'; });
        window.addEventListener('click', (e) => {
            if (e.target === modal) modal.style.display = 'none';
        });

        cartBtn.addEventListener('click', () => {
            cartBtn.textContent = 'Added! ✓';
            cartBtn.style.backgroundColor = '#2e7d32';
            setTimeout(() => { modal.style.display = 'none'; }, 500);
        });
    }
});