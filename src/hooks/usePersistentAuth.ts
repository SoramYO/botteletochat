import { useState, useEffect, useCallback } from 'react';
import { AuthStorage } from '../storage/storage/authStorage';
import { TelegramApi } from '../services/api/telegramApi';
import { toast } from 'react-hot-toast';
import { validateToken } from '../utils/tokenValidator';

export const usePersistentAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const authStorage = AuthStorage.getInstance();
  const telegramApi = TelegramApi.getInstance();

  const initialize = useCallback(async () => {
    const token = authStorage.getToken();
    if (!token) {
      setIsLoading(false);
      return;
    }

    try {
      await telegramApi.initialize();
      setIsAuthenticated(true);
    } catch (error) {
      console.error('Authentication failed:', error);
      authStorage.clear();
      if (error instanceof Error) {
        toast.error(`Authentication failed: ${error.message}`);
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = useCallback(async (token: string) => {
    if (!validateToken(token)) {
      toast.error('Invalid token format');
      return false;
    }

    try {
      authStorage.setToken(token);
      await telegramApi.initialize();
      setIsAuthenticated(true);
      toast.success('Successfully authenticated');
      return true;
    } catch (error) {
      console.error('Login failed:', error);
      authStorage.clear();
      if (error instanceof Error) {
        toast.error(`Login failed: ${error.message}`);
      }
      return false;
    }
  }, []);

  useEffect(() => {
    initialize();
  }, [initialize]);

  return {
    isAuthenticated,
    isLoading,
    login
  };
};