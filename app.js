const app = document.getElementById("app");
const bottom = document.getElementById("bottom-bar");

let tab = "shop";
let category = "Все";

let cart = JSON.parse(localStorage.getItem("cart")) || [];
let fav = JSON.parse(localStorage.getItem("fav")) || [];

const products = [
  {id:1,name:"Nike Hoodie",price:6500,size:"L",cat:"Кофты"},
  {id:2,name:"Calvin Klein Jacket",price:10000,size:"L",cat:"Куртки"},
  {id:3,name:"Nike Jordan 1",price:6500,size:"43",cat:"Обувь"},
  {id:4,name:"Leather Belt",price:2500,size:"M",cat:"Ремни"},
];

render();

function render() {
  app.innerHTML = "";
  renderBottom();

  if (tab === "shop") renderShop();
  if (tab === "cart") renderCart();
  if (tab === "fav") renderFav();
  if (tab === "game") app.innerHTML = "<h2>🎮 Игра скоро</h2>";
  if (tab === "profile") app.innerHTML = "<h2>👤 Профиль</h2>";
}

function renderShop() {
  const cats = ["Все","Кофты","Куртки","Обувь","Ремни"];
  const filtered = category==="Все"?products:products.filter(p=>p.cat===category);

  app.innerHTML = `
    <div class="header">
      <h1>🍉 Арбуз Маркет</h1>
      <div class="subtitle">resale · street · clean</div>
    </div>

    <div class="categories">
      <div class="liquid"></div>
      ${cats.map(c=>`<div class="cat ${c===category?"active":""}" onclick="setCat('${c}',this)">${c}</div>`).join("")}
    </div>

    <div class="grid">
      ${filtered.map(p=>`
        <div class="card">
          <div class="card-top">
            <b>${p.name}</b>
            <span class="heart ${fav.includes(p.id)?"active":""}" onclick="toggleFav(${p.id})">❤️</span>
          </div>
          <div class="price">₽ ${p.price} · ${p.size}</div>
          <button class="btn" onclick="addCart(${p.id})">В корзину</button>
        </div>
      `).join("")}
    </div>
  `;

  moveLiquid();
}

function renderCart() {
  const items = products.filter(p=>cart.includes(p.id));
  const sum = items.reduce((a,b)=>a+b.price,0);

  app.innerHTML = `
    <h2>Корзина</h2>
    ${items.map(i=>`<p>${i.name} — ₽${i.price}</p>`).join("")}
    <b>Итого: ₽${sum}</b>
  `;
}

function renderFav() {
  const items = products.filter(p=>fav.includes(p.id));
  app.innerHTML = `<h2>Избранное</h2>` + items.map(i=>`<p>${i.name}</p>`).join("");
}

function renderBottom() {
  bottom.innerHTML = `
    <div class="tab ${tab==="fav"?"active":""}" onclick="tab='fav';render()">❤️</div>
    <div class="tab ${tab==="game"?"active":""}" onclick="tab='game';render()">🎮</div>
    <div class="tab ${tab==="cart"?"active":""}" onclick="tab='cart';render()">🛒</div>
    <div class="tab ${tab==="profile"?"active":""}" onclick="tab='profile';render()">👤</div>
  `;
}

function addCart(id){
  if(!cart.includes(id)) cart.push(id);
  localStorage.setItem("cart",JSON.stringify(cart));
}

function toggleFav(id){
  fav.includes(id)?fav=fav.filter(f=>f!==id):fav.push(id);
  localStorage.setItem("fav",JSON.stringify(fav));
  render();
}

function setCat(c,el){
  category=c;
  render();
}

function moveLiquid(){
  const active = document.querySelector(".cat.active");
  const liquid = document.querySelector(".liquid");
  if(!active||!liquid) return;
  liquid.style.width = active.
