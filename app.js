const app = document.getElementById("app");
const bottom = document.getElementById("bottom");
const indicator = document.getElementById("bottom-indicator");

const products = [
  {id:1,name:"Air Force 1",price:12000},
  {id:2,name:"Air Jordan 4",price:18000},
  {id:3,name:"Raf Simons",price:25000},
];

const state = {
  tab: localStorage.getItem("tab") || "shop",
  cart: JSON.parse(localStorage.getItem("cart")||"[]"),
  fav: JSON.parse(localStorage.getItem("fav")||"[]"),
  watermelons: Number(localStorage.getItem("watermelons")||0)
};

function save(){
  localStorage.setItem("tab",state.tab);
  localStorage.setItem("cart",JSON.stringify(state.cart));
  localStorage.setItem("fav",JSON.stringify(state.fav));
  localStorage.setItem("watermelons",state.watermelons);
}

/* NAV */
bottom.querySelectorAll("button").forEach((b,i)=>{
  b.onclick=()=>{
    state.tab=b.dataset.tab;
    indicator.style.transform=`translateX(${i*100}%)`;
    save();
    render();
  };
});

/* ACTIONS */
function addToCart(id){
  if(state.cart.includes(id)) return;
  state.cart.push(id);
  save(); render();
}
function removeFromCart(id){
  state.cart=state.cart.filter(x=>x!==id);
  save(); render();
}
function toggleFav(id){
  state.fav.includes(id)
    ? state.fav=state.fav.filter(x=>x!==id)
    : state.fav.push(id);
  save(); render();
}

/* RENDER */
let gameInterval=null;

function render(){
  document.getElementById("cart-count").textContent=state.cart.length||"";
  document.getElementById("fav-count").textContent=state.fav.length||"";

  if(state.tab!=="game") stopGame();

  if(state.tab==="shop") renderShop();
  if(state.tab==="fav") renderFav();
  if(state.tab==="cart") renderCart();
  if(state.tab==="game") renderGame();
  if(state.tab==="profile") renderProfile();
}

/* VIEWS */
function renderShop(){
  app.innerHTML=`<h1>🍉 Арбуз Маркет</h1>`+
    products.map(p=>`
      <div class="card">
        <button class="heart" onclick="toggleFav(${p.id})">
          ${state.fav.includes(p.id)?"❤️":"🤍"}
        </button>
        <h3>${p.name}</h3>
        <div class="price">₽ ${p.price}</div>
        <button class="btn" onclick="addToCart(${p.id})">
          ${state.cart.includes(p.id)?"В корзине":"В корзину"}
        </button>
      </div>
    `).join("");
}

function renderFav(){
  app.innerHTML="<h2>❤️ Избранное</h2>"+
    (state.fav.length
      ? state.fav.map(id=>{
          const p=products.find(x=>x.id===id);
          return `<div class="card">${p.name}
            <br><button class="btn" onclick="addToCart(${id})">В корзину</button>
          </div>`;
        }).join("")
      : "<p>Пусто</p>");
}

function renderCart(){
  let sum=0;
  app.innerHTML="<h2>🛒 Корзина</h2>"+
    (state.cart.length
      ? state.cart.map(id=>{
          const p=products.find(x=>x.id===id);
          sum+=p.price;
          return `<div class="card">${p.name} — ₽${p.price}
            <br><button class="btn" onclick="removeFromCart(${id})">Удалить</button>
          </div>`;
        }).join("")
      : "<p>Корзина пуста</p>")+
    (state.cart.length?`<h3>Итого: ₽${sum}</h3>`:"");
}

function renderProfile(){
  app.innerHTML=`
    <h2>👤 Профиль</h2>
    <p>🍉 Баланс: ${state.watermelons}</p>
    <p>100 🍉 = 1% скидки</p>
  `;
}

/* GAME */
function renderGame(){
  app.innerHTML=`
    <h2>🎮 Лови арбузики</h2>
    <p id="melon-balance">Баланс: 🍉 ${state.watermelons}</p>
    <div id="game-area">
      <div id="game-placeholder">
        тут будет фото корзины с кроссовками
      </div>
    </div>
  `;
  startGame();
}

function startGame(){
  stopGame();
  const area=document.getElementById("game-area");
  const balance=document.getElementById("melon-balance");

  gameInterval=setInterval(()=>{
    const slice=document.createElement("div");
    const rotten=Math.random()<0.2;
    slice.className="slice"+(rotten?" rotten":"");
    slice.textContent=rotten?"☠️":"🍉";
    slice.style.left=Math.random()*(area.clientWidth-40)+"px";
    slice.style.top="-50px";
    area.appendChild(slice);

    let y=-50;
    const fall=setInterval(()=>{
      y+=2.4;
      slice.style.top=y+"px";
      if(y>area.clientHeight){
        clearInterval(fall);
        slice.remove();
      }
    },16);

    slice.onclick=()=>{
      clearInterval(fall);
      slice.remove();
      const delta=rotten?-5:1;
      state.watermelons=Math.max(0,state.watermelons+delta);
      save();
      balance.textContent=`Баланс: 🍉 ${state.watermelons}`;

      const fx=document.createElement("div");
      fx.className="fx";
      fx.textContent=delta>0?"+1":"-5";
      fx.style.left=slice.style.left;
      fx.style.top=y+"px";
      fx.style.color=delta>0?"#3ddc84":"#f44";
      area.appendChild(fx);
      setTimeout(()=>fx.remove(),600);
    };
  },900);
}

function stopGame(){
  if(gameInterval){
    clearInterval(gameInterval);
    gameInterval=null;
  }
}

render();
