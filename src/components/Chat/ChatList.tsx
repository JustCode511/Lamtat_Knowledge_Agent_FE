// src/components/Chat/ChatList.tsx

import React from 'react';
import { MessageSquare, Trash2 } from 'lucide-react';
import { useChat } from '../../contexts/ChatContext';

export const ChatList: React.FC = () => {
  const { chats, currentChatId, setCurrentChatId, deleteChat } = useChat();

  const handleDeleteChat = (chatId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    deleteChat(chatId);
  };

  return (
    <div className="flex-1 overflow-y-auto px-3 space-y-1">
      {chats.map((chat) => (
        <div
          key={chat.id}
          onClick={() => setCurrentChatId(chat.id)}
          className={`flex items-center justify-between p-3 rounded-lg cursor-pointer group ${
            currentChatId === chat.id ? 'bg-gray-800' : 'hover:bg-gray-800'
          }`}
        >
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <MessageSquare size={16} className="flex-shrink-0" />
            <span className="text-sm truncate">{chat.title}</span>
          </div>
          <button
            onClick={(e) => handleDeleteChat(chat.id, e)}
            className="opacity-0 group-hover:opacity-100 p-1 hover:bg-gray-700 rounded transition-opacity"
          >
            <Trash2 size={14} />
          </button>
        </div>
      ))}
    </div>
  );
};