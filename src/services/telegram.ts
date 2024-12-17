import axios from 'axios';
import { Message } from '../types/message';
import { TelegramUpdate, TelegramGroup } from '../types/telegram';
import { TELEGRAM_CONFIG } from '../config/constants';

export class TelegramService {
  private token: string;
  private offset: number = 0;
  private processedUpdateIds: Set<number> = new Set();
  private joinedGroups: Set<string> = new Set();

  constructor(token: string) {
    this.token = token;
    this.initializeJoinedGroups();
  }

  private getApiUrl(method: string): string {
    return `${TELEGRAM_CONFIG.API_BASE}${this.token}/${method}`;
  }

  private async initializeJoinedGroups() {
    try {
      const groups = await this.getJoinedGroups();
      groups.forEach(group => this.joinedGroups.add(group.id.toString()));
    } catch (error) {
      console.error('Failed to initialize joined groups:', error);
    }
  }

  private transformMessage(update: TelegramUpdate): Message {
    const message = update.message;
    const isGroup = message.chat.type === 'group' || message.chat.type === 'supergroup';
    
    return {
      id: update.update_id,
      text: message.text,
      sender: message.from.first_name || 'Unknown',
      timestamp: new Date(message.date * 1000).toISOString(),
      isIncoming: true,
      chatId: message.chat.id.toString(),
      chatType: message.chat.type,
      chatTitle: message.chat.title,
      isGroupMessage: isGroup,
      groupInfo: isGroup ? {
        groupId: message.chat.id.toString(),
        groupName: message.chat.title || 'Unknown Group',
        memberName: message.from.first_name || 'Unknown'
      } : undefined
    };
  }

  async getUpdates(): Promise<Message[]> {
    try {
      const response = await axios.get<{ result: TelegramUpdate[] }>(
        this.getApiUrl('getUpdates'),
        {
          params: {
            offset: this.offset,
            timeout: TELEGRAM_CONFIG.TIMEOUT,
            allowed_updates: ['message']
          }
        }
      );

      const updates = response.data.result || [];
      
      if (updates.length > 0) {
        const maxUpdateId = Math.max(...updates.map(u => u.update_id));
        this.offset = maxUpdateId + 1;
      }

      return updates
        .filter(update => {
          if (this.processedUpdateIds.has(update.update_id)) return false;
          if (!update.message?.text) return false;
          
          const chatId = update.message.chat.id.toString();
          const isGroup = update.message.chat.type === 'group' || update.message.chat.type === 'supergroup';
          
          if (!isGroup || this.joinedGroups.has(chatId)) {
            this.processedUpdateIds.add(update.update_id);
            return true;
          }
          
          return false;
        })
        .map(update => this.transformMessage(update));
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(`Telegram API error: ${error.response?.data?.description || error.message}`);
      }
      throw error;
    }
  }

  async getJoinedGroups(): Promise<TelegramGroup[]> {
    try {
      const response = await axios.get(this.getApiUrl('getUpdates'), {
        params: {
          offset: -1,
          limit: 100
        }
      });
      
      const updates = response.data.result || [];
      const groups = new Map<number, TelegramGroup>();

      updates.forEach(update => {
        const chat = update.message?.chat;
        if (chat && (chat.type === 'group' || chat.type === 'supergroup')) {
          groups.set(chat.id, {
            id: chat.id,
            title: chat.title || 'Unknown Group',
            type: chat.type
          });
        }
      });

      return Array.from(groups.values());
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(`Failed to fetch groups: ${error.response?.data?.description || error.message}`);
      }
      throw error;
    }
  }

  async sendMessage(text: string, chatId: string, options: {
    disableNotification?: boolean;
    protectContent?: boolean;
    replyToMessageId?: number;
    parseMode?: 'HTML' | 'Markdown' | 'MarkdownV2';
  } = {}): Promise<boolean> {
    try {
      const payload = {
        chat_id: chatId,
        text: text,
        disable_notification: options.disableNotification,
        protect_content: options.protectContent,
        reply_to_message_id: options.replyToMessageId,
        parse_mode: options.parseMode
      };

      await axios.post(this.getApiUrl('sendMessage'), payload);
      return true;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(`Failed to send message: ${error.response?.data?.description || error.message}`);
      }
      throw error;
    }
  }

  async joinGroup(inviteLink: string): Promise<boolean> {
    try {
      await axios.post(this.getApiUrl('joinChat'), {
        chat_id: inviteLink
      });
      return true;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(`Failed to join group: ${error.response?.data?.description || error.message}`);
      }
      throw error;
    }
  }

  async leaveGroup(chatId: string): Promise<boolean> {
    try {
      await axios.post(this.getApiUrl('leaveChat'), {
        chat_id: chatId
      });
      this.joinedGroups.delete(chatId);
      return true;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(`Failed to leave group: ${error.response?.data?.description || error.message}`);
      }
      throw error;
    }
  }
}