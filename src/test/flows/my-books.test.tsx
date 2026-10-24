import { screen, waitFor } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { changes, renderApp, trackApiCalls } from '@/test/renderApp';

describe('My books', () => {
  it('removing unlikes the book, and "Desfazer" likes it again', async () => {
    const calls = trackApiCalls();
    const { user } = renderApp('/meus-livros', { loggedIn: true });
    const removeButton = { name: 'Remover Fundação dos favoritos' };

    await user.click(await screen.findByRole('button', removeButton));

    expect(await screen.findByText('saiu dos seus livros.', { exact: false })).toBeInTheDocument();
    await waitFor(() => expect(screen.queryByRole('button', removeButton)).not.toBeInTheDocument());

    await user.click(screen.getByRole('button', { name: 'Desfazer' }));

    expect(await screen.findByRole('button', removeButton)).toBeInTheDocument();
    expect(changes(calls)).toEqual([
      'DELETE /livros-curtidos/descurtir?usuarioId=1&livroId=1',
      'POST /livros-curtidos/curtir?usuarioId=1&livroId=1',
    ]);
  });
});
