import { screen, waitFor } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { mockNewGoogleAccount } from '@/mocks/firebase';
import { renderApp, trackApiCalls } from '@/test/renderApp';

describe('login and sign-up', () => {
  it('sends a logged-out visitor who opens /home to the login', async () => {
    renderApp('/home');

    expect(await screen.findByRole('heading', { name: 'Entrar' })).toBeInTheDocument();
    expect(window.location.pathname).toBe('/entrar');
  });

  it('"Entrar com Google" with an account that already exists opens Home', async () => {
    const calls = trackApiCalls();
    const { user } = renderApp('/entrar');

    await user.click(await screen.findByRole('button', { name: 'Entrar com Google' }));

    expect(await screen.findByRole('heading', { name: 'Achei um pra você.' })).toBeInTheDocument();
    expect(calls.filter((call) => call.method === 'PUT')).toEqual([]);
  });

  it('a new Google account on the login goes through the taste step of the sign-up', async () => {
    const calls = trackApiCalls();
    const { user } = renderApp('/entrar');
    mockNewGoogleAccount();

    await user.click(await screen.findByRole('button', { name: 'Entrar com Google' }));

    expect(await screen.findByRole('heading', { name: 'Seu gosto' })).toBeInTheDocument();
    expect(screen.getByText('Etapa 2 de 2')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Fantasia' }));
    await user.click(screen.getByRole('button', { name: 'Salvar e começar' }));

    expect(await screen.findByText('Conta criada')).toBeInTheDocument();
    await waitFor(() =>
      expect(calls.find((call) => call.path === '/me/preferences')).toMatchObject({
        method: 'PUT',
        body: { favoriteGenre: 'Fantasia' },
      }),
    );
  });

  it('a new Google account goes to the taste step, which is saved in the backend', async () => {
    const calls = trackApiCalls();
    const { user } = renderApp('/cadastro');
    mockNewGoogleAccount();

    await user.click(await screen.findByRole('button', { name: 'Criar conta com Google' }));

    expect(await screen.findByRole('heading', { name: 'Seu gosto' })).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Fantasia' }));
    await user.type(screen.getByLabelText('Autor preferido'), '  Tolkien ');
    await user.click(screen.getByRole('button', { name: 'Avançado' }));
    await user.click(screen.getByRole('button', { name: 'Salvar e começar' }));

    expect(await screen.findByText('Conta criada')).toBeInTheDocument();
    expect(screen.getByText(/Boas-vindas, Bia!/)).toBeInTheDocument();
    await waitFor(() =>
      expect(calls.find((call) => call.path === '/me/preferences')).toMatchObject({
        method: 'PUT',
        body: {
          favoriteGenre: 'Fantasia',
          favoriteAuthor: 'Tolkien',
          readingLevel: 'advanced',
          receiveRecommendations: false,
        },
      }),
    );
  });

  it('a Google account that already exists skips the taste and opens Home', async () => {
    const calls = trackApiCalls();
    const { user } = renderApp('/cadastro');

    await user.click(await screen.findByRole('button', { name: 'Criar conta com Google' }));

    expect(await screen.findByRole('heading', { name: 'Achei um pra você.' })).toBeInTheDocument();
    expect(calls.filter((call) => call.method === 'PUT')).toEqual([]);
  });
});
