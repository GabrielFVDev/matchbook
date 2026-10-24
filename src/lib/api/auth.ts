import { isAxiosError } from 'axios';
import api, { errorMessage } from './client';
import type { ApiResult, SignUpRequest, UserDto } from './types';

// Serviços de autenticação
export const authApi = {
  // Criar novo usuário
  async signUp(userData: SignUpRequest): Promise<ApiResult<UserDto>> {
    try {
      const response = await api.post<UserDto>('/usuario/create', userData);
      return {
        success: true,
        data: response.data,
        message: 'Usuário cadastrado com sucesso!',
      };
    } catch (error) {
      const response = isAxiosError(error) ? error.response : undefined;
      console.error('Service: Erro na API:', error);
      console.error('Service: Erro response:', response?.data);
      console.error('Service: Erro status:', response?.status);

      let errorText = 'Erro ao cadastrar usuário';

      if (response?.data?.message) {
        errorText = response.data.message;
      } else if (response?.data) {
        errorText =
          typeof response.data === 'string' ? response.data : JSON.stringify(response.data);
      } else if (error instanceof Error && error.message) {
        errorText = error.message;
      }

      return {
        success: false,
        error: errorText,
        data: null,
      };
    }
  },

  // Fazer login (simulação, pois não há endpoint específico de login na API)
  async login(email: string, senha: string): Promise<ApiResult<Omit<UserDto, 'senha'>>> {
    try {
      // Como não temos endpoint de login específico, vamos buscar todos os usuários
      // e verificar se existe um com o email/senha fornecidos
      const response = await api.get<UserDto[]>('/usuario/all');
      const usuarios = response.data;

      const usuarioEncontrado = usuarios.find(
        (usuario) => usuario.email === email && usuario.senha === senha,
      );

      if (usuarioEncontrado) {
        // Remove a senha do objeto retornado por segurança
        const { senha: _, ...usuarioSemSenha } = usuarioEncontrado;

        return {
          success: true,
          data: usuarioSemSenha,
          message: 'Login realizado com sucesso!',
        };
      } else {
        return {
          success: false,
          error: 'Email ou senha incorretos',
          data: null,
        };
      }
    } catch (error) {
      return {
        success: false,
        error: errorMessage(error, 'Erro ao fazer login'),
        data: null,
      };
    }
  },
};
