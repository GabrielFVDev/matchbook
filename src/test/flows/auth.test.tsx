import { screen, waitFor } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { renderApp, trackApiCalls } from '@/test/renderApp';

describe('login and sign-up', () => {
  it('sends a logged-out visitor who opens /home to the login', async () => {
    renderApp('/home');

    expect(await screen.findByRole('heading', { name: 'Entrar' })).toBeInTheDocument();
    expect(window.location.pathname).toBe('/entrar');
  });

  it('warns when the password is wrong', async () => {
    const { user } = renderApp('/entrar');

    await user.type(await screen.findByLabelText('Email'), 'ana@email.com');
    await user.type(screen.getByLabelText('Senha'), 'errada');
    await user.click(screen.getByRole('button', { name: 'Entrar' }));

    expect(await screen.findByRole('alert')).toHaveTextContent('Email ou senha incorretos');
    expect(localStorage.getItem('usuario')).toBeNull();
  });

  it('the right password opens Home and stores the session without the password', async () => {
    const { user } = renderApp('/entrar');

    await user.type(await screen.findByLabelText('Email'), 'ana@email.com');
    await user.type(screen.getByLabelText('Senha'), '123456');
    await user.click(screen.getByRole('button', { name: 'Entrar' }));

    expect(await screen.findByRole('heading', { name: 'Achei um pra você.' })).toBeInTheDocument();
    const session = JSON.parse(localStorage.getItem('usuario') ?? 'null');
    expect(session).toMatchObject({ id: 1, nome: 'Ana Ribeiro', email: 'ana@email.com' });
    expect(session).not.toHaveProperty('senha');
  });

  it('creates the account in two steps and sends clean data', async () => {
    const calls = trackApiCalls();
    const { user } = renderApp('/cadastro');

    await user.type(await screen.findByLabelText('Nome completo'), '  Bia Souza  ');
    await user.type(screen.getByLabelText('Email'), 'Bia@Email.com');
    await user.type(screen.getByLabelText('Senha'), '123456');
    await user.type(screen.getByLabelText('Confirmar senha'), '123456');
    await user.click(screen.getByRole('button', { name: 'Continuar' }));

    expect(await screen.findByRole('heading', { name: 'Seu gosto' })).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Aumentar' }));
    await user.click(screen.getByRole('button', { name: 'Aumentar' }));
    await user.click(screen.getByRole('button', { name: 'Criar conta' }));

    expect(await screen.findByText('Conta criada')).toBeInTheDocument();
    // Trimmed name, lowercase email, livrosLidos as a number and no "confirmarSenha".
    await waitFor(() =>
      expect(calls.find((call) => call.path === '/usuario/create')?.body).toEqual({
        nome: 'Bia Souza',
        email: 'bia@email.com',
        senha: '123456',
        dataNascimento: '',
        generoFavorito: '',
        livrosLidos: 2,
        autorPreferido: '',
        nivelLeitura: '',
        receberRecomendacoes: false,
        biografia: '',
      }),
    );
  });
});
