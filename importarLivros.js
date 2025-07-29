const mongoose = require('mongoose');
require('dotenv').config();
const Livro = require('./controllers/models/modelsLivro');

const livros = [
  {
    titulo: "Vencendo o Passado",
    autor: "Zíbia Gasparetto",
    
    preco: 0,
    imagem: "https://carrefourbr.vtexassets.com/arquivos/ids/97103001/fdae3d8b4aab40d68744e9027b655cf5.jpg?v=638096993985070000",
    descricao: "",
    categoria: "Autoajuda"
  },
  {
    titulo: "Mais Esperto que o Diabo",
    autor: "Napoleon Hill",
    preco: 0,
    imagem: "https://m.media-amazon.com/images/I/819ERrDHRcL._UF1000,1000_QL80_.jpg",
    descricao: "",
    categoria: "Autoajuda"
  },
  {
    titulo: "Hábitos Atômicos",
    autor: "James Clear",
    preco: 0,
    imagem: "https://m.media-amazon.com/images/I/81eT2pjx4jL._UF350,350_QL50_.jpg",
    descricao: "",
    categoria: "Autoajuda"
  },
  {
    titulo: "Como fazer Amigos e Influenciar Pessoas",
    autor: "Dale Carnegie",
    preco: 0,
    imagem: "https://i3-imagens-prd.araujo.com.br/webp/94597/09788543108681_1.webp",
    descricao: "",
    categoria: "Autoajuda"
  },
  {
    titulo: "Minutos de Sabedoria",
    autor: "C. Torres Pastorino",
    preco: 0,
    imagem: "https://a-static.mlcdn.com.br/800x560/livro-minutos-de-sabedoria-c-torres-pastorino/oliststore/mglr843qbmh59lmq/ac42d7f8182113eb43d28998e6bc786c.jpeg",
    descricao: "",
    categoria: "Autoajuda"
  },
  {
    titulo: "A ilha do Tesouro",
    autor: "Robert Louis Stevenson",
    preco: 0,
    imagem: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRS8XNSPZjCytOyNxUI5YaNiXgmwIsQkTrmcQ&s",
    descricao: "",
    categoria: "Aventura"
  },
  {
    titulo: "Prisioneiros na Biblioteca",
    autor: "Manuel Filho",
    preco: 0,
    imagem: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR542Ok-mQvfjp8CRrQkzN_xvRld-lW0f_exg&s",
    descricao: "",
    categoria: "Aventura"
  },
  {
    titulo: "A Volta Ao Mundo Em 80 Dias",
    autor: "Jules Verne",
    preco: 0,
    imagem: "https://m.media-amazon.com/images/I/71UKvlLXALL._UF1000,1000_QL80_.jpg",
    descricao: "",
    categoria: "Aventura"
  },
  {
    titulo: "O Hobbit",
    autor: "J.R.R. Tolkien",
    preco: 0,
    imagem: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRB5_q8vn9bakK4__NsNFfzi0pgx4r1mG7S4g&s",
    descricao: "",
    categoria: "Aventura"
  },
  {
    titulo: "Matéria Escura",
    autor: "Blake Crouch",
    preco: 0,
    imagem: "https://m.media-amazon.com/images/I/61xHkoffp3L._UF1000,1000_QL80_.jpg",
    descricao: "",
    categoria: "Aventura"
  },
  {
    titulo: "Scar Tissue",
    autor: "Anthony Kiedis",
    preco: 0,
    imagem: "https://m.media-amazon.com/images/I/71ElBpqB2PL.jpg",
    descricao: "",
    categoria: "Biografia"
  },
  {
    titulo: "Minha História",
    autor: "Michelle Obama",
    preco: 0,
    imagem: "https://cdl-static.s3-sa-east-1.amazonaws.com/covers/gg/9788547000974/minha-historia.jpg",
    descricao: "",
    categoria: "Biografia"
  },
  {
    titulo: "Uma Terra Prometida",
    autor: "Barack Obama",
    preco: 0,
    imagem: "https://m.media-amazon.com/images/I/71ZCGlZewLL.jpg",
    descricao: "",
    categoria: "Biografia"
  },
  {
    titulo: "Adoro Problemas",
    autor: "Michael Moore",
    preco: 0,
    imagem: "https://m.media-amazon.com/images/I/81SCJLTWDgL.jpg",
    descricao: "",
    categoria: "Biografia"
  },
  {
    titulo: "Os Sapatos de Orfeu Biografia de Carlos Drummond de Andrade",
    autor: "Gilda de Mello",
    preco: 0,
    imagem: "https://m.media-amazon.com/images/I/81qfEU0WapL._UF1000,1000_QL80_.jpg",
    descricao: "",
    categoria: "Biografia"
  },
  {
    titulo: "Todos os Contos",
    autor: "Clarice Lispector",
    preco: 0,
    imagem: "https://tionitroblog.wordpress.com/wp-content/uploads/2016/08/todos-os-contos-clarice-lispector-livro.jpg",
    descricao: "",
    categoria: "Contos"
  },
  {
    titulo: "Os Cem Melhores Contos Brasileiros do Século",
    autor: "Ítalo Moriconi",
    preco: 0,
    imagem: "https://m.media-amazon.com/images/I/81ZRLMlwSuL._UF1000,1000_QL80_.jpg",
    descricao: "",
    categoria: "Contos"
  },
  {
    titulo: "Contos Clássicos de Terror",
    autor: "Julia Jeha",
    preco: 0,
    imagem: "https://m.media-amazon.com/images/I/71rYa+Q9jCL._UF1000,1000_QL80_.jpg",
    descricao: "",
    categoria: "Contos"
  },
  {
    titulo: "Olhos D'água",
    autor: "Conceição Evaristo",
    preco: 0,
    imagem: "https://m.media-amazon.com/images/I/51RjYjNVpRL.jpg",
    descricao: "",
    categoria: "Contos"
  },
  {
    titulo: "Doze Contos Peregrinos",
    autor: "Gabriel García Márquez",
    preco: 0,
    imagem: "https://m.media-amazon.com/images/I/81aVPLJSGSL.jpg",
    descricao: "",
    categoria: "Contos"
  },
  {
    titulo: "O Morro dos Ventos Uivantes",
    autor: "Emily Brontë",
    preco: 0,
    imagem: "https://m.media-amazon.com/images/I/71lqmkoeosL.jpg",
    descricao: "",
    categoria: "Drama"
  },
  {
    titulo: "O Jardim Secreto",
    autor: "Frances Hodgson Burnett",
    preco: 0,
    imagem: "https://m.media-amazon.com/images/I/81NItE0JseL.jpg",
    descricao: "",
    categoria: "Drama"
  },
  {
    titulo: "Para Sempre Alice",
    autor: "Lisa Genova",
    preco: 0,
    imagem: "https://m.media-amazon.com/images/I/81p79w-ownL._UF1000,1000_QL80_.jpg",
    descricao: "",
    categoria: "Drama"
  },
  {
    titulo: "Uma Vida Pequena",
    autor: "Hanya Yanagihara",
    preco: 0,
    imagem: "https://m.media-amazon.com/images/I/810ru7lFZcS._UF894,1000_QL80_.jpg",
    descricao: "",
    categoria: "Drama"
  },
  {
    titulo: "Antes Que o Café Esfrie",
    autor: "Toshikazu Kawaguchi",
    preco: 0,
    imagem: "https://m.media-amazon.com/images/I/81mPXoLOOXL._UF1000,1000_QL80_.jpg",
    descricao: "",
    categoria: "Drama"
  },
  {
    titulo: "A Hipótese do Amor",
    autor: "Ali Hazelwood",
    preco: 0,
    imagem: "https://m.media-amazon.com/images/I/81LTEfXYgcL.jpg",
    descricao: "",
    categoria: "Romance"
  },
  {
    titulo: "Um Quarto com Vista",
    autor: "E.M. Forster",
    preco: 0,
    imagem: "https://m.media-amazon.com/images/I/51XRiJqHJVL._UF1000,1000_QL80_.jpg",
    descricao: "",
    categoria: "Romance"
  },
  {
    titulo: "Me Chame Pelo Seu Nome",
    autor: "André Aciman",
    preco: 0,
    imagem: "https://m.media-amazon.com/images/I/81IB63g5V2L._UF894,1000_QL80_.jpg",
    descricao: "",
    categoria: "Romance"
  },
  {
    titulo: "É Assim que Acaba",
    autor: "Collen Hoover",
    preco: 0,
    imagem: "https://m.media-amazon.com/images/I/91r5G8RxqfL.jpg",
    descricao: "",
    categoria: "Romance"
  },
  {
    titulo: "O Visconde que me Amava",
    autor: "Julia Quinn",
    preco: 0,
    imagem: "https://images.tcdn.com.br/img/img_prod/1042630/o_visconde_que_me_amava_os_bridgertons_vol_2_177385_1_4c0c710d98776e81d9c65e9568513362.jpg",
    descricao: "",
    categoria: "Romance"
  }
];

// Conectar ao banco e inserir
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(async () => {
  console.log("🔗 Conectado ao MongoDB");

  await Livro.deleteMany(); // (opcional) limpa a coleção antes
  await Livro.insertMany(livros); // ✅ insere todos os livros

  console.log("✅ Livros importados com sucesso!");
  mongoose.disconnect();
})
.catch(err => console.error("❌ Erro ao importar livros:", err));