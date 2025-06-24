const booksGrid = document.getElementById('books-grid');
const authorRadios = document.querySelectorAll('.filter-box ul input[type="radio"][name="author"]');
const ratingStars = document.querySelectorAll('.filter-box .rating span');
const navLivros = document.getElementById('nav-livros');
const navInicio = document.getElementById('nav-inicio');
const searchBox = document.getElementById('header-search');
const searchBtn = document.getElementById('search-btn');

let selectedAuthor = null;
let selectedRating = null;
let searchTerm = "";
let showingAllBooks = true; // Para controlar se estamos mostrando todo o catálogo

// Função para renderizar livros com todos filtros aplicados
function renderBooks() {
  booksGrid.innerHTML = '';

  let filteredBooks = window.booksData;

  // Filtro por autor
  if (selectedAuthor) {
    filteredBooks = filteredBooks.filter(book => book.author === selectedAuthor);
  }

  // Filtro por avaliação
  if (selectedRating) {
    filteredBooks = filteredBooks.filter(book => book.stars >= selectedRating);
  }

  // Filtro por termo de pesquisa
  if (searchTerm) {
    const term = searchTerm.trim().toLowerCase();
    filteredBooks = filteredBooks.filter(book =>
      book.title.toLowerCase().includes(term) ||
      book.author.toLowerCase().includes(term) ||
      (book.category && book.category.toLowerCase().includes(term))
    );
  }

  // Exibe todos os livros se na aba livros, senão só os da home (pode customizar se quiser)
  if (!showingAllBooks) {
    filteredBooks = filteredBooks.slice(0, 6); // Mostra só 6 na "Início"
  }

  if (filteredBooks.length === 0) {
    booksGrid.innerHTML = '<div style="grid-column: 1/-1; color: var(--gold); text-align:center; font-size:1.2em; margin-top:30px;">Nenhum livro encontrado.</div>';
    return;
  }

  filteredBooks.forEach(book => {
    const card = document.createElement('div');
    card.className = 'book-card';
    card.innerHTML = `
      <img src="${book.cover}" alt="Capa de ${book.title}" class="book-cover"/>
      <div class="book-title">${book.title}</div>
      <div class="book-author">${book.author}</div>
      <div class="book-stars">${'★'.repeat(book.stars)}${'☆'.repeat(5 - book.stars)}</div>
      <button class="add-cart-btn">Adicionar aos favoritos</button>
    `;
    booksGrid.appendChild(card);
  });
}

// Eventos para autores
authorRadios.forEach(rb => {
  rb.addEventListener('change', () => {
    selectedAuthor = Array.from(authorRadios).find(rb => rb.checked)?.parentElement.textContent.trim() || null;
    renderBooks();
  });
});

// Eventos para avaliação (estrelas)
ratingStars.forEach((star, idx) => {
  star.style.cursor = 'pointer';
  star.addEventListener('click', () => {
    selectedRating = 5 - idx;
    // Feedback visual das estrelas
    ratingStars.forEach((s, i) => {
      s.style.color = i >= 5 - selectedRating ? '#f6b93b' : '#aaa';
    });
    renderBooks();
  });
});

// Reset das estrelas no duplo clique
document.querySelector('.filter-box .rating').addEventListener('dblclick', () => {
  selectedRating = null;
  ratingStars.forEach(s => s.style.color = '#f6b93b');
  renderBooks();
});

// Evento para aba "Livros" mostrar todo catálogo
navLivros.addEventListener('click', (e) => {
  e.preventDefault();
  showingAllBooks = true;
  searchTerm = "";
  searchBox.value = "";
  // Limpa filtros
  selectedAuthor = null;
  authorRadios.forEach(r => r.checked = false);
  selectedRating = null;
  ratingStars.forEach(s => s.style.color = '#f6b93b');
  renderBooks();
  // Destaque na navegação (opcional)
  navLivros.classList.add('active');
  navInicio.classList.remove('active');
});

// Evento para aba "Início" mostrar só alguns livros
navInicio.addEventListener('click', (e) => {
  e.preventDefault();
  showingAllBooks = false;
  searchTerm = "";
  searchBox.value = "";
  // Limpa filtros
  selectedAuthor = null;
  authorRadios.forEach(r => r.checked = false);
  selectedRating = null;
  ratingStars.forEach(s => s.style.color = '#f6b93b');
  renderBooks();
  navInicio.classList.add('active');
  navLivros.classList.remove('active');
});

// Evento de pesquisa: ao digitar ou clicar na lupa
function doSearch() {
  searchTerm = searchBox.value;
  showingAllBooks = true; // Sempre mostra todo o catálogo ao pesquisar
  renderBooks();
  navLivros.classList.add('active');
  navInicio.classList.remove('active');
}
searchBox.addEventListener('input', () => {
  doSearch();
});
searchBtn.addEventListener('click', () => {
  doSearch();
});

window.onload = function() {
  showingAllBooks = false; // Começa mostrando "Início"
  navInicio.classList.add('active');
  navLivros.classList.remove('active');
  renderBooks();
};