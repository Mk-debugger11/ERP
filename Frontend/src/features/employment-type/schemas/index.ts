import { z } from 'zod';

export const employmentTypeSchema = z.object({
  name: z.string().min(1, 'Name is required').max(50),
  code: z.string().min(1, 'Code is required').max(20),
  description: z.string().optional().nullable(),
});

export type EmploymentTypeFormData = z.infer<typeof employmentTypeSchema>;
