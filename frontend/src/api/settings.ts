import { http } from "./http";

import type {
  BusinessSettings,
  UpdateBusinessSettingsPayload,
} from "../types/settings";

export async function getBusinessSettings(): Promise<BusinessSettings> {
  const response = await http.get<BusinessSettings>("/settings/business");

  return response.data;
}

export async function updateBusinessSettings(
  payload: UpdateBusinessSettingsPayload,
): Promise<BusinessSettings> {
  const response = await http.put<BusinessSettings>(
    "/settings/business",
    payload,
  );

  return response.data;
}
