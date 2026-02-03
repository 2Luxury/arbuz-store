const app = document.getElementById("app");

const products = [
  {id:1, name:"Nike Hoodie", price:6500},
  {id:2, name:"Calvin Klein Jacket", price:10000},
  {id:3, name:"Nike Jordan 1", price:6500},
];

const state = {
  tab: "shop",
  cart: [],
  fav: []
};

/* ---------- NAV ---------- */
function setTab(tab) {
  state.tab = tab;
  render();
}

/* ---------- ACTIONS ---------- */
function addToCart(id) {
  if (state.cart.includes(id)) return;
  state.cart.push(id);
  render();
}

function removeFromCart(id) {
  state.cart = state.cart.filter(x => x !== id);
  render();
}

function toggleFav(id) {
  state.fav.includes(id)
    ? state.fav = state.fav.filter(x => x !== id)
    : state.fav.push(id);
  render();
}

/* ---------- RENDER ---------- */
function render() {
  if (state.tab === "shop") renderShop();
  if (state.tab === "fav") renderFav();
  if (state.tab === "cart") renderCart();
  if (state.tab === "profile") renderProfile();
}

function renderShop() {
  app.innerHTML = `
    <h1>🍉 Арбуз Маркет</h1>
    ${products.map(p => `
      <div class="card">
        <button class="heart" onclick="toggleFav(${p.id})">
          ${state.fav.includes(p.id) ? "❤️" : "🤍"}
        </button>
        <h3>${p.name}</h3>
        <div class="price">₽ ${p.price}</div>
        <button onclick="addToCart(${p.id})">
          ${state.cart.includes(p.id) ? "В корзине" : "В корзину"}
        </button>
      </div>
    `).join("")}
  `;
}

function renderFav() {
  app.innerHTML = `
    <h2>❤️ Избранное</h2>
    ${state.fav.length
      ? state.fav.map(id => {
          const p = products.find(x => x.id === id);
          return `<div class="card">${p.name}</div>`;
        }).join("")
      : "<p>Пусто</p>"
    }
  `;
}

function renderCart() {
  let sum = 0;
  app.innerHTML = `
    <h2>🛒 Корзина</h2>
    ${state.cart.length
      ? state.cart.map(id => {
          const p = products.find(x => x.id === id);
          sum += p.price;
          return `
            <div class="card">
              ${p.name} — ₽${p.price}
              <br><br>
              <button onclick="removeFromCart(${id})">Удалить</button>
            </div>
          `;
        }).join("")
      : "<p>Корзина пуста</p>"
    }
    ${state.cart.length ? `<h3>Итого: ₽${sum}</h3>` : ""}
  `;
}

function renderProfile() {
  app.innerHTML = `<h2>👤 Профиль</h2><p>Скоро</p>`;
}

render();
