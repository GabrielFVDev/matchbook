import { screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { changes, renderApp, trackApiCalls } from '@/test/renderApp';

describe('Home: the recommendation card', () => {
  it('"Amei" accepts, likes, shows a notice and adds 1 to the header counter', async () => {
    const calls = trackApiCalls();
    const { user } = renderApp('/home', { loggedIn: true });
    const header = await screen.findByRole('banner');

    await screen.findByRole('img', { name: 'Capa de Fundação' });
    expect(await within(header).findByText('8')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Amei' }));

    expect(await screen.findByText('Foi pros seus livros.')).toBeInTheDocument();
    expect(await within(header).findByText('9')).toBeInTheDocument();
    // Accepting teaches the algorithm and comes first; liking stores the book in "Meus livros".
    expect(changes(calls)).toEqual([
      'POST /recomendacao/aceitar?idUsuario=1&idLivro=1',
      'POST /livros-curtidos/curtir?usuarioId=1&livroId=1',
    ]);
  });

  it('"Próximo" rejects and shows the algorithm suggestion', async () => {
    const calls = trackApiCalls();
    const { user } = renderApp('/home', { loggedIn: true });

    await screen.findByRole('img', { name: 'Capa de Fundação' });
    await user.click(screen.getByRole('button', { name: 'Próximo' }));

    expect(await screen.findByText('Anotado.')).toBeInTheDocument();
    expect(screen.getByText('Algoritmo será mais exploratório')).toBeInTheDocument();
    expect(changes(calls)).toEqual(['POST /recomendacao/recusar?idUsuario=1&idLivro=1']);
  });

  it('the → arrow key does the same as "Amei"', async () => {
    const calls = trackApiCalls();
    const { user } = renderApp('/home', { loggedIn: true });

    await screen.findByRole('img', { name: 'Capa de Fundação' });
    await user.keyboard('{ArrowRight}');

    expect(await screen.findByText('Foi pros seus livros.')).toBeInTheDocument();
    expect(changes(calls)).toEqual([
      'POST /recomendacao/aceitar?idUsuario=1&idLivro=1',
      'POST /livros-curtidos/curtir?usuarioId=1&livroId=1',
    ]);
  });
});
