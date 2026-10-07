import type { Customer } from '../types';

let mockCustomers: Customer[] = [
  { id: '1', name: 'Acme Corp', email: 'contact@acme.com', company: 'Acme', status: 'Active', createdAt: new Date().toISOString() },
  { id: '2', name: 'Global Tech', email: 'info@globaltech.com', company: 'Global Tech', status: 'Inactive', createdAt: new Date().toISOString() },
];

export const customerService = {
  getCustomers: async (): Promise<Customer[]> => {
    await new Promise((resolve) => setTimeout(resolve, 800));
    return [...mockCustomers];
  },

  getCustomer: async (id: string): Promise<Customer> => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    const customer = mockCustomers.find(c => c.id === id);
    if (!customer) throw new Error('Customer not found');
    return { ...customer };
  },

  createCustomer: async (customer: Omit<Customer, 'id' | 'createdAt'>): Promise<Customer> => {
    await new Promise((resolve) => setTimeout(resolve, 800));
    const newCustomer: Customer = {
      ...customer,
      id: Math.random().toString(36).substring(7),
      createdAt: new Date().toISOString(),
    };
    mockCustomers.push(newCustomer);
    return newCustomer;
  },

  updateCustomer: async (id: string, updates: Partial<Customer>): Promise<Customer> => {
    await new Promise((resolve) => setTimeout(resolve, 800));
    const index = mockCustomers.findIndex(c => c.id === id);
    if (index === -1) throw new Error('Customer not found');
    mockCustomers[index] = { ...mockCustomers[index], ...updates };
    return mockCustomers[index];
  },

  deleteCustomer: async (id: string): Promise<void> => {
    await new Promise((resolve) => setTimeout(resolve, 800));
    mockCustomers = mockCustomers.filter(c => c.id !== id);
  }
};
