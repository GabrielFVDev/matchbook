import { authApi } from './auth';
import { booksApi } from './books';
import { likedBooksApi } from './likedBooks';
import { recommendationsApi } from './recommendations';
import { usersApi } from './users';

// Fachada temporária com os nomes antigos, para as telas (ainda em JS) não mudarem.
// O M6 do handoff troca as telas para as APIs novas e apaga este arquivo.

export const authService = {
  cadastrar: authApi.signUp,
  login: authApi.login,
};

export const userService = {
  atualizar: usersApi.update,
};

export const recomendacaoService = {
  obterRecomendacaoAdaptativa: recommendationsApi.getAdaptive,
  aceitarLivro: recommendationsApi.accept,
  recusarLivro: recommendationsApi.reject,
  obterEstatisticas: recommendationsApi.getStats,
  resetarAlgoritmo: recommendationsApi.resetAlgorithm,
  obterLivrosCurtidos: likedBooksApi.list,
  curtirLivro: likedBooksApi.like,
  descurtirLivro: likedBooksApi.unlike,
  contarLivrosCurtidos: likedBooksApi.count,
};

export const livroService = {
  criar: booksApi.create,
};
