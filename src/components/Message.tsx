import React from 'react';
import { MessageCircle, Users } from 'lucide-react';
import { Message as MessageType } from '../types/message';
import { formatTimestamp } from '../utils/messageUtils';

interface MessageProps {
  message: MessageType;
}

const Message: React.FC<MessageProps> = ({ message }) => {
  const isGroup = message.isGroupMessage && message.groupInfo;
  
  return (
    <div className={`flex ${message.isIncoming ? 'justify-start' : 'justify-end'}`}>
      <div
        className={`max-w-[70%] rounded-lg p-3 ${
          message.isIncoming ? 'bg-gray-100 text-gray-900' : 'bg-blue-500 text-white'
        }`}
      >
        <div className="flex items-center gap-2 mb-1">
          {isGroup ? (
            <Users size={16} className="text-green-500" />
          ) : (
            <MessageCircle size={16} />
          )}
          <span className="font-semibold">
            {isGroup ? message.groupInfo.memberName : message.sender}
          </span>
          {isGroup && (
            <span className="text-xs text-gray-500">
              in {message.groupInfo.groupName}
            </span>
          )}
        </div>
        <p className="break-words">{message.text}</p>
        <span className="text-xs opacity-75 block text-right">
          {formatTimestamp(message.timestamp)}
        </span>
      </div>
    </div>
  );
};

export default Message;