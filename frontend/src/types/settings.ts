export interface BusinessSettings {
  id: number;

  business_name: string;

  phone: string | null;

  whatsapp: string | null;

  email: string | null;

  address: string | null;

  city: string | null;

  state: string | null;

  timezone: string;

  minimum_deposit: string;

  logo_url: string | null;

  receipt_footer: string | null;
}

export interface UpdateBusinessSettingsPayload {
  business_name?: string;

  phone?: string | null;

  whatsapp?: string | null;

  email?: string | null;

  address?: string | null;

  city?: string | null;

  state?: string | null;

  timezone?: string;

  minimum_deposit?: number;

  logo_url?: string | null;

  receipt_footer?: string | null;
}
