import apiClient from './axios';
import { Patient, PaginatedResponse } from '../types';

export interface CreatePatientPayload {
  fullName: string;
  email: string;
  phone?: string;
  dateOfBirth?: string;
  gender?: string;
  bloodGroup?: string;
  address?: string;
  medicalHistory?: string;
}

export const patientsApi = {
  getAll: async (page = 1, limit = 10): Promise<PaginatedResponse<Patient>> => {
    const { data } = await apiClient.get('/patients', { params: { page, limit } });
    return data;
  },

  getOne: async (id: string): Promise<Patient> => {
    const { data } = await apiClient.get(`/patients/${id}`);
    return data;
  },

  create: async (payload: CreatePatientPayload): Promise<Patient> => {
    const { data } = await apiClient.post('/patients', payload);
    return data;
  },

  update: async (id: string, payload: Partial<CreatePatientPayload>): Promise<Patient> => {
    const { data } = await apiClient.patch(`/patients/${id}`, payload);
    return data;
  },

  remove: async (id: string): Promise<void> => {
    await apiClient.delete(`/patients/${id}`);
  },
};