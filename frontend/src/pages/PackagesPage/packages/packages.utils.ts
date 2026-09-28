import axios from "axios";
import { EMPTY_DAY_PRICES, PACKAGE_DAYS } from "./packages.constants";
import type {
  DayPriceGroup,
  PackageFormState,
  PackageFormSubmitData,
  PackagePromotion,
  PromotionFormItem,
  RentalPackageListItem,
} from "./packages.types";

export function formatCurrency(value: string | number) {
  return new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
    minimumFractionDigits: 0,
  }).format(Number(value));
}

export function formatShortDate(value: string) {
  return new Intl.DateTimeFormat("es-MX", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(`${value}T12:00:00`));
}

export function getTodayDateKey() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

export function getActivePromotion(
  rentalPackage: RentalPackageListItem,
  referenceDate = getTodayDateKey(),
): PackagePromotion | null {
  return (
    rentalPackage.promotions.find(
      (promotion) =>
        promotion.is_active &&
        promotion.starts_on <= referenceDate &&
        promotion.ends_on >= referenceDate,
    ) ?? null
  );
}

export function getRegularStartingPrice(
  rentalPackage: RentalPackageListItem,
) {
  const basePrice = Number(rentalPackage.base_price);
  const prices = rentalPackage.day_prices.map((item) => Number(item.price));

  return Math.min(basePrice, ...prices);
}

export function getDayPriceGroups(
  rentalPackage: RentalPackageListItem,
): DayPriceGroup[] {
  const resolvedPrices = PACKAGE_DAYS.map((day) => {
    const override = rentalPackage.day_prices.find(
      (item) => item.day_of_week === day.value,
    );

    return {
      shortLabel: day.shortLabel,
      price: Number(override?.price ?? rentalPackage.base_price),
    };
  });

  const groups: Array<{
    labels: string[];
    price: number;
  }> = [];

  resolvedPrices.forEach((item) => {
    const previous = groups[groups.length - 1];

    if (previous && previous.price === item.price) {
      previous.labels.push(item.shortLabel);
      return;
    }

    groups.push({
      labels: [item.shortLabel],
      price: item.price,
    });
  });

  return groups.map((group) => ({
    label:
      group.labels.length === 1
        ? group.labels[0]
        : `${group.labels[0]}–${group.labels[group.labels.length - 1]}`,
    price: group.price,
  }));
}

export function createPromotionFormItem(): PromotionFormItem {
  return {
    key: `promotion-${Date.now()}-${Math.random().toString(16).slice(2)}`,
    name: "",
    promotional_price: "",
    starts_on: "",
    ends_on: "",
    is_active: true,
  };
}

export function createEmptyPackageFormState(): PackageFormState {
  return {
    code: "",
    name: "",
    description: "",
    base_price: "",
    duration_hours: "8",
    is_active: true,
    service_ids: [],
    use_day_prices: false,
    day_prices: { ...EMPTY_DAY_PRICES },
    promotions: [],
  };
}

export function createPackageFormState(
  rentalPackage: RentalPackageListItem,
): PackageFormState {
  const dayPrices = { ...EMPTY_DAY_PRICES };

  rentalPackage.day_prices.forEach((item) => {
    dayPrices[item.day_of_week] = String(item.price);
  });

  return {
    code: rentalPackage.code,
    name: rentalPackage.name,
    description: rentalPackage.description ?? "",
    base_price: String(rentalPackage.base_price),
    duration_hours: String(rentalPackage.duration_hours),
    is_active: rentalPackage.is_active,
    service_ids: rentalPackage.services.map((service) => service.id),
    use_day_prices: rentalPackage.day_prices.length > 0,
    day_prices: dayPrices,
    promotions: rentalPackage.promotions.map((promotion) => ({
      key: promotion.id,
      name: promotion.name,
      promotional_price: String(promotion.promotional_price),
      starts_on: promotion.starts_on,
      ends_on: promotion.ends_on,
      is_active: promotion.is_active,
    })),
  };
}

export function validatePackageForm(state: PackageFormState) {
  if (!state.code.trim()) {
    return "Captura el código del paquete.";
  }

  if (!state.name.trim()) {
    return "Captura el nombre del paquete.";
  }

  const basePrice = Number(state.base_price);

  if (!Number.isFinite(basePrice) || basePrice < 0) {
    return "Captura un precio base válido.";
  }

  const durationHours = Number(state.duration_hours);

  if (
    !Number.isInteger(durationHours) ||
    durationHours < 1 ||
    durationHours > 24
  ) {
    return "La duración debe estar entre 1 y 24 horas.";
  }

  if (state.use_day_prices) {
    for (const day of PACKAGE_DAYS) {
      const value = state.day_prices[day.value];

      if (!value) {
        continue;
      }

      const price = Number(value);

      if (!Number.isFinite(price) || price < 0) {
        return `El precio de ${day.label} no es válido.`;
      }
    }
  }

  for (const promotion of state.promotions) {
    if (!promotion.name.trim()) {
      return "Todas las promociones deben tener un nombre.";
    }

    const promotionPrice = Number(promotion.promotional_price);

    if (!Number.isFinite(promotionPrice) || promotionPrice < 0) {
      return `Captura un precio válido para "${promotion.name}".`;
    }

    if (!promotion.starts_on || !promotion.ends_on) {
      return `Captura la vigencia completa de "${promotion.name}".`;
    }

    if (promotion.ends_on < promotion.starts_on) {
      return `La fecha final de "${promotion.name}" no puede ser menor a la inicial.`;
    }
  }

  return null;
}

export function buildPackageSubmitData(
  state: PackageFormState,
): PackageFormSubmitData {
  const dayPrices = state.use_day_prices
    ? PACKAGE_DAYS.flatMap((day) => {
        const value = state.day_prices[day.value];

        if (!value) {
          return [];
        }

        return [
          {
            day_of_week: day.value,
            price: Number(value),
          },
        ];
      })
    : [];

  const promotions = state.promotions.map((promotion) => ({
    name: promotion.name.trim(),
    promotional_price: Number(promotion.promotional_price),
    starts_on: promotion.starts_on,
    ends_on: promotion.ends_on,
    is_active: promotion.is_active,
  }));

  const common = {
    code: state.code.trim(),
    name: state.name.trim(),
    description: state.description.trim() || null,
    base_price: Number(state.base_price),
    duration_hours: Number(state.duration_hours),
    service_ids: state.service_ids,
    day_prices: dayPrices,
    promotions,
  };

  return {
    create: common,
    update: {
      ...common,
      is_active: state.is_active,
    },
  };
}

export function getApiErrorMessage(
  error: unknown,
  fallbackMessage: string,
) {
  if (axios.isAxiosError(error)) {
    const detail = error.response?.data?.detail;

    if (typeof detail === "string") {
      return detail;
    }

    if (Array.isArray(detail) && detail.length > 0) {
      const firstMessage = detail[0]?.msg;

      if (typeof firstMessage === "string") {
        return firstMessage;
      }
    }
  }

  return fallbackMessage;
}
