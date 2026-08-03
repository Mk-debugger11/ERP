export interface EmploymentType {
  id: number;
  name: string;
  code: string;
  description: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export type EmploymentTypeCreate = Pick<EmploymentType, 'name' | 'code' | 'description'>;
export type EmploymentTypeUpdate = Partial<EmploymentTypeCreate>;
