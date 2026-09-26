import AddOutlined from "@mui/icons-material/AddOutlined";
import CalendarMonthOutlined from "@mui/icons-material/CalendarMonthOutlined";
import GroupsOutlined from "@mui/icons-material/GroupsOutlined";
import ScheduleOutlined from "@mui/icons-material/ScheduleOutlined";
import VisibilityOutlined from "@mui/icons-material/VisibilityOutlined";

import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Divider,
  Stack,
  Typography,
} from "@mui/material";

import { useQuery, useQueryClient } from "@tanstack/react-query";

import { useState } from "react";

import dayjs from "dayjs";
import "dayjs/locale/es";

import { getBookings } from "../api/bookings";

import ReservationDialog from "../components/bookings/ReservationDialog";
import BookingDetailDialog from "../components/bookings/BookingDetailDialog";

import type { BookingStatus } from "../types/booking";

dayjs.locale("es");

function formatCurrency(value: string | number) {
  return new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
    minimumFractionDigits: 0,
  }).format(Number(value));
}

function statusConfig(status: BookingStatus) {
  switch (status) {
    case "pendiente":
      return {
        label: "Pendiente",
        bgcolor: "#FFF5E7",
        color: "#A76714",
      };

    case "apartado":
      return {
        label: "Apartado",
        bgcolor: "#FFF0D9",
        color: "#A76714",
      };

    case "confirmado":
      return {
        label: "Confirmado",
        bgcolor: "#E8F1FF",
        color: "#2867C8",
      };

    case "liquidado":
      return {
        label: "Liquidado",
        bgcolor: "#E9F8F1",
        color: "#14724F",
      };

    case "cancelado":
      return {
        label: "Cancelado",
        bgcolor: "#FDECEC",
        color: "#B42318",
      };

    case "concluido":
      return {
        label: "Concluido",
        bgcolor: "#F2F4F7",
        color: "#475467",
      };

    case "bloqueado":
    default:
      return {
        label: "Bloqueado",
        bgcolor: "#F2F4F7",
        color: "#475467",
      };
  }
}

export default function BookingsPage() {
  const queryClient = useQueryClient();

  const [selectedBookingId, setSelectedBookingId] = useState<string | null>(
    null,
  );

  const [dialogOpen, setDialogOpen] = useState(false);

  const {
    data: bookings = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["bookings"],

    queryFn: () => getBookings(),
  });

  const handleBookingCreated = async () => {
    await queryClient.invalidateQueries({
      queryKey: ["bookings"],
    });
  };

  return (
    <Box
      sx={{
        width: "100%",
        minWidth: 0,
      }}
    >
      {/* HEADER */}

      <Box
        sx={{
          display: "flex",

          flexDirection: {
            xs: "column",
            sm: "row",
          },

          alignItems: {
            xs: "stretch",
            sm: "center",
          },

          gap: 2,
          mb: 3,
          width: "100%",
        }}
      >
        <Box
          sx={{
            minWidth: 0,
          }}
        >
          <Typography
            sx={{
              fontSize: {
                xs: 24,
                md: 28,
              },

              fontWeight: 700,
              lineHeight: 1.2,
            }}
          >
            Reservaciones
          </Typography>

          <Typography
            sx={{
              mt: 0.7,
              fontSize: 13,
              color: "text.secondary",
            }}
          >
            Administra los eventos programados de Villa Imperial.
          </Typography>
        </Box>

        <Button
          variant="contained"
          startIcon={<AddOutlined />}
          onClick={() => setDialogOpen(true)}
          sx={{
            ml: {
              sm: "auto",
            },

            minHeight: 42,

            px: 2.5,

            flexShrink: 0,

            alignSelf: {
              xs: "stretch",
              sm: "center",
            },
          }}
        >
          Nueva reservación
        </Button>
      </Box>

      {/* CARGANDO */}

      {isLoading && (
        <Card>
          <CardContent
            sx={{
              py: 10,
            }}
          >
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
              }}
            >
              <CircularProgress />
            </Box>
          </CardContent>
        </Card>
      )}

      {/* ERROR */}

      {isError && (
        <Card>
          <CardContent>
            <Typography
              color="error"
              sx={{
                fontWeight: 600,
              }}
            >
              No fue posible cargar las reservaciones.
            </Typography>

            <Typography
              sx={{
                mt: 0.5,
                fontSize: 12,
                color: "text.secondary",
              }}
            >
              Verifica que el backend se encuentre ejecutándose.
            </Typography>
          </CardContent>
        </Card>
      )}

      {/* SIN RESERVACIONES */}

      {!isLoading && !isError && bookings.length === 0 && (
        <Card>
          <CardContent
            sx={{
              py: {
                xs: 6,
                md: 8,
              },

              textAlign: "center",
            }}
          >
            <CalendarMonthOutlined
              sx={{
                fontSize: 54,
                color: "#98A2B3",
              }}
            />

            <Typography
              sx={{
                mt: 1,

                fontWeight: 700,

                fontSize: 15,
              }}
            >
              No hay reservaciones
            </Typography>

            <Typography
              sx={{
                mt: 0.5,

                fontSize: 12,

                color: "text.secondary",
              }}
            >
              Registra tu primera reservación para comenzar.
            </Typography>

            <Button
              variant="outlined"
              startIcon={<AddOutlined />}
              onClick={() => setDialogOpen(true)}
              sx={{
                mt: 2.5,
              }}
            >
              Crear reservación
            </Button>
          </CardContent>
        </Card>
      )}

      {/* LISTADO */}

      {!isLoading && !isError && bookings.length > 0 && (
        <Stack spacing={1.5}>
          {bookings.map((booking) => {
            const config = statusConfig(booking.status);

            return (
              <Card
                key={booking.id}
                sx={{
                  transition: "transform .2s ease, box-shadow .2s ease",

                  "&:hover": {
                    transform: "translateY(-1px)",

                    boxShadow: "0 8px 25px rgba(16,24,40,.07)",
                  },
                }}
              >
                <CardContent
                  sx={{
                    p: {
                      xs: 1.8,
                      sm: 2.2,
                    },

                    "&:last-child": {
                      pb: {
                        xs: 1.8,
                        sm: 2.2,
                      },
                    },
                  }}
                >
                  <Stack
                    direction={{
                      xs: "column",
                      md: "row",
                    }}
                    sx={{
                      justifyContent: "space-between",

                      gap: 2.5,
                    }}
                  >
                    {/* INFORMACIÓN DEL EVENTO */}

                    <Stack
                      direction="row"
                      spacing={{
                        xs: 1.4,
                        sm: 2,
                      }}
                      sx={{
                        minWidth: 0,
                        flex: 1,
                      }}
                    >
                      {/* FECHA */}

                      <Box
                        sx={{
                          width: 66,
                          minWidth: 66,
                          height: 66,

                          borderRadius: "15px",

                          bgcolor: "#F3F6F8",

                          display: "flex",

                          flexDirection: "column",

                          alignItems: "center",

                          justifyContent: "center",
                        }}
                      >
                        <Typography
                          sx={{
                            fontSize: 22,

                            lineHeight: 1,

                            fontWeight: 700,
                          }}
                        >
                          {dayjs(booking.starts_at).format("DD")}
                        </Typography>

                        <Typography
                          sx={{
                            mt: 0.4,

                            fontSize: 10,

                            fontWeight: 600,

                            textTransform: "uppercase",

                            color: "text.secondary",
                          }}
                        >
                          {dayjs(booking.starts_at).format("MMM")}
                        </Typography>
                      </Box>

                      {/* DETALLE */}

                      <Box
                        sx={{
                          minWidth: 0,
                          flex: 1,
                        }}
                      >
                        <Box
                          sx={{
                            display: "flex",

                            flexDirection: "row",

                            gap: 1,

                            alignItems: "center",

                            flexWrap: "wrap",
                          }}
                        >
                          <Typography
                            sx={{
                              fontSize: 15,

                              fontWeight: 700,
                            }}
                          >
                            {booking.event_type}
                          </Typography>

                          <Chip
                            label={config.label}
                            size="small"
                            sx={{
                              height: 23,

                              fontSize: 10,

                              fontWeight: 600,

                              bgcolor: config.bgcolor,

                              color: config.color,
                            }}
                          />
                        </Box>

                        <Typography
                          sx={{
                            mt: 0.4,

                            fontSize: 13,

                            fontWeight: 500,
                          }}
                        >
                          {booking.client.full_name}
                        </Typography>

                        <Stack
                          direction={{
                            xs: "column",

                            sm: "row",
                          }}
                          spacing={{
                            xs: 0.5,

                            sm: 1.8,
                          }}
                          sx={{
                            mt: 0.8,
                          }}
                        >
                          {/* HORARIO */}

                          <Stack
                            direction="row"
                            spacing={0.6}
                            sx={{
                              alignItems: "center",
                            }}
                          >
                            <ScheduleOutlined
                              sx={{
                                fontSize: 15,

                                color: "text.secondary",
                              }}
                            />

                            <Typography
                              sx={{
                                fontSize: 11,

                                color: "text.secondary",
                              }}
                            >
                              {dayjs(booking.starts_at).format("h:mm A")}

                              {" - "}

                              {dayjs(booking.ends_at).format("h:mm A")}
                            </Typography>
                          </Stack>

                          {/* PERSONAS */}

                          <Stack
                            direction="row"
                            spacing={0.6}
                            sx={{
                              alignItems: "center",
                            }}
                          >
                            <GroupsOutlined
                              sx={{
                                fontSize: 15,

                                color: "text.secondary",
                              }}
                            />

                            <Typography
                              sx={{
                                fontSize: 11,

                                color: "text.secondary",
                              }}
                            >
                              {booking.guest_count
                                ? `${booking.guest_count} personas`
                                : "Personas sin definir"}
                            </Typography>
                          </Stack>
                        </Stack>

                        <Typography
                          sx={{
                            mt: 0.6,

                            fontSize: 11,

                            color: "#98A2B3",

                            overflow: "hidden",

                            textOverflow: "ellipsis",

                            whiteSpace: {
                              xs: "normal",

                              sm: "nowrap",
                            },
                          }}
                        >
                          {booking.package_name_snapshot}

                          {" · "}

                          {booking.folio}
                        </Typography>
                      </Box>
                    </Stack>

                    {/* INFORMACIÓN FINANCIERA */}

                    <Box
                      sx={{
                        width: {
                          xs: "100%",

                          md: 220,
                        },

                        minWidth: {
                          md: 220,
                        },

                        p: {
                          xs: 1.5,
                          md: 0,
                        },

                        borderRadius: {
                          xs: "12px",

                          md: 0,
                        },

                        bgcolor: {
                          xs: "#F8FAFC",

                          md: "transparent",
                        },
                      }}
                    >
                      <Stack
                        direction="row"
                        spacing={3}
                        sx={{
                          justifyContent: "space-between",
                        }}
                      >
                        <Typography
                          sx={{
                            fontSize: 11,

                            color: "text.secondary",
                          }}
                        >
                          Total
                        </Typography>

                        <Typography
                          sx={{
                            fontSize: 13,

                            fontWeight: 700,
                          }}
                        >
                          {formatCurrency(booking.final_price)}
                        </Typography>
                      </Stack>

                      <Stack
                        direction="row"
                        spacing={3}
                        sx={{
                          justifyContent: "space-between",

                          mt: 0.6,
                        }}
                      >
                        <Typography
                          sx={{
                            fontSize: 11,

                            color: "text.secondary",
                          }}
                        >
                          Pagado
                        </Typography>

                        <Typography
                          sx={{
                            fontSize: 12,

                            fontWeight: 600,

                            color: "success.main",
                          }}
                        >
                          {formatCurrency(booking.total_paid)}
                        </Typography>
                      </Stack>

                      <Divider
                        sx={{
                          my: 1,
                        }}
                      />

                      <Stack
                        direction="row"
                        spacing={3}
                        sx={{
                          justifyContent: "space-between",
                        }}
                      >
                        <Typography
                          sx={{
                            fontSize: 11,

                            color: "text.secondary",
                          }}
                        >
                          Pendiente
                        </Typography>

                        <Typography
                          sx={{
                            fontSize: 13,

                            fontWeight: 700,

                            color:
                              Number(booking.balance) > 0
                                ? "warning.main"
                                : "success.main",
                          }}
                        >
                          {formatCurrency(booking.balance)}
                        </Typography>
                      </Stack>

                      {/* VER DETALLE */}

                      <Button
                        variant="outlined"
                        size="small"
                        fullWidth
                        startIcon={<VisibilityOutlined />}
                        onClick={() => setSelectedBookingId(booking.id)}
                        sx={{
                          mt: 1.8,

                          minHeight: 36,
                        }}
                      >
                        Ver detalle
                      </Button>
                    </Box>
                  </Stack>
                </CardContent>
              </Card>
            );
          })}
        </Stack>
      )}

      {/* NUEVA RESERVACIÓN */}

      <ReservationDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onCreated={handleBookingCreated}
      />

      {/* DETALLE DE RESERVACIÓN */}

      <BookingDetailDialog
        open={selectedBookingId !== null}
        bookingId={selectedBookingId}
        onClose={() => setSelectedBookingId(null)}
      />
    </Box>
  );
}
