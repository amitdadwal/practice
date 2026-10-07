export interface User {
  id: string;
  email: string;
  name: string;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  company: string;
  status: 'Active' | 'Inactive';
  createdAt: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}
