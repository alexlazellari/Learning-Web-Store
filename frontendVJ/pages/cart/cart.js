// Variables
const itemsDOM = document.querySelector(".items");
const subtotalDOM = document.querySelector(".subtotal__units");
const esttotalDOM = document.querySelector(".est-total__price");

window.addEventListener("DOMContentLoaded", () => {
  setupCartPage();
});

function setupCartPage() {
  let cart = Storage.getCart();
  console.log(cart);
  // Display Header,Items and summary
  displayItems(cart);
  displayHeader(cart.length);
  displaySummary(cart);
  // Set Buttons logic
  setButtons(cart);
}

function displayHeader(totalItems) {
  const itemsHeaderDOM = document.querySelector(".items__header");
  if (totalItems <= 1) {
    itemsHeaderDOM.textContent = "Your Cart: " + totalItems + " item";
  }
  itemsHeaderDOM.textContent = "Your Cart: " + totalItems + " items";
}

function displayItems(cart) {
  itemsDOM.innerHTML = ` <h1 class="items__header" >Your Cart: <span class="total-items">0 items</span></h1>`;

  cart.forEach((item) => {
    const article = document.createElement("article");
    article.setAttribute("class", "item");
    article.innerHTML = `<img src="../../images/iphone_12.jpg" alt="${item.name}" class="item__img">
        <p class="item__name">${item.name}</p>
        <p class="item__price">Price: $${item.price}</p>
        <div>
            <button class="btn btn--red decrease" type="button" data-id=${item.id} >-</button>
            <span class="item__quantity">${item.amount}</span>
            <button class="btn btn--blue increase" type="button" data-id=${item.id}>+</button>
        </div>
        <button class="btn remove" type="button" data-id=${item.id} ><i class="fas fa-trash-alt" ></i></button>`;
    itemsDOM.appendChild(article);
  });
}

function displaySummary(cart) {
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
  esttotalDOM.textContent = "$" + totalPrice.toFixed(2);
}

class Storage {
  static getCart() {
    return localStorage.getItem("cart")
      ? JSON.parse(localStorage.getItem("cart"))
      : [];
  }
}

// Set logic of buttons
function setButtons(cart) {
  const btns = document.querySelectorAll(".btn");

  btns.forEach((btn) => {
    if (btn.classList.contains("remove")) {
      btn.addEventListener("click", (e) => {
        let id = -1;

        if (e.target.classList.contains("fas")) {
          id = e.target.parentElement.dataset.id;
        } else {
          id = e.target.dataset.id;
        }

        console.log(id);

        cart = cart.filter((item) => !(item.id === Number(id)));

        localStorage.setItem("cart", JSON.stringify(cart));

        itemsDOM.removeChild(e.target.parentElement.parentElement);
        displayHeader(cart.length);
        displaySummary(cart);
        setButtons(cart);
      });
    }

    if (btn.classList.contains("increase")) {
      btn.addEventListener("click", (e) => {
        let item = cart.find((item) => item.id === Number(e.target.dataset.id));
        item.amount += 1;

        localStorage.setItem("cart", JSON.stringify(cart));

        const amount = e.target.previousElementSibling;

        amount.textContent = item.amount;

        displaySummary(cart);
      });
    }

    if (btn.classList.contains("decrease")) {
      btn.addEventListener("click", (e) => {
        let item = cart.find((item) => item.id === Number(e.target.dataset.id));
        item.amount -= 1;

        localStorage.setItem("cart", JSON.stringify(cart));

        const amount = e.target.nextElementSibling;

        console.log(item.amount <= 0);

        if (item.amount <= 0) {
          let id = item.id;
          cart = cart.filter((item) => !(item.id === Number(id)));

          localStorage.setItem("cart", JSON.stringify(cart));

          itemsDOM.removeChild(e.target.parentElement.parentElement);
          displayHeader(cart.length);
          displaySummary(cart);

          return;
        }

        amount.textContent = item.amount;
        displaySummary(cart);
      });
    }
  });
}
