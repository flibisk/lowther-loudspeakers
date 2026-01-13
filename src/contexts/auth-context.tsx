'use client';

import { createContext, useContext, useEffect, useState, useCallback, ReactNode } from 'react';

interface User {
  id: string;
  email: string;
  displayName: string | null;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string) => Promise<{ success: boolean; error?: string }>;
  verifyCode: (email: string, code: string) => Promise<{ success: boolean; needsUsername?: boolean; error?: string }>;
  setUsername: (username: string) => Promise<{ success: boolean; error?: string }>;
  signOut: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshUser = useCallback(async () => {
    try {
      const response = await fetch('/api/auth/me');
      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error('Failed to refresh user:', error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshUser();
  }, [refreshUser]);

  const signIn = async (email: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const response = await fetch('/api/auth/send-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        return { success: false, error: data.error || 'Failed to send code' };
      }

      return { success: true };
    } catch (error) {
      return { success: false, error: 'An error occurred' };
    }
  };

  const verifyCode = async (email: string, code: string): Promise<{ success: boolean; needsUsername?: boolean; error?: string }> => {
    try {
      const response = await fetch('/api/auth/verify-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code }),
      });

      const data = await response.json();

      if (!response.ok) {
        return { success: false, error: data.error || 'Failed to verify code' };
      }

      setUser(data.user);
      
      // Check if user needs to set a username (new user without displayName)
      const needsUsername = !data.user.displayName;
      
      return { success: true, needsUsername };
    } catch (error) {
      return { success: false, error: 'An error occurred' };
    }
  };

  const setUsername = async (username: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const response = await fetch('/api/auth/set-username', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username }),
      });

      const data = await response.json();

      if (!response.ok) {
        return { success: false, error: data.error || 'Failed to set username' };
      }

      // Update user with new displayName
      setUser(data.user);
      return { success: true };
    } catch (error) {
      return { success: false, error: 'An error occurred' };
    }
  };

  const signOut = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } catch (error) {
      console.error('Logout error:', error);
    }
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, signIn, verifyCode, setUsername, signOut, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
