import React from 'react';
import MessageList from './MessageList';
import MessageInput from './MessageInput';
import Header from './Header';
import ChatList from './ChatList';
import { TelegramService } from '../services/telegram';
import { useChat } from '../hooks/useChat';
import { useChats } from '../hooks/useChats';
import { useTelegramPolling } from '../hooks/useTelegramPolling';
import { LogOut } from 'lucide-react';

interface ChatContainerProps {
  telegramService: TelegramService;
  onLogout: () => void;
}

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
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <Header 
              activeChatName={activeChat?.userName}
              activeChatType={activeChat?.type}
              activeChatTitle={activeChat?.title}
            />
            <button
              onClick={onLogout}
              className="text-gray-600 hover:text-red-500 transition-colors"
              title="Logout"
            >
              <LogOut size={20} />
            </button>
          </div>
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