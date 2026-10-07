import type { AuthResponse } from '../types';
import type { LoginSchema } from '../../src/schemas/authSchemas';

// Simulated API calls for demonstration
export const authService = {
  login: async (data: LoginSchema): Promise<AuthResponse> => {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Hardcoded mock user for demonstration
    if (data.email === 'admin@example.com' && data.password === 'password') {
      return {
        token: 'mock-jwt-token-12345',
        user: {
          id: '1',
          email: 'admin@example.com',
          name: 'Admin User',
        },
      };
    }

    throw new Error('Invalid email or password');
  },

  logout: async (): Promise<void> => {
    await new Promise((resolve) => setTimeout(resolve, 500));
  },

  forgotPassword: async (_email: string): Promise<void> => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
  },

  resetPassword: async (_password: string): Promise<void> => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }
};
