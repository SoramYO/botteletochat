import { TelegramService } from '../../services/telegram';

export interface ChatContainerProps {
  telegramService: TelegramService;
  onLogout: () => void;
}

export interface ChatHeaderProps {
  userName?: string;
  chatType?: 'private' | 'group' | 'supergroup';
  chatTitle?: string;
  onLogout: () => void;
}