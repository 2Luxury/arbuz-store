const products = [
    { id: 1, name: "Nike Hoodie", price: 6500, category: "Кофты", size: "XXS–XXL" },
    { id: 2, name: "CK Jacket", price: 10000, category: "Куртки", size: "XXS–XXL" },
    { id: 3, name: "Nike Jordan", price: 6500, category: "Обувь", size: "36–46" },
    { id: 4, name: "Leather Belt", price: 2500, category: "Ремни", size: "M" }
];

let state = {
    cart: JSON.parse(localStorage.getItem('cart') || '[]'),
    fav: JSON.parse(localStorage.getItem('fav') || '[]')
};

function init() {
    renderCategories();
    renderProducts("Кофты");
    updateBadges();
    setupNav();
}

function renderCategories() {
    const cats = ["Кофты", "Куртки", "Обувь", "Ремни"];
    const container = document.getElementById('categories-list');
    cats.forEach((c, i) => {
        const btn = document.createElement('button');
        btn.className = `cat-btn ${i===0?'active':''}`;
        btn.innerText = c;
        btn.onclick = (e) => {
            document.querySelectorAll('.cat-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            moveSlider('cat-slider', btn);
            renderProducts(c);
        };
        container.appendChild(btn);
    });
    setTimeout(() => moveSlider('cat-slider', container.firstChild), 50);
}

function renderProducts(cat) {
    const grid = document.getElementById('products-grid');
    grid.innerHTML = '';
    products.filter(p => p.category === cat).forEach(p => {
        const card = document.createElement('div');
        card.className = 'product-card glass';
        const isFav = state.fav.includes(p.id);
        const inCart = state.cart.includes(p.id);
        card.innerHTML = `
            <button class="fav-btn" onclick="toggleFav(${p.id})">${isFav?'❤️':'🤍'}</button>
            <div class="card-img-placeholder">🛍️</div>
            <h3>${p.name}</h3>
            <div class="price-row">
                <span>${p.price} ₽</span>
                <button class="add-btn ${inCart?'in-cart':''}" onclick="toggleCart(${p.id})">${inCart?'✓':'+'}</button>
            </div>
        `;
        grid.appendChild(card);
    });
}

function toggleCart(id) {
    const idx = state.cart.indexOf(id);
    idx > -1 ? state.cart.splice(idx, 1) : state.cart.push(id);
    save();
    renderCurrentTab();
}

function toggleFav(id) {
    const idx = state.fav.indexOf(id);
    idx > -1 ? state.fav.splice(idx, 1) : state.fav.push(id);
    save();
    renderCurrentTab();
}

function save() {
    localStorage.setItem('cart', JSON.stringify(state.cart));
    localStorage.setItem('fav', JSON.stringify(state.fav));
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
            const target = item.dataset.target;
            document.querySelectorAll('.tab-content').forEach(t => t.classList.remove('active'));
            document.getElementById(`tab-${target}`).classList.add('active');
            renderCurrentTab();
        };
    });
    moveSlider('nav-slider', document.querySelector('.nav-item.active'));
}

function renderCurrentTab() {
    const active = document.querySelector('.tab-content.active').id;
    if (active === 'tab-cart') {
        const list = document.getElementById('cart-list');
        list.innerHTML = '';
        let total = 0;
        state.cart.forEach(id => {
            const p = products.find(x => x.id === id);
            total += p.price;
            list.innerHTML += `<div class="cart-item glass"><span>${p.name}</span><div style="margin-left:auto">${p.price} ₽</div><button onclick="toggleCart(${p.id})" style="background:none;border:none;margin-left:10px">🗑️</button></div>`;
        });
        document.getElementById('total-price').innerText = total + ' ₽';
        document.getElementById('cart-empty').classList.toggle('hidden', state.cart.length > 0);
    } else if (active === 'tab-favorites') {
        const grid = document.getElementById('favorites-grid');
        grid.innerHTML = '';
        state.fav.forEach(id => {
            const p = products.find(x => x.id === id);
            const card = document.createElement('div');
            card.className = 'product-card glass';
            card.innerHTML = `<button class="fav-btn" onclick="toggleFav(${p.id})">❤️</button><div class="card-img-placeholder">🛍️</div><h3>${p.name}</h3><div class="price-row"><span>${p.price} ₽</span><button class="add-btn" onclick="toggleCart(${p.id})">${state.cart.includes(p.id)?'✓':'+'}</button></div>`;
            grid.appendChild(card);
        });
        document.getElementById('fav-empty').classList.toggle('hidden', state.fav.length > 0);
    } else if (active === 'tab-shop') {
        const activeCat = document.querySelector('.cat-btn.active').innerText;
        renderProducts(activeCat);
    }
}

function moveSlider(id, el) {
    const s = document.getElementById(id);
    s.style.width = el.offsetWidth + 'px';
    s.style.left = el.offsetLeft + 'px';
}

init();