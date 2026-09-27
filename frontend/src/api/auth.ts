import { http } from "./http";
import type { AuthUser, LoginPayload } from "../types/auth";

export async function login(payload: LoginPayload): Promise<AuthUser> {
  const response = await http.post<AuthUser>("/auth/login", payload);
  return response.data;
}

export async function logout(): Promise<void> {
  await http.post("/auth/logout");
}

export async function getMe(): Promise<AuthUser> {
  const response = await http.get<AuthUser>("/auth/me");
  return response.data;
}
