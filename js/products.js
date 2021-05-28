import { displayCartItems, selectElementsForCart } from './cart.js';
import { getLocalStorage, setLocalStorage } from './script.js';

const iconQty = document.querySelector('.header__icon--total');
const productContainer = document.querySelector('.products');
let currentCart;

// loop thorough data and display each field
function displayData(data) {
  data.items.forEach((item, index) => {
    const div = document.createElement('div');
    div.classList.add('product-item');
    div.id = item.sys.id;

    div.innerHTML = `
          <div class="product__${index + 1}">
          <h3 class="product__${index + 1}--title">${item.fields.title}</h3>
          <div class="product__${index + 1}--image">
          <img
              class="image--${index + 1}"
              src="${item.fields.image.fields.file.url}"
              alt="product ${index + 1}"
              class="product-image"
          />
          </div>
          <h5 class="product__1--price">${item.fields.price} $</h5>
          <button class="btn add-cart">Add product</button>
          </div>
      `;

    productContainer.append(div);
  });

  loadListeners();
  loadPreviousCart();
  loadPreviousQtyCart();
}

function loadListeners() {
  const addCartBtn = document.querySelectorAll('.add-cart');

  addCartBtn.forEach((btn) => btn.addEventListener('click', handleAddProduct));
}

function loadPreviousCart() {
  const prevCart = getLocalStorage('currentCart');
  currentCart = prevCart ? prevCart : [];
  prevCart && displayCartItems(currentCart);
}

function loadPreviousQtyCart() {
  displayCartIcon('initialState');
}

function handleAddProduct(e) {
  const price = e.target.previousElementSibling.innerText.split(' ')[0];

  displayCartIcon();
  console.log(currentCart);
  addToCart(e, price);
}

function addToCart(e, price) {
  const productCard = e.target.closest('.product-item');
  const [image, id, title] = selectElementsForCart(productCard);
  let existingItem = false;
  if (currentCart.length !== 0) {
    currentCart = currentCart.map((el) => {
      if (el.id === id) {
        existingItem = true;
        return { ...el, qty: el.qty + 1 };
      }
      return { ...el };
    });
  }
  if (!existingItem) {
    const newArticle = {
      id,
      image,
      price,
      qty: 1,
      title,
    };
    currentCart.push(newArticle);
  }
  setLocalStorage('currentCart', currentCart);
}

function displayCartIcon(type) {
  if (type !== 'initialState') {
    const currentQty = Number(iconQty.innerText) + 1;
    iconQty.innerText = currentQty;
    setLocalStorage('qtyCart', currentQty);
  } else {
    iconQty.innerText = getLocalStorage('qtyCart') || 0;
  }
}

export { displayData, displayCartIcon };
