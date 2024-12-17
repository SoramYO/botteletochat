import { TelegramApi } from './telegramApi';
import { API_CONFIG } from './config';

export class PollingManager {
  private static instance: PollingManager;
  private pollingInterval: NodeJS.Timeout | null = null;
  private isPolling: boolean = false;

  private constructor() {}

  static getInstance(): PollingManager {
    if (!this.instance) {
      this.instance = new PollingManager();
    }
    return this.instance;
  }

  startPolling(onUpdate: () => void): void {
    if (this.isPolling) return;
    
    this.isPolling = true;
    this.pollingInterval = setInterval(async () => {
      if (!this.isPolling) return;
      
      try {
        await TelegramApi.getInstance().getUpdates();
        onUpdate();
      } catch (error) {
        console.error('Polling error:', error);
        // Don't stop polling on error, just skip this iteration
      }
    }, API_CONFIG.pollingInterval);
  }

  stopPolling(): void {
    this.isPolling = false;
    if (this.pollingInterval) {
      clearInterval(this.pollingInterval);
      this.pollingInterval = null;
    }
  }
}