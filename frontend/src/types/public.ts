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

export interface PublicPackage {
  id: string;

  code: string;

  name: string;

  description: string | null;

  base_price: string;

  duration_hours: number;

  services: string[];
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
