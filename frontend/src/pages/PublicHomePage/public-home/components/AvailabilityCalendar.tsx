import KeyboardArrowLeftOutlined from "@mui/icons-material/KeyboardArrowLeftOutlined";
import KeyboardArrowRightOutlined from "@mui/icons-material/KeyboardArrowRightOutlined";
import dayjs, { type Dayjs } from "dayjs";
import { WEEK_DAYS } from "../publicHome.data";

interface AvailabilityCalendarProps {
  currentMonth: Dayjs;
  calendarDays: Dayjs[];
  busyDates: Map<string, number>;
  eventDate: string;
  onPreviousMonth: () => void;
  onNextMonth: () => void;
  onSelectDay: (day: Dayjs) => void;
}

export default function AvailabilityCalendar({
  currentMonth,
  calendarDays,
  busyDates,
  eventDate,
  onPreviousMonth,
  onNextMonth,
  onSelectDay,
}: AvailabilityCalendarProps) {
  return (
    <div className="vi-availability-card vi-calendar">
      <div className="vi-calendar__header">
        <button type="button" className="vi-icon-button" onClick={onPreviousMonth} aria-label="Mes anterior">
          <KeyboardArrowLeftOutlined />
        </button>
        <strong>{currentMonth.format("MMMM YYYY")}</strong>
        <button type="button" className="vi-icon-button" onClick={onNextMonth} aria-label="Mes siguiente">
          <KeyboardArrowRightOutlined />
        </button>
      </div>
      <div className="vi-calendar__grid">
        {WEEK_DAYS.map((day) => <span key={day} className="vi-calendar__weekday">{day}</span>)}
        {calendarDays.map((calendarDay) => {
          const dateKey = calendarDay.format("YYYY-MM-DD");
          const bookingCount = busyDates.get(dateKey) ?? 0;
          const belongsToMonth = calendarDay.month() === currentMonth.month();
          const selected = dateKey === eventDate;
          const past = calendarDay.endOf("day").isBefore(dayjs());
          const classNames = [
            "vi-calendar__day",
            selected ? "is-selected" : "",
            bookingCount > 0 ? "is-busy" : "",
            !belongsToMonth || past ? "is-muted" : "",
            past ? "is-past" : "",
          ].filter(Boolean).join(" ");

          return (
            <button
              key={dateKey}
              type="button"
              className={classNames}
              onClick={() => !past && onSelectDay(calendarDay)}
              disabled={past}
            >
              <span>{calendarDay.format("D")}</span>
              {bookingCount > 0 && <i aria-hidden="true" />}
            </button>
          );
        })}
      </div>
      <div className="vi-calendar__legend">
        <span><i className="vi-calendar__legend-dot vi-calendar__legend-dot--busy" />Fecha con evento</span>
        <span><i className="vi-calendar__legend-dot vi-calendar__legend-dot--selected" />Fecha seleccionada</span>
      </div>
    </div>
  );
}
