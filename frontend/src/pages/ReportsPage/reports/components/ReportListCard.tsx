import type { ReactNode } from "react";
import { Typography } from "@mui/material";

interface ReportListCardProps {
  title: string;
  subtitle: string;
  children: ReactNode;
}

export default function ReportListCard({
  title,
  subtitle,
  children,
}: ReportListCardProps) {
  return (
    <article className="reports-panel">
      <Typography className="reports-panel__title">
        {title}
      </Typography>
      <Typography className="reports-panel__subtitle reports-panel__subtitle--spaced">
        {subtitle}
      </Typography>
      {children}
    </article>
  );
}
