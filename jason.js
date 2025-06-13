// Lista de livros de exemplo
const books = [
  {
    title: "O Segredo das Águas",
    author: "Maria Silva",
    genre: "Ficção",
    year: "2024",
    rating: 4,
    img: "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=facearea&w=200&q=80"
  },
  {
    title: "A Jornada",
    author: "João Souza",
    genre: "Fantasia",
    year: "2023",
    rating: 4,
    img: "https://images.unsplash.com/photo-1524985069026-dd778a71c7b4?auto=format&fit=facearea&w=200&q=80"
  },
  {
    title: "Arte Moderna",
    author: "Ana Lima",
    genre: "Arte",
    year: "2022",
    rating: 5,
    img: "https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=facearea&w=200&q=80"
  },
  {
    title: "Grandes Biografias",
    author: "Carlos Pinto",
    genre: "Biografia",
    year: "2024",
    rating: 3,
    img: "https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=facearea&w=200&q=80"
  },
  {
    title: "Romance do Tempo",
    author: "Luiza Prado",
    genre: "Romance",
    year: "2023",
    rating: 4,
    img: "https://images.unsplash.com/photo-1507842217343-583bb7270b66?auto=format&fit=facearea&w=200&q=80"
  },
  {
    title: "Fantasia Infinita",
    author: "Pedro Alves",
    genre: "Fantasia",
    year: "2022",
    rating: 5,
    img: "https://images.unsplash.com/photo-1516979187457-637abb4f9353?auto=format&fit=facearea&w=200&q=80"
  }
];

// Função para gerar estrelas de avaliação
function getStars(rating) {
  let stars = '';
  for(let i=1;i<=5;i++) {
    stars += i <= rating ? '★' : '☆';
  }
  return stars;
}

// Função para renderizar os livros
function renderBooks(filterText = '', filterGenre = '', filterYear = '') {
  const grid = document.getElementById('bookGrid');
  grid.innerHTML = '';
  let count = 0;

  const filtered = books.filter(book => {
    const matchesText = book.title.toLowerCase().includes(filterText) ||
                        book.author.toLowerCase().includes(filterText);
    const matchesGenre = filterGenre ? book.genre === filterGenre : true;
    const matchesYear = filterYear ? book.year === filterYear : true;
    return matchesText && matchesGenre && matchesYear;
  });

  filtered.forEach(book => {
    count++;
    const card = document.createElement('div');
    card.className = 'book-card';
    card.innerHTML = `
      <img src="${book.img}" alt="${book.title}" />
      <div class="book-info">
        <div class="book-title">${book.title}</div>
        <div class="book-author">${book.author}</div>
        <div class="book-rating">${getStars(book.rating)}</div>
        <button class="add-btn">Adicionar à lista</button>
      </div>
    `;
    grid.appendChild(card);
  });

  document.getElementById('bookCount').textContent = `${count} livro${count !== 1 ? 's' : ''}`;
}

// Evento de busca e filtros
document.addEventListener('DOMContentLoaded', () => {
  const searchInput = document.getElementById('searchInput');
  const genreFilter = document.getElementById('genreFilter');
  const yearFilter = document.getElementById('yearFilter');
  const searchBtn = document.getElementById('searchBtn');

  function updateBooks() {
    const filterText = searchInput.value.trim().toLowerCase();
    const filterGenre = genreFilter.value;
    const filterYear = yearFilter.value;
    renderBooks(filterText, filterGenre, filterYear);
  }

  searchInput.addEventListener('input', updateBooks);
  genreFilter.addEventListener('change', updateBooks);
  yearFilter.addEventListener('change', updateBooks);
  searchBtn.addEventListener('click', updateBooks);

  renderBooks();
});