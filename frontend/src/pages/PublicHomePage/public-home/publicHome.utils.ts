import dayjs from "dayjs";
import type { PublicPackage } from "../../../types/public";

export function currency(value: string | number) {
  return new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(Number(value));
}

export function buildWhatsappUrl(whatsapp: string | null | undefined, message: string) {
  if (!whatsapp) return null;
  const phone = whatsapp.replace(/\D/g, "");
  if (!phone) return null;
  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}

export function buildReservationWhatsappMessage(
  selectedPackage: PublicPackage | undefined,
  eventDate: string,
  startTime: string,
) {
  if (!selectedPackage) {
    return "Hola, me interesa solicitar información sobre Villa Imperial.";
  }

  return [
    "Hola, me interesa reservar Villa Imperial.",
    "",
    `Paquete: ${selectedPackage.name}`,
    `Fecha: ${dayjs(eventDate).format("DD/MM/YYYY")}`,
    `Hora de inicio: ${dayjs(`2000-01-01T${startTime}`).format("h:mm A")}`,
    `Duración: ${selectedPackage.duration_hours} horas`,
    `Precio: ${currency(selectedPackage.base_price)}`,
    "",
    "¿Me pueden apoyar para continuar con la reservación?",
  ].join("\n");
}

export function buildFullAddress(...parts: Array<string | null | undefined>) {
  return parts.filter(Boolean).join(", ");
}
