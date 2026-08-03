export interface Designation {
  id: number;
  title: string;
  code: string;
  description: string | null;
  department: number; // Foreign key
  level: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export type DesignationCreate = Pick<Designation, 'title' | 'code' | 'description' | 'department' | 'level'>;
export type DesignationUpdate = Partial<DesignationCreate>;
