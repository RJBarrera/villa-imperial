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
  const header = `🏛️ *Villa Imperial*\nFolio: ${booking.folio}`;

  const basics = [
    `Evento: ${booking.event_type}`,
    `📅 Fecha: ${bookingDate(booking)}`,
    `Horario: ${bookingSchedule(booking)}`,
    `Paquete: ${booking.package_name_snapshot}`,
  ].join("\n");

  switch (action) {
    case "resumen":
      return [
        `Hola, ${name}. 👋`,
        "Te compartimos el resumen de tu reservación:",
        "",
        header,
        basics,
        `Estado: ${STATUS_LABELS[booking.status]}`,
        "",
        `Importe total: ${money(booking.final_price)}`,
        `Total recibido: ${money(booking.total_paid)}`,
        `💰 *Saldo pendiente: ${money(booking.balance)}*`,
        "",
        "Este mensaje es un resumen informativo de tu reservación.",
        "Para cualquier aclaración estamos a tus órdenes.",
        "",
        "¡Gracias por elegir Villa Imperial!",
      ].join("\n");

    case "confirmacion":
      return [
        `Hola, ${name}. 👋`,
        "Nos complace confirmar los datos de tu evento:",
        "",
        header,
        basics,
        "",
        booking.status === "liquidado"
          ? "✅ *Tu reservación está confirmada y liquidada.*"
          : "✅ *Tu reservación se encuentra confirmada.*",
        "",
        "Agradecemos tu confianza.",
        "¡Será un gusto formar parte de tu celebración!",
      ].join("\n");

    case "evento":
      return [
        `Hola, ${name}. 👋`,
        "Te enviamos un recordatorio de tu próximo evento:",
        "",
        header,
        basics,
        "",
        "Si tienes alguna duda o necesitas revisar los detalles, estamos a tus órdenes.",
        "",
        "🎉 ¡Te esperamos para celebrar juntos!",
        "*Villa Imperial*",
      ].join("\n");

    case "pago":
      return [
        `Hola, ${name}. 👋`,
        "Te compartimos un amable recordatorio del saldo pendiente de tu reservación:",
        "",
        header,
        `Evento: ${booking.event_type}`,
        `📅 Fecha: ${bookingDate(booking)}`,
        "",
        `Total: ${money(booking.final_price)}`,
        `Pagado: ${money(booking.total_paid)}`,
        `💰 *Saldo pendiente: ${money(booking.balance)}*`,
        "",
        "¿Nos podrías confirmar cuándo realizarás la liquidación?",
        "",
        "Si ya realizaste un pago, por favor compártenos el comprobante para revisarlo.",
        "",
        "¡Muchas gracias por tu atención y confianza!",
        "*Villa Imperial*",
      ].join("\n");
  }
}
