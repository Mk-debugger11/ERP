import { z } from 'zod';

export const branchSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100),
  code: z.string().min(1, 'Code is required').max(20),
  address: z.string().min(1, 'Address is required'),
  city: z.string().min(1, 'City is required').max(100),
  state: z.string().min(1, 'State is required').max(100),
  country: z.string().max(100).default('India'),
  postal_code: z.string().min(1, 'Postal code is required').max(20),
  phone: z.string().max(20).optional().nullable(),
  email: z.string().email('Invalid email format').optional().nullable().or(z.literal('')),
  is_head_office: z.boolean().default(false),
});

export type BranchFormData = z.infer<typeof branchSchema>;
