import React from 'react';
import { MessageCircle, Users } from 'lucide-react';
import { ChatSession } from '../types/chat';

interface ChatListProps {
  chats: Map<string, ChatSession>;
  activeChatId?: string;
  onSelectChat: (chatId: string) => void;
}

const ChatList: React.FC<ChatListProps> = ({ chats, activeChatId, onSelectChat }) => {
  return (
    <div className="w-64 border-r border-gray-200 overflow-y-auto">
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold">Chats</h2>
      </div>
      <div className="divide-y divide-gray-200">
        {Array.from(chats.values()).map((chat) => (
          <button
            key={chat.chatId}
            onClick={() => onSelectChat(chat.chatId)}
            className={`w-full p-4 text-left hover:bg-gray-50 transition-colors relative ${
              activeChatId === chat.chatId ? 'bg-blue-50' : ''
            }`}
          >
            <div className="flex items-center gap-3">
              {chat.type === 'private' ? (
                <MessageCircle className="text-blue-500" size={20} />
              ) : (
                <Users className="text-green-500" size={20} />
              )}
              <div className="flex-1 min-w-0">
                <p className="font-medium truncate">
                  {chat.type === 'private' ? chat.userName : chat.title}
                </p>
                {chat.lastMessage && (
                  <p className="text-sm text-gray-500 truncate">
                    {chat.type !== 'private' && `${chat.userName}: `}
                    {chat.lastMessage}
                  </p>
                )}
              </div>
              {chat.unreadCount > 0 && (
                <span className="absolute right-4 top-4 bg-blue-500 text-white text-xs rounded-full px-2 py-1">
                  {chat.unreadCount}
                </span>
              )}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default ChatList;