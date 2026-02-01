const app = document.getElementById("app");

const PRODUCTS = [
  {id:1,name:"Nike Hoodie",price:6500,cat:"hood"},
  {id:2,name:"Calvin Klein Jacket",price:10000,cat:"jacket"},
  {id:3,name:"Nike Jordan 1",price:6500,cat:"shoes"},
  {id:4,name:"Leather Belt",price:2500,cat:"belt"},
];

const state = {
  tab: localStorage.getItem("tab") || "shop",
  category: "all",
  catIndex: 0,
  cart: JSON.parse(localStorage.getItem("cart")||"{}"),
  fav: JSON.parse(localStorage.getItem("fav")||"{}")
};

function save(){
  localStorage.setItem("cart",JSON.stringify(state.cart));
  localStorage.setItem("fav",JSON.stringify(state.fav));
  localStorage.setItem("tab",state.tab);
}

/* tabs */
function setTab(tab){ state.tab=tab; save(); render(); }
function setCategory(cat,i){ state.category=cat; state.catIndex=i; render(); }

/* actions */
function toggleFav(id){ state.fav[id]?delete state.fav[id]:state.fav[id]=true; save(); render(); }
function addToCart(id){ if(state.cart[id])return; state.cart[id]=true; save(); render(); }
function removeFromCart(id){ delete state.cart[id]; save(); render(); }

/* render */
function render(){
  document.getElementById("fav-count").textContent = Object.keys(state.fav).length||"";
  document.getElementById("cart-count").textContent = Object.keys(state.cart).length||"";

  if(state.tab==="shop") renderShop();
  if(state.tab==="fav") renderFav();
  if(state.tab==="cart") renderCart();
  if(state.tab==="game") app.innerHTML="<div class='glass'><h2>🎮 Игра скоро</h2></div>";
  if(state.tab==="profile") app.innerHTML="<div class='glass'><h2>👤 Профиль</h2></div>";

  requestAnimationFrame(moveBottomIndicator);
}

function renderShop(){
  const list = PRODUCTS.filter(p=>state.category==="all"||p.cat===state.category);
  app.innerHTML=`
    <div class="glass">
      <h1>🍉 Арбуз Маркет</h1>
      <div class="sub">streetwear with history</div>
      <div class="cats">
        <div class="cat-ind" id="cat-ind"></div>
        <button onclick="setCategory('all',0)">Все</button>
        <button onclick="setCategory('hood',1)">Кофты</button>
        <button onclick="setCategory('jacket',2)">Куртки</button>
        <button onclick="setCategory('shoes',3)">Обувь</button>
        <button onclick="setCategory('belt',4)">Ремни</button>
      </div>
    </div>
    ${list.map(p=>`
      <div class="glass card">
        <button class="heart" onclick="toggleFav(${p.id})">${state.fav[p.id]?"❤️":"🤍"}</button>
        <h3>${p.name}</h3>
        <div class="price">₽ ${p.price}</div>
        <button class="btn" onclick="addToCart(${p.id})">
          ${state.cart[p.id]?"В корзине":"В корзину"}
        </button>
      </div>
    `).join("")}
  `;
  requestAnimationFrame(moveCategoryIndicator);
}

function renderFav(){
  const ids=Object.keys(state.fav);
  app.innerHTML=`
    <div class="glass">
      <h2>❤️ Избранное</h2>
      ${ids.length?ids.map(id=>{
        const p=PRODUCTS.find(x=>x.id==id);
        return `<p>${p.name}</p>
        <button class="btn" onclick="addToCart(${id})">В корзину</button>
        <button onclick="toggleFav(${id})">Удалить</button>`;
      }).join(""):"<p>Пусто</p>"}
    </div>
  `;
}

function renderCart(){
  const ids=Object.keys(state.cart); let sum=0;
  app.innerHTML=`
    <div class="glass">
      <h2>🛒 Корзина</h2>
      ${ids.length?ids.map(id=>{
        const p=PRODUCTS.find(x=>x.id==id); sum+=p.price;
        return `<p>${p.name} — ₽${p.price}</p>
        <button onclick="removeFromCart(${id})">Удалить</button>`;
      }).join(""):"<p>Корзина пуста</p>"}
      ${ids.length?`<h3>Итого: ₽${sum}</h3><button class="btn">Купить</button>`:""}
    </div>
  `;
}

/* indicators — PX, без дёрганий */
function moveCategoryIndicator(){
  const buttons=document.querySelectorAll(".cats button");
  const ind=document.getElementById("cat-ind");
  const btn=buttons[state.catIndex];
  if(!btn||!ind)return;
  ind.style.width=btn.offsetWidth+"px";
  ind.style.transform=`translateX(${btn.offsetLeft}px)`;
}

function moveBottomIndicator(){
  const tabs=["shop","fav","game","cart","profile"];
  const buttons=document.querySelectorAll("#bottom-bar button");
  const ind=document.getElementById("bottom-indicator");
  const btn=buttons[tabs.indexOf(state.tab)];
  if(!btn||!ind)return;
  ind.style.width=btn.offsetWidth+"px";
  ind.style.transform=`translateX(${btn.offsetLeft}px)`;
}

render();
