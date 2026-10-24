import { screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { renderApp, trackApiCalls } from '@/test/renderApp';

describe('First visit', () => {
  it('shows the first visit page at / with the ways in to login and sign-up', async () => {
    renderApp('/');

    expect(
      await screen.findByRole('heading', {
        name: 'Seu próximo livro favorito, um match de cada vez.',
      }),
    ).toBeInTheDocument();
    for (const link of [
      screen.getByRole('link', { name: 'Entrar' }),
      ...screen.getAllByRole('link', { name: 'Já tenho conta' }),
    ]) {
      expect(link).toHaveAttribute('href', '/entrar');
    }
    for (const link of screen.getAllByRole('link', { name: 'Criar conta' })) {
      expect(link).toHaveAttribute('href', '/cadastro');
    }
  });

  it('the demo card answers on the page itself, without calling the API', async () => {
    const calls = trackApiCalls();
    const { user } = renderApp('/');

    await screen.findByRole('img', { name: 'Capa de O Hobbit' });
    await user.click(screen.getByRole('button', { name: 'Amei' }));

    expect(await screen.findByText('Gostou?')).toBeInTheDocument();
    expect(screen.getByRole('img', { name: 'Capa de Fundação' })).toBeInTheDocument();
    expect(calls).toEqual([]);
  });

  it('sends whoever is logged in and opens / to Home', async () => {
    renderApp('/', { loggedIn: true });

    expect(await screen.findByRole('heading', { name: 'Achei um pra você.' })).toBeInTheDocument();
    expect(window.location.pathname).toBe('/home');
  });
});
