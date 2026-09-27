import {
  Alert,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

import { useMutation } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { addBookingPayment } from "../../api/bookings";
import type { Booking, PaymentMethod } from "../../types/booking";

interface PaymentDialogProps {
  open: boolean;
  booking: Booking;
  onClose: () => void;
  onSuccess: (booking: Booking) => void;
}

function formatCurrency(value: string | number) {
  return new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
    minimumFractionDigits: 0,
  }).format(Number(value));
}

export default function PaymentDialog({
  open,
  booking,
  onClose,
  onSuccess,
}: PaymentDialogProps) {
  const [amount, setAmount] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod | "">("");
  const [reference, setReference] = useState("");
  const [notes, setNotes] = useState("");

  useEffect(() => {
    if (open) {
      setAmount("");
      setPaymentMethod("");
      setReference("");
      setNotes("");
    }
  }, [open]);

  const mutation = useMutation({
    mutationFn: () =>
      addBookingPayment(booking.id, {
        amount: Number(amount),
        payment_method: paymentMethod as PaymentMethod,
        reference: reference.trim() || null,
        notes: notes.trim() || null,
      }),

    onSuccess: (result) => {
      onSuccess(result);
      onClose();
    },
  });

  const detail = (mutation.error as any)?.response?.data?.detail;

  return (
    <Dialog
      open={open}
      onClose={mutation.isPending ? undefined : onClose}
      fullWidth
      maxWidth="xs"
    >
      <DialogTitle
        sx={{
          fontWeight: 700,
        }}
      >
        Registrar pago
      </DialogTitle>

      <DialogContent>
        <Stack spacing={2} sx={{ mt: 1 }}>
          <Typography
            sx={{
              fontSize: 13,
              color: "text.secondary",
            }}
          >
            Saldo pendiente: <strong>{formatCurrency(booking.balance)}</strong>
          </Typography>

          {mutation.isError && (
            <Alert severity="error">
              {typeof detail === "string"
                ? detail
                : "No fue posible registrar el pago."}
            </Alert>
          )}

          <TextField
            label="Importe"
            type="number"
            value={amount}
            onChange={(event) => setAmount(event.target.value)}
            fullWidth
            required
          />

          <TextField
            select
            label="Forma de pago"
            value={paymentMethod}
            onChange={(event) =>
              setPaymentMethod(event.target.value as PaymentMethod)
            }
            fullWidth
            required
          >
            <MenuItem value="efectivo">Efectivo</MenuItem>
            <MenuItem value="transferencia">Transferencia</MenuItem>
            <MenuItem value="tarjeta">Tarjeta</MenuItem>
            <MenuItem value="otro">Otro</MenuItem>
          </TextField>

          <TextField
            label="Referencia"
            value={reference}
            onChange={(event) => setReference(event.target.value)}
            fullWidth
          />

          <TextField
            label="Observaciones"
            value={notes}
            onChange={(event) => setNotes(event.target.value)}
            multiline
            minRows={2}
            fullWidth
          />
        </Stack>
      </DialogContent>

      <DialogActions
        sx={{
          px: 3,
          pb: 2.5,
        }}
      >
        <Button color="inherit" onClick={onClose}>
          Cancelar
        </Button>

        <Button
          variant="contained"
          disabled={
            mutation.isPending ||
            !amount ||
            Number(amount) <= 0 ||
            Number(amount) > Number(booking.balance) ||
            !paymentMethod
          }
          onClick={() => mutation.mutate()}
        >
          {mutation.isPending ? "Registrando..." : "Registrar pago"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
