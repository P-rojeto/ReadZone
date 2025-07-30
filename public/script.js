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
const profileBtn = document.getElementById('profile-btn');
const profileDropdown = document.getElementById('profile-dropdown');
const logoutBtn = document.getElementById('logout-btn');

let booksData = [];
let selectedAuthor = null;
let selectedCategory = null;
let selectedRating = null;
let searchTerm = "";
let currentPage = 1;

// Autenticação e menu do perfil
profileBtn?.addEventListener('click', (e) => {
  e.stopPropagation();
  const isVisible = profileDropdown.style.display === 'block';
  profileDropdown.style.display = isVisible ? 'none' : 'block';
});
document.addEventListener('click', () => {
  profileDropdown.style.display = 'none';
});
logoutBtn?.addEventListener('click', () => {
  localStorage.removeItem('readzone_logged');
  localStorage.removeItem('readzone_logged_user');
  window.location.href = '/registroelogin/login.html';
});

// Favoritos
function getFavs() {
  try {
    return JSON.parse(localStorage.getItem('readzone_favs') || '[]');
  } catch {
    return [];
  }
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

// Carregar livros do backend
async function carregarLivrosDoBackend() {
  try {
    const response = await fetch('http://localhost:3000/livros');
    if (!response.ok) throw new Error('Erro ao buscar');
    const livros = await response.json();
    booksData = livros.map((livro, index) => ({
      id: index + 1,
      title: livro.titulo,
      author: livro.autor,
      cover: livro.imagem,
      category: livro.categoria,
      stars: Math.floor(Math.random() * 3) + 3
    }));
    renderCategoryList();
    renderAuthorsSlideout();
    renderBooks();
    updateFavCount();
  } catch (error) {
    console.error('Erro ao carregar livros do backend:', error);
    booksGrid.innerHTML = '<p style="color:red;">Erro ao carregar livros.</p>';
  }
}

// Filtros e renderização
function renderCategoryList() {
  const categorias = [...new Set(booksData.map(b => b.category))].sort();
  categoryList.innerHTML = `<li><label class="${!selectedCategory ? 'selected-category' : ''}">
    <input type="radio" name="category" value="" ${!selectedCategory ? 'checked' : ''}>Todas</label></li>`;
  categorias.forEach(cat => {
    const li = document.createElement("li");
    li.innerHTML = `<label class="${selectedCategory === cat ? 'selected-category' : ''}">
      <input type="radio" name="category" value="${cat}" ${selectedCategory === cat ? 'checked' : ''}>${cat}</label>`;
    categoryList.appendChild(li);
  });
  categoryList.querySelectorAll('input[name="category"]').forEach(rb => {
    rb.addEventListener('change', () => {
      selectedCategory = rb.value || null;
      currentPage = 1;
      renderCategoryList();
      renderBooks();
    });
  });
}

function renderAuthorsSlideout() {
  const authors = [...new Set(booksData.map(b => b.author))].sort();
  const ul = document.createElement("ul");
  authors.forEach(author => {
    const li = document.createElement("li");
    li.innerHTML = `<label class="${selectedAuthor === author ? 'selected-author' : ''}">
      <input type="radio" name="author" value="${author}" ${selectedAuthor === author ? 'checked' : ''}>${author}</label>`;
    ul.appendChild(li);
  });
  authorListWrap.innerHTML = "";
  authorListWrap.appendChild(ul);
  authorListWrap.querySelectorAll('input[name="author"]').forEach(rb => {
    rb.addEventListener('change', () => {
      selectedAuthor = rb.checked ? rb.value : null;
      currentPage = 1;
      renderAuthorsSlideout();
      renderBooks();
      closeAuthorsSlideout.click();
    });
  });
}

function getFilteredBooks() {
  let filtered = [...booksData];
  if (selectedAuthor) filtered = filtered.filter(b => b.author === selectedAuthor);
  if (selectedCategory) filtered = filtered.filter(b => b.category === selectedCategory);
  if (selectedRating) filtered = filtered.filter(b => b.stars >= selectedRating);
  if (searchTerm) {
    const term = searchTerm.toLowerCase();
    filtered = filtered.filter(b =>
      b.title.toLowerCase().includes(term) ||
      b.author.toLowerCase().includes(term) ||
      (b.category && b.category.toLowerCase().includes(term))
    );
  }
  return filtered;
}

function renderBooks() {
  const filtered = getFilteredBooks();
  const totalPages = Math.ceil(filtered.length / BOOKS_PER_PAGE);
  if (currentPage > totalPages) currentPage = totalPages;

  const start = (currentPage - 1) * BOOKS_PER_PAGE;
  const end = start + BOOKS_PER_PAGE;
  const pageBooks = filtered.slice(start, end);

  booksGrid.innerHTML = '';
  sectionTitle.textContent = selectedAuthor ? `Livros de ${selectedAuthor}` :
    selectedCategory ? `Livros de ${selectedCategory}` :
    searchTerm ? `Resultado da busca` : `Livros em Destaque`;

  if (pageBooks.length === 0) {
    booksGrid.innerHTML = '<div style="color:red;text-align:center;">Nenhum livro encontrado.</div>';
    pagination.innerHTML = '';
    return;
  }

  pageBooks.forEach(book => {
    const card = document.createElement("div");
    card.className = "book-card";

    const tituloArquivo = book.title
      .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
      .toLowerCase().replace(/\s+/g, '')
      .replace(/[^a-z0-9]/g, '');

    const categoriaPasta = book.category?.toLowerCase();
    const linkLivro = `/pastasdecategorias/${categoriaPasta}/${tituloArquivo}.html`;

    card.innerHTML = `
      <a href="${linkLivro}" style="text-decoration:none; color:inherit;">
        <img src="${book.cover}" class="book-cover" alt="${book.title}"/>
        <div class="book-title">${book.title}</div>
        <div class="book-author">${book.author}</div>
        <div class="book-category">${book.category}</div>
        <div class="book-stars">${'★'.repeat(book.stars)}${'☆'.repeat(5 - book.stars)}</div>
      </a>
      <button class="add-cart-btn ${isFav(book.id) ? 'favorited' : ''}" data-book-id="${book.id}">
        ${isFav(book.id) ? 'Favoritado' : 'Adicionar aos favoritos'}
      </button>`;
    booksGrid.appendChild(card);
  });

  // Preenche linha com espaços invisíveis se necessário
  const remainder = pageBooks.length % 4;
  if (remainder !== 0) {
    const missing = 4 - remainder;
    for (let i = 0; i < missing; i++) {
      const filler = document.createElement("div");
      filler.className = "book-card";
      filler.style.visibility = "hidden";
      booksGrid.appendChild(filler);
    }
  }

  renderPagination(totalPages);
  setupBookEvents();
}

function renderPagination(totalPages) {
  pagination.innerHTML = '';
  const filtered = getFilteredBooks();
  if (totalPages <= 1 || filtered.length === 0) return;

  for (let i = 1; i <= totalPages; i++) {
    const start = (i - 1) * BOOKS_PER_PAGE;
    const pageHasBooks = filtered.slice(start, start + BOOKS_PER_PAGE).length > 0;
    if (!pageHasBooks) continue;

    const btn = document.createElement("button");
    btn.textContent = i;
    if (i === currentPage) btn.classList.add("active");
    btn.onclick = () => {
      currentPage = i;
      renderBooks();
    };
    pagination.appendChild(btn);
  }
}

function setupBookEvents() {
  booksGrid.querySelectorAll(".add-cart-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const id = Number(btn.getAttribute("data-book-id"));
      if (!isFav(id)) {
        setFavs([...getFavs(), id]);
        updateFavCount();
        btn.textContent = "Favoritado";
        btn.classList.add("favorited");
      }
    });
  });
}

searchBox.addEventListener("input", () => {
  searchTerm = searchBox.value;
  currentPage = 1;
  renderBooks();
});
searchBtn.addEventListener("click", () => {
  searchTerm = searchBox.value;
  currentPage = 1;
  renderBooks();
});
ratingStars.forEach((star, idx) => {
  star.addEventListener("click", () => {
    selectedRating = 5 - idx;
    currentPage = 1;
    renderBooks();
  });
});
clearRating.addEventListener("click", () => {
  selectedRating = null;
  currentPage = 1;
  renderBooks();
});
navLivros.addEventListener("click", () => {
  selectedAuthor = null;
  selectedCategory = null;
  selectedRating = null;
  searchTerm = "";
  currentPage = 1;
  renderBooks();
});
navInicio.addEventListener("click", () => {
  selectedAuthor = null;
  selectedCategory = null;
  selectedRating = null;
  searchTerm = "";
  currentPage = 1;
  renderBooks();
});
navAutores.addEventListener("click", () => {
  authorSlideout.classList.add("open");
});
closeAuthorsSlideout.addEventListener("click", () => {
  authorSlideout.classList.remove("open");
});
authorSlideout.addEventListener("click", (e) => {
  if (e.target === authorSlideout) authorSlideout.classList.remove("open");
});
favBtn.addEventListener("click", () => {
  favModal.classList.add("open");
  renderFavModal();
  document.body.style.overflow = "hidden";
});
closeFavModal.addEventListener("click", () => {
  favModal.classList.remove("open");
  document.body.style.overflow = "";
});
favModal.addEventListener("click", (e) => {
  if (e.target === favModal) {
    favModal.classList.remove("open");
    document.body.style.overflow = "";
  }
});

function renderFavModal() {
  favBooksList.innerHTML = "";
  const favs = getFavs();
  if (favs.length === 0) {
    favBooksList.innerHTML = "<p>Nenhum favorito ainda.</p>";
    return;
  }
  favs.forEach(id => {
    const book = booksData.find(b => b.id === id);
    if (!book) return;
    const div = document.createElement("div");
    div.className = "fav-book-card";
    div.innerHTML = `
<img src="${book.cover}" alt="${book.title}" style="width:80px; height:auto; margin-right:12px;">
<div style="flex:1;">
  <div style="font-weight:bold;">${book.title}</div>
  <div style="color:#666; font-size:0.9em;">${book.author}</div>
  <button class="fav-remove-btn" data-book-id="${book.id}" style="margin-top:6px;">Remover</button>
</div>`;
    favBooksList.appendChild(div);
  });
  favBooksList.querySelectorAll(".fav-remove-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const id = Number(btn.getAttribute("data-book-id"));
      setFavs(getFavs().filter(fid => fid !== id));
      updateFavCount();
      renderFavModal();
      renderBooks();
    });
  });
}

window.onload = () => {
  carregarLivrosDoBackend();
};