import { useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { api } from '../services/api';

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
}

const USER_KEY = 'auth_user';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      await api.init();
      const stored = await AsyncStorage.getItem(USER_KEY);
      if (stored) {
        setUser(JSON.parse(stored));
      }
      setLoading(false);
    })();
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const result = await api.login(email, password);
    if (result.token) {
      await api.setToken(result.token);
    }
    if (result.user) {
      setUser(result.user);
      await AsyncStorage.setItem(USER_KEY, JSON.stringify(result.user));
    }
    return result;
  }, []);

  const register = useCallback(async (data: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    phone?: string;
  }) => {
    const result = await api.register(data);
    return result;
  }, []);

  const logout = useCallback(async () => {
    await api.clearToken();
    await AsyncStorage.removeItem(USER_KEY);
    setUser(null);
  }, []);

  return { user, loading, login, register, logout, isAuthenticated: !!user };
}
