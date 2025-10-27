// // src/components/Chat/ChatInput.tsx

// import React, { useState, useRef } from 'react';
// import { Send, Paperclip } from 'lucide-react';
// import { useChat } from '../../contexts/ChatContext';
// import { useAuth } from '../../contexts/AuthContext';
// import { apiService } from '../../services/api';
// import { Message } from '../../types';

// export const ChatInput: React.FC = () => {
//   const [inputValue, setInputValue] = useState('');
//   const [isLoading, setIsLoading] = useState(false);
//   const fileInputRef = useRef<HTMLInputElement>(null);

//   const { currentChatId, addMessage, updateChatTitle, messages, createNewChat } = useChat();
//   const { user } = useAuth();

//   const handleSendMessage = async () => {
//     if (!inputValue.trim() || isLoading) return;

//     let chatId = currentChatId;
    
//     // Create new chat if needed
//     if (!chatId) {
//       createNewChat();
//       chatId = Date.now().toString();
//     }

//     const userMessage: Message = {
//       id: Date.now(),
//       text: inputValue,
//       sender: 'user',
//       timestamp: new Date(),
//     };

//     addMessage(chatId, userMessage);

//     // Update chat title if it's the first message
//     const currentMessages = messages[chatId] || [];
//     if (currentMessages.length === 0) {
//       updateChatTitle(chatId, inputValue);
//     }

//     const messageText = inputValue;
//     setInputValue('');
//     setIsLoading(true);

//     try {
//       // Call API
//       const response = await apiService.sendMessage(messageText, chatId, user?.username || 'anonymous');
      
//       const aiMessage: Message = {
//         id: Date.now() + 1,
//         text: response.response,
//         sender: 'ai',
//         timestamp: new Date(),
//       };

//       addMessage(chatId, aiMessage);
//     } catch (error) {
//       const errorMessage: Message = {
//         id: Date.now() + 1,
//         text: 'Sorry, I encountered an error. Please try again.',
//         sender: 'ai',
//         timestamp: new Date(),
//       };
//       addMessage(chatId, errorMessage);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleKeyPress = (e: React.KeyboardEvent) => {
//     if (e.key === 'Enter' && !e.shiftKey) {
//       e.preventDefault();
//       handleSendMessage();
//     }
//   };

//   const handleFileUpload = () => {
//     fileInputRef.current?.click();
//   };

//   const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (!file) return;

//     try {
//       setIsLoading(true);
//       await apiService.uploadFile(file);
//       alert(`File "${file.name}" uploaded successfully!`);
//     } catch (error) {
//       alert(`Failed to upload file: ${error instanceof Error ? error.message : 'Unknown error'}`);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <div className="relative flex items-end gap-2 bg-white border border-gray-300 rounded-3xl p-2 focus-within:border-gray-400 transition-colors shadow-lg">
//       <button
//         onClick={handleFileUpload}
//         disabled={isLoading}
//         className="p-2 hover:bg-gray-100 rounded-full transition-colors flex-shrink-0 disabled:opacity-50"
//       >
//         <Paperclip size={20} />
//       </button>
//       <input
//         type="file"
//         ref={fileInputRef}
//         onChange={handleFileChange}
//         accept=".pdf,.doc,.docx"
//         className="hidden"
//       />
//       <textarea
//         value={inputValue}
//         onChange={(e) => setInputValue(e.target.value)}
//         onKeyPress={handleKeyPress}
//         placeholder="Ask anything"
//         rows={1}
//         disabled={isLoading}
//         className="flex-1 resize-none outline-none px-2 py-2 max-h-48 overflow-y-auto disabled:opacity-50"
//         style={{ minHeight: '24px' }}
//       />
//       <button
//         onClick={handleSendMessage}
//         disabled={!inputValue.trim() || isLoading}
//         className={`p-2 rounded-full transition-colors flex-shrink-0 ${
//           inputValue.trim() && !isLoading
//             ? 'bg-black text-white hover:bg-gray-800'
//             : 'bg-gray-200 text-gray-400 cursor-not-allowed'
//         }`}
//       >
//         <Send size={20} />
//       </button>
//     </div>
//   );
// };


// src/components/Chat/ChatInput.tsx - ENHANCED FOR HACKATHON
// SSE Streaming + Enhanced file upload

// import React, { useState, useRef } from 'react';
// import { Send, Paperclip, Loader2, Check, X } from 'lucide-react';
// import { useChat } from '../../contexts/ChatContext';
// import { useAuth } from '../../contexts/AuthContext';
// import { apiService } from '../../services/api';
// import { Message } from '../../types';

// export const ChatInput: React.FC = () => {
//   const [inputValue, setInputValue] = useState('');
//   const [isLoading, setIsLoading] = useState(false);
//   const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle');
//   const [uploadMessage, setUploadMessage] = useState('');
//   const fileInputRef = useRef<HTMLInputElement>(null);

//   const { currentChatId, addMessage, updateChatTitle, messages, createNewChat } = useChat();
//   const { user } = useAuth();

//   // 🎯 HACKATHON FEATURE: SSE Streaming
//   const handleSendMessage = async () => {
//     if (!inputValue.trim() || isLoading) return;

//     let chatId = currentChatId;
    
//     if (!chatId) {
//       createNewChat();
//       chatId = Date.now().toString();
//     }

//     const userMessage: Message = {
//       id: Date.now(),
//       text: inputValue,
//       sender: 'user',
//       timestamp: new Date(),
//     };

//     addMessage(chatId, userMessage);

//     const currentMessages = messages[chatId] || [];
//     if (currentMessages.length === 0) {
//       updateChatTitle(chatId, inputValue);
//     }

//     const messageText = inputValue;
//     setInputValue('');
//     setIsLoading(true);

//     try {
//       // Create streaming message
//       const aiMessageId = Date.now() + 1;
//       let fullResponse = '';
//       let sources: any[] = [];

//       const aiMessage: Message = {
//         id: aiMessageId,
//         text: '',
//         sender: 'ai',
//         timestamp: new Date(),
//         isStreaming: true,
//       };

//       addMessage(chatId, aiMessage);

//       // Stream response
//       for await (const chunk of apiService.streamMessage(messageText, chatId)) {
//         if (chunk.type === 'chunk' && chunk.content) {
//           fullResponse += chunk.content;
          
//           // Update streaming message
//           const updatedMessage: Message = {
//             id: aiMessageId,
//             text: fullResponse,
//             sender: 'ai',
//             timestamp: new Date(),
//             isStreaming: true,
//           };
          
//           // Replace the streaming message
//           addMessage(chatId, updatedMessage, true);
//         } else if (chunk.type === 'complete') {
//           sources = chunk.sources || [];
          
//           // Final message with sources
//           const finalMessage: Message = {
//             id: aiMessageId,
//             text: fullResponse,
//             sender: 'ai',
//             timestamp: new Date(),
//             sources,
//             isStreaming: false,
//           };
          
//           addMessage(chatId, finalMessage, true);
//         }
//       }

//     } catch (error) {
//       const errorMessage: Message = {
//         id: Date.now() + 1,
//         text: 'Sorry, I encountered an error. Please try again.',
//         sender: 'ai',
//         timestamp: new Date(),
//       };
//       addMessage(chatId, errorMessage);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleKeyPress = (e: React.KeyboardEvent) => {
//     if (e.key === 'Enter' && !e.shiftKey) {
//       e.preventDefault();
//       handleSendMessage();
//     }
//   };

//   const handleFileUpload = () => {
//     fileInputRef.current?.click();
//   };

//   const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (!file) return;

//     try {
//       setUploadStatus('uploading');
//       setUploadMessage(`Uploading ${file.name}...`);
      
//       const result = await apiService.uploadFile(file);
      
//       setUploadStatus('success');
//       setUploadMessage(`✅ ${file.name} uploaded successfully!`);
      
//       setTimeout(() => {
//         setUploadStatus('idle');
//         setUploadMessage('');
//       }, 3000);
      
//     } catch (error) {
//       setUploadStatus('error');
//       setUploadMessage(`❌ Upload failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
      
//       setTimeout(() => {
//         setUploadStatus('idle');
//         setUploadMessage('');
//       }, 3000);
//     }
//   };

//   return (
//     <div className="space-y-2">
//       {/* Upload Status */}
//       {uploadStatus !== 'idle' && (
//         <div className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm ${
//           uploadStatus === 'uploading' ? 'bg-blue-50 text-blue-700' :
//           uploadStatus === 'success' ? 'bg-green-50 text-green-700' :
//           'bg-red-50 text-red-700'
//         }`}>
//           {uploadStatus === 'uploading' && <Loader2 size={16} className="animate-spin" />}
//           {uploadStatus === 'success' && <Check size={16} />}
//           {uploadStatus === 'error' && <X size={16} />}
//           <span>{uploadMessage}</span>
//         </div>
//       )}

//       {/* Input Box */}
//       <div className="relative flex items-end gap-2 bg-white border border-gray-300 rounded-3xl p-2 focus-within:border-gray-400 transition-colors shadow-lg">
//         <button
//           onClick={handleFileUpload}
//           disabled={isLoading || uploadStatus === 'uploading'}
//           className="p-2 hover:bg-gray-100 rounded-full transition-colors flex-shrink-0 disabled:opacity-50"
//           title="Upload document"
//         >
//           <Paperclip size={20} />
//         </button>
        
//         <input
//           type="file"
//           ref={fileInputRef}
//           onChange={handleFileChange}
//           accept=".pdf,.doc,.docx,.txt,.md,.ppt,.pptx"
//           className="hidden"
//         />
        
//         <textarea
//           value={inputValue}
//           onChange={(e) => setInputValue(e.target.value)}
//           onKeyPress={handleKeyPress}
//           placeholder="Ask anything..."
//           rows={1}
//           disabled={isLoading}
//           className="flex-1 resize-none outline-none px-2 py-2 max-h-48 overflow-y-auto disabled:opacity-50"
//           style={{ minHeight: '24px' }}
//         />
        
//         <button
//           onClick={handleSendMessage}
//           disabled={!inputValue.trim() || isLoading}
//           className={`p-2 rounded-full transition-colors flex-shrink-0 ${
//             inputValue.trim() && !isLoading
//               ? 'bg-black text-white hover:bg-gray-800'
//               : 'bg-gray-200 text-gray-400 cursor-not-allowed'
//           }`}
//           title="Send message"
//         >
//           {isLoading ? (
//             <Loader2 size={20} className="animate-spin" />
//           ) : (
//             <Send size={20} />
//           )}
//         </button>
//       </div>
//     </div>
//   );
// };


// src/components/Chat/ChatInput.tsx - WITH SEARCH MODE

// import React, { useState, useRef } from 'react';
// import { Send, Paperclip, Loader2, Check, X, Search } from 'lucide-react';
// import { useChat } from '../../contexts/ChatContext';
// import { useAuth } from '../../contexts/AuthContext';
// import { apiService } from '../../services/api';
// import { Message } from '../../types';

// export const ChatInput: React.FC = () => {
//   const [inputValue, setInputValue] = useState('');
//   const [isLoading, setIsLoading] = useState(false);
//   const [searchMode, setSearchMode] = useState(false); // 🎯 NEW: Search mode toggle
//   const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle');
//   const [uploadMessage, setUploadMessage] = useState('');
//   const fileInputRef = useRef<HTMLInputElement>(null);

//   const { currentChatId, addMessage, updateChatTitle, messages, createNewChat } = useChat();
//   const { user } = useAuth();

//   // 🎯 NEW: Handle Search
//   const handleSearch = async () => {
//     if (!inputValue.trim() || isLoading) return;

//     let chatId = currentChatId;
    
//     if (!chatId) {
//       createNewChat();
//       chatId = Date.now().toString();
//     }

//     const userMessage: Message = {
//       id: Date.now(),
//       text: `🔍 Searching: ${inputValue}`,
//       sender: 'user',
//       timestamp: new Date(),
//     };

//     addMessage(chatId, userMessage);

//     const currentMessages = messages[chatId] || [];
//     if (currentMessages.length === 0) {
//       updateChatTitle(chatId, inputValue);
//     }

//     const searchQuery = inputValue;
//     setInputValue('');
//     setIsLoading(true);

//     try {
//       // Call search API
//       const result = await apiService.search(searchQuery, 'default', 5);
      
//       // Format response with sources
//       const aiMessage: Message = {
//         id: Date.now() + 1,
//         text: result.response,
//         sender: 'ai',
//         timestamp: new Date(),
//         sources: result.results,
//       };

//       addMessage(chatId, aiMessage);
      
//     } catch (error) {
//       const errorMessage: Message = {
//         id: Date.now() + 1,
//         text: 'Search failed. Please try again.',
//         sender: 'ai',
//         timestamp: new Date(),
//       };
//       addMessage(chatId, errorMessage);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   // Original chat with streaming
//   const handleSendMessage = async () => {
//     if (!inputValue.trim() || isLoading) return;

//     let chatId = currentChatId;
    
//     if (!chatId) {
//       createNewChat();
//       chatId = Date.now().toString();
//     }

//     const userMessage: Message = {
//       id: Date.now(),
//       text: inputValue,
//       sender: 'user',
//       timestamp: new Date(),
//     };

//     addMessage(chatId, userMessage);

//     const currentMessages = messages[chatId] || [];
//     if (currentMessages.length === 0) {
//       updateChatTitle(chatId, inputValue);
//     }

//     const messageText = inputValue;
//     setInputValue('');
//     setIsLoading(true);

//     try {
//       const aiMessageId = Date.now() + 1;
//       let fullResponse = '';
//       let sources: any[] = [];

//       const aiMessage: Message = {
//         id: aiMessageId,
//         text: '',
//         sender: 'ai',
//         timestamp: new Date(),
//         isStreaming: true,
//       };

//       addMessage(chatId, aiMessage);

//       for await (const chunk of apiService.streamMessage(messageText, chatId)) {
//         if (chunk.type === 'chunk' && chunk.content) {
//           fullResponse += chunk.content;
          
//           const updatedMessage: Message = {
//             id: aiMessageId,
//             text: fullResponse,
//             sender: 'ai',
//             timestamp: new Date(),
//             isStreaming: true,
//           };
          
//           addMessage(chatId, updatedMessage, true);
//         } else if (chunk.type === 'complete') {
//           sources = chunk.sources || [];
          
//           const finalMessage: Message = {
//             id: aiMessageId,
//             text: fullResponse,
//             sender: 'ai',
//             timestamp: new Date(),
//             sources,
//             isStreaming: false,
//           };
          
//           addMessage(chatId, finalMessage, true);
//         }
//       }

//     } catch (error) {
//       const errorMessage: Message = {
//         id: Date.now() + 1,
//         text: 'Sorry, I encountered an error. Please try again.',
//         sender: 'ai',
//         timestamp: new Date(),
//       };
//       addMessage(chatId, errorMessage);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleKeyPress = (e: React.KeyboardEvent) => {
//     if (e.key === 'Enter' && !e.shiftKey) {
//       e.preventDefault();
//       if (searchMode) {
//         handleSearch();
//       } else {
//         handleSendMessage();
//       }
//     }
//   };

//   const handleFileUpload = () => {
//     fileInputRef.current?.click();
//   };

//   const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (!file) return;

//     try {
//       setUploadStatus('uploading');
//       setUploadMessage(`Uploading ${file.name}...`);
      
//       const result = await apiService.uploadFile(file);
      
//       setUploadStatus('success');
//       setUploadMessage(`✅ ${file.name} uploaded successfully!`);
      
//       setTimeout(() => {
//         setUploadStatus('idle');
//         setUploadMessage('');
//       }, 3000);
      
//     } catch (error) {
//       setUploadStatus('error');
//       setUploadMessage(`❌ Upload failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
      
//       setTimeout(() => {
//         setUploadStatus('idle');
//         setUploadMessage('');
//       }, 3000);
//     }
//   };

//   return (
//     <div className="space-y-2">
//       {/* Upload Status */}
//       {uploadStatus !== 'idle' && (
//         <div className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm ${
//           uploadStatus === 'uploading' ? 'bg-blue-50 text-blue-700' :
//           uploadStatus === 'success' ? 'bg-green-50 text-green-700' :
//           'bg-red-50 text-red-700'
//         }`}>
//           {uploadStatus === 'uploading' && <Loader2 size={16} className="animate-spin" />}
//           {uploadStatus === 'success' && <Check size={16} />}
//           {uploadStatus === 'error' && <X size={16} />}
//           <span>{uploadMessage}</span>
//         </div>
//       )}

//       {/* 🎯 NEW: Mode Toggle */}
//       <div className="flex gap-2 px-2">
//         <button
//           onClick={() => setSearchMode(false)}
//           className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-colors ${
//             !searchMode 
//               ? 'bg-indigo-600 text-white' 
//               : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
//           }`}
//         >
//           💬 Chat (Streaming)
//         </button>
//         <button
//           onClick={() => setSearchMode(true)}
//           className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-colors ${
//             searchMode 
//               ? 'bg-indigo-600 text-white' 
//               : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
//           }`}
//         >
//           🔍 Search Documents
//         </button>
//       </div>

//       {/* Input Box */}
//       <div className="relative flex items-end gap-2 bg-white border border-gray-300 rounded-3xl p-2 focus-within:border-gray-400 transition-colors shadow-lg">
//         <button
//           onClick={handleFileUpload}
//           disabled={isLoading || uploadStatus === 'uploading'}
//           className="p-2 hover:bg-gray-100 rounded-full transition-colors flex-shrink-0 disabled:opacity-50"
//           title="Upload document"
//         >
//           <Paperclip size={20} />
//         </button>
        
//         <input
//           type="file"
//           ref={fileInputRef}
//           onChange={handleFileChange}
//           accept=".pdf,.doc,.docx,.txt,.md,.ppt,.pptx"
//           className="hidden"
//         />
        
//         <textarea
//           value={inputValue}
//           onChange={(e) => setInputValue(e.target.value)}
//           onKeyPress={handleKeyPress}
//           placeholder={searchMode ? "Search your documents..." : "Ask anything..."}
//           rows={1}
//           disabled={isLoading}
//           className="flex-1 resize-none outline-none px-2 py-2 max-h-48 overflow-y-auto disabled:opacity-50"
//           style={{ minHeight: '24px' }}
//         />
        
//         <button
//           onClick={searchMode ? handleSearch : handleSendMessage}
//           disabled={!inputValue.trim() || isLoading}
//           className={`p-2 rounded-full transition-colors flex-shrink-0 ${
//             inputValue.trim() && !isLoading
//               ? 'bg-black text-white hover:bg-gray-800'
//               : 'bg-gray-200 text-gray-400 cursor-not-allowed'
//           }`}
//           title={searchMode ? "Search" : "Send message"}
//         >
//           {isLoading ? (
//             <Loader2 size={20} className="animate-spin" />
//           ) : searchMode ? (
//             <Search size={20} />
//           ) : (
//             <Send size={20} />
//           )}
//         </button>
//       </div>

//       {/* 🎯 NEW: Mode indicator */}
//       {searchMode && (
//         <p className="text-xs text-center text-gray-500">
//           🔍 Search mode: Get instant results from your knowledge base
//         </p>
//       )}
//     </div>
//   );
// };


// src/components/Chat/ChatInput.tsx - SIMPLIFIED, INTELLIGENT AUTO-ROUTING

import React, { useState, useRef } from 'react';
import { Send, Paperclip, Loader2, Check, X } from 'lucide-react';
import { useChat } from '../../contexts/ChatContext';
import { useAuth } from '../../contexts/AuthContext';
import { apiService } from '../../services/api';
import { Message, Chat } from '../../types';

export const ChatInput: React.FC = () => {
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle');
  const [uploadMessage, setUploadMessage] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { currentChatId, addMessage, updateChatTitle, messages, createNewChat, setCurrentChatId, setChats, chats, setMessages } = useChat();
  const { user } = useAuth();

  // 🎯 Single intelligent handler - auto-routes to chat or search
//   const handleSendMessage = async () => {
//     if (!inputValue.trim() || isLoading) return;
  
// // ALWAYS create new chat if we're on landing (no currentChatId)
// let chatId = currentChatId;
// const isFirstMessage = !chatId || (messages[chatId] || []).length === 0;

// if (!chatId) {
//   const newChatId = Date.now().toString();
  
//   // Manually create the chat
//   const newChat: Chat = {
//     id: newChatId,
//     title: 'New chat',
//     timestamp: new Date(),
//   };
  
//   setChats(prevChats => [newChat, ...prevChats]); 
//   setMessages(prevMessages => ({ ...prevMessages, [newChatId]: [] })); 
//   setCurrentChatId(newChatId);
  
//   chatId = newChatId;
// }
  
//     const userMessage: Message = {
//       id: Date.now(),
//       text: inputValue,
//       sender: 'user',
//       timestamp: new Date(),
//     };
  
//     addMessage(chatId, userMessage);
  
//     // Update title only if this is first message
//     if (isFirstMessage) {
//       updateChatTitle(chatId, inputValue);
//     }
  
//     const messageText = inputValue;
//     setInputValue('');
//     setIsLoading(true);
  
//     try {
//       const aiMessageId = Date.now() + 1;
//       let fullResponse = '';
//       let sources: any[] = [];
  
//       const aiMessage: Message = {
//         id: aiMessageId,
//         text: '',
//         sender: 'ai',
//         timestamp: new Date(),
//         isStreaming: true,
//       };
  
//       addMessage(chatId, aiMessage);
  
//       for await (const chunk of apiService.streamMessage(messageText, chatId)) {
//         if (chunk.type === 'status') {
//           const statusMessage: Message = {
//             id: aiMessageId,
//             text: chunk.content || '',
//             sender: 'ai',
//             timestamp: new Date(),
//             isStreaming: true,
//           };
//           addMessage(chatId, statusMessage, true);
//         } else if (chunk.type === 'chunk' && chunk.content) {
//           fullResponse += chunk.content;
          
//           const updatedMessage: Message = {
//             id: aiMessageId,
//             text: fullResponse,
//             sender: 'ai',
//             timestamp: new Date(),
//             isStreaming: true,
//           };
          
//           addMessage(chatId, updatedMessage, true);
//         } else if (chunk.type === 'complete') {
//           sources = chunk.sources || [];
          
//           const finalMessage: Message = {
//             id: aiMessageId,
//             text: fullResponse,
//             sender: 'ai',
//             timestamp: new Date(),
//             sources,
//             isStreaming: false,
//           };
          
//           addMessage(chatId, finalMessage, true);
//         }
//       }
  
//     } catch (error) {
//       const errorMessage: Message = {
//         id: Date.now() + 1,
//         text: 'Sorry, I encountered an error. Please try again.',
//         sender: 'ai',
//         timestamp: new Date(),
//       };
//       addMessage(chatId, errorMessage);
//     } finally {
//       setIsLoading(false);
//     }
//   };

const handleSendMessage = async () => {
  if (!inputValue.trim() || isLoading) return;

  let chatId: string = currentChatId || '';
  
  // If no chat exists at all, create one with the search as title
  if (!chatId) {
    chatId = Date.now().toString();
    
    const newChat: Chat = {
      id: chatId,
      title: inputValue.slice(0, 30) + (inputValue.length > 30 ? '...' : ''),
      timestamp: new Date(),
    };
    
    setChats(prevChats => [newChat, ...prevChats]);
    setCurrentChatId(chatId);
    setMessages(prevMessages => ({ ...prevMessages, [chatId]: [] }));
  } else {
    // Chat exists - check if title is still "New chat" (untitled)
    const currentChat = chats.find(c => c.id === chatId);
    if (currentChat?.title === 'New chat') {
      // Update the title with first message
      updateChatTitle(chatId, inputValue);
    }
  }

  const userMessage: Message = {
    id: Date.now(),
    text: inputValue,
    sender: 'user',
    timestamp: new Date(),
  };

  addMessage(chatId, userMessage);

  const messageText = inputValue;
  setInputValue('');
  setIsLoading(true);

  try {
    const aiMessageId = Date.now() + 1;
    let fullResponse = '';
    let sources: any[] = [];

    const aiMessage: Message = {
      id: aiMessageId,
      text: '',
      sender: 'ai',
      timestamp: new Date(),
      isStreaming: true,
    };

    addMessage(chatId, aiMessage);

    for await (const chunk of apiService.streamMessage(messageText, chatId)) {
      if (chunk.type === 'status') {
        const statusMessage: Message = {
          id: aiMessageId,
          text: chunk.content || '',
          sender: 'ai',
          timestamp: new Date(),
          isStreaming: true,
        };
        addMessage(chatId, statusMessage, true);
      } else if (chunk.type === 'chunk' && chunk.content) {
        fullResponse += chunk.content;
        
        const updatedMessage: Message = {
          id: aiMessageId,
          text: fullResponse,
          sender: 'ai',
          timestamp: new Date(),
          isStreaming: true,
        };
        
        addMessage(chatId, updatedMessage, true);
      } else if (chunk.type === 'complete') {
        sources = chunk.sources || [];
        
        const finalMessage: Message = {
          id: aiMessageId,
          text: fullResponse,
          sender: 'ai',
          timestamp: new Date(),
          sources,
          isStreaming: false,
        };
        
        addMessage(chatId, finalMessage, true);
      }
    }

  } catch (error) {
    const errorMessage: Message = {
      id: Date.now() + 1,
      text: 'Sorry, I encountered an error. Please try again.',
      sender: 'ai',
      timestamp: new Date(),
    };
    addMessage(chatId, errorMessage);
  } finally {
    setIsLoading(false);
  }
};

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleFileUpload = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploadStatus('uploading');
      setUploadMessage(`Uploading ${file.name}...`);
      
      const result = await apiService.uploadFile(file);
      
      setUploadStatus('success');
      setUploadMessage(`✅ ${file.name} uploaded successfully!`);
      
      setTimeout(() => {
        setUploadStatus('idle');
        setUploadMessage('');
      }, 3000);
      
    } catch (error) {
      setUploadStatus('error');
      setUploadMessage(`❌ Upload failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
      
      setTimeout(() => {
        setUploadStatus('idle');
        setUploadMessage('');
      }, 3000);
    }
  };

  return (
    <div className="space-y-2">
      {/* Upload Status */}
      {uploadStatus !== 'idle' && (
        <div className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm ${
          uploadStatus === 'uploading' ? 'bg-blue-50 text-blue-700' :
          uploadStatus === 'success' ? 'bg-green-50 text-green-700' :
          'bg-red-50 text-red-700'
        }`}>
          {uploadStatus === 'uploading' && <Loader2 size={16} className="animate-spin" />}
          {uploadStatus === 'success' && <Check size={16} />}
          {uploadStatus === 'error' && <X size={16} />}
          <span>{uploadMessage}</span>
        </div>
      )}

      {/* Single Input Box - No Mode Buttons */}
      <div className="relative flex items-end gap-2 bg-white border border-gray-300 rounded-3xl p-2 focus-within:border-gray-400 transition-colors shadow-lg">
        <button
          onClick={handleFileUpload}
          disabled={isLoading || uploadStatus === 'uploading'}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors flex-shrink-0 disabled:opacity-50"
          title="Upload document"
        >
          <Paperclip size={20} />
        </button>
        
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept=".pdf,.doc,.docx,.txt,.md,.ppt,.pptx"
          className="hidden"
        />
        
        <textarea
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Ask anything..."
          rows={1}
          disabled={isLoading}
          className="flex-1 resize-none outline-none px-2 py-2 max-h-48 overflow-y-auto disabled:opacity-50"
          style={{ minHeight: '24px' }}
        />
        
        <button
          onClick={handleSendMessage}
          disabled={!inputValue.trim() || isLoading}
          className={`p-2 rounded-full transition-colors flex-shrink-0 ${
            inputValue.trim() && !isLoading
              ? 'bg-black text-white hover:bg-gray-800'
              : 'bg-gray-200 text-gray-400 cursor-not-allowed'
          }`}
          title="Send message"
        >
          {isLoading ? (
            <Loader2 size={20} className="animate-spin" />
          ) : (
            <Send size={20} />
          )}
        </button>
      </div>

      {/* Hint text */}
      <p className="text-xs text-center text-gray-500">
        🤖 I'll automatically search your documents when you ask questions
      </p>
    </div>
  );
};