document.addEventListener('DOMContentLoaded', () => {
    // --- Product Data ---
    const products = [
        { id: 1, name: 'MacBook Pro 16"', desc: 'M3 Max, 64GB RAM, 2TB SSD.', price: 3499, tag: 'New', icon: 'fa-laptop' },
        { id: 2, name: 'iPhone 15 Pro', desc: 'Titanium design. A17 Pro chip.', price: 999, tag: 'Bestseller', icon: 'fa-mobile-screen' },
        { id: 3, name: 'iPad Pro', desc: 'M2 chip. Brilliant display.', price: 799, icon: 'fa-tablet-screen-button' },
        { id: 4, name: 'AirPods Pro', desc: 'Active Noise Cancellation.', price: 249, icon: 'fa-headphones' },
        { id: 5, name: 'Apple Watch Ultra', desc: 'Rugged and capable.', price: 799, tag: 'New', icon: 'fa-clock' },
        { id: 6, name: 'Mac Studio', desc: 'Empower your studio.', price: 1999, icon: 'fa-desktop' },
    ];

    const productsGrid = document.getElementById('products-grid');
    const searchInput = document.getElementById('search-input');
    
    // --- Render Products ---
    function renderProducts(items) {
        productsGrid.innerHTML = '';
        if (items.length === 0) {
            productsGrid.innerHTML = '<p style="grid-column: 1/-1; text-align: center; color: #86868b;">No products found.</p>';
            return;
        }

        items.forEach(product => {
            const card = document.createElement('div');
            card.className = 'product-card';
            
            const tagHTML = product.tag ? `<span class="product-tag">${product.tag}</span>` : '';
            
            card.innerHTML = `
                ${tagHTML}
                <i class="fa-solid ${product.icon} product-icon"></i>
                <div class="product-info">
                    <h3 class="product-name">${product.name}</h3>
                    <p class="product-desc">${product.desc}</p>
                    <p class="product-price">$${product.price.toLocaleString()}</p>
                    <button class="btn-add" data-id="${product.id}">Add to Bag</button>
                </div>
            `;
            productsGrid.appendChild(card);
        });

        // Add to cart listeners
        document.querySelectorAll('.btn-add').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation(); // Prevent card click
                const id = parseInt(e.target.getAttribute('data-id'));
                addToCart(id);
            });
        });
    }

    renderProducts(products);

    // --- Search Overlay & Filtering ---
    const searchBtn = document.getElementById('search-btn');
    const closeSearchBtn = document.getElementById('close-search');
    const searchOverlay = document.getElementById('search-overlay');

    searchBtn.addEventListener('click', () => {
        searchOverlay.classList.add('active');
        setTimeout(() => searchInput.focus(), 100);
    });

    closeSearchBtn.addEventListener('click', () => {
        searchOverlay.classList.remove('active');
        searchInput.value = '';
        renderProducts(products);
    });

    searchInput.addEventListener('input', (e) => {
        const term = e.target.value.toLowerCase();
        const filtered = products.filter(p => p.name.toLowerCase().includes(term));
        renderProducts(filtered);
    });

    // --- Cart System ---
    let cart = [];
    const cartToggle = document.getElementById('cart-toggle');
    const cartSidebar = document.getElementById('cart-sidebar');
    const closeCartBtn = document.getElementById('close-cart');
    const cartOverlay = document.getElementById('cart-overlay');
    const cartItemsContainer = document.getElementById('cart-items');
    const cartBadge = document.getElementById('cart-badge');
    const cartTotalPrice = document.getElementById('cart-total-price');
    const checkoutBtn = document.getElementById('checkout-btn');

    function toggleCart() {
        cartSidebar.classList.toggle('open');
        cartOverlay.classList.toggle('show');
    }

    cartToggle.addEventListener('click', toggleCart);
    closeCartBtn.addEventListener('click', toggleCart);
    cartOverlay.addEventListener('click', toggleCart);

    function addToCart(id) {
        const product = products.find(p => p.id === id);
        if (product) {
            cart.push(product);
            updateCart();
            showToast(`${product.name} added to your bag.`);
        }
    }

    function removeFromCart(index) {
        cart.splice(index, 1);
        updateCart();
    }

    window.removeCartItem = removeFromCart; // Expose to HTML string onclick

    function updateCart() {
        cartBadge.textContent = cart.length;
        
        cartItemsContainer.innerHTML = '';
        if (cart.length === 0) {
            cartItemsContainer.innerHTML = '<p style="color: #86868b; text-align: center; margin-top: 2rem;">Your bag is empty.</p>';
            cartTotalPrice.textContent = '$0.00';
            checkoutBtn.disabled = true;
            checkoutBtn.style.opacity = '0.5';
            return;
        }

        checkoutBtn.disabled = false;
        checkoutBtn.style.opacity = '1';

        let total = 0;
        cart.forEach((item, index) => {
            total += item.price;
            const cartEl = document.createElement('div');
            cartEl.className = 'cart-item';
            cartEl.innerHTML = `
                <div class="cart-item-icon"><i class="fa-solid ${item.icon}"></i></div>
                <div class="cart-item-info">
                    <h4 class="cart-item-title">${item.name}</h4>
                    <p class="cart-item-price">$${item.price.toLocaleString()}</p>
                </div>
                <button class="cart-item-remove" onclick="removeCartItem(${index})"><i class="fas fa-trash"></i></button>
            `;
            cartItemsContainer.appendChild(cartEl);
        });

        cartTotalPrice.textContent = `$${total.toLocaleString()}`;
    }

    updateCart();

    // --- Toast Notifications ---
    const toastContainer = document.getElementById('toast-container');
    
    function showToast(message) {
        const toast = document.createElement('div');
        toast.className = 'toast';
        toast.innerHTML = `<i class="fas fa-check-circle"></i> <span>${message}</span>`;
        toastContainer.appendChild(toast);

        setTimeout(() => {
            toast.style.animation = 'fadeOut 0.3s ease forwards';
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }

    // --- Smooth Navbar Background ---
    const header = document.querySelector('.header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.style.borderBottom = '1px solid rgba(255,255,255,0.1)';
            header.style.background = 'rgba(0,0,0,0.85)';
        } else {
            header.style.borderBottom = '1px solid transparent';
            header.style.background = 'rgba(0,0,0,0.5)';
        }
    });
});
