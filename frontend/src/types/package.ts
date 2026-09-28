export interface RentalService {
  id: string;
  name: string;
  description: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface PackageDayPrice {
  id: string;
  day_of_week: number;
  price: string;
  created_at: string;
  updated_at: string;
}

export interface PackagePromotion {
  id: string;
  name: string;
  promotional_price: string;
  starts_on: string;
  ends_on: string;
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
  day_prices: PackageDayPrice[];
  promotions: PackagePromotion[];
  created_at: string;
  updated_at: string;
}

export interface PackageDayPriceInput {
  day_of_week: number;
  price: number;
}

export interface PackagePromotionInput {
  name: string;
  promotional_price: number;
  starts_on: string;
  ends_on: string;
  is_active: boolean;
}

export interface PackageCreatePayload {
  code: string;
  name: string;
  description: string | null;
  base_price: number;
  duration_hours: number;
  service_ids: string[];
  day_prices: PackageDayPriceInput[];
  promotions: PackagePromotionInput[];
}

export interface PackageUpdatePayload {
  code?: string;
  name?: string;
  description?: string | null;
  base_price?: number;
  duration_hours?: number;
  is_active?: boolean;
  service_ids?: string[];
  day_prices?: PackageDayPriceInput[];
  promotions?: PackagePromotionInput[];
}
