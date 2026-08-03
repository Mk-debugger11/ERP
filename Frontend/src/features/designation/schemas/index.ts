import { z } from 'zod';

export const designationSchema = z.object({
  title: z.string().min(1, 'Title is required').max(100, 'Title must be 100 characters or less'),
  code: z.string().min(1, 'Code is required').max(20, 'Code must be 20 characters or less'),
  description: z.string().optional().nullable(),
  department: z.coerce.number().min(1, 'Department is required'),
  level: z.coerce.number().min(1).max(10).default(1),
});

export type DesignationFormData = z.infer<typeof designationSchema>;
