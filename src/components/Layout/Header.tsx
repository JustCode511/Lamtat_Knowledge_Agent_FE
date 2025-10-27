// src/components/Layout/Header.tsx

import React from 'react';
import { Menu } from 'lucide-react';
import { useChat } from '../../contexts/ChatContext';

export const Header: React.FC = () => {
  const { toggleSidebar } = useChat();

  return (
    <div className="border-b border-gray-200 p-3 flex items-center">
      <button
        onClick={toggleSidebar}
        className="p-2 hover:bg-gray-100 rounded-lg"
      >
        <Menu size={20} />
      </button>
      <div className="ml-3 font-medium">LamTat - Knowledge Agent</div>
    </div>
  );
};