// Advanced Search Filters JavaScript

// Sample product data
const products = [
    {
        id: 1,
        name: "Wireless Bluetooth Headphones",
        category: "electronics",
        price: 89.99,
        originalPrice: 129.99,
        rating: 4.5,
        reviews: 234,
        location: "new-york",
        image: "https://via.placeholder.com/300x200",
        inStock: true,
        freeShipping: true,
        description: "Premium wireless headphones with noise cancellation"
    },
    {
        id: 2,
        name: "Organic Cotton T-Shirt",
        category: "clothing",
        price: 24.99,
        originalPrice: null,
        rating: 4.2,
        reviews: 156,
        location: "los-angeles",
        image: "https://via.placeholder.com/300x200",
        inStock: true,
        freeShipping: false,
        description: "Comfortable organic cotton t-shirt"
    },
    {
        id: 3,
        name: "JavaScript Programming Book",
        category: "books",
        price: 34.99,
        originalPrice: 49.99,
        rating: 4.8,
        reviews: 89,
        location: "chicago",
        image: "https://via.placeholder.com/300x200",
        inStock: true,
        freeShipping: true,
        description: "Complete guide to JavaScript programming"
    },
    {
        id: 4,
        name: "Smart Home Security Camera",
        category: "electronics",
        price: 149.99,
        originalPrice: null,
        rating: 4.3,
        reviews: 412,
        location: "houston",
        image: "https://via.placeholder.com/300x200",
        inStock: false,
        freeShipping: true,
        description: "HD security camera with night vision"
    },
    {
        id: 5,
        name: "Yoga Mat Premium",
        category: "sports",
        price: 39.99,
        originalPrice: 59.99,
        rating: 4.6,
        reviews: 178,
        location: "miami",
        image: "https://via.placeholder.com/300x200",
        inStock: true,
        freeShipping: false,
        description: "Non-slip yoga mat with carrying strap"
    },
    {
        id: 6,
        name: "Indoor Plant Collection",
        category: "home",
        price: 67.99,
        originalPrice: null,
        rating: 4.1,
        reviews: 92,
        location: "new-york",
        image: "https://via.placeholder.com/300x200",
        inStock: true,
        freeShipping: true,
        description: "Set of 3 low-maintenance indoor plants"
    },
    {
        id: 7,
        name: "Laptop Backpack",
        category: "electronics",
        price: 54.99,
        originalPrice: 79.99,
        rating: 4.4,
        reviews: 267,
        location: "los-angeles",
        image: "https://via.placeholder.com/300x200",
        inStock: true,
        freeShipping: true,
        description: "Waterproof laptop backpack with USB charging"
    },
    {
        id: 8,
        name: "Running Shoes",
        category: "sports",
        price: 89.99,
        originalPrice: null,
        rating: 4.7,
        reviews: 523,
        location: "chicago",
        image: "https://via.placeholder.com/300x200",
        inStock: true,
        freeShipping: false,
        description: "Professional running shoes with cushioning"
    },
    {
        id: 9,
        name: "Cooking Masterclass",
        category: "books",
        price: 29.99,
        originalPrice: 44.99,
        rating: 4.9,
        reviews: 145,
        location: "houston",
        image: "https://via.placeholder.com/300x200",
        inStock: true,
        freeShipping: true,
        description: "Learn professional cooking techniques"
    },
    {
        id: 10,
        name: "Denim Jeans Classic",
        category: "clothing",
        price: 79.99,
        originalPrice: null,
        rating: 4.0,
        reviews: 334,
        location: "miami",
        image: "https://via.placeholder.com/300x200",
        inStock: true,
        freeShipping: false,
        description: "Classic fit denim jeans"
    },
    {
        id: 11,
        name: "Kitchen Knife Set",
        category: "home",
        price: 119.99,
        originalPrice: 169.99,
        rating: 4.6,
        reviews: 198,
        location: "new-york",
        image: "https://via.placeholder.com/300x200",
        inStock: true,
        freeShipping: true,
        description: "Professional stainless steel knife set"
    },
    {
        id: 12,
        name: "Wireless Mouse",
        category: "electronics",
        price: 29.99,
        originalPrice: null,
        rating: 4.2,
        reviews: 445,
        location: "los-angeles",
        image: "https://via.placeholder.com/300x200",
        inStock: true,
        freeShipping: false,
        description: "Ergonomic wireless mouse with precision tracking"
    },
    {
        id: 13,
        name: "Winter Jacket",
        category: "clothing",
        price: 149.99,
        originalPrice: 199.99,
        rating: 4.5,
        reviews: 278,
        location: "chicago",
        image: "https://via.placeholder.com/300x200",
        inStock: false,
        freeShipping: true,
        description: "Warm winter jacket with hood"
    },
    {
        id: 14,
        name: "Garden Tools Set",
        category: "home",
        price: 44.99,
        originalPrice: null,
        rating: 4.3,
        reviews: 167,
        location: "houston",
        image: "https://via.placeholder.com/300x200",
        inStock: true,
        freeShipping: false,
        description: "Complete garden tools set with storage bag"
    },
    {
        id: 15,
        name: "Fitness Tracker",
        category: "sports",
        price: 69.99,
        originalPrice: 99.99,
        rating: 4.1,
        reviews: 389,
        location: "miami",
        image: "https://via.placeholder.com/300x200",
        inStock: true,
        freeShipping: true,
        description: "Waterproof fitness tracker with heart rate monitor"
    }
];

// Global state
let filteredProducts = [...products];
let currentView = 'grid';
let currentSort = 'relevance';
let currentPage = 1;
let productsPerPage = 9;

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeFilters();
    initializeEventListeners();
    renderProducts();
    updateCategoryCounts();
});

// Initialize filters
function initializeFilters() {
    // Set initial price slider
    const priceSlider = document.getElementById('price-slider');
    const maxPrice = Math.max(...products.map(p => p.price));
    priceSlider.max = maxPrice;
    priceSlider.value = maxPrice;
    document.getElementById('price-display').textContent = `$${maxPrice}`;
    document.getElementById('max-price').placeholder = maxPrice;
}

// Initialize event listeners
function initializeEventListeners() {
    // Search input
    document.getElementById('search-input').addEventListener('input', debounce(applyFilters, 300));
    
    // Category filters
    document.querySelectorAll('.category-filters input').forEach(checkbox => {
        checkbox.addEventListener('change', applyFilters);
    });
    
    // Price filters
    document.getElementById('min-price').addEventListener('input', debounce(applyFilters, 500));
    document.getElementById('max-price').addEventListener('input', debounce(applyFilters, 500));
    document.getElementById('price-slider').addEventListener('input', function() {
        document.getElementById('price-display').textContent = `$${this.value}`;
        document.getElementById('max-price').value = this.value;
        debounce(applyFilters, 300)();
    });
    
    // Rating filter
    document.querySelectorAll('input[name="rating"]').forEach(radio => {
        radio.addEventListener('change', applyFilters);
    });
    
    // Location filter
    document.getElementById('location').addEventListener('change', applyFilters);
    
    // Availability filters
    document.getElementById('in-stock').addEventListener('change', applyFilters);
    document.getElementById('free-shipping').addEventListener('change', applyFilters);
    
    // Sort select
    document.getElementById('sort-select').addEventListener('change', function() {
        currentSort = this.value;
        applyFilters();
    });
}

// Apply all filters
function applyFilters() {
    showLoading();
    
    setTimeout(() => {
        const searchTerm = document.getElementById('search-input').value.toLowerCase();
        const selectedCategories = Array.from(document.querySelectorAll('.category-filters input:checked'))
            .map(cb => cb.value);
        const minPrice = parseFloat(document.getElementById('min-price').value) || 0;
        const maxPrice = parseFloat(document.getElementById('max-price').value) || Infinity;
        const minRating = parseFloat(document.querySelector('input[name="rating"]:checked').value) || 0;
        const location = document.getElementById('location').value;
        const inStockOnly = document.getElementById('in-stock').checked;
        const freeShippingOnly = document.getElementById('free-shipping').checked;
        
        // Filter products
        filteredProducts = products.filter(product => {
            // Search filter
            const matchesSearch = product.name.toLowerCase().includes(searchTerm) ||
                                product.description.toLowerCase().includes(searchTerm);
            
            // Category filter
            const matchesCategory = selectedCategories.length === 0 || 
                                  selectedCategories.includes(product.category);
            
            // Price filter
            const matchesPrice = product.price >= minPrice && product.price <= maxPrice;
            
            // Rating filter
            const matchesRating = product.rating >= minRating;
            
            // Location filter
            const matchesLocation = !location || product.location === location;
            
            // Availability filters
            const matchesStock = !inStockOnly || product.inStock;
            const matchesShipping = !freeShippingOnly || product.freeShipping;
            
            return matchesSearch && matchesCategory && matchesPrice && 
                   matchesRating && matchesLocation && matchesStock && matchesShipping;
        });
        
        // Sort products
        sortProducts();
        
        // Update UI
        updateActiveFilters();
        updateResultCount();
        renderProducts();
        hideLoading();
    }, 300);
}

// Sort products
function sortProducts() {
    switch (currentSort) {
        case 'price-low':
            filteredProducts.sort((a, b) => a.price - b.price);
            break;
        case 'price-high':
            filteredProducts.sort((a, b) => b.price - a.price);
            break;
        case 'rating':
            filteredProducts.sort((a, b) => b.rating - a.rating);
            break;
        case 'name':
            filteredProducts.sort((a, b) => a.name.localeCompare(b.name));
            break;
        case 'newest':
            filteredProducts.sort((a, b) => b.id - a.id);
            break;
        default: // relevance
            // Keep original order or implement relevance scoring
            break;
    }
}

// Render products
function renderProducts() {
    const container = document.getElementById('results-container');
    const noResults = document.getElementById('no-results');
    
    if (filteredProducts.length === 0) {
        container.innerHTML = '';
        noResults.style.display = 'block';
        return;
    }
    
    noResults.style.display = 'none';
    
    // Pagination
    const startIndex = (currentPage - 1) * productsPerPage;
    const endIndex = startIndex + productsPerPage;
    const paginatedProducts = filteredProducts.slice(startIndex, endIndex);
    
    // Render products based on view
    if (currentView === 'grid') {
        container.className = 'results-grid';
        container.innerHTML = paginatedProducts.map(product => createProductCard(product)).join('');
    } else {
        container.className = 'results-list';
        container.innerHTML = paginatedProducts.map(product => createProductListItem(product)).join('');
    }
    
    // Update pagination
    updatePagination();
}

// Create product card HTML
function createProductCard(product) {
    const discount = product.originalPrice ? 
        Math.round((1 - product.price / product.originalPrice) * 100) : 0;
    
    return `
        <div class="product-card" onclick="showProductDetails(${product.id})">
            ${discount > 0 ? `<span class="badge bg-danger">-${discount}%</span>` : ''}
            ${!product.inStock ? '<span class="badge bg-secondary">Out of Stock</span>' : ''}
            <div class="product-image">
                <img src="${product.image}" alt="${product.name}">
            </div>
            <div class="product-info">
                <h3 class="product-title">${product.name}</h3>
                <p class="product-category">${getCategoryName(product.category)}</p>
                <div class="product-rating">
                    <span class="stars">${getStars(product.rating)}</span>
                    <span class="rating-count">(${product.reviews})</span>
                </div>
                <div class="product-price">
                    $${product.price}
                    ${product.originalPrice ? `<span class="original-price">$${product.originalPrice}</span>` : ''}
                </div>
                <p class="product-location">
                    <i class="fas fa-map-marker-alt me-1"></i>
                    ${getLocationName(product.location)}
                </p>
                <div class="product-actions">
                    <button class="btn btn-primary btn-sm" onclick="event.stopPropagation(); addToCart(${product.id})">
                        <i class="fas fa-shopping-cart me-1"></i>Add to Cart
                    </button>
                    <button class="btn btn-outline-secondary btn-sm" onclick="event.stopPropagation(); addToWishlist(${product.id})">
                        <i class="fas fa-heart"></i>
                    </button>
                </div>
            </div>
        </div>
    `;
}

// Create product list item HTML
function createProductListItem(product) {
    const discount = product.originalPrice ? 
        Math.round((1 - product.price / product.originalPrice) * 100) : 0;
    
    return `
        <div class="product-card" onclick="showProductDetails(${product.id})">
            <div class="product-image">
                <img src="${product.image}" alt="${product.name}">
            </div>
            <div class="product-info">
                <div>
                    <h3 class="product-title">${product.name}</h3>
                    <p class="product-category">${getCategoryName(product.category)}</p>
                    <div class="product-rating">
                        <span class="stars">${getStars(product.rating)}</span>
                        <span class="rating-count">(${product.reviews})</span>
                    </div>
                    <p class="product-location">
                        <i class="fas fa-map-marker-alt me-1"></i>
                        ${getLocationName(product.location)}
                    </p>
                </div>
                <div>
                    <div class="product-price">
                        $${product.price}
                        ${product.originalPrice ? `<span class="original-price">$${product.originalPrice}</span>` : ''}
                    </div>
                    ${product.freeShipping ? '<span class="badge bg-success">Free Shipping</span>' : ''}
                </div>
            </div>
            <div class="product-actions">
                <button class="btn btn-primary btn-sm" onclick="event.stopPropagation(); addToCart(${product.id})">
                    <i class="fas fa-shopping-cart me-1"></i>Add to Cart
                </button>
                <button class="btn btn-outline-secondary btn-sm" onclick="event.stopPropagation(); addToWishlist(${product.id})">
                    <i class="fas fa-heart"></i>
                </button>
            </div>
        </div>
    `;
}

// Show product details modal
function showProductDetails(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    const modalTitle = document.getElementById('modal-product-title');
    const modalContent = document.getElementById('modal-product-content');
    
    modalTitle.textContent = product.name;
    modalContent.innerHTML = `
        <div class="row">
            <div class="col-md-6">
                <img src="${product.image}" alt="${product.name}" class="img-fluid rounded">
            </div>
            <div class="col-md-6">
                <h4>${product.name}</h4>
                <p class="text-muted">${getCategoryName(product.category)}</p>
                <div class="product-rating mb-3">
                    <span class="stars">${getStars(product.rating)}</span>
                    <span class="rating-count">(${product.reviews} reviews)</span>
                </div>
                <div class="product-price mb-3">
                    <h3>$${product.price}</h3>
                    ${product.originalPrice ? `<span class="original-price">$${product.originalPrice}</span>` : ''}
                </div>
                <p>${product.description}</p>
                <div class="mb-3">
                    <p class="mb-1"><i class="fas fa-map-marker-alt me-2"></i>${getLocationName(product.location)}</p>
                    <p class="mb-1"><i class="fas fa-truck me-2"></i>${product.freeShipping ? 'Free Shipping' : 'Shipping charges apply'}</p>
                    <p class="mb-1"><i class="fas fa-check-circle me-2"></i>${product.inStock ? 'In Stock' : 'Out of Stock'}</p>
                </div>
                <div class="d-flex gap-2">
                    <button class="btn btn-primary" onclick="addToCart(${product.id})">
                        <i class="fas fa-shopping-cart me-2"></i>Add to Cart
                    </button>
                    <button class="btn btn-outline-secondary" onclick="addToWishlist(${product.id})">
                        <i class="fas fa-heart me-2"></i>Add to Wishlist
                    </button>
                </div>
            </div>
        </div>
    `;
    
    const modal = new bootstrap.Modal(document.getElementById('productModal'));
    modal.show();
}

// Utility functions
function getCategoryName(category) {
    const names = {
        electronics: 'Electronics',
        clothing: 'Clothing',
        books: 'Books',
        home: 'Home & Garden',
        sports: 'Sports'
    };
    return names[category] || category;
}

function getLocationName(location) {
    const names = {
        'new-york': 'New York',
        'los-angeles': 'Los Angeles',
        'chicago': 'Chicago',
        'houston': 'Houston',
        'miami': 'Miami'
    };
    return names[location] || location;
}

function getStars(rating) {
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 >= 0.5 ? 1 : 0;
    const emptyStars = 5 - fullStars - halfStar;
    
    return '★'.repeat(fullStars) + (halfStar ? '☆' : '') + '☆'.repeat(emptyStars);
}

// Update functions
function updateResultCount() {
    document.getElementById('result-count').textContent = filteredProducts.length;
}

function updateCategoryCounts() {
    const counts = {};
    products.forEach(product => {
        counts[product.category] = (counts[product.category] || 0) + 1;
    });
    
    document.querySelectorAll('.category-filters .form-check').forEach(checkbox => {
        const category = checkbox.querySelector('input').value;
        const count = checkbox.querySelector('.text-muted');
        if (count) {
            count.textContent = `(${counts[category] || 0})`;
        }
    });
}

function updateActiveFilters() {
    const container = document.getElementById('active-filters-list');
    const activeFilters = [];
    
    // Search term
    const search = document.getElementById('search-input').value;
    if (search) {
        activeFilters.push({ type: 'search', value: search, label: `Search: ${search}` });
    }
    
    // Categories
    document.querySelectorAll('.category-filters input:checked').forEach(checkbox => {
        activeFilters.push({
            type: 'category',
            value: checkbox.value,
            label: getCategoryName(checkbox.value)
        });
    });
    
    // Price range
    const minPrice = document.getElementById('min-price').value;
    const maxPrice = document.getElementById('max-price').value;
    if (minPrice || maxPrice) {
        const label = `Price: $${minPrice || 0} - $${maxPrice || '∞'}`;
        activeFilters.push({ type: 'price', value: `${minPrice}-${maxPrice}`, label });
    }
    
    // Rating
    const rating = document.querySelector('input[name="rating"]:checked').value;
    if (rating) {
        activeFilters.push({
            type: 'rating',
            value: rating,
            label: `Rating: ${getStars(parseFloat(rating))}+`
        });
    }
    
    // Location
    const location = document.getElementById('location').value;
    if (location) {
        activeFilters.push({
            type: 'location',
            value: location,
            label: getLocationName(location)
        });
    }
    
    // Render active filters
    container.innerHTML = activeFilters.map(filter => `
        <span class="filter-tag">
            ${filter.label}
            <span class="remove-filter" onclick="removeFilter('${filter.type}', '${filter.value}')">×</span>
        </span>
    `).join('');
}

function updatePagination() {
    const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
    const pagination = document.getElementById('pagination');
    
    if (totalPages <= 1) {
        pagination.style.display = 'none';
        return;
    }
    
    pagination.style.display = 'block';
    
    let paginationHTML = `
        <ul class="pagination justify-content-center">
            <li class="page-item ${currentPage === 1 ? 'disabled' : ''}">
                <a class="page-link" href="#" onclick="changePage(${currentPage - 1})">Previous</a>
            </li>
    `;
    
    for (let i = 1; i <= Math.min(totalPages, 5); i++) {
        paginationHTML += `
            <li class="page-item ${i === currentPage ? 'active' : ''}">
                <a class="page-link" href="#" onclick="changePage(${i})">${i}</a>
            </li>
        `;
    }
    
    paginationHTML += `
            <li class="page-item ${currentPage === totalPages ? 'disabled' : ''}">
                <a class="page-link" href="#" onclick="changePage(${currentPage + 1})">Next</a>
            </li>
        </ul>
    `;
    
    pagination.innerHTML = paginationHTML;
}

// Filter management
function removeFilter(type, value) {
    switch (type) {
        case 'search':
            document.getElementById('search-input').value = '';
            break;
        case 'category':
            document.querySelector(`.category-filters input[value="${value}"]`).checked = false;
            break;
        case 'price':
            document.getElementById('min-price').value = '';
            document.getElementById('max-price').value = '';
            document.getElementById('price-slider').value = document.getElementById('price-slider').max;
            document.getElementById('price-display').textContent = `$${document.getElementById('price-slider').max}`;
            break;
        case 'rating':
            document.getElementById('rating-all').checked = true;
            break;
        case 'location':
            document.getElementById('location').value = '';
            break;
    }
    
    applyFilters();
}

function resetFilters() {
    // Reset all filter controls
    document.getElementById('search-input').value = '';
    document.querySelectorAll('.category-filters input').forEach(cb => cb.checked = false);
    document.getElementById('min-price').value = '';
    document.getElementById('max-price').value = '';
    document.getElementById('price-slider').value = document.getElementById('price-slider').max;
    document.getElementById('price-display').textContent = `$${document.getElementById('price-slider').max}`;
    document.getElementById('rating-all').checked = true;
    document.getElementById('location').value = '';
    document.getElementById('in-stock').checked = false;
    document.getElementById('free-shipping').checked = false;
    document.getElementById('sort-select').value = 'relevance';
    
    currentSort = 'relevance';
    currentPage = 1;
    
    applyFilters();
}

// View management
function setView(view) {
    currentView = view;
    
    // Update button states
    document.getElementById('grid-view').classList.toggle('active', view === 'grid');
    document.getElementById('list-view').classList.toggle('active', view === 'list');
    
    renderProducts();
}

// Pagination
function changePage(page) {
    const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
    if (page < 1 || page > totalPages) return;
    
    currentPage = page;
    renderProducts();
    
    // Scroll to top of results
    document.getElementById('results-container').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// Cart and wishlist functions
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    showNotification(`${product.name} added to cart!`, 'success');
    
    // In a real app, this would update the cart state
    console.log('Added to cart:', product);
}

function addToWishlist(productId) {
    const product = products.find(p => p.id === productId);
    showNotification(`${product.name} added to wishlist!`, 'info');
    
    // In a real app, this would update the wishlist state
    console.log('Added to wishlist:', product);
}

// Loading state
function showLoading() {
    document.getElementById('loading-state').style.display = 'block';
    document.getElementById('results-container').style.opacity = '0.5';
}

function hideLoading() {
    document.getElementById('loading-state').style.display = 'none';
    document.getElementById('results-container').style.opacity = '1';
}

// Notification system
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 20px;
        border-radius: 8px;
        color: white;
        font-weight: 500;
        z-index: 10000;
        max-width: 300px;
        box-shadow: 0 5px 15px rgba(0,0,0,0.3);
        transform: translateX(100%);
        transition: transform 0.3s ease;
    `;
    
    const colors = {
        success: '#28a745',
        error: '#dc3545',
        warning: '#ffc107',
        info: '#17a2b8'
    };
    notification.style.background = colors[type] || colors.info;
    
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 3000);
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

// Keyboard navigation
document.addEventListener('keydown', function(e) {
    // Focus search on Ctrl+K or Cmd+K
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        document.getElementById('search-input').focus();
    }
    
    // Clear filters on Escape
    if (e.key === 'Escape') {
        resetFilters();
    }
    
    // Navigate pagination with arrow keys
    if (e.key === 'ArrowLeft') {
        changePage(currentPage - 1);
    } else if (e.key === 'ArrowRight') {
        changePage(currentPage + 1);
    }
});
