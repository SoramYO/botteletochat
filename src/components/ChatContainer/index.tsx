import React from 'react';
import MessageList from '../MessageList';
import MessageInput from '../MessageInput';
import ChatList from '../ChatList';
import { ChatHeader } from './ChatHeader';
import { useChat } from '../../hooks/useChat';
import { useChats } from '../../hooks/useChats';
import { useTelegramPolling } from '../../hooks/useTelegramPolling';
import { ChatContainerProps } from './types';

const ChatContainer: React.FC<ChatContainerProps> = ({ 
  telegramService,
  onLogout
}) => {
  const { chats, activeChat, updateChat, selectChat } = useChats();
  const { messages, sendMessage, handleNewMessages } = useChat(telegramService, activeChat?.chatId);
  
  useTelegramPolling(telegramService, (newMessages) => {
    newMessages.forEach(updateChat);
    handleNewMessages(newMessages);
  });

  return (
    <div className="container mx-auto max-w-6xl h-screen p-4">
      <div className="bg-white rounded-lg shadow-md h-full flex">
        <ChatList
          chats={chats}
          activeChatId={activeChat?.chatId}
          onSelectChat={selectChat}
        />
        <div className="flex-1 flex flex-col">
          <ChatHeader 
            userName={activeChat?.userName}
            chatType={activeChat?.type}
            chatTitle={activeChat?.title}
            onLogout={onLogout}
          />
          <MessageList 
            messages={messages} 
            activeChatId={activeChat?.chatId}
            chatType={activeChat?.type}
          />
          <MessageInput
            onSendMessage={sendMessage}
            placeholder={
              activeChat
                ? "Type your message..."
                : "Select a chat to start messaging"
            }
            disabled={!activeChat}
          />
        </div>
      </div>
    </div>
  );
};

export default ChatContainer;