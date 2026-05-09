export enum UserRole {
  ADMIN = 'admin',
  DOCTOR = 'doctor',
  RECEPTIONIST = 'receptionist',
}

export interface User {
  id: string;
  email: string;
  fullName: string;
  role: UserRole;
}

export interface AuthTokens {
  accessToken: string;
  user: User;
}

export enum Gender {
  MALE = 'male',
  FEMALE = 'female',
  OTHER = 'other',
}

export enum BloodGroup {
  A_POS = 'A+', A_NEG = 'A-',
  B_POS = 'B+', B_NEG = 'B-',
  O_POS = 'O+', O_NEG = 'O-',
  AB_POS = 'AB+', AB_NEG = 'AB-',
}

export interface Patient {
  id: string;
  fullName: string;
  email: string;
  phone?: string;
  dateOfBirth?: string;
  gender?: Gender;
  bloodGroup?: BloodGroup;
  address?: string;
  medicalHistory?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export enum AppointmentStatus {
  SCHEDULED  = 'scheduled',
  CONFIRMED  = 'confirmed',
  COMPLETED  = 'completed',
  CANCELLED  = 'cancelled',
  NO_SHOW    = 'no_show',
}

export interface Appointment {
  id: string;
  patient: Patient;
  doctor: User;
  scheduledAt: string;
  duration: number;
  status: AppointmentStatus;
  notes?: string;
  diagnosis?: string;
  createdAt: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
}