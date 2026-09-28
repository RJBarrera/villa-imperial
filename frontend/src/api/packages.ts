import { http } from "./http";
import type {
  PackageCreatePayload,
  PackageUpdatePayload,
  RentalPackage,
} from "../types/package";

export async function getPackages(): Promise<RentalPackage[]> {
  const response = await http.get<RentalPackage[]>("/packages");
  return response.data;
}

export async function createPackage(
  data: PackageCreatePayload,
): Promise<RentalPackage> {
  const response = await http.post<RentalPackage>("/packages", data);
  return response.data;
}

export async function updatePackage(
  packageId: string,
  data: PackageUpdatePayload,
): Promise<RentalPackage> {
  const response = await http.put<RentalPackage>(
    `/packages/${packageId}`,
    data,
  );

  return response.data;
}

export async function deletePackage(packageId: string): Promise<void> {
  await http.delete(`/packages/${packageId}`);
}

export interface PackagePrice {
  package_id: string;
  target_date: string;
  day_of_week: number;
  base_price: string;
  day_price: string | null;
  promotional_price: string | null;
  effective_price: string;
  source: "base" | "day" | "promotion";
  promotion_name: string | null;
}

export async function getPackagePrice(
  packageId: string,
  targetDate: string,
): Promise<PackagePrice> {
  const response = await http.get<PackagePrice>(
    `/packages/${packageId}/price`,
    {
      params: {
        target_date: targetDate,
      },
    },
  );

  return response.data;
}
