// src/components/Chat/LandingPage.tsx

import React, { useState, useEffect } from 'react';
import { ChatInput } from './ChatInput';
import { useChat } from '../../contexts/ChatContext';

const dynamicPrompts = [
  "What's on your mind today?",
  "What's your agenda today?",
  "How can I help you today?",
  "What are you working on?",
  "Any questions for me?",
  "What would you like to explore?",
];

export const LandingPage: React.FC = () => {
  const [currentPrompt, setCurrentPrompt] = useState('');
  const { setCurrentChatId } = useChat();

  useEffect(() => {
    const randomPrompt = dynamicPrompts[Math.floor(Math.random() * dynamicPrompts.length)];
    setCurrentPrompt(randomPrompt);
    //setCurrentChatId(null);
  }, []);

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-8">
      <div className="text-center max-w-3xl w-full space-y-8">
        <h1 className="text-4xl font-semibold transition-opacity duration-500">
          {currentPrompt}
        </h1>
        
        <ChatInput />
      </div>
    </div>
  );
};