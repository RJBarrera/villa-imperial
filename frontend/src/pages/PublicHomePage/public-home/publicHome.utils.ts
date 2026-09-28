import dayjs from "dayjs";
import type {
  PublicPackage,
  PublicPackagePrice,
  PublicPackagePromotion,
} from "../../../types/public";

const PACKAGE_DAYS = [
  { value: 0, label: "Lun" },
  { value: 1, label: "Mar" },
  { value: 2, label: "Mié" },
  { value: 3, label: "Jue" },
  { value: 4, label: "Vie" },
  { value: 5, label: "Sáb" },
  { value: 6, label: "Dom" },
] as const;

const PACKAGE_DAY_NAMES = [
  "lunes",
  "martes",
  "miércoles",
  "jueves",
  "viernes",
  "sábado",
  "domingo",
] as const;

export function currency(value: string | number) {
  return new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(Number(value));
}

export function formatPublicDate(value: string) {
  return dayjs(`${value}T12:00:00`).format("DD MMM YYYY");
}

export function getPublicStartingPrice(
  rentalPackage: PublicPackage,
) {
  const prices = [
    Number(rentalPackage.base_price),
    ...rentalPackage.day_prices.map((item) => Number(item.price)),
  ];

  return Math.min(...prices);
}

export function getPublicDayPriceGroups(
  rentalPackage: PublicPackage,
) {
  const resolvedPrices = PACKAGE_DAYS.map((day) => {
    const configured = rentalPackage.day_prices.find(
      (item) => item.day_of_week === day.value,
    );

    return {
      label: day.label,
      price: Number(configured?.price ?? rentalPackage.base_price),
    };
  });

  const groups: Array<{
    labels: string[];
    price: number;
  }> = [];

  resolvedPrices.forEach((item) => {
    const previous = groups[groups.length - 1];

    if (previous && previous.price === item.price) {
      previous.labels.push(item.label);
      return;
    }

    groups.push({
      labels: [item.label],
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

export function getPublicActivePromotion(
  rentalPackage: PublicPackage,
  referenceDate = dayjs().format("YYYY-MM-DD"),
): PublicPackagePromotion | null {
  return (
    rentalPackage.promotions.find(
      (promotion) =>
        promotion.is_active &&
        promotion.starts_on <= referenceDate &&
        promotion.ends_on >= referenceDate,
    ) ?? null
  );
}

export function getPublicUpcomingPromotion(
  rentalPackage: PublicPackage,
  referenceDate = dayjs().format("YYYY-MM-DD"),
): PublicPackagePromotion | null {
  return (
    [...rentalPackage.promotions]
      .filter(
        (promotion) =>
          promotion.is_active &&
          promotion.starts_on > referenceDate,
      )
      .sort((a, b) =>
        a.starts_on.localeCompare(b.starts_on),
      )[0] ?? null
  );
}

export function getPublicRelevantPromotion(
  rentalPackage: PublicPackage,
) {
  const active = getPublicActivePromotion(rentalPackage);

  if (active) {
    return {
      promotion: active,
      status: "active" as const,
    };
  }

  const scheduled = getPublicUpcomingPromotion(rentalPackage);

  if (scheduled) {
    return {
      promotion: scheduled,
      status: "scheduled" as const,
    };
  }

  return {
    promotion: null,
    status: null,
  };
}

export function getPublicPackagePriceDescription(
  packagePrice: PublicPackagePrice | undefined,
) {
  if (!packagePrice) {
    return null;
  }

  if (packagePrice.source === "promotion") {
    return packagePrice.promotion_name
      ? `Promoción: ${packagePrice.promotion_name}`
      : "Promoción vigente";
  }

  if (packagePrice.source === "day") {
    return `Precio correspondiente al ${
      PACKAGE_DAY_NAMES[packagePrice.day_of_week] ?? "día seleccionado"
    }`;
  }

  return "Precio base";
}

export function buildWhatsappUrl(
  whatsapp: string | null | undefined,
  message: string,
) {
  if (!whatsapp) return null;

  const phone = whatsapp.replace(/\D/g, "");

  if (!phone) return null;

  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}

export function buildReservationWhatsappMessage(
  selectedPackage: PublicPackage | undefined,
  eventDate: string,
  startTime: string,
  packagePrice: PublicPackagePrice | undefined,
) {
  if (!selectedPackage) {
    return "Hola, me interesa solicitar información sobre Villa Imperial.";
  }

  const priceLine = packagePrice
    ? `Precio para la fecha seleccionada: ${currency(packagePrice.effective_price)}`
    : "Precio para la fecha seleccionada: Por confirmar";

  const promotionLine =
    packagePrice?.source === "promotion" && packagePrice.promotion_name
      ? `Promoción: ${packagePrice.promotion_name}`
      : null;

  return [
    "Hola, me interesa reservar Villa Imperial.",
    "",
    `Paquete: ${selectedPackage.name}`,
    `Fecha: ${dayjs(eventDate).format("DD/MM/YYYY")}`,
    `Hora de inicio: ${dayjs(`2000-01-01T${startTime}`).format("h:mm A")}`,
    `Duración: ${selectedPackage.duration_hours} horas`,
    priceLine,
    ...(promotionLine ? [promotionLine] : []),
    "",
    "¿Me pueden apoyar para continuar con la reservación?",
  ].join("\n");
}

export function buildFullAddress(
  ...parts: Array<string | null | undefined>
) {
  return parts.filter(Boolean).join(", ");
}
