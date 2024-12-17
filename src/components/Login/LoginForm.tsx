import React, { useState } from 'react';
import { Loader } from 'lucide-react';
import { LoginFormProps } from './types';

export const LoginForm: React.FC<LoginFormProps> = ({ onSubmit, isSubmitting }) => {
  const [token, setToken] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (token.trim()) {
      await onSubmit(token);
    }
  };

  return (
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
  );
};