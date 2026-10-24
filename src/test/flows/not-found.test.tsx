import { screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { renderApp } from '@/test/renderApp';

describe('Page not found', () => {
  it('an unknown address shows the 404, with the way back to the first visit page', async () => {
    renderApp('/nao-existe');

    expect(
      await screen.findByRole('heading', { name: 'Essa página saiu da estante.' }),
    ).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Voltar ao início' })).toHaveAttribute('href', '/');
  });

  it('for whoever is logged in, "Voltar ao início" goes to Home', async () => {
    renderApp('/nao-existe', { loggedIn: true });

    expect(await screen.findByRole('link', { name: 'Voltar ao início' })).toHaveAttribute(
      'href',
      '/home',
    );
  });
});
