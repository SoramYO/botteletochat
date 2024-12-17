import React from 'react';
import { Message as MessageType } from '../types/message';
import { MessageCircle } from 'lucide-react';
import Message from './Message';
import { generateUniqueMessageId } from '../utils/messageUtils';

interface MessageListProps {
  messages: MessageType[];
  activeChatId?: string;
  chatType?: string;
}

const MessageList: React.FC<MessageListProps> = ({ messages, activeChatId }) => {
  if (!activeChatId) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-50">
        <div className="text-center text-gray-500">
          <MessageCircle className="mx-auto mb-4" size={48} />
          <p className="text-lg">Select a chat to start messaging</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4">
      {messages.length === 0 ? (
        <div className="text-center text-gray-500 mt-8">
          <p>No messages yet</p>
        </div>
      ) : (
        messages.map((message) => (
          <Message 
            key={generateUniqueMessageId(message)} 
            message={message} 
          />
        ))
      )}
    </div>
  );
};

export default MessageList;