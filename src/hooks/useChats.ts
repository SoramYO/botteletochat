import { useState, useCallback } from 'react';
import { ChatSession, ActiveChat } from '../types/chat';
import { Message } from '../types/message';

export const useChats = () => {
  const [chats, setChats] = useState<Map<string, ChatSession>>(new Map());
  const [activeChat, setActiveChat] = useState<ActiveChat | null>(null);

  const updateChat = useCallback((message: Message) => {
    setChats(prev => {
      const newChats = new Map(prev);
      const existingChat = newChats.get(message.chatId);
      
      newChats.set(message.chatId, {
        chatId: message.chatId,
        userName: message.sender,
        lastMessage: message.text,
        unreadCount: existingChat ? 
          (message.isIncoming ? existingChat.unreadCount + 1 : 0) : 
          (message.isIncoming ? 1 : 0),
        type: (message.chatType as 'private' | 'group' | 'supergroup') || 'private',
        title: message.chatTitle
      });
      
      return newChats;
    });

    // Set as active chat if none is selected
    if (!activeChat) {
      setActiveChat({
        chatId: message.chatId,
        userName: message.sender,
        type: (message.chatType as 'private' | 'group' | 'supergroup') || 'private',
        title: message.chatTitle
      });
    }
  }, [activeChat]);

  const selectChat = useCallback((chatId: string) => {
    const chat = chats.get(chatId);
    if (chat) {
      setActiveChat({
        chatId: chat.chatId,
        userName: chat.userName,
        type: chat.type,
        title: chat.title
      });
      
      // Clear unread count when selecting chat
      setChats(prev => {
        const newChats = new Map(prev);
        newChats.set(chatId, {
          ...chat,
          unreadCount: 0
        });
        return newChats;
      });
    }
  }, [chats]);

  return {
    chats,
    activeChat,
    updateChat,
    selectChat
  };
};