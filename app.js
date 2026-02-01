const tg = window.Telegram.WebApp;
tg.expand();

const categories = ["Все", "Кофты", "Куртки", "Обувь", "Ремни"];

const productsData = [
  { id: 1, name: "Nike Hoodie", price: 6500, size: "L", category: "Кофты" },
  { id: 2, name: "Calvin Klein Jacket", price: 10000, size: "L", category: "Куртки" },
  { id: 3, name: "Nike Jordan 1", price: 6500, size: "43", category: "Обувь" },
  { id: 4, name: "Leather Belt", price: 2500, size: "M", category: "Ремни" },
];

let currentCategory = "Все";
let cart = JSON.parse(localStorage.getItem("cart")) || [];

const categoriesEl = document.getElementById("categories");
const productsEl = document.getElementById("products");

function renderCategories() {
  categoriesEl.innerHTML = "";
  categories.forEach(cat => {
    const el = document.createElement("div");
    el.className = "category" + (cat === currentCategory ? " active" : "");
    el.innerText = cat;
    el.onclick = () => {
      currentCategory = cat;
      renderCategories();
      renderProducts();
    };
    categoriesEl.appendChild(el);
  });
}

function renderProducts() {
  productsEl.innerHTML = "";
  productsData
    .filter(p => currentCategory === "Все" || p.category === currentCategory)
    .forEach(p => {
      const card = document.createElement("div");
      card.className = "card";
      card.innerHTML = `
        <h3>${p.name}</h3>
        <div class="meta">₽ ${p.price} · ${p.size}</div>
        <button onclick="addToCart(${p.id})">В корзину</button>
      `;
      productsEl.appendChild(card);
    });
}

function addToCart(id) {
  const item = productsData.find(p => p.id === id);
  cart.push(item);
  localStorage.setItem("cart", JSON.stringify(cart));
  tg.showPopup({ message: "Добавлено в корзину 🍉" });
}

function openCart() {
  if (!cart.length) {
    tg.showPopup({ message: "Корзина пуста" });
    return;
  }

  const text = cart
    .map(p => `${p.name} — ${p.price}₽ (${p.size})`)
    .join("\n");

  const msg = encodeURIComponent(
    `Хочу купить:\n${text}\n\nИтого: ${cart.reduce((s,p)=>s+p.price,0)}₽`
  );

  tg.openTelegramLink(`https://t.me/arbu zshmot_bot?text=${msg}`);
}

renderCategories();
renderProducts();
