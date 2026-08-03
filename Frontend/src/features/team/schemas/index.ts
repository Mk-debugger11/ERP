import { z } from 'zod';

export const teamSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100),
  code: z.string().min(1, 'Code is required').max(20),
  description: z.string().optional().nullable(),
  department: z.coerce.number().min(1, 'Department is required'),
  team_lead: z.coerce.number().optional().nullable(),
});

export type TeamFormData = z.infer<typeof teamSchema>;
