export interface ChatSession {
  chatId: string;
  userName: string;
  lastMessage?: string;
  unreadCount: number;
  type: 'private' | 'group' | 'supergroup';
  title?: string;
}

export interface ActiveChat {
  chatId: string;
  userName: string;
  type: 'private' | 'group' | 'supergroup';
  title?: string;
}