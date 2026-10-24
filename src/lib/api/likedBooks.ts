import { isAxiosError } from 'axios';
import api, { errorMessage } from './client';
import type { ApiResult, LikedBookItem, LikedCount, LikeResult } from './types';

// Serviços dos livros curtidos (os favoritos de "Meus livros")
export const likedBooksApi = {
  // Obter livros curtidos pelo usuário
  async list(idUsuario: number): Promise<ApiResult<LikedBookItem[]>> {
    try {
      const response = await api.get<LikedBookItem[]>(`/livros-curtidos/usuario/${idUsuario}`);

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
  async like(idUsuario: number, idLivro: number): Promise<ApiResult<LikeResult>> {
    try {
      const response = await api.post<LikeResult>(
        `/livros-curtidos/curtir?usuarioId=${idUsuario}&livroId=${idLivro}`,
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
  async unlike(idUsuario: number, idLivro: number): Promise<ApiResult<unknown>> {
    try {
      const response = await api.delete(
        `/livros-curtidos/descurtir?usuarioId=${idUsuario}&livroId=${idLivro}`,
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
  async count(idUsuario: number): Promise<ApiResult<LikedCount, LikedCount>> {
    try {
      const response = await api.get<LikedCount>(`/livros-curtidos/usuario/${idUsuario}/contador`);
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
