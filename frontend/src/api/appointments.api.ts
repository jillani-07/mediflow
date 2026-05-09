import apiClient from './axios';
import { Appointment, PaginatedResponse, AppointmentStatus } from '../types';

export interface CreateAppointmentPayload {
  patientId: string;
  doctorId: string;
  scheduledAt: string;
  duration?: number;
  notes?: string;
}

export const appointmentsApi = {
  getAll: async (
    page = 1,
    limit = 10,
    status?: AppointmentStatus,
  ): Promise<PaginatedResponse<Appointment>> => {
    const { data } = await apiClient.get('/appointments', {
      params: { page, limit, status },
    });
    return data;
  },

  getOne: async (id: string): Promise<Appointment> => {
    const { data } = await apiClient.get(`/appointments/${id}`);
    return data;
  },

  create: async (payload: CreateAppointmentPayload): Promise<Appointment> => {
    const { data } = await apiClient.post('/appointments', payload);
    return data;
  },

  update: async (
    id: string,
    payload: Partial<CreateAppointmentPayload> & { status?: AppointmentStatus; diagnosis?: string },
  ): Promise<Appointment> => {
    const { data } = await apiClient.patch(`/appointments/${id}`, payload);
    return data;
  },

  cancel: async (id: string): Promise<void> => {
    await apiClient.delete(`/appointments/${id}`);
  },
};