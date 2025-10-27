// // src/components/Chat/ChatMessage.tsx

// import React from 'react';
// import { Message } from '../../types';

// interface ChatMessageProps {
//   message: Message;
// }

// export const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
//   return (
//     <div
//       className={`mb-6 flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
//     >
//       <div
//         className={`max-w-[80%] p-4 rounded-2xl ${
//           message.sender === 'user'
//             ? 'bg-gray-100'
//             : 'bg-white border border-gray-200'
//         }`}
//       >
//         <div className="text-sm whitespace-pre-wrap">{message.text}</div>
//       </div>
//     </div>
//   );
// };

// src/components/Chat/ChatMessage.tsx - ENHANCED FOR HACKATHON
// Added source citations display

import React from 'react';
import { FileText } from 'lucide-react';
import { Message } from '../../types';

interface ChatMessageProps {
  message: Message;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  return (
    <div className={`mb-6 flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
      <div className={`max-w-[80%] ${message.sender === 'user' ? '' : 'space-y-3'}`}>
        {/* Message Content */}
        <div
          className={`p-4 rounded-2xl ${
            message.sender === 'user'
              ? 'bg-gray-100'
              : 'bg-white border border-gray-200'
          }`}
        >
          <div className="text-sm whitespace-pre-wrap">
            {message.text}
            {message.isStreaming && (
              <span className="inline-block w-2 h-4 ml-1 bg-gray-400 animate-pulse"></span>
            )}
          </div>
        </div>

        {/* 🎯 HACKATHON FEATURE: Source Citations */}
        {message.sources && message.sources.length > 0 && !message.isStreaming && (
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-3">
            <div className="flex items-center gap-2 mb-2">
              <FileText size={16} className="text-blue-600" />
              <span className="text-xs font-semibold text-blue-700">
                Sources ({message.sources.length})
              </span>
            </div>
            <div className="space-y-2">
              {message.sources.map((source, idx) => (
                <div
                  key={idx}
                  className="bg-white rounded-lg p-2 text-xs border border-blue-100 hover:border-blue-300 transition-colors"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                      <div className="font-medium text-blue-700 mb-1">
                        {source.file_name}
                      </div>
                      <div className="text-gray-600 line-clamp-2">
                        {source.text.slice(0, 100)}...
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <div className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                        {(source.score * 100).toFixed(0)}%
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};