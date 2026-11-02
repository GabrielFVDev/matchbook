import api, { errorMessage } from './client';
import type { ApiResult, BookDto, LikedCount } from './types';

export const likedBooksApi = {
  async list(): Promise<ApiResult<BookDto[]>> {
    try {
      const response = await api.get<BookDto[]>('/book/liked');
      return {
        success: true,
        data: response.data,
        message: 'Livros curtidos obtidos com sucesso!',
      };
    } catch (error) {
      return {
        success: false,
        error: errorMessage(error, 'Erro ao obter livros curtidos'),
        data: null,
      };
    }
  },

  async unlike(bookId: number): Promise<ApiResult<unknown>> {
    try {
      const response = await api.delete(`/book/liked?bookId=${bookId}`);
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

  async count(): Promise<ApiResult<LikedCount, LikedCount>> {
    try {
      const response = await api.get<LikedCount>('/book/liked/count');
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
