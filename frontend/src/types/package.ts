export interface RentalService {
  id: string;
  name: string;
  description: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface RentalPackage {
  id: string;
  code: string;
  name: string;
  description: string | null;
  base_price: string;
  duration_hours: number;
  is_active: boolean;
  services: RentalService[];
  created_at: string;
  updated_at: string;
}
