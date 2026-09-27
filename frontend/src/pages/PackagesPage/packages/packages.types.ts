export interface PackageService {
  id: string;
  name: string;
}

export interface RentalPackageListItem {
  id: string;
  code: string;
  name: string;
  description?: string | null;
  base_price: string | number;
  duration_hours: number;
  is_active: boolean;
  services: PackageService[];
}
