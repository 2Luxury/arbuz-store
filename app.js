const tg = window.Telegram?.WebApp;
tg?.ready();
tg?.expand();

const app = document.getElementById("app");
const bottom = document.getElementById("bottom-bar");
const bottomIndicator = document.getElementById("bottom-indicator");

/* STATE */
const state = {
  tab: "shop",
  category: "all",
  cart: [],
  favorites: []
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

function render() {
  if (state.tab === "shop") shop();
  if (state.tab === "favorites") favs();
  if (state.tab === "cart") cart();
  if (state.tab === "game") app.innerHTML = "<h2>🎮 Игра скоро</h2>";
  if (state.tab === "profile") app.innerHTML = "<h2>👤 Профиль</h2>";
  counts();
}

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
        ${cats.map(c=>`
          <button class="${c.id===state.category?"active":""}"
            onclick="setCat('${c.id}')">${c.label}</button>
        `).join("")}
      </div>
    </div>

    ${list.map(card).join("")}
  `;

  moveCat();
}

function card(p) {
  return `
    <div class="card glass">
      <div class="heart ${state.favorites.includes(p.id)?"active":""}"
        onclick="fav(${p.id})">❤️</div>
      <h3>${p.name}</h3>
      <div class="price">₽ ${p.price} · ${p.size}</div>
      <button class="btn" onclick="add(${p.id})">В корзину</button>
    </div>
  `;
}

function favs() {
  app.innerHTML = `<h2>❤️ Избранное</h2>` +
    (state.favorites.length
      ? state.favorites.map(id=>card(products.find(p=>p.id===id))).join("")
      : "<p>Пусто</p>");
}

function cart() {
  const items = state.cart.map(id=>products.find(p=>p.id===id));
  const total = items.reduce((s,p)=>s+p.price,0);
  app.innerHTML = `
    <h2>🛒 Корзина</h2>
    ${items.map(p=>`<p>${p.name} — ₽${p.price}</p>`).join("")}
    <h3>Итого: ₽${total}</h3>
    <button class="btn">Купить</button>
  `;
}

/* ACTIONS */
function setCat(c){ state.category=c; render(); }
function add(id){ state.cart.push(id); render(); }
function fav(id){
  state.favorites.includes(id)
    ? state.favorites = state.favorites.filter(x=>x!==id)
    : state.favorites.push(id);
  render();
}

/* INDICATORS */
function moveCat(){
  const i = cats.findIndex(c=>c.id===state.category);
  document.getElementById("cat-indicator")
    .style.transform = `translateX(${i*100}%)`;
}

bottom.querySelectorAll("button").forEach((b,i)=>{
  b.onclick = ()=>{
    state.tab = b.dataset.tab;
    bottomIndicator.style.transform = `translateX(${i*100}%)`;
    bottom.querySelectorAll("button").forEach(x=>x.classList.remove("active"));
    b.classList.add("active");
    render();
  };
});

/* COUNTS */
function counts(){
  document.querySelectorAll(".count").forEach(x=>x.remove());
  if (state.favorites.length) badge("favorites", state.favorites.length);
  if (state.cart.length) badge("cart", state.cart.length);
}

function badge(tab,n){
  const btn=[...bottom.children].find(b=>b.dataset.tab===tab);
  btn.innerHTML+=`<span class="count">${n}</span>`;
}

render();
