// // src/contexts/AuthContext.tsx

// import React, { createContext, useContext, useState, ReactNode } from 'react';
// import { User, LoginCredentials } from '../types';
// import { apiService } from '../services/api';

// interface AuthContextType {
//   user: User | null;
//   isLoggedIn: boolean;
//   login: (credentials: LoginCredentials) => Promise<void>;
//   logout: () => void;
//   error: string;
// }

// const AuthContext = createContext<AuthContextType | undefined>(undefined);

// export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
//   const [user, setUser] = useState<User | null>(null);
//   const [error, setError] = useState('');

//   const login = async (credentials: LoginCredentials) => {
//     try {
//       setError('');
//       const response = await apiService.login(credentials);
      
//       if (response.success) {
//         setUser({
//           username: credentials.username,
//           token: response.token,
//         });
//       }
//     } catch (err) {
//       setError(err instanceof Error ? err.message : 'Invalid username or password');
//       throw err;
//     }
//   };

//   const logout = () => {
//     setUser(null);
//     apiService.clearToken();
//   };

//   return (
//     <AuthContext.Provider
//       value={{
//         user,
//         isLoggedIn: !!user,
//         login,
//         logout,
//         error,
//       }}
//     >
//       {children}
//     </AuthContext.Provider>
//   );
// };

// export const useAuth = () => {
//   const context = useContext(AuthContext);
//   if (!context) {
//     throw new Error('useAuth must be used within AuthProvider');
//   }
//   return context;
// };

// src/contexts/AuthContext.tsx - ENHANCED FOR HACKATHON
// Complete backend integration with proper auth flow

// import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
// import { User, LoginCredentials } from '../types';
// import { apiService } from '../services/api';

// interface AuthContextType {
//   user: User | null;
//   isLoggedIn: boolean;
//   isLoading: boolean;
//   login: (credentials: LoginCredentials) => Promise<void>;
//   logout: () => void;
//   error: string;
//   clearError: () => void;
// }

// const AuthContext = createContext<AuthContextType | undefined>(undefined);

// export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
//   const [user, setUser] = useState<User | null>(null);
//   const [error, setError] = useState('');
//   const [isLoading, setIsLoading] = useState(true);

//   // Check for existing token on mount
//   useEffect(() => {
//     const initAuth = async () => {
//       try {
//         apiService.loadToken();
//         const userData = await apiService.getCurrentUser();
//         setUser({
//           username: userData.email,
//           user_id: userData.user_id,
//           email: userData.email,
//           verified: userData.verified,
//         });
//       } catch (err) {
//         // No valid token, user needs to login
//         apiService.clearToken();
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     initAuth();
//   }, []);

//   const login = async (credentials: LoginCredentials) => {
//     try {
//       setError('');
//       setIsLoading(true);
      
//       const response = await apiService.login(credentials);
      
//       if (response.success) {
//         setUser({
//           username: response.email,
//           user_id: response.user_id,
//           email: response.email,
//           token: response.access_token,
//           verified: true,
//         });
//       }
//     } catch (err) {
//       const errorMessage = err instanceof Error ? err.message : 'Invalid username or password';
//       setError(errorMessage);
//       throw err;
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const logout = () => {
//     setUser(null);
//     apiService.clearToken();
//   };

//   const clearError = () => {
//     setError('');
//   };

//   return (
//     <AuthContext.Provider
//       value={{
//         user,
//         isLoggedIn: !!user,
//         isLoading,
//         login,
//         logout,
//         error,
//         clearError,
//       }}
//     >
//       {children}
//     </AuthContext.Provider>
//   );
// };

// export const useAuth = () => {
//   const context = useContext(AuthContext);
//   if (!context) {
//     throw new Error('useAuth must be used within AuthProvider');
//   }
//   return context;
// };


// src/contexts/AuthContext.tsx - FIXED 403 HANDLING

// import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
// import { User, LoginCredentials } from '../types';
// import { apiService } from '../services/api';
// import { useChat } from './ChatContext';

// interface AuthContextType {
//   user: User | null;
//   isLoggedIn: boolean;
//   isLoading: boolean;
//   login: (credentials: LoginCredentials) => Promise<void>;
//   logout: () => void;
//   error: string;
//   clearError: () => void;
// }

// const AuthContext = createContext<AuthContextType | undefined>(undefined);

// export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
//   const [user, setUser] = useState<User | null>(null);
//   const [error, setError] = useState('');
//   const [isLoading, setIsLoading] = useState(true);

//   // Check for existing token on mount
//   useEffect(() => {
//     const initAuth = async () => {
//       try {
//         apiService.loadToken();
//         const userData = await apiService.getCurrentUser();
//         setUser({
//           username: userData.email,
//           user_id: userData.user_id,
//           email: userData.email,
//           verified: userData.verified,
//         });
//       } catch (err) {
//         // No valid token or 403 error, clear and require login
//         console.log('No valid session, please login');
//         apiService.clearToken();
//         setUser(null);
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     initAuth();
//   }, []);

//   const login = async (credentials: LoginCredentials) => {
//     try {
//       setError('');
//       setIsLoading(true);
      
//       const response = await apiService.login(credentials);
      
//       if (response.success) {
//         window.localStorage.removeItem('chats'); 
//         window.localStorage.removeItem('messages'); 
//         setUser({
//           username: response.email,
//           user_id: response.user_id,
//           email: response.email,
//           token: response.access_token,
//           verified: true,
//         });
//       }
//     } catch (err) {
//       const errorMessage = err instanceof Error ? err.message : 'Invalid username or password';
//       setError(errorMessage);
//       apiService.clearToken();
//       throw err;
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const logout = () => {
//     setUser(null);
//     apiService.clearToken();
//   };

//   const clearError = () => {
//     setError('');
//   };

//   return (
//     <AuthContext.Provider
//       value={{
//         user,
//         isLoggedIn: !!user,
//         isLoading,
//         login,
//         logout,
//         error,
//         clearError,
//       }}
//     >
//       {children}
//     </AuthContext.Provider>
//   );
// };

// export const useAuth = () => {
//   const context = useContext(AuthContext);
//   if (!context) {
//     throw new Error('useAuth must be used within AuthProvider');
//   }
//   return context;
// };



// src/contexts/AuthContext.tsx

import React, { createContext, useContext, useState, useEffect } from 'react';
import { cognitoService } from '../services/CognitoService';

interface User {
  email: string;
  name?: string;
}

interface AuthContextType {
  user: User | null;
  isLoggedIn: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  error: string;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  // Check if user is already logged in on mount
  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    setIsLoading(true);
    try {
      const isAuthenticated = await cognitoService.isAuthenticated();
      if (isAuthenticated) {
        const attributes = await cognitoService.getUserAttributes();
        setUser({
          email: attributes.email,
          name: attributes.name,
        });
      }
    } catch (err) {
      console.log('No active session');
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    setError('');

    try {
      // Authenticate with Cognito
      await cognitoService.login(email, password);

      // Get user attributes
      const attributes = await cognitoService.getUserAttributes();

      // Set user state
      setUser({
        email: attributes.email,
        name: attributes.name,
      });

      console.log('✅ Login successful:', attributes.email);
    } catch (err: any) {
      console.error('❌ Login error:', err);
      
      // Handle different error types
      let errorMessage = 'Login failed. Please try again.';
      
      if (err.code === 'UserNotFoundException') {
        errorMessage = 'User not found. Please check your email.';
      } else if (err.code === 'NotAuthorizedException') {
        errorMessage = 'Incorrect email or password.';
      } else if (err.code === 'UserNotConfirmedException') {
        errorMessage = 'Please verify your email first.';
      } else if (err.message) {
        errorMessage = err.message;
      }

      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    cognitoService.logout();
    setUser(null);
    console.log('✅ Logged out');
  };

  const clearError = () => {
    setError('');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoggedIn: !!user,
        isLoading,
        login,
        logout,
        error,
        clearError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};