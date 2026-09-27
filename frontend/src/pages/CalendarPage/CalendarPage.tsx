import ReservationDialog from "../../components/bookings/ReservationDialog";
import CalendarGrid from "./calendar/components/CalendarGrid";
import CalendarHeader from "./calendar/components/CalendarHeader";
import CalendarToolbar from "./calendar/components/CalendarToolbar";
import { useCalendarPage } from "./calendar/useCalendarPage";
import "./CalendarPage.css";

export default function CalendarPage() {
  const calendar = useCalendarPage();

  return (
    <main className="calendar-page">
      <CalendarHeader onCreateToday={calendar.openTodayBooking} />

      <section className="calendar-card">
        <CalendarToolbar
          currentMonth={calendar.currentMonth}
          onPreviousMonth={calendar.previousMonth}
          onNextMonth={calendar.nextMonth}
        />

        <CalendarGrid
          days={calendar.days}
          bookings={calendar.bookings}
          currentMonth={calendar.currentMonth}
          onSelectDate={calendar.openBookingForDate}
        />
      </section>

      <ReservationDialog
        open={calendar.dialogOpen}
        initialDate={calendar.selectedDate}
        onClose={calendar.closeDialog}
        onCreated={calendar.handleBookingCreated}
      />
    </main>
  );
}
