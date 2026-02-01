const tg = window.Telegram?.WebApp;
if (tg) {
  tg.ready();
  tg.expand();
}

const app = document.getElementById("app");
const bottom = document.getElementById("bottom-bar");
const bottomIndicator = document.getElementById("bottom-indicator");

const state = {
  tab: "shop",
  category: "all",
  cart: [],
  favorites: [],
  filters: { maxPrice:null, size:null, condition:null }
};

const products = [
  {id:1,name:"Nike Hoodie",price:6500,size:"XXS-XXL",condition:"used",category:"hoodie"},
  {id:2,name:"Calvin Klein Jacket",price:10000,size:"XXS-XXL",condition:"new",category:"jacket"},
  {id:3,name:"Nike Jordan 1",price:6500,size:"36-46",condition:"used",category:"shoes"},
  {id:4,name:"Leather Belt",price:2500,size:"M",condition:"new",category:"belt"}
];

function render() {
  if (state.tab === "shop") renderShop();
  if (state.tab === "favorites") app.innerHTML = "<h2>❤️ Избранное</h2><p>Пусто</p>";
  if (state.tab === "cart") app.innerHTML = "<h2>🛒 Корзина</h2><p>Пусто</p>";
  if (state.tab === "game") app.innerHTML = "<h2>🎮 Игра</h2><p>Скоро</p>";
  if (state.tab === "profile") app.innerHTML = "<h2>👤 Профиль</h2>";
}

function renderShop() {
  app.innerHTML = `
    <h1>🍉 Арбуз Маркет</h1>
    <div class="hook">streetwear with history</div>

    <div class="tabs-wrapper glass">
      <div class="tab-indicator" id="tab-indicator"></div>
      <div class="tabs">
        <button data-cat="all">Все</button>
        <button data-cat="hoodie">Кофты</button>
        <button data-cat="jacket">Куртки</button>
        <button data-cat="shoes">Обувь</button>
        <button data-cat="belt">Ремни</button>
      </div>
    </div>

    <div class="filters">
      <input type="number" placeholder="Бюджет ₽"
        onchange="state.filters.maxPrice=this.value||null;render()">
      <select onchange="state.filters.size=this.value||null;render()">
        <option value="">Размер</option>
        <option>36-46</option>
        <option>XXS-XXL</option>
      </select>
      <select onchange="state.filters.condition=this.value||null;render()">
        <option value="">Состояние</option>
        <option>new</option>
        <option>used</option>
      </select>
    </div>

    ${products.map(p=>`
      <div class="card glass">
        <div class="heart">❤️</div>
        <h3>${p.name}</h3>
        <div class="price">₽ ${p.price} · ${p.size}</div>
        <button class="btn">В корзину</button>
      </div>
    `).join("")}
  `;

  initTabs();
}

function initTabs() {
  const buttons = document.querySelectorAll(".tabs button");
  const indicator = document.getElementById("tab-indicator");
  buttons.forEach((b,i)=>{
    b.onclick=()=>{
      state.category=b.dataset.cat;
      indicator.style.transform=`translateX(${i*100}%)`;
    };
  });
}

bottom.querySelectorAll("button").forEach((b,i)=>{
  b.onclick=()=>{
    state.tab=b.dataset.tab;
    bottomIndicator.style.transform=`translateX(${i*100}%)`;
    render();
  };
});

render();
