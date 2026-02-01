const tg = window.Telegram?.WebApp;
tg?.ready();
tg?.expand();

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
  if (state.tab === "favorites") renderList("❤️ Избранное", state.favorites);
  if (state.tab === "cart") renderList("🛒 Корзина", state.cart);
  updateCounts();
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
    <div class="hook">streetwear with history</div>

    <div class="tabs-wrapper glass">
      <div class="tab-indicator" id="tab-indicator"></div>
      <div class="tabs">
        ${["all","hoodie","jacket","shoes","belt"].map(c=>`
          <button class="${state.category===c?"active":""}"
            onclick="setCategory('${c}')">
            ${label(c)}
          </button>`).join("")}
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

    ${filtered.map(p=>`
      <div class="card glass">
        <div class="heart ${state.favorites.includes(p.id)?"active":""}"
          onclick="toggleFav(${p.id})">❤️</div>
        <h3>${p.name}</h3>
        <div class="price">₽ ${p.price} · ${p.size}</div>
        <button class="btn" onclick="addToCart(${p.id})">В корзину</button>
      </div>
    `).join("") || "<p>Ничего не найдено</p>"}
  `;

  moveTabIndicator();
}

function setCategory(c){
  state.category=c;
  render();
}

function moveTabIndicator(){
  const i = ["all","hoodie","jacket","shoes","belt"].indexOf(state.category);
  document.getElementById("tab-indicator").style.transform=`translateX(${i*100}%)`;
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

function renderList(title, list){
  app.innerHTML = `<h2>${title}</h2>` +
    (list.length
      ? list.map(id=>`<p>${products.find(p=>p.id===id).name}</p>`).join("")
      : "<p>Пусто</p>");
}

function updateCounts(){
  document.querySelectorAll(".count").forEach(e=>e.remove());
  addCount(1, state.favorites.length);
  addCount(3, state.cart.length);
}

function addCount(index, value){
  if (!value) return;
  const btn = bottom.children[index];
  btn.innerHTML += `<span class="count">${value}</span>`;
}

function label(c){
  return {all:"Все",hoodie:"Кофты",jacket:"Куртки",shoes:"Обувь",belt:"Ремни"}[c];
}

bottom.querySelectorAll("button").forEach((b,i)=>{
  b.onclick=()=>{
    state.tab=b.dataset.tab;
    bottomIndicator.style.transform=`translateX(${i*100}%)`;
    render();
  };
});

render();
