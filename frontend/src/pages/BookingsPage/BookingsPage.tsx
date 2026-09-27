import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { getBookings } from "../../api/bookings";
import BookingDetailDialog from "../../components/bookings/BookingDetailDialog";
import ReservationDialog from "../../components/bookings/ReservationDialog";
import BookingCard from "./bookings/components/BookingCard";
import BookingsHeader from "./bookings/components/BookingsHeader";
import BookingsState from "./bookings/components/BookingsState";
import type { BookingListItem } from "./bookings/bookings.types";
import "./BookingsPage.css";

export default function BookingsPage() {
  const queryClient = useQueryClient();
  const [selectedBookingId, setSelectedBookingId] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const {
    data: bookings = [],
    isLoading,
    isError,
  } = useQuery<BookingListItem[]>({
    queryKey: ["bookings"],
    queryFn: () => getBookings(),
  });

  const handleBookingCreated = async () => {
    await queryClient.invalidateQueries({
      queryKey: ["bookings"],
    });
  };

  return (
    <main className="bookings-page">
      <BookingsHeader onCreate={() => setDialogOpen(true)} />

      <BookingsState
        isLoading={isLoading}
        isError={isError}
        isEmpty={!isLoading && !isError && bookings.length === 0}
        onCreate={() => setDialogOpen(true)}
      />

      {!isLoading && !isError && bookings.length > 0 && (
        <section className="bookings-list">
          {bookings.map((booking) => (
            <BookingCard
              key={booking.id}
              booking={booking}
              onViewDetail={() => setSelectedBookingId(booking.id)}
            />
          ))}
        </section>
      )}

      <ReservationDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onCreated={handleBookingCreated}
      />

      <BookingDetailDialog
        open={selectedBookingId !== null}
        bookingId={selectedBookingId}
        onClose={() => setSelectedBookingId(null)}
      />
    </main>
  );
}
