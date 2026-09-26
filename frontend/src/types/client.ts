export interface Client {
  id: string;

  full_name: string;

  phone: string;

  email: string | null;

  notes: string | null;

  is_active: boolean;

  created_at: string;

  updated_at: string;
}

export interface CreateClientPayload {
  full_name: string;

  phone: string;

  email?: string | null;

  notes?: string | null;
}
