import CalendarMonthOutlined from "@mui/icons-material/CalendarMonthOutlined";
import { Button, Chip, Typography } from "@mui/material";
import dayjs from "dayjs";
import "dayjs/locale/es";
import type { DashboardUpcomingBooking } from "../dashboard.types";
import {
  formatBookingStatus,
  formatCurrency,
  getBookingStatusClass,
} from "../dashboard.utils";

dayjs.locale("es");

interface UpcomingBookingsProps {
  bookings: DashboardUpcomingBooking[];
  onOpenCalendar: () => void;
  onOpenBookings: () => void;
}

export default function UpcomingBookings({
  bookings,
  onOpenCalendar,
  onOpenBookings,
}: UpcomingBookingsProps) {
  return (
    <section className="dashboard-panel dashboard-panel--upcoming">
      <div className="dashboard-panel__header">
        <div>
          <Typography className="dashboard-panel__title">
            Próximos eventos
          </Typography>
          <Typography className="dashboard-panel__subtitle">
            Las siguientes reservaciones programadas.
          </Typography>
        </div>

        <Button size="small" onClick={onOpenCalendar}>
          Ver calendario
        </Button>
      </div>

      {bookings.length === 0 ? (
        <div className="upcoming-empty">
          <CalendarMonthOutlined className="upcoming-empty__icon" />
          <Typography className="upcoming-empty__title">
            No hay próximos eventos
          </Typography>
        </div>
      ) : (
        <div className="upcoming-list">
          {bookings.map((booking) => (
            <article
              key={booking.id}
              className="upcoming-item"
              onClick={onOpenBookings}
            >
              <div className="upcoming-item__date">
                <Typography className="upcoming-item__day">
                  {dayjs(booking.starts_at).format("DD")}
                </Typography>
                <Typography className="upcoming-item__month">
                  {dayjs(booking.starts_at).format("MMM")}
                </Typography>
              </div>

              <div className="upcoming-item__content">
                <div className="upcoming-item__title-row">
                  <Typography className="upcoming-item__title">
                    {booking.event_type}
                  </Typography>

                  <Chip
                    size="small"
                    label={formatBookingStatus(booking.status)}
                    className={getBookingStatusClass(booking.status)}
                  />
                </div>

                <Typography className="upcoming-item__client">
                  {booking.client_name}
                </Typography>

                <Typography className="upcoming-item__meta">
                  {booking.package_name} ·{" "}
                  {dayjs(booking.starts_at).format("h:mm A")}
                </Typography>
              </div>

              {Number(booking.balance) > 0 && (
                <Typography className="upcoming-item__balance">
                  Pendiente {formatCurrency(booking.balance)}
                </Typography>
              )}
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
