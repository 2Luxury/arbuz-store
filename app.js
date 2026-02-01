const app = document.getElementById("app")

const ITEMS = [
  {id:1,name:"Nike Hoodie",price:6500,cat:"hood"},
  {id:2,name:"Calvin Klein Jacket",price:10000,cat:"jacket"},
  {id:3,name:"Nike Jordan 1",price:6500,cat:"shoes"},
  {id:4,name:"Leather Belt",price:2500,cat:"belt"},
]

// --- STATE ---
const state = {
  tab: localStorage.getItem("tab") || "shop",
  category: "all",
  catIndex: 0,
  cart: JSON.parse(localStorage.getItem("cart")||"{}"),
  fav: JSON.parse(localStorage.getItem("fav")||"{}")
}

// --- SAVE ---
function persist(){
  localStorage.setItem("cart",JSON.stringify(state.cart))
  localStorage.setItem("fav",JSON.stringify(state.fav))
  localStorage.setItem("tab",state.tab)
}

// --- TABS ---
function setTab(tab){
  state.tab = tab
  persist()
  render()
}

// --- CATEGORIES ---
function setCategory(cat,index){
  state.category = cat
  state.catIndex = index
  render()
}

// --- CART ---
function addToCart(id){
  if(state.cart[id]) return
  state.cart[id] = true
  persist()
  render()
}
function removeFromCart(id){
  delete state.cart[id]
  persist()
  render()
}

// --- FAV ---
function toggleFav(id){
  state.fav[id] ? delete state.fav[id] : state.fav[id]=true
  persist()
  render()
}

// --- RENDER ---
function render(){
  document.getElementById("cart-c").innerText =
    Object.keys(state.cart).length || ""
  document.getElementById("fav-c").innerText =
    Object.keys(state.fav).length || ""

  // --- SHOP ---
  if(state.tab==="shop"){
    const filtered = ITEMS.filter(i =>
      state.category==="all" || i.cat===state.category
    )

    app.innerHTML = `
    <div class="glass">
      <h1>🍉 Арбуз Маркет</h1>
      <div class="sub">Streetwear with character</div>

      <div class="cats">
        <div class="ind" id="cat-ind"></div>
        <button onclick="setCategory('all',0)">Все</button>
        <button onclick="setCategory('hood',1)">Кофты</button>
        <button onclick="setCategory('jacket',2)">Куртки</button>
        <button onclick="setCategory('shoes',3)">Обувь</button>
        <button onclick="setCategory('belt',4)">Ремни</button>
      </div>
    </div>

    ${filtered.map(i=>`
      <div class="glass item">
        <button class="heart" onclick="toggleFav(${i.id})">
          ${state.fav[i.id]?"❤️":"🤍"}
        </button>
        <h3>${i.name}</h3>
        <div class="price">₽ ${i.price}</div>
        <button class="add" onclick="addToCart(${i.id})">
          ${state.cart[i.id]?"В корзине":"В корзину"}
        </button>
      </div>
    `).join("")}
    `

    requestAnimationFrame(()=>{
      const ind = document.getElementById("cat-ind")
      const btn = document.querySelector(".cats button")
      if(ind && btn){
        ind.style.width = btn.offsetWidth+"px"
        ind.style.transform = `translateX(${btn.offsetWidth*state.catIndex}px)`
      }
    })
  }

  // --- FAV ---
  if(state.tab==="fav"){
    const ids = Object.keys(state.fav)
    app.innerHTML = `<h2>❤️ Избранное</h2>` +
      (ids.length ? ids.map(id=>{
        const i = ITEMS.find(x=>x.id==id)
        return `
        <div class="glass">
          <h3>${i.name}</h3>
          <button onclick="addToCart(${id})">В корзину</button>
          <button onclick="toggleFav(${id})">Удалить</button>
        </div>`
      }).join("") : "<p>Пусто</p>")
  }

  // --- CART ---
  if(state.tab==="cart"){
    let sum=0
    const ids = Object.keys(state.cart)
    app.innerHTML = `<h2>🛒 Корзина</h2>` +
      ids.map(id=>{
        const i=ITEMS.find(x=>x.id==id)
        sum+=i.price
        return `
        <div class="glass">
          ${i.name} — ₽${i.price}
          <button onclick="removeFromCart(${id})">Удалить</button>
        </div>`
      }).join("") +
      (ids.length?`<h3>Итого: ₽${sum}</h3>`:"")
  }

  // --- GAME ---
  if(state.tab==="game"){
    app.innerHTML = `
      <div class="glass">
        <h2>🎮 Игра</h2>
        <p>Скоро: лови арбузы — получай скидку 🍉</p>
      </div>`
  }

  // --- PROFILE ---
  if(state.tab==="profile"){
    app.innerHTML = `
      <div class="glass">
        <h2>👤 Профиль</h2>
        <p>История заказов скоро</p>
      </div>`
  }

  // --- BOTTOM IND ---
  const tabs = document.querySelectorAll("#bottom-bar button")
  const ind = document.getElementById("tab-ind")
  const idx = ["shop","fav","game","cart","profile"].indexOf(state.tab)
  if(tabs[idx]){
    ind.style.width = tabs[idx].offsetWidth+"px"
    ind.style.transform =
      `translateX(${tabs[idx].offsetLeft}px)`
  }
}

render()
