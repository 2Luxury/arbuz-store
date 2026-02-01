const tg = window.Telegram?.WebApp;
tg?.ready();
tg?.expand();

const app = document.getElementById("app");
const bottom = document.getElementById("bottom-bar");

const state = {
  tab: "shop",
  cart: [],
  favorites: []
};

const products = [
  { id: 1, name: "Nike Hoodie", price: 6500, desc: "Худи, street fit" },
  { id: 2, name: "Calvin Klein Jacket", price: 10000, desc: "Куртка, clean" },
  { id: 3, name: "Nike Jordan 1", price: 6500, desc: "Обувь, 43" },
  { id: 4, name: "Leather Belt", price: 2500, desc: "Ремень, кожа" }
];

function renderShop() {
  app.innerHTML = `
    <h1>🍉 Арбуз Маркет</h1>
    <p style="opacity:.6">resale · street · clean</p>
    ${products.map(p => `
      <div class="card">
        <div class="heart ${state.favorites.includes(p.id) ? "active" : ""}"
          onclick="toggleFav(${p.id})">❤️</div>
        <h3>${p.name}</h3>
        <div class="price">₽ ${p.price}</div>
        <button class="btn" onclick="addToCart(${p.id})">В корзину</button>
      </div>
    `).join("")}
  `;
}

function renderCart() {
  const items = state.cart.map(id => products.find(p => p.id === id));
  const sum = items.reduce((a, b) => a + b.price, 0);

  app.innerHTML = `
    <h1>🛒 Корзина</h1>
    ${items.map(i => `<p>${i.name} — ₽${i.price}</p>`).join("")}
    <h3>Итого: ₽${sum}</h3>
    <button class="btn">Купить</button>
  `;
}

function renderFavorites() {
  const items = products.filter(p => state.favorites.includes(p.id));
  app.innerHTML = `
    <h1>❤️ Избранное</h1>
    ${items.map(i => `<p>${i.name}</p>`).join("") || "Пусто"}
  `;
}

function renderGame() {
  app.innerHTML = `
    <h1>🎮 Игра</h1>
    <p>Скоро: ловим арбузы 🍉 → скидка</p>
  `;
}

function renderProfile() {
  app.innerHTML = `
    <h1>👤 Профиль</h1>
    <p>ID: ${tg?.initDataUnsafe?.user?.id || "—"}</p>
  `;
}

function render() {
  if (state.tab === "cart") return renderCart();
  if (state.tab === "favorites") return renderFavorites();
  if (state.tab === "game") return renderGame();
  if (state.tab === "profile") return renderProfile();
  renderShop();
}

function addToCart(id) {
  state.cart.push(id);
  render();
}

function toggleFav(id) {
  state.favorites.includes(id)
    ? state.favorites = state.favorites.filter(x => x !== id)
    : state.favorites.push(id);
  render();
}

bottom.addEventListener("click", e => {
  if (!e.target.dataset.tab) return;
  state.tab = e.target.dataset.tab;
  render();
});

render();
