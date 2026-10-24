import { isAxiosError } from 'axios';
import api, { errorMessage } from './client';
import type { ApiResult, LikedBookItem, LikedCount, LikeResult } from './types';

// Liked book services (the favorites of "Meus livros")
export const likedBooksApi = {
  // Get the books the user liked
  async list(userId: number): Promise<ApiResult<LikedBookItem[]>> {
    try {
      const response = await api.get<LikedBookItem[]>(`/livros-curtidos/usuario/${userId}`);

      // A 204 (No Content) means there are no liked books
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
      // On a 404 or 204, return an empty list instead of an error
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

  // Like a book
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

  // Unlike a book
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

  // Count liked books
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
