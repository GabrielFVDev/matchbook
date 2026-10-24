import { screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { changes, renderApp, trackApiCalls } from '@/test/renderApp';

describe('Início: a carta da recomendação', () => {
  it('"Amei" aceita, curte, avisa e soma 1 no contador do cabeçalho', async () => {
    const calls = trackApiCalls();
    const { user } = renderApp('/home', { loggedIn: true });
    const header = screen.getByRole('banner');

    await screen.findByRole('img', { name: 'Capa de Fundação' });
    expect(await within(header).findByText('8')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Amei' }));

    expect(await screen.findByText('Foi pros seus livros.')).toBeInTheDocument();
    expect(await within(header).findByText('9')).toBeInTheDocument();
    // Aceitar ensina o algoritmo e vem antes; curtir guarda em "Meus livros".
    expect(changes(calls)).toEqual([
      'POST /recomendacao/aceitar?idUsuario=1&idLivro=1',
      'POST /livros-curtidos/curtir?usuarioId=1&livroId=1',
    ]);
  });

  it('"Próximo" recusa e mostra a sugestão do algoritmo', async () => {
    const calls = trackApiCalls();
    const { user } = renderApp('/home', { loggedIn: true });

    await screen.findByRole('img', { name: 'Capa de Fundação' });
    await user.click(screen.getByRole('button', { name: 'Próximo' }));

    expect(await screen.findByText('Anotado.')).toBeInTheDocument();
    expect(screen.getByText('Algoritmo será mais exploratório')).toBeInTheDocument();
    expect(changes(calls)).toEqual(['POST /recomendacao/recusar?idUsuario=1&idLivro=1']);
  });

  it('a seta → do teclado faz o mesmo que "Amei"', async () => {
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
