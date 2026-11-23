import dayjs from "dayjs";
import "dayjs/locale/es";
import type { Booking, BookingStatus } from "../types/booking";

export type BookingWhatsAppAction =
  | "resumen"
  | "confirmacion"
  | "evento"
  | "pago";

const STATUS_LABELS: Record<BookingStatus, string> = {
  pendiente: "Pendiente",
  apartado: "Apartado",
  confirmado: "Confirmado",
  liquidado: "Liquidado",
  concluido: "Concluido",
  cancelado: "Cancelado",
  bloqueado: "Bloqueado",
};

function money(amount: string | number): string {
  return new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(Number(amount));
}

function bookingDate(booking: Booking): string {
  return dayjs(booking.starts_at)
    .locale("es")
    .format("dddd D [de] MMMM [de] YYYY");
}

function bookingSchedule(booking: Booking): string {
  const start = dayjs(booking.starts_at).locale("es").format("h:mm A");
  const end = dayjs(booking.ends_at).locale("es").format("h:mm A");
  return `${start} a ${end}`;
}

/**
 * Villa Imperial opera en México. A los teléfonos de 10 dígitos
 * se les añade +52; números internacionales deben incluir +.
 */
export function normalizeClientWhatsApp(phone: string): string | null {
  const raw = phone.trim();
  const digits = raw.replace(/\D/g, "");

  if (digits.length === 10) return `52${digits}`;
  if (digits.length === 12 && digits.startsWith("52")) return digits;
  if (digits.length === 13 && digits.startsWith("521")) {
    return `52${digits.slice(3)}`;
  }
  if (raw.startsWith("+") && digits.length >= 8 && digits.length <= 15) {
    return digits;
  }
  return null;
}

export function createBookingWhatsAppLink(
  phone: string,
  message: string,
): string | null {
  const normalized = normalizeClientWhatsApp(phone);
  if (!normalized || !message.trim()) return null;
  return `https://wa.me/${normalized}?text=${encodeURIComponent(message)}`;
}

export function buildBookingWhatsAppMessage(
  booking: Booking,
  action: BookingWhatsAppAction,
): string {
  const name = booking.client.full_name;
  const header = `*Villa Imperial*\nFolio: ${booking.folio}`;
  const basics = [
    `Evento: ${booking.event_type}`,
    `Fecha: ${bookingDate(booking)}`,
    `Horario: ${bookingSchedule(booking)}`,
    `Paquete: ${booking.package_name_snapshot}`,
  ].join("\n");

  switch (action) {
    case "resumen":
      return [
        `Hola, ${name}. Te compartimos el resumen de tu reservación:`,
        "",
        header,
        basics,
        `Estado: ${STATUS_LABELS[booking.status]}`,
        "",
        `Importe total: ${money(booking.final_price)}`,
        `Total recibido: ${money(booking.total_paid)}`,
        `Saldo pendiente: ${money(booking.balance)}`,
        "",
        "Este mensaje es un resumen informativo de la reservación.",
        "Para cualquier aclaración estamos a tus órdenes.",
      ].join("\n");

    case "confirmacion":
      return [
        `Hola, ${name}. Confirmamos los datos de tu evento en Villa Imperial:`,
        "",
        header,
        basics,
        "",
        booking.status === "liquidado"
          ? "Tu reservación está confirmada y liquidada."
          : "Tu reservación se encuentra confirmada.",
        "¡Gracias por elegirnos!",
      ].join("\n");

    case "evento":
      return [
        `Hola, ${name}. Te enviamos un recordatorio de tu próximo evento en Villa Imperial:`,
        "",
        header,
        basics,
        "",
        "Si tienes alguna duda o necesitas revisar los detalles, estamos a tus órdenes.",
        "¡Te esperamos!",
      ].join("\n");

    case "pago":
      return [
        `Hola, ${name}. Te compartimos un recordatorio amable del saldo de tu reservación en Villa Imperial:`,
        "",
        header,
        `Evento: ${booking.event_type}`,
        `Fecha: ${bookingDate(booking)}`,
        `Total: ${money(booking.final_price)}`,
        `Pagado: ${money(booking.total_paid)}`,
        `*Saldo pendiente: ${money(booking.balance)}*`,
        "",
        "¿Nos puedes confirmar cuándo realizarás la liquidación?",
        "Si ya realizaste un pago, por favor compártenos el comprobante para revisarlo.",
        "¡Gracias!",
      ].join("\n");
  }
}
