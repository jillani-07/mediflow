import apiClient from './axios';
import { AuthTokens } from '../types';

interface LoginPayload { email: string; password: string; }

export const authApi = {
  login: async (payload: LoginPayload): Promise<AuthTokens> => {
    const { data } = await apiClient.post<AuthTokens>('/auth/login', payload);
    return data;
  },
};