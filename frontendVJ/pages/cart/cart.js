// Variables
const itemsDOM = document.querySelector(".items");
const itemsHeaderDOM = document.querySelector(".items__header");
const subtotalDOM = document.querySelector(".subtotal__units");
const esttotalDOM = document.querySelector(".est-total__price");

window.addEventListener("DOMContentLoaded", () => {
  setupCartPage();
});

function setupCartPage() {
  let cart = Storage.getCart();
  setHeader(cart.length);
  displayItems(cart);
  setSummary(cart);
}

function displayItems(cart) {
  cart.forEach((item) => {
    const article = document.createElement("article");
    article.setAttribute("class", "item");
    article.innerHTML = `<img src="../../images/iphone_12.jpg" alt="${item.name}" class="item__img">
        <p class="item__name">${item.name}</p>
        <p class="item__price">Price: $${item.price}</p>
        <div>
            <button class="btn btn--red" type="button" id="decrease" >-</button>
            <span class="item__quantity">${item.amount}</span>
            <button class="btn btn--blue" type="button" id="increase" >+</button>
        </div>
        <button class="btn trash-bin-btn" type="button"><i class="fas fa-trash-alt"></i></button>`;
    console.log(item);
    itemsDOM.appendChild(article);
  });
}

function setHeader(totalItems) {
  if (totalItems <= 1) {
    itemsHeaderDOM.textContent = "Your Cart: " + totalItems + " item";
  }

  itemsHeaderDOM.textContent = "Your Cart: " + totalItems + " items";
}

function setSummary(cart) {
  let totalUnits = 0;
  let totalPrice = 0;
  cart.forEach((item) => {
    totalUnits += item.amount;
    totalPrice += item.amount * item.price;
  });

  if (totalUnits <= 1) {
    subtotalDOM.textContent = totalUnits + " (Unit)";
  }
  subtotalDOM.textContent = totalUnits + " (Units)";

  esttotalDOM.textContent = "$" + totalPrice;
}

class Storage {
  static getCart() {
    return localStorage.getItem("cart")
      ? JSON.parse(localStorage.getItem("cart"))
      : [];
  }
}
