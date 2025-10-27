// src/components/Layout/Sidebar.tsx

import React from 'react';
import { PenSquare, User, LogOut } from 'lucide-react';
import { useChat } from '../../contexts/ChatContext';
import { useAuth } from '../../contexts/AuthContext';
import { ChatList } from '../Chat/ChatList';

export const Sidebar: React.FC = () => {
  const { sidebarOpen, createNewChat } = useChat();
  const { user, logout } = useAuth();
  const { clearAllChats } = useChat();

  const handleLogout = () => {
    clearAllChats(); 
    logout();
  };

  return (
    <div
      className={`${
        sidebarOpen ? 'w-64' : 'w-0'
      } bg-gray-950 text-white transition-all duration-300 flex flex-col overflow-hidden`}
    >
      <div className="p-3 flex items-center justify-between">
        <button
          onClick={createNewChat}
          className="flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-700 hover:bg-gray-800 transition-colors flex-1"
        >
          <PenSquare size={16} />
          <span className="text-sm">New chat</span>
        </button>
      </div>

      <ChatList />

      <div className="border-t border-gray-700 p-3">
        <div className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-800 cursor-pointer">
          <div className="flex items-center gap-2">
            <User size={16} />
            <span className="text-sm">{user?.username}</span>
          </div>
          <button onClick={handleLogout} className="p-1 hover:bg-gray-700 rounded">
            <LogOut size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};