import { screen, waitFor, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { changes, renderApp, trackApiCalls } from '@/test/renderApp';

describe('Profile', () => {
  it('saving the edit replaces the taste in the backend', async () => {
    const calls = trackApiCalls();
    const { user } = renderApp('/profile', { loggedIn: true });

    // The taste comes from the backend, and the level shows in Portuguese.
    expect(await screen.findByText('Intermediário')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Editar perfil' }));
    const dialog = await screen.findByRole('dialog', { name: 'Editar perfil' });
    await user.click(within(dialog).getByRole('button', { name: 'Avançado' }));
    await user.click(within(dialog).getByRole('button', { name: 'Salvar' }));

    expect(await screen.findByText('Perfil atualizado.')).toBeInTheDocument();
    expect(screen.getByText('Avançado')).toBeInTheDocument();
    // The PUT replaces everything: what did not change goes too.
    await waitFor(() =>
      expect(calls.find((call) => call.method === 'PUT')).toMatchObject({
        path: '/me/preferences',
        body: {
          favoriteGenre: 'Ficção Científica',
          favoriteAuthor: 'Isaac Asimov',
          readingLevel: 'advanced',
          receiveRecommendations: true,
        },
      }),
    );
  });

  it('"Excluir conta" asks the password, deletes the data in the backend and leaves', async () => {
    const calls = trackApiCalls();
    const { user } = renderApp('/profile', { loggedIn: true });

    await user.click(await screen.findByRole('button', { name: 'Excluir conta' }));
    const dialog = await screen.findByRole('dialog', { name: 'Excluir sua conta?' });
    await user.type(within(dialog).getByLabelText('Sua senha'), '123456');
    await user.click(within(dialog).getByRole('button', { name: 'Sim, excluir' }));

    expect(await screen.findByRole('heading', { name: 'Entrar' })).toBeInTheDocument();
    expect(changes(calls)).toEqual(['DELETE /me']);
  });
});
