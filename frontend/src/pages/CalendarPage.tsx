import {
  AddOutlined,
  ChevronLeftOutlined,
  ChevronRightOutlined,
} from "@mui/icons-material";

import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";

import { useQuery, useQueryClient } from "@tanstack/react-query";

import { useMemo, useState } from "react";

import dayjs from "dayjs";

import "dayjs/locale/es";

import { getBookings } from "../api/bookings";

import ReservationDialog from "../components/bookings/ReservationDialog";

import type { BookingStatus } from "../types/booking";

dayjs.locale("es");

const WEEK_DAYS = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"];

function bookingColor(status: BookingStatus) {
  switch (status) {
    case "pendiente":
      return {
        bg: "#FFF5E7",
        color: "#A76714",
      };

    case "apartado":
      return {
        bg: "#FFF0D9",
        color: "#A76714",
      };

    case "confirmado":
      return {
        bg: "#E8F1FF",
        color: "#2867C8",
      };

    case "liquidado":
      return {
        bg: "#E9F8F1",
        color: "#14724F",
      };

    case "cancelado":
      return {
        bg: "#FDECEC",
        color: "#B42318",
      };

    default:
      return {
        bg: "#F2F4F7",
        color: "#475467",
      };
  }
}

export default function CalendarPage() {
  const queryClient = useQueryClient();

  const [currentMonth, setCurrentMonth] = useState(dayjs().startOf("month"));

  const [dialogOpen, setDialogOpen] = useState(false);

  const [selectedDate, setSelectedDate] = useState<string | undefined>(
    undefined,
  );

  const calendarStart = useMemo(() => {
    const first = currentMonth.startOf("month");

    const mondayIndex = (first.day() + 6) % 7;

    return first.subtract(mondayIndex, "day");
  }, [currentMonth]);

  const days = useMemo(
    () =>
      Array.from(
        {
          length: 42,
        },
        (_, index) => calendarStart.add(index, "day"),
      ),
    [calendarStart],
  );

  const calendarEnd = days[days.length - 1];

  const { data: bookings = [] } = useQuery({
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

  return (
    <Box>
      <Stack
        direction={{
          xs: "column",
          sm: "row",
        }}
        spacing={2}
        sx={{
          justifyContent: "space-between",
          alignItems: {
            xs: "stretch",
            sm: "center",
          },
          mb: 3,
        }}
      >
        <Box>
          <Typography
            sx={{
              fontSize: {
                xs: 24,
                md: 28,
              },
              fontWeight: 700,
            }}
          >
            Calendario
          </Typography>

          <Typography
            sx={{
              mt: 0.7,
              fontSize: 13,
              color: "text.secondary",
            }}
          >
            Consulta disponibilidad y eventos programados.
          </Typography>
        </Box>

        <Button
          variant="contained"
          startIcon={<AddOutlined />}
          onClick={() => {
            setSelectedDate(dayjs().format("YYYY-MM-DD"));

            setDialogOpen(true);
          }}
        >
          Nueva reservación
        </Button>
      </Stack>

      <Card>
        <CardContent
          sx={{
            p: {
              xs: 1.2,
              sm: 2,
            },

            "&:last-child": {
              pb: {
                xs: 1.2,
                sm: 2,
              },
            },
          }}
        >
          <Stack
            direction="row"
            sx={{
              justifyContent: "space-between",
              alignItems: "center",
              mb: 2,
            }}
          >
            <IconButton
              onClick={() =>
                setCurrentMonth((current) => current.subtract(1, "month"))
              }
            >
              <ChevronLeftOutlined />
            </IconButton>

            <Typography
              sx={{
                fontSize: {
                  xs: 16,
                  sm: 18,
                },
                fontWeight: 700,
                textTransform: "capitalize",
              }}
            >
              {currentMonth.format("MMMM YYYY")}
            </Typography>

            <IconButton
              onClick={() =>
                setCurrentMonth((current) => current.add(1, "month"))
              }
            >
              <ChevronRightOutlined />
            </IconButton>
          </Stack>

          <Box
            sx={{
              overflowX: "auto",
            }}
          >
            <Box
              sx={{
                minWidth: 760,
                display: "grid",
                gridTemplateColumns: "repeat(7, 1fr)",
              }}
            >
              {WEEK_DAYS.map((day) => (
                <Box
                  key={day}
                  sx={{
                    py: 1,
                    textAlign: "center",
                    fontSize: 11,
                    fontWeight: 700,
                    color: "text.secondary",
                  }}
                >
                  {day}
                </Box>
              ))}

              {days.map((day) => {
                const dateKey = day.format("YYYY-MM-DD");

                const dayBookings = bookings.filter(
                  (booking) =>
                    dayjs(booking.starts_at).format("YYYY-MM-DD") === dateKey,
                );

                const belongsToMonth = day.month() === currentMonth.month();

                const isToday = day.isSame(dayjs(), "day");

                return (
                  <Box
                    key={dateKey}
                    onClick={() => openBookingForDate(dateKey)}
                    sx={{
                      minHeight: 126,

                      p: 1,

                      borderTop: "1px solid #EAECF0",

                      borderRight: "1px solid #EAECF0",

                      cursor: "pointer",

                      bgcolor: belongsToMonth ? "#FFFFFF" : "#FAFBFC",

                      transition: "background-color .15s",

                      "&:hover": {
                        bgcolor: "#F6F8FA",
                      },
                    }}
                  >
                    <Box
                      sx={{
                        width: 28,
                        height: 28,

                        borderRadius: "50%",

                        display: "flex",

                        alignItems: "center",

                        justifyContent: "center",

                        fontSize: 11,

                        fontWeight: isToday ? 700 : 500,

                        bgcolor: isToday ? "primary.main" : "transparent",

                        color: isToday
                          ? "#FFFFFF"
                          : belongsToMonth
                            ? "text.primary"
                            : "#98A2B3",
                      }}
                    >
                      {day.format("D")}
                    </Box>

                    <Stack spacing={0.5} sx={{ mt: 0.5 }}>
                      {dayBookings.slice(0, 3).map((booking) => {
                        const colors = bookingColor(booking.status);

                        return (
                          <Box
                            key={booking.id}
                            onClick={(event) => event.stopPropagation()}
                            sx={{
                              px: 0.8,
                              py: 0.6,

                              borderRadius: "7px",

                              bgcolor: colors.bg,

                              color: colors.color,

                              fontSize: 9.5,

                              fontWeight: 600,

                              overflow: "hidden",

                              whiteSpace: "nowrap",

                              textOverflow: "ellipsis",
                            }}
                          >
                            {dayjs(booking.starts_at).format("HH:mm")}{" "}
                            {booking.event_type}
                          </Box>
                        );
                      })}

                      {dayBookings.length > 3 && (
                        <Chip
                          size="small"
                          label={`+${dayBookings.length - 3} más`}
                          sx={{
                            height: 19,
                            fontSize: 9,
                          }}
                        />
                      )}
                    </Stack>
                  </Box>
                );
              })}
            </Box>
          </Box>
        </CardContent>
      </Card>

      <ReservationDialog
        open={dialogOpen}
        initialDate={selectedDate}
        onClose={() => setDialogOpen(false)}
        onCreated={() => {
          queryClient.invalidateQueries({
            queryKey: ["bookings"],
          });
        }}
      />
    </Box>
  );
}
