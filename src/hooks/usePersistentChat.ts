import { useState, useEffect, useCallback } from 'react';
import { Message } from '../types/message';
import { TelegramApi } from '../services/api/telegramApi';
import { MessageStorage } from '../services/storage/messageStorage';
import { usePolling } from './usePolling';
import { toast } from 'react-hot-toast';

export const usePersistentChat = (chatId?: string) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const messageStorage = MessageStorage.getInstance();
  const telegramApi = TelegramApi.getInstance();

  const loadMessages = useCallback(() => {
    if (!chatId) return;
    
    const storedMessages = messageStorage.getMessagesByChat(chatId, page);
    setMessages(prev => {
      const newMessages = [...prev];
      storedMessages.forEach(msg => {
        if (!newMessages.some(m => m.id === msg.id)) {
          newMessages.push(msg);
        }
      });
      return newMessages;
    });
    setHasMore(storedMessages.length === 50);
  }, [chatId, page]);

  const sendMessage = useCallback(async (text: string) => {
    if (!chatId) {
      toast.error('No chat selected');
      return;
    }

    try {
      await telegramApi.sendMessage(text, chatId);
      loadMessages();
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      }
    }
  }, [chatId, telegramApi, loadMessages]);

  const loadMore = useCallback(() => {
    if (!isLoading && hasMore) {
      setPage(p => p + 1);
    }
  }, [isLoading, hasMore]);

  // Use polling hook
  usePolling(loadMessages, !!chatId);

  // Initial load
  useEffect(() => {
    setIsLoading(true);
    loadMessages();
    setIsLoading(false);
  }, [loadMessages]);

  return {
    messages,
    sendMessage,
    loadMore,
    hasMore,
    isLoading
  };
};