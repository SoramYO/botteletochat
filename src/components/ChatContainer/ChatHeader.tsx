import React from 'react';
import { LogOut } from 'lucide-react';
import { Header } from '../Header';
import { ChatHeaderProps } from './types';

export const ChatHeader: React.FC<ChatHeaderProps> = ({
  userName,
  chatType,
  chatTitle,
  onLogout
}) => (
  <div className="flex items-center justify-between p-4 border-b border-gray-200">
    <Header 
      activeChatName={userName}
      activeChatType={chatType}
      activeChatTitle={chatTitle}
    />
    <button
      onClick={onLogout}
      className="text-gray-600 hover:text-red-500 transition-colors"
      title="Logout"
    >
      <LogOut size={20} />
    </button>
  </div>
);