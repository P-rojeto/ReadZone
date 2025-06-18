const booksGrid = document.getElementById('books-grid');
const priceRange = document.getElementById('price-range');
const priceValue = document.getElementById('price-value');

function renderBooks() {
  booksGrid.innerHTML = '';
  let priceLimit = parseFloat(priceRange.value);

  window.booksData.forEach(book => {
    if (book.price > priceLimit) return;
    const card = document.createElement('div');
    card.className = 'book-card';
    card.innerHTML = `
      <img src="${book.cover}" alt="Capa de ${book.title}" class="book-cover"/>
      <div class="book-title">${book.title}</div>
      <div class="book-author">${book.author}</div>
      <div class="book-price">R$ ${book.price.toFixed(2)}</div>
      <div class="book-stars">${'★'.repeat(book.stars)}${'☆'.repeat(5 - book.stars)}</div>
      <button class="add-cart-btn">Adicionar ao carrinho</button>
    `;
    booksGrid.appendChild(card);
  });
}

priceRange.addEventListener('input', function() {
  priceValue.textContent = priceRange.value;
  renderBooks();
});

window.onload = function() {
  priceValue.textContent = priceRange.value;
  renderBooks();
};