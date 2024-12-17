import React from 'react';
import { MessageSquare, Users } from 'lucide-react';

interface HeaderProps {
  activeChatName?: string;
  activeChatType?: 'private' | 'group' | 'supergroup';
  activeChatTitle?: string;
}

const Header: React.FC<HeaderProps> = ({ 
  activeChatName, 
  activeChatType,
  activeChatTitle 
}) => {
  return (
    <div className="p-4 border-b border-gray-200">
      <div className="flex items-center gap-2">
        {activeChatType === 'private' ? (
          <MessageSquare className="text-blue-500" size={24} />
        ) : (
          <Users className="text-green-500" size={24} />
        )}
        <h1 className="text-xl font-bold">
          {activeChatType === 'private' 
            ? (activeChatName ? `Chat with ${activeChatName}` : 'Telegram Bot Interface')
            : (activeChatTitle || 'Group Chat')}
        </h1>
      </div>
    </div>
  );
};

export default Header;