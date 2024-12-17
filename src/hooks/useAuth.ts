import { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-hot-toast';
import { StorageService } from '../services/storage';
import { validateToken } from '../utils/tokenValidator';
import { TelegramService } from '../services/telegram';

export const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [telegramService, setTelegramService] = useState<TelegramService | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const initializeService = useCallback(async (token: string) => {
    try {
      const service = new TelegramService(token);
      // Verify token by attempting to get updates
      await service.getUpdates();
      setTelegramService(service);
      setIsAuthenticated(true);
      return true;
    } catch (error) {
      console.error('Failed to initialize service:', error);
      return false;
    }
  }, []);

  const login = useCallback(async (token: string) => {
    if (!validateToken(token)) {
      toast.error('Invalid token format');
      return false;
    }

    try {
      const success = await initializeService(token);
      if (success) {
        StorageService.saveToken(token);
        toast.success('Successfully authenticated');
        return true;
      } else {
        toast.error('Failed to authenticate with provided token');
        return false;
      }
    } catch (error) {
      toast.error('Authentication failed');
      return false;
    }
  }, [initializeService]);

  const logout = useCallback(() => {
    StorageService.removeToken();
    setTelegramService(null);
    setIsAuthenticated(false);
    toast.success('Logged out successfully');
  }, []);

  useEffect(() => {
    const autoLogin = async () => {
      const savedToken = StorageService.getToken();
      if (savedToken) {
        const success = await initializeService(savedToken);
        if (!success) {
          StorageService.removeToken();
        }
      }
      setIsLoading(false);
    };

    autoLogin();
  }, [initializeService]);

  return {
    isAuthenticated,
    isLoading,
    telegramService,
    login,
    logout
  };
};