// E-commerce Logic JavaScript

// State Management
const state = {
    products: [],
    cart: [],
    wishlist: [],
    currentCheckoutStep: 1,
    filters: {
        category: '',
        sort: 'name'
    }
};

// Sample product data
const sampleProducts = [
    {
        id: 1,
        name: 'Wireless Bluetooth Headphones',
        category: 'electronics',
        price: 89.99,
        originalPrice: 129.99,
        rating: 4.5,
        reviews: 234,
        image: 'https://via.placeholder.com/300x200',
        inStock: true,
        badge: 'sale'
    },
    {
        id: 2,
        name: 'Smart Watch Pro',
        category: 'electronics',
        price: 249.99,
        originalPrice: null,
        rating: 4.7,
        reviews: 512,
        image: 'https://via.placeholder.com/300x200',
        inStock: true,
        badge: 'new'
    },
    {
        id: 3,
        name: 'Organic Cotton T-Shirt',
        category: 'clothing',
        price: 24.99,
        originalPrice: null,
        rating: 4.2,
        reviews: 156,
        image: 'https://via.placeholder.com/300x200',
        inStock: true,
        badge: null
    },
    {
        id: 4,
        name: 'JavaScript Programming Book',
        category: 'books',
        price: 34.99,
        originalPrice: 49.99,
        rating: 4.8,
        reviews: 89,
        image: 'https://via.placeholder.com/300x200',
        inStock: true,
        badge: 'sale'
    },
    {
        id: 5,
        name: 'Yoga Mat Premium',
        category: 'home',
        price: 39.99,
        originalPrice: null,
        rating: 4.6,
        reviews: 178,
        image: 'https://via.placeholder.com/300x200',
        inStock: true,
        badge: null
    },
    {
        id: 6,
        name: 'Laptop Backpack',
        category: 'electronics',
        price: 54.99,
        originalPrice: 79.99,
        rating: 4.4,
        reviews: 267,
        image: 'https://via.placeholder.com/300x200',
        inStock: true,
        badge: 'sale'
    },
    {
        id: 7,
        name: 'Running Shoes',
        category: 'clothing',
        price: 89.99,
        originalPrice: null,
        rating: 4.7,
        reviews: 523,
        image: 'https://via.placeholder.com/300x200',
        inStock: false,
        badge: null
    },
    {
        id: 8,
        name: 'Kitchen Knife Set',
        category: 'home',
        price: 119.99,
        originalPrice: 169.99,
        rating: 4.6,
        reviews: 198,
        image: 'https://via.placeholder.com/300x200',
        inStock: true,
        badge: 'sale'
    }
];

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    // Load state from localStorage
    loadState();
    
    // Initialize products
    state.products = [...sampleProducts];
    
    // Render products
    renderProducts();
    
    // Update UI
    updateCartCount();
    updateWishlistCount();
    
    // Initialize event listeners
    initializeEventListeners();
}

function initializeEventListeners() {
    // Search
    document.getElementById('product-search').addEventListener('input', debounce(handleSearch, 300));
    
    // Filters
    document.getElementById('category-filter').addEventListener('change', handleFilterChange);
    document.getElementById('sort-filter').addEventListener('change', handleFilterChange);
    
    // Checkout form
    document.getElementById('checkout-form').addEventListener('submit', function(e) {
        e.preventDefault();
        if (state.currentCheckoutStep === 3) {
            placeOrder();
        }
    });
}

// Product Management
function renderProducts() {
    const container = document.getElementById('products-grid');
    let products = [...state.products];
    
    // Apply filters
    if (state.filters.category) {
        products = products.filter(p => p.category === state.filters.category);
    }
    
    // Apply search
    const searchTerm = document.getElementById('product-search').value.toLowerCase();
    if (searchTerm) {
        products = products.filter(p => 
            p.name.toLowerCase().includes(searchTerm) ||
            p.category.toLowerCase().includes(searchTerm)
        );
    }
    
    // Apply sorting
    products = sortProducts(products, state.filters.sort);
    
    // Render
    if (products.length === 0) {
        container.innerHTML = `
            <div class="col-12">
                <div class="empty-state">
                    <i class="fas fa-search"></i>
                    <h5>No products found</h5>
                    <p>Try adjusting your search or filters</p>
                </div>
            </div>
        `;
        return;
    }
    
    container.innerHTML = products.map(product => createProductCard(product)).join('');
}

function createProductCard(product) {
    const isInWishlist = state.wishlist.some(item => item.id === product.id);
    const discount = product.originalPrice ? 
        Math.round((1 - product.price / product.originalPrice) * 100) : 0;
    
    return `
        <div class="product-card">
            ${product.badge ? `<span class="product-badge ${product.badge}">${product.badge === 'sale' ? `-${discount}%` : 'New'}</span>` : ''}
            <div class="product-wishlist ${isInWishlist ? 'active' : ''}" onclick="toggleWishlistItem(${product.id})">
                <i class="fas fa-heart"></i>
            </div>
            <div class="product-image">
                <img src="${product.image}" alt="${product.name}">
            </div>
            <div class="product-info">
                <h3 class="product-title">${product.name}</h3>
                <p class="product-category">${product.category}</p>
                <div class="product-rating">
                    <span class="stars">${getStars(product.rating)}</span>
                    <span class="rating-count">(${product.reviews})</span>
                </div>
                <div class="product-price">
                    $${product.price}
                    ${product.originalPrice ? `<span class="original-price">$${product.originalPrice}</span>` : ''}
                </div>
                <div class="product-actions">
                    <button class="btn btn-primary" onclick="addToCart(${product.id})" ${!product.inStock ? 'disabled' : ''}>
                        <i class="fas fa-shopping-cart me-1"></i>
                        ${product.inStock ? 'Add to Cart' : 'Out of Stock'}
                    </button>
                    <button class="btn btn-outline-secondary" onclick="quickView(${product.id})">
                        <i class="fas fa-eye"></i>
                    </button>
                </div>
            </div>
        </div>
    `;
}

function sortProducts(products, sortBy) {
    switch (sortBy) {
        case 'name':
            return products.sort((a, b) => a.name.localeCompare(b.name));
        case 'price-low':
            return products.sort((a, b) => a.price - b.price);
        case 'price-high':
            return products.sort((a, b) => b.price - a.price);
        case 'rating':
            return products.sort((a, b) => b.rating - a.rating);
        default:
            return products;
    }
}

function handleSearch() {
    renderProducts();
}

function handleFilterChange() {
    state.filters.category = document.getElementById('category-filter').value;
    state.filters.sort = document.getElementById('sort-filter').value;
    renderProducts();
}

// Cart Management
function addToCart(productId) {
    const product = state.products.find(p => p.id === productId);
    if (!product || !product.inStock) return;
    
    const existingItem = state.cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity++;
    } else {
        state.cart.push({
            ...product,
            quantity: 1
        });
    }
    
    saveState();
    updateCartCount();
    renderCart();
    showToast(`${product.name} added to cart!`, 'success');
}

function removeFromCart(productId) {
    state.cart = state.cart.filter(item => item.id !== productId);
    saveState();
    updateCartCount();
    renderCart();
}

function updateQuantity(productId, quantity) {
    const item = state.cart.find(item => item.id === productId);
    if (item) {
        item.quantity = Math.max(1, quantity);
        saveState();
        renderCart();
    }
}

function clearCart() {
    if (confirm('Are you sure you want to clear your cart?')) {
        state.cart = [];
        saveState();
        updateCartCount();
        renderCart();
        showToast('Cart cleared', 'info');
    }
}

function renderCart() {
    const container = document.getElementById('cart-items');
    const summaryContainer = document.getElementById('cart-summary');
    
    if (state.cart.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-shopping-cart"></i>
                <h5>Your cart is empty</h5>
                <p>Add some products to get started!</p>
            </div>
        `;
        summaryContainer.innerHTML = '';
        return;
    }
    
    container.innerHTML = state.cart.map(item => createCartItem(item)).join('');
    
    // Calculate summary
    const subtotal = state.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const tax = subtotal * 0.08; // 8% tax
    const shipping = subtotal > 100 ? 0 : 9.99;
    const total = subtotal + tax + shipping;
    
    summaryContainer.innerHTML = `
        <h5>Order Summary</h5>
        <div class="summary-row">
            <span>Subtotal (${state.cart.reduce((sum, item) => sum + item.quantity, 0)} items)</span>
            <span>$${subtotal.toFixed(2)}</span>
        </div>
        <div class="summary-row">
            <span>Tax</span>
            <span>$${tax.toFixed(2)}</span>
        </div>
        <div class="summary-row">
            <span>Shipping</span>
            <span>${shipping === 0 ? 'FREE' : '$' + shipping.toFixed(2)}</span>
        </div>
        <div class="summary-row total">
            <span>Total</span>
            <span>$${total.toFixed(2)}</span>
        </div>
    `;
}

function createCartItem(item) {
    return `
        <div class="cart-item">
            <div class="item-image">
                <img src="${item.image}" alt="${item.name}">
            </div>
            <div class="item-details">
                <div class="item-name">${item.name}</div>
                <div class="item-price">$${item.price}</div>
                <div class="item-quantity">
                    <div class="quantity-control">
                        <button class="quantity-btn" onclick="updateQuantity(${item.id}, ${item.quantity - 1})">-</button>
                        <input type="number" class="quantity-input" value="${item.quantity}" 
                               onchange="updateQuantity(${item.id}, parseInt(this.value))" min="1">
                        <button class="quantity-btn" onclick="updateQuantity(${item.id}, ${item.quantity + 1})">+</button>
                    </div>
                </div>
            </div>
            <button class="item-remove" onclick="removeFromCart(${item.id})">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `;
}

// Wishlist Management
function toggleWishlistItem(productId) {
    const index = state.wishlist.findIndex(item => item.id === productId);
    
    if (index > -1) {
        state.wishlist.splice(index, 1);
        showToast('Removed from wishlist', 'info');
    } else {
        const product = state.products.find(p => p.id === productId);
        if (product) {
            state.wishlist.push(product);
            showToast('Added to wishlist!', 'success');
        }
    }
    
    saveState();
    updateWishlistCount();
    renderWishlist();
    renderProducts(); // Update product cards to show wishlist status
}

function renderWishlist() {
    const container = document.getElementById('wishlist-items');
    
    if (state.wishlist.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-heart"></i>
                <h5>Your wishlist is empty</h5>
                <p>Save items you love for later!</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = state.wishlist.map(item => `
        <div class="wishlist-item">
            <div class="item-image">
                <img src="${item.image}" alt="${item.name}">
            </div>
            <div class="item-details">
                <div class="item-name">${item.name}</div>
                <div class="item-price">$${item.price}</div>
                <div class="d-flex gap-2 mt-2">
                    <button class="btn btn-sm btn-primary" onclick="addToCart(${item.id})">
                        <i class="fas fa-shopping-cart me-1"></i>Add to Cart
                    </button>
                    <button class="btn btn-sm btn-outline-secondary" onclick="toggleWishlistItem(${item.id})">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

// UI Functions
function toggleCart() {
    const sidebar = document.getElementById('cart-sidebar');
    const overlay = document.getElementById('overlay');
    
    sidebar.classList.toggle('active');
    overlay.classList.toggle('active');
    
    if (sidebar.classList.contains('active')) {
        renderCart();
        closeWishlist();
    }
}

function toggleWishlist() {
    const sidebar = document.getElementById('wishlist-sidebar');
    const overlay = document.getElementById('overlay');
    
    sidebar.classList.toggle('active');
    overlay.classList.toggle('active');
    
    if (sidebar.classList.contains('active')) {
        renderWishlist();
        closeCart();
    }
}

function closeCart() {
    document.getElementById('cart-sidebar').classList.remove('active');
    document.getElementById('overlay').classList.remove('active');
}

function closeWishlist() {
    document.getElementById('wishlist-sidebar').classList.remove('active');
    document.getElementById('overlay').classList.remove('active');
}

function closeSidebars() {
    closeCart();
    closeWishlist();
}

function updateCartCount() {
    const count = state.cart.reduce((sum, item) => sum + item.quantity, 0);
    document.getElementById('cart-count').textContent = count;
}

function updateWishlistCount() {
    document.getElementById('wishlist-count').textContent = state.wishlist.length;
}

// Checkout Process
function proceedToCheckout() {
    if (state.cart.length === 0) {
        showToast('Your cart is empty!', 'warning');
        return;
    }
    
    closeCart();
    state.currentCheckoutStep = 1;
    updateCheckoutStep();
    
    const modal = new bootstrap.Modal(document.getElementById('checkoutModal'));
    modal.show();
}

function updateCheckoutStep() {
    // Update step indicators
    document.querySelectorAll('.step').forEach((step, index) => {
        const stepNum = index + 1;
        step.classList.toggle('active', stepNum === state.currentCheckoutStep);
        step.classList.toggle('completed', stepNum < state.currentCheckoutStep);
    });
    
    // Update step content
    document.querySelectorAll('.checkout-step').forEach(step => {
        step.classList.toggle('active', 
            parseInt(step.dataset.step) === state.currentCheckoutStep);
    });
    
    // Update buttons
    document.getElementById('prev-btn').style.display = 
        state.currentCheckoutStep > 1 ? 'inline-block' : 'none';
    document.getElementById('next-btn').style.display = 
        state.currentCheckoutStep < 3 ? 'inline-block' : 'none';
    document.getElementById('place-order-btn').style.display = 
        state.currentCheckoutStep === 3 ? 'inline-block' : 'none';
    
    // Generate order review for step 3
    if (state.currentCheckoutStep === 3) {
        generateOrderReview();
    }
}

function nextCheckoutStep() {
    if (state.currentCheckoutStep < 3) {
        // Validate current step
        if (validateCheckoutStep(state.currentCheckoutStep)) {
            state.currentCheckoutStep++;
            updateCheckoutStep();
        }
    }
}

function previousCheckoutStep() {
    if (state.currentCheckoutStep > 1) {
        state.currentCheckoutStep--;
        updateCheckoutStep();
    }
}

function validateCheckoutStep(step) {
    const form = document.getElementById('checkout-form');
    const currentStepDiv = form.querySelector(`.checkout-step[data-step="${step}"]`);
    const requiredFields = currentStepDiv.querySelectorAll('[required]');
    
    for (const field of requiredFields) {
        if (!field.value.trim()) {
            field.focus();
            showToast('Please fill in all required fields', 'warning');
            return false;
        }
    }
    
    // Additional validations
    if (step === 1) {
        const email = document.getElementById('email').value;
        if (!validateEmail(email)) {
            document.getElementById('email').focus();
            showToast('Please enter a valid email address', 'warning');
            return false;
        }
    }
    
    if (step === 2) {
        const cardNumber = document.getElementById('cardNumber').value.replace(/\s/g, '');
        if (cardNumber.length < 13 || cardNumber.length > 19) {
            document.getElementById('cardNumber').focus();
            showToast('Please enter a valid card number', 'warning');
            return false;
        }
    }
    
    return true;
}

function generateOrderReview() {
    const reviewContainer = document.getElementById('order-review');
    const subtotal = state.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const tax = subtotal * 0.08;
    const shipping = subtotal > 100 ? 0 : 9.99;
    const total = subtotal + tax + shipping;
    
    // Get shipping info
    const firstName = document.getElementById('firstName').value;
    const lastName = document.getElementById('lastName').value;
    const address = document.getElementById('address').value;
    const city = document.getElementById('city').value;
    const state = document.getElementById('state').value;
    const zip = document.getElementById('zip').value;
    
    reviewContainer.innerHTML = `
        <div class="order-summary">
            <h6>Shipping Address</h6>
            <p>${firstName} ${lastName}<br>
            ${address}<br>
            ${city}, ${state} ${zip}</p>
            
            <h6 class="mt-4">Order Items</h6>
            ${state.cart.map(item => `
                <div class="order-review-item">
                    <div class="review-item-image">
                        <img src="${item.image}" alt="${item.name}">
                    </div>
                    <div class="review-item-details">
                        <div class="review-item-name">${item.name}</div>
                        <div class="review-item-price">$${item.price} × ${item.quantity}</div>
                    </div>
                    <div class="review-item-price">
                        $${(item.price * item.quantity).toFixed(2)}
                    </div>
                </div>
            `).join('')}
            
            <div class="summary-row">
                <span>Subtotal</span>
                <span>$${subtotal.toFixed(2)}</span>
            </div>
            <div class="summary-row">
                <span>Tax</span>
                <span>$${tax.toFixed(2)}</span>
            </div>
            <div class="summary-row">
                <span>Shipping</span>
                <span>${shipping === 0 ? 'FREE' : '$' + shipping.toFixed(2)}</span>
            </div>
            <div class="summary-row total">
                <span>Total</span>
                <span>$${total.toFixed(2)}</span>
            </div>
        </div>
    `;
}

function placeOrder() {
    // Show loading
    const placeOrderBtn = document.getElementById('place-order-btn');
    const originalText = placeOrderBtn.innerHTML;
    placeOrderBtn.innerHTML = '<span class="loading"></span> Processing...';
    placeOrderBtn.disabled = true;
    
    // Simulate order processing
    setTimeout(() => {
        // Generate order number
        const orderNumber = 'ORD-' + Date.now().toString(36).toUpperCase();
        
        // Calculate total
        const subtotal = state.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const tax = subtotal * 0.08;
        const shipping = subtotal > 100 ? 0 : 9.99;
        const total = subtotal + tax + shipping;
        
        // Show success modal
        document.getElementById('order-details').innerHTML = `
            <div class="alert alert-success">
                <strong>Order Number:</strong> ${orderNumber}<br>
                <strong>Total Amount:</strong> $${total.toFixed(2)}<br>
                <strong>Estimated Delivery:</strong> 3-5 business days
            </div>
            <p class="text-muted">You will receive an email confirmation shortly.</p>
        `;
        
        // Close checkout modal
        bootstrap.Modal.getInstance(document.getElementById('checkoutModal')).hide();
        
        // Show success modal
        const successModal = new bootstrap.Modal(document.getElementById('orderSuccessModal'));
        successModal.show();
        
        // Clear cart
        state.cart = [];
        saveState();
        updateCartCount();
        
        // Reset button
        placeOrderBtn.innerHTML = originalText;
        placeOrderBtn.disabled = false;
        
        // Reset checkout step
        state.currentCheckoutStep = 1;
        
        // Log order (in real app, send to server)
        console.log('Order placed:', {
            orderNumber,
            items: state.cart,
            total,
            timestamp: new Date().toISOString()
        });
    }, 2000);
}

// Utility Functions
function quickView(productId) {
    const product = state.products.find(p => p.id === productId);
    if (product) {
        showToast(`Quick view: ${product.name}`, 'info');
        // In a real app, this would open a product detail modal
    }
}

function getStars(rating) {
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 >= 0.5 ? 1 : 0;
    const emptyStars = 5 - fullStars - halfStar;
    
    return '★'.repeat(fullStars) + (halfStar ? '☆' : '') + '☆'.repeat(emptyStars);
}

function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function showToast(message, type = 'info') {
    const toastContainer = document.querySelector('.toast-container') || createToastContainer();
    
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `
        <div class="toast-body">
            ${message}
            <button type="button" class="btn-close float-end" onclick="this.parentElement.parentElement.remove()"></button>
        </div>
    `;
    
    toastContainer.appendChild(toast);
    
    // Auto remove after 3 seconds
    setTimeout(() => {
        if (toast.parentElement) {
            toast.remove();
        }
    }, 3000);
}

function createToastContainer() {
    const container = document.createElement('div');
    container.className = 'toast-container';
    document.body.appendChild(container);
    return container;
}

// State Management
function saveState() {
    localStorage.setItem('ecommerce_state', JSON.stringify({
        cart: state.cart,
        wishlist: state.wishlist
    }));
}

function loadState() {
    const saved = localStorage.getItem('ecommerce_state');
    if (saved) {
        const data = JSON.parse(saved);
        state.cart = data.cart || [];
        state.wishlist = data.wishlist || [];
    }
}

// Utility function for debouncing
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Format card number input
document.addEventListener('DOMContentLoaded', function() {
    const cardNumberInput = document.getElementById('cardNumber');
    if (cardNumberInput) {
        cardNumberInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\s/g, '');
            let formattedValue = value.match(/.{1,4}/g)?.join(' ') || value;
            e.target.value = formattedValue;
        });
    }
    
    const expiryInput = document.getElementById('expiry');
    if (expiryInput) {
        expiryInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length >= 2) {
                value = value.slice(0, 2) + '/' + value.slice(2, 4);
            }
            e.target.value = value;
        });
    }
    
    const cvvInput = document.getElementById('cvv');
    if (cvvInput) {
        cvvInput.addEventListener('input', function(e) {
            e.target.value = e.target.value.replace(/\D/g, '').slice(0, 3);
        });
    }
});

// Keyboard shortcuts
document.addEventListener('keydown', function(e) {
    // Ctrl/Cmd + K to focus search
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        document.getElementById('product-search').focus();
    }
    
    // Escape to close sidebars
    if (e.key === 'Escape') {
        closeSidebars();
    }
});

// Export functions for global access
window.addToCart = addToCart;
window.toggleWishlistItem = toggleWishlistItem;
window.quickView = quickView;
window.toggleCart = toggleCart;
window.toggleWishlist = toggleWishlist;
window.clearCart = clearCart;
window.proceedToCheckout = proceedToCheckout;
window.nextCheckoutStep = nextCheckoutStep;
window.previousCheckoutStep = previousCheckoutStep;
window.placeOrder = placeOrder;
window.updateQuantity = updateQuantity;
window.removeFromCart = removeFromCart;
