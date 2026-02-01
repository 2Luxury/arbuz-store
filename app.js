const tg = window.Telegram?.WebApp;
if (tg) {
  tg.ready();
  tg.expand();
}

const app = document.getElementById("app");
const bottom = document.getElementById("bottom-bar");

if (!app || !bottom) {
  document.body.innerHTML =
    "<pre style='color:white'>HTML ELEMENTS NOT FOUND</pre>";
  throw new Error("DOM missing");
}

app.innerHTML = `
  <h1>🍉 Арбуз Маркет</h1>
  <p>Если ты это видишь — JS работает</p>
`;

bottom.innerHTML = `
  <div>❤️</div>
  <div>🎮</div>
  <div>🛒</div>
  <div>👤</div>
`;
