// Variables
const mainDOM = document.querySelector(".main");
const totalCart = document.querySelector(".cart-total");

//State
let cart = [];
let product;

window.addEventListener("DOMContentLoaded", () => {
  setupProductPage();
  let productId = getProductId();
  fetch("http://192.168.1.213:3000/api/v1/product/" + productId)
    .then((response) => {
      if (!response.ok) throw new Error(response.message);
      return response.json();
    })
    .then((result) => {
      product = result.product;
      displayProduct(product);
    })
    .then(() => {
      const increaseDOM = document.querySelector("#increase");
      const descreaseDOM = document.querySelector("#decrease");
      const productAmount = document.querySelector(".product__quantity");
      const addProduct = document.querySelector(".add-btn");

      increaseDOM.addEventListener("click", (e) => {
        let amount = parseInt(productAmount.textContent);
        if (amount === 50) return;
        productAmount.textContent = amount + 1;
      });

      descreaseDOM.addEventListener("click", (e) => {
        let amount = parseInt(productAmount.textContent);
        if (amount === 1) return;
        productAmount.textContent = amount - 1;
      });

      addProduct.addEventListener("click", (e) => {
        const item = {
          id: product.id,
          name: product.name,
          price: product.price,
          amount: parseInt(productAmount.textContent),
        };

        setItemLocally(item);
        updateTotalValue();
      });
    })

    .catch((error) => {
      console.error(error);
    });
});

function getProductId() {
  let queryParams = window.location.search;
  let query = queryParams.substring(1).split("&");

  let vars = [];
  vars = query.filter((variable) => {
    let pairs = variable.split("=");
    if (pairs[0] === "pid") return true;
  });

  return vars.length !== 0 ? vars[0].split("=")[1] : "";
}

function setItemLocally(item) {
  for (let i = 0; i < cart.length; i++) {
    if (item.id === cart[i].id) {
      cart[i].amount = item.amount;
      return localStorage.setItem("cart", JSON.stringify(cart));
    }
  }
  cart.push(item);
  Storage.saveCart(cart);
}

// Handle properly local storage for un-signed users
class Storage {
  static getCart() {
    return localStorage.getItem("cart")
      ? JSON.parse(localStorage.getItem("cart"))
      : [];
  }

  static saveCart(cart) {
    localStorage.setItem("cart", JSON.stringify(cart));
  }
}

function setupProductPage() {
  cart = Storage.getCart();
  updateTotalValue();
}

function displayProduct(product) {
  const article = document.createElement("article");
  article.setAttribute("class", "product");
  article.innerHTML = `  
      <img src="../../images/iphone_12.jpg" alt="${product.name}" class="product__img">
      <div class="product__details">
          <h1 class="product__name">${product.name}</h1>
          <p class="product__manufacturer">Manufacturer: ${product.manufacturer}</p>
          <p class="product__id">Product ID: ${product.id}</p>
          <div class="product__logic">
              <p class="product__price">$${product.price}</p>
              <div>
                  <button class="btn btn--red" type="button" id="decrease" >-</button>
                  <span class="product__quantity">1</span>
                  <button class="btn btn--blue" type="button" id="increase" >+</button>
                  <button class="add-btn" type="button" data-id="${product.id}">Add to Cart</button>
              </div>
          </div>
          <div class="product__description">
              <h1 class="product__description__header">Description:</h1>
              <p class="product__description__content">Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged.</p>
          </div>
      </div>`;

  mainDOM.appendChild(article);
}

function updateTotalValue() {
  totalCart.textContent = cart.length;
}
