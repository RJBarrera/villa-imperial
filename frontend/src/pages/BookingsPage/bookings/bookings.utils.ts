import type { BookingStatus } from "../../../types/booking";
import type { BookingStatusView } from "./bookings.types";

export function formatCurrency(value: string | number) {
  return new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
    minimumFractionDigits: 0,
  }).format(Number(value));
}

export function getBookingStatusView(status: BookingStatus): BookingStatusView {
  switch (status) {
    case "pendiente":
      return {
        label: "Pendiente",
        className: "bookings-status bookings-status--pending",
      };
    case "apartado":
      return {
        label: "Apartado",
        className: "bookings-status bookings-status--reserved",
      };
    case "confirmado":
      return {
        label: "Confirmado",
        className: "bookings-status bookings-status--confirmed",
      };
    case "liquidado":
      return {
        label: "Liquidado",
        className: "bookings-status bookings-status--paid",
      };
    case "cancelado":
      return {
        label: "Cancelado",
        className: "bookings-status bookings-status--cancelled",
      };
    case "concluido":
      return {
        label: "Concluido",
        className: "bookings-status bookings-status--completed",
      };
    case "bloqueado":
    default:
      return {
        label: "Bloqueado",
        className: "bookings-status bookings-status--blocked",
      };
  }
}
