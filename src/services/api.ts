// // // src/services/api.ts

// // import { LoginCredentials, ChatResponse } from '../types';

// // const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

// // class ApiService {
// //   private token: string | null = null;

// //   setToken(token: string) {
// //     this.token = token;
// //   }

// //   clearToken() {
// //     this.token = null;
// //   }

// //   private async request<T>(
// //     endpoint: string,
// //     options: RequestInit = {}
// //   ): Promise<T> {
// //     const headers: Record<string, string> = {
// //       'Content-Type': 'application/json',
// //       ...(options.headers as Record<string, string>),
// //     };

// //     if (this.token) {
// //       headers['Authorization'] = `Bearer ${this.token}`;
// //     }

// //     const response = await fetch(`${API_BASE_URL}${endpoint}`, {
// //       ...options,
// //       headers,
// //     });

// //     if (!response.ok) {
// //       const error = await response.json().catch(() => ({
// //         message: 'An error occurred',
// //       }));
// //       throw new Error(error.message || 'Request failed');
// //     }

// //     return response.json();
// //   }

// //   async login(credentials: LoginCredentials) {
// //     const response = await this.request<{ success: boolean; token: string; message: string }>(
// //       '/api/auth/login',
// //       {
// //         method: 'POST',
// //         body: JSON.stringify(credentials),
// //       }
// //     );

// //     if (response.success && response.token) {
// //       this.setToken(response.token);
// //     }

// //     return response;
// //   }

// //   async sendMessage(message: string, chatId: string | null, userId: string) {
// //     return this.request<ChatResponse>('/api/chat', {
// //       method: 'POST',
// //       body: JSON.stringify({
// //         message,
// //         chat_id: chatId,
// //         user_id: userId,
// //       }),
// //     });
// //   }

// //   async uploadFile(file: File) {
// //     const formData = new FormData();
// //     formData.append('file', file);

// //     const headers: Record<string, string> = {};
// //     if (this.token) {
// //       headers['Authorization'] = `Bearer ${this.token}`;
// //     }

// //     const response = await fetch(`${API_BASE_URL}/api/ingest/file`, {
// //       method: 'POST',
// //       headers,
// //       body: formData,
// //     });

// //     if (!response.ok) {
// //       throw new Error('File upload failed');
// //     }

// //     return response.json();
// //   }

// //   async getChatHistory(chatId: string, limit: number = 50) {
// //     return this.request(`/api/chat/history/${chatId}?limit=${limit}`);
// //   }

// //   async searchDocuments(query: string, topK: number = 5) {
// //     return this.request(`/api/documents/search?query=${encodeURIComponent(query)}&top_k=${topK}`);
// //   }
// // }

// // export const apiService = new ApiService();

// // src/services/api.ts

// import { LoginCredentials, ChatResponse } from '../types';

// const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';
// const USE_MOCK = process.env.REACT_APP_USE_MOCK === 'true' || true; // Set to true for mock mode

// // Mock delay to simulate network latency
// const mockDelay = (ms: number = 1000) => new Promise(resolve => setTimeout(resolve, ms));

// class ApiService {
//   private token: string | null = null;
//   private mockDocuments: any[] = [
//     {
//       id: '1',
//       content: 'Machine learning is a subset of artificial intelligence that focuses on teaching computers to learn from data...',
//       source: 'mock_data',
//     },
//     {
//       id: '2',
//       content: 'React is a JavaScript library for building user interfaces. It was developed by Facebook...',
//       source: 'mock_data',
//     },
//   ];

//   setToken(token: string) {
//     this.token = token;
//   }

//   clearToken() {
//     this.token = null;
//   }

//   private async request<T>(
//     endpoint: string,
//     options: RequestInit = {}
//   ): Promise<T> {
//     const headers: Record<string, string> = {
//       'Content-Type': 'application/json',
//       ...(options.headers as Record<string, string>),
//     };

//     if (this.token) {
//       headers['Authorization'] = `Bearer ${this.token}`;
//     }

//     const response = await fetch(`${API_BASE_URL}${endpoint}`, {
//       ...options,
//       headers,
//     });

//     if (!response.ok) {
//       const error = await response.json().catch(() => ({
//         message: 'An error occurred',
//       }));
//       throw new Error(error.message || 'Request failed');
//     }

//     return response.json();
//   }

//   async login(credentials: LoginCredentials) {
//     if (USE_MOCK) {
//       await mockDelay(500);
      
//       // Mock authentication - accept admin/admin
//       if (credentials.username === 'admin' && credentials.password === 'admin') {
//         const mockToken = 'mock-jwt-token-' + Date.now();
//         this.setToken(mockToken);
        
//         return {
//           success: true,
//           token: mockToken,
//           message: 'Login successful',
//         };
//       } else {
//         throw new Error('Invalid username or password');
//       }
//     }

//     const response = await this.request<{ success: boolean; token: string; message: string }>(
//       '/api/auth/login',
//       {
//         method: 'POST',
//         body: JSON.stringify(credentials),
//       }
//     );

//     if (response.success && response.token) {
//       this.setToken(response.token);
//     }

//     return response;
//   }

//   async sendMessage(message: string, chatId: string | null, userId: string) {
//     if (USE_MOCK) {
//       await mockDelay(1000);
      
//       // Generate mock AI response
//       const mockResponses = [
//         "That's an interesting question! Based on the information I have, I can help you with that. However, since this is a demo mode, I'm providing a simulated response.",
//         "I understand what you're asking about. In a production environment, I would analyze the context from the knowledge base and provide a detailed answer.",
//         "Great question! Let me help you with that. This is a mock response to demonstrate the chat functionality. The real system would connect to an AI model.",
//         "I've processed your query. In the full version, I would search through the ingested documents and provide relevant information based on your question.",
//         "Thank you for your question. This demo response shows how the conversation would flow. The actual implementation would use advanced NLP to understand and respond.",
//       ];
      
//       const randomResponse = mockResponses[Math.floor(Math.random() * mockResponses.length)];
      
//       return {
//         response: randomResponse,
//         chat_id: chatId || Date.now().toString(),
//         timestamp: new Date().toISOString(),
//       };
//     }

//     return this.request<ChatResponse>('/api/chat', {
//       method: 'POST',
//       body: JSON.stringify({
//         message,
//         chat_id: chatId,
//         user_id: userId,
//       }),
//     });
//   }

//   async uploadFile(file: File) {
//     if (USE_MOCK) {
//       await mockDelay(1500);
      
//       // Mock file upload
//       const mockDocId = 'doc-' + Date.now();
//       this.mockDocuments.push({
//         id: mockDocId,
//         content: `Content from ${file.name} (mocked)`,
//         source: file.name,
//         filename: file.name,
//         size: file.size,
//         type: file.type,
//       });
      
//       return {
//         success: true,
//         document_id: mockDocId,
//         message: `File "${file.name}" uploaded successfully (mock)`,
//         chunks_created: Math.floor(file.size / 1000) || 1,
//       };
//     }

//     const formData = new FormData();
//     formData.append('file', file);

//     const headers: Record<string, string> = {};
//     if (this.token) {
//       headers['Authorization'] = `Bearer ${this.token}`;
//     }

//     const response = await fetch(`${API_BASE_URL}/api/ingest/file`, {
//       method: 'POST',
//       headers,
//       body: formData,
//     });

//     if (!response.ok) {
//       throw new Error('File upload failed');
//     }

//     return response.json();
//   }

//   async getChatHistory(chatId: string, limit: number = 50) {
//     if (USE_MOCK) {
//       await mockDelay(300);
      
//       // Mock chat history
//       return {
//         chat_id: chatId,
//         history: [
//           {
//             role: 'user',
//             content: 'Hello!',
//             timestamp: new Date(Date.now() - 3600000).toISOString(),
//           },
//           {
//             role: 'assistant',
//             content: 'Hi! How can I help you today?',
//             timestamp: new Date(Date.now() - 3500000).toISOString(),
//           },
//         ],
//       };
//     }

//     return this.request(`/api/chat/history/${chatId}?limit=${limit}`);
//   }

//   async searchDocuments(query: string, topK: number = 5) {
//     if (USE_MOCK) {
//       await mockDelay(500);
      
//       // Mock document search
//       const queryLower = query.toLowerCase();
//       const results = this.mockDocuments
//         .filter(doc => doc.content.toLowerCase().includes(queryLower))
//         .slice(0, topK)
//         .map(doc => ({
//           document_id: doc.id,
//           content: doc.content.substring(0, 200) + '...',
//           source: doc.source,
//           score: Math.random() * 10,
//         }));
      
//       return {
//         query,
//         results: results.length > 0 ? results : [
//           {
//             document_id: 'mock-1',
//             content: 'No exact matches found. This is a mock search result.',
//             source: 'mock_data',
//             score: 0.5,
//           },
//         ],
//       };
//     }

//     return this.request(`/api/documents/search?query=${encodeURIComponent(query)}&top_k=${topK}`);
//   }

//   async ingestData(content: string, source: string, metadata?: any) {
//     if (USE_MOCK) {
//       await mockDelay(800);
      
//       const docId = 'doc-' + Date.now();
//       this.mockDocuments.push({
//         id: docId,
//         content,
//         source,
//         metadata,
//       });
      
//       return {
//         success: true,
//         document_id: docId,
//         message: 'Data ingested successfully (mock)',
//       };
//     }

//     return this.request('/api/ingest', {
//       method: 'POST',
//       body: JSON.stringify({
//         content,
//         source,
//         metadata,
//       }),
//     });
//   }
// }

// export const apiService = new ApiService();

// src/services/api.ts - ENHANCED FOR HACKATHON
// Complete integration with backend APIs

import { LoginCredentials, ChatResponse } from '../types';
import { cognitoService } from './CognitoService';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';
const USE_MOCK = process.env.REACT_APP_USE_MOCK === 'true' || false;

// Mock delay
const mockDelay = (ms: number = 800) => new Promise(resolve => setTimeout(resolve, ms));

class ApiService {
  private token: string | null = null;

  setToken(token: string) {
    this.token = token;
    localStorage.setItem('auth_token', token);
  }

  clearToken() {
    this.token = null;
    localStorage.removeItem('auth_token');
  }

  loadToken() {
    const token = localStorage.getItem('auth_token');
    if (token) {
      this.token = token;
    }
  }

  // private async request<T>(
  //   endpoint: string,
  //   options: RequestInit = {}
  // ): Promise<T> {
  //   const headers: Record<string, string> = {
  //     'Content-Type': 'application/json',
  //     ...(options.headers as Record<string, string>),
  //   };

  //   if (this.token) {
  //     headers['Authorization'] = `Bearer ${this.token}`;
  //   }

  //   const response = await fetch(`${API_BASE_URL}${endpoint}`, {
  //     ...options,
  //     headers,
  //   });

  //   if (!response.ok) {
  //     const error = await response.json().catch(() => ({
  //       detail: 'An error occurred',
  //     }));
  //     throw new Error(error.detail || error.message || 'Request failed');
  //   }

  //   return response.json();
  // }

  async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string>),
    };

    // Get token from Cognito (NEW!)
    try {
      const token = await cognitoService.getAccessToken();
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
    } catch (err) {
      console.log('No active Cognito session');
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });

    if (!response.ok) {
      if (response.status === 401) {
        // Token expired, logout
        cognitoService.logout();
        window.location.href = '/login';
      }
      
      const error = await response.json().catch(() => ({
        detail: 'An error occurred',
      }));
      throw new Error(error.detail || error.message || 'Request failed');
    }

    return response.json();
  }

  // ============================================================================
  // AUTHENTICATION
  // ============================================================================

  async login(credentials: LoginCredentials) {
    if (USE_MOCK) {
      await mockDelay(500);
      
      if (credentials.username === 'admin' && credentials.password === 'admin') {
        const mockToken = 'mock-jwt-token-' + Date.now();
        this.setToken(mockToken);
        
        return {
          success: true,
          access_token: mockToken,
          refresh_token: 'mock-refresh-token',
          user_id: 'mock-user-123',
          email: credentials.username,
          expires_in: 3600,
        };
      } else {
        throw new Error('Invalid username or password');
      }
    }

    // Real backend call
    const response = await this.request<{
      success: boolean;
      access_token: string;
      refresh_token: string;
      user_id: string;
      email: string;
      expires_in: number;
    }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });

    if (response.success && response.access_token) {
      this.setToken(response.access_token);
    }

    return response;
  }

  async getCurrentUser() {
    return this.request<{
      user_id: string;
      email: string;
      verified: boolean;
    }>('/auth/me');
  }

  // ============================================================================
  // CHAT - Regular & Streaming
  // ============================================================================

  async sendMessage(message: string, sessionId: string | null, projectId?: string) {
    if (USE_MOCK) {
      await mockDelay(1200);
      
      const mockResponses = [
        "That's an interesting question! Based on my knowledge base, I can help you understand this topic better. Let me break it down for you...",
        "I've analyzed the documents in your knowledge base. Here's what I found: The authentication system uses JWT tokens with RS256 encryption...",
        "Great question! According to the uploaded documentation, the best practice here is to implement proper validation and security measures...",
        "Let me search through your documents... I found relevant information in 'authentication-guide.pdf' and 'security-best-practices.md'...",
        "Based on the context from your knowledge base, I recommend following these steps to ensure optimal results...",
      ];
      
      const randomResponse = mockResponses[Math.floor(Math.random() * mockResponses.length)];
      
      return {
        success: true,
        response: randomResponse,
        agent: 'ChatAgent',
        delegated_to: 'RetrievalAgent',
        sources: [
          { text: 'Sample source content...', file_name: 'auth.pdf', score: 0.95, resource_id: 'doc1' },
          { text: 'Additional reference...', file_name: 'security.md', score: 0.87, resource_id: 'doc2' }
        ],
        timestamp: new Date().toISOString(),
      };
    }

    return this.request<{
      success: boolean;
      response: string;
      agent: string;
      delegated_to?: string;
      sources?: Array<{
        text: string;
        file_name: string;
        score: number;
        resource_id: string;
      }>;
      timestamp: string;
    }>('/chat', {
      method: 'POST',
      body: JSON.stringify({
        message,
        session_id: sessionId,
        project_id: projectId || 'default',
      }),
    });
  }

  // 🎯 HACKATHON FEATURE: Server-Sent Events Streaming
  async *streamMessage(message: string, sessionId: string | null, projectId?: string) {
    if (USE_MOCK) {
      // Mock streaming
      const response = await this.sendMessage(message, sessionId, projectId);
      const words = response.response.split(' ');
      
      for (const word of words) {
        yield { type: 'chunk', content: word + ' ' };
        await mockDelay(50);
      }
      
      yield { type: 'complete', sources: response.sources };
      return;
    }

    // Real SSE streaming
    const response = await fetch(`${API_BASE_URL}/chat/stream`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.token}`,
      },
      body: JSON.stringify({
        message,
        session_id: sessionId,
        project_id: projectId || 'default',
      }),
    });

    if (!response.ok) {
      throw new Error('Streaming failed');
    }

    const reader = response.body?.getReader();
    const decoder = new TextDecoder();

    while (reader) {
      const { done, value } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value);
      const lines = chunk.split('\n');

      for (const line of lines) {
        if (line.startsWith('data: ')) {
          const data = JSON.parse(line.slice(6));
          yield data;
        }
      }
    }
  }

  // ============================================================================
  // DOCUMENT MANAGEMENT
  // ============================================================================

  async uploadFile(file: File, projectId?: string, domain?: string, tags?: string[], description?: string) {
    if (USE_MOCK) {
      await mockDelay(1500);
      
      return {
        success: true,
        message: `File "${file.name}" uploaded successfully`,
        resource_id: 'doc-' + Date.now(),
        file_name: file.name,
        file_size: file.size,
        s3_key: `mock/path/${file.name}`,
        processing_time: 1.23,
      };
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('project_id', projectId || 'default');
    formData.append('domain', domain || 'general');
    formData.append('tags', tags?.join(',') || '');
    formData.append('description', description || '');

    const headers: Record<string, string> = {};
    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    const response = await fetch(`${API_BASE_URL}/upload`, {
      method: 'POST',
      headers,
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ detail: 'Upload failed' }));
      throw new Error(error.detail || 'File upload failed');
    }

    return response.json();
  }

  async getDocuments(projectId?: string) {
    if (USE_MOCK) {
      await mockDelay(300);
      
      return {
        success: true,
        documents: [
          {
            resource_id: 'sample-doc-1',
            user_id: 'user-123',
            file_name: 'authentication-guide.pdf',
            file_type: 'pdf',
            file_size: 245678,
            s3_key: 'mock/path/auth.pdf',
            project_id: 'default',
            domain: 'security',
            tags: ['auth', 'jwt', 'security'],
            uploaded_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
            status: 'completed',
          },
          {
            resource_id: 'sample-doc-2',
            user_id: 'user-123',
            file_name: 'database-config.md',
            file_type: 'md',
            file_size: 12345,
            s3_key: 'mock/path/db.md',
            project_id: 'default',
            domain: 'backend',
            tags: ['database', 'postgresql'],
            uploaded_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
            status: 'completed',
          },
        ],
        total: 2,
      };
    }

    const url = projectId ? `/documents?project_id=${projectId}` : '/documents';
    return this.request<{
      success: boolean;
      documents: Array<any>;
      total: number;
    }>(url);
  }

  async deleteDocument(resourceId: string) {
    if (USE_MOCK) {
      await mockDelay(500);
      return { success: true, message: 'Document deleted successfully' };
    }

    return this.request<{ success: boolean; message: string }>(
      `/documents/${resourceId}`,
      { method: 'DELETE' }
    );
  }

  // ============================================================================
  // SEARCH
  // ============================================================================

  async search(query: string, projectId?: string, topK: number = 5) {
    if (USE_MOCK) {
      await mockDelay(600);
      
      return {
        success: true,
        query,
        results: [
          {
            text: 'Authentication uses JWT tokens with RS256. Tokens expire after 24 hours...',
            file_name: 'authentication-guide.pdf',
            score: 0.95,
            resource_id: 'sample-doc-1',
          },
          {
            text: 'Database configuration with PostgreSQL connection pooling...',
            file_name: 'database-config.md',
            score: 0.87,
            resource_id: 'sample-doc-2',
          },
        ],
        total_results: 2,
        response: `Based on your knowledge base, here's what I found about "${query}":\n\nThe authentication system uses JWT tokens with RS256 algorithm for secure user authentication. Tokens are configured to expire after 24 hours for security purposes.\n\nAdditionally, the database is configured with PostgreSQL using connection pooling for optimal performance.\n\n📚 **Sources:** authentication-guide.pdf, database-config.md`,
        timestamp: new Date().toISOString(),
      };
    }

    return this.request<{
      success: boolean;
      query: string;
      results: Array<{
        text: string;
        file_name: string;
        score: number;
        resource_id: string;
      }>;
      total_results: number;
      response: string;
      timestamp: string;
    }>('/search', {
      method: 'POST',
      body: JSON.stringify({
        query,
        project_id: projectId,
        top_k: topK,
      }),
    });
  }

  // ============================================================================
  // 🎯 HACKATHON FEATURE: ANALYTICS
  // ============================================================================

  async getAnalytics() {
    if (USE_MOCK) {
      await mockDelay(400);
      
      return {
        success: true,
        user_id: 'user-123',
        stats: {
          total_documents: 12,
          total_size_mb: 24.5,
          domains: {
            security: 5,
            backend: 4,
            frontend: 3,
          },
          recent_uploads: [
            { file_name: 'auth.pdf', uploaded_at: new Date().toISOString() },
            { file_name: 'db-config.md', uploaded_at: new Date().toISOString() },
          ],
        },
        timestamp: new Date().toISOString(),
      };
    }

    return this.request<{
      success: boolean;
      user_id: string;
      stats: {
        total_documents: number;
        total_size_mb: number;
        domains: Record<string, number>;
        recent_uploads: Array<any>;
      };
      timestamp: string;
    }>('/analytics');
  }

  // ============================================================================
  // HEALTH CHECK
  // ============================================================================

  async healthCheck() {
    return this.request<{
      status: string;
      version: string;
      mode: string;
      agents: Record<string, string>;
      services: Record<string, string>;
    }>('/health');
  }
}

export const apiService = new ApiService();

// Load token on initialization
apiService.loadToken();