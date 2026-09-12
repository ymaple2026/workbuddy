import { useState } from 'react';
import { useAuthContext, type AuthUser } from '@/contexts/AuthContext';

export interface AuthResult {
  success: boolean;
}

export interface UseAuthReturn {
  signIn: (email: string, password: string) => Promise<AuthResult>;
  signUp: (email: string, password: string) => Promise<AuthResult>;
  signInWithGoogle: () => Promise<AuthResult>;
  signOut: () => Promise<void>;
  loading: boolean;
  error: Error | null;
  clearError: () => void;
}

export function useAuth(): UseAuthReturn {
  const { setUser } = useAuthContext();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const clearError = () => setError(null);

  const authenticate = async (email: string): Promise<AuthResult> => {
    setLoading(true);
    setError(null);
    try {
      if (!email || !email.includes('@')) {
        throw new Error('请输入有效的邮箱地址');
      }
      const next: AuthUser = { id: email, email };
      setUser(next);
      return { success: true };
    } catch (e) {
      setError(e instanceof Error ? e : new Error('认证失败'));
      return { success: false };
    } finally {
      setLoading(false);
    }
  };

  const signIn = (email: string, _password: string) => authenticate(email);
  const signUp = (email: string, _password: string) => authenticate(email);

  const signInWithGoogle = async (): Promise<AuthResult> => {
    setLoading(true);
    setError(null);
    try {
      setUser({ id: 'google.user@example.com', email: 'google.user@example.com' });
      return { success: true };
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    setUser(null);
  };

  return { signIn, signUp, signInWithGoogle, signOut, loading, error, clearError };
}
