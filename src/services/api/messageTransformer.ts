import { Message } from '../../types/message';
import { TelegramUpdate } from '../../types/telegram';

export class MessageTransformer {
  static transform(update: TelegramUpdate): Message {
    const { message } = update;
    
    if (!this.isValidMessage(message)) {
      throw new Error('Invalid message format');
    }

    return {
      id: update.update_id,
      text: message.text,
      sender: message.from.first_name || 'Unknown',
      timestamp: this.formatTimestamp(message.date),
      isIncoming: true,
      chatId: message.chat.id.toString(),
      chatType: message.chat.type,
      chatTitle: message.chat.title,
      isGroupMessage: this.isGroupMessage(message.chat.type),
      groupInfo: this.getGroupInfo(message)
    };
  }

  private static isValidMessage(message?: any): boolean {
    return message?.text && message?.from && message?.chat;
  }

  private static formatTimestamp(timestamp: number): string {
    return new Date(timestamp * 1000).toISOString();
  }

  private static isGroupMessage(type: string): boolean {
    return type === 'group' || type === 'supergroup';
  }

  private static getGroupInfo(message: any) {
    if (!this.isGroupMessage(message.chat.type)) {
      return undefined;
    }

    return {
      groupId: message.chat.id.toString(),
      groupName: message.chat.title || 'Unknown Group',
      memberName: message.from.first_name || 'Unknown'
    };
  }
}