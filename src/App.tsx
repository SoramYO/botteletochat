import React from 'react';
import { Toaster } from 'react-hot-toast';
import Login from './components/Login';
import ChatContainer from './components/ChatContainer';
import { useAuth } from './hooks/useAuth';
import { Loader } from 'lucide-react';

function App() {
  const { isAuthenticated, isLoading, telegramService, login, logout } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <Loader className="animate-spin text-blue-500" size={32} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Toaster position="top-right" />
      {isAuthenticated && telegramService ? (
        <ChatContainer 
          telegramService={telegramService}
          onLogout={logout}
        />
      ) : (
        <Login onLogin={login} isLoading={isLoading} />
      )}
    </div>
  );
}

export default App;