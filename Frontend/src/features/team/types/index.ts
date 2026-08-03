export interface Team {
  id: number;
  name: string;
  code: string;
  description: string | null;
  department: number; // Foreign key
  team_lead: number | null; // Foreign key to Employee
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export type TeamCreate = Pick<Team, 'name' | 'code' | 'description' | 'department' | 'team_lead'>;
export type TeamUpdate = Partial<TeamCreate>;
