import React from 'react';
import { Navigate } from 'react-router-dom';
import { authStore } from '../../store/auth.store';

interface Props { children: React.ReactNode; }

export const ProtectedRoute: React.FC<Props> = ({ children }) => {
  if (!authStore.isAuthenticated()) return <Navigate to="/login" replace />;
  return <>{children}</>;
};