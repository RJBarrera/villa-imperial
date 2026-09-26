import { http } from "./http";

import type { RentalPackage } from "../types/package";

export async function getPackages(): Promise<RentalPackage[]> {
  const response = await http.get<RentalPackage[]>("/packages");

  return response.data;
}
