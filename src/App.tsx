// src/App.tsx

import React from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ChatProvider, useChat } from './contexts/ChatContext';
import { LoginPage } from './components/Auth/LoginPage';
import { Sidebar } from './components/Layout/Sidebar';
import { Header } from './components/Layout/Header';
import { LandingPage } from './components/Chat/LandingPage';
import { MessageList } from './components/Chat/MessageList';

const MainContent: React.FC = () => {
  const { currentChatId, messages } = useChat();
  
  const currentMessages = currentChatId ? messages[currentChatId] || [] : [];
  const showLanding = !currentChatId || currentMessages.length === 0;

  return (
    <div className="flex-1 flex flex-col">
      <Header />
      {showLanding ? <LandingPage /> : <MessageList />}
    </div>
  );
};

const AppContent: React.FC = () => {
  const { isLoggedIn } = useAuth();

  if (!isLoggedIn) {
    return <LoginPage />;
  }

  return (
    <div className="flex h-screen bg-white text-gray-900">
      <Sidebar />
      <MainContent />
    </div>
  );
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <ChatProvider>
        <AppContent />
      </ChatProvider>
    </AuthProvider>
  );
};

export default App;