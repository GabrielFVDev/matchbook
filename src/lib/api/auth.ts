import { isAxiosError } from 'axios';
import api, { errorMessage } from './client';
import type { ApiResult, SignUpRequest, UserDto } from './types';

// Authentication services
export const authApi = {
  // Create a new user
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

  // Log in (simulated, since the API has no specific login endpoint)
  async login(email: string, password: string): Promise<ApiResult<Omit<UserDto, 'senha'>>> {
    try {
      // Since there is no specific login endpoint, fetch all the users
      // and check whether one matches the given email/password
      const response = await api.get<UserDto[]>('/usuario/all');
      const users = response.data;

      const foundUser = users.find((user) => user.email === email && user.senha === password);

      if (foundUser) {
        // Remove the password from the returned object, for safety
        const { senha: _, ...userWithoutPassword } = foundUser;

        return {
          success: true,
          data: userWithoutPassword,
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
