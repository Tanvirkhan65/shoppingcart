let productInCart = JSON.parse(localStorage.getItem("shoppingCart"));
if (!productInCart) {
  productInCart = [];
}
let cartItems = document.querySelector(".cartItems");
let totalPrice = document.querySelector(".totalPrice");
let searchBar = document.querySelector("#searchBar");

const button = document.querySelectorAll(".button");
button.forEach((element) => {
  element.addEventListener("click", (event) => {
    event.preventDefault();
    let image =
      event.target.previousElementSibling.previousElementSibling
        .previousElementSibling.children[0].src;
    let price =
      event.target.previousElementSibling.children[0].textContent.trim();
    let title =
      event.target.previousElementSibling.previousElementSibling.textContent;
    let productId = event.target.dataset.productId;
    let productItems = {
      image: image,
      price: +price,
      basePrice: +price,
      productId: productId,
      title: title,
      count: 1,
    };
    updateCart(productItems);
    updateByHtml();
  });
});

function updateCart(productItems) {
  for (let i = 0; i < productInCart.length; i++) {
    if (productInCart[i].productId === productItems.productId) {
      productInCart[i].count += 1;
      productInCart[i].price =
        productInCart[i].basePrice * productInCart[i].count;
      return;
    }
  }
  productInCart.push(productItems);
}
let updateByHtml = function () {
  localStorage.setItem("shoppingCart", JSON.stringify(productInCart));
  if (productInCart.length > 0) {
    let result = productInCart.map((product) => {
      return `<li><a href="#"><img src="${product.image}" alt="Loading" /></a></li>
        <li>${product.title}</li>
        <li>${product.price}</li>
       <span><button type="button" data-btn-Id="${product.productId}" class="increment">+</button>
       <button type="button" class="count">${product.count}</button>
       <button type="button" data-btn-Id="${product.productId}" class="decrement"> -</button>
       <button type="button" data-btn-Id="${product.productId}" class="delete">x</button></span>    
       `;
    });
    cartItems.innerHTML = result.join("");
    totalPrice.innerHTML = totalPriceFun();
  } else {
    cartItems.innerHTML = "";
    totalPrice.innerHTML = "";
  }
};
cartItems.addEventListener("click", (e) => {
  e.preventDefault();
  let isPlusButton = e.target.classList.contains("increment");
  let isMinusButton = e.target.classList.contains("decrement");
  let isDelete = e.target.classList.contains("delete");
  if (isPlusButton || isMinusButton || isDelete) {
    for (let i = 0; i < productInCart.length; i++) {
      if (productInCart[i].productId === e.target.dataset.btnId) {
        if (isPlusButton) {
          productInCart[i].count += 1;
        } else if (isMinusButton) {
          productInCart[i].count -= 1;
        }
        productInCart[i].price =
          productInCart[i].basePrice * productInCart[i].count;
      }
      if (productInCart[i].count <= 0) {
        productInCart.splice(i, 1);
      }
      if (productInCart[i].productId === e.target.dataset.btnId) {
        if (isDelete) {
          productInCart.splice(i, 1);
        }
      }
    }
    updateByHtml();
  }
});

function totalPriceFun() {
  let sumPrice = 0;
  productInCart.forEach((product) => {
    sumPrice = sumPrice + product.price;
  });
  return sumPrice;
}

searchBar.addEventListener("keyup", (ele) => {
  ele.preventDefault();
  let value = ele.target.value.toLowerCase();
  button.forEach((element) => {
    let title =
      element.previousElementSibling.previousElementSibling.textContent;
    if (title.toLowerCase().indexOf(value) == -1) {
      element.parentElement.style.display = "none";
    } else {
      element.parentElement.style.display = "block";
    }
  });
});
updateByHtml();
