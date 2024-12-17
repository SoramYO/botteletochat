import { Message } from '../types/message';

export const generateUniqueMessageId = (message: Message): string => {
  // Combine multiple unique identifiers to ensure uniqueness
  return `${message.id}-${message.timestamp}-${message.isIncoming ? 'in' : 'out'}`;
};

export const formatTimestamp = (timestamp: string): string => {
  return new Date(timestamp).toLocaleTimeString();
};