import { isAxiosError } from 'axios';
import api, { errorMessage } from './client';
import type { ApiResult, LikedBookItem, LikedCount, LikeResult } from './types';

// Serviços dos livros curtidos (os favoritos de "Meus livros")
export const likedBooksApi = {
  // Obter livros curtidos pelo usuário
  async list(userId: number): Promise<ApiResult<LikedBookItem[]>> {
    try {
      const response = await api.get<LikedBookItem[]>(`/livros-curtidos/usuario/${userId}`);

      // Se retornar 204 (No Content), significa que não há livros curtidos
      if (response.status === 204) {
        return {
          success: true,
          data: [],
          message: 'Nenhum livro curtido encontrado',
        };
      }

      return {
        success: true,
        data: response.data,
        message: 'Livros curtidos obtidos com sucesso!',
      };
    } catch (error) {
      // Se erro 404 ou 204, retorna lista vazia ao invés de erro
      const status = isAxiosError(error) ? error.response?.status : undefined;
      if (status === 404 || status === 204) {
        return {
          success: true,
          data: [],
          message: 'Nenhum livro curtido encontrado',
        };
      }

      return {
        success: false,
        error: errorMessage(error, 'Erro ao obter livros curtidos'),
        data: null,
      };
    }
  },

  // Curtir um livro
  async like(userId: number, bookId: number): Promise<ApiResult<LikeResult>> {
    try {
      const response = await api.post<LikeResult>(
        `/livros-curtidos/curtir?usuarioId=${userId}&livroId=${bookId}`,
      );
      return {
        success: true,
        data: response.data,
        message: 'Livro curtido com sucesso!',
      };
    } catch (error) {
      return {
        success: false,
        error: errorMessage(error, 'Erro ao curtir livro'),
        data: null,
      };
    }
  },

  // Descurtir um livro
  async unlike(userId: number, bookId: number): Promise<ApiResult<unknown>> {
    try {
      const response = await api.delete(
        `/livros-curtidos/descurtir?usuarioId=${userId}&livroId=${bookId}`,
      );
      return {
        success: true,
        data: response.data,
        message: 'Livro removido dos curtidos!',
      };
    } catch (error) {
      return {
        success: false,
        error: errorMessage(error, 'Erro ao remover livro dos curtidos'),
        data: null,
      };
    }
  },

  // Contar livros curtidos
  async count(userId: number): Promise<ApiResult<LikedCount, LikedCount>> {
    try {
      const response = await api.get<LikedCount>(`/livros-curtidos/usuario/${userId}/contador`);
      return {
        success: true,
        data: response.data,
        message: 'Contador obtido com sucesso!',
      };
    } catch (error) {
      return {
        success: false,
        error: errorMessage(error, 'Erro ao obter contador de livros curtidos'),
        data: { total: 0 },
      };
    }
  },
};
