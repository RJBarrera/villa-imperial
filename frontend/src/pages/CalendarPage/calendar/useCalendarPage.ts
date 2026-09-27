import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import dayjs from "dayjs";
import "dayjs/locale/es";
import { getBookings } from "../../../api/bookings";
import type { CalendarBooking } from "./calendar.types";
import { buildCalendarDays, getCalendarStart } from "./calendar.utils";

dayjs.locale("es");

export function useCalendarPage() {
  const queryClient = useQueryClient();
  const [currentMonth, setCurrentMonth] = useState(dayjs().startOf("month"));
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string | undefined>();

  const calendarStart = useMemo(
    () => getCalendarStart(currentMonth),
    [currentMonth],
  );

  const days = useMemo(
    () => buildCalendarDays(calendarStart),
    [calendarStart],
  );

  const calendarEnd = days[days.length - 1];

  const { data: bookings = [] } = useQuery<CalendarBooking[]>({
    queryKey: [
      "bookings",
      "calendar",
      calendarStart.format("YYYY-MM-DD"),
      calendarEnd.format("YYYY-MM-DD"),
    ],
    queryFn: () =>
      getBookings({
        date_from: calendarStart.format("YYYY-MM-DD"),
        date_to: calendarEnd.format("YYYY-MM-DD"),
      }),
  });

  const openBookingForDate = (date: string) => {
    setSelectedDate(date);
    setDialogOpen(true);
  };

  const openTodayBooking = () => {
    openBookingForDate(dayjs().format("YYYY-MM-DD"));
  };

  const closeDialog = () => {
    setDialogOpen(false);
  };

  const previousMonth = () => {
    setCurrentMonth((current) => current.subtract(1, "month"));
  };

  const nextMonth = () => {
    setCurrentMonth((current) => current.add(1, "month"));
  };

  const handleBookingCreated = async () => {
    await queryClient.invalidateQueries({
      queryKey: ["bookings"],
    });
  };

  return {
    currentMonth,
    dialogOpen,
    selectedDate,
    days,
    bookings,
    openBookingForDate,
    openTodayBooking,
    closeDialog,
    previousMonth,
    nextMonth,
    handleBookingCreated,
  };
}
