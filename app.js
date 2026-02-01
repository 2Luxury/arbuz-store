const tg = window.Telegram.WebApp;
tg.expand();

const productsDiv = document.getElementById("products");

// ТЕСТОВЫЕ ТОВАРЫ (чтобы экран не был пустым)
const products = [
  {
    title: "Nike Jordan 1",
    price: "6500 ₽",
    size: "43",
    category: "Обувь"
  },
  {
    title: "Calvin Klein Куртка",
    price: "10000 ₽",
    size: "L",
    category: "Верхняя одежда"
  }
];

let cart = [];

function render() {
  productsDiv.innerHTML = "";

  products.forEach((p, i) => {
    const div = document.createElement("div");
    div.className = "product";
    div.innerHTML = `
      <b>${p.title}</b><br>
      💰 ${p.price}<br>
      📏 ${p.size}<br>
      <button onclick="add(${i})">В корзину</button>
    `;
    productsDiv.appendChild(div);
  });
}

function add(index) {
  cart.push(products[index]);
  tg.showAlert("Добавлено в корзину");
}

document.getElementById("checkout").onclick = () => {
  if (!cart.length) {
    tg.showAlert("Корзина пустая");
    return;
  }

  const text =
    "Хочу купить:\n" +
    cart.map(p => `${p.title} – ${p.price}`).join("\n");

  tg.openTelegramLink(
    `https://t.me/arbuzshmot?text=${encodeURIComponent(text)}`
  );
};

render();
