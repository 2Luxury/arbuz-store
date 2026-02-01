const tg = window.Telegram?.WebApp;
if (tg) {
  tg.ready();
  tg.expand();
}

const app = document.getElementById("app");
const bottom = document.getElementById("bottom-bar");

const state = {
  tab: "shop",
  category: "all",
  cart: [],
  favorites: [],
  filters: {
    maxPrice: null,
    size: null,
    condition: null
  }
};

const products = [
  { id:1, name:"Nike Hoodie", price:6500, size:"L", condition:"used", category:"hoodie" },
  { id:2, name:"Calvin Klein Jacket", price:10000, size:"L", condition:"new", category:"jacket" },
  { id:3, name:"Nike Jordan 1", price:6500, size:"43", condition:"used", category:"shoes" },
  { id:4, name:"Leather Belt", price:2500, size:"M", condition:"new", category:"belt" }
];

bottom.querySelectorAll("button").forEach(b => {
  b.onclick = () => {
    state.tab = b.dataset.tab;
    render();
  };
});

function render() {
  if (state.tab === "shop") return renderShop();
  if (state.tab === "favorites") return renderFavorites();
  if (state.tab === "cart") return renderCart();
  if (state.tab === "game") return renderGame();
  if (state.tab === "profile") return renderProfile();
}

function renderShop() {
  const filtered = products.filter(p => {
    if (state.category !== "all" && p.category !== state.category) return false;
    if (state.filters.maxPrice && p.price > state.filters.maxPrice) return false;
    if (state.filters.size && p.size !== state.filters.size) return false;
    if (state.filters.condition && p.condition !== state.filters.condition) return false;
    return true;
  });

  app.innerHTML = `
    <h1>🍉 Арбуз Маркет</h1>
    <p style="opacity:.6">resale · street · clean</p>

    <div class="tabs">
      ${["all","hoodie","jacket","shoes","belt"].map(c => `
        <button class="${state.category===c?"active":""}"
          onclick="setCategory('${c}')">${labelCategory(c)}</button>
      `).join("")}
    </div>

    <div class="filters">
      <input type="number" placeholder="Бюджет ₽"
        onchange="setFilter('maxPrice', this.value)">
      <select onchange="setFilter('size', this.value)">
        <option value="">Размер</option>
        <option>L</option><option>M</option><option>43</option>
      </select>
      <select onchange="setFilter('condition', this.value)">
        <option value="">Состояние</option>
        <option>new</option><option>used</option>
      </select>
    </div>

    ${filtered.map(cardHTML).join("") || "<p>Ничего не найдено</p>"}
  `;
}

function renderFavorites() {
  const favs = products.filter(p => state.favorites.includes(p.id));
  app.innerHTML = `<h1>❤️ Избранное</h1>` +
    (favs.length ? favs.map(cardHTML).join("") : "<p>Пусто</p>");
}

function renderCart() {
  const items = products.filter(p => state.cart.includes(p.id));
  const sum = items.reduce((s,p)=>s+p.price,0);
  app.innerHTML = `
    <h1>🛒 Корзина</h1>
    ${items.map(p=>`<p>${p.name} — ₽${p.price}</p>`).join("")}
    <h3>Итого: ₽${sum}</h3>
    ${items.length ? `<button class="btn">Купить</button>` : "<p>Пусто</p>"}
  `;
}

function renderGame() {
  app.innerHTML = `<h1>🎮 Игра</h1><p>Ловим арбузы — скидки позже</p>`;
}

function renderProfile() {
  app.innerHTML = `<h1>👤 Профиль</h1><p>Скоро</p>`;
}

function cardHTML(p) {
  return `
    <div class="card glass">
      <div class="heart ${state.favorites.includes(p.id)?"active":""}"
        onclick="toggleFav(${p.id})">❤️</div>
      <h3>${p.name}</h3>
      <div class="price">₽ ${p.price} · ${p.size}</div>
      <button class="btn" onclick="addToCart(${p.id})">В корзину</button>
    </div>
  `;
}

function addToCart(id) {
  if (!state.cart.includes(id)) state.cart.push(id);
}

function toggleFav(id) {
  state.favorites.includes(id)
    ? state.favorites = state.favorites.filter(x=>x!==id)
    : state.favorites.push(id);
  render();
}

function setCategory(c) {
  state.category = c;
  render();
}

function setFilter(k,v) {
  state.filters[k] = v || null;
  render();
}

function labelCategory(c) {
  return {all:"Все",hoodie:"Кофты",jacket:"Куртки",shoes:"Обувь",belt:"Ремни"}[c];
}

render();
