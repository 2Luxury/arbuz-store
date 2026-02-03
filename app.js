const products = [
    { id: 1, name: "Nike Hoodie", price: 6500, category: "Кофты", size: "XXS–XXL", desc: "Premium cotton hoodie. Legit Check: Passed.", tag: "Легит чек" },
    { id: 2, name: "CK Jacket", price: 10000, category: "Куртки", size: "M-XL", desc: "Waterproof winter jacket. Authenticity guaranteed.", tag: "Легит чек" },
    { id: 3, name: "Nike Jordan", price: 18500, category: "Обувь", size: "36–46", desc: "Classic Jordan 1 Retro. Certified authentic.", tag: "Легит чек" },
    { id: 4, name: "Leather Belt", price: 2500, category: "Ремни", size: "M", desc: "Genuine leather belt with steel buckle.", tag: "Легит чек" }
];

// Читаем данные из памяти правильно, чтобы не было фантомных товаров
let state = {
    cart: JSON.parse(localStorage.getItem('arb_cart') || '[]'),
    fav: JSON.parse(localStorage.getItem('arb_fav') || '[]')
};

const tg = window.Telegram.WebApp;

function init() {
    tg.expand();
    renderCategories();
    renderProducts("Кофты");
    updateBadges();
    setupNav();
    
    // Показываем имя пользователя из ТГ если оно есть
    if (tg.initDataUnsafe?.user) {
        document.getElementById('user-name').innerText = tg.initDataUnsafe.user.first_name;
    }
}

function renderCategories() {
    const cats = ["Кофты", "Куртки", "Обувь", "Ремни"];
    const container = document.getElementById('categories-list');
    container.innerHTML = '';
    cats.forEach((c, i) => {
        const btn = document.createElement('button');
        btn.className = `cat-btn ${i===0?'active':''}`;
        btn.innerText = c;
        btn.onclick = () => {
            document.querySelectorAll('.cat-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            moveSlider('cat-slider', btn);
            renderProducts(c);
        };
        container.appendChild(btn);
    });
    setTimeout(() => moveSlider('cat-slider', container.firstChild), 100);
}

function renderProducts(cat) {
    const grid = document.getElementById('products-grid');
    grid.innerHTML = '';
    products.filter(p => p.category === cat).forEach(p => {
        const card = document.createElement('div');
        card.className = 'product-card glass';
        card.onclick = (e) => { if(!e.target.closest('button')) openModal(p.id) };
        const isFav = state.fav.includes(p.id);
        card.innerHTML = `
            <button class="fav-btn" onclick="event.stopPropagation(); toggleFav(${p.id})">${isFav?'❤️':'🤍'}</button>
            <h3>${p.name}</h3>
            <div class="price">${p.price} ₽</div>
        `;
        grid.appendChild(card);
    });
}

function openModal(id) {
    const p = products.find(x => x.id === id);
    const inCart = state.cart.includes(p.id);
    const body = document.getElementById('modal-body');
    body.innerHTML = `
        <div class="modal-info">
            <span class="tag">${p.tag}</span>
            <span class="tag">Размер: ${p.size}</span>
            <h2>${p.name}</h2>
            <p>${p.desc}</p>
            <div style="margin-top:15px"><span class="price" style="font-size: 20px; color: var(--accent)">${p.price} ₽</span></div>
            <button class="btn-large" onclick="toggleCart(${p.id}); closeModal();">
                ${inCart ? 'Удалить из корзины' : 'В корзину'}
            </button>
        </div>
    `;
    document.getElementById('product-modal').classList.remove('hidden');
}

function closeModal() { document.getElementById('product-modal').classList.add('hidden'); }

function toggleCart(id) {
    const idx = state.cart.indexOf(id);
    if (idx > -1) { state.cart.splice(idx, 1); } 
    else { state.cart.push(id); }
    save();
    renderCurrentTab();
}

function toggleFav(id) {
    const idx = state.fav.indexOf(id);
    if (idx > -1) { state.fav.splice(idx, 1); } 
    else { state.fav.push(id); }
    save();
    renderCurrentTab();
}

function save() {
    localStorage.setItem('arb_cart', JSON.stringify(state.cart));
    localStorage.setItem('arb_fav', JSON.stringify(state.fav));
    updateBadges();
}

function updateBadges() {
    const bCart = document.getElementById('badge-cart');
    const bFav = document.getElementById('badge-fav');
    
    bCart.innerText = state.cart.length;
    bCart.classList.toggle('hidden', state.cart.length === 0);
    
    bFav.innerText = state.fav.length;
    bFav.classList.toggle('hidden', state.fav.length === 0);
}

function setupNav() {
    document.querySelectorAll('.nav-item').forEach(item => {
        item.onclick = () => {
            document.querySelectorAll('.nav-item').forEach(i => i.classList.remove('active'));
            item.classList.add('active');
            moveSlider('nav-slider', item);
            document.querySelectorAll('.tab-content').forEach(t => t.classList.remove('active'));
            document.getElementById(`tab-${item.dataset.target}`).classList.add('active');
            renderCurrentTab();
        };
    });
    setTimeout(() => moveSlider('nav-slider', document.querySelector('.nav-item.active')), 50);
}

function renderCurrentTab() {
    const active = document.querySelector('.tab-content.active').id;
    
    if (active === 'tab-cart') {
        const list = document.getElementById('cart-list');
        list.innerHTML = '';
        let total = 0;
        state.cart.forEach(id => {
            const p = products.find(x => x.id === id);
            if(p) {
                total += p.price;
                list.innerHTML += `<div class="cart-item glass">
                    <div style="flex:1"><b>${p.name}</b><br><small style="color:var(--text-dim)">${p.price} ₽</small></div>
                    <button class="fav-btn" style="position:static" onclick="toggleCart(${p.id})">🗑️</button>
                </div>`;
            }
        });
        document.getElementById('total-price').innerText = total + ' ₽';
        document.getElementById('cart-empty').classList.toggle('hidden', state.cart.length > 0);
    } 
    else if (active === 'tab-favorites') {
        const grid = document.getElementById('favorites-grid');
        grid.innerHTML = '';
        state.fav.forEach(id => {
            const p = products.find(x => x.id === id);
            if(p) {
                const card = document.createElement('div');
                card.className = 'product-card glass';
                const inCart = state.cart.includes(p.id);
                card.innerHTML = `
                    <button class="fav-btn" onclick="toggleFav(${p.id})">❤️</button>
                    <h3>${p.name}</h3>
                    <div class="price">${p.price} ₽</div>
                    <button class="btn-large" style="padding: 8px; font-size: 11px; margin-top: 5px;" onclick="toggleCart(${p.id})">
                        ${inCart ? 'В корзине ✓' : 'В корзину'}
                    </button>
                `;
                grid.appendChild(card);
            }
        });
        document.getElementById('fav-empty').classList.toggle('hidden', state.fav.length > 0);
    }
}

function moveSlider(id, el) {
    const s = document.getElementById(id);
    if (!el) return;
    s.style.width = el.offsetWidth + 'px';
    s.style.left = el.offsetLeft + 'px';
}

init();