import { http, HttpResponse } from 'msw';
import { apiUrl as API } from '@/lib/env';
import { books, likedBooks, likedCount, rejectResult, stats, user } from './data';

type Body = Record<string, unknown>;

// The recommendation cycles through the first 3 books and only moves on with Amei or Próximo, like
// the backend, which drops the book already decided from the list. Asking again without deciding
// (React asks twice in dev mode) returns the same book, and Home always opens on "Fundação".
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
    // The backend returns the created user, with the password.
    return HttpResponse.json({ id: 2, ...body });
  }),

  http.get(`${API}/usuario/all`, () => HttpResponse.json([user])),

  // The backend replaces the whole user with what arrived and returns the result.
  http.put(`${API}/usuario/update`, async ({ request }) =>
    HttpResponse.json((await request.json()) as Body),
  ),

  // The backend returns the whole catalog sorted; the front shows the first one.
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

  // An empty list becomes 204 with no body, like in the backend.
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
    // The backend ignores "capaUrl": its field is called "capa".
    const { capaUrl: _ignored, ...book } = (await request.json()) as Body;
    return HttpResponse.json({ id: nextBookId++, ...book, capa: null });
  }),
];
