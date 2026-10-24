import api, { errorMessage } from './client';
import type { ApiResult, UpdateUserRequest, UserDto } from './types';

// Serviços de usuário
export const usersApi = {
  // Atualizar usuário
  async update(userData: UpdateUserRequest): Promise<ApiResult<UserDto>> {
    try {
      const response = await api.put<UserDto>('/usuario/update', userData);
      return {
        success: true,
        data: response.data,
        message: 'Usuário atualizado com sucesso!',
      };
    } catch (error) {
      return {
        success: false,
        error: errorMessage(error, 'Erro ao atualizar usuário'),
        data: null,
      };
    }
  },
};
