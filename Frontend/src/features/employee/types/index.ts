export interface Employee {
  id: number;
  employee_id: string;
  first_name: string;
  last_name: string;
  company_email: string;
  personal_email: string | null;
  phone: string;
  joining_date: string;
  date_of_birth: string | null;
  gender: 'MALE' | 'FEMALE' | 'OTHER' | 'PREFER_NOT_TO_SAY';
  employment_status: 'PROBATION' | 'ACTIVE' | 'NOTICE_PERIOD' | 'RESIGNED' | 'TERMINATED';
  department: number;
  designation: number;
  employment_type: number;
  branch: number;
  team: number | null;
  manager: number | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export type EmployeeCreate = Pick<Employee, 'employee_id' | 'first_name' | 'last_name' | 'company_email' | 'personal_email' | 'phone' | 'joining_date' | 'date_of_birth' | 'gender' | 'employment_status' | 'department' | 'designation' | 'employment_type' | 'branch' | 'team' | 'manager'>;
export type EmployeeUpdate = Partial<EmployeeCreate>;
