import { z } from 'zod';

export const employeeSchema = z.object({
  employee_id: z.string().min(1, 'Employee ID is required').max(20),
  first_name: z.string().min(1, 'First name is required').max(100),
  last_name: z.string().min(1, 'Last name is required').max(100),
  company_email: z.string().email('Invalid email address'),
  personal_email: z.string().email('Invalid email address').optional().nullable().or(z.literal('')),
  phone: z.string().min(1, 'Phone number is required').max(20),
  joining_date: z.string().min(1, 'Joining date is required'), // Format: YYYY-MM-DD
  date_of_birth: z.string().optional().nullable().or(z.literal('')),
  gender: z.enum(['MALE', 'FEMALE', 'OTHER', 'PREFER_NOT_TO_SAY']),
  employment_status: z.enum(['PROBATION', 'ACTIVE', 'NOTICE_PERIOD', 'RESIGNED', 'TERMINATED']).default('PROBATION'),
  department: z.coerce.number().min(1, 'Department is required'),
  designation: z.coerce.number().min(1, 'Designation is required'),
  employment_type: z.coerce.number().min(1, 'Employment Type is required'),
  branch: z.coerce.number().min(1, 'Branch is required'),
  team: z.coerce.number().optional().nullable(),
  manager: z.coerce.number().optional().nullable(),
});

export type EmployeeFormData = z.infer<typeof employeeSchema>;
