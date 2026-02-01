const state={
  tab:"shop",
  cat:"all",
  catIndex:0,
  tabIndex:0,
  cart:new Set(),
  fav:new Set()
}

const items=[
 {id:1,name:"Nike Hoodie",price:6500,cat:"hood"},
 {id:2,name:"Calvin Klein Jacket",price:10000,cat:"jacket"},
 {id:3,name:"Nike Jordan 1",price:6500,cat:"shoes"},
 {id:4,name:"Leather Belt",price:2500,cat:"belt"},
]

function setTab(t,i){
  state.tab=t;state.tabIndex=i;render()
}
function setCat(c,i){
  state.cat=c;state.catIndex=i;render()
}

function toggleFav(id){
  state.fav.has(id)?state.fav.delete(id):state.fav.add(id)
  render()
}
function addCart(id){
  state.cart.add(id)
  render()
}

function render(){
  const app=document.getElementById("app")
  document.getElementById("cart-c").innerText=state.cart.size||""
  document.getElementById("fav-c").innerText=state.fav.size||""

  if(state.tab==="shop"){
    app.innerHTML=`
    <div class="glass">
      <h1>🍉 Арбуз Маркет</h1>
      <div class="sub">Streetwear with character</div>
      <div class="cats">
        <div class="ind" id="cat-ind"></div>
        <button onclick="setCat('all',0)">Все</button>
        <button onclick="setCat('hood',1)">Кофты</button>
        <button onclick="setCat('jacket',2)">Куртки</button>
        <button onclick="setCat('shoes',3)">Обувь</button>
        <button onclick="setCat('belt',4)">Ремни</button>
      </div>
    </div>
    ${items.filter(i=>state.cat==="all"||i.cat===state.cat).map(i=>`
      <div class="glass item">
        <button class="heart" onclick="toggleFav(${i.id})">
          ${state.fav.has(i.id)?"❤️":"🤍"}
        </button>
        <h3>${i.name}</h3>
        <div class="price">₽ ${i.price}</div>
        <button class="add" onclick="addCart(${i.id})">
          ${state.cart.has(i.id)?"В корзине":"В корзину"}
        </button>
      </div>
    `).join("")}`
    requestAnimationFrame(()=>{
      document.getElementById("cat-ind").style.transform=
        `translateX(${state.catIndex*100}%)`
    })
  }

  if(state.tab==="fav"){
    app.innerHTML=`<h2>❤️ Избранное</h2>`+
      [...state.fav].map(id=>{
        const i=items.find(x=>x.id===id)
        return `<div class="glass">${i.name}</div>`
      }).join("")||"Пусто"
  }

  if(state.tab==="cart"){
    let sum=0
    app.innerHTML=`<h2>🛒 Корзина</h2>`+
    [...state.cart].map(id=>{
      const i=items.find(x=>x.id===id);sum+=i.price
      return `<div>${i.name} — ₽${i.price}</div>`
    }).join("")+
    `<h3>Итого: ₽${sum}</h3>`
  }

  document.getElementById("tab-ind").style.transform=
    `translateX(${state.tabIndex*100}%)`
}

render()
