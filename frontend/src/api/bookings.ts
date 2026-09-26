import { http } from "./http";

import type {
  AddPaymentPayload,
  AvailabilityResponse,
  Booking,
  BookingStatus,
  CreateBookingPayload,
  UpdateBookingPayload,
} from "../types/booking";

interface BookingFilters {
  date_from?: string;
  date_to?: string;
}

export async function getBookings(
  filters: BookingFilters = {},
): Promise<Booking[]> {
  const response = await http.get<Booking[]>("/bookings", {
    params: filters,
  });

  return response.data;
}

export async function getBooking(bookingId: string): Promise<Booking> {
  const response = await http.get<Booking>(`/bookings/${bookingId}`);

  return response.data;
}

export async function createBooking(
  payload: CreateBookingPayload,
): Promise<Booking> {
  const response = await http.post<Booking>("/bookings", payload);

  return response.data;
}

export async function updateBooking(
  bookingId: string,
  payload: UpdateBookingPayload,
): Promise<Booking> {
  const response = await http.put<Booking>(`/bookings/${bookingId}`, payload);

  return response.data;
}

export async function addBookingPayment(
  bookingId: string,
  payload: AddPaymentPayload,
): Promise<Booking> {
  const response = await http.post<Booking>(
    `/bookings/${bookingId}/payments`,
    payload,
  );

  return response.data;
}

export async function updateBookingStatus(
  bookingId: string,
  status: BookingStatus,
): Promise<Booking> {
  const response = await http.put<Booking>(`/bookings/${bookingId}/status`, {
    status,
  });

  return response.data;
}

export async function cancelBooking(
  bookingId: string,
  reason: string,
): Promise<Booking> {
  const response = await http.post<Booking>(`/bookings/${bookingId}/cancel`, {
    reason,
  });

  return response.data;
}

export async function checkAvailability(
  packageId: string,
  eventDate: string,
  startTime: string,
): Promise<AvailabilityResponse> {
  const response = await http.get<AvailabilityResponse>(
    "/bookings/availability",
    {
      params: {
        package_id: packageId,

        event_date: eventDate,

        start_time: startTime,
      },
    },
  );

  return response.data;
}
