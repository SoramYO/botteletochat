export const API_CONFIG = {
  baseUrl: 'https://api.telegram.org/bot',
  timeout: 30000,
  pollingInterval: 3000,
  updateTypes: ['message']
} as const;