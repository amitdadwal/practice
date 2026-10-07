/* eslint-disable react-refresh/only-export-components */
import { createContext, useState, useEffect, type ReactNode } from 'react';
import type { User } from '../types';
import { authService } from '../services/authService';
import type { LoginSchema } from '../schemas/authSchemas';


interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (data: LoginSchema) => Promise<void>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

// eslint-disable-next-line react-refresh/only-export-components
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const [isLoading, setIsLoading] = useState(false); // Can be used for initial loading if validating token

  // In a real app, we would validate the token on mount
  useEffect(() => {
    if (token) {
      // Mock validating token and fetching user profile
      setUser({
        id: '1',
        email: 'admin@example.com',
        name: 'Admin User',
      });
    }
  }, [token]);

  const login = async (data: LoginSchema) => {
    try {
      setIsLoading(true);
      const response = await authService.login(data);
      setToken(response.token);
      setUser(response.user);
      localStorage.setItem('token', response.token);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    authService.logout().finally(() => {
      setToken(null);
      setUser(null);
      localStorage.removeItem('token');
      // Forcing a hard reload or redirect can also be done here or in the interceptor
    });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!token,
        isLoading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
