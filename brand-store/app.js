/* NovaWear Store – Vanilla JS SPA */

const state = {
	products: [],
	filteredProducts: [],
	categories: new Set(),
	cart: loadCartFromStorage(),
	activeFilters: { query: '', category: 'all', maxPrice: 200 }
};

const elements = {
	year: document.getElementById('year'),
	searchInput: document.getElementById('searchInput'),
	categoryFilter: document.getElementById('categoryFilter'),
	priceRange: document.getElementById('priceRange'),
	priceRangeValue: document.getElementById('priceRangeValue'),
	clearFiltersBtn: document.getElementById('clearFiltersBtn'),
	productsGrid: document.getElementById('productsGrid'),
	productModal: document.getElementById('productModal'),
	modalBody: document.getElementById('modalBody'),
	closeProductModal: document.getElementById('closeProductModal'),
	openCartBtn: document.getElementById('openCartBtn'),
	cartDrawer: document.getElementById('cartDrawer'),
	closeCartBtn: document.getElementById('closeCartBtn'),
	drawerBackdrop: document.getElementById('drawerBackdrop'),
	cartItems: document.getElementById('cartItems'),
	cartSubtotal: document.getElementById('cartSubtotal'),
	cartCount: document.getElementById('cartCount'),
	checkoutBtn: document.getElementById('checkoutBtn'),
	checkoutModal: document.getElementById('checkoutModal'),
	closeCheckoutModal: document.getElementById('closeCheckoutModal'),
	checkoutForm: document.getElementById('checkoutForm'),
	orderConfirmation: document.getElementById('orderConfirmation')
};

init();

function init() {
	if (elements.year) elements.year.textContent = new Date().getFullYear();
	bindUI();
	loadProducts();
	renderCart();
}

function bindUI() {
	elements.searchInput?.addEventListener('input', (e) => {
		state.activeFilters.query = e.target.value.trim().toLowerCase();
		applyFilters();
	});
	elements.categoryFilter?.addEventListener('change', (e) => {
		state.activeFilters.category = e.target.value;
		applyFilters();
	});
	elements.priceRange?.addEventListener('input', (e) => {
		const value = Number(e.target.value);
		state.activeFilters.maxPrice = value;
		elements.priceRangeValue.textContent = `$${value.toFixed(0)}`;
		applyFilters();
	});
	elements.clearFiltersBtn?.addEventListener('click', () => {
		state.activeFilters = { query: '', category: 'all', maxPrice: 200 };
		elements.searchInput.value = '';
		elements.categoryFilter.value = 'all';
		elements.priceRange.value = 200;
		elements.priceRangeValue.textContent = '$200';
		applyFilters();
	});

	// Product modal
	elements.closeProductModal?.addEventListener('click', () => elements.productModal.close());
	elements.productModal?.addEventListener('click', (e) => { if (e.target === elements.productModal) elements.productModal.close(); });

	// Cart drawer
	elements.openCartBtn?.addEventListener('click', openCart);
	elements.closeCartBtn?.addEventListener('click', closeCart);
	elements.drawerBackdrop?.addEventListener('click', closeCart);

	// Checkout
	elements.checkoutBtn?.addEventListener('click', () => {
		if (getCartItemCount() === 0) return;
		elements.checkoutModal.showModal();
	});
	elements.closeCheckoutModal?.addEventListener('click', () => elements.checkoutModal.close());
	elements.checkoutModal?.addEventListener('click', (e) => { if (e.target === elements.checkoutModal) elements.checkoutModal.close(); });
	elements.checkoutForm?.addEventListener('submit', handleCheckout);
}

async function loadProducts() {
	try {
		const response = await fetch('./products.json', { cache: 'no-store' });
		const data = await response.json();
		state.products = data.products;
		state.categories = new Set(['all', ...state.products.map(p => p.category).sort()]);
		populateCategoryFilter();
		applyFilters();
	} catch (error) {
		console.error('Failed to load products', error);
		elements.productsGrid.innerHTML = `<div class="card" style="padding:14px">Failed to load products.</div>`;
	}
}

function populateCategoryFilter() {
	const select = elements.categoryFilter;
	select.innerHTML = '';
	for (const category of state.categories) {
		const option = document.createElement('option');
		option.value = category;
		option.textContent = capitalize(category);
		select.appendChild(option);
	}
	select.value = state.activeFilters.category;
}

function applyFilters() {
	const { query, category, maxPrice } = state.activeFilters;
	state.filteredProducts = state.products.filter((p) => {
		const matchesQuery = !query || p.title.toLowerCase().includes(query) || p.description.toLowerCase().includes(query);
		const matchesCategory = category === 'all' || p.category === category;
		const matchesPrice = p.price <= maxPrice;
		return matchesQuery && matchesCategory && matchesPrice;
	});
	renderProducts();
}

function renderProducts() {
	const grid = elements.productsGrid;
	if (!grid) return;
	if (state.filteredProducts.length === 0) {
		grid.innerHTML = `<div class="card" style="padding:14px">No products found.</div>`;
		return;
	}
	grid.innerHTML = state.filteredProducts.map(productCardHTML).join('');
	// Bind card buttons
	grid.querySelectorAll('[data-action="quick-view"]').forEach(btn => btn.addEventListener('click', onQuickView));
	grid.querySelectorAll('[data-action="add-to-cart"]').forEach(btn => btn.addEventListener('click', onAddToCart));
}

function productCardHTML(p) {
	return `
		<article class="card" data-product-id="${p.id}">
			<div class="card-media">
				<img src="${p.image}" alt="${escapeHtml(p.title)}">
			</div>
			<div class="card-body">
				<h3 class="card-title">${escapeHtml(p.title)}</h3>
				<div class="meta">${escapeHtml(capitalize(p.category))}</div>
				<div class="price">$${p.price.toFixed(2)}</div>
				<div class="card-actions">
					<button class="btn btn-ghost" data-action="quick-view" data-id="${p.id}">Quick view</button>
					<button class="btn btn-primary" data-action="add-to-cart" data-id="${p.id}">Add to cart</button>
				</div>
			</div>
		</article>
	`;
}

function onQuickView(e) {
	const id = getIdFromTarget(e.currentTarget);
	const product = state.products.find(p => p.id === id);
	if (!product) return;
	elements.modalBody.innerHTML = quickViewHTML(product);
	// Bind size/color chips
	elements.modalBody.querySelectorAll('.chip').forEach(chip => chip.addEventListener('click', (evt) => {
		const group = evt.currentTarget.dataset.group;
		elements.modalBody.querySelectorAll(`.chip[data-group="${group}"]`).forEach(c => c.classList.remove('active'));
		evt.currentTarget.classList.add('active');
	}));
	// Bind add to cart
	elements.modalBody.querySelector('[data-action="add-to-cart"]')?.addEventListener('click', () => {
		const selectedSize = elements.modalBody.querySelector('.chip[data-group="size"].active')?.dataset.value;
		const selectedColor = elements.modalBody.querySelector('.chip[data-group="color"].active')?.dataset.value;
		addToCart(product, { size: selectedSize, color: selectedColor });
		elements.productModal.close();
	});
	try { elements.productModal.showModal(); } catch { /* dialog may not be supported in some envs */ }
}

function quickViewHTML(p) {
	const uniqueSizes = [...new Set(p.options?.sizes || ['XS','S','M','L','XL'])];
	const uniqueColors = [...new Set(p.options?.colors || ['Black','White','Navy'])];
	return `
		<div class="quick-view">
			<div class="media"><img src="${p.image}" alt="${escapeHtml(p.title)}"></div>
			<div class="info">
				<h3>${escapeHtml(p.title)}</h3>
				<div class="price">$${p.price.toFixed(2)}</div>
				<p class="meta">${escapeHtml(p.description)}</p>
				<div>
					<div class="label">Size</div>
					<div class="options">
						${uniqueSizes.map((s, i) => `<button type="button" class="chip ${i===1?'active':''}" data-group="size" data-value="${s}">${s}</button>`).join('')}
					</div>
				</div>
				<div>
					<div class="label">Color</div>
					<div class="options">
						${uniqueColors.map((c, i) => `<button type="button" class="chip ${i===0?'active':''}" data-group="color" data-value="${c}">${c}</button>`).join('')}
					</div>
				</div>
				<div class="card-actions">
					<button class="btn btn-primary" data-action="add-to-cart" data-id="${p.id}">Add to cart</button>
				</div>
			</div>
		</div>
	`;
}

function onAddToCart(e) {
	const id = getIdFromTarget(e.currentTarget);
	const product = state.products.find(p => p.id === id);
	if (!product) return;
	addToCart(product);
}

function addToCart(product, variant = {}) {
	const key = cartKey(product.id, variant);
	const existing = state.cart.items[key];
	if (existing) {
		existing.quantity += 1;
	} else {
		state.cart.items[key] = { id: product.id, title: product.title, price: product.price, image: product.image, quantity: 1, variant };
	}
	saveCart();
	renderCart();
	openCart();
}

function renderCart() {
	const container = elements.cartItems;
	container.innerHTML = '';
	const entries = Object.entries(state.cart.items);
	if (entries.length === 0) {
		container.innerHTML = `<div class="meta" style="padding: 10px">Your cart is empty.</div>`;
		elements.checkoutBtn.disabled = true;
	} else {
		elements.checkoutBtn.disabled = false;
		for (const [key, item] of entries) {
			const node = document.createElement('div');
			node.className = 'cart-item';
			node.innerHTML = `
				<img src="${item.image}" alt="${escapeHtml(item.title)}">
				<div>
					<div style="display:flex; align-items:center; justify-content:space-between; gap:8px;">
						<strong>${escapeHtml(item.title)}</strong>
						<button class="icon-button" data-action="remove" data-key="${key}">Remove</button>
					</div>
					<div class="meta">${variantLabel(item.variant)}</div>
					<div style="display:flex; align-items:center; justify-content:space-between; gap:10px; margin-top:6px;">
						<div class="qty">
							<button data-action="dec" data-key="${key}">−</button>
							<span>${item.quantity}</span>
							<button data-action="inc" data-key="${key}">+</button>
						</div>
						<strong>$${(item.price * item.quantity).toFixed(2)}</strong>
					</div>
				</div>
			`;
			container.appendChild(node);
		}
	}
	const subtotal = entries.reduce((sum, [, it]) => sum + it.price * it.quantity, 0);
	elements.cartSubtotal.textContent = `$${subtotal.toFixed(2)}`;
	elements.cartCount.textContent = String(getCartItemCount());

	// bind cart item actions
	container.querySelectorAll('[data-action="remove"]').forEach(btn => btn.addEventListener('click', () => removeFromCart(btn.dataset.key)));
	container.querySelectorAll('[data-action="inc"]').forEach(btn => btn.addEventListener('click', () => updateQty(btn.dataset.key, 1)));
	container.querySelectorAll('[data-action="dec"]').forEach(btn => btn.addEventListener('click', () => updateQty(btn.dataset.key, -1)));
}

function removeFromCart(key) {
	delete state.cart.items[key];
	saveCart();
	renderCart();
}

function updateQty(key, delta) {
	const item = state.cart.items[key];
	if (!item) return;
	item.quantity += delta;
	if (item.quantity <= 0) delete state.cart.items[key];
	saveCart();
	renderCart();
}

function openCart() {
	elements.cartDrawer.classList.add('open');
	elements.drawerBackdrop.hidden = false;
	elements.cartDrawer.setAttribute('aria-hidden', 'false');
}

function closeCart() {
	elements.cartDrawer.classList.remove('open');
	elements.drawerBackdrop.hidden = true;
	elements.cartDrawer.setAttribute('aria-hidden', 'true');
}

function handleCheckout(e) {
	e.preventDefault();
	const data = Object.fromEntries(new FormData(elements.checkoutForm).entries());
	const order = {
		id: 'ORD-' + Math.random().toString(36).slice(2, 8).toUpperCase(),
		items: Object.values(state.cart.items),
		subtotal: Object.values(state.cart.items).reduce((s, it) => s + it.price * it.quantity, 0),
		customer: data,
		createdAt: new Date().toISOString()
	};
	// Simulate processing
	elements.orderConfirmation.classList.remove('hidden');
	elements.orderConfirmation.innerHTML = `
		<p>Thank you, <strong>${escapeHtml(order.customer.fullName)}</strong>! Your order <strong>${order.id}</strong> has been placed.</p>
		<p>Total charged: <strong>$${order.subtotal.toFixed(2)}</strong></p>
	`;
	state.cart = { items: {} };
	saveCart();
	renderCart();
	setTimeout(() => {
		elements.checkoutForm.reset();
	}, 200);
}

// Helpers
function getIdFromTarget(target) { return Number(target.dataset.id); }
function capitalize(s) { return s.charAt(0).toUpperCase() + s.slice(1); }
function escapeHtml(str) { return String(str).replace(/[&<>"]+/g, s => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[s])); }
function cartKey(id, variant) { return [id, variant.size || '-', variant.color || '-'].join(':'); }
function variantLabel(variant = {}) { const parts = []; if (variant.size) parts.push('Size ' + variant.size); if (variant.color) parts.push(variant.color); return parts.join(' · ') || 'Standard'; }
function getCartItemCount() { return Object.values(state.cart.items).reduce((sum, it) => sum + it.quantity, 0); }
function loadCartFromStorage() { try { return JSON.parse(localStorage.getItem('novawear_cart')) || { items: {} }; } catch { return { items: {} }; } }
function saveCart() { localStorage.setItem('novawear_cart', JSON.stringify(state.cart)); }

