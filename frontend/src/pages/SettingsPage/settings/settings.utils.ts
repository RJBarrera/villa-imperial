import type {
  BusinessSettingsPayload,
  BusinessSettingsResponse,
  SettingsFormState,
} from "./settings.types";

export function mapSettingsToForm(
  settings: BusinessSettingsResponse,
): SettingsFormState {
  return {
    business_name: settings.business_name,
    phone: settings.phone ?? "",
    whatsapp: settings.whatsapp ?? "",
    email: settings.email ?? "",
    address: settings.address ?? "",
    city: settings.city ?? "",
    state: settings.state ?? "",
    timezone: settings.timezone,
    minimum_deposit: String(settings.minimum_deposit ?? 0),
    logo_url: settings.logo_url ?? "",
    receipt_footer: settings.receipt_footer ?? "",
  };
}

export function buildSettingsPayload(
  form: SettingsFormState,
): BusinessSettingsPayload {
  return {
    business_name: form.business_name.trim(),
    phone: form.phone.trim() || null,
    whatsapp: form.whatsapp.trim() || null,
    email: form.email.trim() || null,
    address: form.address.trim() || null,
    city: form.city.trim() || null,
    state: form.state.trim() || null,
    timezone: form.timezone,
    minimum_deposit: Number(form.minimum_deposit || 0),
    logo_url: form.logo_url.trim() || null,
    receipt_footer: form.receipt_footer.trim() || null,
  };
}
