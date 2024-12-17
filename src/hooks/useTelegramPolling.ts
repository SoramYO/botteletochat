import { useEffect, useCallback } from 'react';
import { Message } from '../types/message';
import { TelegramService } from '../services/telegram';
import { toast } from 'react-hot-toast';
import { TELEGRAM_CONFIG } from '../config/constants';

export const useTelegramPolling = (
  telegramService: TelegramService | null,
  onNewMessages: (messages: Message[]) => void
) => {
  const fetchMessages = useCallback(async () => {
    if (!telegramService) return;

    try {
      const newMessages = await telegramService.getUpdates();
      if (newMessages.length > 0) {
        onNewMessages(newMessages);
      }
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      }
    }
  }, [telegramService, onNewMessages]);

  useEffect(() => {
    if (telegramService) {
      fetchMessages();
      const interval = setInterval(fetchMessages, TELEGRAM_CONFIG.POLLING_INTERVAL);
      return () => clearInterval(interval);
    }
  }, [telegramService, fetchMessages]);
};