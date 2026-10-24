import api, { errorMessage } from './client';
import type { ApiResult, BookDto, RecommendationStats, RejectResult } from './types';

// Serviços de recomendação
export const recommendationsApi = {
  // Obter recomendação adaptativa
  async getAdaptive(idUsuario: number): Promise<ApiResult<BookDto[]>> {
    try {
      const response = await api.get<BookDto[]>(
        `/recomendacao/getRecomendacaoAdaptativa/${idUsuario}`,
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

  // Registrar aceitação de livro
  async accept(idUsuario: number, idLivro: number): Promise<ApiResult<unknown>> {
    try {
      const response = await api.post(
        `/recomendacao/aceitar?idUsuario=${idUsuario}&idLivro=${idLivro}`,
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

  // Registrar recusa de livro
  async reject(idUsuario: number, idLivro: number): Promise<ApiResult<RejectResult>> {
    try {
      const response = await api.post<RejectResult>(
        `/recomendacao/recusar?idUsuario=${idUsuario}&idLivro=${idLivro}`,
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

  // Obter estatísticas do usuário
  async getStats(idUsuario: number): Promise<ApiResult<RecommendationStats>> {
    try {
      const response = await api.get<RecommendationStats>(
        `/recomendacao/estatisticas/${idUsuario}`,
      );
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

  // Resetar algoritmo
  async resetAlgorithm(idUsuario: number): Promise<ApiResult<unknown>> {
    try {
      const response = await api.post(`/recomendacao/resetarAlgoritmo/${idUsuario}`);
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
