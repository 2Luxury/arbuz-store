const tg = window.Telegram?.WebApp;
tg?.ready();
tg?.expand();

const app = document.getElementById("app");
const bottom = document.getElementById("bottom-bar");
const bottomIndicator = document.getElementById("bottom-indicator");

/* ---------- STATE ---------- */
const state = {
  tab: "shop",
  category: "all",
  cart: new Set(),
  favorites: new Set()
};

const products = [
  {id:1,name:"Nike Hoodie",price:6500,size:"XXS–XXL",cat:"hoodie"},
  {id:2,name:"Calvin Klein Jacket",price:10000,size:"XXS–XXL",cat:"jacket"},
  {id:3,name:"Nike Jordan 1",price:6500,size:"36–46",cat:"shoes"},
  {id:4,name:"Leather Belt",price:2500,size:"M",cat:"belt"},
];

const cats = [
  {id:"all",label:"Все"},
  {id:"hoodie",label:"Кофты"},
  {id:"jacket",label:"Куртки"},
  {id:"shoes",label:"Обувь"},
  {id:"belt",label:"Ремни"},
];

/* ---------- RENDER ---------- */
function render() {
  if (state.tab === "shop") shop();
  if (state.tab === "favorites") favs();
  if (state.tab === "cart") cart();
  if (state.tab === "game") app.innerHTML = "<h2>🎮 Игра скоро</h2>";
  if (state.tab === "profile") app.innerHTML = "<h2>👤 Профиль</h2>";
  updateBadges();
}

/* ---------- SHOP ---------- */
function shop() {
  const list = products.filter(p =>
    state.category === "all" || p.cat === state.category
  );

  app.innerHTML = `
    <h1>🍉 Арбуз Маркет</h1>
    <div class="hook">streetwear with history</div>

    <div class="tabs-wrapper glass">
      <div class="tab-indicator" id="cat-indicator"></div>
      <div class="tabs">
        ${cats.map((c,i)=>`
          <button class="${c.id===state.category?"active":""}"
            onclick="setCat('${c.id}', ${i})">${c.label}</button>
        `).join("")}
      </div>
    </div>

    ${list.map(card).join("")}
  `;

  moveCategoryIndicator();
}

/* ---------- CARD ---------- */
function card(p) {
  const fav = state.favorites.has(p.id);
  const inCart = state.cart.has(p.id);

  return `
    <div class="card glass">
      <div class="heart ${fav?"active":""}"
        onclick="toggleFavorite(${p.id})">❤️</div>
      <h3>${p.name}</h3>
      <div class="price">₽ ${p.price} · ${p.size}</div>
      <button class="btn" 
        ${inCart?"disabled":""}
        onclick="addToCart(${p.id})">
        ${inCart ? "В корзине" : "В корзину"}
      </button>
    </div>
  `;
}

/* ---------- FAVORITES ---------- */
function favs() {
  if (!state.favorites.size) {
    app.innerHTML = "<h2>❤️ Избранное</h2><p>Пусто</p>";
    return;
  }

  app.innerHTML = `
    <h2>❤️ Избранное</h2>
    ${[...state.favorites]
      .map(id => card(products.find(p=>p.id===id)))
      .join("")}
  `;
}

/* ---------- CART ---------- */
function cart() {
  const items = [...state.cart].map(id=>products.find(p=>p.id===id));
  const total = items.reduce((s,p)=>s+p.price,0);

  app.innerHTML = `
    <h2>🛒 Корзина</h2>
    ${items.map(p=>`<p>${p.name} — ₽${p.price}</p>`).join("")}
    <h3>Итого: ₽${total}</h3>
    <button class="btn">Купить</button>
  `;
}

/* ---------- ACTIONS ---------- */
function setCat(cat, index) {
  state.category = cat;
  moveCategoryIndicator(index);
  render();
}

function addToCart(id) {
  if (state.cart.has(id)) return;
  state.cart.add(id);
  render();
}

function toggleFavorite(id) {
  state.favorites.has(id)
    ? state.favorites.delete(id)
    : state.favorites.add(id);
  render();
}

/* ---------- CATEGORY INDICATOR ---------- */
function moveCategoryIndicator(index) {
  const i = index ?? cats.findIndex(c=>c.id===state.category);
  document.getElementById("cat-indicator")
    .style.transform = `translateX(${i * 100}%)`;
}

/* ---------- BOTTOM NAV ---------- */
const bottomTabs = ["shop","favorites","game","cart","profile"];

bottom.querySelectorAll("button").forEach((btn,i)=>{
  btn.onclick = ()=>{
    state.tab = bottomTabs[i];
    bottomIndicator.style.transform = `translateX(${i*100}%)`;
    bottom.querySelectorAll("button").forEach(b=>b.classList.remove("active"));
    btn.classList.add("active");
    render();
  };
});

/* ---------- BADGES ---------- */
function updateBadges() {
  document.querySelectorAll(".count").forEach(x=>x.remove());

  if (state.favorites.size) addBadge(1, state.favorites.size);
  if (state.cart.size) addBadge(3, state.cart.size);
}

function addBadge(index, count) {
  const btn = bottom.querySelectorAll("button")[index];
  btn.insertAdjacentHTML("beforeend",
    `<span class="count">${count}</span>`
  );
}

render();
