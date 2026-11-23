import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Button, Card, CardContent, Typography } from "@mui/material";
import { useMemo, useState } from "react";
import { getBookings } from "../../api/bookings";
import BookingDetailDialog from "../../components/bookings/BookingDetailDialog";
import ReservationDialog from "../../components/bookings/ReservationDialog";
import BookingCard from "./bookings/components/BookingCard";
import BookingsHeader from "./bookings/components/BookingsHeader";
import BookingsSearch from "./bookings/components/BookingsSearch";
import BookingsState from "./bookings/components/BookingsState";
import { filterBookings } from "./bookings/bookings.filters";
import type { BookingListItem } from "./bookings/bookings.types";
import "./BookingsPage.css";

export default function BookingsPage() {
  const queryClient = useQueryClient();
  const [selectedBookingId, setSelectedBookingId] = useState<string | null>(
    null,
  );
  const [dialogOpen, setDialogOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedDate, setSelectedDate] = useState("");

  const {
    data: bookings = [],
    isLoading,
    isError,
  } = useQuery<BookingListItem[]>({
    queryKey: ["bookings"],
    queryFn: () => getBookings(),
  });

  const filteredBookings = useMemo(
    () => filterBookings(bookings, search, selectedDate),
    [bookings, search, selectedDate],
  );
  const hasFilters = Boolean(search.trim() || selectedDate);

  const handleBookingCreated = async () => {
    await queryClient.invalidateQueries({ queryKey: ["bookings"] });
  };

  const clearFilters = () => {
    setSearch("");
    setSelectedDate("");
  };

  return (
    <main className="bookings-page">
      <BookingsHeader onCreate={() => setDialogOpen(true)} />

      <BookingsSearch
        search={search}
        date={selectedDate}
        total={bookings.length}
        matched={filteredBookings.length}
        onSearchChange={setSearch}
        onDateChange={setSelectedDate}
        onClear={clearFilters}
      />

      <div
        className="bookings-scroll"
        role="region"
        aria-label="Listado de reservaciones"
        tabIndex={0}
      >
        <BookingsState
          isLoading={isLoading}
          isError={isError}
          isEmpty={!isLoading && !isError && bookings.length === 0}
          onCreate={() => setDialogOpen(true)}
        />

        {!isLoading &&
          !isError &&
          bookings.length > 0 &&
          (filteredBookings.length > 0 ? (
            <section className="bookings-list">
              {filteredBookings.map((booking) => (
                <BookingCard
                  key={booking.id}
                  booking={booking}
                  onViewDetail={() => setSelectedBookingId(booking.id)}
                />
              ))}
            </section>
          ) : hasFilters ? (
            <Card className="bookings-state-card">
              <CardContent className="bookings-search-empty">
                <Typography
                  component="h2"
                  className="bookings-search-empty__title"
                >
                  No encontramos reservaciones
                </Typography>
                <Typography className="bookings-search-empty__description">
                  Prueba con otro nombre, fecha, folio o tipo de evento.
                </Typography>
                <Button variant="outlined" onClick={clearFilters}>
                  Limpiar filtros
                </Button>
              </CardContent>
            </Card>
          ) : null)}
      </div>

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
