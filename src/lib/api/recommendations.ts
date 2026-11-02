import api, { errorMessage } from './client';
import type { ApiResult, BookDto, RecommendationStats, RejectResult } from './types';

export const recommendationsApi = {
  async getAdaptive(): Promise<ApiResult<BookDto[]>> {
    try {
      const response = await api.get<BookDto[]>('/recommendation/getAdaptiveRecommendation');
      return {
        success: true,
        data: response.status === 204 ? [] : response.data,
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

  async accept(bookId: number): Promise<ApiResult<unknown>> {
    try {
      const response = await api.post(`/recommendation/accept?bookId=${bookId}`);
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

  async reject(bookId: number): Promise<ApiResult<RejectResult>> {
    try {
      const response = await api.post<RejectResult>(`/recommendation/reject?bookId=${bookId}`);
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

  async getStats(): Promise<ApiResult<RecommendationStats>> {
    try {
      const response = await api.get<RecommendationStats>('/recommendation/statistics');
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

  async resetAlgorithm(): Promise<ApiResult<unknown>> {
    try {
      const response = await api.post('/recommendation/resetAlgorithm');
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
