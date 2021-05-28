import { getLocalStorage, setLocalStorage } from './script.js';
import { displayCartIcon } from './products.js';

const currentCartItemsContainer = document.querySelector('.item');
let totalPrice = document.querySelector('.totalPrice');
let currentPrice = [];

function selectElementsForCart(card) {
  const image = card.querySelector('img').src;
  const id = card.id;
  const title = card.querySelector('h3').innerText;

  return [image, id, title];
}

function displayCartItems(currentCart) {
  currentCartItemsContainer.innerHTML = '';

  currentPrice = [];
  currentCart.forEach((item) => {
    const currentQtyPrice = Number(item.price) * item.qty;
    currentPrice.push(currentQtyPrice);

    currentCartItemsContainer.innerHTML += `
    <div class="cartItem" id=${item.id}>
        <div class="cartInfo">
          <h3 class="product__1--title">${item.title}</h3>
          <div class="product__1--image">
            <img
              class="image--1"
              src="${item.image}"
              alt="product 1"
              class="product-image"
            />
        </div>
        <h5 class="product__1--price">${item.price} $</h5>
      </div>
      <div class="buttons-action">
        <form class="form">
          <label for="quantity">Quantity:</label>
          <input
            type="number"
            id="quantity"
            name="quantity"
            class="quantity"
            min="1"
            max="50"
            value="${item.qty}"
            autofocus
          />
        </form>
        <button class="btn add-cart deleteBtn">Delete</button>
      </div>
    </div>
    `;
  });

  totalPrice.innerText = currentPrice
    .reduce((curr, acc) => curr + acc, 0)
    .toFixed(2);

  loadCartListeners();
}

function loadCartListeners() {
  const deleteBtn = document.querySelectorAll('.deleteBtn');
  const qtyInput = document.querySelectorAll('.quantity');
  const form = document.querySelectorAll('.form');

  deleteBtn.forEach((btn) => btn.addEventListener('click', handleDelete));
  form.forEach((el) =>
    el.addEventListener('submit', (e) => e.preventDefault())
  );
  qtyInput.forEach((btn) => btn.addEventListener('change', handleChange));
}

function handleDelete(e) {
  const id = e.target.closest('.cartItem').id;
  const qty = e.target.previousElementSibling.querySelector('.quantity').value;

  const currentCart = getLocalStorage('currentCart');
  const currentQty = getLocalStorage('qtyCart');

  const filteredCart = currentCart.filter((product) => product.id !== id);
  const filteredQty = currentQty - qty;

  setLocalStorage('currentCart', filteredCart);
  setLocalStorage('qtyCart', filteredQty);
}

function handleChange(e) {
  const newQty = e.target.closest('.quantity').value;
  const id = e.target.closest('.cartItem').id;

  const currentCart = getLocalStorage('currentCart');

  const filteredCart = currentCart.map((product) =>
    product.id === id ? { ...product, qty: newQty } : { ...product }
  );

  const filteredQty = filteredCart.reduce(
    (acc, curr) => acc + Number(curr.qty),
    0
  );

  setLocalStorage('currentCart', filteredCart);
  setLocalStorage('qtyCart', filteredQty);
}

export { displayCartItems, selectElementsForCart };
