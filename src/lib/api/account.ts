import api, { errorMessage } from './client';
import type { ApiResult, Preferences, PreferencesRequest } from './types';

export const accountApi = {
  async getPreferences(): Promise<ApiResult<Preferences | null>> {
    try {
      const response = await api.get<Preferences>('/me/preferences', {
        validateStatus: (status) => status === 200 || status === 404,
      });
      return {
        success: true,
        data: response.status === 404 ? null : response.data,
        message: null,
      };
    } catch (error) {
      return {
        success: false,
        error: errorMessage(error, 'Erro ao obter preferências'),
        data: null,
      };
    }
  },

  async savePreferences(preferences: PreferencesRequest): Promise<ApiResult<Preferences>> {
    try {
      const response = await api.put<Preferences>('/me/preferences', preferences);
      return {
        success: true,
        data: response.data,
        message: 'Preferências salvas!',
      };
    } catch (error) {
      return {
        success: false,
        error: errorMessage(error, 'Erro ao salvar preferências'),
        data: null,
      };
    }
  },

  async deleteData(): Promise<ApiResult<unknown>> {
    try {
      const response = await api.delete('/me');
      return {
        success: true,
        data: response.data,
        message: 'Dados apagados.',
      };
    } catch (error) {
      return {
        success: false,
        error: errorMessage(error, 'Erro ao apagar seus dados'),
        data: null,
      };
    }
  },
};
