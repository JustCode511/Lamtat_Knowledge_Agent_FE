// src/components/Chat/MessageList.tsx

import React, { useRef, useEffect } from 'react';
import { useChat } from '../../contexts/ChatContext';
import { ChatMessage } from './ChatMessage';
import { ChatInput } from './ChatInput';

export const MessageList: React.FC = () => {
  const { currentChatId, messages } = useChat();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const currentMessages = currentChatId ? messages[currentChatId] || [] : [];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [currentMessages]);

  return (
    <>
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-3xl mx-auto p-4">
          {currentMessages.map((msg) => (
            <ChatMessage key={msg.id} message={msg} />
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>
      
      <div className="p-4 border-t border-gray-200">
        <div className="max-w-3xl mx-auto">
          <ChatInput />
        </div>
      </div>
    </>
  );
};