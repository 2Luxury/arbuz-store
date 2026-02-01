const tg = window.Telegram.WebApp;
tg.expand();

const categories = ["Все", "Кофты", "Куртки", "Обувь", "Ремни"];

const products = [
  {
    id: 1,
    name: "Nike Hoodie",
    price: 6500,
    size: "L",
    category: "Кофты",
    description: "Состояние отличное. Без дефектов. Оригинал. Оверсайз."
  },
  {
    id: 2,
    name: "Calvin Klein Jacket",
    price: 10000,
    size: "L",
    category: "Куртки",
    description: "Чистая, без следов носки. Оригинал."
  },
  {
    id: 3,
    name: "Nike Jordan 1",
    price: 6500,
    size: "43",
    category: "Обувь",
    description: "Хорошее состояние. Без трещин. Оригинал."
  },
  {
    id: 4,
    name: "Leather Belt",
    price: 2500,
    size: "M",
    category: "Ремни",
    description: "Натуральная кожа. Минимальный износ."
  }
];

let view = "list";
let currentCategory = "Все";
let currentProduct = null;

let cart = JSON.parse(localStorage.getItem("cart")) || [];
let favorites = JSON.parse(localStorage.getItem("favorites")) || [];

const app = document.getElementById("app");
const cartBtn = document.getElementById("cartButton");
const cartCount = document.getElementById("cartCount");

function save() {
  localStorage.setItem("cart", JSON.stringify(cart));
  localStorage.setItem("favorites", JSON.stringify(favorites));
  updateCartIcon();
}

function updateCartIcon() {
  if (cart.length === 0) {
    cartBtn.classList.add("hidden");
  } else {
    cartBtn.classList.remove("hidden");
    cartCount.innerText = cart.length;
  }
}

function renderCategories() {
  const el = document.getElementById("categories");
  el.innerHTML = "";
  categories.forEach(cat => {
    const c = document.createElement("div");
    c.className = "category" + (cat === currentCategory ? " active" : "");
    c.innerText = cat;
    c.onclick = () => {
      currentCategory = cat;
      renderList();
    };
    el.appendChild(c);
  });
}

function renderList() {
  view = "list";
  app.innerHTML = `
    <div class="grid">
      ${products
        .filter(p => currentCategory === "Все" || p.category === currentCategory)
        .map(p => `
          <div class="card" onclick="openProduct(${p.id})">
            <div class="heart" onclick="toggleFav(event, ${p.id})">
              ${favorites.includes(p.id) ? "❤️" : "🤍"}
            </div>
            <h3>${p.name}</h3>
            <div class="meta">₽ ${p.price} · ${p.size}</div>
          </div>
        `).join("")}
    </div>
  `;
}

function openProduct(id) {
  currentProduct = products.find(p => p.id === id);
  view = "product";

  app.innerHTML = `
    <div class="screen">
      <div class="back" onclick="renderList()">← Назад</div>
      <h2>${currentProduct.name}</h2>
      <p>₽ ${currentProduct.price}</p>
      <p>Размер: ${currentProduct.size}</p>
      <p>${currentProduct.description}</p>

      <button class="button" onclick="addToCart(${id})">🛒 В корзину</button>
      <button class="button" onclick="toggleFav(null, ${id})">
        ${favorites.includes(id) ? "💔 Убрать из избранного" : "❤️ В избранное"}
      </button>
    </div>
  `;
}

function addToCart(id) {
  cart.push(products.find(p => p.id === id));
  save();
  tg.showPopup({ message: "Добавлено в корзину 🍉" });
}

function toggleFav(e, id) {
  if (e) e.stopPropagation();
  if (favorites.includes(id)) {
    favorites = favorites.filter(f => f !== id);
  } else {
    favorites.push(id);
  }
  save();
  if (view === "list") renderList();
  if (view === "product") openProduct(id);
}

function openCart() {
  view = "cart";
  app.innerHTML = `
    <div class="screen">
      <div class="back" onclick="renderList()">← Назад</div>
      <h2>Корзина</h2>

      ${cart.map((p,i) => `
        <p>${p.name} — ₽${p.price}</p>
      `).join("")}

      <h3>Итого: ₽${cart.reduce((s,p)=>s+p.price,0)}</h3>
      <button class="button" onclick="alert('Покупка — следующий этап')">Купить</button>
    </div>
  `;
}

renderCategories();
renderList();
updateCartIcon();
