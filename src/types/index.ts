// export interface User {
//     username: string;
//     token?: string;
//   }
  
//   export interface Chat {
//     id: string;
//     title: string;
//     timestamp: Date;
//   }
  
//   export interface Message {
//     id: number;
//     text: string;
//     sender: 'user' | 'ai';
//     timestamp: Date;
//   }
  
//   export interface ChatMessages {
//     [chatId: string]: Message[];
//   }
  
//   export interface LoginCredentials {
//     username: string;
//     password: string;
//   }
  
//   export interface ChatResponse {
//     response: string;
//     chat_id: string;
//     timestamp: string;
//   }
  
//   export interface ApiError {
//     message: string;
//     status?: number;
//   }


// src/types/index.ts - ENHANCED FOR HACKATHON
// Complete type definitions matching backend

export interface User {
    username: string;
    user_id?: string;
    email?: string;
    token?: string;
    verified?: boolean;
  }
  
  export interface Chat {
    id: string;
    title: string;
    timestamp: Date;
  }
  
  export interface Message {
    id: number;
    text: string;
    sender: 'user' | 'ai';
    timestamp: Date;
    sources?: Source[];
    isStreaming?: boolean;
  }
  
  export interface Source {
    text: string;
    file_name: string;
    score: number;
    resource_id: string;
  }
  
  export interface ChatMessages {
    [chatId: string]: Message[];
  }
  
  export interface LoginCredentials {
    username: string;
    password: string;
  }
  
  export interface LoginResponse {
    success: boolean;
    access_token: string;
    refresh_token: string;
    user_id: string;
    email: string;
    expires_in: number;
  }
  
  export interface ChatResponse {
    success: boolean;
    response: string;
    agent: string;
    delegated_to?: string;
    sources?: Source[];
    timestamp: string;
  }
  
  export interface StreamChunk {
    type: 'status' | 'chunk' | 'complete';
    content?: string;
    sources?: Source[];
  }
  
  export interface DocumentMetadata {
    resource_id: string;
    user_id: string;
    file_name: string;
    file_type: string;
    file_size: number;
    s3_key: string;
    project_id: string;
    domain: string;
    tags: string[];
    description?: string;
    uploaded_at: string;
    status: string;
  }
  
  export interface UploadResponse {
    success: boolean;
    message: string;
    resource_id: string;
    file_name: string;
    file_size: number;
    s3_key?: string;
    processing_time: number;
  }
  
  export interface SearchResponse {
    success: boolean;
    query: string;
    results: Source[];
    total_results: number;
    response: string;
    timestamp: string;
  }
  
  export interface AnalyticsData {
    success: boolean;
    user_id: string;
    stats: {
      total_documents: number;
      total_size_mb: number;
      domains: Record<string, number>;
      recent_uploads: Array<{
        file_name: string;
        uploaded_at: string;
      }>;
    };
    timestamp: string;
  }
  
  export interface ApiError {
    message: string;
    detail?: string;
    status?: number;
  }
  
  export interface HealthResponse {
    status: string;
    version: string;
    mode: string;
    agents: Record<string, string>;
    services: Record<string, string>;
  }