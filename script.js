const booksGrid = document.getElementById('books-grid');
const priceRange = document.getElementById('price-range');
const priceValue = document.getElementById('price-value');
const cartCountSpan = document.getElementById('cart-count');
const cartSidebar = document.getElementById('cart-sidebar');
const cartItemsDiv = document.getElementById('cart-items');
const cartOverlay = document.getElementById('cart-overlay');
const closeCartBtn = document.getElementById('close-cart');
const cartIcon = document.querySelector('.cart-icon');

let cart = [];

function renderBooks() {
  booksGrid.innerHTML = '';
  let priceLimit = parseFloat(priceRange.value);

  window.booksData.forEach(book => {
    if (book.price > priceLimit) return;

    const card = document.createElement('div');
    card.className = 'book-card';
    card.innerHTML = `
      <img src="${book.cover}" alt="Capa de ${book.title}" class="book-cover" />
      <div class="book-title">${book.title}</div>
      <div class="book-author">${book.author}</div>
      <div class="book-price">R$ ${book.price.toFixed(2)}</div>
      <div class="book-stars">${'★'.repeat(book.stars)}${'☆'.repeat(5 - book.stars)}</div>
      <button class="add-cart-btn">Adicionar ao carrinho</button>
    `;

    const addButton = card.querySelector('.add-cart-btn');
    addButton.addEventListener('click', () => {
      addToCart(book);
    });

    booksGrid.appendChild(card);
  });
}

function addToCart(book) {
  cart.push(book);
  cartCountSpan.textContent = cart.length;
  renderCart();
  openCart();
}

function renderCart() {
  cartItemsDiv.innerHTML = '';

  if (cart.length === 0) {
    cartItemsDiv.innerHTML = '<p class="empty-cart">Seu carrinho está vazio.</p>';
    return;
  }

  cart.forEach((item, index) => {
    const div = document.createElement('div');
    div.className = 'cart-item';
    div.innerHTML = `
      <img src="${item.cover}" alt="Capa ${item.title}">
      <div class="cart-item-info">
        <strong>${item.title}</strong>
        <small>R$ ${item.price.toFixed(2)}</small>
        <button data-index="${index}" class="remove-btn">Remover</button>
      </div>
    `;
    cartItemsDiv.appendChild(div);
  });

  // Botões de remover
  document.querySelectorAll('.remove-btn').forEach(btn => {
    btn.addEventListener('click', function () {
      const index = parseInt(this.getAttribute('data-index'));
      cart.splice(index, 1);
      cartCountSpan.textContent = cart.length;
      renderCart();
    });
  });
}

function openCart() {
  cartSidebar.classList.add('open');
  cartOverlay.classList.add('active');
}

function closeCart() {
  cartSidebar.classList.remove('open');
  cartOverlay.classList.remove('active');
}

// Eventos para abrir e fechar o carrinho
cartIcon.addEventListener('click', openCart);
closeCartBtn.addEventListener('click', closeCart);
cartOverlay.addEventListener('click', closeCart);

// Atualiza o filtro de preço
priceRange.addEventListener('input', function () {
  priceValue.textContent = priceRange.value;
  renderBooks();
});

// Inicialização
window.onload = function () {
  priceValue.textContent = priceRange.value;
  renderBooks();
};
