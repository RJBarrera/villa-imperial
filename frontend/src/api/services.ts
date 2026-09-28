import { http } from "./http";
import type { RentalService } from "../types/package";

export async function getServices(): Promise<RentalService[]> {
  const response = await http.get<RentalService[]>("/services");
  return response.data;
}
