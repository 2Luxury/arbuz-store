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
  cart: [],
  favorites: [],
};

/* ---------- DATA ---------- */
const products = [
  {id:1,name:"Nike Hoodie",price:6500,size:"XXS-XXL",category:"hoodie"},
  {id:2,name:"Calvin Klein Jacket",price:10000,size:"XXS-XXL",category:"jacket"},
  {id:3,name:"Nike Jordan 1",price:6500,size:"36-46",category:"shoes"},
  {id:4,name:"Leather Belt",price:2500,size:"M",category:"belt"}
];

const categories = [
  {id:"all",label:"Все"},
  {id:"hoodie",label:"Кофты"},
  {id:"jacket",label:"Куртки"},
  {id:"shoes",label:"Обувь"},
  {id:"belt",label:"Ремни"},
];

/* ---------- RENDER ---------- */
function render() {
  if (state.tab === "shop") renderShop();
  if (state.tab === "favorites") renderFavorites();
  if (state.tab === "cart") renderCart();
  if (state.tab === "game") renderGame();
  if (state.tab === "profile") renderProfile();
  updateCounts();
}

/* ---------- SHOP ---------- */
function renderShop() {
  const filtered = products.filter(p =>
    state.category === "all" || p.category === state.category
  );

  app.innerHTML = `
    <h1>🍉 Арбуз Маркет</h1>
    <div class="hook">streetwear with history</div>

    <div class="tabs-wrapper glass">
      <div class="tab-indicator" id="tab-indicator"></div>
      <div class="tabs">
        ${categories.map(c=>`
          <button
            class="${state.category===c.id?"active":""}"
            onclick="setCategory('${c.id}')">
            ${c.label}
          </button>
        `).join("")}
      </div>
    </div>

    ${filtered.map(p=>renderCard(p,true)).join("") || "<p>Пусто</p>"}
  `;

  moveCategoryIndicator();
}

/* ---------- CARDS ---------- */
function renderCard(p, showFav=true) {
  return `
    <div class="card glass">
      ${showFav ? `
        <div class="heart ${state.favorites.includes(p.id)?"active":""}"
          onclick="toggleFav(${p.id})">❤️</div>` : ""
      }
      <h3>${p.name}</h3>
      <div class="price">₽ ${p.price} · ${p.size}</div>
      <button class="btn" onclick="addToCart(${p.id})">В корзину</button>
    </div>
  `;
}

/* ---------- FAVORITES ---------- */
function renderFavorites() {
  app.innerHTML = `
    <h2>❤️ Избранное</h2>
    ${state.favorites.length
      ? state.favorites.map(id =>
          renderCard(products.find(p=>p.id===id),false)
        ).join("")
      : "<p>Пусто</p>"
    }
  `;
}

/* ---------- CART ---------- */
function renderCart() {
  const items = state.cart.map(id => products.find(p=>p.id===id));
  const total = items.reduce((s,p)=>s+p.price,0);

  app.innerHTML = `
    <h2>🛒 Корзина</h2>
    ${items.length
      ? items.map(p=>`
          <p>${p.name} — ₽${p.price}</p>
        `).join("") +
        `<h3>Итого: ₽${total}</h3>
         <button class="btn" onclick="checkout()">Купить</button>`
      : "<p>Корзина пуста</p>"
    }
  `;
}

/* ---------- OTHER TABS ---------- */
function renderGame() {
  app.innerHTML = `<h2>🎮 Игра</h2><p>Скоро арбузы 🍉</p>`;
}

function renderProfile() {
  app.innerHTML = `<h2>👤 Профиль</h2><p>История заказов скоро</p>`;
}

/* ---------- ACTIONS ---------- */
function setCategory(c){
  state.category = c;
  render();
}

function toggleFav(id){
  state.favorites.includes(id)
    ? state.favorites = state.favorites.filter(x=>x!==id)
    : state.favorites.push(id);
  render();
}

function addToCart(id){
  state.cart.push(id);
  render();
}

function checkout(){
  alert("Дальше оформляем заказ 🔥");
}

/* ---------- INDICATORS ---------- */
function moveCategoryIndicator(){
  const i = categories.findIndex(c=>c.id===state.category);
  document.getElementById("tab-indicator")
    .style.transform = `translateX(${i*100}%)`;
}

/* ---------- BOTTOM ---------- */
bottom.querySelectorAll("button").forEach((btn,i)=>{
  btn.onclick = ()=>{
    state.tab = btn.dataset.tab;
    bottomIndicator.style.transform = `translateX(${i*100}%)`;
    render();
  };
});

/* ---------- COUNTS ---------- */
function updateCounts(){
  document.querySelectorAll(".count").forEach(e=>e.remove());

  if (state.favorites.length)
    addCount("favorites", state.favorites.length);

  if (state.cart.length)
    addCount("cart", state.cart.length);
}

function addCount(tab,value){
  const btn = [...bottom.children]
    .find(b=>b.dataset.tab===tab);
  btn.innerHTML += `<span class="count">${value}</span>`;
}

render();
