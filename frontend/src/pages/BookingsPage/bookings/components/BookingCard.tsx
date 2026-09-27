import GroupsOutlined from "@mui/icons-material/GroupsOutlined";
import ScheduleOutlined from "@mui/icons-material/ScheduleOutlined";
import VisibilityOutlined from "@mui/icons-material/VisibilityOutlined";
import { Button, Card, CardContent, Chip, Divider, Typography } from "@mui/material";
import dayjs from "dayjs";
import "dayjs/locale/es";
import type { BookingListItem } from "../bookings.types";
import { formatCurrency, getBookingStatusView } from "../bookings.utils";

dayjs.locale("es");

interface BookingCardProps {
  booking: BookingListItem;
  onViewDetail: () => void;
}

export default function BookingCard({ booking, onViewDetail }: BookingCardProps) {
  const status = getBookingStatusView(booking.status);
  const hasBalance = Number(booking.balance) > 0;

  return (
    <Card className="booking-card">
      <CardContent className="booking-card__content">
        <div className="booking-card__layout">
          <div className="booking-card__event">
            <div className="booking-card__date">
              <Typography className="booking-card__date-day">
                {dayjs(booking.starts_at).format("DD")}
              </Typography>
              <Typography className="booking-card__date-month">
                {dayjs(booking.starts_at).format("MMM")}
              </Typography>
            </div>

            <div className="booking-card__details">
              <div className="booking-card__title-row">
                <Typography className="booking-card__event-title">
                  {booking.event_type}
                </Typography>
                <Chip label={status.label} size="small" className={status.className} />
              </div>

              <Typography className="booking-card__client">
                {booking.client.full_name}
              </Typography>

              <div className="booking-card__metadata">
                <div className="booking-card__metadata-item">
                  <ScheduleOutlined />
                  <Typography>
                    {dayjs(booking.starts_at).format("h:mm A")} -{" "}
                    {dayjs(booking.ends_at).format("h:mm A")}
                  </Typography>
                </div>

                <div className="booking-card__metadata-item">
                  <GroupsOutlined />
                  <Typography>
                    {booking.guest_count
                      ? `${booking.guest_count} personas`
                      : "Personas sin definir"}
                  </Typography>
                </div>
              </div>

              <Typography className="booking-card__reference">
                {booking.package_name_snapshot} · {booking.folio}
              </Typography>
            </div>
          </div>

          <div className="booking-card__finance">
            <FinanceRow
              label="Total"
              value={formatCurrency(booking.final_price)}
              valueClassName="booking-card__finance-value--strong"
            />

            <FinanceRow
              label="Pagado"
              value={formatCurrency(booking.total_paid)}
              valueClassName="booking-card__finance-value--paid"
            />

            <Divider className="booking-card__divider" />

            <FinanceRow
              label="Pendiente"
              value={formatCurrency(booking.balance)}
              valueClassName={
                hasBalance
                  ? "booking-card__finance-value--pending"
                  : "booking-card__finance-value--paid"
              }
            />

            <Button
              variant="outlined"
              size="small"
              fullWidth
              startIcon={<VisibilityOutlined />}
              onClick={onViewDetail}
              className="booking-card__detail-button"
            >
              Ver detalle
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

interface FinanceRowProps {
  label: string;
  value: string;
  valueClassName?: string;
}

function FinanceRow({ label, value, valueClassName = "" }: FinanceRowProps) {
  return (
    <div className="booking-card__finance-row">
      <Typography className="booking-card__finance-label">{label}</Typography>
      <Typography className={`booking-card__finance-value ${valueClassName}`.trim()}>
        {value}
      </Typography>
    </div>
  );
}
