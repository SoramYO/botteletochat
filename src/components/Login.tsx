import React, { useState } from 'react';
import { KeyRound, Loader } from 'lucide-react';

interface LoginProps {
  onLogin: (token: string) => Promise<boolean>;
  isLoading?: boolean;
}

const Login: React.FC<LoginProps> = ({ onLogin, isLoading = false }) => {
  const [token, setToken] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (token.trim()) {
      setIsSubmitting(true);
      await onLogin(token);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <div className="flex items-center justify-center mb-8">
          <KeyRound size={40} className="text-blue-500" />
        </div>
        <h2 className="text-2xl font-bold text-center mb-6">
          Telegram Bot Login
        </h2>
        {isLoading ? (
          <div className="flex justify-center">
            <Loader className="animate-spin text-blue-500" size={24} />
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="token"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Bot Token
              </label>
              <input
                type="password"
                id="token"
                value={token}
                onChange={(e) => setToken(e.target.value)}
                placeholder="Enter your bot token"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                required
              />
              <p className="mt-1 text-sm text-gray-500">
                Format: 123456789:ABCdefGHIjklMNOpqrsTUVwxyz
              </p>
            </div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <Loader className="animate-spin" size={20} />
                  Connecting...
                </>
              ) : (
                'Connect to Bot'
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default Login;