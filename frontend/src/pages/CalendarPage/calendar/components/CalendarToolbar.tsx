import ChevronLeftOutlined from "@mui/icons-material/ChevronLeftOutlined";
import ChevronRightOutlined from "@mui/icons-material/ChevronRightOutlined";
import { IconButton, Typography } from "@mui/material";
import type { Dayjs } from "dayjs";

interface CalendarToolbarProps {
  currentMonth: Dayjs;
  onPreviousMonth: () => void;
  onNextMonth: () => void;
}

export default function CalendarToolbar({
  currentMonth,
  onPreviousMonth,
  onNextMonth,
}: CalendarToolbarProps) {
  return (
    <div className="calendar-toolbar">
      <IconButton onClick={onPreviousMonth} aria-label="Mes anterior">
        <ChevronLeftOutlined />
      </IconButton>

      <Typography className="calendar-toolbar__month">
        {currentMonth.format("MMMM YYYY")}
      </Typography>

      <IconButton onClick={onNextMonth} aria-label="Mes siguiente">
        <ChevronRightOutlined />
      </IconButton>
    </div>
  );
}
