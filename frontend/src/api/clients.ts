import { http } from "./http";

import type {
  Client,
  CreateClientPayload,
  UpdateClientPayload,
} from "../types/client";

export async function getClients(search?: string): Promise<Client[]> {
  const response = await http.get<Client[]>("/clients", {
    params: {
      search: search?.trim() || undefined,
    },
  });

  return response.data;
}

export async function createClient(
  payload: CreateClientPayload,
): Promise<Client> {
  const response = await http.post<Client>("/clients", payload);

  return response.data;
}

export async function updateClient(
  clientId: string,
  payload: UpdateClientPayload,
): Promise<Client> {
  const response = await http.put<Client>(
    `/clients/${clientId}`,
    payload,
  );

  return response.data;
}

export async function deleteClient(
  clientId: string,
): Promise<Client> {
  return updateClient(clientId, {
    is_active: false,
  });
}
