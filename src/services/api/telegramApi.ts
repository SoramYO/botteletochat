import axios from 'axios';
import { API_CONFIG } from './config';
import { TELEGRAM_ENDPOINTS } from './endpoints';
import { ApiErrorHandler } from './errorHandler';
import { MessageTransformer } from './messageTransformer';
import { AuthStorage } from '../storage/authStorage';
import { MessageStorage } from '../storage/messageStorage';
import { Message } from '../../types/message';
import { ApiResponse } from './types';

export class TelegramApi {
  private static instance: TelegramApi;
  private lastUpdateId: number = 0;
  private readonly authStorage: AuthStorage;
  private readonly messageStorage: MessageStorage;
  private isUpdating: boolean = false;

  private constructor() {
    this.authStorage = AuthStorage.getInstance();
    this.messageStorage = MessageStorage.getInstance();
  }

  static getInstance(): TelegramApi {
    if (!this.instance) {
      this.instance = new TelegramApi();
    }
    return this.instance;
  }

  private getApiUrl(endpoint: string): string {
    const token = this.authStorage.getToken();
    if (!token) throw new Error('No authentication token found');
    return `${API_CONFIG.baseUrl}${token}/${endpoint}`;
  }

  async initialize(): Promise<void> {
    try {
      const messages = await this.getUpdates();
      console.log('Initialized with messages:', messages.length);
    } catch (error) {
      console.error('Initialization error:', error);
      throw error;
    }
  }

  async getUpdates(): Promise<Message[]> {
    if (this.isUpdating) {
      return [];
    }

    this.isUpdating = true;

    try {
      const response = await axios.get<ApiResponse<any[]>>(
        this.getApiUrl(TELEGRAM_ENDPOINTS.getUpdates),
        {
          params: {
            offset: this.lastUpdateId + 1,
            timeout: API_CONFIG.timeout / 1000,
            allowed_updates: API_CONFIG.updateTypes
          }
        }
      );

      if (!response.data?.ok) {
        throw new Error('Invalid API response');
      }

      const updates = response.data.result;
      if (updates.length === 0) return [];

      this.lastUpdateId = Math.max(...updates.map(u => u.update_id));
      
      const messages = updates
        .filter(update => update.message?.text)
        .map(update => MessageTransformer.transform(update));

      if (messages.length > 0) {
        this.messageStorage.addMessages(messages);
      }
      
      return messages;
    } catch (error) {
      return ApiErrorHandler.handle(error);
    } finally {
      this.isUpdating = false;
    }
  }

  async sendMessage(text: string, chatId: string): Promise<void> {
    if (!text.trim()) {
      throw new Error('Message text cannot be empty');
    }

    try {
      const response = await axios.post<ApiResponse<any>>(
        this.getApiUrl(TELEGRAM_ENDPOINTS.sendMessage),
        {
          chat_id: chatId,
          text: text.trim(),
          parse_mode: 'HTML'
        }
      );

      if (!response.data?.ok) {
        throw new Error('Failed to send message');
      }

      const message: Message = {
        id: Date.now(),
        text,
        sender: 'You',
        timestamp: new Date().toISOString(),
        isIncoming: false,
        chatId
      };

      this.messageStorage.addMessage(message);
    } catch (error) {
      return ApiErrorHandler.handle(error);
    }
  }
}