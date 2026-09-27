import { Chip } from "@mui/material";
import dayjs, { type Dayjs } from "dayjs";
import type { CalendarBooking } from "../calendar.types";
import { getBookingStatusStyle } from "../calendar.utils";

interface CalendarDayProps {
  day: Dayjs;
  bookings: CalendarBooking[];
  currentMonth: Dayjs;
  onSelectDate: (date: string) => void;
}

export default function CalendarDay({
  day,
  bookings,
  currentMonth,
  onSelectDate,
}: CalendarDayProps) {
  const dateKey = day.format("YYYY-MM-DD");
  const belongsToMonth = day.month() === currentMonth.month();
  const isToday = day.isSame(dayjs(), "day");

  return (
    <div
      className={[
        "calendar-day",
        belongsToMonth ? "calendar-day--current-month" : "calendar-day--outside-month",
      ].join(" ")}
      onClick={() => onSelectDate(dateKey)}
    >
      <div
        className={[
          "calendar-day__number",
          isToday ? "calendar-day__number--today" : "",
        ]
          .filter(Boolean)
          .join(" ")}
      >
        {day.format("D")}
      </div>

      <div className="calendar-day__bookings">
        {bookings.slice(0, 3).map((booking) => {
          const status = getBookingStatusStyle(booking.status);

          return (
            <div
              key={booking.id}
              className={status.className}
              title={`${status.label}: ${booking.event_type}`}
              onClick={(event) => event.stopPropagation()}
            >
              {dayjs(booking.starts_at).format("HH:mm")} {booking.event_type}
            </div>
          );
        })}

        {bookings.length > 3 && (
          <Chip
            size="small"
            label={`+${bookings.length - 3} más`}
            className="calendar-day__more"
          />
        )}
      </div>
    </div>
  );
}
