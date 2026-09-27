import { Typography } from "@mui/material";
import type { RankingDisplayItem } from "../reports.types";

interface RankingRowProps {
  item: RankingDisplayItem;
}

export default function RankingRow({
  item,
}: RankingRowProps) {
  return (
    <div className="ranking-row">
      <div className="ranking-row__position">
        {item.position}
      </div>

      <div className="ranking-row__content">
        <Typography className="ranking-row__title">
          {item.title}
        </Typography>
        <Typography className="ranking-row__subtitle">
          {item.subtitle}
        </Typography>
      </div>

      <Typography className="ranking-row__value">
        {item.value}
      </Typography>
    </div>
  );
}
