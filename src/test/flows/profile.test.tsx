import { screen, waitFor, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { changes, renderApp, trackApiCalls } from '@/test/renderApp';

describe('Profile', () => {
  it('saving the edit sends the current fields, without the password', async () => {
    const calls = trackApiCalls();
    const { user } = renderApp('/profile', { loggedIn: true });

    await user.click(await screen.findByRole('button', { name: 'Editar perfil' }));
    const dialog = await screen.findByRole('dialog', { name: 'Editar perfil' });
    const name = within(dialog).getByRole('textbox', { name: 'Nome' });
    await user.clear(name);
    await user.type(name, 'Ana Ribeiro Lima');
    await user.click(within(dialog).getByRole('button', { name: 'Salvar' }));

    expect(await screen.findByText('Perfil atualizado.')).toBeInTheDocument();
    // Current behavior: the PUT has no password, and the backend replaces the whole user
    // with what arrived. Changes when the backend is rebuilt.
    await waitFor(() =>
      expect(calls.find((call) => call.method === 'PUT')).toMatchObject({
        path: '/usuario/update',
        body: {
          id: 1,
          nome: 'Ana Ribeiro Lima',
          email: 'ana@email.com',
          dataNascimento: '1995-05-15',
          generoFavorito: 'Ficção Científica',
          livrosLidos: 25,
          autorPreferido: 'Isaac Asimov',
          nivelLeitura: 'Intermediário',
          receberRecomendacoes: true,
          biografia: 'Leitora apaixonada por ficção científica.',
        },
      }),
    );
    expect(calls.find((call) => call.method === 'PUT')?.body).not.toHaveProperty('senha');
  });

  it('"Excluir conta" clears the session without calling the API', async () => {
    const calls = trackApiCalls();
    localStorage.setItem('token', 'token-de-exemplo');
    const { user } = renderApp('/profile', { loggedIn: true });

    await user.click(await screen.findByRole('button', { name: 'Excluir conta' }));
    const dialog = await screen.findByRole('dialog', { name: 'Excluir sua conta?' });
    await user.click(within(dialog).getByRole('button', { name: 'Sim, excluir' }));

    // Current behavior: the account stays on the server, because the button does not call the API.
    // Changes when the backend is rebuilt.
    expect(localStorage.getItem('usuario')).toBeNull();
    expect(localStorage.getItem('token')).toBeNull();
    expect(changes(calls)).toEqual([]);
  });
});
