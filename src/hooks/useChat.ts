import { useCallback, useMemo } from 'react';
import { Message } from '../types/message';
import { TelegramService } from '../services/telegram';
import { toast } from 'react-hot-toast';
import { useMessages } from './useMessages';

export const useChat = (telegramService: TelegramService | null, activeChatId?: string) => {
  const { messages: allMessages, addMessage, addMessages } = useMessages();

  const messages = useMemo(() => {
    if (!activeChatId) return [];
    return allMessages.filter(msg => msg.chatId === activeChatId);
  }, [allMessages, activeChatId]);

  const handleNewMessages = useCallback((newMessages: Message[]) => {
    addMessages(newMessages);
  }, [addMessages]);

  const sendMessage = useCallback(async (text: string, options = {}) => {
    if (!telegramService) {
      toast.error('Bot service not initialized');
      return;
    }

    if (!activeChatId) {
      toast.error('Please select a chat first');
      return;
    }

    const newMessage: Message = {
      id: Date.now(),
      text,
      sender: 'You',
      timestamp: new Date().toISOString(),
      isIncoming: false,
      chatId: activeChatId
    };

    try {
      await telegramService.sendMessage(text, activeChatId, options);
      addMessage(newMessage);
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      }
    }
  }, [telegramService, activeChatId, addMessage]);

  return {
    messages,
    sendMessage,
    handleNewMessages
  };
};