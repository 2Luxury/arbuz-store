const app = document.getElementById("app");

let screen = "main";
let category = "Все";

let cart = JSON.parse(localStorage.getItem("cart")) || [];
let favorites = JSON.parse(localStorage.getItem("favorites")) || [];

const products = [
  { id: 1, name: "Nike Hoodie", price: 6500, size: "L", cat: "Кофты", desc: "Оверсайз худи" },
  { id: 2, name: "Calvin Klein Jacket", price: 10000, size: "L", cat: "Куртки", desc: "Минимал куртка" },
  { id: 3, name: "Nike Jordan 1", price: 6500, size: "43", cat: "Обувь", desc: "Классика" },
  { id: 4, name: "Leather Belt", price: 2500, size: "M", cat: "Ремни", desc: "Натуральная кожа" },
];

render();

function render() {
  app.innerHTML = "";

  if (screen === "main") renderMain();
  if (screen === "cart") renderCart();
  if (screen === "fav") renderFav();
}

function renderMain() {
  const filtered = category === "Все" ? products : products.filter(p => p.cat === category);

  app.innerHTML = `
    <div class="header">
      <div>
        <div class="title">🍉 Арбуз Маркет</div>
        <div class="subtitle">resale · street · clean</div>
      </div>
      <div class="icons">
        <div class="icon-btn ${favorites.length ? "" : "hidden"}" onclick="screen='fav';render()">⭐</div>
        <div class="icon-btn ${cart.length ? "" : "hidden"}" onclick="screen='cart';render()">🛒 ${cart.length}</div>
      </div>
    </div>

    <div class="categories">
      ${["Все","Кофты","Куртки","Обувь","Ремни"].map(c =>
        `<div class="cat ${category===c?"active":""}" onclick="category='${c}';render()">${c}</div>`
      ).join("")}
    </div>

    <div class="grid">
      ${filtered.map(p => `
        <div class="card">
          <div class="card-header">
            <b>${p.name}</b>
            <span class="heart ${favorites.includes(p.id)?"active":""}" onclick="toggleFav(${p.id})">❤️</span>
          </div>
          <div class="price">₽ ${p.price} · ${p.size}</div>
          <button class="btn" onclick="addCart(${p.id})">В корзину</button>
        </div>
      `).join("")}
    </div>

    ${cart.length ? `<button class="bottom-buy" onclick="screen='cart';render()">🛒 Купить</button>` : ""}
  `;
}

function renderCart() {
  const items = products.filter(p => cart.includes(p.id));
  const sum = items.reduce((a,b)=>a+b.price,0);

  app.innerHTML = `
    <button onclick="screen='main';render()">← Назад</button>
    <h2>Корзина</h2>
    ${items.map(p=>`<p>${p.name} — ₽${p.price}</p>`).join("")}
    <b>Итого: ₽${sum}</b>
    <button class="btn">Купить</button>
  `;
}

function renderFav() {
  const items = products.filter(p => favorites.includes(p.id));

  app.innerHTML = `
    <button onclick="screen='main';render()">← Назад</button>
    <h2>Избранное</h2>
    ${items.map(p=>`
      <div class="card">
        <b>${p.name}</b>
        <button class="btn" onclick="addCart(${p.id})">В корзину</button>
      </div>
    `).join("")}
  `;
}

function addCart(id) {
  if (!cart.includes(id)) cart.push(id);
  localStorage.setItem("cart", JSON.stringify(cart));
  render();
}

function toggleFav(id) {
  favorites.includes(id)
    ? favorites = favorites.filter(f=>f!==id)
    : favorites.push(id);

  localStorage.setItem("favorites", JSON.stringify(favorites));
  render();
}
