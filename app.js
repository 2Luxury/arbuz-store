// --- ДАННЫЕ (С ОПИСАНИЕМ И LEGT CHECK) ---
const products = [
    { id: 1, name: "Nike Hoodie", price: 6500, category: "Кофты", size: "XXS–XXL", desc: "Плотный хлопок. Оригинальная фурнитура.", legit: "Legit Check: Passed ✅" },
    { id: 2, name: "CK Jacket", price: 10000, category: "Куртки", size: "M-XL", desc: "Водоотталкивающее покрытие. Сезон: Осень/Зима.", legit: "Legit Check: Passed ✅" },
    { id: 3, name: "Jordan 1 Retro", price: 18500, category: "Обувь", size: "36–46", desc: "Классическая расцветка. Натуральная кожа.", legit: "Legit Check: Passed ✅" },
    { id: 4, name: "Leather Belt", price: 2500, category: "Ремни", size: "Universal", desc: "Натуральная кожа, стальная пряжка.", legit: "Legit Check: Passed ✅" }
];

const categories = ["Кофты", "Куртки", "Обувь", "Ремни"];

// --- STATE & INIT ---
let state = {
    cart: [],
    favorites: []
};

const tg = window.Telegram.WebApp;

document.addEventListener('DOMContentLoaded', () => {
    tg.expand();
    
    // Безопасная загрузка (фикс бага с 20 товарами)
    try {
        const savedCart = JSON.parse(localStorage.getItem('arbuz_cart'));
        const savedFav = JSON.parse(localStorage.getItem('arbuz_fav'));
        if (Array.isArray(savedCart)) state.cart = [...new Set(savedCart)]; // Убираем дубли
        if (Array.isArray(savedFav)) state.favorites = [...new Set(savedFav)];
    } catch (e) {
        console.log('Ошибка памяти, сброс');
        localStorage.clear();
    }

    // Данные пользователя
    if (tg.initDataUnsafe?.user) {
        document.getElementById('user-name').innerText = tg.initDataUnsafe.user.first_name;
    }

    renderCategories();
    renderProducts(categories[0]);
    updateCounters();
    initNavigation();
});

// --- CORE LOGIC ---
function saveState() {
    localStorage.setItem('arbuz_cart', JSON.stringify(state.cart));
    localStorage.setItem('arbuz_fav', JSON.stringify(state.favorites));
    updateCounters();
}

function addToCart(id) {
    if (!state.cart.includes(id)) {
        state.cart.push(id);
        saveState();
        showFeedback('Добавлено в корзину');
    }
    updateUI();
}

function removeFromCart(id) {
    state.cart = state.cart.filter(item => item !== id);
    saveState();
    updateUI();
}

function toggleFav(id) {
    if (state.favorites.includes(id)) {
        state.favorites = state.favorites.filter(item => item !== id);
    } else {
        state.favorites.push(id);
    }
    saveState();
    updateUI();
}

// --- RENDERING ---
function updateUI() {
    // Обновляем текущую активную вкладку
    const activeTab = document.querySelector('.tab-content.active');
    if (activeTab.id === 'tab-cart') renderCart();
    if (activeTab.id === 'tab-favorites') renderFavorites();
    if (activeTab.id === 'tab-shop') {
        const activeCatBtn = document.querySelector('.cat-btn.active');
        if(activeCatBtn) renderProducts(activeCatBtn.innerText);
    }
    
    // Если открыто модальное окно - обновляем его кнопку
    const modal = document.getElementById('product-modal');
    if (!modal.classList.contains('hidden')) {
        const id = parseInt(modal.dataset.activeId);
        if(id) openModal(id); // Перерисовываем содержимое
    }
}

function updateCounters() {
    const cBadge = document.getElementById('badge-cart');
    const fBadge = document.getElementById('badge-fav');
    
    // Строгая проверка длины
    const cartCount = state.cart.length;
    const favCount = state.favorites.length;

    cBadge.innerText = cartCount;
    cBadge.classList.toggle('hidden', cartCount === 0);

    fBadge.innerText = favCount;
    fBadge.classList.toggle('hidden', favCount === 0);
}

function renderCategories() {
    const list = document.getElementById('categories-list');
    list.innerHTML = '';
    categories.forEach((cat, idx) => {
        const btn = document.createElement('button');
        btn.className = `cat-btn ${idx === 0 ? 'active' : ''}`;
        btn.innerText = cat;
        btn.onclick = () => {
            document.querySelectorAll('.cat-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            moveSlider(document.getElementById('cat-slider'), btn);
            renderProducts(cat);
        };
        list.appendChild(btn);
    });
    setTimeout(() => moveSlider(document.getElementById('cat-slider'), list.firstChild), 50);
}

function renderProducts(category) {
    const grid = document.getElementById('products-grid');
    grid.innerHTML = '';
    const filtered = products.filter(p => p.category === category);
    
    filtered.forEach(p => {
        const card = document.createElement('div');
        card.className = 'product-card glass';
        const isFav = state.favorites.includes(p.id);
        
        // Клик по карточке открывает модалку
        card.onclick = (e) => {
            if(!e.target.closest('.fav-btn')) openModal(p.id);
        };

        card.innerHTML = `
            <button class="fav-btn ${isFav ? 'active' : ''}" onclick="toggleFav(${p.id})">
                ${isFav ? '❤️' : '🤍'}
            </button>
            <div class="card-img-placeholder">👟</div>
            <div class="product-info">
                <h3>${p.name}</h3>
                <span class="price">${p.price.toLocaleString()} ₽</span>
            </div>
        `;
        grid.appendChild(card);
    });
}

function renderFavorites() {
    const grid = document.getElementById('favorites-grid');
    const empty = document.getElementById('fav-empty');
    grid.innerHTML = '';

    if (state.favorites.length === 0) {
        empty.classList.remove('hidden');
        return;
    }
    empty.classList.add('hidden');

    state.favorites.forEach(id => {
        const p = products.find(x => x.id === id);
        if (!p) return;
        
        const card = document.createElement('div');
        card.className = 'product-card glass';
        const inCart = state.cart.includes(p.id);

        card.innerHTML = `
            <button class="fav-btn active" onclick="toggleFav(${p.id})">❤️</button>
            <div class="card-img-placeholder">👟</div>
            <div class="product-info">
                <h3>${p.name}</h3>
                <span class="price">${p.price.toLocaleString()} ₽</span>
                <button class="action-btn ${inCart ? 'btn-outline' : 'btn-green'}" onclick="inCart ? removeFromCart(${p.id}) : addToCart(${p.id})">
                    ${inCart ? 'В корзине' : 'В корзину'}
                </button>
            </div>
        `;
        // В избранном клик тоже открывает детали
        card.onclick = (e) => {
           if(!e.target.closest('button')) openModal(p.id);
        };
        grid.appendChild(card);
    });
}

function renderCart() {
    const list = document.getElementById('cart-list');
    const empty = document.getElementById('cart-empty');
    const totalEl = document.getElementById('total-price');
    list.innerHTML = '';
    
    if (state.cart.length === 0) {
        empty.classList.remove('hidden');
        totalEl.innerText = '0 ₽';
        return;
    }
    empty.classList.add('hidden');

    let total = 0;
    state.cart.forEach(id => {
        const p = products.find(x => x.id === id);
        if (!p) return;
        total += p.price;

        const item = document.createElement('div');
        item.className = 'cart-item glass';
        item.innerHTML = `
            <div class="cart-img">👟</div>
            <div class="cart-details">
                <h4>${p.name}</h4>
                <div style="font-size:12px; opacity:0.7">${p.size}</div>
                <div style="font-weight:bold">${p.price.toLocaleString()} ₽</div>
            </div>
            <button class="cart-remove" onclick="removeFromCart(${p.id})">🗑️</button>
        `;
        list.appendChild(item);
    });
    totalEl.innerText = total.toLocaleString() + ' ₽';
}

// --- MODAL LOGIC ---
function openModal(id) {
    const p = products.find(x => x.id === id);
    const modal = document.getElementById('product-modal');
    const body = document.getElementById('modal-body');
    const inCart = state.cart.includes(id);

    modal.dataset.activeId = id; // Сохраняем ID для обновления
    
    body.innerHTML = `
        <div class="card-img-placeholder" style="aspect-ratio: 1/1; font-size: 50px;">👟</div>
        <div class="modal-details">
            <h2>${p.name}</h2>
            <span class="tag">${p.legit}</span>
            <span class="tag">Размер: ${p.size}</span>
            <p>${p.desc}</p>
            <div style="font-size: 20px; font-weight: 700; margin-bottom: 15px;">${p.price.toLocaleString()} ₽</div>
            
            <button class="action-btn ${inCart ? 'btn-remove' : 'btn-green'}" onclick="${inCart ? `removeFromCart(${p.id})` : `addToCart(${p.id})`}">
                ${inCart ? 'Удалить из корзины' : 'Добавить в корзину'}
            </button>
        </div>
    `;
    modal.classList.remove('hidden');
}

function closeModal() {
    document.getElementById('product-modal').classList.add('hidden');
}

// --- NAVIGATION & UTILS ---
function initNavigation() {
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
        item.onclick = () => {
            navItems.forEach(i => i.classList.remove('active'));
            item.classList.add('active');
            moveSlider(document.getElementById('nav-slider'), item);
            
            document.querySelectorAll('.tab-content').forEach(t => t.classList.remove('active'));
            document.getElementById(`tab-${item.dataset.target}`).classList.add('active');
            
            updateUI();
        };
    });
    setTimeout(() => {
        const active = document.querySelector('.nav-item.active');
        if(active) moveSlider(document.getElementById('nav-slider'), active);
    }, 100);
}

function moveSlider(slider, el) {
    if (!el || !slider) return;
    // Корректировка позиции относительно родителя
    slider.style.width = el.offsetWidth + 'px';
    slider.style.left = el.offsetLeft + 'px';
}

function showFeedback(msg) {
    tg.HapticFeedback.notificationOccurred('success');
}

function checkout() {
    if(state.cart.length === 0) return;
    tg.showPopup({
        title: 'Заказ',
        message: `Сумма заказа: ${document.getElementById('total-price').innerText}`,
        buttons: [{type: 'ok'}]
    });
}