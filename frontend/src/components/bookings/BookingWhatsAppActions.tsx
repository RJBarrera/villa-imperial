import CalendarMonthOutlined from "@mui/icons-material/CalendarMonthOutlined";
import CheckCircleOutlineOutlined from "@mui/icons-material/CheckCircleOutlineOutlined";
import ReceiptLongOutlined from "@mui/icons-material/ReceiptLongOutlined";
import WhatsApp from "@mui/icons-material/WhatsApp";
import AccountBalanceWalletOutlined from "@mui/icons-material/AccountBalanceWalletOutlined";
import {
  Alert,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Typography,
} from "@mui/material";
import dayjs from "dayjs";
import { useState } from "react";
import type { Booking } from "../../types/booking";
import {
  buildBookingWhatsAppMessage,
  createBookingWhatsAppLink,
  normalizeClientWhatsApp,
  type BookingWhatsAppAction,
} from "../../utils/bookingWhatsapp";
import "./BookingWhatsAppActions.css";

interface BookingWhatsAppActionsProps {
  booking: Booking;
}

const TITLES: Record<BookingWhatsAppAction, string> = {
  resumen: "Enviar resumen",
  confirmacion: "Enviar confirmación",
  evento: "Recordar evento",
  pago: "Recordar pago pendiente",
};

export default function BookingWhatsAppActions({
  booking,
}: BookingWhatsAppActionsProps) {
  const [action, setAction] = useState<BookingWhatsAppAction | null>(null);
  const [message, setMessage] = useState("");

  const phoneValid = Boolean(normalizeClientWhatsApp(booking.client.phone));
  const inactive =
    booking.status === "cancelado" || booking.status === "bloqueado";
  const canConfirm =
    booking.status === "confirmado" || booking.status === "liquidado";
  const canRemindEvent =
    !inactive &&
    booking.status !== "concluido" &&
    dayjs(booking.starts_at).isAfter(dayjs());
  const canRemindPayment = !inactive && Number(booking.balance) > 0;

  const openPreview = (nextAction: BookingWhatsAppAction) => {
    setMessage(buildBookingWhatsAppMessage(booking, nextAction));
    setAction(nextAction);
  };

  const closePreview = () => {
    setAction(null);
    setMessage("");
  };

  const whatsappLink = createBookingWhatsAppLink(booking.client.phone, message);

  return (
    <>
      <Box className="booking-whatsapp">
        <Box className="booking-whatsapp__heading">
          <WhatsApp className="booking-whatsapp__logo" />
          <Box>
            <Typography className="booking-whatsapp__title">
              Comunicación por WhatsApp
            </Typography>
            <Typography className="booking-whatsapp__subtitle">
              Prepara un mensaje y confirma su envío desde tu WhatsApp.
            </Typography>
          </Box>
        </Box>

        {!phoneValid && (
          <Alert severity="warning" className="booking-whatsapp__alert">
            El teléfono de este cliente no tiene un formato válido para
            WhatsApp. Revisa su número antes de intentar enviar un mensaje.
          </Alert>
        )}

        <div className="booking-whatsapp__actions">
          <Button
            variant="outlined"
            color="inherit"
            startIcon={<ReceiptLongOutlined />}
            disabled={!phoneValid}
            onClick={() => openPreview("resumen")}
          >
            Resumen de reservación
          </Button>

          <Button
            variant="outlined"
            color="inherit"
            startIcon={<CheckCircleOutlineOutlined />}
            disabled={!phoneValid || !canConfirm}
            onClick={() => openPreview("confirmacion")}
          >
            Confirmación
          </Button>

          <Button
            variant="outlined"
            color="inherit"
            startIcon={<CalendarMonthOutlined />}
            disabled={!phoneValid || !canRemindEvent}
            onClick={() => openPreview("evento")}
          >
            Recordar evento
          </Button>

          <Button
            variant="outlined"
            color="inherit"
            startIcon={<AccountBalanceWalletOutlined />}
            disabled={!phoneValid || !canRemindPayment}
            onClick={() => openPreview("pago")}
          >
            Recordar pago
          </Button>
        </div>

        <Typography className="booking-whatsapp__hint">
          Los recordatorios no se envían automáticamente. El comprobante
          imprimible sigue disponible en el botón Comprobante.
        </Typography>
      </Box>

      <Dialog
        open={Boolean(action)}
        onClose={closePreview}
        fullWidth
        maxWidth="sm"
        className="booking-whatsapp-dialog"
      >
        <DialogTitle>{action ? TITLES[action] : "WhatsApp"}</DialogTitle>
        <DialogContent>
          <Typography className="booking-whatsapp-dialog__recipient">
            Para: {booking.client.full_name} · {booking.client.phone}
          </Typography>
          <TextField
            label="Mensaje"
            value={message}
            onChange={(event) => setMessage(event.target.value)}
            multiline
            minRows={8}
            maxRows={14}
            fullWidth
            className="booking-whatsapp-dialog__message"
          />
          <Alert severity="info" className="booking-whatsapp-dialog__notice">
            Se abrirá WhatsApp con el texto preparado. Tendrás que pulsar Enviar
            allí; esta acción no registra un envío confirmado.
          </Alert>
        </DialogContent>
        <DialogActions className="booking-whatsapp-dialog__footer">
          <Button color="inherit" onClick={closePreview}>
            Cancelar
          </Button>
          <Button
            variant="contained"
            color="success"
            startIcon={<WhatsApp />}
            component="a"
            href={whatsappLink ?? undefined}
            target="_blank"
            rel="noopener noreferrer"
            disabled={!whatsappLink}
          >
            Abrir WhatsApp
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
