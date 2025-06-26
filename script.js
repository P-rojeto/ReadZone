const BOOKS_PER_PAGE = 12;

const booksGrid = document.getElementById('books-grid');
const navLivros = document.getElementById('nav-livros');
const navInicio = document.getElementById('nav-inicio');
const navAutores = document.getElementById('nav-autores');
const searchBox = document.getElementById('header-search');
const searchBtn = document.getElementById('search-btn');
const favBtn = document.getElementById('fav-btn');
const favCount = document.getElementById('fav-count');
const sortSelect = document.getElementById('sort-select');
const authorSlideout = document.getElementById('authors-slideout');
const authorListWrap = document.getElementById('author-list');
const closeAuthorsSlideout = document.getElementById('close-authors-slideout');
const categoryList = document.getElementById('category-list');
const ratingStars = document.querySelectorAll('#rating-filter span');
const clearRating = document.getElementById('clear-rating');
const pagination = document.getElementById('pagination');
const favModal = document.getElementById('fav-modal');
const favBooksList = document.getElementById('fav-books-list');
const closeFavModal = document.getElementById('close-fav-modal');
const sectionTitle = document.getElementById('section-title');

let selectedAuthor = null;
let selectedCategory = null;
let selectedRating = null;
let searchTerm = "";
let showingAllBooks = true;
let currentPage = 1;

// --- Favoritos ---
function getFavs() {
  try {
    return JSON.parse(localStorage.getItem('readzone_favs') || '[]');
  } catch { return []; }
}
function setFavs(favs) {
  localStorage.setItem('readzone_favs', JSON.stringify(favs));
}
function isFav(bookId) {
  return getFavs().includes(bookId);
}
function updateFavCount() {
  const favs = getFavs();
  favCount.innerHTML = `❤️${favs.length > 0 ? `<span style="font-size:0.63em;">${favs.length}</span>` : ''}`;
  favCount.classList.toggle('has-favs', favs.length > 0);
}

// --- Autores (Slideout) ---
function renderAuthorsSlideout() {
  const authors = Array.from(new Set(window.booksData.map(b => b.author))).sort();
  let ul = document.createElement('ul');
  authors.forEach(author => {
    let li = document.createElement('li');
    li.innerHTML = `<label class="${selectedAuthor === author ? "selected-author" : ""}">
      <input type="radio" name="author" value="${author}" ${selectedAuthor === author ? "checked" : ""}>${author}
    </label>`;
    ul.appendChild(li);
  });
  authorListWrap.innerHTML = '';
  authorListWrap.appendChild(ul);
  authorListWrap.querySelectorAll('input[type="radio"]').forEach(rb => {
    rb.addEventListener('change', () => {
      selectedAuthor = rb.checked ? rb.value : null;
      currentPage = 1;
      renderAuthorsSlideout();
      renderBooks();
      closeAuthorsSlideout.click();
    });
  });
}

// --- Categorias (Sidebar) ---
function renderCategoryList() {
  const cats = Array.from(new Set(window.booksData.map(b => b.category))).sort();
  categoryList.innerHTML = `<li><label class="${selectedCategory === null?'selected-category':''}"><input type="radio" name="category" value="" ${selectedCategory===null?'checked':''}>Todas</label></li>`;
  cats.forEach(cat => {
    const li = document.createElement("li");
    li.innerHTML = `<label class="${selectedCategory === cat ? "selected-category" : ""}">
      <input type="radio" name="category" value="${cat}" ${selectedCategory === cat ? "checked" : ""}>${cat}
    </label>`;
    categoryList.appendChild(li);
  });
  categoryList.querySelectorAll('input[type="radio"]').forEach(rb => {
    rb.addEventListener('change', () => {
      selectedCategory = rb.value || null;
      currentPage = 1;
      renderCategoryList();
      renderBooks();
    });
  });
}

// --- Filtros e render da grid ---
function getFilteredBooks() {
  let filteredBooks = window.booksData;

  if (selectedAuthor) {
    filteredBooks = filteredBooks.filter(book => book.author === selectedAuthor);
  }
  if (selectedCategory) {
    filteredBooks = filteredBooks.filter(book => book.category === selectedCategory);
  }
  if (selectedRating) {
    filteredBooks = filteredBooks.filter(book => book.stars >= selectedRating);
  }
  if (searchTerm) {
    const term = searchTerm.trim().toLowerCase();
    filteredBooks = filteredBooks.filter(book =>
      book.title.toLowerCase().includes(term) ||
      book.author.toLowerCase().includes(term) ||
      (book.category && book.category.toLowerCase().includes(term))
    );
  }
  switch (sortSelect.value) {
    case "title-asc":
      filteredBooks = filteredBooks.sort((a, b) => a.title.localeCompare(b.title));
      break;
    case "title-desc":
      filteredBooks = filteredBooks.sort((a, b) => b.title.localeCompare(a.title));
      break;
    case "author-asc":
      filteredBooks = filteredBooks.sort((a, b) => a.author.localeCompare(b.author));
      break;
    case "author-desc":
      filteredBooks = filteredBooks.sort((a, b) => b.author.localeCompare(a.author));
      break;
    case "stars-desc":
      filteredBooks = filteredBooks.sort((a, b) => b.stars - a.stars);
      break;
    case "stars-asc":
      filteredBooks = filteredBooks.sort((a, b) => a.stars - b.stars);
      break;
    default:
      filteredBooks = filteredBooks.sort((a, b) => a.id - b.id);
  }
  return filteredBooks;
}
function renderBooks() {
  booksGrid.innerHTML = '';
  let filteredBooks = getFilteredBooks();
  let totalBooks = filteredBooks.length;
  let totalPages = Math.max(1, Math.ceil(totalBooks / BOOKS_PER_PAGE));

  // Paginação
  let pageBooks = filteredBooks;
  if (showingAllBooks) {
    const start = (currentPage - 1) * BOOKS_PER_PAGE;
    const end = start + BOOKS_PER_PAGE;
    pageBooks = filteredBooks.slice(start, end);
  }
  sectionTitle.textContent = selectedAuthor
    ? `Livros de ${selectedAuthor}`
    : (selectedCategory ? `Livros de ${selectedCategory}` : (searchTerm ? `Resultado da busca` : `Livros em Destaque`));

  if (pageBooks.length === 0) {
    booksGrid.innerHTML = '<div style="grid-column: 1/-1; color: var(--orange); text-align:center; font-size:1.15em; margin-top:30px;">Nenhum livro encontrado.</div>';
    pagination.innerHTML = "";
    return;
  }

  pageBooks.forEach((book) => {
    const card = document.createElement('div');
    card.className = 'book-card';
    card.innerHTML = `
      <img src="${book.cover}" alt="Capa de ${book.title}" class="book-cover"/>
      <div class="book-title">${book.title}</div>
      <div class="book-author">${book.author}</div>
      <div class="book-category">${book.category}</div>
      <div class="book-stars">${'★'.repeat(book.stars)}${'☆'.repeat(5 - book.stars)}</div>
      <button class="add-cart-btn${isFav(book.id)?' favorited':''}" tabindex="0" data-book-id="${book.id}">
        ${isFav(book.id)?'Favoritado':'Adicionar aos favoritos'}
      </button>
    `;
    booksGrid.appendChild(card);
  });

  booksGrid.querySelectorAll('.add-cart-btn').forEach(btn => {
    btn.addEventListener('click', function() {
      const id = Number(this.getAttribute('data-book-id'));
      if (!isFav(id)) {
        setFavs([...getFavs(), id]);
        updateFavCount();
        this.textContent = 'Favoritado';
        this.classList.add('favorited');
        this.blur();
      }
    });
  });

  renderPagination(totalPages);

  if (window.ScrollReveal) {
    ScrollReveal().reveal('.book-card', {
      duration: 500,
      distance: '24px',
      easing: 'cubic-bezier(.5,0,0,1)',
      interval: 55,
      origin: 'bottom',
      reset: false
    });
  }
}
function renderPagination(totalPages) {
  pagination.innerHTML = "";
  if (totalPages <= 1) return;
  let prevBtn = document.createElement("button");
  prevBtn.innerHTML = "&#8592;";
  prevBtn.disabled = currentPage === 1;
  prevBtn.onclick = () => { currentPage--; renderBooks(); };
  pagination.appendChild(prevBtn);

  let start = Math.max(1, currentPage - 2);
  let end = Math.min(totalPages, currentPage + 2);
  if (currentPage <= 3) end = Math.min(totalPages, 5);
  if (currentPage >= totalPages - 2) start = Math.max(1, totalPages - 4);

  for (let i = start; i <= end; i++) {
    let btn = document.createElement("button");
    btn.textContent = i;
    if (i === currentPage) btn.classList.add("active");
    btn.onclick = () => { currentPage = i; renderBooks(); };
    pagination.appendChild(btn);
  }

  let nextBtn = document.createElement("button");
  nextBtn.innerHTML = "&#8594;";
  nextBtn.disabled = currentPage === totalPages;
  nextBtn.onclick = () => { currentPage++; renderBooks(); };
  pagination.appendChild(nextBtn);
}

// --- Avaliação (estrelas) ---
ratingStars.forEach((star, idx) => {
  star.addEventListener('click', () => {
    selectedRating = 5 - idx;
    currentPage = 1;
    ratingStars.forEach((s, i) => {
      s.classList.toggle("selected-star", i >= 5 - selectedRating);
    });
    renderBooks();
  });
});
clearRating.addEventListener('click', () => {
  selectedRating = null;
  currentPage = 1;
  ratingStars.forEach(s => s.classList.remove("selected-star"));
  renderBooks();
});

// --- Navegação e eventos globais ---
navLivros.addEventListener('click', (e) => {
  e.preventDefault();
  showingAllBooks = true;
  searchTerm = "";
  searchBox.value = "";
  selectedAuthor = null;
  selectedCategory = null;
  selectedRating = null;
  currentPage = 1;
  renderCategoryList();
  renderBooks();
  navLivros.classList.add('active');
  navInicio.classList.remove('active');
});
navInicio.addEventListener('click', (e) => {
  e.preventDefault();
  showingAllBooks = true;
  searchTerm = "";
  searchBox.value = "";
  selectedAuthor = null;
  selectedCategory = null;
  selectedRating = null;
  currentPage = 1;
  renderCategoryList();
  renderBooks();
  navInicio.classList.add('active');
  navLivros.classList.remove('active');
});
navAutores.addEventListener('click', (e) => {
  e.preventDefault();
  authorSlideout.classList.add('open');
  renderAuthorsSlideout();
});
closeAuthorsSlideout.addEventListener('click', () => {
  authorSlideout.classList.remove('open');
});
authorSlideout.addEventListener('click', (e) => {
  if (e.target === authorSlideout) authorSlideout.classList.remove('open');
});

// Busca instantânea
function doSearch() {
  searchTerm = searchBox.value;
  selectedAuthor = null;
  selectedCategory = null;
  selectedRating = null;
  currentPage = 1;
  renderCategoryList();
  renderBooks();
  navLivros.classList.add('active');
  navInicio.classList.remove('active');
}
searchBox.addEventListener('keyup', function(e) {
  if (e.key === "Enter") doSearch();
});
searchBox.addEventListener('input', doSearch);
searchBtn.addEventListener('click', doSearch);

// Ordenação
sortSelect.addEventListener('change', () => { currentPage = 1; renderBooks(); });

// Modal de favoritos
function renderFavModal() {
  favBooksList.innerHTML = "";
  const favs = getFavs();
  if (favs.length === 0) {
    favBooksList.innerHTML = '<div class="empty-msg">Nenhum favorito ainda.</div>';
    return;
  }
  favs.forEach(id => {
    const book = window.booksData.find(b => b.id === id);
    if (!book) return;
    const div = document.createElement('div');
    div.className = 'fav-book-card';
    div.innerHTML = `
      <img src="${book.cover}" class="fav-book-cover" alt="Capa de ${book.title}">
      <span class="fav-book-title">${book.title}</span>
      <span class="fav-book-author">${book.author}</span>
      <button class="fav-remove-btn" data-book-id="${book.id}">Remover</button>
    `;
    favBooksList.appendChild(div);
  });
  favBooksList.querySelectorAll('.fav-remove-btn').forEach(btn => {
    btn.addEventListener('click', function() {
      const id = Number(this.getAttribute('data-book-id'));
      setFavs(getFavs().filter(fid => fid !== id));
      updateFavCount();
      renderFavModal();
      renderBooks();
    });
  });
}
favBtn.addEventListener('click', () => {
  renderFavModal();
  favModal.classList.add('open');
  document.body.style.overflow = 'hidden';
});
closeFavModal.addEventListener('click', () => {
  favModal.classList.remove('open');
  document.body.style.overflow = '';
});
favModal.addEventListener('click', (e) => {
  if (e.target === favModal) {
    favModal.classList.remove('open');
    document.body.style.overflow = '';
  }
});

// Inicialização
window.onload = function() {
  showingAllBooks = true;
  currentPage = 1;
  navInicio.classList.add('active');
  navLivros.classList.remove('active');
  renderCategoryList();
  renderAuthorsSlideout();
  renderBooks();
  updateFavCount();
};