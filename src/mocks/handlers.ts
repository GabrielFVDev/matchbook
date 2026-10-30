import { http, HttpResponse } from 'msw';
import type { HttpResponseResolver } from 'msw';
import { apiUrl as API } from '@/lib/env';
import { books, likedBooks, likedCount, preferences, rejectResult, stats } from './data';

type Body = Record<string, unknown>;

// The recommendation cycles through the first 3 books and only moves on with Amei or Próximo, like
// the backend, which drops the book already decided from the list. Asking again without deciding
// (React asks twice in dev mode) returns the same book, and Home always opens on "Fundação".
let turn = 0;
let nextBookId = 6;

export const resetMockState = () => {
  turn = 0;
  nextBookId = 6;
};

const emptyOk = () => new HttpResponse(null, { status: 200 });
const noContent = () => new HttpResponse(null, { status: 204 });

// Like the backend, every route requires the Firebase token; without it, 401.
const withToken =
  (resolver: HttpResponseResolver): HttpResponseResolver =>
  (info) =>
    info.request.headers.get('Authorization')?.startsWith('Bearer ')
      ? resolver(info)
      : new HttpResponse(null, { status: 401 });

export const handlers = [
  http.get(
    `${API}/me/preferences`,
    withToken(() => HttpResponse.json(preferences)),
  ),

  // The backend replaces the preferences with what arrived and returns the result, with the uid.
  http.put(
    `${API}/me/preferences`,
    withToken(async ({ request }) =>
      HttpResponse.json({
        firebaseUid: preferences.firebaseUid,
        ...((await request.json()) as Body),
      }),
    ),
  ),

  http.delete(`${API}/me`, withToken(noContent)),

  // The backend returns the books not seen yet, sorted; the front shows the first one.
  http.get(
    `${API}/recommendation/getAdaptiveRecommendation`,
    withToken(() => {
      const first = books[turn % 3];
      return HttpResponse.json([first, ...books.filter((book) => book !== first)]);
    }),
  ),

  http.post(
    `${API}/recommendation/accept`,
    withToken(() => {
      turn++;
      return emptyOk();
    }),
  ),

  http.post(
    `${API}/recommendation/reject`,
    withToken(() => {
      turn++;
      return HttpResponse.json(rejectResult);
    }),
  ),

  http.get(
    `${API}/recommendation/statistics`,
    withToken(() => HttpResponse.json(stats)),
  ),

  http.post(`${API}/recommendation/resetAlgorithm`, withToken(emptyOk)),

  http.get(
    `${API}/book/liked`,
    withToken(() => HttpResponse.json(likedBooks)),
  ),

  http.get(
    `${API}/book/liked/count`,
    withToken(() => HttpResponse.json(likedCount)),
  ),

  http.delete(`${API}/book/liked`, withToken(noContent)),

  http.post(
    `${API}/book/create`,
    withToken(async ({ request }) =>
      HttpResponse.json({
        ...((await request.json()) as Body),
        id: nextBookId++,
        ownerUid: preferences.firebaseUid,
        createdAt: new Date().toISOString(),
      }),
    ),
  ),
];
