import api, { errorMessage } from './client';
import type { ApiResult, BookDto, CreateBookRequest } from './types';

// Serviços de livros
export const booksApi = {
  // Criar novo livro
  async create(livroData: CreateBookRequest): Promise<ApiResult<BookDto>> {
    try {
      const response = await api.post<BookDto>('/livro/create', livroData);
      return {
        success: true,
        data: response.data,
        message: 'Livro adicionado com sucesso!',
      };
    } catch (error) {
      return {
        success: false,
        error: errorMessage(error, 'Erro ao adicionar livro'),
        data: null,
      };
    }
  },
};
