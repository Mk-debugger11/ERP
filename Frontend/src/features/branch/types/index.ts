export interface Branch {
  id: number;
  name: string;
  code: string;
  address: string;
  city: string;
  state: string;
  country: string;
  postal_code: string;
  phone: string | null;
  email: string | null;
  is_head_office: boolean;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export type BranchCreate = Pick<Branch, 'name' | 'code' | 'address' | 'city' | 'state' | 'country' | 'postal_code' | 'phone' | 'email' | 'is_head_office'>;
export type BranchUpdate = Partial<BranchCreate>;
