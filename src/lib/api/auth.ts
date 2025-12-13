import { apiClient } from './client';

export const authApi = {
  login: async (username: string, password: string) => {
    const response = await apiClient.post('/auth/login/', {
      username,
      password,
    });
    return response.data;
  },

  logout: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
    }
  },
};