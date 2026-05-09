import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authApi } from '../api/auth.api';
import { authStore } from '../store/auth.store';
import { User } from '../types';
import toast from 'react-hot-toast';

export function useAuth() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<User | null>(authStore.getUser());

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      const { accessToken, user } = await authApi.login({ email, password });
      authStore.setSession(accessToken, user);
      setUser(user);
      toast.success(`Welcome, ${user.fullName || user.email}`);
      navigate('/dashboard');
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    authStore.clearSession();
    setUser(null);
    navigate('/login');
  };

  return { user, loading, login, logout, isAuthenticated: authStore.isAuthenticated() };
}