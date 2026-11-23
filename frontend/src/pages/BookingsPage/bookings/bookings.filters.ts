import dayjs from "dayjs";
import "dayjs/locale/es";
import type { BookingListItem } from "./bookings.types";
import { getBookingStatusView } from "./bookings.utils";

function normalize(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

function searchableBookingText(booking: BookingListItem): string {
  const date = dayjs(booking.starts_at).locale("es");
  const end = dayjs(booking.ends_at).locale("es");
  const status = getBookingStatusView(booking.status).label;

  return normalize(
    [
      booking.client.full_name,
      booking.event_type,
      booking.folio,
      booking.package_name_snapshot,
      booking.status,
      status,
      booking.status === "liquidado" ? "pagado sin saldo" : "",
      Number(booking.balance) > 0 ? "saldo pendiente" : "sin pendiente",
      booking.guest_count != null ? `${booking.guest_count} personas` : "",
      date.format("DD/MM/YYYY"),
      date.format("D/M/YYYY"),
      date.format("DD-MM-YYYY"),
      date.format("YYYY-MM-DD"),
      date.format("D [de] MMMM [de] YYYY"),
      date.format("D MMMM YYYY"),
      date.format("D MMM YYYY"),
      date.format("dddd D MMMM YYYY"),
      date.format("MMMM YYYY"),
      date.format("MMM YYYY"),
      date.format("h:mm A"),
      end.format("h:mm A"),
    ].join(" "),
  );
}

/**
 * Filtra sobre las reservaciones ya obtenidas por getBookings():
 * no requiere endpoints nuevos ni cambia la consulta original.
 */
export function filterBookings(
  bookings: BookingListItem[],
  search: string,
  selectedDate: string,
): BookingListItem[] {
  const terms = normalize(search).split(/\s+/).filter(Boolean);

  if (terms.length === 0 && !selectedDate) return bookings;

  return bookings.filter((booking) => {
    if (
      selectedDate &&
      dayjs(booking.starts_at).format("YYYY-MM-DD") !== selectedDate
    )
      return false;

    if (terms.length === 0) return true;
    const content = searchableBookingText(booking);
    return terms.every((term) => content.includes(term));
  });
}
