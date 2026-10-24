import { http, HttpResponse } from 'msw';
import { apiUrl as API } from '@/lib/env';
import { books, likedBooks, likedCount, rejectResult, stats, user } from './data';

type Body = Record<string, unknown>;

// A recomendação gira entre os 3 primeiros livros e só avança com Amei ou Próximo, como no
// backend, que tira da lista o livro já decidido. Pedir de novo sem decidir (o React pede duas
// vezes no modo dev) devolve o mesmo livro, e o Início abre sempre em "Fundação".
let turn = 0;
let nextLikeId = 100;
let nextBookId = 6;

export const resetMockState = () => {
  turn = 0;
  nextLikeId = 100;
  nextBookId = 6;
};

const emptyOk = () => new HttpResponse(null, { status: 200 });

export const handlers = [
  http.post(`${API}/usuario/create`, async ({ request }) => {
    const body = (await request.json()) as Body;
    // O backend devolve o usuário criado, com a senha.
    return HttpResponse.json({ id: 2, ...body });
  }),

  http.get(`${API}/usuario/all`, () => HttpResponse.json([user])),

  // O backend troca o usuário inteiro pelo que chegou e devolve o resultado.
  http.put(`${API}/usuario/update`, async ({ request }) =>
    HttpResponse.json((await request.json()) as Body),
  ),

  // O backend devolve o catálogo inteiro ordenado; o front mostra o primeiro.
  http.get(`${API}/recomendacao/getRecomendacaoAdaptativa/:userId`, () => {
    const first = books[turn % 3];
    return HttpResponse.json([first, ...books.filter((book) => book !== first)]);
  }),

  http.post(`${API}/recomendacao/aceitar`, () => {
    turn++;
    return emptyOk();
  }),

  http.post(`${API}/recomendacao/recusar`, () => {
    turn++;
    return HttpResponse.json(rejectResult);
  }),

  http.get(`${API}/recomendacao/estatisticas/:userId`, () => HttpResponse.json(stats)),

  http.post(`${API}/recomendacao/resetarAlgoritmo/:userId`, emptyOk),

  // Lista vazia vira 204 sem corpo, como no backend.
  http.get(`${API}/livros-curtidos/usuario/:userId`, () =>
    likedBooks.length > 0 ? HttpResponse.json(likedBooks) : new HttpResponse(null, { status: 204 }),
  ),

  http.get(`${API}/livros-curtidos/usuario/:userId/contador`, () => HttpResponse.json(likedCount)),

  http.post(`${API}/livros-curtidos/curtir`, () =>
    HttpResponse.json({ sucesso: true, mensagem: 'Livro curtido com sucesso', id: nextLikeId++ }),
  ),

  http.delete(`${API}/livros-curtidos/descurtir`, () =>
    HttpResponse.json({ sucesso: true, mensagem: 'Livro descurtido com sucesso' }),
  ),

  http.post(`${API}/livro/create`, async ({ request }) => {
    // O backend ignora "capaUrl": o campo dele se chama "capa".
    const { capaUrl: _ignored, ...book } = (await request.json()) as Body;
    return HttpResponse.json({ id: nextBookId++, ...book, capa: null });
  }),
];
