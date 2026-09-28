export interface PublicBusiness {
  business_name: string;

  phone: string | null;

  whatsapp: string | null;

  email: string | null;

  address: string | null;

  city: string | null;

  state: string | null;

  logo_url: string | null;

  minimum_deposit: string;
}

export interface PublicPackageDayPrice {
  day_of_week: number;

  price: string;
}

export interface PublicPackagePromotion {
  name: string;

  promotional_price: string;

  starts_on: string;

  ends_on: string;

  is_active: boolean;
}

export interface PublicPackage {
  id: string;

  code: string;

  name: string;

  description: string | null;

  base_price: string;

  duration_hours: number;

  services: string[];

  day_prices: PublicPackageDayPrice[];

  promotions: PublicPackagePromotion[];
}

export type PublicPackagePriceSource =
  | "base"
  | "day"
  | "promotion";

export interface PublicPackagePrice {
  package_id: string;

  target_date: string;

  day_of_week: number;

  base_price: string;

  day_price: string | null;

  promotional_price: string | null;

  effective_price: string;

  source: PublicPackagePriceSource;

  promotion_name: string | null;
}

export interface PublicCalendarDay {
  date: string;

  bookings_count: number;
}

export interface PublicCalendar {
  month: string;

  days: PublicCalendarDay[];
}

export interface PublicAvailability {
  available: boolean;

  starts_at: string;

  ends_at: string;
}
