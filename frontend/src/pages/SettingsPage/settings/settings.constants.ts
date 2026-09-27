import type { SettingsFormState } from "./settings.types";

export const EMPTY_SETTINGS_FORM: SettingsFormState = {
  business_name: "Villa Imperial",
  phone: "",
  whatsapp: "",
  email: "",
  address: "",
  city: "",
  state: "",
  timezone: "America/Mazatlan",
  minimum_deposit: "0",
  logo_url: "",
  receipt_footer: "",
};

export const TIMEZONE_OPTIONS = [
  {
    value: "America/Mazatlan",
    label: "America/Mazatlan",
  },
  {
    value: "America/Mexico_City",
    label: "America/Mexico_City",
  },
];
