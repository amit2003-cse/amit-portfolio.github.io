document.addEventListener('DOMContentLoaded', () => {
    // --- Product Data ---
    const products = [
        { id: 1, name: 'Apple iPhone 15 (128 GB) - Pink', price: 60999, image: 'https://m.media-amazon.com/images/I/71v2jVh6nIL._AC_UY218_.jpg' },
        { id: 2, name: 'Smart Watch Pro', price: 39999, image: 'https://m.media-amazon.com/images/I/61MCwIFvKuL._SX679_.jpg' },
        { id: 3, name: 'Apple AirPods 4 Wireless Earbuds', price: 12764, image: 'https://m.media-amazon.com/images/I/31GYay3meDL._SX300_SY300_QL70_FMwebp_.jpg' },
        { id: 4, name: 'Apple 2024 MacBook Pro Laptop with M4 Max chip', price: 297490, image: 'https://m.media-amazon.com/images/I/61eA9PkZ07L._AC_UY218_.jpg' }
    ];

    // --- Local Storage ---
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    let wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];

    // --- DOM Elements ---
    const productsGrid = document.getElementById('products-grid');
    const cartCount = document.querySelector('.cart-count');
    const cartSidebar = document.getElementById('cart-sidebar');
    const cartItemsContainer = document.querySelector('.cart-items');
    const cartTotalElement = document.getElementById('cart-total');
    const searchInput = document.getElementById('search-input');
    const darkModeToggle = document.getElementById('dark-mode-toggle');
    const cartIcon = document.getElementById('cart-icon');
    const closeCartButton = document.getElementById('close-cart');
    const wishlistIcon = document.getElementById('wishlist-icon');
    const wishlistSidebar = document.getElementById('wishlist-sidebar');
    const wishlistItemsContainer = document.querySelector('.wishlist-items');
    const closeWishlistButton = document.getElementById('close-wishlist');
    const wishlistCount = document.querySelector('.wishlist-count'); // Fixed variable declaration

    // --- Dark Mode ---
    if (localStorage.getItem('darkMode') === 'enabled') {
        document.body.classList.add('dark-mode');
    }

    darkModeToggle.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
        localStorage.setItem('darkMode', document.body.classList.contains('dark-mode') ? 'enabled' : 'disabled');
    });

    // --- Initial Setup ---
    renderProducts(products);
    updateCartDisplay();
    updateCartCount();
    updateWishlistDisplay();
    updateWishlistCount();

    // --- Event Listeners ---
    cartIcon.addEventListener('click', toggleCart);
    closeCartButton.addEventListener('click', toggleCart);
    wishlistIcon.addEventListener('click', toggleWishlist);
    closeWishlistButton.addEventListener('click', toggleWishlist);
    searchInput.addEventListener('input', handleSearch);

    // --- Cart Functions ---
    function renderProducts(productsArray) {
        productsGrid.innerHTML = '';
        productsArray.forEach(product => {
            const isInWishlist = wishlist.some(item => item.id === product.id);
            const productCard = document.createElement('div');
            productCard.classList.add('product-card');
            productCard.innerHTML = `
                <img src="${product.image}" alt="${product.name}" class="product-image" loading="lazy">
                <h3 class="product-title">${product.name}</h3>
                <p class="product-price">₹${product.price.toLocaleString()}</p>
                <button class="add-to-cart" data-id="${product.id}">Add to Cart</button>
                <button class="add-to-wishlist ${isInWishlist ? 'in-wishlist' : ''}" data-id="${product.id}">
                    <i class="fas fa-heart"></i>
                </button>
            `;
            productsGrid.appendChild(productCard);
        });

        document.querySelectorAll('.add-to-cart').forEach(button => 
            button.addEventListener('click', addToCart));
        document.querySelectorAll('.add-to-wishlist').forEach(button => 
            button.addEventListener('click', addToWishlist));
    }

    function addToCart(event) {
        const productId = parseInt(event.currentTarget.dataset.id);
        const product = products.find(p => p.id === productId);

        if (product) {
            const existingItem = cart.find(item => item.id === productId);
            existingItem ? existingItem.quantity++ : cart.push({ ...product, quantity: 1 });
            updateCartDisplay();
            updateCartCount();
            saveCartToLocalStorage();
        }
    }

    function removeFromCart(productId) {
        cart = cart.filter(item => item.id !== productId);
        updateCartDisplay();
        updateCartCount();
        saveCartToLocalStorage();
    }

    function updateCartDisplay() {
        cartItemsContainer.innerHTML = '';
        let total = 0;

        cart.forEach(item => {
            total += item.price * item.quantity;
            const cartItem = document.createElement('div');
            cartItem.classList.add('cart-item');
            cartItem.innerHTML = `
                <img src="${item.image}" alt="${item.name}">
                <div class="cart-item-info">
                    <h4>${item.name}</h4>
                    <p>₹${item.price.toLocaleString()} x ${item.quantity}</p>
                    <div class="quantity-controls">
                        <button class="decrease-quantity" data-id="${item.id}">-</button>
                        <span>${item.quantity}</span>
                        <button class="increase-quantity" data-id="${item.id}">+</button>
                    </div>
                </div>
                <button class="remove-item" data-id="${item.id}">×</button>
            `;
            cartItemsContainer.appendChild(cartItem);
        });

        cartTotalElement.textContent = `₹${total.toLocaleString()}`;

        // Event delegation for dynamic elements
        cartItemsContainer.addEventListener('click', (e) => {
            const productId = parseInt(e.target.dataset.id);
            if (!productId) return;

            if (e.target.classList.contains('remove-item')) {
                removeFromCart(productId);
            } else if (e.target.classList.contains('increase-quantity')) {
                updateQuantity(productId, 1);
            } else if (e.target.classList.contains('decrease-quantity')) {
                updateQuantity(productId, -1);
            }
        });
    }

    function updateQuantity(productId, change) {
        const item = cart.find(item => item.id === productId);
        if (!item) return;

        item.quantity += change;
        if (item.quantity <= 0) {
            removeFromCart(productId);
        } else {
            updateCartDisplay();
            saveCartToLocalStorage();
        }
    }

    function updateCartCount() {
        cartCount.textContent = cart.reduce((sum, item) => sum + item.quantity, 0);
    }

    function saveCartToLocalStorage() {
        localStorage.setItem('cart', JSON.stringify(cart));
    }

    // --- Wishlist Functions ---
    function addToWishlist(event) {
        const productId = parseInt(event.currentTarget.dataset.id);
        const product = products.find(p => p.id === productId);
        const wishlistButton = event.currentTarget;

        if (product && !wishlist.some(item => item.id === productId)) {
            wishlist.push(product);
            wishlistButton.classList.add('in-wishlist');
            updateWishlistDisplay();
            updateWishlistCount();
            saveWishlistToLocalStorage();
        }
    }

    function removeFromWishlist(productId) {
        wishlist = wishlist.filter(item => item.id !== productId);
        document.querySelector(`.add-to-wishlist[data-id="${productId}"]`)
            ?.classList.remove('in-wishlist');
        updateWishlistDisplay();
        updateWishlistCount();
        saveWishlistToLocalStorage();
    }

    function updateWishlistDisplay() {
        wishlistItemsContainer.innerHTML = '';
        wishlist.forEach(item => {
            const wishlistItem = document.createElement('div');
            wishlistItem.classList.add('wishlist-item');
            wishlistItem.innerHTML = `
                <img src="${item.image}" alt="${item.name}">
                <div class="wishlist-item-info">
                    <h4>${item.name}</h4>
                    <p>₹${item.price.toLocaleString()}</p>
                </div>
                <button class="remove-wishlist-item" data-id="${item.id}">×</button>
            `;
            wishlistItemsContainer.appendChild(wishlistItem);
        });

        wishlistItemsContainer.addEventListener('click', (e) => {
            if (e.target.classList.contains('remove-wishlist-item')) {
                removeFromWishlist(parseInt(e.target.dataset.id));
            }
        });
    }

    function updateWishlistCount() {
        wishlistCount.textContent = wishlist.length;
    }

    function saveWishlistToLocalStorage() {
        localStorage.setItem('wishlist', JSON.stringify(wishlist));
    }

    // --- UI Functions ---
    function toggleCart() {
        cartSidebar.classList.toggle('active');
        wishlistSidebar.classList.remove('active');
    }

    function toggleWishlist() {
        wishlistSidebar.classList.toggle('active');
        cartSidebar.classList.remove('active');
    }

    function handleSearch() {
        const searchTerm = searchInput.value.toLowerCase().trim();
        
        // If search term is empty, show all products
        if (!searchTerm) {
            renderProducts(products);
            return;
        }
    
        // Filter products based on search term
        const filteredProducts = products.filter(product => 
            product.name.toLowerCase().includes(searchTerm)
        );
    
        // Render filtered products or show a message if none found
        if (filteredProducts.length > 0) {
            renderProducts(filteredProducts);
        } else {
            productsGrid.innerHTML = `<p class="no-results">No products found for "${searchTerm}"</p>`;
        }
    }

    // --- Click Outside Handler ---
    document.addEventListener('click', (e) => {
        if (!cartSidebar.contains(e.target) && !cartIcon.contains(e.target)) {
            cartSidebar.classList.remove('active');
        }
        if (!wishlistSidebar.contains(e.target) && !wishlistIcon.contains(e.target)) {
            wishlistSidebar.classList.remove('active');
        }
    });
});