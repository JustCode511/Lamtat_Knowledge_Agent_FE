// // src/components/Auth/LoginPage.tsx

// import React, { useState } from 'react';
// import { useAuth } from '../../contexts/AuthContext';

// export const LoginPage: React.FC = () => {
//   const [username, setUsername] = useState('');
//   const [password, setPassword] = useState('');
//   const { login, error } = useAuth();

//   const handleLogin = async (e: React.FormEvent) => {
//     e.preventDefault();
//     try {
//       await login({ username, password });
//     } catch (err) {
//       // Error is handled in context
//     }
//   };

//   const handleKeyPress = (e: React.KeyboardEvent) => {
//     if (e.key === 'Enter') {
//       handleLogin(e);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-white flex items-center justify-center">
//       <div className="w-full max-w-md p-8">
//         <div className="text-center mb-8">
//           <h1 className="text-2xl font-bold mb-2">Welcome to LamTat - Knowledge Agent</h1>
//         </div>

//         <div className="space-y-4">
//           <div>
//             <input
//               type="text"
//               placeholder="Username"
//               value={username}
//               onChange={(e) => setUsername(e.target.value)}
//               onKeyPress={handleKeyPress}
//               className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
//             />
//           </div>

//           <div>
//             <input
//               type="password"
//               placeholder="Password"
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//               onKeyPress={handleKeyPress}
//               className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
//             />
//           </div>

//           {error && <div className="text-red-500 text-sm text-center">{error}</div>}

//           <button
//             onClick={handleLogin}
//             className="w-full bg-green-600 text-white py-3 rounded-lg font-medium hover:bg-green-700 transition-colors"
//           >
//             Continue
//           </button>
//         </div>

//         <div className="mt-6 text-center text-sm text-gray-500">
//           Demo credentials: username: <span className="font-mono font-semibold">admin</span> /
//           password: <span className="font-mono font-semibold">admin</span>
//         </div>
//       </div>
//     </div>
//   );
// };


// src/components/Auth/LoginPage.tsx - ENHANCED FOR HACKATHON

import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Loader2 } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const [username, setUsername] = useState('john@company.com');
  const [password, setPassword] = useState('SecurePass123!');
  const { login, error, isLoading } = useAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login({ username, password });
    } catch (err) {
      // Error is handled in context
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleLogin(e);
    }
  };

  const fillDemoCredentials = (email: string, pass: string) => {
    setUsername(email);
    setPassword(pass);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-block p-3 bg-white rounded-full shadow-lg mb-4">
            <svg className="w-12 h-12 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            🏆 LamTat Knowledge Agent
          </h1>
          <p className="text-gray-600">
            Intelligent document management & search
          </p>
        </div>

        {/* Login Form */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <input
                type="email"
                placeholder="john@company.com"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                onKeyPress={handleKeyPress}
                disabled={isLoading}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <input
                type="password"
                placeholder="SecurePass123!"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyPress={handleKeyPress}
                disabled={isLoading}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
              />
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-indigo-600 text-white py-3 rounded-lg font-medium hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 size={20} className="animate-spin" />
                  Logging in...
                </>
              ) : (
                'Continue'
              )}
            </button>
          </form>

          {/* Demo Credentials */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <p className="text-xs text-gray-500 text-center mb-3">
              Demo Credentials (Click to fill)
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => fillDemoCredentials('john@company.com', 'SecurePass123!')}
                disabled={isLoading}
                className="flex-1 text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 px-3 rounded-lg transition-colors disabled:opacity-50"
              >
                <div className="font-semibold">John Doe</div>
                <div className="text-gray-500">john@company.com</div>
              </button>
              <button
                onClick={() => fillDemoCredentials('jane@company.com', 'SecurePass123!')}
                disabled={isLoading}
                className="flex-1 text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 px-3 rounded-lg transition-colors disabled:opacity-50"
              >
                <div className="font-semibold">Jane Smith</div>
                <div className="text-gray-500">jane@company.com</div>
              </button>
            </div>
          </div>

          {/* Features */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <p className="text-xs font-semibold text-gray-700 mb-2">✨ Features</p>
            <ul className="text-xs text-gray-600 space-y-1">
              <li>✅ Multi-format document upload</li>
              <li>✅ AI-powered semantic search</li>
              <li>✅ Real-time streaming responses</li>
              <li>✅ Source citations & references</li>
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-6 text-xs text-gray-500">
          Powered by 3-Agent Architecture | Mock Mode Enabled
        </div>
      </div>
    </div>
  );
};