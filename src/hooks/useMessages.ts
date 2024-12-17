import { useState, useCallback } from 'react';
import { Message } from '../types/message';

export const useMessages = () => {
  const [processedIds, setProcessedIds] = useState<Set<number>>(new Set());
  const [messages, setMessages] = useState<Message[]>([]);

  const addMessages = useCallback((newMessages: Message[]) => {
    setMessages(prev => {
      const uniqueNewMessages = newMessages.filter(msg => !processedIds.has(msg.id));
      
      if (uniqueNewMessages.length === 0) return prev;
      
      setProcessedIds(prevIds => {
        const newIds = new Set(prevIds);
        uniqueNewMessages.forEach(msg => newIds.add(msg.id));
        return newIds;
      });
      
      return [...prev, ...uniqueNewMessages];
    });
  }, [processedIds]);

  const addMessage = useCallback((message: Message) => {
    if (!processedIds.has(message.id)) {
      setMessages(prev => [...prev, message]);
      setProcessedIds(prev => new Set(prev).add(message.id));
    }
  }, [processedIds]);

  return {
    messages,
    addMessage,
    addMessages,
    hasProcessedMessage: (id: number) => processedIds.has(id)
  };
};