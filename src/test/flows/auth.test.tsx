import { screen, waitFor } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { renderApp, trackApiCalls } from '@/test/renderApp';

// Firebase itself (login, wrong password, sessions) is not tested here: in the tests it is the
// stand-in of src/mocks/firebase.ts. What is tested is what the front does around it.
describe('login and sign-up', () => {
  it('sends a logged-out visitor who opens /home to the login', async () => {
    renderApp('/home');

    expect(await screen.findByRole('heading', { name: 'Entrar' })).toBeInTheDocument();
    expect(window.location.pathname).toBe('/entrar');
  });

  it('creates the account in two steps and saves the taste in the backend', async () => {
    const calls = trackApiCalls();
    const { user } = renderApp('/cadastro');

    await user.type(await screen.findByLabelText('Nome completo'), '  Bia Souza  ');
    await user.type(screen.getByLabelText('Email'), 'Bia@Email.com');
    await user.type(screen.getByLabelText('Senha'), '123456');
    await user.type(screen.getByLabelText('Confirmar senha'), '123456');
    await user.click(screen.getByRole('button', { name: 'Continuar' }));

    expect(await screen.findByRole('heading', { name: 'Seu gosto' })).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Fantasia' }));
    await user.type(screen.getByLabelText('Autor preferido'), '  Tolkien ');
    await user.click(screen.getByRole('button', { name: 'Avançado' }));
    await user.click(screen.getByRole('button', { name: 'Criar conta' }));

    expect(await screen.findByText('Conta criada')).toBeInTheDocument();
    // The account went to Firebase; the backend only gets the taste, with the level in English.
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
});
