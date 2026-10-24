import { screen, waitFor } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { changes, renderApp, trackApiCalls } from '@/test/renderApp';

const synopsis =
  'Paul Atreides chega ao planeta deserto Arrakis, onde a especiaria mais valiosa do universo decide o destino de impérios.';

describe('Add book', () => {
  it('creates the book with the current body and adds it to the favorites', async () => {
    const calls = trackApiCalls();
    const { user } = renderApp('/adicionar-livro', { loggedIn: true });

    await user.type(await screen.findByRole('textbox', { name: /^Título/ }), 'Duna');
    await user.type(screen.getByRole('textbox', { name: /^Autor/ }), 'Frank Herbert');
    await user.selectOptions(
      screen.getByRole('combobox', { name: /^Gênero/ }),
      'Ficção Científica',
    );
    await user.click(screen.getByRole('textbox', { name: /^Do que o livro trata/ }));
    await user.paste(synopsis);
    await user.type(
      screen.getByRole('textbox', { name: 'Link da imagem' }),
      'https://exemplo.com/duna.jpg',
    );
    await user.click(screen.getByRole('button', { name: 'Adicionar aos meus livros' }));

    expect(await screen.findByText('Livro adicionado')).toBeInTheDocument();
    // Current behavior: the cover goes as "capaUrl", which the backend ignores (its field is
    // "capa"). Changes when the backend is rebuilt.
    await waitFor(() =>
      expect(calls.find((call) => call.path === '/livro/create')?.body).toEqual({
        titulo: 'Duna',
        autor: 'Frank Herbert',
        editora: '',
        genero: 'Ficção Científica',
        anoPublicacao: null,
        numeroPaginas: null,
        idioma: 'Português',
        isbn: '',
        sinopse: synopsis,
        capaUrl: 'https://exemplo.com/duna.jpg',
        disponivel: true,
      }),
    );
    expect(changes(calls)).toEqual([
      'POST /livro/create',
      'POST /livros-curtidos/curtir?usuarioId=1&livroId=6',
    ]);
  });
});
