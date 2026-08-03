import { z } from 'zod';

export const departmentSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name must be 100 characters or less'),
  code: z.string().min(1, 'Code is required').max(20, 'Code must be 20 characters or less'),
  description: z.string().optional().nullable(),
});

export type DepartmentFormData = z.infer<typeof departmentSchema>;
