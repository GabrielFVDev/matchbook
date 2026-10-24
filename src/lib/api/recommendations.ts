import api, { errorMessage } from './client';
import type { ApiResult, BookDto, RecommendationStats, RejectResult } from './types';

// Recommendation services
export const recommendationsApi = {
  // Get the adaptive recommendation
  async getAdaptive(userId: number): Promise<ApiResult<BookDto[]>> {
    try {
      const response = await api.get<BookDto[]>(
        `/recomendacao/getRecomendacaoAdaptativa/${userId}`,
      );
      return {
        success: true,
        data: response.data,
        message: 'Recomendações obtidas com sucesso!',
      };
    } catch (error) {
      return {
        success: false,
        error: errorMessage(error, 'Erro ao obter recomendações'),
        data: null,
      };
    }
  },

  // Record that a book was accepted
  async accept(userId: number, bookId: number): Promise<ApiResult<unknown>> {
    try {
      const response = await api.post(
        `/recomendacao/aceitar?idUsuario=${userId}&idLivro=${bookId}`,
      );
      return {
        success: true,
        data: response.data,
        message: 'Livro aceito com sucesso!',
      };
    } catch (error) {
      return {
        success: false,
        error: errorMessage(error, 'Erro ao aceitar livro'),
        data: null,
      };
    }
  },

  // Record that a book was rejected
  async reject(userId: number, bookId: number): Promise<ApiResult<RejectResult>> {
    try {
      const response = await api.post<RejectResult>(
        `/recomendacao/recusar?idUsuario=${userId}&idLivro=${bookId}`,
      );
      return {
        success: true,
        data: response.data,
        message: 'Livro recusado',
      };
    } catch (error) {
      return {
        success: false,
        error: errorMessage(error, 'Erro ao recusar livro'),
        data: null,
      };
    }
  },

  // Get the user's statistics
  async getStats(userId: number): Promise<ApiResult<RecommendationStats>> {
    try {
      const response = await api.get<RecommendationStats>(`/recomendacao/estatisticas/${userId}`);
      return {
        success: true,
        data: response.data,
        message: 'Estatísticas obtidas com sucesso!',
      };
    } catch (error) {
      return {
        success: false,
        error: errorMessage(error, 'Erro ao obter estatísticas'),
        data: null,
      };
    }
  },

  // Reset the algorithm
  async resetAlgorithm(userId: number): Promise<ApiResult<unknown>> {
    try {
      const response = await api.post(`/recomendacao/resetarAlgoritmo/${userId}`);
      return {
        success: true,
        data: response.data,
        message: 'Algoritmo resetado com sucesso!',
      };
    } catch (error) {
      return {
        success: false,
        error: errorMessage(error, 'Erro ao resetar algoritmo'),
        data: null,
      };
    }
  },
};
