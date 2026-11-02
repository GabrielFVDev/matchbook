import { http, HttpResponse } from 'msw';
import type { HttpResponseResolver } from 'msw';
import { apiUrl as API } from '@/lib/env';
import { books, likedBooks, likedCount, preferences, rejectResult, stats } from './data';
import type { Body } from './types';

let turn = 0;
let nextBookId = 6;

export const resetMockState = () => {
  turn = 0;
  nextBookId = 6;
};

const emptyOk = () => new HttpResponse(null, { status: 200 });
const noContent = () => new HttpResponse(null, { status: 204 });

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
