// DOM Variables
const navigationDOM = document.querySelector(".navigation");
const productsDOM = document.querySelector(".products");
const priceDOM = document.querySelector("#price");
const outputPriceDom = document.querySelector(".output");
const form = document.querySelector(".form");

let totalProducts;
const productsPerPage = 4;
let totalPages;
let offset = 0;
let productsArray = [];

// Set price
priceDOM.addEventListener("input", (e) => {
  const price = e.target.value;
  outputPriceDom.textContent = "$" + price;
});

window.addEventListener("DOMContentLoaded", () => {
  let queryString = getQueryParams();

  fetch(`http://192.168.1.213:3000/api/v1/products${queryString}`)
    .then((response) => {
      return response.json();
    })
    .then((result) => {
      if (!result.success) throw new Error(result.message);

      productsArray = result.products;
      totalProducts = result.totalProducts;
      setTotalPages();
      displayProducts();
      displayPages(getPageId());
      // setupBtns();
    })
    .catch((error) => {
      console.error(error);
    });
});

function setTotalPages() {
  let pages = Math.floor(totalProducts / productsPerPage);
  const productsLeft = totalProducts % productsPerPage;

  if (productsLeft) {
    pages += 1;
  }

  totalPages = pages;
}

// Show Products
// displayProducts(1);

function displayProducts() {
  let products = "";

  for (let i = 0; i < productsArray.length; i++) {
    products += ` <div class="product">
      <a href="http://192.168.1.213:5500/frontendVJ/pages/product/product.html?pid=${productsArray[i].id}">
        <img class="product-image" src="./images/iphone_12.jpg" alt="iphone 12">
      </a>
      <p class="product-name" >${productsArray[i].name}</p>
      <p class="product-price">$${productsArray[i].price}</p>
  </div>`;
  }
  productsDOM.innerHTML = products;
}

// // Show Pages.
// displayPages(1);

function displayPages(startPage) {
  while (navigationDOM.firstChild) {
    navigationDOM.removeChild(navigationDOM.firstChild);
  }

  if (startPage - 2 === 1) {
    // Set page 1
    navigationDOM.appendChild(createAnchor(1));
    // Set page 1
    navigationDOM.appendChild(createAnchor(2));
  } else if (startPage - 1 === 1) {
    // Set page 1
    navigationDOM.appendChild(createAnchor(1));
  } else if (startPage - 2 > 1) {
    // Set page 1
    navigationDOM.appendChild(createAnchor(1));
    // Set ... page
    navigationDOM.appendChild(createAnchor("..."));
    // Set previous page
    navigationDOM.appendChild(createAnchor(startPage - 1));
  }

  // Set current page
  navigationDOM.appendChild(createAnchor(startPage, true));

  // Set url

  if (startPage + 2 < totalPages) {
    //   Set next page
    navigationDOM.appendChild(createAnchor(startPage + 1));
    // Set ... page
    navigationDOM.appendChild(createAnchor("..."));
    // Set page total pages
    navigationDOM.appendChild(createAnchor(totalPages));
  } else if (startPage + 2 === totalPages) {
    //   Set next page
    navigationDOM.appendChild(createAnchor(startPage + 1));
    //   Set next next page
    navigationDOM.appendChild(createAnchor(startPage + 2));
  } else if (startPage + 1 === totalPages) {
    //   Set next page
    navigationDOM.appendChild(createAnchor(startPage + 1));
  }
}

// // Setup pages buttons
// setupBtns();

// function setupBtns() {
//   const btns = document.querySelectorAll(".page");
//   btns.forEach((btn) => {
//     btn.addEventListener("click", (event) => {
//       let pageId = Number(event.target.dataset.pageid);

//       if (!pageId) {
//         return (btn.disabled = true);
//       }

//       if (getPageId === pageId) {
//         event.preventDefault();
//         return;
//       }

//       btns.forEach((btn) => {
//         btn.classList.remove("active");
//       });

//       event.target.classList.add("active");
//     });
//   });
// }

// Create span
function createAnchor(pageId, currentPage = false) {
  let anchor = document.createElement("a");

  if (pageId === "...") {
    anchor.setAttribute("class", "page");
    anchor.textContent = pageId;
  } else {
    let url = getUrl(pageId);
    if (currentPage) {
      anchor.setAttribute("class", "page active");
    } else {
      anchor.setAttribute("class", "page");
      anchor.setAttribute("href", url);
    }

    anchor.setAttribute("data-pageId", pageId);
    anchor.textContent = pageId;
  }

  return anchor;
}

// Get query params
function getQueryParams() {
  let queryString = window.location.search;
  return queryString;
}

function getUrl(pageId) {
  let queryString = window.location.search;
  if (queryString !== "") {
    let query = queryString.substring(1);
    let vars = query.split("&");
    string = vars.filter((variable) => {
      let pairs = variable.split("=");
      if (pairs[0] !== "page") return variable;
    });

    vars = "?" + string.join("&");

    queryString = vars;

    return queryString + "&page=" + pageId;
  }
  return queryString + "?page=" + pageId;
}

function getPageId() {
  let queryString = window.location.search;
  let query = queryString.substring(1);
  let vars = query.split("&");

  string = vars.filter((variable) => {
    let pairs = variable.split("=");
    if (pairs[0] === "page") return true;
  });

  if (string.length === 0) return 1;

  return parseInt(string[0].split("=")[1]);
}
