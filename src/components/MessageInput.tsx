import React, { useState } from 'react';
import { Send, Settings } from 'lucide-react';

interface MessageInputProps {
  onSendMessage: (message: string, options: {
    disableNotification?: boolean;
    protectContent?: boolean;
    parseMode?: 'HTML' | 'Markdown' | 'MarkdownV2';
  }) => void;
  placeholder?: string;
  disabled?: boolean;
}

const MessageInput: React.FC<MessageInputProps> = ({ 
  onSendMessage, 
  placeholder = "Type your message...",
  disabled = false
}) => {
  const [message, setMessage] = useState('');
  const [showOptions, setShowOptions] = useState(false);
  const [messageOptions, setMessageOptions] = useState({
    disableNotification: false,
    protectContent: false,
    parseMode: undefined as undefined | 'HTML' | 'Markdown' | 'MarkdownV2'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && !disabled) {
      onSendMessage(message, messageOptions);
      setMessage('');
    }
  };

  return (
    <div className="p-4 border-t border-gray-200">
      <form onSubmit={handleSubmit} className="space-y-2">
        <div className="flex gap-2">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder={placeholder}
            disabled={disabled}
            className="flex-1 rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
          />
          <button
            type="button"
            onClick={() => setShowOptions(!showOptions)}
            className="px-3 py-2 text-gray-600 hover:text-blue-500 transition-colors"
          >
            <Settings size={20} />
          </button>
          <button
            type="submit"
            disabled={disabled || !message.trim()}
            className="bg-blue-500 text-white rounded-lg px-4 py-2 hover:bg-blue-600 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            <Send size={20} />
          </button>
        </div>
        
        {showOptions && (
          <div className="bg-white p-4 rounded-lg border border-gray-200 space-y-3">
            <div className="flex items-center gap-3">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={messageOptions.disableNotification}
                  onChange={(e) => setMessageOptions(prev => ({
                    ...prev,
                    disableNotification: e.target.checked
                  }))}
                  className="rounded"
                />
                Silent Message
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={messageOptions.protectContent}
                  onChange={(e) => setMessageOptions(prev => ({
                    ...prev,
                    protectContent: e.target.checked
                  }))}
                  className="rounded"
                />
                Protect Content
              </label>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Parse Mode
              </label>
              <select
                value={messageOptions.parseMode || ''}
                onChange={(e) => setMessageOptions(prev => ({
                  ...prev,
                  parseMode: e.target.value as 'HTML' | 'Markdown' | 'MarkdownV2' | undefined
                }))}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="">None</option>
                <option value="HTML">HTML</option>
                <option value="Markdown">Markdown</option>
                <option value="MarkdownV2">MarkdownV2</option>
              </select>
            </div>
          </div>
        )}
      </form>
    </div>
  );
};

export default MessageInput;