// Dados de exemplo da API falsa. Tudo inventado; os nomes dos campos são os do backend.

export const user = {
  id: 1,
  nome: 'Ana Ribeiro',
  email: 'ana@email.com',
  // O backend devolve a senha em GET /usuario/all, e o login do front compara com ela.
  senha: '123456',
  generoFavorito: 'Ficção Científica',
  autorPreferido: 'Isaac Asimov',
  nivelLeitura: 'Intermediário',
  livrosLidos: 25,
  receberRecomendacoes: true,
  biografia: 'Leitora apaixonada por ficção científica.',
  dataNascimento: '1995-05-15',
  dataCadastro: '2026-03-10',
};

// O que o front grava no localStorage depois do login: o usuário sem a senha.
const { senha: _password, ...sessionUser } = user;
export { sessionUser };

export const books = [
  {
    id: 1,
    titulo: 'Fundação',
    autor: 'Isaac Asimov',
    genero: 'Ficção Científica',
    numeroPaginas: 244,
    anoPublicacao: 1951,
    editora: 'Aleph',
    sinopse:
      'O matemático Hari Seldon prevê a queda do Império Galáctico e cria a Fundação para encurtar os séculos de barbárie que virão depois.',
  },
  {
    id: 2,
    titulo: '1984',
    autor: 'George Orwell',
    genero: 'Distopia',
    numeroPaginas: 328,
    anoPublicacao: 1949,
    editora: 'Companhia das Letras',
    sinopse:
      'Num Estado que vigia tudo e reescreve o passado, Winston Smith começa a guardar um diário e a duvidar do Grande Irmão.',
  },
  {
    id: 3,
    titulo: 'O Hobbit',
    autor: 'J.R.R. Tolkien',
    // Em minúsculas de propósito: o front normaliza o nome do gênero.
    genero: 'fantasia',
    numeroPaginas: 336,
    anoPublicacao: 1937,
    editora: 'HarperCollins',
    sinopse:
      'Bilbo Bolseiro só queria sossego, até um mago e treze anões o arrastarem para recuperar um tesouro guardado por um dragão.',
  },
  {
    id: 4,
    titulo: 'Assassinato no Expresso do Oriente',
    autor: 'Agatha Christie',
    genero: 'Policial',
    numeroPaginas: 240,
    anoPublicacao: 1934,
    editora: 'HarperCollins',
    sinopse: 'Um assassinato num trem parado pela neve.',
  },
  {
    id: 5,
    titulo: 'Dom Casmurro',
    autor: 'Machado de Assis',
    genero: 'Romance',
    numeroPaginas: 256,
    anoPublicacao: 1899,
    editora: 'Penguin',
    sinopse: 'Bentinho conta como conheceu Capitu.',
  },
];

// Os favoritos vêm sem "dataCurtida": o backend não manda esse campo.
export const likedBooks = books;

export const likedCount = { total: 8 };

export const stats = {
  totalRecusas: 7,
  totalAceites: 3,
  taxaAceitacao: 30,
  estrategiaAtual: 'DIVERSIFICADO',
};

export const rejectResult = {
  totalRecusas: 8,
  algoritmoAlterado: true,
  sugestao: 'Algoritmo será mais exploratório',
};
