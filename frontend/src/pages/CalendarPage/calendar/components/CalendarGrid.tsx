import type { Dayjs } from "dayjs";
import { WEEK_DAYS } from "../calendar.data";
import type { CalendarBooking } from "../calendar.types";
import { getBookingsForDay } from "../calendar.utils";
import CalendarDay from "./CalendarDay";

interface CalendarGridProps {
  days: Dayjs[];
  bookings: CalendarBooking[];
  currentMonth: Dayjs;
  onSelectDate: (date: string) => void;
}

export default function CalendarGrid({
  days,
  bookings,
  currentMonth,
  onSelectDate,
}: CalendarGridProps) {
  return (
    <div className="calendar-grid-scroll">
      <div className="calendar-grid">
        {WEEK_DAYS.map((day) => (
          <div key={day} className="calendar-grid__weekday">
            {day}
          </div>
        ))}

        {days.map((day) => (
          <CalendarDay
            key={day.format("YYYY-MM-DD")}
            day={day}
            bookings={getBookingsForDay(bookings, day)}
            currentMonth={currentMonth}
            onSelectDate={onSelectDate}
          />
        ))}
      </div>
    </div>
  );
}
