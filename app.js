const state = {
  tab: "shop",
  category: "all",
  cart: new Set(),
  fav: new Set()
};

const products = [
  {id:1, name:"Nike Hoodie", price:6500, size:"XXS-XXL", cat:"hoodie"},
  {id:2, name:"Calvin Klein Jacket", price:10000, size:"XXS-XXL", cat:"jacket"},
  {id:3, name:"Nike Jordan 1", price:6500, size:"36-46", cat:"shoes"},
  {id:4, name:"Leather Belt", price:2500, size:"M", cat:"belt"}
];

const app = document.getElementById("app");

function render() {
  updateCounts();
  moveBottom();
  if(state.tab==="shop") shopView();
  if(state.tab==="fav") favView();
  if(state.tab==="cart") cartView();
  if(state.tab==="game") app.innerHTML="<h2>🎮 Скоро игра</h2>";
  if(state.tab==="profile") app.innerHTML="<h2>👤 Профиль</h2>";
}

function shopView() {
  const cats = ["all","hoodie","jacket","shoes","belt"];
  const labels = ["Все","Кофты","Куртки","Обувь","Ремни"];
  app.innerHTML = `
    <h1>🍉 Арбуз Маркет</h1>
    <div class="sub">streetwear with history</div>

    <div class="categories glass">
      <div class="cat-indicator" id="cat-ind"></div>
      ${labels.map((l,i)=>`<button onclick="setCat('${cats[i]}',${i})">${l}</button>`).join("")}
    </div>

    ${products
      .filter(p=>state.category==="all"||p.cat===state.category)
      .map(p=>`
        <div class="card glass">
          <div class="heart ${state.fav.has(p.id)?"active":""}" onclick="toggleFav(${p.id})">❤️</div>
          <h3>${p.name}</h3>
          <div class="meta">₽${p.price} · ${p.size}</div>
          <button class="btn" onclick="addToCart(${p.id})">В корзину</button>
        </div>
      `).join("")}
  `;
}

function favView() {
  app.innerHTML = `<h2>❤️ Избранное</h2>` +
    [...state.fav].map(id=>{
      const p=products.find(x=>x.id===id);
      return `<div class="card glass">
        <h3>${p.name}</h3>
        <button class="btn" onclick="addToCart(${id})">В корзину</button>
      </div>`;
    }).join("") || "<p>Пусто</p>";
}

function cartView() {
  const items=[...state.cart].map(id=>products.find(p=>p.id===id));
  const sum=items.reduce((s,p)=>s+p.price,0);
  app.innerHTML=`<h2>🛒 Корзина</h2>
    ${items.map(p=>`<p>${p.name} — ₽${p.price}</p>`).join("")}
    <h3>Итого: ₽${sum}</h3>
    <button class="btn">Купить</button>`;
}

function addToCart(id){ if(state.cart.has(id))return; state.cart.add(id); render(); }
function toggleFav(id){ state.fav.has(id)?state.fav.delete(id):state.fav.add(id); render(); }

function setCat(cat,i){
  state.category=cat;
  document.getElementById("cat-ind").style.transform=`translateX(${i*100}%)`;
  render();
}

function updateCounts(){
  document.getElementById("cart-count").textContent=state.cart.size||"";
  document.getElementById("fav-count").textContent=state.fav.size||"";
}

function moveBottom(){
  const i=["shop","fav","game","cart","profile"].indexOf(state.tab);
  document.getElementById("bottom-indicator").style.transform=`translateX(${i*100}%)`;
}

document.querySelectorAll(".bottom button").forEach((b,i)=>{
  b.onclick=()=>{ state.tab=b.dataset.tab; moveBottom(); render(); }
});

render();
