import AccountBalanceWalletOutlined from "@mui/icons-material/AccountBalanceWalletOutlined";
import CancelOutlined from "@mui/icons-material/CancelOutlined";
import CheckCircleOutlined from "@mui/icons-material/CheckCircleOutlined";
import CloseOutlined from "@mui/icons-material/CloseOutlined";
import EditOutlined from "@mui/icons-material/EditOutlined";
import EditBookingDialog from "./EditBookingDialog";
import EventOutlined from "@mui/icons-material/EventOutlined";
import GroupsOutlined from "@mui/icons-material/GroupsOutlined";
import PaidOutlined from "@mui/icons-material/PaidOutlined";
import PrintOutlined from "@mui/icons-material/PrintOutlined";
import ScheduleOutlined from "@mui/icons-material/ScheduleOutlined";

import {
  Alert,
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import dayjs from "dayjs";

import {
  cancelBooking,
  getBooking,
  updateBookingStatus,
} from "../../api/bookings";

import { printBookingReceipt } from "../../utils/bookingReceipt";
import PaymentDialog from "./PaymentDialog";
import type { Booking, BookingStatus } from "../../types/booking";

interface BookingDetailDialogProps {
  open: boolean;
  bookingId: string | null;
  onClose: () => void;
}

function currency(value: string | number) {
  return new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
    minimumFractionDigits: 0,
  }).format(Number(value));
}

function statusLabel(status: BookingStatus) {
  const labels: Record<BookingStatus, string> = {
    pendiente: "Pendiente",
    apartado: "Apartado",
    confirmado: "Confirmado",
    liquidado: "Liquidado",
    concluido: "Concluido",
    cancelado: "Cancelado",
    bloqueado: "Bloqueado",
  };

  return labels[status];
}

export default function BookingDetailDialog({
  open,
  bookingId,
  onClose,
}: BookingDetailDialogProps) {
  const queryClient = useQueryClient();
  const [paymentOpen, setPaymentOpen] = useState(false);
  const [cancelOpen, setCancelOpen] = useState(false);
  const [cancellationReason, setCancellationReason] = useState("");
  const [editOpen, setEditOpen] = useState(false);

  const {
    data: booking,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["booking", bookingId],
    queryFn: () => getBooking(bookingId!),
    enabled: open && !!bookingId,
  });

  const refresh = async () => {
    await queryClient.invalidateQueries({
      queryKey: ["booking", bookingId],
    });

    await queryClient.invalidateQueries({
      queryKey: ["bookings"],
    });
  };

  const statusMutation = useMutation({
    mutationFn: (status: BookingStatus) =>
      updateBookingStatus(bookingId!, status),

    onSuccess: refresh,
  });

  const cancelMutation = useMutation({
    mutationFn: () => cancelBooking(bookingId!, cancellationReason),

    onSuccess: async () => {
      setCancelOpen(false);
      setCancellationReason("");
      await refresh();
    },
  });

  const handlePaymentSuccess = async (_: Booking) => {
    await refresh();
  };

  if (!bookingId) {
    return null;
  }

  return (
    <>
      <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
        <DialogTitle
          sx={{
            pr: 7,
          }}
        >
          <Typography
            sx={{
              fontSize: 20,
              fontWeight: 700,
            }}
          >
            Detalle de reservación
          </Typography>

          {booking && (
            <Typography
              sx={{
                mt: 0.3,
                fontSize: 12,
                color: "text.secondary",
              }}
            >
              {booking.folio}
            </Typography>
          )}

          <IconButton
            onClick={onClose}
            sx={{
              position: "absolute",
              right: 16,
              top: 14,
            }}
          >
            <CloseOutlined />
          </IconButton>
        </DialogTitle>

        <DialogContent dividers>
          {isLoading && <Typography>Cargando...</Typography>}

          {isError && (
            <Alert severity="error">
              No fue posible consultar la reservación.
            </Alert>
          )}

          {booking && (
            <Stack spacing={3}>
              <Stack
                direction={{
                  xs: "column",
                  sm: "row",
                }}
                sx={{ justifyContent: "space-between" }}
                spacing={2}
              >
                <Box>
                  <Typography
                    sx={{
                      fontSize: 22,
                      fontWeight: 700,
                    }}
                  >
                    {booking.event_type}
                  </Typography>

                  <Typography
                    sx={{
                      mt: 0.3,
                      fontSize: 13,
                      color: "text.secondary",
                    }}
                  >
                    {booking.client.full_name}
                  </Typography>
                </Box>

                <Chip
                  label={statusLabel(booking.status)}
                  sx={{
                    alignSelf: {
                      xs: "flex-start",
                      sm: "center",
                    },

                    fontWeight: 600,
                  }}
                />
              </Stack>

              <Divider />

              <Box
                sx={{
                  display: "grid",

                  gridTemplateColumns: {
                    xs: "1fr",
                    sm: "1fr 1fr",
                  },

                  gap: 2.5,
                }}
              >
                <Info
                  icon={<EventOutlined />}
                  label="Fecha"
                  value={dayjs(booking.starts_at).format("DD/MM/YYYY")}
                />

                <Info
                  icon={<ScheduleOutlined />}
                  label="Horario"
                  value={`${dayjs(booking.starts_at).format(
                    "h:mm A",
                  )} - ${dayjs(booking.ends_at).format("h:mm A")}`}
                />

                <Info
                  icon={<GroupsOutlined />}
                  label="Personas"
                  value={
                    booking.guest_count
                      ? `${booking.guest_count}`
                      : "Sin definir"
                  }
                />

                <Info
                  icon={<AccountBalanceWalletOutlined />}
                  label="Paquete"
                  value={booking.package_name_snapshot}
                />
              </Box>

              <Box
                sx={{
                  p: 2.3,

                  bgcolor: "#F7F9FB",

                  border: "1px solid #EAECF0",

                  borderRadius: "15px",
                }}
              >
                <Typography
                  sx={{
                    fontSize: 14,
                    fontWeight: 700,
                    mb: 1.5,
                  }}
                >
                  Resumen financiero
                </Typography>

                <FinancialRow
                  label="Precio"
                  value={currency(booking.agreed_price)}
                />

                <FinancialRow
                  label="Descuento"
                  value={currency(booking.discount)}
                />

                <Divider
                  sx={{
                    my: 1,
                  }}
                />

                <FinancialRow
                  label="Total"
                  value={currency(booking.final_price)}
                  strong
                />

                <FinancialRow
                  label="Pagado"
                  value={currency(booking.total_paid)}
                />

                <FinancialRow
                  label="Pendiente"
                  value={currency(booking.balance)}
                  strong
                />
              </Box>

              <Box>
                <Stack
                  direction="row"
                  sx={{
                    justifyContent: "space-between",
                    alignItems: "center",
                    mb: 1.5,
                  }}
                >
                  <Typography
                    sx={{
                      fontSize: 15,
                      fontWeight: 700,
                    }}
                  >
                    Historial de pagos
                  </Typography>

                  {booking.status !== "cancelado" &&
                    Number(booking.balance) > 0 && (
                      <Button
                        size="small"
                        startIcon={<PaidOutlined />}
                        onClick={() => setPaymentOpen(true)}
                      >
                        Registrar pago
                      </Button>
                    )}
                </Stack>

                {booking.payments.length === 0 ? (
                  <Typography
                    sx={{
                      py: 2,
                      fontSize: 12,
                      color: "text.secondary",
                    }}
                  >
                    Aún no existen pagos registrados.
                  </Typography>
                ) : (
                  <Stack spacing={1}>
                    {booking.payments.map((payment) => (
                      <Box
                        key={payment.id}
                        sx={{
                          p: 1.5,

                          border: "1px solid #EAECF0",
                          borderRadius: "12px",
                          display: "flex",
                          justifyContent: "space-between",
                          gap: 2,
                        }}
                      >
                        <Box>
                          <Typography
                            sx={{
                              fontSize: 12,
                              fontWeight: 600,
                              textTransform: "capitalize",
                            }}
                          >
                            {payment.payment_type}
                          </Typography>

                          <Typography
                            sx={{
                              mt: 0.3,
                              fontSize: 10.5,
                              color: "text.secondary",
                            }}
                          >
                            {dayjs(payment.paid_at).format("DD/MM/YYYY h:mm A")}
                            {" · "}
                            {payment.payment_method}
                          </Typography>
                        </Box>

                        <Typography
                          sx={{
                            fontWeight: 700,
                            fontSize: 13,
                          }}
                        >
                          {currency(payment.amount)}
                        </Typography>
                      </Box>
                    ))}
                  </Stack>
                )}
              </Box>

              {booking.notes && (
                <Box>
                  <Typography
                    sx={{
                      fontSize: 13,
                      fontWeight: 700,
                    }}
                  >
                    Observaciones
                  </Typography>

                  <Typography
                    sx={{
                      mt: 0.6,
                      fontSize: 12,
                      color: "text.secondary",
                    }}
                  >
                    {booking.notes}
                  </Typography>
                </Box>
              )}

              {booking.status === "cancelado" && (
                <Alert severity="error">
                  Reservación cancelada.
                  {booking.cancellation_reason
                    ? ` Motivo: ${booking.cancellation_reason}`
                    : ""}
                </Alert>
              )}
            </Stack>
          )}
        </DialogContent>

        {booking && (
          <DialogActions
            sx={{
              px: 3,
              py: 2,

              flexWrap: "wrap",
              gap: 1,
            }}
          >
            {booking.status !== "cancelado" && (
              <Button
                startIcon={<EditOutlined />}
                onClick={() => setEditOpen(true)}
              >
                Editar
              </Button>
            )}
            <Button
              startIcon={<PrintOutlined />}
              onClick={() => printBookingReceipt(booking)}
            >
              Comprobante
            </Button>

            {booking.status !== "cancelado" &&
              booking.status !== "concluido" && (
                <>
                  {booking.status !== "confirmado" &&
                    booking.status !== "liquidado" && (
                      <Button
                        startIcon={<CheckCircleOutlined />}
                        onClick={() => statusMutation.mutate("confirmado")}
                      >
                        Confirmar
                      </Button>
                    )}

                  <Button
                    color="error"
                    startIcon={<CancelOutlined />}
                    onClick={() => setCancelOpen(true)}
                  >
                    Cancelar
                  </Button>
                </>
              )}

            {(booking.status === "confirmado" ||
              booking.status === "liquidado") && (
              <Button
                variant="outlined"
                onClick={() => statusMutation.mutate("concluido")}
              >
                Marcar concluido
              </Button>
            )}
          </DialogActions>
        )}
      </Dialog>

      {booking && (
        <PaymentDialog
          open={paymentOpen}
          booking={booking}
          onClose={() => setPaymentOpen(false)}
          onSuccess={handlePaymentSuccess}
        />
      )}
      {booking && (
        <EditBookingDialog
          open={editOpen}
          booking={booking}
          onClose={() => setEditOpen(false)}
          onUpdated={async () => {
            await refresh();
          }}
        />
      )}

      <Dialog
        open={cancelOpen}
        onClose={() => setCancelOpen(false)}
        fullWidth
        maxWidth="xs"
      >
        <DialogTitle
          sx={{
            fontWeight: 700,
          }}
        >
          Cancelar reservación
        </DialogTitle>

        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <Alert severity="warning">
              La reservación dejará de bloquear el horario. Los pagos existentes
              se conservarán.
            </Alert>

            <TextField
              label="Motivo de cancelación"
              value={cancellationReason}
              onChange={(event) => setCancellationReason(event.target.value)}
              multiline
              minRows={3}
              fullWidth
              required
            />
          </Stack>
        </DialogContent>

        <DialogActions
          sx={{
            px: 3,
            pb: 2.5,
          }}
        >
          <Button color="inherit" onClick={() => setCancelOpen(false)}>
            Regresar
          </Button>

          <Button
            color="error"
            variant="contained"
            startIcon={<CancelOutlined />}
            disabled={
              cancellationReason.trim().length < 3 || cancelMutation.isPending
            }
            onClick={() => cancelMutation.mutate()}
          >
            Cancelar reservación
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

interface InfoProps {
  icon: React.ReactNode;
  label: string;
  value: string;
}

function Info({ icon, label, value }: InfoProps) {
  return (
    <Stack direction="row" spacing={1.3}>
      <Box
        sx={{
          color: "primary.main",
          "& svg": {
            fontSize: 20,
          },
        }}
      >
        {icon}
      </Box>

      <Box>
        <Typography
          sx={{
            fontSize: 10.5,
            color: "text.secondary",
          }}
        >
          {label}
        </Typography>

        <Typography
          sx={{
            mt: 0.2,
            fontSize: 13,
            fontWeight: 600,
          }}
        >
          {value}
        </Typography>
      </Box>
    </Stack>
  );
}

interface FinancialRowProps {
  label: string;
  value: string;
  strong?: boolean;
}

function FinancialRow({ label, value, strong = false }: FinancialRowProps) {
  return (
    <Stack direction="row" sx={{ justifyContent: "space-between", py: 0.5 }}>
      <Typography
        sx={{
          fontSize: 12,
          color: strong ? "text.primary" : "text.secondary",
          fontWeight: strong ? 700 : 400,
        }}
      >
        {label}
      </Typography>

      <Typography
        sx={{
          fontSize: 13,
          fontWeight: strong ? 700 : 500,
        }}
      >
        {value}
      </Typography>
    </Stack>
  );
}
