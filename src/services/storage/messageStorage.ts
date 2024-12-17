import { Message } from '../../types/message';

const MESSAGE_STORAGE_KEY = 'chat_messages';
const PAGE_SIZE = 50;

export class MessageStorage {
  private static instance: MessageStorage;
  private messages: Message[] = [];

  private constructor() {
    this.loadMessages();
  }

  static getInstance(): MessageStorage {
    if (!this.instance) {
      this.instance = new MessageStorage();
    }
    return this.instance;
  }

  private loadMessages(): void {
    try {
      const storedMessages = localStorage.getItem(MESSAGE_STORAGE_KEY);
      this.messages = storedMessages ? JSON.parse(storedMessages) : [];
    } catch (error) {
      console.error('Failed to load messages:', error);
      this.messages = [];
    }
  }

  private saveMessages(): void {
    try {
      localStorage.setItem(MESSAGE_STORAGE_KEY, JSON.stringify(this.messages));
    } catch (error) {
      console.error('Failed to save messages:', error);
    }
  }

  addMessage(message: Message): void {
    this.messages.push(message);
    this.saveMessages();
  }

  addMessages(newMessages: Message[]): void {
    this.messages.push(...newMessages);
    this.saveMessages();
  }

  getMessages(page: number = 1): Message[] {
    const start = (page - 1) * PAGE_SIZE;
    return this.messages.slice(start, start + PAGE_SIZE);
  }

  getMessagesByChat(chatId: string, page: number = 1): Message[] {
    const chatMessages = this.messages.filter(msg => msg.chatId === chatId);
    const start = (page - 1) * PAGE_SIZE;
    return chatMessages.slice(start, start + PAGE_SIZE);
  }

  clear(): void {
    this.messages = [];
    this.saveMessages();
  }
}