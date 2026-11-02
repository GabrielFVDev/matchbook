export const account = {
  user: {
    uid: 'uid-ana',
    name: 'Ana Ribeiro',
    email: 'ana@email.com',
    photoUrl: null,
    createdAt: 'Tue, 10 Mar 2026 12:00:00 GMT',
  },
};

export const newAccount = {
  uid: 'uid-bia',
  name: 'Bia Souza',
  email: 'bia@email.com',
  photoUrl: null,
  createdAt: 'Thu, 29 Oct 2026 12:00:00 GMT',
};

export const preferences = {
  firebaseUid: account.user.uid,
  favoriteGenre: 'Ficção Científica',
  favoriteAuthor: 'Isaac Asimov',
  readingLevel: 'intermediate',
  receiveRecommendations: true,
};

export const books = [
  {
    id: 1,
    title: 'Fundação',
    author: 'Isaac Asimov',
    genre: 'Ficção Científica',
    pageCount: 244,
    publicationYear: 1951,
    publisher: 'Aleph',
    synopsis:
      'O matemático Hari Seldon prevê a queda do Império Galáctico e cria a Fundação para encurtar os séculos de barbárie que virão depois.',
    ownerUid: null,
  },
  {
    id: 2,
    title: '1984',
    author: 'George Orwell',
    genre: 'Distopia',
    pageCount: 328,
    publicationYear: 1949,
    publisher: 'Companhia das Letras',
    synopsis:
      'Num Estado que vigia tudo e reescreve o passado, Winston Smith começa a guardar um diário e a duvidar do Grande Irmão.',
    ownerUid: null,
  },
  {
    id: 3,
    title: 'O Hobbit',
    author: 'J.R.R. Tolkien',
    genre: 'Fantasia',
    pageCount: 336,
    publicationYear: 1937,
    publisher: 'HarperCollins',
    synopsis:
      'Bilbo Bolseiro só queria sossego, até um mago e treze anões o arrastarem para recuperar um tesouro guardado por um dragão.',
    ownerUid: null,
  },
  {
    id: 4,
    title: 'Assassinato no Expresso do Oriente',
    author: 'Agatha Christie',
    genre: 'Policial',
    pageCount: 240,
    publicationYear: 1934,
    publisher: 'HarperCollins',
    synopsis: 'Um assassinato num trem parado pela neve.',
    ownerUid: null,
  },
  {
    id: 5,
    title: 'Dom Casmurro',
    author: 'Machado de Assis',
    genre: 'Romance',
    pageCount: 256,
    publicationYear: 1899,
    publisher: 'Penguin',
    synopsis: 'Bentinho conta como conheceu Capitu.',
    ownerUid: null,
  },
];

export const likedBooks = books;

export const likedCount = { total: 8 };

export const stats = {
  totalRejections: 7,
  totalAcceptances: 3,
  acceptanceRate: 30,
  currentStrategy: 'DIVERSIFIED',
};

export const rejectResult = {
  totalRejections: 8,
  algorithmChanged: true,
  suggestion: 'Algoritmo será mais exploratório',
};
