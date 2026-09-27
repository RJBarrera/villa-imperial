import dayjs, { type Dayjs } from "dayjs";
import type { BookingStatus } from "../../../types/booking";
import type { BookingStatusStyle, CalendarBooking } from "./calendar.types";

export function getBookingStatusStyle(status: BookingStatus): BookingStatusStyle {
  switch (status) {
    case "pendiente":
      return {
        label: "Pendiente",
        className: "calendar-booking calendar-booking--pending",
      };
    case "apartado":
      return {
        label: "Apartado",
        className: "calendar-booking calendar-booking--reserved",
      };
    case "confirmado":
      return {
        label: "Confirmado",
        className: "calendar-booking calendar-booking--confirmed",
      };
    case "liquidado":
      return {
        label: "Liquidado",
        className: "calendar-booking calendar-booking--paid",
      };
    case "cancelado":
      return {
        label: "Cancelado",
        className: "calendar-booking calendar-booking--cancelled",
      };
    case "concluido":
      return {
        label: "Concluido",
        className: "calendar-booking calendar-booking--completed",
      };
    case "bloqueado":
    default:
      return {
        label: "Bloqueado",
        className: "calendar-booking calendar-booking--blocked",
      };
  }
}

export function getCalendarStart(currentMonth: Dayjs) {
  const firstDay = currentMonth.startOf("month");
  const mondayIndex = (firstDay.day() + 6) % 7;

  return firstDay.subtract(mondayIndex, "day");
}

export function buildCalendarDays(calendarStart: Dayjs) {
  return Array.from({ length: 42 }, (_, index) =>
    calendarStart.add(index, "day"),
  );
}

export function getBookingsForDay(
  bookings: CalendarBooking[],
  date: Dayjs,
) {
  const dateKey = date.format("YYYY-MM-DD");

  return bookings.filter(
    (booking) => dayjs(booking.starts_at).format("YYYY-MM-DD") === dateKey,
  );
}
