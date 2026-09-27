import { Typography } from "@mui/material";
import type { BookingStatusReportItem } from "../reports.types";
import EmptyReportMessage from "./EmptyReportMessage";
import ReportListCard from "./ReportListCard";

interface BookingStatusesProps {
  statuses: BookingStatusReportItem[];
}

export default function BookingStatuses({
  statuses,
}: BookingStatusesProps) {
  return (
    <ReportListCard
      title="Estado de reservaciones"
      subtitle="Distribución anual por estado."
    >
      {statuses.length === 0 ? (
        <EmptyReportMessage />
      ) : (
        <div className="booking-status-list">
          {statuses.map((item) => (
            <div key={item.status} className="booking-status-row">
              <Typography className="booking-status-row__label">
                {item.status}
              </Typography>
              <Typography className="booking-status-row__value">
                {item.count}
              </Typography>
            </div>
          ))}
        </div>
      )}
    </ReportListCard>
  );
}
