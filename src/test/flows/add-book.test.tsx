import { screen, waitFor } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { changes, renderApp, trackApiCalls } from '@/test/renderApp';

const synopsis =
  'Paul Atreides chega ao planeta deserto Arrakis, onde a especiaria mais valiosa do universo decide o destino de impérios.';

describe('Add book', () => {
  it('creates the book and adds it to the favorites', async () => {
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
    await waitFor(() =>
      expect(calls.find((call) => call.path === '/book/create')?.body).toEqual({
        title: 'Duna',
        author: 'Frank Herbert',
        publisher: '',
        genre: 'Ficção Científica',
        publicationYear: null,
        pageCount: null,
        language: 'Português',
        synopsis,
        coverUrl: 'https://exemplo.com/duna.jpg',
      }),
    );
    expect(changes(calls)).toEqual(['POST /book/create', 'POST /recommendation/accept?bookId=6']);
  });

  it('asks only for the title, the author and the genre, and creates the book without a synopsis', async () => {
    const calls = trackApiCalls();
    const { user } = renderApp('/adicionar-livro', { loggedIn: true });
    const submit = await screen.findByRole('button', { name: 'Adicionar aos meus livros' });
    const titleField = screen.getByRole('textbox', { name: /^Título/ });
    const authorField = screen.getByRole('textbox', { name: /^Autor/ });
    const genreField = screen.getByRole('combobox', { name: /^Gênero/ });
    const synopsisField = screen.getByRole('textbox', { name: /^Do que o livro trata/ });

    await user.click(submit);

    expect(titleField).toHaveAccessibleDescription('Informe o título');
    expect(authorField).toHaveAccessibleDescription('Informe o autor');
    expect(genreField).toHaveAccessibleDescription('Escolha um gênero');
    expect(synopsisField).toHaveAccessibleName('Do que o livro trata');
    expect(synopsisField).toBeValid();
    expect(changes(calls)).toEqual([]);

    await user.type(titleField, 'Duna');
    await user.type(authorField, 'Frank Herbert');
    await user.selectOptions(genreField, 'Ficção Científica');
    await user.click(submit);

    expect(await screen.findByText('Livro adicionado')).toBeInTheDocument();
    await waitFor(() =>
      expect(calls.find((call) => call.path === '/book/create')?.body).toMatchObject({
        title: 'Duna',
        synopsis: '',
      }),
    );
  });

  it('stops the synopsis and the cover link at 255 characters', async () => {
    const calls = trackApiCalls();
    const { user } = renderApp('/adicionar-livro', { loggedIn: true });
    const longCoverUrl = `https://exemplo.com/${'a'.repeat(300)}.jpg`;

    await user.type(await screen.findByRole('textbox', { name: /^Título/ }), 'Duna');
    await user.type(screen.getByRole('textbox', { name: /^Autor/ }), 'Frank Herbert');
    await user.selectOptions(
      screen.getByRole('combobox', { name: /^Gênero/ }),
      'Ficção Científica',
    );
    const synopsisField = screen.getByRole<HTMLTextAreaElement>('textbox', {
      name: /^Do que o livro trata/,
    });
    await user.click(synopsisField);
    await user.paste('a'.repeat(300));
    const coverField = screen.getByRole<HTMLInputElement>('textbox', { name: 'Link da imagem' });
    await user.click(coverField);
    await user.paste(longCoverUrl);

    expect({
      synopsis: synopsisField.value.length,
      coverUrl: coverField.value.length,
    }).toEqual({ synopsis: 255, coverUrl: 255 });
    expect(screen.getByText('255 de 255')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Adicionar aos meus livros' }));

    expect(await screen.findByText('Livro adicionado')).toBeInTheDocument();
    await waitFor(() =>
      expect(calls.find((call) => call.path === '/book/create')?.body).toMatchObject({
        synopsis: 'a'.repeat(255),
        coverUrl: longCoverUrl.slice(0, 255),
      }),
    );
  });
});
