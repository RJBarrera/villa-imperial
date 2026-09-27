export interface SettingsFormState {
  business_name: string;
  phone: string;
  whatsapp: string;
  email: string;
  address: string;
  city: string;
  state: string;
  timezone: string;
  minimum_deposit: string;
  logo_url: string;
  receipt_footer: string;
}

export type SettingsFormField = keyof SettingsFormState;

export interface BusinessSettingsResponse {
  business_name: string;
  phone?: string | null;
  whatsapp?: string | null;
  email?: string | null;
  address?: string | null;
  city?: string | null;
  state?: string | null;
  timezone: string;
  minimum_deposit: string | number;
  logo_url?: string | null;
  receipt_footer?: string | null;
}

export interface BusinessSettingsPayload {
  business_name: string;
  phone: string | null;
  whatsapp: string | null;
  email: string | null;
  address: string | null;
  city: string | null;
  state: string | null;
  timezone: string;
  minimum_deposit: number;
  logo_url: string | null;
  receipt_footer: string | null;
}
