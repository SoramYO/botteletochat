const AUTH_STORAGE_KEY = 'telegram_auth';

export interface AuthData {
  token: string;
  timestamp: number;
}

export class AuthStorage {
  private static instance: AuthStorage;
  private authData: AuthData | null = null;

  private constructor() {
    this.loadAuthData();
  }

  static getInstance(): AuthStorage {
    if (!this.instance) {
      this.instance = new AuthStorage();
    }
    return this.instance;
  }

  private loadAuthData(): void {
    try {
      const storedAuth = localStorage.getItem(AUTH_STORAGE_KEY);
      this.authData = storedAuth ? JSON.parse(storedAuth) : null;
    } catch (error) {
      console.error('Failed to load auth data:', error);
      this.authData = null;
    }
  }

  private saveAuthData(): void {
    try {
      if (this.authData) {
        localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(this.authData));
      } else {
        localStorage.removeItem(AUTH_STORAGE_KEY);
      }
    } catch (error) {
      console.error('Failed to save auth data:', error);
    }
  }

  setToken(token: string): void {
    this.authData = {
      token,
      timestamp: Date.now()
    };
    this.saveAuthData();
  }

  getToken(): string | null {
    return this.authData?.token || null;
  }

  isAuthenticated(): boolean {
    return !!this.authData?.token;
  }

  clear(): void {
    this.authData = null;
    this.saveAuthData();
  }
}