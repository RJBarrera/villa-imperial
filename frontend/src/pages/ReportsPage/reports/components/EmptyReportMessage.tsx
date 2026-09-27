import CalendarMonthOutlined from "@mui/icons-material/CalendarMonthOutlined";
import { Typography } from "@mui/material";

export default function EmptyReportMessage() {
  return (
    <div className="reports-empty">
      <CalendarMonthOutlined className="reports-empty__icon" />
      <Typography className="reports-empty__text">
        No existen datos para este periodo.
      </Typography>
    </div>
  );
}
