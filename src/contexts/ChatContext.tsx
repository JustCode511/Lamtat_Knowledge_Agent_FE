// // src/contexts/ChatContext.tsx

// import React, { createContext, useContext, useState, ReactNode } from 'react';
// import { Chat, Message, ChatMessages } from '../types';

// interface ChatContextType {
//   chats: Chat[];
//   currentChatId: string | null;
//   messages: ChatMessages;
//   sidebarOpen: boolean;
//   createNewChat: () => void;
//   deleteChat: (chatId: string) => void;
//   setCurrentChatId: (chatId: string | null) => void;
//   addMessage: (chatId: string, message: Message) => void;
//   updateChatTitle: (chatId: string, title: string) => void;
//   toggleSidebar: () => void;
//   clearAllChats: () => void;
// }

// const ChatContext = createContext<ChatContextType | undefined>(undefined);

// export const ChatProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
//   const [chats, setChats] = useState<Chat[]>([]);
//   const [currentChatId, setCurrentChatId] = useState<string | null>(null);
//   const [messages, setMessages] = useState<ChatMessages>({});
//   const [sidebarOpen, setSidebarOpen] = useState(true);

//   const createNewChat = () => {
//     const newChatId = Date.now().toString();
//     const newChat: Chat = {
//       id: newChatId,
//       title: 'New chat',
//       timestamp: new Date(),
//     };
//     setChats([newChat, ...chats]);
//     setCurrentChatId(newChatId);
//     setMessages({ ...messages, [newChatId]: [] });
//   };

//   const deleteChat = (chatId: string) => {
//     setChats(chats.filter((chat) => chat.id !== chatId));
//     const newMessages = { ...messages };
//     delete newMessages[chatId];
//     setMessages(newMessages);
//     if (currentChatId === chatId) {
//       setCurrentChatId(null);
//     }
//   };

//   const addMessage = (chatId: string, message: Message) => {
//     setMessages((prev) => ({
//       ...prev,
//       [chatId]: [...(prev[chatId] || []), message],
//     }));
//   };

//   const updateChatTitle = (chatId: string, title: string) => {
//     setChats(
//       chats.map((chat) =>
//         chat.id === chatId
//           ? { ...chat, title: title.slice(0, 30) + (title.length > 30 ? '...' : '') }
//           : chat
//       )
//     );
//   };

//   const toggleSidebar = () => {
//     setSidebarOpen(!sidebarOpen);
//   };

//   const clearAllChats = () => {
//     setChats([]);
//     setCurrentChatId(null);
//     setMessages({});
//   };

//   return (
//     <ChatContext.Provider
//       value={{
//         chats,
//         currentChatId,
//         messages,
//         sidebarOpen,
//         createNewChat,
//         deleteChat,
//         setCurrentChatId,
//         addMessage,
//         updateChatTitle,
//         toggleSidebar,
//         clearAllChats,
//       }}
//     >
//       {children}
//     </ChatContext.Provider>
//   );
// };

// export const useChat = () => {
//   const context = useContext(ChatContext);
//   if (!context) {
//     throw new Error('useChat must be used within ChatProvider');
//   }
//   return context;
// };


// src/contexts/ChatContext.tsx - ENHANCED FOR HACKATHON
// Added streaming message support

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Chat, Message, ChatMessages } from '../types';

interface ChatContextType {
  chats: Chat[];
  currentChatId: string | null;
  messages: ChatMessages;
  sidebarOpen: boolean;
  createNewChat: () => string;
  deleteChat: (chatId: string) => void;
  setCurrentChatId: (chatId: string | null) => void;
  setChats: React.Dispatch<React.SetStateAction<Chat[]>>; // ← Add
  setMessages: React.Dispatch<React.SetStateAction<ChatMessages>>; // ← Add
  addMessage: (chatId: string, message: Message, replace?: boolean) => void;
  updateChatTitle: (chatId: string, title: string) => void;
  toggleSidebar: () => void;
  clearAllChats: () => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const ChatProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [chats, setChats] = useState<Chat[]>([]);
  const [currentChatId, setCurrentChatId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessages>({});
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // const createNewChat = () : string => {
  //   const newChatId = Date.now().toString();
  //   const newChat: Chat = {
  //     id: newChatId,
  //     title: 'New chat',
  //     timestamp: new Date(),
  //   };
  //   setChats(prevChats => [newChat, ...prevChats]);
  //   setCurrentChatId(newChatId);
  //   //setMessages({ ...messages, [newChatId]: [] });
  //   return newChatId;
  // };

  const createNewChat = (): string => {
    const newChatId = Date.now().toString();
    const newChat: Chat = {
      id: newChatId,
      title: 'New chat',
      timestamp: new Date(),
    };
    setChats(prevChats => [newChat, ...prevChats]);
    setCurrentChatId(newChatId);
    setMessages(prevMessages => ({ ...prevMessages, [newChatId]: [] })); // ← Add this back
    return newChatId;
  };

  const deleteChat = (chatId: string) => {
    setChats(chats.filter((chat) => chat.id !== chatId));
    const newMessages = { ...messages };
    delete newMessages[chatId];
    setMessages(newMessages);
    if (currentChatId === chatId) {
      setCurrentChatId(null);
    }
  };

  const addMessage = (chatId: string, message: Message, replace: boolean = false) => {
    setMessages((prev) => {
      const currentMessages = prev[chatId] || [];
      
      if (replace) {
        // Replace the last message with same ID (for streaming updates)
        const filtered = currentMessages.filter(m => m.id !== message.id);
        return {
          ...prev,
          [chatId]: [...filtered, message],
        };
      } else {
        // Add new message
        return {
          ...prev,
          [chatId]: [...currentMessages, message],
        };
      }
    });
  };

  const updateChatTitle = (chatId: string, title: string) => {
    setChats(
      chats.map((chat) =>
        chat.id === chatId
          ? { ...chat, title: title.slice(0, 30) + (title.length > 30 ? '...' : '') }
          : chat
      )
    );
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const clearAllChats = () => {
    setChats([]);
    setCurrentChatId(null);
    setMessages({});
  };

  return (
    <ChatContext.Provider
      value={{
        chats,
        currentChatId,
        messages,
        sidebarOpen,
        createNewChat,
        deleteChat,
        setCurrentChatId,
        setChats,      // ← Add
      setMessages,   // ← Add
        addMessage,
        updateChatTitle,
        toggleSidebar,
        clearAllChats,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChat must be used within ChatProvider');
  }
  return context;
};