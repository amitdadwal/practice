import { z } from 'zod';

export const customerSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email address'),
  company: z.string().min(1, 'Company is required'),
  status: z.enum(['Active', 'Inactive']),
});

export type CustomerFormValues = z.infer<typeof customerSchema>;
