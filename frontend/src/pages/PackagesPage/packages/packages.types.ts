import type {
  PackageCreatePayload,
  PackagePromotion,
  PackageUpdatePayload,
  RentalPackage,
  RentalService,
} from "../../../types/package";

export type RentalPackageListItem = RentalPackage;
export type PackageService = RentalService;
export type PackageFormMode = "create" | "edit";

export interface DayPriceGroup {
  label: string;
  price: number;
}

export interface PromotionFormItem {
  key: string;
  name: string;
  promotional_price: string;
  starts_on: string;
  ends_on: string;
  is_active: boolean;
}

export interface PackageFormState {
  code: string;
  name: string;
  description: string;
  base_price: string;
  duration_hours: string;
  is_active: boolean;
  service_ids: string[];
  use_day_prices: boolean;
  day_prices: Record<number, string>;
  promotions: PromotionFormItem[];
}

export interface PackageFormSubmitData {
  create: PackageCreatePayload;
  update: PackageUpdatePayload;
}

export interface PackageFeedback {
  severity: "success" | "error";
  message: string;
}

export type { PackagePromotion };
