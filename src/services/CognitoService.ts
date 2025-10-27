// src/services/CognitoService.ts

import {
    CognitoUserPool,
    CognitoUser,
    AuthenticationDetails,
    CognitoUserSession,
  } from 'amazon-cognito-identity-js';
  import { cognitoConfig } from '../config/cognito.config';
  
  class CognitoService {
    private userPool: CognitoUserPool;
  
    constructor() {
      this.userPool = new CognitoUserPool({
        UserPoolId: cognitoConfig.userPoolId,
        ClientId: cognitoConfig.userPoolClientId,
      });
    }
  
    /**
     * Login user with email and password using SRP (Secure Remote Password)
     * This works with ALLOW_USER_SRP_AUTH which is already enabled in your Cognito
     */
    login(email: string, password: string): Promise<CognitoUserSession> {
      const authenticationDetails = new AuthenticationDetails({
        Username: email,
        Password: password,
      });
  
      const cognitoUser = new CognitoUser({
        Username: email,
        Pool: this.userPool,
      });
  
      return new Promise((resolve, reject) => {
        // authenticateUser automatically uses SRP when ALLOW_USER_SRP_AUTH is enabled
        cognitoUser.authenticateUser(authenticationDetails, {
          onSuccess: (session) => {
            console.log('✅ Login successful');
            resolve(session);
          },
          onFailure: (err) => {
            console.error('❌ Login failed:', err);
            reject(err);
          },
          newPasswordRequired: (userAttributes, requiredAttributes) => {
            // User needs to set a new password
            console.log('⚠️ New password required');
            
            // For demo purposes, we'll reject this
            // In production, you'd show a password reset form
            reject(new Error('Password reset required. Please contact administrator.'));
          },
        });
      });
    }
  
    /**
     * Get current authenticated user
     */
    getCurrentUser(): CognitoUser | null {
      return this.userPool.getCurrentUser();
    }
  
    /**
     * Get current user session
     */
    getCurrentSession(): Promise<CognitoUserSession> {
      const cognitoUser = this.getCurrentUser();
  
      if (!cognitoUser) {
        return Promise.reject(new Error('No user logged in'));
      }
  
      return new Promise((resolve, reject) => {
        cognitoUser.getSession((err: Error | null, session: CognitoUserSession | null) => {
          if (err) {
            reject(err);
          } else if (session && session.isValid()) {
            resolve(session);
          } else {
            reject(new Error('Session invalid or expired'));
          }
        });
      });
    }
  
    /**
     * Get JWT access token
     */
    async getAccessToken(): Promise<string> {
      try {
        const session = await this.getCurrentSession();
        return session.getAccessToken().getJwtToken();
      } catch (error) {
        console.error('Failed to get access token:', error);
        throw error;
      }
    }
  
    /**
     * Get JWT ID token (contains user attributes)
     */
    async getIdToken(): Promise<string> {
      try {
        const session = await this.getCurrentSession();
        return session.getIdToken().getJwtToken();
      } catch (error) {
        console.error('Failed to get ID token:', error);
        throw error;
      }
    }
  
    /**
     * Get user attributes (email, name, etc.)
     */
    getUserAttributes(): Promise<any> {
      const cognitoUser = this.getCurrentUser();
  
      if (!cognitoUser) {
        return Promise.reject(new Error('No user logged in'));
      }
  
      return new Promise((resolve, reject) => {
        cognitoUser.getSession((err: Error | null, session: CognitoUserSession | null) => {
          if (err || !session) {
            reject(err || new Error('No session'));
            return;
          }
  
          cognitoUser.getUserAttributes((err, attributes) => {
            if (err) {
              reject(err);
            } else {
              const userAttributes: any = {};
              attributes?.forEach((attr) => {
                userAttributes[attr.Name] = attr.Value;
              });
              resolve(userAttributes);
            }
          });
        });
      });
    }
  
    /**
     * Logout user
     */
    logout(): void {
      const cognitoUser = this.getCurrentUser();
      if (cognitoUser) {
        cognitoUser.signOut();
        console.log('✅ User logged out');
      }
    }
  
    /**
     * Check if user is authenticated
     */
    async isAuthenticated(): Promise<boolean> {
      try {
        const session = await this.getCurrentSession();
        return session.isValid();
      } catch {
        return false;
      }
    }
  
    /**
     * Refresh session using refresh token
     */
    async refreshSession(): Promise<CognitoUserSession> {
      const cognitoUser = this.getCurrentUser();
      
      if (!cognitoUser) {
        return Promise.reject(new Error('No user logged in'));
      }
  
      return new Promise((resolve, reject) => {
        cognitoUser.getSession((err: Error | null, session: CognitoUserSession | null) => {
          if (err || !session) {
            reject(err || new Error('No session'));
            return;
          }
  
          if (session.isValid()) {
            resolve(session);
            return;
          }
  
          // Session expired, try to refresh
          const refreshToken = session.getRefreshToken();
          cognitoUser.refreshSession(refreshToken, (err, newSession) => {
            if (err) {
              reject(err);
            } else {
              resolve(newSession);
            }
          });
        });
      });
    }
  }
  
  export const cognitoService = new CognitoService();