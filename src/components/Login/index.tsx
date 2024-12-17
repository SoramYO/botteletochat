import React, { useState } from 'react';
import { KeyRound } from 'lucide-react';
import { LoginForm } from './LoginForm';
import { LoadingSpinner } from './LoadingSpinner';

interface LoginProps {
  onLogin: (token: string) => Promise<boolean>;
  isLoading?: boolean;
}

const Login: React.FC<LoginProps> = ({ onLogin, isLoading = false }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (token: string) => {
    setIsSubmitting(true);
    await onLogin(token);
    setIsSubmitting(false);
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
          <LoadingSpinner />
        ) : (
          <LoginForm 
            onSubmit={handleSubmit}
            isSubmitting={isSubmitting}
          />
        )}
      </div>
    </div>
  );
};

export default Login;