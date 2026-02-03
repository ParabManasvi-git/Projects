// Menu Items Data
const menuItems = [
    { id: 1, name: "Margherita Pizza", category: "pizza", price: 12.99, image: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400", desc: "Classic tomato and mozzarella" },
    { id: 2, name: "Pepperoni Pizza", category: "pizza", price: 14.99, image: "https://images.unsplash.com/photo-1628840042765-356cda07504e?w=400", desc: "Loaded with pepperoni slices" },
    { id: 3, name: "Cheese Burger", category: "burger", price: 9.99, image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400", desc: "Juicy beef patty with cheese" },
    { id: 4, name: "Chicken Burger", category: "burger", price: 10.99, image: "https://images.unsplash.com/photo-1606755962773-d324e0a13086?w=400", desc: "Crispy chicken with special sauce" },
    { id: 5, name: "Carbonara Pasta", category: "pasta", price: 13.99, image: "https://images.unsplash.com/photo-1612874742237-6526221588e3?w=400", desc: "Creamy pasta with bacon" },
    { id: 6, name: "Penne Arrabiata", category: "pasta", price: 11.99, image: "https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=400", desc: "Spicy tomato sauce pasta" },
    { id: 7, name: "Chocolate Cake", category: "dessert", price: 6.99, image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400", desc: "Rich chocolate layered cake" },
    { id: 8, name: "Tiramisu", category: "dessert", price: 7.99, image: "https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=400", desc: "Italian coffee-flavored dessert" }
];

// Global Variables
let cart = [];
let currentFilter = 'all';
let currentUser = null;
let selectedPaymentMethod = 'card';

// Login Functions
function handleLogin(e) {
    e.preventDefault();
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    
    // Simple validation (in real app, this would be server-side)
    if (email && password) {
        currentUser = { email: email, name: email.split('@')[0] };
        document.getElementById('loginPage').classList.add('hidden');
        document.getElementById('mainApp').classList.remove('hidden');
        document.getElementById('userInfo').textContent = `Hi, ${currentUser.name}!`;
        displayMenu();
    }
}

function showSignup() {
    alert('Signup feature would redirect to registration page. For demo, use any email/password to login.');
}

function handleLogout() {
    if (confirm('Are you sure you want to logout?')) {
        currentUser = null;
        cart = [];
        document.getElementById('mainApp').classList.add('hidden');
        document.getElementById('loginPage').classList.remove('hidden');
        document.getElementById('loginForm').reset();
    }
}

// Menu Functions
function displayMenu() {
    const grid = document.getElementById('menuGrid');
    const filtered = currentFilter === 'all' ? menuItems : menuItems.filter(item => item.category === currentFilter);
    
    grid.innerHTML = filtered.map(item => `
        <div class="menu-item">
            <img src="${item.image}" alt="${item.name}">
            <div class="menu-item-content">
                <span class="category-badge">${item.category}</span>
                <h3>${item.name}</h3>
                <p>${item.desc}</p>
                <div class="menu-item-footer">
                    <span class="price">$${item.price.toFixed(2)}</span>
                    <button class="add-btn" onclick="addToCart(${item.id})">Add to Cart</button>
                </div>
            </div>
        </div>
    `).join('');
}

function filterMenu(category) {
    currentFilter = category;
    document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
    displayMenu();
}

// Cart Functions
function addToCart(id) {
    const item = menuItems.find(i => i.id === id);
    const existing = cart.find(i => i.id === id);
    
    if (existing) {
        existing.quantity++;
    } else {
        cart.push({ ...item, quantity: 1 });
    }
    
    updateCart();
}

function updateCart() {
    document.getElementById('cartCount').textContent = cart.reduce((sum, item) => sum + item.quantity, 0);
    
    const cartItems = document.getElementById('cartItems');
    
    if (cart.length === 0) {
        cartItems.innerHTML = '<div class="empty-cart">Your cart is empty</div>';
        document.getElementById('cartTotal').textContent = '0.00';
        return;
    }
    
    cartItems.innerHTML = cart.map(item => `
        <div class="cart-item">
            <div class="cart-item-info">
                <strong>${item.name}</strong><br>
                <span style="color: #666;">$${item.price.toFixed(2)}</span>
            </div>
            <div class="cart-item-controls">
                <button class="qty-btn" onclick="changeQuantity(${item.id}, -1)">-</button>
                <span class="qty">${item.quantity}</span>
                <button class="qty-btn" onclick="changeQuantity(${item.id}, 1)">+</button>
                <button class="remove-btn" onclick="removeFromCart(${item.id})">Remove</button>
            </div>
        </div>
    `).join('');
    
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    document.getElementById('cartTotal').textContent = total.toFixed(2);
}

function changeQuantity(id, change) {
    const item = cart.find(i => i.id === id);
    if (item) {
        item.quantity += change;
        if (item.quantity <= 0) {
            removeFromCart(id);
        } else {
            updateCart();
        }
    }
}

function removeFromCart(id) {
    cart = cart.filter(i => i.id !== id);
    updateCart();
}

function toggleCart() {
    const modal = document.getElementById('cartModal');
    modal.style.display = modal.style.display === 'flex' ? 'none' : 'flex';
}

// Payment Functions
function proceedToPayment() {
    if (cart.length === 0) {
        alert('Your cart is empty!');
        return;
    }
    
    // Update payment summary
    const summary = document.getElementById('paymentSummary');
    summary.innerHTML = cart.map(item => `
        <div class="summary-item">
            <span>${item.name} x ${item.quantity}</span>
            <span>$${(item.price * item.quantity).toFixed(2)}</span>
        </div>
    `).join('');
    
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    document.getElementById('paymentTotal').textContent = total.toFixed(2);
    
    // Hide cart and main app, show payment
    document.getElementById('cartModal').style.display = 'none';
    document.getElementById('mainApp').classList.add('hidden');
    document.getElementById('paymentPage').classList.remove('hidden');
}

function selectPayment(method) {
    selectedPaymentMethod = method;
    document.querySelectorAll('.payment-method').forEach(pm => pm.classList.remove('selected'));
    event.currentTarget.classList.add('selected');
    
    // Show/hide card details
    const cardDetails = document.getElementById('cardDetails');
    if (method === 'card') {
        cardDetails.classList.add('show');
    } else {
        cardDetails.classList.remove('show');
    }
}

function backToMenu() {
    document.getElementById('paymentPage').classList.add('hidden');
    document.getElementById('mainApp').classList.remove('hidden');
}

function completePayment() {
    // Generate random order ID
    const orderId = 'ORD' + Math.random().toString(36).substr(2, 9).toUpperCase();
    document.getElementById('orderId').textContent = orderId;
    
    // Show success message
    document.getElementById('paymentPage').classList.add('hidden');
    document.getElementById('successMessage').style.display = 'block';
    
    // Clear cart
    cart = [];
    updateCart();
}

function closeSuccess() {
    document.getElementById('successMessage').style.display = 'none';
    document.getElementById('mainApp').classList.remove('hidden');
}